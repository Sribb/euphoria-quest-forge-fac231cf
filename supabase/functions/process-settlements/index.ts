import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const today = new Date().toISOString().split('T')[0];

    // Get all pending settlements due today or earlier
    const { data: settlements, error: fetchError } = await supabaseClient
      .from('settlements')
      .select('*')
      .eq('status', 'pending')
      .lte('settlement_date', today);

    if (fetchError) {
      throw fetchError;
    }

    if (!settlements || settlements.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No settlements to process', count: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let processedCount = 0;
    const errors = [];

    for (const settlement of settlements) {
      try {
        // Get portfolio
        const { data: portfolio, error: portfolioError } = await supabaseClient
          .from('portfolios')
          .select('*')
          .eq('id', settlement.portfolio_id)
          .single();

        if (portfolioError) {
          errors.push({ settlementId: settlement.id, error: portfolioError.message });
          continue;
        }

        // Move funds from unsettled to cash balance
        const newCashBalance = Number(portfolio.cash_balance) + Number(settlement.amount);
        const newUnsettledCash = Number(portfolio.unsettled_cash || 0) - Number(settlement.amount);

        await supabaseClient
          .from('portfolios')
          .update({
            cash_balance: newCashBalance,
            unsettled_cash: Math.max(0, newUnsettledCash),
            updated_at: new Date().toISOString(),
          })
          .eq('id', settlement.portfolio_id);

        // Update settlement status
        await supabaseClient
          .from('settlements')
          .update({
            status: 'settled',
            settled_at: new Date().toISOString(),
          })
          .eq('id', settlement.id);

        // Log transaction
        await supabaseClient
          .from('transaction_logs')
          .insert({
            user_id: settlement.user_id,
            portfolio_id: settlement.portfolio_id,
            order_id: settlement.order_id,
            transaction_type: 'SETTLEMENT',
            amount: settlement.amount,
            balance_before: portfolio.cash_balance,
            balance_after: newCashBalance,
            description: `T+2 Settlement: $${Number(settlement.amount).toFixed(2)} settled to cash`,
          });

        processedCount++;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        errors.push({ settlementId: settlement.id, error: errorMessage });
      }
    }

    return new Response(
      JSON.stringify({
        message: 'Settlements processed',
        processedCount,
        totalSettlements: settlements.length,
        errors: errors.length > 0 ? errors : undefined,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error processing settlements:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

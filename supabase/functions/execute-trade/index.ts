import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.74.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface OrderInput {
  symbol: string;
  side: 'buy' | 'sell';
  orderType: 'market' | 'limit' | 'stop' | 'stop_limit';
  quantity: number;
  price?: number;
  stopPrice?: number;
  currentPrice: number;
  portfolioId: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const orderInput: OrderInput = await req.json();

    // Validate input
    if (!orderInput.symbol || !orderInput.side || !orderInput.orderType || !orderInput.quantity) {
      throw new Error('Missing required fields');
    }

    if (orderInput.quantity <= 0) {
      throw new Error('Quantity must be positive');
    }

    if (!/^[A-Z]{1,5}$/.test(orderInput.symbol)) {
      throw new Error('Invalid symbol format');
    }

    // Get portfolio
    const { data: portfolio, error: portfolioError } = await supabase
      .from('portfolios')
      .select('*')
      .eq('id', orderInput.portfolioId)
      .eq('user_id', user.id)
      .single();

    if (portfolioError || !portfolio) {
      throw new Error('Portfolio not found');
    }

    // Get current holdings if selling
    let holdingQuantity = 0;
    if (orderInput.side === 'sell') {
      const { data: holding } = await supabase
        .from('portfolio_assets')
        .select('quantity')
        .eq('portfolio_id', portfolio.id)
        .eq('asset_name', orderInput.symbol)
        .single();

      holdingQuantity = holding ? Number(holding.quantity) : 0;
    }

    // Server-side validation
    const estimatedPrice = orderInput.orderType === 'market' 
      ? orderInput.currentPrice 
      : orderInput.price || orderInput.currentPrice;
    
    const totalCost = estimatedPrice * orderInput.quantity;
    const commission = 0; // Free trades

    if (orderInput.side === 'buy' && totalCost > Number(portfolio.cash_balance)) {
      throw new Error('Insufficient buying power');
    }

    if (orderInput.side === 'sell' && orderInput.quantity > holdingQuantity) {
      throw new Error('Insufficient shares to sell');
    }

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        portfolio_id: portfolio.id,
        symbol: orderInput.symbol,
        side: orderInput.side,
        order_type: orderInput.orderType,
        quantity: orderInput.quantity,
        price: orderInput.price,
        stop_price: orderInput.stopPrice,
        status: orderInput.orderType === 'market' ? 'filled' : 'new',
        commission: commission,
      })
      .select()
      .single();

    if (orderError) {
      console.error('Order creation error:', orderError);
      throw new Error('Failed to create order');
    }

    // For market orders, execute immediately
    if (orderInput.orderType === 'market') {
      // Server-side slippage calculation
      const slippage = (Math.random() * 0.002 - 0.001) * estimatedPrice;
      const fillPrice = estimatedPrice + slippage;
      const actualCost = fillPrice * orderInput.quantity;

      // Update order status
      await supabase
        .from('orders')
        .update({
          status: 'filled',
          filled_quantity: orderInput.quantity,
          average_fill_price: fillPrice,
          filled_at: new Date().toISOString(),
        })
        .eq('id', order.id);

      if (orderInput.side === 'buy') {
        // Update or create portfolio asset
        const { data: existingAsset } = await supabase
          .from('portfolio_assets')
          .select('*')
          .eq('portfolio_id', portfolio.id)
          .eq('asset_name', orderInput.symbol)
          .single();

        if (existingAsset) {
          const newQuantity = Number(existingAsset.quantity) + orderInput.quantity;
          const newAvgPrice = (Number(existingAsset.purchase_price) * Number(existingAsset.quantity) + actualCost) / newQuantity;
          
          await supabase
            .from('portfolio_assets')
            .update({
              quantity: newQuantity,
              purchase_price: newAvgPrice,
              current_price: fillPrice,
            })
            .eq('id', existingAsset.id);
        } else {
          await supabase
            .from('portfolio_assets')
            .insert({
              portfolio_id: portfolio.id,
              asset_name: orderInput.symbol,
              asset_type: 'stock',
              quantity: orderInput.quantity,
              purchase_price: fillPrice,
              current_price: fillPrice,
            });
        }

        // Update portfolio cash
        await supabase
          .from('portfolios')
          .update({
            cash_balance: Number(portfolio.cash_balance) - actualCost,
          })
          .eq('id', portfolio.id);
      } else {
        // Sell order
        const { data: asset } = await supabase
          .from('portfolio_assets')
          .select('*')
          .eq('portfolio_id', portfolio.id)
          .eq('asset_name', orderInput.symbol)
          .single();

        const newQuantity = Number(asset.quantity) - orderInput.quantity;
        if (newQuantity <= 0) {
          await supabase
            .from('portfolio_assets')
            .delete()
            .eq('id', asset.id);
        } else {
          await supabase
            .from('portfolio_assets')
            .update({ quantity: newQuantity, current_price: fillPrice })
            .eq('id', asset.id);
        }

        // Create settlement for T+2
        const settlementDate = new Date();
        settlementDate.setDate(settlementDate.getDate() + 2);
        if (settlementDate.getDay() === 0) settlementDate.setDate(settlementDate.getDate() + 1);
        if (settlementDate.getDay() === 6) settlementDate.setDate(settlementDate.getDate() + 2);

        await supabase
          .from('settlements')
          .insert({
            user_id: user.id,
            portfolio_id: portfolio.id,
            order_id: order.id,
            amount: actualCost,
            settlement_date: settlementDate.toISOString().split('T')[0],
            status: 'pending',
          });

        await supabase
          .from('portfolios')
          .update({
            unsettled_cash: Number(portfolio.unsettled_cash || 0) + actualCost,
          })
          .eq('id', portfolio.id);
      }

      // Log transaction
      await supabase
        .from('transaction_logs')
        .insert({
          user_id: user.id,
          portfolio_id: portfolio.id,
          order_id: order.id,
          transaction_type: orderInput.side,
          symbol: orderInput.symbol,
          quantity: orderInput.quantity,
          price: fillPrice,
          amount: actualCost,
          fee: commission,
          balance_before: Number(portfolio.cash_balance),
          balance_after: orderInput.side === 'buy' 
            ? Number(portfolio.cash_balance) - actualCost
            : Number(portfolio.cash_balance),
          description: `${orderInput.side === 'buy' ? 'Bought' : 'Sold'} ${orderInput.quantity} shares of ${orderInput.symbol} at $${fillPrice.toFixed(2)}`,
        });
    }

    return new Response(
      JSON.stringify({ success: true, order }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Execute trade error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

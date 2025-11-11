import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.74.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    const { sessionId, count = 5 } = await req.json();
    console.log('Generating scenarios for session:', sessionId);

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY not configured');

    // Get current market state
    const { data: session } = await supabase
      .from('ai_market_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (!session) throw new Error('Session not found');

    const { data: prices } = await supabase
      .from('ai_stock_prices')
      .select('*')
      .eq('session_id', sessionId);

    if (!prices || prices.length === 0) {
      throw new Error('No stock prices found for session. Please initialize the market first.');
    }

    const availableSymbols = prices.map((p: any) => p.symbol);

    // Generate realistic scenarios using AI
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [{
          role: 'system',
          content: `Generate ${count} realistic, diverse market scenarios for a trading simulator.
Current market: ${session.market_trend} trend, ${session.market_volatility} volatility
AVAILABLE STOCKS (ONLY USE THESE): ${availableSymbols.join(', ')}

CRITICAL: Only use symbols from the available stocks list above. Do not use any other symbols.

Create scenarios like:
- Market rallies (sudden price increases)
- Market dips (corrections or crashes)
- Sideways markets (consolidation)
- Sector surges (specific industry booms)
- Geopolitical events (news-driven volatility)

Each scenario should be unique, realistic, and educational.`
        }],
        tools: [{
          type: "function",
          function: {
            name: "generate_scenarios",
            parameters: {
              type: "object",
              properties: {
                scenarios: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: { type: "string" },
                      title: { type: "string" },
                      description: { type: "string" },
                      type: { type: "string", enum: ["rally", "dip", "sideways", "sector_surge", "geopolitical"] },
                      severity: { type: "string", enum: ["low", "medium", "high"] },
                      probability: { type: "number" },
                      volatility: { type: "number" },
                      duration_minutes: { type: "number" },
                      affected_symbols: { type: "array", items: { type: "string" } },
                      market_triggers: { type: "array", items: { type: "string" } },
                      expected_movement: {
                        type: "object",
                        properties: {
                          direction: { type: "string" },
                          magnitude: { type: "number" }
                        }
                      }
                    },
                    required: ["id", "title", "description", "type", "severity", "probability", "volatility", "affected_symbols"]
                  }
                }
              },
              required: ["scenarios"]
            }
          }
        }],
        tool_choice: { type: "function", function: { name: "generate_scenarios" } }
      })
    });

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices[0]?.message?.tool_calls?.[0];
    const result = toolCall ? JSON.parse(toolCall.function.arguments) : { scenarios: [] };

    return new Response(
      JSON.stringify({ scenarios: result.scenarios }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error generating scenarios:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
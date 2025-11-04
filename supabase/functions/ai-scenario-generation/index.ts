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
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { sessionId, proposedAction, timeHorizon = 60 } = await req.json();
    console.log('Generating scenarios for:', proposedAction);

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Get current market state
    const { data: session } = await supabase
      .from('ai_market_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    const { data: prices } = await supabase
      .from('ai_stock_prices')
      .select('*')
      .eq('session_id', sessionId);

    const { data: events } = await supabase
      .from('ai_market_events')
      .select('*')
      .eq('session_id', sessionId)
      .eq('is_active', true);

    const { data: competitors } = await supabase
      .from('ai_competitors')
      .select('*')
      .eq('session_id', sessionId);

    // Generate alternative scenarios using AI
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
          content: `You are an expert market analyst generating alternative scenarios with professional formatting.

CRITICAL FORMATTING REQUIREMENTS:
- Use proper grammar, punctuation, and capitalization in all text
- Write clear, complete sentences in descriptions
- Format numbers appropriately (e.g., +15.3%, -$234.50)
- Use professional financial terminology correctly
- Structure all content for clarity and readability

Generate 3-5 alternative market scenarios for the next ${timeHorizon} minutes.

Current market state:
- Trend: ${session.market_trend}
- Volatility: ${session.market_volatility}
- Active events: ${events?.length || 0}
- Prices: ${JSON.stringify(prices?.slice(0, 5))}

Proposed action: ${JSON.stringify(proposedAction)}

For each scenario, provide:
1. What happens to the market (clear, specific description)
2. How competitors react (professional assessment)
3. The outcome of the user's action (well-articulated result)
4. Probability of this scenario (realistic percentage)
5. Alternative actions the user could take (actionable suggestions with proper grammar)`
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
                      title: { type: "string" },
                      description: { type: "string" },
                      probability: { type: "number" },
                      market_changes: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            symbol: { type: "string" },
                            price_change_percent: { type: "number" }
                          }
                        }
                      },
                      competitor_actions: {
                        type: "array",
                        items: { type: "string" }
                      },
                      user_outcome: {
                        type: "object",
                        properties: {
                          profit_loss: { type: "number" },
                          description: { type: "string" }
                        }
                      },
                      alternative_actions: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            action: { type: "string" },
                            expected_result: { type: "string" }
                          }
                        }
                      }
                    },
                    required: [
                      "title",
                      "description",
                      "probability",
                      "market_changes",
                      "competitor_actions",
                      "user_outcome",
                      "alternative_actions"
                    ]
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

    // Calculate probability distribution
    const totalProb = result.scenarios.reduce((sum: number, s: any) => sum + s.probability, 0);
    const probabilityDistribution: Record<string, number> = {};
    result.scenarios.forEach((s: any, i: number) => {
      probabilityDistribution[`scenario_${i + 1}`] = (s.probability / totalProb) * 100;
    });

    // Store scenarios in database
    const { data: savedScenario, error: saveError } = await supabase
      .from('ai_scenario_predictions')
      .insert({
        session_id: sessionId,
        user_id: user.id,
        scenario_type: 'alternative',
        title: 'Alternative Market Scenarios',
        description: `Generated ${result.scenarios.length} possible outcomes`,
        proposed_action: proposedAction,
        predicted_outcomes: result.scenarios,
        probability_distribution: probabilityDistribution,
        time_horizon_minutes: timeHorizon,
        confidence_score: result.scenarios.reduce((sum: number, s: any) => sum + s.probability, 0) / result.scenarios.length
      })
      .select()
      .single();

    if (saveError) {
      console.error('Error saving scenarios:', saveError);
    }

    return new Response(
      JSON.stringify({
        scenarios: result.scenarios,
        probabilityDistribution,
        marketContext: {
          trend: session.market_trend,
          volatility: session.market_volatility,
          activeEvents: events?.length || 0,
          competitorCount: competitors?.length || 0
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Scenario generation error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
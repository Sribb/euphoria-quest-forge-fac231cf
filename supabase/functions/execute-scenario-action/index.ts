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

    const { sessionId, userId, scenarioId, action } = await req.json();
    console.log('Executing action:', action.type, 'for scenario:', scenarioId);

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY not configured');

    // Get market state
    const { data: session } = await supabase
      .from('ai_market_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (!session) {
      throw new Error('Market session not found');
    }

    const { data: price } = await supabase
      .from('ai_stock_prices')
      .select('*')
      .eq('session_id', sessionId)
      .eq('symbol', action.symbol)
      .single();

    if (!price) {
      throw new Error(`Stock price data not found for symbol: ${action.symbol}`);
    }

    const { data: portfolio } = await supabase
      .from('portfolios')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (!portfolio) {
      throw new Error('User portfolio not found');
    }

    // Simulate outcome using AI
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
          content: `Simulate the outcome of this trading decision:
Action: ${action.type}
Symbol: ${action.symbol}
Quantity: ${action.quantity}
Stop Loss: ${action.stopLoss}%
Current Price: $${price.current_price}
Market Trend: ${session.market_trend}
Volatility: ${session.market_volatility}
User Buying Power: $${portfolio.buying_power}

Simulate:
1. Price movement during trade
2. Entry and exit prices
3. Profit/loss calculation
4. Market impact
5. Competitor reactions
6. Success probability

Be realistic and educational.`
        }],
        tools: [{
          type: "function",
          function: {
            name: "simulate_outcome",
            parameters: {
              type: "object",
              properties: {
                result_summary: { type: "string" },
                profit_loss: { type: "number" },
                entry_price: { type: "number" },
                exit_price: { type: "number" },
                duration_minutes: { type: "number" },
                initial_investment: { type: "number" },
                success_probability: { type: "number" },
                market_impact: { type: "number" },
                volatility_change: { type: "number" },
                sentiment_shift: { type: "number" },
                price_history: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      time: { type: "string" },
                      price: { type: "number" }
                    }
                  }
                },
                competitor_reactions: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      competitor: { type: "string" },
                      action: { type: "string" },
                      reasoning: { type: "string" }
                    }
                  }
                }
              },
              required: ["result_summary", "profit_loss", "entry_price", "exit_price", "success_probability"]
            }
          }
        }],
        tool_choice: { type: "function", function: { name: "simulate_outcome" } }
      })
    });

    const outcomeData = await aiResponse.json();
    const outcomeCall = outcomeData.choices[0]?.message?.tool_calls?.[0];
    const outcome = outcomeCall ? JSON.parse(outcomeCall.function.arguments) : null;

    // Generate feedback using AI
    const feedbackResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [{
          role: 'system',
          content: `Provide educational feedback on this trading decision:
Action: ${action.type}
Outcome: ${outcome.profit_loss > 0 ? 'Profitable' : 'Loss'}
P&L: $${outcome.profit_loss}

Evaluate:
1. Decision quality score (0-100)
2. Strategy alignment (aggressive/moderate/conservative)
3. Risk management
4. Timing analysis
5. Execution quality
6. Key insights for improvement
7. Specific recommendations

Be encouraging but honest. Focus on learning.`
        }],
        tools: [{
          type: "function",
          function: {
            name: "generate_feedback",
            parameters: {
              type: "object",
              properties: {
                quality_score: { type: "number" },
                feedback_summary: { type: "string" },
                strategy_alignment: { type: "string", enum: ["aggressive", "moderate", "conservative"] },
                strategy_explanation: { type: "string" },
                risk_score: { type: "number" },
                timing_score: { type: "number" },
                execution_score: { type: "number" },
                insights: { type: "array", items: { type: "string" } },
                recommendations: { type: "array", items: { type: "string" } },
                performance_history: {
                  type: "object",
                  properties: {
                    total_decisions: { type: "number" },
                    win_rate: { type: "number" },
                    avg_quality: { type: "number" },
                    total_profit: { type: "number" }
                  }
                }
              },
              required: ["quality_score", "feedback_summary", "strategy_alignment", "insights", "recommendations"]
            }
          }
        }],
        tool_choice: { type: "function", function: { name: "generate_feedback" } }
      })
    });

    const feedbackData = await feedbackResponse.json();
    const feedbackCall = feedbackData.choices[0]?.message?.tool_calls?.[0];
    const feedback = feedbackCall ? JSON.parse(feedbackCall.function.arguments) : null;

    // Store trade analysis
    await supabase.from('ai_trade_analysis').insert({
      session_id: sessionId,
      user_id: userId,
      trade_type: action.type,
      symbol: action.symbol,
      quantity: action.quantity,
      proposed_price: outcome.entry_price,
      analysis_type: 'scenario_simulation',
      impact_prediction: {
        profit_loss: outcome.profit_loss,
        market_impact: outcome.market_impact,
        competitor_reactions: outcome.competitor_reactions
      },
      risk_assessment: {
        overall_risk: feedback.strategy_alignment,
        risk_score: feedback.risk_score
      },
      opportunity_score: feedback.quality_score / 100,
      ai_recommendation: feedback.feedback_summary,
      reasoning: feedback.strategy_explanation,
      alternative_strategies: []
    });

    return new Response(
      JSON.stringify({ outcome, feedback }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error executing action:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
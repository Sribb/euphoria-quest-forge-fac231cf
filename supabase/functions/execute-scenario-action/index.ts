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

    // Get all available stock prices for this session
    const { data: availablePrices } = await supabase
      .from('ai_stock_prices')
      .select('*')
      .eq('session_id', sessionId);

    if (!availablePrices || availablePrices.length === 0) {
      throw new Error('No stock prices available. Please initialize the AI Market first.');
    }

    // Try to find the specific symbol, fallback to first available if not found
    let price = availablePrices.find((p: any) => p.symbol === action.symbol);
    
    if (!price) {
      console.warn(`Symbol ${action.symbol} not found, using fallback: ${availablePrices[0].symbol}`);
      price = availablePrices[0];
      // Update action to use the fallback symbol
      action.symbol = price.symbol;
    }

    const { data: portfolio } = await supabase
      .from('portfolios')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (!portfolio) {
      throw new Error('User portfolio not found');
    }

    // Strategy-specific parameters based on action type
    let strategyContext = '';
    switch(action.type) {
      case 'buy':
        strategyContext = 'Long position - profit from price increase. Calculate realistic upside potential based on market conditions.';
        break;
      case 'sell':
        strategyContext = 'Short position - profit from price decline. Simulate borrowing costs and margin requirements. Position size multiplied by directional price movement.';
        break;
      case 'hold':
        strategyContext = 'Neutral position - maintain capital. Show opportunity cost vs active positions. No trades executed but track market fluctuations.';
        break;
      case 'hedge':
        strategyContext = 'Defensive strategy - use inverse ETFs or options simulation. Calculate hedge effectiveness proportional to volatility. Reduce portfolio risk while adjusting for partial gains/losses.';
        break;
      case 'leverage':
        strategyContext = `Leveraged position at ${action.leverage || 1}x - amplify exposure by multiplying position size. Apply magnified market swings while enforcing realistic risk caps to prevent negative balance.`;
        break;
      case 'auto':
        strategyContext = 'AI autonomous mode - interpret market trends, sentiment, and volatility to execute optimal Buy/Sell/Hedge/Leverage as if human trader acted. Fully synchronized portfolio updates.';
        break;
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
          content: `Simulate a realistic 60-minute trading session with 5-minute intervals for this action:

Action: ${action.type}
Symbol: ${action.symbol}
Quantity: ${action.quantity}
Stop Loss: ${action.stopLoss}%
Leverage: ${action.leverage || 1}x
Current Price: $${price.current_price}
Market Trend: ${session.market_trend}
Volatility: ${session.market_volatility}
User Buying Power: $${portfolio.buying_power}

Strategy Context: ${strategyContext}

Simulate realistic outcomes:
1. Entry price with small spread from current
2. Time-based price movements (randomized but realistic ranges)
3. Exit price based on strategy and market conditions
4. Precise P/L calculation accounting for leverage, direction, fees
5. Market impact and sentiment shifts
6. Competitor reactions to the trade
7. Success probability and risk assessment
8. Price history showing 12 data points (5-min intervals)

For HOLD actions: entry_price = exit_price, profit_loss = 0, but show opportunity_cost
For SHORT (sell): profit when price decreases, loss when increases
For HEDGE: reduce risk, partial gains/losses based on volatility
For LEVERAGE: multiply position size and P/L by leverage multiplier
For AUTO: choose optimal strategy and execute as if human trader

Be realistic, educational, and ensure numbers are internally consistent.`
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
                },
                opportunity_cost: { type: "number" },
                hedge_effectiveness: { type: "number" },
                auto_strategy_chosen: { type: "string" }
              },
              required: ["result_summary", "profit_loss", "entry_price", "exit_price", "success_probability", "price_history"]
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
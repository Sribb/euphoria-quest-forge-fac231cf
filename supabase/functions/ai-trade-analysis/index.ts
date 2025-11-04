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

    const { sessionId, symbol, quantity, side, proposedPrice } = await req.json();
    console.log('Analyzing trade:', { symbol, quantity, side });

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Get market context
    const { data: session } = await supabase
      .from('ai_market_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    const { data: price } = await supabase
      .from('ai_stock_prices')
      .select('*')
      .eq('session_id', sessionId)
      .eq('symbol', symbol)
      .single();

    const { data: competitors } = await supabase
      .from('ai_competitors')
      .select('*')
      .eq('session_id', sessionId);

    const { data: portfolio } = await supabase
      .from('portfolios')
      .select('*')
      .eq('user_id', user.id)
      .single();

    // AI-powered trade analysis
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
          content: `You are an expert trading coach providing predictive analysis with professional formatting.

CRITICAL FORMATTING REQUIREMENTS:
- Use proper grammar, punctuation, and capitalization throughout
- Structure all text clearly with complete sentences
- Present numerical data with appropriate formatting (e.g., $1,234.56, 12.5%)
- Use professional financial terminology correctly
- Ensure all field values are grammatically correct and well-structured

Analyze this trade:
- Action: ${side} ${quantity} shares of ${symbol}
- Proposed price: $${proposedPrice}
- Current price: $${price.current_price}
- Market trend: ${session.market_trend}
- Volatility: ${session.market_volatility}
- User's buying power: $${portfolio.buying_power}

Provide detailed coaching on:
1. Market impact prediction (clear, specific analysis)
2. Competitor reactions (professional assessment)
3. Risk assessment (comprehensive evaluation)
4. Opportunity score (data-driven rating)
5. Alternative strategies (well-articulated options)
6. Step-by-step reasoning (logical, clear explanation)`
        }],
        tools: [{
          type: "function",
          function: {
            name: "analyze_trade",
            parameters: {
              type: "object",
              properties: {
                impact_prediction: {
                  type: "object",
                  properties: {
                    immediate_price_impact: { type: "number" },
                    volume_impact: { type: "number" },
                    competitor_reactions: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          competitor: { type: "string" },
                          likely_action: { type: "string" },
                          confidence: { type: "number" }
                        }
                      }
                    }
                  }
                },
                risk_assessment: {
                  type: "object",
                  properties: {
                    overall_risk: { type: "string", enum: ["low", "medium", "high", "very_high"] },
                    specific_risks: { type: "array", items: { type: "string" } },
                    risk_score: { type: "number" }
                  }
                },
                opportunity_score: { type: "number" },
                ai_recommendation: { type: "string" },
                reasoning: { type: "string" },
                alternative_strategies: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      strategy: { type: "string" },
                      description: { type: "string" },
                      expected_outcome: { type: "string" }
                    }
                  }
                }
              },
              required: [
                "impact_prediction",
                "risk_assessment",
                "opportunity_score",
                "ai_recommendation",
                "reasoning",
                "alternative_strategies"
              ]
            }
          }
        }],
        tool_choice: { type: "function", function: { name: "analyze_trade" } }
      })
    });

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices[0]?.message?.tool_calls?.[0];
    const analysis = toolCall ? JSON.parse(toolCall.function.arguments) : null;

    if (!analysis) {
      throw new Error('Failed to generate trade analysis');
    }

    // Store analysis in database
    const { data: savedAnalysis, error: saveError } = await supabase
      .from('ai_trade_analysis')
      .insert({
        session_id: sessionId,
        user_id: user.id,
        trade_type: side,
        symbol,
        quantity,
        proposed_price: proposedPrice,
        analysis_type: 'pre_trade',
        impact_prediction: analysis.impact_prediction,
        risk_assessment: analysis.risk_assessment,
        opportunity_score: analysis.opportunity_score,
        ai_recommendation: analysis.ai_recommendation,
        reasoning: analysis.reasoning,
        alternative_strategies: analysis.alternative_strategies
      })
      .select()
      .single();

    if (saveError) {
      console.error('Error saving analysis:', saveError);
    }

    return new Response(
      JSON.stringify({
        analysis,
        marketContext: {
          currentPrice: price.current_price,
          sentiment: price.ai_sentiment,
          momentum: price.price_momentum,
          competitors: competitors?.length || 0
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Trade analysis error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
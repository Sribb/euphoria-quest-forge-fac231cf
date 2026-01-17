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

    const { action, sessionId, symbol, quantity, side } = await req.json();
    console.log('Market engine action:', action);

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    switch (action) {
      case 'initialize':
        return await initializeSession(supabase, user.id);
      
      case 'update_prices':
        return await updateMarketPrices(supabase, sessionId, LOVABLE_API_KEY);
      
      case 'simulate_trade_impact':
        return await simulateTradeImpact(supabase, sessionId, symbol, quantity, side, LOVABLE_API_KEY);
      
      case 'trigger_event':
        return await triggerMarketEvent(supabase, sessionId, LOVABLE_API_KEY);
      
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  } catch (error) {
    console.error('Market engine error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

async function initializeSession(supabase: any, userId: string) {
  // Create service role client for system-level operations
  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  console.log('Initializing AI Market session for user:', userId);
  
  // Check if user has an active session
  const { data: existingSession } = await supabaseAdmin
    .from('ai_market_sessions')
    .select('*')
    .eq('user_id', userId)
    .eq('session_status', 'active')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  let session = existingSession;

  // Create new session if none exists
  if (!existingSession) {
    const sessionSeed = Math.random().toString(36).substring(7);
    
    const { data: newSession, error: sessionError } = await supabaseAdmin
      .from('ai_market_sessions')
      .insert({
        user_id: userId,
        session_seed: sessionSeed,
        market_volatility: Math.random() * 0.5 + 0.25,
        market_trend: ['bullish', 'bearish', 'neutral'][Math.floor(Math.random() * 3)]
      })
      .select()
      .single();

    if (sessionError) {
      console.error('Failed to create session:', sessionError);
      throw sessionError;
    }

    session = newSession;
    console.log('New session created:', session.id);
  } else {
    console.log('Using existing session:', session.id);
  }

  // Check if session has stock prices
  const { data: existingPrices, error: pricesCheckError } = await supabaseAdmin
    .from('ai_stock_prices')
    .select('id')
    .eq('session_id', session.id)
    .limit(1);

  if (pricesCheckError) {
    console.error('Failed to check existing prices:', pricesCheckError);
    throw pricesCheckError;
  }

  // Only seed prices if none exist
  if (!existingPrices || existingPrices.length === 0) {
    console.log('Seeding stock prices for session:', session.id);

    // Initialize stock prices for this session
    const symbols = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'NVDA', 'JPM', 'V'];
    const basePrices: Record<string, number> = {
      'AAPL': 180, 'GOOGL': 140, 'MSFT': 380, 'AMZN': 145,
      'TSLA': 250, 'NVDA': 495, 'JPM': 145, 'V': 245
    };

    const priceInserts = symbols.map(symbol => ({
      session_id: session.id,
      symbol,
      current_price: basePrices[symbol] * (1 + (Math.random() - 0.5) * 0.1),
      previous_price: basePrices[symbol],
      day_open: basePrices[symbol] * (1 + (Math.random() - 0.5) * 0.05),
      day_high: basePrices[symbol] * 1.03,
      day_low: basePrices[symbol] * 0.97,
      volume: Math.floor(Math.random() * 10000000),
      ai_sentiment: (Math.random() - 0.5) * 2
    }));

    const { error: pricesError } = await supabaseAdmin
      .from('ai_stock_prices')
      .insert(priceInserts);

    if (pricesError) {
      console.error('Failed to insert stock prices:', pricesError);
      throw pricesError;
    }

    console.log('Stock prices initialized for', symbols.length, 'symbols');
  } else {
    console.log('Stock prices already exist, skipping seed');
  }

  // Check if session has competitors
  const { data: existingCompetitors } = await supabaseAdmin
    .from('ai_competitors')
    .select('id')
    .eq('session_id', session.id)
    .limit(1);

  // Only create competitors if none exist
  if (!existingCompetitors || existingCompetitors.length === 0) {
    console.log('Creating AI competitors for session:', session.id);
    
    const competitors = [
      { name: 'Momentum Mike', strategy_type: 'momentum', personality_traits: { risk_tolerance: 0.8, adaptability: 0.6 }, capital: 10000, portfolio: {} },
      { name: 'Value Victor', strategy_type: 'value', personality_traits: { risk_tolerance: 0.3, adaptability: 0.4 }, capital: 10000, portfolio: {} },
      { name: 'Aggressive Amy', strategy_type: 'aggressive', personality_traits: { risk_tolerance: 0.9, adaptability: 0.7 }, capital: 10000, portfolio: {} },
      { name: 'Conservative Chris', strategy_type: 'conservative', personality_traits: { risk_tolerance: 0.2, adaptability: 0.3 }, capital: 10000, portfolio: {} }
    ];

    const competitorInserts = competitors.map(comp => ({
      session_id: session.id,
      total_trades: 0,
      ...comp
    }));

    const { error: competitorsError } = await supabaseAdmin
      .from('ai_competitors')
      .insert(competitorInserts);

    if (competitorsError) {
      console.error('Failed to insert competitors:', competitorsError);
      throw competitorsError;
    }

    console.log('AI competitors initialized');
  } else {
    console.log('Competitors already exist, skipping creation');
  }

  return new Response(
    JSON.stringify({ session, message: 'AI Market Session initialized successfully' }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function updateMarketPrices(supabase: any, sessionId: string, apiKey: string) {
  // Get current session and prices
  const { data: session } = await supabase
    .from('ai_market_sessions')
    .select('*')
    .eq('id', sessionId)
    .maybeSingle();

  if (!session) {
    console.warn('No session found for sessionId:', sessionId);
    return new Response(
      JSON.stringify({ success: false, error: 'Session not found' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const { data: prices } = await supabase
    .from('ai_stock_prices')
    .select('*')
    .eq('session_id', sessionId);

  if (!prices || prices.length === 0) {
    console.warn('No prices found for session:', sessionId);
    return new Response(
      JSON.stringify({ success: false, error: 'No prices found' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const { data: events } = await supabase
    .from('ai_market_events')
    .select('*')
    .eq('session_id', sessionId)
    .eq('is_active', true);

  const volatility = session.market_volatility || 0.3;
  const trend = session.market_trend || 'neutral';

  // Use AI to determine price movements - with fallback for errors
  let priceUpdates = { updates: [] as { symbol: string; price_change_percent: number }[] };
  
  try {
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [{
          role: 'system',
          content: `You are a market simulation AI. Generate realistic price movements for stocks based on:
- Market trend: ${trend}
- Volatility: ${volatility}
- Active events: ${JSON.stringify(events || [])}
Return JSON with symbol and price_change_percent for each stock.`
        }, {
          role: 'user',
          content: `Current prices: ${JSON.stringify(prices)}. Generate next tick price movements.`
        }],
        tools: [{
          type: "function",
          function: {
            name: "update_prices",
            parameters: {
              type: "object",
              properties: {
                updates: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      symbol: { type: "string" },
                      price_change_percent: { type: "number" }
                    },
                    required: ["symbol", "price_change_percent"]
                  }
                }
              },
              required: ["updates"]
            }
          }
        }],
        tool_choice: { type: "function", function: { name: "update_prices" } }
      })
    });

    if (!aiResponse.ok) {
      console.warn('AI API returned error, using fallback price updates');
      // Generate fallback price updates based on volatility
      priceUpdates.updates = prices.map((p: any) => ({
        symbol: p.symbol,
        price_change_percent: (Math.random() - 0.5) * volatility * 2
      }));
    } else {
      const aiData = await aiResponse.json();
      const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
      if (toolCall?.function?.arguments) {
        try {
          priceUpdates = JSON.parse(toolCall.function.arguments);
        } catch (parseError) {
          console.warn('Failed to parse AI response, using fallback');
          priceUpdates.updates = prices.map((p: any) => ({
            symbol: p.symbol,
            price_change_percent: (Math.random() - 0.5) * volatility * 2
          }));
        }
      } else {
        // No valid tool call, use fallback
        priceUpdates.updates = prices.map((p: any) => ({
          symbol: p.symbol,
          price_change_percent: (Math.random() - 0.5) * volatility * 2
        }));
      }
    }
  } catch (aiError) {
    console.warn('AI request failed, using fallback:', aiError);
    // Generate fallback price updates
    priceUpdates.updates = prices.map((p: any) => ({
      symbol: p.symbol,
      price_change_percent: (Math.random() - 0.5) * volatility * 2
    }));
  }

  // Apply price updates
  for (const update of priceUpdates.updates) {
    const price = prices.find((p: any) => p.symbol === update.symbol);
    if (price) {
      const newPrice = price.current_price * (1 + update.price_change_percent / 100);
      await supabase
        .from('ai_stock_prices')
        .update({
          previous_price: price.current_price,
          current_price: newPrice,
          day_high: Math.max(price.day_high, newPrice),
          day_low: Math.min(price.day_low, newPrice),
          volume: price.volume + Math.floor(Math.random() * 100000),
          price_momentum: update.price_change_percent,
          updated_at: new Date().toISOString()
        })
        .eq('id', price.id);
    }
  }

  // Update competitors' actions
  await updateCompetitorActions(supabase, sessionId, prices, apiKey);

  return new Response(
    JSON.stringify({ success: true, updates: priceUpdates.updates }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function updateCompetitorActions(supabase: any, sessionId: string, prices: any[], apiKey: string) {
  const { data: competitors } = await supabase
    .from('ai_competitors')
    .select('*')
    .eq('session_id', sessionId);

  for (const competitor of competitors || []) {
    try {
      // AI decides what competitor should do
      const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: [{
            role: 'system',
            content: `You are ${competitor.name}, a ${competitor.strategy_type} trader with personality: ${JSON.stringify(competitor.personality_traits)}. Decide your next trade based on market conditions.`
          }, {
            role: 'user',
            content: `Current prices: ${JSON.stringify(prices)}. Portfolio: ${JSON.stringify(competitor.portfolio)}. Capital: ${competitor.capital}. What's your next move?`
          }],
          tools: [{
            type: "function",
            function: {
              name: "make_trade",
              parameters: {
                type: "object",
                properties: {
                  action: { type: "string", enum: ["buy", "sell", "hold"] },
                  symbol: { type: "string" },
                  quantity: { type: "number" },
                  reasoning: { type: "string" }
                },
                required: ["action", "reasoning"]
              }
            }
          }],
          tool_choice: { type: "function", function: { name: "make_trade" } }
        })
      });

      if (!aiResponse.ok) {
        console.warn(`AI failed for competitor ${competitor.name}, skipping update`);
        continue;
      }

      const aiData = await aiResponse.json();
      const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
      
      if (toolCall) {
        const trade = JSON.parse(toolCall.function.arguments);
        
        // Update competitor's learning data
        const learningData = competitor.learning_data || {};
        learningData[new Date().toISOString()] = trade;
        
        await supabase
          .from('ai_competitors')
          .update({
            learning_data: learningData,
            last_action_at: new Date().toISOString(),
            total_trades: competitor.total_trades + 1
          })
          .eq('id', competitor.id);
      }
    } catch (error) {
      console.warn(`Error updating competitor ${competitor.name}:`, error);
      // Continue with other competitors even if one fails
    }
  }
}

async function simulateTradeImpact(
  supabase: any,
  sessionId: string,
  symbol: string,
  quantity: number,
  side: string,
  apiKey: string
) {
  const { data: session } = await supabase
    .from('ai_market_sessions')
    .select('*')
    .eq('id', sessionId)
    .maybeSingle();

  const { data: price } = await supabase
    .from('ai_stock_prices')
    .select('*')
    .eq('session_id', sessionId)
    .eq('symbol', symbol)
    .maybeSingle();

  const { data: competitors } = await supabase
    .from('ai_competitors')
    .select('*')
    .eq('session_id', sessionId);

  // Use AI to predict trade impact with fallback
  let impact: any = {
    price_impact_percent: (Math.random() - 0.5) * 2,
    competitor_reactions: ['Monitoring the trade', 'Adjusting positions'],
    market_sentiment_shift: Math.random() * 0.5,
    risk_level: 'medium',
    opportunity_score: 50 + Math.random() * 30
  };

  try {
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [{
          role: 'system',
          content: `Analyze the market impact of a ${side} order for ${quantity} shares of ${symbol}.
Consider:
- Current price: $${price?.current_price || 100}
- Market volatility: ${session?.market_volatility || 0.3}
- AI competitor reactions
- Price momentum: ${price?.price_momentum || 0}

Provide detailed impact prediction.`
        }],
        tools: [{
          type: "function",
          function: {
            name: "predict_impact",
            parameters: {
              type: "object",
              properties: {
                price_impact_percent: { type: "number" },
                competitor_reactions: {
                  type: "array",
                  items: { type: "string" }
                },
                market_sentiment_shift: { type: "number" },
                risk_level: { type: "string", enum: ["low", "medium", "high"] },
                opportunity_score: { type: "number" }
              },
              required: ["price_impact_percent", "competitor_reactions", "market_sentiment_shift", "risk_level", "opportunity_score"]
            }
          }
        }],
        tool_choice: { type: "function", function: { name: "predict_impact" } }
      })
    });

    if (aiResponse.ok) {
      const aiData = await aiResponse.json();
      const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
      if (toolCall?.function?.arguments) {
        try {
          impact = JSON.parse(toolCall.function.arguments);
        } catch (parseError) {
          console.warn('Failed to parse trade impact AI response');
        }
      }
    } else {
      console.warn('AI failed for trade impact, using fallback');
    }
  } catch (error) {
    console.warn('Error predicting trade impact:', error);
  }

  return new Response(
    JSON.stringify({ impact, competitors }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function triggerMarketEvent(supabase: any, sessionId: string, apiKey: string) {
  const { data: prices } = await supabase
    .from('ai_stock_prices')
    .select('*')
    .eq('session_id', sessionId);

  const symbols = (prices || []).map((p: any) => p.symbol);
  
  // Default fallback event
  let event: any = {
    title: 'Market Volatility Spike',
    description: 'Increased trading activity has led to heightened market volatility across multiple sectors.',
    event_type: 'macro',
    severity: 'medium',
    affected_symbols: symbols.slice(0, 3),
    impact_multiplier: 1 + Math.random() * 0.5,
    cause_chain: ['Trading volume increase', 'Algorithmic trading response', 'Volatility adjustment']
  };

  try {
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [{
          role: 'system',
          content: `You are a market simulation AI generating realistic market events with professional formatting.

CRITICAL FORMATTING REQUIREMENTS:
- Use proper grammar, punctuation, and capitalization in all text fields
- Write clear, complete sentences for descriptions
- Ensure all event titles are professionally worded
- Format impact descriptions with proper structure
- Use correct financial terminology

Generate a realistic market event (macro or micro) that will affect stock prices. Include a multi-step cause-and-effect chain with clear, well-written descriptions.`
        }],
        tools: [{
          type: "function",
          function: {
            name: "create_event",
            parameters: {
              type: "object",
              properties: {
                title: { type: "string" },
                description: { type: "string" },
                event_type: { type: "string", enum: ["macro", "micro"] },
                severity: { type: "string", enum: ["low", "medium", "high", "critical"] },
                affected_symbols: { type: "array", items: { type: "string" } },
                impact_multiplier: { type: "number" },
                cause_chain: { type: "array", items: { type: "string" } }
              },
              required: ["title", "description", "event_type", "severity", "affected_symbols", "impact_multiplier", "cause_chain"]
            }
          }
        }],
        tool_choice: { type: "function", function: { name: "create_event" } }
      })
    });

    if (aiResponse.ok) {
      const aiData = await aiResponse.json();
      const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
      if (toolCall?.function?.arguments) {
        try {
          event = JSON.parse(toolCall.function.arguments);
        } catch (parseError) {
          console.warn('Failed to parse market event AI response');
        }
      }
    } else {
      console.warn('AI failed for market event, using fallback');
    }
  } catch (error) {
    console.warn('Error generating market event:', error);
  }

  if (event) {
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 30);

    await supabase.from('ai_market_events').insert({
      session_id: sessionId,
      ...event,
      expires_at: expiresAt.toISOString()
    });
  }

  return new Response(
    JSON.stringify({ event }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}
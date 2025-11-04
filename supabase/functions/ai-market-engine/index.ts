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
  // Create new AI market session
  const sessionSeed = Math.random().toString(36).substring(7);
  
  const { data: session, error: sessionError } = await supabase
    .from('ai_market_sessions')
    .insert({
      user_id: userId,
      session_seed: sessionSeed,
      market_volatility: Math.random() * 0.5 + 0.25,
      market_trend: ['bullish', 'bearish', 'neutral'][Math.floor(Math.random() * 3)]
    })
    .select()
    .single();

  if (sessionError) throw sessionError;

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

  await supabase.from('ai_stock_prices').insert(priceInserts);

  // Create AI competitors
  const competitors = [
    { name: 'Momentum Mike', strategy_type: 'momentum', personality_traits: { risk_tolerance: 0.8, adaptability: 0.6 } },
    { name: 'Value Victor', strategy_type: 'value', personality_traits: { risk_tolerance: 0.3, adaptability: 0.4 } },
    { name: 'Aggressive Amy', strategy_type: 'aggressive', personality_traits: { risk_tolerance: 0.9, adaptability: 0.7 } },
    { name: 'Conservative Chris', strategy_type: 'conservative', personality_traits: { risk_tolerance: 0.2, adaptability: 0.3 } }
  ];

  const competitorInserts = competitors.map(comp => ({
    session_id: session.id,
    ...comp
  }));

  await supabase.from('ai_competitors').insert(competitorInserts);

  return new Response(
    JSON.stringify({ session, message: 'AI Market Session initialized' }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function updateMarketPrices(supabase: any, sessionId: string, apiKey: string) {
  // Get current session and prices
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

  // Use AI to determine price movements
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
- Market trend: ${session.market_trend}
- Volatility: ${session.market_volatility}
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

  const aiData = await aiResponse.json();
  const toolCall = aiData.choices[0]?.message?.tool_calls?.[0];
  const priceUpdates = toolCall ? JSON.parse(toolCall.function.arguments) : { updates: [] };

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

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices[0]?.message?.tool_calls?.[0];
    
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

  // Use AI to predict trade impact
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
- Current price: $${price.current_price}
- Market volatility: ${session.market_volatility}
- AI competitor reactions
- Price momentum: ${price.price_momentum}

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

  const aiData = await aiResponse.json();
  const toolCall = aiData.choices[0]?.message?.tool_calls?.[0];
  const impact = toolCall ? JSON.parse(toolCall.function.arguments) : {};

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

  // AI generates a market event
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

  const aiData = await aiResponse.json();
  const toolCall = aiData.choices[0]?.message?.tool_calls?.[0];
  const event = toolCall ? JSON.parse(toolCall.function.arguments) : null;

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
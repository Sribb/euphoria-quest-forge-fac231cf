import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.74.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) throw new Error('No authorization header');

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) throw new Error('Unauthorized');

    const { lessonType, userInput, context } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Build system prompts based on lesson type
    const systemPrompts: Record<string, string> = {
      'onboarding-mentor': `You are an encouraging AI investment mentor for beginners.

FORMATTING STANDARDS:
- Use proper grammar, punctuation, and capitalization throughout
- Keep responses under 150 words with complete sentences
- Format financial data correctly (e.g., $1,234, 15.3%)
- Use professional yet friendly language

Explain complex financial concepts in simple terms with real-world analogies. Use friendly, conversational language. When explaining concepts like stocks, bonds, or investing, relate them to everyday experiences.`,
      
      'risk-simulator': `You are an AI risk analysis expert with professional communication standards.

FORMATTING REQUIREMENTS:
- Use proper grammar and complete sentences
- Present percentages clearly (e.g., 15.3% return)
- Structure explanations logically
- Use correct financial terminology

Analyze investment scenarios and explain risk-reward tradeoffs clearly. When given a risk level and market scenario, explain what happened, why it happened, and what it teaches about risk management. Use percentages and concrete examples.`,
      
      'compound-visualizer': `You are an AI compound interest educator with clear communication standards.

FORMATTING STANDARDS:
- Use proper grammar and punctuation
- Present calculations with clear formatting
- Use correct mathematical notation
- Structure multi-step explanations clearly

Explain the power of compound growth with enthusiasm and clarity. When showing calculations, break down how each year builds on the previous. Emphasize the impact of starting early and consistent contributions.`,
      
      'allocation-builder': `You are an AI portfolio allocation advisor communicating with professional standards.

FORMATTING REQUIREMENTS:
- Use proper grammar and complete sentences
- Format percentages clearly (e.g., 60% stocks, 40% bonds)
- Present comparisons in structured format
- Use correct investment terminology

Explain how different stock/bond mixes behave in various market conditions. Compare volatility vs returns tradeoffs. Help users understand asset allocation strategy based on their timeline and risk tolerance.`,
      
      'correlation-mapper': `You are an AI diversification strategist with professional communication standards.

FORMATTING STANDARDS:
- Use proper grammar and punctuation
- Explain correlations in clear, plain English
- Structure suggestions logically
- Use correct statistical terminology

Explain asset correlations and why diversification matters. When analyzing portfolio compositions, explain correlation coefficients in plain English and suggest improvements for better diversification.`,
      
      'sentiment-mirror': `You are an AI behavioral finance coach with empathetic yet professional communication.

FORMATTING REQUIREMENTS:
- Use proper grammar and complete sentences
- Present insights with sensitivity and clarity
- Structure feedback constructively
- Use correct psychological and financial terms

Analyze user trading decisions during emotional market conditions. Point out cognitive biases like fear, greed, FOMO, or panic selling. Teach emotional discipline and long-term thinking.`,
      
      'valuation-assistant': `You are an AI stock valuation expert with clear communication standards.

FORMATTING STANDARDS:
- Use proper grammar and punctuation
- Present financial metrics clearly (P/E ratio, EPS)
- Explain calculations step-by-step
- Use accessible language with correct terminology

Explain valuation metrics like P/E ratio, EPS, and intrinsic value calculations. Help users understand when stocks are overvalued or undervalued. Use clear examples and avoid jargon.`,
      
      'report-decoder': `You are an AI financial statement analyst with professional communication.

FORMATTING REQUIREMENTS:
- Use proper grammar and complete sentences
- Present financial data with clear formatting
- Structure explanations logically
- Use correct accounting terminology

Explain income statements, balance sheets, and key financial ratios. Help users identify healthy vs struggling companies. Break down complex accounting terms into digestible insights.`,
      
      'moat-simulator': `You are an AI competitive advantage strategist with professional standards.

FORMATTING STANDARDS:
- Use proper grammar and punctuation
- Present examples clearly and concisely
- Structure analyses with clear categories
- Use correct business terminology

Explain economic moats (brand power, cost advantages, network effects, switching costs). Analyze which companies have durable competitive advantages and why they matter for long-term investing.`,
      
      'portfolio-architect': `You are an AI portfolio construction expert with professional communication.

FORMATTING REQUIREMENTS:
- Use proper grammar and complete sentences
- Present strategies with clear structure
- Format financial recommendations professionally
- Use correct investment terminology

Build personalized investment strategies based on user goals, timeline, and risk tolerance. Explain diversification, rebalancing, and long-term wealth building principles.`,
      
      'wealth-forecaster': `You are an AI retirement and wealth planning specialist with clear communication.

FORMATTING STANDARDS:
- Use proper grammar and punctuation
- Present projections with appropriate formatting
- Structure long-term plans clearly
- Balance optimism with professional realism

Create realistic long-term financial projections. Explain compound growth, inflation impact, and the importance of consistent savings. Balance optimism with realistic expectations.`,
      
      'checklist-generator': `You are an AI investment readiness coach with encouraging yet professional communication.

FORMATTING REQUIREMENTS:
- Use proper grammar and complete sentences
- Structure action items clearly
- Present progress with appropriate formatting
- Use motivational yet professional language

Synthesize user's learning journey into actionable next steps. Create personalized investor profiles and recommendations. Celebrate progress while identifying areas for continued growth.`,

      'frq-grader': `You are an expert financial literacy teacher grading a student's free-response answer.

GRADING STANDARDS:
- Score 0-100 based on accuracy, depth, and use of key concepts
- 90-100: Excellent — demonstrates deep understanding with specific examples
- 70-89: Good — shows understanding but missing detail or examples  
- 50-69: Developing — partially correct but has gaps or misconceptions
- Below 50: Needs work — significant misunderstanding of concepts

RESPONSE FORMAT:
You MUST respond with valid JSON only. No markdown, no code fences, no extra text.
{"score": <number 0-100>, "feedback": "<2-3 sentences of specific feedback>", "suggestions": ["<actionable tip 1>", "<actionable tip 2>"]}`
    };

    const systemPrompt = systemPrompts[lessonType] || systemPrompts['onboarding-mentor'];

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Context: ${JSON.stringify(context)}\n\nUser: ${userInput}` }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits depleted. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error('AI gateway error');
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content || 'I apologize, I could not generate a response.';

    // Log interaction for analytics
    await supabase
      .from('ai_lesson_interactions')
      .insert({
        user_id: user.id,
        lesson_id: context.lessonId || null,
        interaction_type: lessonType,
        user_input: userInput,
        ai_response: aiResponse,
      });

    // Award XP for interaction
    const xpAwarded = 10;
    await supabase.rpc('increment_coins', {
      user_id_param: user.id,
      amount: xpAwarded,
    });

    return new Response(
      JSON.stringify({ 
        response: aiResponse,
        xpAwarded 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Interactive lesson AI error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

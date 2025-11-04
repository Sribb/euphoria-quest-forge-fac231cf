import "https://deno.land/x/xhr@0.1.0/mod.ts";
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
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const { lessonId, currentDifficulty, weakAreas } = await req.json();

    // Fetch lesson data
    const { data: lesson, error: lessonError } = await supabase
      .from('lessons')
      .select('*')
      .eq('id', lessonId)
      .single();

    if (lessonError) throw lessonError;

    // Fetch user's past performance on this lesson
    const { data: performance } = await supabase
      .from('lesson_question_performance')
      .select('*')
      .eq('user_id', user.id)
      .eq('lesson_id', lessonId)
      .order('created_at', { ascending: false })
      .limit(10);

    // Calculate performance metrics
    const recentCorrect = performance?.filter(p => p.is_correct).length || 0;
    const recentTotal = performance?.length || 0;
    const successRate = recentTotal > 0 ? recentCorrect / recentTotal : 0.5;

    // Determine adaptive difficulty
    let targetDifficulty = currentDifficulty || 'medium';
    if (successRate >= 0.8 && recentTotal >= 3) {
      targetDifficulty = 'hard';
    } else if (successRate < 0.5 && recentTotal >= 2) {
      targetDifficulty = 'easy';
    }

    // Generate AI questions using Lovable AI
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY')!;

    const systemPrompt = `You are an expert investing education instructor creating adaptive quiz questions.

Lesson Title: ${lesson.title}
Lesson Description: ${lesson.description}
Target Difficulty: ${targetDifficulty}
User Success Rate: ${(successRate * 100).toFixed(1)}%
Weak Areas: ${weakAreas?.join(', ') || 'None identified yet'}

Create 3 multiple-choice questions that:
1. Test understanding of the lesson's core concepts
2. Adapt to ${targetDifficulty} difficulty level
3. Focus on weak areas if identified: ${weakAreas?.length > 0 ? weakAreas.join(', ') : 'general concepts'}
4. Provide educational explanations for correct answers
5. Include realistic distractors that test misconceptions

For ${targetDifficulty} difficulty:
- easy: Direct recall, clear concepts, obvious wrong answers
- medium: Application of concepts, requires analysis, subtle distractors
- hard: Synthesis, edge cases, requires deep understanding, complex scenarios`;

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { 
            role: 'user', 
            content: `Generate 3 ${targetDifficulty} difficulty questions for this investing lesson. Return ONLY valid JSON in this exact format:
{
  "questions": [
    {
      "question": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0,
      "explanation": "Why this answer is correct and what concept it tests",
      "topicCategory": "Main topic this tests (e.g., 'compound interest', 'diversification')",
      "difficulty": "${targetDifficulty}"
    }
  ]
}` 
          }
        ],
        temperature: 0.7,
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: 'AI credits depleted. Please add credits.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const content = aiData.choices[0].message.content;

    // Parse JSON response (strip markdown code fences if present)
    let questions;
    try {
      let jsonContent = content.trim();
      // Remove markdown code fences if present
      if (jsonContent.startsWith('```')) {
        jsonContent = jsonContent.replace(/^```(?:json)?\n/, '').replace(/\n```$/, '');
      }
      const parsed = JSON.parse(jsonContent);
      questions = parsed.questions;
    } catch (e) {
      console.error('Failed to parse AI response:', content);
      console.error('Parse error:', e);
      throw new Error('Invalid AI response format');
    }

    return new Response(
      JSON.stringify({
        questions,
        adaptiveInfo: {
          targetDifficulty,
          successRate: (successRate * 100).toFixed(1),
          questionCount: recentTotal,
          correctCount: recentCorrect,
        },
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in generate-adaptive-questions:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
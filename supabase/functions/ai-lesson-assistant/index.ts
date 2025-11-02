import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.74.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { action, lessonId, lessonContent, userQuestion, userProgress, simulationData } = await req.json();

    console.log(`AI lesson assistant - action: ${action}`);

    // Fetch lesson and user progress
    const { data: lesson } = await supabase
      .from("lessons")
      .select("*")
      .eq("id", lessonId)
      .single();

    const { data: progress } = await supabase
      .from("user_lesson_progress")
      .select("*")
      .eq("lesson_id", lessonId)
      .eq("user_id", user.id)
      .single();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    let systemPrompt = "";
    let userPrompt = "";

    if (action === "chat") {
      systemPrompt = `You are an expert investing tutor for Euphoria, an interactive trading education platform. 
Your role is to help users understand investing concepts through clear, encouraging explanations.
- Keep responses concise (2-3 sentences)
- Use simple language and real-world examples
- Relate concepts to the current lesson: "${lesson?.title}"
- Encourage curiosity and practical application
- If the question is off-topic, gently guide back to investing education`;

      userPrompt = `User is learning: ${lesson?.title}
Current lesson section: ${lessonContent}
User progress: ${userProgress}%

User question: ${userQuestion}`;
    } else if (action === "contextual_help") {
      systemPrompt = `You are a contextual AI tutor providing brief, helpful tooltips for investing concepts.
- Provide 1-2 sentence explanations
- Use clear, accessible language
- Include practical examples when relevant`;

      userPrompt = `Explain this concept briefly: ${userQuestion}
Context: User is learning about ${lesson?.title}`;
    } else if (action === "adaptive_guidance") {
      systemPrompt = `You are an adaptive learning AI that provides personalized lesson guidance.
Analyze the user's progress and provide tailored next steps and insights.`;

      userPrompt = `User: ${user.id}
Lesson: ${lesson?.title} (Difficulty: ${lesson?.difficulty})
Progress: ${progress?.progress || 0}%
Completed: ${progress?.completed || false}

Provide 2-3 adaptive tips based on their progress.`;
    } else if (action === "simulation_feedback") {
      systemPrompt = `You are an AI trading coach providing feedback on user simulation decisions.
- Analyze their choices critically but encouragingly
- Explain the reasoning behind correct and incorrect decisions
- Provide actionable insights for improvement`;

      userPrompt = `User made this decision in a simulation:
${JSON.stringify(simulationData, null, 2)}

Lesson context: ${lesson?.title}
Provide constructive feedback (3-4 sentences).`;
    }

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("AI API error:", aiResponse.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI service unavailable" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const aiData = await aiResponse.json();
    const assistantMessage = aiData.choices[0].message.content;

    // Store chat interactions in database for learning analytics
    if (action === "chat") {
      await supabase.from("ai_lesson_interactions").insert({
        user_id: user.id,
        lesson_id: lessonId,
        interaction_type: "chat",
        user_input: userQuestion,
        ai_response: assistantMessage,
      });
    }

    return new Response(
      JSON.stringify({
        response: assistantMessage,
        lessonContext: {
          title: lesson?.title,
          progress: progress?.progress || 0,
        },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("AI lesson assistant error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
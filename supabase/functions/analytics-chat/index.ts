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
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { messages } = await req.json();

    // Fetch user analytics data
    const [profileRes, portfolioRes, lessonsRes, gamesRes, transactionsRes] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).single(),
      supabase.from("portfolios").select("*").eq("user_id", user.id).single(),
      supabase.from("user_lesson_progress").select("*, lessons(*)").eq("user_id", user.id),
      supabase.from("game_sessions").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(20),
      supabase.from("transactions").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(50),
    ]);

    const profile = profileRes.data;
    const portfolio = portfolioRes.data;
    const lessonProgress = lessonsRes.data || [];
    const gameSessions = gamesRes.data || [];
    const transactions = transactionsRes.data || [];

    // Build analytics context
    const completedLessons = lessonProgress.filter(l => l.completed).length;
    const totalLessons = lessonProgress.length;
    const avgGameScore = gameSessions.reduce((sum, g) => sum + (g.score || 0), 0) / (gameSessions.length || 1);
    const portfolioReturn = ((Number(portfolio?.total_value || 0) - 10000) / 10000) * 100;

    const analyticsContext = `User Performance Context:
- Learning: ${completedLessons}/${totalLessons} lessons completed
- Gaming: ${gameSessions.length} games played, avg score: ${avgGameScore.toFixed(0)}
- Trading: Portfolio value: $${portfolio?.total_value || 0}, Return: ${portfolioReturn.toFixed(2)}%
- Total coins: ${profile?.coins || 0}`;

    const systemPrompt = `You are an expert investment education analytics assistant. You have access to the user's performance data.

${analyticsContext}

Provide insightful, personalized analytics based on this data. Be encouraging, specific, and actionable. Keep responses concise and focused.`;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required. Please add credits to your workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    return new Response(aiResponse.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });

  } catch (error) {
    console.error("Error in analytics-chat:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

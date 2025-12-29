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
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    // Create client with anon key for auth verification
    const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey);

    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser(token);

    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { messages } = await req.json();

    // Use service role key to bypass RLS and fetch user's data directly
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch user analytics data using service role (bypasses RLS)
    const [profileRes, portfolioRes, lessonsRes, progressRes, gamesRes, transactionsRes] = await Promise.all([
      supabaseAdmin.from("profiles").select("*").eq("id", user.id).single(),
      supabaseAdmin.from("portfolios").select("*").eq("user_id", user.id).single(),
      supabaseAdmin.from("lessons").select("*").order("order_index"),
      supabaseAdmin.from("user_lesson_progress").select("*").eq("user_id", user.id),
      supabaseAdmin.from("game_sessions").select("*, games(title)").eq("user_id", user.id).order("created_at", { ascending: false }).limit(20),
      supabaseAdmin.from("transactions").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(50),
    ]);

    const profile = profileRes.data;
    const portfolio = portfolioRes.data;
    const lessons = lessonsRes.data || [];
    const progress = progressRes.data || [];
    const gameSessions = gamesRes.data || [];
    const transactions = transactionsRes.data || [];

    // Build detailed analytics context
    const completedLessons = progress.filter((p: any) => p.completed).length;
    const totalLessons = lessons.length;
    const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
    
    // Get lesson titles for completed lessons
    const completedLessonDetails = progress
      .filter((p: any) => p.completed)
      .map((p: any) => {
        const lesson = lessons.find((l: any) => l.id === p.lesson_id);
        return lesson?.title || "Unknown lesson";
      });

    // Get in-progress lessons
    const inProgressLessons = progress
      .filter((p: any) => !p.completed && p.progress > 0)
      .map((p: any) => {
        const lesson = lessons.find((l: any) => l.id === p.lesson_id);
        return { title: lesson?.title || "Unknown", progress: p.progress };
      });

    const avgGameScore = gameSessions.length > 0 
      ? gameSessions.reduce((sum: number, g: any) => sum + (g.score || 0), 0) / gameSessions.length 
      : 0;
    const totalCoinsFromGames = gameSessions.reduce((sum: number, g: any) => sum + (g.coins_earned || 0), 0);
    const portfolioReturn = ((Number(portfolio?.total_value || 0) - 10000) / 10000) * 100;

    // Get recent game details
    const recentGames = gameSessions.slice(0, 5).map((g: any) => ({
      game: g.games?.title || g.game_id,
      score: g.score,
      coins: g.coins_earned,
      date: new Date(g.created_at).toLocaleDateString()
    }));

    const analyticsContext = `
=== USER PERFORMANCE DATA ===

LEARNING PROGRESS:
- Completed Lessons: ${completedLessons} out of ${totalLessons} total (${progressPercentage}% complete)
${completedLessonDetails.length > 0 ? `- Completed: ${completedLessonDetails.join(", ")}` : "- No lessons completed yet"}
${inProgressLessons.length > 0 ? `- In Progress: ${inProgressLessons.map(l => `${l.title} (${l.progress}%)`).join(", ")}` : ""}

GAMING ACTIVITY:
- Total Games Played: ${gameSessions.length}
- Average Score: ${avgGameScore.toFixed(0)}
- Total Coins Earned from Games: ${totalCoinsFromGames}
${recentGames.length > 0 ? `- Recent Games: ${recentGames.map(g => `${g.game} (score: ${g.score})`).join(", ")}` : "- No games played yet"}

TRADING/PORTFOLIO:
- Portfolio Value: $${Number(portfolio?.total_value || 10000).toLocaleString()}
- Cash Balance: $${Number(portfolio?.cash_balance || 10000).toLocaleString()}
- Portfolio Return: ${portfolioReturn >= 0 ? "+" : ""}${portfolioReturn.toFixed(2)}%

OVERALL STATS:
- User Level: ${profile?.level || 1}
- Total Coins: ${profile?.coins || 0}
- Experience Points: ${profile?.experience_points || 0}
- Transactions: ${transactions.length} recorded`;

    const systemPrompt = `You are Euphoria AI Assistant, a friendly and knowledgeable guide for investment education and analytics. You have access to the user's ACTUAL performance data shown below.

${analyticsContext}

IMPORTANT RULES:
1. ALWAYS reference the ACTUAL data above when answering questions about user progress
2. Be SPECIFIC - mention exact numbers, lesson names, game scores, etc.
3. If the user asks "what have I done" or "my progress", list their ACTUAL completed lessons and games
4. Keep responses SHORT and CONCISE - 2-4 sentences max
5. Be encouraging and suggest next steps based on their progress

EXAMPLES OF GOOD RESPONSES:
- "You've completed ${completedLessons} lessons including ${completedLessonDetails[0] || "none yet"}. Great progress! Consider tackling the next lesson in the series."
- "You've played ${gameSessions.length} games with an average score of ${avgGameScore.toFixed(0)}. Your best recent game was..."
- "Your portfolio is ${portfolioReturn >= 0 ? "up" : "down"} ${Math.abs(portfolioReturn).toFixed(1)}% - ${portfolioReturn >= 0 ? "nice work!" : "keep learning and it will improve!"}"

Be specific, cite their actual data, and be helpful!`;

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

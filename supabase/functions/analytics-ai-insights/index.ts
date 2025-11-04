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
      console.error("Auth error:", authError);
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { analysisType, filters } = await req.json();
    console.log("Analytics AI request:", { userId: user.id, analysisType, filters });

    // Fetch comprehensive user data
    const [profileRes, portfolioRes, lessonsRes, gamesRes, transactionsRes] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).single(),
      supabase.from("portfolios").select("*").eq("user_id", user.id).single(),
      supabase.from("user_lesson_progress").select("*, lessons(*)").eq("user_id", user.id),
      supabase.from("game_sessions").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(20),
      supabase.from("transactions").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(50),
    ]);

    if (profileRes.error || portfolioRes.error) {
      throw new Error("Failed to fetch user data");
    }

    const profile = profileRes.data;
    const portfolio = portfolioRes.data;
    const lessonProgress = lessonsRes.data || [];
    const gameSessions = gamesRes.data || [];
    const transactions = transactionsRes.data || [];

    // Calculate learning metrics
    const completedLessons = lessonProgress.filter(l => l.completed).length;
    const totalLessons = lessonProgress.length;
    const avgProgress = lessonProgress.reduce((sum, l) => sum + (l.progress || 0), 0) / (totalLessons || 1);
    const recentLessons = lessonProgress.filter(l => {
      if (!l.completed_at) return false;
      const daysSince = (Date.now() - new Date(l.completed_at).getTime()) / (1000 * 60 * 60 * 24);
      return daysSince <= 7;
    }).length;

    // Calculate gaming metrics
    const avgGameScore = gameSessions.reduce((sum, g) => sum + (g.score || 0), 0) / (gameSessions.length || 1);
    const totalCoinsEarned = gameSessions.reduce((sum, g) => sum + (g.coins_earned || 0), 0);
    const recentGames = gameSessions.filter(g => {
      const daysSince = (Date.now() - new Date(g.created_at).getTime()) / (1000 * 60 * 60 * 24);
      return daysSince <= 7;
    }).length;

    // Calculate trading metrics
    const portfolioReturn = ((Number(portfolio.total_value) - 10000) / 10000) * 100;
    const totalTrades = transactions.length;
    const recentTrades = transactions.filter(t => {
      const daysSince = (Date.now() - new Date(t.created_at).getTime()) / (1000 * 60 * 60 * 24);
      return daysSince <= 7;
    }).length;

    // Build context for AI
    const context = `User Analytics Summary:
- Learning: ${completedLessons}/${totalLessons} lessons completed (${avgProgress.toFixed(1)}% avg progress). ${recentLessons} lessons completed in last 7 days.
- Gaming: ${gameSessions.length} games played. Average score: ${avgGameScore.toFixed(0)}. ${totalCoinsEarned} coins earned. ${recentGames} games in last 7 days.
- Trading: Portfolio value: $${portfolio.total_value}. Return: ${portfolioReturn.toFixed(2)}%. ${totalTrades} total trades. ${recentTrades} trades in last 7 days.
- Engagement: Total coins: ${profile.coins}. Active for ${Math.floor((Date.now() - new Date(profile.created_at).getTime()) / (1000 * 60 * 60 * 24))} days.`;

    let systemPrompt = "";
    let userPrompt = "";

    switch (analysisType) {
      case "overview":
        systemPrompt = "You are an expert investment education analyst providing comprehensive performance insights. Use proper grammar, clear structure, and professional language. Format responses with paragraphs and bullet points for clarity.";
        userPrompt = `${context}\n\nProvide a well-structured analysis with:\n\n1. **Overall Performance Summary** (2-3 sentences)\n\n2. **Key Strengths** (2-3 bullet points with specific metrics)\n\n3. **Areas for Improvement** (2-3 bullet points with actionable advice)\n\n4. **Personalized Recommendations** (3-4 numbered items with clear action steps)\n\nUse proper formatting, correct grammar, and professional tone throughout.`;
        break;

      case "learning":
        systemPrompt = "You are an adaptive learning coach specializing in investment education. Use clear, encouraging language with proper grammar and structure. Format responses professionally with paragraphs and bullet points.";
        userPrompt = `${context}\n\nProvide a well-formatted analysis focusing on:\n\n1. **Learning Velocity & Consistency** (paragraph with specific metrics)\n\n2. **Topic Mastery Patterns** (2-3 bullet points)\n\n3. **Recommended Next Lessons** (numbered list with rationale)\n\n4. **Study Habits Improvement** (actionable bullet points)\n\nMaintain professional formatting and encouraging tone.`;
        break;

      case "trading":
        systemPrompt = "You are a trading performance analyst providing strategic investment guidance. Use professional language, proper grammar, and data-driven insights. Structure responses clearly with headings and bullet points.";
        userPrompt = `${context}\n\nProvide a professionally formatted analysis covering:\n\n1. **Portfolio Composition Insights** (paragraph with specific percentages)\n\n2. **Trading Patterns & Timing** (2-3 bullet points with data)\n\n3. **Risk Management Assessment** (clear evaluation with metrics)\n\n4. **Improvement Strategies** (numbered actionable steps)\n\nUse proper grammar and professional financial terminology.`;
        break;

      case "behavioral":
        systemPrompt = "You are a behavioral finance expert analyzing user patterns and decision-making. Use clear, non-judgmental language with proper grammar and structure. Format responses with clear sections and bullet points.";
        userPrompt = `${context}\n\nProvide a well-structured behavioral analysis:\n\n1. **Engagement Consistency** (paragraph with pattern analysis)\n\n2. **Activity Balance** (learning vs gaming vs trading breakdown)\n\n3. **Identified Patterns** (2-3 bullet points on behavioral trends)\n\n4. **Recommendations for Growth** (numbered actionable suggestions)\n\nMaintain professional, insightful tone with proper formatting.`;
        break;

      default:
        systemPrompt = "You are a helpful analytics assistant. Use clear, professional language with proper grammar and formatting.";
        userPrompt = `${context}\n\nProvide a brief, well-formatted analysis with clear recommendations.`;
    }

    // Call Lovable AI
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
          { role: "user", content: userPrompt }
        ],
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
      const errorText = await aiResponse.text();
      console.error("AI API error:", aiResponse.status, errorText);
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const insights = aiData.choices[0].message.content;

    // Store insights
    await supabase.from("ai_analytics_insights").insert({
      user_id: user.id,
      analysis_type: analysisType,
      insights,
      metrics: {
        learning: { completedLessons, totalLessons, avgProgress, recentLessons },
        gaming: { totalGames: gameSessions.length, avgScore: avgGameScore, totalCoins: totalCoinsEarned, recentGames },
        trading: { portfolioValue: portfolio.total_value, portfolioReturn, totalTrades, recentTrades },
      },
    });

    console.log("AI insights generated successfully");

    return new Response(JSON.stringify({
      insights,
      metrics: {
        learning: { completedLessons, totalLessons, avgProgress, recentLessons },
        gaming: { totalGames: gameSessions.length, avgScore: avgGameScore, totalCoins: totalCoinsEarned, recentGames },
        trading: { portfolioValue: portfolio.total_value, portfolioReturn, totalTrades, recentTrades },
      },
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in analytics-ai-insights:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

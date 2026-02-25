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

    // Check if user is an educator
    const { data: userRoles } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .in("role", ["educator", "admin", "mentor"]);

    const isEducator = userRoles && userRoles.length > 0;

    let systemPrompt: string;

    if (isEducator) {
      // ===== EDUCATOR PATH =====
      // Fetch educator-specific data: classes, students, performance
      const { data: classes } = await supabaseAdmin
        .from("classes")
        .select("*")
        .eq("educator_id", user.id);

      const classIds = (classes || []).map((c: any) => c.id);

      let studentIds: string[] = [];
      let studentProfiles: any[] = [];
      let studentProgress: any[] = [];
      let studentGameSessions: any[] = [];

      if (classIds.length > 0) {
        const { data: members } = await supabaseAdmin
          .from("class_members")
          .select("student_id, class_id")
          .in("class_id", classIds);

        studentIds = [...new Set((members || []).map((m: any) => m.student_id))];

        if (studentIds.length > 0) {
          const [profilesRes, progressRes, gamesRes] = await Promise.all([
            supabaseAdmin.from("profiles").select("*").in("id", studentIds),
            supabaseAdmin.from("user_lesson_progress").select("*").in("user_id", studentIds),
            supabaseAdmin.from("game_sessions").select("*, games(title)").in("user_id", studentIds),
          ]);
          studentProfiles = profilesRes.data || [];
          studentProgress = progressRes.data || [];
          studentGameSessions = gamesRes.data || [];
        }
      }

      // Fetch educator profile
      const { data: educatorProfile } = await supabaseAdmin
        .from("educator_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      // Build per-student summaries
      const studentSummaries = studentProfiles.map((s: any) => {
        const sp = studentProgress.filter((p: any) => p.user_id === s.id);
        const completed = sp.filter((p: any) => p.completed).length;
        const quizScores = sp.filter((p: any) => p.quiz_score).map((p: any) => p.quiz_score);
        const avgQuiz = quizScores.length > 0 ? (quizScores.reduce((a: number, b: number) => a + b, 0) / quizScores.length).toFixed(0) : "N/A";
        const games = studentGameSessions.filter((g: any) => g.user_id === s.id).length;
        const isStruggling = quizScores.length > 0 && Number(avgQuiz) < 50;
        return `  - ${s.display_name || s.username || s.id}: Level ${s.level}, ${completed} lessons completed, avg quiz ${avgQuiz}%, ${games} games${isStruggling ? " ⚠️ STRUGGLING" : ""}`;
      });

      // Aggregate stats
      const totalStudents = studentIds.length;
      const activeStudents7d = studentProfiles.filter((s: any) =>
        new Date(s.updated_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      ).length;
      const allCompleted = studentProgress.filter((p: any) => p.completed).length;
      const allQuizScores = studentProgress.filter((p: any) => p.quiz_score).map((p: any) => p.quiz_score);
      const avgClassQuiz = allQuizScores.length > 0
        ? (allQuizScores.reduce((a: number, b: number) => a + b, 0) / allQuizScores.length).toFixed(0)
        : "N/A";
      const strugglingCount = studentProfiles.filter((s: any) => {
        const scores = studentProgress.filter((p: any) => p.user_id === s.id && p.quiz_score).map((p: any) => p.quiz_score);
        return scores.length > 0 && scores.reduce((a: number, b: number) => a + b, 0) / scores.length < 50;
      }).length;

      const educatorContext = `
=== EDUCATOR DASHBOARD DATA ===

YOUR CLASSES:
${(classes || []).map((c: any) => `- ${c.class_name} (Code: ${c.class_code}, Active: ${c.is_active})`).join("\n") || "- No classes created yet"}

SCHOOL: ${educatorProfile?.school_name || "Not set"}
GRADE LEVEL: ${educatorProfile?.grade_level || "Not set"}
SUBJECT: ${educatorProfile?.subject || "Not set"}

CLASS STATISTICS:
- Total Students Enrolled: ${totalStudents}
- Active Students (7d): ${activeStudents7d}
- Total Lessons Completed (all students): ${allCompleted}
- Average Quiz Score (class-wide): ${avgClassQuiz}%
- Students Struggling (<50% avg): ${strugglingCount}

STUDENT ROSTER:
${studentSummaries.length > 0 ? studentSummaries.join("\n") : "  - No students enrolled yet"}
`;

      systemPrompt = `You are Euphoria AI, an intelligent assistant built into the Euphoria Educator Hub. You assist EDUCATORS — professors, teachers, and instructors — in managing their classes, understanding student performance, and improving their teaching experience.

You are NOT a student-facing assistant. Never give advice as if speaking to a learner.

${educatorContext}

WHAT YOU HELP WITH:
1. Class Management — creating, organizing, sharing class codes, managing enrollments
2. Student Performance & Insights — identifying struggling students, trends in quiz scores and completion
3. Content & Curriculum — structuring lessons, improving quizzes, pacing advice
4. Analytics & Reporting — explaining dashboard metrics, recommending actions based on trends
5. Platform How-To — step-by-step help using any Euphoria feature
6. Engagement & Growth — strategies to increase student participation and motivation

HOW YOU COMMUNICATE:
- Professional, clear, and concise — educators are busy
- Data-informed: ALWAYS reference the actual data above when available
- Proactive: flag issues and suggest next steps without being asked
- Frame insights from the educator's POV ("Your students are averaging..." not "You scored...")
- Use bullet points for data summaries; prose for explanations
- Keep responses SHORT — 3-5 sentences or bullet points max
- If a student is struggling (⚠️), proactively mention it and suggest intervention

GROUND RULES:
- Only assist educators — never respond as if speaking to a student
- When data is available, cite specific numbers and student names
- Always suggest a clear next step or action
- If asked something outside scope, redirect to the relevant feature or suggest support`;

    } else {
      // ===== STUDENT PATH =====
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

      const completedLessons = progress.filter((p: any) => p.completed).length;
      const totalLessons = lessons.length;
      const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

      const completedLessonDetails = progress
        .filter((p: any) => p.completed)
        .map((p: any) => {
          const lesson = lessons.find((l: any) => l.id === p.lesson_id);
          return lesson?.title || "Unknown lesson";
        });

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

      systemPrompt = `You are Euphoria AI Assistant, a friendly and knowledgeable guide for investment education and analytics. You have access to the user's ACTUAL performance data shown below.

${analyticsContext}

IMPORTANT RULES:
1. ALWAYS reference the ACTUAL data above when answering questions about user progress
2. Be SPECIFIC - mention exact numbers, lesson names, game scores, etc.
3. If the user asks "what have I done" or "my progress", list their ACTUAL completed lessons and games
4. Keep responses SHORT and CONCISE - 2-4 sentences max
5. Be encouraging and suggest next steps based on their progress

Be specific, cite their actual data, and be helpful!`;
    }

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

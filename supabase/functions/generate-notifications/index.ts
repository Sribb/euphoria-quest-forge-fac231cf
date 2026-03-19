import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const { userId } = await req.json();

    if (!userId) {
      return new Response(JSON.stringify({ error: "userId required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get user preferences
    const { data: prefs } = await supabase
      .from("notification_preferences")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    const preferences = prefs || {
      streak_alerts: true,
      achievement_alerts: true,
      weekly_summary: true,
      re_engagement: true,
      max_daily_notifications: 8,
      quiet_hours_start: 22,
      quiet_hours_end: 7,
      notifications_today: 0,
    };

    // Check daily limit
    if (preferences.notifications_today >= preferences.max_daily_notifications) {
      return new Response(JSON.stringify({ message: "Daily notification limit reached", notifications: [] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check quiet hours
    const now = new Date();
    const currentHour = now.getUTCHours();
    if (
      preferences.quiet_hours_start !== null &&
      preferences.quiet_hours_end !== null
    ) {
      const start = preferences.quiet_hours_start;
      const end = preferences.quiet_hours_end;
      if (start > end) {
        if (currentHour >= start || currentHour < end) {
          return new Response(JSON.stringify({ message: "Quiet hours active", notifications: [] }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
      } else if (currentHour >= start && currentHour < end) {
        return new Response(JSON.stringify({ message: "Quiet hours active", notifications: [] }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    const notifications: Array<{
      user_id: string;
      title: string;
      message: string;
      notification_type: string;
      category: string;
      icon: string;
      action_url?: string;
    }> = [];

    // 1. Streak protection alerts (deduplicated — max 1 per day)
    if (preferences.streak_alerts) {
      const { data: streak } = await supabase
        .from("streaks")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (streak && streak.current_streak > 0) {
        const lastLogin = streak.last_login_date ? new Date(streak.last_login_date) : null;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (lastLogin) {
          const lastDate = new Date(lastLogin);
          lastDate.setHours(0, 0, 0, 0);
          const diffDays = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

          if (diffDays === 1) {
            // Check if we already sent a streak alert today
            const todayStart = new Date();
            todayStart.setHours(0, 0, 0, 0);
            const { data: existingStreak } = await supabase
              .from("notifications")
              .select("id")
              .eq("user_id", userId)
              .eq("notification_type", "streak_alert")
              .gte("created_at", todayStart.toISOString())
              .limit(1);

            if (!existingStreak || existingStreak.length === 0) {
              notifications.push({
                user_id: userId,
                title: "🔥 Protect Your Streak!",
                message: `Your ${streak.current_streak}-day streak is at risk! Complete a lesson today to keep it alive.`,
                notification_type: "streak_alert",
                category: "urgent",
                icon: "🔥",
                action_url: "/learn",
              });
            }
          }
        }
      }
    }

    // 2. Achievement celebrations
    if (preferences.achievement_alerts) {
      const { data: recentAchievements } = await supabase
        .from("user_achievements")
        .select("*, achievements(*)")
        .eq("user_id", userId)
        .order("earned_at", { ascending: false })
        .limit(3);

      if (recentAchievements) {
        for (const ua of recentAchievements) {
          const earnedAt = new Date(ua.earned_at);
          const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000);

          if (earnedAt > fiveMinAgo) {
            const achievement = ua.achievements as any;
            // Check if we already sent this notification
            const { data: existing } = await supabase
              .from("notifications")
              .select("id")
              .eq("user_id", userId)
              .eq("notification_type", "achievement")
              .ilike("message", `%${achievement?.title || ""}%`)
              .limit(1);

            if (!existing || existing.length === 0) {
              notifications.push({
                user_id: userId,
                title: "🏆 Achievement Unlocked!",
                message: `Congratulations! You earned "${achievement?.title || "New Achievement"}"!`,
                notification_type: "achievement",
                category: "celebration",
                icon: achievement?.icon || "🏆",
                action_url: "/certificates",
              });
            }
          }
        }
      }
    }

    // 3. Weekly progress summary (Sundays)
    if (preferences.weekly_summary && now.getDay() === 0 && currentHour >= 10 && currentHour <= 12) {
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      
      const { count: lessonsThisWeek } = await supabase
        .from("user_lesson_progress")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("completed", true)
        .gte("completed_at", weekAgo);

      const { data: profile } = await supabase
        .from("profiles")
        .select("experience_points, level, coins")
        .eq("id", userId)
        .single();

      // Only send if not already sent today
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const { data: existingSummary } = await supabase
        .from("notifications")
        .select("id")
        .eq("user_id", userId)
        .eq("notification_type", "weekly_summary")
        .gte("created_at", todayStart.toISOString())
        .limit(1);

      if (!existingSummary || existingSummary.length === 0) {
        notifications.push({
          user_id: userId,
          title: "📊 Your Weekly Recap",
          message: `This week: ${lessonsThisWeek || 0} lessons completed | Level ${profile?.level || 1} | ${profile?.experience_points || 0} total XP. Keep going!`,
          notification_type: "weekly_summary",
          category: "info",
          icon: "📊",
          action_url: "/rewards",
        });
      }
    }

    // 4. Re-engagement nudge for inactive users
    if (preferences.re_engagement) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("updated_at")
        .eq("id", userId)
        .single();

      if (profile) {
        const lastActive = new Date(profile.updated_at);
        const daysSinceActive = Math.floor((Date.now() - lastActive.getTime()) / (1000 * 60 * 60 * 24));

        if (daysSinceActive >= 3 && daysSinceActive < 7) {
          const { data: existingNudge } = await supabase
            .from("notifications")
            .select("id")
            .eq("user_id", userId)
            .eq("notification_type", "re_engagement")
            .gte("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
            .limit(1);

          if (!existingNudge || existingNudge.length === 0) {
            const messages = [
              "We miss you! Your learning journey awaits. Jump back in today! 🚀",
              "Your brain cells are getting bored! Time for a quick finance lesson? 🧠",
              "Just 5 minutes today could keep your skills sharp. Ready? 💪",
            ];
            notifications.push({
              user_id: userId,
              title: "👋 Come Back & Learn!",
              message: messages[Math.floor(Math.random() * messages.length)],
              notification_type: "re_engagement",
              category: "info",
              icon: "👋",
              action_url: "/learn",
            });
          }
        } else if (daysSinceActive >= 7) {
          const { data: existingNudge } = await supabase
            .from("notifications")
            .select("id")
            .eq("user_id", userId)
            .eq("notification_type", "re_engagement")
            .gte("created_at", new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString())
            .limit(1);

          if (!existingNudge || existingNudge.length === 0) {
            notifications.push({
              user_id: userId,
              title: "🌟 Your Journey Awaits",
              message: `It's been ${daysSinceActive} days since your last visit. Your progress is saved — pick up right where you left off!`,
              notification_type: "re_engagement",
              category: "info",
              icon: "🌟",
              action_url: "/learn",
            });
          }
        }
      }
    }

    // Insert notifications
    if (notifications.length > 0) {
      const remaining = preferences.max_daily_notifications - preferences.notifications_today;
      const toInsert = notifications.slice(0, remaining);

      if (toInsert.length > 0) {
        await supabase.from("notifications").insert(toInsert);

        // Update daily counter
        if (prefs) {
          await supabase
            .from("notification_preferences")
            .update({
              notifications_today: preferences.notifications_today + toInsert.length,
              last_notification_at: new Date().toISOString(),
            })
            .eq("user_id", userId);
        }
      }
    }

    return new Response(
      JSON.stringify({ success: true, notifications_generated: notifications.length }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error generating notifications:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

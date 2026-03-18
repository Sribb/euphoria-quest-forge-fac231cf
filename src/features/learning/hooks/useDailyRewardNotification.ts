import { useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/**
 * On mount, checks if the user has already received a daily-reward
 * notification today. If not, inserts one into the notifications table
 * so it appears in the bell icon panel.
 */
export const useDailyRewardNotification = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const sentRef = useRef(false);

  const { data: streakData } = useQuery({
    queryKey: ["streak-for-reward", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data } = await supabase
        .from("streaks")
        .select("current_streak, last_login_date")
        .eq("user_id", user.id)
        .single();
      return data;
    },
    enabled: !!user?.id,
  });

  useEffect(() => {
    if (!user?.id || !streakData || sentRef.current) return;

    const today = new Date().toISOString().split("T")[0];
    const lastLogin = streakData.last_login_date;

    // Already checked in today — no notification needed
    if (lastLogin === today) return;

    const storageKey = `daily_reward_notif_${user.id}_${today}`;
    if (localStorage.getItem(storageKey)) return;

    sentRef.current = true;
    localStorage.setItem(storageKey, "1");

    const streak = (streakData.current_streak || 0) + 1;

    supabase
      .from("notifications")
      .insert({
        user_id: user.id,
        title: "🎁 Daily Reward Ready",
        message: `Day ${streak} streak! Tap to claim your reward and keep your streak alive.`,
        notification_type: "daily_reward",
        category: "celebration",
        icon: "🎁",
        action_url: null, // handled inline
        is_read: false,
      })
      .then(() => {
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
      });
  }, [user?.id, streakData, queryClient]);
};

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const MILESTONES = [7, 30, 100, 365] as const;

interface StreakState {
  currentStreak: number;
  longestStreak: number;
  streakFreezes: number;
  freezeUsedToday: boolean;
  milestones: Record<number, boolean>;
  loading: boolean;
  checkedInToday: boolean;
}

export const useStreak = () => {
  const { user } = useAuth();
  const [state, setState] = useState<StreakState>({
    currentStreak: 0,
    longestStreak: 0,
    streakFreezes: 0,
    freezeUsedToday: false,
    milestones: { 7: false, 30: false, 100: false, 365: false },
    loading: true,
    checkedInToday: false,
  });

  const today = new Date().toISOString().split("T")[0];

  const load = useCallback(async () => {
    if (!user?.id) return;

    const { data, error } = await supabase
      .from("streaks")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (error || !data) {
      setState(prev => ({ ...prev, loading: false }));
      return;
    }

    const lastLogin = data.last_login_date;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];
    const isToday = lastLogin === today;
    const isYesterday = lastLogin === yesterdayStr;

    let currentStreak = data.current_streak;
    let longestStreak = data.longest_streak;
    let freezeUsedToday = data.freeze_used_today ?? false;
    let streakFreezes = data.streak_freezes ?? 0;
    let needsUpdate = false;

    // Daily reset of freeze_used_today
    if (!isToday && freezeUsedToday) {
      freezeUsedToday = false;
      needsUpdate = true;
    }

    // If missed yesterday and not checked in today
    if (!isToday && !isYesterday && lastLogin) {
      // Streak broken — check if we can auto-use a freeze
      if (streakFreezes > 0 && !freezeUsedToday) {
        streakFreezes -= 1;
        freezeUsedToday = true;
        needsUpdate = true;
        // Streak preserved by freeze
      } else {
        currentStreak = 0;
        needsUpdate = true;
      }
    }

    if (needsUpdate) {
      await supabase
        .from("streaks")
        .update({
          current_streak: currentStreak,
          streak_freezes: streakFreezes,
          freeze_used_today: freezeUsedToday,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id);
    }

    setState({
      currentStreak,
      longestStreak,
      streakFreezes,
      freezeUsedToday,
      milestones: {
        7: data.milestone_7 ?? false,
        30: data.milestone_30 ?? false,
        100: data.milestone_100 ?? false,
        365: data.milestone_365 ?? false,
      },
      loading: false,
      checkedInToday: isToday,
    });
  }, [user?.id, today]);

  useEffect(() => { load(); }, [load]);

  const checkIn = useCallback(async (): Promise<{ newMilestone?: number } | null> => {
    if (!user?.id || state.checkedInToday) return null;

    const newStreak = state.currentStreak + 1;
    const newLongest = Math.max(newStreak, state.longestStreak);

    // Check milestones
    const milestoneUpdates: Record<string, boolean> = {};
    let newMilestone: number | undefined;
    for (const m of MILESTONES) {
      if (newStreak >= m && !state.milestones[m]) {
        const col = `milestone_${m}` as const;
        milestoneUpdates[col] = true;
        newMilestone = m;
      }
    }

    await supabase
      .from("streaks")
      .update({
        current_streak: newStreak,
        longest_streak: newLongest,
        last_login_date: today,
        freeze_used_today: false,
        updated_at: new Date().toISOString(),
        ...milestoneUpdates,
      })
      .eq("user_id", user.id);

    setState(prev => ({
      ...prev,
      currentStreak: newStreak,
      longestStreak: newLongest,
      checkedInToday: true,
      milestones: {
        ...prev.milestones,
        ...(newMilestone ? { [newMilestone]: true } : {}),
      },
    }));

    return { newMilestone };
  }, [user?.id, state, today]);

  const useFreeze = useCallback(async (): Promise<boolean> => {
    if (!user?.id || state.streakFreezes <= 0 || state.freezeUsedToday) return false;

    const newFreezes = state.streakFreezes - 1;
    await supabase
      .from("streaks")
      .update({
        streak_freezes: newFreezes,
        freeze_used_today: true,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id);

    setState(prev => ({
      ...prev,
      streakFreezes: newFreezes,
      freezeUsedToday: true,
    }));

    toast.success("Streak freeze activated! ❄️ Your streak is protected for today.");
    return true;
  }, [user?.id, state]);

  const earnFreeze = useCallback(async (): Promise<boolean> => {
    if (!user?.id) return false;

    const newFreezes = state.streakFreezes + 1;
    await supabase
      .from("streaks")
      .update({
        streak_freezes: newFreezes,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id);

    setState(prev => ({ ...prev, streakFreezes: newFreezes }));
    toast.success("You earned a Streak Freeze! ❄️");
    return true;
  }, [user?.id, state.streakFreezes]);

  const nextMilestone = MILESTONES.find(m => state.currentStreak < m) || null;
  const progressToNextMilestone = nextMilestone
    ? (state.currentStreak / nextMilestone) * 100
    : 100;

  return {
    ...state,
    checkIn,
    useFreeze,
    earnFreeze,
    nextMilestone,
    progressToNextMilestone,
    refresh: load,
  };
};

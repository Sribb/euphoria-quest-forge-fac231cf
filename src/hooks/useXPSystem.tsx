import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { playLevelUp, playReward } from "@/lib/soundEffects";
import { fireConfetti } from "@/lib/confetti";
import { addWeeklyLeagueXP } from "@/features/leaderboard/utils/addWeeklyLeagueXP";

interface XPResult {
  old_xp: number;
  new_xp: number;
  xp_gained: number;
  old_level: number;
  new_level: number;
  leveled_up: boolean;
}

export interface LevelThreshold {
  level: number;
  xp_required: number;
  title: string;
  rewards: { coins?: number; avatar?: string };
}

// XP constants
export const XP_PER_CORRECT = 10;
export const XP_PERFECT_BONUS = 50;
export const XP_LESSON_COMPLETE = 25;
export const DOUBLE_XP_MULTIPLIER = 2;

// Avatar unlock definitions per level
export const AVATAR_UNLOCKS: Record<number, { name: string; emoji: string; category: string }> = {
  2: { name: "Starter Hat", emoji: "🧢", category: "Hats" },
  3: { name: "Bronze Frame", emoji: "🖼️", category: "Frames" },
  4: { name: "Bull Badge", emoji: "🐂", category: "Badges" },
  5: { name: "Green Theme", emoji: "🌿", category: "Themes" },
  6: { name: "Bear Badge", emoji: "🐻", category: "Badges" },
  7: { name: "Silver Frame", emoji: "🪞", category: "Frames" },
  8: { name: "Chart Background", emoji: "📊", category: "Backgrounds" },
  9: { name: "Rocket Badge", emoji: "🚀", category: "Badges" },
  10: { name: "Gold Frame", emoji: "🏅", category: "Frames" },
  15: { name: "Platinum Frame", emoji: "💎", category: "Frames" },
  20: { name: "Legendary Frame", emoji: "👑", category: "Frames" },
  25: { name: "Holographic Frame", emoji: "🌈", category: "Frames" },
  30: { name: "Titan Frame", emoji: "⚡", category: "Frames" },
  35: { name: "Vortex Frame", emoji: "🌀", category: "Frames" },
  40: { name: "Sovereign Frame", emoji: "🏛️", category: "Frames" },
  45: { name: "Oracle Frame", emoji: "🔮", category: "Frames" },
  50: { name: "Legendary Crown", emoji: "👑", category: "Special" },
};

export const useXPSystem = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [levelUpAnimation, setLevelUpAnimation] = useState<{ newLevel: number; title: string; avatar?: string } | null>(null);

  // Fetch user's current XP and level
  const { data: userStats, isLoading: statsLoading } = useQuery({
    queryKey: ["user-xp-stats", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("experience_points, level, mentor_mode_enabled")
        .eq("id", user.id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // Fetch all level thresholds
  const { data: levelThresholds } = useQuery({
    queryKey: ["xp-level-thresholds"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("xp_level_thresholds")
        .select("*")
        .order("level");
      if (error) throw error;
      return data as LevelThreshold[];
    },
  });

  // Check for active double XP event
  const { data: isDoubleXP } = useQuery({
    queryKey: ["double-xp-event"],
    queryFn: async () => {
      const now = new Date().toISOString();
      const { data } = await supabase
        .from("seasonal_themes")
        .select("*")
        .eq("is_active", true)
        .lte("start_date", now)
        .gte("end_date", now)
        .limit(1);

      if (data && data.length > 0) {
        const bonusRewards = data[0].bonus_rewards as any;
        return bonusRewards?.double_xp === true;
      }
      return false;
    },
    staleTime: 60000, // Cache for 1 min
  });

  const getMultiplier = () => (isDoubleXP ? DOUBLE_XP_MULTIPLIER : 1);

  // Add XP mutation
  const addXPMutation = useMutation({
    mutationFn: async (xpAmount: number) => {
      if (!user?.id) throw new Error("Not authenticated");
      const multiplied = xpAmount * getMultiplier();
      const { data, error } = await supabase.rpc("add_experience_points", {
        user_id_param: user.id,
        xp_amount: multiplied,
      });
      if (error) throw error;
      return { ...(data as unknown as XPResult), actualXP: multiplied };
    },
    onSuccess: (result: XPResult & { actualXP: number }) => {
      queryClient.invalidateQueries({ queryKey: ["user-xp-stats"] });
      
      if (result.leveled_up && levelThresholds) {
        const newLevelData = levelThresholds.find(l => l.level === result.new_level);
        const unlock = AVATAR_UNLOCKS[result.new_level];
        if (newLevelData) {
          setLevelUpAnimation({
            newLevel: result.new_level,
            title: newLevelData.title,
            avatar: unlock?.emoji,
          });
          const unlockMsg = unlock ? ` Unlocked: ${unlock.emoji} ${unlock.name}!` : "";
          toast.success(`🎉 Level ${result.new_level}! ${newLevelData.title}!${unlockMsg}`);
          playLevelUp();
          fireConfetti();
        }
      } else {
        playReward();
      }
    },
  });

  // Convenience methods for specific XP awards
  const awardCorrectAnswer = () => addXPMutation.mutate(XP_PER_CORRECT);
  const awardPerfectLesson = () => addXPMutation.mutate(XP_PERFECT_BONUS);
  const awardLessonComplete = () => addXPMutation.mutate(XP_LESSON_COMPLETE);

  // Toggle mentor mode
  const toggleMentorModeMutation = useMutation({
    mutationFn: async (enabled: boolean) => {
      if (!user?.id) throw new Error("Not authenticated");
      const { error } = await supabase
        .from("profiles")
        .update({ mentor_mode_enabled: enabled })
        .eq("id", user.id);
      if (error) throw error;
      return enabled;
    },
    onSuccess: (enabled) => {
      queryClient.invalidateQueries({ queryKey: ["user-xp-stats"] });
      toast.success(enabled ? "Mentor mode enabled" : "Mentor mode disabled");
    },
  });

  // Calculate XP progress to next level
  const getXPProgress = () => {
    if (!userStats || !levelThresholds) return { current: 0, required: 100, percentage: 0 };
    
    const currentLevel = userStats.level || 1;
    const currentThreshold = levelThresholds.find(l => l.level === currentLevel);
    const nextThreshold = levelThresholds.find(l => l.level === currentLevel + 1);
    
    if (!nextThreshold) return { current: userStats.experience_points, required: userStats.experience_points, percentage: 100 };
    
    const currentXP = userStats.experience_points - (currentThreshold?.xp_required || 0);
    const requiredXP = nextThreshold.xp_required - (currentThreshold?.xp_required || 0);
    const percentage = Math.min((currentXP / requiredXP) * 100, 100);
    
    return { current: currentXP, required: requiredXP, percentage };
  };

  // Get unlocked avatars for current level
  const getUnlockedAvatars = () => {
    const level = userStats?.level || 1;
    return Object.entries(AVATAR_UNLOCKS)
      .filter(([lvl]) => Number(lvl) <= level)
      .map(([lvl, data]) => ({ level: Number(lvl), ...data }));
  };

  // Get next avatar unlock
  const getNextAvatarUnlock = () => {
    const level = userStats?.level || 1;
    const nextLevel = Object.keys(AVATAR_UNLOCKS)
      .map(Number)
      .sort((a, b) => a - b)
      .find(lvl => lvl > level);
    return nextLevel ? { level: nextLevel, ...AVATAR_UNLOCKS[nextLevel] } : null;
  };

  const clearLevelUpAnimation = () => setLevelUpAnimation(null);

  return {
    userStats,
    levelThresholds,
    statsLoading,
    isDoubleXP: !!isDoubleXP,
    multiplier: getMultiplier(),
    addXP: addXPMutation.mutate,
    addXPAsync: addXPMutation.mutateAsync,
    isAddingXP: addXPMutation.isPending,
    awardCorrectAnswer,
    awardPerfectLesson,
    awardLessonComplete,
    toggleMentorMode: toggleMentorModeMutation.mutate,
    isTogglingMentorMode: toggleMentorModeMutation.isPending,
    getXPProgress,
    getUnlockedAvatars,
    getNextAvatarUnlock,
    levelUpAnimation,
    clearLevelUpAnimation,
  };
};

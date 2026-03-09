import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { ALL_BADGES, BadgeDefinition } from "../data/badgeDefinitions";

export interface BadgeWithProgress extends BadgeDefinition {
  earned: boolean;
  progress: number; // 0-100
  currentValue: number;
}

export function useBadgeProgress() {
  const { user } = useAuth();

  const { data: profile } = useQuery({
    queryKey: ["badge-profile", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("*").eq("id", user!.id).single();
      return data;
    },
    enabled: !!user?.id,
  });

  const { data: lessonProgress } = useQuery({
    queryKey: ["badge-lessons", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("user_lesson_progress").select("*, lessons(pathway)").eq("user_id", user!.id);
      return data || [];
    },
    enabled: !!user?.id,
  });

  const { data: streak } = useQuery({
    queryKey: ["badge-streak", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("streaks").select("*").eq("user_id", user!.id).single();
      return data;
    },
    enabled: !!user?.id,
  });

  const { data: orders } = useQuery({
    queryKey: ["badge-orders", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("orders").select("*").eq("user_id", user!.id).eq("status", "filled");
      return data || [];
    },
    enabled: !!user?.id,
  });

  const { data: gameSessions } = useQuery({
    queryKey: ["badge-games", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("game_sessions").select("*").eq("user_id", user!.id);
      return data || [];
    },
    enabled: !!user?.id,
  });

  const { data: posts } = useQuery({
    queryKey: ["badge-posts", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("posts").select("id").eq("user_id", user!.id);
      return data || [];
    },
    enabled: !!user?.id,
  });

  const { data: comments } = useQuery({
    queryKey: ["badge-comments", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("comments").select("id").eq("user_id", user!.id);
      return data || [];
    },
    enabled: !!user?.id,
  });

  const { data: likes } = useQuery({
    queryKey: ["badge-likes", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("likes").select("id").eq("user_id", user!.id);
      return data || [];
    },
    enabled: !!user?.id,
  });

  const { data: portfolio } = useQuery({
    queryKey: ["badge-portfolio", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("portfolios").select("*").eq("user_id", user!.id).single();
      return data;
    },
    enabled: !!user?.id,
  });

  const { data: portfolioAssets } = useQuery({
    queryKey: ["badge-assets", user?.id],
    queryFn: async () => {
      if (!portfolio?.id) return [];
      const { data } = await supabase.from("portfolio_assets").select("*").eq("portfolio_id", portfolio.id);
      return data || [];
    },
    enabled: !!portfolio?.id,
  });

  const { data: dcStreak } = useQuery({
    queryKey: ["badge-dc-streak", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("daily_challenge_streaks").select("*").eq("user_id", user!.id).single();
      return data;
    },
    enabled: !!user?.id,
  });

  const { data: onboarding } = useQuery({
    queryKey: ["badge-onboarding", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("user_onboarding").select("id").eq("user_id", user!.id).maybeSingle();
      return data;
    },
    enabled: !!user?.id,
  });

  const { data: weeklyLeague } = useQuery({
    queryKey: ["badge-league", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("weekly_leagues").select("*").eq("user_id", user!.id).order("week_start", { ascending: false }).limit(1).maybeSingle();
      return data;
    },
    enabled: !!user?.id,
  });

  const completedLessons = lessonProgress?.filter(l => l.completed) || [];
  const completedByPathway = (pathway: string) => completedLessons.filter((l: any) => l.lessons?.pathway === pathway).length;
  const uniquePathways = new Set(completedLessons.map((l: any) => l.lessons?.pathway).filter(Boolean));
  const perfectQuizzes = lessonProgress?.filter(l => l.quiz_score === 100).length || 0;
  const totalGameCoins = gameSessions?.reduce((s, g) => s + (g.coins_earned || 0), 0) || 0;
  const divisionMap: Record<string, number> = { bronze: 1, silver: 2, gold: 3, diamond: 4 };

  function getValue(type: string): number {
    switch (type) {
      case "lessons_completed": return completedLessons.length;
      case "pathway_personal-finance": return completedByPathway("personal-finance");
      case "pathway_investing": return completedByPathway("investing");
      case "pathway_trading": return completedByPathway("trading");
      case "pathway_corporate-finance": return completedByPathway("corporate-finance");
      case "pathway_alternative-assets": return completedByPathway("alternative-assets");
      case "perfect_quiz": return perfectQuizzes;
      case "all_pathways_started": return uniquePathways.size;
      case "streak_days": return Math.max(streak?.current_streak || 0, streak?.longest_streak || 0);
      case "freeze_used": return streak?.freeze_used_today ? 1 : 0;
      case "streak_rebuild": return streak?.current_streak || 0;
      case "trades_completed": return orders?.length || 0;
      case "unique_stocks_held": return portfolioAssets?.length || 0;
      case "portfolio_value": return portfolio?.total_value || 0;
      case "games_played": return gameSessions?.length || 0;
      case "high_score": return gameSessions?.reduce((max, g) => Math.max(max, g.score), 0) || 0;
      case "game_coins_earned": return totalGameCoins;
      case "posts_created": return posts?.length || 0;
      case "comments_made": return comments?.length || 0;
      case "likes_given": return likes?.length || 0;
      case "mentor_enabled": return profile?.mentor_mode_enabled ? 1 : 0;
      case "total_xp": return profile?.experience_points || 0;
      case "level": return profile?.level || 1;
      case "total_coins": return profile?.coins || 0;
      case "daily_challenges_completed": return dcStreak?.total_completed || 0;
      case "dc_streak": return dcStreak?.current_streak || 0;
      case "dc_correct_streak": return dcStreak?.total_correct || 0; // approximation
      case "dc_accuracy": return dcStreak?.total_completed ? Math.round((dcStreak.total_correct / dcStreak.total_completed) * 100) : 0;
      case "onboarding_completed": return onboarding ? 1 : 0;
      case "profile_completed": return (profile?.display_name && profile?.avatar_url) ? 1 : 0;
      case "league_promoted": return weeklyLeague?.is_promoted ? 1 : 0;
      case "league_division": return divisionMap[weeklyLeague?.division || "bronze"] || 1;
      default: return 0;
    }
  }

  const badges: BadgeWithProgress[] = ALL_BADGES.map(badge => {
    const currentValue = getValue(badge.requirement.type);
    const targetValue = badge.requirement.value;
    const progress = Math.min((currentValue / targetValue) * 100, 100);
    const earned = currentValue >= targetValue;
    return { ...badge, earned, progress, currentValue };
  });

  // Special badge: completionist
  const earnedCount = badges.filter(b => b.earned && b.id !== "completionist").length;
  const completionistIdx = badges.findIndex(b => b.id === "completionist");
  if (completionistIdx >= 0) {
    badges[completionistIdx].currentValue = earnedCount;
    badges[completionistIdx].progress = Math.min((earnedCount / 100) * 100, 100);
    badges[completionistIdx].earned = earnedCount >= 100;
  }

  const totalEarned = badges.filter(b => b.earned).length;
  const isLoading = !profile;

  return { badges, totalEarned, totalBadges: badges.length, isLoading };
}

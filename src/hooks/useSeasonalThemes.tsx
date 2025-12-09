import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface SeasonalTheme {
  id: string;
  theme_id: string;
  name: string;
  description: string | null;
  start_date: string;
  end_date: string;
  is_active: boolean;
  color_scheme: {
    primary?: string;
    secondary?: string;
    accent?: string;
    background?: string;
  };
  particle_effects: {
    type?: string;
    count?: number;
    color?: string;
  };
  bonus_rewards: {
    xp_multiplier?: number;
    coins_multiplier?: number;
  };
}

export const useSeasonalThemes = () => {
  // Fetch active seasonal theme
  const { data: activeTheme, isLoading } = useQuery({
    queryKey: ["active-seasonal-theme"],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from("seasonal_themes")
        .select("*")
        .eq("is_active", true)
        .lte("start_date", today)
        .gte("end_date", today)
        .limit(1)
        .maybeSingle();
      
      if (error) throw error;
      return data as SeasonalTheme | null;
    },
    staleTime: 60000, // Cache for 1 minute
  });

  // Fetch all seasonal themes
  const { data: allThemes } = useQuery({
    queryKey: ["all-seasonal-themes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("seasonal_themes")
        .select("*")
        .order("start_date", { ascending: false });
      
      if (error) throw error;
      return data as SeasonalTheme[];
    },
  });

  // Check if there's an active bonus
  const hasActiveBonus = activeTheme && (
    (activeTheme.bonus_rewards?.xp_multiplier && activeTheme.bonus_rewards.xp_multiplier > 1) ||
    (activeTheme.bonus_rewards?.coins_multiplier && activeTheme.bonus_rewards.coins_multiplier > 1)
  );

  // Apply XP bonus if active
  const applyXPBonus = (baseXP: number): number => {
    if (!activeTheme?.bonus_rewards?.xp_multiplier) return baseXP;
    return Math.round(baseXP * activeTheme.bonus_rewards.xp_multiplier);
  };

  // Apply coins bonus if active
  const applyCoinsBonus = (baseCoins: number): number => {
    if (!activeTheme?.bonus_rewards?.coins_multiplier) return baseCoins;
    return Math.round(baseCoins * activeTheme.bonus_rewards.coins_multiplier);
  };

  return {
    activeTheme,
    allThemes,
    isLoading,
    hasActiveBonus,
    applyXPBonus,
    applyCoinsBonus,
  };
};

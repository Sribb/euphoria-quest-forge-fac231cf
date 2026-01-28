import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import Toast from 'react-native-toast-message';

interface XPResult {
  old_xp: number;
  new_xp: number;
  xp_gained: number;
  old_level: number;
  new_level: number;
  leveled_up: boolean;
}

interface LevelThreshold {
  level: number;
  xp_required: number;
  title: string;
  rewards: { coins?: number };
}

export const useXPSystem = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [levelUpAnimation, setLevelUpAnimation] = useState<{ newLevel: number; title: string } | null>(null);

  const { data: userStats, isLoading: statsLoading } = useQuery({
    queryKey: ['user-xp-stats', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('experience_points, level, mentor_mode_enabled')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const { data: levelThresholds } = useQuery({
    queryKey: ['xp-level-thresholds'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('xp_level_thresholds')
        .select('*')
        .order('level');

      if (error) throw error;
      return data as LevelThreshold[];
    },
  });

  const addXPMutation = useMutation({
    mutationFn: async (xpAmount: number) => {
      if (!user?.id) throw new Error('Not authenticated');

      const { data, error } = await supabase.rpc('add_experience_points', {
        user_id_param: user.id,
        xp_amount: xpAmount,
      });

      if (error) throw error;
      return data as unknown as XPResult;
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['user-xp-stats'] });

      if (result.leveled_up && levelThresholds) {
        const newLevelData = levelThresholds.find((l) => l.level === result.new_level);
        if (newLevelData) {
          setLevelUpAnimation({ newLevel: result.new_level, title: newLevelData.title });
          Toast.show({
            type: 'success',
            text1: 'Level Up!',
            text2: `You're now a ${newLevelData.title}!`,
          });
        }
      }
    },
  });

  const toggleMentorModeMutation = useMutation({
    mutationFn: async (enabled: boolean) => {
      if (!user?.id) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('profiles')
        .update({ mentor_mode_enabled: enabled })
        .eq('id', user.id);

      if (error) throw error;
      return enabled;
    },
    onSuccess: (enabled) => {
      queryClient.invalidateQueries({ queryKey: ['user-xp-stats'] });
      Toast.show({
        type: 'success',
        text1: enabled ? 'Mentor mode enabled' : 'Mentor mode disabled',
      });
    },
  });

  const getXPProgress = () => {
    if (!userStats || !levelThresholds) return { current: 0, required: 100, percentage: 0 };

    const currentLevel = userStats.level || 1;
    const currentThreshold = levelThresholds.find((l) => l.level === currentLevel);
    const nextThreshold = levelThresholds.find((l) => l.level === currentLevel + 1);

    if (!nextThreshold)
      return { current: userStats.experience_points, required: userStats.experience_points, percentage: 100 };

    const currentXP = userStats.experience_points - (currentThreshold?.xp_required || 0);
    const requiredXP = nextThreshold.xp_required - (currentThreshold?.xp_required || 0);
    const percentage = Math.min((currentXP / requiredXP) * 100, 100);

    return { current: currentXP, required: requiredXP, percentage };
  };

  const clearLevelUpAnimation = () => setLevelUpAnimation(null);

  return {
    userStats,
    levelThresholds,
    statsLoading,
    addXP: addXPMutation.mutate,
    addXPAsync: addXPMutation.mutateAsync,
    isAddingXP: addXPMutation.isPending,
    toggleMentorMode: toggleMentorModeMutation.mutate,
    isTogglingMentorMode: toggleMentorModeMutation.isPending,
    getXPProgress,
    levelUpAnimation,
    clearLevelUpAnimation,
  };
};

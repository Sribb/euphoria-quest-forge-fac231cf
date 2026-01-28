import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import Toast from 'react-native-toast-message';

export interface Profile {
  id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  coins: number;
  experience_points: number;
  level: number;
  mentor_mode_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  requirement_type: string;
  requirement_value: number;
  created_at: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  earned_at: string;
}

export interface Streak {
  id: string;
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_login_date: string | null;
  created_at: string;
  updated_at: string;
}

export const useProfile = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single();

      if (error) throw error;
      return data as Profile;
    },
    enabled: !!user?.id,
  });

  const { data: achievements, isLoading: achievementsLoading } = useQuery({
    queryKey: ['achievements'],
    queryFn: async () => {
      const { data, error } = await supabase.from('achievements').select('*');

      if (error) throw error;
      return data as Achievement[];
    },
  });

  const { data: userAchievements, isLoading: userAchievementsLoading } = useQuery({
    queryKey: ['user-achievements', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase.from('user_achievements').select('*').eq('user_id', user.id);

      if (error) throw error;
      return data as UserAchievement[];
    },
    enabled: !!user?.id,
  });

  const { data: streak, isLoading: streakLoading } = useQuery({
    queryKey: ['streak', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data, error } = await supabase.from('streaks').select('*').eq('user_id', user.id).maybeSingle();

      if (error) throw error;
      return data as Streak | null;
    },
    enabled: !!user?.id,
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (updates: Partial<Profile>) => {
      if (!user?.id) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      Toast.show({
        type: 'success',
        text1: 'Profile Updated',
      });
    },
    onError: (error) => {
      Toast.show({
        type: 'error',
        text1: 'Update Failed',
        text2: error.message,
      });
    },
  });

  const getEarnedAchievements = () => {
    if (!achievements || !userAchievements) return [];

    return achievements.filter((a) => userAchievements.some((ua) => ua.achievement_id === a.id));
  };

  const getLockedAchievements = () => {
    if (!achievements || !userAchievements) return [];

    return achievements.filter((a) => !userAchievements.some((ua) => ua.achievement_id === a.id));
  };

  return {
    profile,
    achievements,
    userAchievements,
    streak,
    profileLoading,
    achievementsLoading,
    userAchievementsLoading,
    streakLoading,
    updateProfile: updateProfileMutation.mutate,
    isUpdating: updateProfileMutation.isPending,
    getEarnedAchievements,
    getLockedAchievements,
  };
};

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import Toast from 'react-native-toast-message';

export interface Game {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  base_reward: number;
  created_at: string;
}

export interface GameSession {
  id: string;
  user_id: string;
  game_id: string;
  score: number;
  coins_earned: number;
  completed: boolean;
  created_at: string;
}

export const useGames = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: games, isLoading: gamesLoading } = useQuery({
    queryKey: ['games'],
    queryFn: async () => {
      const { data, error } = await supabase.from('games').select('*').order('title');

      if (error) throw error;
      return data as Game[];
    },
  });

  const { data: sessions, isLoading: sessionsLoading } = useQuery({
    queryKey: ['game-sessions', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('game_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as GameSession[];
    },
    enabled: !!user?.id,
  });

  const startSessionMutation = useMutation({
    mutationFn: async (gameId: string) => {
      if (!user?.id) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('game_sessions')
        .insert({
          user_id: user.id,
          game_id: gameId,
          score: 0,
          coins_earned: 0,
          completed: false,
        })
        .select()
        .single();

      if (error) throw error;
      return data as GameSession;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['game-sessions'] });
    },
  });

  const completeSessionMutation = useMutation({
    mutationFn: async ({
      sessionId,
      score,
      coinsEarned,
    }: {
      sessionId: string;
      score: number;
      coinsEarned: number;
    }) => {
      if (!user?.id) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('game_sessions')
        .update({
          score,
          coins_earned: coinsEarned,
          completed: true,
        })
        .eq('id', sessionId);

      if (error) throw error;

      // Award coins
      await supabase.rpc('increment_coins', {
        user_id_param: user.id,
        amount: coinsEarned,
      });

      return { sessionId, score, coinsEarned };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['game-sessions'] });
      queryClient.invalidateQueries({ queryKey: ['user-xp-stats'] });
      Toast.show({
        type: 'success',
        text1: 'Game Complete!',
        text2: `You earned ${data.coinsEarned} coins!`,
      });
    },
  });

  const getGameStats = (gameId: string) => {
    const gameSessions = sessions?.filter((s) => s.game_id === gameId) ?? [];
    const completedSessions = gameSessions.filter((s) => s.completed);

    return {
      totalPlays: gameSessions.length,
      completedPlays: completedSessions.length,
      highScore: completedSessions.length > 0 ? Math.max(...completedSessions.map((s) => s.score)) : 0,
      totalCoins: completedSessions.reduce((sum, s) => sum + s.coins_earned, 0),
    };
  };

  return {
    games,
    sessions,
    gamesLoading,
    sessionsLoading,
    startSession: startSessionMutation.mutateAsync,
    completeSession: completeSessionMutation.mutate,
    isStarting: startSessionMutation.isPending,
    isCompleting: completeSessionMutation.isPending,
    getGameStats,
  };
};

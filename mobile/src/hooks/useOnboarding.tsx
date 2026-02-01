import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface OnboardingData {
  id: string;
  user_id: string;
  quiz_score: number;
  investment_level: string;
  completed_at: string;
  preferences: Record<string, unknown> | null;
}

export const useOnboarding = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: onboarding, isLoading, refetch } = useQuery({
    queryKey: ['onboarding', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from('user_onboarding')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return data as OnboardingData | null;
    },
    enabled: !!user?.id,
  });

  const completeOnboarding = useMutation({
    mutationFn: async ({ score, placementLesson }: { score: number; placementLesson: number }) => {
      if (!user?.id) throw new Error('User not authenticated');

      let investmentLevel = 'beginner';
      if (placementLesson >= 20) investmentLevel = 'advanced';
      else if (placementLesson >= 12) investmentLevel = 'intermediate';

      const { data: existing } = await supabase
        .from('user_onboarding')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from('user_onboarding')
          .update({
            quiz_score: score,
            investment_level: investmentLevel,
            preferences: { placement_lesson: placementLesson },
            completed_at: new Date().toISOString(),
          })
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('user_onboarding')
          .insert({
            user_id: user.id,
            quiz_score: score,
            investment_level: investmentLevel,
            preferences: { placement_lesson: placementLesson },
          });

        if (error) throw error;
      }

      // Mark lessons up to placement as viewable
      const { data: lessons } = await supabase
        .from('lessons')
        .select('id, order_index')
        .lte('order_index', placementLesson)
        .order('order_index');

      if (lessons && lessons.length > 0) {
        for (const lesson of lessons) {
          const { data: existingProgress } = await supabase
            .from('user_lesson_progress')
            .select('id')
            .eq('user_id', user.id)
            .eq('lesson_id', lesson.id)
            .maybeSingle();

          if (!existingProgress) {
            await supabase
              .from('user_lesson_progress')
              .insert({
                user_id: user.id,
                lesson_id: lesson.id,
                progress: 0,
                completed: false,
              });
          }
        }
      }

      return { score, placementLesson };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['onboarding'] });
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
    },
  });

  const getPlacementLesson = (): number => {
    if (!onboarding?.preferences) return 1;
    const prefs = onboarding.preferences as { placement_lesson?: number };
    return prefs.placement_lesson || 1;
  };

  return {
    onboarding,
    isLoading,
    hasCompletedOnboarding: !!onboarding,
    placementLesson: getPlacementLesson(),
    completeOnboarding,
    refetch,
  };
};

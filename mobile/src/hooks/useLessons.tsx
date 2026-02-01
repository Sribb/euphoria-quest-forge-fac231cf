import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useOnboarding } from '@/hooks/useOnboarding';
import Toast from 'react-native-toast-message';

export interface Lesson {
  id: string;
  title: string;
  description: string;
  content: string;
  difficulty: string;
  duration_minutes: number;
  order_index: number;
  is_locked: boolean;
  created_at: string;
  updated_at: string;
}

export interface LessonProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  progress: number;
  completed: boolean;
  completed_at: string | null;
  quiz_score: number | null;
  quiz_attempts: number | null;
  mastery_level: string | null;
  weak_areas: unknown | null;
  challenge_history: unknown | null;
  last_challenge_at: string | null;
  created_at: string;
  updated_at: string;
}

export const useLessons = () => {
  const { user } = useAuth();
  const { placementLesson } = useOnboarding();
  const queryClient = useQueryClient();

  const { data: lessons, isLoading: lessonsLoading } = useQuery({
    queryKey: ['lessons'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .order('order_index');

      if (error) throw error;
      return data as Lesson[];
    },
  });

  const { data: progress, isLoading: progressLoading } = useQuery({
    queryKey: ['lesson-progress', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('user_lesson_progress')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      return data as LessonProgress[];
    },
    enabled: !!user?.id,
  });

  const updateProgressMutation = useMutation({
    mutationFn: async ({
      lessonId,
      progressValue,
      completed,
      quizScore,
    }: {
      lessonId: string;
      progressValue: number;
      completed?: boolean;
      quizScore?: number;
    }) => {
      if (!user?.id) throw new Error('Not authenticated');

      const { data: existing } = await supabase
        .from('user_lesson_progress')
        .select('id')
        .eq('user_id', user.id)
        .eq('lesson_id', lessonId)
        .maybeSingle();

      const updateData: Record<string, unknown> = {
        progress: progressValue,
        updated_at: new Date().toISOString(),
      };

      if (completed !== undefined) {
        updateData.completed = completed;
        if (completed) {
          updateData.completed_at = new Date().toISOString();
        }
      }

      if (quizScore !== undefined) {
        updateData.quiz_score = quizScore;
        updateData.quiz_attempts = (existing as { quiz_attempts?: number })?.quiz_attempts
          ? (existing as { quiz_attempts: number }).quiz_attempts + 1
          : 1;
      }

      if (existing) {
        const { error } = await supabase
          .from('user_lesson_progress')
          .update(updateData)
          .eq('user_id', user.id)
          .eq('lesson_id', lessonId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('user_lesson_progress')
          .insert({
            user_id: user.id,
            lesson_id: lessonId,
            ...updateData,
          });

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lesson-progress'] });
    },
  });

  const completeLessonMutation = useMutation({
    mutationFn: async ({ lessonId, quizScore }: { lessonId: string; quizScore: number }) => {
      if (!user?.id) throw new Error('Not authenticated');

      await updateProgressMutation.mutateAsync({
        lessonId,
        progressValue: 100,
        completed: true,
        quizScore,
      });

      // Unlock next lesson if applicable
      const currentLesson = lessons?.find((l) => l.id === lessonId);
      if (currentLesson) {
        const nextLesson = lessons?.find((l) => l.order_index === currentLesson.order_index + 1);
        if (nextLesson) {
          const { data: existingNext } = await supabase
            .from('user_lesson_progress')
            .select('id')
            .eq('user_id', user.id)
            .eq('lesson_id', nextLesson.id)
            .maybeSingle();

          if (!existingNext) {
            await supabase.from('user_lesson_progress').insert({
              user_id: user.id,
              lesson_id: nextLesson.id,
              progress: 0,
              completed: false,
            });
          }
        }
      }

      return { lessonId, quizScore };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['lesson-progress'] });
      Toast.show({
        type: 'success',
        text1: 'Lesson Completed!',
        text2: `You scored ${data.quizScore}%`,
      });
    },
  });

  const getLessonStatus = (lessonId: string) => {
    const lessonProgress = progress?.find((p) => p.lesson_id === lessonId);
    const lesson = lessons?.find((l) => l.id === lessonId);

    if (!lesson) return { isLocked: true, isCompleted: false, progress: 0 };

    // Check if lesson is unlocked by placement
    const isUnlockedByPlacement = lesson.order_index <= placementLesson;
    const hasProgress = !!lessonProgress;

    return {
      isLocked: !isUnlockedByPlacement && !hasProgress,
      isCompleted: lessonProgress?.completed ?? false,
      progress: lessonProgress?.progress ?? 0,
      quizScore: lessonProgress?.quiz_score,
    };
  };

  const getNextLesson = () => {
    if (!lessons || !progress) return null;

    // Find first incomplete lesson that's unlocked
    for (const lesson of lessons) {
      const status = getLessonStatus(lesson.id);
      if (!status.isLocked && !status.isCompleted) {
        return lesson;
      }
    }

    return null;
  };

  const getCompletedCount = () => {
    return progress?.filter((p) => p.completed).length ?? 0;
  };

  return {
    lessons,
    progress,
    lessonsLoading,
    progressLoading,
    updateProgress: updateProgressMutation.mutate,
    completeLesson: completeLessonMutation.mutate,
    isUpdating: updateProgressMutation.isPending || completeLessonMutation.isPending,
    getLessonStatus,
    getNextLesson,
    getCompletedCount,
  };
};


import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { COURSES } from './courseIndex';

export function usePathwayProgress() {
  const { user } = useAuth();
  const qc = useQueryClient();

  const { data: progress = [] } = useQuery({
    queryKey: ['pathway-progress', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data } = await supabase
        .from('pathway_progress' as any)
        .select('*')
        .eq('user_id', user.id);
      return (data || []) as any[];
    },
    enabled: !!user?.id,
  });

  const completeLesson = useMutation({
    mutationFn: async (p: { courseId: string; lessonNumber: number; score: number; xpEarned: number }) => {
      if (!user?.id) throw new Error('Not authenticated');
      const { error } = await supabase.from('pathway_progress' as any).upsert({
        user_id: user.id,
        course_id: p.courseId,
        lesson_number: p.lessonNumber,
        completed: true,
        score: p.score,
        xp_earned: p.xpEarned,
        completed_at: new Date().toISOString(),
      } as any, { onConflict: 'user_id,course_id,lesson_number' });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['pathway-progress'] }),
  });

  const getCompletedLessons = (courseId: string) =>
    progress.filter((p: any) => p.course_id === courseId && p.completed).length;

  const isLessonCompleted = (courseId: string, lessonNumber: number) =>
    progress.some((p: any) => p.course_id === courseId && p.lesson_number === lessonNumber && p.completed);

  const getCompletedCourseCount = (tier: string) => {
    const tierCourses = COURSES.filter(c => c.tier === tier);
    return tierCourses.filter(course => getCompletedLessons(course.id) >= 50).length;
  };

  const isTierUnlocked = (tier: string) => {
    if (tier === 'easy') return true;
    if (tier === 'intermediate') return getCompletedCourseCount('easy') >= 2;
    if (tier === 'advanced') return getCompletedCourseCount('intermediate') >= 3;
    return false;
  };

  return { progress, completeLesson, getCompletedLessons, isLessonCompleted, isTierUnlocked, getCompletedCourseCount };
}

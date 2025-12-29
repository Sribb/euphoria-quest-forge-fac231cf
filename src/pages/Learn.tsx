import { LearningPathway } from "@/components/learn/LearningPathway";
import { ThreePhaseLessonViewer } from "@/components/learn/ThreePhaseLessonViewer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useOnboarding } from "@/hooks/useOnboarding";

interface LearnProps {
  onNavigate: (tab: string) => void;
  selectedLesson: string | null;
  onLessonSelect: (lessonId: string | null) => void;
}

const Learn = ({ onNavigate, selectedLesson, onLessonSelect }: LearnProps) => {
  const { user } = useAuth();
  const { placementLesson } = useOnboarding();

  const { data: lessons = [], isLoading, refetch } = useQuery({
    queryKey: ["lessons", user?.id, placementLesson],
    queryFn: async () => {
      // Fetch all lessons
      const { data: lessonsData, error: lessonsError } = await supabase
        .from("lessons")
        .select("*")
        .order("order_index");
      
      if (lessonsError) throw lessonsError;

      // Fetch user's progress if user is logged in
      if (!user?.id) {
        return lessonsData.map((lesson, index) => ({
          ...lesson,
          progress: 0,
          completed: false,
          duration: `${lesson.duration_minutes} min`,
          is_locked: index !== 0, // Only first lesson unlocked
        }));
      }

      const { data: progressData, error: progressError } = await supabase
        .from("user_lesson_progress")
        .select("*")
        .eq("user_id", user.id);
      
      if (progressError) throw progressError;

      // Merge lesson data with progress
      // A lesson is unlocked based on placement OR if previous lesson is completed
      return lessonsData.map((lesson, index) => {
        const progress = progressData?.find((p) => p.lesson_id === lesson.id);
        const isActuallyCompleted = progress?.completed || false;
        
        // A lesson is "skipped" if it's below placement level and user hasn't actually completed it
        const isSkippedByPlacement = lesson.order_index < placementLesson && !isActuallyCompleted;
        
        // For display purposes, skipped lessons show as completed
        const isCompleted = isActuallyCompleted || isSkippedByPlacement;
        
        // A lesson is unlocked if:
        // 1. Its order_index is <= placementLesson, OR
        // 2. The previous lesson is completed, OR
        // 3. It's already completed
        const previousLesson = index > 0 ? lessonsData[index - 1] : null;
        const previousProgress = previousLesson 
          ? progressData?.find((p) => p.lesson_id === previousLesson.id)
          : null;
        
        const isUnlockedByPlacement = lesson.order_index <= placementLesson;
        const isUnlockedByProgress = previousProgress?.completed || false;
        const isUnlocked = index === 0 || isUnlockedByPlacement || isUnlockedByProgress || isCompleted;
        
        // Generate random star rating (1-3) for completed lessons
        const stars = isCompleted ? Math.floor(Math.random() * 3) + 1 : 0;
        
        return {
          ...lesson,
          progress: progress?.progress || 0,
          completed: isCompleted,
          skippedByPlacement: isSkippedByPlacement,
          duration: `${lesson.duration_minutes} min`,
          is_locked: !isUnlocked,
          stars,
        };
      });
    },
    retry: 2,
    staleTime: 30000,
  });

  // Calculate overall progress
  const completedLessons = lessons.filter(l => l.completed).length;
  const totalLessons = lessons.length;

  if (selectedLesson) {
    return (
      <ThreePhaseLessonViewer 
        lessonId={selectedLesson} 
        onClose={() => {
          onLessonSelect(null);
          refetch();
        }} 
      />
    );
  }

  return (
    <div className="min-h-screen w-full bg-background">
      {/* Learning Pathway - Full Vertical Scroll */}
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[600px]">
          <div className="space-y-6 text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-muted-foreground">Loading your learning pathway...</p>
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto">
          <LearningPathway
            lessons={lessons}
            onLessonSelect={onLessonSelect}
            completedCount={completedLessons}
            totalCount={totalLessons}
          />
        </div>
      )}
    </div>
  );
};

export default Learn;

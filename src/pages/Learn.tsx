import { useState } from "react";
import { LearningPathway } from "@/features/learning/components/LearningPathway";
import { PathwaySelector } from "@/features/learning/components/PathwaySelector";
import { ThreePhaseLessonViewer } from "@/features/learning/components/ThreePhaseLessonViewer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useOnboarding } from "@/hooks/useOnboarding";

const PATHWAY_META: Record<string, { title: string; color: string }> = {
  investing: { title: "Investing Fundamentals", color: "from-emerald-500 to-teal-600" },
  corporate_finance: { title: "Corporate Finance", color: "from-blue-500 to-indigo-600" },
  personal_finance: { title: "Personal Finance", color: "from-violet-500 to-purple-600" },
  trading: { title: "Trading & Technical Analysis", color: "from-orange-500 to-amber-600" },
  alternatives: { title: "Alternative Assets", color: "from-rose-500 to-pink-600" },
};

interface LearnProps {
  onNavigate: (tab: string) => void;
  selectedLesson: string | null;
  onLessonSelect: (lessonId: string | null) => void;
}

const Learn = ({ onNavigate, selectedLesson, onLessonSelect }: LearnProps) => {
  const { user } = useAuth();
  const { placementLesson } = useOnboarding();
  const [selectedPathway, setSelectedPathway] = useState<string | null>(null);

  const { data: lessons = [], isLoading, refetch } = useQuery({
    queryKey: ["lessons", user?.id, placementLesson],
    queryFn: async () => {
      const { data: lessonsData, error: lessonsError } = await supabase
        .from("lessons")
        .select("*")
        .order("order_index");
      
      if (lessonsError) throw lessonsError;

      if (!user?.id) {
        return lessonsData.map((lesson, index) => ({
          ...lesson,
          progress: 0,
          completed: false,
          duration: `${lesson.duration_minutes} min`,
          is_locked: index !== 0,
        }));
      }

      const { data: progressData, error: progressError } = await supabase
        .from("user_lesson_progress")
        .select("*")
        .eq("user_id", user.id);
      
      if (progressError) throw progressError;

      return lessonsData.map((lesson, index) => {
        const progress = progressData?.find((p) => p.lesson_id === lesson.id);
        const isActuallyCompleted = progress?.completed || false;
        const isSkippedByPlacement = lesson.order_index < placementLesson && !isActuallyCompleted;
        const isCompleted = isActuallyCompleted || isSkippedByPlacement;
        
        const previousLesson = index > 0 ? lessonsData[index - 1] : null;
        const previousProgress = previousLesson 
          ? progressData?.find((p) => p.lesson_id === previousLesson.id)
          : null;
        
        const isUnlockedByPlacement = lesson.order_index <= placementLesson;
        const isUnlockedByProgress = previousProgress?.completed || false;
        const isUnlocked = index === 0 || isUnlockedByPlacement || isUnlockedByProgress || isCompleted;
        
        
        
        return {
          ...lesson,
          progress: progress?.progress || 0,
          completed: isCompleted,
          skippedByPlacement: isSkippedByPlacement,
          duration: `${lesson.duration_minutes} min`,
          is_locked: !isUnlocked,
        };
      });
    },
    retry: 2,
    staleTime: 30000,
  });

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

  if (selectedPathway) {
    const filtered = lessons.filter(l => (l as any).pathway === selectedPathway);
    const completedCount = filtered.filter(l => l.completed).length;
    const meta = PATHWAY_META[selectedPathway] || { title: selectedPathway, color: "" };

    return (
      <div className="min-h-screen w-full bg-background">
        <div className="max-w-7xl mx-auto">
          <LearningPathway
            lessons={filtered}
            onLessonSelect={onLessonSelect}
            completedCount={completedCount}
            totalCount={filtered.length}
            pathwayTitle={meta.title}
            pathwayColor={meta.color}
            onBack={() => setSelectedPathway(null)}
          />
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="space-y-6 text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading your learning pathways...</p>
        </div>
      </div>
    );
  }

  return (
    <PathwaySelector
      lessons={lessons}
      onSelectPathway={setSelectedPathway}
    />
  );
};

export default Learn;

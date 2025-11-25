import { useState } from "react";
import { LearningPathway } from "@/components/learn/LearningPathway";
import { ThreePhaseLessonViewer } from "@/components/learn/ThreePhaseLessonViewer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface LearnProps {
  onNavigate: (tab: string) => void;
  selectedLesson: string | null;
  onLessonSelect: (lessonId: string | null) => void;
}

const Learn = ({ onNavigate, selectedLesson, onLessonSelect }: LearnProps) => {
  const { user } = useAuth();

  const { data: lessons = [], isLoading, refetch } = useQuery({
    queryKey: ["lessons", user?.id],
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

      // Merge lesson data with progress and implement sequential unlocking
      let lastCompletedIndex = -1;
      return lessonsData.map((lesson, index) => {
        const progress = progressData?.find((p) => p.lesson_id === lesson.id);
        const isCompleted = progress?.completed || false;
        
        // Track the last completed lesson
        if (isCompleted && index > lastCompletedIndex) {
          lastCompletedIndex = index;
        }
        
        // A lesson is unlocked if:
        // 1. It's the first lesson, OR
        // 2. The previous lesson is completed
        const isUnlocked = index === 0 || (index > 0 && lastCompletedIndex >= index - 1);
        
        // Generate random star rating (1-3) for completed lessons
        const stars = isCompleted ? Math.floor(Math.random() * 3) + 1 : 0;
        
        return {
          ...lesson,
          progress: progress?.progress || 0,
          completed: isCompleted,
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
      <div className="px-8 py-8">
        {/* Expert-Sourced Content Banner */}
        <div className="mb-6 animate-fade-in">
          <div className="p-6 bg-primary/5 border border-primary/20 rounded-2xl">
            <p className="text-sm text-muted-foreground leading-relaxed">
              <span className="font-semibold text-foreground">📚 Expert-Sourced Content:</span> All challenges are based on proven principles from Warren Buffett, Benjamin Graham's "The Intelligent Investor", Peter Lynch's "One Up on Wall Street", Ray Dalio's "Principles", Investopedia educational modules, and Federal Reserve resources.
            </p>
          </div>
        </div>

        {/* Learning Pathway */}
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[600px]">
            <div className="space-y-6 text-center">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-muted-foreground">Loading your learning pathway...</p>
            </div>
          </div>
        ) : (
          <LearningPathway
            lessons={lessons}
            onLessonSelect={onLessonSelect}
            completedCount={completedLessons}
            totalCount={totalLessons}
          />
        )}
      </div>
    </div>
  );
};

export default Learn;

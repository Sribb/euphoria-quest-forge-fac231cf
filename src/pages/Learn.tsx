import { useState } from "react";
import { LearningPathway } from "@/components/learn/LearningPathway";
import { ThreePhaseLessonViewer } from "@/components/learn/ThreePhaseLessonViewer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useOnboarding } from "@/hooks/useOnboarding";
import { GraduationCap, Trophy, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface LearnProps {
  onNavigate: (tab: string) => void;
  selectedLesson: string | null;
  onLessonSelect: (lessonId: string | null) => void;
}

const Learn = ({ onNavigate, selectedLesson, onLessonSelect }: LearnProps) => {
  const { user } = useAuth();
  const { investmentLevel, quizScore, startingLesson } = useOnboarding();

  // Format investment level for display
  const getLevelDisplay = (level: string) => {
    switch (level) {
      case "advanced": return { label: "Advanced", color: "bg-purple-500/20 text-purple-400 border-purple-500/30" };
      case "intermediate": return { label: "Intermediate", color: "bg-primary/20 text-primary border-primary/30" };
      case "beginner-plus": return { label: "Beginner+", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" };
      default: return { label: "Beginner", color: "bg-green-500/20 text-green-400 border-green-500/30" };
    }
  };

  const levelDisplay = getLevelDisplay(investmentLevel);

  const { data: lessons = [], isLoading, refetch } = useQuery({
    queryKey: ["lessons", user?.id, startingLesson],
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
      // Lessons before starting lesson are marked as skipped/completed
      return lessonsData.map((lesson, index) => {
        const lessonNumber = index + 1;
        const progress = progressData?.find((p) => p.lesson_id === lesson.id);
        const isCompleted = progress?.completed || false;
        
        // If lesson is before starting lesson, mark it as skipped (unlocked but not required)
        const isBeforeStarting = lessonNumber < startingLesson;
        
        // A lesson is unlocked if:
        // 1. It's before or at the starting lesson from onboarding, OR
        // 2. The user has actually completed the previous lesson
        const previousLessonsCompleted = lessonsData
          .slice(Math.max(0, startingLesson - 1), index)
          .every((_, idx) => {
            const prevProgress = progressData?.find(
              (p) => p.lesson_id === lessonsData[startingLesson - 1 + idx]?.id
            );
            return prevProgress?.completed || false;
          });
        
        const isUnlocked = lessonNumber <= startingLesson || 
          (index === startingLesson - 1) || // Starting lesson is always unlocked
          (index > 0 && previousLessonsCompleted) ||
          isCompleted;
        
        // Generate random star rating (1-3) for completed lessons
        const stars = isCompleted ? Math.floor(Math.random() * 3) + 1 : 0;
        
        return {
          ...lesson,
          progress: isBeforeStarting && !isCompleted ? 100 : (progress?.progress || 0),
          completed: isBeforeStarting || isCompleted,
          skipped: isBeforeStarting && !isCompleted,
          duration: `${lesson.duration_minutes} min`,
          is_locked: !isUnlocked,
          stars: isBeforeStarting ? 0 : stars,
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
      {/* Placement Summary Banner */}
      {startingLesson > 1 && (
        <div className="px-8 pt-8 pb-2 animate-fade-in">
          <div className="max-w-7xl mx-auto p-4 bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20 rounded-2xl">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Your Placement Results</p>
                  <p className="text-sm text-muted-foreground">
                    Based on your assessment, you're starting at Lesson {startingLesson}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-center px-4 py-2 bg-background/50 rounded-lg">
                  <div className="flex items-center gap-1 text-sm font-bold text-primary">
                    <Trophy className="w-4 h-4" />
                    {quizScore}%
                  </div>
                  <p className="text-xs text-muted-foreground">Quiz Score</p>
                </div>
                <div className="text-center px-4 py-2 bg-background/50 rounded-lg">
                  <div className="flex items-center gap-1 text-sm font-bold text-primary">
                    <Target className="w-4 h-4" />
                    {startingLesson}
                  </div>
                  <p className="text-xs text-muted-foreground">Start Lesson</p>
                </div>
                <Badge className={`${levelDisplay.color} border`}>
                  {levelDisplay.label}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Expert-Sourced Content Banner */}
      <div className="px-8 pt-4 pb-4 animate-fade-in">
        <div className="max-w-7xl mx-auto p-6 bg-primary/5 border border-primary/20 rounded-2xl">
          <p className="text-sm text-muted-foreground leading-relaxed">
            <span className="font-semibold text-foreground">📚 Expert-Sourced Content:</span> All challenges are based on proven principles from Warren Buffett, Benjamin Graham's "The Intelligent Investor", Peter Lynch's "One Up on Wall Street", Ray Dalio's "Principles", Investopedia educational modules, and Federal Reserve resources.
          </p>
        </div>
      </div>

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
            startingLesson={startingLesson}
          />
        </div>
      )}
    </div>
  );
};

export default Learn;

import { useState } from "react";
import { LessonCard } from "@/components/learn/LessonCard";
import { InteractiveLessonViewer } from "@/components/learn/InteractiveLessonViewer";
import { BookOpen } from "lucide-react";
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

  const { data: lessons = [], isLoading } = useQuery({
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
        // For non-logged in users, only first lesson is unlocked
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

      // Merge lesson data with progress and handle sequential unlocking
      let lastCompletedIndex = -1;
      
      return lessonsData.map((lesson, index) => {
        const progress = progressData?.find((p) => p.lesson_id === lesson.id);
        const isCompleted = progress?.completed || false;
        
        if (isCompleted) {
          lastCompletedIndex = index;
        }
        
        // Lesson is unlocked if it's the first one or the previous one is completed
        const isUnlocked = index === 0 || index <= lastCompletedIndex + 1;
        
        return {
          ...lesson,
          progress: progress?.progress || 0,
          completed: isCompleted,
          duration: `${lesson.duration_minutes} min`,
          is_locked: !isUnlocked,
        };
      });
    },
    retry: 2,
    staleTime: 30000,
  });

  if (selectedLesson) {
    return <InteractiveLessonViewer lessonId={selectedLesson} onClose={() => onLessonSelect(null)} />;
  }

  const completedLessons = lessons.filter(l => l.completed).length;
  const totalLessons = lessons.length;
  const overallProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return (
    <div className="space-y-6 pb-24">
      <div className="flex items-center gap-3 animate-fade-in">
        <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
          <BookOpen className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Investment Learning Pathway</h1>
          <p className="text-muted-foreground">Master investing through 12 sequential lessons from legendary investors</p>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="bg-gradient-to-r from-primary/10 to-success/10 rounded-xl p-6 border border-primary/20 animate-fade-in" style={{ animationDelay: "100ms" }}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-bold text-lg">Your Learning Progress</h3>
            <p className="text-sm text-muted-foreground">
              {completedLessons} of {totalLessons} lessons completed
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              {overallProgress}%
            </div>
            <p className="text-xs text-muted-foreground">Complete</p>
          </div>
        </div>
        <div className="w-full bg-muted rounded-full h-3">
          <div 
            className="bg-gradient-primary h-3 rounded-full transition-all duration-500"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-card animate-pulse rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {lessons.map((lesson, index) => (
            <div
              key={lesson.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <LessonCard
                title={lesson.title}
                description={lesson.description}
                duration={lesson.duration}
                progress={lesson.progress}
                locked={lesson.is_locked}
                completed={lesson.completed}
                onClick={() => onLessonSelect(lesson.id)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Learn;

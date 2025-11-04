import { useState } from "react";
import { LessonCard } from "@/components/learn/LessonCard";
import { ThreePhaseLessonViewer } from "@/components/learn/ThreePhaseLessonViewer";
import { BookOpen, Trophy, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
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

  // Calculate overall progress
  const completedLessons = lessons.filter(l => l.completed).length;
  const totalLessons = lessons.length;
  const overallProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  // Calculate milestone achievements
  const getMilestone = () => {
    if (completedLessons >= 12) return { text: "Master Investor", icon: "🏆" };
    if (completedLessons >= 9) return { text: "Advanced Investor", icon: "💎" };
    if (completedLessons >= 6) return { text: "Intermediate Investor", icon: "⭐" };
    if (completedLessons >= 3) return { text: "Beginner Investor", icon: "🌱" };
    return { text: "New Investor", icon: "🎯" };
  };

  const milestone = getMilestone();

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
    <div className="space-y-6 pb-24 pt-4">
      <div className="animate-fade-in">
        <div className="flex items-center gap-3 mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onNavigate('dashboard')}
            className="hover-scale"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Interactive Investing Pathway</h1>
            <p className="text-muted-foreground">Master investing through 12 expert-sourced lessons</p>
          </div>
        </div>
        
        {/* Overall Progress Card */}
        <div className="mt-4 p-5 bg-card border border-border rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{milestone.icon}</span>
              <div>
                <p className="text-sm font-semibold">{milestone.text}</p>
                <p className="text-xs text-muted-foreground">Your current level</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-primary">{completedLessons}/{totalLessons}</p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </div>
          </div>
          <div className="w-full bg-muted rounded-full h-3">
            <div 
              className="bg-gradient-primary h-3 rounded-full transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
          {overallProgress === 100 && (
            <div className="mt-3 p-3 bg-success/10 border border-success/20 rounded-lg animate-fade-in">
              <p className="text-sm text-success font-semibold flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                Congratulations! You've completed the entire investing pathway!
              </p>
            </div>
          )}
        </div>

        {/* Learning Source Credit */}
        <div className="mt-4 p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <span className="font-semibold text-foreground">Expert-Sourced Content:</span> All lessons are based on proven principles from Warren Buffett, Benjamin Graham's "The Intelligent Investor", Peter Lynch's "One Up on Wall Street", Ray Dalio's "Principles", Investopedia educational modules, and Federal Reserve resources.
          </p>
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
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <LessonCard
                title={lesson.title}
                description={lesson.description}
                duration={lesson.duration}
                progress={lesson.progress}
                locked={lesson.is_locked}
                completed={lesson.completed}
                difficulty={lesson.difficulty}
                orderIndex={lesson.order_index}
                onClick={() => !lesson.is_locked && onLessonSelect(lesson.id)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Learn;

import { LessonCard } from "@/components/learn/LessonCard";
import { BookOpen } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface LearnProps {
  onNavigate: (tab: string) => void;
}

const Learn = ({ onNavigate }: LearnProps) => {
  const { user } = useAuth();

  const { data: lessons = [] } = useQuery({
    queryKey: ["lessons", user?.id],
    queryFn: async () => {
      // Fetch all lessons
      const { data: lessonsData, error: lessonsError } = await supabase
        .from("lessons")
        .select("*")
        .order("order_index");
      
      if (lessonsError) throw lessonsError;

      // Fetch user's progress for each lesson
      const { data: progressData, error: progressError } = await supabase
        .from("user_lesson_progress")
        .select("*")
        .eq("user_id", user?.id);
      
      if (progressError) throw progressError;

      // Merge lesson data with progress
      return lessonsData.map((lesson) => {
        const progress = progressData?.find((p) => p.lesson_id === lesson.id);
        return {
          ...lesson,
          progress: progress?.progress || 0,
          completed: progress?.completed || false,
          duration: `${lesson.duration_minutes} min`,
        };
      });
    },
    enabled: !!user?.id,
  });

  const handleLessonClick = () => {
    console.log("Opening lesson...");
  };

  return (
    <div className="space-y-6 pb-24">
      <div className="flex items-center gap-3 animate-fade-in">
        <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
          <BookOpen className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Learn</h1>
          <p className="text-muted-foreground">Master investing through interactive lessons</p>
        </div>
      </div>

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
              onClick={handleLessonClick}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Learn;

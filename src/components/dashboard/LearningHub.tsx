import { BookOpen, TrendingUp, Clock } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface LearningHubProps {
  onNavigate: (tab: string) => void;
}

export const LearningHub = ({ onNavigate }: LearningHubProps) => {
  const { user } = useAuth();

  const { data: progress } = useQuery({
    queryKey: ["learning_progress", user?.id],
    queryFn: async () => {
      const { data: lessonProgress } = await supabase
        .from("user_lesson_progress")
        .select("*")
        .eq("user_id", user?.id);

      const { data: lessons } = await supabase
        .from("lessons")
        .select("*");

      const completed = lessonProgress?.filter(p => p.completed).length || 0;
      const total = lessons?.length || 0;
      const inProgress = lessonProgress?.filter(p => !p.completed).length || 0;

      return {
        completed,
        total,
        inProgress,
        percentage: total > 0 ? (completed / total) * 100 : 0,
      };
    },
    enabled: !!user?.id,
  });

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          Learning Hub
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Overall Progress</span>
            <span className="font-bold">{progress?.completed}/{progress?.total} Lessons</span>
          </div>
          <Progress value={progress?.percentage || 0} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-success/10 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-success" />
              <span className="text-xs text-muted-foreground">Completed</span>
            </div>
            <p className="text-2xl font-bold text-success">{progress?.completed || 0}</p>
          </div>
          <div className="p-3 bg-warning/10 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-warning" />
              <span className="text-xs text-muted-foreground">In Progress</span>
            </div>
            <p className="text-2xl font-bold text-warning">{progress?.inProgress || 0}</p>
          </div>
        </div>

        <Button 
          className="w-full" 
          onClick={() => onNavigate("learn")}
        >
          Continue Learning
        </Button>
      </CardContent>
    </Card>
  );
};

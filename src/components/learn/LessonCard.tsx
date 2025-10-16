import { Play, CheckCircle2, Lock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface LessonCardProps {
  title: string;
  description: string;
  duration: string;
  progress: number;
  locked?: boolean;
  completed?: boolean;
  difficulty?: string;
  orderIndex?: number;
  onClick: () => void;
}

export const LessonCard = ({
  title,
  description,
  duration,
  progress,
  locked = false,
  completed = false,
  difficulty = "beginner",
  orderIndex = 1,
  onClick,
}: LessonCardProps) => {
  const getDifficultyColor = () => {
    switch (difficulty) {
      case "beginner":
        return "bg-success/10 text-success border-success/20";
      case "intermediate":
        return "bg-warning/10 text-warning border-warning/20";
      case "advanced":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card
      className={`p-5 transition-all duration-300 ${
        locked 
          ? "opacity-60 cursor-not-allowed" 
          : "cursor-pointer hover:scale-[1.02] hover:shadow-xl hover:border-primary/50"
      }`}
      onClick={!locked ? onClick : undefined}
    >
      <div className="flex items-start gap-4">
        <div className="relative">
          <div
            className={`w-14 h-14 rounded-xl flex items-center justify-center ${
              completed
                ? "bg-gradient-success"
                : locked
                ? "bg-muted"
                : "bg-gradient-primary"
            } shadow-md`}
          >
            {completed ? (
              <CheckCircle2 className="w-7 h-7 text-white" />
            ) : locked ? (
              <Lock className="w-7 h-7 text-muted-foreground" />
            ) : (
              <Play className="w-7 h-7 text-white" />
            )}
          </div>
          <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-background border-2 border-border flex items-center justify-center">
            <span className="text-xs font-bold">{orderIndex}</span>
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between mb-2 gap-2">
            <h3 className="font-bold text-lg leading-tight">{title}</h3>
            <div className="flex gap-2 flex-shrink-0">
              {completed && (
                <Badge className="bg-gradient-success text-xs">Completed</Badge>
              )}
              <Badge 
                variant="outline" 
                className={`text-xs ${getDifficultyColor()} capitalize`}
              >
                {difficulty}
              </Badge>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{description}</p>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xs text-muted-foreground font-medium">⏱️ {duration}</span>
            {!locked && !completed && (
              <Badge variant="outline" className="text-xs bg-primary/10">
                {progress}% Complete
              </Badge>
            )}
          </div>
          {!locked && !completed && progress > 0 && (
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-gradient-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
          {locked && (
            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
              <Lock className="w-3 h-3" />
              Complete previous lesson to unlock
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};

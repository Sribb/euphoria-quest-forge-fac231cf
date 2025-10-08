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
  onClick: () => void;
}

export const LessonCard = ({
  title,
  description,
  duration,
  progress,
  locked = false,
  completed = false,
  onClick,
}: LessonCardProps) => {
  return (
    <Card
      className={`p-5 transition-all duration-300 hover:shadow-lg ${
        locked ? "opacity-60 cursor-not-allowed" : "cursor-pointer hover:scale-[1.02]"
      }`}
      onClick={!locked ? onClick : undefined}
    >
      <div className="flex items-start gap-4">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            completed
              ? "bg-gradient-success"
              : locked
              ? "bg-muted"
              : "bg-gradient-primary"
          } shadow-md`}
        >
          {completed ? (
            <CheckCircle2 className="w-6 h-6 text-white" />
          ) : locked ? (
            <Lock className="w-6 h-6 text-muted-foreground" />
          ) : (
            <Play className="w-6 h-6 text-white" />
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-bold text-lg">{title}</h3>
            {completed && <Badge className="bg-gradient-success">Completed</Badge>}
          </div>
          <p className="text-sm text-muted-foreground mb-3">{description}</p>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xs text-muted-foreground">{duration}</span>
            {!locked && !completed && (
              <Badge variant="outline" className="text-xs">
                {progress}% Complete
              </Badge>
            )}
          </div>
          {!locked && !completed && <Progress value={progress} className="h-2" />}
          {locked && (
            <p className="text-xs text-muted-foreground mt-2">
              Complete previous lessons to unlock
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};

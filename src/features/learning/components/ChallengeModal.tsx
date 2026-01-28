import { X, Play, Star, Clock, BarChart } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStart: () => void;
  title: string;
  description: string;
  duration: string;
  difficulty: string;
  orderIndex: number;
  isCompleted: boolean;
  stars?: number;
}

export const ChallengeModal = ({
  isOpen,
  onClose,
  onStart,
  title,
  description,
  duration,
  difficulty,
  orderIndex,
  isCompleted,
  stars = 0,
}: ChallengeModalProps) => {
  const getDifficultyColor = (diff: string) => {
    switch (diff.toLowerCase()) {
      case "beginner": return "text-green-500 bg-green-500/10 border-green-500/20";
      case "intermediate": return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
      case "advanced": return "text-destructive bg-destructive/10 border-destructive/20";
      default: return "text-muted-foreground bg-muted/10 border-muted/20";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden border-primary/20 shadow-glow-soft">
        {/* Header with Gradient Background */}
        <div className="relative p-8 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent border-b border-border">
          <div className="absolute top-4 right-4">
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-card/50 hover:bg-card transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-start gap-4 mb-4">
            <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center text-2xl font-bold text-white shadow-glow">
              {orderIndex}
            </div>
            <div className="flex-1">
              <DialogTitle className="text-3xl font-bold text-foreground mb-2">
                {title}
              </DialogTitle>
              <div className="flex items-center gap-3 flex-wrap">
                <Badge className={cn("text-xs", getDifficultyColor(difficulty))}>
                  <BarChart className="w-3 h-3 mr-1" />
                  {difficulty}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  <Clock className="w-3 h-3 mr-1" />
                  {duration}
                </Badge>
                {isCompleted && (
                  <div className="flex items-center gap-1 bg-yellow-500/10 px-2 py-1 rounded-full border border-yellow-500/20">
                    {[1, 2, 3].map((i) => (
                      <Star
                        key={i}
                        className={cn(
                          "w-3 h-3",
                          i <= stars ? "text-yellow-500 fill-yellow-500" : "text-muted"
                        )}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <DialogDescription className="text-base text-foreground leading-relaxed mb-6">
            {description}
          </DialogDescription>

          {/* What You'll Learn Section */}
          <div className="mb-6 p-4 bg-primary/5 rounded-xl border border-primary/10">
            <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <span className="text-primary">📚</span> What You'll Learn
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">✓</span>
                <span>Core concepts and real-world applications</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">✓</span>
                <span>Interactive quizzes to test your knowledge</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">✓</span>
                <span>Practical examples from market scenarios</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={onStart}
              className="flex-1 h-12 text-base font-semibold bg-gradient-primary hover:opacity-90 shadow-glow"
            >
              <Play className="w-5 h-5 mr-2" />
              {isCompleted ? "Replay Challenge" : "Start Challenge"}
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="h-12 px-6"
            >
              Cancel
            </Button>
          </div>

          {isCompleted && (
            <p className="text-xs text-center text-muted-foreground mt-4">
              💡 Replay this challenge to improve your star rating and master the concepts
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

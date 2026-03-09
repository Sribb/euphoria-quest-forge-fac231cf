import { X, Play, Clock, BarChart, CheckCircle2, Crown } from "lucide-react";
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
  onStartLegendary?: () => void;
  title: string;
  description: string;
  duration: string;
  difficulty: string;
  orderIndex: number;
  isCompleted: boolean;
  isLegendaryCompleted?: boolean;
  stars?: number;
}

export const ChallengeModal = ({
  isOpen,
  onClose,
  onStart,
  onStartLegendary,
  title,
  description,
  duration,
  difficulty,
  orderIndex,
  isCompleted,
  isLegendaryCompleted = false,
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
        <div className={cn(
          "relative p-8 border-b border-border",
          isLegendaryCompleted
            ? "bg-gradient-to-br from-amber-500/20 via-amber-400/10 to-transparent"
            : "bg-gradient-to-br from-primary/20 via-primary/10 to-transparent"
        )}>
          <div className="absolute top-4 right-4">
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-card/50 hover:bg-card transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-start gap-4 mb-4">
            <div className={cn(
              "flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white shadow-glow",
              isLegendaryCompleted
                ? "bg-gradient-to-br from-amber-500 to-amber-600"
                : "bg-gradient-primary"
            )}>
              {isLegendaryCompleted ? <Crown className="w-8 h-8" /> : orderIndex}
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
                  <Badge variant="outline" className="text-xs text-primary border-primary/20 bg-primary/10">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Completed
                  </Badge>
                )}
                {isLegendaryCompleted && (
                  <Badge className="text-xs bg-amber-500/20 text-amber-500 border-amber-500/30">
                    <Crown className="w-3 h-3 mr-1" />
                    Legendary
                  </Badge>
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

          {/* Legendary Challenge Card */}
          {isCompleted && !isLegendaryCompleted && onStartLegendary && (
            <div className="mb-6 p-4 bg-amber-500/5 rounded-xl border border-amber-500/20">
              <div className="flex items-center gap-3 mb-2">
                <Crown className="w-5 h-5 text-amber-500" />
                <h4 className="font-bold text-foreground">Legendary Challenge Available!</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Think you've truly mastered this skill? Attempt the Legendary challenge — harder questions, no hints, no mercy. Score 90%+ to turn this skill gold!
              </p>
              <ul className="text-xs text-muted-foreground space-y-1 mb-3">
                <li>• All questions are hard difficulty</li>
                <li>• No explanations shown during the challenge</li>
                <li>• Only 2 wrong answers allowed</li>
                <li>• Rewards: 250 coins + 50 XP + gold badge</li>
              </ul>
              <Button
                onClick={onStartLegendary}
                className="w-full h-10 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold"
              >
                <Crown className="w-4 h-4 mr-2" />
                Attempt Legendary Challenge
              </Button>
            </div>
          )}

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

          {isCompleted && !onStartLegendary && (
            <p className="text-xs text-center text-muted-foreground mt-4">
              💡 Replay to reinforce your understanding
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

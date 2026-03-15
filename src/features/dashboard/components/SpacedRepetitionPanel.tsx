import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Brain, AlertTriangle, CheckCircle2, Clock, Zap, ChevronRight, RotateCcw, Trophy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSpacedRepetition, SpacedRepetitionItem } from "@/hooks/useSpacedRepetition";
import { useXPSystem } from "@/hooks/useXPSystem";
import { playCorrect, playIncorrect, playReward } from "@/lib/soundEffects";
import { fireSmallConfetti } from "@/lib/confetti";
import { toast } from "sonner";

export const SpacedRepetitionPanel = () => {
  const sr = useSpacedRepetition();
  const xp = useXPSystem();
  const [reviewingItem, setReviewingItem] = useState<SpacedRepetitionItem | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  // Refresh cracked status on mount
  // useEffect would cause re-renders; caller can trigger if needed

  if (sr.isLoading) return null;
  if (sr.totalCount === 0) return null;

  const masteryPercent = sr.totalCount > 0 ? Math.round((sr.masteredCount / sr.totalCount) * 100) : 0;

  const handleSelfAssess = (correct: boolean) => {
    if (!reviewingItem) return;
    if (correct) {
      playCorrect();
      xp.addXP(5);
    } else {
      playIncorrect();
    }
    sr.recordReview({ itemId: reviewingItem.id, correct });
    setReviewingItem(null);
    setShowAnswer(false);
  };

  const startReview = (item: SpacedRepetitionItem) => {
    setReviewingItem(item);
    setShowAnswer(false);
  };

  const getMasteryColor = (level: string) => {
    switch (level) {
      case "mastered": return "text-success";
      case "strong": return "text-primary";
      case "learning": return "text-warning";
      case "weak": return "text-destructive";
      default: return "text-muted-foreground";
    }
  };

  const getMasteryIcon = (level: string) => {
    switch (level) {
      case "mastered": return <Trophy className="w-3.5 h-3.5" />;
      case "strong": return <CheckCircle2 className="w-3.5 h-3.5" />;
      case "learning": return <Clock className="w-3.5 h-3.5" />;
      case "weak": return <AlertTriangle className="w-3.5 h-3.5" />;
      default: return <Brain className="w-3.5 h-3.5" />;
    }
  };

  return (
    <Card className="p-5 space-y-4 border-border/50">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-primary" />
          <h3 className="font-bold text-foreground">Skill Memory</h3>
        </div>
        <div className="flex items-center gap-2">
          {sr.dueCount > 0 && (
            <Badge variant="destructive" className="text-xs animate-pulse">
              {sr.dueCount} due
            </Badge>
          )}
          {sr.crackedCount > 0 && (
            <Badge variant="outline" className="text-xs text-warning border-warning/40">
              {sr.crackedCount} cracked
            </Badge>
          )}
        </div>
      </div>

      {/* Mastery progress */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{sr.masteredCount} of {sr.totalCount} concepts mastered</span>
          <span className="font-semibold text-foreground">{masteryPercent}%</span>
        </div>
        <Progress value={masteryPercent} className="h-2" />
      </div>

      {/* Review modal */}
      <AnimatePresence>
        {reviewingItem && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="rounded-xl border border-border bg-card p-4 space-y-3"
          >
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">Review</span>
            </div>
            <p className="text-base font-medium text-foreground">{reviewingItem.concept_label}</p>
            <p className="text-xs text-muted-foreground">
              Pathway: {reviewingItem.pathway} · Reviewed {reviewingItem.total_reviews}x
            </p>

            {!showAnswer ? (
              <Button size="sm" onClick={() => setShowAnswer(true)} className="w-full">
                Show & Self-Assess
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 border-destructive/40 text-destructive hover:bg-destructive/10"
                  onClick={() => handleSelfAssess(false)}
                >
                  Forgot
                </Button>
                <Button
                  size="sm"
                  className="flex-1 bg-success text-success-foreground hover:bg-success/90"
                  onClick={() => handleSelfAssess(true)}
                >
                  Got it! ✅
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Due / Cracked items list */}
      {!reviewingItem && sr.dueCount > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Ready for Review</p>
          {sr.dueItems.slice(0, 4).map((item) => (
            <button
              key={item.id}
              onClick={() => startReview(item)}
              className="w-full flex items-center justify-between p-2.5 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-left group"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className={getMasteryColor(item.mastery_level)}>
                  {item.is_cracked ? <AlertTriangle className="w-4 h-4 text-warning" /> : getMasteryIcon(item.mastery_level)}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{item.concept_label}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {item.is_cracked ? "⚠️ Cracked — needs review" : `Next: ${item.interval_days}d interval`}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
            </button>
          ))}
          {sr.dueCount > 4 && (
            <p className="text-xs text-center text-muted-foreground">
              +{sr.dueCount - 4} more concepts to review
            </p>
          )}
        </div>
      )}

      {/* All caught up state */}
      {!reviewingItem && sr.dueCount === 0 && sr.totalCount > 0 && (
        <div className="text-center py-3 space-y-1">
          <Zap className="w-6 h-6 text-success mx-auto" />
          <p className="text-sm font-semibold text-foreground">All caught up!</p>
          <p className="text-xs text-muted-foreground">Your skills are fresh. Keep learning!</p>
        </div>
      )}
    </Card>
  );
};

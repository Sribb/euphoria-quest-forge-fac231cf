import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Lightbulb, HelpCircle, BookOpen, Zap, CheckCircle, 
  XCircle, ChevronRight, Star, Trophy, Clock
} from "lucide-react";
import { cn } from "@/lib/utils";

export type CardType = "concept" | "quiz" | "case-study" | "simulation" | "challenge";

export interface FeedCardData {
  id: string;
  type: CardType;
  lessonTitle: string;
  pathway: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  xpReward: number;
  title: string;
  content: string;
  options?: { text: string; correct: boolean; explanation?: string }[];
  insight?: string;
  scenarioOutcome?: string;
}

interface FeedCardProps {
  card: FeedCardData;
  onComplete: (correct: boolean) => void;
  isActive: boolean;
}

const typeConfig: Record<CardType, { icon: typeof Lightbulb; label: string; accent: string }> = {
  concept: { icon: Lightbulb, label: "Concept", accent: "from-primary to-accent" },
  quiz: { icon: HelpCircle, label: "Quick Quiz", accent: "from-emerald-500 to-teal-500" },
  "case-study": { icon: BookOpen, label: "Case Study", accent: "from-blue-500 to-indigo-500" },
  simulation: { icon: Zap, label: "Simulation", accent: "from-orange-500 to-amber-500" },
  challenge: { icon: Trophy, label: "Challenge", accent: "from-yellow-500 to-orange-500" },
};

const difficultyColors = {
  beginner: "bg-success/20 text-success",
  intermediate: "bg-warning/20 text-warning",
  advanced: "bg-destructive/20 text-destructive",
};

export const FeedCard = ({ card, onComplete, isActive }: FeedCardProps) => {
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [tapped, setTapped] = useState(false);

  const config = typeConfig[card.type];
  const Icon = config.icon;

  const handleOptionSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    const correct = card.options?.[idx]?.correct ?? false;
    setTimeout(() => onComplete(correct), 1200);
  };

  const handleReveal = () => {
    if (!tapped) {
      setTapped(true);
      setTimeout(() => {
        setRevealed(true);
        onComplete(true);
      }, 600);
    }
  };

  return (
    <div className="h-full w-full flex items-center justify-center p-4 snap-start">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={isActive ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0.5, scale: 0.95, y: 30 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        className="w-full max-w-lg h-full max-h-[85vh] flex flex-col rounded-3xl border border-border bg-card overflow-hidden shadow-lg"
      >
        {/* Header bar */}
        <div className={cn("p-4 bg-gradient-to-r text-white", config.accent)}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon className="w-5 h-5" />
              <span className="text-sm font-bold uppercase tracking-wide">{config.label}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={cn("text-xs font-bold px-2 py-0.5 rounded-full bg-white/20")}>
                +{card.xpReward} XP
              </span>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full", "bg-white/20")}>
              {card.difficulty}
            </span>
            <span className="text-xs opacity-80 truncate">{card.lessonTitle}</span>
          </div>
        </div>

        {/* Card body */}
        <div className="flex-1 p-5 flex flex-col overflow-y-auto">
          <h2 className="text-xl font-bold text-foreground mb-4 leading-tight">{card.title}</h2>

          {/* Concept card - tap to reveal */}
          {card.type === "concept" && (
            <div className="flex-1 flex flex-col">
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">{card.content}</p>
              {card.insight && (
                <motion.button
                  onClick={handleReveal}
                  whileTap={{ scale: 0.97 }}
                  className={cn(
                    "mt-auto p-4 rounded-2xl border-2 border-dashed transition-all duration-300 text-left",
                    tapped
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50 hover:bg-muted/50"
                  )}
                >
                  <AnimatePresence mode="wait">
                    {!tapped ? (
                      <motion.div
                        key="prompt"
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-3 text-muted-foreground"
                      >
                        <Star className="w-5 h-5 text-primary" />
                        <span className="text-sm font-medium">Tap to reveal key insight</span>
                        <ChevronRight className="w-4 h-4 ml-auto" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="insight"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-foreground font-medium"
                      >
                        <div className="flex items-center gap-2 mb-2 text-primary">
                          <Lightbulb className="w-4 h-4" />
                          <span className="text-xs font-bold uppercase">Key Insight</span>
                        </div>
                        {card.insight}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              )}
            </div>
          )}

          {/* Quiz card */}
          {card.type === "quiz" && card.options && (
            <div className="flex-1 flex flex-col">
              <p className="text-muted-foreground text-sm mb-5">{card.content}</p>
              <div className="space-y-3">
                {card.options.map((opt, idx) => {
                  const isSelected = selected === idx;
                  const showResult = selected !== null;
                  const isCorrect = opt.correct;
                  return (
                    <motion.button
                      key={idx}
                      onClick={() => handleOptionSelect(idx)}
                      whileTap={selected === null ? { scale: 0.97 } : {}}
                      className={cn(
                        "w-full text-left p-4 rounded-2xl border-2 transition-all duration-300",
                        showResult && isCorrect && "border-success bg-success/10",
                        showResult && isSelected && !isCorrect && "border-destructive bg-destructive/10",
                        !showResult && "border-border hover:border-primary/50 hover:bg-muted/30",
                        showResult && !isSelected && !isCorrect && "opacity-50"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 flex-shrink-0",
                          showResult && isCorrect && "border-success text-success bg-success/10",
                          showResult && isSelected && !isCorrect && "border-destructive text-destructive bg-destructive/10",
                          !showResult && "border-muted-foreground/30 text-muted-foreground"
                        )}>
                          {showResult && isCorrect ? (
                            <CheckCircle className="w-5 h-5" />
                          ) : showResult && isSelected ? (
                            <XCircle className="w-5 h-5" />
                          ) : (
                            String.fromCharCode(65 + idx)
                          )}
                        </div>
                        <span className={cn(
                          "text-sm font-medium",
                          showResult && isCorrect ? "text-success" : 
                          showResult && isSelected && !isCorrect ? "text-destructive" : 
                          "text-foreground"
                        )}>
                          {opt.text}
                        </span>
                      </div>
                      {showResult && isSelected && opt.explanation && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="text-xs text-muted-foreground mt-2 ml-11"
                        >
                          {opt.explanation}
                        </motion.p>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Case study */}
          {card.type === "case-study" && (
            <div className="flex-1 flex flex-col">
              <div className="bg-muted/50 rounded-2xl p-4 mb-4 border border-border">
                <p className="text-sm text-foreground leading-relaxed">{card.content}</p>
              </div>
              {card.options && (
                <div className="space-y-2">
                  <p className="text-xs font-bold text-muted-foreground uppercase mb-2">What would you do?</p>
                  {card.options.map((opt, idx) => {
                    const isSelected = selected === idx;
                    const showResult = selected !== null;
                    return (
                      <motion.button
                        key={idx}
                        onClick={() => handleOptionSelect(idx)}
                        whileTap={selected === null ? { scale: 0.97 } : {}}
                        className={cn(
                          "w-full text-left p-3 rounded-xl border transition-all duration-300 text-sm",
                          showResult && opt.correct && "border-success bg-success/10 text-success",
                          showResult && isSelected && !opt.correct && "border-destructive bg-destructive/10 text-destructive",
                          !showResult && "border-border hover:border-primary/50 text-foreground"
                        )}
                      >
                        {opt.text}
                      </motion.button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Simulation */}
          {card.type === "simulation" && (
            <div className="flex-1 flex flex-col">
              <div className="bg-gradient-to-br from-muted/80 to-muted/30 rounded-2xl p-4 mb-4 border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-warning" />
                  <span className="text-xs font-bold text-warning uppercase">Live Scenario</span>
                </div>
                <p className="text-sm text-foreground leading-relaxed">{card.content}</p>
              </div>
              {card.options && (
                <div className="space-y-2 mt-auto">
                  {card.options.map((opt, idx) => {
                    const isSelected = selected === idx;
                    const showResult = selected !== null;
                    return (
                      <motion.button
                        key={idx}
                        onClick={() => handleOptionSelect(idx)}
                        whileTap={selected === null ? { scale: 0.97 } : {}}
                        className={cn(
                          "w-full text-left p-3 rounded-xl border transition-all text-sm font-medium",
                          showResult && opt.correct && "border-success bg-success/10",
                          showResult && isSelected && !opt.correct && "border-destructive bg-destructive/10",
                          !showResult && "border-border hover:border-primary/50"
                        )}
                      >
                        {opt.text}
                      </motion.button>
                    );
                  })}
                  {selected !== null && card.scenarioOutcome && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-primary/10 rounded-xl border border-primary/20 text-xs text-foreground"
                    >
                      <span className="font-bold text-primary">Outcome: </span>
                      {card.scenarioOutcome}
                    </motion.div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Challenge */}
          {card.type === "challenge" && (
            <div className="flex-1 flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                <Trophy className="w-5 h-5 text-warning" />
                <span className="text-xs font-bold text-warning uppercase">Mastery Challenge</span>
              </div>
              <p className="text-muted-foreground text-sm mb-5">{card.content}</p>
              {card.options && (
                <div className="space-y-2 mt-auto">
                  {card.options.map((opt, idx) => {
                    const isSelected = selected === idx;
                    const showResult = selected !== null;
                    return (
                      <motion.button
                        key={idx}
                        onClick={() => handleOptionSelect(idx)}
                        whileTap={selected === null ? { scale: 0.97 } : {}}
                        className={cn(
                          "w-full text-left p-3 rounded-xl border-2 transition-all text-sm font-medium",
                          showResult && opt.correct && "border-warning bg-warning/10 text-warning",
                          showResult && isSelected && !opt.correct && "border-destructive bg-destructive/10",
                          !showResult && "border-border hover:border-warning/50"
                        )}
                      >
                        {opt.text}
                      </motion.button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom progress indicator */}
        <div className="px-5 pb-4 pt-2 border-t border-border/50">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-medium">{card.pathway}</span>
            <span className="flex items-center gap-1">
              <Zap className="w-3 h-3 text-primary" />
              Swipe for next
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

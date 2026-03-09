import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Flame, Trophy, Zap, ChevronDown, ChevronUp, CheckCircle2, XCircle, Sparkles } from "lucide-react";
import { useDailyChallenge } from "../hooks/useDailyChallenge";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

export function DailyChallengeCard() {
  const { user } = useAuth();
  const [expanded, setExpanded] = useState(false);

  if (!user) return null;

  return (
    <div className="rounded-2xl border border-primary/20 bg-card overflow-hidden shadow-lg">
      <DailyChallengeInner expanded={expanded} setExpanded={setExpanded} />
    </div>
  );
}

function DailyChallengeInner({
  expanded,
  setExpanded,
}: {
  expanded: boolean;
  setExpanded: (v: boolean) => void;
}) {
  const {
    challenge,
    challengeDay,
    alreadyCompleted,
    selectedAnswer,
    isCorrect,
    revealed,
    streak,
    timeRemaining,
    loading,
    submitting,
    submitAnswer,
  } = useDailyChallenge();

  if (loading) {
    return (
      <div className="p-5 animate-pulse">
        <div className="h-6 w-48 bg-muted rounded mb-3" />
        <div className="h-4 w-72 bg-muted rounded" />
      </div>
    );
  }

  return (
    <>
      {/* Header — always visible */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 md:p-5 flex items-center justify-between text-left hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-md">
              <Zap className="h-5 w-5 text-white" />
            </div>
            {alreadyCompleted && (
              <CheckCircle2 className="h-4 w-4 text-emerald-500 absolute -top-1 -right-1 fill-background" />
            )}
          </div>
          <div>
            <h3 className="font-bold text-foreground text-sm md:text-base flex items-center gap-2">
              Daily Challenge
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                Day {challengeDay}
              </span>
            </h3>
            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {timeRemaining}
              </span>
              <span className="flex items-center gap-1">
                <Flame className="h-3 w-3 text-orange-500" />
                {streak.current} streak
              </span>
              <span className="flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-amber-500" />
                +{challenge.xpReward} XP
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {alreadyCompleted ? (
            <span className="text-xs font-medium text-emerald-600 bg-emerald-500/10 px-2 py-1 rounded-full">
              Completed ✓
            </span>
          ) : (
            <span className="text-xs font-medium text-amber-600 bg-amber-500/10 px-2 py-1 rounded-full animate-pulse">
              New!
            </span>
          )}
          {expanded ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </button>

      {/* Expandable body */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 md:px-5 pb-5 space-y-4">
              {/* Category & difficulty */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground font-medium">
                  {challenge.category}
                </span>
                <span
                  className={cn(
                    "text-[10px] px-2 py-0.5 rounded-full font-medium",
                    challenge.difficulty === "easy" && "bg-emerald-500/10 text-emerald-600",
                    challenge.difficulty === "medium" && "bg-amber-500/10 text-amber-600",
                    challenge.difficulty === "hard" && "bg-red-500/10 text-red-600"
                  )}
                >
                  {challenge.difficulty}
                </span>
              </div>

              {/* Question */}
              <p className="text-sm md:text-base font-semibold text-foreground leading-relaxed">
                {challenge.question}
              </p>

              {/* Options */}
              <div className="space-y-2">
                {challenge.options.map((option, idx) => {
                  const isSelected = selectedAnswer === idx;
                  const isCorrectOption = idx === challenge.correctIndex;
                  const showCorrect = revealed && isCorrectOption;
                  const showWrong = revealed && isSelected && !isCorrectOption;

                  return (
                    <motion.button
                      key={idx}
                      disabled={revealed || submitting}
                      onClick={() => submitAnswer(idx)}
                      whileTap={!revealed ? { scale: 0.98 } : {}}
                      className={cn(
                        "w-full text-left px-4 py-3 rounded-xl border text-sm transition-all duration-200",
                        !revealed && !submitting && "hover:border-primary/50 hover:bg-primary/5 cursor-pointer",
                        !revealed && "border-border bg-background",
                        showCorrect && "border-emerald-500 bg-emerald-500/10 text-emerald-700",
                        showWrong && "border-red-500 bg-red-500/10 text-red-700",
                        revealed && !showCorrect && !showWrong && "border-border/50 bg-muted/30 text-muted-foreground",
                        submitting && "opacity-60 cursor-wait"
                      )}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <span
                            className={cn(
                              "flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold",
                              showCorrect && "bg-emerald-500 text-white",
                              showWrong && "bg-red-500 text-white",
                              !revealed && "bg-muted text-muted-foreground",
                              revealed && !showCorrect && !showWrong && "bg-muted/50 text-muted-foreground/50"
                            )}
                          >
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span>{option}</span>
                        </div>
                        {showCorrect && <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />}
                        {showWrong && <XCircle className="h-4 w-4 text-red-500 flex-shrink-0" />}
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Explanation — after reveal */}
              <AnimatePresence>
                {revealed && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "p-4 rounded-xl text-sm leading-relaxed",
                      isCorrect
                        ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300"
                        : "bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300"
                    )}
                  >
                    <p className="font-semibold mb-1">
                      {isCorrect ? "🎯 Correct!" : "💡 Good try!"}
                    </p>
                    <p className="opacity-90">{challenge.explanation}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Stats bar */}
              <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/50">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Flame className="h-3.5 w-3.5 text-orange-500" />
                    {streak.current} day streak
                  </span>
                  <span className="flex items-center gap-1">
                    <Trophy className="h-3.5 w-3.5 text-amber-500" />
                    Best: {streak.longest}
                  </span>
                </div>
                <span>
                  {streak.totalCorrect}/{streak.totalCompleted} correct
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

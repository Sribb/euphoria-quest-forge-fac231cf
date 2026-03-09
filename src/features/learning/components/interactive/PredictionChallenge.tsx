import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { playCorrect, playIncorrect } from "@/lib/soundEffects";
import { fireSmallConfetti } from "@/lib/confetti";

interface PredictionChallengeProps {
  question: string;
  context?: string;
  options: string[];
  correctIndex: number;
  revealTitle: string;
  revealBody: string;
  revealVisual?: { type: 'stat'; value: string; label: string }
    | { type: 'comparison'; left: { label: string; value: string }; right: { label: string; value: string } };
  onWrongAnswer?: () => void;
  onCorrectAnswer?: () => void;
}

export const PredictionChallenge = ({
  question, context, options, correctIndex,
  revealTitle, revealBody, revealVisual,
  onWrongAnswer, onCorrectAnswer
}: PredictionChallengeProps) => {
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    if (idx === correctIndex) { playCorrect(); fireSmallConfetti(); onCorrectAnswer?.(); }
    else { playIncorrect(); onWrongAnswer?.(); }
    setTimeout(() => setRevealed(true), 800);
  };

  return (
    <div className="space-y-5">
      {/* Question phase */}
      <AnimatePresence mode="wait">
        {!revealed ? (
          <motion.div key="question" exit={{ opacity: 0, y: -20 }} className="space-y-4">
            <div className="p-5 rounded-2xl bg-primary/5 border border-primary/20">
              <p className="text-xs font-bold text-primary uppercase tracking-wider mb-2">🔮 Make Your Prediction</p>
              <h3 className="text-xl font-black text-foreground">{question}</h3>
              {context && <p className="text-sm text-muted-foreground mt-2">{context}</p>}
            </div>
            <div className="space-y-2">
              {options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  disabled={selected !== null}
                  className={`w-full p-4 rounded-xl text-left border-2 font-medium transition-all ${
                    selected === null
                      ? "border-border hover:border-primary bg-background text-foreground hover:bg-primary/5"
                      : i === selected
                        ? i === correctIndex
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-destructive bg-destructive/10 text-destructive"
                        : i === correctIndex
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border opacity-40 text-muted-foreground"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
            {selected !== null && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-muted-foreground text-center"
              >
                {selected === correctIndex ? "🎯 Great intuition!" : "🤔 Interesting guess..."} Revealing the answer...
              </motion.p>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="reveal"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="space-y-4"
          >
            <div className="p-5 rounded-2xl bg-accent/10 border border-accent/20">
              <p className="text-xs font-bold text-accent-foreground uppercase tracking-wider mb-2">💡 The Answer</p>
              <h3 className="text-xl font-black text-foreground">{revealTitle}</h3>
              <p className="text-muted-foreground mt-2 leading-relaxed">{revealBody}</p>
            </div>

            {revealVisual?.type === 'stat' && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="p-6 rounded-xl bg-primary/5 border border-primary/20 text-center"
              >
                <p className="text-4xl font-black text-primary">{revealVisual.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{revealVisual.label}</p>
              </motion.div>
            )}

            {revealVisual?.type === 'comparison' && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-2 gap-3"
              >
                <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 text-center">
                  <p className="text-2xl font-black text-primary">{revealVisual.left.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{revealVisual.left.label}</p>
                </div>
                <div className="p-4 rounded-xl bg-accent/10 border border-accent/20 text-center">
                  <p className="text-2xl font-black text-accent-foreground">{revealVisual.right.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{revealVisual.right.label}</p>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

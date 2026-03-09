import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { playCorrect, playIncorrect, playClick } from "@/lib/soundEffects";
import { fireSmallConfetti } from "@/lib/confetti";

interface MatchPairsProps {
  pairs: Array<{ left: string; right: string }>;
}

export const MatchPairs = ({ pairs }: MatchPairsProps) => {
  const [shuffledRight] = useState(() =>
    [...pairs.map(p => p.right)].sort(() => Math.random() - 0.5)
  );
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [matched, setMatched] = useState<Map<number, number>>(new Map());
  const [wrong, setWrong] = useState<{ left: number; right: number } | null>(null);

  const allMatched = matched.size === pairs.length;

  const handleLeftClick = (i: number) => {
    if (matched.has(i)) return;
    playClick();
    setSelectedLeft(i);
    setWrong(null);
  };

  const handleRightClick = useCallback((ri: number) => {
    if (selectedLeft === null) return;
    const rightVal = shuffledRight[ri];
    const correctRight = pairs[selectedLeft].right;

    if (rightVal === correctRight) {
      playCorrect();
      const newMatched = new Map(matched);
      newMatched.set(selectedLeft, ri);
      setMatched(newMatched);
      setSelectedLeft(null);
      if (newMatched.size === pairs.length) fireSmallConfetti();
    } else {
      playIncorrect();
      setWrong({ left: selectedLeft, right: ri });
      setTimeout(() => setWrong(null), 600);
    }
  }, [selectedLeft, matched, pairs, shuffledRight]);

  const matchedRightIndices = new Set(matched.values());

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        {/* Left column */}
        <div className="space-y-2">
          {pairs.map((p, i) => (
            <button
              key={i}
              onClick={() => handleLeftClick(i)}
              disabled={matched.has(i)}
              className={`w-full p-3 rounded-xl border-2 text-sm font-medium text-left transition-all ${
                matched.has(i) ? "border-primary/30 bg-primary/5 text-primary opacity-60" :
                selectedLeft === i ? "border-primary bg-primary/10 text-primary ring-2 ring-primary/20" :
                wrong?.left === i ? "border-destructive bg-destructive/5" :
                "border-border bg-background hover:border-primary/40 text-foreground"
              }`}
            >
              {p.left}
            </button>
          ))}
        </div>
        {/* Right column */}
        <div className="space-y-2">
          {shuffledRight.map((val, ri) => (
            <button
              key={ri}
              onClick={() => handleRightClick(ri)}
              disabled={matchedRightIndices.has(ri) || selectedLeft === null}
              className={`w-full p-3 rounded-xl border-2 text-sm font-medium text-left transition-all ${
                matchedRightIndices.has(ri) ? "border-primary/30 bg-primary/5 text-primary opacity-60" :
                wrong?.right === ri ? "border-destructive bg-destructive/5" :
                selectedLeft !== null ? "border-border bg-background hover:border-accent text-foreground cursor-pointer" :
                "border-border bg-muted/30 text-muted-foreground"
              }`}
            >
              {val}
            </button>
          ))}
        </div>
      </div>

      {allMatched && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-3 rounded-xl bg-primary/5 border border-primary/20 text-center text-sm font-bold text-primary"
        >
          🎯 All matched! Great job.
        </motion.div>
      )}
    </div>
  );
};

import { useState } from "react";
import { motion } from "framer-motion";
import { playClick } from "@/lib/soundEffects";

interface TapToRevealProps {
  cards: Array<{ front: string; back: string; emoji?: string }>;
}

export const TapToReveal = ({ cards }: TapToRevealProps) => {
  const [revealed, setRevealed] = useState<Set<number>>(new Set());

  const toggle = (i: number) => {
    playClick();
    setRevealed(prev => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i); else next.add(i);
      return next;
    });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {cards.map((card, i) => (
        <motion.button
          key={i}
          onClick={() => toggle(i)}
          whileTap={{ scale: 0.97 }}
          className="relative p-5 rounded-xl border-2 border-border bg-muted/30 text-left min-h-[100px] transition-all hover:border-primary/40"
        >
          {!revealed.has(i) ? (
            <div className="flex flex-col items-center justify-center gap-2 text-center">
              {/* emoji hidden */}
              <span className="font-semibold text-foreground text-base">{card.front}</span>
              <span className="text-xs text-muted-foreground mt-1">Tap to reveal</span>
            </div>
          ) : (
            <motion.div
              initial={{ rotateY: 90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              transition={{ duration: 0.25 }}
              className="text-sm text-foreground leading-relaxed"
            >
              <span className="font-bold text-primary block mb-1">{card.front}</span>
              {card.back}
            </motion.div>
          )}
        </motion.button>
      ))}
    </div>
  );
};

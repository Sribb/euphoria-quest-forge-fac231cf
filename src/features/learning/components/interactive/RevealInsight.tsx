import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb } from "lucide-react";
import { playClick, playMilestone } from "@/lib/soundEffects";

interface RevealInsightProps {
  setup: string;
  reveal: string;
  emoji?: string;
  principle: string;
  visual?: { type: 'stat'; value: string; label: string }
    | { type: 'comparison'; left: { label: string; value: string }; right: { label: string; value: string } };
}

export const RevealInsight = ({ setup, reveal, emoji, principle, visual }: RevealInsightProps) => {
  const [shown, setShown] = useState(false);

  const handleReveal = () => {
    if (shown) return;
    playMilestone();
    setShown(true);
  };

  return (
    <div className="space-y-5">
      {/* Setup */}
      <div className="p-5 rounded-2xl bg-muted/40 border border-border">
        {emoji && <span className="text-4xl block mb-2">{emoji}</span>}
        <p className="text-lg text-foreground font-medium leading-relaxed">{setup}</p>
      </div>

      {/* Reveal trigger */}
      <AnimatePresence mode="wait">
        {!shown ? (
          <motion.button
            key="trigger"
            onClick={handleReveal}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full p-5 rounded-2xl bg-primary/10 border-2 border-dashed border-primary/30 text-center cursor-pointer hover:bg-primary/15 transition-colors"
          >
            <Lightbulb className="w-8 h-8 mx-auto text-primary mb-2" />
            <p className="font-bold text-foreground">Tap to discover the answer</p>
            <p className="text-xs text-muted-foreground mt-1">What do you think?</p>
          </motion.button>
        ) : (
          <motion.div
            key="answer"
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-4"
          >
            {/* The reveal */}
            <div className="p-5 rounded-2xl bg-primary/5 border border-primary/20">
              <p className="text-xs font-bold text-primary uppercase tracking-wider mb-2">✨ Here's What Happens</p>
              <p className="text-lg text-foreground font-semibold leading-relaxed">{reveal}</p>
            </div>

            {/* Visual */}
            {visual?.type === 'stat' && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="p-6 rounded-xl bg-primary/5 border border-primary/20 text-center"
              >
                <p className="text-4xl font-black text-primary">{visual.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{visual.label}</p>
              </motion.div>
            )}

            {visual?.type === 'comparison' && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-2 gap-3"
              >
                <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 text-center">
                  <p className="text-2xl font-black text-primary">{visual.left.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{visual.left.label}</p>
                </div>
                <div className="p-4 rounded-xl bg-accent/10 border border-accent/20 text-center">
                  <p className="text-2xl font-black text-accent-foreground">{visual.right.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{visual.right.label}</p>
                </div>
              </motion.div>
            )}

            {/* Underlying principle */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="p-4 rounded-xl bg-muted/30 border border-border"
            >
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">🧠 The Principle</p>
              <p className="text-foreground font-medium leading-relaxed">{principle}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

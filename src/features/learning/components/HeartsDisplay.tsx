import { Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface HeartsDisplayProps {
  hearts: number;
  maxHearts: number;
  compact?: boolean;
}

export const HeartsDisplay = ({ hearts, maxHearts, compact = false }: HeartsDisplayProps) => {
  if (compact) {
    return (
      <div className="flex items-center gap-1.5">
        <Heart className={`w-5 h-5 ${hearts > 0 ? "fill-destructive text-destructive" : "text-muted-foreground"}`} />
        <span className={`text-sm font-bold ${hearts > 0 ? "text-destructive" : "text-muted-foreground"}`}>
          {hearts}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxHearts }).map((_, i) => (
        <AnimatePresence key={i} mode="wait">
          {i < hearts ? (
            <motion.div
              key={`full-${i}`}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.4, opacity: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <Heart className="w-6 h-6 fill-destructive text-destructive" />
            </motion.div>
          ) : (
            <motion.div
              key={`empty-${i}`}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
            >
              <Heart className="w-6 h-6 text-muted-foreground/30" />
            </motion.div>
          )}
        </AnimatePresence>
      ))}
    </div>
  );
};

import { motion } from "framer-motion";
import { ChevronUp } from "lucide-react";

interface SwipeUpIndicatorProps {
  label?: string;
  onSwipeUp: () => void;
}

const SwipeUpIndicator = ({ label = "Swipe up to view portfolio", onSwipeUp }: SwipeUpIndicatorProps) => {
  return (
    <motion.button
      onClick={onSwipeUp}
      className="flex flex-col items-center gap-1 text-white/80 hover:text-white transition-colors group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2 }}
    >
      {/* Animated chevrons */}
      <motion.div
        className="flex flex-col items-center -space-y-3"
        animate={{ y: [-2, 2, -2] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
      >
        <ChevronUp className="w-5 h-5 opacity-40 group-hover:opacity-70 transition-opacity" />
        <ChevronUp className="w-5 h-5 opacity-70 group-hover:opacity-90 transition-opacity" />
        <ChevronUp className="w-5 h-5 group-hover:text-emerald-400 transition-colors" />
      </motion.div>

      {/* Glowing line */}
      <motion.div
        className="w-16 h-0.5 rounded-full bg-gradient-to-r from-transparent via-white/50 to-transparent"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      {/* Label */}
      <motion.span
        className="text-xs font-medium tracking-wide uppercase mt-1"
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {label}
      </motion.span>
    </motion.button>
  );
};

export default SwipeUpIndicator;

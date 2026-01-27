import { motion, AnimatePresence } from "framer-motion";

interface RadialFlareProps {
  isActive: boolean;
  color?: "green" | "purple";
  onComplete?: () => void;
}

const RadialFlare = ({ isActive, color = "green", onComplete }: RadialFlareProps) => {
  const colorClasses = {
    green: "from-emerald-500/60 via-emerald-400/30 to-transparent",
    purple: "from-violet-500/60 via-violet-400/30 to-transparent",
  };

  const glowColor = color === "green" ? "rgba(16, 185, 129, 0.8)" : "rgba(139, 92, 246, 0.8)";

  return (
    <AnimatePresence>
      {isActive && (
        <>
          {/* Central burst */}
          <motion.div
            className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={`w-[200vmax] h-[200vmax] rounded-full bg-gradient-radial ${colorClasses[color]}`}
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 1, opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              onAnimationComplete={onComplete}
            />
          </motion.div>

          {/* Particle explosion */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="fixed z-50 pointer-events-none"
              style={{
                left: "50%",
                top: "50%",
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: glowColor,
                boxShadow: `0 0 20px ${glowColor}`,
              }}
              initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
              animate={{
                x: Math.cos((i * 30 * Math.PI) / 180) * 300,
                y: Math.sin((i * 30 * Math.PI) / 180) * 300,
                scale: 0,
                opacity: 0,
              }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          ))}

          {/* Ring pulse */}
          <motion.div
            className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center"
          >
            <motion.div
              className="rounded-full border-4"
              style={{ borderColor: glowColor }}
              initial={{ width: 0, height: 0, opacity: 1 }}
              animate={{ width: 400, height: 400, opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default RadialFlare;

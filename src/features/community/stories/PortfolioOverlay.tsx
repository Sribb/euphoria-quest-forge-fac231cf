import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, TrendingDown, Zap, X, ChevronDown, Sparkles } from "lucide-react";
import SlotMachineCounter from "./SlotMachineCounter";

interface Position {
  symbol: string;
  shares: number;
  value: number;
  change: number;
}

interface PortfolioOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  balance: number;
  positions: Position[];
  xpGained?: number;
}

const PortfolioOverlay = ({
  isOpen,
  onClose,
  balance,
  positions,
  xpGained = 0,
}: PortfolioOverlayProps) => {
  const totalChange = positions.reduce((sum, p) => sum + p.change, 0);
  const isPositive = totalChange >= 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[150] flex items-end justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Overlay panel - slides up like Instagram */}
          <motion.div
            className="relative w-full max-w-md mx-2 mb-2 overflow-hidden rounded-t-3xl"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 400 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.y > 100 || info.velocity.y > 500) {
                onClose();
              }
            }}
          >
            {/* Glassmorphic background with neon accents */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/95 to-black backdrop-blur-2xl" />
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-emerald-500/5" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />

            {/* Content */}
            <div className="relative p-5">
              {/* Drag handle */}
              <div className="flex justify-center mb-4">
                <div className="w-10 h-1 rounded-full bg-white/30" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-violet-400" />
                  <motion.h2
                    className="text-xl font-bold text-white"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    Trade Simulated
                  </motion.h2>
                </div>
                <motion.button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ChevronDown className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Balance display - hero section */}
              <motion.div
                className="relative text-center py-6 mb-5 rounded-2xl overflow-hidden"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.15 }}
              >
                {/* Gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 via-transparent to-emerald-500/20" />
                <div className="absolute inset-0 border border-white/10 rounded-2xl" />
                
                {/* Glow effects */}
                <div className="absolute top-0 left-1/4 w-1/2 h-24 bg-violet-500/20 blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-1/2 h-24 bg-emerald-500/20 blur-3xl" />

                <div className="relative z-10">
                  <p className="text-white/50 text-xs uppercase tracking-wider mb-2">Portfolio Balance</p>
                  <div className="flex items-center justify-center">
                    <SlotMachineCounter
                      value={balance}
                      prefix="$"
                      className="text-4xl font-black text-white"
                      duration={1.5}
                    />
                  </div>
                  <motion.div
                    className={`inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full ${
                      isPositive ? "bg-emerald-500/20" : "bg-red-500/20"
                    }`}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {isPositive ? (
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <TrendingDown className="w-3.5 h-3.5 text-red-400" />
                    )}
                    <span className={`font-semibold text-sm ${isPositive ? "text-emerald-400" : "text-red-400"}`}>
                      {isPositive ? "+" : ""}
                      {totalChange.toFixed(2)}%
                    </span>
                  </motion.div>
                </div>
              </motion.div>

              {/* Positions */}
              {positions.length > 0 && (
                <div className="space-y-2 mb-5">
                  <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Recent Positions</p>
                  {positions.map((position, index) => (
                    <motion.div
                      key={`${position.symbol}-${index}`}
                      className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.2 + index * 0.05 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center shadow-lg shadow-violet-500/20">
                          <span className="text-white font-bold text-xs">
                            {position.symbol.slice(0, 2)}
                          </span>
                        </div>
                        <div>
                          <p className="text-white font-semibold text-sm">{position.symbol}</p>
                          <p className="text-white/40 text-xs">{position.shares} shares</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-semibold text-sm">
                          ${position.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </p>
                        <p className={`text-xs ${position.change >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                          {position.change >= 0 ? "+" : ""}
                          {position.change.toFixed(2)}%
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* XP gained */}
              {xpGained > 0 && (
                <motion.div
                  className="flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 border border-emerald-500/20"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.4, type: "spring" }}
                >
                  <Zap className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400 font-bold text-sm">+{xpGained} XP Earned!</span>
                </motion.div>
              )}

              {/* Bottom safe area */}
              <div className="h-4" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PortfolioOverlay;

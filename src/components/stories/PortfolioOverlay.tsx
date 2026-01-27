import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, TrendingDown, Zap, X } from "lucide-react";
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
          className="fixed inset-0 z-[100] flex items-end justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Overlay panel */}
          <motion.div
            className="relative w-full max-w-lg mx-4 mb-4 overflow-hidden rounded-3xl"
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Glassmorphic background */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/70 to-black/80 backdrop-blur-2xl" />
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-emerald-500/10" />
            <div className="absolute inset-0 border border-white/10 rounded-3xl" />

            {/* Content */}
            <div className="relative p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <motion.h2
                  className="text-2xl font-bold text-white"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  Portfolio Updated
                </motion.h2>
                <motion.button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Balance display */}
              <motion.div
                className="text-center py-6 mb-6 rounded-2xl bg-gradient-to-br from-violet-500/20 to-emerald-500/20 border border-white/10"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <p className="text-white/60 text-sm mb-2">Total Balance</p>
                <div className="flex items-center justify-center">
                  <SlotMachineCounter
                    value={balance}
                    prefix="$"
                    className="text-4xl font-black text-white"
                    duration={2}
                  />
                </div>
                <motion.div
                  className={`flex items-center justify-center gap-1 mt-2 ${isPositive ? "text-emerald-400" : "text-red-400"}`}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  <span className="font-semibold">
                    {isPositive ? "+" : ""}{totalChange.toFixed(2)}%
                  </span>
                </motion.div>
              </motion.div>

              {/* Positions */}
              <div className="space-y-3 mb-6">
                {positions.map((position, index) => (
                  <motion.div
                    key={position.symbol}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center">
                        <span className="text-white font-bold text-xs">
                          {position.symbol.slice(0, 2)}
                        </span>
                      </div>
                      <div>
                        <p className="text-white font-semibold">{position.symbol}</p>
                        <p className="text-white/50 text-sm">{position.shares} shares</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-semibold">${position.value.toLocaleString()}</p>
                      <p className={`text-sm ${position.change >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                        {position.change >= 0 ? "+" : ""}{position.change.toFixed(2)}%
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* XP gained */}
              {xpGained > 0 && (
                <motion.div
                  className="flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 border border-emerald-500/30"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <Zap className="w-5 h-5 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">+{xpGained} XP Earned!</span>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PortfolioOverlay;

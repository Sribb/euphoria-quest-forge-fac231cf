import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SliderStickerProps {
  question: string;
  emoji: string;
  onAnswer: (value: number) => void;
  disabled?: boolean;
}

const SliderSticker = ({
  question,
  emoji,
  onAnswer,
  disabled = false,
}: SliderStickerProps) => {
  const [value, setValue] = useState(50);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled || hasAnswered) return;
    setValue(Number(e.target.value));
  };

  const handleSubmit = () => {
    if (disabled || hasAnswered) return;
    setHasAnswered(true);
    onAnswer(value);
  };

  return (
    <motion.div
      className="w-full max-w-sm mx-auto"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", damping: 20 }}
    >
      {/* Glassmorphic container */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl p-4">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-emerald-500/10 pointer-events-none" />
        
        {/* Question */}
        <motion.h3
          className="text-white font-bold text-lg mb-4 relative z-10 text-center"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {question}
        </motion.h3>

        {/* Slider track */}
        <div className="relative z-10 px-2 mb-4">
          <div className="relative h-8 flex items-center">
            {/* Track background */}
            <div className="absolute inset-0 flex items-center">
              <div 
                className="w-full h-2 rounded-full transition-all duration-300"
                style={{
                  background: `linear-gradient(to right, 
                    rgba(139, 92, 246, 0.3) 0%, 
                    rgba(139, 92, 246, ${0.3 + value * 0.007}) ${value}%, 
                    rgba(255,255,255,0.1) ${value}%, 
                    rgba(255,255,255,0.1) 100%)`
                }}
              />
            </div>

            {/* Custom slider input */}
            <input
              type="range"
              min="0"
              max="100"
              value={value}
              onChange={handleChange}
              onMouseDown={() => setIsDragging(true)}
              onMouseUp={() => setIsDragging(false)}
              onTouchStart={() => setIsDragging(true)}
              onTouchEnd={() => setIsDragging(false)}
              disabled={disabled || hasAnswered}
              className="absolute w-full h-full opacity-0 cursor-pointer z-10"
            />

            {/* Custom thumb with emoji */}
            <motion.div
              className="absolute pointer-events-none"
              style={{ left: `calc(${value}% - 18px)` }}
              animate={{ 
                scale: isDragging ? 1.3 : 1,
                y: isDragging ? -4 : 0 
              }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center text-xl shadow-lg shadow-violet-500/50 border-2 border-white/20">
                {emoji}
              </div>
            </motion.div>
          </div>

          {/* Labels */}
          <div className="flex justify-between mt-2 text-xs text-white/50">
            <span>Not at all</span>
            <span>Absolutely</span>
          </div>
        </div>

        {/* Submit button / Result */}
        <AnimatePresence mode="wait">
          {!hasAnswered ? (
            <motion.button
              key="submit"
              onClick={handleSubmit}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-500 to-violet-600 text-white font-bold text-sm hover:from-violet-400 hover:to-violet-500 transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              exit={{ opacity: 0, y: 10 }}
            >
              Submit
            </motion.button>
          ) : (
            <motion.div
              key="result"
              className="text-center py-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="text-white/70 text-sm">Your answer: </span>
              <span className="text-white font-bold">{value}%</span>
              <span className="ml-2 text-lg">{emoji}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Type indicator */}
        <div className="mt-3 flex justify-center">
          <span className="text-xs text-white/40 uppercase tracking-wider">
            📊 Slider
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default SliderSticker;

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X } from "lucide-react";

interface PollOption {
  id: string;
  text: string;
  votes?: number;
}

interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface InteractiveStickerProps {
  type: "poll" | "quiz";
  question: string;
  options: PollOption[] | QuizOption[];
  onAnswer: (optionId: string, isCorrect?: boolean) => void;
  disabled?: boolean;
}

const InteractiveSticker = ({
  type,
  question,
  options,
  onAnswer,
  disabled = false,
}: InteractiveStickerProps) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleSelect = (option: PollOption | QuizOption) => {
    if (disabled || selectedId) return;
    
    setSelectedId(option.id);
    setShowResult(true);
    
    const isCorrect = type === "quiz" ? (option as QuizOption).isCorrect : undefined;
    onAnswer(option.id, isCorrect);
  };

  const totalVotes = type === "poll" 
    ? (options as PollOption[]).reduce((sum, o) => sum + (o.votes || 0), 0) + 1
    : 0;

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
          className="text-white font-bold text-lg mb-4 relative z-10"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {question}
        </motion.h3>

        {/* Options */}
        <div className="space-y-2 relative z-10">
          {options.map((option, index) => {
            const isSelected = selectedId === option.id;
            const isQuiz = type === "quiz";
            const isCorrect = isQuiz && (option as QuizOption).isCorrect;
            const showCorrectness = isQuiz && showResult;
            
            // Calculate vote percentage for polls
            const votePercentage = type === "poll" && showResult
              ? Math.round((((option as PollOption).votes || 0) + (isSelected ? 1 : 0)) / totalVotes * 100)
              : 0;

            return (
              <motion.button
                key={option.id}
                onClick={() => handleSelect(option)}
                disabled={disabled || !!selectedId}
                className={`
                  relative w-full text-left p-3 rounded-xl overflow-hidden
                  transition-all duration-300 group
                  ${!selectedId ? "hover:bg-white/10 active:scale-[0.98]" : ""}
                  ${isSelected && !isQuiz ? "ring-2 ring-violet-500" : ""}
                  ${showCorrectness && isCorrect ? "ring-2 ring-emerald-500" : ""}
                  ${showCorrectness && isSelected && !isCorrect ? "ring-2 ring-red-500" : ""}
                `}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.15 + index * 0.05 }}
                whileTap={!selectedId ? { scale: 0.98 } : {}}
              >
                {/* Background bar for polls */}
                {type === "poll" && showResult && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-violet-500/30 to-violet-600/30"
                    initial={{ width: 0 }}
                    animate={{ width: `${votePercentage}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                )}

                {/* Content */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="text-white/90 font-medium">{option.text}</span>
                  
                  <AnimatePresence>
                    {showCorrectness && (
                      <motion.span
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        className={`
                          w-6 h-6 rounded-full flex items-center justify-center
                          ${isCorrect ? "bg-emerald-500" : "bg-red-500"}
                        `}
                      >
                        {isCorrect ? (
                          <Check className="w-4 h-4 text-white" />
                        ) : (
                          <X className="w-4 h-4 text-white" />
                        )}
                      </motion.span>
                    )}
                    
                    {type === "poll" && showResult && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-white/70 text-sm font-mono"
                      >
                        {votePercentage}%
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>

                {/* Hover glow */}
                {!selectedId && (
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-violet-500/5 to-emerald-500/5" />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Type indicator */}
        <div className="mt-3 flex justify-center">
          <span className="text-xs text-white/40 uppercase tracking-wider">
            {type === "poll" ? "📊 Poll" : "🧠 Quiz"}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default InteractiveSticker;

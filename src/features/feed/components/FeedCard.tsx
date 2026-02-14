import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lightbulb, HelpCircle, BookOpen, Zap, CheckCircle,
  XCircle, Trophy, Clock, TrendingUp, Sparkles, Heart,
  Share2, MessageCircle, ChevronUp
} from "lucide-react";
import { cn } from "@/lib/utils";

export type CardType = "concept" | "quiz" | "case-study" | "simulation" | "challenge";

export interface FeedCardData {
  id: string;
  type: CardType;
  lessonTitle: string;
  pathway: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  xpReward: number;
  title: string;
  content: string;
  options?: { text: string; correct: boolean; explanation?: string }[];
  insight?: string;
  scenarioOutcome?: string;
}

interface FeedCardProps {
  card: FeedCardData;
  onComplete: (correct: boolean) => void;
  isActive: boolean;
}

const visualThemes: Record<CardType, { emoji: string; bg: string; overlay: string }> = {
  concept: {
    emoji: "💡",
    bg: "from-violet-600 via-purple-700 to-indigo-900",
    overlay: "from-black/70 via-black/30 to-transparent",
  },
  quiz: {
    emoji: "🧠",
    bg: "from-emerald-600 via-teal-700 to-cyan-900",
    overlay: "from-black/70 via-black/30 to-transparent",
  },
  "case-study": {
    emoji: "📊",
    bg: "from-blue-600 via-indigo-700 to-purple-900",
    overlay: "from-black/70 via-black/30 to-transparent",
  },
  simulation: {
    emoji: "⚡",
    bg: "from-orange-500 via-red-600 to-pink-800",
    overlay: "from-black/70 via-black/30 to-transparent",
  },
  challenge: {
    emoji: "🏆",
    bg: "from-amber-500 via-yellow-600 to-orange-800",
    overlay: "from-black/70 via-black/30 to-transparent",
  },
};

const typeLabels: Record<CardType, string> = {
  concept: "LEARN",
  quiz: "QUIZ",
  "case-study": "CASE STUDY",
  simulation: "SCENARIO",
  challenge: "CHALLENGE",
};

export const FeedCard = ({ card, onComplete, isActive }: FeedCardProps) => {
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [tapped, setTapped] = useState(false);
  const [liked, setLiked] = useState(false);

  const theme = visualThemes[card.type] || visualThemes.concept;

  const handleOptionSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    const correct = card.options?.[idx]?.correct ?? false;
    setTimeout(() => onComplete(correct), 1000);
  };

  const handleReveal = () => {
    if (!tapped) {
      setTapped(true);
      setTimeout(() => {
        setRevealed(true);
        onComplete(true);
      }, 500);
    }
  };

  return (
    <div className="h-full w-full relative overflow-hidden bg-black">
      {/* Full-screen gradient background */}
      <div className={cn("absolute inset-0 bg-gradient-to-br", theme.bg)} />

      {/* Animated pattern overlay */}
      <div className="absolute inset-0 opacity-[0.07]" style={{
        backgroundImage: `radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px), radial-gradient(circle at 60% 80%, white 1px, transparent 1px)`,
        backgroundSize: "60px 60px, 80px 80px, 40px 40px",
      }} />

      {/* Large emoji visual */}
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={isActive ? { scale: 1, rotate: 0 } : { scale: 0.5, rotate: -20 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="absolute top-[15%] left-1/2 -translate-x-1/2 text-[120px] md:text-[160px] opacity-20 select-none pointer-events-none"
      >
        {theme.emoji}
      </motion.div>

      {/* Bottom gradient for text readability */}
      <div className={cn("absolute inset-0 bg-gradient-to-t", theme.overlay)} />

      {/* Top bar - type label + XP */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
        transition={{ delay: 0.2 }}
        className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-10"
      >
        <span className="px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-white text-[11px] font-black tracking-widest uppercase">
          {typeLabels[card.type]}
        </span>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md">
          <Zap className="w-3.5 h-3.5 text-yellow-400" />
          <span className="text-white text-xs font-bold">+{card.xpReward} XP</span>
        </div>
      </motion.div>

      {/* Right side social actions */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
        transition={{ delay: 0.4 }}
        className="absolute right-3 bottom-[30%] flex flex-col items-center gap-5 z-10"
      >
        <button onClick={() => setLiked(!liked)} className="flex flex-col items-center gap-1">
          <div className={cn(
            "w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md transition-colors",
            liked ? "bg-red-500/80" : "bg-white/15"
          )}>
            <Heart className={cn("w-5 h-5", liked ? "text-white fill-white" : "text-white")} />
          </div>
          <span className="text-white text-[10px] font-bold">{liked ? "Liked" : "Like"}</span>
        </button>
        <button className="flex flex-col items-center gap-1">
          <div className="w-11 h-11 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center">
            <Share2 className="w-5 h-5 text-white" />
          </div>
          <span className="text-white text-[10px] font-bold">Share</span>
        </button>
        <button className="flex flex-col items-center gap-1">
          <div className="w-11 h-11 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-white text-[10px] font-bold">Save</span>
        </button>
      </motion.div>

      {/* Main content area - bottom aligned like TikTok */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        className="absolute bottom-0 left-0 right-16 p-5 pb-6 z-10 flex flex-col gap-3"
      >
        {/* Pathway tag */}
        <div className="flex items-center gap-2">
          <span className="text-white/60 text-xs font-semibold">#{card.pathway.replace(/\s+/g, "")}</span>
          <span className="text-white/40">•</span>
          <span className="text-white/60 text-xs font-semibold capitalize">#{card.difficulty}</span>
        </div>

        {/* Title */}
        <h2 className="text-white text-2xl md:text-3xl font-black leading-tight drop-shadow-lg">
          {card.title}
        </h2>

        {/* Content varies by type */}
        {card.type === "concept" && (
          <div className="space-y-3">
            <p className="text-white/80 text-sm leading-relaxed line-clamp-3">{card.content}</p>
            {card.insight && (
              <motion.button
                onClick={handleReveal}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "w-full p-3.5 rounded-2xl backdrop-blur-md transition-all text-left",
                  tapped ? "bg-white/25" : "bg-white/10 active:bg-white/20"
                )}
              >
                <AnimatePresence mode="wait">
                  {!tapped ? (
                    <motion.div key="prompt" exit={{ opacity: 0 }} className="flex items-center gap-3">
                      <Lightbulb className="w-5 h-5 text-yellow-400" />
                      <span className="text-white text-sm font-bold">Tap to reveal insight ✨</span>
                    </motion.div>
                  ) : (
                    <motion.p
                      key="insight"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-white text-sm font-medium leading-relaxed"
                    >
                      💡 {card.insight}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.button>
            )}
          </div>
        )}

        {(card.type === "quiz" || card.type === "case-study" || card.type === "simulation" || card.type === "challenge") && card.options && (
          <div className="space-y-2.5">
            <p className="text-white/80 text-sm leading-relaxed">{card.content}</p>
            {card.options.map((opt, idx) => {
              const isSelected = selected === idx;
              const showResult = selected !== null;
              const isCorrect = opt.correct;
              return (
                <motion.button
                  key={idx}
                  onClick={() => handleOptionSelect(idx)}
                  whileTap={selected === null ? { scale: 0.97 } : {}}
                  className={cn(
                    "w-full text-left p-3.5 rounded-2xl backdrop-blur-md transition-all duration-300 border",
                    showResult && isCorrect && "bg-emerald-500/30 border-emerald-400/60",
                    showResult && isSelected && !isCorrect && "bg-red-500/30 border-red-400/60",
                    showResult && !isSelected && !isCorrect && "opacity-30 border-transparent bg-white/5",
                    !showResult && "bg-white/10 border-white/10 active:bg-white/20"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-7 h-7 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 border",
                      showResult && isCorrect && "border-emerald-400 text-emerald-400",
                      showResult && isSelected && !isCorrect && "border-red-400 text-red-400",
                      !showResult && "border-white/40 text-white/70"
                    )}>
                      {showResult && isCorrect ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : showResult && isSelected ? (
                        <XCircle className="w-4 h-4" />
                      ) : (
                        String.fromCharCode(65 + idx)
                      )}
                    </div>
                    <span className="text-white text-sm font-semibold">{opt.text}</span>
                  </div>
                  {showResult && isSelected && opt.explanation && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="text-white/60 text-xs mt-2 ml-10"
                    >
                      {opt.explanation}
                    </motion.p>
                  )}
                </motion.button>
              );
            })}
            {selected !== null && card.scenarioOutcome && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-2xl bg-white/10 backdrop-blur-md text-white text-xs"
              >
                <span className="font-bold text-yellow-400">📈 Outcome: </span>
                {card.scenarioOutcome}
              </motion.div>
            )}
          </div>
        )}

        {/* Scroll hint */}
        <div className="flex items-center gap-1.5 text-white/30 mt-1">
          <ChevronUp className="w-3.5 h-3.5 animate-bounce" />
          <span className="text-[10px] font-medium">Scroll for more</span>
        </div>
      </motion.div>
    </div>
  );
};

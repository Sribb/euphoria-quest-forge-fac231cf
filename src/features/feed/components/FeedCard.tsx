import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import {
  Lightbulb, HelpCircle, Zap, CheckCircle,
  XCircle, Trophy, Heart, Share2, Bookmark,
  ChevronUp, AlertTriangle, Sparkles, TrendingUp,
  Brain, Eye, BarChart3
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";

export type CardType =
  | "concept" | "quiz" | "case-study" | "simulation" | "challenge"
  | "myth" | "shock" | "rare-insight" | "slider" | "poll" | "counter";

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
  sliderConfig?: { answer: number; unit: string; min: number; max: number; explanation: string };
  counterConfig?: { from: number; to: number; suffix: string; prefix: string; duration: number; context: string };
}

interface FeedCardProps {
  card: FeedCardData;
  onComplete: (correct: boolean) => void;
  isActive: boolean;
}

const visualThemes: Record<string, { emoji: string; bg: string; accent: string; glow: string }> = {
  concept: { emoji: "💡", bg: "from-violet-600 via-purple-700 to-indigo-900", accent: "violet", glow: "shadow-[0_0_80px_rgba(139,92,246,0.3)]" },
  quiz: { emoji: "🧠", bg: "from-emerald-500 via-teal-600 to-cyan-900", accent: "emerald", glow: "shadow-[0_0_80px_rgba(16,185,129,0.3)]" },
  "case-study": { emoji: "📊", bg: "from-blue-500 via-indigo-600 to-purple-900", accent: "blue", glow: "shadow-[0_0_80px_rgba(59,130,246,0.3)]" },
  simulation: { emoji: "⚡", bg: "from-orange-500 via-red-600 to-pink-800", accent: "orange", glow: "shadow-[0_0_80px_rgba(249,115,22,0.3)]" },
  challenge: { emoji: "🏆", bg: "from-amber-500 via-yellow-600 to-orange-800", accent: "amber", glow: "shadow-[0_0_80px_rgba(245,158,11,0.3)]" },
  myth: { emoji: "💰", bg: "from-rose-600 via-red-700 to-rose-900", accent: "rose", glow: "shadow-[0_0_80px_rgba(225,29,72,0.4)]" },
  shock: { emoji: "⚡", bg: "from-yellow-500 via-amber-600 to-red-800", accent: "yellow", glow: "shadow-[0_0_80px_rgba(234,179,8,0.4)]" },
  "rare-insight": { emoji: "🔮", bg: "from-fuchsia-600 via-purple-700 to-indigo-900", accent: "fuchsia", glow: "shadow-[0_0_80px_rgba(192,38,211,0.4)]" },
  slider: { emoji: "🎚️", bg: "from-cyan-500 via-blue-600 to-indigo-800", accent: "cyan", glow: "shadow-[0_0_80px_rgba(6,182,212,0.3)]" },
  poll: { emoji: "📊", bg: "from-pink-500 via-rose-600 to-red-800", accent: "pink", glow: "shadow-[0_0_80px_rgba(236,72,153,0.3)]" },
  counter: { emoji: "📈", bg: "from-green-500 via-emerald-600 to-teal-800", accent: "green", glow: "shadow-[0_0_80px_rgba(34,197,94,0.3)]" },
};

const typeLabels: Record<string, { label: string; icon: typeof Zap }> = {
  concept: { label: "LEARN", icon: Lightbulb },
  quiz: { label: "QUIZ", icon: Brain },
  "case-study": { label: "CASE STUDY", icon: BarChart3 },
  simulation: { label: "SCENARIO", icon: TrendingUp },
  challenge: { label: "CHALLENGE", icon: Trophy },
  myth: { label: "MONEY MYTH", icon: AlertTriangle },
  shock: { label: "REALITY CHECK", icon: Zap },
  "rare-insight": { label: "RARE INSIGHT", icon: Eye },
  slider: { label: "GUESS & LEARN", icon: Sparkles },
  poll: { label: "QUICK POLL", icon: BarChart3 },
  counter: { label: "LIVE STAT", icon: TrendingUp },
};

// Animated counter component
const AnimatedCounter = ({ from, to, suffix, prefix, duration, isActive }: {
  from: number; to: number; suffix: string; prefix: string; duration: number; isActive: boolean;
}) => {
  const [count, setCount] = useState(from);
  
  useEffect(() => {
    if (!isActive) return;
    setCount(from);
    const steps = 60;
    const increment = (to - from) / steps;
    let current = from;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      current += increment;
      setCount(Math.round(current));
      if (step >= steps) {
        setCount(to);
        clearInterval(timer);
      }
    }, (duration * 1000) / steps);
    return () => clearInterval(timer);
  }, [isActive, from, to, duration]);

  return (
    <span className="tabular-nums">
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
};

// Floating particles
const FloatingParticles = ({ accent }: { accent: string }) => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {Array.from({ length: 12 }).map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-1 h-1 rounded-full bg-white/20"
        initial={{
          x: Math.random() * 400,
          y: Math.random() * 800,
          scale: Math.random() * 2 + 0.5,
        }}
        animate={{
          y: [null, Math.random() * -400 - 200],
          opacity: [0, 0.6, 0],
        }}
        transition={{
          duration: Math.random() * 4 + 3,
          repeat: Infinity,
          delay: Math.random() * 3,
          ease: "easeOut",
        }}
      />
    ))}
  </div>
);

export const FeedCard = ({ card, onComplete, isActive }: FeedCardProps) => {
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [tapped, setTapped] = useState(false);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [sliderValue, setSliderValue] = useState<number[]>([25]);
  const [sliderSubmitted, setSliderSubmitted] = useState(false);
  const [pollVoted, setPollVoted] = useState<number | null>(null);
  const [showXpBurst, setShowXpBurst] = useState(false);

  const theme = visualThemes[card.type] || visualThemes.concept;
  const typeInfo = typeLabels[card.type] || typeLabels.concept;
  const TypeIcon = typeInfo.icon;

  const triggerXP = () => {
    setShowXpBurst(true);
    setTimeout(() => setShowXpBurst(false), 1200);
  };

  const handleOptionSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    const correct = card.options?.[idx]?.correct ?? false;
    if (correct) triggerXP();
    setTimeout(() => onComplete(correct), 800);
  };

  const handleReveal = () => {
    if (!tapped) {
      setTapped(true);
      triggerXP();
      setTimeout(() => {
        setRevealed(true);
        onComplete(true);
      }, 400);
    }
  };

  const handleSliderSubmit = () => {
    setSliderSubmitted(true);
    const diff = Math.abs(sliderValue[0] - (card.sliderConfig?.answer || 0));
    const correct = diff <= 5;
    if (correct) triggerXP();
    setTimeout(() => onComplete(correct), 800);
  };

  const handlePollVote = (idx: number) => {
    if (pollVoted !== null) return;
    setPollVoted(idx);
    triggerXP();
    setTimeout(() => onComplete(true), 600);
  };

  const isPatternInterrupt = ["myth", "shock", "rare-insight", "slider", "poll", "counter"].includes(card.type);

  return (
    <div className={cn("h-full w-full relative overflow-hidden bg-black", theme.glow)}>
      {/* Full-screen gradient */}
      <div className={cn("absolute inset-0 bg-gradient-to-br", theme.bg)} />

      {/* Animated mesh overlay */}
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: `
          radial-gradient(ellipse at 20% 50%, white 1px, transparent 1px),
          radial-gradient(ellipse at 80% 20%, white 1px, transparent 1px),
          radial-gradient(ellipse at 50% 80%, white 1px, transparent 1px),
          radial-gradient(ellipse at 10% 90%, white 0.5px, transparent 0.5px)
        `,
        backgroundSize: "60px 60px, 80px 80px, 40px 40px, 100px 100px",
      }} />

      {/* Floating particles */}
      {isActive && <FloatingParticles accent={theme.accent} />}

      {/* Large background visual */}
      <motion.div
        initial={{ scale: 0.3, rotate: -30, opacity: 0 }}
        animate={isActive ? { scale: 1, rotate: 0, opacity: 0.12 } : { scale: 0.3, rotate: -30, opacity: 0 }}
        transition={{ duration: 0.7, type: "spring", bounce: 0.3 }}
        className="absolute top-[12%] left-1/2 -translate-x-1/2 text-[140px] md:text-[180px] select-none pointer-events-none"
      >
        {theme.emoji}
      </motion.div>

      {/* Pattern interrupt special glow ring */}
      {isPatternInterrupt && isActive && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: [0.15, 0.3, 0.15], scale: [0.9, 1.1, 0.9] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[300px] h-[300px] rounded-full"
          style={{ background: "radial-gradient(circle, white 0%, transparent 70%)" }}
        />
      )}

      {/* Bottom gradient mask */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {/* XP burst animation */}
      <AnimatePresence>
        {showXpBurst && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 0 }}
            animate={{ opacity: 1, scale: 1.2, y: -60 }}
            exit={{ opacity: 0, y: -120, scale: 0.8 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2"
          >
            <Zap className="w-8 h-8 text-yellow-400 drop-shadow-lg" />
            <span className="text-3xl font-black text-yellow-400 drop-shadow-lg">+{card.xpReward} XP</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
        transition={{ delay: 0.15 }}
        className="absolute top-14 left-0 right-0 px-4 flex items-center justify-between z-10"
      >
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/10">
          <TypeIcon className="w-3.5 h-3.5 text-white" />
          <span className="text-white text-[10px] font-black tracking-[0.2em] uppercase">
            {typeInfo.label}
          </span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/10">
          <Zap className="w-3.5 h-3.5 text-yellow-400" />
          <span className="text-white text-xs font-black">+{card.xpReward}</span>
        </div>
      </motion.div>

      {/* Right-side social actions */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
        transition={{ delay: 0.4 }}
        className="absolute right-3 bottom-[28%] flex flex-col items-center gap-5 z-10"
      >
        <motion.button
          onClick={() => setLiked(!liked)}
          whileTap={{ scale: 1.3 }}
          className="flex flex-col items-center gap-1"
        >
          <div className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-xl transition-all",
            liked ? "bg-red-500/80 scale-110" : "bg-white/10 border border-white/10"
          )}>
            <Heart className={cn("w-5 h-5 transition-all", liked ? "text-white fill-white" : "text-white")} />
          </div>
          <span className="text-white/70 text-[10px] font-bold">{liked ? "Liked" : "Like"}</span>
        </motion.button>
        <motion.button whileTap={{ scale: 1.2 }} className="flex flex-col items-center gap-1">
          <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-xl border border-white/10 flex items-center justify-center">
            <Share2 className="w-5 h-5 text-white" />
          </div>
          <span className="text-white/70 text-[10px] font-bold">Share</span>
        </motion.button>
        <motion.button
          onClick={() => setSaved(!saved)}
          whileTap={{ scale: 1.2 }}
          className="flex flex-col items-center gap-1"
        >
          <div className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-xl transition-all",
            saved ? "bg-primary/80" : "bg-white/10 border border-white/10"
          )}>
            <Bookmark className={cn("w-5 h-5", saved ? "text-white fill-white" : "text-white")} />
          </div>
          <span className="text-white/70 text-[10px] font-bold">{saved ? "Saved" : "Save"}</span>
        </motion.button>
      </motion.div>

      {/* Main content — bottom aligned */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
        className="absolute bottom-0 left-0 right-16 p-5 pb-8 z-10 flex flex-col gap-3"
      >
        {/* Pathway tag */}
        <div className="flex items-center gap-2">
          <span className="text-white/50 text-xs font-bold">#{card.pathway.replace(/[\s#]/g, "")}</span>
          <span className="text-white/30">•</span>
          <span className="text-white/50 text-xs font-bold capitalize">{card.difficulty}</span>
        </div>

        {/* Title — bold, high-impact */}
        <h2 className="text-white text-[26px] md:text-[32px] font-black leading-[1.1] tracking-tight drop-shadow-xl">
          {card.title}
        </h2>

        {/* ===== CARD TYPE SPECIFIC CONTENT ===== */}

        {/* CONCEPT — tap to reveal */}
        {card.type === "concept" && (
          <div className="space-y-3">
            <p className="text-white/70 text-sm leading-relaxed line-clamp-2">{card.content}</p>
            {card.insight && (
              <motion.button
                onClick={handleReveal}
                whileTap={{ scale: 0.97 }}
                className={cn(
                  "w-full p-4 rounded-2xl backdrop-blur-xl transition-all text-left border",
                  tapped ? "bg-white/20 border-white/20" : "bg-white/8 border-white/10 active:bg-white/15"
                )}
              >
                <AnimatePresence mode="wait">
                  {!tapped ? (
                    <motion.div key="prompt" exit={{ opacity: 0 }} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-yellow-400/20 flex items-center justify-center">
                        <Lightbulb className="w-5 h-5 text-yellow-400" />
                      </div>
                      <div>
                        <span className="text-white text-sm font-black block">Tap to reveal insight</span>
                        <span className="text-white/40 text-xs">Hidden knowledge inside ✨</span>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.p
                      key="insight"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-white text-sm font-semibold leading-relaxed"
                    >
                      💡 {card.insight}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.button>
            )}
          </div>
        )}

        {/* QUIZ / CASE-STUDY / SIMULATION / CHALLENGE — options */}
        {(["quiz", "case-study", "simulation", "challenge"].includes(card.type)) && card.options && (
          <div className="space-y-2">
            <p className="text-white/70 text-sm leading-relaxed">{card.content}</p>
            {card.options.map((opt, idx) => {
              const isSelected = selected === idx;
              const showResult = selected !== null;
              const isCorrect = opt.correct;
              return (
                <motion.button
                  key={idx}
                  onClick={() => handleOptionSelect(idx)}
                  whileTap={selected === null ? { scale: 0.97 } : {}}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ delay: 0.2 + idx * 0.08 }}
                  className={cn(
                    "w-full text-left p-3.5 rounded-2xl backdrop-blur-xl transition-all duration-300 border",
                    showResult && isCorrect && "bg-emerald-500/25 border-emerald-400/50",
                    showResult && isSelected && !isCorrect && "bg-red-500/25 border-red-400/50",
                    showResult && !isSelected && !isCorrect && "opacity-25 border-transparent bg-white/5",
                    !showResult && "bg-white/8 border-white/10 active:bg-white/15"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 border transition-all",
                      showResult && isCorrect && "border-emerald-400 bg-emerald-500/30 text-emerald-400",
                      showResult && isSelected && !isCorrect && "border-red-400 bg-red-500/30 text-red-400",
                      !showResult && "border-white/30 text-white/60"
                    )}>
                      {showResult && isCorrect ? <CheckCircle className="w-4 h-4" /> :
                       showResult && isSelected ? <XCircle className="w-4 h-4" /> :
                       String.fromCharCode(65 + idx)}
                    </div>
                    <span className="text-white text-sm font-bold">{opt.text}</span>
                  </div>
                  {showResult && isSelected && opt.explanation && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="text-white/50 text-xs mt-2 ml-11 leading-relaxed"
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
                className="p-3.5 rounded-2xl bg-white/8 backdrop-blur-xl border border-white/10 text-white text-xs"
              >
                <span className="font-black text-yellow-400">📈 Outcome: </span>
                {card.scenarioOutcome}
              </motion.div>
            )}
          </div>
        )}

        {/* MYTH / SHOCK / RARE INSIGHT — stat reveal */}
        {(["myth", "shock", "rare-insight"].includes(card.type)) && (
          <div className="space-y-3">
            <p className="text-white/80 text-[15px] leading-relaxed font-medium">{card.content}</p>
            <motion.button
              onClick={handleReveal}
              whileTap={{ scale: 0.97 }}
              className={cn(
                "w-full p-4 rounded-2xl backdrop-blur-xl text-left border transition-all",
                tapped ? "bg-white/20 border-white/20" : "bg-white/8 border-white/10"
              )}
            >
              <AnimatePresence mode="wait">
                {!tapped ? (
                  <motion.div key="cta" exit={{ opacity: 0 }} className="flex items-center gap-3">
                    <motion.div
                      animate={{ scale: [1, 1.15, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
                    >
                      <Sparkles className="w-5 h-5 text-white" />
                    </motion.div>
                    <div>
                      <span className="text-white text-sm font-black block">Tap for the real stat</span>
                      <span className="text-white/40 text-[11px]">This will surprise you 🤯</span>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="stat"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                  >
                    <span className="text-3xl font-black text-white drop-shadow-lg block">{card.insight}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        )}

        {/* SLIDER — guess the number */}
        {card.type === "slider" && card.sliderConfig && (
          <div className="space-y-4">
            <p className="text-white/80 text-[15px] font-semibold">{card.content}</p>
            <div className="space-y-3">
              <div className="text-center">
                <motion.span
                  key={sliderValue[0]}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  className="text-4xl font-black text-white tabular-nums"
                >
                  {sliderValue[0]}{card.sliderConfig.unit}
                </motion.span>
              </div>
              <div className="px-2">
                <Slider
                  value={sliderValue}
                  onValueChange={setSliderValue}
                  min={card.sliderConfig.min}
                  max={card.sliderConfig.max}
                  step={1}
                  disabled={sliderSubmitted}
                  className="[&_[role=slider]]:bg-white [&_[role=slider]]:border-0 [&_[role=slider]]:w-6 [&_[role=slider]]:h-6 [&_[role=slider]]:shadow-lg"
                />
                <div className="flex justify-between mt-1">
                  <span className="text-white/30 text-[10px] font-bold">{card.sliderConfig.min}{card.sliderConfig.unit}</span>
                  <span className="text-white/30 text-[10px] font-bold">{card.sliderConfig.max}{card.sliderConfig.unit}</span>
                </div>
              </div>
              {!sliderSubmitted ? (
                <motion.button
                  onClick={handleSliderSubmit}
                  whileTap={{ scale: 0.97 }}
                  className="w-full py-3.5 rounded-2xl bg-white/15 backdrop-blur-xl border border-white/20 text-white font-black text-sm"
                >
                  Lock in my answer →
                </motion.button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-white/60 text-xs font-bold">Your guess</span>
                    <span className="text-white font-black">{sliderValue[0]}{card.sliderConfig.unit}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/60 text-xs font-bold">Correct answer</span>
                    <span className="text-emerald-400 font-black">{card.sliderConfig.answer}{card.sliderConfig.unit}</span>
                  </div>
                  <p className="text-white/60 text-xs leading-relaxed pt-1">{card.sliderConfig.explanation}</p>
                </motion.div>
              )}
            </div>
          </div>
        )}

        {/* POLL — quick vote */}
        {card.type === "poll" && card.options && (
          <div className="space-y-3">
            {card.options.map((opt, idx) => {
              const fakePercent = pollVoted !== null
                ? idx === 0 ? 62 : idx === 1 ? 24 : idx === 2 ? 9 : 5
                : 0;
              return (
                <motion.button
                  key={idx}
                  onClick={() => handlePollVote(idx)}
                  whileTap={pollVoted === null ? { scale: 0.97 } : {}}
                  className={cn(
                    "w-full text-left p-4 rounded-2xl backdrop-blur-xl border transition-all relative overflow-hidden",
                    pollVoted === idx ? "border-white/30 bg-white/15" : "border-white/10 bg-white/8"
                  )}
                >
                  {pollVoted !== null && (
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${fakePercent}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="absolute inset-y-0 left-0 bg-white/10 rounded-2xl"
                    />
                  )}
                  <div className="relative flex items-center justify-between">
                    <span className="text-white text-sm font-black">{opt.text}</span>
                    {pollVoted !== null && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-white/60 text-sm font-black"
                      >
                        {fakePercent}%
                      </motion.span>
                    )}
                  </div>
                </motion.button>
              );
            })}
            {pollVoted !== null && (
              <motion.p
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-white/60 text-xs leading-relaxed px-1"
              >
                💡 {card.content}
              </motion.p>
            )}
          </div>
        )}

        {/* COUNTER — animated number */}
        {card.type === "counter" && card.counterConfig && (
          <div className="space-y-4">
            <div className="text-center py-4">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={isActive ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="text-5xl md:text-6xl font-black text-white drop-shadow-xl"
              >
                <AnimatedCounter
                  from={card.counterConfig.from}
                  to={card.counterConfig.to}
                  suffix={card.counterConfig.suffix}
                  prefix={card.counterConfig.prefix}
                  duration={card.counterConfig.duration}
                  isActive={isActive}
                />
              </motion.div>
              <p className="text-white/60 text-sm font-bold mt-2">{card.content}</p>
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={isActive ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 1.5 }}
              className="p-3.5 rounded-2xl bg-white/8 backdrop-blur-xl border border-white/10"
            >
              <p className="text-white/50 text-xs leading-relaxed">{card.counterConfig.context}</p>
            </motion.div>
          </div>
        )}

        {/* Scroll hint */}
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex items-center gap-1.5 text-white/20 mt-1"
        >
          <ChevronUp className="w-3.5 h-3.5" />
          <span className="text-[10px] font-bold">Swipe for more</span>
        </motion.div>
      </motion.div>
    </div>
  );
};

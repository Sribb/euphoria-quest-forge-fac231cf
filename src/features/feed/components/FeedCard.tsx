import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lightbulb, Zap, CheckCircle, XCircle, Heart, Share2, Bookmark,
  ChevronUp, Sparkles, TrendingUp, Brain, Eye, BarChart3, AlertTriangle
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

// ── Animated visual components ──

const AnimatedBarChart = ({ isActive, variant }: { isActive: boolean; variant: number }) => {
  const bars = useMemo(() => {
    const count = 7 + (variant % 5);
    return Array.from({ length: count }, (_, i) => ({
      height: 20 + Math.random() * 60,
      delay: i * 0.08,
      color: i % 3 === 0 ? "rgba(139,92,246,0.8)" : i % 3 === 1 ? "rgba(16,185,129,0.7)" : "rgba(59,130,246,0.6)",
    }));
  }, [variant]);

  return (
    <div className="absolute inset-0 flex items-end justify-center gap-[3%] px-[10%] pb-[35%] pt-[15%]">
      {bars.map((bar, i) => (
        <motion.div
          key={i}
          initial={{ height: 0, opacity: 0 }}
          animate={isActive ? { height: `${bar.height}%`, opacity: 1 } : { height: 0, opacity: 0 }}
          transition={{ delay: bar.delay + 0.3, duration: 0.6, type: "spring", bounce: 0.3 }}
          className="flex-1 rounded-t-lg"
          style={{ background: `linear-gradient(to top, ${bar.color}, ${bar.color.replace(/[\d.]+\)$/, '0.3)')})`, maxWidth: 40 }}
        />
      ))}
    </div>
  );
};

const AnimatedLineChart = ({ isActive, variant }: { isActive: boolean; variant: number }) => {
  const points = useMemo(() => {
    const count = 12;
    let y = 50 + (variant % 30);
    return Array.from({ length: count }, (_, i) => {
      y += (Math.random() - 0.35) * 25;
      y = Math.max(15, Math.min(85, y));
      return { x: (i / (count - 1)) * 100, y };
    });
  }, [variant]);

  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${100 - p.y}`).join(" ");
  const areaD = pathD + ` L 100 100 L 0 100 Z`;
  const isUp = points[points.length - 1].y > points[0].y;

  return (
    <div className="absolute inset-0 px-[5%] py-[15%]">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-[55%]">
        <defs>
          <linearGradient id={`grad-${variant}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={isUp ? "rgba(16,185,129,0.4)" : "rgba(239,68,68,0.4)"} />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
        <motion.path
          d={areaD}
          fill={`url(#grad-${variant})`}
          initial={{ opacity: 0 }}
          animate={isActive ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        />
        <motion.path
          d={pathD}
          fill="none"
          stroke={isUp ? "rgba(16,185,129,0.9)" : "rgba(239,68,68,0.9)"}
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={isActive ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ delay: 0.3, duration: 1.5, ease: "easeInOut" }}
        />
        {/* Animated dot at the end */}
        <motion.circle
          cx={points[points.length - 1].x}
          cy={100 - points[points.length - 1].y}
          r="2.5"
          fill="white"
          initial={{ opacity: 0, scale: 0 }}
          animate={isActive ? { opacity: 1, scale: [1, 1.5, 1] } : { opacity: 0, scale: 0 }}
          transition={{ delay: 1.8, duration: 1, repeat: Infinity, repeatDelay: 1 }}
        />
      </svg>
    </div>
  );
};

const AnimatedPieChart = ({ isActive, variant }: { isActive: boolean; variant: number }) => {
  const slices = useMemo(() => {
    const colors = [
      "rgba(139,92,246,0.85)", "rgba(16,185,129,0.8)", "rgba(59,130,246,0.75)",
      "rgba(249,115,22,0.7)", "rgba(236,72,153,0.65)"
    ];
    const labels = ["Stocks", "Bonds", "Cash", "Crypto", "Real Estate"];
    const rawValues = Array.from({ length: 3 + (variant % 3) }, () => 10 + Math.random() * 40);
    const total = rawValues.reduce((a, b) => a + b, 0);
    let cumulative = 0;
    return rawValues.map((v, i) => {
      const start = cumulative;
      cumulative += (v / total) * 360;
      return { start, end: cumulative, color: colors[i % colors.length], label: labels[i % labels.length], pct: Math.round((v / total) * 100) };
    });
  }, [variant]);

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="relative w-[55%] aspect-square">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          {slices.map((slice, i) => {
            const r = 40;
            const circumference = 2 * Math.PI * r;
            const angleSpan = slice.end - slice.start;
            const dashLength = (angleSpan / 360) * circumference;
            const dashOffset = -((slice.start / 360) * circumference);
            return (
              <motion.circle
                key={i}
                cx="50" cy="50" r={r}
                fill="none"
                stroke={slice.color}
                strokeWidth="18"
                strokeDasharray={`${dashLength} ${circumference - dashLength}`}
                strokeDashoffset={dashOffset}
                initial={{ opacity: 0 }}
                animate={isActive ? { opacity: 1 } : { opacity: 0 }}
                transition={{ delay: 0.3 + i * 0.15, duration: 0.6 }}
              />
            );
          })}
        </svg>
        {/* Center label */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={isActive ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
          transition={{ delay: 0.8 }}
          className="absolute inset-0 flex flex-col items-center justify-center"
        >
          <span className="text-white/80 text-[10px] font-bold">Portfolio</span>
          <span className="text-white text-lg font-black">Mix</span>
        </motion.div>
      </div>
      {/* Legend */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
        transition={{ delay: 1 }}
        className="absolute right-[8%] top-[20%] flex flex-col gap-1.5"
      >
        {slices.map((s, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ background: s.color }} />
            <span className="text-white/50 text-[9px] font-bold">{s.label} {s.pct}%</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

const AnimatedCandlestick = ({ isActive, variant }: { isActive: boolean; variant: number }) => {
  const candles = useMemo(() =>
    Array.from({ length: 9 }, (_, i) => {
      const open = 30 + Math.random() * 40;
      const close = open + (Math.random() - 0.45) * 20;
      const high = Math.max(open, close) + Math.random() * 10;
      const low = Math.min(open, close) - Math.random() * 10;
      return { open, close, high, low, bullish: close > open };
    }),
  [variant]);

  return (
    <div className="absolute inset-0 px-[8%] py-[18%]">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-[50%]">
        {candles.map((c, i) => {
          const x = (i / candles.length) * 100 + 100 / candles.length / 2;
          const bodyTop = 100 - Math.max(c.open, c.close);
          const bodyBottom = 100 - Math.min(c.open, c.close);
          const bodyHeight = Math.max(bodyBottom - bodyTop, 1.5);
          return (
            <motion.g
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ delay: 0.3 + i * 0.1 }}
            >
              {/* Wick */}
              <line x1={x} y1={100 - c.high} x2={x} y2={100 - c.low}
                stroke={c.bullish ? "rgba(16,185,129,0.6)" : "rgba(239,68,68,0.6)"}
                strokeWidth="0.8" />
              {/* Body */}
              <rect x={x - 3.5} y={bodyTop} width="7" height={bodyHeight} rx="1"
                fill={c.bullish ? "rgba(16,185,129,0.85)" : "rgba(239,68,68,0.85)"} />
            </motion.g>
          );
        })}
      </svg>
    </div>
  );
};

const AnimatedGauge = ({ isActive, value, label }: { isActive: boolean; value: number; label: string }) => {
  const angle = (value / 100) * 180 - 90;
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="relative w-[50%] aspect-square">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Background arc */}
          <path d="M 15 75 A 35 35 0 1 1 85 75" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" strokeLinecap="round" />
          {/* Value arc */}
          <motion.path
            d="M 15 75 A 35 35 0 1 1 85 75"
            fill="none"
            stroke={value > 70 ? "rgba(16,185,129,0.9)" : value > 40 ? "rgba(234,179,8,0.9)" : "rgba(239,68,68,0.9)"}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray="220"
            initial={{ strokeDashoffset: 220 }}
            animate={isActive ? { strokeDashoffset: 220 - (value / 100) * 220 } : { strokeDashoffset: 220 }}
            transition={{ delay: 0.5, duration: 1.5, ease: "easeOut" }}
          />
        </svg>
        <motion.div
          initial={{ opacity: 0 }}
          animate={isActive ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 1 }}
          className="absolute inset-0 flex flex-col items-center justify-center pt-4"
        >
          <span className="text-3xl font-black text-white">{value}%</span>
          <span className="text-white/40 text-[10px] font-bold">{label}</span>
        </motion.div>
      </div>
    </div>
  );
};

const BigNumber = ({ isActive, from, to, prefix, suffix, duration }: {
  isActive: boolean; from: number; to: number; prefix?: string; suffix?: string; duration: number;
}) => {
  const [count, setCount] = useState(from);
  useEffect(() => {
    if (!isActive) { setCount(from); return; }
    const steps = 60;
    const inc = (to - from) / steps;
    let current = from;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      current += inc;
      setCount(Math.round(current));
      if (step >= steps) { setCount(to); clearInterval(timer); }
    }, (duration * 1000) / steps);
    return () => clearInterval(timer);
  }, [isActive, from, to, duration]);

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={isActive ? { scale: 1, opacity: 1 } : { scale: 0.5, opacity: 0 }}
        transition={{ delay: 0.3, type: "spring", bounce: 0.3 }}
        className="text-center"
      >
        <div className="text-6xl md:text-7xl font-black text-white drop-shadow-2xl tabular-nums">
          {prefix}{count.toLocaleString()}{suffix}
        </div>
      </motion.div>
    </div>
  );
};

const FloatingOrbs = ({ colors }: { colors: string[] }) => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {colors.map((color, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full blur-3xl"
        style={{
          width: 120 + i * 40,
          height: 120 + i * 40,
          background: color,
          left: `${15 + i * 25}%`,
          top: `${10 + i * 20}%`,
        }}
        animate={{
          x: [0, 30 * (i % 2 === 0 ? 1 : -1), 0],
          y: [0, -20, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut" }}
      />
    ))}
  </div>
);

// ── Pick a visual per card type ──
const getVisualForCard = (card: FeedCardData, isActive: boolean) => {
  const hashCode = card.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const variant = hashCode % 100;

  switch (card.type) {
    case "quiz":
    case "challenge":
      return <AnimatedBarChart isActive={isActive} variant={variant} />;
    case "concept":
      return <AnimatedLineChart isActive={isActive} variant={variant} />;
    case "case-study":
      return <AnimatedPieChart isActive={isActive} variant={variant} />;
    case "simulation":
      return <AnimatedCandlestick isActive={isActive} variant={variant} />;
    case "myth":
    case "shock":
      return <AnimatedGauge isActive={isActive} value={30 + (variant % 50)} label={card.type === "myth" ? "MYTH SCORE" : "SHOCK LEVEL"} />;
    case "rare-insight":
      return <AnimatedLineChart isActive={isActive} variant={variant + 50} />;
    case "counter":
      return card.counterConfig ? (
        <BigNumber isActive={isActive} from={card.counterConfig.from} to={card.counterConfig.to} prefix={card.counterConfig.prefix} suffix={card.counterConfig.suffix} duration={card.counterConfig.duration} />
      ) : <AnimatedBarChart isActive={isActive} variant={variant} />;
    case "slider":
      return <AnimatedGauge isActive={isActive} value={card.sliderConfig?.answer || 50} label="TARGET" />;
    case "poll":
      return <AnimatedBarChart isActive={isActive} variant={variant + 20} />;
    default:
      return <AnimatedLineChart isActive={isActive} variant={variant} />;
  }
};

const orbColors: Record<string, string[]> = {
  concept: ["rgba(139,92,246,0.15)", "rgba(59,130,246,0.1)", "rgba(16,185,129,0.08)"],
  quiz: ["rgba(16,185,129,0.15)", "rgba(6,182,212,0.12)", "rgba(139,92,246,0.08)"],
  "case-study": ["rgba(59,130,246,0.15)", "rgba(139,92,246,0.12)", "rgba(236,72,153,0.08)"],
  simulation: ["rgba(249,115,22,0.15)", "rgba(239,68,68,0.1)", "rgba(234,179,8,0.08)"],
  challenge: ["rgba(234,179,8,0.15)", "rgba(249,115,22,0.12)", "rgba(239,68,68,0.08)"],
  myth: ["rgba(225,29,72,0.18)", "rgba(239,68,68,0.12)", "rgba(249,115,22,0.08)"],
  shock: ["rgba(234,179,8,0.18)", "rgba(249,115,22,0.12)", "rgba(239,68,68,0.08)"],
  "rare-insight": ["rgba(192,38,211,0.18)", "rgba(139,92,246,0.15)", "rgba(59,130,246,0.1)"],
  slider: ["rgba(6,182,212,0.15)", "rgba(59,130,246,0.12)", "rgba(139,92,246,0.08)"],
  poll: ["rgba(236,72,153,0.15)", "rgba(225,29,72,0.12)", "rgba(249,115,22,0.08)"],
  counter: ["rgba(16,185,129,0.18)", "rgba(6,182,212,0.12)", "rgba(59,130,246,0.08)"],
};

const typeLabels: Record<string, { label: string; icon: typeof Zap }> = {
  concept: { label: "LEARN", icon: Lightbulb },
  quiz: { label: "QUIZ", icon: Brain },
  "case-study": { label: "CASE STUDY", icon: BarChart3 },
  simulation: { label: "SCENARIO", icon: TrendingUp },
  challenge: { label: "CHALLENGE", icon: TrendingUp },
  myth: { label: "MONEY MYTH", icon: AlertTriangle },
  shock: { label: "REALITY CHECK", icon: Zap },
  "rare-insight": { label: "RARE INSIGHT", icon: Eye },
  slider: { label: "GUESS & LEARN", icon: Sparkles },
  poll: { label: "QUICK POLL", icon: BarChart3 },
  counter: { label: "LIVE STAT", icon: TrendingUp },
};

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

  const typeInfo = typeLabels[card.type] || typeLabels.concept;
  const TypeIcon = typeInfo.icon;
  const orbs = orbColors[card.type] || orbColors.concept;

  const triggerXP = () => { setShowXpBurst(true); setTimeout(() => setShowXpBurst(false), 1200); };

  const handleOptionSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    if (card.options?.[idx]?.correct) triggerXP();
    setTimeout(() => onComplete(card.options?.[idx]?.correct ?? false), 800);
  };

  const handleReveal = () => {
    if (tapped) return;
    setTapped(true);
    triggerXP();
    setTimeout(() => { setRevealed(true); onComplete(true); }, 400);
  };

  const handleSliderSubmit = () => {
    setSliderSubmitted(true);
    const correct = Math.abs(sliderValue[0] - (card.sliderConfig?.answer || 0)) <= 5;
    if (correct) triggerXP();
    setTimeout(() => onComplete(correct), 800);
  };

  const handlePollVote = (idx: number) => {
    if (pollVoted !== null) return;
    setPollVoted(idx);
    triggerXP();
    setTimeout(() => onComplete(true), 600);
  };

  return (
    <div className="h-full w-full relative overflow-hidden bg-black">
      {/* Dark base */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0a0a1a] to-black" />

      {/* Floating color orbs — creates a cinematic look */}
      <FloatingOrbs colors={orbs} />

      {/* Animated visual — the hero of the card */}
      <div className="absolute inset-0 z-[1]">
        {getVisualForCard(card, isActive)}
      </div>

      {/* Bottom heavy gradient for text readability */}
      <div className="absolute inset-0 z-[2] bg-gradient-to-t from-black via-black/60 to-transparent" style={{ background: "linear-gradient(to top, black 0%, rgba(0,0,0,0.85) 30%, rgba(0,0,0,0.3) 55%, transparent 100%)" }} />

      {/* XP burst */}
      <AnimatePresence>
        {showXpBurst && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 0 }}
            animate={{ opacity: 1, scale: 1.3, y: -80 }}
            exit={{ opacity: 0, y: -150 }}
            className="absolute top-1/3 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2"
          >
            <Zap className="w-8 h-8 text-yellow-400" />
            <span className="text-4xl font-black text-yellow-400 drop-shadow-2xl">+{card.xpReward}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0 }}
        transition={{ delay: 0.15 }}
        className="absolute top-14 left-0 right-0 px-4 flex items-center justify-between z-10"
      >
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/8 backdrop-blur-xl border border-white/[0.06]">
          <TypeIcon className="w-3.5 h-3.5 text-white/70" />
          <span className="text-white/70 text-[10px] font-black tracking-[0.2em] uppercase">{typeInfo.label}</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/8 backdrop-blur-xl border border-white/[0.06]">
          <Zap className="w-3.5 h-3.5 text-yellow-400" />
          <span className="text-white text-xs font-black">+{card.xpReward}</span>
        </div>
      </motion.div>

      {/* Right side actions */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute right-3 bottom-[30%] flex flex-col items-center gap-5 z-10"
      >
        <motion.button onClick={() => setLiked(!liked)} whileTap={{ scale: 1.4 }} className="flex flex-col items-center gap-1">
          <div className={cn("w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-xl transition-all",
            liked ? "bg-red-500/70" : "bg-white/8 border border-white/[0.06]")}>
            <Heart className={cn("w-5 h-5", liked ? "text-white fill-white" : "text-white/60")} />
          </div>
          <span className="text-white/40 text-[9px] font-black">{liked ? "Liked" : "Like"}</span>
        </motion.button>
        <motion.button whileTap={{ scale: 1.2 }} className="flex flex-col items-center gap-1">
          <div className="w-12 h-12 rounded-full bg-white/8 backdrop-blur-xl border border-white/[0.06] flex items-center justify-center">
            <Share2 className="w-5 h-5 text-white/60" />
          </div>
          <span className="text-white/40 text-[9px] font-black">Share</span>
        </motion.button>
        <motion.button onClick={() => setSaved(!saved)} whileTap={{ scale: 1.2 }} className="flex flex-col items-center gap-1">
          <div className={cn("w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-xl",
            saved ? "bg-primary/60" : "bg-white/8 border border-white/[0.06]")}>
            <Bookmark className={cn("w-5 h-5", saved ? "text-white fill-white" : "text-white/60")} />
          </div>
          <span className="text-white/40 text-[9px] font-black">{saved ? "Saved" : "Save"}</span>
        </motion.button>
      </motion.div>

      {/* ── Main bottom content ── */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="absolute bottom-0 left-0 right-16 p-5 pb-8 z-10 flex flex-col gap-2.5"
      >
        {/* Tags */}
        <div className="flex items-center gap-2">
          <span className="text-white/30 text-[11px] font-black">#{card.pathway.replace(/[\s#]/g, "")}</span>
          <span className="text-white/20">·</span>
          <span className="text-white/30 text-[11px] font-black capitalize">{card.difficulty}</span>
        </div>

        {/* Title */}
        <h2 className="text-white text-[24px] md:text-[30px] font-black leading-[1.1] tracking-tight">
          {card.title}
        </h2>

        {/* CONCEPT */}
        {card.type === "concept" && (
          <div className="space-y-2.5">
            <p className="text-white/50 text-[13px] leading-relaxed line-clamp-2">{card.content}</p>
            {card.insight && (
              <motion.button onClick={handleReveal} whileTap={{ scale: 0.97 }}
                className={cn("w-full p-3.5 rounded-2xl backdrop-blur-xl text-left border transition-all",
                  tapped ? "bg-white/15 border-white/15" : "bg-white/[0.06] border-white/[0.06]")}>
                <AnimatePresence mode="wait">
                  {!tapped ? (
                    <motion.div key="p" exit={{ opacity: 0 }} className="flex items-center gap-3">
                      <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }}
                        className="w-9 h-9 rounded-full bg-yellow-400/15 flex items-center justify-center">
                        <Lightbulb className="w-4 h-4 text-yellow-400" />
                      </motion.div>
                      <span className="text-white/70 text-sm font-black">Tap to reveal insight ✨</span>
                    </motion.div>
                  ) : (
                    <motion.p key="i" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                      className="text-white/80 text-sm font-semibold leading-relaxed">💡 {card.insight}</motion.p>
                  )}
                </AnimatePresence>
              </motion.button>
            )}
          </div>
        )}

        {/* QUIZ / CASE-STUDY / SIMULATION / CHALLENGE */}
        {(["quiz", "case-study", "simulation", "challenge"].includes(card.type)) && card.options && (
          <div className="space-y-2">
            <p className="text-white/50 text-[13px] leading-relaxed">{card.content}</p>
            {card.options.map((opt, idx) => {
              const isSelected = selected === idx;
              const showResult = selected !== null;
              const isCorrect = opt.correct;
              return (
                <motion.button key={idx} onClick={() => handleOptionSelect(idx)}
                  whileTap={selected === null ? { scale: 0.97 } : {}}
                  initial={{ opacity: 0, x: -15 }}
                  animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0, x: -15 }}
                  transition={{ delay: 0.25 + idx * 0.07 }}
                  className={cn("w-full text-left p-3 rounded-2xl backdrop-blur-xl border transition-all duration-300",
                    showResult && isCorrect && "bg-emerald-500/20 border-emerald-400/40",
                    showResult && isSelected && !isCorrect && "bg-red-500/20 border-red-400/40",
                    showResult && !isSelected && !isCorrect && "opacity-20 border-transparent",
                    !showResult && "bg-white/[0.06] border-white/[0.06]")}>
                  <div className="flex items-center gap-3">
                    <div className={cn("w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black border",
                      showResult && isCorrect && "border-emerald-400 text-emerald-400",
                      showResult && isSelected && !isCorrect && "border-red-400 text-red-400",
                      !showResult && "border-white/20 text-white/40")}>
                      {showResult && isCorrect ? <CheckCircle className="w-3.5 h-3.5" /> :
                       showResult && isSelected ? <XCircle className="w-3.5 h-3.5" /> :
                       String.fromCharCode(65 + idx)}
                    </div>
                    <span className="text-white/80 text-[13px] font-bold">{opt.text}</span>
                  </div>
                  {showResult && isSelected && opt.explanation && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="text-white/40 text-[11px] mt-1.5 ml-10">{opt.explanation}</motion.p>
                  )}
                </motion.button>
              );
            })}
          </div>
        )}

        {/* MYTH / SHOCK / RARE INSIGHT */}
        {(["myth", "shock", "rare-insight"].includes(card.type)) && (
          <div className="space-y-3">
            <p className="text-white/60 text-[14px] leading-relaxed font-medium">{card.content}</p>
            <motion.button onClick={handleReveal} whileTap={{ scale: 0.97 }}
              className={cn("w-full p-4 rounded-2xl backdrop-blur-xl text-left border",
                tapped ? "bg-white/15 border-white/15" : "bg-white/[0.06] border-white/[0.06]")}>
              <AnimatePresence mode="wait">
                {!tapped ? (
                  <motion.div key="c" exit={{ opacity: 0 }} className="flex items-center gap-3">
                    <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}
                      className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-white/70" />
                    </motion.div>
                    <span className="text-white/60 text-sm font-black">Tap for the real number 🤯</span>
                  </motion.div>
                ) : (
                  <motion.div key="s" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
                    <span className="text-2xl font-black text-white">{card.insight}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        )}

        {/* SLIDER */}
        {card.type === "slider" && card.sliderConfig && (
          <div className="space-y-3">
            <p className="text-white/60 text-[14px] font-semibold">{card.content}</p>
            <div className="text-center">
              <motion.span key={sliderValue[0]} initial={{ scale: 1.15 }} animate={{ scale: 1 }}
                className="text-4xl font-black text-white tabular-nums">{sliderValue[0]}{card.sliderConfig.unit}</motion.span>
            </div>
            <div className="px-1">
              <Slider value={sliderValue} onValueChange={setSliderValue} min={card.sliderConfig.min} max={card.sliderConfig.max} step={1} disabled={sliderSubmitted}
                className="[&_[role=slider]]:bg-white [&_[role=slider]]:border-0 [&_[role=slider]]:w-6 [&_[role=slider]]:h-6" />
              <div className="flex justify-between mt-1">
                <span className="text-white/20 text-[10px] font-bold">{card.sliderConfig.min}{card.sliderConfig.unit}</span>
                <span className="text-white/20 text-[10px] font-bold">{card.sliderConfig.max}{card.sliderConfig.unit}</span>
              </div>
            </div>
            {!sliderSubmitted ? (
              <motion.button onClick={handleSliderSubmit} whileTap={{ scale: 0.97 }}
                className="w-full py-3 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/[0.06] text-white font-black text-sm">
                Lock in →
              </motion.button>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 rounded-2xl bg-white/[0.06] border border-white/[0.06] space-y-1.5">
                <div className="flex justify-between"><span className="text-white/40 text-xs font-bold">You</span><span className="text-white font-black text-sm">{sliderValue[0]}{card.sliderConfig.unit}</span></div>
                <div className="flex justify-between"><span className="text-white/40 text-xs font-bold">Answer</span><span className="text-emerald-400 font-black text-sm">{card.sliderConfig.answer}{card.sliderConfig.unit}</span></div>
                <p className="text-white/30 text-[11px] pt-1">{card.sliderConfig.explanation}</p>
              </motion.div>
            )}
          </div>
        )}

        {/* POLL */}
        {card.type === "poll" && card.options && (
          <div className="space-y-2">
            {card.options.map((opt, idx) => {
              const pct = pollVoted !== null ? (idx === 0 ? 62 : idx === 1 ? 24 : idx === 2 ? 9 : 5) : 0;
              return (
                <motion.button key={idx} onClick={() => handlePollVote(idx)}
                  whileTap={pollVoted === null ? { scale: 0.97 } : {}}
                  className={cn("w-full text-left p-3.5 rounded-2xl backdrop-blur-xl border relative overflow-hidden",
                    pollVoted === idx ? "border-white/20 bg-white/10" : "border-white/[0.06] bg-white/[0.06]")}>
                  {pollVoted !== null && (
                    <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8 }}
                      className="absolute inset-y-0 left-0 bg-white/8 rounded-2xl" />
                  )}
                  <div className="relative flex items-center justify-between">
                    <span className="text-white/80 text-[13px] font-black">{opt.text}</span>
                    {pollVoted !== null && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-white/40 text-sm font-black">{pct}%</motion.span>}
                  </div>
                </motion.button>
              );
            })}
            {pollVoted !== null && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                className="text-white/40 text-[11px] leading-relaxed px-1">💡 {card.content}</motion.p>
            )}
          </div>
        )}

        {/* COUNTER — visual is the BigNumber, just show context here */}
        {card.type === "counter" && card.counterConfig && (
          <div className="space-y-2 mt-2">
            <p className="text-white/50 text-sm font-bold">{card.content}</p>
            <motion.div initial={{ opacity: 0 }} animate={isActive ? { opacity: 1 } : { opacity: 0 }} transition={{ delay: 2 }}
              className="p-3 rounded-2xl bg-white/[0.06] border border-white/[0.06]">
              <p className="text-white/30 text-[11px]">{card.counterConfig.context}</p>
            </motion.div>
          </div>
        )}

        {/* Scroll hint */}
        <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}
          className="flex items-center gap-1.5 text-white/15 mt-1">
          <ChevronUp className="w-3.5 h-3.5" />
          <span className="text-[10px] font-bold">Swipe</span>
        </motion.div>
      </motion.div>
    </div>
  );
};

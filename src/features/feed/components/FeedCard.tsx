import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lightbulb, HelpCircle, Zap, CheckCircle,
  XCircle, Heart, Share2, Bookmark,
  ChevronUp, Sparkles, TrendingUp,
  Brain, BarChart3, Target, AlertTriangle,
  Eye, PieChart, DollarSign, CreditCard,
  Wallet, LineChart, Building2, Landmark,
  ShieldCheck, Coins
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

// Topic-relevant icons instead of generic emojis
const topicIcons: Record<string, typeof DollarSign> = {
  "Index Funds": PieChart,
  "Dividends": Coins,
  "ETFs": BarChart3,
  "Portfolio Strategy": Target,
  "Risk Management": ShieldCheck,
  "Valuation": LineChart,
  "Cash Flow": DollarSign,
  "M&A": Building2,
  "Financial Modeling": BarChart3,
  "Capital Structure": Landmark,
  "Budgeting": Wallet,
  "Emergency Fund": ShieldCheck,
  "Credit Score": CreditCard,
  "Taxes": Landmark,
  "Debt Payoff": Target,
  "Technical Analysis": LineChart,
  "Options Basics": TrendingUp,
  "Market Orders": BarChart3,
  "Day Trading": TrendingUp,
  "Volatility": AlertTriangle,
  "Real Estate": Building2,
  "Crypto Basics": Coins,
  "REITs": Building2,
  "Commodities": DollarSign,
  "Collectibles": Sparkles,
  "Financial Literacy": Lightbulb,
  "Wealth Building": TrendingUp,
  "Test Yourself": Brain,
  "Community": HelpCircle,
  "Market Pulse": TrendingUp,
};

// Refined card themes — deeper, more intentional backgrounds
const cardThemes: Record<string, { bg: string; accent: string; iconBg: string }> = {
  concept:        { bg: "from-[#1a1035] via-[#0f0a20] to-[#0a0612]",  accent: "hsl(var(--primary))",          iconBg: "bg-primary/15" },
  quiz:           { bg: "from-[#0a2520] via-[#061a18] to-[#040f0e]",  accent: "hsl(142 71% 45%)",             iconBg: "bg-emerald-500/15" },
  "case-study":   { bg: "from-[#0f1a30] via-[#0a1225] to-[#060c1a]",  accent: "hsl(217 91% 60%)",             iconBg: "bg-blue-500/15" },
  simulation:     { bg: "from-[#2a1508] via-[#1a0e05] to-[#100a03]",  accent: "hsl(25 95% 53%)",              iconBg: "bg-orange-500/15" },
  challenge:      { bg: "from-[#2a1f08] via-[#1a1505] to-[#100e03]",  accent: "hsl(45 93% 47%)",              iconBg: "bg-amber-500/15" },
  myth:           { bg: "from-[#250a15] via-[#1a0610] to-[#10030a]",  accent: "hsl(346 77% 50%)",             iconBg: "bg-rose-500/15" },
  shock:          { bg: "from-[#2a1a05] via-[#1a1003] to-[#100a02]",  accent: "hsl(38 92% 50%)",              iconBg: "bg-amber-500/15" },
  "rare-insight": { bg: "from-[#1a0a2a] via-[#10061a] to-[#0a0310]",  accent: "hsl(280 67% 55%)",             iconBg: "bg-fuchsia-500/15" },
  slider:         { bg: "from-[#051a2a] via-[#03101a] to-[#020a10]",  accent: "hsl(192 91% 45%)",             iconBg: "bg-cyan-500/15" },
  poll:           { bg: "from-[#1a0520] via-[#100315] to-[#0a020a]",  accent: "hsl(330 81% 60%)",             iconBg: "bg-pink-500/15" },
  counter:        { bg: "from-[#0a200a] via-[#061506] to-[#030a03]",  accent: "hsl(142 76% 36%)",             iconBg: "bg-green-500/15" },
};

const typeLabels: Record<string, { label: string; icon: typeof Zap }> = {
  concept:        { label: "LEARN",         icon: Lightbulb },
  quiz:           { label: "QUIZ",          icon: Brain },
  "case-study":   { label: "CASE STUDY",    icon: BarChart3 },
  simulation:     { label: "SCENARIO",      icon: TrendingUp },
  challenge:      { label: "CHALLENGE",     icon: Target },
  myth:           { label: "MYTH BUSTER",   icon: AlertTriangle },
  shock:          { label: "REALITY CHECK", icon: Zap },
  "rare-insight": { label: "DEEP INSIGHT",  icon: Eye },
  slider:         { label: "GUESS & LEARN", icon: Sparkles },
  poll:           { label: "QUICK POLL",    icon: BarChart3 },
  counter:        { label: "LIVE STAT",     icon: TrendingUp },
};

// Animated counter
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
      if (step >= steps) { setCount(to); clearInterval(timer); }
    }, (duration * 1000) / steps);
    return () => clearInterval(timer);
  }, [isActive, from, to, duration]);
  return <span className="tabular-nums">{prefix}{count.toLocaleString()}{suffix}</span>;
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

  const theme = cardThemes[card.type] || cardThemes.concept;
  const typeInfo = typeLabels[card.type] || typeLabels.concept;
  const TypeIcon = typeInfo.icon;
  const TopicIcon = topicIcons[card.pathway] || Lightbulb;

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
      setTimeout(() => { setRevealed(true); onComplete(true); }, 400);
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
    <div className="h-full w-full relative overflow-hidden bg-black">
      {/* Deep layered background */}
      <div className={cn("absolute inset-0 bg-gradient-to-b", theme.bg)} />

      {/* Subtle noise texture */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
      }} />

      {/* Ambient glow — positioned based on card type */}
      <div
        className="absolute w-[500px] h-[500px] rounded-full opacity-[0.07] blur-[120px]"
        style={{
          background: `radial-gradient(circle, ${theme.accent}, transparent 70%)`,
          top: isPatternInterrupt ? "10%" : "5%",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      />

      {/* Topic icon — large, contextual, not a stock emoji */}
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={isActive ? { scale: 1, opacity: 1 } : { scale: 0.6, opacity: 0 }}
        transition={{ duration: 0.6, type: "spring", bounce: 0.2 }}
        className="absolute top-[14%] left-1/2 -translate-x-1/2 pointer-events-none select-none"
      >
        <div className={cn("w-24 h-24 md:w-28 md:h-28 rounded-3xl flex items-center justify-center", theme.iconBg)}
          style={{ border: `1px solid color-mix(in srgb, ${theme.accent} 20%, transparent)` }}
        >
          <TopicIcon className="w-10 h-10 md:w-12 md:h-12" style={{ color: theme.accent }} strokeWidth={1.5} />
        </div>
      </motion.div>

      {/* Bottom gradient — deeper for readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" style={{ top: "35%" }} />

      {/* XP burst */}
      <AnimatePresence>
        {showXpBurst && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 0 }}
            animate={{ opacity: 1, scale: 1.1, y: -50 }}
            exit={{ opacity: 0, y: -100, scale: 0.8 }}
            transition={{ duration: 0.8 }}
            className="absolute top-[40%] left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-5 py-2.5 rounded-2xl"
            style={{ background: `linear-gradient(135deg, ${theme.accent}, transparent)` }}
          >
            <Zap className="w-6 h-6 text-yellow-400" />
            <span className="text-2xl font-black text-white">+{card.xpReward} XP</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top bar — clean, integrated */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: -15 }}
        transition={{ delay: 0.1 }}
        className="absolute top-14 left-0 right-0 px-4 flex items-center justify-between z-10"
      >
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.06] border border-white/[0.06]">
            <TypeIcon className="w-3 h-3" style={{ color: theme.accent }} />
            <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: theme.accent }}>
              {typeInfo.label}
            </span>
          </div>
          <div className="px-2.5 py-1.5 rounded-lg bg-white/[0.06] border border-white/[0.06]">
            <span className="text-white/50 text-[10px] font-semibold">{card.pathway}</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.06] border border-white/[0.06]">
          <Zap className="w-3 h-3 text-yellow-400/80" />
          <span className="text-white/70 text-[10px] font-bold">+{card.xpReward}</span>
        </div>
      </motion.div>

      {/* Social actions — right side, subtle and native */}
      <motion.div
        initial={{ opacity: 0, x: 15 }}
        animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0, x: 15 }}
        transition={{ delay: 0.4 }}
        className="absolute right-3 bottom-[30%] flex flex-col items-center gap-4 z-10"
      >
        <motion.button
          onClick={() => setLiked(!liked)}
          whileTap={{ scale: 1.2 }}
          className="flex flex-col items-center gap-0.5"
        >
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200",
            liked ? "bg-red-500/20 border border-red-500/30" : "bg-white/[0.06] border border-white/[0.06]"
          )}>
            <Heart className={cn("w-[18px] h-[18px] transition-all", liked ? "text-red-400 fill-red-400" : "text-white/40")} />
          </div>
          <span className={cn("text-[9px] font-semibold", liked ? "text-red-400/80" : "text-white/25")}>{liked ? "Liked" : "Like"}</span>
        </motion.button>
        <motion.button whileTap={{ scale: 1.15 }} className="flex flex-col items-center gap-0.5">
          <div className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/[0.06] flex items-center justify-center">
            <Share2 className="w-[18px] h-[18px] text-white/40" />
          </div>
          <span className="text-white/25 text-[9px] font-semibold">Share</span>
        </motion.button>
        <motion.button
          onClick={() => setSaved(!saved)}
          whileTap={{ scale: 1.15 }}
          className="flex flex-col items-center gap-0.5"
        >
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200",
            saved ? "bg-primary/20 border border-primary/30" : "bg-white/[0.06] border border-white/[0.06]"
          )}>
            <Bookmark className={cn("w-[18px] h-[18px] transition-all", saved ? "text-primary fill-primary" : "text-white/40")} />
          </div>
          <span className={cn("text-[9px] font-semibold", saved ? "text-primary/80" : "text-white/25")}>{saved ? "Saved" : "Save"}</span>
        </motion.button>
      </motion.div>

      {/* ═══════════════════════════════════════════ */}
      {/* MAIN CONTENT — bottom-aligned with real spacing */}
      {/* ═══════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ delay: 0.08, duration: 0.5, ease: "easeOut" }}
        className="absolute bottom-0 left-0 right-14 p-5 pb-7 z-10 flex flex-col gap-3"
      >
        {/* Difficulty pill */}
        <div className="flex items-center gap-2">
          <span className={cn(
            "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded",
            card.difficulty === "beginner" ? "bg-emerald-500/15 text-emerald-400/80" :
            card.difficulty === "intermediate" ? "bg-amber-500/15 text-amber-400/80" :
            "bg-red-500/15 text-red-400/80"
          )}>
            {card.difficulty}
          </span>
        </div>

        {/* Title */}
        <h2 className="text-white text-[22px] md:text-[28px] font-extrabold leading-[1.15] tracking-tight">
          {card.title}
        </h2>

        {/* ===== CONCEPT ===== */}
        {card.type === "concept" && (
          <div className="space-y-3">
            <p className="text-white/60 text-[13px] leading-relaxed">{card.content}</p>
            {card.insight && (
              <motion.button
                onClick={handleReveal}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "w-full p-4 rounded-xl text-left transition-all duration-300 border",
                  tapped
                    ? "bg-white/[0.08] border-white/[0.12]"
                    : "bg-white/[0.04] border-white/[0.06] hover:bg-white/[0.06]"
                )}
              >
                <AnimatePresence mode="wait">
                  {!tapped ? (
                    <motion.div key="prompt" exit={{ opacity: 0 }} className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `color-mix(in srgb, ${theme.accent} 15%, transparent)` }}>
                        <Lightbulb className="w-4 h-4" style={{ color: theme.accent }} />
                      </div>
                      <div>
                        <span className="text-white/80 text-sm font-bold block">Tap to reveal insight</span>
                        <span className="text-white/30 text-[11px]">Key takeaway inside</span>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.p key="insight" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                      className="text-white/80 text-sm font-medium leading-relaxed"
                    >
                      💡 {card.insight}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.button>
            )}
          </div>
        )}

        {/* ===== QUIZ / CASE-STUDY / SIMULATION / CHALLENGE ===== */}
        {(["quiz", "case-study", "simulation", "challenge"].includes(card.type)) && card.options && (
          <div className="space-y-2.5">
            <p className="text-white/60 text-[13px] leading-relaxed">{card.content}</p>
            <div className="space-y-2 pt-1">
              {card.options.map((opt, idx) => {
                const isSelected = selected === idx;
                const showResult = selected !== null;
                const isCorrect = opt.correct;
                return (
                  <motion.button
                    key={idx}
                    onClick={() => handleOptionSelect(idx)}
                    whileTap={selected === null ? { scale: 0.98 } : {}}
                    initial={{ opacity: 0, x: -15 }}
                    animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0, x: -15 }}
                    transition={{ delay: 0.15 + idx * 0.06 }}
                    className={cn(
                      "w-full text-left p-3.5 rounded-xl transition-all duration-300 border",
                      // Correct answer states
                      showResult && isCorrect && "bg-emerald-500/10 border-emerald-500/25",
                      // Wrong selected
                      showResult && isSelected && !isCorrect && "bg-red-500/10 border-red-500/25",
                      // Other wrong (fade out)
                      showResult && !isSelected && !isCorrect && "opacity-30 border-transparent bg-transparent",
                      // Default — intentional hover/active states
                      !showResult && "bg-white/[0.04] border-white/[0.06] hover:bg-white/[0.07] hover:border-white/[0.1] active:bg-white/[0.1]"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold flex-shrink-0 mt-0.5 transition-all border",
                        showResult && isCorrect && "border-emerald-500/40 bg-emerald-500/20 text-emerald-400",
                        showResult && isSelected && !isCorrect && "border-red-500/40 bg-red-500/20 text-red-400",
                        !showResult && "border-white/10 bg-white/[0.04] text-white/50"
                      )}>
                        {showResult && isCorrect ? <CheckCircle className="w-3.5 h-3.5" /> :
                         showResult && isSelected ? <XCircle className="w-3.5 h-3.5" /> :
                         String.fromCharCode(65 + idx)}
                      </div>
                      <span className={cn(
                        "text-[13px] font-medium leading-snug",
                        showResult && !isSelected && !isCorrect ? "text-white/30" : "text-white/80"
                      )}>
                        {opt.text}
                      </span>
                    </div>
                    {showResult && (isSelected || isCorrect) && opt.explanation && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="text-white/40 text-[11px] mt-2.5 ml-10 leading-relaxed"
                      >
                        {opt.explanation}
                      </motion.p>
                    )}
                  </motion.button>
                );
              })}
            </div>
            {selected !== null && card.scenarioOutcome && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 rounded-xl bg-white/[0.04] border border-white/[0.06] mt-1"
              >
                <span className="text-yellow-400/80 text-[11px] font-bold">📈 Outcome: </span>
                <span className="text-white/50 text-[11px] leading-relaxed">{card.scenarioOutcome}</span>
              </motion.div>
            )}
          </div>
        )}

        {/* ===== MYTH / SHOCK / RARE INSIGHT ===== */}
        {(["myth", "shock", "rare-insight"].includes(card.type)) && (
          <div className="space-y-3">
            <p className="text-white/65 text-[14px] leading-relaxed">{card.content}</p>
            <motion.button
              onClick={handleReveal}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "w-full p-4 rounded-xl text-left border transition-all duration-300",
                tapped ? "bg-white/[0.08] border-white/[0.12]" : "bg-white/[0.04] border-white/[0.06] hover:bg-white/[0.06]"
              )}
            >
              <AnimatePresence mode="wait">
                {!tapped ? (
                  <motion.div key="cta" exit={{ opacity: 0 }} className="flex items-center gap-3">
                    <motion.div
                      animate={{ scale: [1, 1.08, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-9 h-9 rounded-lg flex items-center justify-center"
                      style={{ background: `color-mix(in srgb, ${theme.accent} 15%, transparent)` }}
                    >
                      <Sparkles className="w-4 h-4" style={{ color: theme.accent }} />
                    </motion.div>
                    <div>
                      <span className="text-white/80 text-sm font-bold block">Tap for the real stat</span>
                      <span className="text-white/30 text-[11px]">This might change how you think</span>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="stat" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-1">
                    <span className="text-2xl font-black text-white block">{card.insight}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        )}

        {/* ===== SLIDER ===== */}
        {card.type === "slider" && card.sliderConfig && (
          <div className="space-y-4">
            <p className="text-white/65 text-[14px] font-medium">{card.content}</p>
            <div className="space-y-3">
              <div className="text-center">
                <motion.span key={sliderValue[0]} initial={{ scale: 1.1 }} animate={{ scale: 1 }}
                  className="text-3xl font-black text-white tabular-nums"
                >
                  {sliderValue[0]}{card.sliderConfig.unit}
                </motion.span>
              </div>
              <div className="px-1">
                <Slider
                  value={sliderValue} onValueChange={setSliderValue}
                  min={card.sliderConfig.min} max={card.sliderConfig.max} step={1}
                  disabled={sliderSubmitted}
                  className="[&_[role=slider]]:bg-white [&_[role=slider]]:border-0 [&_[role=slider]]:w-5 [&_[role=slider]]:h-5 [&_[role=slider]]:shadow-md"
                />
                <div className="flex justify-between mt-1.5">
                  <span className="text-white/20 text-[10px] font-medium">{card.sliderConfig.min}{card.sliderConfig.unit}</span>
                  <span className="text-white/20 text-[10px] font-medium">{card.sliderConfig.max}{card.sliderConfig.unit}</span>
                </div>
              </div>
              {!sliderSubmitted ? (
                <motion.button onClick={handleSliderSubmit} whileTap={{ scale: 0.98 }}
                  className="w-full py-3 rounded-xl border transition-all hover:bg-white/[0.08]"
                  style={{
                    background: `linear-gradient(135deg, color-mix(in srgb, ${theme.accent} 10%, transparent), transparent)`,
                    borderColor: `color-mix(in srgb, ${theme.accent} 20%, transparent)`,
                    color: theme.accent,
                  }}
                >
                  <span className="font-bold text-sm">Lock in my answer →</span>
                </motion.button>
              ) : (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl bg-white/[0.04] border border-white/[0.06] space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-white/40 text-xs font-medium">Your guess</span>
                    <span className="text-white/80 font-bold text-sm">{sliderValue[0]}{card.sliderConfig.unit}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/40 text-xs font-medium">Correct answer</span>
                    <span className="text-emerald-400 font-bold text-sm">{card.sliderConfig.answer}{card.sliderConfig.unit}</span>
                  </div>
                  <p className="text-white/40 text-[11px] leading-relaxed pt-1 border-t border-white/[0.06]">{card.sliderConfig.explanation}</p>
                </motion.div>
              )}
            </div>
          </div>
        )}

        {/* ===== POLL ===== */}
        {card.type === "poll" && card.options && (
          <div className="space-y-2.5">
            {card.options.map((opt, idx) => {
              const fakePercent = pollVoted !== null
                ? idx === 0 ? 62 : idx === 1 ? 24 : idx === 2 ? 9 : 5
                : 0;
              return (
                <motion.button
                  key={idx}
                  onClick={() => handlePollVote(idx)}
                  whileTap={pollVoted === null ? { scale: 0.98 } : {}}
                  className={cn(
                    "w-full text-left p-3.5 rounded-xl border transition-all relative overflow-hidden",
                    pollVoted === idx
                      ? "border-white/15 bg-white/[0.08]"
                      : "border-white/[0.06] bg-white/[0.04] hover:bg-white/[0.06]"
                  )}
                >
                  {pollVoted !== null && (
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${fakePercent}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="absolute inset-y-0 left-0 bg-white/[0.06] rounded-xl"
                    />
                  )}
                  <div className="relative flex items-center justify-between">
                    <span className="text-white/80 text-[13px] font-semibold">{opt.text}</span>
                    {pollVoted !== null && (
                      <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="text-white/40 text-sm font-bold tabular-nums"
                      >
                        {fakePercent}%
                      </motion.span>
                    )}
                  </div>
                </motion.button>
              );
            })}
            {pollVoted !== null && (
              <motion.p initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                className="text-white/40 text-[11px] leading-relaxed px-1 pt-1"
              >
                💡 {card.content}
              </motion.p>
            )}
          </div>
        )}

        {/* ===== COUNTER ===== */}
        {card.type === "counter" && card.counterConfig && (
          <div className="space-y-4">
            <div className="text-center py-3">
              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                animate={isActive ? { scale: 1, opacity: 1 } : { scale: 0.85, opacity: 0 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="text-4xl md:text-5xl font-black text-white"
              >
                <AnimatedCounter
                  from={card.counterConfig.from} to={card.counterConfig.to}
                  suffix={card.counterConfig.suffix} prefix={card.counterConfig.prefix}
                  duration={card.counterConfig.duration} isActive={isActive}
                />
              </motion.div>
              <p className="text-white/50 text-sm font-medium mt-2">{card.content}</p>
            </div>
            <motion.div
              initial={{ opacity: 0 }} animate={isActive ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 1.5 }}
              className="p-3.5 rounded-xl bg-white/[0.04] border border-white/[0.06]"
            >
              <p className="text-white/35 text-[11px] leading-relaxed">{card.counterConfig.context}</p>
            </motion.div>
          </div>
        )}

        {/* Scroll hint */}
        <motion.div
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 1.8, repeat: Infinity }}
          className="flex items-center gap-1.5 text-white/15 mt-1"
        >
          <ChevronUp className="w-3 h-3" />
          <span className="text-[9px] font-medium tracking-wide">Swipe for more</span>
        </motion.div>
      </motion.div>
    </div>
  );
};

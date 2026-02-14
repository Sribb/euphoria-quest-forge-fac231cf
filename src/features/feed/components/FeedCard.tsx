import { motion } from "framer-motion";
import { Zap, Heart, Share2, Bookmark, MessageCircle, Music2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export type CardType = "fact" | "stat" | "story" | "myth" | "tip";

export interface FeedCardData {
  id: string;
  type: CardType;
  lessonTitle: string;
  pathway: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  xpReward: number;
  title: string;
  content: string;
  stat?: string;
  statLabel?: string;
}

interface FeedCardProps {
  card: FeedCardData;
  onComplete: (correct: boolean) => void;
  isActive: boolean;
}

const visualThemes: Record<CardType, { emoji: string; gradient: string; accent: string }> = {
  fact: { emoji: "💡", gradient: "from-violet-600 via-fuchsia-600 to-pink-700", accent: "bg-violet-500" },
  stat: { emoji: "📊", gradient: "from-cyan-600 via-blue-700 to-indigo-800", accent: "bg-cyan-500" },
  story: { emoji: "📖", gradient: "from-amber-500 via-orange-600 to-red-700", accent: "bg-amber-500" },
  myth: { emoji: "🔥", gradient: "from-rose-600 via-red-700 to-orange-800", accent: "bg-rose-500" },
  tip: { emoji: "💎", gradient: "from-emerald-500 via-teal-600 to-cyan-800", accent: "bg-emerald-500" },
};

const typeLabels: Record<CardType, string> = {
  fact: "💡 LEARN",
  stat: "📊 STATS",
  story: "📖 STORY",
  myth: "🔥 MYTH BUSTER",
  tip: "💎 PRO TIP",
};

export const FeedCard = ({ card, isActive }: FeedCardProps) => {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const theme = visualThemes[card.type] || visualThemes.fact;

  return (
    <div className="h-full w-full relative overflow-hidden bg-black select-none">
      {/* Full-screen gradient */}
      <div className={cn("absolute inset-0 bg-gradient-to-br", theme.gradient)} />

      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-white/20"
            initial={{ x: `${15 + i * 15}%`, y: "110%" }}
            animate={isActive ? { y: "-10%", opacity: [0, 0.6, 0] } : {}}
            transition={{ duration: 4 + i * 0.8, repeat: Infinity, delay: i * 0.7 }}
          />
        ))}
      </div>

      {/* Large floating emoji */}
      <motion.div
        initial={{ scale: 0, rotate: -30 }}
        animate={isActive ? { scale: 1, rotate: 8 } : { scale: 0 }}
        transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
        className="absolute top-[12%] right-[8%] text-[100px] md:text-[140px] opacity-15 pointer-events-none"
      >
        {theme.emoji}
      </motion.div>

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />

      {/* ===== RIGHT SIDE SOCIAL BAR (TikTok-style) ===== */}
      <div className="absolute right-3 bottom-[25%] flex flex-col items-center gap-5 z-20">
        {/* Profile avatar placeholder */}
        <motion.div
          initial={{ scale: 0 }}
          animate={isActive ? { scale: 1 } : { scale: 0 }}
          transition={{ delay: 0.3 }}
          className="relative mb-2"
        >
          <div className={cn("w-12 h-12 rounded-full border-2 border-white flex items-center justify-center text-lg", theme.accent)}>
            {theme.emoji}
          </div>
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-rose-500 flex items-center justify-center">
            <span className="text-[10px] text-white font-black">+</span>
          </div>
        </motion.div>

        <SocialButton icon={Heart} label="4.2K" active={liked} activeColor="text-rose-500" onClick={() => setLiked(!liked)} isActive={isActive} delay={0.35} />
        <SocialButton icon={MessageCircle} label="328" isActive={isActive} delay={0.4} />
        <SocialButton icon={Bookmark} label="Save" active={saved} activeColor="text-yellow-400" onClick={() => setSaved(!saved)} isActive={isActive} delay={0.45} />
        <SocialButton icon={Share2} label="Share" isActive={isActive} delay={0.5} />

        {/* Spinning record icon */}
        <motion.div
          animate={isActive ? { rotate: 360 } : {}}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-900 border-2 border-zinc-600 flex items-center justify-center mt-2"
        >
          <Music2 className="w-3.5 h-3.5 text-white" />
        </motion.div>
      </div>

      {/* ===== MAIN CONTENT — Bottom-aligned ===== */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="absolute bottom-0 left-0 right-16 p-5 pb-6 z-10"
      >
        {/* Creator row */}
        <div className="flex items-center gap-2 mb-3">
          <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white", theme.accent)}>
            E
          </div>
          <span className="text-white text-sm font-bold">Euphoria Learn</span>
          <span className="text-white/40 text-xs">•</span>
          <span className="px-2 py-0.5 rounded-full bg-white/10 text-white/70 text-[10px] font-bold uppercase tracking-wider">
            {typeLabels[card.type]}
          </span>
        </div>

        {/* Big stat callout */}
        {card.stat && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={isActive ? { scale: 1, opacity: 1 } : {}}
            transition={{ delay: 0.25, type: "spring", bounce: 0.3 }}
            className="mb-4"
          >
            <div className="inline-flex flex-col items-start px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
              <span className="text-3xl md:text-4xl font-black text-white leading-none">{card.stat}</span>
              <span className="text-white/50 text-[10px] font-bold uppercase tracking-widest mt-1">{card.statLabel}</span>
            </div>
          </motion.div>
        )}

        {/* Title — large, bold, attention-grabbing */}
        <h2 className="text-white text-xl md:text-2xl font-black leading-tight mb-2 drop-shadow-lg">
          {card.title}
        </h2>

        {/* Body text — concise */}
        <p className="text-white/75 text-sm leading-relaxed line-clamp-3 mb-3">
          {card.content}
        </p>

        {/* Tags */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-white/50 text-xs font-semibold">#{card.pathway.replace(/\s+/g, "")}</span>
          <span className="text-white/50 text-xs font-semibold capitalize">#{card.difficulty}</span>
          <span className="text-white/50 text-xs font-semibold">#{card.lessonTitle.replace(/\s+/g, "")}</span>
        </div>

        {/* Fake audio bar */}
        <div className="flex items-center gap-2 mt-3">
          <Music2 className="w-3 h-3 text-white/40" />
          <div className="flex-1 flex items-end gap-[2px] h-3">
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className="flex-1 bg-white/30 rounded-full"
                animate={isActive ? { height: [3, 6 + Math.random() * 8, 3] } : { height: 3 }}
                transition={{ duration: 0.5 + Math.random() * 0.5, repeat: Infinity, delay: i * 0.05 }}
                style={{ minHeight: 2 }}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Top-right XP badge */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.3 }}
        className="absolute top-4 right-4 z-10"
      >
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-xl border border-white/10">
          <Zap className="w-3.5 h-3.5 text-yellow-400" />
          <span className="text-white text-xs font-bold">+{card.xpReward} XP</span>
        </div>
      </motion.div>
    </div>
  );
};

/* Social action button component */
function SocialButton({
  icon: Icon,
  label,
  active,
  activeColor,
  onClick,
  isActive: cardActive,
  delay,
}: {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  activeColor?: string;
  onClick?: () => void;
  isActive: boolean;
  delay: number;
}) {
  return (
    <motion.button
      initial={{ opacity: 0, x: 20 }}
      animate={cardActive ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
      transition={{ delay }}
      onClick={onClick}
      className="flex flex-col items-center gap-1"
    >
      <div className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center">
        <Icon className={cn("w-6 h-6", active ? activeColor : "text-white")} fill={active ? "currentColor" : "none"} />
      </div>
      <span className="text-white text-[10px] font-bold">{label}</span>
    </motion.button>
  );
}

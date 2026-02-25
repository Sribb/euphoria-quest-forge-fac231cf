import { useXPSystem } from "@/hooks/useXPSystem";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Sparkles, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

const TICK_COUNT = 36;
const RADIUS = 38;
const CENTER = 48;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export const XPOrb = () => {
  const { userStats, levelThresholds, getXPProgress, levelUpAnimation, clearLevelUpAnimation } = useXPSystem();

  const xpProgress = getXPProgress();
  const currentLevelData = levelThresholds?.find(l => l.level === userStats?.level);
  const pct = xpProgress.percentage;

  if (!userStats) return null;

  const ticks = Array.from({ length: TICK_COUNT }, (_, i) => {
    const angle = (i / TICK_COUNT) * 360;
    const rad = (angle - 90) * (Math.PI / 180);
    const filled = (i / TICK_COUNT) * 100 <= pct;
    const inner = 41;
    const outer = 45;
    return { x1: CENTER + inner * Math.cos(rad), y1: CENTER + inner * Math.sin(rad), x2: CENTER + outer * Math.cos(rad), y2: CENTER + outer * Math.sin(rad), filled };
  });

  return (
    <div className="relative">
      {levelUpAnimation && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-fade-in"
          onClick={clearLevelUpAnimation}
        >
          <div className="text-center p-8 bg-card border border-primary/30 rounded-3xl shadow-glow animate-scale-in">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow">
              <span className="text-4xl font-bold text-white">{levelUpAnimation.newLevel}</span>
            </div>
            <h2 className="text-2xl font-bold text-primary mb-2">Level Up!</h2>
            <p className="text-lg text-foreground">{levelUpAnimation.title}</p>
            <p className="text-sm text-muted-foreground mt-4">Click anywhere to continue</p>
          </div>
        </div>
      )}

      <div className="relative group cursor-pointer">
        {/* Neon glow */}
        <motion.div
          className="absolute inset-[-4px] rounded-full bg-primary/20 blur-xl"
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* SVG Ring */}
        <svg width="96" height="96" viewBox="0 0 96 96" className="relative">
          <defs>
            <linearGradient id="xp-ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--primary))" />
              <stop offset="50%" stopColor="hsl(var(--accent))" />
              <stop offset="100%" stopColor="hsl(var(--primary))" />
            </linearGradient>
            <filter id="xp-glow">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background track */}
          <circle cx={CENTER} cy={CENTER} r={RADIUS} fill="none" stroke="hsl(var(--muted))" strokeWidth="3.5" opacity="0.3" />

          {/* Animated fill ring */}
          <motion.circle
            cx={CENTER}
            cy={CENTER}
            r={RADIUS}
            fill="none"
            stroke="url(#xp-ring-grad)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            filter="url(#xp-glow)"
            initial={{ strokeDashoffset: CIRCUMFERENCE }}
            animate={{ strokeDashoffset: CIRCUMFERENCE * (1 - pct / 100) }}
            transition={{ duration: 1, ease: "easeOut" }}
            style={{ transform: "rotate(-90deg)", transformOrigin: "center" }}
          />

          {/* Tick marks */}
          {ticks.map((t, i) => (
            <line
              key={i}
              x1={t.x1}
              y1={t.y1}
              x2={t.x2}
              y2={t.y2}
              stroke={t.filled ? "hsl(var(--primary))" : "hsl(var(--muted))"}
              strokeWidth="1.2"
              opacity={t.filled ? 0.9 : 0.2}
              strokeLinecap="round"
            />
          ))}

          {/* Center text */}
          <text x={CENTER} y={CENTER - 6} textAnchor="middle" fill="hsl(var(--foreground))" fontSize="18" fontWeight="800">
            {Math.round(pct)}%
          </text>
          <text x={CENTER} y={CENTER + 10} textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="9" fontWeight="600">
            LV {userStats.level}
          </text>
        </svg>

        {/* Hover tooltip */}
        <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 w-48 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
          <div className="bg-card/95 backdrop-blur-sm border border-border rounded-xl p-3 shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="font-semibold text-sm">{currentLevelData?.title || "Investor"}</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">XP Progress</span>
                <span className="font-medium">{xpProgress.current}/{xpProgress.required}</span>
              </div>
              <Progress value={pct} className="h-1.5" />
              <p className="text-xs text-muted-foreground">
                Total XP: {userStats.experience_points}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

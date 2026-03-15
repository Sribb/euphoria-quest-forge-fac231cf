import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Snowflake, Trophy, Shield, Star, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useStreak } from "@/hooks/useStreak";
import { playMilestone, playClick } from "@/lib/soundEffects";
import { fireConfetti } from "@/lib/confetti";

const MILESTONE_CONFIG: Record<number, { label: string; emoji: string; icon: typeof Trophy; color: string }> = {
  7: { label: "Week Warrior", emoji: "", icon: Zap, color: "text-warning" },
  30: { label: "Monthly Master", emoji: "", icon: Star, color: "text-primary" },
  100: { label: "Century Champion", emoji: "", icon: Trophy, color: "text-accent-foreground" },
  365: { label: "Year Legend", emoji: "", icon: Shield, color: "text-destructive" },
};

export const StreakCard = () => {
  const streak = useStreak();
  const [showMilestone, setShowMilestone] = useState<number | null>(null);
  const [hasCheckedIn, setHasCheckedIn] = useState(false);

  // Auto check-in on mount
  useEffect(() => {
    if (!streak.loading && !streak.checkedInToday && !hasCheckedIn) {
      setHasCheckedIn(true);
      streak.checkIn().then(async result => {
        if (result?.newMilestone) {
          setShowMilestone(result.newMilestone);
          playMilestone();
          fireConfetti();
          // Award a streak freeze at every milestone
          await streak.earnFreeze();
        }
      });
    }
  }, [streak.loading, streak.checkedInToday, hasCheckedIn]);

  if (streak.loading) return null;

  const flameSize = streak.currentStreak >= 100 ? "w-10 h-10" :
    streak.currentStreak >= 30 ? "w-9 h-9" :
    streak.currentStreak >= 7 ? "w-8 h-8" : "w-7 h-7";

  const flameColor = streak.currentStreak >= 100 ? "text-destructive" :
    streak.currentStreak >= 30 ? "text-warning" :
    streak.currentStreak >= 7 ? "text-accent-foreground" : "text-muted-foreground";

  return (
    <>
      <div className="p-5 rounded-3xl border border-border/30 bg-card space-y-4">
        {/* Top row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              animate={streak.currentStreak > 0 ? {
                scale: [1, 1.15, 1],
                rotate: [0, -5, 5, 0],
              } : {}}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              <Flame className={`${flameSize} ${streak.currentStreak > 0 ? flameColor : "text-muted-foreground/30"}`}
                fill={streak.currentStreak > 0 ? "currentColor" : "none"}
              />
            </motion.div>
            <div>
              <p className="text-3xl font-black text-foreground tracking-tight">{streak.currentStreak}</p>
              <p className="text-xs font-medium text-muted-foreground">day streak</p>
            </div>
          </div>

          {/* Streak freezes */}
          <div className="flex items-center gap-2">
            {Array.from({ length: Math.min(streak.streakFreezes, 3) }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center"
              >
                <Snowflake className="w-4 h-4 text-primary" />
              </motion.div>
            ))}
            {streak.streakFreezes > 3 && (
              <span className="text-xs font-bold text-muted-foreground">+{streak.streakFreezes - 3}</span>
            )}
            {streak.streakFreezes === 0 && (
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <Snowflake className="w-3.5 h-3.5 text-muted-foreground/40" />
                No freezes
              </div>
            )}
          </div>
        </div>

        {/* Milestone progress */}
        {streak.nextMilestone && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground font-medium">
                Next: {MILESTONE_CONFIG[streak.nextMilestone]?.emoji} {MILESTONE_CONFIG[streak.nextMilestone]?.label}
              </span>
              <span className="font-bold text-foreground">
                {streak.currentStreak}/{streak.nextMilestone} days
              </span>
            </div>
            <Progress value={streak.progressToNextMilestone} className="h-2" />
          </div>
        )}

        {/* Earned milestones */}
        <div className="flex items-center gap-2 flex-wrap">
          {([7, 30, 100, 365] as const).map(m => {
            const cfg = MILESTONE_CONFIG[m];
            const earned = streak.milestones[m];
            return (
              <div
                key={m}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                  earned
                    ? "bg-primary/10 border-primary/20 text-primary"
                    : "bg-muted/20 border-border/20 text-muted-foreground/40"
                }`}
              >
                <span>{cfg.emoji}</span>
                <span>{m}d</span>
              </div>
            );
          })}
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-4 pt-2 border-t border-border/20">
          <div className="flex-1 text-center">
            <p className="text-lg font-bold text-foreground">{streak.longestStreak}</p>
            <p className="text-[10px] text-muted-foreground font-medium">Best Streak</p>
          </div>
          <div className="w-px h-8 bg-border/30" />
          <div className="flex-1 text-center">
            <p className="text-lg font-bold text-foreground">{streak.streakFreezes}</p>
            <p className="text-[10px] text-muted-foreground font-medium">Freezes</p>
          </div>
          <div className="w-px h-8 bg-border/30" />
          <div className="flex-1 text-center">
            <p className="text-lg font-bold text-foreground">
              {streak.checkedInToday ? "Done" : "Pending"}
            </p>
            <p className="text-[10px] text-muted-foreground font-medium">Today</p>
          </div>
        </div>
      </div>

      {/* Milestone celebration modal */}
      <AnimatePresence>
        {showMilestone && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
            onClick={() => setShowMilestone(null)}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 15 }}
              className="bg-card border border-border rounded-3xl p-8 max-w-sm w-full text-center space-y-4"
              onClick={e => e.stopPropagation()}
            >
              <motion.span
                className="text-7xl block"
                animate={{ scale: [1, 1.3, 1], rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.8 }}
              >
                {MILESTONE_CONFIG[showMilestone]?.emoji}
              </motion.span>
              <h2 className="text-2xl font-black text-foreground">
                {showMilestone}-Day Streak!
              </h2>
              <p className="text-lg font-bold text-primary">
                {MILESTONE_CONFIG[showMilestone]?.label}
              </p>
              <p className="text-sm text-muted-foreground">
                You've learned for {showMilestone} days in a row. Incredible dedication!
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-primary font-bold">
                <Snowflake className="w-4 h-4" />
                +1 Streak Freeze earned!
              </div>
              <Button onClick={() => { playClick(); setShowMilestone(null); }} className="w-full rounded-xl">
                Keep Going!
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

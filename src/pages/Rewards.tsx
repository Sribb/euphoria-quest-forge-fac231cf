import { useXPSystem } from "@/hooks/useXPSystem";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Trophy, Star, Zap, Gift, Lock, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface RewardsProps {
  onNavigate: (tab: string) => void;
}

const Rewards = ({ onNavigate }: RewardsProps) => {
  const { user } = useAuth();
  const { userStats, levelThresholds, getXPProgress } = useXPSystem();
  const xpProgress = getXPProgress();

  const { data: streakData } = useQuery({
    queryKey: ["streak", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("streaks")
        .select("current_streak, longest_streak")
        .eq("user_id", user?.id)
        .single();
      return data;
    },
    enabled: !!user?.id,
  });

  const { data: lessonsCompleted } = useQuery({
    queryKey: ["lessons-completed-count", user?.id],
    queryFn: async () => {
      const { count } = await supabase
        .from("user_lesson_progress")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user?.id)
        .eq("completed", true);
      return count || 0;
    },
    enabled: !!user?.id,
  });

  const currentLevel = userStats?.level || 1;
  const currentXP = userStats?.experience_points || 0;
  const currentTitle = levelThresholds?.find((l) => l.level === currentLevel)?.title || "Beginner";

  // Placeholder reward tiers - just the structure, no actual rewards yet
  const rewardTiers = [
    { level: 2, label: "Bronze", color: "from-amber-700 to-amber-500", unlocked: currentLevel >= 2 },
    { level: 4, label: "Silver", color: "from-gray-400 to-gray-300", unlocked: currentLevel >= 4 },
    { level: 6, label: "Gold", color: "from-yellow-500 to-yellow-300", unlocked: currentLevel >= 6 },
    { level: 8, label: "Platinum", color: "from-cyan-400 to-blue-300", unlocked: currentLevel >= 8 },
    { level: 10, label: "Diamond", color: "from-purple-500 to-pink-400", unlocked: currentLevel >= 10 },
  ];

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-black text-foreground tracking-tight">Rewards</h1>
        <p className="text-muted-foreground mt-1">Level up to unlock rewards</p>
      </motion.div>

      {/* XP & Level Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="bg-card border border-border rounded-3xl p-6 space-y-5"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-glow-soft">
              <span className="text-2xl font-black text-white">{currentLevel}</span>
            </div>
            <div>
              <h2 className="text-xl font-black text-foreground">{currentTitle}</h2>
              <p className="text-sm text-muted-foreground">{currentXP.toLocaleString()} total XP</p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-primary">
              <Zap className="w-5 h-5" />
              <span className="text-lg font-black">{xpProgress.current}</span>
            </div>
            <p className="text-xs text-muted-foreground">/ {xpProgress.required} XP</p>
          </div>
        </div>

        {/* XP Progress bar */}
        <div className="space-y-2">
          <div className="relative h-4 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${xpProgress.percentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-accent rounded-full"
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Level {currentLevel}</span>
            <span>{Math.round(xpProgress.percentage)}%</span>
            <span>Level {currentLevel + 1}</span>
          </div>
        </div>
      </motion.div>

      {/* Stats row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-3 gap-3"
      >
        {[
          { icon: Star, label: "Streak", value: `${streakData?.current_streak || 0}d`, color: "text-warning" },
          { icon: Trophy, label: "Lessons", value: lessonsCompleted || 0, color: "text-primary" },
          { icon: Zap, label: "Total XP", value: currentXP.toLocaleString(), color: "text-accent" },
        ].map((stat, i) => (
          <div
            key={stat.label}
            className="bg-card border border-border rounded-2xl p-4 text-center"
          >
            <stat.icon className={cn("w-6 h-6 mx-auto mb-1", stat.color)} />
            <p className="text-lg font-black text-foreground">{stat.value}</p>
            <p className="text-[11px] text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Level thresholds */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="space-y-3"
      >
        <h3 className="text-lg font-black text-foreground">Level Progression</h3>
        <div className="space-y-2">
          {levelThresholds?.map((threshold) => {
            const isUnlocked = currentLevel >= threshold.level;
            const isCurrent = currentLevel === threshold.level;
            return (
              <div
                key={threshold.level}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-2xl border transition-all",
                  isCurrent
                    ? "bg-primary/10 border-primary/30"
                    : isUnlocked
                    ? "bg-card border-border"
                    : "bg-muted/30 border-border/50 opacity-60"
                )}
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm",
                    isCurrent
                      ? "bg-primary text-primary-foreground shadow-glow-soft"
                      : isUnlocked
                      ? "bg-primary/20 text-primary"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {threshold.level}
                </div>
                <div className="flex-1">
                  <p className="font-black text-foreground text-sm">{threshold.title}</p>
                  <p className="text-xs text-muted-foreground">{threshold.xp_required.toLocaleString()} XP required</p>
                </div>
                {isUnlocked ? (
                  <Star className="w-5 h-5 text-warning fill-warning" />
                ) : (
                  <Lock className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Reward Tiers (coming soon) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-3"
      >
        <h3 className="text-lg font-black text-foreground">Reward Tiers</h3>
        <div className="space-y-2">
          {rewardTiers.map((tier) => (
            <div
              key={tier.label}
              className={cn(
                "flex items-center gap-4 p-4 rounded-2xl border",
                tier.unlocked ? "bg-card border-border" : "bg-muted/30 border-border/50 opacity-50"
              )}
            >
              <div className={cn("w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center", tier.color)}>
                <Gift className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-black text-foreground text-sm">{tier.label} Tier</p>
                <p className="text-xs text-muted-foreground">Reach Level {tier.level}</p>
              </div>
              {tier.unlocked ? (
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              ) : (
                <Lock className="w-4 h-4 text-muted-foreground" />
              )}
            </div>
          ))}
        </div>
        <p className="text-xs text-center text-muted-foreground pt-2">
          Rewards coming soon — keep leveling up! 🚀
        </p>
      </motion.div>
    </div>
  );
};

export default Rewards;

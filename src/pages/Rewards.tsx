import { useXPSystem, AVATAR_UNLOCKS, XP_PER_CORRECT, XP_PERFECT_BONUS, XP_LESSON_COMPLETE } from "@/hooks/useXPSystem";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Trophy, Star, Zap, Lock, ChevronRight, Flame, Gift, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface RewardsProps {
  onNavigate: (tab: string) => void;
}

const Rewards = ({ onNavigate }: RewardsProps) => {
  const { user } = useAuth();
  const { userStats, levelThresholds, getXPProgress, isDoubleXP, multiplier, getUnlockedAvatars, getNextAvatarUnlock } = useXPSystem();
  const xpProgress = getXPProgress();
  const [showAllLevels, setShowAllLevels] = useState(false);

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
  const unlockedAvatars = getUnlockedAvatars();
  const nextAvatar = getNextAvatarUnlock();

  // Show levels around current level, or all
  const visibleLevels = showAllLevels
    ? levelThresholds
    : levelThresholds?.filter(l => l.level <= currentLevel + 5 && l.level >= Math.max(1, currentLevel - 2));

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <motion.div initial="hidden" animate="show" variants={fadeUp} className="text-center">
        <h1 className="text-3xl font-black text-foreground tracking-tight">Rewards & Progression</h1>
        <p className="text-muted-foreground mt-1">50 levels to conquer — earn XP with every correct answer</p>
      </motion.div>

      {/* Double XP Banner */}
      {isDoubleXP && (
        <motion.div initial="hidden" animate="show" variants={fadeUp}
          className="p-4 rounded-2xl bg-warning/10 border border-warning/30 flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-warning/20 flex items-center justify-center">
            <Zap className="w-6 h-6 text-warning" />
          </div>
          <div>
            <p className="font-black text-foreground">Double XP Event Active!</p>
            <p className="text-sm text-muted-foreground">All XP earned is multiplied by {multiplier}x</p>
          </div>
        </motion.div>
      )}

      {/* XP & Level Card */}
      <motion.div initial="hidden" animate="show" variants={fadeUp}
        className="bg-card border border-border rounded-3xl p-6 space-y-5"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-glow-soft">
              <span className="text-2xl font-black text-primary-foreground">{currentLevel}</span>
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
            <span>Level {Math.min(currentLevel + 1, 50)}</span>
          </div>
        </div>
      </motion.div>

      {/* XP Earning Rules */}
      <motion.div initial="hidden" animate="show" variants={fadeUp}
        className="bg-card border border-border rounded-3xl p-5 space-y-3"
      >
        <h3 className="text-lg font-black text-foreground flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" /> How to Earn XP
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: "Correct Answer", xp: `+${XP_PER_CORRECT}`, desc: "Per question" },
            { label: "Lesson Complete", xp: `+${XP_LESSON_COMPLETE}`, desc: "Finish any lesson" },
            { label: "Perfect Lesson", xp: `+${XP_PERFECT_BONUS}`, desc: "Zero mistakes" },
          ].map(item => (
            <div key={item.label} className="p-3 rounded-2xl bg-muted/30 border border-border/50 text-center">
              <div className="w-8 h-8 rounded-lg bg-primary/10 mx-auto" />
              <p className="text-lg font-black text-primary mt-1">{item.xp} XP</p>
              <p className="text-xs font-bold text-foreground">{item.label}</p>
              <p className="text-[10px] text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Stats row */}
      <motion.div initial="hidden" animate="show" variants={fadeUp} className="grid grid-cols-3 gap-3">
        {[
          { icon: Flame, label: "Streak", value: `${streakData?.current_streak || 0}d`, color: "text-warning" },
          { icon: Trophy, label: "Lessons", value: lessonsCompleted || 0, color: "text-primary" },
          { icon: Zap, label: "Total XP", value: currentXP.toLocaleString(), color: "text-accent-foreground" },
        ].map((stat) => (
          <div key={stat.label} className="bg-card border border-border rounded-2xl p-4 text-center">
            <stat.icon className={cn("w-6 h-6 mx-auto mb-1", stat.color)} />
            <p className="text-lg font-black text-foreground">{stat.value}</p>
            <p className="text-[11px] text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Unlocked Avatars */}
      <motion.div initial="hidden" animate="show" variants={fadeUp} className="space-y-3">
        <h3 className="text-lg font-black text-foreground flex items-center gap-2">
          <Gift className="w-5 h-5 text-primary" /> Unlocked Items ({unlockedAvatars.length})
        </h3>
        <div className="flex flex-wrap gap-2">
          {unlockedAvatars.map(item => (
            <div
              key={item.level}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/10 border border-primary/20"
            >
              <span className="text-xl">{item.emoji}</span>
              <div>
                <p className="text-xs font-bold text-foreground">{item.name}</p>
                <p className="text-[10px] text-muted-foreground">Lv.{item.level}</p>
              </div>
            </div>
          ))}
          {unlockedAvatars.length === 0 && (
            <p className="text-sm text-muted-foreground">Reach Level 2 to unlock your first item!</p>
          )}
        </div>
        {nextAvatar && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/30 border border-border/50">
            <span className="text-xl opacity-40">{nextAvatar.emoji}</span>
            <div>
              <p className="text-xs font-bold text-muted-foreground">Next: {nextAvatar.name}</p>
              <p className="text-[10px] text-muted-foreground">Unlock at Level {nextAvatar.level}</p>
            </div>
            <Lock className="w-4 h-4 text-muted-foreground ml-auto" />
          </div>
        )}
      </motion.div>

      {/* Level Progression */}
      <motion.div initial="hidden" animate="show" variants={fadeUp} className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-foreground">Level Progression</h3>
          <button
            onClick={() => setShowAllLevels(!showAllLevels)}
            className="text-xs font-bold text-primary hover:underline"
          >
            {showAllLevels ? "Show nearby" : "Show all 50"}
          </button>
        </div>
        <div className="space-y-2">
          {visibleLevels?.map((threshold) => {
            const isUnlocked = currentLevel >= threshold.level;
            const isCurrent = currentLevel === threshold.level;
            const avatarUnlock = AVATAR_UNLOCKS[threshold.level];
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
                <div className="flex-1 min-w-0">
                  <p className="font-black text-foreground text-sm">{threshold.title}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-muted-foreground">{threshold.xp_required.toLocaleString()} XP</p>
                    {avatarUnlock && (
                      <span className="text-xs text-primary font-medium">
                        {avatarUnlock.emoji} {avatarUnlock.name}
                      </span>
                    )}
                  </div>
                </div>
                {isUnlocked ? (
                  <Star className="w-5 h-5 text-warning fill-warning flex-shrink-0" />
                ) : (
                  <Lock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                )}
              </div>
            );
          })}
        </div>
        {!showAllLevels && (levelThresholds?.length || 0) > (visibleLevels?.length || 0) && (
          <p className="text-xs text-center text-muted-foreground">
            +{(levelThresholds?.length || 0) - (visibleLevels?.length || 0)} more levels
          </p>
        )}
      </motion.div>
    </div>
  );
};

export default Rewards;

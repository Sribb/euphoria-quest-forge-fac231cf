import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useOnboarding } from "@/hooks/useOnboarding";
import { CoursesGrid } from "@/features/home/components/CoursesGrid";
import { ThreePhaseLessonViewer } from "@/features/learning/components/ThreePhaseLessonViewer";
import { LegendaryChallenge } from "@/features/learning/components/LegendaryChallenge";
import { DailyRewardsModal } from "@/features/learning/components/DailyRewardsModal";
import { EuphoriaSpinner } from "@/shared/components/EuphoriaSpinner";
import {
  BookOpen, Dumbbell, Check, Play, Lock, Trophy,
  Flame, Star, Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const PATHWAY_META: Record<string, { title: string; description: string }> = {
  investing: {
    title: "Investing Fundamentals",
    description: "Start your investing journey with the basics of stocks, bonds, and portfolio building.",
  },
  "corporate-finance": {
    title: "Corporate Finance",
    description: "Learn to read financial statements, evaluate companies, and understand corporate strategy.",
  },
  "personal-finance": {
    title: "Personal Finance",
    description: "Build wealth with retirement planning, tax strategies, and passive income streams.",
  },
  trading: {
    title: "Trading & Technical Analysis",
    description: "Decode charts, master indicators, and develop systematic trading strategies.",
  },
  "alternative-assets": {
    title: "Alternative Assets",
    description: "Explore crypto, REITs, international markets, ESG investing, and beyond.",
  },
  economics: {
    title: "Economics",
    description: "Micro & macroeconomics — supply, demand, GDP, fiscal & monetary policy, and trade.",
  },
  business: {
    title: "Business & Entrepreneurship",
    description: "From idea to pitch — opportunity identification, business planning, and virtual business capstone.",
  },
  marketing: {
    title: "Marketing Fundamentals",
    description: "Consumer behavior, branding, digital marketing, and campaign creation project.",
  },
};

// Level 1 lesson descriptions for display
const LEVEL1_DESCRIPTIONS: Record<string, string> = {
  "Introduction to Investing": "What investing is and why it matters for your future",
  "Risk vs. Reward": "Understanding the relationship between potential gains and losses",
  "The Magic of Compound Interest": "How your money grows exponentially over time",
  "Stocks vs. Bonds": "The two foundational asset classes every investor should know",
  "Diversification": "Why spreading your investments reduces risk",
};

interface DashboardProps {
  onNavigate: (tab: string) => void;
  onStockSearch?: () => void;
}

const Dashboard = ({ onNavigate }: DashboardProps) => {
  const { user } = useAuth();
  const { placementLesson } = useOnboarding();
  const [activePathway, setActivePathway] = useState<string>("investing");
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [legendaryLessonId, setLegendaryLessonId] = useState<string | null>(null);
  const [showDailyRewards, setShowDailyRewards] = useState(false);

  const { data: streakData } = useQuery({
    queryKey: ["streak", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data } = await supabase.from("streaks").select("*").eq("user_id", user.id).maybeSingle();
      return data;
    },
    enabled: !!user?.id,
  });

  const { data: profileData } = useQuery({
    queryKey: ["profile-stats", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data } = await supabase.from("profiles").select("experience_points, level, coins").eq("id", user.id).maybeSingle();
      return data;
    },
    enabled: !!user?.id,
  });

  useEffect(() => {
    if (!streakData || !user?.id) return;
    const today = new Date().toDateString();
    const storageKey = `daily_rewards_shown_${user.id}_${today}`;
    const lastLogin = streakData.last_login_date;
    if (!lastLogin || new Date(lastLogin).toDateString() !== today) {
      if (!localStorage.getItem(storageKey)) {
        setShowDailyRewards(true);
        localStorage.setItem(storageKey, "true");
      }
    }
  }, [streakData, user?.id]);

  const { data: lessons = [], isLoading, refetch } = useQuery({
    queryKey: ["lessons", user?.id, placementLesson],
    queryFn: async () => {
      const { data: lessonsData, error } = await supabase
        .from("lessons").select("*").order("order_index");
      if (error) throw error;

      if (!user?.id) {
        return lessonsData.map((lesson, index) => ({
          ...lesson, progress: 0, completed: false,
          duration: `${lesson.duration_minutes} min`, is_locked: index !== 0,
          legendary_completed: false,
        }));
      }

      const { data: progressData } = await supabase
        .from("user_lesson_progress").select("*").eq("user_id", user.id);

      const lessonsByPathway: Record<string, typeof lessonsData> = {};
      lessonsData.forEach((l) => {
        const pw = l.pathway || "default";
        if (!lessonsByPathway[pw]) lessonsByPathway[pw] = [];
        lessonsByPathway[pw].push(l);
      });
      Object.values(lessonsByPathway).forEach((group) =>
        group.sort((a, b) => a.order_index - b.order_index)
      );

      return lessonsData.map((lesson) => {
        const progress = progressData?.find((p) => p.lesson_id === lesson.id);
        const isActuallyCompleted = progress?.completed || false;
        const isInvestingPathway = lesson.pathway === "investing";
        const isSkippedByPlacement = isInvestingPathway && lesson.order_index < placementLesson && !isActuallyCompleted;
        const isCompleted = isActuallyCompleted || isSkippedByPlacement;

        const pw = lesson.pathway || "default";
        const pathwayGroup = lessonsByPathway[pw] || [];
        const indexInPathway = pathwayGroup.findIndex((l) => l.id === lesson.id);
        const previousInPathway = indexInPathway > 0 ? pathwayGroup[indexInPathway - 1] : null;
        const previousProgress = previousInPathway
          ? progressData?.find((p) => p.lesson_id === previousInPathway.id)
          : null;

        const isUnlockedByPlacement = isInvestingPathway && lesson.order_index <= placementLesson;
        const isUnlockedByProgress = previousProgress?.completed || false;
        const isFirstInPathway = indexInPathway === 0;
        const isUnlocked = isFirstInPathway || isUnlockedByPlacement || isUnlockedByProgress || isCompleted;

        return {
          ...lesson, progress: progress?.progress || 0, completed: isCompleted,
          skippedByPlacement: isSkippedByPlacement,
          duration: `${lesson.duration_minutes} min`, is_locked: !isUnlocked,
          legendary_completed: (progress as any)?.legendary_completed || false,
        };
      });
    },
    retry: 2, staleTime: 30000,
  });

  // Legendary challenge view
  if (legendaryLessonId) {
    const lesson = lessons.find((l) => l.id === legendaryLessonId);
    return (
      <div className="fixed inset-0 bg-background/95 z-50 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6">
          <LegendaryChallenge
            lessonId={legendaryLessonId}
            lessonTitle={lesson?.title || "Lesson"}
            onComplete={(passed) => { if (passed) refetch(); }}
            onClose={() => { setLegendaryLessonId(null); refetch(); }}
          />
        </div>
      </div>
    );
  }

  if (activeLessonId) {
    return (
      <ThreePhaseLessonViewer
        lessonId={activeLessonId}
        onClose={() => { setActiveLessonId(null); refetch(); }}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <EuphoriaSpinner size="lg" />
      </div>
    );
  }

  const pathwayLessons = lessons.filter((l) => l.pathway === activePathway);
  const completedCount = pathwayLessons.filter((l) => l.completed).length;
  const meta = PATHWAY_META[activePathway] || { title: activePathway, description: "" };

  // Split lessons into levels of 5
  const level1 = pathwayLessons.slice(0, 5);
  const level1Complete = level1.every((l) => l.completed);

  // Find the first non-completed, non-locked lesson
  const currentLesson = pathwayLessons.find((l) => !l.completed && !l.is_locked);

  const streak = streakData?.current_streak ?? 0;
  const xp = profileData?.experience_points ?? 0;
  const level = profileData?.level ?? 1;

  return (
    <div className="w-full">
      <div className="flex gap-0">
        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Course Header */}
          <div
            className="w-full flex items-center overflow-hidden"
            style={{
              height: 160,
              borderRadius: 16,
              background: "linear-gradient(135deg, rgba(124,58,237,0.15) 0%, rgba(124,58,237,0.05) 100%)",
            }}
          >
            {/* Course icon */}
            <div
              className="shrink-0 flex items-center justify-center bg-primary/20"
              style={{ width: 120, height: 120, marginLeft: 20, borderRadius: 16 }}
            >
              <BookOpen className="text-primary" style={{ width: 48, height: 48 }} />
            </div>

            {/* Course info */}
            <div className="flex flex-col justify-center" style={{ marginLeft: 24, flex: 1 }}>
              <h1 className="text-2xl font-bold text-foreground">{meta.title}</h1>
              <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.6)", maxWidth: 420 }}>
                {meta.description}
              </p>
              <div className="flex items-center gap-3 mt-3">
                <div
                  className="overflow-hidden"
                  style={{ width: 200, height: 6, borderRadius: 3, backgroundColor: "rgba(255,255,255,0.1)" }}
                >
                  <div
                    className="h-full bg-primary"
                    style={{
                      width: `${pathwayLessons.length > 0 ? (completedCount / pathwayLessons.length) * 100 : 0}%`,
                      borderRadius: 3,
                    }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">
                  {completedCount} of {pathwayLessons.length} complete
                </span>
              </div>
            </div>

            {/* Stat badges */}
            <div className="flex items-center shrink-0" style={{ gap: 12, marginRight: 24 }}>
              <div
                className="flex items-center gap-2 text-xs text-foreground/70 font-medium"
                style={{
                  backgroundColor: "rgba(255,255,255,0.08)",
                  padding: "8px 14px",
                  borderRadius: 20,
                }}
              >
                <BookOpen className="w-4 h-4 text-muted-foreground" />
                {pathwayLessons.length} Lessons
              </div>
              <div
                className="flex items-center gap-2 text-xs text-foreground/70 font-medium"
                style={{
                  backgroundColor: "rgba(255,255,255,0.08)",
                  padding: "8px 14px",
                  borderRadius: 20,
                }}
              >
                <Dumbbell className="w-4 h-4 text-muted-foreground" />
                {pathwayLessons.length * 15} Exercises
              </div>
            </div>
          </div>

          {/* Level 1 section */}
          <div style={{ marginTop: 32 }}>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground">Level 1: Introduction</h2>
              <span
                className="text-xs text-muted-foreground font-medium"
                style={{
                  backgroundColor: "rgba(255,255,255,0.06)",
                  padding: "4px 12px",
                  borderRadius: 20,
                }}
              >
                {level1.length} lessons
              </span>
            </div>

            {/* Lesson grid */}
            <div
              className="grid gap-5"
              style={{ marginTop: 20, gridTemplateColumns: "repeat(3, 1fr)" }}
            >
              {level1.map((lesson, i) => {
                const isCompleted = lesson.completed;
                const isLocked = lesson.is_locked;
                const isCurrent = currentLesson?.id === lesson.id;
                const desc = LEVEL1_DESCRIPTIONS[lesson.title] || lesson.description;

                return (
                  <motion.div
                    key={lesson.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => {
                      if (!isLocked) setActiveLessonId(lesson.id);
                    }}
                    className={cn(
                      "flex flex-col cursor-pointer transition-all duration-200",
                      isLocked && "opacity-50 cursor-not-allowed",
                      !isLocked && "hover:-translate-y-0.5"
                    )}
                    style={{
                      backgroundColor: "hsl(240, 15%, 10%)",
                      borderRadius: 16,
                      padding: 20,
                      border: isCurrent
                        ? "1px solid hsl(var(--primary))"
                        : "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    {/* Icon */}
                    <div
                      className="flex items-center justify-center shrink-0"
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: isCompleted
                          ? "hsl(142, 71%, 45%)"
                          : isCurrent
                            ? "hsl(var(--primary))"
                            : "rgba(255,255,255,0.06)",
                      }}
                    >
                      {isCompleted ? (
                        <Check className="w-5 h-5 text-white" />
                      ) : isCurrent ? (
                        <Play className="w-5 h-5 text-white ml-0.5" />
                      ) : (
                        <Lock className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>

                    {/* Title */}
                    <h3
                      className="text-foreground font-semibold mt-3"
                      style={{ fontSize: 16, lineHeight: 1.3 }}
                    >
                      {lesson.title}
                    </h3>

                    {/* Description */}
                    <p
                      className="text-muted-foreground mt-1 line-clamp-1"
                      style={{ fontSize: 13 }}
                    >
                      {desc}
                    </p>

                    {/* Status */}
                    <div className="mt-auto pt-4">
                      {isCompleted ? (
                        <div className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5" style={{ color: "hsl(142, 71%, 45%)" }} />
                          <span className="text-xs font-medium" style={{ color: "hsl(142, 71%, 45%)" }}>
                            Completed
                          </span>
                        </div>
                      ) : isCurrent ? (
                        <button
                          className="text-xs font-semibold text-primary-foreground bg-primary px-4 py-1.5 transition-colors hover:bg-primary/90"
                          style={{ borderRadius: 8 }}
                        >
                          Continue
                        </button>
                      ) : (
                        <span className="text-xs text-muted-foreground">Locked</span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Milestone card */}
            <div
              className="mt-5"
              style={{
                borderRadius: 16,
                padding: 20,
                background: level1Complete
                  ? "linear-gradient(135deg, rgba(234,179,8,0.15) 0%, transparent 100%)"
                  : "linear-gradient(135deg, rgba(234,179,8,0.05) 0%, transparent 100%)",
                border: level1Complete
                  ? "1px solid rgba(234,179,8,0.3)"
                  : "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div className="flex items-center gap-4">
                <div
                  className="flex items-center justify-center shrink-0"
                  style={{ width: 40, height: 40 }}
                >
                  <Trophy
                    className={cn("w-8 h-8", level1Complete ? "text-yellow-500" : "text-muted-foreground/40")}
                  />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground">
                    Level 1 Complete: Earn the Investing Rookie badge
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Complete all 5 lessons to unlock Level 2.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right sidebar panel (>1440px) */}
        <div
          className="hidden 2xl:flex flex-col shrink-0"
          style={{
            width: 280,
            marginLeft: 32,
            padding: 24,
            backgroundColor: "hsl(240, 15%, 8%)",
            borderRadius: 16,
            gap: 24,
            alignSelf: "flex-start",
          }}
        >
          {/* Daily Challenge */}
          <div>
            <h3 className="text-sm font-bold text-foreground mb-3">Daily Challenge</h3>
            <div
              className="p-4"
              style={{
                borderRadius: 12,
                backgroundColor: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <p className="text-xs text-foreground/80 leading-relaxed">
                Complete 1 lesson and earn 50 XP today
              </p>
              <div className="mt-3 flex items-center gap-2">
                <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.1)" }}>
                  <div className="h-full bg-primary rounded-full" style={{ width: "33%" }} />
                </div>
                <span className="text-[10px] text-muted-foreground font-medium">1/3</span>
              </div>
            </div>
          </div>

          {/* Your Stats */}
          <div>
            <h3 className="text-sm font-bold text-foreground mb-3">Your Stats</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span className="text-xs text-foreground/70">Streak</span>
                </div>
                <span className="text-xs font-bold text-foreground">{streak} days</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-xs text-foreground/70">Total XP</span>
                </div>
                <span className="text-xs font-bold text-foreground">{xp.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-xs text-foreground/70">Level</span>
                </div>
                <span className="text-xs font-bold text-foreground">{level}</span>
              </div>
            </div>
          </div>

          {/* AI Insight */}
          <div>
            <h3 className="text-sm font-bold text-foreground mb-3">AI Insight</h3>
            <div
              className="p-4"
              style={{
                borderRadius: 12,
                backgroundColor: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <p className="text-xs text-foreground/70 leading-relaxed">
                You're making great progress in Investing Fundamentals. Focus on compound interest concepts to strengthen your foundation.
              </p>
              <button className="text-xs text-primary font-medium mt-2 hover:underline cursor-pointer">
                View Full Report →
              </button>
            </div>
          </div>
        </div>
      </div>

      <DailyRewardsModal
        isOpen={showDailyRewards}
        onClose={() => setShowDailyRewards(false)}
      />
    </div>
  );
};

export default Dashboard;

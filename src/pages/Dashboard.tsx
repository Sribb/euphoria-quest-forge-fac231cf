import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useOnboarding } from "@/hooks/useOnboarding";
import { CourseTopNav } from "@/features/home/components/CourseTopNav";
import { CourseInfoCard } from "@/features/home/components/CourseInfoCard";
import { PathwayTrail } from "@/features/home/components/PathwayTrail";
import { CoursesGrid } from "@/features/home/components/CoursesGrid";
import { ThreePhaseLessonViewer } from "@/features/learning/components/ThreePhaseLessonViewer";
import { LegendaryChallenge } from "@/features/learning/components/LegendaryChallenge";
import { DailyRewardsModal } from "@/features/learning/components/DailyRewardsModal";
import { EuphoriaSpinner } from "@/shared/components/EuphoriaSpinner";

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

interface DashboardProps {
  onNavigate: (tab: string) => void;
  onStockSearch?: () => void;
}

const Dashboard = ({ onNavigate }: DashboardProps) => {
  const { user } = useAuth();
  const { placementLesson } = useOnboarding();
  const [activeView, setActiveView] = useState<"home" | "courses">("home");
  const [activePathway, setActivePathway] = useState<string>("investing");
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [legendaryLessonId, setLegendaryLessonId] = useState<string | null>(null);
  const [showDailyRewards, setShowDailyRewards] = useState(false);

  // Streak check for daily rewards
  const { data: streakData } = useQuery({
    queryKey: ["streak", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data } = await supabase.from("streaks").select("*").eq("user_id", user.id).single();
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

  // Fetch all lessons
  const { data: lessons = [], isLoading, refetch } = useQuery({
    queryKey: ["lessons", user?.id, placementLesson],
    queryFn: async () => {
      const { data: lessonsData, error } = await supabase
        .from("lessons")
        .select("*")
        .order("order_index");
      if (error) throw error;

      if (!user?.id) {
        return lessonsData.map((lesson, index) => ({
          ...lesson,
          progress: 0,
          completed: false,
          duration: `${lesson.duration_minutes} min`,
          is_locked: index !== 0,
          legendary_completed: false,
        }));
      }

      const { data: progressData } = await supabase
        .from("user_lesson_progress")
        .select("*")
        .eq("user_id", user.id);

      const lessonsByPathway: Record<string, typeof lessonsData> = {};
      lessonsData.forEach((l) => {
        const pw = (l as any).pathway || "default";
        if (!lessonsByPathway[pw]) lessonsByPathway[pw] = [];
        lessonsByPathway[pw].push(l);
      });
      Object.values(lessonsByPathway).forEach((group) =>
        group.sort((a, b) => a.order_index - b.order_index)
      );

      return lessonsData.map((lesson) => {
        const progress = progressData?.find((p) => p.lesson_id === lesson.id);
        const isActuallyCompleted = progress?.completed || false;
        
        // Placement skip only applies to the 'investing' pathway
        const isInvestingPathway = (lesson as any).pathway === 'investing';
        const isSkippedByPlacement = isInvestingPathway && lesson.order_index < placementLesson && !isActuallyCompleted;
        const isCompleted = isActuallyCompleted || isSkippedByPlacement;

        const pw = (lesson as any).pathway || "default";
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
          ...lesson,
          progress: progress?.progress || 0,
          completed: isCompleted,
          skippedByPlacement: isSkippedByPlacement,
          duration: `${lesson.duration_minutes} min`,
          is_locked: !isUnlocked,
          legendary_completed: (progress as any)?.legendary_completed || false,
        };
      });
    },
    retry: 2,
    staleTime: 30000,
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

  // Active lesson view
  if (activeLessonId) {
    return (
      <ThreePhaseLessonViewer
        lessonId={activeLessonId}
        onClose={() => { setActiveLessonId(null); refetch(); }}
      />
    );
  }

  const pathwayLessons = lessons.filter((l) => (l as any).pathway === activePathway);
  const completedCount = pathwayLessons.filter((l) => l.completed).length;
  const meta = PATHWAY_META[activePathway] || { title: activePathway, description: "" };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <EuphoriaSpinner size="lg" />
      </div>
    );
  }

  const handleSelectCourse = (pathwayId: string) => {
    setActivePathway(pathwayId);
    setActiveView("home");
  };

  return (
    <div className="min-h-screen w-full">
      {/* Top Nav */}
      <CourseTopNav
        activeView={activeView}
        onViewChange={setActiveView}
      />

      {activeView === "courses" ? (
        <CoursesGrid
          lessons={lessons}
          activePathway={activePathway}
          onSelectCourse={handleSelectCourse}
        />
      ) : (
        /* Home: course info + pathway trail */
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex gap-8">
            {/* Left: Course info (desktop only) */}
            <div className="hidden lg:block w-[280px] shrink-0">
              <CourseInfoCard
                title={meta.title}
                description={meta.description}
                totalLessons={pathwayLessons.length}
                completedLessons={completedCount}
              />
            </div>

            {/* Right: The pathway trail */}
            <div className="flex-1 min-w-0">
              {/* Mobile course info */}
              <div className="lg:hidden mb-6 p-4 rounded-2xl border border-border/60 bg-card/80">
                <h2 className="text-base font-bold text-foreground">{meta.title}</h2>
                <p className="text-xs text-muted-foreground mt-1">{meta.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${pathwayLessons.length > 0 ? (completedCount / pathwayLessons.length) * 100 : 0}%` }} />
                  </div>
                  <span className="text-[10px] font-bold text-muted-foreground">{completedCount}/{pathwayLessons.length}</span>
                </div>
              </div>

              <PathwayTrail
                lessons={pathwayLessons}
                onLessonSelect={setActiveLessonId}
                onLegendarySelect={setLegendaryLessonId}
                pathwayTitle={meta.title}
              />
            </div>
          </div>
        </div>
      )}

      <DailyRewardsModal
        isOpen={showDailyRewards}
        onClose={() => setShowDailyRewards(false)}
      />
    </div>
  );
};

export default Dashboard;

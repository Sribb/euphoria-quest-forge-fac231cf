import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useOnboarding } from "@/hooks/useOnboarding";
import { CourseTopNav, type LearnView } from "@/features/home/components/CourseTopNav";
import { CourseInfoCard } from "@/features/home/components/CourseInfoCard";
import { PathwayTrail } from "@/features/home/components/PathwayTrail";
import { CoursesGrid } from "@/features/home/components/CoursesGrid";
import { PathwayLessonViewer } from "@/features/pathway/components/PathwayLessonViewer";
import { TradeDashboard } from "@/features/trading/components/TradeDashboard";
import { useDailyRewardNotification } from "@/features/learning/hooks/useDailyRewardNotification";
import { EuphoriaSpinner } from "@/shared/components/EuphoriaSpinner";

// Map dashboard pathway slugs to file-based courseIds
const PATHWAY_TO_COURSE: Record<string, string> = {
  investing: 'investing-fundamentals',
  'personal-finance': 'personal-finance',
  economics: 'global-economics',
  'corporate-finance': 'corporate-finance',
};

const PATHWAY_TABS = [
  { id: "investing", label: "Investing Fundamentals" },
  { id: "corporate-finance", label: "Corporate Finance" },
  { id: "personal-finance", label: "Personal Finance" },
  { id: "trading", label: "Trading & Technical Analysis" },
  { id: "alternative-assets", label: "Alternative Assets" },
  { id: "economics", label: "Economics" },
  { id: "business", label: "Business & Entrepreneurship" },
  { id: "marketing", label: "Marketing Fundamentals" },
];

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

const STORAGE_KEY = "euphoria_active_pathway";

interface DashboardProps {
  onNavigate: (tab: string) => void;
  onStockSearch?: () => void;
}

const Dashboard = ({ onNavigate }: DashboardProps) => {
  const { user } = useAuth();
  const { placementLesson } = useOnboarding();
  const [activeView, setActiveView] = useState<LearnView>("home");
  const [activePathway, setActivePathway] = useState<string>(() => {
    try { return localStorage.getItem(STORAGE_KEY) || "investing"; }
    catch { return "investing"; }
  });
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [_legendaryLessonId, setLegendaryLessonId] = useState<string | null>(null);
  useDailyRewardNotification();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [headerVisible, setHeaderVisible] = useState(true);
  const lastScrollY = useRef(0);

  // Auto-hide header on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY < 80) {
        setHeaderVisible(true);
      } else if (currentY > lastScrollY.current + 8) {
        setHeaderVisible(false);
      } else if (currentY < lastScrollY.current - 8) {
        setHeaderVisible(true);
      }
      lastScrollY.current = currentY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Persist pathway selection
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, activePathway); } catch {}
  }, [activePathway]);

  // Scroll active tab into view
  useEffect(() => {
    if (scrollContainerRef.current) {
      const active = scrollContainerRef.current.querySelector('[data-active="true"]');
      if (active) {
        active.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [activePathway]);


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

  // Active lesson view
  if (activeLessonId) {
    const courseId = PATHWAY_TO_COURSE[activePathway];
    if (courseId) {
      const lesson = lessons.find((l) => l.id === activeLessonId);
      const lessonNumber = lesson ? lesson.order_index : 1;
      return (
        <PathwayLessonViewer
          courseId={courseId}
          lessonNumber={lessonNumber}
          onClose={() => { setActiveLessonId(null); refetch(); }}
          onNextLesson={() => {
            const nextLesson = lessons.find((l) => l.order_index === (lesson?.order_index ?? 0) + 1 && (l as any).pathway === activePathway);
            if (nextLesson) {
              setActiveLessonId(nextLesson.id);
            } else {
              setActiveLessonId(null);
              refetch();
            }
          }}
        />
      );
    }
    // Fallback: close if no course mapping exists
    setActiveLessonId(null);
    return null;
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
      {/* Combined sticky header: top nav + pathway tabs */}
      <div
        className={`sticky top-0 z-10 transition-transform duration-300 ${
          headerVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        {/* Top Nav */}
        <CourseTopNav
          activeView={activeView}
          onViewChange={setActiveView}
        />

        {/* Pathway Selector */}
        <div className="border-b border-border/20">
          <div
            ref={scrollContainerRef}
            className="flex gap-2 overflow-x-auto scrollbar-hide px-6 py-3 max-w-6xl mx-auto"
          >
            {PATHWAY_TABS.map((tab) => (
              <button
                key={tab.id}
                data-active={activePathway === tab.id}
                onClick={() => setActivePathway(tab.id)}
                className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  activePathway === tab.id
                    ? 'bg-primary text-primary-foreground shadow-md shadow-primary/25'
                    : 'text-muted-foreground/70 hover:text-foreground/90'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {activeView === "trade" ? (
        <div className="max-w-6xl mx-auto px-6 py-8">
          <TradeDashboard />
        </div>
      ) : activeView === "courses" ? (
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
                <h2 className="text-base font-semibold text-foreground">{meta.title}</h2>
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

    </div>
  );
};

export default Dashboard;

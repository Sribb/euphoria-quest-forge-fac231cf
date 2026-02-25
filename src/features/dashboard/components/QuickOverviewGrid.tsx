import { BookOpen, TrendingUp, TrendingDown, Flame } from "lucide-react";
import { usePortfolioValue } from "@/hooks/usePortfolioValue";
import { formatDollar } from "@/lib/formatters";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface QuickOverviewGridProps {
  onNavigate?: (tab: string) => void;
}

// Donut chart component
const DonutChart = ({ percentage, size = 80, strokeWidth = 8, color = "hsl(var(--primary))", glow = false }: { percentage: number; size?: number; strokeWidth?: number; color?: string; glow?: boolean }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - Math.min(percentage, 100) / 100);
  const id = `donut-glow-${size}`;

  return (
    <svg width={size} height={size} className="-rotate-90">
      {glow && (
        <defs>
          <linearGradient id={`${id}-grad`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="50%" stopColor="hsl(var(--accent))" />
            <stop offset="100%" stopColor="hsl(var(--primary))" />
          </linearGradient>
          <filter id={`${id}-filter`}>
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      )}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="hsl(var(--muted))"
        strokeWidth={strokeWidth}
        opacity={0.3}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={glow ? `url(#${id}-grad)` : color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="transition-all duration-700 ease-out"
        filter={glow ? `url(#${id}-filter)` : undefined}
      />
    </svg>
  );
};

export const QuickOverviewGrid = ({ onNavigate }: QuickOverviewGridProps) => {
  const { totalValue } = usePortfolioValue();
  const { user } = useAuth();

  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      return data;
    },
    enabled: !!user?.id,
  });

  const { data: streak } = useQuery({
    queryKey: ['streak', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data } = await supabase.from('streaks').select('*').eq('user_id', user.id).single();
      return data;
    },
    enabled: !!user?.id,
  });

  const { data: lessonStats } = useQuery({
    queryKey: ['lesson-stats', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data: progress } = await supabase.from('user_lesson_progress').select('completed').eq('user_id', user.id);
      const { data: totalLessons } = await supabase.from('lessons').select('id');
      return { completed: progress?.filter(p => p.completed).length || 0, total: totalLessons?.length || 0 };
    },
    enabled: !!user?.id,
  });

  const { data: nextLesson } = useQuery({
    queryKey: ['next-lesson', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data: progress } = await supabase.from('user_lesson_progress').select('lesson_id, completed').eq('user_id', user.id).eq('completed', true);
      const completedIds = progress?.map(p => p.lesson_id) || [];
      let query = supabase.from('lessons').select('*').order('order_index', { ascending: true }).limit(1);
      if (completedIds.length > 0) {
        query = query.not('id', 'in', `(${completedIds.join(',')})`);
      }
      const { data } = await query;
      return data?.[0] || null;
    },
    enabled: !!user?.id,
  });

  const userLevel = profile?.level || 1;
  const userXP = profile?.coins || 0;
  const nextLevelXP = userLevel * 1000;
  const xpProgress = Math.min((userXP / nextLevelXP) * 100, 100);
  const portfolioChange = ((totalValue - 10000) / 10000) * 100;
  const lessonProgress = lessonStats ? Math.min((lessonStats.completed / Math.max(lessonStats.total, 1)) * 100, 100) : 0;

  const cardBase = "p-5 rounded-3xl border border-border/30 bg-card hover:shadow-md transition-all duration-300 cursor-pointer";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Portfolio — large card */}
      <div
        className={cn(cardBase, "md:col-span-2 bg-gradient-to-br from-primary/5 to-accent/5")}
        onClick={() => onNavigate?.('trade')}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Portfolio Value</p>
            <p className="text-4xl font-bold text-foreground tracking-tight">{formatDollar(totalValue, 0)}</p>
            <div className={cn("flex items-center gap-1.5 mt-2 text-sm font-semibold", portfolioChange >= 0 ? 'text-success' : 'text-destructive')}>
              {portfolioChange >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {portfolioChange >= 0 ? '+' : ''}{portfolioChange.toFixed(2)}% all time
            </div>
          </div>
          {/* Mini donut for portfolio allocation */}
          <div className="relative">
            <DonutChart percentage={100} size={72} color="hsl(var(--primary))" />
            <div className="absolute inset-0 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
          </div>
        </div>
      </div>

      {/* Progress — donut chart */}
      <div className={cn(cardBase, "flex flex-col items-center justify-center text-center")} onClick={() => onNavigate?.('analytics')}>
        <div className="relative mb-3">
          <DonutChart percentage={xpProgress} size={88} strokeWidth={7} color="hsl(var(--primary))" glow />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold text-foreground">Lv.{userLevel}</span>
          </div>
        </div>
        <p className="text-xs font-medium text-muted-foreground">{userXP}/{nextLevelXP} XP</p>
        <div className="flex items-center gap-3 mt-3 w-full">
          <div className="flex-1 bg-muted/50 rounded-2xl py-2 px-3 text-center">
            <p className="text-lg font-bold text-foreground">{lessonStats?.completed || 0}</p>
            <p className="text-[10px] text-muted-foreground font-medium">Lessons</p>
          </div>
          <div className="flex-1 bg-muted/50 rounded-2xl py-2 px-3 text-center">
            <div className="flex items-center justify-center gap-1">
              <Flame className="w-3.5 h-3.5 text-warning" />
              <p className="text-lg font-bold text-foreground">{streak?.current_streak || 0}</p>
            </div>
            <p className="text-[10px] text-muted-foreground font-medium">Streak</p>
          </div>
        </div>
      </div>

      {/* Next Lesson */}
      <div className={cn(cardBase, "group bg-gradient-to-br from-success/5 to-primary/5")} onClick={() => onNavigate?.('learn')}>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-2xl bg-success/10 flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-success" />
          </div>
          <span className="text-sm font-semibold text-muted-foreground">Up Next</span>
        </div>
        {nextLesson ? (
          <div className="space-y-2">
            <h5 className="font-bold text-foreground text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">
              {nextLesson.title}
            </h5>
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{nextLesson.description}</p>
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-medium mt-2">
              <span className="bg-muted/50 px-2 py-0.5 rounded-full">{nextLesson.duration_minutes}m</span>
              <span className="bg-muted/50 px-2 py-0.5 rounded-full capitalize">{nextLesson.difficulty}</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-4">
            <p className="text-2xl mb-1">🎉</p>
            <p className="text-sm font-medium text-muted-foreground">All caught up!</p>
          </div>
        )}
      </div>
    </div>
  );
};

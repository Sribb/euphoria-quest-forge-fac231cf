import { Target, BookOpen, Lightbulb, TrendingUp, TrendingDown } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { usePortfolioValue } from "@/hooks/usePortfolioValue";
import { formatDollar } from "@/lib/formatters";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface QuickOverviewGridProps {
  onNavigate?: (tab: string) => void;
}

export const QuickOverviewGrid = ({ onNavigate }: QuickOverviewGridProps) => {
  const { totalValue } = usePortfolioValue();
  const { user } = useAuth();
  const [dailyTip, setDailyTip] = useState<string>("");

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

  useEffect(() => {
    const fetchDailyTip = async () => {
      const today = new Date().toDateString();
      const seed = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const { data: tips } = await supabase.from('ai_tips').select('tip_text');
      if (tips && tips.length > 0) {
        setDailyTip(tips[seed % tips.length].tip_text);
      }
    };
    fetchDailyTip();
  }, []);

  const userLevel = profile?.level || 1;
  const userXP = profile?.coins || 0;
  const nextLevelXP = userLevel * 1000;
  const xpProgress = (userXP / nextLevelXP) * 100;
  const portfolioChange = ((totalValue - 10000) / 10000) * 100;

  const cardBase = "p-5 rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm hover:border-primary/30 hover:shadow-md transition-all duration-300 cursor-pointer";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Portfolio */}
      <div
        className={cn(cardBase, "md:col-span-2")}
        onClick={() => onNavigate?.('trade')}
      >
        <div className="flex items-center gap-2 mb-3">
          {portfolioChange >= 0 ? <TrendingUp className="w-4 h-4 text-emerald-500" /> : <TrendingDown className="w-4 h-4 text-destructive" />}
          <span className="text-sm font-medium text-muted-foreground">Portfolio</span>
        </div>
        <p className="text-3xl font-bold text-foreground">{formatDollar(totalValue, 0)}</p>
        <p className={cn("text-sm mt-1 font-medium", portfolioChange >= 0 ? 'text-emerald-500' : 'text-destructive')}>
          {portfolioChange >= 0 ? '+' : ''}{portfolioChange.toFixed(2)}% all time
        </p>
      </div>

      {/* Progress */}
      <div className={cardBase} onClick={() => onNavigate?.('analytics')}>
        <div className="flex items-center gap-2 mb-3">
          <Target className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-muted-foreground">Progress</span>
        </div>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
              <span>Level {userLevel}</span>
              <span>{userXP}/{nextLevelXP} XP</span>
            </div>
            <Progress value={xpProgress} className="h-1.5" />
          </div>
          <div className="flex gap-3 text-center">
            <div className="flex-1 p-2 bg-muted/30 rounded-lg">
              <div className="text-xs text-muted-foreground">Lessons</div>
              <div className="text-base font-bold text-foreground">{lessonStats?.completed || 0}/{lessonStats?.total || 0}</div>
            </div>
            <div className="flex-1 p-2 bg-muted/30 rounded-lg">
              <div className="text-xs text-muted-foreground">Streak</div>
              <div className="text-base font-bold text-primary">{streak?.current_streak || 0}d</div>
            </div>
          </div>
        </div>
      </div>

      {/* Next Lesson */}
      <div className={cn(cardBase, "group")} onClick={() => onNavigate?.('learn')}>
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-muted-foreground">Next Lesson</span>
        </div>
        {nextLesson ? (
          <div className="space-y-2">
            <h5 className="font-semibold text-foreground text-sm line-clamp-2 group-hover:text-primary transition-colors">
              {nextLesson.title}
            </h5>
            <p className="text-xs text-muted-foreground line-clamp-2">{nextLesson.description}</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>⏱ {nextLesson.duration_minutes}m</span>
              <span>•</span>
              <span>{nextLesson.difficulty}</span>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">All caught up! 🎉</p>
        )}
      </div>
    </div>
  );
};

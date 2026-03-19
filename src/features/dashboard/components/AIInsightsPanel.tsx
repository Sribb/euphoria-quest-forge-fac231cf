import { Brain, Sparkles, TrendingUp, Award, Target, Zap } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface AIInsight {
  id: number;
  icon: React.ReactNode;
  title: string;
  description: string;
  navigateTo: string;
  gradient: string;
}

interface AIInsightsPanelProps {
  onNavigate: (tab: string) => void;
}

export const AIInsightsPanel = ({ onNavigate }: AIInsightsPanelProps) => {
  const { user } = useAuth();

  const { data: insights = [] } = useQuery({
    queryKey: ['ai-insights', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const generatedInsights: AIInsight[] = [];
      let insightId = 1;

      const { data: lessonProgress } = await supabase.from('user_lesson_progress').select('completed').eq('user_id', user.id);
      const { data: totalLessons } = await supabase.from('lessons').select('id');
      const completedCount = lessonProgress?.filter(p => p.completed).length || 0;
      const totalCount = totalLessons?.length || 0;
      const completionRate = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

      if (completionRate > 0) {
        generatedInsights.push({
          id: insightId++,
          icon: <Award className="w-5 h-5" />,
          title: "Learning",
          description: `${completedCount}/${totalCount} lessons (${completionRate.toFixed(0)}%)`,
          navigateTo: "learn",
          gradient: "from-primary/10 to-accent/10"
        });
      }

      const { data: portfolio } = await supabase.from('portfolios').select('total_value, cash_balance').eq('user_id', user.id).single();
      if (portfolio) {
        const portfolioReturn = ((portfolio.total_value - 10000) / 10000) * 100;
        generatedInsights.push({
          id: insightId++,
          icon: <TrendingUp className="w-5 h-5" />,
          title: "Portfolio",
          description: `${portfolioReturn >= 0 ? '+' : ''}${portfolioReturn.toFixed(2)}% return`,
          navigateTo: "trade",
          gradient: "from-success/10 to-primary/5"
        });
      }

      const { data: streak } = await supabase.from('streaks').select('current_streak, longest_streak').eq('user_id', user.id).single();
      if (streak && streak.current_streak > 0) {
        generatedInsights.push({
          id: insightId++,
          icon: <Zap className="w-5 h-5" />,
          title: "Streak",
          description: `${streak.current_streak} day${streak.current_streak > 1 ? 's' : ''} active`,
          navigateTo: "learn",
          gradient: "from-warning/10 to-warning/5"
        });
      }

      const { data: gameSessions } = await supabase.from('game_sessions').select('score, completed').eq('user_id', user.id).order('created_at', { ascending: false }).limit(10);
      if (gameSessions && gameSessions.length > 0) {
        const avgScore = gameSessions.reduce((sum, s) => sum + s.score, 0) / gameSessions.length;
        generatedInsights.push({
          id: insightId++,
          icon: <Sparkles className="w-5 h-5" />,
          title: "Games",
          description: `Avg score: ${avgScore.toFixed(0)}`,
          navigateTo: "games",
          gradient: "from-accent/10 to-primary/5"
        });
      }

      const { data: recentTrades } = await supabase.from('orders').select('status, side').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5);
      if (recentTrades && recentTrades.length > 0) {
        const filledTrades = recentTrades.filter(t => t.status === 'filled').length;
        generatedInsights.push({
          id: insightId++,
          icon: <Target className="w-5 h-5" />,
          title: "Trades",
          description: `${filledTrades}/${recentTrades.length} executed`,
          navigateTo: "trade",
          gradient: "from-primary/10 to-success/5"
        });
      }

      if (generatedInsights.length === 0) {
        generatedInsights.push({
          id: 1,
          icon: <Sparkles className="w-5 h-5" />,
          title: "Welcome",
          description: "Start exploring to see insights!",
          navigateTo: "learn",
          gradient: "from-primary/10 to-accent/10"
        });
      }

      return generatedInsights;
    },
    enabled: !!user?.id,
  });

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-2xl bg-primary/10 flex items-center justify-center">
          <Brain className="w-4 h-4 text-primary" />
        </div>
        <h3 className="font-semibold text-foreground">Insights</h3>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
        {insights.map((insight) => (
          <button
            key={insight.id}
            onClick={() => onNavigate(insight.navigateTo)}
            className={cn(
              "flex items-center gap-3 px-5 py-3.5 rounded-2xl border border-border/30",
              "bg-gradient-to-br", insight.gradient,
              "hover:shadow-sm hover:scale-[1.02]",
              "transition-all duration-200 whitespace-nowrap shrink-0"
            )}
          >
            <div className="text-primary">{insight.icon}</div>
            <div className="text-left">
              <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">{insight.title}</div>
              <div className="text-sm font-bold text-foreground">{insight.description}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

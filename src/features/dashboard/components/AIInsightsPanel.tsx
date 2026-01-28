import { Brain, Sparkles, TrendingUp, Award, Target, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface AIInsight {
  id: number;
  icon: React.ReactNode;
  title: string;
  description: string;
  type: "achievement" | "performance" | "suggestion" | "milestone";
  navigateTo: string;
}

interface AIInsightsPanelProps {
  onNavigate: (tab: string) => void;
}

export const AIInsightsPanel = ({ onNavigate }: AIInsightsPanelProps) => {
  const { user } = useAuth();

  // Fetch real user insights
  const { data: insights = [] } = useQuery({
    queryKey: ['ai-insights', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const generatedInsights: AIInsight[] = [];
      let insightId = 1;

      // Fetch lesson progress
      const { data: lessonProgress } = await supabase
        .from('user_lesson_progress')
        .select('completed')
        .eq('user_id', user.id);
      
      const { data: totalLessons } = await supabase
        .from('lessons')
        .select('id');
      
      const completedCount = lessonProgress?.filter(p => p.completed).length || 0;
      const totalCount = totalLessons?.length || 0;
      const completionRate = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
      
      if (completionRate > 0) {
        const remaining = totalCount - completedCount;
        generatedInsights.push({
          id: insightId++,
          icon: <Award className="w-6 h-6" />,
          title: "Learning Progress",
          description: `You've completed ${completedCount} of ${totalCount} lessons (${completionRate.toFixed(0)}%)${remaining > 0 ? `. ${remaining} lesson${remaining > 1 ? 's' : ''} remaining to master your path!` : '. Amazing work!'}`,
          type: "achievement",
          navigateTo: "learn"
        });
      }

      // Fetch portfolio data
      const { data: portfolio } = await supabase
        .from('portfolios')
        .select('total_value, cash_balance')
        .eq('user_id', user.id)
        .single();
      
      if (portfolio) {
        const portfolioReturn = ((portfolio.total_value - 10000) / 10000) * 100;
        const performance = portfolioReturn >= 0 ? 'up' : 'down';
        const message = portfolioReturn >= 0 
          ? `Your portfolio is ${performance} ${Math.abs(portfolioReturn).toFixed(2)}%! ${portfolioReturn > 5 ? 'Excellent risk management!' : 'Keep building your strategy.'}`
          : `Your portfolio is ${performance} ${Math.abs(portfolioReturn).toFixed(2)}%. This is a learning opportunity—review your trades in Analytics.`;
        
        generatedInsights.push({
          id: insightId++,
          icon: <TrendingUp className="w-6 h-6" />,
          title: "Portfolio Performance",
          description: message,
          type: "performance",
          navigateTo: "trade"
        });
      }

      // Fetch streak data
      const { data: streak } = await supabase
        .from('streaks')
        .select('current_streak, longest_streak')
        .eq('user_id', user.id)
        .single();
      
      if (streak && streak.current_streak > 0) {
        generatedInsights.push({
          id: insightId++,
          icon: <Zap className="w-6 h-6" />,
          title: "Streak Active",
          description: `${streak.current_streak} day${streak.current_streak > 1 ? 's' : ''} strong! ${streak.current_streak === streak.longest_streak ? "That's your personal record!" : `Your longest streak is ${streak.longest_streak} days.`} Consistency builds expertise.`,
          type: "milestone",
          navigateTo: "learn"
        });
      }

      // Fetch game sessions
      const { data: gameSessions } = await supabase
        .from('game_sessions')
        .select('score, completed')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (gameSessions && gameSessions.length > 0) {
        const avgScore = gameSessions.reduce((sum, s) => sum + s.score, 0) / gameSessions.length;
        const completedCount = gameSessions.filter(s => s.completed).length;
        
        generatedInsights.push({
          id: insightId++,
          icon: <Sparkles className="w-6 h-6" />,
          title: "Game Performance",
          description: `Average score: ${avgScore.toFixed(0)} across ${gameSessions.length} recent game${gameSessions.length > 1 ? 's' : ''}. ${completedCount} completed successfully. ${avgScore > 70 ? 'Outstanding skills!' : 'Keep practicing to improve!'}`,
          type: "suggestion",
          navigateTo: "games"
        });
      }

      // Fetch recent trades
      const { data: recentTrades } = await supabase
        .from('orders')
        .select('status, side')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (recentTrades && recentTrades.length > 0) {
        const filledTrades = recentTrades.filter(t => t.status === 'filled').length;
        generatedInsights.push({
          id: insightId++,
          icon: <Target className="w-6 h-6" />,
          title: "Trading Activity",
          description: `${recentTrades.length} recent trade${recentTrades.length > 1 ? 's' : ''}, ${filledTrades} executed successfully. ${filledTrades === recentTrades.length ? 'Perfect execution rate!' : 'Review pending orders in your portfolio.'}`,
          type: "performance",
          navigateTo: "trade"
        });
      }

      // Default insight if no data
      if (generatedInsights.length === 0) {
        generatedInsights.push({
          id: 1,
          icon: <Sparkles className="w-6 h-6" />,
          title: "Welcome to Euphoria",
          description: "Start your journey by exploring lessons, playing games, or making your first trade. Your personalized insights will appear here as you progress!",
          type: "suggestion",
          navigateTo: "learn"
        });
      }

      return generatedInsights;
    },
    enabled: !!user?.id,
  });

  return (
    <Card className="p-6 bg-gradient-surface border-border shadow-glow-soft">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Brain className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-foreground">AI Insights</h3>
          <p className="text-sm text-muted-foreground">Personalized to your activity</p>
        </div>
      </div>

      <div className="space-y-4">
        {insights.map((insight, index) => (
          <div
            key={insight.id}
            onClick={() => onNavigate(insight.navigateTo)}
            className="group p-5 bg-gradient-to-br from-card/80 to-card/40 rounded-xl border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-glow animate-fade-in cursor-pointer"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-lg text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 group-hover:scale-110">
                {insight.icon}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                  {insight.title}
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {insight.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-primary/5 rounded-xl border border-primary/20 backdrop-blur-sm">
        <p className="text-xs text-center text-muted-foreground">
          <span className="text-primary font-semibold">✨ AI-Powered:</span> These insights are generated based on your learning progress, trading patterns, and game performance
        </p>
      </div>
    </Card>
  );
};

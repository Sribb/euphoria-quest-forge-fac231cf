import { TrendingUp, Award, Target, Zap, Brain } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatDollar } from "@/lib/formatters";

export const QuickStats = () => {
  const { user } = useAuth();

  const { data: stats } = useQuery({
    queryKey: ['quickStats', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      // Fetch profile data
      const { data: profile } = await supabase
        .from('profiles')
        .select('level, coins')
        .eq('id', user.id)
        .single();

      // Fetch portfolio data
      const { data: portfolio } = await supabase
        .from('portfolios')
        .select('total_value')
        .eq('user_id', user.id)
        .single();

      // Fetch streak data
      const { data: streak } = await supabase
        .from('streaks')
        .select('current_streak, longest_streak')
        .eq('user_id', user.id)
        .single();

      // Fetch lesson progress
      const { data: lessonProgress } = await supabase
        .from('user_lesson_progress')
        .select('completed')
        .eq('user_id', user.id);

      // Fetch game sessions
      const { data: gameSessions } = await supabase
        .from('game_sessions')
        .select('score')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      const completedLessons = lessonProgress?.filter(p => p.completed).length || 0;
      const avgGameScore = gameSessions && gameSessions.length > 0
        ? gameSessions.reduce((sum, s) => sum + s.score, 0) / gameSessions.length
        : 0;

      return {
        level: profile?.level || 1,
        coins: profile?.coins || 0,
        portfolioValue: portfolio?.total_value || 0,
        currentStreak: streak?.current_streak || 0,
        longestStreak: streak?.longest_streak || 0,
        completedLessons,
        avgGameScore: Math.round(avgGameScore),
      };
    },
    enabled: !!user?.id,
  });

  if (!stats) return null;

  const quickTips = [
    "Diversification reduces risk—don't put all eggs in one basket.",
    "Time in the market beats timing the market.",
    "Dollar-cost averaging smooths out volatility.",
    "Review your portfolio regularly but don't overreact to daily swings.",
    "Your risk tolerance should match your investment timeline.",
  ];

  const randomTip = quickTips[Math.floor(Math.random() * quickTips.length)];

  return (
    <div className="space-y-4">
      <Card className="p-5 bg-gradient-surface border-border shadow-glow-soft">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <h4 className="font-bold text-foreground">Quick Stats</h4>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-card/50 rounded-lg">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">Level</span>
            </div>
            <Badge variant="secondary">{stats.level}</Badge>
          </div>

          <div className="flex items-center justify-between p-3 bg-card/50 rounded-lg">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-warning" />
              <span className="text-sm text-muted-foreground">Coins</span>
            </div>
            <Badge variant="secondary">{stats.coins}</Badge>
          </div>

          <div className="flex items-center justify-between p-3 bg-card/50 rounded-lg">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-success" />
              <span className="text-sm text-muted-foreground">Current Streak</span>
            </div>
            <Badge variant="secondary">{stats.currentStreak} days</Badge>
          </div>

          <div className="flex items-center justify-between p-3 bg-card/50 rounded-lg">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">Lessons Done</span>
            </div>
            <Badge variant="secondary">{stats.completedLessons}</Badge>
          </div>

          <div className="flex items-center justify-between p-3 bg-card/50 rounded-lg">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-success" />
              <span className="text-sm text-muted-foreground">Portfolio</span>
            </div>
            <span className="text-sm font-semibold">{formatDollar(stats.portfolioValue)}</span>
          </div>
        </div>
      </Card>

      <Card className="p-5 bg-gradient-to-br from-primary/5 to-success/5 border-primary/20">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Brain className="w-4 h-4 text-primary" />
          </div>
          <h4 className="font-semibold text-sm text-foreground">Investment Tip</h4>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">{randomTip}</p>
      </Card>
    </div>
  );
};

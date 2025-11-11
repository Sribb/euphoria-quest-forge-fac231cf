import { TrendingUp, Target, BookOpen, Lightbulb } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { usePortfolioValue } from "@/hooks/usePortfolioValue";
import { formatDollar } from "@/lib/formatters";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

export const QuickOverviewGrid = () => {
  const { totalValue } = usePortfolioValue();
  const { user } = useAuth();
  const [dailyTip, setDailyTip] = useState<string>("");
  
  // Fetch user profile data
  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      return data;
    },
    enabled: !!user?.id,
  });

  // Fetch streak data
  const { data: streak } = useQuery({
    queryKey: ['streak', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data } = await supabase
        .from('streaks')
        .select('*')
        .eq('user_id', user.id)
        .single();
      return data;
    },
    enabled: !!user?.id,
  });

  // Fetch lesson progress
  const { data: lessonStats } = useQuery({
    queryKey: ['lesson-stats', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data: progress } = await supabase
        .from('user_lesson_progress')
        .select('completed')
        .eq('user_id', user.id);
      
      const { data: totalLessons } = await supabase
        .from('lessons')
        .select('id');
      
      const completedCount = progress?.filter(p => p.completed).length || 0;
      const totalCount = totalLessons?.length || 0;
      
      return { completed: completedCount, total: totalCount };
    },
    enabled: !!user?.id,
  });

  // Fetch next lesson
  const { data: nextLesson } = useQuery({
    queryKey: ['next-lesson', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      // Get completed lesson IDs
      const { data: progress } = await supabase
        .from('user_lesson_progress')
        .select('lesson_id, completed')
        .eq('user_id', user.id)
        .eq('completed', true);
      
      const completedIds = progress?.map(p => p.lesson_id) || [];
      
      // Get next uncompleted lesson
      let query = supabase
        .from('lessons')
        .select('*')
        .order('order_index', { ascending: true })
        .limit(1);
      
      if (completedIds.length > 0) {
        query = query.not('id', 'in', `(${completedIds.join(',')})`);
      }
      
      const { data } = await query;
      return data?.[0] || null;
    },
    enabled: !!user?.id,
  });

  // Fetch and rotate daily tip
  useEffect(() => {
    const fetchDailyTip = async () => {
      // Use date as seed for consistent daily rotation
      const today = new Date().toDateString();
      const seed = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      
      const { data: tips } = await supabase
        .from('ai_tips')
        .select('tip_text');
      
      if (tips && tips.length > 0) {
        const index = seed % tips.length;
        setDailyTip(tips[index].tip_text);
      }
    };
    
    fetchDailyTip();
  }, []);

  // Calculate XP and portfolio change
  const userLevel = profile?.level || 1;
  const userXP = profile?.coins || 0;
  const nextLevelXP = userLevel * 1000;
  const xpProgress = (userXP / nextLevelXP) * 100;
  const portfolioChange = ((totalValue - 10000) / 10000) * 100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Market Overview */}
      <Card className="p-6 bg-gradient-surface border-border shadow-glow-soft hover:shadow-glow transition-all duration-300 hover-lift">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <h4 className="font-bold text-foreground">Market Overview</h4>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">S&P 500</span>
            <span className="text-sm font-semibold text-green-500">+0.8%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">NASDAQ</span>
            <span className="text-sm font-semibold text-green-500">+1.2%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Your Portfolio</span>
            <span className="text-sm font-semibold text-primary">+{portfolioChange}%</span>
          </div>
          <div className="pt-2 border-t border-border">
            <div className="text-xs text-muted-foreground mb-1">Portfolio Value</div>
            <div className="text-2xl font-bold text-foreground">{formatDollar(totalValue, 2)}</div>
          </div>
        </div>
      </Card>

      {/* User Progress */}
      <Card className="p-6 bg-gradient-surface border-border shadow-glow-soft hover:shadow-glow transition-all duration-300 hover-lift">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Target className="w-5 h-5 text-primary" />
          </div>
          <h4 className="font-bold text-foreground">Your Progress</h4>
        </div>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">Level {userLevel}</span>
              <span className="text-sm font-semibold text-primary">{userXP} / {nextLevelXP} XP</span>
            </div>
            <Progress value={xpProgress} className="h-2" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 bg-card/50 rounded-lg text-center">
              <div className="text-xs text-muted-foreground">Lessons</div>
              <div className="text-lg font-bold text-foreground">
                {lessonStats?.completed || 0}/{lessonStats?.total || 0}
              </div>
            </div>
            <div className="p-2 bg-card/50 rounded-lg text-center">
              <div className="text-xs text-muted-foreground">Streak</div>
              <div className="text-lg font-bold text-primary">
                {streak?.current_streak || 0} days
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Upcoming Lesson */}
      <Card className="p-6 bg-gradient-surface border-border shadow-glow-soft hover:shadow-glow transition-all duration-300 hover-lift cursor-pointer group">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary group-hover:text-primary-foreground transition-all">
            <BookOpen className="w-5 h-5 text-primary group-hover:text-primary-foreground" />
          </div>
          <h4 className="font-bold text-foreground group-hover:text-primary transition-colors">Next Lesson</h4>
        </div>
        <div className="space-y-3">
          {nextLesson ? (
            <>
              <h5 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                {nextLesson.title}
              </h5>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {nextLesson.description}
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>⏱️ {nextLesson.duration_minutes} min</span>
                <span>•</span>
                <span>📊 {nextLesson.difficulty}</span>
              </div>
            </>
          ) : (
            <>
              <h5 className="font-semibold text-foreground">All Caught Up! 🎉</h5>
              <p className="text-sm text-muted-foreground">
                You've completed all available lessons. Check back soon for new content!
              </p>
            </>
          )}
        </div>
      </Card>

      {/* AI Tip of the Day */}
      <Card className="p-6 bg-gradient-accent border-border shadow-glow-soft hover:shadow-glow transition-all duration-300 hover-lift">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Lightbulb className="w-5 h-5 text-primary animate-pulse" />
          </div>
          <h4 className="font-bold text-foreground">AI Tip of the Day</h4>
        </div>
        <div className="space-y-3">
          <p className="text-sm text-foreground font-medium leading-relaxed">
            "{dailyTip || 'Loading daily insight...'}"
          </p>
          <div className="pt-2 border-t border-border">
            <span className="text-xs text-muted-foreground">
              💡 Rotates daily with expert insights
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
};

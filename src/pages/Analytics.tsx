import { BarChart3, TrendingUp, Target, Award, BookOpen, Clock, Trophy, Zap, ArrowLeft, Brain, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import { alphaVantageService } from "@/lib/alphaVantageService";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { AIAnalyticsChat } from "@/components/analytics/AIAnalyticsChat";
import { AnalyticsFilters } from "@/components/analytics/AnalyticsFilters";
import { PerformanceHeatmap } from "@/components/analytics/PerformanceHeatmap";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AnalyticsProps {
  onNavigate: (tab: string) => void;
}

const Analytics = ({ onNavigate }: AnalyticsProps) => {
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState("all");

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const { data: portfolio } = useQuery({
    queryKey: ["portfolio", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("portfolios")
        .select("*")
        .eq("user_id", user?.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const { data: assets } = useQuery({
    queryKey: ["portfolio_assets", portfolio?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("portfolio_assets")
        .select("*")
        .eq("portfolio_id", portfolio?.id);
      
      if (error) throw error;
      return data;
    },
    enabled: !!portfolio?.id,
  });

  const { data: gameSessions, refetch: refetchGames } = useQuery({
    queryKey: ["game_sessions", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("game_sessions")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false })
        .limit(30);
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
    staleTime: 30000,
  });

  const { data: lessonProgress, refetch: refetchLessons } = useQuery({
    queryKey: ["lesson_progress_analytics", user?.id],
    queryFn: async () => {
      const { data: lessons, error: lessonsError } = await supabase
        .from("lessons")
        .select("*")
        .order("order_index");
      
      if (lessonsError) throw lessonsError;

      const { data: progress, error: progressError } = await supabase
        .from("user_lesson_progress")
        .select("*")
        .eq("user_id", user?.id);
      
      if (progressError) throw progressError;

      return lessons.map(lesson => {
        const lessonProgress = progress?.find(p => p.lesson_id === lesson.id);
        return {
          title: lesson.title,
          progress: lessonProgress?.progress || 0,
          completed: lessonProgress?.completed || false,
          duration: lesson.duration_minutes,
          completedAt: lessonProgress?.completed_at,
        };
      });
    },
    enabled: !!user?.id,
    staleTime: 30000,
  });

  const { data: transactions } = useQuery({
    queryKey: ["transactions_analytics", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false })
        .limit(50);
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
    staleTime: 30000,
  });

  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel('analytics-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_lesson_progress',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          refetchLessons();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'game_sessions',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          refetchGames();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, refetchLessons, refetchGames]);

  const { data: spy } = useQuery({
    queryKey: ["benchmark_spy"],
    queryFn: () => alphaVantageService.getGlobalQuote("SPY"),
    refetchInterval: 300000,
  });

  const portfolioReturn = portfolio
    ? ((Number(portfolio.total_value) - 10000) / 10000) * 100
    : 0;

  // Calculate metrics
  const totalLessons = lessonProgress?.length || 0;
  const completedLessons = lessonProgress?.filter(l => l.completed).length || 0;
  const overallProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  
  const timeSpent = lessonProgress?.reduce((sum, lesson) => {
    if (lesson.completed) {
      return sum + lesson.duration;
    }
    return sum + (lesson.duration * (lesson.progress / 100));
  }, 0) || 0;

  const totalGames = gameSessions?.length || 0;
  const totalCoinsEarned = gameSessions?.reduce((sum, session) => sum + (session.coins_earned || 0), 0) || 0;
  const avgGameScore = gameSessions?.reduce((sum, session) => sum + (session.score || 0), 0) / (totalGames || 1) || 0;

  // Heatmap data (last 7 days)
  const heatmapData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dayStr = date.toLocaleDateString('en-US', { weekday: 'short' });
    
    const dayLessons = lessonProgress?.filter(l => {
      if (!l.completedAt) return false;
      const completedDate = new Date(l.completedAt);
      return completedDate.toDateString() === date.toDateString();
    }).length || 0;

    const dayGames = gameSessions?.filter(g => {
      const gameDate = new Date(g.created_at);
      return gameDate.toDateString() === date.toDateString();
    }).length || 0;

    const dayTrades = transactions?.filter(t => {
      const tradeDate = new Date(t.created_at);
      return tradeDate.toDateString() === date.toDateString();
    }).length || 0;

    return { day: dayStr, lessons: dayLessons, games: dayGames, trades: dayTrades };
  });

  // Radar chart data for skills
  const skillsData = [
    { skill: 'Learning', value: overallProgress },
    { skill: 'Gaming', value: Math.min((avgGameScore / 100) * 100, 100) },
    { skill: 'Trading', value: Math.min(Math.max(portfolioReturn + 50, 0), 100) },
    { skill: 'Consistency', value: Math.min((completedLessons / (totalLessons || 1)) * 100, 100) },
    { skill: 'Engagement', value: Math.min(((totalGames + completedLessons) / 20) * 100, 100) },
  ];

  // Performance trend data
  const performanceData = gameSessions?.slice(0, 10).reverse().map((session, idx) => ({
    name: `S${idx + 1}`,
    score: session.score,
    coins: session.coins_earned,
  })) || [];

  const assetDistribution = assets?.map(asset => ({
    name: asset.asset_name,
    value: Number(asset.current_price) * Number(asset.quantity),
  })) || [];

  const completionData = [
    { name: "Completed", value: completedLessons, color: "hsl(var(--success))" },
    { name: "In Progress", value: lessonProgress?.filter(l => l.progress > 0 && !l.completed).length || 0, color: "hsl(var(--primary))" },
    { name: "Not Started", value: lessonProgress?.filter(l => l.progress === 0).length || 0, color: "hsl(var(--muted))" },
  ].filter(d => d.value > 0);

  return (
    <div className="space-y-6 pb-24 pt-4">
      <div className="flex items-center gap-3 animate-fade-in">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onNavigate('dashboard')}
          className="hover-scale"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="w-12 h-12 rounded-xl bg-gradient-accent flex items-center justify-center shadow-glow">
          <BarChart3 className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">AI-Powered Analytics</h1>
          <p className="text-muted-foreground">Intelligent insights and performance tracking</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-gradient-primary/10 border border-primary/20 rounded-full">
          <Brain className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">AI Enhanced</span>
        </div>
      </div>

      <AnalyticsFilters onFilterChange={setActiveFilter} activeFilter={activeFilter} />

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 h-auto">
          <TabsTrigger value="overview" className="text-xs sm:text-sm px-2 py-2">Overview</TabsTrigger>
          <TabsTrigger value="learning" className="text-xs sm:text-sm px-2 py-2">Learning</TabsTrigger>
          <TabsTrigger value="trading" className="text-xs sm:text-sm px-2 py-2">Trading</TabsTrigger>
          <TabsTrigger value="behavioral" className="text-xs sm:text-sm px-2 py-2">Behavioral</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <AIAnalyticsChat
            title="AI Analytics Assistant"
            description="Ask me anything about your performance"
            icon={<Sparkles className="w-5 h-5 text-white" />}
            presetQuestions={[
              "What's my overall progress?",
              "How am I performing?",
              "What should I focus on?",
            ]}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in">
            <Card className="p-4 bg-gradient-success border-0">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="w-5 h-5 text-white shrink-0" />
                <span className="text-sm text-white/80 truncate">Lessons Completed</span>
              </div>
              <p className="text-2xl font-bold text-white">
                {completedLessons}/{totalLessons}
              </p>
              <p className="text-sm text-white/80 mt-1">
                {overallProgress}% overall progress
              </p>
            </Card>

            <Card className="p-4 bg-gradient-primary border-0">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-white shrink-0" />
                <span className="text-sm text-white/80 truncate">Time Invested</span>
              </div>
              <p className="text-2xl font-bold text-white">{Math.round(timeSpent)} min</p>
              <p className="text-sm text-white/80 mt-1">Learning time</p>
            </Card>

            <Card className="p-4 bg-gradient-accent border-0">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-5 h-5 text-white shrink-0" />
                <span className="text-sm text-white/80 truncate">Total Coins</span>
              </div>
              <p className="text-2xl font-bold text-white">{profile?.coins || 0}</p>
              <p className="text-sm text-white/80 mt-1">Current balance</p>
            </Card>

            <Card className="p-4 bg-gradient-hero border-0">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5 text-white shrink-0" />
                <span className="text-sm text-white/80 truncate">Games Played</span>
              </div>
              <p className="text-2xl font-bold text-white">{totalGames}</p>
              <p className="text-sm text-white/80 mt-1">Avg score: {avgGameScore.toFixed(0)}</p>
            </Card>
          </div>

          <PerformanceHeatmap data={heatmapData} />

          <Card className="p-6 animate-fade-in overflow-hidden">
            <h3 className="text-lg font-bold mb-4">Skills Radar</h3>
            <div className="w-full overflow-x-auto">
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={skillsData}>
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis dataKey="skill" tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <Radar name="Performance" dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="learning" className="space-y-6">
          <AIAnalyticsChat
            title="Learning Analytics Assistant"
            description="Get insights about your learning journey"
            icon={<BookOpen className="w-5 h-5 text-white" />}
            presetQuestions={[
              "Analyze my learning progress",
              "Which lessons should I focus on?",
              "How's my learning consistency?",
            ]}
          />

          <Card className="p-6 animate-fade-in overflow-hidden">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 shrink-0" />
              <span className="truncate">Detailed Lesson Progress</span>
            </h3>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {lessonProgress?.map((lesson, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between items-center gap-4">
                    <span className="text-sm font-medium truncate flex-1">{lesson.title}</span>
                    <span className="text-sm text-muted-foreground shrink-0">
                      {lesson.progress}%
                      {lesson.completed && " ✓"}
                    </span>
                  </div>
                  <Progress value={lesson.progress} className="h-2" />
                </div>
              ))}
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="p-6 animate-fade-in overflow-hidden">
              <h3 className="text-lg font-bold mb-4">Completion Rate</h3>
              <div className="w-full overflow-x-auto">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={completionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {completionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="p-6 animate-fade-in">
              <h3 className="text-lg font-bold mb-4">Time Investment</h3>
              <div className="space-y-4">
                <div className="p-4 bg-gradient-primary/10 border border-primary/20 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Total Learning Time</p>
                  <p className="text-3xl font-bold">{Math.round(timeSpent)} min</p>
                </div>
                <div className="p-4 bg-gradient-success/10 border border-success/20 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Avg per Lesson</p>
                  <p className="text-3xl font-bold">{Math.round(timeSpent / (completedLessons || 1))} min</p>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trading" className="space-y-6">
          <AIAnalyticsChat
            title="Trading Analytics Assistant"
            description="Get AI-powered trading insights"
            icon={<TrendingUp className="w-5 h-5 text-white" />}
            presetQuestions={[
              "Analyze my portfolio performance",
              "What are my trading patterns?",
              "How can I improve my returns?",
            ]}
          />

          <Card className="p-6 animate-fade-in overflow-hidden">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 shrink-0" />
              <span className="truncate">Portfolio Performance</span>
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-gradient-success/10 border border-success/20 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Portfolio Value</p>
                  <p className="text-2xl font-bold">${portfolio?.total_value.toLocaleString() || "0"}</p>
                  <p className="text-sm mt-1 text-success">
                    {portfolioReturn >= 0 ? "+" : ""}{portfolioReturn.toFixed(2)}% return
                  </p>
                </div>
                <div className="p-4 bg-gradient-primary/10 border border-primary/20 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Cash Balance</p>
                  <p className="text-2xl font-bold">${portfolio?.cash_balance.toLocaleString() || "0"}</p>
                  <p className="text-sm mt-1 text-muted-foreground">Available to trade</p>
                </div>
              </div>
              {assetDistribution.length > 0 ? (
                <div className="w-full overflow-x-auto">
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={assetDistribution}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="hsl(var(--chart-1))" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  Start trading to build your portfolio
                </p>
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="behavioral" className="space-y-6">
          <AIAnalyticsChat
            title="Behavioral Analytics Assistant"
            description="Understand your behavioral patterns and habits"
            icon={<Brain className="w-5 h-5 text-white" />}
            presetQuestions={[
              "Analyze my behavioral patterns",
              "What's my engagement level?",
              "How consistent am I?",
            ]}
          />

          <Card className="p-6 animate-fade-in overflow-hidden">
            <h3 className="text-lg font-bold mb-4">Game Performance Trend</h3>
            <div className="w-full overflow-x-auto">
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={2} name="Score" />
                  <Line type="monotone" dataKey="coins" stroke="hsl(var(--accent))" strokeWidth={2} name="Coins" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6 animate-fade-in">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 shrink-0" />
              <span className="truncate">Engagement Metrics</span>
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-gradient-hero rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Avg Progress</p>
                <p className="text-xl font-bold">{overallProgress}%</p>
              </div>
              <div className="p-4 bg-gradient-hero rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Game Coins</p>
                <p className="text-xl font-bold">{totalCoinsEarned}</p>
              </div>
              <div className="p-4 bg-gradient-hero rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Transactions</p>
                <p className="text-xl font-bold">{transactions?.length || 0}</p>
              </div>
              <div className="p-4 bg-gradient-hero rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Total Activities</p>
                <p className="text-xl font-bold">{completedLessons + totalGames + (transactions?.length || 0)}</p>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;

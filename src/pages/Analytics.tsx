import { BarChart3, TrendingUp, Target, Award } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from "recharts";
import { alphaVantageService } from "@/lib/alphaVantageService";

interface AnalyticsProps {
  onNavigate: (tab: string) => void;
}

const Analytics = ({ onNavigate }: AnalyticsProps) => {
  const { user } = useAuth();

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

  const { data: gameSessions } = useQuery({
    queryKey: ["game_sessions", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("game_sessions")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const { data: spy } = useQuery({
    queryKey: ["benchmark_spy"],
    queryFn: () => alphaVantageService.getGlobalQuote("SPY"),
    refetchInterval: 300000,
  });

  const portfolioReturn = portfolio
    ? ((Number(portfolio.total_value) - 10000) / 10000) * 100
    : 0;

  const performanceData = gameSessions?.slice(0, 7).reverse().map((session, idx) => ({
    name: `Day ${idx + 1}`,
    score: session.score,
    coins: session.coins_earned,
  })) || [];

  const assetDistribution = assets?.map(asset => ({
    name: asset.asset_name,
    value: Number(asset.current_price) * Number(asset.quantity),
  })) || [];

  const benchmarkComparison = [
    { name: "Your Portfolio", return: portfolioReturn },
    { name: "S&P 500 (SPY)", return: spy ? spy.changePercent : 0 },
  ];

  const completedLessons = lessonProgress?.filter(l => l.completed).length || 0;
  const totalLessons = lessonProgress?.length || 1;
  const completionRate = Math.round((completedLessons / totalLessons) * 100);

  const totalGames = gameSessions?.length || 0;
  const totalCoinsEarned = gameSessions?.reduce((sum, session) => sum + (session.coins_earned || 0), 0) || 0;
  const avgGameScore = gameSessions?.reduce((sum, session) => sum + (session.score || 0), 0) / (totalGames || 1) || 0;

  return (
    <div className="space-y-6 pb-24">
      <div className="flex items-center gap-3 animate-fade-in">
        <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
          <BarChart3 className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Track your investing journey and progress</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-hero border-primary/20 animate-fade-in">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-primary" />
            <span className="text-sm text-muted-foreground">Level</span>
          </div>
          <p className="text-3xl font-bold">{profile?.level || 1}</p>
        </Card>

        <Card className="p-4 bg-gradient-hero border-success/20 animate-fade-in" style={{ animationDelay: "100ms" }}>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-success" />
            <span className="text-sm text-muted-foreground">Portfolio</span>
          </div>
          <p className="text-3xl font-bold">${portfolio?.total_value?.toFixed(0) || "10,000"}</p>
        </Card>

        <Card className="p-4 bg-gradient-hero border-warning/20 animate-fade-in" style={{ animationDelay: "200ms" }}>
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-5 h-5 text-warning" />
            <span className="text-sm text-muted-foreground">Coins</span>
          </div>
          <p className="text-3xl font-bold">{profile?.coins || 0}</p>
        </Card>

        <Card className="p-4 bg-gradient-hero border-info/20 animate-fade-in" style={{ animationDelay: "300ms" }}>
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-5 h-5 text-info" />
            <span className="text-sm text-muted-foreground">Games</span>
          </div>
          <p className="text-3xl font-bold">{totalGames}</p>
        </Card>
      </div>

      {/* Portfolio Performance Chart */}
      <Card className="p-6 bg-gradient-hero border-0 animate-fade-in" style={{ animationDelay: "400ms" }}>
        <h3 className="text-lg font-bold mb-4">Portfolio Performance</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={portfolioData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="month" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151" }} />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={3} name="Portfolio Value" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Asset Allocation */}
      <Card className="p-6 bg-gradient-hero border-0 animate-fade-in" style={{ animationDelay: "500ms" }}>
        <h3 className="text-lg font-bold mb-4">Asset Allocation</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={assetData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {assetData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </Card>

      {/* Learning Progress */}
      <Card className="p-6 bg-gradient-hero border-0 animate-fade-in" style={{ animationDelay: "600ms" }}>
        <h3 className="text-lg font-bold mb-4">Learning Progress</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm">Lessons Completed</span>
              <span className="text-sm font-bold">{completedLessons}/{totalLessons}</span>
            </div>
            <Progress value={completionRate} className="h-3" />
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="p-4 bg-background/50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Total Coins from Games</p>
              <p className="text-2xl font-bold text-warning">{totalCoinsEarned}</p>
            </div>
            <div className="p-4 bg-background/50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Avg Game Score</p>
              <p className="text-2xl font-bold text-success">{avgGameScore.toFixed(0)}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* AI Improvement Tips */}
      <Card className="p-6 bg-gradient-hero border-primary/20 animate-fade-in" style={{ animationDelay: "700ms" }}>
        <h3 className="text-lg font-bold mb-3">AI Improvement Tips</h3>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-primary mt-2" />
            <p className="text-sm">
              <span className="font-semibold">Diversification:</span> Consider spreading your investments across 3-4 asset classes to reduce risk. Warren Buffett advises: "Don't put all your eggs in one basket."
            </p>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-success mt-2" />
            <p className="text-sm">
              <span className="font-semibold">Learning Streak:</span> Complete 3 more lessons this week to unlock advanced strategies. Consistent learning leads to better investment decisions.
            </p>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-warning mt-2" />
            <p className="text-sm">
              <span className="font-semibold">Risk Management:</span> Your portfolio shows 60% in growth assets. Consider rebalancing to match your risk tolerance and time horizon.
            </p>
          </li>
        </ul>
      </Card>
    </div>
  );
};

export default Analytics;

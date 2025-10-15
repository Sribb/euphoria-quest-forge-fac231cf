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

  const totalGames = gameSessions?.length || 0;
  const totalCoinsEarned = gameSessions?.reduce((sum, session) => sum + (session.coins_earned || 0), 0) || 0;
  const avgGameScore = gameSessions?.reduce((sum, session) => sum + (session.score || 0), 0) / (totalGames || 1) || 0;

  return (
    <div className="space-y-6 pb-24">
      <div className="flex items-center gap-3 animate-fade-in">
        <div className="w-12 h-12 rounded-xl bg-gradient-accent flex items-center justify-center shadow-glow">
          <BarChart3 className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">Track your performance and progress</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 bg-gradient-success border-0">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-white" />
            <span className="text-sm text-white/80">Portfolio Value</span>
          </div>
          <p className="text-2xl font-bold text-white">
            ${portfolio?.total_value.toLocaleString() || "0"}
          </p>
          <p className="text-sm text-white/80 mt-1">
            {portfolioReturn >= 0 ? "+" : ""}{portfolioReturn.toFixed(2)}% return
          </p>
        </Card>

        <Card className="p-4 bg-gradient-primary border-0">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-white" />
            <span className="text-sm text-white/80">Total Games</span>
          </div>
          <p className="text-2xl font-bold text-white">{gameSessions?.length || 0}</p>
          <p className="text-sm text-white/80 mt-1">Games completed</p>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Award className="w-5 h-5" />
          Benchmark Comparison
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={benchmarkComparison}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="return" fill="hsl(var(--primary))" />
          </BarChart>
        </ResponsiveContainer>
        <p className="text-sm text-muted-foreground mt-3">
          {portfolioReturn > (spy?.changePercent || 0) 
            ? "🎉 You're outperforming the S&P 500!" 
            : "📊 Keep learning to beat the market benchmark"}
        </p>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-bold mb-4">Game Performance Trend</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={2} />
            <Line type="monotone" dataKey="coins" stroke="hsl(var(--accent))" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-bold mb-4">Asset Distribution</h3>
        {assetDistribution.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={assetDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="hsl(var(--chart-1))" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center text-muted-foreground py-12">
            Start trading to see your asset distribution
          </p>
        )}
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-bold mb-4">Performance Insights</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-gradient-hero rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Total Coins from Games</p>
            <p className="text-2xl font-bold">{totalCoinsEarned}</p>
          </div>
          <div className="p-4 bg-gradient-hero rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Avg Game Score</p>
            <p className="text-2xl font-bold">{avgGameScore.toFixed(0)}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Analytics;

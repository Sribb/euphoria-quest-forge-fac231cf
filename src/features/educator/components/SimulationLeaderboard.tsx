import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, TrendingUp, Wallet, Gamepad2, Target, Medal } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";

export const SimulationLeaderboard = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["educator-simulations"],
    queryFn: async () => {
      // Get portfolio data
      const { data: portfolios } = await supabase
        .from("portfolios")
        .select("user_id, total_value, cash_balance, created_at");

      // Get profiles
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, display_name, username, avatar_url, level");

      // Get game sessions
      const { data: gameSessions } = await supabase
        .from("game_sessions")
        .select("user_id, game_id, score, completed, created_at");

      // Get games
      const { data: games } = await supabase.from("games").select("id, title, difficulty");

      // Calculate portfolio performance
      const portfolioLeaderboard = portfolios
        ?.map((portfolio) => {
          const profile = profiles?.find((p) => p.id === portfolio.user_id);
          const initialValue = 10000; // Default starting value
          const currentValue = portfolio.total_value;
          const returnPct = ((currentValue - initialValue) / initialValue) * 100;

          return {
            userId: portfolio.user_id,
            displayName: profile?.display_name || profile?.username || "Unknown",
            avatarUrl: profile?.avatar_url,
            level: profile?.level || 1,
            totalValue: currentValue,
            returnPct: Math.round(returnPct * 100) / 100,
            cashBalance: portfolio.cash_balance,
            investedValue: currentValue - portfolio.cash_balance,
          };
        })
        .sort((a, b) => b.returnPct - a.returnPct)
        .slice(0, 10);

      // Calculate game leaderboard
      const userGameStats = new Map<
        string,
        { totalScore: number; gamesPlayed: number; gamesCompleted: number }
      >();

      gameSessions?.forEach((session) => {
        const existing = userGameStats.get(session.user_id) || {
          totalScore: 0,
          gamesPlayed: 0,
          gamesCompleted: 0,
        };
        userGameStats.set(session.user_id, {
          totalScore: existing.totalScore + session.score,
          gamesPlayed: existing.gamesPlayed + 1,
          gamesCompleted: existing.gamesCompleted + (session.completed ? 1 : 0),
        });
      });

      const gameLeaderboard = Array.from(userGameStats.entries())
        .map(([userId, stats]) => {
          const profile = profiles?.find((p) => p.id === userId);
          return {
            userId,
            displayName: profile?.display_name || profile?.username || "Unknown",
            avatarUrl: profile?.avatar_url,
            level: profile?.level || 1,
            totalScore: stats.totalScore,
            gamesPlayed: stats.gamesPlayed,
            gamesCompleted: stats.gamesCompleted,
            avgScore: Math.round(stats.totalScore / stats.gamesPlayed),
          };
        })
        .sort((a, b) => b.totalScore - a.totalScore)
        .slice(0, 10);

      // Calculate game difficulty distribution
      const difficultyStats = [
        {
          difficulty: "Easy",
          completed: gameSessions?.filter((g) => {
            const game = games?.find((ga) => ga.id === g.game_id);
            return game?.difficulty === "easy" && g.completed;
          }).length || 0,
        },
        {
          difficulty: "Medium",
          completed: gameSessions?.filter((g) => {
            const game = games?.find((ga) => ga.id === g.game_id);
            return game?.difficulty === "medium" && g.completed;
          }).length || 0,
        },
        {
          difficulty: "Hard",
          completed: gameSessions?.filter((g) => {
            const game = games?.find((ga) => ga.id === g.game_id);
            return game?.difficulty === "hard" && g.completed;
          }).length || 0,
        },
      ];

      // Benchmark comparison (vs market average)
      const benchmark = 7.5; // Average market return
      const avgUserReturn =
        portfolioLeaderboard && portfolioLeaderboard.length > 0
          ? portfolioLeaderboard.reduce((acc, p) => acc + p.returnPct, 0) / portfolioLeaderboard.length
          : 0;

      return {
        portfolioLeaderboard: portfolioLeaderboard || [],
        gameLeaderboard: gameLeaderboard || [],
        difficultyStats,
        avgUserReturn: Math.round(avgUserReturn * 100) / 100,
        benchmark,
        totalPortfolios: portfolios?.length || 0,
        totalGameSessions: gameSessions?.length || 0,
      };
    },
  });

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Medal className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Medal className="h-5 w-5 text-amber-600" />;
    return <span className="text-muted-foreground font-medium">#{rank}</span>;
  };

  return (
    <Tabs defaultValue="portfolio" className="space-y-4">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="portfolio" className="flex items-center gap-2">
          <Wallet className="h-4 w-4" />
          Portfolio Rankings
        </TabsTrigger>
        <TabsTrigger value="games" className="flex items-center gap-2">
          <Gamepad2 className="h-4 w-4" />
          Game Leaderboard
        </TabsTrigger>
      </TabsList>

      {/* Portfolio Rankings */}
      <TabsContent value="portfolio">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Summary Stats */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Target className="h-5 w-5" />
                Performance Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">Avg. User Return</p>
                <p
                  className={`text-2xl font-bold ${
                    (data?.avgUserReturn || 0) >= 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {(data?.avgUserReturn || 0) >= 0 ? "+" : ""}
                  {data?.avgUserReturn || 0}%
                </p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">Market Benchmark</p>
                <p className="text-2xl font-bold text-primary">+{data?.benchmark || 0}%</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">Active Portfolios</p>
                <p className="text-2xl font-bold">{data?.totalPortfolios || 0}</p>
              </div>
              <div
                className={`p-4 rounded-lg ${
                  (data?.avgUserReturn || 0) >= (data?.benchmark || 0)
                    ? "bg-green-500/10 border border-green-500/20"
                    : "bg-yellow-500/10 border border-yellow-500/20"
                }`}
              >
                <p className="text-sm font-medium">
                  {(data?.avgUserReturn || 0) >= (data?.benchmark || 0)
                    ? "🎉 Students are outperforming the market!"
                    : "📈 Room for improvement vs benchmark"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Leaderboard */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Trophy className="h-5 w-5 text-yellow-500" />
                Top Portfolio Performers
              </CardTitle>
              <CardDescription>Ranked by portfolio returns</CardDescription>
            </CardHeader>
            <CardContent>
              {data?.portfolioLeaderboard.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Wallet className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No portfolio data yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {data?.portfolioLeaderboard.map((user, index) => (
                    <div
                      key={user.userId}
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        index < 3 ? "bg-primary/5 border border-primary/10" : "bg-muted/30"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 text-center">{getRankBadge(index + 1)}</div>
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.avatarUrl || undefined} />
                          <AvatarFallback>{user.displayName[0].toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.displayName}</p>
                          <p className="text-xs text-muted-foreground">Level {user.level}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`font-bold ${
                            user.returnPct >= 0 ? "text-green-500" : "text-red-500"
                          }`}
                        >
                          {user.returnPct >= 0 ? "+" : ""}
                          {user.returnPct}%
                        </p>
                        <p className="text-xs text-muted-foreground">
                          ${user.totalValue.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      {/* Game Leaderboard */}
      <TabsContent value="games">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Game Stats */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Gamepad2 className="h-5 w-5" />
                Game Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">Total Sessions</p>
                  <p className="text-2xl font-bold">{data?.totalGameSessions || 0}</p>
                </div>

                <div>
                  <p className="text-sm font-medium mb-3">Completions by Difficulty</p>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data?.difficultyStats} layout="vertical">
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="difficulty" width={60} />
                        <Tooltip />
                        <Bar dataKey="completed" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Game Leaderboard */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Trophy className="h-5 w-5 text-yellow-500" />
                Top Gamers
              </CardTitle>
              <CardDescription>Ranked by total score across all games</CardDescription>
            </CardHeader>
            <CardContent>
              {data?.gameLeaderboard.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Gamepad2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No game data yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {data?.gameLeaderboard.map((user, index) => (
                    <div
                      key={user.userId}
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        index < 3 ? "bg-primary/5 border border-primary/10" : "bg-muted/30"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 text-center">{getRankBadge(index + 1)}</div>
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.avatarUrl || undefined} />
                          <AvatarFallback>{user.displayName[0].toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.displayName}</p>
                          <p className="text-xs text-muted-foreground">
                            {user.gamesPlayed} games • {user.gamesCompleted} completed
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">{user.totalScore.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Avg: {user.avgScore}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  );
};

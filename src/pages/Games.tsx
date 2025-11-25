import { Trophy, ArrowLeft, Brain, Users, Coins, TrendingUp, TrendingDown, Activity } from "lucide-react";
import { useState, useEffect } from "react";
import { LifeSimInvestorGame } from "@/components/games/LifeSimInvestorGame";
import { TrendMasterGame } from "@/components/games/TrendMasterGame";
import { useAuth } from "@/hooks/useAuth";
import { useAIMarket } from "@/hooks/useAIMarket";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface GamesProps {
  onNavigate: (tab: string) => void;
}

const Games = ({ onNavigate }: GamesProps) => {
  const { user } = useAuth();
  const { session, competitors, activeEvents, initializeSession, updatePrices, isLoading } = useAIMarket(user?.id);
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);

  const handlePlayGame = (game: string) => {
    setActiveGame(game);
  };

  const handleCloseGame = () => {
    setActiveGame(null);
  };

  const handleJoinChallenge = async () => {
    if (!session) {
      setIsInitializing(true);
      await initializeSession.mutateAsync();
      setIsInitializing(false);
    }
    onNavigate('trade');
  };

  // Auto-update market prices every 10 seconds when session is active
  useEffect(() => {
    if (!session) return;

    const interval = setInterval(() => {
      updatePrices.mutate();
    }, 10000);

    return () => clearInterval(interval);
  }, [session]);

  const getCompetitorProfitLoss = (competitor: any) => {
    const initialCapital = 10000;
    const currentCapital = competitor.capital || initialCapital;
    return currentCapital - initialCapital;
  };

  const getCompetitorProfitLossPercent = (competitor: any) => {
    const initialCapital = 10000;
    const profitLoss = getCompetitorProfitLoss(competitor);
    return ((profitLoss / initialCapital) * 100).toFixed(2);
  };

  const getStrategyDescription = (strategyType: string) => {
    const strategies: Record<string, string> = {
      momentum: "Follows strong price trends and market momentum. Buys rising stocks and sells falling ones quickly.",
      value: "Seeks undervalued stocks with strong fundamentals. Patient investor focused on long-term gains.",
      aggressive: "High-risk, high-reward trader. Makes bold moves with leverage and doesn't fear volatility.",
      conservative: "Risk-averse approach. Prioritizes capital preservation with defensive positions and hedging."
    };
    return strategies[strategyType] || "Strategic AI trader";
  };

  if (activeGame === "life-sim") {
    return <LifeSimInvestorGame onClose={handleCloseGame} />;
  }

  if (activeGame === "trend-master") {
    return <TrendMasterGame onClose={handleCloseGame} />;
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center gap-4 animate-fade-in">
        <div className="w-14 h-14 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow-soft">
          <Trophy className="w-7 h-7 text-white" />
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Investment Games</h1>
          <p className="text-muted-foreground">Learn investing through interactive challenges</p>
        </div>
      </div>

      {/* AI Competitor Challenge Section */}
      <Card className="p-6 bg-gradient-accent border-0 animate-fade-in shadow-glow-soft">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
            <Brain className="w-6 h-6 text-primary animate-pulse" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg">AI Competitor Challenge</h3>
            <p className="text-sm text-muted-foreground">
              {session ? `Live trading session with ${competitors?.length || 4} AI traders` : "Compete against 4 AI traders in real-time"}
            </p>
          </div>
          <Button
            size="lg"
            className="bg-gradient-primary hover:opacity-90 shadow-glow-soft"
            onClick={handleJoinChallenge}
            disabled={isInitializing || isLoading}
          >
            {isInitializing ? "Initializing..." : session ? "Continue Challenge" : "Join Challenge"}
          </Button>
        </div>

        {session && competitors && competitors.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {competitors.slice(0, 4).map((comp, idx) => {
              const profitLoss = getCompetitorProfitLoss(comp);
              const profitLossPercent = getCompetitorProfitLossPercent(comp);
              const isProfit = profitLoss >= 0;

              return (
                <TooltipProvider key={comp.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className="p-5 rounded-xl bg-card border border-border animate-scale-in hover-lift cursor-pointer smooth-transition"
                        style={{ animationDelay: `${idx * 100}ms` }}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-lg">{comp.name}</span>
                              <Badge variant="outline" className="text-xs capitalize">
                                {comp.strategy_type}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Activity className="w-3 h-3" />
                              <span>{comp.total_trades || 0} trades</span>
                              {comp.last_action_at && (
                                <span>• Last: {new Date(comp.last_action_at).toLocaleTimeString()}</span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Capital</span>
                            <span className="font-bold text-base">
                              ${Number(comp.capital).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Profit/Loss</span>
                            <div className="flex items-center gap-2">
                              {isProfit ? (
                                <TrendingUp className="w-4 h-4 text-success" />
                              ) : (
                                <TrendingDown className="w-4 h-4 text-destructive" />
                              )}
                              <span className={`font-bold text-base ${isProfit ? 'text-success' : 'text-destructive'}`}>
                                {isProfit ? '+' : ''}${profitLoss.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                <span className="text-xs ml-1">({isProfit ? '+' : ''}{profitLossPercent}%)</span>
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-border">
                            <span className="text-sm text-muted-foreground">Win Rate</span>
                            <span className="font-medium text-sm">
                              {(comp.win_rate * 100).toFixed(0)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p className="font-semibold mb-1">{comp.name}'s Strategy</p>
                      <p className="text-sm">{getStrategyDescription(comp.strategy_type)}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {['Momentum Mike', 'Value Victor', 'Aggressive Amy', 'Conservative Chris'].map((name, idx) => {
              const strategies = ['momentum', 'value', 'aggressive', 'conservative'];
              return (
                <div
                  key={name}
                  className="p-4 rounded-xl bg-card/50 border border-border animate-scale-in"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{name}</span>
                    <Badge variant="outline" className="text-xs capitalize">
                      {strategies[idx]}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Starting: $10,000
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Market Events Impact on Games */}
      {activeEvents && activeEvents.length > 0 && (
        <Card className="p-5 bg-warning/5 border-warning animate-fade-in shadow-md">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-5 h-5 text-warning" />
            <h4 className="font-semibold">Active Market Event</h4>
          </div>
          <p className="text-sm text-muted-foreground">
            {activeEvents[0].description} - Test your skills in the AI Market!
          </p>
        </Card>
      )}

      {/* Featured Games Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Life Sim Game */}
        <div className="animate-fade-in">
          <Card className="p-6 bg-gradient-primary text-white hover-lift cursor-pointer smooth-transition border-0 shadow-glow-soft h-full" onClick={() => handlePlayGame("life-sim")}>
            <div className="flex flex-col h-full">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center shadow-glow">
                  <Trophy className="w-9 h-9" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-2xl">Life Sim: Investor Journey</h3>
                    <Badge className="bg-white/20 text-white border-0">Epic</Badge>
                  </div>
                </div>
              </div>
              <p className="text-sm text-white/90 mb-6 flex-1">
                Live a full investing life from age 22 to retirement! Make career moves, buy homes, manage portfolios, and face real market events. Your choices shape your financial destiny.
              </p>
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2 text-sm">
                  <Coins className="w-5 h-5" />
                  <span className="font-bold">Variable Rewards</span>
                </div>
                <Badge variant="outline" className="bg-white/10 border-white/30 text-white">Immersive</Badge>
              </div>
            </div>
          </Card>
        </div>

        {/* Trend Master Game */}
        <div className="animate-fade-in" style={{ animationDelay: "100ms" }}>
          <Card className="p-6 bg-gradient-accent hover-lift cursor-pointer smooth-transition border-0 shadow-md h-full" onClick={() => handlePlayGame("trend-master")}>
            <div className="flex flex-col h-full">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center shadow-glow-soft">
                  <TrendingUp className="w-9 h-9 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-2xl">Trend Master</h3>
                    <Badge variant="secondary">Featured</Badge>
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-6 flex-1">
                Master the art of reading stock charts! Identify 20+ real chart patterns from uptrends to head-and-shoulders. Interactive charts, instant feedback, and mentor-style explanations help you see markets like a pro.
              </p>
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2 text-sm">
                  <Brain className="w-5 h-5 text-primary" />
                  <span className="font-bold text-primary">20+ Patterns</span>
                </div>
                <Badge variant="outline">Interactive</Badge>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Games;

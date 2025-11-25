import { useState, useEffect } from "react";
import { Brain, TrendingUp, TrendingDown, Activity, Trophy, X, DollarSign, BarChart3 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { useAIMarket } from "@/hooks/useAIMarket";
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface AICompetitorGameProps {
  onClose: () => void;
}

interface Trader {
  id: string;
  name: string;
  capital: number;
  initialCapital: number;
  strategy: string;
  trades: number;
  winRate: number;
  lastAction?: string;
}

export const AICompetitorGame = ({ onClose }: AICompetitorGameProps) => {
  const { user } = useAuth();
  const { session, competitors, initializeSession, updatePrices, aiPrices, isLoading } = useAIMarket(user?.id);
  const { toast } = useToast();
  const [userCapital, setUserCapital] = useState(10000);
  const [userTrades, setUserTrades] = useState(0);
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  const [traders, setTraders] = useState<Trader[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes

  // Initialize game
  useEffect(() => {
    if (!session && !isLoading) {
      initializeSession.mutate();
    }
  }, [session, isLoading]);

  // Setup traders from competitors
  useEffect(() => {
    if (competitors && competitors.length > 0) {
      const traderData: Trader[] = competitors.map(comp => ({
        id: comp.id,
        name: comp.name,
        capital: Number(comp.capital),
        initialCapital: 10000,
        strategy: comp.strategy_type,
        trades: comp.total_trades || 0,
        winRate: comp.win_rate || 0,
        lastAction: undefined
      }));
      setTraders(traderData);
      setGameStarted(true);
    }
  }, [competitors]);

  // Game timer
  useEffect(() => {
    if (!gameStarted || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleGameEnd();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, timeRemaining]);

  // Auto-update prices and AI trades
  useEffect(() => {
    if (!gameStarted || !session) return;

    const interval = setInterval(() => {
      updatePrices.mutate();
      simulateAITrades();
    }, 8000); // Every 8 seconds

    return () => clearInterval(interval);
  }, [gameStarted, session]);

  const simulateAITrades = () => {
    setTraders(prevTraders => 
      prevTraders.map(trader => {
        const shouldTrade = Math.random() > 0.5;
        if (!shouldTrade) return trader;

        const profitMultiplier = getStrategyMultiplier(trader.strategy);
        const changePercent = (Math.random() - 0.45) * profitMultiplier;
        const capitalChange = trader.capital * changePercent;
        const newCapital = Math.max(1000, trader.capital + capitalChange);

        const actions = ['bought AAPL', 'sold TSLA', 'bought NVDA', 'sold MSFT', 'bought GOOGL', 'sold AMZN'];
        
        return {
          ...trader,
          capital: newCapital,
          trades: trader.trades + 1,
          winRate: capitalChange > 0 ? Math.min(1, trader.winRate + 0.05) : Math.max(0, trader.winRate - 0.03),
          lastAction: actions[Math.floor(Math.random() * actions.length)]
        };
      })
    );
  };

  const getStrategyMultiplier = (strategy: string): number => {
    const multipliers: Record<string, number> = {
      aggressive: 0.15,
      momentum: 0.12,
      value: 0.06,
      conservative: 0.04
    };
    return multipliers[strategy] || 0.08;
  };

  const handleTrade = (action: 'buy' | 'sell') => {
    if (!selectedStock) {
      toast({
        title: "Select a stock",
        description: "Choose a stock to trade",
        variant: "destructive"
      });
      return;
    }

    const changePercent = (Math.random() - 0.48) * 0.1;
    const capitalChange = userCapital * changePercent;
    const newCapital = Math.max(1000, userCapital + capitalChange);
    
    setUserCapital(newCapital);
    setUserTrades(prev => prev + 1);

    toast({
      title: `${action === 'buy' ? 'Bought' : 'Sold'} ${selectedStock}`,
      description: capitalChange > 0 
        ? `+$${Math.abs(capitalChange).toFixed(2)}` 
        : `-$${Math.abs(capitalChange).toFixed(2)}`,
      variant: capitalChange > 0 ? "default" : "destructive"
    });
  };

  const handleGameEnd = () => {
    const allTraders = [
      { name: 'You', capital: userCapital, initialCapital: 10000 },
      ...traders
    ].sort((a, b) => b.capital - a.capital);

    const userRank = allTraders.findIndex(t => t.name === 'You') + 1;
    
    toast({
      title: "Competition Ended!",
      description: `You finished #${userRank} out of ${allTraders.length} traders`,
      duration: 5000
    });
  };

  const getProfitLoss = (current: number, initial: number) => current - initial;
  const getProfitLossPercent = (current: number, initial: number) => 
    ((getProfitLoss(current, initial) / initial) * 100).toFixed(2);

  const getLeaderboard = () => {
    const allTraders = [
      { name: 'You (Player)', capital: userCapital, initialCapital: 10000, trades: userTrades, strategy: 'player' },
      ...traders
    ].sort((a, b) => b.capital - a.capital);
    return allTraders;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStrategyDescription = (strategyType: string) => {
    const strategies: Record<string, string> = {
      momentum: "Follows strong price trends. Buys rising stocks quickly.",
      value: "Seeks undervalued stocks. Patient long-term investor.",
      aggressive: "High-risk, high-reward. Makes bold leveraged moves.",
      conservative: "Risk-averse. Prioritizes capital preservation.",
      player: "Your trading strategy - make it count!"
    };
    return strategies[strategyType] || "Strategic trader";
  };

  if (!gameStarted) {
    return (
      <div className="fixed inset-0 bg-background z-50 flex items-center justify-center p-6">
        <Card className="w-full max-w-2xl p-8 bg-card">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center">
              <Brain className="w-8 h-8 text-white animate-pulse" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center mb-4">Initializing AI Competition...</h2>
          <Progress value={isLoading ? 50 : 100} className="mb-4" />
          <p className="text-center text-muted-foreground">
            Setting up your trading opponents...
          </p>
        </Card>
      </div>
    );
  }

  const leaderboard = getLeaderboard();
  const userRank = leaderboard.findIndex(t => t.name.includes('Player')) + 1;

  return (
    <div className="fixed inset-0 bg-background z-50 overflow-auto">
      {/* Header */}
      <div className="sticky top-0 bg-card/95 backdrop-blur-sm border-b border-border z-10 p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">AI Competitor Challenge</h1>
              <p className="text-sm text-muted-foreground">Live Trading Competition</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{formatTime(timeRemaining)}</div>
              <div className="text-xs text-muted-foreground">Time Left</div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Leaderboard */}
        <Card className="p-6 bg-gradient-accent border-0">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-lg">Live Leaderboard</h3>
          </div>
          <div className="space-y-3">
            {leaderboard.map((trader, idx) => {
              const isUser = trader.name.includes('Player');
              const profitLoss = getProfitLoss(trader.capital, trader.initialCapital);
              const profitLossPercent = getProfitLossPercent(trader.capital, trader.initialCapital);
              const isProfit = profitLoss >= 0;

              return (
                <TooltipProvider key={trader.name}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div 
                        className={`p-4 rounded-xl border smooth-transition ${
                          isUser 
                            ? 'bg-primary/10 border-primary shadow-glow-soft' 
                            : 'bg-card border-border'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${
                              idx === 0 ? 'bg-yellow-500/20 text-yellow-500' :
                              idx === 1 ? 'bg-gray-400/20 text-gray-400' :
                              idx === 2 ? 'bg-orange-500/20 text-orange-500' :
                              'bg-muted text-muted-foreground'
                            }`}>
                              #{idx + 1}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold">{trader.name}</span>
                                {!isUser && (
                                  <Badge variant="outline" className="text-xs capitalize">
                                    {trader.strategy}
                                  </Badge>
                                )}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {trader.trades} trades
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="font-bold text-lg">
                              ${trader.capital.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                            <div className={`text-sm font-medium flex items-center gap-1 justify-end ${
                              isProfit ? 'text-success' : 'text-destructive'
                            }`}>
                              {isProfit ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                              {isProfit ? '+' : ''}{profitLossPercent}%
                            </div>
                          </div>
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="font-semibold mb-1">{trader.name}</p>
                      <p className="text-sm">{getStrategyDescription(trader.strategy)}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            })}
          </div>
        </Card>

        {/* Trading Panel */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Your Stats */}
          <Card className="p-6 bg-gradient-primary text-white">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Your Performance
            </h3>
            <div className="space-y-4">
              <div>
                <div className="text-sm opacity-80 mb-1">Current Capital</div>
                <div className="text-3xl font-bold">
                  ${userCapital.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm opacity-80 mb-1">P&L</div>
                  <div className={`text-xl font-bold ${
                    getProfitLoss(userCapital, 10000) >= 0 ? 'text-green-300' : 'text-red-300'
                  }`}>
                    {getProfitLoss(userCapital, 10000) >= 0 ? '+' : ''}
                    ${Math.abs(getProfitLoss(userCapital, 10000)).toFixed(2)}
                  </div>
                </div>
                <div>
                  <div className="text-sm opacity-80 mb-1">Rank</div>
                  <div className="text-xl font-bold">#{userRank}</div>
                </div>
              </div>
              <div>
                <div className="text-sm opacity-80 mb-1">Trades Made</div>
                <div className="text-xl font-bold">{userTrades}</div>
              </div>
            </div>
          </Card>

          {/* Quick Trade */}
          <Card className="p-6">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Quick Trade
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Select Stock</label>
                <div className="grid grid-cols-2 gap-2">
                  {['AAPL', 'TSLA', 'NVDA', 'MSFT', 'GOOGL', 'AMZN'].map(symbol => (
                    <Button
                      key={symbol}
                      variant={selectedStock === symbol ? "default" : "outline"}
                      onClick={() => setSelectedStock(symbol)}
                      className="w-full"
                    >
                      {symbol}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  size="lg"
                  className="bg-success hover:bg-success/90 text-white"
                  onClick={() => handleTrade('buy')}
                  disabled={!selectedStock}
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Buy
                </Button>
                <Button 
                  size="lg"
                  className="bg-destructive hover:bg-destructive/90 text-white"
                  onClick={() => handleTrade('sell')}
                  disabled={!selectedStock}
                >
                  <TrendingDown className="w-4 h-4 mr-2" />
                  Sell
                </Button>
              </div>

              <div className="text-xs text-muted-foreground text-center">
                Make strategic trades to climb the leaderboard!
              </div>
            </div>
          </Card>
        </div>

        {/* AI Activity Feed */}
        <Card className="p-6">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Recent AI Activity
          </h3>
          <div className="space-y-2 max-h-64 overflow-auto">
            {traders.filter(t => t.lastAction).slice(0, 8).map((trader, idx) => (
              <div key={`${trader.id}-${idx}`} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Brain className="w-4 h-4 text-primary" />
                <div className="flex-1">
                  <span className="font-medium">{trader.name}</span>
                  <span className="text-muted-foreground"> {trader.lastAction}</span>
                </div>
                <div className="text-sm text-muted-foreground">just now</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
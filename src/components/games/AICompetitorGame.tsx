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
  lastTradeTime?: number;
  holdings: Record<string, { shares: number; avgPrice: number }>;
}

interface StockPrice {
  symbol: string;
  price: number;
  change: number;
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
  const [lastUserTradeTime, setLastUserTradeTime] = useState(0);
  const [userHoldings, setUserHoldings] = useState<Record<string, { shares: number; avgPrice: number }>>({});
  const [stockPrices, setStockPrices] = useState<StockPrice[]>([
    { symbol: 'AAPL', price: 178.50, change: 0 },
    { symbol: 'TSLA', price: 245.20, change: 0 },
    { symbol: 'NVDA', price: 485.30, change: 0 },
    { symbol: 'MSFT', price: 378.90, change: 0 },
    { symbol: 'GOOGL', price: 142.75, change: 0 },
    { symbol: 'AMZN', price: 178.25, change: 0 }
  ]);
  const TRADE_COOLDOWN = 3000; // 3 seconds cooldown between trades

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
        lastAction: undefined,
        lastTradeTime: 0,
        holdings: {}
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

    const priceInterval = setInterval(() => {
      updateStockPrices();
    }, 2000); // Update prices every 2 seconds

    const tradeInterval = setInterval(() => {
      updatePrices.mutate();
      simulateAITrades();
    }, 4000); // AI trades every 4 seconds

    return () => {
      clearInterval(priceInterval);
      clearInterval(tradeInterval);
    };
  }, [gameStarted, session]);

  const updateStockPrices = () => {
    setStockPrices(prev => prev.map(stock => {
      const changePercent = (Math.random() - 0.5) * 0.02; // -1% to +1%
      const newPrice = Math.max(1, stock.price * (1 + changePercent));
      return {
        ...stock,
        price: newPrice,
        change: changePercent * 100
      };
    }));
  };

  const getStrategyTradeDecision = (strategy: string, prices: StockPrice[]) => {
    // Each strategy has different trading patterns
    const decisions = {
      aggressive: () => {
        // Aggressive: trades frequently, buys volatile stocks, larger positions
        const volatileStocks = prices.filter(p => Math.abs(p.change) > 0.3);
        if (volatileStocks.length > 0) {
          const stock = volatileStocks[Math.floor(Math.random() * volatileStocks.length)];
          return { action: stock.change > 0 ? 'buy' : 'sell', symbol: stock.symbol, shares: Math.floor(Math.random() * 20) + 10 };
        }
        const randomStock = prices[Math.floor(Math.random() * prices.length)];
        return { action: Math.random() > 0.4 ? 'buy' : 'sell', symbol: randomStock.symbol, shares: Math.floor(Math.random() * 15) + 5 };
      },
      momentum: () => {
        // Momentum: follows trends, buys rising stocks
        const risingStocks = prices.filter(p => p.change > 0.2);
        if (risingStocks.length > 0) {
          const stock = risingStocks[Math.floor(Math.random() * risingStocks.length)];
          return { action: 'buy', symbol: stock.symbol, shares: Math.floor(Math.random() * 12) + 5 };
        }
        const fallingStocks = prices.filter(p => p.change < -0.2);
        if (fallingStocks.length > 0) {
          const stock = fallingStocks[Math.floor(Math.random() * fallingStocks.length)];
          return { action: 'sell', symbol: stock.symbol, shares: Math.floor(Math.random() * 8) + 3 };
        }
        return null; // Hold if no clear trend
      },
      value: () => {
        // Value: buys dips, patient, smaller trades
        const dippedStocks = prices.filter(p => p.change < -0.3);
        if (dippedStocks.length > 0 && Math.random() > 0.4) {
          const stock = dippedStocks[Math.floor(Math.random() * dippedStocks.length)];
          return { action: 'buy', symbol: stock.symbol, shares: Math.floor(Math.random() * 8) + 3 };
        }
        // Rarely sells, only if significant gains
        const peakedStocks = prices.filter(p => p.change > 0.5);
        if (peakedStocks.length > 0 && Math.random() > 0.7) {
          const stock = peakedStocks[Math.floor(Math.random() * peakedStocks.length)];
          return { action: 'sell', symbol: stock.symbol, shares: Math.floor(Math.random() * 5) + 2 };
        }
        return null;
      },
      conservative: () => {
        // Conservative: trades rarely, small positions, avoids volatility
        if (Math.random() > 0.6) return null; // Often holds
        const stableStocks = prices.filter(p => Math.abs(p.change) < 0.3);
        if (stableStocks.length > 0) {
          const stock = stableStocks[Math.floor(Math.random() * stableStocks.length)];
          return { action: Math.random() > 0.5 ? 'buy' : 'sell', symbol: stock.symbol, shares: Math.floor(Math.random() * 5) + 2 };
        }
        return null;
      }
    };

    const decisionFn = decisions[strategy as keyof typeof decisions] || decisions.momentum;
    return decisionFn();
  };

  const simulateAITrades = () => {
    setTraders(prevTraders => 
      prevTraders.map(trader => {
        const decision = getStrategyTradeDecision(trader.strategy, stockPrices);
        
        if (!decision) {
          // Trader holds - no action this round
          return {
            ...trader,
            lastAction: 'holding position'
          };
        }

        const stockPrice = stockPrices.find(p => p.symbol === decision.symbol);
        if (!stockPrice) return trader;

        const tradeValue = stockPrice.price * decision.shares;
        let newCapital = trader.capital;
        let newHoldings = { ...trader.holdings };

        if (decision.action === 'buy') {
          if (trader.capital >= tradeValue) {
            newCapital = trader.capital - tradeValue;
            const existingHolding = newHoldings[decision.symbol] || { shares: 0, avgPrice: 0 };
            const totalShares = existingHolding.shares + decision.shares;
            const totalCost = (existingHolding.shares * existingHolding.avgPrice) + tradeValue;
            newHoldings[decision.symbol] = {
              shares: totalShares,
              avgPrice: totalCost / totalShares
            };
          } else {
            return { ...trader, lastAction: 'insufficient funds' };
          }
        } else {
          // Sell
          const existingHolding = newHoldings[decision.symbol];
          if (existingHolding && existingHolding.shares >= decision.shares) {
            newCapital = trader.capital + tradeValue;
            newHoldings[decision.symbol] = {
              shares: existingHolding.shares - decision.shares,
              avgPrice: existingHolding.avgPrice
            };
            if (newHoldings[decision.symbol].shares === 0) {
              delete newHoldings[decision.symbol];
            }
          } else {
            // Short sell (simplified - just affects capital)
            newCapital = trader.capital + (tradeValue * 0.95); // 5% short premium
          }
        }

        // Calculate total portfolio value including holdings
        const holdingsValue = Object.entries(newHoldings).reduce((total, [symbol, holding]) => {
          const price = stockPrices.find(p => p.symbol === symbol)?.price || 0;
          return total + (holding.shares * price);
        }, 0);

        return {
          ...trader,
          capital: newCapital,
          holdings: newHoldings,
          trades: trader.trades + 1,
          winRate: Math.random() > 0.4 ? Math.min(1, trader.winRate + 0.02) : Math.max(0, trader.winRate - 0.01),
          lastAction: `${decision.action === 'buy' ? 'bought' : 'sold'} ${decision.shares} ${decision.symbol} @ $${stockPrice.price.toFixed(2)}`,
          lastTradeTime: Date.now()
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

  const canTrade = () => {
    return Date.now() - lastUserTradeTime >= TRADE_COOLDOWN;
  };

  const getCooldownRemaining = () => {
    const remaining = TRADE_COOLDOWN - (Date.now() - lastUserTradeTime);
    return Math.max(0, Math.ceil(remaining / 1000));
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

    if (!canTrade()) {
      toast({
        title: "Trade Cooldown",
        description: `Wait ${getCooldownRemaining()} seconds before your next trade`,
        variant: "destructive"
      });
      return;
    }

    const stockPrice = stockPrices.find(p => p.symbol === selectedStock);
    if (!stockPrice) return;

    const shares = Math.floor(Math.random() * 10) + 5; // 5-15 shares per trade
    const tradeValue = stockPrice.price * shares;

    if (action === 'buy') {
      if (userCapital < tradeValue) {
        toast({
          title: "Insufficient Funds",
          description: `You need $${tradeValue.toFixed(2)} but only have $${userCapital.toFixed(2)}`,
          variant: "destructive"
        });
        return;
      }

      setUserCapital(prev => prev - tradeValue);
      setUserHoldings(prev => {
        const existing = prev[selectedStock] || { shares: 0, avgPrice: 0 };
        const totalShares = existing.shares + shares;
        const totalCost = (existing.shares * existing.avgPrice) + tradeValue;
        return {
          ...prev,
          [selectedStock]: {
            shares: totalShares,
            avgPrice: totalCost / totalShares
          }
        };
      });

      toast({
        title: `Bought ${shares} ${selectedStock}`,
        description: `Total: $${tradeValue.toFixed(2)} @ $${stockPrice.price.toFixed(2)}/share`
      });
    } else {
      // Sell
      const holding = userHoldings[selectedStock];
      if (!holding || holding.shares < shares) {
        // Short sell
        const proceeds = tradeValue * 0.95;
        setUserCapital(prev => prev + proceeds);
        toast({
          title: `Short Sold ${shares} ${selectedStock}`,
          description: `Proceeds: $${proceeds.toFixed(2)} (5% premium)`
        });
      } else {
        // Regular sell
        setUserCapital(prev => prev + tradeValue);
        setUserHoldings(prev => {
          const newShares = prev[selectedStock].shares - shares;
          if (newShares === 0) {
            const { [selectedStock]: _, ...rest } = prev;
            return rest;
          }
          return {
            ...prev,
            [selectedStock]: {
              ...prev[selectedStock],
              shares: newShares
            }
          };
        });

        const profit = (stockPrice.price - holding.avgPrice) * shares;
        toast({
          title: `Sold ${shares} ${selectedStock}`,
          description: profit >= 0 
            ? `Profit: +$${profit.toFixed(2)}` 
            : `Loss: -$${Math.abs(profit).toFixed(2)}`,
          variant: profit >= 0 ? "default" : "destructive"
        });
      }
    }
    
    setUserTrades(prev => prev + 1);
    setLastUserTradeTime(Date.now());
  };

  // Calculate total portfolio value including holdings
  const getUserTotalValue = () => {
    const holdingsValue = Object.entries(userHoldings).reduce((total, [symbol, holding]) => {
      const price = stockPrices.find(p => p.symbol === symbol)?.price || 0;
      return total + (holding.shares * price);
    }, 0);
    return userCapital + holdingsValue;
  };

  const getTraderTotalValue = (trader: Trader) => {
    const holdingsValue = Object.entries(trader.holdings).reduce((total, [symbol, holding]) => {
      const price = stockPrices.find(p => p.symbol === symbol)?.price || 0;
      return total + (holding.shares * price);
    }, 0);
    return trader.capital + holdingsValue;
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
    const userTotalValue = getUserTotalValue();
    const allTraders = [
      { name: 'You (Player)', capital: userTotalValue, initialCapital: 10000, trades: userTrades, strategy: 'player', holdings: userHoldings },
      ...traders.map(t => ({ ...t, capital: getTraderTotalValue(t) }))
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
                <div className="text-sm opacity-80 mb-1">Portfolio Value</div>
                <div className="text-3xl font-bold">
                  ${getUserTotalValue().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm opacity-80 mb-1">P&L</div>
                  <div className={`text-xl font-bold ${
                    getProfitLoss(getUserTotalValue(), 10000) >= 0 ? 'text-green-300' : 'text-red-300'
                  }`}>
                    {getProfitLoss(getUserTotalValue(), 10000) >= 0 ? '+' : ''}
                    ${Math.abs(getProfitLoss(getUserTotalValue(), 10000)).toFixed(2)}
                  </div>
                </div>
                <div>
                  <div className="text-sm opacity-80 mb-1">Rank</div>
                  <div className="text-xl font-bold">#{userRank}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm opacity-80 mb-1">Cash</div>
                  <div className="text-lg font-bold">${userCapital.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-sm opacity-80 mb-1">Trades Made</div>
                  <div className="text-lg font-bold">{userTrades}</div>
                </div>
              </div>
              {Object.keys(userHoldings).length > 0 && (
                <div>
                  <div className="text-sm opacity-80 mb-2">Holdings</div>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(userHoldings).map(([symbol, holding]) => (
                      <Badge key={symbol} variant="secondary" className="bg-white/20 text-white">
                        {symbol}: {holding.shares} shares
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
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
                <label className="text-sm text-muted-foreground mb-2 block">Select Stock (Live Prices)</label>
                <div className="grid grid-cols-2 gap-2">
                  {stockPrices.map(stock => (
                    <Button
                      key={stock.symbol}
                      variant={selectedStock === stock.symbol ? "default" : "outline"}
                      onClick={() => setSelectedStock(stock.symbol)}
                      className="w-full justify-between px-3"
                    >
                      <span className="font-bold">{stock.symbol}</span>
                      <span className={`text-xs ${stock.change >= 0 ? 'text-success' : 'text-destructive'}`}>
                        ${stock.price.toFixed(2)} {stock.change >= 0 ? '↑' : '↓'}
                      </span>
                    </Button>
                  ))}
                </div>
              </div>
              
              {!canTrade() && (
                <div className="text-center p-2 bg-warning/10 rounded-lg border border-warning/20">
                  <div className="text-sm font-medium text-warning">Cooldown: {getCooldownRemaining()}s</div>
                  <Progress value={(1 - getCooldownRemaining() / 3) * 100} className="h-1 mt-1" />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <Button 
                  size="lg"
                  className="bg-success hover:bg-success/90 text-white"
                  onClick={() => handleTrade('buy')}
                  disabled={!selectedStock || !canTrade()}
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Buy
                </Button>
                <Button 
                  size="lg"
                  className="bg-destructive hover:bg-destructive/90 text-white"
                  onClick={() => handleTrade('sell')}
                  disabled={!selectedStock || !canTrade()}
                >
                  <TrendingDown className="w-4 h-4 mr-2" />
                  Sell
                </Button>
              </div>

              <div className="text-xs text-muted-foreground text-center">
                3s cooldown between trades • Make strategic decisions!
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
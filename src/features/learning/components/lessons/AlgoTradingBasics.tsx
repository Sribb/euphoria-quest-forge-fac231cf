import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bot, Play, Pause, TrendingUp, TrendingDown, Zap } from "lucide-react";

const strategies = [
  { name: "Moving Average Crossover", type: "Trend", winRate: 52, avgTrade: 1.2 },
  { name: "Mean Reversion", type: "Reversion", winRate: 58, avgTrade: 0.8 },
  { name: "Momentum", type: "Trend", winRate: 48, avgTrade: 2.1 },
  { name: "Market Making", type: "Neutral", winRate: 65, avgTrade: 0.3 },
];

export const AlgoTradingBasics = () => {
  const [selectedStrategy, setSelectedStrategy] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [trades, setTrades] = useState<{profit: number, time: string}[]>([]);

  const runBacktest = () => {
    setIsRunning(true);
    setTrades([]);
    
    const strategy = strategies[selectedStrategy];
    let tradeCount = 0;
    
    const interval = setInterval(() => {
      const isWin = Math.random() < strategy.winRate / 100;
      const profit = isWin 
        ? strategy.avgTrade * (0.5 + Math.random()) 
        : -strategy.avgTrade * (0.3 + Math.random() * 0.5);
      
      setTrades(prev => [...prev, { 
        profit: parseFloat(profit.toFixed(2)), 
        time: new Date().toLocaleTimeString() 
      }]);
      
      tradeCount++;
      if (tradeCount >= 10) {
        clearInterval(interval);
        setIsRunning(false);
      }
    }, 500);
  };

  const totalPnL = trades.reduce((sum, t) => sum + t.profit, 0);

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          Algorithmic Trading Simulator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-2">
          {strategies.map((s, idx) => (
            <button
              key={s.name}
              onClick={() => !isRunning && setSelectedStrategy(idx)}
              disabled={isRunning}
              className={`p-3 rounded-lg text-left transition-all ${
                selectedStrategy === idx ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
              } ${isRunning ? "opacity-50" : ""}`}
            >
              <p className="font-medium text-sm">{s.name}</p>
              <div className="flex gap-2 mt-1">
                <Badge variant="outline" className="text-xs">{s.type}</Badge>
                <span className="text-xs opacity-80">{s.winRate}% win</span>
              </div>
            </button>
          ))}
        </div>

        <Button onClick={runBacktest} disabled={isRunning} className="w-full">
          {isRunning ? (
            <><Pause className="h-4 w-4 mr-2" /> Running Backtest...</>
          ) : (
            <><Play className="h-4 w-4 mr-2" /> Run Backtest Simulation</>
          )}
        </Button>

        {trades.length > 0 && (
          <Card className="bg-muted/50">
            <CardContent className="pt-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-semibold">Trade Results</h4>
                <Badge variant={totalPnL >= 0 ? "default" : "destructive"}>
                  P/L: {totalPnL >= 0 ? "+" : ""}{totalPnL.toFixed(2)}%
                </Badge>
              </div>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {trades.map((trade, idx) => (
                  <div key={idx} className="flex justify-between text-sm p-2 rounded bg-background">
                    <span className="text-muted-foreground">Trade #{idx + 1}</span>
                    <span className={trade.profit >= 0 ? "text-green-500" : "text-red-500"}>
                      {trade.profit >= 0 ? "+" : ""}{trade.profit}%
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-3 gap-2 text-center text-sm">
          <div className="p-3 bg-muted/50 rounded-lg">
            <Zap className="h-5 w-5 mx-auto mb-1 text-yellow-500" />
            <p className="font-bold">{trades.length}</p>
            <p className="text-xs text-muted-foreground">Trades</p>
          </div>
          <div className="p-3 bg-muted/50 rounded-lg">
            <TrendingUp className="h-5 w-5 mx-auto mb-1 text-green-500" />
            <p className="font-bold">{trades.filter(t => t.profit > 0).length}</p>
            <p className="text-xs text-muted-foreground">Winners</p>
          </div>
          <div className="p-3 bg-muted/50 rounded-lg">
            <TrendingDown className="h-5 w-5 mx-auto mb-1 text-red-500" />
            <p className="font-bold">{trades.filter(t => t.profit < 0).length}</p>
            <p className="text-xs text-muted-foreground">Losers</p>
          </div>
        </div>

        <div className="p-3 bg-primary/10 rounded-lg">
          <p className="text-sm"><strong>💡 Key Insight:</strong> Algorithmic trading removes emotion from decisions but requires rigorous backtesting. A 52% win rate can be profitable with proper risk management and positive expectancy.</p>
        </div>
      </CardContent>
    </Card>
  );
};

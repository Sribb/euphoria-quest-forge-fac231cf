import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Activity,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Zap,
  RotateCcw,
  Sparkles,
  Target
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { formatDollar } from "@/lib/formatters";

interface MarketData {
  time: string;
  price: number;
  volume: number;
  sentiment: number;
}

interface LiveMarketSimulationProps {
  scenario: any;
  action: any;
  isActive: boolean;
  onReset: () => void;
}

export const LiveMarketSimulation = ({ scenario, action, isActive, onReset }: LiveMarketSimulationProps) => {
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [currentPrice, setCurrentPrice] = useState(150);
  const [entryPrice, setEntryPrice] = useState(150);
  const [profitLoss, setProfitLoss] = useState(0);
  const [sentiment, setSentiment] = useState(50);
  const [volatility, setVolatility] = useState(scenario?.volatility || 0.3);
  const [tick, setTick] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  // Initialize simulation
  useEffect(() => {
    if (isActive && action) {
      const basePrice = 150;
      setCurrentPrice(basePrice);
      setEntryPrice(basePrice);
      setIsRunning(true);
      
      // Initialize with some historical data
      const initialData: MarketData[] = [];
      for (let i = 0; i < 10; i++) {
        initialData.push({
          time: `${i}s`,
          price: basePrice + (Math.random() - 0.5) * 2,
          volume: Math.random() * 10000,
          sentiment: 50 + (Math.random() - 0.5) * 20,
        });
      }
      setMarketData(initialData);
      setTick(0);
    }
  }, [isActive, action]);

  // Real-time market simulation engine
  const simulateMarketTick = useCallback(() => {
    if (!isActive || !action) return;

    setTick(prev => prev + 1);

    // Calculate price movement based on scenario and action
    const scenarioImpact = scenario.type === "rally" ? 0.02 : scenario.type === "dip" ? -0.02 : 0;
    const actionImpact = action.type === "buy" ? 0.01 : action.type === "sell" ? -0.01 : 0;
    const randomWalk = (Math.random() - 0.5) * volatility;
    const priceChange = scenarioImpact + actionImpact + randomWalk;

    setCurrentPrice(prev => {
      const newPrice = prev * (1 + priceChange);
      return Math.max(newPrice, 1); // Prevent negative prices
    });

    // Update sentiment based on price movement and action
    setSentiment(prev => {
      const sentimentChange = priceChange * 100 + (Math.random() - 0.5) * 5;
      return Math.max(0, Math.min(100, prev + sentimentChange));
    });

    // Add new data point
    setMarketData(prev => {
      const newData = [...prev];
      if (newData.length > 50) newData.shift(); // Keep last 50 points
      
      newData.push({
        time: `${tick}s`,
        price: currentPrice,
        volume: Math.random() * 10000,
        sentiment,
      });
      
      return newData;
    });
  }, [isActive, action, scenario, volatility, tick, currentPrice, sentiment]);

  // Calculate P&L
  useEffect(() => {
    if (action) {
      const priceDiff = currentPrice - entryPrice;
      const multiplier = action.type === "sell" ? -1 : 1;
      const leverage = action.leverage || 1;
      const pl = priceDiff * action.quantity * multiplier * leverage;
      setProfitLoss(pl);
    }
  }, [currentPrice, entryPrice, action]);

  // Simulation loop
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      simulateMarketTick();
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, [isRunning, simulateMarketTick]);

  const isProfitable = profitLoss > 0;
  const priceChangePercent = ((currentPrice - entryPrice) / entryPrice) * 100;

  return (
    <div className="space-y-4">
      {/* Live Performance Header */}
      <Card className={`p-6 border-2 ${isProfitable ? 'border-success/50 bg-success/5' : 'border-destructive/50 bg-destructive/5'}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Activity className={`w-8 h-8 ${isProfitable ? 'text-success' : 'text-destructive'}`} />
              <Sparkles className="w-4 h-4 text-primary absolute -top-1 -right-1 animate-pulse" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Live Market Simulation</h3>
              <p className="text-sm text-muted-foreground">
                Real-time response to {action?.type} action on {action?.symbol}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            className="hover:bg-destructive/10 hover:border-destructive"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div className="p-4 rounded-lg bg-background border">
            <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
              <DollarSign className="w-3 h-3" />
              Current Price
            </div>
            <div className="text-2xl font-bold flex items-center gap-2">
              {formatDollar(currentPrice, 2)}
              {priceChangePercent !== 0 && (
                <Badge variant={isProfitable ? "default" : "destructive"} className="text-xs">
                  {priceChangePercent > 0 ? "+" : ""}{priceChangePercent.toFixed(2)}%
                </Badge>
              )}
            </div>
          </div>

          <div className="p-4 rounded-lg bg-background border">
            <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
              <Target className="w-3 h-3" />
              Entry Price
            </div>
            <div className="text-2xl font-bold">
              {formatDollar(entryPrice, 2)}
            </div>
          </div>

          <div className="p-4 rounded-lg bg-background border">
            <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
              {isProfitable ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              Profit/Loss
            </div>
            <div className={`text-2xl font-bold ${isProfitable ? 'text-success' : 'text-destructive'}`}>
              {isProfitable ? "+" : ""}{formatDollar(profitLoss, 2)}
            </div>
          </div>

          <div className="p-4 rounded-lg bg-background border">
            <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
              <Activity className="w-3 h-3" />
              Position Size
            </div>
            <div className="text-2xl font-bold">
              {action?.quantity || 0}
            </div>
          </div>
        </div>
      </Card>

      {/* Live Price Chart */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-bold flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Live Price Movement
          </h4>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-sm text-muted-foreground">Live</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={marketData}>
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="time" className="text-xs" />
            <YAxis className="text-xs" domain={['auto', 'auto']} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke="hsl(var(--primary))"
              fillOpacity={1}
              fill="url(#priceGradient)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Market Sentiment & Volatility */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-6">
          <h4 className="font-bold mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Market Sentiment
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Current</span>
              <Badge variant={sentiment > 50 ? "default" : "destructive"}>
                {sentiment.toFixed(0)}%
              </Badge>
            </div>
            <Progress value={sentiment} className="h-3" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Bearish</span>
              <span>Neutral</span>
              <span>Bullish</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h4 className="font-bold mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Volatility Index
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Current</span>
              <Badge variant="outline">
                {(volatility * 100).toFixed(0)}%
              </Badge>
            </div>
            <Progress value={volatility * 100} className="h-3 [&>div]:bg-warning" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Low</span>
              <span>Medium</span>
              <span>High</span>
            </div>
          </div>
        </Card>
      </div>

      {/* AI Commentary */}
      <Card className="p-6 bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-primary animate-pulse" />
          <div className="flex-1">
            <h4 className="font-bold mb-2">AI Market Commentary</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {isProfitable ? (
                <>Your {action.type} position on {action.symbol} is performing well. Market sentiment is {sentiment > 60 ? "strongly positive" : "moderately positive"}, and price momentum suggests continued {priceChangePercent > 0 ? "upward" : "stabilization"} movement. Current volatility is {volatility > 0.4 ? "elevated" : "normal"}, indicating {volatility > 0.4 ? "higher risk but greater opportunity" : "steady market conditions"}.</>
              ) : (
                <>Your {action.type} position on {action.symbol} is experiencing headwinds. Market sentiment has shifted {sentiment < 40 ? "bearish" : "neutral"}, with {priceChangePercent < 0 ? "downward" : "sideways"} pressure. Consider {Math.abs(profitLoss) > (entryPrice * action.quantity * 0.05) ? "exiting or hedging your position" : "holding for potential recovery"} based on your risk tolerance.</>
              )}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

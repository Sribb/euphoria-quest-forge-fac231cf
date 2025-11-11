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
  Target,
  Brain,
  AlertTriangle
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
  const [aiCommentary, setAiCommentary] = useState<string[]>([]);
  const [marketEvents, setMarketEvents] = useState<string[]>([]);

  // Generate realistic base price from action symbol
  const getBasePrice = useCallback(() => {
    const basePrices: Record<string, number> = {
      'AAPL': 180, 'GOOGL': 140, 'MSFT': 380, 'AMZN': 145,
      'TSLA': 250, 'NVDA': 495, 'META': 350, 'NFLX': 450,
      'JPM': 145, 'V': 245
    };
    return basePrices[action?.symbol] || 150;
  }, [action?.symbol]);

  // Initialize simulation
  useEffect(() => {
    if (isActive && action) {
      const basePrice = getBasePrice();
      const entry = basePrice * (0.95 + Math.random() * 0.1);
      setCurrentPrice(entry);
      setEntryPrice(entry);
      setIsRunning(true);
      
      // Initialize with historical data
      const initialData: MarketData[] = [];
      for (let i = 0; i < 10; i++) {
        initialData.push({
          time: `${i}s`,
          price: entry + (Math.random() - 0.5) * entry * 0.02,
          volume: Math.floor(Math.random() * 1000000),
          sentiment: 50 + (Math.random() - 0.5) * 20,
        });
      }
      setMarketData(initialData);
      setTick(0);

      // Initial AI commentary
      setAiCommentary([
        `🎯 ${action.type.toUpperCase()} trade executed: ${action.quantity} ${action.symbol} @ $${entry.toFixed(2)}`,
        `📊 Scenario: ${scenario?.title || 'Market simulation'} (${scenario?.severity || 'medium'} impact)`,
        `⚡ Market opened with ${scenario?.type || 'normal'} conditions`
      ]);

      setMarketEvents([
        `Trade initiated at ${new Date().toLocaleTimeString()}`,
        `Initial sentiment: ${sentiment > 50 ? 'Bullish 🚀' : 'Bearish 📉'}`
      ]);
    }
  }, [isActive, action, getBasePrice, scenario, sentiment]);

  // Real-time market simulation engine with randomized realistic data
  const simulateMarketTick = useCallback(() => {
    if (!isActive || !action) return;

    setTick(prev => prev + 1);

    // Scenario-based price movement
    let trendMultiplier = 1;
    let volatilityMultiplier = 1;

    switch (scenario?.type) {
      case 'rally':
        trendMultiplier = 1.002;
        volatilityMultiplier = 0.7;
        break;
      case 'dip':
        trendMultiplier = 0.998;
        volatilityMultiplier = 1.3;
        break;
      case 'sideways':
        trendMultiplier = 1;
        volatilityMultiplier = 0.5;
        break;
      case 'sector_surge':
        trendMultiplier = 1.003;
        volatilityMultiplier = 0.9;
        break;
      case 'geopolitical':
        trendMultiplier = 0.997;
        volatilityMultiplier = 1.8;
        break;
      default:
        trendMultiplier = 1;
        volatilityMultiplier = 1;
    }

    // Severity impact
    const severityImpact = scenario?.severity === 'high' ? 1.5 : scenario?.severity === 'low' ? 0.5 : 1;
    volatilityMultiplier *= severityImpact;

    // Calculate realistic price movement
    const randomWalk = (Math.random() - 0.5) * volatility * volatilityMultiplier;
    const trend = (trendMultiplier - 1);
    const momentum = Math.sin(tick * 0.15) * volatility * 0.3; // Wave pattern
    const actionImpact = action.type === "buy" ? 0.0005 : action.type === "sell" ? -0.0005 : 0;

    setCurrentPrice(prev => {
      const priceChange = prev * (randomWalk + trend + momentum + actionImpact);
      const newPrice = prev + priceChange;
      return Math.max(newPrice, getBasePrice() * 0.7); // Floor at 70% of base
    });

    // Update sentiment dynamically
    setSentiment(prev => {
      const priceChangePercent = ((currentPrice - entryPrice) / entryPrice) * 100;
      const targetSentiment = 50 + priceChangePercent * 2 + (Math.random() - 0.5) * 10;
      const newSentiment = prev + (targetSentiment - prev) * 0.15;
      return Math.max(0, Math.min(100, newSentiment));
    });

    // Update volatility
    setVolatility(prev => {
      const targetVolatility = (scenario?.volatility || 0.3) * volatilityMultiplier * (0.8 + Math.random() * 0.4);
      return prev + (targetVolatility - prev) * 0.1;
    });

    // Add new data point
    setMarketData(prev => {
      const newData = [...prev];
      if (newData.length > 60) newData.shift(); // Keep last 60 ticks
      
      newData.push({
        time: `${tick}s`,
        price: currentPrice,
        volume: Math.floor(500000 + Math.random() * 1500000),
        sentiment,
      });
      
      return newData;
    });

    // AI Commentary every 8 ticks
    if (tick % 8 === 0) {
      const changePercent = ((currentPrice - entryPrice) / entryPrice * 100).toFixed(2);
      const comments = [
        `💹 ${action.symbol} ${currentPrice > entryPrice ? 'up' : 'down'} ${Math.abs(parseFloat(changePercent))}% → $${currentPrice.toFixed(2)}`,
        sentiment > 65 ? '🚀 Strong bullish momentum detected' : sentiment < 35 ? '📉 Bearish pressure increasing' : '⚖️ Market in equilibrium',
        volatility > 0.5 ? '⚠️ High volatility - increased risk' : '😌 Stable market conditions',
        profitLoss > 100 ? `✅ Profitable position +$${profitLoss.toFixed(2)}` : profitLoss < -100 ? `❌ Unrealized loss -$${Math.abs(profitLoss).toFixed(2)}` : `➡️ Neutral P&L $${profitLoss.toFixed(2)}`
      ];
      setAiCommentary(prev => [...prev, comments[Math.floor(Math.random() * comments.length)]].slice(-6));
    }

    // Market events every 12-18 ticks
    if (tick % 15 === 0 && Math.random() > 0.4) {
      const events = [
        '📰 Breaking: Institutional trading volume spike',
        '🏢 Major player adjusting positions',
        '📊 Cross-sector correlation strengthening',
        '🌐 Global market dynamics shifting',
        '💼 Options activity increasing rapidly',
        '🎯 Key support/resistance levels tested',
        '📈 Technical indicators showing momentum',
        '⚡ High-frequency trading detected'
      ];
      setMarketEvents(prev => [...prev, events[Math.floor(Math.random() * events.length)]].slice(-5));
    }
  }, [isActive, action, scenario, volatility, tick, currentPrice, entryPrice, sentiment, profitLoss, getBasePrice]);

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

  // Simulation loop - 800ms for smooth updates
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      simulateMarketTick();
    }, 800);

    return () => clearInterval(interval);
  }, [isRunning, simulateMarketTick]);

  const isProfitable = profitLoss > 0;
  const priceChangePercent = ((currentPrice - entryPrice) / entryPrice) * 100;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Live Performance Header */}
      <Card className={`p-6 border-2 shadow-2xl transition-all duration-300 ${
        isProfitable 
          ? 'border-success/50 bg-success/5' 
          : profitLoss < 0 
            ? 'border-destructive/50 bg-destructive/5' 
            : 'border-primary/30 bg-primary/5'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Activity className={`w-8 h-8 ${isProfitable ? 'text-success' : profitLoss < 0 ? 'text-destructive' : 'text-primary'} animate-pulse`} />
              <Sparkles className="w-4 h-4 text-primary absolute -top-1 -right-1 animate-pulse" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">Live Market Simulation</h3>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                {action?.type?.toUpperCase()} position on {action?.symbol}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            className="hover:bg-destructive/10 hover:border-destructive transition-all hover:scale-105"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Exit Simulation
          </Button>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div className="p-4 rounded-lg bg-background border hover:shadow-lg transition-shadow">
            <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
              <DollarSign className="w-3 h-3" />
              Current Price
            </div>
            <div className="text-2xl font-bold flex items-center gap-2">
              {formatDollar(currentPrice, 2)}
              {priceChangePercent !== 0 && (
                <Badge variant={isProfitable ? "default" : "destructive"} className="text-xs animate-pulse">
                  {priceChangePercent > 0 ? "+" : ""}{priceChangePercent.toFixed(2)}%
                </Badge>
              )}
            </div>
          </div>

          <div className="p-4 rounded-lg bg-background border hover:shadow-lg transition-shadow">
            <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
              <Target className="w-3 h-3" />
              Entry Price
            </div>
            <div className="text-2xl font-bold">
              {formatDollar(entryPrice, 2)}
            </div>
          </div>

          <div className="p-4 rounded-lg bg-background border hover:shadow-lg transition-shadow">
            <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
              {isProfitable ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              Profit/Loss
            </div>
            <div className={`text-2xl font-bold ${isProfitable ? 'text-success' : 'text-destructive'}`}>
              {isProfitable ? "+" : ""}{formatDollar(profitLoss, 2)}
            </div>
          </div>

          <div className="p-4 rounded-lg bg-background border hover:shadow-lg transition-shadow">
            <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
              <Activity className="w-3 h-3" />
              Position
            </div>
            <div className="text-2xl font-bold">
              {action?.quantity || 0}
              <span className="text-sm text-muted-foreground ml-2">{action?.leverage ? `${action.leverage}x` : ''}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Live Price Chart */}
      <Card className="p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-bold flex items-center gap-2 text-lg">
            <TrendingUp className="w-5 h-5 text-primary" />
            Live Price Movement
          </h4>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-success animate-ping" />
            <span className="text-sm text-muted-foreground font-semibold">LIVE</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={marketData}>
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={isProfitable ? "hsl(var(--success))" : "hsl(var(--destructive))"} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={isProfitable ? "hsl(var(--success))" : "hsl(var(--destructive))"} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted opacity-30" />
            <XAxis dataKey="time" className="text-xs" stroke="hsl(var(--muted-foreground))" />
            <YAxis className="text-xs" domain={['auto', 'auto']} stroke="hsl(var(--muted-foreground))" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '2px solid hsl(var(--primary))',
                borderRadius: '12px',
                padding: '12px'
              }}
              formatter={(value: any) => [`$${value.toFixed(2)}`, 'Price']}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke={isProfitable ? "hsl(var(--success))" : "hsl(var(--destructive))"}
              fillOpacity={1}
              fill="url(#priceGradient)"
              strokeWidth={3}
              animationDuration={300}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Market Metrics & AI Commentary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sentiment & Volatility */}
        <div className="space-y-4">
          <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow">
            <h4 className="font-bold mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Market Sentiment
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Current</span>
                <Badge variant={sentiment > 60 ? "default" : sentiment < 40 ? "destructive" : "secondary"}>
                  {sentiment.toFixed(0)}%
                </Badge>
              </div>
              <Progress value={sentiment} className="h-3" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Bearish 📉</span>
                <span>Neutral ⚖️</span>
                <span>Bullish 🚀</span>
              </div>
            </div>
          </Card>

          <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow">
            <h4 className="font-bold mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-warning" />
              Volatility Index
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Current</span>
                <Badge variant={volatility > 0.5 ? "destructive" : volatility < 0.2 ? "default" : "secondary"}>
                  {(volatility * 100).toFixed(0)}%
                </Badge>
              </div>
              <Progress value={volatility * 100} className="h-3 [&>div]:bg-warning" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Low 😌</span>
                <span>Medium 📊</span>
                <span>High ⚠️</span>
              </div>
            </div>
          </Card>
        </div>

        {/* AI Commentary & Events */}
        <div className="space-y-4">
          <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow">
            <h4 className="font-bold mb-4 flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary animate-pulse" />
              AI Live Analysis
            </h4>
            <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
              {aiCommentary.map((comment, index) => (
                <div 
                  key={index}
                  className="p-3 bg-primary/5 border border-primary/20 rounded-lg text-sm hover:scale-[1.02] transition-transform animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {comment}
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow">
            <h4 className="font-bold mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-accent" />
              Market Events
            </h4>
            <div className="space-y-2 max-h-32 overflow-y-auto custom-scrollbar">
              {marketEvents.map((event, index) => (
                <div 
                  key={index}
                  className="p-2 bg-accent/5 border border-accent/20 rounded text-xs hover:bg-accent/10 transition-colors animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {event}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
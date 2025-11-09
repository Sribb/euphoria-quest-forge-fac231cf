import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Play, TrendingUp, BarChart3, Activity } from "lucide-react";
import { usePortfolioValue } from "@/hooks/usePortfolioValue";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

type Timeframe = "1D" | "1W" | "1M" | "3M" | "YTD" | "1Y" | "Scenario";

export const PortfolioSimulationGraph = () => {
  const { totalValue } = usePortfolioValue();
  const [timeframe, setTimeframe] = useState<Timeframe>("1M");
  const [scenarioInput, setScenarioInput] = useState("");
  const [showVolatility, setShowVolatility] = useState(true);
  const [showVolume, setShowVolume] = useState(false);
  const [showAIForecast, setShowAIForecast] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  // Generate mock portfolio data
  const generateData = () => {
    const baseValue = 10000;
    const dataPoints = timeframe === "1D" ? 24 : timeframe === "1W" ? 7 : 30;
    return Array.from({ length: dataPoints }, (_, i) => {
      const variance = (Math.random() - 0.5) * 500;
      const trend = i * 15;
      return {
        time: timeframe === "1D" ? `${i}:00` : `Day ${i + 1}`,
        value: baseValue + trend + variance,
        upper: baseValue + trend + variance + 300,
        lower: baseValue + trend + variance - 300,
        forecast: showAIForecast ? baseValue + trend + variance + 200 : null,
        volume: Math.random() * 1000000,
      };
    });
  };

  const data = generateData();

  const handleScenarioSubmit = () => {
    if (!scenarioInput.trim()) return;
    setIsSimulating(true);
    // Simulate processing
    setTimeout(() => {
      setIsSimulating(false);
      setTimeframe("Scenario");
    }, 1500);
  };

  const timeframes: Timeframe[] = ["1D", "1W", "1M", "3M", "YTD", "1Y", "Scenario"];

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* Header */}
      <Card className="p-4 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold mb-1">Portfolio Simulation</h2>
            <p className="text-sm text-muted-foreground">Interactive market scenario modeling</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold glow-text">${totalValue.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Current Value</div>
          </div>
        </div>
      </Card>

      {/* Timeframe Selector */}
      <div className="flex items-center gap-2">
        {timeframes.map((tf) => (
          <Button
            key={tf}
            variant={timeframe === tf ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeframe(tf)}
            className={`transition-all ${
              timeframe === tf 
                ? "bg-primary shadow-lg shadow-primary/50" 
                : "hover:bg-primary/10"
            }`}
          >
            {tf}
          </Button>
        ))}
      </div>

      {/* Overlay Toggles */}
      <Card className="p-3 bg-card/50 border-border/50">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Switch
              id="volatility"
              checked={showVolatility}
              onCheckedChange={setShowVolatility}
            />
            <Label htmlFor="volatility" className="text-sm cursor-pointer">
              Volatility Bands
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              id="volume"
              checked={showVolume}
              onCheckedChange={setShowVolume}
            />
            <Label htmlFor="volume" className="text-sm cursor-pointer">
              Volume
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              id="ai-forecast"
              checked={showAIForecast}
              onCheckedChange={setShowAIForecast}
            />
            <Label htmlFor="ai-forecast" className="text-sm cursor-pointer flex items-center gap-1">
              <Activity className="w-3 h-3 text-primary" />
              AI Forecast Path
            </Label>
          </div>
        </div>
      </Card>

      {/* Chart */}
      <Card className="flex-1 p-6 bg-card/50 border-border/50">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="forecastGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis 
              dataKey="time" 
              stroke="hsl(var(--muted-foreground))"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              style={{ fontSize: '12px' }}
              tickFormatter={(value) => `$${(value / 1000).toFixed(1)}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              }}
              formatter={(value: any) => [`$${value.toFixed(2)}`, '']}
            />
            
            {showVolatility && (
              <>
                <Area
                  type="monotone"
                  dataKey="upper"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.1}
                  strokeWidth={1}
                  strokeDasharray="3 3"
                />
                <Area
                  type="monotone"
                  dataKey="lower"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.1}
                  strokeWidth={1}
                  strokeDasharray="3 3"
                />
              </>
            )}
            
            <Area
              type="monotone"
              dataKey="value"
              stroke="hsl(var(--primary))"
              strokeWidth={3}
              fill="url(#portfolioGradient)"
            />

            {showAIForecast && (
              <Line
                type="monotone"
                dataKey="forecast"
                stroke="hsl(var(--accent))"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Scenario Input */}
      <Card className="p-4 bg-gradient-to-r from-accent/10 to-primary/10 border-accent/20">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Input
              placeholder="Type a scenario... e.g., 'Simulate a 10% oil price surge' or 'Show how rate cuts affect biotech'"
              value={scenarioInput}
              onChange={(e) => setScenarioInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleScenarioSubmit()}
              className="bg-background/50 border-border/50 pr-10"
            />
            <TrendingUp className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          </div>
          <Button
            onClick={handleScenarioSubmit}
            disabled={!scenarioInput.trim() || isSimulating}
            className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30"
          >
            {isSimulating ? (
              <>
                <Activity className="w-4 h-4 mr-2 animate-spin" />
                Simulating...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Run Scenario
              </>
            )}
          </Button>
        </div>
        {timeframe === "Scenario" && (
          <div className="mt-3 flex items-center gap-2">
            <Badge variant="outline" className="text-accent border-accent/50">
              Active Scenario
            </Badge>
            <span className="text-sm text-muted-foreground">{scenarioInput}</span>
          </div>
        )}
      </Card>
    </div>
  );
};

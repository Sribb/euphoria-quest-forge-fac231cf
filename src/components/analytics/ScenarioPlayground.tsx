import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, AlertTriangle, Zap, RefreshCw, Target, Shield, Activity } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { Badge } from "@/components/ui/badge";

interface Scenario {
  id: string;
  title: string;
  description: string;
  type: "bullish" | "bearish" | "neutral" | "volatile";
  risk: "low" | "medium" | "high";
  impact: string;
  data: Array<{ month: string; value: number }>;
  metrics: {
    expectedReturn: string;
    volatility: string;
    confidence: string;
  };
}

const scenarios: Scenario[] = [
  {
    id: "tech-rally",
    title: "Tech Sector Rally",
    description: "Strong earnings reports boost tech stocks, driving portfolio growth.",
    type: "bullish",
    risk: "medium",
    impact: "+8.5% portfolio increase",
    data: [
      { month: "Jan", value: 10000 },
      { month: "Feb", value: 10300 },
      { month: "Mar", value: 10600 },
      { month: "Apr", value: 10850 },
    ],
    metrics: {
      expectedReturn: "+12-15%",
      volatility: "18%",
      confidence: "High",
    },
  },
  {
    id: "market-correction",
    title: "Market Correction",
    description: "Broad market pullback creates buying opportunities for long-term investors.",
    type: "bearish",
    risk: "high",
    impact: "-6.2% portfolio decrease",
    data: [
      { month: "Jan", value: 10000 },
      { month: "Feb", value: 9700 },
      { month: "Mar", value: 9500 },
      { month: "Apr", value: 9380 },
    ],
    metrics: {
      expectedReturn: "-8 to -5%",
      volatility: "25%",
      confidence: "Medium",
    },
  },
  {
    id: "sector-rotation",
    title: "Sector Rotation Event",
    description: "Capital flows from growth to value stocks as interest rates stabilize.",
    type: "neutral",
    risk: "low",
    impact: "+2.1% rebalancing gain",
    data: [
      { month: "Jan", value: 10000 },
      { month: "Feb", value: 10100 },
      { month: "Mar", value: 10050 },
      { month: "Apr", value: 10210 },
    ],
    metrics: {
      expectedReturn: "+3-5%",
      volatility: "12%",
      confidence: "High",
    },
  },
  {
    id: "high-volatility",
    title: "High Volatility Period",
    description: "Geopolitical tensions create uncertainty, increasing market swings.",
    type: "volatile",
    risk: "high",
    impact: "±15% potential swing",
    data: [
      { month: "Jan", value: 10000 },
      { month: "Feb", value: 10500 },
      { month: "Mar", value: 9800 },
      { month: "Apr", value: 10300 },
    ],
    metrics: {
      expectedReturn: "-5 to +10%",
      volatility: "35%",
      confidence: "Low",
    },
  },
];

export const ScenarioPlayground = () => {
  const [selectedScenario, setSelectedScenario] = useState<Scenario>(scenarios[0]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      const randomScenario = scenarios[Math.floor(Math.random() * scenarios.length)];
      setSelectedScenario(randomScenario);
      setIsRefreshing(false);
    }, 800);
  };

  const getTypeIcon = (type: Scenario["type"]) => {
    switch (type) {
      case "bullish":
        return <TrendingUp className="w-4 h-4" />;
      case "bearish":
        return <TrendingDown className="w-4 h-4" />;
      case "volatile":
        return <Zap className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: Scenario["type"]) => {
    switch (type) {
      case "bullish":
        return "hsl(142, 76%, 45%)";
      case "bearish":
        return "hsl(0, 84%, 60%)";
      case "volatile":
        return "hsl(48, 96%, 53%)";
      default:
        return "hsl(var(--primary))";
    }
  };

  const getRiskBadge = (risk: Scenario["risk"]) => {
    const colors = {
      low: "bg-success/20 text-success border-success/30",
      medium: "bg-warning/20 text-warning border-warning/30",
      high: "bg-destructive/20 text-destructive border-destructive/30",
    };
    return colors[risk];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Target className="w-6 h-6 text-primary animate-pulse" />
            Scenario Playground
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Explore realistic portfolio scenarios and market events
          </p>
        </div>
        <Button
          onClick={handleRefresh}
          disabled={isRefreshing}
          variant="outline"
          className="gap-2 hover-scale"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
          New Scenario
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {scenarios.map((scenario) => (
          <Card
            key={scenario.id}
            className={`p-4 cursor-pointer transition-all hover-scale ${
              selectedScenario.id === scenario.id
                ? "border-primary shadow-glow bg-gradient-primary/5"
                : "hover:border-primary/50"
            }`}
            onClick={() => setSelectedScenario(scenario)}
          >
            <div className="flex items-start gap-2 mb-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${getTypeColor(scenario.type)}20`, color: getTypeColor(scenario.type) }}
              >
                {getTypeIcon(scenario.type)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm truncate">{scenario.title}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                  {scenario.description}
                </p>
              </div>
            </div>
            <Badge variant="outline" className={`text-xs ${getRiskBadge(scenario.risk)}`}>
              {scenario.risk.toUpperCase()} RISK
            </Badge>
          </Card>
        ))}
      </div>

      <Card className="p-6 animate-fade-in border-primary/20 shadow-glow">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center animate-pulse"
              style={{ backgroundColor: `${getTypeColor(selectedScenario.type)}20`, color: getTypeColor(selectedScenario.type) }}
            >
              {getTypeIcon(selectedScenario.type)}
            </div>
            <div>
              <h3 className="text-xl font-bold">{selectedScenario.title}</h3>
              <p className="text-sm text-muted-foreground">{selectedScenario.description}</p>
            </div>
          </div>
          <Badge
            variant="outline"
            className={`text-xs ${getRiskBadge(selectedScenario.risk)}`}
          >
            <Shield className="w-3 h-3 mr-1" />
            {selectedScenario.risk.toUpperCase()} RISK
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <Card className="p-4 bg-gradient-primary/10 border-primary/20 hover-scale">
            <p className="text-xs text-muted-foreground mb-1">Expected Return</p>
            <p className="text-2xl font-bold text-primary">{selectedScenario.metrics.expectedReturn}</p>
          </Card>
          <Card className="p-4 bg-gradient-accent/10 border-accent/20 hover-scale">
            <p className="text-xs text-muted-foreground mb-1">Volatility</p>
            <p className="text-2xl font-bold text-accent">{selectedScenario.metrics.volatility}</p>
          </Card>
          <Card className="p-4 bg-gradient-success/10 border-success/20 hover-scale">
            <p className="text-xs text-muted-foreground mb-1">Confidence</p>
            <p className="text-2xl font-bold text-success">{selectedScenario.metrics.confidence}</p>
          </Card>
        </div>

        <div className="relative">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={selectedScenario.data}>
              <defs>
                <linearGradient id="scenarioGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={getTypeColor(selectedScenario.type)} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={getTypeColor(selectedScenario.type)} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis
                dataKey="month"
                stroke="hsl(var(--muted-foreground))"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
                domain={["dataMin - 500", "dataMax + 500"]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke={getTypeColor(selectedScenario.type)}
                strokeWidth={3}
                fill="url(#scenarioGradient)"
                animationDuration={800}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-6 p-4 bg-muted/30 rounded-lg border border-border">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-warning" />
            <span className="text-sm font-semibold">Scenario Impact</span>
          </div>
          <p className="text-sm text-muted-foreground">
            {selectedScenario.impact}
          </p>
        </div>

        <div className="mt-4 flex gap-3">
          <Button className="flex-1 bg-gradient-primary hover-scale">
            Test Prediction
          </Button>
          <Button variant="outline" className="flex-1 hover-scale">
            Simulate Adjustment
          </Button>
        </div>
      </Card>
    </div>
  );
};

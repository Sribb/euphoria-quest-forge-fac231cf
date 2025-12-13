import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus, AlertTriangle } from "lucide-react";

const strategies = [
  {
    name: "Iron Condor",
    outlook: "Neutral",
    maxProfit: "Limited (premium received)",
    maxLoss: "Limited",
    description: "Sell OTM put spread + OTM call spread. Profits when stock stays in range.",
    risk: "Medium",
  },
  {
    name: "Straddle",
    outlook: "High Volatility",
    maxProfit: "Unlimited",
    maxLoss: "Limited (premium paid)",
    description: "Buy ATM call + ATM put. Profits from large moves in either direction.",
    risk: "High",
  },
  {
    name: "Bull Call Spread",
    outlook: "Bullish",
    maxProfit: "Limited",
    maxLoss: "Limited",
    description: "Buy call + sell higher strike call. Lower cost bullish bet.",
    risk: "Low",
  },
  {
    name: "Protective Collar",
    outlook: "Hedging",
    maxProfit: "Limited",
    maxLoss: "Limited",
    description: "Own stock + buy put + sell call. Protects downside, caps upside.",
    risk: "Low",
  },
];

export const AdvancedOptionsStrategies = () => {
  const [selected, setSelected] = useState(0);
  const strategy = strategies[selected];

  const getOutlookIcon = (outlook: string) => {
    if (outlook === "Bullish") return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (outlook === "Neutral" || outlook === "Hedging") return <Minus className="h-4 w-4 text-yellow-500" />;
    return <AlertTriangle className="h-4 w-4 text-orange-500" />;
  };

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Advanced Options Strategies
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-2">
          {strategies.map((s, idx) => (
            <button
              key={s.name}
              onClick={() => setSelected(idx)}
              className={`p-3 rounded-lg text-left transition-all ${
                selected === idx ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
              }`}
            >
              <p className="font-medium">{s.name}</p>
              <p className="text-xs opacity-80">{s.outlook}</p>
            </button>
          ))}
        </div>

        <Card className="bg-muted/50">
          <CardContent className="pt-4 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-lg">{strategy.name}</h4>
              <div className="flex items-center gap-2">
                {getOutlookIcon(strategy.outlook)}
                <Badge variant={strategy.risk === "Low" ? "secondary" : strategy.risk === "Medium" ? "default" : "destructive"}>
                  {strategy.risk} Risk
                </Badge>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground">{strategy.description}</p>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="p-3 bg-green-500/10 rounded-lg">
                <p className="text-muted-foreground">Max Profit</p>
                <p className="font-semibold text-green-500">{strategy.maxProfit}</p>
              </div>
              <div className="p-3 bg-red-500/10 rounded-lg">
                <p className="text-muted-foreground">Max Loss</p>
                <p className="font-semibold text-red-500">{strategy.maxLoss}</p>
              </div>
            </div>

            <div className="h-24 bg-background rounded-lg flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <TrendingUp className="h-8 w-8 mx-auto mb-1 opacity-50" />
                <p className="text-xs">P/L Diagram Visualization</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="p-3 bg-primary/10 rounded-lg">
          <p className="text-sm"><strong>💡 Key Insight:</strong> Multi-leg options strategies allow you to precisely define your risk/reward profile. Iron condors profit from low volatility, while straddles profit from high volatility—opposite bets on market movement.</p>
        </div>
      </CardContent>
    </Card>
  );
};

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Shield, Zap, Target } from "lucide-react";

const strategies = [
  { name: "Long/Short Equity", description: "Buy undervalued stocks, short overvalued ones", returns: "8-15%", risk: "Medium" },
  { name: "Global Macro", description: "Bet on economic trends across countries", returns: "10-20%", risk: "High" },
  { name: "Event-Driven", description: "Profit from mergers, bankruptcies, spinoffs", returns: "8-12%", risk: "Medium" },
  { name: "Quantitative", description: "Algorithm-based systematic trading", returns: "12-25%", risk: "Medium" },
  { name: "Distressed Debt", description: "Buy debt of troubled companies at discount", returns: "15-25%", risk: "High" },
  { name: "Market Neutral", description: "Equal long/short exposure, zero beta", returns: "4-8%", risk: "Low" },
];

export const HedgeFundStrategies = () => {
  const [selected, setSelected] = useState(0);
  const strategy = strategies[selected];

  const getRiskColor = (risk: string) => {
    if (risk === "Low") return "text-green-500";
    if (risk === "Medium") return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Hedge Fund Strategies Explained
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {strategies.map((s, idx) => (
            <button
              key={s.name}
              onClick={() => setSelected(idx)}
              className={`p-3 rounded-lg text-left transition-all ${
                selected === idx ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
              }`}
            >
              <p className="font-medium text-sm">{s.name}</p>
            </button>
          ))}
        </div>

        <Card className="bg-muted/50">
          <CardContent className="pt-4 space-y-4">
            <div className="flex justify-between items-start">
              <h4 className="font-semibold text-lg">{strategy.name}</h4>
              <Badge className={getRiskColor(strategy.risk)}>{strategy.risk} Risk</Badge>
            </div>
            <p className="text-sm text-muted-foreground">{strategy.description}</p>
            
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-xs text-muted-foreground">Target Returns</p>
                  <p className="font-bold">{strategy.returns}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-xs text-muted-foreground">Typical Fees</p>
                  <p className="font-bold">2% + 20%</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-3 gap-2 text-center text-sm">
          <div className="p-3 bg-muted/50 rounded-lg">
            <Shield className="h-5 w-5 mx-auto mb-1 text-blue-500" />
            <p className="font-bold">$250K</p>
            <p className="text-xs text-muted-foreground">Min Investment</p>
          </div>
          <div className="p-3 bg-muted/50 rounded-lg">
            <Zap className="h-5 w-5 mx-auto mb-1 text-yellow-500" />
            <p className="font-bold">1-2 Years</p>
            <p className="text-xs text-muted-foreground">Lock-up Period</p>
          </div>
          <div className="p-3 bg-muted/50 rounded-lg">
            <TrendingUp className="h-5 w-5 mx-auto mb-1 text-green-500" />
            <p className="font-bold">Accredited</p>
            <p className="text-xs text-muted-foreground">Investor Type</p>
          </div>
        </div>

        <div className="p-3 bg-primary/10 rounded-lg">
          <p className="text-sm"><strong>💡 Key Insight:</strong> Hedge funds aim for absolute returns regardless of market direction. The "2 and 20" fee structure (2% management + 20% performance) means they must significantly outperform to justify costs.</p>
        </div>
      </CardContent>
    </Card>
  );
};

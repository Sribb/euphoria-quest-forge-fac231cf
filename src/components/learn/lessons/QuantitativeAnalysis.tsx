import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Calculator, TrendingUp, BarChart3, Target } from "lucide-react";
import { AIContextualHelp } from "@/components/learn/AIContextualHelp";

const metrics = [
  { name: "Sharpe Ratio", formula: "(Return - Rf) / StdDev", interpretation: "> 1.0 is good, > 2.0 is excellent" },
  { name: "Sortino Ratio", formula: "(Return - Rf) / Downside Dev", interpretation: "Like Sharpe but only penalizes downside" },
  { name: "Alpha", formula: "Actual Return - Expected Return", interpretation: "Positive = outperformance" },
  { name: "Beta", formula: "Cov(Stock, Market) / Var(Market)", interpretation: "1.0 = market, >1 = more volatile" },
];

export const QuantitativeAnalysis = () => {
  const [portfolioReturn, setPortfolioReturn] = useState(12);
  const [riskFreeRate, setRiskFreeRate] = useState(4);
  const [volatility, setVolatility] = useState(15);
  const [selectedMetric, setSelectedMetric] = useState(0);

  const sharpeRatio = (portfolioReturn - riskFreeRate) / volatility;
  const excessReturn = portfolioReturn - riskFreeRate;

  const getSharpeRating = () => {
    if (sharpeRatio >= 2) return { label: "Excellent", color: "text-green-500" };
    if (sharpeRatio >= 1) return { label: "Good", color: "text-blue-500" };
    if (sharpeRatio >= 0.5) return { label: "Acceptable", color: "text-yellow-500" };
    return { label: "Poor", color: "text-red-500" };
  };

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          Quantitative Analysis Tools
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-2">
          {metrics.map((m, idx) => (
            <button
              key={m.name}
              onClick={() => setSelectedMetric(idx)}
              className={`p-3 rounded-lg text-left transition-all ${
                selectedMetric === idx ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
              }`}
            >
              <p className="font-medium text-sm">{m.name}</p>
            </button>
          ))}
        </div>

        <Card className="bg-muted/50">
          <CardContent className="pt-4">
            <h4 className="font-semibold">{metrics[selectedMetric].name}</h4>
            <p className="text-sm font-mono text-primary mt-1">{metrics[selectedMetric].formula}</p>
            <p className="text-sm text-muted-foreground mt-2">{metrics[selectedMetric].interpretation}</p>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h4 className="font-semibold">Sharpe Ratio Calculator</h4>
          <div>
            <label className="text-sm">Portfolio Return: {portfolioReturn}%</label>
            <Slider value={[portfolioReturn]} onValueChange={([v]) => setPortfolioReturn(v)} min={-10} max={30} className="mt-2" />
          </div>
          <div>
            <label className="text-sm">Risk-Free Rate: {riskFreeRate}%</label>
            <Slider value={[riskFreeRate]} onValueChange={([v]) => setRiskFreeRate(v)} min={0} max={8} step={0.5} className="mt-2" />
          </div>
          <div>
            <label className="text-sm">Portfolio Volatility: {volatility}%</label>
            <Slider value={[volatility]} onValueChange={([v]) => setVolatility(v)} min={5} max={40} className="mt-2" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <Card className="bg-muted/50">
            <CardContent className="pt-4 text-center">
              <TrendingUp className="h-4 w-4 mx-auto mb-1 text-green-500" />
              <p className="text-lg font-bold">{excessReturn}%</p>
              <p className="text-xs text-muted-foreground">Excess Return</p>
            </CardContent>
          </Card>
          <Card className="bg-primary/10">
            <CardContent className="pt-4 text-center">
              <Target className="h-4 w-4 mx-auto mb-1 text-primary" />
              <p className={`text-xl font-bold ${getSharpeRating().color}`}>{sharpeRatio.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">Sharpe Ratio</p>
            </CardContent>
          </Card>
          <Card className="bg-muted/50">
            <CardContent className="pt-4 text-center">
              <BarChart3 className="h-4 w-4 mx-auto mb-1 text-blue-500" />
              <Badge className={getSharpeRating().color}>{getSharpeRating().label}</Badge>
            </CardContent>
          </Card>
        </div>

        <div className="p-3 bg-primary/10 rounded-lg">
          <p className="text-sm"><strong>💡 Key Insight:</strong> The <AIContextualHelp term="Sharpe ratio" lessonId="16" lessonTitle="Quantitative Analysis">Sharpe ratio</AIContextualHelp> measures <AIContextualHelp term="risk-adjusted returns" lessonId="16" lessonTitle="Quantitative Analysis">risk-adjusted returns</AIContextualHelp>. A higher ratio means better return per unit of risk. Compare funds using Sharpe ratio, not just raw returns.</p>
        </div>
      </CardContent>
    </Card>
  );
};

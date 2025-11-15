import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { ShieldCheck, AlertTriangle, TrendingUp } from "lucide-react";
import { toast } from "sonner";

interface Asset {
  id: string;
  name: string;
  category: string;
  allocation: number;
  risk: number;
}

export const DiversificationBuilder = () => {
  const [portfolio, setPortfolio] = useState<Asset[]>([
    { id: "1", name: "Tech Stocks", category: "Stocks", allocation: 0, risk: 8 },
    { id: "2", name: "Healthcare Stocks", category: "Stocks", allocation: 0, risk: 6 },
    { id: "3", name: "Financial Stocks", category: "Stocks", allocation: 0, risk: 7 },
    { id: "4", name: "Government Bonds", category: "Bonds", allocation: 0, risk: 2 },
    { id: "5", name: "Corporate Bonds", category: "Bonds", allocation: 0, risk: 4 },
    { id: "6", name: "Real Estate", category: "Real Estate", allocation: 0, risk: 5 },
    { id: "7", name: "Gold", category: "Commodities", allocation: 0, risk: 6 },
    { id: "8", name: "International Stocks", category: "Stocks", allocation: 0, risk: 7 },
  ]);
  const [showAnalysis, setShowAnalysis] = useState(false);

  const totalAllocation = portfolio.reduce((sum, asset) => sum + asset.allocation, 0);
  const avgRisk = portfolio.reduce((sum, asset) => sum + (asset.allocation / 100) * asset.risk, 0);
  const categories = [...new Set(portfolio.map((a) => a.category))];
  const diversificationScore = Math.min(100, (categories.filter(cat => 
    portfolio.filter(a => a.category === cat && a.allocation > 0).length > 0
  ).length / categories.length) * 100);

  const updateAllocation = (id: string, value: number) => {
    setPortfolio(prev =>
      prev.map((asset) =>
        asset.id === id ? { ...asset, allocation: Math.max(0, Math.min(100, value)) } : asset
      )
    );
  };

  const analyzePortfolio = () => {
    if (Math.abs(totalAllocation - 100) > 0.1) {
      toast.error("Allocations must total 100%");
      return;
    }

    setShowAnalysis(true);
    
    const activeAssets = portfolio.filter(a => a.allocation > 0).length;
    if (activeAssets >= 5 && diversificationScore >= 75) {
      toast.success("Excellent diversification! Your portfolio is well-balanced.");
    } else if (activeAssets >= 3 && diversificationScore >= 50) {
      toast("Good start, but consider spreading across more asset classes.");
    } else {
      toast.error("Poor diversification. Add more asset classes to reduce risk.");
    }
  };

  const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#14b8a6', '#6366f1'];

  const chartData = portfolio
    .filter(a => a.allocation > 0)
    .map(a => ({ name: a.name, value: a.allocation }));

  return (
    <Card className="p-6 space-y-6 bg-gradient-to-br from-background to-muted/20">
      <div>
        <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-primary" />
          Build Your Diversified Portfolio
        </h3>
        <p className="text-sm text-muted-foreground">
          Allocate 100% across different assets. Aim for at least 5 assets across 3+ categories.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          {portfolio.map((asset) => (
            <div key={asset.id} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{asset.name}</span>
                <span className="text-muted-foreground">
                  {asset.allocation}% (Risk: {asset.risk}/10)
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={asset.allocation}
                onChange={(e) => updateAllocation(asset.id, parseInt(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="h-64">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                Start allocating to see your portfolio
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Total Allocation</span>
          <span className={`text-lg font-bold ${Math.abs(totalAllocation - 100) < 0.1 ? 'text-success' : 'text-destructive'}`}>
            {totalAllocation.toFixed(1)}%
          </span>
        </div>
        <Progress value={totalAllocation} className="h-2" />

        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Diversification Score</span>
          <span className="text-lg font-bold text-primary">{diversificationScore.toFixed(0)}%</span>
        </div>
        <Progress value={diversificationScore} className="h-2" />

        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Portfolio Risk</span>
          <span className="text-lg font-bold">{avgRisk.toFixed(1)}/10</span>
        </div>
      </div>

      <Button onClick={analyzePortfolio} className="w-full" size="lg">
        <TrendingUp className="w-4 h-4 mr-2" />
        Analyze Portfolio
      </Button>

      {showAnalysis && (
        <Card className="p-4 bg-muted/50 space-y-2">
          <h4 className="font-semibold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-warning" />
            Portfolio Analysis
          </h4>
          <p className="text-sm">
            <strong>Active Assets:</strong> {portfolio.filter(a => a.allocation > 0).length}/8
          </p>
          <p className="text-sm">
            <strong>Asset Classes:</strong> {categories.filter(cat => 
              portfolio.filter(a => a.category === cat && a.allocation > 0).length > 0
            ).length}/{categories.length}
          </p>
          <p className="text-sm">
            <strong>Average Risk:</strong> {avgRisk.toFixed(1)}/10
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            {diversificationScore >= 75
              ? "✓ Excellent! Your portfolio is well-diversified across multiple asset classes."
              : diversificationScore >= 50
              ? "⚠ Good start. Consider adding more asset classes for better protection."
              : "✗ Too concentrated. Spread investments across more assets and categories."}
          </p>
        </Card>
      )}
    </Card>
  );
};

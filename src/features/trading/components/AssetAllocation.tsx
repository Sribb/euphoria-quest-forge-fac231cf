import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { usePortfolioValue } from "@/hooks/usePortfolioValue";
import { PieChart } from "lucide-react";

export const AssetAllocation = () => {
  const { totalValue, positionsValue, cash } = usePortfolioValue();

  const assets = [
    { 
      name: "Stocks", 
      value: totalValue > 0 ? (positionsValue / totalValue) * 100 : 0, 
      color: "bg-primary", 
      amount: positionsValue 
    },
    { 
      name: "Cash", 
      value: totalValue > 0 ? (cash / totalValue) * 100 : 100, 
      color: "bg-success", 
      amount: cash 
    },
  ].filter(asset => asset.value > 0);

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <PieChart className="w-5 h-5 text-primary" />
        <h3 className="text-xl font-bold">Asset Allocation</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assets.map((asset) => (
          <div key={asset.name} className="space-y-3 p-4 border border-border rounded-lg hover:border-primary/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded-full ${asset.color}`} />
                <span className="font-semibold text-lg">{asset.name}</span>
              </div>
            </div>
            <div>
              <p className="text-3xl font-bold">{asset.value.toFixed(1)}%</p>
              <p className="text-sm text-muted-foreground mt-1">
                ${asset.amount.toFixed(2)}
              </p>
            </div>
            <Progress value={asset.value} className="h-2" />
          </div>
        ))}
        
        <div className="p-4 bg-gradient-hero rounded-lg border border-primary/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">Risk Level</span>
            <span className="font-bold text-warning">Moderate</span>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Your portfolio has a balanced allocation between stocks and cash reserves.
          </p>
        </div>
      </div>
    </Card>
  );
};

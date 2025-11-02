import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { usePortfolioValue } from "@/hooks/usePortfolioValue";

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
    <Card className="p-6 animate-fade-in" style={{ animationDelay: "100ms" }}>
      <h3 className="text-lg font-bold mb-4">Asset Allocation</h3>

      <div className="space-y-4">
        {assets.map((asset) => (
          <div key={asset.name} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${asset.color}`} />
                <span className="font-medium">{asset.name}</span>
              </div>
              <div className="text-right">
                <div className="font-bold">{asset.value.toFixed(1)}%</div>
                <div className="text-xs text-muted-foreground">
                  ${asset.amount.toFixed(2)}
                </div>
              </div>
            </div>
            <Progress value={asset.value} className="h-2" />
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gradient-hero rounded-lg">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Risk Level</span>
          <span className="font-bold text-warning">Moderate</span>
        </div>
      </div>
    </Card>
  );
};

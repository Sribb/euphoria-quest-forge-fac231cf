import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const assets = [
  { name: "Stocks", value: 45, color: "bg-primary", amount: 4725 },
  { name: "Bonds", value: 25, color: "bg-success", amount: 2625 },
  { name: "Crypto", value: 20, color: "bg-warning", amount: 2100 },
  { name: "Cash", value: 10, color: "bg-muted", amount: 1050 },
];

export const AssetAllocation = () => {
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
                <div className="font-bold">{asset.value}%</div>
                <div className="text-xs text-muted-foreground">
                  ${asset.amount.toLocaleString()}
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

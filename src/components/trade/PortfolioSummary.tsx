import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { Card } from "@/components/ui/card";

export const PortfolioSummary = () => {
  const totalValue = 10500;
  const change = 12.5;
  const changeAmount = 1312.5;
  const isPositive = change >= 0;

  return (
    <Card className="p-6 bg-gradient-hero border-0 shadow-lg animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-muted-foreground">Portfolio Value</h3>
        <DollarSign className="w-5 h-5 text-success" />
      </div>

      <div className="space-y-2">
        <div className="text-4xl font-bold">
          ${totalValue.toLocaleString()}
        </div>

        <div className="flex items-center gap-2">
          {isPositive ? (
            <TrendingUp className="w-5 h-5 text-success" />
          ) : (
            <TrendingDown className="w-5 h-5 text-destructive" />
          )}
          <span className={`text-lg font-semibold ${isPositive ? "text-success" : "text-destructive"}`}>
            {isPositive ? "+" : ""}{change}%
          </span>
          <span className="text-muted-foreground">
            (${changeAmount.toLocaleString()})
          </span>
        </div>

        <p className="text-sm text-muted-foreground">This week</p>
      </div>
    </Card>
  );
};

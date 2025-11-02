import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { Card } from "@/components/ui/card";
import { usePortfolioValue } from "@/hooks/usePortfolioValue";

export const PortfolioSummary = () => {
  const { totalValue, unrealizedPnL } = usePortfolioValue();
  
  const startingValue = 10000;
  const changeAmount = totalValue - startingValue;
  const change = ((changeAmount / startingValue) * 100);
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
            {isPositive ? "+" : ""}{change.toFixed(2)}%
          </span>
          <span className="text-muted-foreground">
            (${Math.abs(changeAmount).toFixed(2)})
          </span>
        </div>

        <p className="text-sm text-muted-foreground">Since inception</p>
        
        {unrealizedPnL !== 0 && (
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground mb-1">Unrealized P&L</p>
            <p className={`text-lg font-bold ${unrealizedPnL >= 0 ? "text-success" : "text-destructive"}`}>
              {unrealizedPnL >= 0 ? "+" : ""}${unrealizedPnL.toFixed(2)}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

import { TrendingUp, TrendingDown, DollarSign, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { usePortfolioValue } from "@/hooks/usePortfolioValue";
import { formatDollar, formatCurrency } from "@/lib/formatters";

export const PortfolioSummary = () => {
  const { totalValue, unrealizedPnL, unsettledCash, buyingPower } = usePortfolioValue();
  
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

      <div className="space-y-2 smooth-transition">
        <div className="text-4xl font-bold smooth-transition">
          {formatDollar(totalValue, 2)}
        </div>

        <div className="flex items-center gap-2 animate-fade-in">
          {isPositive ? (
            <TrendingUp className="w-5 h-5 text-success smooth-transition" />
          ) : (
            <TrendingDown className="w-5 h-5 text-destructive smooth-transition" />
          )}
          <span className={`text-lg font-semibold smooth-transition ${isPositive ? "text-success" : "text-destructive"}`}>
            {isPositive ? "+" : ""}{change.toFixed(2)}%
          </span>
          <span className="text-muted-foreground smooth-transition">
            ({formatDollar(Math.abs(changeAmount), 2)})
          </span>
        </div>

        <p className="text-sm text-muted-foreground">Since inception</p>
        
        {unrealizedPnL !== 0 && (
          <div className="mt-4 pt-4 border-t border-border animate-fade-in">
            <p className="text-xs text-muted-foreground mb-1">Unrealized P&L</p>
            <p className={`text-lg font-bold smooth-transition ${unrealizedPnL >= 0 ? "text-success" : "text-destructive"}`}>
              {unrealizedPnL >= 0 ? "+" : ""}{formatDollar(unrealizedPnL, 2)}
            </p>
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-border grid grid-cols-2 gap-4">
          <div className="animate-fade-in">
            <p className="text-xs text-muted-foreground mb-1">Buying Power</p>
            <p className="text-lg font-bold text-success smooth-transition">{formatDollar(buyingPower, 2)}</p>
          </div>
          {unsettledCash > 0 && (
            <div className="animate-fade-in">
              <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Unsettled (T+2)
              </p>
              <p className="text-lg font-bold text-warning smooth-transition">{formatDollar(unsettledCash, 2)}</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

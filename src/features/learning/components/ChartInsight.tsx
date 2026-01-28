import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, AlertCircle } from "lucide-react";

interface ChartInsightProps {
  chartData: { price: number; change: number };
  lessonSection: string;
}

export const ChartInsight = ({ chartData, lessonSection }: ChartInsightProps) => {
  const isPositive = chartData.change > 0;
  
  const getInsight = () => {
    if (lessonSection === "Understanding Price Action") {
      return isPositive
        ? "Notice the upward movement! This green candle shows buyers are in control right now."
        : "See the downward pressure? Red candles indicate sellers are dominating this period.";
    } else if (lessonSection === "Market Trends") {
      return Math.abs(chartData.change) > 2
        ? "Strong momentum detected! This could be the start of a new trend. Watch for continuation or reversal."
        : "Price is consolidating. This often happens before a significant move in either direction.";
    } else if (lessonSection === "Support and Resistance") {
      return isPositive
        ? "Price is pushing higher. It may test resistance levels soon. Watch for breakouts!"
        : "Price is declining. Look for support levels where buyers might step in to stop the fall.";
    }
    return "Watch how the price moves in real-time. Every movement tells a story about market sentiment.";
  };

  return (
    <Card className="p-4 bg-gradient-hero border-primary/20">
      <div className="flex items-start gap-3">
        {Math.abs(chartData.change) > 2 ? (
          <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
        ) : isPositive ? (
          <TrendingUp className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
        ) : (
          <TrendingDown className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
        )}
        <div>
          <h4 className="font-semibold mb-1">Real-Time Insight</h4>
          <p className="text-sm text-muted-foreground mb-2">{getInsight()}</p>
          <div className="flex gap-4 text-xs">
            <span className="text-foreground">
              Price: ${chartData.price.toFixed(2)}
            </span>
            <span className={isPositive ? "text-success" : "text-destructive"}>
              Change: {isPositive ? "+" : ""}
              {chartData.change.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};

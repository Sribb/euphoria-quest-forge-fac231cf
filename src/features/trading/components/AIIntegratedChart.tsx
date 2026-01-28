import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Activity, Brain } from "lucide-react";
import TradingViewWidget from "@/shared/components/TradingViewWidget";
import { useAIMarket } from "@/hooks/useAIMarket";
import { useAuth } from "@/hooks/useAuth";

interface AIIntegratedChartProps {
  symbol: string;
}

export const AIIntegratedChart = ({ symbol }: AIIntegratedChartProps) => {
  const { user } = useAuth();
  const { aiPrices, activeEvents } = useAIMarket(user?.id);

  // Find the AI price data for this symbol
  const stockData = aiPrices?.find((p) => p.symbol === symbol);

  const priceChange = stockData
    ? ((Number(stockData.current_price) - Number(stockData.previous_price)) /
        Number(stockData.previous_price)) *
      100
    : 0;

  const sentiment = stockData ? Number(stockData.ai_sentiment) * 100 : 0;
  const momentum = stockData ? Number(stockData.price_momentum) * 100 : 0;

  return (
    <div className="space-y-4">
      {/* AI Insights Panel */}
      {stockData && (
        <Card className="p-4 bg-gradient-accent border-0 animate-fade-in">
          <div className="flex items-center gap-2 mb-3">
            <Brain className="w-5 h-5 text-primary animate-pulse" />
            <h4 className="font-bold">AI Market Analysis</h4>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-lg bg-card/50">
              <div className="flex items-center gap-1 mb-1">
                {priceChange >= 0 ? (
                  <TrendingUp className="w-4 h-4 text-success" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-destructive" />
                )}
                <span className="text-xs font-medium">Price</span>
              </div>
              <p
                className={`text-lg font-bold ${
                  priceChange >= 0 ? "text-success" : "text-destructive"
                }`}
              >
                {priceChange >= 0 ? "+" : ""}
                {priceChange.toFixed(2)}%
              </p>
            </div>
            <div className="p-3 rounded-lg bg-card/50">
              <div className="flex items-center gap-1 mb-1">
                <Brain className="w-4 h-4 text-primary" />
                <span className="text-xs font-medium">AI Sentiment</span>
              </div>
              <p className="text-lg font-bold">{sentiment.toFixed(0)}%</p>
            </div>
            <div className="p-3 rounded-lg bg-card/50">
              <div className="flex items-center gap-1 mb-1">
                <Activity className="w-4 h-4 text-accent" />
                <span className="text-xs font-medium">Momentum</span>
              </div>
              <p className="text-lg font-bold">{momentum.toFixed(0)}%</p>
            </div>
          </div>
          
          {/* Volume and Volatility */}
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="text-sm">
              <span className="text-muted-foreground">Volume: </span>
              <span className="font-semibold">
                {Number(stockData.volume).toLocaleString()}
              </span>
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Volatility: </span>
              <span className="font-semibold">
                {(Number(stockData.volatility_index) * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        </Card>
      )}

      {/* Active Events Affecting This Stock */}
      {activeEvents && activeEvents.length > 0 && (
        <Card className="p-4 bg-warning/5 border-warning animate-fade-in">
          <h5 className="font-semibold text-sm mb-2">Active Market Events</h5>
          <div className="space-y-2">
            {activeEvents
              .filter(
                (event) =>
                  event.affected_symbols.includes(symbol) ||
                  event.affected_symbols.length === 0
              )
              .slice(0, 2)
              .map((event) => (
                <div key={event.id} className="text-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{event.title}</span>
                    <Badge variant="outline" className="text-xs">
                      {event.severity}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-xs mt-1">
                    {event.description.substring(0, 80)}...
                  </p>
                </div>
              ))}
          </div>
        </Card>
      )}

      {/* TradingView Chart */}
      <Card className="p-4 animate-fade-in">
        <TradingViewWidget symbol={symbol} height={500} />
      </Card>
    </div>
  );
};

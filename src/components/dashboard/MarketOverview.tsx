import { TrendingUp, TrendingDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface MarketData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  chartData: number[];
}

export const MarketOverview = () => {
  const navigate = useNavigate();

  // Mock market data - in production, this would come from a real API
  const marketData: MarketData[] = [
    {
      symbol: "SPY",
      name: "S&P 500",
      price: 567.89,
      change: 4.52,
      changePercent: 0.8,
      chartData: [560, 562, 558, 565, 563, 567, 570, 567.89]
    },
    {
      symbol: "QQQ",
      name: "Nasdaq-100",
      price: 489.34,
      change: 5.82,
      changePercent: 1.2,
      chartData: [480, 483, 479, 485, 487, 489, 492, 489.34]
    },
    {
      symbol: "IWM",
      name: "Russell 2000",
      price: 223.45,
      change: -1.12,
      changePercent: -0.5,
      chartData: [226, 225, 224, 223, 222, 224, 225, 223.45]
    }
  ];

  const renderMiniChart = (data: number[]) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min;
    const width = 80;
    const height = 24;
    
    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${x},${y}`;
    }).join(' ');

    const isPositive = data[data.length - 1] > data[0];

    return (
      <svg width={width} height={height} className="ml-auto">
        <polyline
          points={points}
          fill="none"
          stroke={isPositive ? "hsl(var(--success))" : "hsl(var(--destructive))"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  };

  return (
    <Card 
      className="p-6 bg-gradient-surface border-border shadow-glow-soft hover:shadow-glow transition-all duration-300 hover-lift cursor-pointer"
      onClick={() => navigate('/trade')}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-primary/10 rounded-lg">
          <TrendingUp className="w-5 h-5 text-primary" />
        </div>
        <h4 className="font-bold text-foreground">Market Overview</h4>
      </div>
      
      <div className="space-y-4">
        {marketData.map((market) => (
          <div key={market.symbol} className="group">
            <div className="flex items-center justify-between mb-1">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">{market.symbol}</span>
                  <span className="text-xs text-muted-foreground">{market.name}</span>
                </div>
                <div className="text-lg font-bold text-foreground">
                  ${market.price.toFixed(2)}
                </div>
              </div>
              <div className="text-right flex items-center gap-3">
                <div>
                  <div className={`text-sm font-semibold flex items-center gap-1 ${market.changePercent >= 0 ? 'text-success' : 'text-destructive'}`}>
                    {market.changePercent >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {market.changePercent >= 0 ? '+' : ''}{market.changePercent.toFixed(2)}%
                  </div>
                  <div className={`text-xs ${market.changePercent >= 0 ? 'text-success/70' : 'text-destructive/70'}`}>
                    {market.change >= 0 ? '+' : ''}{market.change.toFixed(2)}
                  </div>
                </div>
                {renderMiniChart(market.chartData)}
              </div>
            </div>
            {market.symbol !== marketData[marketData.length - 1].symbol && (
              <div className="h-px bg-border/50 mt-3" />
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground text-center">
          Click to view detailed market analysis →
        </p>
      </div>
    </Card>
  );
};

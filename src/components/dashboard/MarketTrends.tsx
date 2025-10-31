import { TrendingUp, TrendingDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { alphaVantageService } from "@/lib/alphaVantageService";
import { Skeleton } from "@/components/ui/skeleton";

const MARKET_SYMBOLS = [
  { symbol: "SPY", name: "S&P 500" },
  { symbol: "QQQ", name: "Nasdaq" },
  { symbol: "DIA", name: "Dow Jones" },
];

export const MarketTrends = () => {
  const { data: marketQuotes, isLoading } = useQuery({
    queryKey: ["marketIndices"],
    queryFn: () => alphaVantageService.getMultipleQuotes(MARKET_SYMBOLS.map(m => m.symbol)),
    refetchInterval: 60000,
    staleTime: 30000,
  });

  const sectors = [
    { name: "Technology", performance: "+2.4%", status: "strong" },
    { name: "Healthcare", performance: "+1.2%", status: "moderate" },
    { name: "Energy", performance: "-0.8%", status: "weak" },
    { name: "Finance", performance: "+1.8%", status: "strong" },
    { name: "Consumer", performance: "+0.5%", status: "moderate" },
    { name: "Utilities", performance: "-0.3%", status: "weak" },
  ];

  return (
    <Card className="p-8 bg-gradient-hero border-0 shadow-lg rounded-2xl">
      <h3 className="text-2xl font-bold mb-6">Live Market Indices</h3>
      
      <div className="grid gap-4 mb-8">
        {isLoading ? (
          <>
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </>
        ) : (
          MARKET_SYMBOLS.map((market) => {
            const quote = marketQuotes?.get(market.symbol);
            if (!quote) return null;

            const isPositive = quote.change >= 0;
            
            return (
              <div
                key={market.symbol}
                className="flex items-center justify-between p-5 bg-card rounded-xl hover:bg-card/80 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {isPositive ? (
                    <TrendingUp className="w-5 h-5 text-success" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-destructive" />
                  )}
                  <div>
                    <p className="font-bold">{market.name}</p>
                    <p className="text-xs text-muted-foreground">{market.symbol}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">${quote.price.toFixed(2)}</p>
                  <p className={`text-sm font-semibold ${isPositive ? "text-success" : "text-destructive"}`}>
                    {isPositive ? "+" : ""}{quote.change.toFixed(2)} ({isPositive ? "+" : ""}{quote.changePercent.toFixed(2)}%)
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      <h3 className="text-2xl font-bold mb-5 mt-8">Sector Performance</h3>
      <div className="grid grid-cols-2 gap-4">
        {sectors.map((sector) => (
          <div key={sector.name} className="p-4 bg-card rounded-xl">
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-medium">{sector.name}</p>
              <Badge
                variant={
                  sector.status === "strong"
                    ? "default"
                    : sector.status === "moderate"
                    ? "secondary"
                    : "outline"
                }
                className="text-xs"
              >
                {sector.status}
              </Badge>
            </div>
            <p className={`text-lg font-bold ${
              sector.performance.startsWith("+") ? "text-success" : "text-destructive"
            }`}>
              {sector.performance}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
};

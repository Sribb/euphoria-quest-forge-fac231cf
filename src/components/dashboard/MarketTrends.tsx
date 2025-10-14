import { TrendingUp, TrendingDown, Activity } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const marketData = [
  {
    index: "S&P 500",
    value: "4,783.45",
    change: "+1.24%",
    changeValue: "+58.87",
    isPositive: true,
  },
  {
    index: "Nasdaq",
    value: "15,095.14",
    change: "+1.67%",
    changeValue: "+248.20",
    isPositive: true,
  },
  {
    index: "Dow Jones",
    value: "37,545.33",
    change: "+0.82%",
    changeValue: "+305.47",
    isPositive: true,
  },
  {
    index: "Russell 2000",
    value: "2,065.23",
    change: "-0.34%",
    changeValue: "-7.03",
    isPositive: false,
  },
];

const sectors = [
  { name: "Technology", performance: "+2.1%", status: "strong" },
  { name: "Healthcare", performance: "+1.3%", status: "moderate" },
  { name: "Financials", performance: "+0.8%", status: "moderate" },
  { name: "Energy", performance: "-1.2%", status: "weak" },
];

export const MarketTrends = () => {
  return (
    <Card className="p-6 animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-5 h-5 text-primary" />
        <h3 className="text-xl font-bold">Live Market Indices</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {marketData.map((market) => (
          <div
            key={market.index}
            className="p-4 bg-gradient-hero rounded-lg border border-border hover:border-primary transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{market.index}</p>
                <p className="text-2xl font-bold">{market.value}</p>
              </div>
              <div className="text-right">
                <div className={`flex items-center gap-1 ${market.isPositive ? "text-success" : "text-destructive"}`}>
                  {market.isPositive ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span className="font-semibold">{market.change}</span>
                </div>
                <p className="text-sm text-muted-foreground">{market.changeValue}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div>
        <h4 className="font-semibold mb-3">Sector Performance</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {sectors.map((sector) => (
            <div key={sector.name} className="p-3 bg-card rounded-lg border border-border">
              <p className="text-xs text-muted-foreground mb-1">{sector.name}</p>
              <p className={`text-sm font-bold ${sector.performance.startsWith("+") ? "text-success" : "text-destructive"}`}>
                {sector.performance}
              </p>
              <Badge
                variant={sector.status === "strong" ? "default" : sector.status === "moderate" ? "secondary" : "destructive"}
                className="mt-2 text-xs"
              >
                {sector.status}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

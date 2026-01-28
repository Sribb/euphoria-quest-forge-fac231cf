import { TrendingUp, TrendingDown, DollarSign, Activity, Globe, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usePortfolioValue } from "@/hooks/usePortfolioValue";
import { useState } from "react";
import { formatDollar } from "@/lib/formatters";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const MarketHealthPanel = () => {
  const { totalValue, unrealizedPnL, buyingPower } = usePortfolioValue();
  const [showSectorHeatmap, setShowSectorHeatmap] = useState(false);
  
  const startingValue = 10000;
  const changeAmount = totalValue - startingValue;
  const yoyPnL = ((changeAmount / startingValue) * 100);
  const isPositive = yoyPnL >= 0;

  // Mock market health data
  const marketHealth = 72;
  const globalRisk = "Moderate";
  const moneyFlow = "Inflow";
  const volatility = 28;

  // Mock sector data
  const sectors = [
    { name: "Tech", performance: 8.2, volatility: 32, color: "hsl(var(--primary))" },
    { name: "Energy", performance: -2.1, volatility: 45, color: "hsl(var(--warning))" },
    { name: "Healthcare", performance: 4.5, volatility: 18, color: "hsl(var(--success))" },
    { name: "Financials", performance: 3.8, volatility: 25, color: "hsl(var(--accent))" },
    { name: "Consumer", performance: 1.2, volatility: 20, color: "hsl(var(--muted))" },
  ];

  return (
    <div className="h-full overflow-y-auto space-y-4 pr-2">
      {/* Portfolio Value with Sparkline */}
      <Card className="p-6 bg-gradient-to-br from-primary/10 to-background border-primary/20">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Portfolio Value</span>
          <DollarSign className="w-4 h-4 text-success" />
        </div>
        <div className="text-3xl font-bold mb-1 glow-text">
          ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <div className="flex items-center gap-2 mb-3">
          {isPositive ? (
            <TrendingUp className="w-4 h-4 text-success" />
          ) : (
            <TrendingDown className="w-4 h-4 text-destructive" />
          )}
          <span className={`text-sm font-semibold ${isPositive ? "text-success" : "text-destructive"}`}>
            {isPositive ? "+" : ""}{yoyPnL.toFixed(2)}% (1W)
          </span>
        </div>
        {/* Simple sparkline visualization */}
        <div className="h-8 flex items-end gap-1">
          {[65, 70, 68, 72, 75, 73, 78, 80, 77, 82, 85, 83].map((val, i) => (
            <div
              key={i}
              className="flex-1 bg-gradient-to-t from-primary/50 to-primary rounded-t transition-all hover:from-primary/70"
              style={{ height: `${val}%` }}
            />
          ))}
        </div>
      </Card>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="p-4 bg-card/50 border-border/50">
          <div className="text-xs text-muted-foreground mb-1">Unrealized P&L</div>
          <div className={`text-xl font-bold ${unrealizedPnL >= 0 ? "text-success" : "text-destructive"}`}>
            {unrealizedPnL >= 0 ? "+" : ""}{formatDollar(unrealizedPnL, 2)}
          </div>
        </Card>
        <Card className="p-4 bg-card/50 border-border/50">
          <div className="text-xs text-muted-foreground mb-1">Buying Power</div>
          <div className="text-xl font-bold text-success">{formatDollar(buyingPower, 2)}</div>
        </Card>
      </div>

      <Card className="p-4 bg-card/50 border-border/50">
        <div className="text-xs text-muted-foreground mb-1">YoY P&L</div>
        <div className={`text-xl font-bold ${isPositive ? "text-success" : "text-destructive"}`}>
          {isPositive ? "+" : ""}{yoyPnL.toFixed(2)}%
        </div>
      </Card>

      {/* Market Health Index */}
      <Card className="p-6 bg-gradient-to-br from-accent/10 to-background border-accent/20">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold">Market Health Index</h3>
          <Activity className="w-5 h-5 text-accent" />
        </div>
        <div className="flex items-end gap-2 mb-3">
          <div className="text-4xl font-bold glow-text">{marketHealth}</div>
          <div className="text-muted-foreground mb-1">/100</div>
        </div>
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-success via-warning to-destructive transition-all"
            style={{ width: `${marketHealth}%` }}
          />
        </div>
      </Card>

      {/* Quick Metrics */}
      <Card className="p-4 bg-card/50 border-border/50 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <Globe className="w-4 h-4 text-warning" />
            <span className="text-muted-foreground">Global Risk Level</span>
          </div>
          <Badge variant="outline" className="text-warning border-warning/50">
            {globalRisk}
          </Badge>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="w-4 h-4 text-success" />
            <span className="text-muted-foreground">Money Flow Direction</span>
          </div>
          <div className="flex items-center gap-1 text-success font-semibold text-sm">
            <ArrowUpRight className="w-4 h-4" />
            {moneyFlow}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <Activity className="w-4 h-4 text-accent" />
            <span className="text-muted-foreground">Current Volatility</span>
          </div>
          <span className="font-semibold text-sm">{volatility}%</span>
        </div>
      </Card>

      {/* Sector Sentiment */}
      <Card className="p-6 bg-card/50 border-border/50">
        <h3 className="text-sm font-semibold mb-4">Sector Sentiment</h3>
        <div className="space-y-3">
          {sectors.map((sector) => (
            <div key={sector.name} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{sector.name}</span>
                <span className={`font-semibold ${sector.performance >= 0 ? "text-success" : "text-destructive"}`}>
                  {sector.performance >= 0 ? "+" : ""}{sector.performance}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full transition-all"
                  style={{ 
                    width: `${Math.abs(sector.performance) * 10}%`,
                    backgroundColor: sector.performance >= 0 ? "hsl(var(--success))" : "hsl(var(--destructive))"
                  }}
                />
              </div>
            </div>
          ))}
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full mt-4 hover:bg-primary/10 hover:border-primary"
          onClick={() => setShowSectorHeatmap(true)}
        >
          View Sector Heatmap
        </Button>
      </Card>

      {/* Sector Heatmap Dialog */}
      <Dialog open={showSectorHeatmap} onOpenChange={setShowSectorHeatmap}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Sector Performance Heatmap</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-3 p-4">
            {sectors.map((sector) => (
              <Card 
                key={sector.name} 
                className="p-4 transition-all hover:scale-105 cursor-pointer"
                style={{
                  backgroundColor: sector.performance >= 0 
                    ? `hsl(var(--success) / ${Math.abs(sector.performance) * 0.05})` 
                    : `hsl(var(--destructive) / ${Math.abs(sector.performance) * 0.05})`
                }}
              >
                <div className="text-sm font-semibold mb-2">{sector.name}</div>
                <div className={`text-2xl font-bold mb-1 ${sector.performance >= 0 ? "text-success" : "text-destructive"}`}>
                  {sector.performance >= 0 ? "+" : ""}{sector.performance}%
                </div>
                <div className="text-xs text-muted-foreground">
                  Vol: {sector.volatility}%
                </div>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

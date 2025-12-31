import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePortfolioValue } from "@/hooks/usePortfolioValue";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown, Wallet, Clock, PiggyBank, Activity } from "lucide-react";
import { formatDollar } from "@/lib/formatters";

type TimeFrame = "1D" | "1W" | "1M" | "3M" | "1Y" | "All";

export const PortfolioOverview = () => {
  const { user } = useAuth();
  const { totalValue, unrealizedPnL, unsettledCash, buyingPower, positionsValue } = usePortfolioValue();
  const [timeFrame, setTimeFrame] = useState<TimeFrame>("1M");

  const { data: historicalData = [] } = useQuery({
    queryKey: ["portfolio-history", user?.id, timeFrame],
    queryFn: async () => {
      const { data: transactions, error } = await supabase
        .from("transaction_logs")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: true });

      if (error) throw error;

      const dataPoints: { date: string; value: number }[] = [];
      let currentValue = 10000;

      if (transactions && transactions.length > 0) {
        transactions.forEach((tx) => {
          if (tx.balance_after) {
            currentValue = Number(tx.balance_after);
          }
          dataPoints.push({
            date: new Date(tx.created_at).toLocaleDateString("en-US", { 
              month: "short", 
              day: "numeric" 
            }),
            value: currentValue,
          });
        });
      }

      dataPoints.push({
        date: "Now",
        value: totalValue,
      });

      const maxPoints = timeFrame === "1D" ? 24 : 
                       timeFrame === "1W" ? 7 : 
                       timeFrame === "1M" ? 30 : 
                       timeFrame === "3M" ? 90 : 
                       timeFrame === "1Y" ? 365 : 
                       dataPoints.length;

      return dataPoints.slice(-maxPoints);
    },
    enabled: !!user?.id,
  });

  const startingValue = 10000;
  const changeAmount = totalValue - startingValue;
  const changePercent = ((changeAmount / startingValue) * 100);
  const isPositive = changePercent >= 0;

  const timeFrames: TimeFrame[] = ["1D", "1W", "1M", "3M", "1Y", "All"];

  const stats = [
    {
      label: "Buying Power",
      value: formatDollar(buyingPower, 2),
      icon: Wallet,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      label: "Positions",
      value: formatDollar(positionsValue, 2),
      icon: Activity,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Unrealized P&L",
      value: `${unrealizedPnL >= 0 ? "+" : ""}${formatDollar(unrealizedPnL, 2)}`,
      icon: PiggyBank,
      color: unrealizedPnL >= 0 ? "text-success" : "text-destructive",
      bgColor: unrealizedPnL >= 0 ? "bg-success/10" : "bg-destructive/10",
    },
    ...(unsettledCash > 0 ? [{
      label: "Settling (T+2)",
      value: formatDollar(unsettledCash, 2),
      icon: Clock,
      color: "text-warning",
      bgColor: "bg-warning/10",
    }] : []),
  ];

  return (
    <Card className="overflow-hidden border border-white/10 shadow-2xl animate-fade-in bg-gradient-to-br from-background/80 via-card/60 to-muted/40 backdrop-blur-xl relative">
      {/* Header Section */}
      <div className="relative p-6 pb-0">
      {/* Glass noise overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] opacity-50 pointer-events-none" />
      
      {/* Decorative gradient orbs */}
      <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-gradient-to-br from-primary/30 via-success/20 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-gradient-to-tr from-primary/20 via-transparent to-transparent blur-3xl pointer-events-none" />
        
        <div className="relative flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          {/* Main Value */}
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Total Portfolio Value
            </p>
            <div className="flex items-baseline gap-3">
              <h2 className="text-4xl lg:text-5xl font-bold tracking-tight">
                {formatDollar(totalValue, 2)}
              </h2>
              <Badge 
                variant="secondary" 
                className={`px-3 py-1.5 text-sm font-semibold ${
                  isPositive 
                    ? "bg-success/15 text-success border border-success/30" 
                    : "bg-destructive/15 text-destructive border border-destructive/30"
                }`}
              >
                {isPositive ? (
                  <TrendingUp className="w-4 h-4 mr-1.5" />
                ) : (
                  <TrendingDown className="w-4 h-4 mr-1.5" />
                )}
                {isPositive ? "+" : ""}{changePercent.toFixed(2)}%
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {isPositive ? "+" : ""}{formatDollar(changeAmount, 2)} since inception
            </p>
          </div>

          {/* Time Frame Selector */}
          <div className="flex items-center gap-1 p-1.5 bg-white/5 border border-white/10 rounded-xl backdrop-blur-md">
            {timeFrames.map((tf) => (
              <Button
                key={tf}
                variant="ghost"
                size="sm"
                onClick={() => setTimeFrame(tf)}
                className={`px-4 py-2 text-xs font-medium rounded-lg transition-all duration-200 ${
                  timeFrame === tf 
                    ? "bg-background text-foreground shadow-sm" 
                    : "text-muted-foreground hover:text-foreground hover:bg-transparent"
                }`}
              >
                {tf}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="h-56 px-4 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={historicalData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                <stop 
                  offset="0%" 
                  stopColor={isPositive ? "hsl(var(--success))" : "hsl(var(--destructive))"} 
                  stopOpacity={0.3} 
                />
                <stop 
                  offset="100%" 
                  stopColor={isPositive ? "hsl(var(--success))" : "hsl(var(--destructive))"} 
                  stopOpacity={0} 
                />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="date" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${(value / 1000).toFixed(1)}k`}
              width={50}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "12px",
                boxShadow: "0 10px 40px -10px rgba(0,0,0,0.3)",
                padding: "12px 16px",
              }}
              labelStyle={{ color: "hsl(var(--muted-foreground))", marginBottom: "4px" }}
              formatter={(value: number) => [
                <span className="font-bold text-foreground">{formatDollar(value, 2)}</span>, 
                "Value"
              ]}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={isPositive ? "hsl(var(--success))" : "hsl(var(--destructive))"}
              strokeWidth={2.5}
              fill="url(#portfolioGradient)"
              dot={false}
              activeDot={{ 
                r: 6, 
                fill: isPositive ? "hsl(var(--success))" : "hsl(var(--destructive))",
                stroke: "hsl(var(--background))",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 p-6 pt-4">
        {stats.map((stat, index) => (
          <div 
            key={stat.label}
            className="relative group p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className={`absolute top-3 right-3 w-8 h-8 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
              {stat.label}
            </p>
            <p className={`text-lg font-bold ${stat.color}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
};

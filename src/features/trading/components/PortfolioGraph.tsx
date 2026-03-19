import { useState, useMemo, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePaperTrading, type PaperTrade } from "@/hooks/usePaperTrading";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getQuote } from "@/lib/finnhub";
import {
  AreaChart, Area, Tooltip, ResponsiveContainer, YAxis,
} from "recharts";
import { TrendingUp, TrendingDown, RefreshCw, DollarSign, BarChart3, Activity } from "lucide-react";
import { formatDollar } from "@/lib/formatters";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

type TimeFrame = "1D" | "1W" | "1M" | "3M" | "1Y" | "ALL";

/**
 * Build portfolio value over time from paper_trades history,
 * using live prices for current holdings value.
 */
function buildChartData(
  trades: PaperTrade[],
  currentCash: number,
  currentHoldings: Record<string, { shares: number; avgCost: number }>,
  livePrices: Record<string, number>
) {
  const now = new Date();

  const currentHoldingsValue = Object.entries(currentHoldings).reduce((sum, [sym, h]) => {
    const price = livePrices[sym] || h.avgCost;
    return sum + h.shares * price;
  }, 0);
  const currentTotal = currentCash + currentHoldingsValue;

  if (!trades || trades.length === 0) {
    // Generate a flat line from a week ago to now
    const points = [];
    for (let i = 7; i >= 0; i--) {
      points.push({
        fullDate: new Date(now.getTime() - 86400000 * i).toISOString(),
        value: currentTotal,
      });
    }
    return points;
  }

  const sorted = [...trades].reverse();
  let cash = 10000;
  const holdings: Record<string, { shares: number; avgCost: number }> = {};
  const points: { fullDate: string; value: number }[] = [];

  points.push({ fullDate: sorted[0].timestamp, value: 10000 });

  for (const t of sorted) {
    if (t.type === "BUY") {
      cash -= t.total;
      const existing = holdings[t.symbol];
      if (existing) {
        const newShares = existing.shares + t.shares;
        existing.avgCost = (existing.shares * existing.avgCost + t.shares * t.price) / newShares;
        existing.shares = newShares;
      } else {
        holdings[t.symbol] = { shares: t.shares, avgCost: t.price };
      }
    } else {
      cash += t.total;
      const existing = holdings[t.symbol];
      if (existing) {
        existing.shares -= t.shares;
        if (existing.shares <= 0) delete holdings[t.symbol];
      }
    }

    // Use live price if available for current holdings, trade-time price otherwise
    const holdingsValue = Object.entries(holdings).reduce((sum, [sym, h]) => {
      const price = livePrices[sym] || h.avgCost;
      return sum + h.shares * price;
    }, 0);

    points.push({ fullDate: t.timestamp, value: cash + holdingsValue });
  }

  // Final "now" point uses live prices
  points.push({ fullDate: now.toISOString(), value: currentTotal });

  return points;
}

export const PortfolioGraph = () => {
  const { data } = usePaperTrading();
  const queryClient = useQueryClient();
  const [timeFrame, setTimeFrame] = useState<TimeFrame>("ALL");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  // Fetch live prices for all held symbols
  const holdingSymbols = Object.keys(data.paper_holdings);
  const { data: livePrices = {} } = useQuery({
    queryKey: ["live-portfolio-prices", holdingSymbols.sort().join(",")],
    queryFn: async () => {
      const prices: Record<string, number> = {};
      await Promise.all(
        holdingSymbols.map(async (sym) => {
          try {
            const q = await getQuote(sym);
            if (q?.c) prices[sym] = q.c;
          } catch { /* use avgCost fallback */ }
        })
      );
      return prices;
    },
    enabled: holdingSymbols.length > 0,
    staleTime: 60000,
    refetchOnWindowFocus: true,
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ["live-portfolio-prices"] });
    await queryClient.invalidateQueries({ queryKey: ["paper-trading"] });
    await queryClient.invalidateQueries({ queryKey: ["quote"] });
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const allChartData = useMemo(
    () => buildChartData(data.paper_trades, data.paper_cash, data.paper_holdings, livePrices),
    [data.paper_trades, data.paper_cash, data.paper_holdings, livePrices]
  );

  const chartData = useMemo(() => {
    const now = Date.now();
    const durations: Record<TimeFrame, number> = {
      "1D": 86400000,
      "1W": 7 * 86400000,
      "1M": 30 * 86400000,
      "3M": 90 * 86400000,
      "1Y": 365 * 86400000,
      "ALL": 0,
    };
    const duration = durations[timeFrame];
    const cutoff = duration > 0 ? now - duration : 0;

    // Filter points within the timeframe
    const filtered = allChartData.filter((p) => new Date(p.fullDate).getTime() >= cutoff);

    if (filtered.length >= 2) return filtered;

    // Not enough data points in this range — interpolate a synthetic line
    // Find the value at the cutoff boundary by looking at the last point before it
    const allSorted = [...allChartData].sort(
      (a, b) => new Date(a.fullDate).getTime() - new Date(b.fullDate).getTime()
    );
    let startVal = 10000;
    for (const p of allSorted) {
      if (new Date(p.fullDate).getTime() <= cutoff) startVal = p.value;
      else break;
    }
    const endVal = allSorted[allSorted.length - 1]?.value ?? startVal;

    // Generate evenly-spaced points across the timeframe
    const pointCount = timeFrame === "1D" ? 24 : timeFrame === "1W" ? 7 : 12;
    const step = (duration > 0 ? duration : now) / pointCount;
    const points: { fullDate: string; value: number }[] = [];
    for (let i = 0; i <= pointCount; i++) {
      const t = (duration > 0 ? cutoff : 0) + step * i;
      // Linear interpolation between start and end
      const ratio = i / pointCount;
      points.push({
        fullDate: new Date(t).toISOString(),
        value: startVal + (endVal - startVal) * ratio,
      });
    }
    return points;
  }, [allChartData, timeFrame]);

  const startValue = chartData[0]?.value || 10000;
  const displayValue = hoverValue ?? chartData[chartData.length - 1]?.value ?? data.paper_cash;
  const changeAmount = displayValue - startValue;
  const changePercent = startValue > 0 ? (changeAmount / startValue) * 100 : 0;
  const isPositive = changeAmount >= 0;

  const timeFrames: TimeFrame[] = ["1D", "1W", "1M", "3M", "1Y", "ALL"];
  const strokeColor = isPositive ? "hsl(142, 71%, 45%)" : "hsl(0, 84%, 60%)";

  // Compute Y domain with padding so flat lines appear in the middle
  const yDomain = useMemo(() => {
    const values = chartData.map(d => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min;
    const padding = range > 0 ? range * 0.15 : max * 0.05;
    return [Math.max(0, min - padding), max + padding] as [number, number];
  }, [chartData]);

  // Positions value using live prices
  const positionsValue = Object.entries(data.paper_holdings).reduce((sum, [sym, h]) => {
    const price = livePrices[sym] || h.avgCost;
    return sum + h.shares * price;
  }, 0);

  const positionCount = Object.keys(data.paper_holdings).length;
  const totalPortfolioValue = data.paper_cash + positionsValue;

  const handleMouseMove = useCallback((state: any) => {
    if (state?.activePayload?.[0]?.payload?.value != null) {
      setHoverValue(state.activePayload[0].payload.value);
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoverValue(null);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Card className="overflow-hidden border border-border/50 bg-card/60 backdrop-blur-sm relative">
        {/* Ambient glow */}
        <div
          className="absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-20"
          style={{
            background: isPositive
              ? "radial-gradient(circle, hsl(142 71% 45% / 0.4), transparent 70%)"
              : "radial-gradient(circle, hsl(0 84% 60% / 0.3), transparent 70%)",
          }}
        />

        {/* Header */}
        <div className="relative p-6 pb-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.15em]">
                Portfolio Value
              </p>
              <motion.div
                key={displayValue}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15 }}
                className="flex items-baseline gap-3"
              >
                <h2 className="text-4xl font-black tracking-tight text-foreground tabular-nums">
                  {formatDollar(displayValue, 2)}
                </h2>
                <Badge
                  variant="secondary"
                  className={`px-2.5 py-1 text-xs font-bold ${
                    isPositive
                      ? "bg-success/10 text-success border border-success/25"
                      : "bg-destructive/10 text-destructive border border-destructive/25"
                  }`}
                >
                  {isPositive ? <TrendingUp className="w-3.5 h-3.5 mr-1" /> : <TrendingDown className="w-3.5 h-3.5 mr-1" />}
                  {isPositive ? "+" : ""}{changePercent.toFixed(2)}%
                </Badge>
              </motion.div>
              <p className="text-xs text-muted-foreground">
                {isPositive ? "+" : ""}{formatDollar(changeAmount, 2)} ({timeFrame})
              </p>
            </div>

            <button
              onClick={handleRefresh}
              className="p-2 rounded-lg hover:bg-muted/50 transition-colors"
              title="Refresh prices"
            >
              <RefreshCw className={`w-4 h-4 text-muted-foreground ${isRefreshing ? "animate-spin" : ""}`} />
            </button>
          </div>

          <div className="flex items-center gap-1 mt-4 p-0.5 bg-muted/40 border border-border/40 rounded-lg w-fit">
            {timeFrames.map((tf) => (
              <Button
                key={tf}
                variant="ghost"
                size="sm"
                onClick={() => setTimeFrame(tf)}
                className={`px-3 py-1 h-7 text-[11px] font-semibold rounded-md transition-all ${
                  timeFrame === tf
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tf}
              </Button>
            ))}
          </div>
        </div>

        {/* Chart */}
        <motion.div
          key={timeFrame}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="h-56 md:h-64 px-4"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 4, right: 4, left: 4, bottom: 4 }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <defs>
                <linearGradient id="gradPositive" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0.35} />
                  <stop offset="50%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0.12} />
                  <stop offset="100%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradNegative" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0.35} />
                  <stop offset="50%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0.12} />
                  <stop offset="100%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0} />
                </linearGradient>
                <filter id="lineGlow">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <YAxis domain={yDomain} hide />
              <Tooltip
                content={() => null}
                cursor={{ stroke: "hsl(var(--muted-foreground))", strokeWidth: 1, strokeDasharray: "4 4" }}
              />
              <Area
                type="monotoneX"
                dataKey="value"
                stroke={strokeColor}
                strokeWidth={2.5}
                fill={`url(#${isPositive ? "gradPositive" : "gradNegative"})`}
                dot={false}
                activeDot={{
                  r: 5,
                  fill: strokeColor,
                  stroke: "hsl(var(--background))",
                  strokeWidth: 2,
                  filter: "url(#lineGlow)",
                }}
                animationDuration={800}
                animationEasing="ease-out"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 p-6 pt-4">
          {[
            {
              label: "Buying Power",
              value: formatDollar(data.paper_cash, 2),
              icon: DollarSign,
              color: "text-success",
              trend: data.paper_cash > 5000 ? "up" : data.paper_cash < 3000 ? "down" : "neutral",
            },
            {
              label: "Positions",
              value: `${positionCount} · ${formatDollar(positionsValue, 0)}`,
              icon: BarChart3,
              color: "text-primary",
              trend: positionCount > 0 ? "up" : "neutral",
            },
            {
              label: "Trades",
              value: String(data.paper_trades.length),
              icon: Activity,
              color: "text-foreground",
              trend: data.paper_trades.length > 10 ? "up" : "neutral",
            },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.06, duration: 0.35 }}
                className="p-3 rounded-xl bg-muted/20 border border-border/30 shadow-sm hover:border-primary/20 transition-colors group"
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors" />
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">{stat.label}</p>
                  {stat.trend === "up" && <TrendingUp className="w-2.5 h-2.5 text-success ml-auto" />}
                  {stat.trend === "down" && <TrendingDown className="w-2.5 h-2.5 text-destructive ml-auto" />}
                </div>
                <p className={`text-sm font-bold ${stat.color}`}>{stat.value}</p>
              </motion.div>
            );
          })}
        </div>
      </Card>
    </motion.div>
  );
};

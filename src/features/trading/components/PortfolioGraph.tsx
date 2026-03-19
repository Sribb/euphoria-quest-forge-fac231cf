import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePaperTrading, type PaperTrade } from "@/hooks/usePaperTrading";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";
import { formatDollar } from "@/lib/formatters";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";

type TimeFrame = "1D" | "1W" | "1M" | "3M" | "1Y" | "ALL";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const data = payload[0]?.payload;
  if (!data) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-xl border border-border/50 bg-popover/95 backdrop-blur-xl p-3.5 shadow-2xl min-w-[160px]"
    >
      <p className="text-[10px] text-muted-foreground font-medium mb-1.5">{data.fullDate ? new Date(data.fullDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : label}</p>
      <p className="text-lg font-bold text-foreground">{formatDollar(data.value, 2)}</p>
      {data.trade && (
        <p className="text-[10px] text-primary font-medium mt-1 pt-1 border-t border-border/40">{data.trade}</p>
      )}
    </motion.div>
  );
};

/**
 * Build portfolio value over time from paper_trades history.
 * Each trade changes cash ± total; we reconstruct the portfolio value timeline.
 */
function buildChartData(trades: PaperTrade[], currentCash: number, currentHoldings: Record<string, { shares: number; avgCost: number }>) {
  if (!trades || trades.length === 0) {
    // No trades yet — flat line at starting balance
    const now = new Date();
    return [
      { date: "Start", fullDate: new Date(now.getTime() - 86400000 * 7).toISOString(), value: 10000 },
      { date: "Now", fullDate: now.toISOString(), value: currentCash },
    ];
  }

  // Trades are newest-first in the array; reverse for chronological
  const sorted = [...trades].reverse();

  // Walk forward: start from $10,000 and replay trades to compute portfolio value at each point
  // We approximate portfolio value as cash + sum(holdings * avgCost) at each trade
  let cash = 10000;
  const holdings: Record<string, { shares: number; avgCost: number }> = {};
  const points: { date: string; fullDate: string; value: number; trade?: string }[] = [];

  // Starting point
  points.push({
    date: new Date(sorted[0].timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    fullDate: sorted[0].timestamp,
    value: 10000,
  });

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

    // Portfolio value = cash + sum(shares * avgCost) — using avgCost as approximation
    const holdingsValue = Object.values(holdings).reduce((sum, h) => sum + h.shares * h.avgCost, 0);
    const totalValue = cash + holdingsValue;

    points.push({
      date: new Date(t.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      fullDate: t.timestamp,
      value: totalValue,
      trade: `${t.type} ${t.shares} ${t.symbol} @ $${t.price.toFixed(2)}`,
    });
  }

  // Add current value
  const currentHoldingsValue = Object.values(currentHoldings).reduce((sum, h) => sum + h.shares * h.avgCost, 0);
  points.push({
    date: "Now",
    fullDate: new Date().toISOString(),
    value: currentCash + currentHoldingsValue,
  });

  return points;
}

export const PortfolioGraph = () => {
  const { data } = usePaperTrading();
  const [timeFrame, setTimeFrame] = useState<TimeFrame>("ALL");

  const allChartData = useMemo(
    () => buildChartData(data.paper_trades, data.paper_cash, data.paper_holdings),
    [data.paper_trades, data.paper_cash, data.paper_holdings]
  );

  const chartData = useMemo(() => {
    const now = Date.now();
    const cutoffs: Record<TimeFrame, number> = {
      "1D": now - 86400000,
      "1W": now - 7 * 86400000,
      "1M": now - 30 * 86400000,
      "3M": now - 90 * 86400000,
      "1Y": now - 365 * 86400000,
      "ALL": 0,
    };
    const cutoff = cutoffs[timeFrame];
    const filtered = allChartData.filter((p) => new Date(p.fullDate).getTime() >= cutoff);
    return filtered.length >= 2 ? filtered : allChartData;
  }, [allChartData, timeFrame]);

  const startValue = chartData[0]?.value || 10000;
  const currentValue = chartData[chartData.length - 1]?.value || data.paper_cash;
  const changeAmount = currentValue - startValue;
  const changePercent = startValue > 0 ? (changeAmount / startValue) * 100 : 0;
  const isPositive = changeAmount >= 0;

  const timeFrames: TimeFrame[] = ["1D", "1W", "1M", "3M", "1Y", "ALL"];
  const strokeColor = isPositive ? "hsl(var(--success))" : "hsl(var(--destructive))";
  const gradientId = isPositive ? "gradPositive" : "gradNegative";

  return (
    <Card className="overflow-hidden border border-border/50 bg-card/60 backdrop-blur-sm relative">
      {/* Subtle glow */}
      <div
        className="absolute -top-32 -right-32 w-72 h-72 rounded-full blur-3xl pointer-events-none opacity-30"
        style={{
          background: isPositive
            ? "radial-gradient(circle, hsl(var(--success) / 0.25), transparent 70%)"
            : "radial-gradient(circle, hsl(var(--destructive) / 0.15), transparent 70%)",
        }}
      />

      {/* Header */}
      <div className="relative p-6 pb-3">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="space-y-1">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.15em]">
              Portfolio Value
            </p>
            <motion.div
              key={currentValue}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-baseline gap-3"
            >
              <h2 className="text-4xl font-black tracking-tight text-foreground">
                {formatDollar(currentValue, 2)}
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
        </div>

        {/* Time frame selectors */}
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
        className="h-64 md:h-72 px-2"
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="gradPositive" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradNegative" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0} />
              </linearGradient>
              <filter id="lineGlow">
                <feGaussianBlur stdDeviation="2.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.1} vertical={false} />
            <XAxis
              dataKey="date"
              stroke="hsl(var(--muted-foreground))"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              dy={8}
              interval="preserveStartEnd"
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `$${(v / 1000).toFixed(1)}k`}
              width={48}
              domain={["auto", "auto"]}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "hsl(var(--muted-foreground))", strokeWidth: 1, strokeDasharray: "4 4" }} />
            <Area
              type="monotone"
              dataKey="value"
              stroke={strokeColor}
              strokeWidth={2}
              fill={`url(#${gradientId})`}
              dot={false}
              activeDot={{
                r: 5,
                fill: strokeColor,
                stroke: "hsl(var(--background))",
                strokeWidth: 2,
                filter: "url(#lineGlow)",
              }}
              animationDuration={600}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 p-6 pt-4">
        {[
          { label: "Buying Power", value: formatDollar(data.paper_cash, 2), color: "text-success" },
          { label: "Positions", value: formatDollar(Object.values(data.paper_holdings).reduce((s, h) => s + h.shares * h.avgCost, 0), 2), color: "text-primary" },
          { label: "Trades", value: String(data.paper_trades.length), color: "text-foreground" },
        ].map((stat) => (
          <div key={stat.label} className="p-3 rounded-xl bg-muted/30 border border-border/30">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-0.5">{stat.label}</p>
            <p className={`text-sm font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>
    </Card>
  );
};

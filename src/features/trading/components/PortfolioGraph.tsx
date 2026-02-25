import { useState, useMemo, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { usePortfolioValue } from "@/hooks/usePortfolioValue";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  ReferenceLine, CartesianGrid, ComposedChart, Line,
} from "recharts";
import { TrendingUp, TrendingDown, Activity, BarChart3, Eye, EyeOff, Star } from "lucide-react";
import { formatDollar } from "@/lib/formatters";
import { motion, AnimatePresence } from "framer-motion";

type TimeFrame = "1D" | "1W" | "1M" | "3M" | "YTD" | "1Y" | "All";

// Generate synthetic SPY benchmark data relative to portfolio timeline
const generateBenchmarkData = (length: number, startValue: number) => {
  let value = startValue;
  const points: number[] = [];
  for (let i = 0; i < length; i++) {
    value *= 1 + (Math.random() - 0.48) * 0.015;
    points.push(value);
  }
  return points;
};

// Custom crosshair tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const data = payload[0]?.payload;
  if (!data) return null;

  const pnl = data.value - (data.prevValue || data.value);
  const isUp = pnl >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-2xl border border-border/50 bg-popover/95 backdrop-blur-xl p-4 shadow-2xl min-w-[200px]"
    >
      <p className="text-xs text-muted-foreground font-medium mb-2">{label}</p>
      <p className="text-xl font-bold text-foreground">{formatDollar(data.value, 2)}</p>
      <div className="flex items-center gap-2 mt-1">
        {isUp ? (
          <TrendingUp className="w-3 h-3 text-success" />
        ) : (
          <TrendingDown className="w-3 h-3 text-destructive" />
        )}
        <span className={`text-xs font-semibold ${isUp ? "text-success" : "text-destructive"}`}>
          {isUp ? "+" : ""}{formatDollar(pnl, 2)} daily P&L
        </span>
      </div>
      {data.benchmark && (
        <p className="text-xs text-muted-foreground mt-1.5 pt-1.5 border-t border-border/50">
          SPY: {formatDollar(data.benchmark, 2)}
        </p>
      )}
      {data.trade && (
        <div className="mt-1.5 pt-1.5 border-t border-border/50">
          <p className="text-xs text-primary font-medium">📈 {data.trade}</p>
        </div>
      )}
    </motion.div>
  );
};

export const PortfolioGraph = () => {
  const { user } = useAuth();
  const { totalValue, unrealizedPnL, buyingPower, positionsValue, unsettledCash } = usePortfolioValue();
  const [timeFrame, setTimeFrame] = useState<TimeFrame>("1M");
  const [showBenchmark, setShowBenchmark] = useState(false);
  const [showDrawdown, setShowDrawdown] = useState(false);
  const [showVolatility, setShowVolatility] = useState(false);

  const { data: historicalData = [] } = useQuery({
    queryKey: ["portfolio-history", user?.id, timeFrame],
    queryFn: async () => {
      const { data: transactions, error } = await supabase
        .from("transaction_logs")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: true });

      if (error) throw error;

      const dataPoints: { date: string; value: number; prevValue: number; trade?: string; fullDate: string }[] = [];
      let currentValue = 10000;
      let prevValue = 10000;

      if (transactions && transactions.length > 0) {
        transactions.forEach((tx) => {
          prevValue = currentValue;
          if (tx.balance_after) {
            currentValue = Number(tx.balance_after);
          }
          dataPoints.push({
            date: new Date(tx.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            }),
            fullDate: tx.created_at,
            value: currentValue,
            prevValue,
            trade: tx.description || undefined,
          });
        });
      }

      // Fill in synthetic data if not enough points
      if (dataPoints.length < 5) {
        const syntheticCount = 30;
        const startVal = 10000;
        let val = startVal;
        for (let i = syntheticCount; i > 0; i--) {
          const prev = val;
          val *= 1 + (Math.random() - 0.47) * 0.02;
          const d = new Date();
          d.setDate(d.getDate() - i);
          dataPoints.push({
            date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
            fullDate: d.toISOString(),
            value: val,
            prevValue: prev,
          });
        }
      }

      dataPoints.push({
        date: "Now",
        fullDate: new Date().toISOString(),
        value: totalValue,
        prevValue: dataPoints[dataPoints.length - 1]?.value || totalValue,
      });

      const maxPoints =
        timeFrame === "1D" ? 24 :
        timeFrame === "1W" ? 7 :
        timeFrame === "1M" ? 30 :
        timeFrame === "3M" ? 90 :
        timeFrame === "YTD" ? 180 :
        timeFrame === "1Y" ? 365 :
        dataPoints.length;

      return dataPoints.slice(-maxPoints);
    },
    enabled: !!user?.id,
  });

  // Computed data with benchmark, drawdown, volatility
  const chartData = useMemo(() => {
    if (historicalData.length === 0) return [];
    const benchmarkPoints = generateBenchmarkData(historicalData.length, historicalData[0].value);
    let peak = historicalData[0].value;

    return historicalData.map((point, i) => {
      if (point.value > peak) peak = point.value;
      const drawdown = ((point.value - peak) / peak) * 100;
      
      // Simple rolling volatility (stddev of last 5 returns)
      let volatility = 0;
      if (i >= 5) {
        const returns = [];
        for (let j = i - 4; j <= i; j++) {
          returns.push((historicalData[j].value - historicalData[j - 1].value) / historicalData[j - 1].value);
        }
        const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
        volatility = Math.sqrt(returns.reduce((a, b) => a + (b - mean) ** 2, 0) / returns.length) * 100;
      }

      return {
        ...point,
        benchmark: benchmarkPoints[i],
        drawdown,
        volatility,
        volUpper: point.value * (1 + volatility / 100),
        volLower: point.value * (1 - volatility / 100),
      };
    });
  }, [historicalData]);

  // Find biggest gain day
  const biggestGain = useMemo(() => {
    if (chartData.length < 2) return null;
    let maxGain = 0;
    let maxIdx = 0;
    for (let i = 1; i < chartData.length; i++) {
      const gain = chartData[i].value - chartData[i].prevValue;
      if (gain > maxGain) {
        maxGain = gain;
        maxIdx = i;
      }
    }
    return maxGain > 0 ? { index: maxIdx, date: chartData[maxIdx].date, gain: maxGain } : null;
  }, [chartData]);

  const startValue = chartData[0]?.value || 10000;
  const currentValue = chartData[chartData.length - 1]?.value || totalValue;
  const changeAmount = currentValue - startValue;
  const changePercent = startValue > 0 ? (changeAmount / startValue) * 100 : 0;
  const isPositive = changeAmount >= 0;

  const timeFrames: TimeFrame[] = ["1D", "1W", "1M", "3M", "YTD", "1Y", "All"];

  const strokeColor = isPositive ? "hsl(var(--success))" : "hsl(var(--destructive))";
  const gradientId = isPositive ? "gradientPositive" : "gradientNegative";

  return (
    <Card className="overflow-hidden border border-border/50 shadow-2xl animate-fade-in bg-gradient-to-br from-background/80 via-card/60 to-muted/40 backdrop-blur-xl relative">
      {/* Glow effects */}
      <div
        className="absolute -top-40 -right-40 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-40"
        style={{
          background: isPositive
            ? "radial-gradient(circle, hsl(var(--success) / 0.3), transparent 70%)"
            : "radial-gradient(circle, hsl(var(--destructive) / 0.2), transparent 70%)",
        }}
      />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative p-6 pb-2">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          {/* Value display */}
          <div className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
              Portfolio Value
            </p>
            <motion.div
              key={currentValue}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex items-baseline gap-3"
            >
              <h2 className="text-4xl lg:text-5xl font-black tracking-tight">
                {formatDollar(currentValue, 2)}
              </h2>
              <Badge
                variant="secondary"
                className={`px-3 py-1.5 text-sm font-bold ${
                  isPositive
                    ? "bg-success/15 text-success border border-success/30"
                    : "bg-destructive/15 text-destructive border border-destructive/30"
                }`}
              >
                {isPositive ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                {isPositive ? "+" : ""}{changePercent.toFixed(2)}%
              </Badge>
            </motion.div>
            <p className="text-sm text-muted-foreground">
              {isPositive ? "+" : ""}{formatDollar(changeAmount, 2)} ({timeFrame})
            </p>
          </div>

          {/* Floating stat pill */}
          <AnimatePresence mode="wait">
            <motion.div
              key={timeFrame}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className={`self-start px-4 py-2 rounded-2xl text-sm font-bold backdrop-blur-md border ${
                isPositive
                  ? "bg-success/10 text-success border-success/20"
                  : "bg-destructive/10 text-destructive border-destructive/20"
              }`}
            >
              {isPositive ? "+" : ""}{changePercent.toFixed(2)}% this {timeFrame === "1D" ? "day" : timeFrame === "1W" ? "week" : timeFrame === "1M" ? "month" : "period"}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Time frame selectors */}
        <div className="flex items-center gap-1 mt-4 p-1 bg-muted/50 border border-border/50 rounded-xl w-fit">
          {timeFrames.map((tf) => (
            <Button
              key={tf}
              variant="ghost"
              size="sm"
              onClick={() => setTimeFrame(tf)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-300 ${
                timeFrame === tf
                  ? "bg-background text-foreground shadow-sm shadow-primary/10"
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
        transition={{ duration: 0.5 }}
        className="h-72 md:h-80 px-2 mt-2"
      >
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="gradientPositive" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0.35} />
                <stop offset="50%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0.1} />
                <stop offset="100%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradientNegative" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0.35} />
                <stop offset="50%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0.1} />
                <stop offset="100%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="volGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(262, 83%, 58%)" stopOpacity={0.08} />
                <stop offset="100%" stopColor="hsl(262, 83%, 58%)" stopOpacity={0.02} />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.15} vertical={false} />

            <XAxis
              dataKey="date"
              stroke="hsl(var(--muted-foreground))"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              dy={10}
              interval="preserveStartEnd"
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `$${(v / 1000).toFixed(1)}k`}
              width={52}
              domain={['auto', 'auto']}
            />

            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "hsl(var(--muted-foreground))", strokeWidth: 1, strokeDasharray: "4 4" }} />

            {/* Volatility shading */}
            {showVolatility && (
              <>
                <Area type="monotone" dataKey="volUpper" stroke="none" fill="url(#volGradient)" fillOpacity={1} />
                <Area type="monotone" dataKey="volLower" stroke="none" fill="transparent" />
              </>
            )}

            {/* Drawdown area */}
            {showDrawdown && (
              <Area
                type="monotone"
                dataKey="drawdown"
                yAxisId="drawdown"
                stroke="hsl(var(--destructive))"
                strokeWidth={1}
                fill="hsl(var(--destructive))"
                fillOpacity={0.08}
                strokeOpacity={0.4}
              />
            )}

            {/* Benchmark overlay */}
            {showBenchmark && (
              <Line
                type="monotone"
                dataKey="benchmark"
                stroke="hsl(var(--muted-foreground))"
                strokeWidth={1.5}
                strokeDasharray="6 3"
                dot={false}
                opacity={0.5}
              />
            )}

            {/* Main portfolio area */}
            <Area
              type="monotone"
              dataKey="value"
              stroke={strokeColor}
              strokeWidth={2.5}
              fill={`url(#${gradientId})`}
              dot={false}
              activeDot={{
                r: 6,
                fill: strokeColor,
                stroke: "hsl(var(--background))",
                strokeWidth: 3,
                filter: "url(#glow)",
              }}
              animationDuration={800}
              animationEasing="ease-out"
            />

            {/* Biggest gain day reference */}
            {biggestGain && (
              <ReferenceLine
                x={biggestGain.date}
                stroke="hsl(var(--warning))"
                strokeDasharray="3 3"
                strokeOpacity={0.6}
                label={{
                  value: `★ +${formatDollar(biggestGain.gain, 0)}`,
                  position: "top",
                  fill: "hsl(var(--warning))",
                  fontSize: 10,
                  fontWeight: 700,
                }}
              />
            )}

            {showDrawdown && (
              <YAxis yAxisId="drawdown" orientation="right" domain={['auto', 0]} tickFormatter={(v) => `${v.toFixed(0)}%`} fontSize={10} stroke="hsl(var(--destructive))" tickLine={false} axisLine={false} width={40} />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Pro Controls */}
      <div className="flex flex-wrap items-center gap-4 px-6 py-3 border-t border-border/30">
        <div className="flex items-center gap-2">
          <Switch checked={showBenchmark} onCheckedChange={setShowBenchmark} className="scale-75" />
          <span className="text-xs text-muted-foreground font-medium">SPY Benchmark</span>
        </div>
        <div className="flex items-center gap-2">
          <Switch checked={showDrawdown} onCheckedChange={setShowDrawdown} className="scale-75" />
          <span className="text-xs text-muted-foreground font-medium">Drawdown</span>
        </div>
        <div className="flex items-center gap-2">
          <Switch checked={showVolatility} onCheckedChange={setShowVolatility} className="scale-75" />
          <span className="text-xs text-muted-foreground font-medium">Volatility Band</span>
        </div>
        {biggestGain && (
          <div className="ml-auto flex items-center gap-1.5 text-xs text-warning font-semibold">
            <Star className="w-3.5 h-3.5" />
            Best day: +{formatDollar(biggestGain.gain, 0)} on {biggestGain.date}
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 p-6 pt-3">
        {[
          { label: "Buying Power", value: formatDollar(buyingPower, 2), color: "text-success", bg: "bg-success/10", icon: "💰" },
          { label: "Positions", value: formatDollar(positionsValue, 2), color: "text-primary", bg: "bg-primary/10", icon: "📊" },
          { label: "Unrealized P&L", value: `${unrealizedPnL >= 0 ? "+" : ""}${formatDollar(unrealizedPnL, 2)}`, color: unrealizedPnL >= 0 ? "text-success" : "text-destructive", bg: unrealizedPnL >= 0 ? "bg-success/10" : "bg-destructive/10", icon: unrealizedPnL >= 0 ? "📈" : "📉" },
          ...(unsettledCash > 0 ? [{ label: "Settling (T+2)", value: formatDollar(unsettledCash, 2), color: "text-warning", bg: "bg-warning/10", icon: "⏳" }] : [
            { label: "Total Return", value: `${isPositive ? "+" : ""}${changePercent.toFixed(2)}%`, color: isPositive ? "text-success" : "text-destructive", bg: isPositive ? "bg-success/10" : "bg-destructive/10", icon: "🎯" },
          ]),
        ].map((stat) => (
          <div
            key={stat.label}
            className="relative p-4 rounded-xl bg-muted/30 border border-border/30 hover:bg-muted/50 hover:border-border/50 transition-all duration-300 group"
          >
            <span className="absolute top-3 right-3 text-lg opacity-60 group-hover:opacity-100 transition-opacity">{stat.icon}</span>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">{stat.label}</p>
            <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>
    </Card>
  );
};

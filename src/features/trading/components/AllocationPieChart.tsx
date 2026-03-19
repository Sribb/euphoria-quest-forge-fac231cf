import { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card } from "@/components/ui/card";
import { usePaperTrading } from "@/hooks/usePaperTrading";
import { useQuery } from "@tanstack/react-query";
import { getQuote } from "@/lib/finnhub";
import { formatDollar } from "@/lib/formatters";
import { motion } from "framer-motion";

const COLORS = [
  "hsl(263, 84%, 58%)",
  "hsl(142, 71%, 45%)",
  "hsl(45, 93%, 58%)",
  "hsl(200, 80%, 55%)",
  "hsl(340, 75%, 55%)",
  "hsl(170, 65%, 45%)",
  "hsl(25, 90%, 55%)",
  "hsl(280, 60%, 50%)",
];

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const { name, value, percentage } = payload[0].payload;
  return (
    <div className="rounded-xl border border-border/50 bg-popover/95 backdrop-blur-xl p-3 shadow-2xl">
      <p className="text-sm font-semibold text-foreground">{name}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{formatDollar(value, 2)} · {percentage.toFixed(1)}%</p>
    </div>
  );
};

export const AllocationPieChart = () => {
  const { data } = usePaperTrading();
  const holdingSymbols = Object.keys(data.paper_holdings);

  // Fetch live prices for holdings
  const { data: livePrices = {} } = useQuery({
    queryKey: ["live-portfolio-prices", holdingSymbols.sort().join(",")],
    queryFn: async () => {
      const prices: Record<string, number> = {};
      await Promise.all(
        holdingSymbols.map(async (sym) => {
          try {
            const q = await getQuote(sym);
            if (q?.c) prices[sym] = q.c;
          } catch { /* fallback to avgCost */ }
        })
      );
      return prices;
    },
    enabled: holdingSymbols.length > 0,
    staleTime: 60000,
  });

  const { chartData, totalValue } = useMemo(() => {
    const holdings = data.paper_holdings;
    const entries = Object.entries(holdings);

    let total = data.paper_cash;
    const items = entries.map(([symbol, h]) => {
      const price = livePrices[symbol] || h.avgCost;
      const value = h.shares * price;
      total += value;
      return { name: symbol, value, percentage: 0 };
    });

    if (data.paper_cash > 0) {
      items.push({ name: "Cash", value: data.paper_cash, percentage: 0 });
    }

    // Calculate percentages
    items.forEach(item => {
      item.percentage = total > 0 ? (item.value / total) * 100 : 0;
    });

    return { chartData: items.sort((a, b) => b.value - a.value), totalValue: total };
  }, [data, livePrices]);

  if (chartData.length === 0) {
    return (
      <Card className="p-6 border border-border/50 bg-card/60 backdrop-blur-sm">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-4">Allocation</h3>
        <div className="flex items-center justify-center h-48 text-sm text-muted-foreground">
          No holdings yet
        </div>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      <Card className="p-6 border border-border/50 bg-card/60 backdrop-blur-sm">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-4">Allocation</h3>
        <div className="flex flex-col items-center gap-6">
          {/* Larger centered donut */}
          <div className="w-56 h-56 relative flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={2}
                  dataKey="value"
                  animationDuration={1000}
                  animationBegin={200}
                  animationEasing="ease-out"
                  stroke="none"
                >
                  {chartData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            {/* Center label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <p className="text-[10px] text-muted-foreground font-medium">Total</p>
              <p className="text-lg font-black text-foreground">{formatDollar(totalValue, 0)}</p>
            </div>
          </div>

          {/* Legend with dollar values */}
          <div className="flex flex-wrap gap-x-5 gap-y-2.5 justify-center">
            {chartData.map((entry, i) => (
              <motion.div
                key={entry.name}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.05 }}
                className="flex items-center gap-2"
              >
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: COLORS[i % COLORS.length] }}
                />
                <span className="text-xs font-medium text-foreground">{entry.name}</span>
                <span className="text-xs text-muted-foreground">
                  {formatDollar(entry.value, 0)} · {entry.percentage.toFixed(1)}%
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

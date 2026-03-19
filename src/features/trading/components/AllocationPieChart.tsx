import { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card } from "@/components/ui/card";
import { usePaperTrading } from "@/hooks/usePaperTrading";
import { usePortfolioValue } from "@/hooks/usePortfolioValue";
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
  const { totalValue } = usePortfolioValue();

  const chartData = useMemo(() => {
    const holdings = data.paper_holdings;
    const entries = Object.entries(holdings);

    const items = entries.map(([symbol, h]) => ({
      name: symbol,
      value: h.shares * h.avgCost,
      percentage: totalValue > 0 ? ((h.shares * h.avgCost) / totalValue) * 100 : 0,
    }));

    if (data.paper_cash > 0) {
      items.push({
        name: "Cash",
        value: data.paper_cash,
        percentage: totalValue > 0 ? (data.paper_cash / totalValue) * 100 : 0,
      });
    }

    return items.sort((a, b) => b.value - a.value);
  }, [data, totalValue]);

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
    <Card className="p-6 border border-border/50 bg-card/60 backdrop-blur-sm">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-4">Allocation</h3>
      <div className="flex flex-col lg:flex-row items-center gap-6">
        <div className="w-48 h-48 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                animationDuration={800}
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
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          {chartData.map((entry, i) => (
            <motion.div
              key={entry.name}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-2"
            >
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: COLORS[i % COLORS.length] }}
              />
              <span className="text-xs font-medium text-foreground">{entry.name}</span>
              <span className="text-xs text-muted-foreground">{entry.percentage.toFixed(1)}%</span>
            </motion.div>
          ))}
        </div>
      </div>
    </Card>
  );
};

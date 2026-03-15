import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PortfolioBreakdownProps {
  assets: { asset_name: string; asset_type: string; current_price: number; quantity: number }[];
  cashBalance: number;
}

const COLORS = [
  "bg-primary",
  "bg-[hsl(142,71%,45%)]",
  "bg-[hsl(200,84%,55%)]",
  "bg-[hsl(45,93%,58%)]",
  "bg-[hsl(0,84%,60%)]",
  "bg-[hsl(273,84%,65%)]",
  "bg-[hsl(160,80%,40%)]",
];

export const PortfolioBreakdown = ({ assets, cashBalance }: PortfolioBreakdownProps) => {
  const holdings = assets.map((a) => ({
    name: a.asset_name,
    value: a.current_price * a.quantity,
  }));

  if (cashBalance > 0) {
    holdings.push({ name: "Cash", value: cashBalance });
  }

  const total = holdings.reduce((s, h) => s + h.value, 0) || 1;
  const sorted = holdings.sort((a, b) => b.value - a.value).slice(0, 6);

  if (sorted.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 rounded-xl bg-card border border-border text-center text-sm text-muted-foreground"
      >
        No portfolio data yet. Make your first trade!
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-xl bg-card border border-border"
    >
      <h3 className="text-sm font-semibold mb-3">Portfolio Allocation</h3>
      
      {/* Bar */}
      <div className="flex h-3 rounded-full overflow-hidden mb-3 bg-muted/30">
        {sorted.map((h, i) => (
          <div
            key={h.name}
            className={cn("h-full transition-all", COLORS[i % COLORS.length])}
            style={{ width: `${(h.value / total) * 100}%` }}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
        {sorted.map((h, i) => (
          <div key={h.name} className="flex items-center gap-2">
            <div className={cn("w-2.5 h-2.5 rounded-sm shrink-0", COLORS[i % COLORS.length])} />
            <span className="text-xs text-foreground/80 truncate flex-1">{h.name}</span>
            <span className="text-xs text-muted-foreground font-medium">
              {Math.round((h.value / total) * 100)}%
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

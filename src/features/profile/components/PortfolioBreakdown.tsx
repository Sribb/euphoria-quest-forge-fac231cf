import { useMemo } from "react";
import { motion } from "framer-motion";

interface PortfolioBreakdownProps {
  assets: { asset_name: string; asset_type: string; current_price: number; quantity: number }[];
  cashBalance: number;
}

const COLORS = [
  "hsl(var(--primary))",
  "hsl(142, 71%, 45%)",
  "hsl(200, 84%, 55%)",
  "hsl(45, 93%, 58%)",
  "hsl(0, 84%, 60%)",
  "hsl(273, 84%, 65%)",
  "hsl(160, 80%, 40%)",
];

export const PortfolioBreakdown = ({ assets, cashBalance }: PortfolioBreakdownProps) => {
  const holdings = useMemo(() => {
    const h = assets.map((a) => ({
      name: a.asset_name,
      value: a.current_price * a.quantity,
    }));
    if (cashBalance > 0) h.push({ name: "Cash", value: cashBalance });
    return h.sort((a, b) => b.value - a.value).slice(0, 6);
  }, [assets, cashBalance]);

  const total = holdings.reduce((s, h) => s + h.value, 0) || 1;

  // Build pie chart segments
  const segments = useMemo(() => {
    let cumulative = 0;
    return holdings.map((h, i) => {
      const pct = (h.value / total) * 100;
      const startAngle = (cumulative / 100) * 360;
      cumulative += pct;
      const endAngle = (cumulative / 100) * 360;
      return { ...h, pct, startAngle, endAngle, color: COLORS[i % COLORS.length] };
    });
  }, [holdings, total]);

  if (holdings.length === 0) {
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

  // SVG pie chart
  const size = 140;
  const cx = size / 2;
  const cy = size / 2;
  const r = 52;
  const innerR = 32;

  const describeArc = (startAngle: number, endAngle: number, outerR: number, innerRadius: number) => {
    const startRad = ((startAngle - 90) * Math.PI) / 180;
    const endRad = ((endAngle - 90) * Math.PI) / 180;
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;

    const x1 = cx + outerR * Math.cos(startRad);
    const y1 = cy + outerR * Math.sin(startRad);
    const x2 = cx + outerR * Math.cos(endRad);
    const y2 = cy + outerR * Math.sin(endRad);
    const x3 = cx + innerRadius * Math.cos(endRad);
    const y3 = cy + innerRadius * Math.sin(endRad);
    const x4 = cx + innerRadius * Math.cos(startRad);
    const y4 = cy + innerRadius * Math.sin(startRad);

    return `M ${x1} ${y1} A ${outerR} ${outerR} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4} Z`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-xl bg-card border border-border"
    >
      <h3 className="text-sm font-semibold mb-4">Portfolio Allocation</h3>

      <div className="flex items-center gap-6">
        {/* Donut Chart */}
        <div className="shrink-0">
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {segments.map((seg, i) => {
              // Handle single-item full circle
              if (seg.pct >= 99.9) {
                return (
                  <circle
                    key={i}
                    cx={cx}
                    cy={cy}
                    r={(r + innerR) / 2}
                    fill="none"
                    stroke={seg.color}
                    strokeWidth={r - innerR}
                  />
                );
              }
              return (
                <path
                  key={i}
                  d={describeArc(seg.startAngle, seg.endAngle, r, innerR)}
                  fill={seg.color}
                  className="transition-all duration-300 hover:opacity-80"
                />
              );
            })}
            {/* Center text */}
            <text x={cx} y={cy - 4} textAnchor="middle" className="fill-foreground text-xs font-bold">
              ${(total / 1000).toFixed(1)}k
            </text>
            <text x={cx} y={cy + 10} textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 9 }}>
              Total
            </text>
          </svg>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-1.5">
          {segments.map((seg, i) => (
            <div key={seg.name} className="flex items-center gap-2">
              <div
                className="w-2.5 h-2.5 rounded-sm shrink-0"
                style={{ backgroundColor: seg.color }}
              />
              <span className="text-xs text-foreground/80 truncate flex-1">{seg.name}</span>
              <span className="text-xs text-muted-foreground font-medium">
                {Math.round(seg.pct)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

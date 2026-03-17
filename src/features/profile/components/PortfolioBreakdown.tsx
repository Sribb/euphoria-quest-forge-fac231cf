import { useMemo, useState } from "react";
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
  const [hovered, setHovered] = useState<number | null>(null);

  const holdings = useMemo(() => {
    const h = assets.map((a) => ({
      name: a.asset_name,
      value: a.current_price * a.quantity,
    }));
    if (cashBalance > 0) h.push({ name: "Cash", value: cashBalance });
    return h.sort((a, b) => b.value - a.value).slice(0, 7);
  }, [assets, cashBalance]);

  const total = holdings.reduce((s, h) => s + h.value, 0) || 1;

  const segments = useMemo(() => {
    let cumulative = 0;
    return holdings.map((h, i) => {
      const pct = (h.value / total) * 100;
      const startAngle = (cumulative / 100) * 360;
      cumulative += pct;
      const endAngle = (cumulative / 100) * 360;
      const midAngle = (startAngle + endAngle) / 2;
      return { ...h, pct, startAngle, endAngle, midAngle, color: COLORS[i % COLORS.length] };
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

  const size = 220;
  const cx = size / 2;
  const cy = size / 2;
  const r = 85;
  const innerR = 55;
  const hoverGrow = 8;

  const describeArc = (
    startAngle: number,
    endAngle: number,
    outerR: number,
    innerRadius: number,
    centerX: number,
    centerY: number
  ) => {
    const startRad = ((startAngle - 90) * Math.PI) / 180;
    const endRad = ((endAngle - 90) * Math.PI) / 180;
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;

    const x1 = centerX + outerR * Math.cos(startRad);
    const y1 = centerY + outerR * Math.sin(startRad);
    const x2 = centerX + outerR * Math.cos(endRad);
    const y2 = centerY + outerR * Math.sin(endRad);
    const x3 = centerX + innerRadius * Math.cos(endRad);
    const y3 = centerY + innerRadius * Math.sin(endRad);
    const x4 = centerX + innerRadius * Math.cos(startRad);
    const y4 = centerY + innerRadius * Math.sin(startRad);

    return `M ${x1} ${y1} A ${outerR} ${outerR} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4} Z`;
  };

  const hoveredSeg = hovered !== null ? segments[hovered] : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-xl bg-card border border-border"
    >
      <h3 className="text-sm font-semibold mb-2">Portfolio Allocation</h3>

      <div className="flex justify-center">
        <svg
          width={size + hoverGrow * 2}
          height={size + hoverGrow * 2}
          viewBox={`${-hoverGrow} ${-hoverGrow} ${size + hoverGrow * 2} ${size + hoverGrow * 2}`}
          className="overflow-visible"
          onMouseLeave={() => setHovered(null)}
        >
          {segments.map((seg, i) => {
            const isHovered = hovered === i;
            // Offset hovered slice outward
            const midRad = ((seg.midAngle - 90) * Math.PI) / 180;
            const offsetX = isHovered ? Math.cos(midRad) * 6 : 0;
            const offsetY = isHovered ? Math.sin(midRad) * 6 : 0;
            const outerR = isHovered ? r + hoverGrow : r;

            if (seg.pct >= 99.9) {
              return (
                <circle
                  key={i}
                  cx={cx + offsetX}
                  cy={cy + offsetY}
                  r={(outerR + innerR) / 2}
                  fill="none"
                  stroke={seg.color}
                  strokeWidth={outerR - innerR}
                  className="cursor-pointer transition-all duration-200"
                  style={{ opacity: hovered !== null && !isHovered ? 0.4 : 1 }}
                  onMouseEnter={() => setHovered(i)}
                />
              );
            }
            return (
              <path
                key={i}
                d={describeArc(seg.startAngle, seg.endAngle, outerR, innerR, cx + offsetX, cy + offsetY)}
                fill={seg.color}
                className="cursor-pointer transition-all duration-200"
                style={{
                  opacity: hovered !== null && !isHovered ? 0.4 : 1,
                  filter: isHovered ? "brightness(1.15)" : "none",
                }}
                onMouseEnter={() => setHovered(i)}
              />
            );
          })}

          {/* Center content - pointer-events none so hover works */}
          <g style={{ pointerEvents: "none" }}>
            {hoveredSeg ? (
              <>
                <text x={cx} y={cy - 12} textAnchor="middle" className="fill-foreground font-bold" style={{ fontSize: 13 }}>
                  {hoveredSeg.name}
                </text>
                <text x={cx} y={cy + 6} textAnchor="middle" className="fill-foreground font-bold" style={{ fontSize: 18 }}>
                  {Math.round(hoveredSeg.pct)}%
                </text>
                <text x={cx} y={cy + 22} textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 11 }}>
                  ${hoveredSeg.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </text>
              </>
            ) : (
              <>
                <text x={cx} y={cy - 4} textAnchor="middle" className="fill-foreground font-bold" style={{ fontSize: 16 }}>
                  ${(total / 1000).toFixed(1)}k
                </text>
                <text x={cx} y={cy + 12} textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>
                  Total
                </text>
              </>
            )}
          </g>
        </svg>
      </div>
    </motion.div>
  );
};

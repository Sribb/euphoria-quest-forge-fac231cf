import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { TrendingUp, Clock, Percent, DollarSign } from "lucide-react";
import { playSnap } from "@/lib/soundEffects";

interface CompoundGrowthExplorerProps {
  title?: string;
  description?: string;
  onComplete?: (score: number) => void;
}

export const CompoundGrowthExplorer = ({
  title = "Compound Growth Explorer",
  description = "Watch your money grow — adjust the inputs and see the magic of compounding in real time.",
}: CompoundGrowthExplorerProps) => {
  const [principal, setPrincipal] = useState(5000);
  const [monthly, setMonthly] = useState(200);
  const [rate, setRate] = useState(8);
  const [years, setYears] = useState(20);

  const data = useMemo(() => {
    const points: { year: number; invested: number; total: number }[] = [];
    const r = rate / 100 / 12;
    let total = principal;
    let invested = principal;

    for (let y = 0; y <= years; y++) {
      points.push({ year: y, invested: Math.round(invested), total: Math.round(total) });
      for (let m = 0; m < 12; m++) {
        total = total * (1 + r) + monthly;
        invested += monthly;
      }
    }
    return points;
  }, [principal, monthly, rate, years]);

  const final = data[data.length - 1];
  const totalInvested = final.invested;
  const totalValue = final.total;
  const interestEarned = totalValue - totalInvested;
  const maxVal = Math.max(...data.map((d) => d.total), 1);

  // SVG chart dimensions
  const W = 600;
  const H = 220;
  const PAD = 40;

  const toX = (year: number) => PAD + (year / years) * (W - PAD * 2);
  const toY = (val: number) => H - PAD - (val / maxVal) * (H - PAD * 2);

  const totalLine = data.map((d, i) => `${i === 0 ? "M" : "L"} ${toX(d.year)} ${toY(d.total)}`).join(" ");
  const investedLine = data.map((d, i) => `${i === 0 ? "M" : "L"} ${toX(d.year)} ${toY(d.invested)}`).join(" ");
  const areaPath = `${totalLine} L ${toX(years)} ${H - PAD} L ${PAD} ${H - PAD} Z`;

  return (
    <div className="p-5 rounded-2xl bg-muted/30 border border-border space-y-5">
      <div>
        <h3 className="font-bold text-foreground text-lg flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          {title}
        </h3>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { icon: DollarSign, label: "Starting Amount", value: principal, set: setPrincipal, min: 0, max: 50000, step: 500, fmt: (v: number) => `$${v.toLocaleString()}` },
          { icon: DollarSign, label: "Monthly Contribution", value: monthly, set: setMonthly, min: 0, max: 2000, step: 25, fmt: (v: number) => `$${v}/mo` },
          { icon: Percent, label: "Annual Return", value: rate, set: setRate, min: 1, max: 15, step: 0.5, fmt: (v: number) => `${v}%` },
          { icon: Clock, label: "Time Horizon", value: years, set: setYears, min: 1, max: 40, step: 1, fmt: (v: number) => `${v} yrs` },
        ].map(({ icon: Icon, label, value, set, min, max, step, fmt }) => (
          <div key={label} className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                <Icon className="w-3 h-3" /> {label}
              </label>
              <span className="text-sm font-bold text-primary">{fmt(value)}</span>
            </div>
            <Slider
              min={min}
              max={max}
              step={step}
              value={[value]}
              onValueChange={([v]) => set(v)}
              onValueCommit={() => playSnap()}
            />
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[600px] mx-auto" style={{ minHeight: 200 }}>
          {/* Grid */}
          {[0, 0.25, 0.5, 0.75, 1].map((f) => (
            <g key={f}>
              <line
                x1={PAD} y1={toY(f * maxVal)} x2={W - PAD} y2={toY(f * maxVal)}
                className="stroke-border" strokeWidth={0.5} strokeDasharray="4 4"
              />
              <text x={PAD - 4} y={toY(f * maxVal) + 4} textAnchor="end" className="fill-muted-foreground text-[9px]">
                ${(f * maxVal / 1000).toFixed(0)}k
              </text>
            </g>
          ))}

          {/* Area fill */}
          <path d={areaPath} fill="hsl(var(--primary))" fillOpacity={0.08} />

          {/* Invested line */}
          <path d={investedLine} fill="none" stroke="hsl(var(--muted-foreground))" strokeWidth={1.5} strokeDasharray="5 5" />

          {/* Total line */}
          <path d={totalLine} fill="none" stroke="hsl(var(--primary))" strokeWidth={2.5} />

          {/* End dot */}
          <circle cx={toX(years)} cy={toY(totalValue)} r={5} fill="hsl(var(--primary))" />

          {/* X axis labels */}
          {data.filter((_, i) => i % Math.max(1, Math.floor(years / 5)) === 0 || i === data.length - 1).map((d) => (
            <text key={d.year} x={toX(d.year)} y={H - 10} textAnchor="middle" className="fill-muted-foreground text-[9px]">
              {d.year}yr
            </text>
          ))}

          {/* Legend */}
          <line x1={W - 140} y1={16} x2={W - 120} y2={16} stroke="hsl(var(--primary))" strokeWidth={2} />
          <text x={W - 116} y={20} className="fill-foreground text-[9px]">Total Value</text>
          <line x1={W - 140} y1={30} x2={W - 120} y2={30} stroke="hsl(var(--muted-foreground))" strokeWidth={1.5} strokeDasharray="4 4" />
          <text x={W - 116} y={34} className="fill-muted-foreground text-[9px]">Invested</text>
        </svg>
      </div>

      {/* Results */}
      <motion.div
        key={`${principal}-${monthly}-${rate}-${years}`}
        initial={{ scale: 0.97, opacity: 0.5 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="grid grid-cols-3 gap-3"
      >
        <div className="p-3 rounded-xl bg-muted/50 border border-border text-center">
          <p className="text-xs text-muted-foreground">You Invested</p>
          <p className="text-lg font-bold text-foreground">${totalInvested.toLocaleString()}</p>
        </div>
        <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 text-center">
          <p className="text-xs text-muted-foreground">Interest Earned</p>
          <p className="text-lg font-bold text-primary">${interestEarned.toLocaleString()}</p>
        </div>
        <div className="p-3 rounded-xl bg-primary/10 border border-primary/30 text-center">
          <p className="text-xs text-muted-foreground">Total Value</p>
          <p className="text-lg font-black text-primary">${totalValue.toLocaleString()}</p>
        </div>
      </motion.div>

      <p className="text-xs text-muted-foreground italic text-center">
        {interestEarned > totalInvested
          ? "🚀 Compounding earned you MORE than what you put in — that's the power of time!"
          : years < 10
          ? "💡 Try increasing the time horizon — compounding accelerates over decades."
          : rate < 6
          ? "💡 A higher return rate dramatically changes the outcome. Consider diversified index funds."
          : "👍 Great setup! Notice how small monthly changes create massive long-term differences."}
      </p>
    </div>
  );
};

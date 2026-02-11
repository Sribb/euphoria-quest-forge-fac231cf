import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const COMPANIES = [
  { name: "FastGrow Tech", pe: 45, roe: 28, debtEq: 0.3, currentRatio: 3.2, sector: "Tech" },
  { name: "SteadyBank Ltd", pe: 12, roe: 14, debtEq: 8.5, currentRatio: 1.1, sector: "Financial" },
  { name: "RetailMax Inc", pe: 18, roe: 22, debtEq: 1.2, currentRatio: 1.8, sector: "Consumer" },
  { name: "EnergyPrime Co", pe: 8, roe: 16, debtEq: 0.9, currentRatio: 1.4, sector: "Energy" },
];

const BENCHMARKS: Record<string, { pe: [number, number]; roe: [number, number]; debtEq: [number, number]; currentRatio: [number, number] }> = {
  Tech: { pe: [20, 40], roe: [15, 30], debtEq: [0, 1], currentRatio: [1.5, 4] },
  Financial: { pe: [8, 15], roe: [10, 18], debtEq: [5, 12], currentRatio: [1, 1.5] },
  Consumer: { pe: [12, 25], roe: [12, 25], debtEq: [0.5, 2], currentRatio: [1.2, 2.5] },
  Energy: { pe: [5, 15], roe: [8, 20], debtEq: [0.3, 1.5], currentRatio: [1, 2] },
};

function ratingColor(value: number, range: [number, number]) {
  if (value >= range[0] && value <= range[1]) return "text-emerald-500";
  return "text-amber-500";
}

export const FinancialRatiosToolkit = () => {
  const [selected, setSelected] = useState(0);
  const company = COMPANIES[selected];
  const bench = BENCHMARKS[company.sector];

  const ratios = [
    { label: "P/E Ratio", value: company.pe, range: bench.pe, desc: "Price relative to earnings" },
    { label: "ROE (%)", value: company.roe, range: bench.roe, desc: "Return on shareholders' equity" },
    { label: "Debt/Equity", value: company.debtEq, range: bench.debtEq, desc: "Financial leverage" },
    { label: "Current Ratio", value: company.currentRatio, range: bench.currentRatio, desc: "Short-term liquidity" },
  ];

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">Compare financial ratios across companies. Green = within sector benchmark range.</p>
      <div className="flex gap-2 flex-wrap">
        {COMPANIES.map((c, i) => (
          <Button key={i} variant={selected === i ? "default" : "outline"} size="sm" onClick={() => setSelected(i)}>
            {c.name}
          </Button>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">Sector: <span className="font-medium text-foreground">{company.sector}</span></p>

      <div className="grid grid-cols-2 gap-3">
        {ratios.map((r) => (
          <Card key={r.label} className="p-4 bg-card/60 border-border/50">
            <p className="text-xs text-muted-foreground">{r.label}</p>
            <p className={cn("text-2xl font-bold", ratingColor(r.value, r.range))}>{r.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{r.desc}</p>
            <p className="text-xs text-muted-foreground">Benchmark: {r.range[0]}–{r.range[1]}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};

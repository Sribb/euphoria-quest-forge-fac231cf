import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const CapitalBudgetingLab = () => {
  const [initialInvest, setInitialInvest] = useState(1000);
  const [cashFlow, setCashFlow] = useState(300);
  const [years, setYears] = useState(5);
  const [discountRate, setDiscountRate] = useState(10);

  const cfs = Array.from({ length: years }, (_, i) => cashFlow);
  const npv = cfs.reduce((sum, cf, i) => sum + cf / Math.pow(1 + discountRate / 100, i + 1), 0) - initialInvest;
  const payback = cashFlow > 0 ? (initialInvest / cashFlow).toFixed(1) : "N/A";
  
  // Simple IRR approximation via bisection
  const calcIRR = () => {
    let low = -0.5, high = 5;
    for (let iter = 0; iter < 100; iter++) {
      const mid = (low + high) / 2;
      const val = cfs.reduce((s, cf, i) => s + cf / Math.pow(1 + mid, i + 1), 0) - initialInvest;
      if (val > 0) low = mid; else high = mid;
    }
    return ((low + high) / 2 * 100).toFixed(1);
  };
  const irr = calcIRR();

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">Evaluate an investment project using NPV, IRR, and payback period. Adjust the variables to find the breakeven point.</p>

      <div className="space-y-3">
        {[
          { label: "Initial Investment", value: initialInvest, set: setInitialInvest, max: 5000, suffix: "M" },
          { label: "Annual Cash Flow", value: cashFlow, set: setCashFlow, max: 2000, suffix: "M" },
          { label: "Project Duration", value: years, set: setYears, max: 15, suffix: " yrs" },
          { label: "Discount Rate", value: discountRate, set: setDiscountRate, max: 25, suffix: "%" },
        ].map((c) => (
          <div key={c.label} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{c.label}</span>
              <span className="font-medium text-foreground">{c.suffix === "%" ? `${c.value}%` : c.suffix === " yrs" ? `${c.value} years` : `$${c.value}M`}</span>
            </div>
            <Slider value={[c.value]} onValueChange={([v]) => c.set(v)} max={c.max} step={c.max > 100 ? 50 : 1} min={c.label.includes("Duration") ? 1 : 0} />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Card className={cn("p-4 border-border/50 text-center", npv >= 0 ? "bg-emerald-500/10 border-emerald-500/30" : "bg-destructive/10 border-destructive/30")}>
          <p className="text-xs text-muted-foreground">NPV</p>
          <p className={cn("text-xl font-bold", npv >= 0 ? "text-emerald-500" : "text-destructive")}>${Math.round(npv)}M</p>
          <p className="text-xs text-muted-foreground mt-1">{npv >= 0 ? "Accept ✓" : "Reject ✗"}</p>
        </Card>
        <Card className="p-4 bg-card/60 border-border/50 text-center">
          <p className="text-xs text-muted-foreground">IRR</p>
          <p className={cn("text-xl font-bold", Number(irr) > discountRate ? "text-emerald-500" : "text-destructive")}>{irr}%</p>
          <p className="text-xs text-muted-foreground mt-1">vs {discountRate}% hurdle</p>
        </Card>
        <Card className="p-4 bg-card/60 border-border/50 text-center">
          <p className="text-xs text-muted-foreground">Payback</p>
          <p className="text-xl font-bold text-foreground">{payback} yrs</p>
        </Card>
      </div>
    </div>
  );
};

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DollarSign, AlertTriangle, TrendingUp } from "lucide-react";

const PACKAGES = [
  {
    ceo: "Sarah Chen — TechGiant",
    baseSalary: 1.5,
    bonus: 3.0,
    stockOptions: 12.0,
    rsu: 8.0,
    perks: 0.5,
    companyPerf: { revenue: 15, stockReturn: 25, employeeSat: 72 },
  },
  {
    ceo: "James Miller — RetailMax",
    baseSalary: 2.0,
    bonus: 5.0,
    stockOptions: 2.0,
    rsu: 1.0,
    perks: 1.5,
    companyPerf: { revenue: -3, stockReturn: -12, employeeSat: 45 },
  },
  {
    ceo: "Maria Santos — SteadyGrowth",
    baseSalary: 0.8,
    bonus: 1.2,
    stockOptions: 4.0,
    rsu: 3.0,
    perks: 0.2,
    companyPerf: { revenue: 8, stockReturn: 14, employeeSat: 85 },
  },
];

export const ExecCompAnalysis = () => {
  const [selected, setSelected] = useState(0);
  const pkg = PACKAGES[selected];
  const total = pkg.baseSalary + pkg.bonus + pkg.stockOptions + pkg.rsu + pkg.perks;
  const equityPct = ((pkg.stockOptions + pkg.rsu) / total * 100).toFixed(0);
  const isAligned = pkg.companyPerf.stockReturn > 0 && Number(equityPct) > 50;

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">Analyze CEO compensation packages and judge whether pay is aligned with performance.</p>

      <div className="flex gap-2 flex-wrap">
        {PACKAGES.map((p, i) => (
          <Button key={i} variant={selected === i ? "default" : "outline"} size="sm" onClick={() => setSelected(i)}>
            {p.ceo.split("—")[0].trim()}
          </Button>
        ))}
      </div>

      <Card className="p-4 bg-card/60 border-border/50 space-y-3">
        <h4 className="font-semibold text-foreground">{pkg.ceo}</h4>
        <div className="space-y-1">
          {[
            { label: "Base Salary", value: pkg.baseSalary },
            { label: "Cash Bonus", value: pkg.bonus },
            { label: "Stock Options", value: pkg.stockOptions },
            { label: "RSUs", value: pkg.rsu },
            { label: "Perks", value: pkg.perks },
          ].map((item) => (
            <div key={item.label} className="flex justify-between text-sm">
              <span className="text-muted-foreground">{item.label}</span>
              <span className="font-medium text-foreground">${item.value}M</span>
            </div>
          ))}
          <div className="flex justify-between text-sm font-bold pt-2 border-t border-border/30">
            <span className="text-foreground">Total Compensation</span>
            <span className="text-primary">${total.toFixed(1)}M</span>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-3 gap-3">
        <Card className="p-3 bg-card/60 border-border/50 text-center">
          <p className="text-xs text-muted-foreground">Revenue Growth</p>
          <p className={cn("text-lg font-bold", pkg.companyPerf.revenue >= 0 ? "text-emerald-500" : "text-destructive")}>{pkg.companyPerf.revenue}%</p>
        </Card>
        <Card className="p-3 bg-card/60 border-border/50 text-center">
          <p className="text-xs text-muted-foreground">Stock Return</p>
          <p className={cn("text-lg font-bold", pkg.companyPerf.stockReturn >= 0 ? "text-emerald-500" : "text-destructive")}>{pkg.companyPerf.stockReturn}%</p>
        </Card>
        <Card className="p-3 bg-card/60 border-border/50 text-center">
          <p className="text-xs text-muted-foreground">Equity-linked</p>
          <p className="text-lg font-bold text-foreground">{equityPct}%</p>
        </Card>
      </div>

      <Card className={cn("p-3 border text-center text-sm font-medium", isAligned ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500" : "bg-amber-500/10 border-amber-500/30 text-amber-500")}>
        {isAligned ? <TrendingUp className="w-4 h-4 inline mr-1" /> : <AlertTriangle className="w-4 h-4 inline mr-1" />}
        {isAligned ? "Pay appears well-aligned with shareholder value" : "Potential misalignment — high pay despite weak performance or low equity component"}
      </Card>
    </div>
  );
};

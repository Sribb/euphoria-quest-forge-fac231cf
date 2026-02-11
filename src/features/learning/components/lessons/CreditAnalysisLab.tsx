import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

const COMPANIES = [
  { name: "AAA-Rated Corp", rating: "AAA", spread: 0.5, defaultProb: 0.01, coverage: 15, leverage: 0.2 },
  { name: "BBB Borderline", rating: "BBB-", spread: 2.5, defaultProb: 2.5, coverage: 3.5, leverage: 0.55 },
  { name: "Junk Bond Issuer", rating: "B", spread: 6.0, defaultProb: 12, coverage: 1.5, leverage: 0.8 },
];

export const CreditAnalysisLab = () => {
  const [selected, setSelected] = useState(0);
  const [interestRate, setInterestRate] = useState(5);
  const company = COMPANIES[selected];
  const yieldToMaturity = interestRate + company.spread;

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">Compare corporate credit profiles and understand how ratings translate to risk and yield.</p>

      <div className="flex gap-2 flex-wrap">
        {COMPANIES.map((c, i) => (
          <Button key={i} variant={selected === i ? "default" : "outline"} size="sm" onClick={() => setSelected(i)}>
            {c.name}
          </Button>
        ))}
      </div>

      <div className="space-y-1">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Base Interest Rate</span>
          <span className="font-medium text-foreground">{interestRate}%</span>
        </div>
        <Slider value={[interestRate]} onValueChange={([v]) => setInterestRate(v)} max={10} step={0.5} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Card className="p-4 bg-card/60 border-border/50 text-center">
          <p className="text-xs text-muted-foreground">Credit Rating</p>
          <p className={cn("text-2xl font-bold", company.rating.startsWith("A") ? "text-emerald-500" : company.rating.startsWith("B") && company.rating.length <= 3 ? "text-amber-500" : "text-destructive")}>
            {company.rating}
          </p>
        </Card>
        <Card className="p-4 bg-card/60 border-border/50 text-center">
          <p className="text-xs text-muted-foreground">Yield to Maturity</p>
          <p className="text-2xl font-bold text-foreground">{yieldToMaturity.toFixed(1)}%</p>
        </Card>
        <Card className="p-4 bg-card/60 border-border/50 text-center">
          <p className="text-xs text-muted-foreground">Default Probability</p>
          <p className={cn("text-xl font-bold", company.defaultProb < 1 ? "text-emerald-500" : company.defaultProb < 5 ? "text-amber-500" : "text-destructive")}>
            {company.defaultProb}%
          </p>
        </Card>
        <Card className="p-4 bg-card/60 border-border/50 text-center">
          <p className="text-xs text-muted-foreground">Interest Coverage</p>
          <p className={cn("text-xl font-bold", company.coverage > 5 ? "text-emerald-500" : company.coverage > 2 ? "text-amber-500" : "text-destructive")}>
            {company.coverage}x
          </p>
        </Card>
      </div>

      <div className="h-6 rounded-full overflow-hidden flex">
        <div className="bg-emerald-500 transition-all" style={{ width: `${(1 - company.leverage) * 100}%` }} />
        <div className="bg-destructive transition-all" style={{ width: `${company.leverage * 100}%` }} />
      </div>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Equity {((1 - company.leverage) * 100).toFixed(0)}%</span>
        <span>Debt {(company.leverage * 100).toFixed(0)}%</span>
      </div>
    </div>
  );
};

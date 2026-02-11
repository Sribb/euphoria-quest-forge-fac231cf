import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

export const WACCCalculator = () => {
  const [equityWeight, setEquityWeight] = useState(60);
  const [riskFree, setRiskFree] = useState(4);
  const [beta, setBeta] = useState(1.2);
  const [marketReturn, setMarketReturn] = useState(10);
  const [costOfDebt, setCostOfDebt] = useState(5);
  const [taxRate, setTaxRate] = useState(25);

  const debtWeight = 100 - equityWeight;
  const costOfEquity = riskFree + beta * (marketReturn - riskFree);
  const afterTaxDebt = costOfDebt * (1 - taxRate / 100);
  const wacc = (equityWeight / 100) * costOfEquity + (debtWeight / 100) * afterTaxDebt;

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">Calculate WACC using the CAPM model. Adjust inputs to understand what drives a company's cost of capital.</p>

      <div className="space-y-3">
        {[
          { label: "Equity Weight (%)", value: equityWeight, set: setEquityWeight, max: 100 },
          { label: "Risk-Free Rate (%)", value: riskFree, set: setRiskFree, max: 10 },
          { label: "Beta", value: beta, set: (v: number) => setBeta(v), max: 3, step: 0.1 },
          { label: "Market Return (%)", value: marketReturn, set: setMarketReturn, max: 20 },
          { label: "Cost of Debt (%)", value: costOfDebt, set: setCostOfDebt, max: 15 },
          { label: "Tax Rate (%)", value: taxRate, set: setTaxRate, max: 40 },
        ].map((c) => (
          <div key={c.label} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{c.label}</span>
              <span className="font-medium text-foreground">{typeof c.value === 'number' && c.value % 1 !== 0 ? c.value.toFixed(1) : c.value}{c.label.includes("Beta") ? "x" : "%"}</span>
            </div>
            <Slider value={[c.value * (c.step ? 10 : 1)]} onValueChange={([v]) => c.set(c.step ? v / 10 : v)} max={c.max * (c.step ? 10 : 1)} step={1} />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Card className="p-4 bg-card/60 border-border/50 text-center">
          <p className="text-xs text-muted-foreground">Cost of Equity (CAPM)</p>
          <p className="text-xl font-bold text-foreground">{costOfEquity.toFixed(2)}%</p>
        </Card>
        <Card className="p-4 bg-card/60 border-border/50 text-center">
          <p className="text-xs text-muted-foreground">After-Tax Debt Cost</p>
          <p className="text-xl font-bold text-foreground">{afterTaxDebt.toFixed(2)}%</p>
        </Card>
        <Card className="p-4 bg-primary/10 border-primary/30 text-center">
          <p className="text-xs text-muted-foreground">WACC</p>
          <p className={cn("text-2xl font-bold", wacc < 8 ? "text-emerald-500" : wacc < 12 ? "text-amber-500" : "text-destructive")}>{wacc.toFixed(2)}%</p>
        </Card>
      </div>

      <p className="text-xs text-muted-foreground">
        💡 Projects must earn above the WACC ({wacc.toFixed(1)}%) to create shareholder value. A lower WACC means cheaper capital and higher firm value.
      </p>
    </div>
  );
};

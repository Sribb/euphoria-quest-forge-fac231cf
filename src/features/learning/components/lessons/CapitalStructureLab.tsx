import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

export const CapitalStructureLab = () => {
  const [debtPct, setDebtPct] = useState(40);
  const [costOfDebt, setCostOfDebt] = useState(5);
  const [costOfEquity, setCostOfEquity] = useState(12);
  const [taxRate, setTaxRate] = useState(25);

  const equityPct = 100 - debtPct;
  const afterTaxDebt = costOfDebt * (1 - taxRate / 100);
  const wacc = (debtPct / 100) * afterTaxDebt + (equityPct / 100) * costOfEquity;

  // Simulated firm value (inverse relationship with WACC)
  const firmValue = Math.round(1000 / (wacc / 100));

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">Adjust the debt-equity mix and see how it impacts the weighted average cost of capital and firm value.</p>

      <div className="space-y-4">
        {[
          { label: "Debt %", value: debtPct, set: setDebtPct, max: 90, suffix: "%" },
          { label: "Cost of Debt", value: costOfDebt, set: setCostOfDebt, max: 15, suffix: "%" },
          { label: "Cost of Equity", value: costOfEquity, set: setCostOfEquity, max: 25, suffix: "%" },
          { label: "Tax Rate", value: taxRate, set: setTaxRate, max: 40, suffix: "%" },
        ].map((c) => (
          <div key={c.label} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{c.label}</span>
              <span className="font-medium text-foreground">{c.value}{c.suffix}</span>
            </div>
            <Slider value={[c.value]} onValueChange={([v]) => c.set(v)} max={c.max} step={1} />
          </div>
        ))}
      </div>

      {/* Visual: Debt vs Equity bar */}
      <div className="h-8 rounded-full overflow-hidden flex">
        <div className="bg-destructive/70 transition-all flex items-center justify-center text-xs font-bold text-white" style={{ width: `${debtPct}%` }}>
          {debtPct > 15 && `Debt ${debtPct}%`}
        </div>
        <div className="bg-emerald-500 transition-all flex items-center justify-center text-xs font-bold text-white" style={{ width: `${equityPct}%` }}>
          {equityPct > 15 && `Equity ${equityPct}%`}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Card className="p-4 bg-card/60 border-border/50 text-center">
          <p className="text-xs text-muted-foreground">WACC</p>
          <p className={cn("text-2xl font-bold", wacc < 8 ? "text-emerald-500" : wacc < 12 ? "text-amber-500" : "text-destructive")}>{wacc.toFixed(2)}%</p>
        </Card>
        <Card className="p-4 bg-card/60 border-border/50 text-center">
          <p className="text-xs text-muted-foreground">Tax Shield</p>
          <p className="text-2xl font-bold text-primary">{(costOfDebt - afterTaxDebt).toFixed(2)}%</p>
        </Card>
        <Card className="p-4 bg-card/60 border-border/50 text-center">
          <p className="text-xs text-muted-foreground">Firm Value</p>
          <p className="text-2xl font-bold text-foreground">${firmValue}M</p>
        </Card>
      </div>

      {debtPct > 70 && (
        <p className="text-sm text-destructive font-medium">⚠️ High leverage increases bankruptcy risk and may raise cost of debt.</p>
      )}
    </div>
  );
};

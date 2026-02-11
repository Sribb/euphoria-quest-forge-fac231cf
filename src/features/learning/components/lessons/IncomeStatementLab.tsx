import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

export const IncomeStatementLab = () => {
  const [revenue, setRevenue] = useState(1000);
  const [cogs, setCogs] = useState(400);
  const [opex, setOpex] = useState(300);
  const [interest, setInterest] = useState(50);
  const [taxRate, setTaxRate] = useState(25);

  const grossProfit = revenue - cogs;
  const operatingIncome = grossProfit - opex;
  const ebt = operatingIncome - interest;
  const taxes = Math.max(0, ebt * (taxRate / 100));
  const netIncome = ebt - taxes;

  const grossMargin = revenue > 0 ? ((grossProfit / revenue) * 100).toFixed(1) : "0";
  const opMargin = revenue > 0 ? ((operatingIncome / revenue) * 100).toFixed(1) : "0";
  const netMargin = revenue > 0 ? ((netIncome / revenue) * 100).toFixed(1) : "0";

  const waterfall = [
    { label: "Revenue", value: revenue, color: "bg-primary" },
    { label: "COGS", value: -cogs, color: "bg-destructive/70" },
    { label: "Gross Profit", value: grossProfit, color: "bg-emerald-500" },
    { label: "OpEx", value: -opex, color: "bg-destructive/70" },
    { label: "Operating Income", value: operatingIncome, color: operatingIncome >= 0 ? "bg-emerald-500" : "bg-destructive" },
    { label: "Interest", value: -interest, color: "bg-destructive/70" },
    { label: "Taxes", value: -taxes, color: "bg-amber-500/70" },
    { label: "Net Income", value: netIncome, color: netIncome >= 0 ? "bg-emerald-500" : "bg-destructive" },
  ];

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">Build an income statement from scratch. Adjust inputs and watch the profit waterfall react.</p>

      <div className="space-y-3">
        {[
          { label: "Revenue", value: revenue, set: setRevenue, max: 2000 },
          { label: "Cost of Goods Sold", value: cogs, set: setCogs, max: 1500 },
          { label: "Operating Expenses", value: opex, set: setOpex, max: 1000 },
          { label: "Interest Expense", value: interest, set: setInterest, max: 200 },
          { label: "Tax Rate (%)", value: taxRate, set: setTaxRate, max: 50 },
        ].map((c) => (
          <div key={c.label} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{c.label}</span>
              <span className="font-medium text-foreground">{c.label.includes("Rate") ? `${c.value}%` : `$${c.value}M`}</span>
            </div>
            <Slider value={[c.value]} onValueChange={([v]) => c.set(v)} max={c.max} step={5} />
          </div>
        ))}
      </div>

      {/* Waterfall */}
      <div className="space-y-2">
        {waterfall.map((item) => (
          <div key={item.label} className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground w-28 shrink-0">{item.label}</span>
            <div className="flex-1 h-6 bg-muted/30 rounded-full overflow-hidden relative">
              <div className={cn("h-full rounded-full transition-all", item.color)}
                style={{ width: `${Math.min(100, Math.abs(item.value / revenue) * 100)}%` }} />
            </div>
            <span className={cn("text-sm font-bold w-20 text-right", item.value >= 0 ? "text-foreground" : "text-destructive")}>
              {item.value >= 0 ? "" : "-"}${Math.abs(Math.round(item.value))}M
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Gross Margin", value: grossMargin },
          { label: "Operating Margin", value: opMargin },
          { label: "Net Margin", value: netMargin },
        ].map((m) => (
          <Card key={m.label} className="p-3 bg-card/60 border-border/50 text-center">
            <p className="text-xs text-muted-foreground">{m.label}</p>
            <p className={cn("text-lg font-bold", Number(m.value) >= 10 ? "text-emerald-500" : Number(m.value) >= 0 ? "text-amber-500" : "text-destructive")}>{m.value}%</p>
          </Card>
        ))}
      </div>
    </div>
  );
};

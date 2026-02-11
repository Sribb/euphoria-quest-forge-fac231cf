import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";

export const BalanceSheetExplorer = () => {
  const [cash, setCash] = useState(500);
  const [inventory, setInventory] = useState(300);
  const [ppe, setPpe] = useState(800);
  const [shortDebt, setShortDebt] = useState(200);
  const [longDebt, setLongDebt] = useState(600);

  const totalAssets = cash + inventory + ppe;
  const totalLiabilities = shortDebt + longDebt;
  const equity = totalAssets - totalLiabilities;
  const currentRatio = shortDebt > 0 ? ((cash + inventory) / shortDebt).toFixed(2) : "∞";
  const debtToEquity = equity > 0 ? (totalLiabilities / equity).toFixed(2) : "N/A";

  const controls = [
    { label: "Cash & Equivalents", value: cash, set: setCash, max: 2000 },
    { label: "Inventory", value: inventory, set: setInventory, max: 1000 },
    { label: "Property & Equipment", value: ppe, set: setPpe, max: 2000 },
    { label: "Short-term Debt", value: shortDebt, set: setShortDebt, max: 1000 },
    { label: "Long-term Debt", value: longDebt, set: setLongDebt, max: 2000 },
  ];

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">Adjust the balance sheet items and observe how financial health metrics change in real time.</p>

      <div className="space-y-4">
        {controls.map((c) => (
          <div key={c.label} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{c.label}</span>
              <span className="font-medium text-foreground">${c.value}M</span>
            </div>
            <Slider value={[c.value]} onValueChange={([v]) => c.set(v)} max={c.max} step={10} />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Card className="p-4 bg-card/60 border-border/50 text-center">
          <p className="text-xs text-muted-foreground">Total Assets</p>
          <p className="text-xl font-bold text-foreground">${totalAssets}M</p>
        </Card>
        <Card className="p-4 bg-card/60 border-border/50 text-center">
          <p className="text-xs text-muted-foreground">Equity</p>
          <p className={cn("text-xl font-bold", equity >= 0 ? "text-emerald-500" : "text-destructive")}>${equity}M</p>
        </Card>
        <Card className="p-4 bg-card/60 border-border/50 text-center">
          <p className="text-xs text-muted-foreground">Current Ratio</p>
          <p className={cn("text-xl font-bold", Number(currentRatio) >= 1.5 ? "text-emerald-500" : Number(currentRatio) >= 1 ? "text-amber-500" : "text-destructive")}>{currentRatio}</p>
        </Card>
        <Card className="p-4 bg-card/60 border-border/50 text-center">
          <p className="text-xs text-muted-foreground">Debt/Equity</p>
          <p className={cn("text-xl font-bold", Number(debtToEquity) <= 1 ? "text-emerald-500" : Number(debtToEquity) <= 2 ? "text-amber-500" : "text-destructive")}>{debtToEquity}</p>
        </Card>
      </div>

      {equity < 0 && (
        <p className="text-sm text-destructive font-medium">⚠️ Negative equity — this company is technically insolvent!</p>
      )}
    </div>
  );
};

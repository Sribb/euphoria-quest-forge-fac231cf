import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

export const WorkingCapitalSim = () => {
  const [receivables, setReceivables] = useState(200);
  const [inventory, setInventory] = useState(150);
  const [payables, setPayables] = useState(120);
  const [dailySales, setDailySales] = useState(10);

  const nwc = receivables + inventory - payables;
  const dso = dailySales > 0 ? Math.round(receivables / dailySales) : 0;
  const dio = dailySales > 0 ? Math.round(inventory / (dailySales * 0.6)) : 0;
  const dpo = dailySales > 0 ? Math.round(payables / (dailySales * 0.6)) : 0;
  const ccc = dso + dio - dpo;

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">Manage working capital by adjusting receivables, inventory, and payables. Watch the cash conversion cycle respond.</p>
      <div className="space-y-3">
        {[
          { label: "Accounts Receivable", value: receivables, set: setReceivables, max: 500 },
          { label: "Inventory", value: inventory, set: setInventory, max: 500 },
          { label: "Accounts Payable", value: payables, set: setPayables, max: 500 },
          { label: "Daily Sales", value: dailySales, set: setDailySales, max: 30 },
        ].map((c) => (
          <div key={c.label} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{c.label}</span>
              <span className="font-medium text-foreground">${c.value}M</span>
            </div>
            <Slider value={[c.value]} onValueChange={([v]) => c.set(v)} max={c.max} step={5} />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Card className="p-4 bg-card/60 border-border/50 text-center">
          <p className="text-xs text-muted-foreground">Net Working Capital</p>
          <p className={cn("text-xl font-bold", nwc >= 0 ? "text-emerald-500" : "text-destructive")}>${nwc}M</p>
        </Card>
        <Card className="p-4 bg-card/60 border-border/50 text-center">
          <p className="text-xs text-muted-foreground">Cash Conversion Cycle</p>
          <p className={cn("text-xl font-bold", ccc <= 30 ? "text-emerald-500" : ccc <= 60 ? "text-amber-500" : "text-destructive")}>{ccc} days</p>
        </Card>
        <Card className="p-4 bg-card/60 border-border/50 text-center">
          <p className="text-xs text-muted-foreground">DSO</p>
          <p className="text-xl font-bold text-foreground">{dso}d</p>
        </Card>
        <Card className="p-4 bg-card/60 border-border/50 text-center">
          <p className="text-xs text-muted-foreground">DIO</p>
          <p className="text-xl font-bold text-foreground">{dio}d</p>
        </Card>
      </div>
      {ccc > 60 && <p className="text-sm text-amber-500 font-medium">💡 A long cash conversion cycle ties up capital. Consider negotiating longer payment terms or reducing inventory.</p>}
    </div>
  );
};

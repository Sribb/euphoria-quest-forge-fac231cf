import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const DividendPolicyLab = () => {
  const [earnings, setEarnings] = useState(500);
  const [payoutRatio, setPayoutRatio] = useState(40);
  const [sharePrice, setSharePrice] = useState(50);
  const [sharesOut, setSharesOut] = useState(100);
  const [buybackPct, setBuybackPct] = useState(0);

  const dividend = earnings * (payoutRatio / 100);
  const dps = sharesOut > 0 ? dividend / sharesOut : 0;
  const divYield = sharePrice > 0 ? (dps / sharePrice) * 100 : 0;
  const retained = earnings - dividend;
  const buybackAmount = earnings * (buybackPct / 100);
  const totalReturn = dividend + buybackAmount;
  const totalPayout = payoutRatio + buybackPct;

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">Set the dividend payout ratio and share buyback allocation. Observe how capital return strategies affect shareholders.</p>

      <div className="space-y-3">
        {[
          { label: "Net Earnings", value: earnings, set: setEarnings, max: 1000, suffix: "M" },
          { label: "Dividend Payout Ratio", value: payoutRatio, set: setPayoutRatio, max: Math.max(0, 100 - buybackPct), suffix: "%" },
          { label: "Buyback Allocation", value: buybackPct, set: setBuybackPct, max: Math.max(0, 100 - payoutRatio), suffix: "%" },
          { label: "Share Price", value: sharePrice, set: setSharePrice, max: 200, suffix: "" },
          { label: "Shares Outstanding (M)", value: sharesOut, set: setSharesOut, max: 500, suffix: "" },
        ].map((c) => (
          <div key={c.label} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{c.label}</span>
              <span className="font-medium text-foreground">{c.suffix === "%" ? `${c.value}%` : c.suffix === "M" ? `$${c.value}M` : `$${c.value}`}</span>
            </div>
            <Slider value={[c.value]} onValueChange={([v]) => c.set(v)} max={c.max} step={c.max > 100 ? 10 : 1} min={0} />
          </div>
        ))}
      </div>

      {/* Earnings allocation bar */}
      <div className="h-6 rounded-full overflow-hidden flex">
        <div className="bg-primary transition-all flex items-center justify-center text-xs font-bold text-white" style={{ width: `${payoutRatio}%` }}>
          {payoutRatio > 12 && `Div ${payoutRatio}%`}
        </div>
        <div className="bg-amber-500 transition-all flex items-center justify-center text-xs font-bold text-white" style={{ width: `${buybackPct}%` }}>
          {buybackPct > 12 && `Buy ${buybackPct}%`}
        </div>
        <div className="bg-muted transition-all flex items-center justify-center text-xs font-bold text-muted-foreground" style={{ width: `${100 - totalPayout}%` }}>
          {(100 - totalPayout) > 12 && `Retained ${100 - totalPayout}%`}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Card className="p-3 bg-card/60 border-border/50 text-center">
          <p className="text-xs text-muted-foreground">DPS</p>
          <p className="text-lg font-bold text-foreground">${dps.toFixed(2)}</p>
        </Card>
        <Card className="p-3 bg-card/60 border-border/50 text-center">
          <p className="text-xs text-muted-foreground">Div Yield</p>
          <p className={cn("text-lg font-bold", divYield > 4 ? "text-emerald-500" : "text-foreground")}>{divYield.toFixed(2)}%</p>
        </Card>
        <Card className="p-3 bg-card/60 border-border/50 text-center">
          <p className="text-xs text-muted-foreground">Total Return</p>
          <p className="text-lg font-bold text-primary">${Math.round(totalReturn)}M</p>
        </Card>
      </div>
    </div>
  );
};

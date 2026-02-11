import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

export const MergersAcquisitionsSim = () => {
  const [acquirerValue, setAcquirerValue] = useState(5000);
  const [targetValue, setTargetValue] = useState(1200);
  const [premium, setPremium] = useState(30);
  const [synergies, setSynergies] = useState(200);
  const [dealType, setDealType] = useState<"cash" | "stock">("cash");

  const offerPrice = targetValue * (1 + premium / 100);
  const combinedValue = acquirerValue + targetValue + synergies;
  const goodwill = offerPrice - targetValue;
  const accretionDilution = ((combinedValue - acquirerValue) / acquirerValue) * 100;
  const isAccretive = combinedValue > acquirerValue + offerPrice - synergies;

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">Simulate an M&A deal. Adjust the premium and synergies to see if the deal creates or destroys value.</p>

      <div className="flex gap-2">
        <Button variant={dealType === "cash" ? "default" : "outline"} size="sm" onClick={() => setDealType("cash")}>Cash Deal</Button>
        <Button variant={dealType === "stock" ? "default" : "outline"} size="sm" onClick={() => setDealType("stock")}>Stock Deal</Button>
      </div>

      <div className="space-y-3">
        {[
          { label: "Acquirer Market Cap", value: acquirerValue, set: setAcquirerValue, max: 10000, suffix: "M" },
          { label: "Target Market Cap", value: targetValue, set: setTargetValue, max: 5000, suffix: "M" },
          { label: "Acquisition Premium", value: premium, set: setPremium, max: 100, suffix: "%" },
          { label: "Expected Synergies", value: synergies, set: setSynergies, max: 1000, suffix: "M" },
        ].map((c) => (
          <div key={c.label} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{c.label}</span>
              <span className="font-medium text-foreground">{c.suffix === "%" ? `${c.value}%` : `$${c.value}M`}</span>
            </div>
            <Slider value={[c.value]} onValueChange={([v]) => c.set(v)} max={c.max} step={c.max > 100 ? 50 : 5} />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Card className="p-4 bg-card/60 border-border/50 text-center">
          <p className="text-xs text-muted-foreground">Offer Price</p>
          <p className="text-xl font-bold text-foreground">${Math.round(offerPrice)}M</p>
        </Card>
        <Card className="p-4 bg-card/60 border-border/50 text-center">
          <p className="text-xs text-muted-foreground">Goodwill</p>
          <p className="text-xl font-bold text-amber-500">${Math.round(goodwill)}M</p>
        </Card>
        <Card className="p-4 bg-card/60 border-border/50 text-center">
          <p className="text-xs text-muted-foreground">Combined Value</p>
          <p className="text-xl font-bold text-foreground">${combinedValue}M</p>
        </Card>
        <Card className="p-4 bg-card/60 border-border/50 text-center">
          <p className="text-xs text-muted-foreground">Deal Impact</p>
          <p className={cn("text-xl font-bold", isAccretive ? "text-emerald-500" : "text-destructive")}>
            {isAccretive ? "Accretive ✓" : "Dilutive ✗"}
          </p>
        </Card>
      </div>

      {premium > 50 && <p className="text-sm text-amber-500 font-medium">⚠️ A 50%+ premium is unusually high. Synergies must be very significant to justify this price.</p>}
    </div>
  );
};

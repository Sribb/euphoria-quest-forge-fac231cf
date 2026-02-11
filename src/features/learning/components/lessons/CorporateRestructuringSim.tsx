import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight, TrendingUp, TrendingDown } from "lucide-react";

const SCENARIOS = [
  {
    name: "Spin-Off: TechDiv from ConglomCorp",
    description: "ConglomCorp spins off its high-growth tech division into a standalone company.",
    metrics: { parentBefore: 50, parentAfter: 38, spinoffValue: 18, synergyLoss: -3, focusBenefit: 5 },
    outcome: "Value created",
  },
  {
    name: "Divestiture: RetailArm Sale",
    description: "IndustrialCo sells its underperforming retail division to a strategic buyer.",
    metrics: { parentBefore: 40, parentAfter: 35, salePrice: 8, debtReduction: 6, focusBenefit: 3 },
    outcome: "Value created",
  },
  {
    name: "Turnaround: DebtCo Restructuring",
    description: "DebtCo negotiates with creditors to convert debt to equity and cut costs.",
    metrics: { valueBefore: 10, debtBefore: 25, debtAfter: 12, costSavings: 4, dilution: 50 },
    outcome: "Survival trade-off",
  },
];

export const CorporateRestructuringSim = () => {
  const [selected, setSelected] = useState(0);
  const [showOutcome, setShowOutcome] = useState(false);
  const scenario = SCENARIOS[selected];

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">Explore corporate restructuring scenarios and analyze whether they create or destroy shareholder value.</p>
      <div className="flex gap-2 flex-wrap">
        {SCENARIOS.map((s, i) => (
          <Button key={i} variant={selected === i ? "default" : "outline"} size="sm" onClick={() => { setSelected(i); setShowOutcome(false); }}>
            {s.name.split(":")[0]}
          </Button>
        ))}
      </div>

      <Card className="p-5 bg-card/60 border-border/50 space-y-3">
        <h4 className="font-semibold text-foreground">{scenario.name}</h4>
        <p className="text-sm text-muted-foreground">{scenario.description}</p>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(scenario.metrics).map(([key, value]) => (
            <div key={key} className="p-2 bg-muted/30 rounded-lg">
              <p className="text-xs text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
              <p className={cn("text-sm font-bold", typeof value === "number" && value < 0 ? "text-destructive" : "text-foreground")}>
                {typeof value === "number" ? (key.includes("dilution") ? `${value}%` : `$${value}B`) : value}
              </p>
            </div>
          ))}
        </div>
      </Card>

      <Button onClick={() => setShowOutcome(true)} className="w-full" disabled={showOutcome}>
        Analyze Outcome <ArrowRight className="w-4 h-4 ml-2" />
      </Button>

      {showOutcome && (
        <Card className={cn("p-4 border text-center", scenario.outcome.includes("created") ? "bg-emerald-500/10 border-emerald-500/30" : "bg-amber-500/10 border-amber-500/30")}>
          <p className={cn("text-lg font-bold", scenario.outcome.includes("created") ? "text-emerald-500" : "text-amber-500")}>
            {scenario.outcome.includes("created") ? <TrendingUp className="w-5 h-5 inline mr-2" /> : <TrendingDown className="w-5 h-5 inline mr-2" />}
            {scenario.outcome}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            {selected === 0 ? "The spin-off unlocked hidden value by giving the tech division its own valuation multiple."
              : selected === 1 ? "The divestiture provided cash for debt reduction and allowed management to focus on core operations."
              : "Existing shareholders face massive dilution, but the company avoids bankruptcy."}
          </p>
        </Card>
      )}
    </div>
  );
};

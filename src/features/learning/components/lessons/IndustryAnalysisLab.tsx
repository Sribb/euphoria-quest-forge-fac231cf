import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const INDUSTRIES = [
  {
    name: "Cloud Software (SaaS)",
    forces: {
      rivalry: { score: 8, detail: "Intense competition among well-funded players." },
      newEntrants: { score: 5, detail: "Moderate barriers — low capex but network effects protect incumbents." },
      buyers: { score: 6, detail: "Enterprise buyers have negotiating power; switching costs help." },
      suppliers: { score: 3, detail: "Key input is talent — competitive labor market." },
      substitutes: { score: 4, detail: "Open-source alternatives exist but lack support." },
    },
  },
  {
    name: "Commercial Airlines",
    forces: {
      rivalry: { score: 9, detail: "Commodity product, high fixed costs, price wars common." },
      newEntrants: { score: 3, detail: "Enormous capital requirements and regulatory barriers." },
      buyers: { score: 8, detail: "Price-sensitive passengers easily compare fares." },
      suppliers: { score: 9, detail: "Boeing/Airbus duopoly gives suppliers enormous power." },
      substitutes: { score: 4, detail: "Rail/video conferencing for short routes and business travel." },
    },
  },
  {
    name: "Pharmaceutical",
    forces: {
      rivalry: { score: 5, detail: "Patent protection reduces direct competition during exclusivity." },
      newEntrants: { score: 2, detail: "FDA approval process creates massive barriers to entry." },
      buyers: { score: 7, detail: "Insurance companies and PBMs have significant negotiating power." },
      suppliers: { score: 4, detail: "Multiple raw material suppliers available." },
      substitutes: { score: 6, detail: "Generics enter post-patent; biosimilars emerging." },
    },
  },
];

const forceLabels: Record<string, string> = {
  rivalry: "Competitive Rivalry",
  newEntrants: "Threat of New Entrants",
  buyers: "Buyer Power",
  suppliers: "Supplier Power",
  substitutes: "Threat of Substitutes",
};

export const IndustryAnalysisLab = () => {
  const [selected, setSelected] = useState(0);
  const industry = INDUSTRIES[selected];
  const avgThreat = Object.values(industry.forces).reduce((s, f) => s + f.score, 0) / 5;

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">Apply Porter's Five Forces to analyze industry attractiveness. Higher scores = greater threat to profitability.</p>

      <div className="flex gap-2 flex-wrap">
        {INDUSTRIES.map((ind, i) => (
          <Button key={i} variant={selected === i ? "default" : "outline"} size="sm" onClick={() => setSelected(i)}>
            {ind.name}
          </Button>
        ))}
      </div>

      <div className="space-y-3">
        {Object.entries(industry.forces).map(([key, force]) => (
          <Card key={key} className="p-4 bg-card/60 border-border/50">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-foreground">{forceLabels[key]}</span>
              <span className={cn("text-sm font-bold", force.score <= 3 ? "text-emerald-500" : force.score <= 6 ? "text-amber-500" : "text-destructive")}>
                {force.score}/10
              </span>
            </div>
            <div className="h-2 bg-muted/30 rounded-full overflow-hidden mb-2">
              <div className={cn("h-full rounded-full transition-all", force.score <= 3 ? "bg-emerald-500" : force.score <= 6 ? "bg-amber-500" : "bg-destructive")}
                style={{ width: `${force.score * 10}%` }} />
            </div>
            <p className="text-xs text-muted-foreground">{force.detail}</p>
          </Card>
        ))}
      </div>

      <Card className={cn("p-4 border text-center", avgThreat <= 4 ? "bg-emerald-500/10 border-emerald-500/30" : avgThreat <= 6 ? "bg-amber-500/10 border-amber-500/30" : "bg-destructive/10 border-destructive/30")}>
        <p className="text-xs text-muted-foreground">Industry Attractiveness</p>
        <p className={cn("text-2xl font-bold", avgThreat <= 4 ? "text-emerald-500" : avgThreat <= 6 ? "text-amber-500" : "text-destructive")}>
          {avgThreat.toFixed(1)}/10 — {avgThreat <= 4 ? "Attractive" : avgThreat <= 6 ? "Moderate" : "Challenging"}
        </p>
      </Card>
    </div>
  );
};

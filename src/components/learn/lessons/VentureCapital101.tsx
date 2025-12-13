import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Rocket, TrendingUp, Users, Target } from "lucide-react";

const metrics = [
  { name: "TAM", full: "Total Addressable Market", description: "Total market demand if 100% captured" },
  { name: "SAM", full: "Serviceable Addressable Market", description: "Portion you can realistically target" },
  { name: "SOM", full: "Serviceable Obtainable Market", description: "Realistic capture in near term" },
];

const startups = [
  { name: "FinTech Startup", tam: 500, sam: 50, som: 5, stage: "Seed", valuation: 10 },
  { name: "HealthTech Co", tam: 200, sam: 30, som: 3, stage: "Series A", valuation: 25 },
  { name: "AI SaaS Platform", tam: 150, sam: 40, som: 8, stage: "Series B", valuation: 100 },
];

export const VentureCapital101 = () => {
  const [selectedStartup, setSelectedStartup] = useState(0);
  const [ownershipPct, setOwnershipPct] = useState(10);

  const startup = startups[selectedStartup];
  const potentialValue = startup.som * 10; // 10x revenue multiple
  const yourPotentialValue = potentialValue * (ownershipPct / 100);
  const roi = ((yourPotentialValue / startup.valuation) * 100 - 100).toFixed(0);

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Rocket className="h-5 w-5 text-primary" />
          Venture Capital Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-wrap gap-2">
          {startups.map((s, idx) => (
            <button
              key={s.name}
              onClick={() => setSelectedStartup(idx)}
              className={`px-4 py-2 rounded-lg transition-all ${
                selectedStartup === idx ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>

        <Card className="bg-muted/50">
          <CardContent className="pt-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-semibold">{startup.name}</h4>
              <Badge>{startup.stage}</Badge>
            </div>
            
            <div className="space-y-3">
              {metrics.map((m, idx) => {
                const value = idx === 0 ? startup.tam : idx === 1 ? startup.sam : startup.som;
                const width = idx === 0 ? 100 : idx === 1 ? (startup.sam / startup.tam) * 100 : (startup.som / startup.tam) * 100;
                return (
                  <div key={m.name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{m.name}</span>
                      <span>${value}B</span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${idx === 0 ? "bg-blue-500/30" : idx === 1 ? "bg-blue-500/60" : "bg-primary"}`}
                        style={{ width: `${width}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-3 bg-muted/50 rounded-lg">
            <Target className="h-4 w-4 mx-auto mb-1 text-primary" />
            <p className="font-bold">${startup.valuation}M</p>
            <p className="text-xs text-muted-foreground">Valuation</p>
          </div>
          <div className="p-3 bg-green-500/10 rounded-lg">
            <TrendingUp className="h-4 w-4 mx-auto mb-1 text-green-500" />
            <p className="font-bold text-green-500">${potentialValue}M</p>
            <p className="text-xs text-muted-foreground">Exit Value</p>
          </div>
          <div className="p-3 bg-primary/10 rounded-lg">
            <Rocket className="h-4 w-4 mx-auto mb-1 text-primary" />
            <p className="font-bold">{roi}%</p>
            <p className="text-xs text-muted-foreground">Potential ROI</p>
          </div>
        </div>

        <div className="p-3 bg-primary/10 rounded-lg">
          <p className="text-sm"><strong>💡 Key Insight:</strong> VCs invest in the future potential, not current revenue. TAM/SAM/SOM analysis helps assess if a startup can grow large enough to return the fund.</p>
        </div>
      </CardContent>
    </Card>
  );
};

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Shield, Heart, Car, Home, User } from "lucide-react";

interface CoverageOption {
  name: string;
  icon: React.ElementType;
  enabled: boolean;
  level: number; // 1-3
  cost: number[];
  riskReduction: number[];
}

export const InsurancePlanner = () => {
  const [age, setAge] = useState(30);
  const [dependents, setDependents] = useState(1);
  const [coverages, setCoverages] = useState<CoverageOption[]>([
    { name: "Health", icon: Heart, enabled: true, level: 2, cost: [150, 300, 500], riskReduction: [40, 70, 90] },
    { name: "Auto", icon: Car, enabled: true, level: 1, cost: [80, 150, 250], riskReduction: [30, 60, 85] },
    { name: "Home/Renters", icon: Home, enabled: false, level: 1, cost: [50, 100, 200], riskReduction: [25, 55, 80] },
    { name: "Life", icon: User, enabled: false, level: 1, cost: [30, 60, 120], riskReduction: [20, 50, 75] },
  ]);

  const toggleCoverage = (idx: number) => {
    setCoverages(prev => prev.map((c, i) => i === idx ? { ...c, enabled: !c.enabled } : c));
  };

  const setLevel = (idx: number, level: number) => {
    setCoverages(prev => prev.map((c, i) => i === idx ? { ...c, level } : c));
  };

  const totalCost = coverages.reduce((sum, c) => sum + (c.enabled ? c.cost[c.level - 1] : 0), 0);
  const avgRiskReduction = coverages.filter(c => c.enabled).length > 0
    ? coverages.filter(c => c.enabled).reduce((sum, c) => sum + c.riskReduction[c.level - 1], 0) / coverages.filter(c => c.enabled).length
    : 0;

  const lifeFactor = dependents > 0 ? (coverages.find(c => c.name === "Life")?.enabled ? "✓" : "⚠️ Recommended") : "Optional";

  return (
    <div className="space-y-6">
      <Card className="border-teal-500/30 bg-gradient-to-br from-teal-500/5 to-cyan-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-teal-500" />
            Insurance Coverage Planner
          </CardTitle>
          <p className="text-sm text-muted-foreground">Toggle coverage types and adjust levels to see cost vs. risk reduction trade-offs.</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium">Age: {age}</label>
              <Slider value={[age]} onValueChange={v => setAge(v[0])} min={18} max={70} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Dependents: {dependents}</label>
              <Slider value={[dependents]} onValueChange={v => setDependents(v[0])} min={0} max={5} />
            </div>
          </div>

          <div className="space-y-3">
            {coverages.map((c, idx) => {
              const Icon = c.icon;
              return (
                <Card key={c.name} className={`transition-all ${c.enabled ? "bg-card border-primary/30" : "bg-muted/20 opacity-60"}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Icon className="h-5 w-5 text-primary" />
                        <span className="font-medium">{c.name}</span>
                      </div>
                      <Switch checked={c.enabled} onCheckedChange={() => toggleCoverage(idx)} />
                    </div>
                    {c.enabled && (
                      <div className="flex gap-2">
                        {["Basic", "Standard", "Premium"].map((label, lvl) => (
                          <Button key={label} size="sm" variant={c.level === lvl + 1 ? "default" : "outline"} onClick={() => setLevel(idx, lvl + 1)} className="flex-1">
                            <div className="text-center">
                              <p className="text-xs">{label}</p>
                              <p className="text-xs font-bold">${c.cost[lvl]}/mo</p>
                            </div>
                          </Button>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Card className="bg-card"><CardContent className="p-4 text-center">
              <p className="text-xs text-muted-foreground">Monthly Cost</p>
              <p className="text-2xl font-bold text-primary">${totalCost}</p>
            </CardContent></Card>
            <Card className="bg-card"><CardContent className="p-4 text-center">
              <p className="text-xs text-muted-foreground">Risk Reduction</p>
              <p className="text-2xl font-bold text-emerald-500">{avgRiskReduction.toFixed(0)}%</p>
            </CardContent></Card>
            <Card className="bg-card"><CardContent className="p-4 text-center">
              <p className="text-xs text-muted-foreground">Life Insurance</p>
              <p className="text-lg font-bold">{lifeFactor}</p>
            </CardContent></Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

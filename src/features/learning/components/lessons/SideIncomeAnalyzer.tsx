import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Briefcase } from "lucide-react";

interface IncomeStream {
  name: string;
  monthlyIncome: number;
  hoursPerWeek: number;
  growthRate: number;
  enabled: boolean;
}

export const SideIncomeAnalyzer = () => {
  const [streams, setStreams] = useState<IncomeStream[]>([
    { name: "Freelancing", monthlyIncome: 1000, hoursPerWeek: 10, growthRate: 5, enabled: true },
    { name: "Rental Income", monthlyIncome: 800, hoursPerWeek: 2, growthRate: 3, enabled: false },
    { name: "Online Course", monthlyIncome: 500, hoursPerWeek: 5, growthRate: 15, enabled: false },
    { name: "Dividend Portfolio", monthlyIncome: 200, hoursPerWeek: 1, growthRate: 8, enabled: true },
  ]);
  const [investPercent, setInvestPercent] = useState(50);
  const [investReturn, setInvestReturn] = useState(8);

  const toggle = (idx: number) => setStreams(prev => prev.map((s, i) => i === idx ? { ...s, enabled: !s.enabled } : s));
  const updateIncome = (idx: number, val: number) => setStreams(prev => prev.map((s, i) => i === idx ? { ...s, monthlyIncome: val } : s));

  const data = useMemo(() => {
    const result = [];
    let invested = 0;
    for (let y = 0; y <= 20; y++) {
      const annualSideIncome = streams.filter(s => s.enabled).reduce((sum, s) => sum + s.monthlyIncome * 12 * Math.pow(1 + s.growthRate / 100, y), 0);
      const annualInvested = annualSideIncome * investPercent / 100;
      invested = (invested + annualInvested) * (1 + investReturn / 100);
      result.push({ year: y, sideIncome: Math.round(annualSideIncome), wealth: Math.round(invested) });
    }
    return result;
  }, [streams, investPercent, investReturn]);

  const totalMonthly = streams.filter(s => s.enabled).reduce((sum, s) => sum + s.monthlyIncome, 0);
  const totalHours = streams.filter(s => s.enabled).reduce((sum, s) => sum + s.hoursPerWeek, 0);
  const effectiveRate = totalHours > 0 ? (totalMonthly / (totalHours * 4.33)).toFixed(0) : 0;

  return (
    <div className="space-y-6">
      <Card className="border-rose-500/30 bg-gradient-to-br from-rose-500/5 to-pink-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-6 w-6 text-rose-500" />
            Side Income Analyzer
          </CardTitle>
          <p className="text-sm text-muted-foreground">Model how different income streams compound into wealth over 20 years.</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            {streams.map((s, idx) => (
              <div key={s.name} className={`flex items-center gap-4 p-3 rounded-lg border ${s.enabled ? "bg-card" : "bg-muted/20 opacity-60"}`}>
                <Switch checked={s.enabled} onCheckedChange={() => toggle(idx)} />
                <div className="flex-1">
                  <p className="font-medium text-sm">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.hoursPerWeek}h/week • {s.growthRate}% annual growth</p>
                </div>
                <div className="w-32 space-y-1">
                  <label className="text-xs">${s.monthlyIncome}/mo</label>
                  <Slider value={[s.monthlyIncome]} onValueChange={v => updateIncome(idx, v[0])} min={100} max={5000} step={100} />
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-4">
            <div className="flex-1 space-y-1">
              <label className="text-xs">Invest {investPercent}% of side income</label>
              <Slider value={[investPercent]} onValueChange={v => setInvestPercent(v[0])} min={0} max={100} step={5} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Card className="bg-card"><CardContent className="p-3 text-center">
              <p className="text-xs text-muted-foreground">Monthly Side Income</p>
              <p className="text-xl font-bold text-primary">${totalMonthly.toLocaleString()}</p>
            </CardContent></Card>
            <Card className="bg-card"><CardContent className="p-3 text-center">
              <p className="text-xs text-muted-foreground">Effective Hourly Rate</p>
              <p className="text-xl font-bold">${effectiveRate}/hr</p>
            </CardContent></Card>
            <Card className="bg-card"><CardContent className="p-3 text-center">
              <p className="text-xs text-muted-foreground">20-Year Wealth</p>
              <p className="text-xl font-bold text-emerald-500">${(data[data.length - 1]?.wealth / 1000000).toFixed(2)}M</p>
            </CardContent></Card>
          </div>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} />
                <Line type="monotone" dataKey="wealth" stroke="hsl(var(--primary))" strokeWidth={2} name="Invested Wealth" dot={false} />
                <Line type="monotone" dataKey="sideIncome" stroke="hsl(var(--accent))" strokeWidth={1} strokeDasharray="3 3" name="Annual Side Income" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

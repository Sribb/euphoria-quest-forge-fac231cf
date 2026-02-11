import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingDown, AlertTriangle } from "lucide-react";

export const LifestyleInflationDetector = () => {
  const [startingSalary, setStartingSalary] = useState(55000);
  const [annualRaise, setAnnualRaise] = useState(5);
  const [spendingCreep, setSpendingCreep] = useState(4);
  const [savingsRate, setSavingsRate] = useState(15);
  const [investReturn, setInvestReturn] = useState(8);

  const data = useMemo(() => {
    const result = [];
    let salary = startingSalary;
    let spending = salary * (1 - savingsRate / 100);
    let wealthDisciplined = 0;
    let wealthCreep = 0;
    for (let y = 0; y <= 30; y++) {
      const disciplinedSavings = salary * (savingsRate / 100);
      const creepSavings = Math.max(0, salary - spending);
      result.push({
        year: y,
        salary: Math.round(salary),
        disciplinedWealth: Math.round(wealthDisciplined),
        creepWealth: Math.round(wealthCreep),
        spending: Math.round(spending),
      });
      wealthDisciplined = (wealthDisciplined + disciplinedSavings) * (1 + investReturn / 100);
      wealthCreep = (wealthCreep + creepSavings) * (1 + investReturn / 100);
      salary *= (1 + annualRaise / 100);
      spending *= (1 + spendingCreep / 100);
    }
    return result;
  }, [startingSalary, annualRaise, spendingCreep, savingsRate, investReturn]);

  const finalDisciplined = data[data.length - 1]?.disciplinedWealth || 0;
  const finalCreep = data[data.length - 1]?.creepWealth || 0;
  const lifestyleCost = finalDisciplined - finalCreep;

  return (
    <div className="space-y-6">
      <Card className="border-orange-500/30 bg-gradient-to-br from-orange-500/5 to-red-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-orange-500" />
            Lifestyle Inflation Detector
          </CardTitle>
          <p className="text-sm text-muted-foreground">See how lifestyle creep vs disciplined saving impacts your 30-year wealth.</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { label: `Salary: $${startingSalary.toLocaleString()}`, val: startingSalary, set: setStartingSalary, min: 30000, max: 150000, step: 5000 },
              { label: `Raise: ${annualRaise}%/yr`, val: annualRaise, set: setAnnualRaise, min: 1, max: 10, step: 0.5 },
              { label: `Spending Creep: ${spendingCreep}%/yr`, val: spendingCreep, set: setSpendingCreep, min: 0, max: 10, step: 0.5 },
              { label: `Save Rate: ${savingsRate}%`, val: savingsRate, set: setSavingsRate, min: 5, max: 50, step: 1 },
              { label: `Returns: ${investReturn}%`, val: investReturn, set: setInvestReturn, min: 3, max: 12, step: 0.5 },
            ].map(s => (
              <div key={s.label} className="space-y-1">
                <label className="text-xs font-medium">{s.label}</label>
                <Slider value={[s.val]} onValueChange={v => s.set(v[0])} min={s.min} max={s.max} step={s.step} />
              </div>
            ))}
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" label={{ value: "Years", position: "insideBottom", offset: -5 }} />
                <YAxis tickFormatter={v => `$${(v / 1000000).toFixed(1)}M`} />
                <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} />
                <Line type="monotone" dataKey="disciplinedWealth" stroke="hsl(var(--primary))" strokeWidth={2} name="Disciplined Saver" dot={false} />
                <Line type="monotone" dataKey="creepWealth" stroke="hsl(var(--destructive))" strokeWidth={2} strokeDasharray="5 5" name="Lifestyle Creep" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Card className="bg-card"><CardContent className="p-3 text-center">
              <p className="text-xs text-muted-foreground">Disciplined</p>
              <p className="text-xl font-bold text-primary">${(finalDisciplined / 1000000).toFixed(2)}M</p>
            </CardContent></Card>
            <Card className="bg-card"><CardContent className="p-3 text-center">
              <p className="text-xs text-muted-foreground">With Creep</p>
              <p className="text-xl font-bold text-destructive">${(finalCreep / 1000000).toFixed(2)}M</p>
            </CardContent></Card>
            <Card className="bg-card"><CardContent className="p-3 text-center">
              <p className="text-xs text-muted-foreground">Cost of Creep</p>
              <p className="text-xl font-bold text-orange-500">${(lifestyleCost / 1000000).toFixed(2)}M</p>
            </CardContent></Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

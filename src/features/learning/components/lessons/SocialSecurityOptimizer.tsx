import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Clock } from "lucide-react";

const calcBenefit = (pia: number, claimAge: number) => {
  if (claimAge < 62) return 0;
  if (claimAge <= 67) {
    const monthsEarly = (67 - claimAge) * 12;
    const reduction = monthsEarly <= 36 ? monthsEarly * 0.00556 : 36 * 0.00556 + (monthsEarly - 36) * 0.00417;
    return pia * (1 - reduction);
  }
  const monthsLate = Math.min((claimAge - 67) * 12, 36);
  return pia * (1 + monthsLate * 0.00667);
};

export const SocialSecurityOptimizer = () => {
  const [pia, setPia] = useState(2500);
  const [lifeExpectancy, setLifeExpectancy] = useState(85);

  const claimAges = [62, 65, 67, 70];

  const data = useMemo(() => {
    const result = [];
    for (let age = 62; age <= lifeExpectancy; age++) {
      const entry: any = { age };
      claimAges.forEach(ca => {
        const monthlyBenefit = calcBenefit(pia, ca);
        const yearsReceiving = Math.max(0, age - ca);
        entry[`claim${ca}`] = Math.round(monthlyBenefit * 12 * yearsReceiving);
      });
      result.push(entry);
    }
    return result;
  }, [pia, lifeExpectancy]);

  const colors = ["#ef4444", "#f59e0b", "#3b82f6", "#10b981"];

  return (
    <div className="space-y-6">
      <Card className="border-blue-500/30 bg-gradient-to-br from-blue-500/5 to-indigo-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-6 w-6 text-blue-500" />
            Social Security Optimizer
          </CardTitle>
          <p className="text-sm text-muted-foreground">Compare lifetime benefits by claiming age. See the crossover points.</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium">PIA (Full Benefit at 67): ${pia.toLocaleString()}/mo</label>
              <Slider value={[pia]} onValueChange={v => setPia(v[0])} min={1000} max={4500} step={100} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Life Expectancy: {lifeExpectancy}</label>
              <Slider value={[lifeExpectancy]} onValueChange={v => setLifeExpectancy(v[0])} min={70} max={100} />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {claimAges.map((ca, i) => {
              const monthly = calcBenefit(pia, ca);
              const total = monthly * 12 * Math.max(0, lifeExpectancy - ca);
              return (
                <Card key={ca} className="bg-card">
                  <CardContent className="p-3 text-center">
                    <p className="text-xs text-muted-foreground">Claim at {ca}</p>
                    <p className="text-lg font-bold" style={{ color: colors[i] }}>${Math.round(monthly).toLocaleString()}/mo</p>
                    <p className="text-xs">Lifetime: ${Math.round(total).toLocaleString()}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="age" label={{ value: "Age", position: "insideBottom", offset: -5 }} />
                <YAxis tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} />
                <Legend />
                {claimAges.map((ca, i) => (
                  <Line key={ca} type="monotone" dataKey={`claim${ca}`} stroke={colors[i]} strokeWidth={2} name={`Claim at ${ca}`} dot={false} />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            The crossover point shows when delaying benefits pays off. With life expectancy of {lifeExpectancy}, 
            claiming at {claimAges[claimAges.length - 1]} gives you the most lifetime income if you live past ~{Math.round(67 + (70 - 62) * 0.8)}.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

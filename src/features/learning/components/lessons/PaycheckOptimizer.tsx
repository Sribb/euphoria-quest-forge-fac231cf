import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { DollarSign } from "lucide-react";

const COLORS = ["hsl(var(--primary))", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

export const PaycheckOptimizer = () => {
  const [grossSalary, setGrossSalary] = useState(85000);
  const [retirement401k, setRetirement401k] = useState(10);
  const [healthPremium, setHealthPremium] = useState(200);
  const [hsaContribution, setHsaContribution] = useState(150);
  const [federalRate, setFederalRate] = useState(22);
  const [stateRate, setStateRate] = useState(5);

  const monthly = grossSalary / 12;
  const retirement = monthly * retirement401k / 100;
  const taxableIncome = monthly - retirement - hsaContribution;
  const federalTax = taxableIncome * federalRate / 100;
  const stateTax = taxableIncome * stateRate / 100;
  const fica = monthly * 0.0765;
  const takeHome = monthly - retirement - healthPremium - hsaContribution - federalTax - stateTax - fica;

  const pieData = [
    { name: "Take Home", value: Math.round(takeHome) },
    { name: "401(k)", value: Math.round(retirement) },
    { name: "Federal Tax", value: Math.round(federalTax) },
    { name: "State Tax", value: Math.round(stateTax) },
    { name: "FICA", value: Math.round(fica) },
    { name: "Benefits", value: Math.round(healthPremium + hsaContribution) },
  ];

  return (
    <div className="space-y-6">
      <Card className="border-yellow-500/30 bg-gradient-to-br from-yellow-500/5 to-amber-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-6 w-6 text-yellow-500" />
            Paycheck Optimizer
          </CardTitle>
          <p className="text-sm text-muted-foreground">See where every dollar of your paycheck goes and optimize your take-home.</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium">Salary: ${grossSalary.toLocaleString()}/yr</label>
              <Slider value={[grossSalary]} onValueChange={v => setGrossSalary(v[0])} min={30000} max={250000} step={5000} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">401(k): {retirement401k}%</label>
              <Slider value={[retirement401k]} onValueChange={v => setRetirement401k(v[0])} min={0} max={25} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Health: ${healthPremium}/mo</label>
              <Slider value={[healthPremium]} onValueChange={v => setHealthPremium(v[0])} min={0} max={800} step={25} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">HSA: ${hsaContribution}/mo</label>
              <Slider value={[hsaContribution]} onValueChange={v => setHsaContribution(v[0])} min={0} max={650} step={25} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Federal: {federalRate}%</label>
              <Slider value={[federalRate]} onValueChange={v => setFederalRate(v[0])} min={10} max={37} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">State: {stateRate}%</label>
              <Slider value={[stateRate]} onValueChange={v => setStateRate(v[0])} min={0} max={13} step={0.5} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: $${value}`}>
                    {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              <div className="text-center p-4 rounded-lg bg-card border">
                <p className="text-xs text-muted-foreground">Monthly Take-Home</p>
                <p className="text-3xl font-bold text-primary">${Math.round(takeHome).toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">{((takeHome / monthly) * 100).toFixed(1)}% of gross</p>
              </div>
              {pieData.map((d, i) => (
                <div key={d.name} className="flex justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    {d.name}
                  </span>
                  <span className="font-medium">${d.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

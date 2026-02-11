import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { GraduationCap } from "lucide-react";

export const CollegeSavingsPlanner = () => {
  const [childAge, setChildAge] = useState(3);
  const [monthlySaving, setMonthlySaving] = useState(300);
  const [currentSaved, setCurrentSaved] = useState(5000);
  const [returnRate, setReturnRate] = useState(7);
  const [tuitionInflation, setTuitionInflation] = useState(5);
  const currentTuition = 25000;
  const collegeAge = 18;
  const yearsToCollege = collegeAge - childAge;

  const data = useMemo(() => {
    const result = [];
    let savings = currentSaved;
    for (let y = 0; y <= yearsToCollege; y++) {
      const projectedTuition = currentTuition * Math.pow(1 + tuitionInflation / 100, y) * 4;
      result.push({ year: y, age: childAge + y, savings: Math.round(savings), tuitionCost: Math.round(projectedTuition) });
      savings = savings * (1 + returnRate / 100) + monthlySaving * 12;
    }
    return result;
  }, [childAge, monthlySaving, currentSaved, returnRate, tuitionInflation]);

  const finalSavings = data[data.length - 1]?.savings || 0;
  const finalCost = data[data.length - 1]?.tuitionCost || 0;
  const coverage = finalCost > 0 ? (finalSavings / finalCost * 100) : 0;

  return (
    <div className="space-y-6">
      <Card className="border-purple-500/30 bg-gradient-to-br from-purple-500/5 to-fuchsia-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-purple-500" />
            College Savings Planner
          </CardTitle>
          <p className="text-sm text-muted-foreground">Project your 529 plan growth against rising tuition costs.</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium">Child's Age: {childAge}</label>
              <Slider value={[childAge]} onValueChange={v => setChildAge(v[0])} min={0} max={15} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Monthly: ${monthlySaving}</label>
              <Slider value={[monthlySaving]} onValueChange={v => setMonthlySaving(v[0])} min={50} max={1500} step={50} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Saved: ${currentSaved.toLocaleString()}</label>
              <Slider value={[currentSaved]} onValueChange={v => setCurrentSaved(v[0])} min={0} max={50000} step={1000} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Return: {returnRate}%</label>
              <Slider value={[returnRate]} onValueChange={v => setReturnRate(v[0])} min={2} max={12} step={0.5} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Tuition Inflation: {tuitionInflation}%</label>
              <Slider value={[tuitionInflation]} onValueChange={v => setTuitionInflation(v[0])} min={2} max={8} step={0.5} />
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="age" label={{ value: "Child's Age", position: "insideBottom", offset: -5 }} />
                <YAxis tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} />
                <Line type="monotone" dataKey="savings" stroke="hsl(var(--primary))" strokeWidth={2} name="Your Savings" dot={false} />
                <Line type="monotone" dataKey="tuitionCost" stroke="hsl(var(--destructive))" strokeWidth={2} strokeDasharray="5 5" name="4-Year Tuition Cost" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Card className="bg-card"><CardContent className="p-4 text-center">
              <p className="text-xs text-muted-foreground">Projected Savings</p>
              <p className="text-xl font-bold text-primary">${finalSavings.toLocaleString()}</p>
            </CardContent></Card>
            <Card className="bg-card"><CardContent className="p-4 text-center">
              <p className="text-xs text-muted-foreground">Projected 4-Year Cost</p>
              <p className="text-xl font-bold text-destructive">${finalCost.toLocaleString()}</p>
            </CardContent></Card>
            <Card className="bg-card"><CardContent className="p-4 text-center">
              <p className="text-xs text-muted-foreground">Coverage</p>
              <Badge variant={coverage >= 100 ? "default" : "destructive"} className="text-lg">{coverage.toFixed(0)}%</Badge>
            </CardContent></Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

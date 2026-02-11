import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Trophy, Wallet, TrendingUp, Shield, PiggyBank } from "lucide-react";

export const PersonalFinanceCapstone = () => {
  const [income, setIncome] = useState(75000);
  const [savingsRate, setSavingsRate] = useState(20);
  const [debtPayment, setDebtPayment] = useState(500);
  const [emergencyTarget, setEmergencyTarget] = useState(6);
  const [investReturn, setInvestReturn] = useState(8);
  const [insuranceCoverage, setInsuranceCoverage] = useState(70);

  const monthlyIncome = income / 12;
  const monthlySavings = monthlyIncome * savingsRate / 100;
  const monthlyExpenses = monthlyIncome - monthlySavings - debtPayment;
  const emergencyTarget$ = monthlyExpenses * emergencyTarget;

  const data = useMemo(() => {
    const result = [];
    let netWorth = -25000;
    let emergencyFund = 2000;
    let investments = 0;
    let debt = 25000;
    for (let y = 0; y <= 5; y++) {
      result.push({ year: y, netWorth: Math.round(netWorth), emergency: Math.round(emergencyFund), investments: Math.round(investments), debt: Math.round(debt) });
      const annualSavings = monthlySavings * 12;
      const annualDebt = debtPayment * 12;
      debt = Math.max(0, debt - annualDebt);
      if (emergencyFund < emergencyTarget$) {
        const toEmergency = Math.min(annualSavings * 0.5, emergencyTarget$ - emergencyFund);
        emergencyFund += toEmergency;
        investments += (annualSavings - toEmergency);
      } else {
        investments += annualSavings;
      }
      investments *= (1 + investReturn / 100);
      netWorth = emergencyFund + investments - debt;
    }
    return result;
  }, [income, savingsRate, debtPayment, emergencyTarget, investReturn, monthlyExpenses]);

  const scores = {
    savings: Math.min(100, savingsRate * 5),
    debt: Math.min(100, debtPayment > 0 ? 80 : 40),
    emergency: Math.min(100, emergencyTarget * 15),
    insurance: insuranceCoverage,
    investing: Math.min(100, investReturn * 10),
  };
  const overallScore = Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / 5);

  return (
    <div className="space-y-6">
      <Card className="border-amber-500/30 bg-gradient-to-br from-amber-500/5 to-orange-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-amber-500" />
            Personal Finance Capstone
          </CardTitle>
          <p className="text-sm text-muted-foreground">Build a comprehensive 5-year financial plan. Balance all areas to maximize your score.</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { label: `Income: $${income.toLocaleString()}`, val: income, set: setIncome, min: 30000, max: 200000, step: 5000 },
              { label: `Save Rate: ${savingsRate}%`, val: savingsRate, set: setSavingsRate, min: 5, max: 50, step: 1 },
              { label: `Debt Payment: $${debtPayment}/mo`, val: debtPayment, set: setDebtPayment, min: 0, max: 2000, step: 50 },
              { label: `Emergency: ${emergencyTarget} months`, val: emergencyTarget, set: setEmergencyTarget, min: 1, max: 12, step: 1 },
              { label: `Returns: ${investReturn}%`, val: investReturn, set: setInvestReturn, min: 3, max: 12, step: 0.5 },
              { label: `Insurance: ${insuranceCoverage}%`, val: insuranceCoverage, set: setInsuranceCoverage, min: 0, max: 100, step: 5 },
            ].map(s => (
              <div key={s.label} className="space-y-1">
                <label className="text-xs font-medium">{s.label}</label>
                <Slider value={[s.val]} onValueChange={v => s.set(v[0])} min={s.min} max={s.max} step={s.step} />
              </div>
            ))}
          </div>

          <div className="text-center p-4 rounded-xl bg-card border">
            <p className="text-sm text-muted-foreground">Financial Health Score</p>
            <p className={`text-5xl font-bold ${overallScore >= 70 ? "text-emerald-500" : overallScore >= 50 ? "text-yellow-500" : "text-red-500"}`}>{overallScore}</p>
            <div className="grid grid-cols-5 gap-2 mt-3">
              {Object.entries(scores).map(([key, val]) => (
                <div key={key} className="text-center">
                  <Progress value={val} className="h-2 mb-1" />
                  <p className="text-xs capitalize">{key}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" label={{ value: "Year", position: "insideBottom", offset: -5 }} />
                <YAxis tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} />
                <Legend />
                <Line type="monotone" dataKey="netWorth" stroke="hsl(var(--primary))" strokeWidth={2} name="Net Worth" dot={false} />
                <Line type="monotone" dataKey="investments" stroke="#10b981" strokeWidth={1} name="Investments" dot={false} />
                <Line type="monotone" dataKey="debt" stroke="hsl(var(--destructive))" strokeWidth={1} strokeDasharray="5 5" name="Debt" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

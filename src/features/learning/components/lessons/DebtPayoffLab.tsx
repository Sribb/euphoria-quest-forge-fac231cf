import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingDown, DollarSign } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface Debt {
  name: string;
  balance: number;
  rate: number;
  minPayment: number;
}

const DEFAULT_DEBTS: Debt[] = [
  { name: "Credit Card", balance: 8000, rate: 22, minPayment: 200 },
  { name: "Car Loan", balance: 15000, rate: 6, minPayment: 350 },
  { name: "Student Loan", balance: 25000, rate: 5, minPayment: 280 },
];

const simulate = (debts: Debt[], extraPayment: number, strategy: "snowball" | "avalanche") => {
  const working = debts.map(d => ({ ...d }));
  let totalInterest = 0;
  let months = 0;
  const sorted = strategy === "snowball"
    ? [...working].sort((a, b) => a.balance - b.balance)
    : [...working].sort((a, b) => b.rate - a.rate);

  while (sorted.some(d => d.balance > 0) && months < 360) {
    months++;
    let extra = extraPayment;
    for (const d of sorted) {
      if (d.balance <= 0) continue;
      const interest = (d.balance * d.rate / 100) / 12;
      totalInterest += interest;
      d.balance += interest;
      const payment = Math.min(d.balance, d.minPayment + extra);
      d.balance -= payment;
      extra = Math.max(0, extra - (payment - d.minPayment));
      if (d.balance < 0.01) { extra += d.minPayment; d.balance = 0; }
    }
  }
  return { months, totalInterest: Math.round(totalInterest) };
};

export const DebtPayoffLab = () => {
  const [extraPayment, setExtraPayment] = useState(200);
  const debts = DEFAULT_DEBTS;

  const snowball = simulate(debts, extraPayment, "snowball");
  const avalanche = simulate(debts, extraPayment, "avalanche");
  const noExtra = simulate(debts, 0, "avalanche");

  const chartData = [
    { strategy: "Minimum Only", months: noExtra.months, interest: noExtra.totalInterest },
    { strategy: "Snowball", months: snowball.months, interest: snowball.totalInterest },
    { strategy: "Avalanche", months: avalanche.months, interest: avalanche.totalInterest },
  ];

  return (
    <div className="space-y-6">
      <Card className="border-emerald-500/30 bg-gradient-to-br from-emerald-500/5 to-teal-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="h-6 w-6 text-emerald-500" />
            Debt Snowball vs Avalanche
          </CardTitle>
          <p className="text-sm text-muted-foreground">See how extra payments and strategy choice impact total interest and payoff time.</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {debts.map(d => (
              <Card key={d.name} className="bg-muted/30">
                <CardContent className="p-4">
                  <p className="font-semibold">{d.name}</p>
                  <p className="text-sm text-muted-foreground">${d.balance.toLocaleString()} @ {d.rate}% APR</p>
                  <p className="text-xs">Min payment: ${d.minPayment}/mo</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <DollarSign className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium">Extra Monthly Payment:</span>
            <Input type="number" value={extraPayment} onChange={e => setExtraPayment(Number(e.target.value))} className="w-28" />
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="strategy" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip formatter={(v: number, name: string) => name === "interest" ? `$${v.toLocaleString()}` : `${v} months`} />
                <Legend />
                <Bar yAxisId="left" dataKey="months" fill="hsl(var(--primary))" name="Months to payoff" />
                <Bar yAxisId="right" dataKey="interest" fill="hsl(var(--destructive))" name="Total Interest" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {chartData.map(d => (
              <Card key={d.strategy} className="bg-card">
                <CardContent className="p-3 text-center">
                  <p className="font-semibold text-sm">{d.strategy}</p>
                  <p className="text-2xl font-bold">{Math.floor(d.months / 12)}y {d.months % 12}m</p>
                  <p className="text-xs text-destructive">${d.interest.toLocaleString()} interest</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

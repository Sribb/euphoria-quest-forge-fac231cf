import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Home } from "lucide-react";

const calcMortgage = (principal: number, annualRate: number, years: number) => {
  const r = annualRate / 100 / 12;
  const n = years * 12;
  if (r === 0) return { payment: principal / n, totalInterest: 0, schedule: [] };
  const payment = principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  let balance = principal;
  let totalInterest = 0;
  const schedule: { year: number; principal: number; interest: number; balance: number }[] = [];
  for (let y = 1; y <= years; y++) {
    let yearPrincipal = 0, yearInterest = 0;
    for (let m = 0; m < 12; m++) {
      const intPayment = balance * r;
      const prinPayment = payment - intPayment;
      yearInterest += intPayment;
      yearPrincipal += prinPayment;
      balance -= prinPayment;
    }
    totalInterest += yearInterest;
    schedule.push({ year: y, principal: Math.round(yearPrincipal), interest: Math.round(yearInterest), balance: Math.max(0, Math.round(balance)) });
  }
  return { payment, totalInterest, schedule };
};

export const MortgageCalculatorLab = () => {
  const [homePrice, setHomePrice] = useState(350000);
  const [downPayment, setDownPayment] = useState(20);
  const [fixedRate, setFixedRate] = useState(6.5);
  const [armRate, setArmRate] = useState(5.5);
  const [term, setTerm] = useState(30);

  const principal = homePrice * (1 - downPayment / 100);
  const fixed = useMemo(() => calcMortgage(principal, fixedRate, term), [principal, fixedRate, term]);
  const arm = useMemo(() => calcMortgage(principal, armRate, term), [principal, armRate, term]);

  return (
    <div className="space-y-6">
      <Card className="border-indigo-500/30 bg-gradient-to-br from-indigo-500/5 to-blue-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-6 w-6 text-indigo-500" />
            Mortgage Calculator Lab
          </CardTitle>
          <p className="text-sm text-muted-foreground">Compare fixed vs adjustable rate mortgages and see amortization over time.</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium">Home Price: ${homePrice.toLocaleString()}</label>
              <Slider value={[homePrice]} onValueChange={v => setHomePrice(v[0])} min={100000} max={1000000} step={10000} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Down Payment: {downPayment}%</label>
              <Slider value={[downPayment]} onValueChange={v => setDownPayment(v[0])} min={3} max={40} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Fixed Rate: {fixedRate}%</label>
              <Slider value={[fixedRate]} onValueChange={v => setFixedRate(v[0])} min={3} max={10} step={0.25} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">ARM Rate: {armRate}%</label>
              <Slider value={[armRate]} onValueChange={v => setArmRate(v[0])} min={2} max={9} step={0.25} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-card"><CardContent className="p-4 text-center">
              <p className="text-xs text-muted-foreground">Fixed Monthly</p>
              <p className="text-2xl font-bold">${Math.round(fixed.payment).toLocaleString()}</p>
              <p className="text-xs text-destructive">Total interest: ${Math.round(fixed.totalInterest).toLocaleString()}</p>
            </CardContent></Card>
            <Card className="bg-card"><CardContent className="p-4 text-center">
              <p className="text-xs text-muted-foreground">ARM Monthly</p>
              <p className="text-2xl font-bold">${Math.round(arm.payment).toLocaleString()}</p>
              <p className="text-xs text-destructive">Total interest: ${Math.round(arm.totalInterest).toLocaleString()}</p>
            </CardContent></Card>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={fixed.schedule}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" label={{ value: "Year", position: "insideBottom", offset: -5 }} />
                <YAxis tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} />
                <Area type="monotone" dataKey="interest" stackId="1" fill="hsl(var(--destructive))" stroke="hsl(var(--destructive))" name="Interest" />
                <Area type="monotone" dataKey="principal" stackId="1" fill="hsl(var(--primary))" stroke="hsl(var(--primary))" name="Principal" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

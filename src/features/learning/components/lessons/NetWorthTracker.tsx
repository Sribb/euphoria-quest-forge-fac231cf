import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { TrendingUp, Plus, Minus } from "lucide-react";

export const NetWorthTracker = () => {
  const [savings, setSavings] = useState(15000);
  const [investments, setInvestments] = useState(30000);
  const [homeEquity, setHomeEquity] = useState(50000);
  const [carValue, setCarValue] = useState(18000);
  const [mortgage, setMortgage] = useState(200000);
  const [studentLoans, setStudentLoans] = useState(25000);
  const [creditCards, setCreditCards] = useState(5000);
  const [carLoan, setCarLoan] = useState(12000);

  const totalAssets = savings + investments + homeEquity + carValue;
  const totalDebts = mortgage + studentLoans + creditCards + carLoan;
  const netWorth = totalAssets - totalDebts;

  const chartData = [
    { name: "Savings", value: savings, type: "asset" },
    { name: "Investments", value: investments, type: "asset" },
    { name: "Home Equity", value: homeEquity, type: "asset" },
    { name: "Car", value: carValue, type: "asset" },
    { name: "Mortgage", value: -mortgage, type: "debt" },
    { name: "Student Loans", value: -studentLoans, type: "debt" },
    { name: "Credit Cards", value: -creditCards, type: "debt" },
    { name: "Car Loan", value: -carLoan, type: "debt" },
  ];

  return (
    <div className="space-y-6">
      <Card className="border-cyan-500/30 bg-gradient-to-br from-cyan-500/5 to-blue-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-cyan-500" />
            Net Worth Tracker
          </CardTitle>
          <p className="text-sm text-muted-foreground">Adjust your assets and liabilities to see your net worth waterfall.</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="text-sm font-semibold flex items-center gap-1"><Plus className="h-4 w-4 text-emerald-500" />Assets</h4>
              {[
                { label: "Savings", value: savings, set: setSavings, max: 100000 },
                { label: "Investments", value: investments, set: setInvestments, max: 200000 },
                { label: "Home Equity", value: homeEquity, set: setHomeEquity, max: 500000 },
                { label: "Car Value", value: carValue, set: setCarValue, max: 60000 },
              ].map(a => (
                <div key={a.label} className="space-y-1">
                  <label className="text-xs">{a.label}: ${a.value.toLocaleString()}</label>
                  <Slider value={[a.value]} onValueChange={v => a.set(v[0])} min={0} max={a.max} step={1000} />
                </div>
              ))}
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-semibold flex items-center gap-1"><Minus className="h-4 w-4 text-red-500" />Liabilities</h4>
              {[
                { label: "Mortgage", value: mortgage, set: setMortgage, max: 500000 },
                { label: "Student Loans", value: studentLoans, set: setStudentLoans, max: 100000 },
                { label: "Credit Cards", value: creditCards, set: setCreditCards, max: 30000 },
                { label: "Car Loan", value: carLoan, set: setCarLoan, max: 40000 },
              ].map(a => (
                <div key={a.label} className="space-y-1">
                  <label className="text-xs">{a.label}: ${a.value.toLocaleString()}</label>
                  <Slider value={[a.value]} onValueChange={v => a.set(v[0])} min={0} max={a.max} step={1000} />
                </div>
              ))}
            </div>
          </div>

          <div className="text-center p-4 rounded-lg bg-card border">
            <p className="text-sm text-muted-foreground">Net Worth</p>
            <p className={`text-4xl font-bold ${netWorth >= 0 ? "text-emerald-500" : "text-destructive"}`}>
              ${netWorth.toLocaleString()}
            </p>
            <div className="flex justify-center gap-4 mt-2 text-xs">
              <span className="text-emerald-500">Assets: ${totalAssets.toLocaleString()}</span>
              <span className="text-destructive">Debts: ${totalDebts.toLocaleString()}</span>
            </div>
          </div>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: number) => `$${Math.abs(v).toLocaleString()}`} />
                <ReferenceLine y={0} stroke="hsl(var(--foreground))" />
                <Bar dataKey="value">
                  {chartData.map((entry, i) => (
                    <rect key={i} fill={entry.type === "asset" ? "hsl(var(--primary))" : "hsl(var(--destructive))"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

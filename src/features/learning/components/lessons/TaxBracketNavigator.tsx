import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Calculator } from "lucide-react";

const BRACKETS_2024 = [
  { min: 0, max: 11600, rate: 10 },
  { min: 11600, max: 47150, rate: 12 },
  { min: 47150, max: 100525, rate: 22 },
  { min: 100525, max: 191950, rate: 24 },
  { min: 191950, max: 243725, rate: 32 },
  { min: 243725, max: 609350, rate: 35 },
  { min: 609350, max: Infinity, rate: 37 },
];

const BRACKET_COLORS = ["#10b981", "#22c55e", "#84cc16", "#eab308", "#f97316", "#ef4444", "#dc2626"];

const calcTax = (income: number, deduction: number) => {
  const taxable = Math.max(0, income - deduction);
  let tax = 0;
  const breakdown: { bracket: string; amount: number; tax: number; rate: number }[] = [];
  for (const b of BRACKETS_2024) {
    if (taxable <= b.min) break;
    const taxableInBracket = Math.min(taxable, b.max) - b.min;
    const bracketTax = taxableInBracket * b.rate / 100;
    tax += bracketTax;
    breakdown.push({
      bracket: `${b.rate}%`,
      amount: Math.round(taxableInBracket),
      tax: Math.round(bracketTax),
      rate: b.rate,
    });
  }
  return { tax: Math.round(tax), effectiveRate: taxable > 0 ? (tax / taxable * 100) : 0, breakdown };
};

export const TaxBracketNavigator = () => {
  const [income, setIncome] = useState(85000);
  const [deduction, setDeduction] = useState(14600);
  const [retirement401k, setRetirement401k] = useState(0);

  const totalDeduction = deduction + retirement401k;
  const result = calcTax(income, totalDeduction);

  return (
    <div className="space-y-6">
      <Card className="border-green-500/30 bg-gradient-to-br from-green-500/5 to-emerald-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-6 w-6 text-green-500" />
            Tax Bracket Navigator
          </CardTitle>
          <p className="text-sm text-muted-foreground">See how marginal brackets work and how deductions lower your effective rate.</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium">Gross Income: ${income.toLocaleString()}</label>
              <Slider value={[income]} onValueChange={v => setIncome(v[0])} min={20000} max={500000} step={5000} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Standard Deduction: ${deduction.toLocaleString()}</label>
              <Slider value={[deduction]} onValueChange={v => setDeduction(v[0])} min={0} max={30000} step={500} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">401(k) Contribution: ${retirement401k.toLocaleString()}</label>
              <Slider value={[retirement401k]} onValueChange={v => setRetirement401k(v[0])} min={0} max={23000} step={500} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Card className="bg-card"><CardContent className="p-4 text-center">
              <p className="text-xs text-muted-foreground">Total Tax</p>
              <p className="text-2xl font-bold text-destructive">${result.tax.toLocaleString()}</p>
            </CardContent></Card>
            <Card className="bg-card"><CardContent className="p-4 text-center">
              <p className="text-xs text-muted-foreground">Effective Rate</p>
              <p className="text-2xl font-bold text-primary">{result.effectiveRate.toFixed(1)}%</p>
            </CardContent></Card>
            <Card className="bg-card"><CardContent className="p-4 text-center">
              <p className="text-xs text-muted-foreground">Marginal Rate</p>
              <p className="text-2xl font-bold">{result.breakdown.length > 0 ? result.breakdown[result.breakdown.length - 1].rate : 0}%</p>
            </CardContent></Card>
          </div>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={result.breakdown}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="bracket" />
                <YAxis tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} />
                <Bar dataKey="tax" name="Tax Paid">
                  {result.breakdown.map((_, i) => <Cell key={i} fill={BRACKET_COLORS[i]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1">
            {result.breakdown.map((b, i) => (
              <div key={i} className="flex justify-between text-sm px-3 py-1 rounded bg-muted/30">
                <span>{b.bracket} bracket — ${b.amount.toLocaleString()} taxed</span>
                <span className="font-medium text-destructive">${b.tax.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Gift } from "lucide-react";

export const CharitableGivingStrategy = () => {
  const [annualGiving, setAnnualGiving] = useState(5000);
  const [income, setIncome] = useState(120000);
  const [taxBracket, setTaxBracket] = useState(24);
  const [standardDeduction, setStandardDeduction] = useState(14600);

  const directTaxSaved = annualGiving > standardDeduction ? (annualGiving - standardDeduction) * taxBracket / 100 : 0;
  const bunchingGiving = annualGiving * 2;
  const bunchingTaxSaved = bunchingGiving > standardDeduction ? (bunchingGiving - standardDeduction) * taxBracket / 100 : 0;
  const twoYearDirect = directTaxSaved * 2;
  const bunchingAdvantage = bunchingTaxSaved - twoYearDirect / 2;

  const chartData = [
    { strategy: "Direct Annual", taxSaved: Math.round(directTaxSaved), effectiveCost: Math.round(annualGiving - directTaxSaved) },
    { strategy: "Bunching (2yr)", taxSaved: Math.round(bunchingTaxSaved / 2), effectiveCost: Math.round(annualGiving - bunchingTaxSaved / 2) },
    { strategy: "DAF + Bunching", taxSaved: Math.round(bunchingTaxSaved / 2 * 1.1), effectiveCost: Math.round(annualGiving - bunchingTaxSaved / 2 * 1.1) },
  ];

  return (
    <div className="space-y-6">
      <Card className="border-pink-500/30 bg-gradient-to-br from-pink-500/5 to-rose-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-6 w-6 text-pink-500" />
            Charitable Giving Strategy
          </CardTitle>
          <p className="text-sm text-muted-foreground">Optimize your charitable giving for maximum tax efficiency.</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium">Annual Giving: ${annualGiving.toLocaleString()}</label>
              <Slider value={[annualGiving]} onValueChange={v => setAnnualGiving(v[0])} min={500} max={50000} step={500} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Income: ${income.toLocaleString()}</label>
              <Slider value={[income]} onValueChange={v => setIncome(v[0])} min={40000} max={500000} step={5000} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Tax Bracket: {taxBracket}%</label>
              <Slider value={[taxBracket]} onValueChange={v => setTaxBracket(v[0])} min={10} max={37} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Std Deduction: ${standardDeduction.toLocaleString()}</label>
              <Slider value={[standardDeduction]} onValueChange={v => setStandardDeduction(v[0])} min={10000} max={30000} step={500} />
            </div>
          </div>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="strategy" />
                <YAxis tickFormatter={v => `$${v.toLocaleString()}`} />
                <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} />
                <Legend />
                <Bar dataKey="taxSaved" fill="hsl(var(--primary))" name="Annual Tax Saved" />
                <Bar dataKey="effectiveCost" fill="hsl(var(--muted-foreground))" name="Effective Cost" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3 rounded-lg bg-muted/30 border text-sm space-y-1">
            <p><strong>Key Insight:</strong> If your giving is near the standard deduction threshold, bunching donations into alternating years lets you itemize one year and take the standard deduction the next.</p>
            <p>Your annual giving of ${annualGiving.toLocaleString()} is {annualGiving > standardDeduction ? "above" : "below"} the standard deduction — {annualGiving > standardDeduction ? "you're already benefiting from itemizing" : "bunching could help you cross the threshold"}.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

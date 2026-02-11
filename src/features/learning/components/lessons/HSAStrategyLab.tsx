import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Heart, DollarSign, Shield } from "lucide-react";

export const HSAStrategyLab = () => {
  const [annualContribution, setAnnualContribution] = useState(3850);
  const [taxBracket, setTaxBracket] = useState(24);
  const [investReturn, setInvestReturn] = useState(7);
  const [yearsToRetirement, setYearsToRetirement] = useState(25);
  const [annualMedicalSpend, setAnnualMedicalSpend] = useState(1000);

  const data = useMemo(() => {
    const result = [];
    let hsaBalance = 0;
    let regularBalance = 0;
    const afterTaxContribution = annualContribution * (1 - taxBracket / 100);
    for (let y = 0; y <= yearsToRetirement; y++) {
      result.push({ year: y, hsa: Math.round(hsaBalance), regular: Math.round(regularBalance) });
      hsaBalance = (hsaBalance + annualContribution) * (1 + investReturn / 100);
      regularBalance = (regularBalance + afterTaxContribution) * (1 + investReturn / 100 * (1 - 0.15)); // taxed gains
    }
    return result;
  }, [annualContribution, taxBracket, investReturn, yearsToRetirement]);

  const finalHSA = data[data.length - 1]?.hsa || 0;
  const finalRegular = data[data.length - 1]?.regular || 0;
  const taxSavings = finalHSA - finalRegular;
  const annualTaxSaved = annualContribution * taxBracket / 100;
  const tripleAdvantage = [
    { benefit: "Tax-Deductible Contributions", saved: `$${annualTaxSaved.toLocaleString()}/yr` },
    { benefit: "Tax-Free Growth", saved: `${investReturn}% untaxed` },
    { benefit: "Tax-Free Withdrawals (medical)", saved: "$0 tax on qualified expenses" },
  ];

  return (
    <div className="space-y-6">
      <Card className="border-emerald-500/30 bg-gradient-to-br from-emerald-500/5 to-green-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-emerald-500" />
            HSA Triple Tax Advantage Lab
          </CardTitle>
          <p className="text-sm text-muted-foreground">Compare HSA investing vs a regular brokerage account over time.</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium">Annual HSA: ${annualContribution.toLocaleString()}</label>
              <Slider value={[annualContribution]} onValueChange={v => setAnnualContribution(v[0])} min={500} max={7750} step={50} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Tax Bracket: {taxBracket}%</label>
              <Slider value={[taxBracket]} onValueChange={v => setTaxBracket(v[0])} min={10} max={37} step={1} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Return: {investReturn}%</label>
              <Slider value={[investReturn]} onValueChange={v => setInvestReturn(v[0])} min={3} max={12} step={0.5} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Years: {yearsToRetirement}</label>
              <Slider value={[yearsToRetirement]} onValueChange={v => setYearsToRetirement(v[0])} min={5} max={40} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {tripleAdvantage.map(t => (
              <Card key={t.benefit} className="bg-card border-emerald-500/20">
                <CardContent className="p-3 text-center">
                  <Shield className="h-4 w-4 text-emerald-500 mx-auto mb-1" />
                  <p className="text-xs font-medium">{t.benefit}</p>
                  <p className="text-sm font-bold text-emerald-500">{t.saved}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.filter((_, i) => i % 5 === 0)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} />
                <Legend />
                <Bar dataKey="hsa" fill="hsl(var(--primary))" name="HSA (Triple Tax)" />
                <Bar dataKey="regular" fill="hsl(var(--muted-foreground))" name="Taxable Account" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="text-center p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
            <p className="text-sm">HSA advantage over {yearsToRetirement} years: <span className="font-bold text-emerald-500">${taxSavings.toLocaleString()}</span> more wealth</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

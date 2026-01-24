import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Building, DollarSign, Percent, TrendingUp } from "lucide-react";
import { AIContextualHelp } from "@/components/learn/AIContextualHelp";

const reitTypes = [
  { name: "Residential", yield: 3.8, growth: 4.5 },
  { name: "Commercial Office", yield: 5.2, growth: 2.0 },
  { name: "Industrial", yield: 2.9, growth: 6.5 },
  { name: "Healthcare", yield: 5.5, growth: 3.0 },
  { name: "Retail", yield: 4.8, growth: 1.5 },
];

export const REITCalculator = () => {
  const [investment, setInvestment] = useState(25000);
  const [years, setYears] = useState(10);
  const [selectedREIT, setSelectedREIT] = useState(0);

  const reit = reitTypes[selectedREIT];
  const totalReturn = reit.yield + reit.growth;
  const annualIncome = investment * (reit.yield / 100);
  const futureValue = investment * Math.pow(1 + totalReturn / 100, years);
  const totalDividends = annualIncome * years;

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5 text-primary" />
          REIT Investment Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4" /> Investment Amount: ${investment.toLocaleString()}
            </label>
            <Slider value={[investment]} onValueChange={([v]) => setInvestment(v)} min={5000} max={100000} step={1000} className="mt-2" />
          </div>
          
          <div>
            <label className="text-sm font-medium">Investment Period: {years} years</label>
            <Slider value={[years]} onValueChange={([v]) => setYears(v)} min={1} max={30} step={1} className="mt-2" />
          </div>
        </div>

        <div>
          <p className="text-sm font-medium mb-3">Select REIT Type:</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {reitTypes.map((type, idx) => (
              <button
                key={type.name}
                onClick={() => setSelectedREIT(idx)}
                className={`p-3 rounded-lg text-left transition-all ${
                  selectedREIT === idx ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
                }`}
              >
                <p className="font-medium text-sm">{type.name}</p>
                <p className="text-xs opacity-80">{type.yield}% yield</p>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-green-500/10">
            <CardContent className="pt-4 text-center">
              <Percent className="h-6 w-6 mx-auto mb-2 text-green-500" />
              <p className="text-2xl font-bold text-green-500">${annualIncome.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Annual Dividend Income</p>
            </CardContent>
          </Card>
          <Card className="bg-blue-500/10">
            <CardContent className="pt-4 text-center">
              <TrendingUp className="h-6 w-6 mx-auto mb-2 text-blue-500" />
              <p className="text-2xl font-bold text-blue-500">${Math.round(futureValue).toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Projected Value ({years}yr)</p>
            </CardContent>
          </Card>
        </div>

        <div className="p-3 bg-primary/10 rounded-lg">
          <p className="text-sm"><strong>💡 Key Insight:</strong> <AIContextualHelp term="REITs" lessonId="22" lessonTitle="REITs">REITs</AIContextualHelp> must distribute at least 90% of taxable income as <AIContextualHelp term="dividends" lessonId="22" lessonTitle="REITs">dividends</AIContextualHelp>, making them excellent for income-focused portfolios. Consider diversifying across REIT types to balance <AIContextualHelp term="yield" lessonId="22" lessonTitle="REITs">yield</AIContextualHelp> and growth.</p>
        </div>
      </CardContent>
    </Card>
  );
};

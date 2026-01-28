import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { PiggyBank, TrendingUp, Calendar } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { toast } from "sonner";

export const RetirementCalculator = () => {
  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(65);
  const [currentSavings, setCurrentSavings] = useState(50000);
  const [monthlyContribution, setMonthlyContribution] = useState(500);
  const [returnRate, setReturnRate] = useState(7);
  const [showResults, setShowResults] = useState(false);

  const calculate = () => {
    setShowResults(true);
    toast.success("Retirement projection calculated!");
  };

  const years = retirementAge - currentAge;
  const months = years * 12;
  const monthlyRate = returnRate / 100 / 12;

  // Future value of current savings
  const futureValueOfSavings = currentSavings * Math.pow(1 + monthlyRate, months);

  // Future value of monthly contributions
  const futureValueOfContributions =
    monthlyContribution * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);

  const totalAtRetirement = futureValueOfSavings + futureValueOfContributions;
  const totalContributed = currentSavings + monthlyContribution * months;
  const investmentGains = totalAtRetirement - totalContributed;

  // Generate chart data
  const chartData = [];
  let balance = currentSavings;
  for (let year = 0; year <= years; year++) {
    chartData.push({
      age: currentAge + year,
      balance: Math.round(balance),
      contributed: currentSavings + monthlyContribution * 12 * year,
    });
    // Compound for next year
    for (let month = 0; month < 12; month++) {
      balance = balance * (1 + monthlyRate) + monthlyContribution;
    }
  }

  // Calculate safe withdrawal (4% rule)
  const annualWithdrawal = totalAtRetirement * 0.04;
  const monthlyIncome = annualWithdrawal / 12;

  return (
    <Card className="p-6 space-y-6 bg-gradient-to-br from-background to-muted/20">
      <div>
        <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
          <PiggyBank className="w-5 h-5 text-primary" />
          Retirement Calculator
        </h3>
        <p className="text-sm text-muted-foreground">
          Project your retirement savings and plan for financial independence
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Current Age: {currentAge}
            </label>
            <Slider
              value={[currentAge]}
              onValueChange={([value]) => setCurrentAge(value)}
              min={18}
              max={70}
              step={1}
              className="w-full"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Retirement Age: {retirementAge}
            </label>
            <Slider
              value={[retirementAge]}
              onValueChange={([value]) => setRetirementAge(value)}
              min={currentAge + 1}
              max={80}
              step={1}
              className="w-full"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Years Until Retirement: {years}
            </label>
            <div className="text-xs text-muted-foreground">
              {years < 10 && "⚠️ Consider increasing savings rate"}
              {years >= 10 && years < 20 && "✓ Good timeline"}
              {years >= 20 && "✓ Excellent - time is your advantage!"}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Current Savings
            </label>
            <Input
              type="number"
              value={currentSavings}
              onChange={(e) => setCurrentSavings(parseInt(e.target.value) || 0)}
              className="mb-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Monthly Contribution
            </label>
            <Input
              type="number"
              value={monthlyContribution}
              onChange={(e) => setMonthlyContribution(parseInt(e.target.value) || 0)}
              className="mb-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Expected Annual Return: {returnRate}%
            </label>
            <Slider
              value={[returnRate]}
              onValueChange={([value]) => setReturnRate(value)}
              min={4}
              max={12}
              step={0.5}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Historical stock market average: ~10%, Conservative: 7%
            </p>
          </div>
        </div>
      </div>

      <Button onClick={calculate} className="w-full" size="lg">
        <Calendar className="w-4 h-4 mr-2" />
        Calculate Retirement Projection
      </Button>

      {showResults && (
        <>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground)/0.2)" />
                <XAxis dataKey="age" label={{ value: "Age", position: "insideBottom", offset: -5 }} />
                <YAxis
                  label={{ value: "Portfolio Value ($)", angle: -90, position: "insideLeft" }}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(value: number) => `$${value.toLocaleString()}`}
                  labelFormatter={(label) => `Age ${label}`}
                />
                <Area
                  type="monotone"
                  dataKey="contributed"
                  stackId="1"
                  stroke="hsl(var(--muted))"
                  fill="hsl(var(--muted))"
                  name="Total Contributed"
                />
                <Area
                  type="monotone"
                  dataKey="balance"
                  stackId="2"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.6}
                  name="Portfolio Value"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4 bg-muted/30">
              <div className="text-xs text-muted-foreground mb-1">Total Contributed</div>
              <div className="text-xl font-bold">${totalContributed.toLocaleString()}</div>
            </Card>
            <Card className="p-4 bg-success/10 border-success/30">
              <div className="text-xs text-muted-foreground mb-1">Investment Gains</div>
              <div className="text-xl font-bold text-success">
                ${investmentGains.toLocaleString()}
              </div>
            </Card>
            <Card className="p-4 bg-primary/10 border-primary/30">
              <div className="text-xs text-muted-foreground mb-1">At Retirement</div>
              <div className="text-xl font-bold text-primary">
                ${totalAtRetirement.toLocaleString()}
              </div>
            </Card>
            <Card className="p-4 bg-warning/10 border-warning/30">
              <div className="text-xs text-muted-foreground mb-1">Monthly Income</div>
              <div className="text-xl font-bold">
                ${monthlyIncome.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">(4% rule)</div>
            </Card>
          </div>

          <Card className="p-4 bg-muted/50">
            <h4 className="font-semibold mb-3 text-sm">Retirement Analysis</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Portfolio at age {retirementAge}:</span>
                <span className="font-bold text-primary">
                  ${totalAtRetirement.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Safe annual withdrawal (4%):</span>
                <span className="font-bold">${annualWithdrawal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Monthly retirement income:</span>
                <span className="font-bold">${monthlyIncome.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Return on investment:</span>
                <span className="font-bold text-success">
                  {((investmentGains / totalContributed) * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-primary/5 border-primary/20">
            <h4 className="font-semibold mb-2 text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Key Insights & Tips
            </h4>
            <ul className="text-xs space-y-1 text-muted-foreground">
              <li>
                ✓ <strong>Start early:</strong> Every 10 years delayed requires 2-3x higher contributions
              </li>
              <li>
                ✓ <strong>Maximize employer match:</strong> It's free money (100% instant return)
              </li>
              <li>
                ✓ <strong>4% withdrawal rule:</strong> Historically safe rate to preserve capital
              </li>
              <li>
                ✓ <strong>Tax-advantaged accounts:</strong> Use 401(k) and IRA to reduce taxes
              </li>
              <li>
                ⚠ <strong>Inflation consideration:</strong> This calculator doesn't adjust for inflation
              </li>
              <li>
                ⚠ <strong>Returns vary:</strong> Market returns fluctuate - plan conservatively
              </li>
            </ul>
          </Card>
        </>
      )}
    </Card>
  );
};

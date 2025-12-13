import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Landmark, TrendingUp, TrendingDown, Calendar } from "lucide-react";

const bondStrategies = [
  { name: "Laddering", description: "Spread maturities evenly to reduce reinvestment risk", risk: "Low" },
  { name: "Barbell", description: "Concentrate in short and long-term, avoid middle", risk: "Medium" },
  { name: "Bullet", description: "All bonds mature at same time for specific goal", risk: "Low" },
  { name: "Duration Targeting", description: "Match portfolio duration to investment horizon", risk: "Medium" },
];

export const FixedIncomeStrategies = () => {
  const [duration, setDuration] = useState(5);
  const [rateChange, setRateChange] = useState(1);
  const [selectedStrategy, setSelectedStrategy] = useState(0);

  const priceChange = -duration * rateChange;
  const couponIncome = 4.5;
  const totalReturn = couponIncome + priceChange;

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Landmark className="h-5 w-5 text-primary" />
          Fixed Income Strategies
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-2">
          {bondStrategies.map((s, idx) => (
            <button
              key={s.name}
              onClick={() => setSelectedStrategy(idx)}
              className={`p-3 rounded-lg text-left transition-all ${
                selectedStrategy === idx ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
              }`}
            >
              <div className="flex justify-between items-start">
                <p className="font-medium text-sm">{s.name}</p>
                <Badge variant="outline" className="text-xs">{s.risk}</Badge>
              </div>
            </button>
          ))}
        </div>

        <Card className="bg-muted/50">
          <CardContent className="pt-4">
            <h4 className="font-semibold">{bondStrategies[selectedStrategy].name} Strategy</h4>
            <p className="text-sm text-muted-foreground mt-1">{bondStrategies[selectedStrategy].description}</p>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h4 className="font-semibold flex items-center gap-2">
            <Calendar className="h-4 w-4" /> Duration Impact Calculator
          </h4>
          <div>
            <label className="text-sm">Portfolio Duration: {duration} years</label>
            <Slider value={[duration]} onValueChange={([v]) => setDuration(v)} min={1} max={15} step={0.5} className="mt-2" />
          </div>
          <div>
            <label className="text-sm">Interest Rate Change: {rateChange > 0 ? "+" : ""}{rateChange}%</label>
            <Slider value={[rateChange]} onValueChange={([v]) => setRateChange(v)} min={-3} max={3} step={0.25} className="mt-2" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <Card className="bg-muted/50">
            <CardContent className="pt-4 text-center">
              <p className="text-xs text-muted-foreground">Coupon Income</p>
              <p className="text-lg font-bold text-green-500">+{couponIncome}%</p>
            </CardContent>
          </Card>
          <Card className={priceChange >= 0 ? "bg-green-500/10" : "bg-red-500/10"}>
            <CardContent className="pt-4 text-center">
              <p className="text-xs text-muted-foreground">Price Change</p>
              <p className={`text-lg font-bold ${priceChange >= 0 ? "text-green-500" : "text-red-500"}`}>
                {priceChange >= 0 ? "+" : ""}{priceChange.toFixed(1)}%
              </p>
            </CardContent>
          </Card>
          <Card className={totalReturn >= 0 ? "bg-green-500/10" : "bg-red-500/10"}>
            <CardContent className="pt-4 text-center">
              <p className="text-xs text-muted-foreground">Total Return</p>
              <p className={`text-lg font-bold ${totalReturn >= 0 ? "text-green-500" : "text-red-500"}`}>
                {totalReturn >= 0 ? "+" : ""}{totalReturn.toFixed(1)}%
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="p-3 bg-primary/10 rounded-lg">
          <p className="text-sm"><strong>💡 Key Insight:</strong> Duration measures interest rate sensitivity. A {duration}-year duration means a 1% rate increase causes approximately {duration}% price decline. Laddering reduces this risk.</p>
        </div>
      </CardContent>
    </Card>
  );
};

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ShieldCheck, AlertTriangle, Zap, Heart } from "lucide-react";

const EMERGENCIES = [
  { name: "Job Loss (3 months)", cost: 0, monthsFactor: 3, icon: AlertTriangle, color: "text-red-500" },
  { name: "Medical Emergency", cost: 5000, monthsFactor: 0, icon: Heart, color: "text-pink-500" },
  { name: "Car Repair", cost: 2500, monthsFactor: 0, icon: Zap, color: "text-orange-500" },
  { name: "Home Repair", cost: 8000, monthsFactor: 0, icon: ShieldCheck, color: "text-blue-500" },
];

export const EmergencyFundBuilder = () => {
  const [monthlyExpenses, setMonthlyExpenses] = useState(3500);
  const [monthlySavings, setMonthlySavings] = useState(500);
  const [currentSavings, setCurrentSavings] = useState(2000);
  const [hitEvents, setHitEvents] = useState<number[]>([]);
  const [simMonth, setSimMonth] = useState(0);
  const [balance, setBalance] = useState(2000);

  const targetFund = monthlyExpenses * 6;
  const progress = Math.min((balance / targetFund) * 100, 100);

  const simulateMonth = () => {
    let newBalance = balance + monthlySavings;
    const eventRoll = Math.random();
    if (eventRoll < 0.15) {
      const eventIdx = Math.floor(Math.random() * EMERGENCIES.length);
      const event = EMERGENCIES[eventIdx];
      const cost = event.cost || monthlyExpenses * event.monthsFactor;
      newBalance = Math.max(0, newBalance - cost);
      setHitEvents(prev => [...prev, eventIdx]);
    }
    setBalance(newBalance);
    setSimMonth(prev => prev + 1);
  };

  const reset = () => {
    setBalance(currentSavings);
    setSimMonth(0);
    setHitEvents([]);
  };

  return (
    <div className="space-y-6">
      <Card className="border-violet-500/30 bg-gradient-to-br from-violet-500/5 to-purple-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-violet-500" />
            Emergency Fund Builder
          </CardTitle>
          <p className="text-sm text-muted-foreground">Set your monthly expenses and savings rate, then simulate months to see if your fund survives random emergencies.</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Monthly Expenses: ${monthlyExpenses.toLocaleString()}</label>
              <Slider value={[monthlyExpenses]} onValueChange={v => setMonthlyExpenses(v[0])} min={1500} max={10000} step={100} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Monthly Savings: ${monthlySavings.toLocaleString()}</label>
              <Slider value={[monthlySavings]} onValueChange={v => setMonthlySavings(v[0])} min={100} max={3000} step={50} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Starting Savings: ${currentSavings.toLocaleString()}</label>
              <Slider value={[currentSavings]} onValueChange={v => { setCurrentSavings(v[0]); setBalance(v[0]); }} min={0} max={30000} step={500} />
            </div>
          </div>

          <div className="p-4 rounded-lg bg-card border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Fund: ${balance.toLocaleString()} / ${targetFund.toLocaleString()} (6-month target)</span>
              <Badge variant={progress >= 100 ? "default" : "secondary"}>Month {simMonth}</Badge>
            </div>
            <Progress value={progress} className="h-3" />
            <p className="text-xs text-muted-foreground mt-1">
              {progress >= 100 ? "🎉 Fully funded!" : `${Math.ceil((targetFund - balance) / monthlySavings)} months to fully fund at current rate`}
            </p>
          </div>

          <div className="flex gap-3">
            <Button onClick={simulateMonth}>Simulate Next Month</Button>
            <Button variant="outline" onClick={() => { for (let i = 0; i < 12; i++) simulateMonth(); }}>Fast-Forward 12 Months</Button>
            <Button variant="ghost" onClick={reset}>Reset</Button>
          </div>

          {hitEvents.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Emergency Events Hit:</h4>
              <div className="flex flex-wrap gap-2">
                {hitEvents.map((idx, i) => {
                  const e = EMERGENCIES[idx];
                  const Icon = e.icon;
                  return <Badge key={i} variant="outline" className="gap-1"><Icon className={`h-3 w-3 ${e.color}`} />{e.name}</Badge>;
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

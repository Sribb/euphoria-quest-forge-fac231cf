import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Briefcase, Clock, TrendingUp, Lock } from "lucide-react";

const stages = [
  { name: "Seed", range: "$500K - $2M", ownership: "10-25%", timeline: "0-1 years" },
  { name: "Series A", range: "$2M - $15M", ownership: "15-30%", timeline: "1-2 years" },
  { name: "Series B", range: "$15M - $50M", ownership: "10-20%", timeline: "2-4 years" },
  { name: "Series C+", range: "$50M+", ownership: "5-15%", timeline: "4-7 years" },
  { name: "Pre-IPO", range: "$100M+", ownership: "5-10%", timeline: "5-10 years" },
];

export const PrivateEquityBasics = () => {
  const [investment, setInvestment] = useState(100000);
  const [holdingPeriod, setHoldingPeriod] = useState(5);
  const [selectedStage, setSelectedStage] = useState(1);

  const multipliers = [15, 8, 4, 2.5, 1.8];
  const failRates = [70, 50, 30, 20, 10];
  
  const expectedMultiple = multipliers[selectedStage];
  const failRate = failRates[selectedStage];
  const successValue = investment * expectedMultiple;
  const expectedValue = successValue * (1 - failRate / 100);

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-primary" />
          Private Equity Investment Stages
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-wrap gap-2">
          {stages.map((stage, idx) => (
            <button
              key={stage.name}
              onClick={() => setSelectedStage(idx)}
              className={`px-4 py-2 rounded-lg transition-all ${
                selectedStage === idx ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
              }`}
            >
              {stage.name}
            </button>
          ))}
        </div>

        <Card className="bg-muted/50">
          <CardContent className="pt-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xs text-muted-foreground">Investment Range</p>
                <p className="font-bold">{stages[selectedStage].range}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Typical Ownership</p>
                <p className="font-bold">{stages[selectedStage].ownership}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Exit Timeline</p>
                <p className="font-bold">{stages[selectedStage].timeline}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Investment Amount: ${investment.toLocaleString()}</label>
            <Slider value={[investment]} onValueChange={([v]) => setInvestment(v)} min={25000} max={500000} step={25000} className="mt-2" />
          </div>
          <div>
            <label className="text-sm font-medium">Holding Period: {holdingPeriod} years</label>
            <Slider value={[holdingPeriod]} onValueChange={([v]) => setHoldingPeriod(v)} min={3} max={10} className="mt-2" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-green-500/10">
            <CardContent className="pt-4 text-center">
              <TrendingUp className="h-5 w-5 mx-auto mb-1 text-green-500" />
              <p className="text-xl font-bold text-green-500">{expectedMultiple}x</p>
              <p className="text-xs text-muted-foreground">Success Multiple</p>
              <p className="text-sm font-medium mt-1">${successValue.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card className="bg-yellow-500/10">
            <CardContent className="pt-4 text-center">
              <Lock className="h-5 w-5 mx-auto mb-1 text-yellow-500" />
              <p className="text-xl font-bold text-yellow-500">{failRate}%</p>
              <p className="text-xs text-muted-foreground">Failure Rate</p>
              <p className="text-sm font-medium mt-1">EV: ${Math.round(expectedValue).toLocaleString()}</p>
            </CardContent>
          </Card>
        </div>

        <div className="p-3 bg-primary/10 rounded-lg">
          <p className="text-sm"><strong>💡 Key Insight:</strong> Earlier stage investments offer higher potential returns but also higher failure rates. Diversification across 10-20 deals is essential in PE/VC to manage risk.</p>
        </div>
      </CardContent>
    </Card>
  );
};

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, Shield, TrendingDown, Briefcase } from "lucide-react";

interface Scenario {
  month: number;
  event: string;
  impact: string;
  choices: { label: string; survivalImpact: number; wealthImpact: number }[];
}

const SCENARIOS: Scenario[] = [
  { month: 1, event: "Market drops 25%", impact: "Your portfolio lost $15,000", choices: [
    { label: "Panic sell everything", survivalImpact: -5, wealthImpact: -20 },
    { label: "Hold and rebalance", survivalImpact: 5, wealthImpact: 10 },
    { label: "Buy more at discount", survivalImpact: -2, wealthImpact: 15 },
  ]},
  { month: 3, event: "Layoff warning at work", impact: "Your department may be cut", choices: [
    { label: "Start job searching now", survivalImpact: 10, wealthImpact: 0 },
    { label: "Update resume but wait", survivalImpact: 5, wealthImpact: 0 },
    { label: "Ignore it", survivalImpact: -10, wealthImpact: 0 },
  ]},
  { month: 5, event: "Income reduced 30%", impact: "Pay cut to avoid layoffs", choices: [
    { label: "Cut all discretionary spending", survivalImpact: 15, wealthImpact: 5 },
    { label: "Reduce spending by 20%", survivalImpact: 8, wealthImpact: 3 },
    { label: "Maintain lifestyle using savings", survivalImpact: -10, wealthImpact: -8 },
  ]},
  { month: 8, event: "Car breaks down ($3,000)", impact: "Emergency expense hits", choices: [
    { label: "Use emergency fund", survivalImpact: 5, wealthImpact: -3 },
    { label: "Put on credit card", survivalImpact: -5, wealthImpact: -5 },
    { label: "Take out personal loan", survivalImpact: -3, wealthImpact: -4 },
  ]},
  { month: 12, event: "Recovery begins", impact: "Markets start rebounding", choices: [
    { label: "Rebuild emergency fund first", survivalImpact: 10, wealthImpact: 3 },
    { label: "Increase investments aggressively", survivalImpact: 0, wealthImpact: 12 },
    { label: "Celebrate with a splurge", survivalImpact: -5, wealthImpact: -5 },
  ]},
];

export const RecessionPlaybook = () => {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [survivalScore, setSurvivalScore] = useState(50);
  const [wealthScore, setWealthScore] = useState(50);
  const [decisions, setDecisions] = useState<string[]>([]);
  const [completed, setCompleted] = useState(false);

  const makeChoice = (choiceIdx: number) => {
    const scenario = SCENARIOS[currentScenario];
    const choice = scenario.choices[choiceIdx];
    setSurvivalScore(prev => Math.max(0, Math.min(100, prev + choice.survivalImpact)));
    setWealthScore(prev => Math.max(0, Math.min(100, prev + choice.wealthImpact)));
    setDecisions(prev => [...prev, choice.label]);
    if (currentScenario < SCENARIOS.length - 1) {
      setCurrentScenario(prev => prev + 1);
    } else {
      setCompleted(true);
    }
  };

  const reset = () => {
    setCurrentScenario(0);
    setSurvivalScore(50);
    setWealthScore(50);
    setDecisions([]);
    setCompleted(false);
  };

  const scenario = SCENARIOS[currentScenario];

  return (
    <div className="space-y-6">
      <Card className="border-red-500/30 bg-gradient-to-br from-red-500/5 to-orange-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-red-500" />
            Recession Survival Playbook
          </CardTitle>
          <p className="text-sm text-muted-foreground">Navigate a 12-month recession. Each decision impacts your financial survival and long-term wealth.</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex justify-between text-xs"><span>Financial Stability</span><span>{survivalScore}/100</span></div>
              <Progress value={survivalScore} className="h-3" />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs"><span>Long-term Wealth</span><span>{wealthScore}/100</span></div>
              <Progress value={wealthScore} className="h-3" />
            </div>
          </div>

          {!completed ? (
            <Card className="bg-card border-red-500/20">
              <CardContent className="p-6 space-y-4">
                <Badge variant="outline">Month {scenario.month}</Badge>
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <TrendingDown className="h-5 w-5 text-red-500" />
                  {scenario.event}
                </h3>
                <p className="text-sm text-muted-foreground">{scenario.impact}</p>
                <div className="space-y-2">
                  {scenario.choices.map((choice, idx) => (
                    <Button key={idx} variant="outline" className="w-full justify-start h-auto py-3" onClick={() => makeChoice(idx)}>
                      {choice.label}
                    </Button>
                  ))}
                </div>
                <Progress value={(currentScenario / SCENARIOS.length) * 100} className="h-1" />
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-card border-emerald-500/20">
              <CardContent className="p-6 space-y-4 text-center">
                <Shield className="h-12 w-12 mx-auto text-emerald-500" />
                <h3 className="text-xl font-bold">Recession Complete!</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Stability Score</p>
                    <p className={`text-3xl font-bold ${survivalScore >= 60 ? "text-emerald-500" : "text-red-500"}`}>{survivalScore}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Wealth Score</p>
                    <p className={`text-3xl font-bold ${wealthScore >= 60 ? "text-emerald-500" : "text-red-500"}`}>{wealthScore}</p>
                  </div>
                </div>
                <div className="text-left space-y-1">
                  <p className="text-sm font-semibold">Your Decisions:</p>
                  {decisions.map((d, i) => <p key={i} className="text-xs text-muted-foreground">Month {SCENARIOS[i].month}: {d}</p>)}
                </div>
                <Button onClick={reset}>Try Again</Button>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

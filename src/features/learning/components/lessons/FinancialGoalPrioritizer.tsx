import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Target, ArrowUp, ArrowDown } from "lucide-react";

interface Goal {
  id: string;
  name: string;
  target: number;
  priority: number;
  monthlyAllocation: number;
  deadline: number; // years
}

export const FinancialGoalPrioritizer = () => {
  const [monthlyBudget, setMonthlyBudget] = useState(1500);
  const [goals, setGoals] = useState<Goal[]>([
    { id: "1", name: "Emergency Fund", target: 20000, priority: 1, monthlyAllocation: 500, deadline: 3 },
    { id: "2", name: "Down Payment", target: 60000, priority: 2, monthlyAllocation: 400, deadline: 5 },
    { id: "3", name: "Retirement", target: 500000, priority: 3, monthlyAllocation: 400, deadline: 30 },
    { id: "4", name: "Vacation", target: 5000, priority: 4, monthlyAllocation: 200, deadline: 1 },
  ]);

  const totalAllocated = goals.reduce((s, g) => s + g.monthlyAllocation, 0);
  const remaining = monthlyBudget - totalAllocated;

  const updateAllocation = (id: string, val: number) => {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, monthlyAllocation: val } : g));
  };

  const movePriority = (id: string, dir: -1 | 1) => {
    const idx = goals.findIndex(g => g.id === id);
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= goals.length) return;
    const newGoals = [...goals];
    [newGoals[idx], newGoals[newIdx]] = [newGoals[newIdx], newGoals[idx]];
    setGoals(newGoals.map((g, i) => ({ ...g, priority: i + 1 })));
  };

  return (
    <div className="space-y-6">
      <Card className="border-fuchsia-500/30 bg-gradient-to-br from-fuchsia-500/5 to-purple-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-6 w-6 text-fuchsia-500" />
            Financial Goal Prioritizer
          </CardTitle>
          <p className="text-sm text-muted-foreground">Rank and fund competing goals. Drag priorities and adjust allocations to see timelines.</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium">Monthly Savings Budget: ${monthlyBudget.toLocaleString()}</label>
            <Slider value={[monthlyBudget]} onValueChange={v => setMonthlyBudget(v[0])} min={500} max={5000} step={100} className="flex-1" />
          </div>

          <div className="space-y-3">
            {goals.map((goal, idx) => {
              const monthsToGoal = goal.monthlyAllocation > 0 ? Math.ceil(goal.target / goal.monthlyAllocation) : Infinity;
              const yearsToGoal = monthsToGoal / 12;
              const onTrack = yearsToGoal <= goal.deadline;
              const progress = goal.monthlyAllocation > 0 ? Math.min(100, (goal.deadline * 12 * goal.monthlyAllocation / goal.target) * 100) : 0;

              return (
                <Card key={goal.id} className="bg-card">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="flex flex-col gap-0.5">
                          <Button size="icon" variant="ghost" className="h-5 w-5" onClick={() => movePriority(goal.id, -1)} disabled={idx === 0}>
                            <ArrowUp className="h-3 w-3" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-5 w-5" onClick={() => movePriority(goal.id, 1)} disabled={idx === goals.length - 1}>
                            <ArrowDown className="h-3 w-3" />
                          </Button>
                        </div>
                        <div>
                          <p className="font-semibold text-sm">#{goal.priority} {goal.name}</p>
                          <p className="text-xs text-muted-foreground">Target: ${goal.target.toLocaleString()} in {goal.deadline} years</p>
                        </div>
                      </div>
                      <Badge variant={onTrack ? "default" : "destructive"}>
                        {onTrack ? `✓ ${yearsToGoal.toFixed(1)}y` : `⚠ ${yearsToGoal.toFixed(1)}y needed`}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs w-20">${goal.monthlyAllocation}/mo</span>
                      <Slider value={[goal.monthlyAllocation]} onValueChange={v => updateAllocation(goal.id, v[0])} min={0} max={2000} step={50} className="flex-1" />
                    </div>
                    <Progress value={progress} className="h-2 mt-2" />
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="text-center p-3 rounded-lg border bg-card">
            <span className={`text-sm font-medium ${remaining >= 0 ? "text-emerald-500" : "text-destructive"}`}>
              {remaining >= 0 ? `$${remaining} unallocated` : `$${Math.abs(remaining)} over budget!`}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

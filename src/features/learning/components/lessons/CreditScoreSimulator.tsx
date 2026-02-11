import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, TrendingUp, TrendingDown } from "lucide-react";

interface Action {
  label: string;
  impact: number;
  category: string;
  description: string;
}

const ACTIONS: Action[] = [
  { label: "Pay all bills on time", impact: 15, category: "Payment History", description: "+15 pts — 35% of your score" },
  { label: "Miss a payment", impact: -60, category: "Payment History", description: "-60 pts — Late payments hurt the most" },
  { label: "Pay down credit card to 10% utilization", impact: 25, category: "Utilization", description: "+25 pts — Under 10% is ideal" },
  { label: "Max out a credit card", impact: -45, category: "Utilization", description: "-45 pts — High utilization is risky" },
  { label: "Open a new credit card", impact: -10, category: "New Credit", description: "-10 pts — Hard inquiry + lower avg age" },
  { label: "Close oldest credit card", impact: -20, category: "Credit Age", description: "-20 pts — Reduces credit history length" },
  { label: "Become authorized user on old account", impact: 12, category: "Credit Age", description: "+12 pts — Inherits account age" },
  { label: "Diversify with an installment loan", impact: 8, category: "Credit Mix", description: "+8 pts — Mix of credit types helps" },
  { label: "Apply for 3 cards in one month", impact: -30, category: "New Credit", description: "-30 pts — Multiple hard inquiries" },
  { label: "Dispute & remove an error", impact: 20, category: "Payment History", description: "+20 pts — Cleaning up mistakes" },
];

const getScoreColor = (score: number) => {
  if (score >= 750) return "text-emerald-500";
  if (score >= 700) return "text-green-500";
  if (score >= 650) return "text-yellow-500";
  if (score >= 600) return "text-orange-500";
  return "text-red-500";
};

const getScoreLabel = (score: number) => {
  if (score >= 750) return "Excellent";
  if (score >= 700) return "Good";
  if (score >= 650) return "Fair";
  if (score >= 600) return "Poor";
  return "Very Poor";
};

export const CreditScoreSimulator = () => {
  const [score, setScore] = useState(680);
  const [history, setHistory] = useState<{ action: string; impact: number }[]>([]);

  const applyAction = (action: Action) => {
    const newScore = Math.max(300, Math.min(850, score + action.impact));
    setScore(newScore);
    setHistory(prev => [{ action: action.label, impact: action.impact }, ...prev.slice(0, 9)]);
  };

  return (
    <div className="space-y-6">
      <Card className="border-blue-500/30 bg-gradient-to-br from-blue-500/5 to-cyan-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-6 w-6 text-blue-500" />
            Credit Score Simulator
          </CardTitle>
          <p className="text-sm text-muted-foreground">Click actions to see how each financial decision impacts your credit score.</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center p-6 rounded-xl bg-card border">
            <p className="text-sm text-muted-foreground mb-1">Your Credit Score</p>
            <p className={`text-6xl font-bold ${getScoreColor(score)}`}>{score}</p>
            <Badge className="mt-2">{getScoreLabel(score)}</Badge>
            <div className="w-full h-3 rounded-full bg-gradient-to-r from-red-500 via-yellow-500 to-emerald-500 mt-4 relative">
              <div className="absolute w-3 h-5 bg-foreground rounded-sm -top-1 transition-all" style={{ left: `${((score - 300) / 550) * 100}%` }} />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-1"><span>300</span><span>550</span><span>700</span><span>850</span></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {ACTIONS.map(action => (
              <Button key={action.label} variant="outline" className="justify-start h-auto py-3 text-left" onClick={() => applyAction(action)}>
                <div>
                  <div className="flex items-center gap-2">
                    {action.impact > 0 ? <TrendingUp className="h-4 w-4 text-emerald-500" /> : <TrendingDown className="h-4 w-4 text-red-500" />}
                    <span className="font-medium text-sm">{action.label}</span>
                  </div>
                  <p className="text-xs text-muted-foreground ml-6">{action.description}</p>
                </div>
              </Button>
            ))}
          </div>

          {history.length > 0 && (
            <div className="space-y-1">
              <h4 className="text-sm font-semibold">Recent Actions</h4>
              {history.map((h, i) => (
                <div key={i} className="flex justify-between text-sm px-3 py-1 rounded bg-muted/50">
                  <span>{h.action}</span>
                  <span className={h.impact > 0 ? "text-emerald-500" : "text-red-500"}>{h.impact > 0 ? "+" : ""}{h.impact}</span>
                </div>
              ))}
            </div>
          )}

          <Button variant="ghost" onClick={() => { setScore(680); setHistory([]); }}>Reset to 680</Button>
        </CardContent>
      </Card>
    </div>
  );
};

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Award, CheckCircle } from "lucide-react";

const TASKS = [
  {
    title: "Financial Health Check",
    instruction: "Based on the data below, classify this company's financial health.",
    data: { revenue: "$2.4B", netIncome: "$180M", totalDebt: "$800M", cash: "$350M", roe: "14%", currentRatio: "1.6" },
    options: ["Strong", "Moderate", "Weak"],
    correct: "Moderate",
    explanation: "Profitable with decent ROE, but debt-to-cash ratio of 2.3x and moderate margins suggest room for improvement.",
  },
  {
    title: "Valuation Assessment",
    instruction: "Company trades at 35x P/E. Peers average 22x. What's your call?",
    data: { pe: "35x", peerAvg: "22x", revenueGrowth: "28%", peerGrowth: "12%", margin: "18%", peerMargin: "15%" },
    options: ["Overvalued", "Fairly valued (growth premium)", "Undervalued"],
    correct: "Fairly valued (growth premium)",
    explanation: "The premium P/E is justified by 2x faster growth and superior margins vs peers.",
  },
  {
    title: "M&A Decision",
    instruction: "Should the board approve this acquisition?",
    data: { targetPrice: "$1.2B", premium: "35%", synergies: "$150M/yr", debtLoad: "3.5x EBITDA", cultureFit: "Low" },
    options: ["Approve — synergies justify it", "Reject — too risky", "Negotiate lower price"],
    correct: "Negotiate lower price",
    explanation: "Synergies are attractive but 35% premium + high debt + low culture fit = too much risk at current price.",
  },
  {
    title: "Dividend vs Buyback",
    instruction: "Company has $500M excess cash. Stock trades below intrinsic value. Best use?",
    data: { excessCash: "$500M", stockPrice: "$45", intrinsicValue: "$62", divYield: "2.1%", sharesOut: "200M" },
    options: ["Increase dividend", "Share buyback", "Retain for acquisitions"],
    correct: "Share buyback",
    explanation: "When stock trades well below intrinsic value, buybacks create maximum shareholder value.",
  },
];

export const CorpFinanceCapstone = () => {
  const [taskIdx, setTaskIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const task = TASKS[taskIdx];
  const score = TASKS.filter((t, i) => answers[i] === t.correct).length;
  const allDone = Object.keys(answers).length === TASKS.length;

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">Apply everything you've learned in this comprehensive corporate finance challenge.</p>

      <div className="flex gap-2 flex-wrap">
        {TASKS.map((t, i) => (
          <Button key={i} variant={taskIdx === i ? "default" : "outline"} size="sm" onClick={() => setTaskIdx(i)}>
            {answers[i] !== undefined ? (answers[i] === t.correct ? "✓" : "✗") : `${i + 1}.`} {t.title}
          </Button>
        ))}
      </div>

      <Card className="p-5 bg-card/60 border-border/50 space-y-4">
        <p className="font-medium text-foreground">{task.instruction}</p>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(task.data).map(([key, value]) => (
            <div key={key} className="p-2 bg-muted/30 rounded-lg">
              <p className="text-xs text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
              <p className="text-sm font-bold text-foreground">{value}</p>
            </div>
          ))}
        </div>
        <div className="space-y-2">
          {task.options.map((opt) => (
            <button key={opt} onClick={() => setAnswers(p => ({ ...p, [taskIdx]: opt }))}
              className={cn("w-full text-left p-3 rounded-lg border transition-all text-sm",
                answers[taskIdx] === undefined ? "border-border/50 hover:border-primary/40" :
                  opt === task.correct ? "border-emerald-500/50 bg-emerald-500/10" :
                    answers[taskIdx] === opt ? "border-destructive/50 bg-destructive/10" : "border-border/30 opacity-50"
              )}>
              {opt}
            </button>
          ))}
        </div>
        {answers[taskIdx] !== undefined && (
          <p className={cn("text-xs font-medium", answers[taskIdx] === task.correct ? "text-emerald-500" : "text-destructive")}>
            {task.explanation}
          </p>
        )}
      </Card>

      {allDone && (
        <Card className="p-5 bg-primary/10 border-primary/30 text-center space-y-2">
          <Award className="w-10 h-10 text-primary mx-auto" />
          <p className="text-xl font-bold text-foreground">Capstone Score: {score}/{TASKS.length}</p>
          <p className="text-sm text-muted-foreground">{score === TASKS.length ? "Perfect! You've mastered corporate finance." : "Review the topics where you struggled."}</p>
        </Card>
      )}
    </div>
  );
};

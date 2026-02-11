import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SCENARIOS = [
  {
    title: "Software-as-a-Service",
    question: "When should a SaaS company recognize revenue from a 3-year contract paid upfront?",
    options: [
      { text: "All at contract signing", correct: false, explanation: "Violates matching principle — services haven't been delivered yet." },
      { text: "Ratably over 36 months", correct: true, explanation: "Correct under ASC 606 — revenue recognized as performance obligation is satisfied over time." },
      { text: "50% upfront, 50% at end", correct: false, explanation: "No basis under GAAP for this split without matching to service delivery." },
    ],
  },
  {
    title: "Construction (Long-term Contract)",
    question: "A builder has a $10M contract, 40% complete. Revenue to recognize?",
    options: [
      { text: "$0 until project completion", correct: false, explanation: "Completed contract method is no longer standard under ASC 606." },
      { text: "$4M (percentage of completion)", correct: true, explanation: "Correct — percentage-of-completion recognizes revenue proportional to work done." },
      { text: "$10M immediately", correct: false, explanation: "Cannot recognize unearned revenue before performance." },
    ],
  },
  {
    title: "GAAP vs. IFRS",
    question: "Which statement about GAAP vs IFRS is correct?",
    options: [
      { text: "LIFO inventory is allowed under both", correct: false, explanation: "LIFO is allowed under GAAP but prohibited under IFRS." },
      { text: "IFRS allows asset revaluation, GAAP does not", correct: true, explanation: "Correct — IFRS permits revaluing PPE to fair value; GAAP requires historical cost." },
      { text: "Both use identical lease accounting", correct: false, explanation: "While converging, there are still differences in lease classification criteria." },
    ],
  },
];

export const RevenueRecognitionLab = () => {
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [answer, setAnswer] = useState<number | null>(null);
  const scenario = SCENARIOS[scenarioIdx];

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">Test your understanding of revenue recognition rules and accounting standards.</p>

      <div className="flex gap-2 flex-wrap">
        {SCENARIOS.map((s, i) => (
          <Button key={i} variant={scenarioIdx === i ? "default" : "outline"} size="sm" onClick={() => { setScenarioIdx(i); setAnswer(null); }}>
            {s.title}
          </Button>
        ))}
      </div>

      <Card className="p-5 bg-card/60 border-border/50">
        <p className="text-foreground font-medium mb-4">{scenario.question}</p>
        <div className="space-y-2">
          {scenario.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => setAnswer(i)}
              className={cn(
                "w-full text-left p-3 rounded-lg border transition-all text-sm",
                answer === null ? "border-border/50 hover:border-primary/40 bg-muted/20" :
                  opt.correct ? "border-emerald-500/50 bg-emerald-500/10" :
                    answer === i ? "border-destructive/50 bg-destructive/10" : "border-border/30 bg-muted/10 opacity-60"
              )}
            >
              <span className="font-medium text-foreground">{opt.text}</span>
              {answer !== null && (answer === i || opt.correct) && (
                <p className={cn("text-xs mt-1", opt.correct ? "text-emerald-500" : "text-destructive")}>{opt.explanation}</p>
              )}
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
};

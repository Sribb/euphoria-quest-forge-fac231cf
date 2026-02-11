import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";

const SCENARIOS = [
  {
    company: "MegaCorp Industries",
    facts: [
      { text: "CEO is also Chairman of the Board", flag: true, reason: "Lack of separation raises conflict of interest concerns." },
      { text: "Independent directors make up 75% of board", flag: false, reason: "Strong independent oversight." },
      { text: "Related-party transactions worth $50M undisclosed", flag: true, reason: "Undisclosed related-party deals are a major red flag." },
      { text: "Annual shareholder votes on executive compensation", flag: false, reason: "Say-on-pay gives shareholders a voice." },
    ],
  },
  {
    company: "GreenTech Solutions",
    facts: [
      { text: "Dual-class share structure gives founder 60% voting power", flag: true, reason: "Disproportionate voting power reduces accountability." },
      { text: "Audit committee composed entirely of independent directors", flag: false, reason: "Best practice for financial oversight." },
      { text: "Board meets only twice per year", flag: true, reason: "Infrequent meetings suggest weak oversight." },
      { text: "Whistleblower hotline in place", flag: false, reason: "Encourages internal reporting of misconduct." },
    ],
  },
];

export const CorporateGovernanceQuiz = () => {
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, boolean | null>>({});
  const scenario = SCENARIOS[scenarioIdx];

  const handleAnswer = (factIdx: number, isFlagged: boolean) => {
    setAnswers(prev => ({ ...prev, [factIdx]: isFlagged }));
  };

  const score = scenario.facts.filter((f, i) => answers[i] === f.flag).length;
  const allAnswered = Object.keys(answers).length === scenario.facts.length;

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        {SCENARIOS.map((s, i) => (
          <Button key={i} variant={scenarioIdx === i ? "default" : "outline"} size="sm" onClick={() => { setScenarioIdx(i); setAnswers({}); }}>
            {s.company}
          </Button>
        ))}
      </div>

      <p className="text-sm text-muted-foreground">For each fact, decide: is it a governance <span className="text-destructive font-medium">red flag</span> or a <span className="text-emerald-500 font-medium">green sign</span>?</p>

      <div className="space-y-3">
        {scenario.facts.map((fact, i) => (
          <Card key={i} className="p-4 bg-card/60 border-border/50 space-y-2">
            <p className="text-sm text-foreground font-medium">{fact.text}</p>
            <div className="flex gap-2">
              <Button size="sm" variant={answers[i] === true ? "destructive" : "outline"} onClick={() => handleAnswer(i, true)}>
                <AlertTriangle className="w-3 h-3 mr-1" /> Red Flag
              </Button>
              <Button size="sm" variant={answers[i] === false ? "default" : "outline"} onClick={() => handleAnswer(i, false)}>
                <CheckCircle className="w-3 h-3 mr-1" /> Green Sign
              </Button>
            </div>
            {answers[i] !== undefined && answers[i] !== null && (
              <p className={cn("text-xs font-medium", answers[i] === fact.flag ? "text-emerald-500" : "text-destructive")}>
                {answers[i] === fact.flag ? "✓ " : "✗ "}{fact.reason}
              </p>
            )}
          </Card>
        ))}
      </div>

      {allAnswered && (
        <Card className="p-4 bg-primary/10 border-primary/30 text-center">
          <p className="text-lg font-bold text-foreground">Score: {score}/{scenario.facts.length}</p>
        </Card>
      )}
    </div>
  );
};

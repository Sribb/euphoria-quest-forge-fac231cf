import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AlertTriangle, Eye, Search } from "lucide-react";

const CASES = [
  {
    company: "AggressiveAccounting Inc.",
    statements: [
      { item: "Revenue grew 40% but cash from operations declined 15%", suspicious: true, explanation: "Revenue without corresponding cash suggests aggressive recognition or channel stuffing." },
      { item: "Days sales outstanding increased from 35 to 72 days", suspicious: true, explanation: "Rapidly rising DSO may indicate fictitious sales or relaxed credit terms to inflate revenue." },
      { item: "Gross margin expanded 2% YoY", suspicious: false, explanation: "Modest margin expansion is normal with scale or pricing power." },
      { item: "Large increase in 'other assets' with no footnote explanation", suspicious: true, explanation: "Unexplained balance sheet items can hide losses or capitalize expenses." },
    ],
  },
  {
    company: "SmoothEarnings Corp.",
    statements: [
      { item: "Earnings beat consensus every quarter for 20 consecutive quarters", suspicious: true, explanation: "Unrealistically consistent results may indicate earnings management." },
      { item: "Operating cash flow consistently exceeds net income", suspicious: false, explanation: "This is actually a positive sign of high earnings quality." },
      { item: "Frequent changes in depreciation methods", suspicious: true, explanation: "Changing accounting methods to smooth earnings is a classic manipulation technique." },
      { item: "Growing gap between GAAP and non-GAAP earnings", suspicious: true, explanation: "Widening adjustments may indicate core business deterioration masked by add-backs." },
    ],
  },
];

export const ForensicAccountingLab = () => {
  const [caseIdx, setCaseIdx] = useState(0);
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const [guesses, setGuesses] = useState<Record<number, boolean | null>>({});

  const currentCase = CASES[caseIdx];
  const allGuessed = Object.keys(guesses).length === currentCase.statements.length;
  const score = currentCase.statements.filter((s, i) => guesses[i] === s.suspicious).length;

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">Play forensic accountant — identify which financial statement items are suspicious and which are normal.</p>

      <div className="flex gap-2">
        {CASES.map((c, i) => (
          <Button key={i} variant={caseIdx === i ? "default" : "outline"} size="sm" onClick={() => { setCaseIdx(i); setRevealed({}); setGuesses({}); }}>
            {c.company}
          </Button>
        ))}
      </div>

      <div className="space-y-3">
        {currentCase.statements.map((stmt, i) => (
          <Card key={i} className="p-4 bg-card/60 border-border/50 space-y-2">
            <p className="text-sm text-foreground font-medium">{stmt.item}</p>
            {guesses[i] === undefined || guesses[i] === null ? (
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => { setGuesses(p => ({ ...p, [i]: true })); setRevealed(p => ({ ...p, [i]: true })); }}>
                  <AlertTriangle className="w-3 h-3 mr-1" /> Suspicious
                </Button>
                <Button size="sm" variant="outline" onClick={() => { setGuesses(p => ({ ...p, [i]: false })); setRevealed(p => ({ ...p, [i]: true })); }}>
                  <Eye className="w-3 h-3 mr-1" /> Normal
                </Button>
              </div>
            ) : (
              <p className={cn("text-xs font-medium", guesses[i] === stmt.suspicious ? "text-emerald-500" : "text-destructive")}>
                {guesses[i] === stmt.suspicious ? "✓ Correct! " : "✗ Wrong. "}{stmt.explanation}
              </p>
            )}
          </Card>
        ))}
      </div>

      {allGuessed && (
        <Card className="p-4 bg-primary/10 border-primary/30 text-center">
          <p className="text-lg font-bold text-foreground">Forensic Score: {score}/{currentCase.statements.length}</p>
          <p className="text-sm text-muted-foreground">{score === currentCase.statements.length ? "Perfect detective work!" : "Keep sharpening your forensic skills."}</p>
        </Card>
      )}
    </div>
  );
};

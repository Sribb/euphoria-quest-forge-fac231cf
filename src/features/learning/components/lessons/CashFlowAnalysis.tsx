import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight, DollarSign } from "lucide-react";

const COMPANIES = [
  {
    name: "TechGrow Inc.",
    operating: 850, investing: -400, financing: -200,
    details: { revenue: 2000, opExpenses: 1150, capex: 400, debtRepay: 200 },
  },
  {
    name: "RetailKing Co.",
    operating: -120, investing: -50, financing: 300,
    details: { revenue: 800, opExpenses: 920, capex: 50, debtRepay: -300 },
  },
  {
    name: "SteadyDiv Corp.",
    operating: 500, investing: -100, financing: -350,
    details: { revenue: 1200, opExpenses: 700, capex: 100, debtRepay: 350 },
  },
];

export const CashFlowAnalysis = () => {
  const [selected, setSelected] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [guess, setGuess] = useState<string | null>(null);

  const company = COMPANIES[selected];
  const netCF = company.operating + company.investing + company.financing;
  const isHealthy = company.operating > 0 && netCF > 0;

  const options = ["Healthy & Growing", "Cash Burning", "Debt Dependent"];
  const correctAnswer = company.operating > 0 && company.financing < 0
    ? "Healthy & Growing"
    : company.operating < 0
      ? "Cash Burning"
      : "Debt Dependent";

  return (
    <div className="space-y-6">
      <div className="flex gap-2 flex-wrap">
        {COMPANIES.map((c, i) => (
          <Button key={i} variant={selected === i ? "default" : "outline"} size="sm"
            onClick={() => { setSelected(i); setShowAnswer(false); setGuess(null); }}>
            {c.name}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Operating", value: company.operating, desc: "Day-to-day business" },
          { label: "Investing", value: company.investing, desc: "Capex & assets" },
          { label: "Financing", value: company.financing, desc: "Debt & equity" },
        ].map((item) => (
          <Card key={item.label} className="p-4 text-center bg-card/60 border-border/50">
            <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
            <p className={cn("text-xl font-bold", item.value >= 0 ? "text-emerald-500" : "text-destructive")}>
              {item.value >= 0 ? "+" : ""}{item.value}M
            </p>
            <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
          </Card>
        ))}
      </div>

      <Card className="p-4 bg-card/60 border-border/50 flex items-center justify-between">
        <span className="font-medium text-foreground">Net Cash Flow</span>
        <div className="flex items-center gap-2">
          {netCF >= 0 ? <ArrowUpRight className="w-5 h-5 text-emerald-500" /> : <ArrowDownRight className="w-5 h-5 text-destructive" />}
          <span className={cn("text-2xl font-bold", netCF >= 0 ? "text-emerald-500" : "text-destructive")}>
            ${Math.abs(netCF)}M
          </span>
        </div>
      </Card>

      <div className="space-y-3">
        <p className="text-sm font-medium text-foreground">What's your assessment?</p>
        <div className="flex gap-2 flex-wrap">
          {options.map((opt) => (
            <Button key={opt} size="sm"
              variant={guess === opt ? (showAnswer ? (opt === correctAnswer ? "default" : "destructive") : "default") : "outline"}
              onClick={() => { setGuess(opt); setShowAnswer(true); }}>
              {opt}
            </Button>
          ))}
        </div>
        {showAnswer && (
          <p className={cn("text-sm font-medium", guess === correctAnswer ? "text-emerald-500" : "text-destructive")}>
            {guess === correctAnswer ? "✓ Correct!" : `✗ The answer is "${correctAnswer}". ${company.operating < 0 ? "Negative operating cash flow means the core business isn't generating cash." : company.financing > 0 ? "Relying on external financing to fund operations." : "Strong operating cash flow funding both investments and debt repayment."}`}
          </p>
        )}
      </div>
    </div>
  );
};

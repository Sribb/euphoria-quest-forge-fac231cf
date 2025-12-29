import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ClipboardCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Star,
  Trophy
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface InvestmentDecision {
  id: number;
  scenario: string;
  context: string;
  options: {
    text: string;
    checklistItems: string[];
    score: number;
    feedback: string;
  }[];
}

const checklistCriteria = [
  { id: "research", label: "Did thorough research", icon: "📚" },
  { id: "diversified", label: "Considered diversification", icon: "🎯" },
  { id: "risk", label: "Assessed risk tolerance", icon: "⚖️" },
  { id: "timeline", label: "Matched to time horizon", icon: "⏳" },
  { id: "emotion", label: "Avoided emotional decisions", icon: "🧠" },
  { id: "costs", label: "Considered fees/taxes", icon: "💰" },
];

const decisions: InvestmentDecision[] = [
  {
    id: 1,
    scenario: "Hot Stock Tip",
    context: "Your coworker excitedly tells you about a stock that 'doubled last month' and insists you should buy it today before it goes higher.",
    options: [
      {
        text: "Buy immediately - don't want to miss out!",
        checklistItems: [],
        score: 10,
        feedback: "FOMO (Fear of Missing Out) is a common trap. No research, no risk assessment, pure emotional decision."
      },
      {
        text: "Research the company's fundamentals first",
        checklistItems: ["research", "emotion"],
        score: 60,
        feedback: "Good start with research and avoiding impulsive action, but consider your overall portfolio fit."
      },
      {
        text: "Thank them, but stick to my investment plan",
        checklistItems: ["research", "diversified", "risk", "timeline", "emotion"],
        score: 95,
        feedback: "Excellent discipline! Hot tips rarely work out, and sticking to your plan shows consistency."
      }
    ]
  },
  {
    id: 2,
    scenario: "Market Crash",
    context: "Markets dropped 25% this month. Your portfolio is down significantly. Headlines are panicking about a recession.",
    options: [
      {
        text: "Sell everything to cash immediately",
        checklistItems: [],
        score: 15,
        feedback: "Panic selling locks in losses. You're selling at the worst possible time driven by fear."
      },
      {
        text: "Stay the course if goals haven't changed",
        checklistItems: ["research", "risk", "timeline", "emotion"],
        score: 90,
        feedback: "Staying disciplined during downturns is crucial. Time in market beats timing the market."
      },
      {
        text: "Rebalance and buy more at lower prices",
        checklistItems: ["research", "diversified", "risk", "timeline", "emotion", "costs"],
        score: 100,
        feedback: "Perfect! You're following the 'buy low' principle while maintaining discipline and diversification."
      }
    ]
  },
  {
    id: 3,
    scenario: "Large Bonus Received",
    context: "You received a $50,000 year-end bonus. You're considering how to invest it.",
    options: [
      {
        text: "Put it all in the best performing stock this year",
        checklistItems: [],
        score: 20,
        feedback: "Chasing performance and concentration risk. Last year's winner is often next year's laggard."
      },
      {
        text: "Dollar-cost average into diversified funds",
        checklistItems: ["research", "diversified", "risk", "timeline", "emotion", "costs"],
        score: 95,
        feedback: "Excellent strategy! DCA reduces timing risk and diversification spreads risk across assets."
      },
      {
        text: "Keep it in cash until markets look better",
        checklistItems: ["emotion"],
        score: 35,
        feedback: "Market timing rarely works. Cash loses to inflation while you wait for the 'perfect' moment."
      }
    ]
  },
  {
    id: 4,
    scenario: "Retirement Planning",
    context: "You're 35 with 30 years until retirement. Choosing your 401k allocation.",
    options: [
      {
        text: "100% bonds for safety",
        checklistItems: ["risk"],
        score: 25,
        feedback: "Too conservative for a 30-year horizon. You're sacrificing significant growth potential."
      },
      {
        text: "Age-appropriate 80/20 stock/bond split",
        checklistItems: ["research", "diversified", "risk", "timeline", "costs"],
        score: 95,
        feedback: "Great allocation! Matches your long time horizon while maintaining some stability."
      },
      {
        text: "All in a single sector I believe in",
        checklistItems: [],
        score: 15,
        feedback: "Extreme concentration risk. Retirement savings need diversification, not speculation."
      }
    ]
  },
  {
    id: 5,
    scenario: "Crypto Craze",
    context: "Everyone at parties is talking about crypto gains. You're considering putting 50% of your savings into Bitcoin.",
    options: [
      {
        text: "Go for it - crypto is the future!",
        checklistItems: [],
        score: 10,
        feedback: "FOMO and concentration risk combined. 50% in any single volatile asset is extremely risky."
      },
      {
        text: "Allocate 5% as speculative position",
        checklistItems: ["research", "diversified", "risk"],
        score: 80,
        feedback: "Reasonable approach. Small speculative allocation won't ruin you if it fails."
      },
      {
        text: "Skip it - I don't understand it well enough",
        checklistItems: ["research", "risk", "emotion"],
        score: 85,
        feedback: "Valid approach. Buffett's rule: don't invest in what you don't understand."
      }
    ]
  },
];

export const DecisionChecklistGrader = () => {
  const [currentDecision, setCurrentDecision] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [completedDecisions, setCompletedDecisions] = useState(0);

  const decision = decisions[currentDecision];
  const avgScore = completedDecisions > 0 ? totalScore / completedDecisions : 0;

  const handleSelect = (optionIndex: number) => {
    setSelectedOption(optionIndex);
    setShowFeedback(true);
    
    const option = decision.options[optionIndex];
    setTotalScore(totalScore + option.score);
    setCompletedDecisions(completedDecisions + 1);

    if (option.score >= 90) {
      toast.success("Excellent decision! Perfect discipline.");
    } else if (option.score >= 60) {
      toast.info("Good thinking, but there's room for improvement.");
    } else {
      toast.error("Common mistake! Learn from this.");
    }
  };

  const nextDecision = () => {
    if (currentDecision < decisions.length - 1) {
      setCurrentDecision(currentDecision + 1);
      setSelectedOption(null);
      setShowFeedback(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-destructive";
  };

  const getGrade = (avg: number) => {
    if (avg >= 90) return { grade: "A+", label: "Master Investor" };
    if (avg >= 80) return { grade: "A", label: "Disciplined Investor" };
    if (avg >= 70) return { grade: "B", label: "Good Decision Maker" };
    if (avg >= 60) return { grade: "C", label: "Room to Improve" };
    return { grade: "D", label: "Needs Practice" };
  };

  const isComplete = currentDecision === decisions.length - 1 && showFeedback;

  return (
    <Card className="p-6 space-y-6 bg-gradient-to-br from-background to-muted/10">
      <div>
        <h3 className="text-xl font-bold mb-1 flex items-center gap-2">
          <ClipboardCheck className="w-5 h-5 text-primary" />
          Investment Decision Checklist Grader
        </h3>
        <p className="text-sm text-muted-foreground">
          Test your investing discipline by making decisions and seeing how they score
        </p>
      </div>

      {/* Progress */}
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">
          Decision {currentDecision + 1} of {decisions.length}
        </span>
        <Badge variant="outline" className="text-lg">
          Avg Score: {avgScore.toFixed(0)}/100
        </Badge>
      </div>
      <Progress value={(completedDecisions / decisions.length) * 100} className="h-2" />

      {/* Current Scenario */}
      <Card className="p-5 bg-muted/30">
        <Badge className="mb-3">{decision.scenario}</Badge>
        <p className="text-sm leading-relaxed">{decision.context}</p>
      </Card>

      {/* Checklist Legend */}
      <div className="flex flex-wrap gap-2">
        {checklistCriteria.map(c => (
          <span key={c.id} className="text-xs bg-muted/50 px-2 py-1 rounded flex items-center gap-1">
            {c.icon} {c.label}
          </span>
        ))}
      </div>

      {/* Options */}
      {!showFeedback && (
        <div className="space-y-3">
          {decision.options.map((option, idx) => (
            <Button
              key={idx}
              variant="outline"
              onClick={() => handleSelect(idx)}
              className="w-full text-left h-auto py-4 px-4 justify-start"
            >
              <span className="text-sm">{option.text}</span>
            </Button>
          ))}
        </div>
      )}

      {/* Feedback */}
      <AnimatePresence>
        {showFeedback && selectedOption !== null && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="p-4 bg-muted/50 space-y-4">
              {/* Score */}
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">Decision Score</h4>
                <span className={`text-3xl font-bold ${getScoreColor(decision.options[selectedOption].score)}`}>
                  {decision.options[selectedOption].score}/100
                </span>
              </div>

              {/* Checklist Items Hit */}
              <div>
                <p className="text-xs font-semibold mb-2">Checklist Criteria Met:</p>
                <div className="grid grid-cols-2 gap-2">
                  {checklistCriteria.map(c => {
                    const isHit = decision.options[selectedOption].checklistItems.includes(c.id);
                    return (
                      <div 
                        key={c.id}
                        className={`flex items-center gap-2 text-xs p-2 rounded ${
                          isHit ? 'bg-success/10 text-success' : 'bg-muted/50 text-muted-foreground'
                        }`}
                      >
                        {isHit ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {c.icon} {c.label}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Feedback */}
              <div className="p-3 bg-background/50 rounded-lg">
                <p className="text-sm">{decision.options[selectedOption].feedback}</p>
              </div>

              {/* Best Option */}
              {decision.options[selectedOption].score < 90 && (
                <div className="p-3 bg-success/10 rounded-lg border border-success/30">
                  <p className="text-xs font-semibold text-success mb-1">Better Choice:</p>
                  <p className="text-sm">
                    {decision.options.find(o => o.score >= 90)?.text || decision.options.reduce((a, b) => a.score > b.score ? a : b).text}
                  </p>
                </div>
              )}

              {/* Next or Complete */}
              {!isComplete ? (
                <Button onClick={nextDecision} className="w-full">
                  Next Decision
                </Button>
              ) : (
                <Card className="p-4 bg-primary/10">
                  <div className="flex items-center gap-3">
                    <Trophy className="w-8 h-8 text-primary" />
                    <div>
                      <p className="font-bold text-lg">Final Grade: {getGrade(avgScore).grade}</p>
                      <p className="text-sm text-muted-foreground">{getGrade(avgScore).label}</p>
                    </div>
                    <span className="ml-auto text-3xl font-bold text-primary">{avgScore.toFixed(0)}%</span>
                  </div>
                </Card>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

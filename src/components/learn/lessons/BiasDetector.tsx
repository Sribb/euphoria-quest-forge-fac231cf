import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, AlertTriangle, CheckCircle2, X } from "lucide-react";
import { toast } from "sonner";
import { AIContextualHelp } from "@/components/learn/AIContextualHelp";

interface Scenario {
  id: number;
  situation: string;
  question: string;
  options: { text: string; bias: string; isRational: boolean }[];
  explanation: string;
  biasName: string;
}

const scenarios: Scenario[] = [
  {
    id: 1,
    situation: "You bought a stock at $100. It's now $80. Market analysts say it's headed to $60.",
    question: "What do you do?",
    options: [
      {
        text: "Hold because I don't want to realize the loss",
        bias: "Loss Aversion",
        isRational: false,
      },
      {
        text: "Sell and cut losses based on new information",
        bias: "None",
        isRational: true,
      },
      {
        text: "Buy more to lower my average cost",
        bias: "Anchoring",
        isRational: false,
      },
    ],
    explanation: "Loss aversion makes us hold losing investments to avoid realizing losses. Rational investing means making decisions based on current information, not past purchase prices.",
    biasName: "Loss Aversion Bias",
  },
  {
    id: 2,
    situation: "A tech stock you've been watching has gone up 300% in 6 months. Everyone is talking about it.",
    question: "What's your reaction?",
    options: [
      {
        text: "Buy it - everyone can't be wrong!",
        bias: "Herding",
        isRational: false,
      },
      {
        text: "Analyze fundamentals despite the hype",
        bias: "None",
        isRational: true,
      },
      {
        text: "It's a sure thing - I'll bet big",
        bias: "Overconfidence",
        isRational: false,
      },
    ],
    explanation: "Herding bias causes us to follow the crowd without independent analysis. Bubbles form when everyone chases the same investments without considering valuations.",
    biasName: "Herding Bias",
  },
  {
    id: 3,
    situation: "You correctly predicted the last 3 market moves. A friend asks for stock advice.",
    question: "How do you respond?",
    options: [
      {
        text: "Share my 'system' - I've figured it out",
        bias: "Overconfidence",
        isRational: false,
      },
      {
        text: "Acknowledge luck played a role in my success",
        bias: "None",
        isRational: true,
      },
      {
        text: "Start a paid newsletter with my predictions",
        bias: "Illusion of Control",
        isRational: false,
      },
    ],
    explanation: "Overconfidence bias makes us overestimate our abilities after short-term success. Markets are complex, and past success doesn't guarantee future results.",
    biasName: "Overconfidence Bias",
  },
  {
    id: 4,
    situation: "A value investor you respect just bought a stock. You haven't researched it yourself.",
    question: "What do you do?",
    options: [
      {
        text: "Buy it immediately - they're usually right",
        bias: "Authority Bias",
        isRational: false,
      },
      {
        text: "Research it myself before any decision",
        bias: "None",
        isRational: true,
      },
      {
        text: "Buy a small position to test the waters",
        bias: "Confirmation Bias",
        isRational: false,
      },
    ],
    explanation: "Authority bias causes us to blindly follow experts without independent analysis. Even great investors make mistakes - always do your own research.",
    biasName: "Authority Bias",
  },
  {
    id: 5,
    situation: "Your portfolio is up 50% this year while the market is up 10%. You're feeling smart.",
    question: "What's the reality check?",
    options: [
      {
        text: "I've mastered investing!",
        bias: "Overconfidence",
        isRational: false,
      },
      {
        text: "I likely took on more risk or got lucky",
        bias: "None",
        isRational: true,
      },
      {
        text: "This proves my strategy works forever",
        bias: "Recency Bias",
        isRational: false,
      },
    ],
    explanation: "Recency bias makes us extrapolate recent results into the future. High returns often involve high risk or luck, which can reverse quickly.",
    biasName: "Recency Bias",
  },
];

export const BiasDetector = () => {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);

  const scenario = scenarios[currentScenario];

  const handleAnswer = (optionIndex: number) => {
    setSelectedOption(optionIndex);
    setShowFeedback(true);

    const option = scenario.options[optionIndex];
    if (option.isRational) {
      setScore((prev) => prev + 20);
      toast.success("Excellent! You avoided the bias trap!");
    } else {
      toast.error(`Watch out for ${option.bias}!`);
    }
  };

  const nextScenario = () => {
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario((prev) => prev + 1);
      setSelectedOption(null);
      setShowFeedback(false);
    } else {
      const grade = score >= 80 ? "Excellent" : score >= 60 ? "Good" : "Needs Work";
      toast.success(`Quiz complete! Score: ${score}/100 (${grade})`);
    }
  };

  return (
    <Card className="p-6 space-y-6 bg-gradient-to-br from-background to-muted/20">
      <div>
        <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
          <Brain className="w-5 h-5 text-primary" />
          Behavioral Finance: Bias Detector
        </h3>
        <p className="text-sm text-muted-foreground">
          Learn to recognize and overcome common investing biases
        </p>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">
          Scenario {currentScenario + 1}/{scenarios.length}
        </span>
        <span className="text-lg font-bold text-primary">Score: {score}/100</span>
      </div>

      <Card className="p-4 bg-muted/30">
        <div className="flex items-start gap-3 mb-4">
          <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold mb-2">Situation</h4>
            <p className="text-sm text-muted-foreground">{scenario.situation}</p>
          </div>
        </div>
        
        <h4 className="font-semibold mb-3 text-primary">{scenario.question}</h4>
      </Card>

      {!showFeedback && (
        <div className="space-y-2">
          {scenario.options.map((option, index) => (
            <Button
              key={index}
              onClick={() => handleAnswer(index)}
              variant="outline"
              className="w-full justify-start text-left h-auto py-4 px-4"
            >
              <span className="text-sm">{option.text}</span>
            </Button>
          ))}
        </div>
      )}

      {showFeedback && selectedOption !== null && (
        <Card className="p-4 bg-muted/50 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">Analysis</h4>
            {scenario.options[selectedOption].isRational ? (
              <CheckCircle2 className="w-5 h-5 text-success" />
            ) : (
              <X className="w-5 h-5 text-destructive" />
            )}
          </div>
          
          <div className="space-y-2 text-sm">
            <p>
              <strong>Your Choice:</strong> {scenario.options[selectedOption].text}
            </p>
            {!scenario.options[selectedOption].isRational && (
              <p className="text-destructive">
                <strong>Bias Detected:</strong> {scenario.options[selectedOption].bias}
              </p>
            )}
            <p>
              <strong>Rational Choice:</strong>{" "}
              {scenario.options.find((o) => o.isRational)?.text}
            </p>
          </div>

          <div className="pt-3 border-t">
            <p className="text-sm font-semibold mb-1">{scenario.biasName}</p>
            <p className="text-sm text-muted-foreground">{scenario.explanation}</p>
          </div>

          <div className="pt-3 border-t">
            <p className="text-xs font-semibold mb-1">Key Lessons:</p>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Be aware of your emotional state when making decisions</li>
              <li>• Use a systematic <AIContextualHelp term="investment process" lessonId="14" lessonTitle="Bias Detection">investment process</AIContextualHelp> to reduce bias</li>
              <li>• Seek <AIContextualHelp term="contrary opinions" lessonId="14" lessonTitle="Bias Detection">contrary opinions</AIContextualHelp> to challenge your thinking</li>
              <li>• Track and learn from past mistakes</li>
            </ul>
          </div>

          <Button onClick={nextScenario} className="w-full mt-2">
            {currentScenario < scenarios.length - 1 ? "Next Scenario" : "Complete Quiz"}
          </Button>
        </Card>
      )}
    </Card>
  );
};

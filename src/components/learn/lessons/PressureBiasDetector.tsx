import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Brain,
  AlertTriangle,
  Timer,
  TrendingUp,
  TrendingDown,
  Heart,
  Zap,
  Shield,
  Target
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface PressureScenario {
  id: number;
  title: string;
  situation: string;
  pressure: "fear" | "greed" | "fomo" | "panic";
  timeLimit: number;
  options: {
    text: string;
    bias: string | null;
    isRational: boolean;
    explanation: string;
  }[];
}

const scenarios: PressureScenario[] = [
  {
    id: 1,
    title: "Flash Crash",
    situation: "Markets just dropped 8% in 2 hours. Your phone is blowing up with notifications. Your portfolio is down $15,000.",
    pressure: "panic",
    timeLimit: 15,
    options: [
      {
        text: "SELL EVERYTHING NOW!",
        bias: "Panic Selling",
        isRational: false,
        explanation: "Panic selling locks in losses at the worst time. Markets often recover quickly after flash crashes."
      },
      {
        text: "Check if fundamentals changed, then decide",
        bias: null,
        isRational: true,
        explanation: "Rational approach: evaluate if anything fundamental changed before making decisions."
      },
      {
        text: "Double down and buy the dip!",
        bias: "Overconfidence",
        isRational: false,
        explanation: "Catching falling knives without analysis is just as emotional as panic selling."
      }
    ]
  },
  {
    id: 2,
    title: "Meme Stock Mania",
    situation: "A stock is up 400% this week. Reddit is exploding. Your friends made $50K. You have 5 seconds to decide.",
    pressure: "fomo",
    timeLimit: 10,
    options: [
      {
        text: "BUY NOW before it's too late!",
        bias: "FOMO (Fear of Missing Out)",
        isRational: false,
        explanation: "FOMO drives buying at peaks. By the time everyone's talking about it, smart money is selling."
      },
      {
        text: "Interesting, but I'll stick to my strategy",
        bias: null,
        isRational: true,
        explanation: "Discipline beats excitement. Your investment plan shouldn't change based on viral stocks."
      },
      {
        text: "Short it - it has to crash!",
        bias: "Contrarian Bias",
        isRational: false,
        explanation: "Shorting meme stocks has bankrupted many traders. The market can stay irrational longer than you can stay solvent."
      }
    ]
  },
  {
    id: 3,
    title: "Portfolio Peak",
    situation: "Your portfolio hit an all-time high! You're up 45% this year. You feel like a genius. What now?",
    pressure: "greed",
    timeLimit: 12,
    options: [
      {
        text: "Go all-in with margin - I'm on fire!",
        bias: "Overconfidence + Greed",
        isRational: false,
        explanation: "Past success doesn't predict future returns. Adding leverage at peaks amplifies crash damage."
      },
      {
        text: "Rebalance back to target allocation",
        bias: null,
        isRational: true,
        explanation: "Rebalancing enforces 'sell high, buy low' discipline and maintains your risk level."
      },
      {
        text: "Sell everything and lock in gains",
        bias: "Loss Aversion",
        isRational: false,
        explanation: "Market timing rarely works. Selling winners and sitting in cash often leads to missing more gains."
      }
    ]
  },
  {
    id: 4,
    title: "Bad Earnings",
    situation: "Your biggest holding just missed earnings. Stock is down 12% after hours. Analysts are downgrading.",
    pressure: "fear",
    timeLimit: 15,
    options: [
      {
        text: "Sell at market open tomorrow",
        bias: "Recency Bias + Fear",
        isRational: false,
        explanation: "Knee-jerk reactions to earnings often reverse. One quarter rarely changes a company's long-term value."
      },
      {
        text: "Research why they missed, reassess thesis",
        bias: null,
        isRational: true,
        explanation: "Understanding WHY matters more than the number. Is it temporary or fundamental?"
      },
      {
        text: "Ignore it - it'll come back",
        bias: "Denial",
        isRational: false,
        explanation: "Ignoring information isn't rational. You should always reassess with new data."
      }
    ]
  },
  {
    id: 5,
    title: "Hot IPO",
    situation: "The most anticipated IPO of the year just opened 80% above offer price. Your broker has shares available.",
    pressure: "fomo",
    timeLimit: 8,
    options: [
      {
        text: "Buy immediately - this is the next Apple!",
        bias: "FOMO + Anchoring",
        isRational: false,
        explanation: "IPO pops often reverse. Buying hyped IPOs at open is statistically a losing strategy."
      },
      {
        text: "Wait 6 months for the hype to settle",
        bias: null,
        isRational: true,
        explanation: "Lock-up expirations and reality often bring IPO prices down. Patience pays."
      },
      {
        text: "Short it - too much hype!",
        bias: "Contrarian Overconfidence",
        isRational: false,
        explanation: "Shorting hot IPOs has unlimited loss potential. The stock can go much higher before falling."
      }
    ]
  },
];

export const PressureBiasDetector = () => {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [timeLeft, setTimeLeft] = useState(scenarios[0].timeLimit);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [biasesDetected, setBiasesDetected] = useState<string[]>([]);
  const [heartRate, setHeartRate] = useState(70);
  const [gameComplete, setGameComplete] = useState(false);

  const scenario = scenarios[currentScenario];

  useEffect(() => {
    if (!isTimerActive || showResult || gameComplete) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
      // Increase heart rate as time runs out
      setHeartRate(prev => Math.min(120, prev + 2));
    }, 1000);

    return () => clearInterval(timer);
  }, [isTimerActive, showResult, gameComplete]);

  const handleTimeout = () => {
    setIsTimerActive(false);
    setShowResult(true);
    setBiasesDetected([...biasesDetected, "Analysis Paralysis"]);
    toast.error("Time's up! Indecision is also a bias.");
    setHeartRate(70);
  };

  const handleAnswer = (optionIndex: number) => {
    setSelectedOption(optionIndex);
    setShowResult(true);
    setIsTimerActive(false);
    setHeartRate(70);

    const option = scenario.options[optionIndex];
    
    if (option.isRational) {
      setScore(prev => prev + 100);
      toast.success("Excellent! You stayed rational under pressure!");
    } else {
      setBiasesDetected([...biasesDetected, option.bias!]);
      toast.error(`Bias detected: ${option.bias}`);
    }
  };

  const nextScenario = () => {
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(prev => prev + 1);
      setTimeLeft(scenarios[currentScenario + 1].timeLimit);
      setIsTimerActive(true);
      setSelectedOption(null);
      setShowResult(false);
    } else {
      setGameComplete(true);
    }
  };

  const resetGame = () => {
    setCurrentScenario(0);
    setTimeLeft(scenarios[0].timeLimit);
    setIsTimerActive(true);
    setSelectedOption(null);
    setShowResult(false);
    setScore(0);
    setBiasesDetected([]);
    setGameComplete(false);
  };

  const getPressureColor = (pressure: string) => {
    switch (pressure) {
      case "fear": return "bg-blue-500/20 text-blue-400";
      case "greed": return "bg-yellow-500/20 text-yellow-400";
      case "fomo": return "bg-orange-500/20 text-orange-400";
      case "panic": return "bg-red-500/20 text-red-400";
      default: return "";
    }
  };

  const getPressureIcon = (pressure: string) => {
    switch (pressure) {
      case "fear": return <Shield className="w-4 h-4" />;
      case "greed": return <TrendingUp className="w-4 h-4" />;
      case "fomo": return <Zap className="w-4 h-4" />;
      case "panic": return <AlertTriangle className="w-4 h-4" />;
      default: return null;
    }
  };

  if (gameComplete) {
    const finalGrade = score >= 400 ? "A" : score >= 300 ? "B" : score >= 200 ? "C" : "D";
    
    return (
      <Card className="p-6 space-y-6 bg-gradient-to-br from-background to-muted/10">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center py-8 space-y-6"
        >
          <Brain className="w-16 h-16 mx-auto text-primary" />
          <h3 className="text-2xl font-bold">Assessment Complete</h3>
          
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            <Card className="p-4 bg-muted/30">
              <div className="text-4xl font-bold text-primary">{finalGrade}</div>
              <div className="text-xs text-muted-foreground">Final Grade</div>
            </Card>
            <Card className="p-4 bg-muted/30">
              <div className="text-4xl font-bold">{score}</div>
              <div className="text-xs text-muted-foreground">Points</div>
            </Card>
          </div>

          {biasesDetected.length > 0 && (
            <Card className="p-4 bg-destructive/10 max-w-md mx-auto">
              <p className="text-sm font-semibold mb-2 text-destructive">Biases to Watch:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {biasesDetected.map((bias, idx) => (
                  <Badge key={idx} variant="outline" className="text-destructive border-destructive">
                    {bias}
                  </Badge>
                ))}
              </div>
            </Card>
          )}

          <div className="text-sm text-muted-foreground max-w-md mx-auto">
            <strong>Key Takeaway:</strong> Under pressure, our emotions hijack rational thinking. 
            Having a pre-defined investment plan helps you stay disciplined when emotions run high.
          </div>

          <Button onClick={resetGame} size="lg">Try Again</Button>
        </motion.div>
      </Card>
    );
  }

  return (
    <Card className="p-6 space-y-6 bg-gradient-to-br from-background to-muted/10">
      <div>
        <h3 className="text-xl font-bold mb-1 flex items-center gap-2">
          <Brain className="w-5 h-5 text-primary" />
          Pressure Bias Detector
        </h3>
        <p className="text-sm text-muted-foreground">
          Make decisions under time pressure. Can you stay rational?
        </p>
      </div>

      {/* Status Bar */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Badge variant="outline">Scenario {currentScenario + 1}/{scenarios.length}</Badge>
          <Badge className={getPressureColor(scenario.pressure)}>
            {getPressureIcon(scenario.pressure)}
            <span className="ml-1 capitalize">{scenario.pressure}</span>
          </Badge>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-sm">
            <Heart className={`w-4 h-4 ${heartRate > 100 ? 'text-destructive animate-pulse' : 'text-muted-foreground'}`} />
            <span className="font-mono">{heartRate} BPM</span>
          </div>
          <span className="font-bold text-primary">{score} pts</span>
        </div>
      </div>

      {/* Timer */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <Timer className={`w-4 h-4 ${timeLeft <= 5 ? 'text-destructive animate-pulse' : 'text-muted-foreground'}`} />
          <span className={`font-mono text-2xl font-bold ${timeLeft <= 5 ? 'text-destructive' : ''}`}>
            {timeLeft}s
          </span>
        </div>
        <Progress 
          value={(timeLeft / scenario.timeLimit) * 100}
          className={`h-3 ${timeLeft <= 5 ? '[&>div]:bg-destructive' : ''}`}
        />
      </div>

      {/* Scenario */}
      <motion.div
        key={scenario.id}
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
      >
        <Card className="p-5 bg-muted/30 border-l-4 border-l-warning">
          <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-warning" />
            {scenario.title}
          </h4>
          <p className="text-sm leading-relaxed">{scenario.situation}</p>
        </Card>
      </motion.div>

      {/* Options */}
      {!showResult && (
        <div className="space-y-2">
          {scenario.options.map((option, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Button
                variant="outline"
                onClick={() => handleAnswer(idx)}
                className="w-full text-left h-auto py-4 px-4 justify-start hover:scale-[1.02] transition-transform"
              >
                <span className="text-sm">{option.text}</span>
              </Button>
            </motion.div>
          ))}
        </div>
      )}

      {/* Result */}
      <AnimatePresence>
        {showResult && selectedOption !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className={`p-4 ${
              scenario.options[selectedOption].isRational
                ? 'bg-success/10 border-success/30'
                : 'bg-destructive/10 border-destructive/30'
            }`}>
              <div className="flex items-center gap-2 mb-3">
                {scenario.options[selectedOption].isRational ? (
                  <>
                    <Target className="w-5 h-5 text-success" />
                    <span className="font-bold text-success">Rational Decision!</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-5 h-5 text-destructive" />
                    <span className="font-bold text-destructive">
                      Bias: {scenario.options[selectedOption].bias}
                    </span>
                  </>
                )}
              </div>
              <p className="text-sm mb-4">{scenario.options[selectedOption].explanation}</p>
              <Button onClick={nextScenario} className="w-full">
                {currentScenario < scenarios.length - 1 ? "Next Scenario" : "See Results"}
              </Button>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

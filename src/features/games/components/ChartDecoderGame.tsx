import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, TrendingUp, Target, Brain, Zap, Flame, Sparkles, Star } from "lucide-react";
import { toast } from "sonner";
import { playGameWin, playCorrect, playIncorrect } from "@/lib/soundEffects";
import { motion } from "framer-motion";

// Shuffle array utility
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const chartScenarios = [
  {
    description: "Strong uptrend with higher highs and higher lows. Volume increasing.",
    pattern: "Bullish Continuation",
    correctAnswer: "continues_up",
    options: [
      { value: "continues_up", label: "Continue Upward", reason: "Strong momentum + volume confirms trend" },
      { value: "reverses_down", label: "Reverses Downward", reason: "No reversal signals present" },
      { value: "consolidates", label: "Consolidates Sideways", reason: "Momentum suggests continuation" },
    ]
  },
  {
    description: "Price touches resistance level three times, volume declining.",
    pattern: "Triple Top Formation",
    correctAnswer: "reverses_down",
    options: [
      { value: "continues_up", label: "Breaks Through Resistance", reason: "Declining volume suggests weakness" },
      { value: "reverses_down", label: "Breaks Down", reason: "Triple top + weak volume = bearish reversal" },
      { value: "consolidates", label: "Range-Bound Trading", reason: "Pattern suggests imminent breakout/breakdown" },
    ]
  },
];

interface ChartDecoderGameProps {
  onClose: () => void;
}

export const ChartDecoderGame = ({ onClose }: ChartDecoderGameProps) => {
  const [showTutorial, setShowTutorial] = useState(true);
  const [scenarios] = useState(() => shuffleArray(chartScenarios));
  const [currentScenario, setCurrentScenario] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const scenario = scenarios[currentScenario];

  const handleAnswer = (answer: string) => {
    setSelected(answer);
    setShowFeedback(true);
    if (answer === scenario.correctAnswer) setScore(score + 15);
  };

  const handleNext = () => {
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(currentScenario + 1);
      setSelected(null);
      setShowFeedback(false);
    } else {
      toast.success(`Chart Decoder complete! Score: ${score}`);
      playGameWin();
    }
  };

  // Tutorial Screen
  if (showTutorial) {
    return (
      <div className="fixed inset-0 bg-background/95 z-50 overflow-y-auto animate-fade-in">
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4">
          <div className="max-w-2xl mx-auto">
            <Button
              variant="ghost"
              onClick={onClose}
              className="mb-4 gap-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Games
            </Button>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative"
            >
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-card via-card to-primary/10 border border-border/50 shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary/20 to-transparent rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-orange-500/20 to-transparent rounded-full blur-2xl" />
                
                <div className="relative p-8">
                  <div className="text-center mb-8">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring" }}
                      className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary/70 mb-4 shadow-lg"
                    >
                      <Brain className="w-10 h-10 text-primary-foreground" />
                    </motion.div>
                    <h1 className="text-3xl font-black text-foreground mb-2">How to Play</h1>
                    <p className="text-muted-foreground">Decode chart patterns in 3 simple steps</p>
                  </div>

                  <div className="space-y-4 mb-8">
                    {[
                      {
                        icon: <TrendingUp className="w-5 h-5" />,
                        title: "Read the Pattern",
                        description: "A chart description appears explaining price movement and volume.",
                        color: "from-blue-500 to-blue-600"
                      },
                      {
                        icon: <Target className="w-5 h-5" />,
                        title: "Predict the Outcome",
                        description: "Will price continue up, reverse down, or consolidate sideways?",
                        color: "from-orange-500 to-orange-600"
                      },
                      {
                        icon: <Brain className="w-5 h-5" />,
                        title: "Learn the Logic",
                        description: "Read explanations to understand why patterns behave as they do.",
                        color: "from-purple-500 to-purple-600"
                      }
                    ].map((step, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + i * 0.1 }}
                        className="flex items-start gap-4 p-4 rounded-xl bg-background/50 border border-border/30"
                      >
                        <div className={`flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white shadow-md`}>
                          {step.icon}
                        </div>
                        <div>
                          <h3 className="font-bold text-foreground">{step.title}</h3>
                          <p className="text-sm text-muted-foreground">{step.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="p-4 rounded-xl bg-primary/10 border border-primary/20 mb-6"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Flame className="w-5 h-5 text-primary" />
                      <span className="font-bold text-foreground">Pro Tips</span>
                    </div>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li className="flex items-center gap-2">
                        <Sparkles className="w-3 h-3 text-warning" />
                        Volume is key: rising volume confirms the trend
                      </li>
                      <li className="flex items-center gap-2">
                        <Star className="w-3 h-3 text-warning" />
                        Earn +15 points for each correct prediction
                      </li>
                    </ul>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <Button
                      onClick={() => setShowTutorial(false)}
                      className="w-full h-14 text-lg font-bold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg gap-2"
                    >
                      <Zap className="w-5 h-5" />
                      Start Game
                    </Button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-background/95 z-50 overflow-y-auto animate-fade-in">
      <div className="container max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6 animate-scale-in">
          <Button variant="ghost" size="icon" onClick={onClose} className="hover-scale">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1 text-center">
            <h2 className="text-2xl font-bold">Chart Decoder</h2>
            <p className="text-muted-foreground">Identify logical chart continuations</p>
          </div>
          <Badge variant="secondary" className="text-lg px-4 py-2">Score: {score}</Badge>
        </div>

        <Card className="p-8 animate-slide-in-right">
          <Badge className="mb-4">Pattern {currentScenario + 1}</Badge>
          <h3 className="text-lg font-bold mb-2">{scenario.pattern}</h3>
          <p className="text-muted-foreground mb-6">{scenario.description}</p>

          <div className="space-y-3 mb-6">
            {scenario.options.map((opt) => (
              <Button
                key={opt.value}
                variant={selected === opt.value ? "default" : "outline"}
                className="w-full text-left justify-start h-auto py-4"
                onClick={() => !showFeedback && handleAnswer(opt.value)}
                disabled={showFeedback}
              >
                {opt.label}
              </Button>
            ))}
          </div>

          {showFeedback && (
            <div className={`p-6 rounded-lg mb-6 ${selected === scenario.correctAnswer ? "bg-success/10" : "bg-destructive/10"}`}>
              <h4 className="font-bold mb-2">{selected === scenario.correctAnswer ? "✓ Correct!" : "✗ Incorrect"}</h4>
              {scenario.options.map((opt) => (
                <p key={opt.value} className="text-sm mb-1"><strong>{opt.label}:</strong> {opt.reason}</p>
              ))}
            </div>
          )}

          {showFeedback && (
            <Button onClick={handleNext} className="w-full" size="lg">
              {currentScenario < chartScenarios.length - 1 ? "Next Pattern" : "Finish"}
            </Button>
          )}
        </Card>
      </div>
    </div>
  );
};

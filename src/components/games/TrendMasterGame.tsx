import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Trophy, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";

// Generate realistic chart data for each pattern
const generateChartData = (pattern: string) => {
  const baseData = Array.from({ length: 50 }, (_, i) => ({ time: i }));
  
  switch (pattern) {
    case "uptrend":
      return baseData.map((d, i) => ({ ...d, price: 100 + i * 2 + Math.random() * 5 }));
    case "downtrend":
      return baseData.map((d, i) => ({ ...d, price: 200 - i * 2 + Math.random() * 5 }));
    case "sideways":
      return baseData.map((d) => ({ ...d, price: 150 + Math.random() * 10 - 5 }));
    case "breakout":
      return baseData.map((d, i) => ({ 
        ...d, 
        price: i < 30 ? 100 + Math.random() * 5 : 100 + (i - 30) * 3 + Math.random() * 5 
      }));
    case "pullback":
      return baseData.map((d, i) => ({ 
        ...d, 
        price: i < 35 ? 100 + i * 2 : 170 - (i - 35) * 1.5 + Math.random() * 3 
      }));
    case "reversal":
      return baseData.map((d, i) => ({ 
        ...d, 
        price: i < 25 ? 150 - i * 2 : 100 + (i - 25) * 2 + Math.random() * 4 
      }));
    case "double-top":
      return baseData.map((d, i) => {
        if (i < 15) return { ...d, price: 100 + i * 3 };
        if (i < 25) return { ...d, price: 145 - (i - 15) * 3 };
        if (i < 40) return { ...d, price: 115 + (i - 25) * 2 };
        return { ...d, price: 145 - (i - 40) * 2 };
      });
    case "double-bottom":
      return baseData.map((d, i) => {
        if (i < 15) return { ...d, price: 150 - i * 3 };
        if (i < 25) return { ...d, price: 105 + (i - 15) * 3 };
        if (i < 40) return { ...d, price: 135 - (i - 25) * 2 };
        return { ...d, price: 105 + (i - 40) * 2 };
      });
    case "head-shoulders":
      return baseData.map((d, i) => {
        if (i < 12) return { ...d, price: 100 + i * 2 };
        if (i < 18) return { ...d, price: 124 - (i - 12) * 2 };
        if (i < 30) return { ...d, price: 112 + (i - 18) * 3 };
        if (i < 36) return { ...d, price: 148 - (i - 30) * 3 };
        if (i < 48) return { ...d, price: 130 + (i - 36) * 1.5 };
        return { ...d, price: 148 - (i - 48) * 4 };
      });
    case "cup-handle":
      return baseData.map((d, i) => {
        if (i < 10) return { ...d, price: 150 };
        if (i < 25) return { ...d, price: 150 - Math.pow((i - 17.5) / 7.5, 2) * 30 };
        if (i < 40) return { ...d, price: 120 + (i - 25) * 2 };
        return { ...d, price: 150 - (i - 40) * 1 };
      });
    case "triangle":
      return baseData.map((d, i) => ({
        ...d,
        price: 125 + (Math.sin(i / 3) * (25 - i * 0.5)) + Math.random() * 2
      }));
    case "flag":
      return baseData.map((d, i) => {
        if (i < 15) return { ...d, price: 100 + i * 4 };
        if (i < 40) return { ...d, price: 160 - (i - 15) * 0.5 + Math.random() * 3 };
        return { ...d, price: 147.5 + (i - 40) * 3 };
      });
    case "wedge":
      return baseData.map((d, i) => ({
        ...d,
        price: 120 + Math.sin(i / 4) * (15 - i * 0.3) + i * 0.5
      }));
    case "support-bounce":
      return baseData.map((d, i) => {
        if (i < 35) return { ...d, price: 140 - i * 1.5 + Math.random() * 4 };
        return { ...d, price: 87.5 + (i - 35) * 2.5 + Math.random() * 4 };
      });
    case "resistance-bounce":
      return baseData.map((d, i) => {
        if (i < 35) return { ...d, price: 100 + i * 1.5 + Math.random() * 4 };
        return { ...d, price: 152.5 - (i - 35) * 2.5 + Math.random() * 4 };
      });
    case "channel":
      return baseData.map((d, i) => ({
        ...d,
        price: 100 + i * 1.2 + Math.sin(i / 3) * 8 + Math.random() * 2
      }));
    case "range-bound":
      return baseData.map((d, i) => ({
        ...d,
        price: 125 + Math.sin(i / 4) * 15 + Math.random() * 4
      }));
    case "fakeout":
      return baseData.map((d, i) => {
        if (i < 35) return { ...d, price: 120 + Math.random() * 10 };
        if (i < 40) return { ...d, price: 130 + (i - 35) * 2 };
        return { ...d, price: 140 - (i - 40) * 3 };
      });
    case "retest":
      return baseData.map((d, i) => {
        if (i < 20) return { ...d, price: 100 + Math.random() * 8 };
        if (i < 28) return { ...d, price: 104 + (i - 20) * 3 };
        if (i < 35) return { ...d, price: 128 - (i - 28) * 2 };
        return { ...d, price: 114 + (i - 35) * 2.5 };
      });
    case "parabolic":
      return baseData.map((d, i) => ({
        ...d,
        price: 100 + Math.pow(i / 10, 2.5) + Math.random() * 3
      }));
    case "correction":
      return baseData.map((d, i) => {
        if (i < 35) return { ...d, price: 100 + i * 3 + Math.random() * 4 };
        return { ...d, price: 205 - (i - 35) * 4 + Math.random() * 5 };
      });
    default:
      return baseData.map((d) => ({ ...d, price: 100 + Math.random() * 20 }));
  }
};

const chartScenarios = [
  {
    pattern: "uptrend",
    question: "What pattern does this chart show?",
    correctAnswer: "Uptrend",
    options: ["Uptrend", "Downtrend", "Sideways", "Triangle"],
    explanation: "Perfect! This is a classic uptrend. Notice the series of higher highs and higher lows—the price consistently moves up with each wave, showing strong bullish momentum."
  },
  {
    pattern: "downtrend",
    question: "Identify this trend pattern:",
    correctAnswer: "Downtrend",
    options: ["Uptrend", "Downtrend", "Breakout", "Range-Bound"],
    explanation: "Exactly right! This downtrend shows lower highs and lower lows. Each peak is lower than the last, indicating consistent bearish pressure pushing prices down."
  },
  {
    pattern: "sideways",
    question: "What type of market movement is this?",
    correctAnswer: "Sideways/Consolidation",
    options: ["Sideways/Consolidation", "Uptrend", "Reversal", "Parabolic"],
    explanation: "Spot on! This is sideways consolidation. The price moves horizontally within a tight range—neither buyers nor sellers have control, creating a period of indecision."
  },
  {
    pattern: "breakout",
    question: "What pattern is forming here?",
    correctAnswer: "Breakout",
    options: ["Pullback", "Breakout", "Reversal", "Fakeout"],
    explanation: "Nice catch! This is a breakout. The price was consolidating in a range, then suddenly burst through resistance with strong momentum—a key signal traders watch for."
  },
  {
    pattern: "pullback",
    question: "Identify this price movement:",
    correctAnswer: "Pullback",
    options: ["Uptrend", "Pullback", "Reversal", "Correction"],
    explanation: "Great eye! This is a pullback within an uptrend. The price temporarily dips to 'recharge' before continuing higher—a healthy pause that doesn't break the overall trend."
  },
  {
    pattern: "reversal",
    question: "What's happening in this chart?",
    correctAnswer: "Reversal",
    options: ["Continuation", "Reversal", "Consolidation", "Channel"],
    explanation: "Excellent! This is a reversal pattern. The downtrend suddenly shifts to an uptrend—the momentum completely flips direction, often triggered by major news or market shifts."
  },
  {
    pattern: "double-top",
    question: "Name this technical pattern:",
    correctAnswer: "Double Top",
    options: ["Double Top", "Double Bottom", "Head and Shoulders", "Cup and Handle"],
    explanation: "Perfect! This is a double top—a bearish reversal pattern. The price hits resistance twice at the same level, fails to break through, then reverses down. It looks like the letter 'M'."
  },
  {
    pattern: "double-bottom",
    question: "What pattern do you see?",
    correctAnswer: "Double Bottom",
    options: ["Double Bottom", "Double Top", "Triangle", "Wedge"],
    explanation: "Right on! This is a double bottom—a bullish reversal pattern. The price finds support at the same level twice, then bounces back up. It looks like the letter 'W'."
  },
  {
    pattern: "head-shoulders",
    question: "Identify this classic formation:",
    correctAnswer: "Head and Shoulders",
    options: ["Head and Shoulders", "Triple Top", "Flag", "Pennant"],
    explanation: "Nailed it! This is the famous head and shoulders pattern—a strong bearish reversal signal. Three peaks form (left shoulder, head, right shoulder) before the price drops."
  },
  {
    pattern: "cup-handle",
    question: "What bullish pattern is this?",
    correctAnswer: "Cup and Handle",
    options: ["Cup and Handle", "Rounding Bottom", "Saucer", "Bowl"],
    explanation: "Awesome! This is a cup and handle—a bullish continuation pattern. The rounded bottom (cup) followed by a slight dip (handle) often leads to a strong upward breakout."
  },
  {
    pattern: "triangle",
    question: "Name this consolidation pattern:",
    correctAnswer: "Triangle",
    options: ["Triangle", "Wedge", "Pennant", "Channel"],
    explanation: "You got it! This is a triangle pattern. The price squeezes between converging trendlines—compression builds until it explodes out in one direction."
  },
  {
    pattern: "flag",
    question: "What continuation pattern is shown?",
    correctAnswer: "Flag/Pennant",
    options: ["Flag/Pennant", "Rectangle", "Wedge", "Triangle"],
    explanation: "Spot on! This is a flag pattern. After a sharp move (the pole), the price consolidates in a small rectangle before continuing in the original direction—a quick breather."
  },
  {
    pattern: "wedge",
    question: "Identify this pattern:",
    correctAnswer: "Wedge",
    options: ["Wedge", "Triangle", "Channel", "Flag"],
    explanation: "Great job! This is a wedge. The price moves between two converging trendlines that slope in the same direction. Wedges often signal reversals when they break."
  },
  {
    pattern: "support-bounce",
    question: "What's happening at this key level?",
    correctAnswer: "Support Bounce",
    options: ["Support Bounce", "Resistance Bounce", "Breakdown", "Fakeout"],
    explanation: "Exactly! This is a support bounce. The price falls to a key support level where buyers step in strongly, pushing it back up—support acts like a floor."
  },
  {
    pattern: "resistance-bounce",
    question: "What key level interaction is this?",
    correctAnswer: "Resistance Bounce",
    options: ["Resistance Bounce", "Support Bounce", "Breakout", "Retest"],
    explanation: "Perfect! This is a resistance bounce. The price rises to resistance where sellers push back, forcing it down—resistance acts like a ceiling."
  },
  {
    pattern: "channel",
    question: "What trend structure is displayed?",
    correctAnswer: "Channel Trend",
    options: ["Channel Trend", "Range-Bound", "Triangle", "Wedge"],
    explanation: "Nice work! This is a channel trend. The price moves within two parallel trendlines—it trends in one direction while bouncing between these boundaries."
  },
  {
    pattern: "range-bound",
    question: "Describe this market behavior:",
    correctAnswer: "Range-Bound",
    options: ["Range-Bound", "Trending", "Volatile", "Parabolic"],
    explanation: "You got it! This is range-bound trading. The price oscillates between clear support and resistance levels without trending—perfect for swing traders."
  },
  {
    pattern: "fakeout",
    question: "What trap pattern is this?",
    correctAnswer: "Fakeout",
    options: ["Fakeout", "Breakout", "Breakdown", "Reversal"],
    explanation: "Sharp eye! This is a fakeout (or 'bull trap'). The price breaks above resistance briefly, then quickly reverses back down—it faked out eager buyers."
  },
  {
    pattern: "retest",
    question: "What's this validation pattern?",
    correctAnswer: "Retest Pattern",
    options: ["Retest Pattern", "Reversal", "Pullback", "Fakeout"],
    explanation: "Excellent! This is a retest. After breaking out, the price comes back to test the old resistance (now support), confirming the breakout is real before continuing up."
  },
  {
    pattern: "parabolic",
    question: "What explosive pattern is shown?",
    correctAnswer: "Parabolic Run-Up",
    options: ["Parabolic Run-Up", "Steady Uptrend", "Breakout", "Spike"],
    explanation: "Right on! This is a parabolic move. The price accelerates upward in a curved pattern—exciting but unsustainable. These often end in sharp reversals."
  },
  {
    pattern: "correction",
    question: "What market move is this?",
    correctAnswer: "Market Correction",
    options: ["Market Correction", "Reversal", "Crash", "Pullback"],
    explanation: "Perfect! This is a market correction. After a strong uptrend, the price drops 10-20% to 'correct' excessive valuations—healthy and normal in bull markets."
  }
];

interface TrendMasterGameProps {
  onClose: () => void;
}

export const TrendMasterGame = ({ onClose }: TrendMasterGameProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const scenario = chartScenarios[currentQuestion];
  const chartData = generateChartData(scenario.pattern);

  const handleAnswer = (answer: string) => {
    if (showFeedback) return;
    
    setSelectedAnswer(answer);
    setShowFeedback(true);
    
    if (answer === scenario.correctAnswer) {
      setScore(score + 1);
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 2000);
      toast.success("Correct! 🎉");
    }
  };

  const handleNext = () => {
    if (currentQuestion < chartScenarios.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      setGameComplete(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setGameComplete(false);
  };

  if (gameComplete) {
    const accuracy = Math.round((score / chartScenarios.length) * 100);
    const motivationalMessage = 
      accuracy >= 90 ? "Outstanding! You're seeing the market like a pro! 🏆" :
      accuracy >= 75 ? "Excellent work! You've got a solid grasp of chart patterns! 📈" :
      accuracy >= 60 ? "Great progress! Keep practicing and you'll master these patterns! 💪" :
      "Good start! Review the patterns and try again—you'll improve fast! 🚀";

    return (
      <div className="fixed inset-0 bg-background z-50 overflow-y-auto">
        <div className="container max-w-4xl mx-auto p-6 min-h-screen flex flex-col items-center justify-center">
          <Card className="p-8 w-full animate-scale-in bg-gradient-accent border-0">
            <div className="text-center space-y-6">
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                <Trophy className="w-10 h-10 text-primary animate-pulse" />
              </div>
              
              <div>
                <h2 className="text-3xl font-bold mb-2">Game Complete!</h2>
                <p className="text-muted-foreground">You've mastered Trend Master</p>
              </div>

              <div className="grid grid-cols-2 gap-4 py-6">
                <div className="p-6 rounded-lg bg-card border border-border">
                  <div className="text-4xl font-bold text-primary mb-2">{score}/{chartScenarios.length}</div>
                  <div className="text-sm text-muted-foreground">Questions Correct</div>
                </div>
                <div className="p-6 rounded-lg bg-card border border-border">
                  <div className="text-4xl font-bold text-primary mb-2">{accuracy}%</div>
                  <div className="text-sm text-muted-foreground">Accuracy</div>
                </div>
              </div>

              <div className="p-6 rounded-lg bg-primary/10 border border-primary/20">
                <p className="text-lg font-medium">{motivationalMessage}</p>
              </div>

              <div className="flex gap-3">
                <Button onClick={handleRestart} size="lg" className="flex-1">
                  Play Again
                </Button>
                <Button onClick={onClose} size="lg" variant="outline" className="flex-1">
                  Exit
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-background z-50 overflow-y-auto">
      <div className="container max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 animate-fade-in">
          <Button variant="ghost" size="icon" onClick={onClose} className="hover-scale">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1 text-center">
            <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
              <TrendingUp className="w-6 h-6 text-primary" />
              Trend Master
            </h2>
            <p className="text-sm text-muted-foreground">Master the art of reading charts</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="text-base px-4 py-2">
              {currentQuestion + 1}/{chartScenarios.length}
            </Badge>
            <Badge className="text-base px-4 py-2 bg-primary">
              Score: {score}
            </Badge>
          </div>
        </div>

        {/* Celebration Overlay */}
        {showCelebration && (
          <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center animate-fade-in">
            <div className="text-6xl font-bold text-primary animate-scale-in">
              ✓ Correct!
            </div>
          </div>
        )}

        {/* Main Game Area */}
        <div className="grid gap-6">
          {/* Chart Display */}
          <Card className="p-6 animate-slide-in-right">
            <div className="mb-4">
              <Badge className="mb-3">Pattern Recognition</Badge>
              <h3 className="text-xl font-bold mb-2">{scenario.question}</h3>
            </div>

            {/* Interactive Chart */}
            <div className="rounded-lg bg-card/50 p-4 border border-border mb-6">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="time" 
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fontSize: 12 }}
                    domain={['auto', 'auto']}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                    labelStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="price" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    fill="url(#colorPrice)"
                    animationDuration={1000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Answer Options */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {scenario.options.map((option) => (
                <Button
                  key={option}
                  variant={selectedAnswer === option ? "default" : "outline"}
                  className={`h-auto py-4 text-base transition-all duration-300 ${
                    !showFeedback && "hover-scale hover:border-primary"
                  } ${
                    showFeedback && option === scenario.correctAnswer 
                      ? "bg-success/20 border-success text-success-foreground" 
                      : showFeedback && selectedAnswer === option 
                      ? "bg-destructive/20 border-destructive text-destructive-foreground"
                      : ""
                  }`}
                  onClick={() => handleAnswer(option)}
                  disabled={showFeedback}
                >
                  {option}
                </Button>
              ))}
            </div>

            {/* Feedback */}
            {showFeedback && (
              <div className={`p-6 rounded-lg mb-6 animate-fade-in ${
                selectedAnswer === scenario.correctAnswer 
                  ? "bg-success/10 border border-success/20" 
                  : "bg-muted border border-border"
              }`}>
                <h4 className="font-bold text-lg mb-3">
                  {selectedAnswer === scenario.correctAnswer ? "🎉 Perfect!" : "💡 Learning Moment"}
                </h4>
                <p className="text-foreground leading-relaxed">
                  {selectedAnswer === scenario.correctAnswer 
                    ? scenario.explanation
                    : `Almost! This was a ${scenario.correctAnswer}. ${scenario.explanation}`}
                </p>
              </div>
            )}

            {showFeedback && (
              <Button onClick={handleNext} className="w-full" size="lg">
                {currentQuestion < chartScenarios.length - 1 ? "Next Pattern →" : "View Results"}
              </Button>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

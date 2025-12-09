import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, TrendingUp, RefreshCw, Lightbulb, Sparkles, Target, Award, Home } from "lucide-react";
import { toast } from "sonner";
import { CandlestickChart } from "./CandlestickChart";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

// Pattern-specific insights shown when hint is activated
const patternInsights: Record<string, string> = {
  "uptrend": "Notice how each peak is higher than the last? That's your key signal for an uptrend. Keep an eye on rising support levels.",
  "downtrend": "See the lower highs and lower lows? That's a classic downtrend. Spotting this early helps you understand falling momentum.",
  "head-shoulders": "The middle peak towers above the others like a head. This pattern often signals a reversal, so watch for the neckline break.",
  "inverse-head-shoulders": "The middle trough dips lower than the shoulders, forming a reversed 'head.' It's a signal that the trend could turn upward.",
  "cup-handle": "Look at the rounding bottom forming the cup, followed by a small pullback for the handle. This shows consolidation before a potential move.",
  "double-top": "Two peaks at almost the same level tell you the market is testing resistance. Watch carefully for a drop after the second top.",
  "double-bottom": "Two similar troughs? That's a double bottom. It often suggests the price may rebound from support.",
  "ascending-triangle": "Notice the flat top resistance and rising lows? This triangle often precedes an upward breakout.",
  "descending-triangle": "Flat bottom support and falling highs form this pattern. It signals potential downward movement.",
  "triangle": "Both highs and lows are converging. It's neutral but indicates a breakout is coming, so watch the direction.",
  "flag": "Price surges, then pulls back slightly in a channel — like a flag on a pole. It often continues the upward move.",
  "bear-flag": "After a sharp drop, a small upward channel forms. This can continue the downward trend.",
  "pennant": "Similar to a flag but small and compact. Sharp prior movement plus a tiny triangle usually means continuation in that direction.",
  "falling-wedge": "The trend is down, but the wedge narrows. This can signal a reversal upward once the price breaks out.",
  "rising-wedge": "The price is rising but the highs and lows squeeze together. This pattern often signals a reversal downward.",
  "wedge": "The price is rising but the highs and lows squeeze together. This pattern often signals a reversal downward.",
  "sideways": "Price moves sideways in a tight range. Take a moment to observe support and resistance before the next move.",
  "consolidation": "Price moves sideways in a tight range. Take a moment to observe support and resistance before the next move.",
  "breakout": "Price moves decisively past support or resistance. This shows momentum and can lead to strong continuation.",
  "breakdown": "Price drops below support. This indicates strong downward pressure, so note the velocity of the drop.",
  "support-bounce": "Price touches a support level and rebounds. This shows the level is holding and can signal a temporary rise.",
  "resistance-bounce": "Price hits resistance and drops back. Recognizing this helps you understand where the market is struggling to move higher.",
  "channel": "The price moves within two parallel trendlines—it trends in one direction while bouncing between these boundaries.",
  "range-bound": "The price oscillates between clear support and resistance levels without trending—perfect for swing traders.",
  "pullback": "The price temporarily dips to 'recharge' before continuing higher—a healthy pause that doesn't break the overall trend.",
  "reversal": "The momentum completely flips direction—watch for major news or market shifts triggering this change.",
  "fakeout": "The price breaks above resistance briefly, then quickly reverses back down—it faked out eager buyers.",
  "retest": "After breaking out, the price comes back to test the old resistance (now support), confirming the breakout is real.",
  "parabolic": "The price accelerates upward in a curved pattern—exciting but unsustainable. These often end in sharp reversals.",
  "correction": "After a strong uptrend, the price drops 10-20% to 'correct' excessive valuations—healthy and normal in bull markets."
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
  const [totalXP, setTotalXP] = useState(0);
  const [streak, setStreak] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [mentorMode, setMentorMode] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const scenario = chartScenarios[currentQuestion];

  const handleAnswer = (answer: string) => {
    if (showFeedback) return;
    
    setSelectedAnswer(answer);
    setShowFeedback(true);
    
    if (answer === scenario.correctAnswer) {
      const xpGain = 100 + (streak * 25);
      setScore(score + 1);
      setTotalXP(totalXP + xpGain);
      setStreak(streak + 1);
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 2000);
      toast.success(`Correct! +${xpGain} XP 🎉`, { duration: 3000 });
    } else {
      setStreak(0);
      toast.error("Not quite right. Review the explanation!");
    }
  };

  const handleNext = () => {
    if (currentQuestion < chartScenarios.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setShowHint(false);
    } else {
      setGameComplete(true);
    }
  };

  const handleRefresh = () => {
    setSelectedAnswer(null);
    setShowFeedback(false);
    setShowHint(false);
  };

  const toggleHint = () => {
    setShowHint(!showHint);
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setScore(0);
    setTotalXP(0);
    setStreak(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setGameComplete(false);
    setShowHint(false);
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
          <Card className="p-8 w-full animate-scale-in bg-gradient-to-br from-purple-500/10 via-background to-teal-500/10 border-primary/20">
            <div className="text-center space-y-6">
              <div className="w-20 h-20 rounded-full bg-gradient-primary flex items-center justify-center mx-auto animate-pulse shadow-glow">
                <Trophy className="w-10 h-10 text-white" />
              </div>
              
              <div>
                <h2 className="text-3xl font-bold mb-2 glow-text">Game Complete!</h2>
                <p className="text-muted-foreground">You've mastered Trend Master</p>
              </div>

              <div className="grid grid-cols-3 gap-4 py-6">
                <div className="p-6 rounded-lg bg-card/50 backdrop-blur-sm border border-primary/20">
                  <div className="text-4xl font-bold text-primary mb-2">{score}/{chartScenarios.length}</div>
                  <div className="text-sm text-muted-foreground">Correct</div>
                </div>
                <div className="p-6 rounded-lg bg-card/50 backdrop-blur-sm border border-primary/20">
                  <div className="text-4xl font-bold text-primary mb-2">{accuracy}%</div>
                  <div className="text-sm text-muted-foreground">Accuracy</div>
                </div>
                <div className="p-6 rounded-lg bg-card/50 backdrop-blur-sm border border-primary/20">
                  <div className="text-4xl font-bold text-teal-400 mb-2">{totalXP}</div>
                  <div className="text-sm text-muted-foreground">Total XP</div>
                </div>
              </div>

              <div className="p-6 rounded-lg bg-gradient-primary/20 border border-primary/30">
                <p className="text-lg font-medium">{motivationalMessage}</p>
              </div>

              <div className="flex gap-3">
                <Button onClick={handleRestart} size="lg" className="flex-1 bg-gradient-primary hover:opacity-90">
                  <RefreshCw className="w-5 h-5 mr-2" />
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
    <div className="fixed inset-0 bg-background z-50 flex flex-col overflow-hidden">
      {/* Top Navigation Bar */}
      <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={onClose} className="hover-scale">
                <Home className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Games</span>
                <span>/</span>
                <span className="text-foreground font-medium">Trend Master</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-primary/10 border border-primary/20">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">{totalXP} XP</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border">
                <Target className="w-4 h-4 text-teal-400" />
                <span className="text-sm font-medium">{streak} Streak</span>
              </div>
              <Badge className="text-base px-4 py-2 bg-gradient-primary">
                {score}/{chartScenarios.length}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Celebration Overlay with Confetti Effect */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-[60]">
          <div className="text-9xl animate-scale-in">🎉</div>
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 50 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-primary rounded-full animate-fade-in"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 0.5}s`,
                  animationDuration: `${1 + Math.random()}s`
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-6 py-6 max-w-7xl">
          <div className="space-y-6">
            {/* Level Header & Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Level {currentQuestion + 1} — Identify the Trend</h2>
                  <p className="text-sm text-muted-foreground">{scenario.question}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card border border-border">
                  <Label htmlFor="mentor-mode" className="text-sm cursor-pointer">Mentor Mode</Label>
                  <Switch 
                    id="mentor-mode" 
                    checked={mentorMode} 
                    onCheckedChange={setMentorMode}
                  />
                </div>
                <Button variant="outline" size="icon" onClick={handleRefresh} className="hover-scale">
                  <RefreshCw className="w-5 h-5" />
                </Button>
                <Button variant="outline" size="icon" onClick={toggleHint} className={`hover-scale ${showHint ? 'bg-primary/20' : ''}`}>
                  <Lightbulb className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Hint Banner - Pattern-Specific Insight */}
            {showHint && (
              <Card className="p-4 bg-primary/10 border-primary/20 animate-fade-in">
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium mb-1">Pattern Insight:</p>
                    <p className="text-sm text-muted-foreground">
                      {patternInsights[scenario.pattern] || "Look for the overall direction and key price points. Does it show higher highs, lower lows, or consolidation?"}
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {/* Chart Section */}
            <Card className="p-6 bg-gradient-to-br from-card via-card to-primary/5 border-primary/10 shadow-glow-soft">
              <div className="relative">
                <CandlestickChart pattern={scenario.pattern} height={500} />
                
                {mentorMode && (
                  <div className="absolute top-4 right-4 bg-card/90 backdrop-blur-sm border border-primary/20 rounded-lg p-3 max-w-xs z-10">
                    <p className="text-xs text-muted-foreground">
                      <span className="text-primary font-semibold">Mentor Tip:</span> Study the trend direction, support/resistance levels, and pattern formation. Green candles = bullish (price up), Red candles = bearish (price down).
                    </p>
                  </div>
                )}
              </div>
            </Card>

            {/* Answer Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {scenario.options.map((option, idx) => {
                const isSelected = selectedAnswer === option;
                const isCorrect = option === scenario.correctAnswer;
                const showResult = showFeedback && isSelected;
                
                return (
                  <Card
                    key={option}
                    onClick={() => !showFeedback && handleAnswer(option)}
                    className={`p-6 cursor-pointer smooth-transition hover-lift relative overflow-hidden ${
                      isSelected && !showFeedback ? "ring-2 ring-primary shadow-glow" : ""
                    } ${
                      showResult && isCorrect ? "bg-gradient-to-br from-green-500/20 to-teal-500/20 border-green-500/50 shadow-glow" : ""
                    } ${
                      showResult && !isCorrect ? "bg-destructive/10 border-destructive/50" : ""
                    } ${
                      !showFeedback ? "hover:border-primary/50" : ""
                    }`}
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-muted-foreground">Option {idx + 1}</span>
                        {showResult && (
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            isCorrect ? "bg-green-500/20 text-green-400" : "bg-destructive/20 text-destructive"
                          }`}>
                            {isCorrect ? "✓" : "✗"}
                          </div>
                        )}
                      </div>
                      <p className="font-bold text-lg">{option}</p>
                    </div>
                    
                    {!showFeedback && (
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 hover:opacity-100 smooth-transition" />
                    )}
                  </Card>
                );
              })}
            </div>

            {/* Feedback Section */}
            {showFeedback && (
              <Card className={`p-6 animate-fade-in border-2 ${
                selectedAnswer === scenario.correctAnswer 
                  ? "bg-gradient-to-br from-green-500/10 to-teal-500/10 border-green-500/30" 
                  : "bg-gradient-to-br from-destructive/10 to-destructive/5 border-destructive/30"
              }`}>
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    selectedAnswer === scenario.correctAnswer 
                      ? "bg-green-500/20 text-green-400" 
                      : "bg-destructive/20 text-destructive"
                  }`}>
                    {selectedAnswer === scenario.correctAnswer ? (
                      <Award className="w-6 h-6" />
                    ) : (
                      <Trophy className="w-6 h-6" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-xl mb-2">
                      {selectedAnswer === scenario.correctAnswer ? "Correct!" : "Not Quite Right"}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">{scenario.explanation}</p>
                  </div>
                </div>
                
                <Button 
                  onClick={handleNext} 
                  size="lg"
                  className="w-full bg-gradient-primary hover:opacity-90 shadow-glow-soft"
                >
                  {currentQuestion < chartScenarios.length - 1 ? (
                    <>Next Chart <TrendingUp className="w-5 h-5 ml-2" /></>
                  ) : (
                    <>Complete Game <Trophy className="w-5 h-5 ml-2" /></>
                  )}
                </Button>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Progress Bar & XP Tracker */}
      <div className="border-t border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">Progress</span>
            <span className="text-sm font-medium">{Math.round((currentQuestion / chartScenarios.length) * 100)}%</span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-primary smooth-transition"
              style={{ width: `${(currentQuestion / chartScenarios.length) * 100}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">
                <span className="font-bold text-foreground">{currentQuestion}</span> / {chartScenarios.length} Charts Completed
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                Accuracy: <span className="font-bold text-foreground">{currentQuestion > 0 ? Math.round((score / currentQuestion) * 100) : 0}%</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

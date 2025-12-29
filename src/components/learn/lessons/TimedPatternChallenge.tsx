import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3,
  Timer,
  CheckCircle2,
  XCircle,
  Zap,
  Trophy,
  Play,
  RotateCcw
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";

interface Pattern {
  id: string;
  name: string;
  type: "bullish" | "bearish" | "neutral";
  data: { x: number; price: number }[];
  difficulty: "easy" | "medium" | "hard";
}

const patterns: Pattern[] = [
  {
    id: "double-bottom",
    name: "Double Bottom",
    type: "bullish",
    difficulty: "easy",
    data: [
      { x: 0, price: 100 }, { x: 1, price: 85 }, { x: 2, price: 95 },
      { x: 3, price: 85 }, { x: 4, price: 105 }, { x: 5, price: 110 }
    ]
  },
  {
    id: "head-shoulders",
    name: "Head & Shoulders",
    type: "bearish",
    difficulty: "medium",
    data: [
      { x: 0, price: 100 }, { x: 1, price: 115 }, { x: 2, price: 105 },
      { x: 3, price: 125 }, { x: 4, price: 105 }, { x: 5, price: 115 },
      { x: 6, price: 95 }
    ]
  },
  {
    id: "ascending-triangle",
    name: "Ascending Triangle",
    type: "bullish",
    difficulty: "medium",
    data: [
      { x: 0, price: 80 }, { x: 1, price: 100 }, { x: 2, price: 88 },
      { x: 3, price: 100 }, { x: 4, price: 93 }, { x: 5, price: 100 },
      { x: 6, price: 110 }
    ]
  },
  {
    id: "descending-triangle",
    name: "Descending Triangle",
    type: "bearish",
    difficulty: "medium",
    data: [
      { x: 0, price: 120 }, { x: 1, price: 100 }, { x: 2, price: 112 },
      { x: 3, price: 100 }, { x: 4, price: 107 }, { x: 5, price: 100 },
      { x: 6, price: 90 }
    ]
  },
  {
    id: "cup-handle",
    name: "Cup and Handle",
    type: "bullish",
    difficulty: "hard",
    data: [
      { x: 0, price: 100 }, { x: 1, price: 92 }, { x: 2, price: 85 },
      { x: 3, price: 82 }, { x: 4, price: 85 }, { x: 5, price: 92 },
      { x: 6, price: 98 }, { x: 7, price: 95 }, { x: 8, price: 105 }
    ]
  },
  {
    id: "double-top",
    name: "Double Top",
    type: "bearish",
    difficulty: "easy",
    data: [
      { x: 0, price: 100 }, { x: 1, price: 115 }, { x: 2, price: 105 },
      { x: 3, price: 115 }, { x: 4, price: 95 }, { x: 5, price: 90 }
    ]
  },
  {
    id: "falling-wedge",
    name: "Falling Wedge",
    type: "bullish",
    difficulty: "hard",
    data: [
      { x: 0, price: 120 }, { x: 1, price: 110 }, { x: 2, price: 115 },
      { x: 3, price: 105 }, { x: 4, price: 108 }, { x: 5, price: 100 },
      { x: 6, price: 115 }
    ]
  },
  {
    id: "rising-wedge",
    name: "Rising Wedge",
    type: "bearish",
    difficulty: "hard",
    data: [
      { x: 0, price: 80 }, { x: 1, price: 90 }, { x: 2, price: 85 },
      { x: 3, price: 95 }, { x: 4, price: 92 }, { x: 5, price: 100 },
      { x: 6, price: 85 }
    ]
  },
];

export const TimedPatternChallenge = () => {
  const [gameState, setGameState] = useState<"idle" | "playing" | "complete">("idle");
  const [currentPatternIndex, setCurrentPatternIndex] = useState(0);
  const [shuffledPatterns, setShuffledPatterns] = useState<Pattern[]>([]);
  const [timeLeft, setTimeLeft] = useState(10);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [lastAnswer, setLastAnswer] = useState<{ correct: boolean; pattern: Pattern } | null>(null);
  const [roundsPlayed, setRoundsPlayed] = useState(0);

  const currentPattern = shuffledPatterns[currentPatternIndex];

  const startGame = useCallback(() => {
    const shuffled = [...patterns].sort(() => Math.random() - 0.5);
    setShuffledPatterns(shuffled);
    setCurrentPatternIndex(0);
    setGameState("playing");
    setTimeLeft(10);
    setScore(0);
    setStreak(0);
    setRoundsPlayed(0);
    setShowResult(false);
    setLastAnswer(null);
  }, []);

  useEffect(() => {
    if (gameState !== "playing" || showResult) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, showResult]);

  const handleTimeout = () => {
    setShowResult(true);
    setLastAnswer({ correct: false, pattern: currentPattern });
    setStreak(0);
    toast.error("Time's up!");
    
    setTimeout(() => nextPattern(), 1500);
  };

  const handleAnswer = (type: "bullish" | "bearish" | "neutral") => {
    const isCorrect = type === currentPattern.type;
    setShowResult(true);
    setLastAnswer({ correct: isCorrect, pattern: currentPattern });

    if (isCorrect) {
      const timeBonus = Math.floor(timeLeft * 5);
      const difficultyBonus = currentPattern.difficulty === "hard" ? 50 : currentPattern.difficulty === "medium" ? 30 : 20;
      const streakBonus = streak * 10;
      const pointsEarned = 100 + timeBonus + difficultyBonus + streakBonus;
      
      setScore(prev => prev + pointsEarned);
      setStreak(prev => prev + 1);
      setBestStreak(prev => Math.max(prev, streak + 1));
      toast.success(`+${pointsEarned} points! 🔥 Streak: ${streak + 1}`);
    } else {
      setStreak(0);
      toast.error(`Wrong! It was ${currentPattern.type}`);
    }

    setTimeout(() => nextPattern(), 1500);
  };

  const nextPattern = () => {
    setRoundsPlayed(prev => prev + 1);
    
    if (currentPatternIndex >= shuffledPatterns.length - 1 || roundsPlayed >= 9) {
      setGameState("complete");
      return;
    }

    setCurrentPatternIndex(prev => prev + 1);
    setTimeLeft(10);
    setShowResult(false);
    setLastAnswer(null);
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case "easy": return "bg-success/20 text-success";
      case "medium": return "bg-warning/20 text-warning";
      case "hard": return "bg-destructive/20 text-destructive";
      default: return "";
    }
  };

  return (
    <Card className="p-6 space-y-6 bg-gradient-to-br from-background to-primary/5">
      <div>
        <h3 className="text-xl font-bold mb-1 flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary" />
          Timed Pattern Recognition Challenge
        </h3>
        <p className="text-sm text-muted-foreground">
          Identify chart patterns as fast as you can! Speed and accuracy earn bonus points.
        </p>
      </div>

      {gameState === "idle" && (
        <div className="text-center py-8 space-y-6">
          <div className="space-y-2">
            <BarChart3 className="w-16 h-16 mx-auto text-primary" />
            <h4 className="text-xl font-bold">Ready to Test Your Skills?</h4>
            <p className="text-muted-foreground">
              You'll have 10 seconds per pattern. Identify if it's bullish, bearish, or neutral.
            </p>
          </div>
          <div className="flex justify-center gap-4">
            <Badge className="bg-success/20 text-success px-3 py-1">+Speed Bonus</Badge>
            <Badge className="bg-warning/20 text-warning px-3 py-1">+Streak Bonus</Badge>
            <Badge className="bg-primary/20 text-primary px-3 py-1">+Difficulty Bonus</Badge>
          </div>
          <Button onClick={startGame} size="lg" className="px-8">
            <Play className="w-4 h-4 mr-2" />
            Start Challenge
          </Button>
        </div>
      )}

      {gameState === "playing" && currentPattern && (
        <div className="space-y-4">
          {/* Status Bar */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Badge variant="outline">Round {roundsPlayed + 1}/10</Badge>
              <Badge className={getDifficultyColor(currentPattern.difficulty)}>
                {currentPattern.difficulty}
              </Badge>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Zap className="w-4 h-4 text-warning" />
                <span className="font-bold">{streak}</span>
              </div>
              <span className="text-xl font-bold text-primary">{score} pts</span>
            </div>
          </div>

          {/* Timer */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <Timer className={`w-4 h-4 ${timeLeft <= 3 ? 'text-destructive animate-pulse' : 'text-muted-foreground'}`} />
              <span className={`font-mono text-xl font-bold ${timeLeft <= 3 ? 'text-destructive' : ''}`}>
                {timeLeft}s
              </span>
            </div>
            <Progress 
              value={(timeLeft / 10) * 100} 
              className={`h-2 ${timeLeft <= 3 ? '[&>div]:bg-destructive' : ''}`}
            />
          </div>

          {/* Chart */}
          <Card className="p-4 bg-muted/30">
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={currentPattern.data}>
                  <XAxis dataKey="x" hide />
                  <YAxis domain={['dataMin - 5', 'dataMax + 5']} hide />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--primary))', r: 4 }}
                    animationDuration={300}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Answer Buttons */}
          {!showResult && (
            <div className="grid grid-cols-3 gap-3">
              <Button
                onClick={() => handleAnswer("bullish")}
                variant="outline"
                size="lg"
                className="flex-col h-20 hover:bg-success/10 hover:border-success"
              >
                <span className="text-2xl mb-1">📈</span>
                <span className="font-bold text-success">Bullish</span>
              </Button>
              <Button
                onClick={() => handleAnswer("neutral")}
                variant="outline"
                size="lg"
                className="flex-col h-20 hover:bg-warning/10 hover:border-warning"
              >
                <span className="text-2xl mb-1">➡️</span>
                <span className="font-bold text-warning">Neutral</span>
              </Button>
              <Button
                onClick={() => handleAnswer("bearish")}
                variant="outline"
                size="lg"
                className="flex-col h-20 hover:bg-destructive/10 hover:border-destructive"
              >
                <span className="text-2xl mb-1">📉</span>
                <span className="font-bold text-destructive">Bearish</span>
              </Button>
            </div>
          )}

          {/* Result Flash */}
          <AnimatePresence>
            {showResult && lastAnswer && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className={`p-4 rounded-lg text-center ${
                  lastAnswer.correct ? 'bg-success/20' : 'bg-destructive/20'
                }`}
              >
                {lastAnswer.correct ? (
                  <CheckCircle2 className="w-12 h-12 mx-auto text-success mb-2" />
                ) : (
                  <XCircle className="w-12 h-12 mx-auto text-destructive mb-2" />
                )}
                <p className="font-bold">{lastAnswer.pattern.name}</p>
                <p className={`text-sm capitalize ${
                  lastAnswer.pattern.type === 'bullish' ? 'text-success' :
                  lastAnswer.pattern.type === 'bearish' ? 'text-destructive' : 'text-warning'
                }`}>
                  {lastAnswer.pattern.type}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {gameState === "complete" && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center py-8 space-y-6"
        >
          <Trophy className="w-16 h-16 mx-auto text-warning" />
          <h4 className="text-2xl font-bold">Challenge Complete!</h4>
          
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
            <Card className="p-4 bg-muted/30">
              <div className="text-3xl font-bold text-primary">{score}</div>
              <div className="text-xs text-muted-foreground">Total Score</div>
            </Card>
            <Card className="p-4 bg-muted/30">
              <div className="text-3xl font-bold text-warning">{bestStreak}</div>
              <div className="text-xs text-muted-foreground">Best Streak</div>
            </Card>
            <Card className="p-4 bg-muted/30">
              <div className="text-3xl font-bold text-success">{Math.round((score / (roundsPlayed * 150)) * 100)}%</div>
              <div className="text-xs text-muted-foreground">Accuracy</div>
            </Card>
          </div>

          <Button onClick={startGame} size="lg">
            <RotateCcw className="w-4 h-4 mr-2" />
            Play Again
          </Button>
        </motion.div>
      )}
    </Card>
  );
};

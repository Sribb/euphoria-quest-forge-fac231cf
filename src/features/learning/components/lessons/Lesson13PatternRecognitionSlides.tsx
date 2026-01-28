import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowRight, 
  CheckCircle,
  XCircle,
  Target,
  TrendingUp,
  TrendingDown,
  Timer,
  BarChart3,
  Zap,
  Lightbulb
} from "lucide-react";

type Slide = 1 | 2 | 3 | 4;

interface Lesson13Props {
  onComplete?: () => void;
}

const chartPatterns = [
  {
    id: 1,
    name: "Head and Shoulders",
    type: "bearish",
    description: "Reversal pattern signaling trend change from bullish to bearish",
    points: [20, 40, 30, 60, 35, 40, 25],
    correctAnswer: "bearish",
  },
  {
    id: 2,
    name: "Double Bottom",
    type: "bullish",
    description: "Support tested twice, likely to break upward",
    points: [50, 30, 20, 35, 20, 40, 55],
    correctAnswer: "bullish",
  },
  {
    id: 3,
    name: "Ascending Triangle",
    type: "bullish",
    description: "Higher lows pushing against resistance—often breaks up",
    points: [20, 35, 25, 40, 30, 42, 35],
    correctAnswer: "bullish",
  },
  {
    id: 4,
    name: "Descending Triangle",
    type: "bearish",
    description: "Lower highs pressing against support—often breaks down",
    points: [50, 45, 30, 40, 28, 35, 28],
    correctAnswer: "bearish",
  },
];

const reflectionQuestions = [
  {
    question: "Why are chart patterns useful for investors?",
    options: [
      { text: "They guarantee future price movements", correct: false },
      { text: "They identify potential support/resistance and trend changes", correct: true },
      { text: "They eliminate all investment risk", correct: false },
    ],
  },
  {
    question: "What does a 'Double Bottom' pattern suggest?",
    options: [
      { text: "Price tested support twice and may bounce upward", correct: true },
      { text: "The stock will definitely double in price", correct: false },
      { text: "The company reported two quarters of losses", correct: false },
    ],
  },
  {
    question: "Should you trade based on patterns alone?",
    options: [
      { text: "Yes, patterns are 100% reliable", correct: false },
      { text: "No, combine with fundamentals and risk management", correct: true },
      { text: "Only if you're a professional", correct: false },
    ],
  },
];

export const Lesson13PatternRecognitionSlides = ({ onComplete }: Lesson13Props) => {
  const [currentSlide, setCurrentSlide] = useState<Slide>(1);
  const [currentPattern, setCurrentPattern] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [answers, setAnswers] = useState<{pattern: number; answer: string; correct: boolean}[]>([]);
  const [reflectionIndex, setReflectionIndex] = useState(0);
  const [reflectionAnswers, setReflectionAnswers] = useState<boolean[]>([]);

  useEffect(() => {
    if (currentSlide === 1 && isTimerActive && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && isTimerActive) {
      handleAnswer("timeout");
    }
  }, [timeLeft, isTimerActive, currentSlide]);

  const handleAnswer = (answer: string) => {
    const pattern = chartPatterns[currentPattern];
    const correct = answer === pattern.correctAnswer;
    
    setAnswers([...answers, { pattern: currentPattern, answer, correct }]);
    setIsTimerActive(false);
    
    setTimeout(() => {
      if (currentPattern < chartPatterns.length - 1) {
        setCurrentPattern(currentPattern + 1);
        setTimeLeft(15);
        setIsTimerActive(true);
      }
    }, 1500);
  };

  const handleReflectionAnswer = (isCorrect: boolean) => {
    setReflectionAnswers([...reflectionAnswers, isCorrect]);
    if (reflectionIndex < reflectionQuestions.length - 1) {
      setTimeout(() => setReflectionIndex(reflectionIndex + 1), 1000);
    }
  };

  const nextSlide = () => {
    if (currentSlide < 4) {
      setCurrentSlide((currentSlide + 1) as Slide);
    } else {
      onComplete?.();
    }
  };

  const slideLabels = ["Experience", "Reflect", "Insight", "Apply"];
  const pattern = chartPatterns[currentPattern];
  const score = answers.filter(a => a.correct).length;

  return (
    <div className="space-y-6">
      {/* Progress indicator */}
      <div className="flex justify-center gap-2 mb-4">
        {[1, 2, 3, 4].map((slide) => (
          <div key={slide} className="flex flex-col items-center">
            <motion.div
              className={`h-2 rounded-full transition-all duration-300 ${
                slide === currentSlide ? "w-8 bg-primary" : slide < currentSlide ? "w-4 bg-primary/50" : "w-4 bg-muted"
              }`}
            />
            <span className={`text-xs mt-1 ${slide === currentSlide ? "text-primary font-medium" : "text-muted-foreground"}`}>
              {slideLabels[slide - 1]}
            </span>
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Slide 1: Experience - Timed Pattern Challenge */}
        {currentSlide === 1 && (
          <motion.div
            key="slide1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-8">
              <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">Experience</Badge>
              
              <h2 className="text-2xl font-bold mb-2">Timed Pattern Recognition</h2>
              <p className="text-muted-foreground mb-6">
                Identify whether each chart pattern signals a bullish or bearish move. Speed matters!
              </p>

              {/* Timer and Score */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <Timer className={`w-5 h-5 ${timeLeft <= 5 ? "text-destructive animate-pulse" : "text-primary"}`} />
                  <span className={`font-bold text-xl ${timeLeft <= 5 ? "text-destructive" : ""}`}>{timeLeft}s</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-500" />
                  <span className="font-bold">{score}/{answers.length} correct</span>
                </div>
              </div>

              {/* Progress */}
              <Progress value={(currentPattern / chartPatterns.length) * 100} className="h-2 mb-6" />

              {/* Pattern Display */}
              <Card className="p-6 bg-muted/50 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  <span className="font-bold">Pattern {currentPattern + 1} of {chartPatterns.length}</span>
                </div>

                {/* Simple Chart Visualization */}
                <div className="h-40 flex items-end gap-2 p-4 bg-background rounded-xl border mb-4">
                  {pattern.points.map((point, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ height: 0 }}
                      animate={{ height: `${point}%` }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex-1 bg-gradient-to-t from-primary to-primary/50 rounded-t"
                    />
                  ))}
                </div>

                <h3 className="font-bold text-lg mb-2">{pattern.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{pattern.description}</p>

                {/* Answer Buttons */}
                {answers.length <= currentPattern && (
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      onClick={() => handleAnswer("bullish")}
                      className="gap-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-500 border border-emerald-500/30"
                      variant="outline"
                    >
                      <TrendingUp className="w-5 h-5" /> Bullish
                    </Button>
                    <Button
                      onClick={() => handleAnswer("bearish")}
                      className="gap-2 bg-destructive/20 hover:bg-destructive/30 text-destructive border border-destructive/30"
                      variant="outline"
                    >
                      <TrendingDown className="w-5 h-5" /> Bearish
                    </Button>
                  </div>
                )}

                {/* Feedback */}
                {answers.length > currentPattern && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`p-4 rounded-xl flex items-center gap-3 ${
                      answers[currentPattern]?.correct 
                        ? "bg-emerald-500/20 border border-emerald-500/50" 
                        : "bg-destructive/20 border border-destructive/50"
                    }`}
                  >
                    {answers[currentPattern]?.correct ? (
                      <><CheckCircle className="w-6 h-6 text-emerald-500" /><span className="text-emerald-500">Correct! 🎉</span></>
                    ) : (
                      <><XCircle className="w-6 h-6 text-destructive" /><span className="text-destructive">The answer was {pattern.correctAnswer}</span></>
                    )}
                  </motion.div>
                )}
              </Card>

              <div className="flex justify-center">
                <Button 
                  onClick={nextSlide} 
                  size="lg" 
                  className="gap-2"
                  disabled={answers.length < chartPatterns.length}
                >
                  {answers.length < chartPatterns.length ? `${chartPatterns.length - answers.length} patterns remaining` : "Continue to Reflect"}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Slide 2: Reflect */}
        {currentSlide === 2 && (
          <motion.div
            key="slide2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-8">
              <Badge className="mb-4 bg-amber-500/20 text-amber-400 border-amber-500/30">Reflect</Badge>
              
              <h2 className="text-2xl font-bold text-center mb-2">Understanding Chart Patterns</h2>
              <p className="text-center text-muted-foreground mb-8">Test your understanding</p>

              <Card className="p-6 bg-muted/50 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="w-5 h-5 text-amber-500" />
                  <span className="text-sm text-muted-foreground">Question {reflectionIndex + 1} of {reflectionQuestions.length}</span>
                </div>
                
                <h3 className="font-bold text-lg mb-6">{reflectionQuestions[reflectionIndex].question}</h3>
                
                <div className="space-y-3">
                  {reflectionQuestions[reflectionIndex].options.map((option, idx) => (
                    <motion.button
                      key={idx}
                      onClick={() => handleReflectionAnswer(option.correct)}
                      className={`w-full p-4 rounded-xl text-left border-2 transition-all ${
                        reflectionAnswers[reflectionIndex] !== undefined
                          ? option.correct ? "border-emerald-500 bg-emerald-500/10" : "border-border opacity-50"
                          : "border-border hover:border-primary"
                      }`}
                      disabled={reflectionAnswers[reflectionIndex] !== undefined}
                      whileHover={reflectionAnswers[reflectionIndex] === undefined ? { scale: 1.02 } : {}}
                    >
                      {option.text}
                      {reflectionAnswers[reflectionIndex] !== undefined && option.correct && (
                        <CheckCircle className="w-5 h-5 text-emerald-500 inline ml-2" />
                      )}
                    </motion.button>
                  ))}
                </div>
              </Card>

              <div className="flex justify-center gap-2 mb-8">
                {reflectionQuestions.map((_, idx) => (
                  <div key={idx} className={`w-3 h-3 rounded-full ${idx === reflectionIndex ? "bg-primary scale-125" : reflectionAnswers[idx] !== undefined ? "bg-emerald-500" : "bg-muted"}`} />
                ))}
              </div>

              <div className="flex justify-center">
                <Button onClick={nextSlide} size="lg" className="gap-2" disabled={reflectionAnswers.length < reflectionQuestions.length}>
                  Continue to Insight <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Slide 3: Insight */}
        {currentSlide === 3 && (
          <motion.div
            key="slide3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-8">
              <Badge className="mb-4 bg-blue-500/20 text-blue-400 border-blue-500/30">Insight</Badge>
              
              <h2 className="text-2xl font-bold text-center mb-8">Pattern Recognition Insights</h2>

              <div className="grid gap-6 mb-8">
                {[
                  {
                    title: "Patterns Reflect Psychology",
                    description: "Chart patterns emerge because traders collectively react to price levels, creating self-fulfilling prophecies at key points.",
                    icon: BarChart3,
                  },
                  {
                    title: "Confirmation Matters",
                    description: "Never act on a pattern alone. Wait for confirmation—a break above resistance or below support—before trading.",
                    icon: CheckCircle,
                  },
                  {
                    title: "Combine with Volume",
                    description: "Strong patterns show increasing volume at breakout points. Low-volume breakouts often fail.",
                    icon: TrendingUp,
                  },
                ].map((insight, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.2 }}
                    className="p-6 rounded-xl bg-blue-500/10 border border-blue-500/30"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-blue-500/20">
                        <insight.icon className="w-6 h-6 text-blue-500" />
                      </div>
                      <div>
                        <h3 className="font-bold mb-2">{insight.title}</h3>
                        <p className="text-muted-foreground">{insight.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="flex justify-center">
                <Button onClick={nextSlide} size="lg" className="gap-2">
                  Continue to Apply <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Slide 4: Apply */}
        {currentSlide === 4 && (
          <motion.div
            key="slide4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-8">
              <Badge className="mb-4 bg-purple-500/20 text-purple-400 border-purple-500/30">Apply</Badge>
              
              <h2 className="text-2xl font-bold text-center mb-2">Pattern Recognition Action Plan</h2>
              <p className="text-center text-muted-foreground mb-8">Apply chart pattern knowledge in your trading</p>

              <Card className="p-6 bg-muted/50 mb-6 text-center">
                <div className="text-4xl font-bold mb-2" style={{ color: score >= 3 ? "#22c55e" : score >= 2 ? "#f59e0b" : "#ef4444" }}>
                  {score}/{chartPatterns.length} Correct
                </div>
                <p className="text-muted-foreground">
                  {score >= 3 ? "Strong foundation in pattern recognition!" : "Keep practicing to sharpen your eye."}
                </p>
              </Card>

              <div className="space-y-4 mb-6">
                {[
                  { action: "Practice on historical charts daily", tip: "Use TradingView's replay feature to practice identifying patterns in real-time conditions" },
                  { action: "Wait for confirmation before trading", tip: "A pattern isn't complete until price breaks the neckline or key level with volume" },
                  { action: "Set clear entry and exit rules", tip: "Define your stop-loss at the pattern's invalidation point before entering" },
                  { action: "Keep a pattern journal", tip: "Track which patterns work best for you and in which market conditions" },
                  { action: "Combine patterns with other indicators", tip: "Patterns are stronger when RSI, MACD, or volume confirm the expected move" },
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-4 rounded-xl bg-muted/50 border border-border"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
                        {idx + 1}
                      </div>
                      <div>
                        <p className="font-medium">{item.action}</p>
                        <p className="text-sm text-muted-foreground">{item.tip}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <Card className="p-4 bg-emerald-500/10 border border-emerald-500/30 mb-6">
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-emerald-500 mt-1" />
                  <div>
                    <h4 className="font-bold text-emerald-500">Key Takeaway</h4>
                    <p className="text-sm text-muted-foreground">
                      Patterns are probabilistic, not predictive. Even the best patterns fail 30-40% of the time. Always use stop-losses and never risk more than 2% of your account on any single trade.
                    </p>
                  </div>
                </div>
              </Card>

              <div className="flex justify-center">
                <Button onClick={nextSlide} size="lg" className="gap-2">
                  Complete Lesson <CheckCircle className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

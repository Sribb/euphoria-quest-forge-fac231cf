import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowRight, 
  CheckCircle,
  Target,
  TrendingDown,
  AlertTriangle,
  Lightbulb,
  Activity,
  Shield
} from "lucide-react";

type Slide = 1 | 2 | 3 | 4;

interface Lesson19Props {
  onComplete?: () => void;
}

const reflectionQuestions = [
  {
    question: "What is the maximum drawdown?",
    options: [
      { text: "The largest peak-to-trough decline before a new high", correct: true },
      { text: "The average daily loss", correct: false },
      { text: "The total return of a portfolio", correct: false },
    ],
  },
  {
    question: "How should you react to a 20% portfolio drawdown?",
    options: [
      { text: "Panic sell everything", correct: false },
      { text: "Evaluate if it's within your risk tolerance", correct: true },
      { text: "Double your position immediately", correct: false },
    ],
  },
  {
    question: "What's a healthy mindset about volatility?",
    options: [
      { text: "Volatility is always bad and should be avoided", correct: false },
      { text: "Volatility is the price of admission for higher returns", correct: true },
      { text: "Volatility doesn't affect long-term investors", correct: false },
    ],
  },
];

export const Lesson19VolatilitySlides = ({ onComplete }: Lesson19Props) => {
  const [currentSlide, setCurrentSlide] = useState<Slide>(1);
  const [portfolioValue, setPortfolioValue] = useState(100000);
  const [peak, setPeak] = useState(100000);
  const [drawdown, setDrawdown] = useState(0);
  const [maxDrawdown, setMaxDrawdown] = useState(0);
  const [history, setHistory] = useState<number[]>([100000]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [reflectionIndex, setReflectionIndex] = useState(0);
  const [reflectionAnswers, setReflectionAnswers] = useState<boolean[]>([]);

  useEffect(() => {
    if (isSimulating && currentSlide === 1) {
      const interval = setInterval(() => {
        setPortfolioValue((prev) => {
          const change = (Math.random() - 0.48) * 0.05;
          const newValue = prev * (1 + change);
          
          setHistory((h) => [...h.slice(-50), newValue]);
          
          if (newValue > peak) {
            setPeak(newValue);
          }
          
          const currentDrawdown = ((peak - newValue) / peak) * 100;
          setDrawdown(Math.max(0, currentDrawdown));
          
          if (currentDrawdown > maxDrawdown) {
            setMaxDrawdown(currentDrawdown);
          }
          
          return newValue;
        });
      }, 200);
      
      return () => clearInterval(interval);
    }
  }, [isSimulating, peak, maxDrawdown, currentSlide]);

  const handleReflectionAnswer = (isCorrect: boolean) => {
    setReflectionAnswers([...reflectionAnswers, isCorrect]);
    if (reflectionIndex < reflectionQuestions.length - 1) {
      setTimeout(() => setReflectionIndex(reflectionIndex + 1), 1000);
    }
  };

  const resetSimulation = () => {
    setPortfolioValue(100000);
    setPeak(100000);
    setDrawdown(0);
    setMaxDrawdown(0);
    setHistory([100000]);
  };

  const nextSlide = () => {
    if (currentSlide < 4) {
      setCurrentSlide((currentSlide + 1) as Slide);
    } else {
      onComplete?.();
    }
  };

  const slideLabels = ["Experience", "Reflect", "Insight", "Apply"];
  const totalReturn = ((portfolioValue - 100000) / 100000) * 100;

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
        {/* Slide 1: Experience - Volatility Roller Coaster */}
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
              
              <h2 className="text-2xl font-bold mb-2">Volatility Roller Coaster</h2>
              <p className="text-muted-foreground mb-6">
                Watch a portfolio fluctuate in real-time. Track drawdowns and see how volatility feels emotionally.
              </p>

              {/* Control Buttons */}
              <div className="flex gap-3 mb-6">
                <Button 
                  onClick={() => setIsSimulating(!isSimulating)}
                  variant={isSimulating ? "destructive" : "default"}
                >
                  {isSimulating ? "Stop" : "Start"} Simulation
                </Button>
                <Button variant="outline" onClick={resetSimulation}>
                  Reset
                </Button>
              </div>

              {/* Portfolio Chart */}
              <Card className="p-4 bg-muted/50 mb-6">
                <div className="h-40 flex items-end gap-0.5 overflow-hidden">
                  {history.map((value, idx) => {
                    const height = ((value - 80000) / 40000) * 100;
                    const isUp = idx > 0 && value > history[idx - 1];
                    return (
                      <motion.div
                        key={idx}
                        initial={{ height: 0 }}
                        animate={{ height: `${Math.max(5, Math.min(100, height))}%` }}
                        className={`flex-1 min-w-[4px] rounded-t ${isUp ? "bg-emerald-500" : "bg-destructive"}`}
                      />
                    );
                  })}
                </div>
              </Card>

              {/* Stats Grid */}
              <div className="grid grid-cols-4 gap-3 mb-6">
                <div className="p-3 rounded-xl bg-background border text-center">
                  <p className="text-xs text-muted-foreground">Portfolio Value</p>
                  <p className="text-lg font-bold">${portfolioValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                </div>
                <div className={`p-3 rounded-xl text-center ${totalReturn >= 0 ? "bg-emerald-500/10 border-emerald-500/30" : "bg-destructive/10 border-destructive/30"} border`}>
                  <p className="text-xs text-muted-foreground">Total Return</p>
                  <p className={`text-lg font-bold ${totalReturn >= 0 ? "text-emerald-500" : "text-destructive"}`}>
                    {totalReturn >= 0 ? "+" : ""}{totalReturn.toFixed(1)}%
                  </p>
                </div>
                <div className={`p-3 rounded-xl text-center ${drawdown > 10 ? "bg-destructive/10 border-destructive/30" : "bg-amber-500/10 border-amber-500/30"} border`}>
                  <p className="text-xs text-muted-foreground">Current Drawdown</p>
                  <p className={`text-lg font-bold ${drawdown > 10 ? "text-destructive" : "text-amber-500"}`}>
                    -{drawdown.toFixed(1)}%
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/30 text-center">
                  <p className="text-xs text-muted-foreground">Max Drawdown</p>
                  <p className="text-lg font-bold text-destructive">-{maxDrawdown.toFixed(1)}%</p>
                </div>
              </div>

              {/* Drawdown Meter */}
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <Activity className="w-4 h-4" /> Drawdown Severity
                  </span>
                  <span className={`text-sm font-bold ${
                    drawdown < 5 ? "text-emerald-500" : drawdown < 10 ? "text-amber-500" : drawdown < 20 ? "text-orange-500" : "text-destructive"
                  }`}>
                    {drawdown < 5 ? "Normal" : drawdown < 10 ? "Moderate" : drawdown < 20 ? "Significant" : "Severe"}
                  </span>
                </div>
                <Progress value={Math.min(drawdown * 3, 100)} className="h-3" />
              </div>

              {maxDrawdown > 15 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl bg-destructive/20 border border-destructive/50 mb-6"
                >
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-6 h-6 text-destructive" />
                    <div>
                      <p className="font-bold text-destructive">Significant Drawdown Experienced!</p>
                      <p className="text-sm text-muted-foreground">This is when many investors panic sell. Would you have held on?</p>
                    </div>
                  </div>
                </motion.div>
              )}

              <div className="flex justify-center">
                <Button onClick={nextSlide} size="lg" className="gap-2">
                  Continue to Reflect <ArrowRight className="w-4 h-4" />
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
              
              <h2 className="text-2xl font-bold text-center mb-2">Understanding Volatility</h2>
              <p className="text-center text-muted-foreground mb-8">Test your knowledge of drawdowns and risk</p>

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
              
              <h2 className="text-2xl font-bold text-center mb-8">Volatility Insights</h2>

              <div className="grid gap-6 mb-8">
                {[
                  {
                    title: "Volatility ≠ Risk",
                    description: "Volatility measures price fluctuation. True risk is permanent capital loss. A quality stock dropping 30% isn't risky if fundamentals are intact—it's an opportunity.",
                    icon: Activity,
                  },
                  {
                    title: "Drawdowns Are Normal",
                    description: "The S&P 500 has a 10%+ drawdown almost every year, 20%+ every few years, and 40%+ each decade. Expecting constant gains sets you up for panic.",
                    icon: TrendingDown,
                  },
                  {
                    title: "Know Your Tolerance",
                    description: "Before investing, ask: 'Can I handle a 30% drop without selling?' If not, reduce equity exposure. Your behavior during drawdowns determines returns.",
                    icon: Shield,
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
              
              <h2 className="text-2xl font-bold text-center mb-2">Managing Volatility</h2>
              <p className="text-center text-muted-foreground mb-8">Practical strategies for handling market swings</p>

              <div className="space-y-4 mb-6">
                {[
                  { strategy: "Set Your Allocation Before Volatility Hits", tip: "Decide stock/bond mix when calm, not during crashes" },
                  { strategy: "Automate Your Investments", tip: "Dollar-cost averaging removes emotion from timing decisions" },
                  { strategy: "Write Down Your Plan", tip: "Document what you'll do in a 20% drop—and stick to it" },
                  { strategy: "Rebalance Systematically", tip: "Sell high, buy low by rebalancing to target allocation" },
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-4 rounded-xl bg-muted/50 border"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
                        {idx + 1}
                      </div>
                      <div>
                        <p className="font-medium">{item.strategy}</p>
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
                      The investors who build wealth aren't those who avoid volatility—they're those who stay invested through it. Plan for drawdowns before they happen.
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

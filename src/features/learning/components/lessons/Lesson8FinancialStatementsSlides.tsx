import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { 
  ArrowRight, 
  Sparkles, 
  Lock,
  Unlock,
  Calculator,
  TrendingUp,
  FileText,
  CheckCircle,
  XCircle,
  Lightbulb,
  Target
} from "lucide-react";

type Slide = 1 | 2 | 3 | 4;

interface Lesson8Props {
  onComplete?: () => void;
}

const puzzles = [
  {
    id: 1,
    company: "TechGrowth Inc.",
    data: { revenue: 500000, costOfGoods: 200000, operatingExpenses: 150000, netIncome: 112500 },
    question: "Calculate the Gross Profit Margin (Gross Profit / Revenue × 100)",
    answer: 60,
    hint: "Gross Profit = Revenue - Cost of Goods Sold",
    tolerance: 2,
  },
  {
    id: 2,
    company: "RetailMax Corp.",
    data: { totalAssets: 2000000, totalLiabilities: 800000, currentAssets: 600000, currentLiabilities: 300000 },
    question: "Calculate the Current Ratio (Current Assets / Current Liabilities)",
    answer: 2,
    hint: "A ratio above 1 means the company can pay short-term debts",
    tolerance: 0.1,
  },
  {
    id: 3,
    company: "DebtFree Ltd.",
    data: { totalDebt: 500000, totalEquity: 1000000, netIncome: 150000 },
    question: "Calculate the Debt-to-Equity Ratio (Total Debt / Total Equity)",
    answer: 0.5,
    hint: "Lower ratios indicate less financial risk",
    tolerance: 0.05,
  },
];

const reflectionQuestions = [
  {
    question: "Why is Gross Profit Margin important for investors?",
    options: [
      { text: "It shows how efficiently a company produces goods", correct: true },
      { text: "It tells you the stock price", correct: false },
      { text: "It measures employee satisfaction", correct: false },
    ],
  },
  {
    question: "What does a Current Ratio below 1 indicate?",
    options: [
      { text: "The company is highly profitable", correct: false },
      { text: "The company may struggle to pay short-term debts", correct: true },
      { text: "The stock will go up", correct: false },
    ],
  },
  {
    question: "Why might high Debt-to-Equity be risky?",
    options: [
      { text: "More debt means higher interest payments and risk", correct: true },
      { text: "It means the company has too many employees", correct: false },
      { text: "It indicates weak marketing", correct: false },
    ],
  },
];

export const Lesson8FinancialStatementsSlides = ({ onComplete }: Lesson8Props) => {
  const [currentSlide, setCurrentSlide] = useState<Slide>(1);
  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [solvedPuzzles, setSolvedPuzzles] = useState<number[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [reflectionIndex, setReflectionIndex] = useState(0);
  const [reflectionAnswers, setReflectionAnswers] = useState<boolean[]>([]);
  const [challengeComplete, setChallengeComplete] = useState(false);

  const puzzle = puzzles[currentPuzzle];
  const progress = (solvedPuzzles.length / puzzles.length) * 100;

  const checkAnswer = () => {
    const numAnswer = parseFloat(userAnswer);
    const isCorrect = Math.abs(numAnswer - puzzle.answer) <= puzzle.tolerance;
    
    setFeedback(isCorrect ? "correct" : "incorrect");
    
    if (isCorrect && !solvedPuzzles.includes(currentPuzzle)) {
      setSolvedPuzzles([...solvedPuzzles, currentPuzzle]);
    }
    
    setTimeout(() => setFeedback(null), 2000);
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

  return (
    <div className="space-y-6">
      {/* Progress indicator */}
      <div className="flex justify-center gap-2 mb-4">
        {[1, 2, 3, 4].map((slide) => (
          <div key={slide} className="flex flex-col items-center">
            <motion.div
              className={`h-2 rounded-full transition-all duration-300 ${
                slide === currentSlide 
                  ? "w-8 bg-primary" 
                  : slide < currentSlide 
                    ? "w-4 bg-primary/50" 
                    : "w-4 bg-muted"
              }`}
            />
            <span className={`text-xs mt-1 ${slide === currentSlide ? "text-primary font-medium" : "text-muted-foreground"}`}>
              {slideLabels[slide - 1]}
            </span>
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Slide 1: Experience - Financial Escape Room */}
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
              
              <motion.h2 
                className="text-2xl font-bold mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Financial Statement Escape Room
              </motion.h2>
              <motion.p 
                className="text-muted-foreground mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Solve ratio puzzles to unlock each door. Calculate correctly to escape!
              </motion.p>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Escape Progress</span>
                  <span className="font-bold text-primary">{solvedPuzzles.length}/{puzzles.length} Doors Unlocked</span>
                </div>
                <Progress value={progress} className="h-3" />
              </div>

              {/* Puzzle Cards */}
              <div className="flex gap-4 mb-6">
                {puzzles.map((p, idx) => (
                  <motion.div
                    key={p.id}
                    className={`flex-1 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      idx === currentPuzzle 
                        ? "border-primary bg-primary/10" 
                        : solvedPuzzles.includes(idx)
                          ? "border-emerald-500 bg-emerald-500/10"
                          : "border-border"
                    }`}
                    onClick={() => setCurrentPuzzle(idx)}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-sm">Door {idx + 1}</span>
                      {solvedPuzzles.includes(idx) ? (
                        <Unlock className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <Lock className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{p.company}</p>
                  </motion.div>
                ))}
              </div>

              {/* Current Puzzle */}
              <Card className="p-6 bg-muted/50 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-5 h-5 text-primary" />
                  <h3 className="font-bold">{puzzle.company}</h3>
                </div>

                {/* Financial Data */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {Object.entries(puzzle.data).map(([key, value]) => (
                    <div key={key} className="p-3 rounded-lg bg-background border border-border">
                      <p className="text-xs text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                      <p className="font-bold">${value.toLocaleString()}</p>
                    </div>
                  ))}
                </div>

                {/* Question */}
                <div className="p-4 rounded-xl bg-primary/10 border border-primary/30 mb-4">
                  <p className="font-medium mb-3">{puzzle.question}</p>
                  <div className="flex gap-3">
                    <Input
                      type="number"
                      placeholder="Enter your answer"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={checkAnswer} disabled={!userAnswer}>
                      <Calculator className="w-4 h-4 mr-2" /> Check
                    </Button>
                  </div>
                </div>

                {/* Hint */}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowHint(!showHint)}
                  className="text-muted-foreground"
                >
                  <Lightbulb className="w-4 h-4 mr-2" /> {showHint ? "Hide" : "Show"} Hint
                </Button>
                
                {showHint && (
                  <motion.p 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="text-sm text-muted-foreground mt-2 p-3 bg-muted rounded-lg"
                  >
                    💡 {puzzle.hint}
                  </motion.p>
                )}

                {/* Feedback */}
                <AnimatePresence>
                  {feedback && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className={`mt-4 p-4 rounded-xl flex items-center gap-3 ${
                        feedback === "correct" 
                          ? "bg-emerald-500/20 border border-emerald-500/50" 
                          : "bg-destructive/20 border border-destructive/50"
                      }`}
                    >
                      {feedback === "correct" ? (
                        <>
                          <CheckCircle className="w-6 h-6 text-emerald-500" />
                          <span className="font-medium text-emerald-500">Correct! Door unlocked! 🎉</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-6 h-6 text-destructive" />
                          <span className="font-medium text-destructive">Not quite. Try again!</span>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>

              <motion.div 
                className="flex justify-center relative z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Button 
                  onClick={nextSlide} 
                  size="lg" 
                  className="gap-2"
                  disabled={solvedPuzzles.length < 2}
                >
                  {solvedPuzzles.length < 2 ? `Solve ${2 - solvedPuzzles.length} more to continue` : "Continue to Reflect"} 
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </motion.div>
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
              
              <motion.h2 
                className="text-2xl font-bold text-center mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Why Do These Ratios Matter?
              </motion.h2>
              <motion.p 
                className="text-center text-muted-foreground mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Test your understanding of financial analysis
              </motion.p>

              {/* Reflection Question */}
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
                          ? option.correct
                            ? "border-emerald-500 bg-emerald-500/10"
                            : "border-border opacity-50"
                          : "border-border hover:border-primary"
                      }`}
                      disabled={reflectionAnswers[reflectionIndex] !== undefined}
                      whileHover={reflectionAnswers[reflectionIndex] === undefined ? { scale: 1.02 } : {}}
                      whileTap={reflectionAnswers[reflectionIndex] === undefined ? { scale: 0.98 } : {}}
                    >
                      {option.text}
                      {reflectionAnswers[reflectionIndex] !== undefined && option.correct && (
                        <CheckCircle className="w-5 h-5 text-emerald-500 inline ml-2" />
                      )}
                    </motion.button>
                  ))}
                </div>
              </Card>

              {/* Progress Dots */}
              <div className="flex justify-center gap-2 mb-8">
                {reflectionQuestions.map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-3 h-3 rounded-full transition-all ${
                      idx === reflectionIndex
                        ? "bg-primary scale-125"
                        : reflectionAnswers[idx] !== undefined
                          ? reflectionAnswers[idx]
                            ? "bg-emerald-500"
                            : "bg-destructive"
                          : "bg-muted"
                    }`}
                  />
                ))}
              </div>

              <motion.div 
                className="flex justify-center relative z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Button 
                  onClick={nextSlide} 
                  size="lg" 
                  className="gap-2"
                  disabled={reflectionAnswers.length < reflectionQuestions.length}
                >
                  Continue to Insight <ArrowRight className="w-4 h-4" />
                </Button>
              </motion.div>
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
              
              <motion.h2 
                className="text-2xl font-bold text-center mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Key Financial Analysis Insights
              </motion.h2>

              <div className="grid gap-6 mb-8">
                {[
                  {
                    title: "Profitability Ratios",
                    description: "Gross and Net Profit Margins reveal how efficiently a company converts revenue into profit.",
                    icon: TrendingUp,
                    color: "emerald",
                  },
                  {
                    title: "Liquidity Ratios",
                    description: "Current and Quick Ratios show if a company can meet its short-term obligations.",
                    icon: Calculator,
                    color: "blue",
                  },
                  {
                    title: "Leverage Ratios",
                    description: "Debt-to-Equity shows financial risk—higher debt means more risk but potentially higher returns.",
                    icon: Target,
                    color: "amber",
                  },
                ].map((insight, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + idx * 0.2 }}
                    className="flex gap-4 p-4 rounded-xl border border-border bg-muted/30"
                  >
                    <div 
                      className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0`}
                      style={{ 
                        backgroundColor: insight.color === "emerald" ? "rgba(16, 185, 129, 0.2)" 
                          : insight.color === "blue" ? "rgba(59, 130, 246, 0.2)" 
                          : "rgba(245, 158, 11, 0.2)" 
                      }}
                    >
                      <insight.icon 
                        className="w-6 h-6" 
                        style={{ 
                          color: insight.color === "emerald" ? "#10b981" 
                            : insight.color === "blue" ? "#3b82f6" 
                            : "#f59e0b" 
                        }} 
                      />
                    </div>
                    <div>
                      <h3 className="font-bold mb-1">{insight.title}</h3>
                      <p className="text-sm text-muted-foreground">{insight.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="p-6 rounded-xl bg-primary/10 border border-primary/30 mb-8"
              >
                <div className="flex items-start gap-3">
                  <Sparkles className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold mb-2">The Complete Picture</h3>
                    <p className="text-sm text-muted-foreground">
                      No single ratio tells the full story. Compare ratios across time and against competitors 
                      to understand a company's true financial health. Look for trends, not just snapshots.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                className="flex justify-center relative z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                <Button onClick={nextSlide} size="lg" className="gap-2">
                  Apply What You Learned <ArrowRight className="w-4 h-4" />
                </Button>
              </motion.div>
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
              
              <motion.h2 
                className="text-2xl font-bold text-center mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Investment Decision Challenge
              </motion.h2>
              <motion.p 
                className="text-center text-muted-foreground mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Analyze these two companies and decide which is a better investment
              </motion.p>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {[
                  {
                    name: "SafeGrowth Inc.",
                    metrics: { grossMargin: "45%", currentRatio: 2.5, debtToEquity: 0.3 },
                    description: "Stable, low-debt company with consistent margins",
                    riskLevel: "Low",
                    color: "emerald",
                  },
                  {
                    name: "AgressiveVentures",
                    metrics: { grossMargin: "65%", currentRatio: 1.1, debtToEquity: 1.8 },
                    description: "High-margin but heavily leveraged growth company",
                    riskLevel: "High",
                    color: "rose",
                  },
                ].map((company, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + idx * 0.2 }}
                    className="p-6 rounded-xl border-2 border-border hover:border-primary transition-all cursor-pointer"
                    onClick={() => setChallengeComplete(true)}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold">{company.name}</h3>
                      <Badge 
                        style={{ 
                          backgroundColor: company.color === "emerald" ? "rgba(16, 185, 129, 0.2)" : "rgba(244, 63, 94, 0.2)",
                          color: company.color === "emerald" ? "#10b981" : "#f43f5e",
                          borderColor: company.color === "emerald" ? "#10b981" : "#f43f5e",
                        }}
                      >
                        {company.riskLevel} Risk
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Gross Margin</span>
                        <span className="font-semibold">{company.metrics.grossMargin}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Current Ratio</span>
                        <span className="font-semibold">{company.metrics.currentRatio}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Debt-to-Equity</span>
                        <span className="font-semibold">{company.metrics.debtToEquity}</span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">{company.description}</p>
                  </motion.div>
                ))}
              </div>

              {challengeComplete && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-6 rounded-xl bg-emerald-500/20 border border-emerald-500/50 mb-8 text-center"
                >
                  <Sparkles className="w-10 h-10 mx-auto mb-3 text-emerald-500" />
                  <h3 className="font-bold text-lg mb-2">Great Analysis!</h3>
                  <p className="text-sm text-muted-foreground">
                    Both choices can be valid depending on your risk tolerance and goals. 
                    SafeGrowth offers stability, while AgressiveVentures offers higher potential returns with more risk.
                  </p>
                </motion.div>
              )}

              <motion.div 
                className="flex justify-center relative z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <Button 
                  onClick={nextSlide} 
                  size="lg" 
                  className="gap-2"
                  disabled={!challengeComplete}
                >
                  Complete Lesson <CheckCircle className="w-4 h-4" />
                </Button>
              </motion.div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

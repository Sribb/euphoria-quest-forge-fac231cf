import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Trophy,
  Target,
  Sparkles,
  BookOpen
} from "lucide-react";

interface Question {
  id: number;
  type: "multiple-choice" | "scenario" | "decision";
  category: string;
  question: string;
  options: { id: string; text: string; isCorrect: boolean }[];
  explanation?: string;
}

const quizQuestions: Question[] = [
  // Budgeting & Basics (Questions 1-3)
  {
    id: 1,
    type: "multiple-choice",
    category: "Budgeting",
    question: "What is the recommended percentage of income to save before investing?",
    options: [
      { id: "a", text: "0% - invest everything immediately", isCorrect: false },
      { id: "b", text: "10-20% after building an emergency fund", isCorrect: true },
      { id: "c", text: "100% - never spend anything", isCorrect: false },
      { id: "d", text: "5% is more than enough", isCorrect: false },
    ],
    explanation: "Financial experts recommend saving 10-20% of income, but only after establishing a 3-6 month emergency fund.",
  },
  {
    id: 2,
    type: "scenario",
    category: "Budgeting",
    question: "You receive a $5,000 bonus. You have $2,000 in credit card debt at 18% APR and no emergency fund. What's the wisest first step?",
    options: [
      { id: "a", text: "Invest it all in stocks for maximum growth", isCorrect: false },
      { id: "b", text: "Pay off the credit card debt first", isCorrect: true },
      { id: "c", text: "Put it all in a savings account", isCorrect: false },
      { id: "d", text: "Buy cryptocurrency for quick gains", isCorrect: false },
    ],
    explanation: "High-interest debt should be paid off first as it costs more than most investments return.",
  },
  {
    id: 3,
    type: "multiple-choice",
    category: "Budgeting",
    question: "What is the purpose of an emergency fund?",
    options: [
      { id: "a", text: "To invest in high-risk opportunities", isCorrect: false },
      { id: "b", text: "To cover 3-6 months of living expenses for unexpected events", isCorrect: true },
      { id: "c", text: "To save for vacation", isCorrect: false },
      { id: "d", text: "To make monthly bill payments", isCorrect: false },
    ],
  },
  // Risk & Return (Questions 4-6)
  {
    id: 4,
    type: "multiple-choice",
    category: "Risk Tolerance",
    question: "What is the general relationship between risk and potential return in investing?",
    options: [
      { id: "a", text: "Higher risk = lower potential returns", isCorrect: false },
      { id: "b", text: "Higher risk = higher potential returns (but also higher potential losses)", isCorrect: true },
      { id: "c", text: "Risk and return are unrelated", isCorrect: false },
      { id: "d", text: "Lower risk always means better returns", isCorrect: false },
    ],
  },
  {
    id: 5,
    type: "scenario",
    category: "Risk Tolerance",
    question: "Your portfolio drops 20% in one month. You don't need the money for 20 years. What should you do?",
    options: [
      { id: "a", text: "Sell everything immediately to prevent more losses", isCorrect: false },
      { id: "b", text: "Stay calm and maintain your long-term strategy", isCorrect: true },
      { id: "c", text: "Double down by investing your emergency fund", isCorrect: false },
      { id: "d", text: "Move everything to cryptocurrency", isCorrect: false },
    ],
    explanation: "With a 20-year timeline, temporary market drops are normal and historically recover over time.",
  },
  {
    id: 6,
    type: "decision",
    category: "Risk Tolerance",
    question: "A 'conservative' investment portfolio typically contains:",
    options: [
      { id: "a", text: "100% stocks for maximum growth", isCorrect: false },
      { id: "b", text: "A higher allocation to bonds and stable assets", isCorrect: true },
      { id: "c", text: "Only cryptocurrency and options", isCorrect: false },
      { id: "d", text: "Exclusively real estate investments", isCorrect: false },
    ],
  },
  // Compound Interest (Questions 7-9)
  {
    id: 7,
    type: "multiple-choice",
    category: "Compound Interest",
    question: "If you invest $1,000 at 10% annual return, approximately how much will you have after 7 years (using the Rule of 72)?",
    options: [
      { id: "a", text: "$1,700", isCorrect: false },
      { id: "b", text: "$2,000 (your money doubles)", isCorrect: true },
      { id: "c", text: "$10,000", isCorrect: false },
      { id: "d", text: "$1,100", isCorrect: false },
    ],
    explanation: "The Rule of 72: divide 72 by your return rate to estimate years to double. 72/10 = 7.2 years.",
  },
  {
    id: 8,
    type: "scenario",
    category: "Compound Interest",
    question: "Person A invests $200/month from age 25-35 then stops. Person B invests $200/month from age 35-65. Assuming 8% returns, who has more at 65?",
    options: [
      { id: "a", text: "Person B - they invested for 30 years vs 10", isCorrect: false },
      { id: "b", text: "Person A - early investments compound longer", isCorrect: true },
      { id: "c", text: "They'll have exactly the same amount", isCorrect: false },
      { id: "d", text: "It depends on market conditions", isCorrect: false },
    ],
    explanation: "Time in market beats timing the market. Person A's early start gives compound interest more time to work.",
  },
  {
    id: 9,
    type: "multiple-choice",
    category: "Compound Interest",
    question: "What does 'compound interest' mean?",
    options: [
      { id: "a", text: "Interest paid only on the original principal", isCorrect: false },
      { id: "b", text: "Interest earned on both principal and previously earned interest", isCorrect: true },
      { id: "c", text: "A fixed interest rate that never changes", isCorrect: false },
      { id: "d", text: "Interest that decreases over time", isCorrect: false },
    ],
  },
  // Diversification (Questions 10-12)
  {
    id: 10,
    type: "multiple-choice",
    category: "Diversification",
    question: "Why is diversification important in investing?",
    options: [
      { id: "a", text: "It guarantees you'll never lose money", isCorrect: false },
      { id: "b", text: "It spreads risk across different investments to reduce overall portfolio volatility", isCorrect: true },
      { id: "c", text: "It helps you pick only winning stocks", isCorrect: false },
      { id: "d", text: "It eliminates the need for research", isCorrect: false },
    ],
  },
  {
    id: 11,
    type: "decision",
    category: "Diversification",
    question: "You have $10,000 to invest. Which approach demonstrates proper diversification?",
    options: [
      { id: "a", text: "Put it all in your employer's stock - you know the company", isCorrect: false },
      { id: "b", text: "Split between a total stock market ETF, bond ETF, and international ETF", isCorrect: true },
      { id: "c", text: "Invest in 10 different tech stocks", isCorrect: false },
      { id: "d", text: "Keep it all in cash for safety", isCorrect: false },
    ],
    explanation: "True diversification means spreading across asset classes and geographies, not just multiple stocks in one sector.",
  },
  {
    id: 12,
    type: "multiple-choice",
    category: "Diversification",
    question: "What is an ETF (Exchange-Traded Fund)?",
    options: [
      { id: "a", text: "A type of savings account", isCorrect: false },
      { id: "b", text: "A fund that holds multiple investments and trades on an exchange like a stock", isCorrect: true },
      { id: "c", text: "A government bond", isCorrect: false },
      { id: "d", text: "A type of cryptocurrency", isCorrect: false },
    ],
  },
  // Inflation (Questions 13-14)
  {
    id: 13,
    type: "scenario",
    category: "Inflation",
    question: "If inflation averages 3% per year, what happens to $10,000 kept in a 0.5% savings account over 10 years?",
    options: [
      { id: "a", text: "It grows to over $11,000", isCorrect: false },
      { id: "b", text: "Its purchasing power decreases significantly despite the balance growing slightly", isCorrect: true },
      { id: "c", text: "It stays exactly the same in real value", isCorrect: false },
      { id: "d", text: "The bank protects it from inflation", isCorrect: false },
    ],
    explanation: "When inflation exceeds your interest rate, your money loses purchasing power over time.",
  },
  {
    id: 14,
    type: "multiple-choice",
    category: "Inflation",
    question: "Which type of investment has historically outpaced inflation over the long term?",
    options: [
      { id: "a", text: "Keeping cash under your mattress", isCorrect: false },
      { id: "b", text: "A diversified stock portfolio", isCorrect: true },
      { id: "c", text: "A standard savings account", isCorrect: false },
      { id: "d", text: "Buying lottery tickets", isCorrect: false },
    ],
  },
  // Market Cycles (Questions 15-16)
  {
    id: 15,
    type: "multiple-choice",
    category: "Market Cycles",
    question: "A 'bear market' is typically defined as:",
    options: [
      { id: "a", text: "A market that only goes up", isCorrect: false },
      { id: "b", text: "A decline of 20% or more from recent highs", isCorrect: true },
      { id: "c", text: "A market with lots of animal investors", isCorrect: false },
      { id: "d", text: "Any day the market goes down", isCorrect: false },
    ],
  },
  {
    id: 16,
    type: "decision",
    category: "Market Cycles",
    question: "During a market recession, a long-term investor with 30 years until retirement should:",
    options: [
      { id: "a", text: "Sell everything and wait for recovery", isCorrect: false },
      { id: "b", text: "Continue regular investing - buying at lower prices", isCorrect: true },
      { id: "c", text: "Stop investing until the economy improves", isCorrect: false },
      { id: "d", text: "Move everything to gold", isCorrect: false },
    ],
    explanation: "Dollar-cost averaging during downturns allows you to buy more shares at lower prices.",
  },
  // Advanced Concepts (Questions 17-20)
  {
    id: 17,
    type: "multiple-choice",
    category: "Advanced Investing",
    question: "What is a P/E (Price-to-Earnings) ratio?",
    options: [
      { id: "a", text: "The profit a company makes per employee", isCorrect: false },
      { id: "b", text: "A measure comparing a stock's price to its earnings per share", isCorrect: true },
      { id: "c", text: "The percentage return on investment", isCorrect: false },
      { id: "d", text: "The number of products a company sells", isCorrect: false },
    ],
  },
  {
    id: 18,
    type: "scenario",
    category: "Advanced Investing",
    question: "You're choosing between two index funds that track the same index. Fund A has a 0.03% expense ratio, Fund B has a 1.0% expense ratio. Over 30 years on a $100,000 investment with 7% returns, the difference is approximately:",
    options: [
      { id: "a", text: "About $100 - expense ratios don't matter much", isCorrect: false },
      { id: "b", text: "Over $100,000 - fees compound significantly over time", isCorrect: true },
      { id: "c", text: "Exactly $970 - just the fee difference times 1000", isCorrect: false },
      { id: "d", text: "Fund B probably performs better to justify the fee", isCorrect: false },
    ],
    explanation: "A 1% annual fee difference compounds dramatically over decades, potentially costing hundreds of thousands.",
  },
  {
    id: 19,
    type: "multiple-choice",
    category: "Advanced Investing",
    question: "What is dollar-cost averaging?",
    options: [
      { id: "a", text: "Only investing when the market is at its lowest", isCorrect: false },
      { id: "b", text: "Investing a fixed amount regularly regardless of market conditions", isCorrect: true },
      { id: "c", text: "Converting all investments to dollars", isCorrect: false },
      { id: "d", text: "A way to guarantee investment returns", isCorrect: false },
    ],
  },
  {
    id: 20,
    type: "decision",
    category: "Advanced Investing",
    question: "For tax-advantaged retirement investing in the US, which account type allows contributions to grow tax-free and be withdrawn tax-free in retirement?",
    options: [
      { id: "a", text: "Traditional IRA", isCorrect: false },
      { id: "b", text: "Roth IRA", isCorrect: true },
      { id: "c", text: "Regular brokerage account", isCorrect: false },
      { id: "d", text: "Savings account", isCorrect: false },
    ],
    explanation: "Roth IRAs are funded with after-tax dollars, but all growth and qualified withdrawals are tax-free.",
  },
];

interface PlacementQuizProps {
  onComplete: (score: number, placementLesson: number) => void;
  isRetake?: boolean;
}

export const PlacementQuiz = ({ onComplete, isRetake = false }: PlacementQuizProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<{ questionId: number; correct: boolean }[]>([]);
  const [quizComplete, setQuizComplete] = useState(false);
  const [started, setStarted] = useState(false);

  const question = quizQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

  const calculatePlacement = (finalScore: number): number => {
    // Score out of 20, placement from 1-25
    // Perfect score (20) = Lesson 25
    // Score mapping: each point roughly equals 1.25 lessons
    // 0 = Lesson 1, 20 = Lesson 25
    const placement = Math.max(1, Math.min(25, Math.ceil((finalScore / 20) * 24) + 1));
    return placement;
  };

  const handleAnswerSelect = (optionId: string) => {
    if (showExplanation) return;
    setSelectedAnswer(optionId);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer) return;

    const isCorrect = question.options.find(o => o.id === selectedAnswer)?.isCorrect || false;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
    
    setAnswers(prev => [...prev, { questionId: question.id, correct: isCorrect }]);
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setQuizComplete(true);
    }
  };

  const handleFinish = () => {
    const placement = calculatePlacement(score);
    onComplete(score, placement);
  };

  if (!started) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl w-full"
        >
          <Card className="p-8 bg-card/80 backdrop-blur-sm border-primary/20">
            <div className="text-center space-y-6">
              <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow">
                <Brain className="w-10 h-10 text-white" />
              </div>
              
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  {isRetake ? "Retake Placement Quiz" : "Investment Knowledge Quiz"}
                </h1>
                <p className="text-muted-foreground">
                  {isRetake 
                    ? "Improve your score to unlock more advanced lessons!"
                    : "Let's find the perfect starting point for your learning journey"
                  }
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-left">
                <div className="p-4 rounded-lg bg-muted/50">
                  <Target className="w-5 h-5 text-primary mb-2" />
                  <p className="font-semibold">20 Questions</p>
                  <p className="text-sm text-muted-foreground">Covering key investment topics</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <Trophy className="w-5 h-5 text-amber-500 mb-2" />
                  <p className="font-semibold">Earn Your Placement</p>
                  <p className="text-sm text-muted-foreground">Score 20/20 for Lesson 25</p>
                </div>
              </div>

              <div className="space-y-3 text-left p-4 rounded-lg bg-primary/5 border border-primary/10">
                <p className="font-semibold text-sm">Topics Covered:</p>
                <div className="flex flex-wrap gap-2">
                  {["Budgeting", "Risk Tolerance", "Compound Interest", "Diversification", "Inflation", "Market Cycles", "Advanced Investing"].map(topic => (
                    <Badge key={topic} variant="secondary" className="text-xs">
                      {topic}
                    </Badge>
                  ))}
                </div>
              </div>

              <Button 
                onClick={() => setStarted(true)} 
                size="lg" 
                className="w-full gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Start Quiz
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  if (quizComplete) {
    const placement = calculatePlacement(score);
    const percentage = (score / 20) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full"
        >
          <Card className="p-8 bg-card/80 backdrop-blur-sm border-primary/20">
            <div className="text-center space-y-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="w-24 h-24 mx-auto rounded-full bg-gradient-primary flex items-center justify-center shadow-glow"
              >
                <Trophy className="w-12 h-12 text-white" />
              </motion.div>

              <div>
                <h1 className="text-3xl font-bold mb-2">Quiz Complete!</h1>
                <p className="text-muted-foreground">Here's how you performed</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20">
                  <p className="text-4xl font-bold text-primary">{score}/20</p>
                  <p className="text-sm text-muted-foreground">Questions Correct</p>
                </div>
                <div className="p-6 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-500/5 border border-amber-500/20">
                  <p className="text-4xl font-bold text-amber-500">Lesson {placement}</p>
                  <p className="text-sm text-muted-foreground">Your Placement</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Score</span>
                  <span className="font-semibold">{percentage.toFixed(0)}%</span>
                </div>
                <Progress value={percentage} className="h-3" />
              </div>

              {score === 20 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20"
                >
                  <p className="font-semibold text-amber-500">🎉 Perfect Score!</p>
                  <p className="text-sm text-muted-foreground">You've been placed at the highest lesson level!</p>
                </motion.div>
              )}

              {placement < 25 && (
                <p className="text-sm text-muted-foreground">
                  <BookOpen className="w-4 h-4 inline mr-1" />
                  Lessons 1-{placement} are now unlocked. Complete them to unlock more!
                </p>
              )}

              <Button onClick={handleFinish} size="lg" className="w-full gap-2">
                Continue to Learning
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5 flex items-center justify-center p-6">
      <div className="max-w-3xl w-full">
        {/* Progress Header */}
        <div className="mb-6 space-y-2">
          <div className="flex justify-between items-center">
            <Badge variant="secondary">{question.category}</Badge>
            <span className="text-sm text-muted-foreground">
              Question {currentQuestion + 1} of {quizQuestions.length}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card className="p-6 bg-card/80 backdrop-blur-sm border-primary/20">
              {/* Question Type Badge */}
              <div className="flex items-center gap-2 mb-4">
                {question.type === "scenario" && (
                  <Badge className="bg-amber-500/20 text-amber-500 border-amber-500/30">
                    Scenario
                  </Badge>
                )}
                {question.type === "decision" && (
                  <Badge className="bg-emerald-500/20 text-emerald-500 border-emerald-500/30">
                    Decision
                  </Badge>
                )}
                {question.type === "multiple-choice" && (
                  <Badge className="bg-primary/20 text-primary border-primary/30">
                    Knowledge
                  </Badge>
                )}
              </div>

              {/* Question */}
              <h2 className="text-xl font-semibold mb-6">{question.question}</h2>

              {/* Options */}
              <div className="space-y-3">
                {question.options.map((option) => {
                  const isSelected = selectedAnswer === option.id;
                  const showResult = showExplanation;
                  const isCorrect = option.isCorrect;

                  let className = "w-full p-4 rounded-lg border text-left transition-all ";
                  
                  if (showResult) {
                    if (isCorrect) {
                      className += "bg-emerald-500/10 border-emerald-500 text-foreground";
                    } else if (isSelected && !isCorrect) {
                      className += "bg-destructive/10 border-destructive text-foreground";
                    } else {
                      className += "bg-muted/50 border-border text-muted-foreground";
                    }
                  } else if (isSelected) {
                    className += "bg-primary/10 border-primary text-foreground";
                  } else {
                    className += "bg-card hover:bg-muted/50 border-border hover:border-primary/50";
                  }

                  return (
                    <button
                      key={option.id}
                      onClick={() => handleAnswerSelect(option.id)}
                      disabled={showExplanation}
                      className={className}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-muted flex items-center justify-center font-semibold text-sm">
                          {option.id.toUpperCase()}
                        </span>
                        <span className="flex-1">{option.text}</span>
                        {showResult && isCorrect && (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        )}
                        {showResult && isSelected && !isCorrect && (
                          <XCircle className="w-5 h-5 text-destructive" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Explanation */}
              {showExplanation && question.explanation && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 rounded-lg bg-muted/50 border border-border"
                >
                  <p className="text-sm font-semibold mb-1">Explanation:</p>
                  <p className="text-sm text-muted-foreground">{question.explanation}</p>
                </motion.div>
              )}

              {/* Actions */}
              <div className="mt-6 flex justify-end gap-3">
                {!showExplanation ? (
                  <Button 
                    onClick={handleSubmitAnswer} 
                    disabled={!selectedAnswer}
                    className="gap-2"
                  >
                    Submit Answer
                  </Button>
                ) : (
                  <Button onClick={handleNextQuestion} className="gap-2">
                    {currentQuestion < quizQuestions.length - 1 ? (
                      <>
                        Next Question
                        <ArrowRight className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        See Results
                        <Trophy className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Score Tracker */}
        <div className="mt-4 flex justify-center gap-1">
          {answers.map((answer, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${
                answer.correct ? "bg-emerald-500" : "bg-destructive"
              }`}
            />
          ))}
          {Array.from({ length: quizQuestions.length - answers.length }).map((_, i) => (
            <div key={`empty-${i}`} className="w-2 h-2 rounded-full bg-muted" />
          ))}
        </div>
      </div>
    </div>
  );
};

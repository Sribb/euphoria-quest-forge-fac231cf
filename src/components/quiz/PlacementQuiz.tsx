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
  lessonTopic: string;
  question: string;
  options: { id: string; text: string; isCorrect: boolean }[];
  explanation?: string;
}

// Questions aligned with actual lesson topics (Lessons 1-25)
const quizQuestions: Question[] = [
  // Lesson 1: Introduction to Investing
  {
    id: 1,
    type: "multiple-choice",
    category: "Fundamentals",
    lessonTopic: "Introduction to Investing",
    question: "What is the primary purpose of investing rather than keeping money in a savings account?",
    options: [
      { id: "a", text: "To avoid paying taxes on your income", isCorrect: false },
      { id: "b", text: "To grow wealth over time by earning returns that outpace inflation", isCorrect: true },
      { id: "c", text: "To qualify for better credit card offers", isCorrect: false },
      { id: "d", text: "To receive government subsidies for investors", isCorrect: false },
    ],
    explanation: "Investing helps grow wealth by earning returns that typically exceed both savings account rates and inflation over the long term.",
  },
  // Lesson 2: Risk vs Reward
  {
    id: 2,
    type: "scenario",
    category: "Risk Management",
    lessonTopic: "Risk vs. Reward",
    question: "Investment A offers a guaranteed 4% annual return. Investment B has historically returned 10% annually but can fluctuate between -20% and +40% in any given year. For a 25-year retirement goal, which analysis is most accurate?",
    options: [
      { id: "a", text: "Investment A is always better because you never lose money", isCorrect: false },
      { id: "b", text: "Investment B likely builds more wealth over time despite short-term volatility", isCorrect: true },
      { id: "c", text: "Both will produce identical results over 25 years", isCorrect: false },
      { id: "d", text: "Investment B is only better if you can predict market timing", isCorrect: false },
    ],
    explanation: "With a long time horizon, higher-return investments can recover from short-term losses, typically building more wealth than low-return guaranteed options.",
  },
  // Lesson 3: Compound Interest
  {
    id: 3,
    type: "multiple-choice",
    category: "Wealth Building",
    lessonTopic: "Compound Interest",
    question: "Why is compound interest often called 'the eighth wonder of the world'?",
    options: [
      { id: "a", text: "It allows banks to charge higher fees over time", isCorrect: false },
      { id: "b", text: "Your earnings generate their own earnings, creating exponential growth", isCorrect: true },
      { id: "c", text: "It was invented by Einstein for complex physics equations", isCorrect: false },
      { id: "d", text: "It only works for people with very large initial investments", isCorrect: false },
    ],
    explanation: "Compound interest means you earn returns on both your original investment AND on previous returns, creating a snowball effect over time.",
  },
  // Lesson 4: Stocks vs Bonds
  {
    id: 4,
    type: "decision",
    category: "Asset Classes",
    lessonTopic: "Stocks vs. Bonds",
    question: "A 30-year-old with stable income is saving for retirement at 65. Their financial advisor suggests a portfolio of 80% stocks and 20% bonds. What is the reasoning behind this allocation?",
    options: [
      { id: "a", text: "Bonds always perform better than stocks over any time period", isCorrect: false },
      { id: "b", text: "With 35 years until retirement, stocks' higher long-term returns outweigh short-term volatility risks", isCorrect: true },
      { id: "c", text: "This ratio is legally required for retirement accounts", isCorrect: false },
      { id: "d", text: "Stocks are safer than bonds for all investors", isCorrect: false },
    ],
    explanation: "Younger investors can take more risk with stocks because they have time to recover from market downturns, while bonds add stability.",
  },
  // Lesson 5: Diversification
  {
    id: 5,
    type: "scenario",
    category: "Portfolio Strategy",
    lessonTopic: "Diversification",
    question: "An investor puts their entire $50,000 portfolio into a single tech company's stock because 'it always goes up.' What is the primary risk of this approach?",
    options: [
      { id: "a", text: "Tech stocks never pay dividends", isCorrect: false },
      { id: "b", text: "If that company fails or declines, they could lose most or all of their investment", isCorrect: true },
      { id: "c", text: "The government will tax concentrated positions more heavily", isCorrect: false },
      { id: "d", text: "They can only sell the stock once per year", isCorrect: false },
    ],
    explanation: "Concentration in a single stock means your entire portfolio's fate depends on one company. Diversification spreads this risk.",
  },
  // Lesson 6: Market Psychology
  {
    id: 6,
    type: "scenario",
    category: "Behavioral Finance",
    lessonTopic: "Market Psychology: Fear and Greed",
    question: "During a market crash, headlines scream 'Investors Flee Stocks!' and your portfolio is down 30%. You don't need this money for 20 years. What does behavioral finance suggest is the common mistake most investors make?",
    options: [
      { id: "a", text: "They ignore the news entirely and take on more debt", isCorrect: false },
      { id: "b", text: "They panic sell at the bottom, locking in losses and missing the recovery", isCorrect: true },
      { id: "c", text: "They immediately buy real estate instead", isCorrect: false },
      { id: "d", text: "They correctly time the market bottom and buy more", isCorrect: false },
    ],
    explanation: "Fear drives investors to sell at the worst time. Historically, markets recover, and those who sell during crashes often miss the rebound.",
  },
  // Lesson 7: Value Investing
  {
    id: 7,
    type: "multiple-choice",
    category: "Investment Styles",
    lessonTopic: "Value Investing",
    question: "Warren Buffett's value investing philosophy focuses on:",
    options: [
      { id: "a", text: "Buying stocks that have risen the most in the past month", isCorrect: false },
      { id: "b", text: "Finding companies trading below their intrinsic worth based on fundamentals", isCorrect: true },
      { id: "c", text: "Only investing in technology companies", isCorrect: false },
      { id: "d", text: "Timing the market by analyzing charts and patterns", isCorrect: false },
    ],
    explanation: "Value investors seek stocks priced below their true worth, buying 'a dollar for fifty cents' as Buffett describes.",
  },
  // Lesson 8: Fundamental Analysis
  {
    id: 8,
    type: "decision",
    category: "Analysis",
    lessonTopic: "Fundamental Analysis",
    question: "When evaluating a company's financial health, which combination of metrics would a fundamental analyst prioritize?",
    options: [
      { id: "a", text: "The company's logo design and social media follower count", isCorrect: false },
      { id: "b", text: "Revenue growth, profit margins, debt-to-equity ratio, and cash flow", isCorrect: true },
      { id: "c", text: "How many times the CEO appears on television", isCorrect: false },
      { id: "d", text: "The stock's trading volume and price momentum only", isCorrect: false },
    ],
    explanation: "Fundamental analysis examines a company's financial statements, profitability, debt levels, and cash generation to determine its true value.",
  },
  // Lesson 9: Economic Moats
  {
    id: 9,
    type: "multiple-choice",
    category: "Competitive Analysis",
    lessonTopic: "Economic Moats",
    question: "What is an 'economic moat' in investing terminology?",
    options: [
      { id: "a", text: "A physical barrier around a company's headquarters", isCorrect: false },
      { id: "b", text: "A sustainable competitive advantage that protects a company from competitors", isCorrect: true },
      { id: "c", text: "A type of municipal bond investment", isCorrect: false },
      { id: "d", text: "A government regulation that limits stock trading", isCorrect: false },
    ],
    explanation: "An economic moat (like strong brands, patents, or network effects) protects a company's profits from competition, like a castle's moat protects from invaders.",
  },
  // Lesson 10: Portfolio Management
  {
    id: 10,
    type: "scenario",
    category: "Portfolio Strategy",
    lessonTopic: "Portfolio Management",
    question: "Your portfolio has grown to 50% in one stock due to its price appreciation, while your target was 20%. What is the purpose of 'rebalancing'?",
    options: [
      { id: "a", text: "To always maximize returns by holding winners forever", isCorrect: false },
      { id: "b", text: "To restore your target allocation by selling some of the winner and buying underweighted assets", isCorrect: true },
      { id: "c", text: "To eliminate all stocks and move to cash", isCorrect: false },
      { id: "d", text: "Rebalancing is only necessary when a stock loses value", isCorrect: false },
    ],
    explanation: "Rebalancing maintains your desired risk level and forces a 'sell high, buy low' discipline by trimming winners and adding to underweighted positions.",
  },
  // Lesson 13: Technical Analysis
  {
    id: 11,
    type: "multiple-choice",
    category: "Technical Analysis",
    lessonTopic: "Technical Analysis Fundamentals",
    question: "Technical analysis primarily uses what type of data to make investment decisions?",
    options: [
      { id: "a", text: "Company earnings reports and balance sheets", isCorrect: false },
      { id: "b", text: "Historical price movements, volume, and chart patterns", isCorrect: true },
      { id: "c", text: "Economic reports and Federal Reserve statements only", isCorrect: false },
      { id: "d", text: "Interviews with company management", isCorrect: false },
    ],
    explanation: "Technical analysts study price charts, trading volume, and patterns to predict future price movements, regardless of fundamental factors.",
  },
  // Lesson 14: Investment Psychology
  {
    id: 12,
    type: "scenario",
    category: "Behavioral Finance",
    lessonTopic: "Investment Psychology",
    question: "You bought a stock at $100. It dropped to $60, but you refuse to sell because you 'haven't lost money until you sell.' This thinking demonstrates which cognitive bias?",
    options: [
      { id: "a", text: "Confirmation bias - seeking information that supports your view", isCorrect: false },
      { id: "b", text: "Loss aversion - the pain of losses feels stronger than equivalent gains", isCorrect: true },
      { id: "c", text: "Recency bias - overweighting recent events", isCorrect: false },
      { id: "d", text: "Optimism bias - believing good things will happen", isCorrect: false },
    ],
    explanation: "Loss aversion makes us hold losing positions too long, hoping to 'break even,' while the money could be better deployed elsewhere.",
  },
  // Lesson 15: Options Trading
  {
    id: 13,
    type: "multiple-choice",
    category: "Derivatives",
    lessonTopic: "Options Trading Fundamentals",
    question: "A 'call option' gives the buyer the right to:",
    options: [
      { id: "a", text: "Sell shares at a specific price before expiration", isCorrect: false },
      { id: "b", text: "Buy shares at a specific price before expiration", isCorrect: true },
      { id: "c", text: "Collect dividend payments from any stock", isCorrect: false },
      { id: "d", text: "Force a company to buy back its shares", isCorrect: false },
    ],
    explanation: "A call option gives you the right (not obligation) to purchase shares at the strike price, which is profitable if the stock rises above that price.",
  },
  // Lesson 16: ETFs and Index Funds
  {
    id: 14,
    type: "decision",
    category: "Investment Vehicles",
    lessonTopic: "ETFs and Index Funds",
    question: "An S&P 500 index fund offers exposure to 500 large US companies with an expense ratio of 0.03%. Why might this be preferable to picking individual stocks?",
    options: [
      { id: "a", text: "Index funds are guaranteed to never lose money", isCorrect: false },
      { id: "b", text: "Instant diversification, low costs, and studies show most active managers underperform indexes", isCorrect: true },
      { id: "c", text: "They pay higher dividends than any individual stock", isCorrect: false },
      { id: "d", text: "Index funds are only available to professional investors", isCorrect: false },
    ],
    explanation: "Index funds provide broad diversification at minimal cost, and historically, most actively managed funds fail to beat their benchmark index.",
  },
  // Lesson 17: Bonds and Fixed Income
  {
    id: 15,
    type: "multiple-choice",
    category: "Fixed Income",
    lessonTopic: "Bonds and Fixed Income",
    question: "When interest rates rise, what typically happens to existing bond prices?",
    options: [
      { id: "a", text: "Bond prices rise because higher rates are better for bondholders", isCorrect: false },
      { id: "b", text: "Bond prices fall because new bonds offer more attractive yields", isCorrect: true },
      { id: "c", text: "Bond prices stay exactly the same regardless of interest rates", isCorrect: false },
      { id: "d", text: "All bonds are automatically converted to higher-rate bonds", isCorrect: false },
    ],
    explanation: "Existing bonds with lower rates become less attractive when new bonds offer higher yields, so their prices must drop to be competitive.",
  },
  // Lesson 18: Market Cycles
  {
    id: 16,
    type: "multiple-choice",
    category: "Market Dynamics",
    lessonTopic: "Market Cycles and Timing",
    question: "A 'bear market' is typically defined as:",
    options: [
      { id: "a", text: "Any single day the market goes down", isCorrect: false },
      { id: "b", text: "A decline of 20% or more from recent highs", isCorrect: true },
      { id: "c", text: "When more people are buying than selling", isCorrect: false },
      { id: "d", text: "A market that only contains energy stocks", isCorrect: false },
    ],
    explanation: "A bear market represents a 20%+ decline, typically accompanied by widespread pessimism and economic concerns.",
  },
  // Lesson 20: Dividend Investing
  {
    id: 17,
    type: "scenario",
    category: "Income Investing",
    lessonTopic: "Dividend Investing",
    question: "A company has paid and increased its dividend every year for 25 years. It currently yields 3%. What is the main appeal for dividend growth investors?",
    options: [
      { id: "a", text: "The 3% yield is higher than any other investment can offer", isCorrect: false },
      { id: "b", text: "Growing dividends provide increasing income and often indicate company health", isCorrect: true },
      { id: "c", text: "Dividend stocks never decline in price", isCorrect: false },
      { id: "d", text: "Dividends are tax-free in all countries", isCorrect: false },
    ],
    explanation: "Dividend growth investors value the rising income stream and the discipline/stability that long dividend histories often represent.",
  },
  // Lesson 21: Technical Indicators
  {
    id: 18,
    type: "multiple-choice",
    category: "Technical Analysis",
    lessonTopic: "Technical Indicators",
    question: "The RSI (Relative Strength Index) measures what aspect of a stock?",
    options: [
      { id: "a", text: "The company's revenue relative to competitors", isCorrect: false },
      { id: "b", text: "Whether a stock may be overbought or oversold based on recent price movements", isCorrect: true },
      { id: "c", text: "The total market capitalization of a company", isCorrect: false },
      { id: "d", text: "How strong the company's management team is", isCorrect: false },
    ],
    explanation: "RSI ranges from 0-100, with readings above 70 suggesting overbought conditions and below 30 suggesting oversold conditions.",
  },
  // Lesson 23: Margin and Leverage
  {
    id: 19,
    type: "scenario",
    category: "Risk Management",
    lessonTopic: "Margin Trading and Leverage",
    question: "An investor uses 2:1 margin to buy $20,000 worth of stock with $10,000 of their own money. If the stock drops 25%, what is their actual loss percentage on their invested capital?",
    options: [
      { id: "a", text: "25% - the same as the stock's decline", isCorrect: false },
      { id: "b", text: "50% - leverage amplifies both gains and losses", isCorrect: true },
      { id: "c", text: "12.5% - margin protects against losses", isCorrect: false },
      { id: "d", text: "0% - you can only lose what you borrowed", isCorrect: false },
    ],
    explanation: "With 2:1 leverage, a 25% stock decline ($5,000 loss on $20,000) wipes out 50% of your $10,000 invested capital. Leverage amplifies risk.",
  },
  // Lesson 25: Short Selling
  {
    id: 20,
    type: "decision",
    category: "Advanced Strategies",
    lessonTopic: "Short Selling",
    question: "When you 'short sell' a stock, you profit when:",
    options: [
      { id: "a", text: "The stock price increases above your entry point", isCorrect: false },
      { id: "b", text: "The stock price decreases below your entry point", isCorrect: true },
      { id: "c", text: "The company pays a dividend", isCorrect: false },
      { id: "d", text: "You hold the stock for more than one year", isCorrect: false },
    ],
    explanation: "Short selling involves borrowing shares to sell them, hoping to buy them back cheaper later. You profit when the price falls.",
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
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleFinish = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    try {
      const placement = calculatePlacement(score);
      await onComplete(score, placement);
    } catch (error) {
      console.error("Error completing quiz:", error);
      setIsSubmitting(false);
    }
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
                  {["Fundamentals", "Risk & Return", "Compound Interest", "Diversification", "Market Psychology", "Technical Analysis", "Options", "Fixed Income"].map(topic => (
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
                  <p className="font-semibold text-amber-500">Perfect Score!</p>
                  <p className="text-sm text-muted-foreground">You've been placed at the highest lesson level!</p>
                </motion.div>
              )}

              {placement < 25 && (
                <p className="text-sm text-muted-foreground">
                  <BookOpen className="w-4 h-4 inline mr-1" />
                  Lessons 1-{placement} are now unlocked. Complete them to unlock more!
                </p>
              )}

              <Button 
                onClick={handleFinish} 
                size="lg" 
                className="w-full gap-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    Continue to Learning
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
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
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{question.category}</Badge>
              <span className="text-xs text-muted-foreground hidden sm:inline">
                {question.lessonTopic}
              </span>
            </div>
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

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Lock, 
  Unlock, 
  FileText, 
  Timer, 
  CheckCircle2, 
  XCircle,
  Key,
  AlertTriangle
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface RatioChallenge {
  id: number;
  ratioName: string;
  formula: string;
  companyData: {
    revenue: number;
    netIncome: number;
    totalAssets: number;
    totalLiabilities: number;
    equity: number;
    currentAssets: number;
    currentLiabilities: number;
    operatingIncome: number;
    interestExpense: number;
  };
  question: string;
  options: { text: string; value: number; isCorrect: boolean }[];
  hint: string;
}

const challenges: RatioChallenge[] = [
  {
    id: 1,
    ratioName: "Current Ratio",
    formula: "Current Assets ÷ Current Liabilities",
    companyData: {
      revenue: 500, netIncome: 50, totalAssets: 800, totalLiabilities: 300,
      equity: 500, currentAssets: 200, currentLiabilities: 100,
      operatingIncome: 80, interestExpense: 10
    },
    question: "What is the current ratio? A ratio above 1.0 means the company can cover short-term obligations.",
    options: [
      { text: "0.5", value: 0.5, isCorrect: false },
      { text: "1.5", value: 1.5, isCorrect: false },
      { text: "2.0", value: 2.0, isCorrect: true },
      { text: "3.0", value: 3.0, isCorrect: false },
    ],
    hint: "Divide current assets ($200M) by current liabilities ($100M)"
  },
  {
    id: 2,
    ratioName: "Debt-to-Equity Ratio",
    formula: "Total Liabilities ÷ Shareholders' Equity",
    companyData: {
      revenue: 600, netIncome: 60, totalAssets: 1000, totalLiabilities: 400,
      equity: 600, currentAssets: 250, currentLiabilities: 150,
      operatingIncome: 100, interestExpense: 20
    },
    question: "What is the debt-to-equity ratio? Lower is generally safer.",
    options: [
      { text: "0.33", value: 0.33, isCorrect: false },
      { text: "0.67", value: 0.67, isCorrect: true },
      { text: "1.5", value: 1.5, isCorrect: false },
      { text: "2.5", value: 2.5, isCorrect: false },
    ],
    hint: "Divide total liabilities ($400M) by equity ($600M)"
  },
  {
    id: 3,
    ratioName: "Net Profit Margin",
    formula: "(Net Income ÷ Revenue) × 100",
    companyData: {
      revenue: 800, netIncome: 80, totalAssets: 1200, totalLiabilities: 500,
      equity: 700, currentAssets: 300, currentLiabilities: 200,
      operatingIncome: 120, interestExpense: 25
    },
    question: "What is the net profit margin? This shows how much profit per dollar of revenue.",
    options: [
      { text: "5%", value: 5, isCorrect: false },
      { text: "10%", value: 10, isCorrect: true },
      { text: "15%", value: 15, isCorrect: false },
      { text: "20%", value: 20, isCorrect: false },
    ],
    hint: "Divide net income ($80M) by revenue ($800M), then multiply by 100"
  },
  {
    id: 4,
    ratioName: "Return on Equity (ROE)",
    formula: "(Net Income ÷ Equity) × 100",
    companyData: {
      revenue: 1000, netIncome: 100, totalAssets: 1500, totalLiabilities: 700,
      equity: 800, currentAssets: 400, currentLiabilities: 250,
      operatingIncome: 150, interestExpense: 30
    },
    question: "What is the return on equity? This measures profitability relative to shareholder investment.",
    options: [
      { text: "8.5%", value: 8.5, isCorrect: false },
      { text: "10%", value: 10, isCorrect: false },
      { text: "12.5%", value: 12.5, isCorrect: true },
      { text: "15%", value: 15, isCorrect: false },
    ],
    hint: "Divide net income ($100M) by equity ($800M), then multiply by 100"
  },
  {
    id: 5,
    ratioName: "Interest Coverage Ratio",
    formula: "Operating Income ÷ Interest Expense",
    companyData: {
      revenue: 900, netIncome: 72, totalAssets: 1100, totalLiabilities: 450,
      equity: 650, currentAssets: 280, currentLiabilities: 140,
      operatingIncome: 120, interestExpense: 30
    },
    question: "What is the interest coverage ratio? Above 2x means the company can comfortably pay interest.",
    options: [
      { text: "2.4x", value: 2.4, isCorrect: false },
      { text: "3.0x", value: 3.0, isCorrect: false },
      { text: "4.0x", value: 4.0, isCorrect: true },
      { text: "5.0x", value: 5.0, isCorrect: false },
    ],
    hint: "Divide operating income ($120M) by interest expense ($30M)"
  },
];

export const FinancialEscapeRoom = () => {
  const [currentRoom, setCurrentRoom] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [unlockedRooms, setUnlockedRooms] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [showHint, setShowHint] = useState(false);
  const [escaped, setEscaped] = useState(false);

  const challenge = challenges[currentRoom];
  const progress = (unlockedRooms.length / challenges.length) * 100;

  useEffect(() => {
    if (isTimerActive && timeLeft > 0 && !escaped) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResult) {
      handleTimeout();
    }
  }, [timeLeft, isTimerActive, escaped]);

  const handleTimeout = () => {
    setShowResult(true);
    setIsTimerActive(false);
    toast.error("Time's up! The door remains locked.");
  };

  const checkAnswer = (optionIndex: number) => {
    setSelectedAnswer(optionIndex);
    setShowResult(true);
    setIsTimerActive(false);

    const option = challenge.options[optionIndex];
    if (option.isCorrect) {
      setUnlockedRooms([...unlockedRooms, currentRoom]);
      toast.success("Correct! The door unlocks!");
      
      if (currentRoom === challenges.length - 1) {
        setEscaped(true);
        toast.success("🎉 You've escaped! All rooms unlocked!");
      }
    } else {
      toast.error("Wrong answer. The door stays locked.");
    }
  };

  const nextRoom = () => {
    if (currentRoom < challenges.length - 1) {
      setCurrentRoom(currentRoom + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setTimeLeft(60);
      setIsTimerActive(true);
      setShowHint(false);
    }
  };

  const retryRoom = () => {
    setSelectedAnswer(null);
    setShowResult(false);
    setTimeLeft(60);
    setIsTimerActive(true);
    setShowHint(false);
  };

  const isRoomUnlocked = unlockedRooms.includes(currentRoom);

  return (
    <Card className="p-6 space-y-6 bg-gradient-to-br from-background via-background to-primary/5 border-primary/20">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold mb-1 flex items-center gap-2">
            <Key className="w-5 h-5 text-primary" />
            Financial Statement Escape Room
          </h3>
          <p className="text-sm text-muted-foreground">
            Solve ratio analysis puzzles to unlock each room and escape!
          </p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2 text-sm">
            <Timer className={`w-4 h-4 ${timeLeft <= 10 ? 'text-destructive animate-pulse' : 'text-muted-foreground'}`} />
            <span className={`font-mono font-bold ${timeLeft <= 10 ? 'text-destructive' : ''}`}>
              {timeLeft}s
            </span>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Room {currentRoom + 1} of {challenges.length}</span>
          <span>{unlockedRooms.length} rooms unlocked</span>
        </div>
        <Progress value={progress} className="h-3" />
        <div className="flex justify-center gap-2 mt-2">
          {challenges.map((_, idx) => (
            <motion.div
              key={idx}
              initial={{ scale: 0.8 }}
              animate={{ 
                scale: unlockedRooms.includes(idx) ? 1.1 : 1,
                rotate: unlockedRooms.includes(idx) ? [0, -10, 10, 0] : 0
              }}
              className={`w-8 h-8 rounded-lg flex items-center justify-center border-2 transition-all ${
                unlockedRooms.includes(idx)
                  ? 'bg-success/20 border-success text-success'
                  : idx === currentRoom
                  ? 'bg-primary/20 border-primary text-primary'
                  : 'bg-muted/50 border-muted-foreground/30 text-muted-foreground'
              }`}
            >
              {unlockedRooms.includes(idx) ? (
                <Unlock className="w-4 h-4" />
              ) : (
                <Lock className="w-4 h-4" />
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {escaped ? (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center py-12 space-y-4"
        >
          <div className="text-6xl">🎉</div>
          <h3 className="text-2xl font-bold text-success">You Escaped!</h3>
          <p className="text-muted-foreground">
            Congratulations! You've mastered financial ratio analysis and escaped all {challenges.length} rooms!
          </p>
          <div className="flex justify-center gap-2">
            {challenges.map((c) => (
              <Badge key={c.id} variant="secondary" className="bg-success/20 text-success">
                {c.ratioName}
              </Badge>
            ))}
          </div>
        </motion.div>
      ) : (
        <>
          {/* Current Room Challenge */}
          <Card className="p-5 bg-muted/30 border-2 border-dashed border-primary/30">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="outline" className="text-xs">
                {challenge.ratioName}
              </Badge>
              <span className="text-xs text-muted-foreground">
                Formula: {challenge.formula}
              </span>
            </div>

            {/* Company Financial Data */}
            <div className="grid grid-cols-3 gap-3 mb-4 p-3 bg-background/50 rounded-lg">
              <div className="text-center">
                <div className="text-xs text-muted-foreground">Revenue</div>
                <div className="font-bold">${challenge.companyData.revenue}M</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-muted-foreground">Net Income</div>
                <div className="font-bold">${challenge.companyData.netIncome}M</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-muted-foreground">Total Assets</div>
                <div className="font-bold">${challenge.companyData.totalAssets}M</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-muted-foreground">Liabilities</div>
                <div className="font-bold">${challenge.companyData.totalLiabilities}M</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-muted-foreground">Equity</div>
                <div className="font-bold">${challenge.companyData.equity}M</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-muted-foreground">Current Assets</div>
                <div className="font-bold">${challenge.companyData.currentAssets}M</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-muted-foreground">Current Liab.</div>
                <div className="font-bold">${challenge.companyData.currentLiabilities}M</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-muted-foreground">Op. Income</div>
                <div className="font-bold">${challenge.companyData.operatingIncome}M</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-muted-foreground">Interest Exp.</div>
                <div className="font-bold">${challenge.companyData.interestExpense}M</div>
              </div>
            </div>

            <p className="text-sm font-medium mb-4">{challenge.question}</p>

            {!showResult && (
              <>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {challenge.options.map((option, idx) => (
                    <Button
                      key={idx}
                      onClick={() => checkAnswer(idx)}
                      variant="outline"
                      className="h-14 text-lg font-bold hover:bg-primary/10 hover:border-primary"
                    >
                      {option.text}
                    </Button>
                  ))}
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowHint(true)}
                  className="w-full text-xs"
                  disabled={showHint}
                >
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  {showHint ? challenge.hint : "Show Hint (-10 seconds)"}
                </Button>
                {showHint && setTimeLeft(prev => Math.max(0, prev - 10))}
              </>
            )}

            <AnimatePresence>
              {showResult && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  <div className={`p-4 rounded-lg ${
                    isRoomUnlocked
                      ? 'bg-success/10 border border-success/30'
                      : 'bg-destructive/10 border border-destructive/30'
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      {isRoomUnlocked ? (
                        <>
                          <Unlock className="w-5 h-5 text-success" />
                          <span className="font-bold text-success">Door Unlocked!</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-5 h-5 text-destructive" />
                          <span className="font-bold text-destructive">Door Locked</span>
                        </>
                      )}
                    </div>
                    <p className="text-sm">
                      <strong>Correct Answer:</strong>{" "}
                      {challenge.options.find(o => o.isCorrect)?.text}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{challenge.hint}</p>
                  </div>

                  <div className="flex gap-2">
                    {isRoomUnlocked && currentRoom < challenges.length - 1 && (
                      <Button onClick={nextRoom} className="flex-1">
                        Next Room →
                      </Button>
                    )}
                    {!isRoomUnlocked && (
                      <Button onClick={retryRoom} variant="outline" className="flex-1">
                        Try Again
                      </Button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </>
      )}
    </Card>
  );
};

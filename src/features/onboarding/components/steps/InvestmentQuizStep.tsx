import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const QUESTIONS: QuizQuestion[] = [
  {
    question: "What does 'diversification' mean in investing?",
    options: [
      "Putting all money into one high-performing stock",
      "Spreading investments across different assets to reduce risk",
      "Only investing in government bonds",
      "Timing the market to buy low and sell high",
    ],
    correctIndex: 1,
    explanation: "Diversification spreads risk across different asset types, sectors, and regions.",
  },
  {
    question: "If a stock has a P/E ratio of 25, what does that mean?",
    options: [
      "The stock costs $25 per share",
      "The company earns 25% profit annually",
      "Investors pay $25 for every $1 of earnings",
      "The stock price will increase by 25%",
    ],
    correctIndex: 2,
    explanation: "P/E ratio = Price per share ÷ Earnings per share. A P/E of 25 means you pay $25 for each $1 the company earns.",
  },
  {
    question: "What is compound interest?",
    options: [
      "Interest charged on late payments",
      "A fixed interest rate that never changes",
      "Interest earned on both the principal and accumulated interest",
      "The interest rate set by the Federal Reserve",
    ],
    correctIndex: 2,
    explanation: "Compound interest is earned on your original investment plus all previously earned interest — it's how money grows exponentially.",
  },
  {
    question: "What happens to bond prices when interest rates rise?",
    options: [
      "Bond prices increase",
      "Bond prices decrease",
      "Bond prices stay the same",
      "Only corporate bonds are affected",
    ],
    correctIndex: 1,
    explanation: "Bond prices and interest rates have an inverse relationship — when rates rise, existing bonds become less attractive, lowering their price.",
  },
  {
    question: "What is an index fund?",
    options: [
      "A savings account with a high interest rate",
      "A fund that tries to beat the market through active trading",
      "A fund that tracks a specific market index like the S&P 500",
      "A type of cryptocurrency",
    ],
    correctIndex: 2,
    explanation: "An index fund passively tracks a market index, providing broad market exposure with low fees.",
  },
];

interface Props {
  onComplete: (score: number) => void;
}

export const InvestmentQuizStep = ({ onComplete }: Props) => {
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [direction, setDirection] = useState(1);

  const q = QUESTIONS[currentQ];
  const isCorrect = selectedAnswer === q.correctIndex;
  const isLast = currentQ === QUESTIONS.length - 1;

  const handleSelect = (index: number) => {
    if (revealed) return;
    setSelectedAnswer(index);
    setRevealed(true);
    if (index === q.correctIndex) {
      setCorrectCount((c) => c + 1);
    }
  };

  const handleNext = () => {
    if (isLast) {
      const finalScore = correctCount + (isCorrect ? 0 : 0); // already counted
      onComplete(finalScore);
    } else {
      setDirection(1);
      setSelectedAnswer(null);
      setRevealed(false);
      setCurrentQ((c) => c + 1);
    }
  };

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">Investment Knowledge</h2>
          <span className="text-sm font-medium text-muted-foreground">
            {currentQ + 1} / {QUESTIONS.length}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          Let's see where you stand — answer these quick questions to personalize your starting point.
        </p>
        {/* Mini progress */}
        <div className="flex gap-1.5 pt-1">
          {QUESTIONS.map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-1.5 rounded-full flex-1 transition-all duration-300",
                i < currentQ
                  ? "bg-primary"
                  : i === currentQ
                    ? "bg-primary/60"
                    : "bg-muted/40"
              )}
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentQ}
          custom={direction}
          initial={{ x: 60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -60, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-4"
        >
          <p className="text-base font-semibold text-foreground leading-snug">{q.question}</p>

          <div className="space-y-2.5">
            {q.options.map((option, i) => {
              const isSelected = selectedAnswer === i;
              const isRight = i === q.correctIndex;

              return (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  disabled={revealed}
                  className={cn(
                    "w-full text-left px-4 py-3 rounded-xl border transition-all duration-200 text-sm font-medium cursor-pointer",
                    !revealed && "hover:bg-primary/5 hover:border-primary/30 border-border/30 bg-card/50",
                    revealed && isRight && "bg-emerald-500/10 border-emerald-500/40 text-emerald-700 dark:text-emerald-400",
                    revealed && isSelected && !isRight && "bg-destructive/10 border-destructive/40 text-destructive",
                    revealed && !isSelected && !isRight && "opacity-40 border-border/20",
                    !revealed && "text-foreground"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 border",
                      revealed && isRight
                        ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-600 dark:text-emerald-400"
                        : revealed && isSelected && !isRight
                          ? "bg-destructive/20 border-destructive/40 text-destructive"
                          : "bg-muted/30 border-border/30 text-muted-foreground"
                    )}>
                      {revealed && isRight ? <CheckCircle2 className="w-4 h-4" /> :
                       revealed && isSelected && !isRight ? <XCircle className="w-4 h-4" /> :
                       String.fromCharCode(65 + i)}
                    </span>
                    <span className="flex-1">{option}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          <AnimatePresence>
            {revealed && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className={cn(
                  "px-4 py-3 rounded-xl text-sm",
                  isCorrect
                    ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300"
                    : "bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300"
                )}
              >
                <span className="font-semibold">{isCorrect ? "Correct! " : "Not quite. "}</span>
                {q.explanation}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Next button */}
          {revealed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Button onClick={handleNext} className="w-full gap-2" size="lg">
                {isLast ? "See My Results" : "Next Question"}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

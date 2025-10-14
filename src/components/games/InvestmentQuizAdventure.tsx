import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { X, CheckCircle2, XCircle, Trophy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface InvestmentQuizAdventureProps {
  onClose: () => void;
}

const quizQuestions = [
  {
    scenario: "The Federal Reserve announces a 0.5% interest rate hike. Your portfolio is 70% bonds.",
    question: "What should you do?",
    options: [
      "Hold everything - rates don't affect bonds",
      "Sell bonds immediately - rising rates decrease bond values",
      "Buy more bonds - higher rates mean higher yields",
      "Switch entirely to stocks"
    ],
    correct: 1,
    explanation: "Rising interest rates cause existing bond prices to fall. Bonds with lower rates become less attractive compared to new bonds with higher rates.",
    portfolioImpact: -5
  },
  {
    scenario: "A company you own reports earnings 20% above estimates. Stock jumps 15% pre-market.",
    question: "What's your move?",
    options: [
      "Sell immediately to lock in gains",
      "Hold - strong earnings indicate more growth",
      "Buy more - momentum will continue",
      "Sell half to reduce risk"
    ],
    correct: 1,
    explanation: "Strong fundamentals suggest the company is undervalued. Short-term price jumps on good news often continue as more investors discover the value.",
    portfolioImpact: 8
  },
  {
    scenario: "Market crashes 10% on recession fears. Your diversified portfolio is down 7%.",
    question: "Your best defensive move?",
    options: [
      "Sell everything and go to cash",
      "Hold and rebalance toward quality dividend stocks",
      "Buy high-risk growth stocks at discount",
      "Move everything to gold"
    ],
    correct: 1,
    explanation: "Quality dividend stocks provide income during downturns and typically recover faster. Panic selling locks in losses, while rebalancing maintains your strategy.",
    portfolioImpact: 6
  },
  {
    scenario: "Inflation hits 6%. Your cash position is 30% of portfolio.",
    question: "Best inflation hedge?",
    options: [
      "Keep cash - it's safest",
      "Buy treasury bonds",
      "Invest in real estate and commodities",
      "Put everything in crypto"
    ],
    correct: 2,
    explanation: "Real assets like real estate and commodities typically appreciate with inflation. Cash loses purchasing power, and fixed-rate bonds suffer from rising rates.",
    portfolioImpact: 7
  },
  {
    scenario: "A 'hot tip' stock is up 300% in 3 months with no fundamental changes.",
    question: "What do you do?",
    options: [
      "Buy in - momentum is strong",
      "Wait and research fundamentals first",
      "Short it - bubble will burst",
      "Buy options for leverage"
    ],
    correct: 1,
    explanation: "Parabolic moves without fundamental support often end badly. Warren Buffett: 'Never invest in a business you cannot understand.'",
    portfolioImpact: -10
  }
];

export const InvestmentQuizAdventure = ({ onClose }: InvestmentQuizAdventureProps) => {
  const { user } = useAuth();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [portfolioValue, setPortfolioValue] = useState(10000);
  const [score, setScore] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);

  const question = quizQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

  const handleAnswer = (index: number) => {
    setSelectedAnswer(index);
    setShowResult(true);
    
    if (index === question.correct) {
      setScore(score + 1);
      setPortfolioValue(portfolioValue + (portfolioValue * question.portfolioImpact / 100));
    } else {
      setPortfolioValue(portfolioValue - (portfolioValue * Math.abs(question.portfolioImpact) / 100));
    }
  };

  const handleNext = async () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setGameComplete(true);
      
      // Award coins
      const coinsEarned = score * 20;
      const { data: profile } = await supabase
        .from("profiles")
        .select("coins")
        .eq("id", user?.id)
        .single();

      if (profile) {
        await supabase
          .from("profiles")
          .update({ coins: profile.coins + coinsEarned })
          .eq("id", user?.id);
        
        toast.success(`Quiz complete! Earned ${coinsEarned} coins`);
      }
    }
  };

  if (gameComplete) {
    return (
      <div className="fixed inset-0 bg-background/95 z-50 flex items-center justify-center p-6">
        <Card className="p-8 max-w-md w-full text-center">
          <Trophy className="w-16 h-16 text-primary mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Quiz Complete!</h2>
          <div className="space-y-3 mb-6">
            <p className="text-xl">Score: {score}/{quizQuestions.length}</p>
            <p className="text-lg">Final Portfolio Value: <span className="font-bold text-primary">${portfolioValue.toFixed(2)}</span></p>
            <p className="text-muted-foreground">Starting Value: $10,000</p>
            <p className={`text-2xl font-bold ${portfolioValue >= 10000 ? "text-success" : "text-destructive"}`}>
              {((portfolioValue - 10000) / 10000 * 100).toFixed(2)}% Return
            </p>
          </div>
          <Button onClick={onClose} className="w-full bg-gradient-primary">
            Close
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-background/95 z-50 overflow-y-auto">
      <div className="max-w-3xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Investment Quiz Adventure</h1>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-6 h-6" />
          </Button>
        </div>

        <div className="mb-6 space-y-3">
          <Progress value={progress} className="h-3" />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Question {currentQuestion + 1} of {quizQuestions.length}</span>
            <span>Portfolio: ${portfolioValue.toFixed(2)}</span>
          </div>
        </div>

        <Card className="p-6 mb-6 bg-gradient-hero border-0">
          <p className="text-sm text-muted-foreground mb-3">Market Scenario</p>
          <p className="text-lg mb-4">{question.scenario}</p>
          <p className="font-bold text-xl">{question.question}</p>
        </Card>

        <div className="space-y-3 mb-6">
          {question.options.map((option, index) => (
            <Button
              key={index}
              onClick={() => !showResult && handleAnswer(index)}
              disabled={showResult}
              variant={
                showResult
                  ? index === question.correct
                    ? "default"
                    : selectedAnswer === index
                    ? "destructive"
                    : "outline"
                  : "outline"
              }
              className="w-full justify-start text-left h-auto p-4"
            >
              <div className="flex items-start gap-3 w-full">
                <span className="font-bold">{String.fromCharCode(65 + index)}.</span>
                <span className="flex-1">{option}</span>
                {showResult && index === question.correct && (
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                )}
                {showResult && selectedAnswer === index && index !== question.correct && (
                  <XCircle className="w-5 h-5 flex-shrink-0" />
                )}
              </div>
            </Button>
          ))}
        </div>

        {showResult && (
          <Card className="p-6 mb-6">
            <h3 className="font-bold mb-2">Explanation</h3>
            <p className="text-muted-foreground mb-3">{question.explanation}</p>
            <div className={`p-3 rounded-lg ${selectedAnswer === question.correct ? "bg-success/20" : "bg-destructive/20"}`}>
              <p className="font-semibold">
                Portfolio Impact: {selectedAnswer === question.correct ? "+" : ""}{question.portfolioImpact}%
              </p>
            </div>
          </Card>
        )}

        {showResult && (
          <Button onClick={handleNext} className="w-full bg-gradient-primary py-6 text-lg">
            {currentQuestion < quizQuestions.length - 1 ? "Next Question" : "See Results"}
          </Button>
        )}
      </div>
    </div>
  );
};

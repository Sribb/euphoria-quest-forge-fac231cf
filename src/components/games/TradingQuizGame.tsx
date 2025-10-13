import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Progress } from "@/components/ui/progress";

interface TradingQuizGameProps {
  onClose: () => void;
}

const quizQuestions = [
  {
    question: "What does 'bull market' mean?",
    options: ["Market going up", "Market going down", "Stable market", "Closed market"],
    correct: 0,
  },
  {
    question: "What is diversification?",
    options: [
      "Buying only one stock",
      "Spreading investments across different assets",
      "Selling everything",
      "Day trading",
    ],
    correct: 1,
  },
  {
    question: "What is a dividend?",
    options: [
      "A company's profit paid to shareholders",
      "The stock price",
      "A market index",
      "A type of bond",
    ],
    correct: 0,
  },
  {
    question: "What does P/E ratio stand for?",
    options: ["Profit/Equity", "Price/Earnings", "Purchase/Exit", "Portfolio/Exchange"],
    correct: 1,
  },
  {
    question: "What is market capitalization?",
    options: [
      "Total value of a company's outstanding shares",
      "The highest stock price",
      "Daily trading volume",
      "Company's profit",
    ],
    correct: 0,
  },
];

export const TradingQuizGame = ({ onClose }: TradingQuizGameProps) => {
  const { user } = useAuth();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleAnswer = (index: number) => {
    if (showFeedback) return;

    setSelectedAnswer(index);
    setShowFeedback(true);

    const isCorrect = index === quizQuestions[currentQuestion].correct;
    if (isCorrect) {
      setScore(score + 20);
      toast.success("Correct! +20 points");
    } else {
      toast.error("Wrong answer!");
    }
  };

  const handleNext = async () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      await endGame();
    }
  };

  const endGame = async () => {
    const coins = Math.floor(score / 2);

    // Get current coins
    const { data: profile } = await supabase
      .from("profiles")
      .select("coins")
      .eq("id", user?.id)
      .single();

    const { error } = await supabase.from("game_sessions").insert({
      user_id: user?.id,
      game_id: "trading-quiz",
      score,
      coins_earned: coins,
      completed: true,
    });

    if (!error && profile) {
      await supabase.from("profiles").update({
        coins: profile.coins + coins,
      }).eq("id", user?.id);

      toast.success(`Quiz Complete! You earned ${coins} coins!`);
    }

    onClose();
  };

  const question = quizQuestions[currentQuestion];

  return (
    <div className="fixed inset-0 bg-background/95 z-50 overflow-y-auto">
      <div className="max-w-2xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Trading Knowledge Quiz</h1>
            <p className="text-muted-foreground">Test your investing knowledge!</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-6 h-6" />
          </Button>
        </div>

        <Card className="p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">
              Question {currentQuestion + 1}/{quizQuestions.length}
            </span>
            <span className="text-sm font-bold">Score: {score}</span>
          </div>
          <Progress value={((currentQuestion + 1) / quizQuestions.length) * 100} className="h-2" />
        </Card>

        <Card className="p-6 mb-6">
          <h2 className="text-2xl font-bold mb-6">{question.question}</h2>
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <Button
                key={index}
                variant={
                  showFeedback
                    ? index === question.correct
                      ? "default"
                      : selectedAnswer === index
                      ? "destructive"
                      : "outline"
                    : selectedAnswer === index
                    ? "secondary"
                    : "outline"
                }
                className="w-full justify-start text-left h-auto py-4"
                onClick={() => handleAnswer(index)}
                disabled={showFeedback}
              >
                <span className="flex-1">{option}</span>
                {showFeedback && index === question.correct && (
                  <CheckCircle2 className="w-5 h-5 ml-2" />
                )}
                {showFeedback && selectedAnswer === index && index !== question.correct && (
                  <XCircle className="w-5 h-5 ml-2" />
                )}
              </Button>
            ))}
          </div>
        </Card>

        {showFeedback && (
          <Button onClick={handleNext} className="w-full" size="lg">
            {currentQuestion < quizQuestions.length - 1 ? "Next Question" : "Finish Quiz"}
          </Button>
        )}
      </div>
    </div>
  );
};

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Brain, TrendingUp, Award } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface OnboardingProps {
  onComplete: () => void;
}

const quizQuestions = [
  {
    question: "What is diversification in investing?",
    options: [
      "Investing all your money in one stock",
      "Spreading investments across different assets to reduce risk",
      "Only investing in cryptocurrency",
      "Keeping all money in a savings account"
    ],
    correctAnswer: 1,
    difficulty: "beginner"
  },
  {
    question: "What does ROI stand for?",
    options: [
      "Rate of Interest",
      "Return on Investment",
      "Risk of Inflation",
      "Reserve of Income"
    ],
    correctAnswer: 1,
    difficulty: "beginner"
  },
  {
    question: "What is a bull market?",
    options: [
      "A market where prices are falling",
      "A market where trading is halted",
      "A market where prices are rising",
      "A market only for experienced traders"
    ],
    correctAnswer: 2,
    difficulty: "intermediate"
  },
  {
    question: "What is dollar-cost averaging?",
    options: [
      "Buying the same amount of stock at different prices over time",
      "Investing a fixed dollar amount regularly regardless of price",
      "Converting all investments to US dollars",
      "Averaging the cost of all your investments"
    ],
    correctAnswer: 1,
    difficulty: "intermediate"
  },
  {
    question: "What is a derivative in finance?",
    options: [
      "A new type of cryptocurrency",
      "A financial contract whose value depends on an underlying asset",
      "A foreign stock",
      "A type of savings account"
    ],
    correctAnswer: 1,
    difficulty: "advanced"
  },
  {
    question: "What does beta measure in portfolio management?",
    options: [
      "The total return of a stock",
      "The volatility of an asset relative to the market",
      "The dividend yield",
      "The company's profit margin"
    ],
    correctAnswer: 1,
    difficulty: "advanced"
  },
  {
    question: "What is the P/E ratio used for?",
    options: [
      "Measuring company debt",
      "Valuing a stock by comparing price to earnings",
      "Calculating dividend payments",
      "Determining market volatility"
    ],
    correctAnswer: 1,
    difficulty: "intermediate"
  },
  {
    question: "What is compound interest?",
    options: [
      "Interest paid only on the principal",
      "Interest paid on both principal and accumulated interest",
      "A type of bank fee",
      "Interest that decreases over time"
    ],
    correctAnswer: 1,
    difficulty: "beginner"
  }
];

const Onboarding = ({ onComplete }: OnboardingProps) => {
  const { user } = useAuth();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const saveOnboardingMutation = useMutation({
    mutationFn: async (data: { investmentLevel: string; quizScore: number }) => {
      const { error } = await supabase
        .from("user_onboarding")
        .insert({
          user_id: user?.id,
          investment_level: data.investmentLevel,
          quiz_score: data.quizScore,
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Profile setup complete!");
      onComplete();
    },
    onError: () => {
      toast.error("Failed to save profile");
    },
  });

  const handleNext = () => {
    if (selectedAnswer === null) return;
    
    const newAnswers = [...answers, selectedAnswer];
    setAnswers(newAnswers);
    setSelectedAnswer(null);

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate score and determine level
      const correctAnswers = newAnswers.filter(
        (answer, idx) => answer === quizQuestions[idx].correctAnswer
      ).length;
      
      const score = Math.round((correctAnswers / quizQuestions.length) * 100);
      
      let investmentLevel = "beginner";
      if (score >= 75) investmentLevel = "advanced";
      else if (score >= 50) investmentLevel = "intermediate";
      
      saveOnboardingMutation.mutate({ investmentLevel, quizScore: score });
    }
  };

  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;
  const question = quizQuestions[currentQuestion];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center mx-auto mb-4 shadow-glow">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Welcome to Euphoria!</h1>
          <p className="text-muted-foreground">
            Let's assess your investment knowledge to personalize your experience
          </p>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Question {currentQuestion + 1} of {quizQuestions.length}</span>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-bold mb-6">{question.question}</h2>
          
          <RadioGroup value={selectedAnswer?.toString()} onValueChange={(val) => setSelectedAnswer(parseInt(val))}>
            <div className="space-y-3">
              {question.options.map((option, idx) => (
                <div
                  key={idx}
                  className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer hover:border-primary ${
                    selectedAnswer === idx ? "border-primary bg-primary/5" : "border-border"
                  }`}
                  onClick={() => setSelectedAnswer(idx)}
                >
                  <RadioGroupItem value={idx.toString()} id={`option-${idx}`} />
                  <Label htmlFor={`option-${idx}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>

        <Button
          onClick={handleNext}
          disabled={selectedAnswer === null || saveOnboardingMutation.isPending}
          className="w-full"
          size="lg"
        >
          {currentQuestion < quizQuestions.length - 1 ? "Next Question" : "Complete Setup"}
        </Button>
      </Card>
    </div>
  );
};

export default Onboarding;

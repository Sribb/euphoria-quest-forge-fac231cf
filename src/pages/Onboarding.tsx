import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Brain, TrendingUp, Award, BookOpen } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface OnboardingProps {
  onComplete: () => void;
}

// Comprehensive placement quiz with difficulty levels
const quizQuestions = [
  // Beginner questions (1-4)
  {
    question: "What is diversification in investing?",
    options: [
      "Investing all your money in one stock",
      "Spreading investments across different assets to reduce risk",
      "Only investing in cryptocurrency",
      "Keeping all money in a savings account"
    ],
    correctAnswer: 1,
    difficulty: "beginner",
    weight: 1
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
    difficulty: "beginner",
    weight: 1
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
    difficulty: "beginner",
    weight: 1
  },
  {
    question: "What is a stock?",
    options: [
      "A loan to a company",
      "A share of ownership in a company",
      "A type of bond",
      "A savings account"
    ],
    correctAnswer: 1,
    difficulty: "beginner",
    weight: 1
  },
  // Intermediate questions (5-8)
  {
    question: "What is a bull market?",
    options: [
      "A market where prices are falling",
      "A market where trading is halted",
      "A market where prices are rising",
      "A market only for experienced traders"
    ],
    correctAnswer: 2,
    difficulty: "intermediate",
    weight: 2
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
    difficulty: "intermediate",
    weight: 2
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
    difficulty: "intermediate",
    weight: 2
  },
  {
    question: "What happens to bond prices when interest rates rise?",
    options: [
      "Bond prices rise",
      "Bond prices stay the same",
      "Bond prices fall",
      "Bonds become worthless"
    ],
    correctAnswer: 2,
    difficulty: "intermediate",
    weight: 2
  },
  // Advanced questions (9-12)
  {
    question: "What is a derivative in finance?",
    options: [
      "A new type of cryptocurrency",
      "A financial contract whose value depends on an underlying asset",
      "A foreign stock",
      "A type of savings account"
    ],
    correctAnswer: 1,
    difficulty: "advanced",
    weight: 3
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
    difficulty: "advanced",
    weight: 3
  },
  {
    question: "What is the purpose of a stop-loss order?",
    options: [
      "To guarantee profits",
      "To automatically sell when price falls to a set level",
      "To increase position size",
      "To buy more shares automatically"
    ],
    correctAnswer: 1,
    difficulty: "advanced",
    weight: 3
  },
  {
    question: "What is an economic moat in investing?",
    options: [
      "A company's headquarters building",
      "A sustainable competitive advantage that protects profits",
      "A type of insurance policy",
      "A government regulation"
    ],
    correctAnswer: 1,
    difficulty: "advanced",
    weight: 3
  }
];

// Calculate recommended starting lesson based on score
const getRecommendedLesson = (score: number, beginnerScore: number, intermediateScore: number, advancedScore: number) => {
  // Calculate weighted performance by difficulty
  const beginnerPct = beginnerScore / 4; // 4 beginner questions
  const intermediatePct = intermediateScore / 4; // 4 intermediate questions  
  const advancedPct = advancedScore / 4; // 4 advanced questions

  // Determine starting lesson based on performance
  if (advancedPct >= 0.75 && intermediatePct >= 0.75) {
    return { lesson: 25, level: "advanced", message: "You have strong investing knowledge! Start with advanced topics." };
  } else if (intermediatePct >= 0.75 && beginnerPct >= 0.75) {
    return { lesson: 13, level: "intermediate", message: "Good foundation! Start with intermediate concepts." };
  } else if (beginnerPct >= 0.5) {
    return { lesson: 5, level: "beginner-plus", message: "Solid basics! Start after the fundamentals." };
  } else {
    return { lesson: 1, level: "beginner", message: "Let's start from the beginning to build a strong foundation!" };
  }
};

const Onboarding = ({ onComplete }: OnboardingProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [placementResult, setPlacementResult] = useState<{
    lesson: number;
    level: string;
    message: string;
    score: number;
  } | null>(null);

  const saveOnboardingMutation = useMutation({
    mutationFn: async (data: { investmentLevel: string; quizScore: number; startingLesson: number }) => {
      const { error } = await supabase
        .from("user_onboarding")
        .insert({
          user_id: user?.id,
          investment_level: data.investmentLevel,
          quiz_score: data.quizScore,
          preferences: { starting_lesson: data.startingLesson }
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
      // Calculate detailed scores
      let beginnerScore = 0, intermediateScore = 0, advancedScore = 0;
      let totalWeightedScore = 0, maxWeightedScore = 0;
      
      newAnswers.forEach((answer, idx) => {
        const q = quizQuestions[idx];
        const isCorrect = answer === q.correctAnswer;
        maxWeightedScore += q.weight;
        
        if (isCorrect) {
          totalWeightedScore += q.weight;
          if (q.difficulty === 'beginner') beginnerScore++;
          else if (q.difficulty === 'intermediate') intermediateScore++;
          else advancedScore++;
        }
      });
      
      const score = Math.round((totalWeightedScore / maxWeightedScore) * 100);
      const placement = getRecommendedLesson(score, beginnerScore, intermediateScore, advancedScore);
      
      setPlacementResult({
        ...placement,
        score
      });
      setShowResults(true);
    }
  };

  const handleStartLearning = () => {
    if (!placementResult) return;
    
    const investmentLevel = placementResult.level === 'advanced' ? 'advanced' 
      : placementResult.level === 'intermediate' ? 'intermediate' 
      : 'beginner';
    
    saveOnboardingMutation.mutate({ 
      investmentLevel, 
      quizScore: placementResult.score,
      startingLesson: placementResult.lesson
    });
  };

  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;
  const question = quizQuestions[currentQuestion];

  // Show results screen
  if (showResults && placementResult) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full p-8 animate-fade-in">
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-full bg-gradient-primary flex items-center justify-center mx-auto mb-4 shadow-glow">
              <Award className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Assessment Complete!</h1>
            <p className="text-muted-foreground">
              Here's your personalized learning path
            </p>
          </div>

          <div className="space-y-6">
            <Card className="p-6 bg-primary/5 border-primary/20">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-semibold">Your Score</span>
                <span className="text-3xl font-bold text-primary">{placementResult.score}%</span>
              </div>
              <Progress value={placementResult.score} className="h-3" />
            </Card>

            <Card className="p-6 bg-muted/30">
              <div className="flex items-center gap-3 mb-3">
                <BookOpen className="w-6 h-6 text-primary" />
                <span className="text-lg font-semibold">Recommended Starting Point</span>
              </div>
              <p className="text-2xl font-bold mb-2">Lesson {placementResult.lesson}</p>
              <p className="text-muted-foreground">{placementResult.message}</p>
            </Card>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-muted/20 rounded-lg">
                <p className="text-2xl font-bold text-success">
                  {answers.filter((a, i) => quizQuestions[i].difficulty === 'beginner' && a === quizQuestions[i].correctAnswer).length}/4
                </p>
                <p className="text-xs text-muted-foreground">Beginner</p>
              </div>
              <div className="p-4 bg-muted/20 rounded-lg">
                <p className="text-2xl font-bold text-primary">
                  {answers.filter((a, i) => quizQuestions[i].difficulty === 'intermediate' && a === quizQuestions[i].correctAnswer).length}/4
                </p>
                <p className="text-xs text-muted-foreground">Intermediate</p>
              </div>
              <div className="p-4 bg-muted/20 rounded-lg">
                <p className="text-2xl font-bold text-purple-500">
                  {answers.filter((a, i) => quizQuestions[i].difficulty === 'advanced' && a === quizQuestions[i].correctAnswer).length}/4
                </p>
                <p className="text-xs text-muted-foreground">Advanced</p>
              </div>
            </div>
          </div>

          <Button
            onClick={handleStartLearning}
            disabled={saveOnboardingMutation.isPending}
            className="w-full mt-8 bg-gradient-primary"
            size="lg"
          >
            {saveOnboardingMutation.isPending ? "Setting up..." : "Start Learning Journey"}
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center mx-auto mb-4 shadow-glow">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Welcome to Euphoria!</h1>
          <p className="text-muted-foreground">
            Let's assess your investment knowledge to personalize your learning path
          </p>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Question {currentQuestion + 1} of {quizQuestions.length}</span>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between mt-1">
            <span className={`text-xs ${question.difficulty === 'beginner' ? 'text-success font-semibold' : 'text-muted-foreground'}`}>
              Beginner
            </span>
            <span className={`text-xs ${question.difficulty === 'intermediate' ? 'text-primary font-semibold' : 'text-muted-foreground'}`}>
              Intermediate
            </span>
            <span className={`text-xs ${question.difficulty === 'advanced' ? 'text-purple-500 font-semibold' : 'text-muted-foreground'}`}>
              Advanced
            </span>
          </div>
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
          {currentQuestion < quizQuestions.length - 1 ? "Next Question" : "See Results"}
        </Button>
      </Card>
    </div>
  );
};

export default Onboarding;

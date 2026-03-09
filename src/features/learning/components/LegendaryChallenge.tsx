import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Crown, Shield, X, CheckCircle2, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { playCorrect, playIncorrect, playReward } from "@/lib/soundEffects";
import { fireConfetti } from "@/lib/confetti";
import { useXPSystem } from "@/hooks/useXPSystem";

interface Question {
  question: string;
  options: string[];
  correctIndex: number;
  topicCategory: string;
  difficulty: "hard";
}

interface LegendaryChallengeProps {
  lessonId: string;
  lessonTitle: string;
  onComplete: (passed: boolean, score: number) => void;
  onClose: () => void;
}

export const LegendaryChallenge = ({
  lessonId,
  lessonTitle,
  onComplete,
  onClose,
}: LegendaryChallengeProps) => {
  const { user } = useAuth();
  const { addXP } = useXPSystem();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isFinished, setIsFinished] = useState(false);

  const MAX_WRONG = 2; // Fail after 2 wrong answers (no mercy)
  const REQUIRED_SCORE = 90; // Need 90% to pass

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.functions.invoke("generate-adaptive-questions", {
        body: {
          lessonId,
          difficulty: "hard",
          questionCount: 10,
          isLegendary: true,
        },
      });

      if (error) throw error;

      const parsed = data?.questions || data;
      if (Array.isArray(parsed) && parsed.length > 0) {
        setQuestions(parsed.map((q: any) => ({ ...q, difficulty: "hard" })));
      } else {
        // Fallback hard questions
        setQuestions(generateFallbackQuestions());
      }
    } catch (err) {
      console.error("Failed to load legendary questions:", err);
      setQuestions(generateFallbackQuestions());
    } finally {
      setIsLoading(false);
    }
  };

  const generateFallbackQuestions = (): Question[] => [
    {
      question: "Which advanced strategy best mitigates systematic risk in a diversified portfolio?",
      options: ["Sector rotation", "Dollar-cost averaging", "Hedging with derivatives", "Value averaging"],
      correctIndex: 2,
      topicCategory: "risk-management",
      difficulty: "hard",
    },
    {
      question: "In the Black-Scholes model, which Greek measures the rate of change in delta with respect to the underlying price?",
      options: ["Theta", "Vega", "Gamma", "Rho"],
      correctIndex: 2,
      topicCategory: "derivatives",
      difficulty: "hard",
    },
    {
      question: "What is the primary disadvantage of using WACC as a discount rate for project evaluation?",
      options: [
        "It ignores tax shields",
        "It assumes constant capital structure",
        "It overestimates risk for all projects",
        "It cannot be calculated for public companies",
      ],
      correctIndex: 1,
      topicCategory: "corporate-finance",
      difficulty: "hard",
    },
    {
      question: "In behavioral finance, what does the disposition effect describe?",
      options: [
        "Tendency to follow market trends",
        "Selling winners too early and holding losers too long",
        "Overweighting recent information",
        "Anchoring to purchase price only for gains",
      ],
      correctIndex: 1,
      topicCategory: "behavioral-finance",
      difficulty: "hard",
    },
    {
      question: "Which market microstructure concept explains the difference between bid and ask prices?",
      options: [
        "Market depth",
        "Order flow toxicity",
        "Bid-ask spread",
        "Price discovery latency",
      ],
      correctIndex: 2,
      topicCategory: "trading",
      difficulty: "hard",
    },
  ];

  const handleAnswer = (answerIndex: number) => {
    if (showResult) return;
    setSelectedAnswer(answerIndex);
    setShowResult(true);

    const isCorrect = answerIndex === questions[currentIndex].correctIndex;
    if (isCorrect) {
      playCorrect();
      setCorrectCount((c) => c + 1);
    } else {
      playIncorrect();
      setWrongCount((w) => w + 1);
    }
  };

  const handleNext = () => {
    const newWrongCount = wrongCount;

    // Check fail condition
    if (newWrongCount >= MAX_WRONG) {
      setIsFinished(true);
      const score = Math.round((correctCount / questions.length) * 100);
      onComplete(false, score);
      return;
    }

    if (currentIndex + 1 >= questions.length) {
      setIsFinished(true);
      const score = Math.round((correctCount / questions.length) * 100);
      const passed = score >= REQUIRED_SCORE;
      if (passed) {
        fireConfetti();
        playReward();
        saveLegendaryCompletion(score);
      }
      onComplete(passed, score);
      return;
    }

    setCurrentIndex((i) => i + 1);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const saveLegendaryCompletion = async (score: number) => {
    if (!user?.id) return;
    try {
      await supabase
        .from("user_lesson_progress")
        .update({
          legendary_completed: true,
          legendary_score: score,
          legendary_completed_at: new Date().toISOString(),
        } as any)
        .eq("user_id", user.id)
        .eq("lesson_id", lessonId);

      // Award bonus XP for legendary
      addXP(50);

      // Award coins
      await supabase.rpc("increment_coins", { user_id_param: user.id, amount: 250 });

      toast.success("🏆 Legendary mastery achieved! +250 coins & +50 XP!");
    } catch (err) {
      console.error("Failed to save legendary completion:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="space-y-4 text-center">
          <Crown className="w-12 h-12 text-amber-500 mx-auto animate-pulse" />
          <p className="text-muted-foreground font-semibold">Preparing Legendary Challenge...</p>
          <p className="text-xs text-muted-foreground">No hints. No mercy. Pure mastery.</p>
        </div>
      </div>
    );
  }

  if (isFinished) {
    const score = Math.round((correctCount / questions.length) * 100);
    const passed = score >= REQUIRED_SCORE;

    return (
      <div className="space-y-6 animate-fade-in">
        <Card
          className={cn(
            "p-8 text-center border-2",
            passed
              ? "bg-amber-500/10 border-amber-500/30"
              : "bg-destructive/10 border-destructive/30"
          )}
        >
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-4 bg-background">
            {passed ? (
              <Crown className="w-14 h-14 text-amber-500" />
            ) : (
              <Shield className="w-14 h-14 text-destructive" />
            )}
          </div>
          <h2 className="text-3xl font-black mb-2">
            {passed ? "LEGENDARY!" : "Not Yet Worthy"}
          </h2>
          <p className="text-lg text-muted-foreground mb-4">
            {passed
              ? "You've achieved Legendary mastery! This skill is now gold."
              : `You need ${REQUIRED_SCORE}% to earn Legendary status. You scored ${score}%.`}
          </p>
          <div className="text-5xl font-black text-primary mb-4">{score}%</div>
          {passed && (
            <div className="flex items-center justify-center gap-3">
              <Badge className="bg-amber-500/20 text-amber-500 border-amber-500/30 text-sm py-1 px-3">
                +250 Coins
              </Badge>
              <Badge className="bg-primary/20 text-primary border-primary/30 text-sm py-1 px-3">
                +50 XP
              </Badge>
            </div>
          )}
        </Card>

        <Button onClick={onClose} className="w-full h-12 text-base font-semibold">
          {passed ? "Return to Path" : "Try Again Later"}
        </Button>
      </div>
    );
  }

  const q = questions[currentIndex];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Crown className="w-6 h-6 text-amber-500" />
          <div>
            <h2 className="text-lg font-black text-amber-500">LEGENDARY CHALLENGE</h2>
            <p className="text-xs text-muted-foreground">{lessonTitle}</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Progress & Lives */}
      <div className="flex items-center gap-4">
        <Progress
          value={((currentIndex + 1) / questions.length) * 100}
          className="flex-1 h-3"
        />
        <div className="flex items-center gap-1">
          {Array.from({ length: MAX_WRONG }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "w-3 h-3 rounded-full transition-colors",
                i < wrongCount ? "bg-destructive" : "bg-amber-500"
              )}
            />
          ))}
        </div>
        <span className="text-sm font-bold text-muted-foreground">
          {currentIndex + 1}/{questions.length}
        </span>
      </div>

      {/* Warning banner */}
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg px-4 py-2 text-center">
        <p className="text-xs font-semibold text-amber-500">
          ⚠️ No hints • No explanations • {MAX_WRONG - wrongCount} mistakes remaining
        </p>
      </div>

      {/* Question */}
      <Card className="p-6 border-amber-500/20">
        <Badge className="mb-3 bg-amber-500/20 text-amber-500 border-amber-500/30">
          Hard
        </Badge>
        <h3 className="text-xl font-bold mb-6">{q.question}</h3>

        <div className="space-y-3">
          {q.options.map((option, i) => {
            const isSelected = selectedAnswer === i;
            const isCorrect = i === q.correctIndex;
            const showCorrectHighlight = showResult && isCorrect;
            const showWrongHighlight = showResult && isSelected && !isCorrect;

            return (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                disabled={showResult}
                className={cn(
                  "w-full text-left p-4 rounded-xl border-2 transition-all duration-200",
                  showCorrectHighlight
                    ? "border-emerald-500 bg-emerald-500/10"
                    : showWrongHighlight
                    ? "border-destructive bg-destructive/10"
                    : isSelected
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-amber-500/40 hover:bg-amber-500/5"
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{option}</span>
                  {showCorrectHighlight && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                  {showWrongHighlight && <XCircle className="w-5 h-5 text-destructive" />}
                </div>
              </button>
            );
          })}
        </div>
      </Card>

      {showResult && (
        <Button
          onClick={handleNext}
          className="w-full h-12 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold"
        >
          {currentIndex + 1 >= questions.length || wrongCount >= MAX_WRONG
            ? "See Results"
            : "Next Question"}
        </Button>
      )}
    </div>
  );
};

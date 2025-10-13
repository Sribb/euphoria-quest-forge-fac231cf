import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { X, ChevronRight, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { TradingViewChart } from "./TradingViewChart";
import { ChartInsight } from "./ChartInsight";

interface LessonViewerProps {
  lessonId: string;
  onClose: () => void;
}

interface LessonContent {
  section: string;
  content: string;
  quiz?: {
    question: string;
    options: string[];
    correctAnswer: number;
  };
}

export const LessonViewer = ({ lessonId, onClose }: LessonViewerProps) => {
  const { user } = useAuth();
  const [lesson, setLesson] = useState<any>(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [progress, setProgress] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [showQuizFeedback, setShowQuizFeedback] = useState(false);
  const [chartData, setChartData] = useState({ price: 0, change: 0 });

  useEffect(() => {
    loadLesson();
  }, [lessonId]);

  const loadLesson = async () => {
    const { data, error } = await supabase
      .from("lessons")
      .select("*")
      .eq("id", lessonId)
      .single();

    if (error) {
      toast.error("Failed to load lesson");
      return;
    }

    setLesson(data);
    loadProgress();
  };

  const loadProgress = async () => {
    const { data } = await supabase
      .from("user_lesson_progress")
      .select("progress")
      .eq("lesson_id", lessonId)
      .eq("user_id", user?.id)
      .single();

    if (data) {
      setProgress(data.progress);
      setCurrentSection(Math.floor((data.progress / 100) * sections.length));
    }
  };

  const sections: LessonContent[] = [
    {
      section: "Introduction",
      content: "Welcome to this lesson! Watch the live chart on the right to see real market movements. This interactive experience will help you understand market dynamics in real-time.",
    },
    {
      section: "Understanding Price Action",
      content: "Price action refers to the movement of a security's price over time. The chart shows candlesticks - green indicates price went up, red indicates it went down. Each candle represents a time period. Notice how the price moves in waves, not straight lines.",
      quiz: {
        question: "What does a green candlestick indicate?",
        options: ["Price went down", "Price went up", "No change", "Market closed"],
        correctAnswer: 1,
      },
    },
    {
      section: "Market Trends",
      content: "Trends are the general direction of price movement. An uptrend shows higher highs and higher lows. A downtrend shows lower highs and lower lows. Watch the chart - can you identify any trends forming?",
    },
    {
      section: "Support and Resistance",
      content: "Support is a price level where buyers tend to enter, preventing further decline. Resistance is where sellers tend to enter, preventing further rise. These levels are visible as areas where price bounces or breaks through on the chart.",
      quiz: {
        question: "What is a support level?",
        options: [
          "Where price tends to stop falling",
          "Where price tends to stop rising",
          "The highest price ever",
          "The opening price",
        ],
        correctAnswer: 0,
      },
    },
    {
      section: "Completion",
      content: "Congratulations! You've completed this lesson. You've learned how to read price action, identify trends, and understand support and resistance levels. Keep practicing by watching real charts!",
    },
  ];

  const handleNext = async () => {
    if (currentSection < sections.length - 1) {
      const newSection = currentSection + 1;
      setCurrentSection(newSection);
      const newProgress = Math.round(((newSection + 1) / sections.length) * 100);
      setProgress(newProgress);
      setQuizAnswer(null);
      setShowQuizFeedback(false);

      await updateProgress(newProgress);
    } else {
      await completeLesson();
    }
  };

  const updateProgress = async (newProgress: number) => {
    const { error } = await supabase.from("user_lesson_progress").upsert({
      user_id: user?.id,
      lesson_id: lessonId,
      progress: newProgress,
      completed: newProgress === 100,
      completed_at: newProgress === 100 ? new Date().toISOString() : null,
    });

    if (error) {
      console.error("Failed to update progress:", error);
    }
  };

  const completeLesson = async () => {
    await updateProgress(100);
    
    // Get current coins
    const { data: profile } = await supabase
      .from("profiles")
      .select("coins")
      .eq("id", user?.id)
      .single();

    if (profile) {
      const { error: coinsError } = await supabase
        .from("profiles")
        .update({ coins: profile.coins + 50 })
        .eq("id", user?.id);

      if (!coinsError) {
        toast.success("Lesson completed! +50 coins");
      }
    }

    onClose();
  };

  const handleQuizAnswer = (index: number) => {
    setQuizAnswer(index);
    setShowQuizFeedback(true);
  };

  const currentContent = sections[currentSection];

  if (!lesson) return null;

  return (
    <div className="fixed inset-0 bg-background/95 z-50 overflow-y-auto">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">{lesson.title}</h1>
            <p className="text-muted-foreground mt-1">{lesson.description}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-6 h-6" />
          </Button>
        </div>

        <Progress value={progress} className="mb-6 h-3" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">{currentContent.section}</h2>
            <p className="text-lg leading-relaxed mb-6">{currentContent.content}</p>

            {currentContent.quiz && (
              <div className="mt-6 space-y-4">
                <h3 className="font-semibold text-lg">{currentContent.quiz.question}</h3>
                <div className="space-y-2">
                  {currentContent.quiz.options.map((option, index) => (
                    <Button
                      key={index}
                      variant={
                        showQuizFeedback
                          ? index === currentContent.quiz!.correctAnswer
                            ? "default"
                            : quizAnswer === index
                            ? "destructive"
                            : "outline"
                          : quizAnswer === index
                          ? "secondary"
                          : "outline"
                      }
                      className="w-full justify-start"
                      onClick={() => handleQuizAnswer(index)}
                      disabled={showQuizFeedback}
                    >
                      {option}
                      {showQuizFeedback && index === currentContent.quiz!.correctAnswer && (
                        <CheckCircle2 className="w-4 h-4 ml-auto" />
                      )}
                    </Button>
                  ))}
                </div>
                {showQuizFeedback && (
                  <p className="text-sm mt-2">
                    {quizAnswer === currentContent.quiz.correctAnswer
                      ? "✓ Correct! Great job!"
                      : "✗ Not quite. The correct answer is highlighted."}
                  </p>
                )}
              </div>
            )}

            <div className="flex justify-between items-center mt-8">
              <span className="text-sm text-muted-foreground">
                Section {currentSection + 1} of {sections.length}
              </span>
              <Button
                onClick={handleNext}
                disabled={currentContent.quiz && !showQuizFeedback}
                className="bg-gradient-primary"
              >
                {currentSection === sections.length - 1 ? "Complete Lesson" : "Next"}
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </Card>

          <div className="space-y-4">
            <TradingViewChart onPriceUpdate={setChartData} />
            <ChartInsight chartData={chartData} lessonSection={currentContent.section} />
          </div>
        </div>
      </div>
    </div>
  );
};

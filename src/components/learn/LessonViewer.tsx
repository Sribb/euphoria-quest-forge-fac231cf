import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { X, ChevronRight, CheckCircle2, Trophy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { TradingViewChart } from "./TradingViewChart";
import { ChartInsight } from "./ChartInsight";
import { getLessonContent } from "./InteractiveLessonContent";

interface LessonViewerProps {
  lessonId: string;
  onClose: () => void;
}

interface LessonContent {
  title: string;
  content: string;
  quiz?: {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  };
  scenario?: {
    situation: string;
    choices: { text: string; outcome: string; isCorrect: boolean }[];
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

  const sections: LessonContent[] = lesson ? getLessonContent(lesson.order_index) : [];

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
            <h2 className="text-2xl font-bold mb-4">{currentContent.title}</h2>
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
                     ? index === currentContent.quiz.correctAnswer
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
                      {showQuizFeedback && index === currentContent.quiz.correctAnswer && (
                        <CheckCircle2 className="w-4 h-4 ml-auto" />
                      )}
                    </Button>
                  ))}
                </div>
                {showQuizFeedback && currentContent.quiz && (
                  <div className="mt-3 p-3 bg-muted rounded-lg">
                    <p className="text-sm font-semibold mb-1">
                      {quizAnswer === currentContent.quiz.correctAnswer
                        ? "✓ Correct! Excellent work!"
                        : "✗ Not quite right."}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {currentContent.quiz.explanation}
                    </p>
                  </div>
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
            <ChartInsight chartData={chartData} lessonSection={currentContent.title} />
          </div>
        </div>
      </div>
    </div>
  );
};

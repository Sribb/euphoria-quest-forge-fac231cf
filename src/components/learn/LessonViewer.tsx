import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { X, ChevronRight, CheckCircle2, Lightbulb } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { getLessonContent } from "./InteractiveLessonContent";
import { AILessonChatbot } from "./AILessonChatbot";
import { AIContextualHelp } from "./AIContextualHelp";
import { InteractiveLessonSimulation } from "./InteractiveLessonSimulation";
import { TradingViewChart } from "./TradingViewChart";

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
  const [showAdaptiveHelp, setShowAdaptiveHelp] = useState(false);
  const [adaptiveGuidance, setAdaptiveGuidance] = useState<string | null>(null);

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
    
    // Load progress after setting lesson
    const lessonSections = getLessonContent(data.order_index);
    const { data: progressData } = await supabase
      .from("user_lesson_progress")
      .select("progress, completed")
      .eq("lesson_id", lessonId)
      .eq("user_id", user?.id)
      .single();

    if (progressData && lessonSections.length > 0) {
      setProgress(progressData.progress);
      // Calculate current section based on completed sections
      const completedSections = Math.floor((progressData.progress / 100) * lessonSections.length);
      const currentSectionIndex = progressData.completed ? lessonSections.length - 1 : Math.min(completedSections, lessonSections.length - 1);
      setCurrentSection(currentSectionIndex);
    }
  };

  const sections: LessonContent[] = lesson ? getLessonContent(lesson.order_index) : [];

  const handleNext = async () => {
    if (currentSection < sections.length - 1) {
      const newSection = currentSection + 1;
      setCurrentSection(newSection);
      // Progress represents completed sections: if we're moving to section 1, we completed section 0, so 1/total sections
      const completedSections = currentSection + 1;
      const newProgress = Math.round((completedSections / sections.length) * 100);
      setProgress(newProgress);
      setQuizAnswer(null);
      setShowQuizFeedback(false);

      await updateProgress(newProgress, false);
    } else {
      await completeLesson();
    }
  };

  const updateProgress = async (newProgress: number, isCompleted: boolean = false) => {
    const { error } = await supabase.from("user_lesson_progress").upsert({
      user_id: user?.id,
      lesson_id: lessonId,
      progress: newProgress,
      completed: isCompleted || newProgress >= 100,
      completed_at: (isCompleted || newProgress >= 100) ? new Date().toISOString() : null,
    }, {
      onConflict: 'user_id,lesson_id'
    });

    if (error) {
      console.error("Failed to update progress:", error);
      toast.error("Failed to save progress");
    }
  };

  const completeLesson = async () => {
    await updateProgress(100, true);
    
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
        toast.success("🎉 Lesson completed! +50 coins");
      }
    }

    // Small delay to ensure DB update completes before closing
    setTimeout(() => onClose(), 500);
  };

  const handleQuizAnswer = (index: number) => {
    setQuizAnswer(index);
    setShowQuizFeedback(true);
  };

  const fetchAdaptiveGuidance = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("ai-lesson-assistant", {
        body: {
          action: "adaptive_guidance",
          lessonId,
        },
      });

      if (error) throw error;
      setAdaptiveGuidance(data.response);
      setShowAdaptiveHelp(true);
    } catch (error) {
      console.error("Adaptive guidance error:", error);
      toast.error("Failed to load AI guidance");
    }
  };

  const enhanceContentWithHelp = (content: string) => {
    const terms = [
      "diversification",
      "compound interest",
      "risk tolerance",
      "asset allocation",
      "volatility",
      "market capitalization",
      "dividend",
      "portfolio",
      "index fund",
      "ETF",
    ];

    let enhancedContent = content;
    terms.forEach((term) => {
      const regex = new RegExp(`\\b${term}\\b`, "gi");
      if (regex.test(enhancedContent)) {
        enhancedContent = enhancedContent.replace(
          regex,
          `<span data-term="${term}">$&</span>`
        );
      }
    });

    return enhancedContent;
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

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Adaptive AI Guidance */}
          {showAdaptiveHelp && adaptiveGuidance && (
            <Card className="p-4 bg-primary/5 border-primary/20 animate-fade-in">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold mb-2">AI Adaptive Guidance</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {adaptiveGuidance}
                  </p>
                </div>
              </div>
            </Card>
          )}

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">{currentContent.title}</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchAdaptiveGuidance}
                className="gap-2"
              >
                <Lightbulb className="w-4 h-4" />
                Get AI Tips
              </Button>
            </div>
            
            <div className="text-lg leading-relaxed mb-6">
              {currentContent.content.split(". ").map((sentence, idx) => {
                const terms = ["diversification", "compound interest", "risk tolerance", "asset allocation", "volatility"];
                let hasTerm = false;
                let termFound = "";
                
                terms.forEach(term => {
                  if (sentence.toLowerCase().includes(term.toLowerCase())) {
                    hasTerm = true;
                    termFound = term;
                  }
                });

                if (hasTerm) {
                  const parts = sentence.split(new RegExp(`(${termFound})`, 'gi'));
                  return (
                    <span key={idx}>
                      {parts.map((part, partIdx) => 
                        part.toLowerCase() === termFound.toLowerCase() ? (
                          <AIContextualHelp
                            key={partIdx}
                            term={part}
                            lessonId={lessonId}
                            lessonTitle={lesson.title}
                          >
                            {part}
                          </AIContextualHelp>
                        ) : (
                          part
                        )
                      )}
                      {idx < currentContent.content.split(". ").length - 1 ? ". " : ""}
                    </span>
                  );
                }
                
                return <span key={idx}>{sentence}{idx < currentContent.content.split(". ").length - 1 ? ". " : ""}</span>;
              })}
            </div>

            {/* Interactive Simulation for specific lessons */}
            {lesson.order_index >= 3 && lesson.order_index <= 6 && (
              <InteractiveLessonSimulation
                lessonId={lessonId}
                simulationType={
                  lesson.order_index === 3 ? "diversification" :
                  lesson.order_index === 4 ? "compound" :
                  lesson.order_index === 5 ? "risk" : "portfolio"
                }
                onComplete={(score) => {
                  toast.success(`Great work! Simulation score: ${score}/100`);
                }}
              />
            )}

            {/* Live Market Chart for technical lessons */}
            {lesson.order_index >= 7 && lesson.order_index <= 9 && (
              <div className="my-6">
                <TradingViewChart />
              </div>
            )}

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

          {/* AI Lesson Chatbot */}
          <AILessonChatbot
            lessonId={lessonId}
            lessonTitle={lesson.title}
            currentContent={currentContent.title}
            userProgress={progress}
          />
        </div>
      </div>
    </div>
  );
};

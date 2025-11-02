import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { X, ChevronRight, CheckCircle2, Trophy, Star, Award, Lightbulb, ArrowLeft } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { InteractiveLessonRouter } from "./InteractiveLessonRouter";

interface InteractiveLessonViewerProps {
  lessonId: string;
  onClose: () => void;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface LessonSection {
  title: string;
  content: string;
  keyTakeaway: string;
  quiz?: QuizQuestion;
  scenario?: {
    situation: string;
    choices: { text: string; outcome: string; isOptimal: boolean }[];
  };
}

export const InteractiveLessonViewer = ({ lessonId, onClose }: InteractiveLessonViewerProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState<any>(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [progress, setProgress] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [showQuizFeedback, setShowQuizFeedback] = useState(false);
  const [scenarioChoice, setScenarioChoice] = useState<number | null>(null);
  const [showScenarioOutcome, setShowScenarioOutcome] = useState(false);
  const [coinsEarned, setCoinsEarned] = useState(0);

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
    if (!user?.id) return;
    
    const { data } = await supabase
      .from("user_lesson_progress")
      .select("progress")
      .eq("lesson_id", lessonId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (data) {
      setProgress(data.progress);
      setCurrentSection(Math.floor((data.progress / 100) * getLessonSections().length));
    }
  };

  const getLessonSections = (): LessonSection[] => {
    if (!lesson) return [];
    
    const orderIndex = lesson.order_index;
    
    // Define comprehensive sections based on lesson order
    const allSections: { [key: number]: LessonSection[] } = {
      1: [ // Introduction to Investing
        {
          title: "What is Investing?",
          content: "Investing is the act of allocating resources, usually money, with the expectation of generating income or profit. Unlike saving, which focuses on preserving capital, investing aims to grow wealth over time through various financial instruments.",
          keyTakeaway: "Investing differs from saving—it's about growing wealth, not just preserving it.",
          quiz: {
            question: "What is the primary goal of investing compared to saving?",
            options: ["Preserving capital", "Growing wealth over time", "Avoiding risk", "Short-term gains"],
            correctAnswer: 1,
            explanation: "While saving focuses on preservation, investing aims to grow wealth through calculated risk-taking."
          }
        },
        {
          title: "The Power of Compound Interest",
          content: "Albert Einstein called compound interest 'the eighth wonder of the world.' It's the process where your investment earnings generate their own earnings. A $10,000 investment at 10% annually becomes $25,937 in 10 years, $67,275 in 20 years, and $174,494 in 30 years.",
          keyTakeaway: "Time in the market beats timing the market—start investing early!",
          scenario: {
            situation: "You have $10,000 to invest. Your friend says the market is 'too high' right now and you should wait for a crash. What do you do?",
            choices: [
              { text: "Wait for the perfect moment to invest", outcome: "You wait 5 years. The market rises 50%. You missed significant gains and lost compounding time.", isOptimal: false },
              { text: "Invest immediately and stay invested long-term", outcome: "You invest now. Even if the market dips short-term, your money compounds for decades. Warren Buffett approves!", isOptimal: true },
              { text: "Keep it in a savings account", outcome: "Your money earns 0.5% while inflation is 3%. You're actually losing purchasing power every year.", isOptimal: false }
            ]
          }
        },
        {
          title: "Building Your Financial Foundation",
          content: "Before investing, establish an emergency fund covering 3-6 months of expenses. Pay off high-interest debt. Then, start investing regularly through dollar-cost averaging—investing fixed amounts at regular intervals regardless of market conditions.",
          keyTakeaway: "Secure your foundation first: emergency fund → eliminate debt → invest consistently."
        }
      ],
      2: [ // Risk vs. Reward
        {
          title: "Understanding Investment Risk",
          content: "Risk is the possibility of losing some or all of your investment. Higher potential returns typically come with higher risk. The key is finding your personal risk tolerance—how much volatility can you handle emotionally and financially?",
          keyTakeaway: "Know your risk tolerance before investing—it's deeply personal.",
          quiz: {
            question: "What is the relationship between risk and potential return?",
            options: ["No relationship", "Higher risk = lower return", "Higher risk = higher potential return", "Risk doesn't matter"],
            correctAnswer: 2,
            explanation: "This is a fundamental principle of investing: higher potential returns come with higher risk."
          }
        },
        {
          title: "The Risk-Return Spectrum",
          content: "Investments fall on a spectrum: Savings accounts (low risk, low return) → Bonds (moderate risk, moderate return) → Stocks (higher risk, higher return) → Options/Crypto (very high risk, very high return). Most investors build portfolios across this spectrum.",
          keyTakeaway: "Diversify across the risk spectrum based on your age, goals, and tolerance.",
          scenario: {
            situation: "You're 25 years old with a stable job and 40 years until retirement. How should you allocate your portfolio?",
            choices: [
              { text: "100% bonds for safety", outcome: "Too conservative for your age. You miss decades of stock market growth. Ray Dalio would advise more aggression at 25.", isOptimal: false },
              { text: "80-90% stocks, 10-20% bonds", outcome: "Perfect! Your time horizon allows you to ride out volatility. Benjamin Graham would approve this aggressive but sensible allocation.", isOptimal: true },
              { text: "100% cryptocurrency", outcome: "Extremely risky. One market crash could wipe you out. Even aggressive investors like Peter Lynch diversify.", isOptimal: false }
            ]
          }
        },
        {
          title: "Managing Risk Through Time",
          content: "Time is your greatest ally in managing risk. Short-term market volatility becomes less relevant over decades. Historically, the S&P 500 has never had a negative 20-year period. Your investment horizon determines your optimal risk level.",
          keyTakeaway: "Longer time horizons allow for more aggressive (higher-return) investments."
        }
      ],
      // Add more lesson sections here...
    };

    return allSections[orderIndex] || [{
      title: "Lesson Content",
      content: lesson?.content || "",
      keyTakeaway: "Master these principles to become a successful investor."
    }];
  };

  const sections = getLessonSections();
  const currentContent = sections[currentSection];

  const handleNext = async () => {
    if (currentSection < sections.length - 1) {
      const newSection = currentSection + 1;
      setCurrentSection(newSection);
      const newProgress = Math.round(((newSection + 1) / sections.length) * 100);
      setProgress(newProgress);
      setQuizAnswer(null);
      setShowQuizFeedback(false);
      setScenarioChoice(null);
      setShowScenarioOutcome(false);

      await updateProgress(newProgress);
    } else {
      await completeLesson();
    }
  };

  const updateProgress = async (newProgress: number) => {
    if (!user?.id) return;
    
    const { error } = await supabase.from("user_lesson_progress").upsert({
      user_id: user.id,
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
    if (!user?.id) return;
    
    await updateProgress(100);
    
    // Award coins based on difficulty
    const coinReward = lesson?.difficulty === 'advanced' ? 100 : lesson?.difficulty === 'intermediate' ? 75 : 50;
    
    const { data: profile } = await supabase
      .from("profiles")
      .select("coins")
      .eq("id", user.id)
      .single();

    if (profile) {
      await supabase
        .from("profiles")
        .update({ coins: profile.coins + coinReward })
        .eq("id", user.id);

      setCoinsEarned(coinReward);
      toast.success(`🎉 Lesson completed! +${coinReward} coins`, {
        description: "You're one step closer to investment mastery!"
      });
    }

    // Unlock next lesson
    setTimeout(onClose, 2000);
  };

  const handleQuizAnswer = (index: number) => {
    setQuizAnswer(index);
    setShowQuizFeedback(true);
  };

  const handleScenarioChoice = (index: number) => {
    setScenarioChoice(index);
    setShowScenarioOutcome(true);
  };

  if (!lesson) return null;

  return (
    <div className="fixed inset-0 bg-background/95 z-50 overflow-y-auto">
      <div className="max-w-5xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6 animate-fade-in">
          <div className="flex items-center gap-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => navigate(-1)}
                    className="hover:bg-primary/10"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Go Back</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant={lesson.difficulty === 'advanced' ? 'destructive' : lesson.difficulty === 'intermediate' ? 'secondary' : 'default'}>
                  {lesson.difficulty}
                </Badge>
                <Badge variant="outline">{lesson.duration_minutes} min</Badge>
              </div>
              <h1 className="text-3xl font-bold">{lesson.title}</h1>
              <p className="text-muted-foreground mt-1">{lesson.description}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-6 h-6" />
          </Button>
        </div>

        <Progress value={progress} className="mb-6 h-3 animate-fade-in" style={{ animationDelay: "100ms" }} />

        {/* New AI-Interactive Lesson Components */}
        <div className="mb-6">
          <InteractiveLessonRouter lessonId={lesson.id} />
        </div>

        <Card className="p-8 animate-fade-in" style={{ animationDelay: "200ms" }}>
          <div className="flex items-center gap-2 mb-6">
            <Star className="w-5 h-5 text-primary" />
            <h2 className="text-2xl font-bold">{currentContent.title}</h2>
          </div>
          
          <div className="prose prose-lg max-w-none mb-6">
            <p className="text-lg leading-relaxed text-foreground">{currentContent.content}</p>
          </div>

          {/* Key Takeaway */}
          <div className="bg-primary/10 border-l-4 border-primary rounded-r-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold mb-1">Key Takeaway</h4>
                <p className="text-sm text-muted-foreground">{currentContent.keyTakeaway}</p>
              </div>
            </div>
          </div>

          {/* Interactive Quiz */}
          {currentContent.quiz && (
            <div className="mt-8 space-y-4 bg-muted/30 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-lg">Knowledge Check</h3>
              </div>
              <p className="font-medium mb-4">{currentContent.quiz.question}</p>
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
                    className="w-full justify-start text-left h-auto py-3 px-4"
                    onClick={() => handleQuizAnswer(index)}
                    disabled={showQuizFeedback}
                  >
                    <span className="font-semibold mr-2">{String.fromCharCode(65 + index)}.</span>
                    {option}
                    {showQuizFeedback && index === currentContent.quiz!.correctAnswer && (
                      <CheckCircle2 className="w-5 h-5 ml-auto flex-shrink-0" />
                    )}
                  </Button>
                ))}
              </div>
              {showQuizFeedback && (
                <div className={`p-4 rounded-lg ${quizAnswer === currentContent.quiz.correctAnswer ? 'bg-success/10 border border-success' : 'bg-destructive/10 border border-destructive'}`}>
                  <p className="font-semibold mb-1">
                    {quizAnswer === currentContent.quiz.correctAnswer ? '✓ Correct!' : '✗ Not quite.'}
                  </p>
                  <p className="text-sm">{currentContent.quiz.explanation}</p>
                </div>
              )}
            </div>
          )}

          {/* Interactive Scenario */}
          {currentContent.scenario && (
            <div className="mt-8 space-y-4 bg-gradient-to-br from-primary/5 to-success/5 rounded-lg p-6 border border-primary/20">
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-lg">Real-World Scenario</h3>
              </div>
              <p className="font-medium mb-4 text-foreground">{currentContent.scenario.situation}</p>
              <div className="space-y-3">
                {currentContent.scenario.choices.map((choice, index) => (
                  <div key={index}>
                    <Button
                      variant={scenarioChoice === index ? "default" : "outline"}
                      className="w-full justify-start text-left h-auto py-4 px-4"
                      onClick={() => handleScenarioChoice(index)}
                      disabled={showScenarioOutcome}
                    >
                      <span className="font-semibold mr-2">Option {index + 1}:</span>
                      {choice.text}
                      {showScenarioOutcome && choice.isOptimal && (
                        <Star className="w-5 h-5 ml-auto flex-shrink-0 text-success fill-success" />
                      )}
                    </Button>
                    {showScenarioOutcome && scenarioChoice === index && (
                      <div className={`mt-2 p-4 rounded-lg ${choice.isOptimal ? 'bg-success/10 border border-success' : 'bg-warning/10 border border-warning'}`}>
                        <p className="text-sm font-medium">{choice.outcome}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between items-center mt-8 pt-6 border-t">
            <span className="text-sm text-muted-foreground">
              Section {currentSection + 1} of {sections.length}
            </span>
            <Button
              onClick={handleNext}
              disabled={
                (currentContent.quiz && !showQuizFeedback) ||
                (currentContent.scenario && !showScenarioOutcome)
              }
              className="bg-gradient-primary shadow-glow"
              size="lg"
            >
              {currentSection === sections.length - 1 ? "Complete Lesson" : "Continue"}
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </Card>

        {coinsEarned > 0 && (
          <div className="mt-6 text-center animate-fade-in">
            <Badge className="bg-gradient-gold text-white text-lg px-6 py-2">
              🎉 +{coinsEarned} Coins Earned!
            </Badge>
          </div>
        )}
      </div>
    </div>
  );
};
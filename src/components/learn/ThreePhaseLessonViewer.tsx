import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { X, BookOpen, MessageCircle, Lightbulb, Trophy, LineChart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { getLessonContent } from "./InteractiveLessonContent";
import { AILessonChatbot } from "./AILessonChatbot";
import { AdaptiveLessonChallenge } from "./AdaptiveLessonChallenge";
import { LessonMasteryDashboard } from "./LessonMasteryDashboard";
import { InteractiveLessonSimulation } from "./InteractiveLessonSimulation";
import { TradingViewChart } from "./TradingViewChart";
import { InteractiveLessonRouter } from "./InteractiveLessonRouter";
import { Lesson1ReflectionSlide } from "./lessons/Lesson1ReflectionSlide";
import { Lesson1InsightSlide } from "./lessons/Lesson1InsightSlide";
import { Lesson2RiskRewardSlides } from "./lessons/Lesson2RiskRewardSlides";
import { Lesson3CompoundInterestSlides } from "./lessons/Lesson3CompoundInterestSlides";
import { Lesson4AssetMixSlides } from "./lessons/Lesson4AssetMixSlides";
import { Lesson5DiversificationSlides } from "./lessons/Lesson5DiversificationSlides";
import { Lesson6MarketPsychologySlides } from "./lessons/Lesson6MarketPsychologySlides";
import { Lesson7ValueInvestingSlides } from "./lessons/Lesson7ValueInvestingSlides";
import { Lesson8FinancialStatementsSlides } from "./lessons/Lesson8FinancialStatementsSlides";
import { Lesson9MoatBuilderSlides } from "./lessons/Lesson9MoatBuilderSlides";
import { Lesson10StressTestSlides } from "./lessons/Lesson10StressTestSlides";
import { Lesson11LifePathSlides } from "./lessons/Lesson11LifePathSlides";
import { Lesson12DecisionChecklistSlides } from "./lessons/Lesson12DecisionChecklistSlides";
import { Lesson13PatternRecognitionSlides } from "./lessons/Lesson13PatternRecognitionSlides";
import { Lesson14BiasDetectionSlides } from "./lessons/Lesson14BiasDetectionSlides";
import { Lesson15OptionsBasicsSlides } from "./lessons/Lesson15OptionsBasicsSlides";
import { Lesson16CostDragSlides } from "./lessons/Lesson16CostDragSlides";
import { Lesson17YieldCurveSlides } from "./lessons/Lesson17YieldCurveSlides";
import { Lesson18EconomicCyclesSlides } from "./lessons/Lesson18EconomicCyclesSlides";
import { Lesson19VolatilitySlides } from "./lessons/Lesson19VolatilitySlides";
import { Lesson20DividendIncomeSlides } from "./lessons/Lesson20DividendIncomeSlides";
import { Lesson21IndicatorSignalsSlides } from "./lessons/Lesson21IndicatorSignalsSlides";
import { Lesson22REITComparisonSlides } from "./lessons/Lesson22REITComparisonSlides";
import { Lesson23MarginRiskSlides } from "./lessons/Lesson23MarginRiskSlides";
import { Lesson24PortfolioConstraintsSlides } from "./lessons/Lesson24PortfolioConstraintsSlides";
import { Lesson25ShortSellingSlides } from "./lessons/Lesson25ShortSellingSlides";

interface ThreePhaseLessonViewerProps {
  lessonId: string;
  onClose: () => void;
}

// Lesson 1 uses special phases: experience → reflection → insight
// Lesson 2 uses its own 4-slide structure internally
type Phase = 'learn' | 'challenge' | 'feedback';
type Lesson1Phase = 'experience' | 'reflection' | 'insight';

export const ThreePhaseLessonViewer = ({ lessonId, onClose }: ThreePhaseLessonViewerProps) => {
  const { user } = useAuth();
  const [lesson, setLesson] = useState<any>(null);
  const [phase, setPhase] = useState<Phase>('learn');
  const [lesson1Phase, setLesson1Phase] = useState<Lesson1Phase>('experience');
  const [currentSection, setCurrentSection] = useState(0);
  const [learnProgress, setLearnProgress] = useState(0);
  
  // Challenge results
  const [challengeScore, setChallengeScore] = useState(0);
  const [challengePassed, setChallengePassed] = useState(false);
  const [weakAreas, setWeakAreas] = useState<string[]>([]);
  const [masteryLevel, setMasteryLevel] = useState('beginner');
  const [attempts, setAttempts] = useState(0);

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

    // Load user progress
    const { data: progressData } = await supabase
      .from("user_lesson_progress")
      .select("*")
      .eq("lesson_id", lessonId)
      .eq("user_id", user?.id)
      .single();

    if (progressData) {
      setLearnProgress(progressData.progress || 0);
      const weakAreasData = progressData.weak_areas;
      setWeakAreas(Array.isArray(weakAreasData) ? weakAreasData.filter((a): a is string => typeof a === 'string') : []);
      setMasteryLevel(typeof progressData.mastery_level === 'string' ? progressData.mastery_level : 'beginner');
      setAttempts(typeof progressData.quiz_attempts === 'number' ? progressData.quiz_attempts : 0);
      
      // If already completed, can start at challenge phase
      if (progressData.progress >= 100 && !progressData.completed) {
        setPhase('learn'); // Always start at learn, but allow quick skip
      }
    }
  };

  const sections = lesson ? getLessonContent(lesson.order_index) : [];

  const handleLearnNext = async () => {
    if (currentSection < sections.length - 1) {
      const newSection = currentSection + 1;
      setCurrentSection(newSection);
      const newProgress = Math.round(((newSection + 1) / sections.length) * 100);
      setLearnProgress(newProgress);
      
      await updateProgress(newProgress, false);
    } else {
      // Completed learning phase
      await updateProgress(100, false);
      setPhase('challenge');
      toast.success("Learning phase complete! Ready for the challenge?");
    }
  };

  const handleLearnBack = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const handleChallengeComplete = async (score: number, passed: boolean) => {
    setChallengeScore(score);
    setChallengePassed(passed);
    
    // Fetch updated progress data
    const { data: progressData } = await supabase
      .from("user_lesson_progress")
      .select("*")
      .eq("lesson_id", lessonId)
      .eq("user_id", user?.id)
      .single();

    if (progressData) {
      const weakAreasData = progressData.weak_areas;
      setWeakAreas(Array.isArray(weakAreasData) ? weakAreasData.filter((a): a is string => typeof a === 'string') : []);
      setMasteryLevel(typeof progressData.mastery_level === 'string' ? progressData.mastery_level : 'beginner');
      setAttempts(typeof progressData.quiz_attempts === 'number' ? progressData.quiz_attempts : 0);
    }

    setPhase('feedback');
  };

  const handleRetry = () => {
    setPhase('learn');
    setCurrentSection(0);
    toast.info("Review the material and try again!");
  };

  const handleContinue = () => {
    if (challengePassed) {
      onClose();
      toast.success("Lesson completed! Next lesson unlocked!");
    } else {
      setPhase('learn');
      setCurrentSection(0);
    }
  };

  const updateProgress = async (newProgress: number, isCompleted: boolean = false) => {
    const { error } = await supabase.from("user_lesson_progress").upsert({
      user_id: user?.id,
      lesson_id: lessonId,
      progress: newProgress,
      completed: isCompleted,
    }, {
      onConflict: 'user_id,lesson_id'
    });

    if (error) {
      console.error("Failed to update progress:", error);
    }
  };

  const currentContent = sections[currentSection];

  if (!lesson) return null;

  // Handle case where lesson content isn't available
  if (!sections.length || !currentContent) {
    return (
      <div className="fixed inset-0 bg-background/95 z-50 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">{lesson.title}</h1>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-6 h-6" />
            </Button>
          </div>
          <Card className="p-6 text-center">
            <p className="text-muted-foreground">Lesson content is being prepared. Please check back soon!</p>
            <Button className="mt-4" onClick={onClose}>Go Back</Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-background/95 z-50 overflow-y-auto">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">{lesson.title}</h1>
            <p className="text-muted-foreground mt-1">{lesson.description}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-6 h-6" />
          </Button>
        </div>

        {/* Phase Indicator - Different for Lesson 1, hidden for Lesson 2 (has internal nav) */}
        {lesson.order_index === 1 ? (
          <div className="flex items-center gap-4 mb-6">
            <PhaseTab 
              icon={<BookOpen className="w-4 h-4" />}
              label="Experience"
              active={lesson1Phase === 'experience'}
              completed={lesson1Phase !== 'experience'}
            />
            <div className="flex-1 h-px bg-border" />
            <PhaseTab 
              icon={<MessageCircle className="w-4 h-4" />}
              label="Reflection"
              active={lesson1Phase === 'reflection'}
              completed={lesson1Phase === 'insight'}
            />
            <div className="flex-1 h-px bg-border" />
            <PhaseTab 
              icon={<Lightbulb className="w-4 h-4" />}
              label="Insight"
              active={lesson1Phase === 'insight'}
              completed={false}
            />
          </div>
        ) : lesson.order_index >= 2 && lesson.order_index <= 25 ? (
          // Lessons 2-25 have internal slide navigation, no external phase tabs needed
          null
        ) : (
          <div className="flex items-center gap-4 mb-6">
            <PhaseTab 
              icon={<BookOpen className="w-4 h-4" />}
              label="Learn"
              active={phase === 'learn'}
              completed={learnProgress >= 100}
            />
            <div className="flex-1 h-px bg-border" />
            <PhaseTab 
              icon={<Trophy className="w-4 h-4" />}
              label="Challenge"
              active={phase === 'challenge'}
              completed={challengePassed}
            />
            <div className="flex-1 h-px bg-border" />
            <PhaseTab 
              icon={<LineChart className="w-4 h-4" />}
              label="Feedback"
              active={phase === 'feedback'}
              completed={false}
            />
          </div>
        )}

        {/* Content */}
        <div className="max-w-7xl mx-auto">
          {/* Special 3-phase flow for Lesson 1 */}
          {lesson.order_index === 1 ? (
            <>
              {/* Phase 1: Experience */}
              {lesson1Phase === 'experience' && (
                <div className="animate-fade-in">
                  <InteractiveLessonRouter lessonId="1" />
                  <div className="flex justify-center mt-8">
                    <Button
                      onClick={() => {
                        setLesson1Phase('reflection');
                      }}
                      className="bg-gradient-primary"
                      size="lg"
                    >
                      Continue to Reflection
                    </Button>
                  </div>
                </div>
              )}

              {/* Phase 2: Reflection (Animated) */}
              {lesson1Phase === 'reflection' && (
                <div className="animate-fade-in">
                  <Lesson1ReflectionSlide 
                    onComplete={() => setLesson1Phase('insight')} 
                  />
                </div>
              )}

              {/* Phase 3: Insight (Animated) */}
              {lesson1Phase === 'insight' && (
                <div className="animate-fade-in">
                  <Lesson1InsightSlide 
                    onComplete={() => {
                      updateProgress(100, true);
                      onClose();
                      toast.success("Lesson 1 complete!");
                    }} 
                  />
                </div>
              )}
            </>
          ) : lesson.order_index === 2 ? (
            // Special 4-slide flow for Lesson 2 (Risk vs Reward)
            <div className="animate-fade-in">
              <Lesson2RiskRewardSlides
                onComplete={() => {
                  updateProgress(100, true);
                  onClose();
                  toast.success("Lesson 2 complete! You understand risk vs reward.");
                }}
              />
            </div>
          ) : lesson.order_index === 3 ? (
            // Special 4-slide flow for Lesson 3 (Compound Interest)
            <div className="animate-fade-in">
              <Lesson3CompoundInterestSlides
                onComplete={() => {
                  updateProgress(100, true);
                  onClose();
                  toast.success("Lesson 3 complete! You understand compound interest.");
                }}
              />
            </div>
          ) : lesson.order_index === 4 ? (
            <div className="animate-fade-in">
              <Lesson4AssetMixSlides
                onComplete={() => {
                  updateProgress(100, true);
                  onClose();
                  toast.success("Lesson 4 complete! You understand asset allocation.");
                }}
              />
            </div>
          ) : lesson.order_index === 5 ? (
            <div className="animate-fade-in">
              <Lesson5DiversificationSlides
                onComplete={() => {
                  updateProgress(100, true);
                  onClose();
                  toast.success("Lesson 5 complete! You understand diversification.");
                }}
              />
            </div>
          ) : lesson.order_index === 6 ? (
            <div className="animate-fade-in">
              <Lesson6MarketPsychologySlides
                onComplete={() => {
                  updateProgress(100, true);
                  onClose();
                  toast.success("Lesson 6 complete! You understand market psychology.");
                }}
              />
            </div>
          ) : lesson.order_index === 7 ? (
            <div className="animate-fade-in">
              <Lesson7ValueInvestingSlides
                onComplete={() => {
                  updateProgress(100, true);
                  onClose();
                  toast.success("Lesson 7 complete! You understand value investing.");
                }}
              />
            </div>
          ) : lesson.order_index === 8 ? (
            <div className="animate-fade-in">
              <Lesson8FinancialStatementsSlides
                onComplete={() => {
                  updateProgress(100, true);
                  onClose();
                  toast.success("Lesson 8 complete! You can analyze financial statements.");
                }}
              />
            </div>
          ) : lesson.order_index === 9 ? (
            <div className="animate-fade-in">
              <Lesson9MoatBuilderSlides
                onComplete={() => {
                  updateProgress(100, true);
                  onClose();
                  toast.success("Lesson 9 complete! You understand competitive moats.");
                }}
              />
            </div>
          ) : lesson.order_index === 10 ? (
            <div className="animate-fade-in">
              <Lesson10StressTestSlides
                onComplete={() => {
                  updateProgress(100, true);
                  onClose();
                  toast.success("Lesson 10 complete! You can stress test portfolios.");
                }}
              />
            </div>
          ) : lesson.order_index === 11 ? (
            <div className="animate-fade-in">
              <Lesson11LifePathSlides
                onComplete={() => {
                  updateProgress(100, true);
                  onClose();
                  toast.success("Lesson 11 complete! You understand life path planning.");
                }}
              />
            </div>
          ) : lesson.order_index === 12 ? (
            <div className="animate-fade-in">
              <Lesson12DecisionChecklistSlides
                onComplete={() => {
                  updateProgress(100, true);
                  onClose();
                  toast.success("Lesson 12 complete! You've mastered decision checklists.");
                }}
              />
            </div>
          ) : lesson.order_index === 13 ? (
            <div className="animate-fade-in">
              <Lesson13PatternRecognitionSlides
                onComplete={() => {
                  updateProgress(100, true);
                  onClose();
                  toast.success("Lesson 13 complete! You can recognize chart patterns.");
                }}
              />
            </div>
          ) : lesson.order_index === 14 ? (
            <div className="animate-fade-in">
              <Lesson14BiasDetectionSlides
                onComplete={() => {
                  updateProgress(100, true);
                  onClose();
                  toast.success("Lesson 14 complete! You can detect cognitive biases.");
                }}
              />
            </div>
          ) : lesson.order_index === 15 ? (
            <div className="animate-fade-in">
              <Lesson15OptionsBasicsSlides
                onComplete={() => {
                  updateProgress(100, true);
                  onClose();
                  toast.success("Lesson 15 complete! You understand options basics.");
                }}
              />
            </div>
          ) : lesson.order_index === 16 ? (
            <div className="animate-fade-in">
              <Lesson16CostDragSlides
                onComplete={() => {
                  updateProgress(100, true);
                  onClose();
                  toast.success("Lesson 16 complete! You understand cost drag impact.");
                }}
              />
            </div>
          ) : lesson.order_index === 17 ? (
            <div className="animate-fade-in">
              <Lesson17YieldCurveSlides
                onComplete={() => {
                  updateProgress(100, true);
                  onClose();
                  toast.success("Lesson 17 complete! You understand yield curves.");
                }}
              />
            </div>
          ) : lesson.order_index === 18 ? (
            <div className="animate-fade-in">
              <Lesson18EconomicCyclesSlides
                onComplete={() => {
                  updateProgress(100, true);
                  onClose();
                  toast.success("Lesson 18 complete! You understand economic cycles.");
                }}
              />
            </div>
          ) : lesson.order_index === 19 ? (
            <div className="animate-fade-in">
              <Lesson19VolatilitySlides
                onComplete={() => {
                  updateProgress(100, true);
                  onClose();
                  toast.success("Lesson 19 complete! You understand volatility management.");
                }}
              />
            </div>
          ) : lesson.order_index === 20 ? (
            <div className="animate-fade-in">
              <Lesson20DividendIncomeSlides
                onComplete={() => {
                  updateProgress(100, true);
                  onClose();
                  toast.success("Lesson 20 complete! You understand dividend income.");
                }}
              />
            </div>
          ) : lesson.order_index === 21 ? (
            <div className="animate-fade-in">
              <Lesson21IndicatorSignalsSlides
                onComplete={() => {
                  updateProgress(100, true);
                  onClose();
                  toast.success("Lesson 21 complete! You understand technical indicators.");
                }}
              />
            </div>
          ) : lesson.order_index === 22 ? (
            <div className="animate-fade-in">
              <Lesson22REITComparisonSlides
                onComplete={() => {
                  updateProgress(100, true);
                  onClose();
                  toast.success("Lesson 22 complete! You understand REIT investing.");
                }}
              />
            </div>
          ) : lesson.order_index === 23 ? (
            <div className="animate-fade-in">
              <Lesson23MarginRiskSlides
                onComplete={() => {
                  updateProgress(100, true);
                  onClose();
                  toast.success("Lesson 23 complete! You understand margin risk.");
                }}
              />
            </div>
          ) : lesson.order_index === 24 ? (
            <div className="animate-fade-in">
              <Lesson24PortfolioConstraintsSlides
                onComplete={() => {
                  updateProgress(100, true);
                  onClose();
                  toast.success("Lesson 24 complete! You understand portfolio constraints.");
                }}
              />
            </div>
          ) : lesson.order_index === 25 ? (
            <div className="animate-fade-in">
              <Lesson25ShortSellingSlides
                onComplete={() => {
                  updateProgress(100, true);
                  onClose();
                  toast.success("Lesson 25 complete! You understand short selling.");
                }}
              />
            </div>
          ) : (
            <>
              {/* Normal flow for other lessons */}
              {phase === 'learn' && (
                <div className="space-y-6 animate-fade-in">
                  <Progress value={(currentSection + 1) / sections.length * 100} className="mb-6 h-3" />
                  
                  <Card className="p-6">
                    <div className="mb-4">
                      <Badge variant="secondary" className="mb-2">
                        Section {currentSection + 1} of {sections.length}
                      </Badge>
                      <h2 className="text-2xl font-bold">{currentContent.title}</h2>
                    </div>

                    <div className="text-lg leading-relaxed mb-6">
                      {currentContent.content}
                    </div>

                    {/* Interactive elements */}
                    {lesson.order_index >= 3 && lesson.order_index <= 6 && (
                      <InteractiveLessonSimulation
                        lessonId={lessonId}
                        simulationType={
                          lesson.order_index === 3 ? "diversification" :
                          lesson.order_index === 4 ? "compound" :
                          lesson.order_index === 5 ? "risk" : "portfolio"
                        }
                        onComplete={(score) => {
                          toast.success(`Simulation complete! Score: ${score}/100`);
                        }}
                      />
                    )}

                    {lesson.order_index >= 7 && lesson.order_index <= 9 && (
                      <div className="my-6">
                        <TradingViewChart />
                      </div>
                    )}

                    <div className="flex justify-between items-center mt-8 pt-4 border-t">
                      <Button 
                        variant="outline" 
                        onClick={handleLearnBack}
                        disabled={currentSection === 0}
                      >
                        Previous
                      </Button>
                      <Button
                        onClick={handleLearnNext}
                        className="bg-gradient-primary"
                      >
                        {currentSection === sections.length - 1 ? "Start Challenge" : "Next"}
                      </Button>
                    </div>
                  </Card>

                  <AILessonChatbot
                    lessonId={lessonId}
                    lessonTitle={lesson.title}
                    currentContent={currentContent.title}
                    userProgress={learnProgress}
                  />
                </div>
              )}

              {phase === 'challenge' && (
                <AdaptiveLessonChallenge
                  lessonId={lessonId}
                  onComplete={handleChallengeComplete}
                  onBack={() => setPhase('learn')}
                />
              )}

              {phase === 'feedback' && (
                <LessonMasteryDashboard
                  score={challengeScore}
                  passed={challengePassed}
                  weakAreas={weakAreas}
                  masteryLevel={masteryLevel}
                  attempts={attempts}
                  onRetry={handleRetry}
                  onContinue={handleContinue}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper component for phase tabs
const PhaseTab = ({ icon, label, active, completed }: any) => (
  <div className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
    active ? 'bg-primary text-primary-foreground' :
    completed ? 'bg-success/20 text-success' :
    'bg-muted text-muted-foreground'
  }`}>
    {icon}
    <span className="font-semibold text-sm">{label}</span>
  </div>
);
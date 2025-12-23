import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { X, BookOpen, Trophy, LineChart } from "lucide-react";
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

interface ThreePhaseLessonViewerProps {
  lessonId: string;
  onClose: () => void;
}

type Phase = 'learn' | 'challenge' | 'feedback';

export const ThreePhaseLessonViewer = ({ lessonId, onClose }: ThreePhaseLessonViewerProps) => {
  const { user } = useAuth();
  const [lesson, setLesson] = useState<any>(null);
  const [phase, setPhase] = useState<Phase>('learn');
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

        {/* Phase Indicator */}
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

        {/* Content */}
        <div className="max-w-7xl mx-auto">
          {phase === 'learn' && (
            <>
              {/* Simulation-first approach for Lesson 1 */}
              {lesson.order_index === 1 ? (
                <div className="animate-fade-in">
                  <InteractiveLessonRouter lessonId="1" />
                  <div className="flex justify-center mt-8">
                    <Button
                      onClick={() => {
                        updateProgress(100, false);
                        setPhase('challenge');
                        toast.success("Lab complete! Ready for the challenge?");
                      }}
                      className="bg-gradient-primary"
                      size="lg"
                    >
                      Continue to Challenge
                    </Button>
                  </div>
                </div>
              ) : (
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
            </>
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
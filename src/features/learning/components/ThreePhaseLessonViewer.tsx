import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { X, BookOpen, Trophy, LineChart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { playLessonComplete, playClick, playNav } from "@/lib/soundEffects";
import { fireConfetti } from "@/lib/confetti";
import { getLessonContent } from "./InteractiveLessonContent";
import { AILessonChatbot } from "./AILessonChatbot";
import { AdaptiveLessonChallenge } from "./AdaptiveLessonChallenge";
import { LessonMasteryDashboard } from "./LessonMasteryDashboard";
import { InteractiveLessonSimulation } from "./InteractiveLessonSimulation";

// Investing pathway
import { Lesson1Beginner } from "./lessons/Lesson1Beginner";
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

// Personal Finance pathway
import { PF1FinancialStartingPoint } from "./lessons/pf/PF1FinancialStartingPoint";
import { PF2BudgetingWorks } from "./lessons/pf/PF2BudgetingWorks";
import { PF3EmergencyFund } from "./lessons/pf/PF3EmergencyFund";
import { PF4CreditScores } from "./lessons/pf/PF4CreditScores";
import { PF5GoodVsBadDebt } from "./lessons/pf/PF5GoodVsBadDebt";
import { PF6BankingAccounts } from "./lessons/pf/PF6BankingAccounts";
import { PF7PaycheckDeductions } from "./lessons/pf/PF7PaycheckDeductions";
import { PF8FinancialGoals } from "./lessons/pf/PF8FinancialGoals";
import { PF9LifestyleInflation } from "./lessons/pf/PF9LifestyleInflation";
import { PF10Challenge } from "./lessons/pf/PF10Challenge";

// Corporate Finance pathway
import { CF1WhatIsCorporateFinance } from "./lessons/cf/CF1WhatIsCorporateFinance";
import { CF2IncomeStatement } from "./lessons/cf/CF2IncomeStatement";
import { CF3BalanceSheets } from "./lessons/cf/CF3BalanceSheets";
import { CF4CashFlow } from "./lessons/cf/CF4CashFlow";
import { CF5FinancialRatios } from "./lessons/cf/CF5FinancialRatios";
import { CF6RevenueRecognition } from "./lessons/cf/CF6RevenueRecognition";
import { CF7COGSMargins } from "./lessons/cf/CF7COGSMargins";
import { CF8WorkingCapital } from "./lessons/cf/CF8WorkingCapital";
import { CF9SECFilings } from "./lessons/cf/CF9SECFilings";
import { CF10Challenge } from "./lessons/cf/CF10Challenge";

// Trading pathway
import { TR1WhatIsTrading } from "./lessons/tr/TR1WhatIsTrading";
import { TR2CandlestickBasics } from "./lessons/tr/TR2CandlestickBasics";
import { TR3SupportResistance } from "./lessons/tr/TR3SupportResistance";
import { TR4TrendLines } from "./lessons/tr/TR4TrendLines";
import { TR5VolumeAnalysis } from "./lessons/tr/TR5VolumeAnalysis";
import { TR6MovingAverages } from "./lessons/tr/TR6MovingAverages";
import { TR7OrderTypes } from "./lessons/tr/TR7OrderTypes";
import { TR8RiskManagement } from "./lessons/tr/TR8RiskManagement";
import { TR9PaperTrading } from "./lessons/tr/TR9PaperTrading";
import { TR10Challenge } from "./lessons/tr/TR10Challenge";

// Alternative Assets pathway
import { ALT1BeyondStocks } from "./lessons/alt/ALT1BeyondStocks";
import { ALT2RealEstate } from "./lessons/alt/ALT2RealEstate";
import { ALT3REITs } from "./lessons/alt/ALT3REITs";
import { ALT4GoldMetals } from "./lessons/alt/ALT4GoldMetals";
import { ALT5Commodities } from "./lessons/alt/ALT5Commodities";
import { ALT6Crypto } from "./lessons/alt/ALT6Crypto";
import { ALT7NFTs } from "./lessons/alt/ALT7NFTs";
import { ALT8Collectibles } from "./lessons/alt/ALT8Collectibles";
import { ALT9ESG } from "./lessons/alt/ALT9ESG";
import { ALT10Challenge } from "./lessons/alt/ALT10Challenge";

// Lesson 11 for non-investing pathways
import { PF11DebtSnowball } from "./lessons/pf/PF11DebtSnowball";
import { CF11ValuationMethods } from "./lessons/cf/CF11ValuationMethods";
import { TR11ChartPatterns } from "./lessons/tr/TR11ChartPatterns";
import { ALT11PortfolioDiversification } from "./lessons/alt/ALT11PortfolioDiversification";

// Pathway-aware lesson map
const LESSON_MAP: Record<string, Record<number, React.ComponentType<{ onComplete: () => void }>>> = {
  'investing': {
    1: Lesson1Beginner, 2: Lesson2RiskRewardSlides, 3: Lesson3CompoundInterestSlides,
    4: Lesson4AssetMixSlides, 5: Lesson5DiversificationSlides, 6: Lesson6MarketPsychologySlides,
    7: Lesson7ValueInvestingSlides, 8: Lesson8FinancialStatementsSlides, 9: Lesson9MoatBuilderSlides,
    10: Lesson10StressTestSlides, 11: Lesson11LifePathSlides, 12: Lesson12DecisionChecklistSlides,
    13: Lesson13PatternRecognitionSlides, 14: Lesson14BiasDetectionSlides, 15: Lesson15OptionsBasicsSlides,
    16: Lesson16CostDragSlides, 17: Lesson17YieldCurveSlides, 18: Lesson18EconomicCyclesSlides,
    19: Lesson19VolatilitySlides, 20: Lesson20DividendIncomeSlides, 21: Lesson21IndicatorSignalsSlides,
    22: Lesson22REITComparisonSlides, 23: Lesson23MarginRiskSlides, 24: Lesson24PortfolioConstraintsSlides,
    25: Lesson25ShortSellingSlides,
  },
  'personal-finance': {
    1: PF1FinancialStartingPoint, 2: PF2BudgetingWorks, 3: PF3EmergencyFund,
    4: PF4CreditScores, 5: PF5GoodVsBadDebt, 6: PF6BankingAccounts,
    7: PF7PaycheckDeductions, 8: PF8FinancialGoals, 9: PF9LifestyleInflation, 10: PF10Challenge,
    11: PF11DebtSnowball,
  },
  'corporate-finance': {
    1: CF1WhatIsCorporateFinance, 2: CF2IncomeStatement, 3: CF3BalanceSheets,
    4: CF4CashFlow, 5: CF5FinancialRatios, 6: CF6RevenueRecognition,
    7: CF7COGSMargins, 8: CF8WorkingCapital, 9: CF9SECFilings, 10: CF10Challenge,
    11: CF11ValuationMethods,
  },
  'trading': {
    1: TR1WhatIsTrading, 2: TR2CandlestickBasics, 3: TR3SupportResistance,
    4: TR4TrendLines, 5: TR5VolumeAnalysis, 6: TR6MovingAverages,
    7: TR7OrderTypes, 8: TR8RiskManagement, 9: TR9PaperTrading, 10: TR10Challenge,
    11: TR11ChartPatterns,
  },
  'alternative-assets': {
    1: ALT1BeyondStocks, 2: ALT2RealEstate, 3: ALT3REITs,
    4: ALT4GoldMetals, 5: ALT5Commodities, 6: ALT6Crypto,
    7: ALT7NFTs, 8: ALT8Collectibles, 9: ALT9ESG, 10: ALT10Challenge,
  },
};

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
      
      if (progressData.progress >= 100 && !progressData.completed) {
        setPhase('learn');
      }
    }
  };

  const sections = lesson ? getLessonContent(lesson.order_index) : [];

  const handleLearnNext = async () => {
    playNav();
    if (currentSection < sections.length - 1) {
      const newSection = currentSection + 1;
      setCurrentSection(newSection);
      const newProgress = Math.round(((newSection + 1) / sections.length) * 100);
      setLearnProgress(newProgress);
      await updateProgress(newProgress, false);
    } else {
      await updateProgress(100, false);
      setPhase('challenge');
      toast.success("Learning phase complete! Ready for the challenge?");
    }
  };

  const handleLearnBack = () => {
    if (currentSection > 0) setCurrentSection(currentSection - 1);
  };

  const handleChallengeComplete = async (score: number, passed: boolean) => {
    setChallengeScore(score);
    setChallengePassed(passed);
    
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
      fireConfetti();
      playLessonComplete();
      setTimeout(() => {
        onClose();
        toast.success("Lesson completed! Next lesson unlocked!");
      }, 600);
    } else {
      setPhase('learn');
      setCurrentSection(0);
    }
  };

  const updateProgress = async (newProgress: number, isCompleted: boolean = false) => {
    if (!user?.id) return;
    
    const updateData: any = {
      user_id: user.id,
      lesson_id: lessonId,
      progress: newProgress,
      completed: isCompleted,
    };
    
    if (isCompleted) {
      updateData.completed_at = new Date().toISOString();
      playLessonComplete();
      fireConfetti();
    }
    
    const { error } = await supabase.from("user_lesson_progress").upsert(updateData, {
      onConflict: 'user_id,lesson_id'
    });

    if (error) {
      console.error("Failed to update progress:", error);
    }
  };

  const currentContent = sections[currentSection];

  if (!lesson) return null;

  // Check pathway-aware lesson map first
  const pathway = lesson.pathway || 'investing';
  const SlideComponent = LESSON_MAP[pathway]?.[lesson.order_index];

  if (SlideComponent) {
    return (
      <div className="fixed inset-0 bg-background/95 z-50 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">{lesson.title}</h1>
              <p className="text-muted-foreground mt-1">{lesson.description}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-6 h-6" />
            </Button>
          </div>
          <div className="animate-fade-in">
            <SlideComponent
              onComplete={async () => {
                await updateProgress(100, true);
                onClose();
                toast.success(`${lesson.title} complete! 🎉`);
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  // Fallback: generic three-phase flow for lessons without custom slides
  if (!sections.length || !currentContent) {
    return (
      <div className="fixed inset-0 bg-background/95 z-50 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6">
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
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">{lesson.title}</h1>
            <p className="text-muted-foreground mt-1">{lesson.description}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-6 h-6" />
          </Button>
        </div>

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

        <div className="max-w-4xl mx-auto">
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
        </div>
      </div>
    </div>
  );
};

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

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { EuphoriaSpinner } from "@/shared/components/EuphoriaSpinner";
import euphoriaLogo from "@/assets/euphoria-logo-button.png";
import { useABOnboardingAnalytics, ABVariant } from "../hooks/useABOnboardingAnalytics";
import { FinancialGoalStep } from "./steps/FinancialGoalStep";
import { RiskComfortStep } from "./steps/RiskComfortStep";
import { LearningStyleStep } from "./steps/LearningStyleStep";
import { TopicInterestStep } from "./steps/TopicInterestStep";
import { TimeCommitmentStep } from "./steps/TimeCommitmentStep";
import { InvestmentQuizStep } from "./steps/InvestmentQuizStep";

interface StepDef {
  name: string;
  component: React.ReactNode;
  isValid: () => boolean;
  getResponse: () => unknown;
}

interface Props {
  onComplete: (score: number, placementLesson: number, quizPreferences?: Record<string, unknown>) => Promise<void>;
  isRetake?: boolean;
}

export const ABOnboardingQuiz = ({ onComplete, isRetake = false }: Props) => {
  const analytics = useABOnboardingAnalytics();
  const [variant, setVariant] = useState<ABVariant | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isFinishing, setIsFinishing] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [showInvestmentQuiz, setShowInvestmentQuiz] = useState(false);
  const quizStartTime = useRef(Date.now());

  // Step state
  const [financialGoal, setFinancialGoal] = useState<string | null>(null);
  const [riskLevel, setRiskLevel] = useState<number | null>(null);
  const [learningStyle, setLearningStyle] = useState<string | null>(null);
  const [topics, setTopics] = useState<string[]>([]);
  const [timeCommitment, setTimeCommitment] = useState<number | null>(null);

  // Assign variant on mount
  useEffect(() => {
    analytics.assignVariant().then(setVariant);
  }, [analytics.assignVariant]);

  const allSteps: StepDef[] = [
    {
      name: "financial_goal",
      component: <FinancialGoalStep value={financialGoal} onChange={setFinancialGoal} />,
      isValid: () => financialGoal !== null,
      getResponse: () => ({ financial_goal: financialGoal }),
    },
    {
      name: "risk_comfort",
      component: <RiskComfortStep value={riskLevel} onChange={setRiskLevel} />,
      isValid: () => riskLevel !== null,
      getResponse: () => ({ risk_level: riskLevel }),
    },
    {
      name: "learning_style",
      component: <LearningStyleStep value={learningStyle} onChange={setLearningStyle} />,
      isValid: () => learningStyle !== null,
      getResponse: () => ({ learning_style: learningStyle }),
    },
    {
      name: "topic_interest",
      component: <TopicInterestStep value={topics} onChange={setTopics} />,
      isValid: () => topics.length > 0,
      getResponse: () => ({ topics }),
    },
    {
      name: "time_commitment",
      component: <TimeCommitmentStep value={timeCommitment} onChange={setTimeCommitment} />,
      isValid: () => timeCommitment !== null,
      getResponse: () => ({ time_commitment: timeCommitment }),
    },
  ];

  const steps = variant === "A" ? allSteps.slice(0, 3) : allSteps;
  const totalSteps = steps.length;
  const step = steps[currentStep];
  const progress = ((currentStep + 1) / totalSteps) * 100;

  useEffect(() => {
    analytics.trackStepStart();
  }, [currentStep, analytics.trackStepStart]);

  const handleNext = useCallback(async () => {
    if (!variant || !step) return;
    await analytics.trackStepComplete(variant, currentStep, step.name, step.getResponse());

    if (currentStep < totalSteps - 1) {
      setDirection(1);
      setCurrentStep((s) => s + 1);
    } else {
      // Personalization done → show investment quiz
      const totalTime = Date.now() - quizStartTime.current;
      await analytics.markComplete(variant, totalTime);
      setShowInvestmentQuiz(true);
    }
  }, [variant, step, currentStep, totalSteps, analytics]);

  const handleBack = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep((s) => s - 1);
    }
  };

  // Score → placement mapping (investing pathway only)
  const scorePlacementMap: Record<number, number> = {
    0: 1,
    1: 1,
    2: 1,
    3: 5,
    4: 15,
    5: 20,
  };

  const handleInvestmentQuizComplete = async (score: number) => {
    setShowCompletion(true);
    setIsFinishing(true);

    const placementLesson = scorePlacementMap[score] ?? 1;
    const normalizedScore = Math.round((score / 5) * 100);

    await new Promise((r) => setTimeout(r, 2200));

    const quizPreferences: Record<string, unknown> = {
      financial_goal: financialGoal,
      risk_level: riskLevel,
      learning_style: learningStyle,
      ...(topics.length > 0 && { topics }),
      ...(timeCommitment !== null && { time_commitment: timeCommitment }),
      investment_quiz_score: score,
      investing_placement_lesson: placementLesson,
    };

    await onComplete(normalizedScore, placementLesson, quizPreferences);
  };

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
  };

  if (!variant) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5 flex items-center justify-center">
        <EuphoriaSpinner size="lg" />
      </div>
    );
  }

  if (showCompletion) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center space-y-6"
        >
          <motion.img
            src={euphoriaLogo}
            alt="Euphoria"
            className="w-16 h-16 mx-auto rounded-2xl shadow-[var(--shadow-glow)]"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
          />
          <div>
            <h2 className="text-2xl font-bold">Personalizing your plan…</h2>
            <p className="text-muted-foreground mt-2">
              Building a custom learning path based on your results
            </p>
          </div>
          <div className="flex justify-center gap-1.5">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2.5 h-2.5 rounded-full bg-primary"
                animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  // Investment knowledge quiz phase
  if (showInvestmentQuiz) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5 flex items-center justify-center p-4 sm:p-6">
        <div className="max-w-xl w-full">
          <Card className="p-6 sm:p-8 bg-card/80 backdrop-blur-sm border-primary/20">
            <InvestmentQuizStep onComplete={handleInvestmentQuizComplete} />
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5 flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-xl w-full space-y-4">
        {/* Progress Header */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                currentStep === 0 ? "text-muted-foreground/40 cursor-not-allowed" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <span className="text-sm text-muted-foreground font-medium">
              {currentStep + 1} of {totalSteps}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Card */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <Card className="p-6 sm:p-8 bg-card/80 backdrop-blur-sm border-primary/20">
              {step?.component}

              <div className="mt-8">
                <Button
                  onClick={handleNext}
                  disabled={!step?.isValid()}
                  size="lg"
                  className="w-full gap-2"
                >
                  {currentStep < totalSteps - 1 ? (
                    <>
                      Next
                      <ArrowRight className="w-5 h-5" />
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Continue to Knowledge Check
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Step dots */}
        <div className="flex justify-center gap-2 pt-2">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === currentStep ? "w-6 bg-primary" : i < currentStep ? "w-2 bg-primary/60" : "w-2 bg-muted"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Dumbbell, Gamepad2, Gift, Users, X, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TutorialStep {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const steps: TutorialStep[] = [
  {
    title: "Learn",
    description: "Follow guided lessons to master investing, personal finance, and more — one step at a time.",
    icon: <BookOpen className="w-8 h-8" />,
    color: "from-primary to-primary/70",
  },
  {
    title: "Practice",
    description: "Trade with virtual money in a realistic simulator. No risk, all the experience.",
    icon: <Dumbbell className="w-8 h-8" />,
    color: "from-accent to-accent/70",
  },
  {
    title: "Play Games",
    description: "Sharpen your skills with fun financial games and earn XP along the way.",
    icon: <Gamepad2 className="w-8 h-8" />,
    color: "from-warning to-warning/70",
  },
  {
    title: "Earn Rewards",
    description: "Level up by completing lessons and challenges. Track your progress and unlock achievements.",
    icon: <Gift className="w-8 h-8" />,
    color: "from-destructive to-destructive/70",
  },
  {
    title: "Connect",
    description: "Join a community of learners. Share insights, discuss strategies, and grow together.",
    icon: <Users className="w-8 h-8" />,
    color: "from-secondary to-secondary/70",
  },
];

interface OnboardingTutorialProps {
  onComplete: () => void;
}

export const OnboardingTutorial = ({ onComplete }: OnboardingTutorialProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const step = steps[currentStep];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl flex items-center justify-center p-6"
    >
      <div className="absolute top-6 right-6">
        <Button variant="ghost" size="sm" onClick={handleSkip} className="text-muted-foreground">
          Skip <X className="w-4 h-4 ml-1" />
        </Button>
      </div>

      <div className="max-w-md w-full text-center">
        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 mb-12">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === currentStep ? "w-8 bg-primary" : i < currentStep ? "w-4 bg-primary/40" : "w-4 bg-muted"
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.95 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="space-y-8"
          >
            {/* Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${step.color} mx-auto flex items-center justify-center text-white shadow-lg`}
            >
              {step.icon}
            </motion.div>

            {/* Text */}
            <div>
              <h2 className="text-3xl font-black text-foreground mb-3">{step.title}</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">{step.description}</p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Actions */}
        <div className="mt-12">
          <Button onClick={handleNext} size="lg" className="w-full h-14 text-lg font-bold rounded-2xl">
            {currentStep < steps.length - 1 ? (
              <>Continue <ChevronRight className="w-5 h-5 ml-1" /></>
            ) : (
              <>Let's Go! <Sparkles className="w-5 h-5 ml-1" /></>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

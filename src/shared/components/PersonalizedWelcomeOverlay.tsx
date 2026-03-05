import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp, BookOpen, Gamepad2, Brain, Sparkles, 
  ChevronRight, X, Target, Shield, Zap, LineChart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOnboarding } from "@/hooks/useOnboarding";
import logo from "@/assets/euphoria-logo-button.png";

interface WelcomeCard {
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  action: string;
  tab: string;
}

// Map financial goals to recommended features
const goalFeatureMap: Record<string, WelcomeCard[]> = {
  "Grow Wealth": [
    {
      title: "AI Market Simulation",
      description: "Practice trading with AI-driven market events and grow your virtual portfolio — risk-free.",
      icon: <TrendingUp className="w-7 h-7" />,
      gradient: "from-success to-success/60",
      action: "Start Trading",
      tab: "trade",
    },
    {
      title: "Investment Lessons",
      description: "Master portfolio building, stock analysis, and wealth strategies through interactive scenarios.",
      icon: <BookOpen className="w-7 h-7" />,
      gradient: "from-primary to-accent",
      action: "Start Learning",
      tab: "learn",
    },
  ],
  "Manage Debt": [
    {
      title: "Budgeting & Debt Lessons",
      description: "Learn practical strategies for managing debt, building budgets, and taking control of your finances.",
      icon: <Shield className="w-7 h-7" />,
      gradient: "from-primary to-primary/60",
      action: "Start Learning",
      tab: "learn",
    },
    {
      title: "Financial Games",
      description: "Play Budget Balancer and other games that teach you to manage money under real-world pressure.",
      icon: <Gamepad2 className="w-7 h-7" />,
      gradient: "from-warning to-warning/60",
      action: "Play Now",
      tab: "games",
    },
  ],
  "Save for College": [
    {
      title: "Long-Term Investing",
      description: "Learn how compound interest, ETFs, and savings plans can help you build a college fund over time.",
      icon: <LineChart className="w-7 h-7" />,
      gradient: "from-accent to-primary",
      action: "Start Learning",
      tab: "learn",
    },
    {
      title: "Practice Portfolio",
      description: "Build a simulated savings portfolio and watch it grow — learn what works before risking real money.",
      icon: <TrendingUp className="w-7 h-7" />,
      gradient: "from-success to-success/60",
      action: "Start Trading",
      tab: "trade",
    },
  ],
  "Build Emergency Fund": [
    {
      title: "Personal Finance Basics",
      description: "Learn how to set savings goals, build emergency reserves, and protect yourself from unexpected costs.",
      icon: <Shield className="w-7 h-7" />,
      gradient: "from-primary to-accent",
      action: "Start Learning",
      tab: "learn",
    },
    {
      title: "Budget Balancer Game",
      description: "Test your budgeting skills in a game that simulates real-life expenses and savings scenarios.",
      icon: <Gamepad2 className="w-7 h-7" />,
      gradient: "from-warning to-warning/60",
      action: "Play Now",
      tab: "games",
    },
  ],
};

const defaultCards: WelcomeCard[] = [
  {
    title: "Interactive Lessons",
    description: "Scenario-based lessons where every choice teaches you something new about investing and finance.",
    icon: <BookOpen className="w-7 h-7" />,
    gradient: "from-primary to-accent",
    action: "Start Learning",
    tab: "learn",
  },
  {
    title: "AI Market Simulator",
    description: "Trade in a realistic market powered by AI — real events, real decisions, zero risk.",
    icon: <TrendingUp className="w-7 h-7" />,
    gradient: "from-success to-success/60",
    action: "Start Trading",
    tab: "trade",
  },
];

interface PersonalizedWelcomeOverlayProps {
  onComplete: (navigateTo?: string) => void;
}

export const PersonalizedWelcomeOverlay = ({ onComplete }: PersonalizedWelcomeOverlayProps) => {
  const { onboarding } = useOnboarding();
  const [currentStep, setCurrentStep] = useState(0);

  const prefs = onboarding?.preferences as Record<string, unknown> | null;
  const financialGoal = prefs?.financial_goal as string | undefined;
  const riskLevel = prefs?.risk_level as number | undefined;
  const displayName = "there"; // Could be fetched from profile

  // Build personalized cards: welcome card + 2 feature cards based on goal
  const featureCards = financialGoal && goalFeatureMap[financialGoal]
    ? goalFeatureMap[financialGoal]
    : defaultCards;

  // Determine risk label for personalization
  const riskLabel = riskLevel !== undefined
    ? riskLevel >= 67 ? "aggressive" : riskLevel >= 33 ? "moderate" : "conservative"
    : null;

  const cards = [
    // Card 0: Welcome
    {
      type: "welcome" as const,
      title: `Welcome to Euphoria!`,
      subtitle: financialGoal
        ? `We've built a personalized path to help you ${financialGoal.toLowerCase()}.`
        : "Your personalized learning journey starts now.",
      detail: riskLabel
        ? `Based on your ${riskLabel} risk profile, we've curated the best features for you.`
        : "Let's explore the features designed for you.",
    },
    // Cards 1-2: Feature highlights
    ...featureCards,
    // Card 3: Get started
    {
      type: "cta" as const,
      title: "You're all set!",
      subtitle: "Your personalized dashboard is ready. Dive in and start building your financial knowledge.",
    },
  ];

  const totalSteps = cards.length;

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      onComplete();
    }
  };

  const handleFeatureClick = (tab: string) => {
    onComplete(tab);
  };

  const card = cards[currentStep];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[200] bg-background/95 backdrop-blur-xl flex items-center justify-center p-6"
    >
      {/* Skip button */}
      <div className="absolute top-6 right-6">
        <Button variant="ghost" size="sm" onClick={() => onComplete()} className="text-muted-foreground hover:text-foreground">
          Skip <X className="w-4 h-4 ml-1" />
        </Button>
      </div>

      <div className="max-w-md w-full">
        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {cards.map((_, i) => (
            <motion.div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === currentStep ? "w-8 bg-primary" : i < currentStep ? "w-4 bg-primary/40" : "w-4 bg-muted"
              }`}
              layout
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 60, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -60, scale: 0.96 }}
            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {"type" in card && card.type === "welcome" ? (
              // Welcome card
              <div className="text-center space-y-6">
                <motion.img
                  src={logo}
                  alt="Euphoria"
                  className="w-20 h-20 mx-auto rounded-2xl shadow-glow"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.15, type: "spring", stiffness: 200, damping: 15 }}
                />
                <div>
                  <h2 className="text-3xl font-black mb-3">{card.title}</h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">{card.subtitle}</p>
                </div>
                {"detail" in card && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-primary/5 border border-primary/15 rounded-xl p-4"
                  >
                    <div className="flex items-center gap-2 justify-center text-sm text-primary font-semibold">
                      <Target className="w-4 h-4" />
                      <span>{card.detail}</span>
                    </div>
                  </motion.div>
                )}
              </div>
            ) : "type" in card && card.type === "cta" ? (
              // Final CTA card
              <div className="text-center space-y-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                  className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary to-accent mx-auto flex items-center justify-center shadow-glow"
                >
                  <Sparkles className="w-10 h-10 text-primary-foreground" />
                </motion.div>
                <div>
                  <h2 className="text-3xl font-black mb-3">{card.title}</h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">{card.subtitle}</p>
                </div>
              </div>
            ) : (
              // Feature highlight card
              <div className="text-center space-y-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                  className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${(card as WelcomeCard).gradient} mx-auto flex items-center justify-center text-white shadow-lg`}
                >
                  {(card as WelcomeCard).icon}
                </motion.div>
                <div>
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="inline-flex items-center gap-1.5 text-[10px] font-bold text-primary uppercase tracking-widest mb-2"
                  >
                    <Zap className="w-3 h-3" />
                    Recommended for you
                  </motion.div>
                  <h2 className="text-3xl font-black mb-3">{(card as WelcomeCard).title}</h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">{(card as WelcomeCard).description}</p>
                </div>
                <Button
                  variant="outline"
                  className="border-primary/30 text-primary hover:bg-primary/10"
                  onClick={() => handleFeatureClick((card as WelcomeCard).tab)}
                >
                  {(card as WelcomeCard).action} <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Continue button */}
        <div className="mt-10">
          <Button onClick={handleNext} size="lg" className="w-full h-14 text-lg font-bold rounded-2xl bg-gradient-primary hover:opacity-90">
            {currentStep < totalSteps - 1 ? (
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

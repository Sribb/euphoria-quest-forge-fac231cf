import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const TUTORIAL_KEY = "euphoria_tutorial_completed";

interface TutorialStep {
  targetSelector: string;
  message: string;
  subMessage?: string;
  arrowDirection: "down" | "up" | "left" | "right";
  action?: string; // if set, clicking target advances
  requireClick?: boolean;
}

const STEPS: TutorialStep[] = [
  {
    targetSelector: '[data-tutorial="learn-tab"]',
    message: "This is your learning hub!",
    subMessage: "All your courses and lessons live here. Let's explore.",
    arrowDirection: "left",
    requireClick: false,
  },
  {
    targetSelector: '[data-tutorial="first-lesson"]',
    message: "Tap here to start your first lesson!",
    subMessage: "Each circle is a lesson. Complete them to progress through the trail.",
    arrowDirection: "up",
    requireClick: true,
  },
];

interface InteractiveTutorialProps {
  onComplete: () => void;
  activeTab: string;
  onNavigate: (tab: string) => void;
}

export function InteractiveTutorial({ onComplete, activeTab, onNavigate }: InteractiveTutorialProps) {
  const [step, setStep] = useState(-1); // -1 = welcome splash
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [visible, setVisible] = useState(true);

  // Ensure we're on the dashboard tab for the tutorial
  useEffect(() => {
    if (step >= 0 && activeTab !== "dashboard") {
      onNavigate("dashboard");
    }
  }, [step, activeTab, onNavigate]);

  // Find and track target element position
  const updateTargetPosition = useCallback(() => {
    if (step < 0 || step >= STEPS.length) return;
    const selector = STEPS[step].targetSelector;
    const el = document.querySelector(selector);
    if (el) {
      const rect = el.getBoundingClientRect();
      setTargetRect(rect);
    } else {
      setTargetRect(null);
    }
  }, [step]);

  useEffect(() => {
    updateTargetPosition();
    const interval = setInterval(updateTargetPosition, 200);
    window.addEventListener("resize", updateTargetPosition);
    window.addEventListener("scroll", updateTargetPosition, true);
    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", updateTargetPosition);
      window.removeEventListener("scroll", updateTargetPosition, true);
    };
  }, [updateTargetPosition]);

  // Listen for clicks on target when requireClick is true
  useEffect(() => {
    if (step < 0 || step >= STEPS.length) return;
    const currentStep = STEPS[step];
    if (!currentStep.requireClick) return;

    const handler = (e: MouseEvent) => {
      const el = document.querySelector(currentStep.targetSelector);
      if (el && (el === e.target || el.contains(e.target as Node))) {
        finish();
      }
    };
    // Use capture to catch it before the actual click
    document.addEventListener("click", handler, true);
    return () => document.removeEventListener("click", handler, true);
  }, [step]);

  const advance = () => {
    const nextStep = step + 1;
    if (nextStep >= STEPS.length) {
      finish();
    } else {
      setStep(nextStep);
      setTargetRect(null);
    }
  };

  const finish = () => {
    localStorage.setItem(TUTORIAL_KEY, "true");
    setVisible(false);
    setTimeout(onComplete, 300);
  };

  const skip = () => {
    finish();
  };

  if (!visible) return null;

  const currentStep = step >= 0 && step < STEPS.length ? STEPS[step] : null;

  return (
    <AnimatePresence>
      {/* Welcome splash */}
      {step === -1 && (
        <motion.div
          key="welcome"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] bg-background/90 backdrop-blur-xl flex items-center justify-center p-6"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="max-w-sm text-center"
          >
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-accent mx-auto flex items-center justify-center mb-6 shadow-lg shadow-primary/30">
              <Sparkles className="w-10 h-10 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-black text-foreground mb-3">Welcome to Euphoria!</h1>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              Let us give you a quick tour so you know where everything is.
            </p>
            <div className="flex flex-col gap-3">
              <Button onClick={() => setStep(0)} size="lg" className="w-full h-14 text-lg font-bold rounded-2xl">
                Show me around
              </Button>
              <button onClick={skip} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Skip tutorial
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Overlay with cutout */}
      {currentStep && (
        <motion.div
          key={`step-${step}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200]"
          style={{ pointerEvents: "none" }}
        >
          {/* Dark overlay pieces around the cutout — allows clicks through the hole */}
          {targetRect ? (
            <>
              {/* Top */}
              <div
                className="absolute bg-background/75"
                style={{ pointerEvents: "auto", top: 0, left: 0, right: 0, height: Math.max(0, targetRect.top - 12) }}
                onClick={() => !currentStep.requireClick && advance()}
              />
              {/* Bottom */}
              <div
                className="absolute bg-background/75"
                style={{ pointerEvents: "auto", top: targetRect.bottom + 12, left: 0, right: 0, bottom: 0 }}
                onClick={() => !currentStep.requireClick && advance()}
              />
              {/* Left */}
              <div
                className="absolute bg-background/75"
                style={{ pointerEvents: "auto", top: targetRect.top - 12, left: 0, width: Math.max(0, targetRect.left - 12), height: targetRect.height + 24 }}
                onClick={() => !currentStep.requireClick && advance()}
              />
              {/* Right */}
              <div
                className="absolute bg-background/75"
                style={{ pointerEvents: "auto", top: targetRect.top - 12, left: targetRect.right + 12, right: 0, height: targetRect.height + 24 }}
                onClick={() => !currentStep.requireClick && advance()}
              />
            </>
          ) : (
            <div
              className="absolute inset-0 bg-background/75"
              style={{ pointerEvents: "auto" }}
              onClick={() => !currentStep.requireClick && advance()}
            />
          )}

          {/* Highlight ring */}
          {targetRect && (
            <div
              className="absolute"
              style={{
                left: targetRect.left - 14,
                top: targetRect.top - 14,
                width: targetRect.width + 28,
                height: targetRect.height + 28,
                pointerEvents: "none",
              }}
            >
              <div className="w-full h-full rounded-2xl border-2 border-primary/60 shadow-[0_0_20px_4px_hsl(var(--primary)/0.3)]" />
            </div>
          )}

          {/* Tooltip */}
          {targetRect && (
            <TutorialTooltip
              targetRect={targetRect}
              direction={currentStep.arrowDirection}
              message={currentStep.message}
              subMessage={currentStep.subMessage}
              stepIndex={step}
              totalSteps={STEPS.length}
              onNext={currentStep.requireClick ? undefined : advance}
              onSkip={skip}
              requireClick={currentStep.requireClick}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function TutorialTooltip({
  targetRect,
  direction,
  message,
  subMessage,
  stepIndex,
  totalSteps,
  onNext,
  onSkip,
  requireClick,
}: {
  targetRect: DOMRect;
  direction: string;
  message: string;
  subMessage?: string;
  stepIndex: number;
  totalSteps: number;
  onNext?: () => void;
  onSkip: () => void;
  requireClick?: boolean;
}) {
  // Position tooltip relative to target
  let tooltipStyle: React.CSSProperties = {};
  let arrowStyle: React.CSSProperties = {};
  let arrowRotation = "0deg";

  const gap = 20;

  switch (direction) {
    case "up":
      tooltipStyle = {
        left: targetRect.left + targetRect.width / 2,
        top: targetRect.bottom + gap + 24,
        transform: "translateX(-50%)",
      };
      arrowStyle = {
        left: targetRect.left + targetRect.width / 2,
        top: targetRect.bottom + gap - 8,
        transform: "translateX(-50%) rotate(180deg)",
      };
      arrowRotation = "180deg";
      break;
    case "down":
      tooltipStyle = {
        left: targetRect.left + targetRect.width / 2,
        bottom: window.innerHeight - targetRect.top + gap + 24,
        transform: "translateX(-50%)",
      };
      arrowStyle = {
        left: targetRect.left + targetRect.width / 2,
        bottom: window.innerHeight - targetRect.top + gap - 8,
        transform: "translateX(-50%)",
      };
      break;
    case "left":
      tooltipStyle = {
        left: targetRect.right + gap + 24,
        top: targetRect.top + targetRect.height / 2,
        transform: "translateY(-50%)",
      };
      arrowStyle = {
        left: targetRect.right + gap - 4,
        top: targetRect.top + targetRect.height / 2,
        transform: "translateY(-50%) rotate(90deg)",
      };
      break;
    case "right":
      tooltipStyle = {
        right: window.innerWidth - targetRect.left + gap + 24,
        top: targetRect.top + targetRect.height / 2,
        transform: "translateY(-50%)",
      };
      arrowStyle = {
        right: window.innerWidth - targetRect.left + gap - 4,
        top: targetRect.top + targetRect.height / 2,
        transform: "translateY(-50%) rotate(-90deg)",
      };
      break;
  }

  return (
    <>
      {/* Tooltip card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15 }}
        className="absolute z-[210] pointer-events-auto"
        style={tooltipStyle}
      >
        <div className="bg-card border border-primary/30 rounded-2xl p-5 shadow-xl shadow-primary/10 max-w-xs">
          <p className="text-base font-bold text-foreground mb-1">{message}</p>
          {subMessage && <p className="text-sm text-muted-foreground mb-3">{subMessage}</p>}

          <div className="flex items-center justify-between">
            <div className="flex gap-1.5">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div key={i} className={`w-2 h-2 rounded-full ${i === stepIndex ? "bg-primary" : "bg-muted"}`} />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button onClick={onSkip} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                Skip
              </button>
              {onNext && (
                <Button onClick={onNext} size="sm" className="rounded-xl text-xs font-bold px-4">
                  Next
                </Button>
              )}
              {requireClick && (
                <span className="text-xs text-primary font-semibold animate-pulse">Click it! ↑</span>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}

export function useTutorialNeeded(): boolean {
  const [needed, setNeeded] = useState(false);
  useEffect(() => {
    const done = localStorage.getItem(TUTORIAL_KEY);
    setNeeded(!done);
  }, []);
  return needed;
}

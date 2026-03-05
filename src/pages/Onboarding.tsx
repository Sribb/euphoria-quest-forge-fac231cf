import { ABOnboardingQuiz } from "@/features/onboarding/components/ABOnboardingQuiz";
import { EuphoriaSpinner } from "@/shared/components/EuphoriaSpinner";
import { useOnboarding } from "@/hooks/useOnboarding";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useEffect } from "react";

interface OnboardingProps {
  isRetake?: boolean;
  onComplete?: () => void;
}

const Onboarding = ({ isRetake = false, onComplete }: OnboardingProps) => {
  const { completeOnboarding, refetch, hasCompletedOnboarding, isLoading } = useOnboarding();
  const navigate = useNavigate();

  // Redirect to app if already completed (unless retaking)
  useEffect(() => {
    if (!isLoading && hasCompletedOnboarding && !isRetake) {
      navigate("/app", { replace: true });
    }
  }, [hasCompletedOnboarding, isLoading, isRetake, navigate]);

  const handleQuizComplete = async (score: number, placementLesson: number): Promise<void> => {
    try {
      await completeOnboarding.mutateAsync({ score, placementLesson });
      
      // Refetch to update hasCompletedOnboarding before navigation
      await refetch();
      
      if (isRetake) {
        toast.success(`Your new placement: Lesson ${placementLesson}!`);
        onComplete?.();
      } else {
        toast.success(`Welcome! You've been placed at Lesson ${placementLesson}`);
        navigate("/app", { replace: true });
      }
    } catch (error) {
      console.error("Failed to save onboarding:", error);
      toast.error("Failed to save your results. Please try again.");
      throw error;
    }
  };

  // Show loading while checking onboarding status
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <EuphoriaSpinner size="lg" />
      </div>
    );
  }

  // Don't render quiz if already completed (redirect will happen)
  if (hasCompletedOnboarding && !isRetake) {
    return null;
  }

  return (
    <ABOnboardingQuiz 
      onComplete={handleQuizComplete} 
      isRetake={isRetake}
    />
  );
};

export default Onboarding;

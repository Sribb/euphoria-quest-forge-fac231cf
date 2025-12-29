import { PlacementQuiz } from "@/components/quiz/PlacementQuiz";
import { useOnboarding } from "@/hooks/useOnboarding";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface OnboardingProps {
  isRetake?: boolean;
  onComplete?: () => void;
}

const Onboarding = ({ isRetake = false, onComplete }: OnboardingProps) => {
  const { completeOnboarding } = useOnboarding();
  const navigate = useNavigate();

  const handleQuizComplete = async (score: number, placementLesson: number): Promise<void> => {
    try {
      await completeOnboarding.mutateAsync({ score, placementLesson });
      
      if (isRetake) {
        toast.success(`Your new placement: Lesson ${placementLesson}!`);
        onComplete?.();
      } else {
        toast.success(`Welcome! You've been placed at Lesson ${placementLesson}`);
        // Use replace to prevent going back to onboarding
        navigate("/app", { replace: true });
      }
    } catch (error) {
      console.error("Failed to save onboarding:", error);
      toast.error("Failed to save your results. Please try again.");
      throw error; // Re-throw so the quiz can reset the submitting state
    }
  };

  return (
    <PlacementQuiz 
      onComplete={handleQuizComplete} 
      isRetake={isRetake}
    />
  );
};

export default Onboarding;

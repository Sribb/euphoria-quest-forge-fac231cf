import { OnboardingMentor } from "./lessons/OnboardingMentor";
import { RiskSimulator } from "./lessons/RiskSimulator";
import { CompoundVisualizer } from "./lessons/CompoundVisualizer";
import { AllocationBuilder } from "./lessons/AllocationBuilder";

interface InteractiveLessonRouterProps {
  lessonId: string;
}

export const InteractiveLessonRouter = ({ lessonId }: InteractiveLessonRouterProps) => {
  // Map lesson IDs and order_index to their interactive components
  // This supports both ID-based and index-based routing
  const lessonComponents: Record<string, React.ReactNode> = {
    // By lesson ID
    "intro-to-investing": <OnboardingMentor />,
    "risk-vs-reward": <RiskSimulator />,
    "compound-interest": <CompoundVisualizer />,
    "stocks-vs-bonds": <AllocationBuilder />,
    "diversification": <OnboardingMentor />, // Placeholder
    "market-psychology": <RiskSimulator />, // Placeholder
    
    // By order_index (for database lessons)
    "1": <OnboardingMentor />,
    "2": <RiskSimulator />,
    "3": <CompoundVisualizer />,
    "4": <AllocationBuilder />,
  };

  return (
    <div className="space-y-6">
      {lessonComponents[lessonId] || null}
    </div>
  );
};

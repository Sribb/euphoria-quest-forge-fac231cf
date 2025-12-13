import { OnboardingMentor } from "./lessons/OnboardingMentor";
import { RiskSimulator } from "./lessons/RiskSimulator";
import { CompoundVisualizer } from "./lessons/CompoundVisualizer";
import { AllocationBuilder } from "./lessons/AllocationBuilder";
import { DiversificationBuilder } from "./lessons/DiversificationBuilder";
import { FearGreedSimulator } from "./lessons/FearGreedSimulator";
import { StockValuationCalculator } from "./lessons/StockValuationCalculator";
import { FinancialStatementAnalyzer } from "./lessons/FinancialStatementAnalyzer";
import { MoatIdentifier } from "./lessons/MoatIdentifier";
import { ChartPatternQuiz } from "./lessons/ChartPatternQuiz";
import { DCASimulator } from "./lessons/DCASimulator";
import { TaxOptimizer } from "./lessons/TaxOptimizer";
import { RetirementCalculator } from "./lessons/RetirementCalculator";
import { BiasDetector } from "./lessons/BiasDetector";
import { OptionsSimulator } from "./lessons/OptionsSimulator";
import { ETFComparison } from "./lessons/ETFComparison";
import { BondCalculator } from "./lessons/BondCalculator";
import { CryptoBasicsExplorer } from "./lessons/CryptoBasicsExplorer";

interface InteractiveLessonRouterProps {
  lessonId: string;
}

export const InteractiveLessonRouter = ({ lessonId }: InteractiveLessonRouterProps) => {
  // Map order_index to interactive components
  const lessonComponents: Record<string, React.ReactNode> = {
    "1": <OnboardingMentor />,
    "2": <RiskSimulator />,
    "3": <CompoundVisualizer />,
    "4": <AllocationBuilder />,
    "5": <DiversificationBuilder />,
    "6": <FearGreedSimulator />,
    "7": <StockValuationCalculator />,
    "8": <FinancialStatementAnalyzer />,
    "9": <MoatIdentifier />,
    "10": <ChartPatternQuiz />,
    "11": <DCASimulator />,
    "12": <TaxOptimizer />,
    "13": <RetirementCalculator />,
    "14": <BiasDetector />,
    "15": <OptionsSimulator />,
    "16": <ETFComparison />,
    "17": <BondCalculator />,
    "19": <CryptoBasicsExplorer />,
  };

  return (
    <div className="space-y-6">
      {lessonComponents[lessonId] || null}
    </div>
  );
};

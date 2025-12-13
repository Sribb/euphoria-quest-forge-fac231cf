import { FoundationsImmersive } from "./lessons/FoundationsImmersive";
import { RiskRewardImmersive } from "./lessons/RiskRewardImmersive";
import { CompoundInterestImmersive } from "./lessons/CompoundInterestImmersive";
import { StocksBondsImmersive } from "./lessons/StocksBondsImmersive";
import { DiversificationImmersive } from "./lessons/DiversificationImmersive";
import { MarketPsychologyImmersive } from "./lessons/MarketPsychologyImmersive";
import { CompoundVisualizer } from "./lessons/CompoundVisualizer";
import { AllocationBuilder } from "./lessons/AllocationBuilder";
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
import { SectorAnalyzer } from "./lessons/SectorAnalyzer";
import { CryptoBasicsExplorer } from "./lessons/CryptoBasicsExplorer";
import { REITCalculator } from "./lessons/REITCalculator";
import { CommoditiesTracker } from "./lessons/CommoditiesTracker";
import { ForexSimulator } from "./lessons/ForexSimulator";
import { AlternativeInvestments } from "./lessons/AlternativeInvestments";
import { ESGScorecard } from "./lessons/ESGScorecard";
import { AdvancedOptionsStrategies } from "./lessons/AdvancedOptionsStrategies";
import { AlgoTradingBasics } from "./lessons/AlgoTradingBasics";
import { MarketMicrostructure } from "./lessons/MarketMicrostructure";
import { DerivativesExplorer } from "./lessons/DerivativesExplorer";
import { FixedIncomeStrategies } from "./lessons/FixedIncomeStrategies";
import { QuantitativeAnalysis } from "./lessons/QuantitativeAnalysis";
import { BehavioralEconomics } from "./lessons/BehavioralEconomics";
import { HedgeFundStrategies } from "./lessons/HedgeFundStrategies";
import { PrivateEquityBasics } from "./lessons/PrivateEquityBasics";
import { VentureCapital101 } from "./lessons/VentureCapital101";

interface InteractiveLessonRouterProps {
  lessonId: string;
}

export const InteractiveLessonRouter = ({ lessonId }: InteractiveLessonRouterProps) => {
  const lessonComponents: Record<string, React.ReactNode> = {
    "1": <FoundationsImmersive />,
    "2": <RiskRewardImmersive />,
    "3": <CompoundInterestImmersive />,
    "4": <StocksBondsImmersive />,
    "5": <DiversificationImmersive />,
    "6": <MarketPsychologyImmersive />,
    "7": <StockValuationCalculator />,
    "8": <FinancialStatementAnalyzer />,
    "9": <MoatIdentifier />,
    "10": <ChartPatternQuiz />,
    "11": <DCASimulator />,
    "12": <TaxOptimizer />,
    "13": <ChartPatternQuiz />,
    "14": <BiasDetector />,
    "15": <OptionsSimulator />,
    "16": <ETFComparison />,
    "17": <BondCalculator />,
    "18": <SectorAnalyzer />,
    "19": <CryptoBasicsExplorer />,
    "20": <REITCalculator />,
    "21": <CommoditiesTracker />,
    "22": <ForexSimulator />,
    "23": <AlternativeInvestments />,
    "24": <ESGScorecard />,
    "25": <AdvancedOptionsStrategies />,
    "26": <AlgoTradingBasics />,
    "27": <MarketMicrostructure />,
    "28": <DerivativesExplorer />,
    "29": <FixedIncomeStrategies />,
    "30": <QuantitativeAnalysis />,
    "31": <BehavioralEconomics />,
    "32": <HedgeFundStrategies />,
    "33": <PrivateEquityBasics />,
    "34": <VentureCapital101 />,
    "35": <QuantitativeAnalysis />,
    "36": <PrivateEquityBasics />,
    "37": <ESGScorecard />,
    "38": <MarketMicrostructure />,
    "39": <FixedIncomeStrategies />,
    "40": <ForexSimulator />,
    "41": <CommoditiesTracker />,
    "42": <ForexSimulator />,
    "43": <RiskRewardImmersive />,
    "44": <TaxOptimizer />,
    "45": <RetirementCalculator />,
    "46": <RetirementCalculator />,
    "47": <CompoundVisualizer />,
    "48": <RetirementCalculator />,
    "49": <ChartPatternQuiz />,
    "50": <AllocationBuilder />,
  };

  return (
    <div className="space-y-6">
      {lessonComponents[lessonId] || null}
    </div>
  );
};

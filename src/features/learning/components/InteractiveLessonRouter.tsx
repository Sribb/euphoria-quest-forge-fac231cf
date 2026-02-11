import { InvestingSimulationLab } from "./lessons/InvestingSimulationLab";
import { FinancialLifeSimulator } from "./lessons/FinancialLifeSimulator";
import { FoundationsImmersive } from "./lessons/FoundationsImmersive";
import { RiskRewardImmersive } from "./lessons/RiskRewardImmersive";
import { Lesson2RiskRewardSlides } from "./lessons/Lesson2RiskRewardSlides";
import { CompoundInterestImmersive } from "./lessons/CompoundInterestImmersive";
import { StocksBondsImmersive } from "./lessons/StocksBondsImmersive";
import { DiversificationImmersive } from "./lessons/DiversificationImmersive";
import { MarketPsychologyImmersive } from "./lessons/MarketPsychologyImmersive";
import { CompoundVisualizer } from "./lessons/CompoundVisualizer";
import { AllocationBuilder } from "./lessons/AllocationBuilder";
import { StockValuationCalculator } from "./lessons/StockValuationCalculator";
import { Lesson8FinancialStatementsSlides } from "./lessons/Lesson8FinancialStatementsSlides";
import { Lesson9MoatBuilderSlides } from "./lessons/Lesson9MoatBuilderSlides";
import { Lesson10StressTestSlides } from "./lessons/Lesson10StressTestSlides";
import { Lesson11LifePathSlides } from "./lessons/Lesson11LifePathSlides";
import { DecisionChecklistGrader } from "./lessons/DecisionChecklistGrader";
import { TimedPatternChallenge } from "./lessons/TimedPatternChallenge";
import { PressureBiasDetector } from "./lessons/PressureBiasDetector";
import { OptionsPayoffSandbox } from "./lessons/OptionsPayoffSandbox";
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
// Corporate Finance lessons (51-70)
import { CashFlowAnalysis } from "./lessons/CashFlowAnalysis";
import { BalanceSheetExplorer } from "./lessons/BalanceSheetExplorer";
import { IncomeStatementLab } from "./lessons/IncomeStatementLab";
import { FinancialRatiosToolkit } from "./lessons/FinancialRatiosToolkit";
import { CapitalStructureLab } from "./lessons/CapitalStructureLab";
import { WorkingCapitalSim } from "./lessons/WorkingCapitalSim";
import { CorporateGovernanceQuiz } from "./lessons/CorporateGovernanceQuiz";
import { MergersAcquisitionsSim } from "./lessons/MergersAcquisitionsSim";
import { DividendPolicyLab } from "./lessons/DividendPolicyLab";
import { WACCCalculator } from "./lessons/WACCCalculator";
import { CapitalBudgetingLab } from "./lessons/CapitalBudgetingLab";
import { CorporateRestructuringSim } from "./lessons/CorporateRestructuringSim";
import { SECFilingsExplorer } from "./lessons/SECFilingsExplorer";
import { ForensicAccountingLab } from "./lessons/ForensicAccountingLab";
import { IndustryAnalysisLab } from "./lessons/IndustryAnalysisLab";
import { RevenueRecognitionLab } from "./lessons/RevenueRecognitionLab";
import { CreditAnalysisLab } from "./lessons/CreditAnalysisLab";
import { CorporateRiskLab } from "./lessons/CorporateRiskLab";
import { ExecCompAnalysis } from "./lessons/ExecCompAnalysis";
import { CorpFinanceCapstone } from "./lessons/CorpFinanceCapstone";

interface InteractiveLessonRouterProps {
  lessonId: string;
}

export const InteractiveLessonRouter = ({ lessonId }: InteractiveLessonRouterProps) => {
  const lessonComponents: Record<string, React.ReactNode> = {
    "1": <InvestingSimulationLab />,
    "2": <RiskRewardImmersive />,
    "3": <CompoundInterestImmersive />,
    "4": <StocksBondsImmersive />,
    "5": <DiversificationImmersive />,
    "6": <MarketPsychologyImmersive />,
    "7": <StockValuationCalculator />,
    "8": <Lesson8FinancialStatementsSlides />,
    "9": <Lesson9MoatBuilderSlides />,
    "10": <Lesson10StressTestSlides />,
    "11": <Lesson11LifePathSlides />,
    "12": <DecisionChecklistGrader />,
    "13": <TimedPatternChallenge />,
    "14": <PressureBiasDetector />,
    "15": <OptionsPayoffSandbox />,
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
    // Corporate Finance (51-70)
    "51": <CashFlowAnalysis />,
    "52": <BalanceSheetExplorer />,
    "53": <IncomeStatementLab />,
    "54": <FinancialRatiosToolkit />,
    "55": <CapitalStructureLab />,
    "56": <WorkingCapitalSim />,
    "57": <CorporateGovernanceQuiz />,
    "58": <MergersAcquisitionsSim />,
    "59": <DividendPolicyLab />,
    "60": <WACCCalculator />,
    "61": <CapitalBudgetingLab />,
    "62": <CorporateRestructuringSim />,
    "63": <SECFilingsExplorer />,
    "64": <ForensicAccountingLab />,
    "65": <IndustryAnalysisLab />,
    "66": <RevenueRecognitionLab />,
    "67": <CreditAnalysisLab />,
    "68": <CorporateRiskLab />,
    "69": <ExecCompAnalysis />,
    "70": <CorpFinanceCapstone />,
  };
  return (
    <div className="space-y-6">
      {lessonComponents[lessonId] || null}
    </div>
  );
};

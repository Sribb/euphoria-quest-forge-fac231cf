import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, TrendingUp, TrendingDown, Minus, Check, X, 
  Zap, Globe, Building, DollarSign, Fuel, Cpu, Heart, ShoppingCart
} from "lucide-react";
import { toast } from "sonner";

interface Scenario {
  id: string;
  headline: string;
  description: string;
  category: "economic" | "geopolitical" | "corporate" | "technology" | "consumer";
  correctAnswer: "bullish" | "bearish" | "neutral" | "slightly_bullish" | "slightly_bearish";
  explanation: string;
  affectedSectors: string[];
  difficulty: "easy" | "medium" | "hard";
}

interface MarketReactionGameProps {
  onClose: () => void;
}

const SCENARIOS: Scenario[] = [
  {
    id: "1",
    headline: "Federal Reserve Announces Surprise Rate Cut of 0.5%",
    description: "The Fed unexpectedly cuts interest rates by 50 basis points, citing concerns about economic growth.",
    category: "economic",
    correctAnswer: "bullish",
    explanation: "Rate cuts make borrowing cheaper, stimulating business investment and consumer spending. Lower rates also make stocks more attractive compared to bonds. Markets typically rally on unexpected rate cuts.",
    affectedSectors: ["Banks", "Real Estate", "Tech"],
    difficulty: "easy"
  },
  {
    id: "2",
    headline: "Major Oil Pipeline Shutdown After Cyberattack",
    description: "Hackers have shut down a pipeline supplying 45% of the East Coast's fuel. Recovery timeline unknown.",
    category: "geopolitical",
    correctAnswer: "bearish",
    explanation: "Supply disruptions cause oil prices to spike, increasing costs for transportation and manufacturing. This creates inflation fears and uncertainty, typically causing markets to sell off.",
    affectedSectors: ["Energy", "Transportation", "Airlines"],
    difficulty: "easy"
  },
  {
    id: "3",
    headline: "Apple Reports Record iPhone Sales, Beats Earnings by 20%",
    description: "Apple's quarterly earnings crush expectations with iPhone sales up 35% year-over-year.",
    category: "corporate",
    correctAnswer: "bullish",
    explanation: "Strong earnings from a market leader boost confidence in the entire tech sector. Apple's success suggests strong consumer demand and a healthy economy.",
    affectedSectors: ["Technology", "Consumer Electronics", "Semiconductors"],
    difficulty: "easy"
  },
  {
    id: "4",
    headline: "China Announces New Tariffs on US Agricultural Products",
    description: "Beijing imposes 25% tariffs on soybeans, corn, and wheat imports from the United States.",
    category: "geopolitical",
    correctAnswer: "bearish",
    explanation: "Trade wars create uncertainty and hurt companies that rely on international trade. Farmers and agricultural companies face reduced demand, and retaliatory tariffs often follow.",
    affectedSectors: ["Agriculture", "Manufacturing", "Retail"],
    difficulty: "medium"
  },
  {
    id: "5",
    headline: "Unemployment Rate Drops to 3.2%, Below Expectations",
    description: "The labor market adds 400,000 jobs, far exceeding the 200,000 forecast by economists.",
    category: "economic",
    correctAnswer: "neutral",
    explanation: "While low unemployment is positive, it can signal the Fed may raise rates to prevent inflation. The market reaction depends on whether investors focus on the strong economy or potential rate hikes.",
    affectedSectors: ["Consumer", "Retail", "Services"],
    difficulty: "hard"
  },
  {
    id: "6",
    headline: "Tesla Recalls 500,000 Vehicles Due to Safety Defect",
    description: "A software bug in autopilot systems has caused accidents. Tesla must update all affected vehicles.",
    category: "corporate",
    correctAnswer: "bearish",
    explanation: "Recalls damage brand reputation, create legal liability, and cost money to fix. Investors worry about future sales and potential regulatory crackdowns on autonomous driving.",
    affectedSectors: ["Automotive", "EV Companies", "Insurance"],
    difficulty: "easy"
  },
  {
    id: "7",
    headline: "FDA Approves Revolutionary Cancer Treatment",
    description: "A breakthrough immunotherapy drug shows 90% success rate in clinical trials. Approval granted for immediate use.",
    category: "technology",
    correctAnswer: "bullish",
    explanation: "FDA approval of breakthrough drugs creates massive revenue potential for the pharmaceutical company. It also boosts optimism about the entire biotech sector and medical innovation.",
    affectedSectors: ["Healthcare", "Biotech", "Pharmaceuticals"],
    difficulty: "easy"
  },
  {
    id: "8",
    headline: "European Central Bank Maintains Current Interest Rates",
    description: "The ECB keeps rates unchanged despite inflation concerns, citing fragile economic recovery.",
    category: "economic",
    correctAnswer: "neutral",
    explanation: "Maintaining rates was expected by most analysts. Without a surprise, markets often show little reaction. The decision reflects a 'wait and see' approach that doesn't change the outlook.",
    affectedSectors: ["European Banks", "Euro Currency", "Exporters"],
    difficulty: "medium"
  },
  {
    id: "9",
    headline: "Amazon Announces $50 Billion AI Investment",
    description: "Amazon commits to massive AI infrastructure spending over the next 5 years to compete with Microsoft and Google.",
    category: "technology",
    correctAnswer: "bullish",
    explanation: "Major tech investments signal confidence in future growth. AI is seen as transformational, so companies investing heavily are positioned for long-term success. It also benefits semiconductor and cloud companies.",
    affectedSectors: ["Technology", "Semiconductors", "Cloud Computing"],
    difficulty: "easy"
  },
  {
    id: "10",
    headline: "Housing Starts Fall 15% as Mortgage Rates Hit 8%",
    description: "New home construction drops sharply as high borrowing costs deter buyers and builders.",
    category: "economic",
    correctAnswer: "bearish",
    explanation: "Declining housing activity signals economic weakness. Fewer homes mean less demand for materials, appliances, and furniture. It also suggests consumers are struggling with high rates.",
    affectedSectors: ["Real Estate", "Home Improvement", "Banks"],
    difficulty: "medium"
  },
  {
    id: "11",
    headline: "Russia and Ukraine Announce Ceasefire Agreement",
    description: "After months of negotiation, both nations agree to a 6-month ceasefire with international monitoring.",
    category: "geopolitical",
    correctAnswer: "bullish",
    explanation: "Reduced geopolitical tensions lower risk premiums and energy prices. European markets especially benefit as gas supply concerns ease. Defense stocks might dip but broad markets rally.",
    affectedSectors: ["European Stocks", "Energy", "Defense"],
    difficulty: "medium"
  },
  {
    id: "12",
    headline: "Major Cryptocurrency Exchange Files for Bankruptcy",
    description: "One of the world's largest crypto exchanges collapses, leaving billions in customer funds frozen.",
    category: "corporate",
    correctAnswer: "bearish",
    explanation: "Crypto exchange failures create contagion fears and damage confidence in digital assets. While crypto isn't directly tied to stocks, the fear and uncertainty can spill over into risk assets.",
    affectedSectors: ["Crypto", "Fintech", "Payment Companies"],
    difficulty: "easy"
  },
  {
    id: "13",
    headline: "Consumer Confidence Index Hits 10-Year High",
    description: "Americans are more optimistic about the economy than they've been in a decade, according to the latest survey.",
    category: "consumer",
    correctAnswer: "bullish",
    explanation: "High consumer confidence leads to more spending, driving corporate revenues and economic growth. Retail and consumer discretionary stocks typically benefit the most.",
    affectedSectors: ["Retail", "Consumer Discretionary", "Travel"],
    difficulty: "easy"
  },
  {
    id: "14",
    headline: "OPEC+ Agrees to Cut Oil Production by 2 Million Barrels",
    description: "The oil cartel announces significant supply cuts to support prices amid global economic concerns.",
    category: "economic",
    correctAnswer: "neutral",
    explanation: "Oil cuts are bullish for energy stocks but bearish for consumers and transportation companies facing higher fuel costs. The net effect on broad markets is often muted or mixed.",
    affectedSectors: ["Energy", "Airlines", "Transportation"],
    difficulty: "hard"
  },
  {
    id: "15",
    headline: "US Government Shutdown Enters Third Week",
    description: "Congress fails to pass a spending bill. Federal workers furloughed, national parks closed.",
    category: "geopolitical",
    correctAnswer: "bearish",
    explanation: "Government shutdowns create uncertainty and reduce economic activity. Federal contractors lose revenue, consumer confidence drops, and GDP growth slows. Markets dislike the instability.",
    affectedSectors: ["Defense Contractors", "Travel", "Government Services"],
    difficulty: "medium"
  },
  {
    id: "16",
    headline: "Retail Sales Rise 0.3%, Slightly Below Expectations",
    description: "Monthly retail sales data shows modest growth, coming in just under the 0.5% analyst forecast.",
    category: "economic",
    correctAnswer: "slightly_bearish",
    explanation: "While retail sales did grow, missing expectations slightly suggests consumer spending may be slowing. Markets react mildly negative as it hints at softer economic momentum without being alarming.",
    affectedSectors: ["Retail", "Consumer Discretionary", "E-commerce"],
    difficulty: "medium"
  },
  {
    id: "17",
    headline: "Tech Giant Announces Small Workforce Reduction of 2%",
    description: "A major tech company announces plans to cut 2% of its workforce to improve operational efficiency.",
    category: "corporate",
    correctAnswer: "slightly_bullish",
    explanation: "Small, strategic layoffs are often seen as cost optimization rather than distress. Investors may view this as prudent management, leading to a mildly positive reaction as margins improve.",
    affectedSectors: ["Technology", "Software", "Cloud Services"],
    difficulty: "medium"
  },
  {
    id: "18",
    headline: "Inflation Data Comes in at 2.1%, Just Above 2% Target",
    description: "Consumer Price Index shows inflation at 2.1%, slightly above the Fed's 2% target but within normal range.",
    category: "economic",
    correctAnswer: "slightly_bearish",
    explanation: "Marginally higher inflation isn't alarming but suggests the Fed may delay rate cuts. Markets react with mild concern as it slightly reduces the probability of near-term monetary easing.",
    affectedSectors: ["Bonds", "Rate-Sensitive Stocks", "Real Estate"],
    difficulty: "hard"
  },
  {
    id: "19",
    headline: "Major Airline Reports Better-Than-Expected Travel Demand",
    description: "A leading airline reports summer bookings up 8%, beating forecasts by 3 percentage points.",
    category: "corporate",
    correctAnswer: "slightly_bullish",
    explanation: "Stronger travel demand is positive for airlines and suggests healthy consumer spending. However, it's sector-specific and doesn't dramatically change the broader market outlook.",
    affectedSectors: ["Airlines", "Travel", "Hospitality"],
    difficulty: "easy"
  },
  {
    id: "20",
    headline: "Manufacturing PMI Drops to 49.5, Just Below Expansion Threshold",
    description: "The Purchasing Managers Index for manufacturing comes in at 49.5, slightly below the 50 expansion threshold.",
    category: "economic",
    correctAnswer: "slightly_bearish",
    explanation: "A PMI just below 50 indicates mild contraction in manufacturing. While concerning, being so close to the threshold suggests conditions aren't severely deteriorating.",
    affectedSectors: ["Industrial", "Manufacturing", "Materials"],
    difficulty: "medium"
  },
  {
    id: "21",
    headline: "New Home Sales Tick Up 1.5% Month-Over-Month",
    description: "Housing market shows modest improvement with new home sales rising 1.5% from the previous month.",
    category: "economic",
    correctAnswer: "slightly_bullish",
    explanation: "A small uptick in home sales suggests the housing market may be stabilizing despite high rates. It's a positive signal but not strong enough to dramatically shift market sentiment.",
    affectedSectors: ["Homebuilders", "Real Estate", "Mortgage Lenders"],
    difficulty: "easy"
  },
  {
    id: "22",
    headline: "Major Bank Lowers Q3 GDP Forecast to 2.3% from 2.5%",
    description: "A prominent investment bank slightly reduces its economic growth outlook for the upcoming quarter.",
    category: "economic",
    correctAnswer: "slightly_bearish",
    explanation: "A modest downward revision in GDP expectations suggests economists see somewhat softer growth ahead. It's not alarming but adds a cautionary note to market sentiment.",
    affectedSectors: ["Broad Market", "Cyclical Stocks", "Small Caps"],
    difficulty: "medium"
  },
  {
    id: "23",
    headline: "Semiconductor Company Raises Guidance by 5%",
    description: "A mid-sized chip maker raises its revenue guidance for the next quarter by 5% due to AI demand.",
    category: "technology",
    correctAnswer: "slightly_bullish",
    explanation: "Positive guidance revisions signal confidence and strong demand. While bullish for the sector, a 5% increase from one company has a measured rather than explosive market impact.",
    affectedSectors: ["Semiconductors", "Technology", "AI"],
    difficulty: "easy"
  }
];

export const MarketReactionGame = ({ onClose }: MarketReactionGameProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<"bullish" | "bearish" | "neutral" | "slightly_bullish" | "slightly_bearish" | null>(null);
  const [gameComplete, setGameComplete] = useState(false);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<boolean | null>(null);

  const currentScenario = SCENARIOS[currentIndex];
  const progress = ((currentIndex + 1) / SCENARIOS.length) * 100;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "economic": return <DollarSign className="w-4 h-4" />;
      case "geopolitical": return <Globe className="w-4 h-4" />;
      case "corporate": return <Building className="w-4 h-4" />;
      case "technology": return <Cpu className="w-4 h-4" />;
      case "consumer": return <ShoppingCart className="w-4 h-4" />;
      default: return <Zap className="w-4 h-4" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "bg-success/20 text-success";
      case "medium": return "bg-warning/20 text-warning";
      case "hard": return "bg-destructive/20 text-destructive";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const handleAnswer = (answer: "bullish" | "bearish" | "neutral" | "slightly_bullish" | "slightly_bearish") => {
    setSelectedAnswer(answer);
    const isCorrect = answer === currentScenario.correctAnswer;
    setAnsweredCorrectly(isCorrect);
    
    if (isCorrect) {
      const points = currentScenario.difficulty === "easy" ? 100 : 
                     currentScenario.difficulty === "medium" ? 150 : 200;
      const streakBonus = streak >= 3 ? 50 : 0;
      setScore(prev => prev + points + streakBonus);
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }
    
    setShowResult(true);
  };

  const getAnswerLabel = (answer: string) => {
    const labels: Record<string, string> = {
      bullish: "Bullish",
      bearish: "Bearish",
      neutral: "Neutral",
      slightly_bullish: "Slightly Bullish",
      slightly_bearish: "Slightly Bearish"
    };
    return labels[answer] || answer;
  };

  const handleNext = () => {
    if (currentIndex < SCENARIOS.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setShowResult(false);
      setSelectedAnswer(null);
      setAnsweredCorrectly(null);
    } else {
      setGameComplete(true);
      toast.success(`Game Complete! Final Score: ${score}`);
    }
  };

  const resetGame = () => {
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setShowResult(false);
    setSelectedAnswer(null);
    setGameComplete(false);
    setAnsweredCorrectly(null);
  };

  if (gameComplete) {
    const percentage = Math.round((score / (SCENARIOS.length * 150)) * 100);
    return (
      <div className="min-h-screen bg-background p-4">
        <Card className="max-w-2xl mx-auto p-8 text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-primary flex items-center justify-center">
            <Zap className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold">Game Complete!</h1>
          <div className="text-5xl font-bold text-primary">{score} pts</div>
          <p className="text-muted-foreground">
            You correctly predicted {percentage}% of market reactions
          </p>
          <div className="flex gap-4 justify-center">
            <Button onClick={resetGame} size="lg">
              Play Again
            </Button>
            <Button variant="outline" onClick={onClose} size="lg">
              Back to Games
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={onClose} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Exit Game
        </Button>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="text-lg px-4 py-2">
            Score: {score}
          </Badge>
          {streak >= 3 && (
            <Badge className="bg-warning text-warning-foreground animate-pulse">
              🔥 {streak} Streak!
            </Badge>
          )}
        </div>
      </div>

      {/* Progress */}
      <div className="max-w-2xl mx-auto mb-6">
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>Question {currentIndex + 1} of {SCENARIOS.length}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Scenario Card */}
      <Card className="max-w-2xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge className={getDifficultyColor(currentScenario.difficulty)}>
            {currentScenario.difficulty.toUpperCase()}
          </Badge>
          <Badge variant="outline" className="gap-1">
            {getCategoryIcon(currentScenario.category)}
            {currentScenario.category}
          </Badge>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-3">{currentScenario.headline}</h2>
          <p className="text-muted-foreground">{currentScenario.description}</p>
        </div>

        <div className="text-sm text-muted-foreground">
          <span className="font-medium">Affected Sectors: </span>
          {currentScenario.affectedSectors.join(", ")}
        </div>

        {!showResult ? (
          <div className="space-y-3">
            <p className="font-semibold text-center">How will the market react?</p>
            <div className="grid grid-cols-5 gap-2">
              <Button
                size="lg"
                variant="outline"
                className="flex-col h-24 gap-1 hover:bg-success/10 hover:border-success hover:text-success"
                onClick={() => handleAnswer("bullish")}
              >
                <TrendingUp className="w-6 h-6" />
                <span className="text-xs">Bullish</span>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="flex-col h-24 gap-1 hover:bg-success/5 hover:border-success/50 hover:text-success/80"
                onClick={() => handleAnswer("slightly_bullish")}
              >
                <TrendingUp className="w-5 h-5 opacity-70" />
                <span className="text-xs text-center">Slightly Bullish</span>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="flex-col h-24 gap-1 hover:bg-muted hover:border-muted-foreground"
                onClick={() => handleAnswer("neutral")}
              >
                <Minus className="w-6 h-6" />
                <span className="text-xs">Neutral</span>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="flex-col h-24 gap-1 hover:bg-destructive/5 hover:border-destructive/50 hover:text-destructive/80"
                onClick={() => handleAnswer("slightly_bearish")}
              >
                <TrendingDown className="w-5 h-5 opacity-70" />
                <span className="text-xs text-center">Slightly Bearish</span>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="flex-col h-24 gap-1 hover:bg-destructive/10 hover:border-destructive hover:text-destructive"
                onClick={() => handleAnswer("bearish")}
              >
                <TrendingDown className="w-6 h-6" />
                <span className="text-xs">Bearish</span>
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className={`p-4 rounded-lg flex items-center gap-3 ${
              answeredCorrectly ? 'bg-success/10 border border-success' : 'bg-destructive/10 border border-destructive'
            }`}>
              {answeredCorrectly ? (
                <Check className="w-6 h-6 text-success" />
              ) : (
                <X className="w-6 h-6 text-destructive" />
              )}
              <div>
                <p className="font-bold">
                  {answeredCorrectly ? "Correct!" : "Incorrect"}
                </p>
                <p className="text-sm text-muted-foreground">
                  The market reaction is <span className="font-semibold">{getAnswerLabel(currentScenario.correctAnswer)}</span>
                </p>
              </div>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <p className="font-semibold mb-2">Why?</p>
              <p className="text-sm text-muted-foreground">{currentScenario.explanation}</p>
            </div>

            <Button onClick={handleNext} className="w-full" size="lg">
              {currentIndex < SCENARIOS.length - 1 ? "Next Scenario" : "See Results"}
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

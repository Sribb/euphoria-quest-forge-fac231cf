import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, TrendingUp, TrendingDown, Minus, Check, X, 
  Zap, Globe, Building, DollarSign, Cpu, ShoppingCart,
  Timer, Flame, Trophy, Star, Target, Sparkles
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

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

// Floating particles component
const FloatingParticles = ({ type }: { type: "success" | "error" | "idle" }) => {
  const particles = Array.from({ length: 20 }, (_, i) => i);
  
  if (type === "idle") return null;
  
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((i) => (
        <motion.div
          key={i}
          className={`absolute w-2 h-2 rounded-full ${
            type === "success" ? "bg-success" : "bg-destructive"
          }`}
          initial={{
            x: "50%",
            y: "50%",
            scale: 0,
            opacity: 1
          }}
          animate={{
            x: `${Math.random() * 100}%`,
            y: `${Math.random() * 100}%`,
            scale: [0, 1, 0],
            opacity: [1, 1, 0]
          }}
          transition={{
            duration: 1,
            delay: i * 0.02,
            ease: "easeOut"
          }}
        />
      ))}
    </div>
  );
};

// Score popup animation
const ScorePopup = ({ points, show }: { points: number; show: boolean }) => (
  <AnimatePresence>
    {show && points > 0 && (
      <motion.div
        initial={{ y: 0, opacity: 1, scale: 1 }}
        animate={{ y: -60, opacity: 0, scale: 1.5 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 text-3xl font-black text-success z-50"
      >
        +{points}
      </motion.div>
    )}
  </AnimatePresence>
);

export const MarketReactionGame = ({ onClose }: MarketReactionGameProps) => {
  const [showTutorial, setShowTutorial] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<"bullish" | "bearish" | "neutral" | "slightly_bullish" | "slightly_bearish" | null>(null);
  const [gameComplete, setGameComplete] = useState(false);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<boolean | null>(null);
  const [timeLeft, setTimeLeft] = useState(15);
  const [lastPoints, setLastPoints] = useState(0);
  const [showPointsPopup, setShowPointsPopup] = useState(false);
  const [comboMultiplier, setComboMultiplier] = useState(1);

  const currentScenario = SCENARIOS[currentIndex];
  const progress = ((currentIndex) / SCENARIOS.length) * 100;

  // ALL HOOKS MUST BE BEFORE ANY CONDITIONAL RETURNS
  const handleAnswer = useCallback((answer: "bullish" | "bearish" | "neutral" | "slightly_bullish" | "slightly_bearish") => {
    if (showResult) return;
    
    setSelectedAnswer(answer);
    const isCorrect = answer === currentScenario.correctAnswer;
    setAnsweredCorrectly(isCorrect);
    
    if (isCorrect) {
      const basePoints = currentScenario.difficulty === "easy" ? 100 : 
                         currentScenario.difficulty === "medium" ? 150 : 200;
      const timeBonus = Math.floor(timeLeft * 5);
      const newStreak = streak + 1;
      const newMultiplier = Math.min(1 + (newStreak * 0.25), 3);
      const totalPoints = Math.floor((basePoints + timeBonus) * comboMultiplier);
      
      setScore(prev => prev + totalPoints);
      setStreak(newStreak);
      setComboMultiplier(newMultiplier);
      setLastPoints(totalPoints);
      setShowPointsPopup(true);
      setTimeout(() => setShowPointsPopup(false), 800);
    } else {
      setStreak(0);
      setComboMultiplier(1);
    }
    
    setShowResult(true);
  }, [currentScenario, streak, comboMultiplier, timeLeft, showResult]);

  // Timer effect - MUST be before any conditional returns
  useEffect(() => {
    if (showTutorial || showResult || gameComplete) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleAnswer("neutral"); // Auto-submit neutral if time runs out
          return 15;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentIndex, showResult, gameComplete, showTutorial, handleAnswer]);

  // Tutorial Screen
  if (showTutorial) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4">
        <div className="max-w-2xl mx-auto">
          <Button
            variant="ghost"
            onClick={onClose}
            className="mb-4 gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Games
          </Button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
          >
            {/* Tutorial Card */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-card via-card to-primary/10 border border-border/50 shadow-2xl">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary/20 to-transparent rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-success/20 to-transparent rounded-full blur-2xl" />
              
              <div className="relative p-8">
                {/* Header */}
                <div className="text-center mb-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary/70 mb-4 shadow-lg"
                  >
                    <Target className="w-10 h-10 text-primary-foreground" />
                  </motion.div>
                  <h1 className="text-3xl font-black text-foreground mb-2">How to Play</h1>
                  <p className="text-muted-foreground">Master the market in 3 simple steps</p>
                </div>

                {/* Steps */}
                <div className="space-y-4 mb-8">
                  {[
                    {
                      icon: <Globe className="w-5 h-5" />,
                      title: "Read the News",
                      description: "A market headline appears. Understand what happened.",
                      color: "from-blue-500 to-blue-600"
                    },
                    {
                      icon: <TrendingUp className="w-5 h-5" />,
                      title: "Predict the Reaction",
                      description: "Will markets go up (Bullish), down (Bearish), or stay flat (Neutral)?",
                      color: "from-success to-emerald-600"
                    },
                    {
                      icon: <Timer className="w-5 h-5" />,
                      title: "Beat the Clock",
                      description: "Answer fast! Quicker answers = more bonus points.",
                      color: "from-warning to-orange-600"
                    }
                  ].map((step, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      className="flex items-start gap-4 p-4 rounded-xl bg-background/50 border border-border/30"
                    >
                      <div className={`flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white shadow-md`}>
                        {step.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground">{step.title}</h3>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Scoring Tips */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="p-4 rounded-xl bg-primary/10 border border-primary/20 mb-6"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Flame className="w-5 h-5 text-primary" />
                    <span className="font-bold text-foreground">Pro Tips</span>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li className="flex items-center gap-2">
                      <Sparkles className="w-3 h-3 text-warning" />
                      Build streaks for up to 3x score multiplier
                    </li>
                    <li className="flex items-center gap-2">
                      <Star className="w-3 h-3 text-warning" />
                      Harder questions = more points
                    </li>
                  </ul>
                </motion.div>

                {/* Start Button */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <Button
                    onClick={() => setShowTutorial(false)}
                    className="w-full h-14 text-lg font-bold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg gap-2"
                  >
                    <Zap className="w-5 h-5" />
                    Start Game
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "economic": return <DollarSign className="w-5 h-5" />;
      case "geopolitical": return <Globe className="w-5 h-5" />;
      case "corporate": return <Building className="w-5 h-5" />;
      case "technology": return <Cpu className="w-5 h-5" />;
      case "consumer": return <ShoppingCart className="w-5 h-5" />;
      default: return <Zap className="w-5 h-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "economic": return "from-emerald-500 to-emerald-700";
      case "geopolitical": return "from-blue-500 to-blue-700";
      case "corporate": return "from-purple-500 to-purple-700";
      case "technology": return "from-cyan-500 to-cyan-700";
      case "consumer": return "from-orange-500 to-orange-700";
      default: return "from-primary to-primary/70";
    }
  };

  const getDifficultyStars = (difficulty: string) => {
    const count = difficulty === "easy" ? 1 : difficulty === "medium" ? 2 : 3;
    return Array.from({ length: 3 }, (_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${i < count ? "fill-warning text-warning" : "text-muted-foreground/30"}`} 
      />
    ));
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
      setTimeLeft(15);
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
    setTimeLeft(15);
    setComboMultiplier(1);
  };

  // Game complete screen
  if (gameComplete) {
    const maxPossibleScore = SCENARIOS.reduce((acc, s) => {
      const base = s.difficulty === "easy" ? 100 : s.difficulty === "medium" ? 150 : 200;
      return acc + (base + 75) * 3; // max time bonus + max multiplier
    }, 0);
    const percentage = Math.round((score / maxPossibleScore) * 100);
    const grade = percentage >= 80 ? "S" : percentage >= 60 ? "A" : percentage >= 40 ? "B" : percentage >= 20 ? "C" : "D";
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative max-w-lg w-full"
        >
          {/* Decorative background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-success/20 rounded-3xl blur-xl" />
          
          <div className="relative bg-card/80 backdrop-blur-xl border border-border/50 rounded-3xl p-8 text-center space-y-6">
            {/* Trophy icon */}
            <motion.div
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ type: "spring", bounce: 0.5 }}
              className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-warning via-warning/80 to-orange-600 flex items-center justify-center shadow-2xl shadow-warning/30"
            >
              <Trophy className="w-12 h-12 text-white" />
            </motion.div>

            <div>
              <h1 className="text-4xl font-black bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                GAME COMPLETE
              </h1>
              <p className="text-muted-foreground mt-2">Market Reaction Challenge</p>
            </div>

            {/* Grade badge */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl text-4xl font-black ${
                grade === "S" ? "bg-gradient-to-br from-warning to-orange-600 text-white" :
                grade === "A" ? "bg-gradient-to-br from-success to-emerald-600 text-white" :
                "bg-gradient-to-br from-muted to-muted-foreground/20 text-foreground"
              }`}
            >
              {grade}
            </motion.div>

            {/* Score */}
            <div className="space-y-1">
              <div className="text-6xl font-black text-primary">{score.toLocaleString()}</div>
              <p className="text-sm text-muted-foreground">TOTAL POINTS</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="bg-muted/50 rounded-xl p-4">
                <div className="text-2xl font-bold text-foreground">{SCENARIOS.length}</div>
                <div className="text-xs text-muted-foreground">Scenarios</div>
              </div>
              <div className="bg-muted/50 rounded-xl p-4">
                <div className="text-2xl font-bold text-foreground">{percentage}%</div>
                <div className="text-xs text-muted-foreground">Accuracy</div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button 
                onClick={resetGame} 
                size="lg" 
                className="flex-1 h-14 text-lg font-bold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Play Again
              </Button>
              <Button 
                variant="outline" 
                onClick={onClose} 
                size="lg" 
                className="flex-1 h-14 text-lg font-bold"
              >
                Exit
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5 p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-success/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between mb-6 max-w-4xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={onClose} 
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="hidden sm:inline">Exit Game</span>
        </Button>

        <div className="flex items-center gap-3">
          {/* Combo indicator */}
          {comboMultiplier > 1 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-warning/20 border border-warning/30"
            >
              <Flame className="w-4 h-4 text-warning" />
              <span className="text-sm font-bold text-warning">{comboMultiplier.toFixed(2)}x</span>
            </motion.div>
          )}

          {/* Streak indicator */}
          {streak >= 2 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-destructive/20 border border-destructive/30"
            >
              <Zap className="w-4 h-4 text-destructive animate-pulse" />
              <span className="text-sm font-bold text-destructive">{streak} Streak</span>
            </motion.div>
          )}

          {/* Score display */}
          <div className="relative">
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-card/80 backdrop-blur border border-border/50">
              <Target className="w-5 h-5 text-primary" />
              <span className="text-xl font-black text-foreground">{score.toLocaleString()}</span>
            </div>
            <ScorePopup points={lastPoints} show={showPointsPopup} />
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative z-10 max-w-4xl mx-auto mb-8">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
          <span className="font-medium">Round {currentIndex + 1} of {SCENARIOS.length}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary via-primary to-success rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Main game card */}
      <motion.div
        key={currentIndex}
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -50, opacity: 0 }}
        className="relative z-10 max-w-4xl mx-auto"
      >
        <div className="relative">
          {/* Particle effects on answer */}
          <FloatingParticles type={answeredCorrectly === null ? "idle" : answeredCorrectly ? "success" : "error"} />

          <div className="relative bg-card/80 backdrop-blur-xl border border-border/50 rounded-3xl overflow-hidden">
            {/* Timer bar at top */}
            {!showResult && (
              <div className="h-1.5 bg-muted/30">
                <motion.div
                  className={`h-full transition-colors ${
                    timeLeft > 10 ? "bg-success" : timeLeft > 5 ? "bg-warning" : "bg-destructive"
                  }`}
                  initial={{ width: "100%" }}
                  animate={{ width: `${(timeLeft / 15) * 100}%` }}
                  transition={{ duration: 1, ease: "linear" }}
                />
              </div>
            )}

            <div className="p-6 md:p-8 space-y-6">
              {/* Category and difficulty header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl bg-gradient-to-br ${getCategoryColor(currentScenario.category)}`}>
                    {getCategoryIcon(currentScenario.category)}
                  </div>
                  <div>
                    <span className="text-sm font-medium text-foreground capitalize">
                      {currentScenario.category}
                    </span>
                    <div className="flex gap-0.5 mt-0.5">
                      {getDifficultyStars(currentScenario.difficulty)}
                    </div>
                  </div>
                </div>

                {/* Timer */}
                {!showResult && (
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${
                    timeLeft > 10 ? "bg-muted/50" : timeLeft > 5 ? "bg-warning/20" : "bg-destructive/20 animate-pulse"
                  }`}>
                    <Timer className={`w-5 h-5 ${
                      timeLeft > 10 ? "text-muted-foreground" : timeLeft > 5 ? "text-warning" : "text-destructive"
                    }`} />
                    <span className={`text-xl font-bold tabular-nums ${
                      timeLeft > 10 ? "text-foreground" : timeLeft > 5 ? "text-warning" : "text-destructive"
                    }`}>
                      {timeLeft}s
                    </span>
                  </div>
                )}
              </div>

              {/* Headline */}
              <div className="space-y-3">
                <h2 className="text-2xl md:text-3xl font-black text-foreground leading-tight">
                  {currentScenario.headline}
                </h2>
                <p className="text-muted-foreground text-lg">
                  {currentScenario.description}
                </p>
              </div>

              {/* Affected sectors */}
              <div className="flex flex-wrap gap-2">
                {currentScenario.affectedSectors.map((sector, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-full text-xs font-medium bg-muted/50 text-muted-foreground border border-border/50"
                  >
                    {sector}
                  </span>
                ))}
              </div>

              {/* Answer buttons or result */}
              {!showResult ? (
                <div className="space-y-4">
                  <p className="text-center text-lg font-semibold text-foreground">
                    How will the market react?
                  </p>
                  <div className="grid grid-cols-5 gap-2 md:gap-3">
                    {[
                      { key: "bullish", label: "Bullish", icon: TrendingUp, color: "success", intensity: "full" },
                      { key: "slightly_bullish", label: "Slightly Bullish", icon: TrendingUp, color: "success", intensity: "light" },
                      { key: "neutral", label: "Neutral", icon: Minus, color: "muted", intensity: "full" },
                      { key: "slightly_bearish", label: "Slightly Bearish", icon: TrendingDown, color: "destructive", intensity: "light" },
                      { key: "bearish", label: "Bearish", icon: TrendingDown, color: "destructive", intensity: "full" }
                    ].map(({ key, label, icon: Icon, color, intensity }) => (
                      <motion.button
                        key={key}
                        whileHover={{ scale: 1.05, y: -4 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleAnswer(key as any)}
                        className={`
                          relative flex flex-col items-center justify-center gap-2 p-4 md:p-6 rounded-2xl
                          border-2 transition-all duration-200 cursor-pointer
                          ${intensity === "full" 
                            ? `bg-${color}/10 border-${color}/30 hover:bg-${color}/20 hover:border-${color}/50` 
                            : `bg-${color}/5 border-${color}/20 hover:bg-${color}/10 hover:border-${color}/30`
                          }
                        `}
                        style={{
                          background: color === "success" 
                            ? intensity === "full" ? "rgba(34, 197, 94, 0.1)" : "rgba(34, 197, 94, 0.05)"
                            : color === "destructive" 
                            ? intensity === "full" ? "rgba(239, 68, 68, 0.1)" : "rgba(239, 68, 68, 0.05)"
                            : "rgba(100, 100, 100, 0.1)",
                          borderColor: color === "success" 
                            ? intensity === "full" ? "rgba(34, 197, 94, 0.3)" : "rgba(34, 197, 94, 0.2)"
                            : color === "destructive" 
                            ? intensity === "full" ? "rgba(239, 68, 68, 0.3)" : "rgba(239, 68, 68, 0.2)"
                            : "rgba(100, 100, 100, 0.3)",
                        }}
                      >
                        <Icon 
                          className={`w-6 h-6 md:w-8 md:h-8 ${
                            color === "success" ? "text-success" : 
                            color === "destructive" ? "text-destructive" : 
                            "text-muted-foreground"
                          } ${intensity === "light" ? "opacity-70" : ""}`} 
                        />
                        <span className={`text-xs md:text-sm font-medium text-center ${
                          color === "success" ? "text-success" : 
                          color === "destructive" ? "text-destructive" : 
                          "text-muted-foreground"
                        }`}>
                          {label}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  {/* Result banner */}
                  <div className={`p-5 rounded-2xl flex items-center gap-4 ${
                    answeredCorrectly 
                      ? 'bg-success/10 border-2 border-success/30' 
                      : 'bg-destructive/10 border-2 border-destructive/30'
                  }`}>
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                      answeredCorrectly ? "bg-success" : "bg-destructive"
                    }`}>
                      {answeredCorrectly ? (
                        <Check className="w-8 h-8 text-white" />
                      ) : (
                        <X className="w-8 h-8 text-white" />
                      )}
                    </div>
                    <div>
                      <p className={`text-xl font-black ${
                        answeredCorrectly ? "text-success" : "text-destructive"
                      }`}>
                        {answeredCorrectly ? "CORRECT!" : "INCORRECT"}
                      </p>
                      <p className="text-muted-foreground">
                        The market reaction is{" "}
                        <span className="font-bold text-foreground">
                          {getAnswerLabel(currentScenario.correctAnswer)}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Explanation */}
                  <div className="p-5 bg-muted/30 rounded-2xl border border-border/50">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="w-5 h-5 text-primary" />
                      <p className="font-bold text-foreground">Why?</p>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {currentScenario.explanation}
                    </p>
                  </div>

                  {/* Next button */}
                  <Button 
                    onClick={handleNext} 
                    size="lg" 
                    className="w-full h-14 text-lg font-bold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 rounded-xl"
                  >
                    {currentIndex < SCENARIOS.length - 1 ? "Next Scenario" : "See Results"}
                  </Button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

import { useState, useEffect } from "react";
import { SliderSimulator } from "../interactive/SliderSimulator";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowRight, 
  CheckCircle,
  Target,
  TrendingDown,
  AlertTriangle,
  Lightbulb,
  Activity,
  Shield,
  Coins
} from "lucide-react";

type Slide = 1 | 2 | 3 | 4;

interface Lesson19Props {
  onComplete?: () => void;
}

const reflectionQuestions = [
  {
    question: "What is blockchain technology?",
    options: [
      { text: "A decentralized digital ledger that records transactions across many computers", correct: true },
      { text: "A type of bank account for storing cryptocurrency", correct: false },
      { text: "A government-regulated payment system", correct: false },
    ],
  },
  {
    question: "Why is cryptocurrency considered high-risk?",
    options: [
      { text: "It is backed by the government", correct: false },
      { text: "Its price can swing dramatically in short periods due to extreme volatility", correct: true },
      { text: "It always loses value over time", correct: false },
    ],
  },
  {
    question: "What is the best approach to crypto in a portfolio?",
    options: [
      { text: "Invest everything for maximum returns", correct: false },
      { text: "Avoid it completely — it's too risky", correct: false },
      { text: "Use strict position sizing and only invest what you can afford to lose", correct: true },
    ],
  },
];

export const Lesson19VolatilitySlides = ({ onComplete }: Lesson19Props) => {
  const [currentSlide, setCurrentSlide] = useState<Slide>(1);
  const [portfolioValue, setPortfolioValue] = useState(10000);
  const [peak, setPeak] = useState(10000);
  const [drawdown, setDrawdown] = useState(0);
  const [maxDrawdown, setMaxDrawdown] = useState(0);
  const [history, setHistory] = useState<number[]>([10000]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [reflectionIndex, setReflectionIndex] = useState(0);
  const [reflectionAnswers, setReflectionAnswers] = useState<boolean[]>([]);

  useEffect(() => {
    if (isSimulating && currentSlide === 1) {
      const interval = setInterval(() => {
        setPortfolioValue((prev) => {
          // Crypto-level volatility: bigger swings than traditional assets
          const change = (Math.random() - 0.47) * 0.08;
          const newValue = prev * (1 + change);
          
          setHistory((h) => [...h.slice(-50), newValue]);
          
          if (newValue > peak) {
            setPeak(newValue);
          }
          
          const currentDrawdown = ((peak - newValue) / peak) * 100;
          setDrawdown(Math.max(0, currentDrawdown));
          
          if (currentDrawdown > maxDrawdown) {
            setMaxDrawdown(currentDrawdown);
          }
          
          return newValue;
        });
      }, 200);
      
      return () => clearInterval(interval);
    }
  }, [isSimulating, peak, maxDrawdown, currentSlide]);

  const handleReflectionAnswer = (isCorrect: boolean) => {
    setReflectionAnswers([...reflectionAnswers, isCorrect]);
    if (reflectionIndex < reflectionQuestions.length - 1) {
      setTimeout(() => setReflectionIndex(reflectionIndex + 1), 1000);
    }
  };

  const resetSimulation = () => {
    setPortfolioValue(10000);
    setPeak(10000);
    setDrawdown(0);
    setMaxDrawdown(0);
    setHistory([10000]);
  };

  const nextSlide = () => {
    if (currentSlide < 4) {
      setCurrentSlide((currentSlide + 1) as Slide);
    } else {
      onComplete?.();
    }
  };

  const slideLabels = ["Explore", "Simulate", "Quiz", "Apply"];
  const totalReturn = ((portfolioValue - 10000) / 10000) * 100;

  return (
    <div className="space-y-6">
      {/* Progress indicator */}
      <div className="flex justify-center gap-2 mb-4">
        {[1, 2, 3, 4].map((slide) => (
          <div key={slide} className="flex flex-col items-center">
            <motion.div
              className={`h-2 rounded-full transition-all duration-300 ${
                slide === currentSlide ? "w-8 bg-primary" : slide < currentSlide ? "w-4 bg-primary/50" : "w-4 bg-muted"
              }`}
            />
            <span className={`text-xs mt-1 ${slide === currentSlide ? "text-primary font-medium" : "text-muted-foreground"}`}>
              {slideLabels[slide - 1]}
            </span>
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Slide 1: What is Cryptocurrency? */}
        {currentSlide === 1 && (
          <motion.div
            key="slide1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-8">
              <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">Explore</Badge>
              
              <h2 className="text-2xl font-bold mb-2">Cryptocurrency Basics</h2>
              <p className="text-muted-foreground mb-6">
                Cryptocurrency is a digital asset built on <span className="text-primary font-semibold">blockchain technology</span> — a decentralized ledger that records transactions across thousands of computers.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="p-5 rounded-xl bg-amber-500/10 border border-amber-500/30"
                >
                  <Coins className="w-8 h-8 text-amber-500 mb-2" />
                  <h3 className="font-bold mb-1">Bitcoin (BTC)</h3>
                  <p className="text-sm text-muted-foreground">The first and largest cryptocurrency. Created in 2009 as a peer-to-peer digital currency with a fixed supply of 21 million coins.</p>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="p-5 rounded-xl bg-blue-500/10 border border-blue-500/30"
                >
                  <Activity className="w-8 h-8 text-blue-500 mb-2" />
                  <h3 className="font-bold mb-1">Ethereum (ETH)</h3>
                  <p className="text-sm text-muted-foreground">A programmable blockchain enabling smart contracts and decentralized apps (dApps). Powers DeFi and NFTs.</p>
                </motion.div>
              </div>

              <div className="space-y-3 mb-6">
                {[
                  { label: "Decentralization", desc: "No single entity controls the network" },
                  { label: "Transparency", desc: "All transactions are publicly verifiable on the blockchain" },
                  { label: "Extreme Volatility", desc: "Prices can swing 20-50% in days — far more than stocks" },
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + idx * 0.1 }}
                    className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border"
                  >
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                    <div>
                      <span className="font-medium">{item.label}:</span>{" "}
                      <span className="text-muted-foreground text-sm">{item.desc}</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="flex justify-center">
                <Button onClick={nextSlide} size="lg" className="gap-2">
                  Try the Volatility Simulator <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Slide 2: Crypto Volatility Roller Coaster */}
        {currentSlide === 2 && (
          <motion.div
            key="slide2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-8">
              <Badge className="mb-4 bg-amber-500/20 text-amber-400 border-amber-500/30">Simulate</Badge>
              
              <h2 className="text-2xl font-bold mb-2">Crypto Volatility Roller Coaster</h2>
              <p className="text-muted-foreground mb-6">
                Watch a $10,000 crypto portfolio swing wildly in real-time. This is what crypto volatility <em>feels</em> like.
              </p>

              {/* Control Buttons */}
              <div className="flex gap-3 mb-6">
                <Button 
                  onClick={() => setIsSimulating(!isSimulating)}
                  variant={isSimulating ? "destructive" : "default"}
                >
                  {isSimulating ? "Stop" : "Start"} Simulation
                </Button>
                <Button variant="outline" onClick={resetSimulation}>
                  Reset
                </Button>
              </div>

              {/* Portfolio Chart */}
              <Card className="p-4 bg-muted/50 mb-6">
                <div className="h-40 flex items-end gap-0.5 overflow-hidden">
                  {history.map((value, idx) => {
                    const height = ((value - 5000) / 15000) * 100;
                    const isUp = idx > 0 && value > history[idx - 1];
                    return (
                      <motion.div
                        key={idx}
                        initial={{ height: 0 }}
                        animate={{ height: `${Math.max(5, Math.min(100, height))}%` }}
                        className={`flex-1 min-w-[4px] rounded-t ${isUp ? "bg-emerald-500" : "bg-destructive"}`}
                      />
                    );
                  })}
                </div>
              </Card>

              {/* Stats Grid */}
              <div className="grid grid-cols-4 gap-3 mb-6">
                <div className="p-3 rounded-xl bg-background border text-center">
                  <p className="text-xs text-muted-foreground">Portfolio</p>
                  <p className="text-lg font-bold">${portfolioValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                </div>
                <div className={`p-3 rounded-xl text-center ${totalReturn >= 0 ? "bg-emerald-500/10 border-emerald-500/30" : "bg-destructive/10 border-destructive/30"} border`}>
                  <p className="text-xs text-muted-foreground">Return</p>
                  <p className={`text-lg font-bold ${totalReturn >= 0 ? "text-emerald-500" : "text-destructive"}`}>
                    {totalReturn >= 0 ? "+" : ""}{totalReturn.toFixed(1)}%
                  </p>
                </div>
                <div className={`p-3 rounded-xl text-center ${drawdown > 10 ? "bg-destructive/10 border-destructive/30" : "bg-amber-500/10 border-amber-500/30"} border`}>
                  <p className="text-xs text-muted-foreground">Drawdown</p>
                  <p className={`text-lg font-bold ${drawdown > 10 ? "text-destructive" : "text-amber-500"}`}>
                    -{drawdown.toFixed(1)}%
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/30 text-center">
                  <p className="text-xs text-muted-foreground">Max Drop</p>
                  <p className="text-lg font-bold text-destructive">-{maxDrawdown.toFixed(1)}%</p>
                </div>
              </div>

              {/* Drawdown Meter */}
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <Activity className="w-4 h-4" /> Drawdown Severity
                  </span>
                  <span className={`text-sm font-bold ${
                    drawdown < 5 ? "text-emerald-500" : drawdown < 10 ? "text-amber-500" : drawdown < 20 ? "text-orange-500" : "text-destructive"
                  }`}>
                    {drawdown < 5 ? "Normal" : drawdown < 10 ? "Moderate" : drawdown < 20 ? "Significant" : "Severe"}
                  </span>
                </div>
                <Progress value={Math.min(drawdown * 3, 100)} className="h-3" />
              </div>

              {maxDrawdown > 15 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl bg-destructive/20 border border-destructive/50 mb-6"
                >
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-6 h-6 text-destructive" />
                    <div>
                      <p className="font-bold text-destructive">Significant Crash!</p>
                      <p className="text-sm text-muted-foreground">Bitcoin dropped ~80% in 2018 and ~75% in 2022. These crashes are normal in crypto. Could you hold through this?</p>
                    </div>
                  </div>
                </motion.div>
              )}

              <div className="flex justify-center">
                <Button onClick={nextSlide} size="lg" className="gap-2">
                  Continue to Quiz <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Slide 3: Quiz */}
        {currentSlide === 3 && (
          <motion.div
            key="slide3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-8">
              <Badge className="mb-4 bg-amber-500/20 text-amber-400 border-amber-500/30">Quiz</Badge>
              
              <h2 className="text-2xl font-bold text-center mb-2">Crypto Knowledge Check</h2>
              <p className="text-center text-muted-foreground mb-8">Test your understanding of cryptocurrency basics</p>

              <Card className="p-6 bg-muted/50 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="w-5 h-5 text-amber-500" />
                  <span className="text-sm text-muted-foreground">Question {reflectionIndex + 1} of {reflectionQuestions.length}</span>
                </div>
                
                <h3 className="font-bold text-lg mb-6">{reflectionQuestions[reflectionIndex].question}</h3>
                
                <div className="space-y-3">
                  {reflectionQuestions[reflectionIndex].options.map((option, idx) => (
                    <motion.button
                      key={idx}
                      onClick={() => handleReflectionAnswer(option.correct)}
                      className={`w-full p-4 rounded-xl text-left border-2 transition-all ${
                        reflectionAnswers[reflectionIndex] !== undefined
                          ? option.correct ? "border-emerald-500 bg-emerald-500/10" : "border-border opacity-50"
                          : "border-border hover:border-primary"
                      }`}
                      disabled={reflectionAnswers[reflectionIndex] !== undefined}
                      whileHover={reflectionAnswers[reflectionIndex] === undefined ? { scale: 1.02 } : {}}
                    >
                      {option.text}
                      {reflectionAnswers[reflectionIndex] !== undefined && option.correct && (
                        <CheckCircle className="w-5 h-5 text-emerald-500 inline ml-2" />
                      )}
                    </motion.button>
                  ))}
                </div>
              </Card>

              <div className="flex justify-center gap-2 mb-8">
                {reflectionQuestions.map((_, idx) => (
                  <div key={idx} className={`w-3 h-3 rounded-full ${idx === reflectionIndex ? "bg-primary scale-125" : reflectionAnswers[idx] !== undefined ? "bg-emerald-500" : "bg-muted"}`} />
                ))}
              </div>

              <div className="flex justify-center">
                <Button onClick={nextSlide} size="lg" className="gap-2" disabled={reflectionAnswers.length < reflectionQuestions.length}>
                  Continue <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Slide 4: Apply - Position Sizing */}
        {currentSlide === 4 && (
          <motion.div
            key="slide4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-8">
              <Badge className="mb-4 bg-purple-500/20 text-purple-400 border-purple-500/30">Apply</Badge>
              
              <h2 className="text-2xl font-bold text-center mb-2">Crypto Position Sizing</h2>
              <p className="text-center text-muted-foreground mb-8">How much of your portfolio should be in crypto?</p>

              <div className="grid gap-4 mb-6">
                {[
                  {
                    title: "High Risk, High Volatility",
                    description: "Crypto can drop 50-80% in a bear market. Only invest money you can afford to lose entirely.",
                    icon: AlertTriangle,
                  },
                  {
                    title: "Position Sizing Matters",
                    description: "Most financial advisors suggest limiting crypto to 1-5% of your total portfolio to manage risk.",
                    icon: Shield,
                  },
                  {
                    title: "Never Chase the Hype",
                    description: "The biggest crypto gains often reverse just as quickly. FOMO is the most expensive emotion in crypto.",
                    icon: TrendingDown,
                  },
                ].map((insight, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.2 }}
                    className="p-5 rounded-xl bg-muted/50 border"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <insight.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold mb-1">{insight.title}</h3>
                        <p className="text-sm text-muted-foreground">{insight.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Crypto Allocation Simulator */}
              <SliderSimulator
                title="📊 Crypto Allocation Impact"
                description="See how crypto allocation affects your portfolio's risk:"
                sliders={[
                  { id: "portfolio", label: "Total Portfolio", min: 10000, max: 500000, step: 10000, defaultValue: 100000, unit: "$" },
                  { id: "cryptoPct", label: "Crypto Allocation", min: 0, max: 30, step: 1, defaultValue: 5, unit: "%" },
                ]}
                calculateResult={(vals) => {
                  const cryptoAmount = Math.round(vals.portfolio * vals.cryptoPct / 100);
                  const worstCase = Math.round(cryptoAmount * 0.2); // 80% crash
                  const portfolioLoss = Math.round((cryptoAmount - worstCase) / vals.portfolio * 100);
                  return {
                    primary: `$${cryptoAmount.toLocaleString()} in crypto`,
                    secondary: `Worst case (80% crash): lose $${(cryptoAmount - worstCase).toLocaleString()} = ${portfolioLoss}% of total portfolio`,
                    insight: vals.cryptoPct <= 5 ? "Conservative — manageable even in a crash." : vals.cryptoPct <= 15 ? "Moderate risk — significant loss potential in a crash." : "Aggressive — a crypto crash could seriously damage your portfolio!",
                  };
                }}
              />

              <Card className="p-4 bg-emerald-500/10 border border-emerald-500/30 mb-6 mt-4">
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-emerald-500 mt-1" />
                  <div>
                    <h4 className="font-bold text-emerald-500">Key Takeaway</h4>
                    <p className="text-sm text-muted-foreground">
                      Cryptocurrency is a high-risk, high-volatility asset. It should only be a small, carefully sized portion of a diversified portfolio. Never invest more than you can afford to lose.
                    </p>
                  </div>
                </div>
              </Card>

              <div className="flex justify-center">
                <Button onClick={nextSlide} size="lg" className="gap-2">
                  Complete Lesson <CheckCircle className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

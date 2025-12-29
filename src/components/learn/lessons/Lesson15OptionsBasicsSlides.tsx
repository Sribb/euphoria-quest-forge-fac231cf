import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { 
  ArrowRight, 
  CheckCircle,
  Target,
  TrendingUp,
  TrendingDown,
  DollarSign,
  AlertTriangle,
  Lightbulb,
  BarChart3
} from "lucide-react";

type Slide = 1 | 2 | 3 | 4;

interface Lesson15Props {
  onComplete?: () => void;
}

const reflectionQuestions = [
  {
    question: "What is the maximum loss when buying a call option?",
    options: [
      { text: "Unlimited", correct: false },
      { text: "The premium paid", correct: true },
      { text: "The strike price", correct: false },
    ],
  },
  {
    question: "When would you buy a put option?",
    options: [
      { text: "When you expect the stock to go up", correct: false },
      { text: "When you expect the stock to go down or want protection", correct: true },
      { text: "When you're unsure about direction", correct: false },
    ],
  },
  {
    question: "What happens to an option's value as expiration approaches?",
    options: [
      { text: "It gains value from time decay", correct: false },
      { text: "Nothing changes", correct: false },
      { text: "It loses value from time decay (theta)", correct: true },
    ],
  },
];

export const Lesson15OptionsBasicsSlides = ({ onComplete }: Lesson15Props) => {
  const [currentSlide, setCurrentSlide] = useState<Slide>(1);
  const [stockPrice, setStockPrice] = useState(100);
  const [strikePrice] = useState(100);
  const [premium] = useState(5);
  const [optionType, setOptionType] = useState<"call" | "put">("call");
  const [reflectionIndex, setReflectionIndex] = useState(0);
  const [reflectionAnswers, setReflectionAnswers] = useState<boolean[]>([]);

  const calculatePayoff = () => {
    if (optionType === "call") {
      const intrinsicValue = Math.max(0, stockPrice - strikePrice);
      return intrinsicValue - premium;
    } else {
      const intrinsicValue = Math.max(0, strikePrice - stockPrice);
      return intrinsicValue - premium;
    }
  };

  const payoff = calculatePayoff();
  const breakeven = optionType === "call" ? strikePrice + premium : strikePrice - premium;

  const handleReflectionAnswer = (isCorrect: boolean) => {
    setReflectionAnswers([...reflectionAnswers, isCorrect]);
    if (reflectionIndex < reflectionQuestions.length - 1) {
      setTimeout(() => setReflectionIndex(reflectionIndex + 1), 1000);
    }
  };

  const nextSlide = () => {
    if (currentSlide < 4) {
      setCurrentSlide((currentSlide + 1) as Slide);
    } else {
      onComplete?.();
    }
  };

  const slideLabels = ["Experience", "Reflect", "Insight", "Apply"];

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
        {/* Slide 1: Experience - Options Payoff Sandbox */}
        {currentSlide === 1 && (
          <motion.div
            key="slide1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-8">
              <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">Experience</Badge>
              
              <h2 className="text-2xl font-bold mb-2">Options Payoff Sandbox</h2>
              <p className="text-muted-foreground mb-6">
                Options give you the right (not obligation) to buy or sell at a set price. Explore how payoffs work.
              </p>

              {/* Option Type Toggle */}
              <div className="flex gap-4 mb-6">
                <motion.button
                  onClick={() => setOptionType("call")}
                  className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                    optionType === "call" ? "border-emerald-500 bg-emerald-500/10" : "border-border"
                  }`}
                  whileHover={{ scale: 1.02 }}
                >
                  <TrendingUp className={`w-6 h-6 mx-auto mb-2 ${optionType === "call" ? "text-emerald-500" : "text-muted-foreground"}`} />
                  <p className="font-bold">Call Option</p>
                  <p className="text-xs text-muted-foreground">Right to BUY</p>
                </motion.button>
                <motion.button
                  onClick={() => setOptionType("put")}
                  className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                    optionType === "put" ? "border-destructive bg-destructive/10" : "border-border"
                  }`}
                  whileHover={{ scale: 1.02 }}
                >
                  <TrendingDown className={`w-6 h-6 mx-auto mb-2 ${optionType === "put" ? "text-destructive" : "text-muted-foreground"}`} />
                  <p className="font-bold">Put Option</p>
                  <p className="text-xs text-muted-foreground">Right to SELL</p>
                </motion.button>
              </div>

              {/* Parameters Display */}
              <Card className="p-6 bg-muted/50 mb-6">
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-3 rounded-xl bg-background border">
                    <p className="text-xs text-muted-foreground">Strike Price</p>
                    <p className="text-xl font-bold">${strikePrice}</p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-background border">
                    <p className="text-xs text-muted-foreground">Premium Paid</p>
                    <p className="text-xl font-bold">${premium}</p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-background border">
                    <p className="text-xs text-muted-foreground">Breakeven</p>
                    <p className="text-xl font-bold">${breakeven}</p>
                  </div>
                </div>

                {/* Stock Price Slider */}
                <div className="mb-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Stock Price at Expiration</span>
                    <span className="font-bold text-lg">${stockPrice}</span>
                  </div>
                  <Slider
                    value={[stockPrice]}
                    onValueChange={(value) => setStockPrice(value[0])}
                    min={70}
                    max={130}
                    step={1}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>$70</span>
                    <span>$100 (Strike)</span>
                    <span>$130</span>
                  </div>
                </div>

                {/* Payoff Display */}
                <div className={`p-6 rounded-xl text-center ${
                  payoff >= 0 ? "bg-emerald-500/20 border border-emerald-500/50" : "bg-destructive/20 border border-destructive/50"
                }`}>
                  <DollarSign className={`w-8 h-8 mx-auto mb-2 ${payoff >= 0 ? "text-emerald-500" : "text-destructive"}`} />
                  <p className="text-sm text-muted-foreground mb-1">Your Profit/Loss</p>
                  <p className={`text-4xl font-bold ${payoff >= 0 ? "text-emerald-500" : "text-destructive"}`}>
                    {payoff >= 0 ? "+" : ""}{payoff.toFixed(2)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {optionType === "call" 
                      ? stockPrice > strikePrice 
                        ? `Exercised: Bought at $${strikePrice}, worth $${stockPrice}` 
                        : "Expired worthless—only lost premium"
                      : stockPrice < strikePrice
                        ? `Exercised: Sold at $${strikePrice}, stock worth $${stockPrice}`
                        : "Expired worthless—only lost premium"
                    }
                  </p>
                </div>
              </Card>

              <div className="flex justify-center">
                <Button onClick={nextSlide} size="lg" className="gap-2">
                  Continue to Reflect <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Slide 2: Reflect */}
        {currentSlide === 2 && (
          <motion.div
            key="slide2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-8">
              <Badge className="mb-4 bg-amber-500/20 text-amber-400 border-amber-500/30">Reflect</Badge>
              
              <h2 className="text-2xl font-bold text-center mb-2">Understanding Options</h2>
              <p className="text-center text-muted-foreground mb-8">Test your understanding</p>

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
                  Continue to Insight <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Slide 3: Insight */}
        {currentSlide === 3 && (
          <motion.div
            key="slide3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-8">
              <Badge className="mb-4 bg-blue-500/20 text-blue-400 border-blue-500/30">Insight</Badge>
              
              <h2 className="text-2xl font-bold text-center mb-8">Options Insights</h2>

              <div className="grid gap-6 mb-8">
                {[
                  {
                    title: "Limited Risk, Unlimited Reward (for Buyers)",
                    description: "When you buy options, you can never lose more than the premium paid. But calls have unlimited upside potential.",
                    icon: TrendingUp,
                  },
                  {
                    title: "Time Is Your Enemy",
                    description: "Options lose value every day due to time decay (theta). The closer to expiration, the faster they decay.",
                    icon: AlertTriangle,
                  },
                  {
                    title: "Volatility Matters",
                    description: "Options are priced based on expected volatility. Higher volatility = higher premiums. This is why options spike before earnings.",
                    icon: BarChart3,
                  },
                  {
                    title: "Use Cases",
                    description: "Options can be used for speculation (leverage), hedging (protection), or income generation (selling covered calls).",
                    icon: Lightbulb,
                  },
                ].map((insight, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.15 }}
                    className="p-6 rounded-xl bg-blue-500/10 border border-blue-500/30"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-blue-500/20">
                        <insight.icon className="w-6 h-6 text-blue-500" />
                      </div>
                      <div>
                        <h3 className="font-bold mb-2">{insight.title}</h3>
                        <p className="text-muted-foreground">{insight.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="flex justify-center">
                <Button onClick={nextSlide} size="lg" className="gap-2">
                  Continue to Apply <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Slide 4: Apply */}
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
              
              <h2 className="text-2xl font-bold text-center mb-2">Options Knowledge Summary</h2>
              <p className="text-center text-muted-foreground mb-8">You now understand the basics of options</p>

              <Card className="p-6 bg-muted/50 mb-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                    <TrendingUp className="w-8 h-8 text-emerald-500 mb-3" />
                    <h3 className="font-bold mb-2">Call Options</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Right to BUY at strike price</li>
                      <li>• Profit when stock goes UP</li>
                      <li>• Max loss = premium paid</li>
                      <li>• Bullish strategy</li>
                    </ul>
                  </div>
                  <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/30">
                    <TrendingDown className="w-8 h-8 text-destructive mb-3" />
                    <h3 className="font-bold mb-2">Put Options</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Right to SELL at strike price</li>
                      <li>• Profit when stock goes DOWN</li>
                      <li>• Max loss = premium paid</li>
                      <li>• Bearish/hedging strategy</li>
                    </ul>
                  </div>
                </div>
              </Card>

              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 mb-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-500 mt-1" />
                  <div>
                    <h4 className="font-bold text-amber-500">Risk Warning</h4>
                    <p className="text-sm text-muted-foreground">
                      Options are complex instruments. Most options expire worthless. Never risk more than you can afford to lose, and consider paper trading before using real money.
                    </p>
                  </div>
                </div>
              </div>

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

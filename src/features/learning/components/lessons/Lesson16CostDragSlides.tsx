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
  TrendingDown,
  DollarSign,
  Clock,
  Lightbulb,
  AlertTriangle
} from "lucide-react";

type Slide = 1 | 2 | 3 | 4;

interface Lesson16Props {
  onComplete?: () => void;
}

const reflectionQuestions = [
  {
    question: "Why do small expense ratio differences matter over decades?",
    options: [
      { text: "They compound exponentially, eating into returns", correct: true },
      { text: "They don't matter much in the long run", correct: false },
      { text: "Higher fees always mean better performance", correct: false },
    ],
  },
  {
    question: "A 1% expense ratio vs 0.03% over 30 years on $100K could cost you:",
    options: [
      { text: "About $1,000", correct: false },
      { text: "About $50,000-$100,000+", correct: true },
      { text: "About $5,000", correct: false },
    ],
  },
  {
    question: "What's the best way to minimize cost drag?",
    options: [
      { text: "Buy the most expensive funds", correct: false },
      { text: "Use low-cost index funds and ETFs", correct: true },
      { text: "Switch funds frequently", correct: false },
    ],
  },
];

export const Lesson16CostDragSlides = ({ onComplete }: Lesson16Props) => {
  const [currentSlide, setCurrentSlide] = useState<Slide>(1);
  const [expenseRatio1, setExpenseRatio1] = useState(0.03);
  const [expenseRatio2, setExpenseRatio2] = useState(1.0);
  const [years, setYears] = useState(30);
  const [initialInvestment] = useState(100000);
  const [annualReturn] = useState(7);
  const [reflectionIndex, setReflectionIndex] = useState(0);
  const [reflectionAnswers, setReflectionAnswers] = useState<boolean[]>([]);

  const calculateFutureValue = (expenseRatio: number) => {
    const netReturn = (annualReturn - expenseRatio) / 100;
    return initialInvestment * Math.pow(1 + netReturn, years);
  };

  const lowCostValue = calculateFutureValue(expenseRatio1);
  const highCostValue = calculateFutureValue(expenseRatio2);
  const costDrag = lowCostValue - highCostValue;

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
        {/* Slide 1: Experience - Cost Drag Visualizer */}
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
              
              <h2 className="text-2xl font-bold mb-2">Cost Drag Visualizer</h2>
              <p className="text-muted-foreground mb-6">
                Expense ratios seem tiny, but they compound over decades. See how fees silently eat your wealth.
              </p>

              {/* Initial Investment Display */}
              <div className="p-4 rounded-xl bg-muted/50 mb-6 text-center">
                <p className="text-sm text-muted-foreground">Starting Investment</p>
                <p className="text-3xl font-bold">${initialInvestment.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Assuming {annualReturn}% annual return</p>
              </div>

              {/* Time Horizon Slider */}
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <Clock className="w-4 h-4" /> Investment Horizon
                  </span>
                  <span className="font-bold">{years} years</span>
                </div>
                <Slider
                  value={[years]}
                  onValueChange={(v) => setYears(v[0])}
                  min={5}
                  max={40}
                  step={5}
                />
              </div>

              {/* Expense Ratio Comparison */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <Card className="p-4 border-emerald-500/30 bg-emerald-500/5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span className="font-bold">Low-Cost Fund</span>
                  </div>
                  <div className="mb-3">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-muted-foreground">Expense Ratio</span>
                      <span className="font-bold text-emerald-500">{expenseRatio1.toFixed(2)}%</span>
                    </div>
                    <Slider
                      value={[expenseRatio1 * 100]}
                      onValueChange={(v) => setExpenseRatio1(v[0] / 100)}
                      min={1}
                      max={50}
                      step={1}
                    />
                  </div>
                  <div className="p-3 rounded-lg bg-emerald-500/10 text-center">
                    <p className="text-sm text-muted-foreground">Final Value</p>
                    <p className="text-2xl font-bold text-emerald-500">${lowCostValue.toLocaleString(undefined, {maximumFractionDigits: 0})}</p>
                  </div>
                </Card>

                <Card className="p-4 border-destructive/30 bg-destructive/5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 rounded-full bg-destructive" />
                    <span className="font-bold">High-Cost Fund</span>
                  </div>
                  <div className="mb-3">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-muted-foreground">Expense Ratio</span>
                      <span className="font-bold text-destructive">{expenseRatio2.toFixed(2)}%</span>
                    </div>
                    <Slider
                      value={[expenseRatio2 * 100]}
                      onValueChange={(v) => setExpenseRatio2(v[0] / 100)}
                      min={50}
                      max={200}
                      step={5}
                    />
                  </div>
                  <div className="p-3 rounded-lg bg-destructive/10 text-center">
                    <p className="text-sm text-muted-foreground">Final Value</p>
                    <p className="text-2xl font-bold text-destructive">${highCostValue.toLocaleString(undefined, {maximumFractionDigits: 0})}</p>
                  </div>
                </Card>
              </div>

              {/* Cost Drag Display */}
              <motion.div 
                className="p-6 rounded-xl bg-amber-500/10 border border-amber-500/30 text-center"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <TrendingDown className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-1">Cost Drag (Money Lost to Fees)</p>
                <p className="text-4xl font-bold text-amber-500">${costDrag.toLocaleString(undefined, {maximumFractionDigits: 0})}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  That's {((costDrag / lowCostValue) * 100).toFixed(1)}% of potential wealth
                </p>
              </motion.div>

              <div className="flex justify-center mt-6">
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
              
              <h2 className="text-2xl font-bold text-center mb-2">Understanding Cost Drag</h2>
              <p className="text-center text-muted-foreground mb-8">Test your understanding of fee impact</p>

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
              
              <h2 className="text-2xl font-bold text-center mb-8">Cost Drag Insights</h2>

              <div className="grid gap-6 mb-8">
                {[
                  {
                    title: "The Power of Low Costs",
                    description: "Vanguard founder John Bogle proved that low-cost index funds beat most actively managed funds over time. The math is simple: every dollar in fees is a dollar not compounding.",
                    icon: DollarSign,
                  },
                  {
                    title: "Expense Ratios Compound Against You",
                    description: "A 1% fee might seem small, but over 30 years it can consume 25-30% of your potential wealth. That's the tyranny of compounding costs.",
                    icon: TrendingDown,
                  },
                  {
                    title: "Compare Total Costs",
                    description: "Look beyond expense ratios: trading costs, bid-ask spreads, and tax inefficiency also drag on returns. ETFs often win on all fronts.",
                    icon: Lightbulb,
                  },
                ].map((insight, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.2 }}
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
              
              <h2 className="text-2xl font-bold text-center mb-2">Action Steps</h2>
              <p className="text-center text-muted-foreground mb-8">Apply what you've learned about cost drag</p>

              <div className="space-y-4 mb-6">
                {[
                  { action: "Check your current fund expense ratios", tip: "Look up each fund's expense ratio in your 401k or brokerage" },
                  { action: "Compare to low-cost alternatives", tip: "S&P 500 index funds often have ratios under 0.10%" },
                  { action: "Calculate your personal cost drag", tip: "Use the visualizer to see how much fees cost over your timeline" },
                  { action: "Switch to lower-cost options when possible", tip: "Consider tax implications before making changes" },
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-4 rounded-xl bg-muted/50 border border-border"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
                        {idx + 1}
                      </div>
                      <div>
                        <p className="font-medium">{item.action}</p>
                        <p className="text-sm text-muted-foreground">{item.tip}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <Card className="p-4 bg-emerald-500/10 border border-emerald-500/30 mb-6">
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-emerald-500 mt-1" />
                  <div>
                    <h4 className="font-bold text-emerald-500">Key Takeaway</h4>
                    <p className="text-sm text-muted-foreground">
                      The difference between a 0.03% and 1% expense ratio over 30 years on $100,000 is over $100,000 in lost wealth. Always minimize fees.
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

import { useState, useEffect } from "react";
import { SliderSimulator } from "../interactive/SliderSimulator";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { 
  ArrowRight, 
  CheckCircle,
  Target,
  DollarSign,
  TrendingUp,
  RefreshCw,
  Lightbulb,
  Calendar
} from "lucide-react";

type Slide = 1 | 2 | 3 | 4;

interface Lesson20Props {
  onComplete?: () => void;
}

const reflectionQuestions = [
  {
    question: "What is dividend reinvestment (DRIP)?",
    options: [
      { text: "Automatically using dividends to buy more shares", correct: true },
      { text: "Selling shares to increase income", correct: false },
      { text: "A type of bond investment", correct: false },
    ],
  },
  {
    question: "Why do reinvested dividends compound wealth?",
    options: [
      { text: "More shares means more future dividends", correct: true },
      { text: "Companies pay higher dividends to reinvestors", correct: false },
      { text: "Reinvesting avoids all taxes", correct: false },
    ],
  },
  {
    question: "What's a sign of a sustainable dividend?",
    options: [
      { text: "A payout ratio under 60-70%", correct: true },
      { text: "The highest yield available", correct: false },
      { text: "Dividends paid only once a year", correct: false },
    ],
  },
];

export const Lesson20DividendIncomeSlides = ({ onComplete }: Lesson20Props) => {
  const [currentSlide, setCurrentSlide] = useState<Slide>(1);
  const [initialInvestment, setInitialInvestment] = useState(10000);
  const [dividendYield, setDividendYield] = useState(3);
  const [growthRate, setGrowthRate] = useState(5);
  const [years, setYears] = useState(20);
  const [reinvestDividends, setReinvestDividends] = useState(true);
  const [monthlyData, setMonthlyData] = useState<{month: number; income: number; total: number}[]>([]);
  const [reflectionIndex, setReflectionIndex] = useState(0);
  const [reflectionAnswers, setReflectionAnswers] = useState<boolean[]>([]);

  useEffect(() => {
    const data: {month: number; income: number; total: number}[] = [];
    let shares = initialInvestment / 100;
    let sharePrice = 100;
    const monthlyDividendRate = dividendYield / 100 / 12;
    const monthlyGrowthRate = growthRate / 100 / 12;

    for (let month = 1; month <= years * 12; month++) {
      const dividend = shares * sharePrice * monthlyDividendRate;
      sharePrice *= (1 + monthlyGrowthRate);
      
      if (reinvestDividends) {
        shares += dividend / sharePrice;
      }
      
      const totalValue = shares * sharePrice;
      
      if (month % 12 === 0) {
        data.push({ month, income: dividend * 12, total: totalValue });
      }
    }
    
    setMonthlyData(data);
  }, [initialInvestment, dividendYield, growthRate, years, reinvestDividends]);

  const finalValue = monthlyData[monthlyData.length - 1]?.total || initialInvestment;
  const finalIncome = monthlyData[monthlyData.length - 1]?.income || 0;

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
        {/* Slide 1: Experience - Dividend Income Dashboard */}
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
              
              <h2 className="text-2xl font-bold mb-2">Dividend Income Dashboard</h2>
              <p className="text-muted-foreground mb-6">
                See how dividend reinvestment creates a snowball effect, growing both your income and wealth over time.
              </p>

              {/* Controls */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Initial Investment</span>
                      <span className="font-bold">${initialInvestment.toLocaleString()}</span>
                    </div>
                    <Slider value={[initialInvestment]} onValueChange={(v) => setInitialInvestment(v[0])} min={1000} max={100000} step={1000} />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Dividend Yield</span>
                      <span className="font-bold">{dividendYield}%</span>
                    </div>
                    <Slider value={[dividendYield]} onValueChange={(v) => setDividendYield(v[0])} min={1} max={8} step={0.5} />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Annual Price Growth</span>
                      <span className="font-bold">{growthRate}%</span>
                    </div>
                    <Slider value={[growthRate]} onValueChange={(v) => setGrowthRate(v[0])} min={0} max={12} step={1} />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Time Horizon</span>
                      <span className="font-bold">{years} years</span>
                    </div>
                    <Slider value={[years]} onValueChange={(v) => setYears(v[0])} min={5} max={40} step={5} />
                  </div>
                </div>
              </div>

              {/* Reinvest Toggle */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50 mb-6">
                <div className="flex items-center gap-3">
                  <RefreshCw className={`w-5 h-5 ${reinvestDividends ? "text-emerald-500" : "text-muted-foreground"}`} />
                  <div>
                    <p className="font-medium">Reinvest Dividends (DRIP)</p>
                    <p className="text-sm text-muted-foreground">Automatically buy more shares with dividends</p>
                  </div>
                </div>
                <Switch checked={reinvestDividends} onCheckedChange={setReinvestDividends} />
              </div>

              {/* Income Growth Chart */}
              <Card className="p-4 bg-muted/50 mb-6">
                <h3 className="font-bold mb-4">Annual Dividend Income Growth</h3>
                <div className="h-32 flex items-end gap-1">
                  {monthlyData.map((d, idx) => {
                    const maxIncome = Math.max(...monthlyData.map(m => m.income));
                    const height = (d.income / maxIncome) * 100;
                    return (
                      <motion.div
                        key={idx}
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        className="flex-1 bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t relative group"
                      >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-bold opacity-0 group-hover:opacity-100 bg-background px-1 rounded whitespace-nowrap">
                          ${d.income.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>Year 1</span>
                  <span>Year {years}</span>
                </div>
              </Card>

              {/* Results */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="p-4 rounded-xl bg-background border text-center">
                  <DollarSign className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">Starting Investment</p>
                  <p className="text-xl font-bold">${initialInvestment.toLocaleString()}</p>
                </div>
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center">
                  <TrendingUp className="w-6 h-6 mx-auto mb-2 text-emerald-500" />
                  <p className="text-xs text-muted-foreground">Final Portfolio Value</p>
                  <p className="text-xl font-bold text-emerald-500">${finalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                </div>
                <div className="p-4 rounded-xl bg-primary/10 border border-primary/30 text-center">
                  <Calendar className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <p className="text-xs text-muted-foreground">Year {years} Annual Income</p>
                  <p className="text-xl font-bold text-primary">${finalIncome.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                </div>
              </div>

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
              
              <h2 className="text-2xl font-bold text-center mb-2">Dividend Investing Knowledge</h2>
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
              
              <h2 className="text-2xl font-bold text-center mb-8">Dividend Investing Insights</h2>

              <div className="grid gap-6 mb-8">
                {[
                  {
                    title: "The Power of DRIP",
                    description: "Dividend reinvestment creates a compounding flywheel: more shares → more dividends → more shares. Over 20-30 years, most of your wealth comes from reinvested dividends, not original investment.",
                    icon: RefreshCw,
                  },
                  {
                    title: "Dividend Growth > High Yield",
                    description: "A 2% yield growing 10% annually beats a stagnant 5% yield. Look for 'Dividend Aristocrats'—companies that have raised dividends 25+ consecutive years.",
                    icon: TrendingUp,
                  },
                  {
                    title: "Watch the Payout Ratio",
                    description: "If a company pays out 90%+ of earnings as dividends, it has little room for growth or cushion in tough times. Sustainable payout ratios are typically 30-60%.",
                    icon: DollarSign,
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
              
              <h2 className="text-2xl font-bold text-center mb-2">Build Your Dividend Strategy</h2>
              <p className="text-center text-muted-foreground mb-8">Apply dividend investing principles</p>

              <div className="space-y-4 mb-6">
                {[
                  { action: "Enable DRIP on all dividend holdings", tip: "Most brokers offer automatic reinvestment at no cost" },
                  { action: "Focus on dividend growth, not just yield", tip: "Look for consistent dividend increases over 10+ years" },
                  { action: "Diversify across sectors", tip: "Don't concentrate in high-yield sectors like utilities or REITs" },
                  { action: "Check payout ratios before buying", tip: "Sustainable companies keep ratios under 60-70%" },
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-4 rounded-xl bg-muted/50 border"
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
                      Dividend investing is a marathon, not a sprint. The magic happens after 15-20 years when your reinvested dividends generate more income than your original investment ever did.
                    </p>
                  </div>
                </div>
              </Card>

              <SliderSimulator
                title="💰 DRIP Calculator"
                description="See how reinvesting dividends compounds your wealth:"
                sliders={[
                  { id: "shares", label: "Starting Shares", min: 10, max: 500, step: 10, defaultValue: 100 },
                  { id: "price", label: "Share Price", min: 10, max: 200, step: 5, defaultValue: 50, unit: "$" },
                  { id: "yield", label: "Dividend Yield", min: 1, max: 8, step: 0.5, defaultValue: 3, unit: "%" },
                  { id: "years", label: "Years", min: 5, max: 30, step: 5, defaultValue: 20, unit: " yrs" },
                ]}
                calculateResult={(vals) => {
                  const totalShares = vals.shares * Math.pow(1 + vals.yield / 100, vals.years);
                  const value = Math.round(totalShares * vals.price);
                  const original = vals.shares * vals.price;
                  return { primary: `$${value.toLocaleString()}`, secondary: `From $${original.toLocaleString()} original investment`, insight: `DRIP added ${Math.round(totalShares - vals.shares)} free shares!` };
                }}
              />
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

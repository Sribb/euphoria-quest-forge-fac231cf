import { useState, useEffect } from "react";
import { DragSortChallenge } from "../interactive/DragSortChallenge";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { 
  ArrowRight, 
  Sparkles, 
  TrendingUp,
  TrendingDown,
  Minus,
  Activity,
  Shield,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Zap
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Area, ComposedChart, ReferenceLine } from "recharts";

type Slide = 1 | 2 | 3 | 4;

interface Lesson10Props {
  onComplete?: () => void;
}

const marketScenarios = [
  { id: "recession", name: "2008 Recession", icon: TrendingDown, color: "#ef4444", stockDrop: -50, bondChange: 10, duration: 18 },
  { id: "boom", name: "Bull Market", icon: TrendingUp, color: "#10b981", stockDrop: 40, bondChange: -5, duration: 36 },
  { id: "sideways", name: "Sideways Chop", icon: Minus, color: "#f59e0b", stockDrop: 0, bondChange: 3, duration: 24 },
  { id: "crash", name: "Flash Crash", icon: Zap, color: "#8b5cf6", stockDrop: -30, bondChange: 5, duration: 3 },
];

const reflectionQuestions = [
  {
    question: "Your portfolio dropped 40% in a recession. What should you do?",
    options: [
      { text: "Sell everything to prevent more losses", correct: false, feedback: "Selling locks in losses. Historically, markets recover." },
      { text: "Hold steady and stay the course", correct: true, feedback: "Correct! Patience during downturns has historically been rewarded." },
      { text: "Put all remaining cash into stocks", correct: false, feedback: "Risky—you might need that cash if job/income is affected too." },
    ],
  },
  {
    question: "What's the main benefit of bonds during a stock market crash?",
    options: [
      { text: "Bonds always go up when stocks go down", correct: false, feedback: "Not always, but they tend to be more stable." },
      { text: "Bonds provide stability and reduce portfolio volatility", correct: true, feedback: "Correct! Bonds act as a cushion during stock market turbulence." },
      { text: "Bonds have higher returns than stocks", correct: false, feedback: "Long-term, stocks typically outperform bonds." },
    ],
  },
];

export const Lesson10StressTestSlides = ({ onComplete }: Lesson10Props) => {
  const [currentSlide, setCurrentSlide] = useState<Slide>(1);
  const [stockAllocation, setStockAllocation] = useState(60);
  const [selectedScenario, setSelectedScenario] = useState(0);
  const [simulationRun, setSimulationRun] = useState(false);
  const [portfolioData, setPortfolioData] = useState<any[]>([]);
  const [reflectionIndex, setReflectionIndex] = useState(0);
  const [reflectionAnswers, setReflectionAnswers] = useState<boolean[]>([]);
  const [challengeAllocation, setChallengeAllocation] = useState(50);
  const [challengeComplete, setChallengeComplete] = useState(false);

  const bondAllocation = 100 - stockAllocation;
  const scenario = marketScenarios[selectedScenario];

  // Generate portfolio simulation data
  const runSimulation = () => {
    const data = [];
    let portfolioValue = 100000;
    const months = scenario.duration;
    
    for (let month = 0; month <= months; month++) {
      const progress = month / months;
      const stockImpact = (stockAllocation / 100) * scenario.stockDrop * progress / 100;
      const bondImpact = (bondAllocation / 100) * scenario.bondChange * progress / 100;
      
      // Add some volatility
      const volatility = (Math.sin(month * 0.5) * 0.02) * (stockAllocation / 100);
      
      portfolioValue = 100000 * (1 + stockImpact + bondImpact + volatility);
      
      data.push({
        month,
        value: Math.round(portfolioValue),
        baseline: 100000,
      });
    }
    
    setPortfolioData(data);
    setSimulationRun(true);
  };

  const getFinalChange = () => {
    if (portfolioData.length === 0) return 0;
    const finalValue = portfolioData[portfolioData.length - 1].value;
    return ((finalValue - 100000) / 100000 * 100).toFixed(1);
  };

  const handleReflectionAnswer = (isCorrect: boolean) => {
    setReflectionAnswers([...reflectionAnswers, isCorrect]);
    if (reflectionIndex < reflectionQuestions.length - 1) {
      setTimeout(() => setReflectionIndex(reflectionIndex + 1), 1500);
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
                slide === currentSlide 
                  ? "w-8 bg-primary" 
                  : slide < currentSlide 
                    ? "w-4 bg-primary/50" 
                    : "w-4 bg-muted"
              }`}
            />
            <span className={`text-xs mt-1 ${slide === currentSlide ? "text-primary font-medium" : "text-muted-foreground"}`}>
              {slideLabels[slide - 1]}
            </span>
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Slide 1: Experience - Stress Test Lab */}
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
              
              <motion.h2 
                className="text-2xl font-bold mb-2 flex items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Activity className="w-7 h-7 text-primary" />
                Portfolio Stress Test Lab
              </motion.h2>
              <motion.p 
                className="text-muted-foreground mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Set your allocation and run historical scenarios to see how your portfolio would perform.
              </motion.p>

              {/* Allocation Slider */}
              <Card className="p-6 bg-muted/50 mb-6">
                <h3 className="font-bold mb-4">Set Your Allocation</h3>
                <div className="flex items-center gap-6 mb-4">
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4 text-blue-500" /> Stocks
                      </span>
                      <span className="font-bold text-blue-500">{stockAllocation}%</span>
                    </div>
                    <Slider
                      value={[stockAllocation]}
                      onValueChange={(v) => { setStockAllocation(v[0]); setSimulationRun(false); }}
                      max={100}
                      step={5}
                    />
                  </div>
                  <div className="text-center px-4 py-2 rounded-lg bg-amber-500/20">
                    <p className="text-xs text-muted-foreground">Bonds</p>
                    <p className="font-bold text-amber-500">{bondAllocation}%</p>
                  </div>
                </div>
              </Card>

              {/* Scenario Selection */}
              <div className="grid grid-cols-4 gap-3 mb-6">
                {marketScenarios.map((s, idx) => {
                  const Icon = s.icon;
                  return (
                    <motion.div
                      key={s.id}
                      onClick={() => { setSelectedScenario(idx); setSimulationRun(false); }}
                      className={`p-4 rounded-xl border-2 cursor-pointer text-center transition-all ${
                        idx === selectedScenario 
                          ? "border-primary bg-primary/10" 
                          : "border-border hover:border-primary/50"
                      }`}
                      whileHover={{ scale: 1.02 }}
                    >
                      <Icon className="w-8 h-8 mx-auto mb-2" style={{ color: s.color }} />
                      <p className="font-semibold text-sm">{s.name}</p>
                      <p className="text-xs text-muted-foreground">{s.duration} months</p>
                    </motion.div>
                  );
                })}
              </div>

              {/* Run Simulation Button */}
              <div className="text-center mb-6">
                <Button onClick={runSimulation} size="lg" className="gap-2">
                  <Zap className="w-5 h-5" /> Run Stress Test
                </Button>
              </div>

              {/* Results Chart */}
              {simulationRun && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="p-6 bg-muted/50 mb-6">
                    <h3 className="font-bold mb-4 flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-primary" />
                      Simulation Results: {scenario.name}
                    </h3>
                    
                    <div className="h-64 mb-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={portfolioData}>
                          <defs>
                            <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor={Number(getFinalChange()) >= 0 ? "#10b981" : "#ef4444"} stopOpacity={0.3}/>
                              <stop offset="95%" stopColor={Number(getFinalChange()) >= 0 ? "#10b981" : "#ef4444"} stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} domain={['auto', 'auto']} />
                          <ReferenceLine y={100000} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" />
                          <Area type="monotone" dataKey="value" fill="url(#portfolioGradient)" stroke="none" />
                          <Line 
                            type="monotone" 
                            dataKey="value" 
                            stroke={Number(getFinalChange()) >= 0 ? "#10b981" : "#ef4444"}
                            strokeWidth={3}
                            dot={false}
                          />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-3 rounded-lg bg-background border border-border">
                        <p className="text-xs text-muted-foreground">Starting Value</p>
                        <p className="text-xl font-bold">$100,000</p>
                      </div>
                      <div className={`text-center p-3 rounded-lg ${Number(getFinalChange()) >= 0 ? "bg-emerald-500/10" : "bg-red-500/10"}`}>
                        <p className="text-xs text-muted-foreground">Final Value</p>
                        <p className={`text-xl font-bold ${Number(getFinalChange()) >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                          ${portfolioData[portfolioData.length - 1]?.value.toLocaleString()}
                        </p>
                      </div>
                      <div className={`text-center p-3 rounded-lg ${Number(getFinalChange()) >= 0 ? "bg-emerald-500/10" : "bg-red-500/10"}`}>
                        <p className="text-xs text-muted-foreground">Change</p>
                        <p className={`text-xl font-bold ${Number(getFinalChange()) >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                          {Number(getFinalChange()) >= 0 ? "+" : ""}{getFinalChange()}%
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}

              <motion.div 
                className="flex justify-center relative z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Button 
                  onClick={nextSlide} 
                  size="lg" 
                  className="gap-2"
                  disabled={!simulationRun}
                >
                  Continue to Reflect <ArrowRight className="w-4 h-4" />
                </Button>
              </motion.div>
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
              
              <motion.h2 
                className="text-2xl font-bold text-center mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                What Would You Do?
              </motion.h2>
              <motion.p 
                className="text-center text-muted-foreground mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Test your decision-making under market stress
              </motion.p>

              <Card className="p-6 bg-muted/50 mb-6">
                <h3 className="font-bold text-lg mb-4">{reflectionQuestions[reflectionIndex].question}</h3>
                
                <div className="space-y-3">
                  {reflectionQuestions[reflectionIndex].options.map((option, idx) => (
                    <motion.button
                      key={idx}
                      onClick={() => handleReflectionAnswer(option.correct)}
                      className={`w-full p-4 rounded-xl text-left border-2 transition-all ${
                        reflectionAnswers[reflectionIndex] !== undefined
                          ? option.correct
                            ? "border-emerald-500 bg-emerald-500/10"
                            : "border-border opacity-50"
                          : "border-border hover:border-primary"
                      }`}
                      disabled={reflectionAnswers[reflectionIndex] !== undefined}
                      whileHover={reflectionAnswers[reflectionIndex] === undefined ? { scale: 1.02 } : {}}
                    >
                      <span className="font-medium">{option.text}</span>
                      {reflectionAnswers[reflectionIndex] !== undefined && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="text-sm text-muted-foreground mt-2"
                        >
                          {option.feedback}
                        </motion.p>
                      )}
                    </motion.button>
                  ))}
                </div>
              </Card>

              <div className="flex justify-center gap-2 mb-8">
                {reflectionQuestions.map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-3 h-3 rounded-full transition-all ${
                      idx === reflectionIndex
                        ? "bg-primary scale-125"
                        : reflectionAnswers[idx] !== undefined
                          ? reflectionAnswers[idx]
                            ? "bg-emerald-500"
                            : "bg-destructive"
                          : "bg-muted"
                    }`}
                  />
                ))}
              </div>

              <motion.div 
                className="flex justify-center relative z-10"
              >
                <Button 
                  onClick={nextSlide} 
                  size="lg" 
                  className="gap-2"
                  disabled={reflectionAnswers.length < reflectionQuestions.length}
                >
                  Continue to Insight <ArrowRight className="w-4 h-4" />
                </Button>
              </motion.div>
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
              
              <motion.h2 
                className="text-2xl font-bold text-center mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Key Stress Test Insights
              </motion.h2>

              <div className="grid gap-4 mb-8">
                {[
                  {
                    icon: Shield,
                    title: "Diversification Protects",
                    description: "A mix of stocks and bonds reduces the impact of market crashes on your total portfolio.",
                    color: "#10b981",
                  },
                  {
                    icon: TrendingUp,
                    title: "Markets Recover",
                    description: "Every major crash in history has been followed by a recovery. Patience is rewarded.",
                    color: "#3b82f6",
                  },
                  {
                    icon: AlertTriangle,
                    title: "Know Your Risk Tolerance",
                    description: "If a 40% drop would make you panic sell, you might need less stock exposure.",
                    color: "#f59e0b",
                  },
                ].map((insight, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 * idx }}
                    className="flex gap-4 p-4 rounded-xl border border-border bg-muted/30"
                  >
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${insight.color}20` }}
                    >
                      <insight.icon className="w-6 h-6" style={{ color: insight.color }} />
                    </div>
                    <div>
                      <h3 className="font-bold mb-1">{insight.title}</h3>
                      <p className="text-sm text-muted-foreground">{insight.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="p-6 rounded-xl bg-primary/10 border border-primary/30 mb-8"
              >
                <div className="flex items-start gap-3">
                  <Sparkles className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <p className="text-sm">
                    <strong>The best time to stress test is before a crisis, not during one.</strong> 
                    Understanding how your portfolio behaves in different conditions helps you make 
                    rational decisions when emotions run high.
                  </p>
                </div>
              </motion.div>

              <motion.div 
                className="flex justify-center relative z-10"
              >
                <Button onClick={nextSlide} size="lg" className="gap-2">
                  Apply What You Learned <ArrowRight className="w-4 h-4" />
                </Button>
              </motion.div>
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
              
              <motion.h2 
                className="text-2xl font-bold text-center mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Build Your Crash-Resistant Portfolio
              </motion.h2>
              <motion.p 
                className="text-center text-muted-foreground mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Choose an allocation that survives both a crash AND captures long-term growth
              </motion.p>

              <Card className="p-6 bg-muted/50 mb-6">
                <h3 className="font-bold mb-4">Your Final Allocation</h3>
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Conservative</span>
                    <span>Balanced</span>
                    <span>Aggressive</span>
                  </div>
                  <Slider
                    value={[challengeAllocation]}
                    onValueChange={(v) => setChallengeAllocation(v[0])}
                    max={100}
                    step={5}
                  />
                  <div className="flex justify-between mt-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-500">{challengeAllocation}%</p>
                      <p className="text-xs text-muted-foreground">Stocks</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-amber-500">{100 - challengeAllocation}%</p>
                      <p className="text-xs text-muted-foreground">Bonds</p>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={() => setChallengeComplete(true)} 
                  className="w-full gap-2"
                >
                  Lock In Allocation <CheckCircle className="w-4 h-4" />
                </Button>
              </Card>

              {challengeComplete && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-6 rounded-xl bg-emerald-500/20 border border-emerald-500/50 mb-8"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Sparkles className="w-8 h-8 text-emerald-500" />
                    <h3 className="font-bold text-lg">Great Choice!</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    A {challengeAllocation}% stock / {100 - challengeAllocation}% bond allocation is 
                    {challengeAllocation >= 70 ? " aggressive—higher growth potential but more volatile during crashes" : 
                     challengeAllocation >= 40 ? " balanced—good for most investors with a long time horizon" :
                     " conservative—prioritizes stability over growth"}. 
                    Remember to rebalance periodically!
                  </p>
                </motion.div>
              )}

              {/* Interactive Challenge */}
              <DragSortChallenge
                title="📋 Crash Response Priority"
                description="Order these actions from FIRST to LAST during a market crash:"
                items={[
                  { id: "assess", label: "🔍 Assess your time horizon" },
                  { id: "review", label: "📊 Review your allocation" },
                  { id: "rebalance", label: "⚖️ Rebalance if needed" },
                  { id: "buy", label: "🛒 Consider buying the dip" },
                ]}
                correctOrder={["assess", "review", "rebalance", "buy"]}
              />

              <motion.div
                className="flex justify-center relative z-10"
              >
                <Button 
                  onClick={nextSlide} 
                  size="lg" 
                  className="gap-2"
                  disabled={!challengeComplete}
                >
                  Complete Lesson <CheckCircle className="w-4 h-4" />
                </Button>
              </motion.div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

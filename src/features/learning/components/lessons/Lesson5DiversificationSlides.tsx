import { useState, useEffect } from "react";
import { SliderSimulator } from "../interactive/SliderSimulator";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Package, Layers, TrendingUp, TrendingDown, ShieldCheck, AlertTriangle, Sparkles, Target, Shuffle } from "lucide-react";
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, AreaChart, Area, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, Radar } from "recharts";

type Slide = 1 | 2 | 3 | 4;

interface Lesson5Props {
  onComplete?: () => void;
}

const SECTORS = [
  { name: "Tech", color: "#3b82f6", volatility: 0.25, growth: 0.12 },
  { name: "Healthcare", color: "#10b981", volatility: 0.15, growth: 0.08 },
  { name: "Finance", color: "#f59e0b", volatility: 0.18, growth: 0.07 },
  { name: "Energy", color: "#ef4444", volatility: 0.30, growth: 0.05 },
  { name: "Consumer", color: "#8b5cf6", volatility: 0.12, growth: 0.06 },
  { name: "Real Estate", color: "#ec4899", volatility: 0.20, growth: 0.04 },
];

// Simulate portfolio performance over time
const generatePortfolioData = (allocations: number[]) => {
  const data = [];
  const values = allocations.map(() => 10000 / allocations.filter(a => a > 0).length || 10000);
  
  for (let month = 0; month <= 60; month++) {
    let totalValue = 0;
    allocations.forEach((alloc, i) => {
      if (alloc > 0) {
        const monthlyReturn = (SECTORS[i].growth / 12) + (Math.random() - 0.5) * SECTORS[i].volatility * 0.3;
        values[i] *= (1 + monthlyReturn);
        totalValue += values[i] * (alloc / 100);
      }
    });
    
    data.push({
      month,
      value: Math.round(totalValue),
    });
  }
  return data;
};

// Calculate risk metrics
const calculateRiskMetrics = (allocations: number[]) => {
  let weightedVolatility = 0;
  let weightedGrowth = 0;
  let diversificationScore = 0;
  const activeCount = allocations.filter(a => a > 0).length;
  
  allocations.forEach((alloc, i) => {
    if (alloc > 0) {
      weightedVolatility += SECTORS[i].volatility * (alloc / 100);
      weightedGrowth += SECTORS[i].growth * (alloc / 100);
    }
  });
  
  // Diversification benefits from correlation reduction
  if (activeCount > 1) {
    diversificationScore = Math.min(100, activeCount * 15 + (100 - Math.max(...allocations)));
  }
  
  return {
    volatility: weightedVolatility,
    expectedReturn: weightedGrowth,
    diversificationScore,
    riskLevel: weightedVolatility > 0.22 ? "High" : weightedVolatility > 0.15 ? "Medium" : "Low"
  };
};

export const Lesson5DiversificationSlides = ({ onComplete }: Lesson5Props) => {
  const [currentSlide, setCurrentSlide] = useState<Slide>(1);
  const [allocations, setAllocations] = useState([100, 0, 0, 0, 0, 0]); // Start concentrated
  const [diversifiedAllocations, setDiversifiedAllocations] = useState([20, 20, 15, 15, 15, 15]);
  const [basketDrops, setBasketDrops] = useState<number[]>([]);
  const [showCrash, setShowCrash] = useState(false);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [draggedEgg, setDraggedEgg] = useState<number | null>(null);
  const [eggDistribution, setEggDistribution] = useState([6, 0, 0]); // 3 baskets

  const learnTexts = [
    "Diversification spreads risk across different investments.",
    "When one sector falls, others may hold steady or rise.",
    "The goal isn't maximum returns—it's optimal risk-adjusted returns.",
    "Don't put all your eggs in one basket!",
  ];

  useEffect(() => {
    if (currentSlide === 1) {
      const interval = setInterval(() => {
        setCurrentTextIndex(prev => (prev + 1) % learnTexts.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [currentSlide]);

  const nextSlide = () => {
    if (currentSlide < 4) {
      setCurrentSlide((currentSlide + 1) as Slide);
    } else {
      onComplete?.();
    }
  };

  const prevSlide = () => {
    if (currentSlide > 1) {
      setCurrentSlide((currentSlide - 1) as Slide);
    }
  };

  const handleAllocationChange = (index: number, value: number) => {
    const newAllocations = [...allocations];
    newAllocations[index] = value;
    setAllocations(newAllocations);
  };

  const simulateCrash = () => {
    // Randomly "crash" one basket
    const crashIndex = Math.floor(Math.random() * 3);
    setBasketDrops([crashIndex]);
    setShowCrash(true);
    setTimeout(() => {
      setShowCrash(false);
      setBasketDrops([]);
    }, 2000);
  };

  const distributeEgg = (fromBasket: number, toBasket: number) => {
    if (eggDistribution[fromBasket] > 0) {
      const newDist = [...eggDistribution];
      newDist[fromBasket]--;
      newDist[toBasket]++;
      setEggDistribution(newDist);
    }
  };

  const slideLabels = ["Learn", "Visualize", "Insight", "Apply"];

  const concentratedData = generatePortfolioData([100, 0, 0, 0, 0, 0]);
  const diversifiedData = generatePortfolioData(diversifiedAllocations);
  const userRiskMetrics = calculateRiskMetrics(allocations);

  const radarData = SECTORS.map((sector, i) => ({
    subject: sector.name,
    allocation: allocations[i],
    fullMark: 100,
  }));

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
        {/* Slide 1: Learn - The Eggs & Baskets */}
        {currentSlide === 1 && (
          <motion.div
            key="slide1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-8">
              <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">Learn</Badge>
              
              <motion.h2 
                className="text-2xl font-bold mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Don't Put All Your Eggs in One Basket
              </motion.h2>

              {/* Interactive Eggs & Baskets */}
              <div className="my-8">
                <p className="text-center text-muted-foreground mb-4">Drag eggs between baskets to see the effect of diversification</p>
                
                <div className="flex justify-center gap-8 mb-6">
                  {[0, 1, 2].map((basketIndex) => (
                    <motion.div
                      key={basketIndex}
                      className={`relative w-32 h-32 rounded-b-3xl border-4 border-amber-600 bg-amber-900/20 flex flex-col items-center justify-end pb-2 cursor-pointer ${
                        basketDrops.includes(basketIndex) ? 'animate-shake' : ''
                      }`}
                      animate={basketDrops.includes(basketIndex) ? { x: [0, -10, 10, -10, 10, 0] } : {}}
                      onClick={() => {
                        if (draggedEgg !== null && draggedEgg !== basketIndex) {
                          distributeEgg(draggedEgg, basketIndex);
                          setDraggedEgg(null);
                        } else if (eggDistribution[basketIndex] > 0) {
                          setDraggedEgg(basketIndex);
                        }
                      }}
                    >
                      <p className="absolute -top-6 text-sm font-medium">Basket {basketIndex + 1}</p>
                      <div className="flex flex-wrap gap-1 justify-center">
                        {Array(eggDistribution[basketIndex]).fill(0).map((_, eggIndex) => (
                          <motion.div
                            key={eggIndex}
                            className="text-2xl"
                            animate={basketDrops.includes(basketIndex) ? { 
                              rotate: [0, -45, 45, -45, 0],
                              scale: [1, 0.5, 0.5, 0.5, 0]
                            } : {}}
                            transition={{ delay: eggIndex * 0.1 }}
                          >
                            🥚
                          </motion.div>
                        ))}
                      </div>
                      {draggedEgg === basketIndex && (
                        <div className="absolute -bottom-2 w-full text-center text-xs text-primary">Selected</div>
                      )}
                    </motion.div>
                  ))}
                </div>

                <div className="flex justify-center gap-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setEggDistribution([6, 0, 0])}
                    size="sm"
                  >
                    Concentrate (1 basket)
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setEggDistribution([2, 2, 2])}
                    size="sm"
                  >
                    Diversify (3 baskets)
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={simulateCrash}
                    size="sm"
                    className="gap-2"
                  >
                    <AlertTriangle className="w-4 h-4" /> Drop a Basket!
                  </Button>
                </div>

                {showCrash && (
                  <motion.div 
                    className="mt-4 p-4 rounded-lg bg-destructive/10 border border-destructive/30 text-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <p className="font-semibold text-destructive">
                      {eggDistribution[basketDrops[0]] === 6 
                        ? "💔 All eggs lost! Concentrated portfolios are risky!"
                        : eggDistribution[basketDrops[0]] > 0
                          ? `Lost ${eggDistribution[basketDrops[0]]} eggs, but ${6 - eggDistribution[basketDrops[0]]} are safe!`
                          : "✨ No eggs in that basket! Diversification protected you!"}
                    </p>
                  </motion.div>
                )}
              </div>

              {/* Animated Text */}
              <motion.div 
                className="p-4 bg-muted/30 rounded-lg min-h-[60px] flex items-center justify-center"
                key={currentTextIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <p className="text-center text-muted-foreground">{learnTexts[currentTextIndex]}</p>
              </motion.div>

              <div className="flex justify-center gap-2 mt-2">
                {learnTexts.map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-2 h-2 rounded-full transition-colors ${i === currentTextIndex ? 'bg-primary' : 'bg-muted'}`}
                  />
                ))}
              </div>

              <motion.div 
                className="flex justify-center mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Button onClick={nextSlide} size="lg" className="gap-2">
                  Continue to Visualize <ArrowRight className="w-4 h-4" />
                </Button>
              </motion.div>
            </Card>
          </motion.div>
        )}

        {/* Slide 2: Visualize - Concentrated vs Diversified */}
        {currentSlide === 2 && (
          <motion.div
            key="slide2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-8">
              <Badge className="mb-4 bg-amber-500/20 text-amber-400 border-amber-500/30">Visualize</Badge>

              <motion.h2 
                className="text-2xl font-bold text-center mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                Concentrated vs Diversified Performance
              </motion.h2>
              <motion.p 
                className="text-center text-muted-foreground mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                See how spreading investments reduces volatility
              </motion.p>

              {/* Comparison Chart */}
              <div className="h-64 mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart>
                    <defs>
                      <linearGradient id="concentratedGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="diversifiedGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={10} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                      formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
                    />
                    <Area 
                      type="monotone" 
                      data={concentratedData}
                      dataKey="value" 
                      stroke="#ef4444" 
                      fill="url(#concentratedGradient)" 
                      strokeWidth={2} 
                      name="100% Tech (Concentrated)" 
                    />
                    <Area 
                      type="monotone" 
                      data={diversifiedData}
                      dataKey="value" 
                      stroke="#10b981" 
                      fill="url(#diversifiedGradient)" 
                      strokeWidth={2} 
                      name="Diversified (6 sectors)" 
                    />
                    <Legend />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Key Insights */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <motion.div 
                  className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingDown className="w-5 h-5 text-destructive" />
                    <h4 className="font-semibold">Concentrated Portfolio</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">Higher potential returns but extreme volatility. One bad sector can wipe out gains.</p>
                </motion.div>

                <motion.div 
                  className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <h4 className="font-semibold">Diversified Portfolio</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">Smoother returns over time. Sectors balance each other during market swings.</p>
                </motion.div>
              </div>

              <motion.div 
                className="flex justify-between"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <Button variant="outline" onClick={prevSlide}>Back</Button>
                <Button onClick={nextSlide} size="lg" className="gap-2">
                  Continue to Insight <ArrowRight className="w-4 h-4" />
                </Button>
              </motion.div>
            </Card>
          </motion.div>
        )}

        {/* Slide 3: Insight - Sector Correlation */}
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
                className="text-2xl font-bold text-center mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Understanding Sector Correlation
              </motion.h2>
              <motion.p 
                className="text-center text-muted-foreground mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Not all diversification is equal—correlation matters
              </motion.p>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Sector Cards */}
                <div className="space-y-3">
                  {SECTORS.map((sector, i) => (
                    <motion.div
                      key={sector.name}
                      className="p-3 rounded-lg border bg-card flex items-center justify-between"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: sector.color }} />
                        <span className="font-medium">{sector.name}</span>
                      </div>
                      <div className="flex gap-4 text-sm">
                        <span className="text-muted-foreground">
                          Growth: <span className="text-emerald-400">{(sector.growth * 100).toFixed(0)}%</span>
                        </span>
                        <span className="text-muted-foreground">
                          Risk: <span className={sector.volatility > 0.2 ? "text-destructive" : "text-amber-400"}>
                            {sector.volatility > 0.25 ? "High" : sector.volatility > 0.15 ? "Med" : "Low"}
                          </span>
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Correlation Explanation */}
                <motion.div 
                  className="space-y-4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Shuffle className="w-5 h-5 text-primary" /> Low Correlation = Better Protection
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      When sectors move independently, losses in one are offset by stability in others.
                    </p>
                  </div>

                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Layers className="w-5 h-5 text-primary" /> Example Pairings
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• <span className="text-blue-400">Tech</span> + <span className="text-amber-400">Consumer Staples</span> = Low correlation</li>
                      <li>• <span className="text-red-400">Energy</span> + <span className="text-emerald-400">Healthcare</span> = Different drivers</li>
                      <li>• <span className="text-violet-400">Real Estate</span> + <span className="text-blue-400">Tech</span> = Diverse returns</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-primary/10 border border-primary/30 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Target className="w-5 h-5 text-primary" /> The Goal
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Choose investments that don't all move together. True diversification reduces risk without sacrificing much return.
                    </p>
                  </div>
                </motion.div>
              </div>

              <motion.div 
                className="flex justify-between mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <Button variant="outline" onClick={prevSlide}>Back</Button>
                <Button onClick={nextSlide} size="lg" className="gap-2">
                  Apply Your Knowledge <ArrowRight className="w-4 h-4" />
                </Button>
              </motion.div>
            </Card>
          </motion.div>
        )}

        {/* Slide 4: Apply - Build Diversified Portfolio */}
        {currentSlide === 4 && (
          <motion.div
            key="slide4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-8">
              <Badge className="mb-4 bg-violet-500/20 text-violet-400 border-violet-500/30">Apply</Badge>

              <motion.h2 
                className="text-2xl font-bold text-center mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Build Your Diversified Portfolio
              </motion.h2>
              <motion.p 
                className="text-center text-muted-foreground mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Challenge: Create a balanced portfolio across sectors
              </motion.p>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Allocation Sliders */}
                <motion.div 
                  className="space-y-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  {SECTORS.map((sector, i) => (
                    <div key={sector.name} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: sector.color }} />
                          {sector.name}
                        </span>
                        <span className="font-bold">{allocations[i]}%</span>
                      </div>
                      <Slider
                        value={[allocations[i]]}
                        onValueChange={(v) => handleAllocationChange(i, v[0])}
                        min={0}
                        max={100}
                        step={5}
                      />
                    </div>
                  ))}

                  <div className={`mt-4 p-3 rounded-lg border ${
                    allocations.reduce((a, b) => a + b, 0) === 100 
                      ? 'border-emerald-500 bg-emerald-500/10' 
                      : 'border-amber-500 bg-amber-500/10'
                  }`}>
                    <p className="text-sm font-medium">
                      Total: {allocations.reduce((a, b) => a + b, 0)}% 
                      {allocations.reduce((a, b) => a + b, 0) !== 100 && 
                        <span className="text-amber-400"> (should equal 100%)</span>
                      }
                    </p>
                  </div>
                </motion.div>

                {/* Radar Chart & Metrics */}
                <motion.div 
                  className="space-y-4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={radarData}>
                        <PolarGrid stroke="hsl(var(--border))" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} />
                        <Radar
                          name="Allocation"
                          dataKey="allocation"
                          stroke="hsl(var(--primary))"
                          fill="hsl(var(--primary))"
                          fillOpacity={0.3}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Risk Metrics */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-muted/30 rounded-lg text-center">
                      <p className="text-xs text-muted-foreground">Expected Return</p>
                      <p className="font-bold text-emerald-400">{(userRiskMetrics.expectedReturn * 100).toFixed(1)}%/yr</p>
                    </div>
                    <div className="p-3 bg-muted/30 rounded-lg text-center">
                      <p className="text-xs text-muted-foreground">Risk Level</p>
                      <p className={`font-bold ${
                        userRiskMetrics.riskLevel === "High" ? "text-destructive" : 
                        userRiskMetrics.riskLevel === "Medium" ? "text-amber-400" : "text-emerald-400"
                      }`}>{userRiskMetrics.riskLevel}</p>
                    </div>
                    <div className="p-3 bg-primary/10 rounded-lg text-center col-span-2">
                      <p className="text-xs text-muted-foreground">Diversification Score</p>
                      <p className="font-bold text-primary text-xl">{Math.round(userRiskMetrics.diversificationScore)}/100</p>
                      {userRiskMetrics.diversificationScore >= 70 && (
                        <p className="text-xs text-emerald-400 flex items-center justify-center gap-1 mt-1">
                          <Sparkles className="w-3 h-3" /> Well diversified!
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Diversification Simulator */}
              <SliderSimulator
                title="🎛️ Diversification Impact"
                description="See how spreading across sectors reduces risk:"
                sliders={[
                  { id: "sectors", label: "Number of Sectors", min: 1, max: 6, step: 1, defaultValue: 1 },
                  { id: "years", label: "Investment Period", min: 1, max: 30, step: 1, defaultValue: 10, unit: " yrs" },
                ]}
                calculateResult={(vals) => {
                  const riskReduction = Math.round((1 - 1 / Math.sqrt(vals.sectors)) * 100);
                  const volatility = Math.round(25 / Math.sqrt(vals.sectors));
                  return {
                    primary: `${riskReduction}% risk reduction`,
                    secondary: `Portfolio volatility: ~${volatility}% with ${vals.sectors} sector(s)`,
                    insight: vals.sectors >= 4 ? "Well diversified! Diminishing returns above 5-6 sectors." : "Adding more sectors can significantly reduce risk.",
                  };
                }}
              />

              <motion.div
                className="flex justify-between mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Button variant="outline" onClick={prevSlide}>Back</Button>
                <Button 
                  onClick={nextSlide} 
                  size="lg" 
                  className="gap-2 bg-gradient-to-r from-violet-500 to-emerald-500"
                  disabled={allocations.reduce((a, b) => a + b, 0) !== 100}
                >
                  <Sparkles className="w-4 h-4" /> Complete Lesson
                </Button>
              </motion.div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

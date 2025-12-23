import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, TrendingUp, Shield, Scale, Sparkles, PieChart, BarChart3, Clock, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, AreaChart, Area } from "recharts";

type Slide = 1 | 2 | 3 | 4;

interface Lesson4Props {
  onComplete?: () => void;
}

// Generate historical-like performance data
const generatePerformanceData = (stockAllocation: number) => {
  const bondAllocation = 100 - stockAllocation;
  const data = [];
  let stockValue = 10000;
  let bondValue = 10000;
  let mixedValue = 10000;
  
  for (let year = 0; year <= 30; year++) {
    // Simulate realistic returns with some volatility
    const stockReturn = 0.10 + Math.sin(year * 0.5) * 0.15 + (Math.random() - 0.5) * 0.08;
    const bondReturn = 0.04 + Math.sin(year * 0.3) * 0.02 + (Math.random() - 0.5) * 0.02;
    
    stockValue *= (1 + stockReturn);
    bondValue *= (1 + bondReturn);
    
    const mixedReturn = (stockAllocation / 100) * stockReturn + (bondAllocation / 100) * bondReturn;
    mixedValue *= (1 + mixedReturn);
    
    data.push({
      year,
      stocks: Math.round(stockValue),
      bonds: Math.round(bondValue),
      mixed: Math.round(mixedValue),
    });
  }
  return data;
};

// Age-based allocation recommendation
const getRecommendedAllocation = (age: number) => {
  return Math.max(20, Math.min(90, 110 - age));
};

// Volatility simulation for rebalancing
const generateVolatilityData = (initialStock: number) => {
  const data = [];
  let stockPercent = initialStock;
  
  for (let month = 0; month <= 24; month++) {
    // Simulate market movements that drift allocation
    const drift = (Math.random() - 0.45) * 8;
    stockPercent = Math.max(10, Math.min(90, stockPercent + drift));
    
    data.push({
      month,
      stocks: Math.round(stockPercent),
      bonds: Math.round(100 - stockPercent),
      target: initialStock,
    });
  }
  return data;
};

export const Lesson4AssetMixSlides = ({ onComplete }: Lesson4Props) => {
  const [currentSlide, setCurrentSlide] = useState<Slide>(1);
  const [stockAllocation, setStockAllocation] = useState(60);
  const [userAge, setUserAge] = useState(30);
  const [performanceData, setPerformanceData] = useState(generatePerformanceData(60));
  const [volatilityData, setVolatilityData] = useState(generateVolatilityData(60));
  const [showExplanation, setShowExplanation] = useState<string | null>(null);
  const [rebalanceTriggered, setRebalanceTriggered] = useState(false);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [animateChart, setAnimateChart] = useState(false);

  const pieData = [
    { name: "Stocks", value: stockAllocation, color: "#10b981" },
    { name: "Bonds", value: 100 - stockAllocation, color: "#3b82f6" },
  ];

  // Animate chart on slide 1
  useEffect(() => {
    if (currentSlide === 1) {
      setAnimateChart(false);
      setTimeout(() => setAnimateChart(true), 300);
    }
  }, [currentSlide]);

  // Update performance data when allocation changes
  useEffect(() => {
    setPerformanceData(generatePerformanceData(stockAllocation));
  }, [stockAllocation]);

  // Cycle through text on slide 1
  useEffect(() => {
    if (currentSlide === 1) {
      const interval = setInterval(() => {
        setCurrentTextIndex(prev => (prev + 1) % learnTexts.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [currentSlide]);

  const learnTexts = [
    "Stocks offer higher growth potential but come with more volatility.",
    "Bonds provide stability and regular income with lower risk.",
    "Your ideal mix depends on your age, goals, and risk tolerance.",
    "Diversification across asset classes reduces overall portfolio risk.",
  ];

  const getProfileLabel = () => {
    if (stockAllocation >= 80) return { text: "Aggressive Growth", color: "text-emerald-400", icon: TrendingUp };
    if (stockAllocation >= 60) return { text: "Growth Balanced", color: "text-amber-400", icon: Scale };
    if (stockAllocation >= 40) return { text: "Conservative Balanced", color: "text-blue-400", icon: Shield };
    return { text: "Income Focused", color: "text-violet-400", icon: Shield };
  };

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

  const handleRebalance = () => {
    setRebalanceTriggered(true);
    setVolatilityData(prev => prev.map((d, i) => ({
      ...d,
      stocks: i >= prev.length - 6 ? stockAllocation : d.stocks,
      bonds: i >= prev.length - 6 ? 100 - stockAllocation : d.bonds,
    })));
  };

  const slideLabels = ["Learn", "Reflect", "Insight", "Apply"];

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
        {/* Slide 1: Learn - Asset Class Introduction */}
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
                Build Your Asset Mix
              </motion.h2>

              {/* Interactive Pie Chart & Performance */}
              <div className="grid md:grid-cols-2 gap-8 mt-6">
                {/* Pie Chart with allocation control */}
                <div className="space-y-4">
                  <div className="h-48 relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPie>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          paddingAngle={2}
                          dataKey="value"
                          animationDuration={500}
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={index} fill={entry.color} />
                          ))}
                        </Pie>
                      </RechartsPie>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-2xl font-bold">{stockAllocation}%</p>
                        <p className="text-xs text-muted-foreground">Stocks</p>
                      </div>
                    </div>
                  </div>

                  {/* Allocation Slider */}
                  <div className="px-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="flex items-center gap-1 text-blue-400">
                        <Shield className="w-4 h-4" /> Bonds
                      </span>
                      <span className="flex items-center gap-1 text-emerald-400">
                        <TrendingUp className="w-4 h-4" /> Stocks
                      </span>
                    </div>
                    <Slider
                      value={[stockAllocation]}
                      onValueChange={(v) => setStockAllocation(v[0])}
                      min={10}
                      max={90}
                      step={5}
                      className="mb-2"
                    />
                    <motion.div 
                      className={`text-center font-semibold ${getProfileLabel().color}`}
                      key={stockAllocation}
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                    >
                      {getProfileLabel().text}
                    </motion.div>
                  </div>

                  {/* Legend */}
                  <div className="flex justify-center gap-6">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-emerald-500" />
                      <span className="text-sm">Stocks: {stockAllocation}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500" />
                      <span className="text-sm">Bonds: {100 - stockAllocation}%</span>
                    </div>
                  </div>
                </div>

                {/* Performance Chart */}
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground text-center">30-Year Growth Simulation ($10k)</p>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={animateChart ? performanceData : []}>
                        <defs>
                          <linearGradient id="stocksGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="bondsGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="mixedGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="year" stroke="hsl(var(--muted-foreground))" fontSize={10} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                          formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
                        />
                        <Area type="monotone" dataKey="stocks" stroke="#10b981" fill="url(#stocksGradient)" strokeWidth={2} name="100% Stocks" />
                        <Area type="monotone" dataKey="bonds" stroke="#3b82f6" fill="url(#bondsGradient)" strokeWidth={2} name="100% Bonds" />
                        <Area type="monotone" dataKey="mixed" stroke="#a855f7" fill="url(#mixedGradient)" strokeWidth={3} name="Your Mix" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex justify-center gap-4 text-xs">
                    <span className="text-emerald-400">— 100% Stocks</span>
                    <span className="text-blue-400">— 100% Bonds</span>
                    <span className="text-violet-400 font-semibold">— Your Mix</span>
                  </div>
                </div>
              </div>

              {/* Animated Text Slides */}
              <motion.div 
                className="mt-8 p-4 bg-muted/30 rounded-lg min-h-[60px] flex items-center justify-center"
                key={currentTextIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
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
                  Continue to Reflect <ArrowRight className="w-4 h-4" />
                </Button>
              </motion.div>
            </Card>
          </motion.div>
        )}

        {/* Slide 2: Reflect - Age-Based Allocation */}
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
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                How Does Age Affect Your Ideal Mix?
              </motion.h2>
              <motion.p 
                className="text-center text-muted-foreground mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                A common rule: subtract your age from 110 to find your stock percentage
              </motion.p>

              {/* Age Timeline */}
              <motion.div 
                className="mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-muted-foreground">Your Age</span>
                  <span className="text-2xl font-bold">{userAge}</span>
                </div>
                <Slider
                  value={[userAge]}
                  onValueChange={(v) => setUserAge(v[0])}
                  min={20}
                  max={70}
                  step={1}
                  className="mb-6"
                />

                {/* Age Milestones */}
                <div className="grid grid-cols-5 gap-2 text-center text-xs">
                  {[20, 30, 40, 50, 60].map((age) => (
                    <motion.div 
                      key={age}
                      className={`p-3 rounded-lg border transition-all ${userAge === age ? 'border-primary bg-primary/10' : 'border-border'}`}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => setUserAge(age)}
                    >
                      <p className="font-bold">{age}s</p>
                      <p className="text-muted-foreground">{getRecommendedAllocation(age)}% stocks</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Recommendation Display */}
              <motion.div 
                className="grid md:grid-cols-2 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                {/* Your Current vs Recommended */}
                <div className="p-6 bg-muted/30 rounded-xl">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <PieChart className="w-5 h-5 text-primary" /> Your Allocation
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Current</span>
                      <span className="font-bold">{stockAllocation}% stocks</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Age-Based Recommendation</span>
                      <span className="font-bold text-primary">{getRecommendedAllocation(userAge)}% stocks</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-primary"
                        initial={{ width: 0 }}
                        animate={{ width: `${getRecommendedAllocation(userAge)}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>
                </div>

                {/* Why This Matters */}
                <div className="p-6 bg-muted/30 rounded-xl">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-amber-400" /> Time Horizon
                  </h3>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <div className="flex items-start gap-2">
                      <ArrowUpRight className="w-4 h-4 text-emerald-400 mt-0.5" />
                      <p>Younger investors have more time to recover from market dips</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <ArrowDownRight className="w-4 h-4 text-blue-400 mt-0.5" />
                      <p>Older investors prioritize stability to protect their nest egg</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <Scale className="w-4 h-4 text-amber-400 mt-0.5" />
                      <p>Gradually shift from growth to income as you approach retirement</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                className="flex justify-between mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <Button variant="outline" onClick={prevSlide} className="gap-2">
                  Back
                </Button>
                <Button onClick={nextSlide} size="lg" className="gap-2">
                  See Insights <ArrowRight className="w-4 h-4" />
                </Button>
              </motion.div>
            </Card>
          </motion.div>
        )}

        {/* Slide 3: Insight - Rebalancing */}
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
                Markets Move — You Must Rebalance
              </motion.h2>
              <motion.p 
                className="text-center text-muted-foreground mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Watch how market fluctuations drift your allocation away from your target
              </motion.p>

              {/* Drift Visualization */}
              <motion.div 
                className="h-64 mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={volatilityData}>
                    <defs>
                      <linearGradient id="driftGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={10} label={{ value: 'Months', position: 'bottom', offset: -5 }} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                      formatter={(value: number) => [`${value}%`, '']}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="stocks" 
                      stroke="#ef4444" 
                      fill="url(#driftGradient)" 
                      strokeWidth={2} 
                      name="Actual Stock %" 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="target" 
                      stroke="#10b981" 
                      strokeWidth={2} 
                      strokeDasharray="5 5" 
                      name="Target" 
                      dot={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Key Insights */}
              <motion.div 
                className="grid md:grid-cols-3 gap-4 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                {[
                  { icon: TrendingUp, title: "Bull Markets", desc: "Stocks grow faster, pushing allocation higher than target", color: "emerald" },
                  { icon: Shield, title: "Bear Markets", desc: "Stocks fall, leaving you under-allocated and missing recovery", color: "rose" },
                  { icon: Scale, title: "Rebalancing", desc: "Periodically sell winners, buy losers to maintain your risk level", color: "blue" },
                ].map((item, i) => (
                  <motion.div 
                    key={i}
                    className="p-4 bg-muted/30 rounded-lg text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + i * 0.1 }}
                  >
                    <item.icon className={`w-8 h-8 mx-auto mb-2 text-${item.color}-400`} style={{ color: item.color === "emerald" ? "#10b981" : item.color === "rose" ? "#ef4444" : "#3b82f6" }} />
                    <h4 className="font-semibold text-sm">{item.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                  </motion.div>
                ))}
              </motion.div>

              {/* Rebalance Button */}
              <motion.div 
                className="flex justify-center mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <Button 
                  variant={rebalanceTriggered ? "secondary" : "default"}
                  onClick={handleRebalance}
                  disabled={rebalanceTriggered}
                  className="gap-2"
                >
                  <Scale className="w-4 h-4" />
                  {rebalanceTriggered ? "Rebalanced!" : "Simulate Rebalance"}
                </Button>
              </motion.div>

              {rebalanceTriggered && (
                <motion.div 
                  className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-center mb-6"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <Sparkles className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                  <p className="text-sm text-emerald-400">Portfolio rebalanced back to {stockAllocation}% stocks target!</p>
                </motion.div>
              )}

              <motion.div 
                className="flex justify-between"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                <Button variant="outline" onClick={prevSlide} className="gap-2">
                  Back
                </Button>
                <Button onClick={nextSlide} size="lg" className="gap-2">
                  Apply Your Knowledge <ArrowRight className="w-4 h-4" />
                </Button>
              </motion.div>
            </Card>
          </motion.div>
        )}

        {/* Slide 4: Apply - Build Your Portfolio */}
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
                Design Your Ideal Portfolio
              </motion.h2>
              <motion.p 
                className="text-center text-muted-foreground mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Challenge: Create an allocation that matches your age and goals
              </motion.p>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Portfolio Builder */}
                <motion.div 
                  className="space-y-6"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <label className="text-sm font-medium mb-2 block">Your Age</label>
                    <Slider
                      value={[userAge]}
                      onValueChange={(v) => setUserAge(v[0])}
                      min={20}
                      max={70}
                      step={1}
                      className="mb-2"
                    />
                    <p className="text-center text-xl font-bold">{userAge} years old</p>
                  </div>

                  <div className="p-4 bg-muted/30 rounded-lg">
                    <label className="text-sm font-medium mb-2 block">Stock Allocation</label>
                    <Slider
                      value={[stockAllocation]}
                      onValueChange={(v) => setStockAllocation(v[0])}
                      min={10}
                      max={90}
                      step={5}
                      className="mb-2"
                    />
                    <div className="flex justify-between text-sm">
                      <span className="text-blue-400">{100 - stockAllocation}% Bonds</span>
                      <span className="text-emerald-400">{stockAllocation}% Stocks</span>
                    </div>
                  </div>

                  {/* Score Card */}
                  <motion.div 
                    className={`p-4 rounded-lg border-2 ${
                      Math.abs(stockAllocation - getRecommendedAllocation(userAge)) <= 10 
                        ? 'border-emerald-500 bg-emerald-500/10' 
                        : 'border-amber-500 bg-amber-500/10'
                    }`}
                    key={`${stockAllocation}-${userAge}`}
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Age-Based Target</p>
                        <p className="text-xl font-bold">{getRecommendedAllocation(userAge)}% stocks</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Your Choice</p>
                        <p className="text-xl font-bold">{stockAllocation}% stocks</p>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-border">
                      {Math.abs(stockAllocation - getRecommendedAllocation(userAge)) <= 10 ? (
                        <div className="flex items-center gap-2 text-emerald-400">
                          <Sparkles className="w-5 h-5" />
                          <span className="font-semibold">Great match! Your allocation aligns with your age.</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-amber-400">
                          <Scale className="w-5 h-5" />
                          <span className="font-semibold">
                            {stockAllocation > getRecommendedAllocation(userAge) 
                              ? "More aggressive than typical for your age" 
                              : "More conservative than typical for your age"}
                          </span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </motion.div>

                {/* Visual Result */}
                <motion.div 
                  className="space-y-4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="h-48 relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPie>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={2}
                          dataKey="value"
                          animationDuration={500}
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={index} fill={entry.color} />
                          ))}
                        </Pie>
                      </RechartsPie>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <p className={`text-lg font-bold ${getProfileLabel().color}`}>{getProfileLabel().text}</p>
                      </div>
                    </div>
                  </div>

                  {/* Summary Stats */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-emerald-500/10 rounded-lg text-center">
                      <TrendingUp className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                      <p className="text-xs text-muted-foreground">Expected Return</p>
                      <p className="font-bold text-emerald-400">{(4 + (stockAllocation / 100) * 6).toFixed(1)}%/yr</p>
                    </div>
                    <div className="p-3 bg-blue-500/10 rounded-lg text-center">
                      <Shield className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                      <p className="text-xs text-muted-foreground">Volatility</p>
                      <p className="font-bold text-blue-400">{stockAllocation > 70 ? "High" : stockAllocation > 40 ? "Medium" : "Low"}</p>
                    </div>
                    <div className="p-3 bg-violet-500/10 rounded-lg text-center col-span-2">
                      <BarChart3 className="w-5 h-5 text-violet-400 mx-auto mb-1" />
                      <p className="text-xs text-muted-foreground">30-Year Projection ($10k)</p>
                      <p className="font-bold text-violet-400">${performanceData[performanceData.length - 1]?.mixed.toLocaleString()}</p>
                    </div>
                  </div>
                </motion.div>
              </div>

              <motion.div 
                className="flex justify-between mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <Button variant="outline" onClick={prevSlide} className="gap-2">
                  Back
                </Button>
                <Button onClick={nextSlide} size="lg" className="gap-2 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600">
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

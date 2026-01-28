import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  Sparkles, 
  TrendingUp, 
  Clock, 
  DollarSign,
  Target,
  Lightbulb,
  Zap,
  Info
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  ResponsiveContainer, 
  Tooltip,
  Area,
  ComposedChart,
  ReferenceDot
} from "recharts";

type Slide = 1 | 2 | 3 | 4;

interface Lesson3Props {
  onComplete?: () => void;
}

// Calculate compound interest
const calculateCompoundGrowth = (principal: number, rate: number, years: number, monthlyContribution: number = 0) => {
  const monthlyRate = rate / 100 / 12;
  const months = years * 12;
  
  // Future value of principal
  const fvPrincipal = principal * Math.pow(1 + monthlyRate, months);
  
  // Future value of monthly contributions
  const fvContributions = monthlyContribution > 0 
    ? monthlyContribution * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate)
    : 0;
  
  return fvPrincipal + fvContributions;
};

// Generate chart data for compound growth
const generateCompoundData = (years: number, rate: number = 7) => {
  const data = [];
  const principal = 1000;
  
  for (let year = 0; year <= years; year++) {
    const compounded = calculateCompoundGrowth(principal, rate, year);
    const simple = principal * (1 + (rate / 100) * year);
    
    data.push({
      year,
      compounded: Math.round(compounded),
      principal: principal,
      simple: Math.round(simple),
      interestEarned: Math.round(compounded - principal),
    });
  }
  return data;
};

// Find inflection points where growth accelerates
const findInflectionPoints = (data: ReturnType<typeof generateCompoundData>) => {
  const points = [];
  for (let i = 1; i < data.length - 1; i++) {
    const prevGrowth = data[i].compounded - data[i-1].compounded;
    const currGrowth = data[i+1].compounded - data[i].compounded;
    
    // Significant acceleration points
    if (currGrowth > prevGrowth * 1.1 && i >= 5 && i % 5 === 0) {
      points.push({
        year: data[i].year,
        value: data[i].compounded,
        explanation: getInflectionExplanation(data[i].year, data[i].compounded, data[i].interestEarned)
      });
    }
  }
  return points.slice(0, 3); // Max 3 points
};

const getInflectionExplanation = (year: number, value: number, interestEarned: number) => {
  if (year <= 10) {
    return `Year ${year}: Your interest is now generating ${Math.round(interestEarned / value * 100)}% of your total!`;
  } else if (year <= 20) {
    return `Year ${year}: Compound growth is accelerating—interest on interest is snowballing.`;
  }
  return `Year ${year}: The exponential curve is now in full effect. Your money works harder than you!`;
};

export const Lesson3CompoundInterestSlides = ({ onComplete }: Lesson3Props) => {
  const [currentSlide, setCurrentSlide] = useState<Slide>(1);
  const [years, setYears] = useState(20);
  const [interestRate, setInterestRate] = useState(7);
  const [chartData, setChartData] = useState(generateCompoundData(20, 7));
  const [inflectionPoints, setInflectionPoints] = useState<ReturnType<typeof findInflectionPoints>>([]);
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const [comparisonRate, setComparisonRate] = useState(4);
  const [showComparison, setShowComparison] = useState(false);
  const [currentTextSlide, setCurrentTextSlide] = useState(0);
  const [chartAnimated, setChartAnimated] = useState(false);
  
  // Slide 4 state
  const [startAge, setStartAge] = useState(25);
  const [monthlyContribution, setMonthlyContribution] = useState(200);
  const [goalReached, setGoalReached] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  
  const GOAL_TARGET = 100000;
  const GOAL_AGE = 50;

  // Text slides for Learn section
  const textSlides = [
    { icon: TrendingUp, text: "Compound interest means your earnings generate earnings.", color: "#10b981" },
    { icon: Clock, text: "Time is your most powerful tool—starting early magnifies growth.", color: "#3b82f6" },
    { icon: DollarSign, text: "Even small, consistent contributions grow substantially over decades.", color: "#a855f7" },
  ];

  // Animate text slides sequentially
  useEffect(() => {
    if (currentSlide === 1) {
      setCurrentTextSlide(0);
      setChartAnimated(false);
      
      // Trigger chart animation
      setTimeout(() => setChartAnimated(true), 300);
      
      // Sequential text reveals
      const timers = textSlides.map((_, index) => 
        setTimeout(() => setCurrentTextSlide(index + 1), 1500 + index * 1500)
      );
      
      return () => timers.forEach(clearTimeout);
    }
  }, [currentSlide]);

  // Update chart data when years change (Slide 1)
  useEffect(() => {
    if (currentSlide === 1) {
      const newData = generateCompoundData(years, 7);
      setChartData(newData);
    }
  }, [years, currentSlide]);

  // Update inflection points for Slide 2
  useEffect(() => {
    if (currentSlide === 2) {
      const newData = generateCompoundData(40, 7);
      setChartData(newData);
      setInflectionPoints(findInflectionPoints(newData));
    }
  }, [currentSlide]);

  // Update chart for rate comparison (Slide 3)
  useEffect(() => {
    if (currentSlide === 3) {
      const newData = generateCompoundData(30, interestRate);
      setChartData(newData);
    }
  }, [interestRate, currentSlide]);

  // Calculate goal progress (Slide 4)
  useEffect(() => {
    if (currentSlide === 4) {
      const yearsToInvest = GOAL_AGE - startAge;
      const finalValue = calculateCompoundGrowth(0, 7, yearsToInvest, monthlyContribution);
      const reached = finalValue >= GOAL_TARGET;
      setGoalReached(reached);
      
      if (reached && !showConfetti) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
    }
  }, [startAge, monthlyContribution, currentSlide]);

  // Generate goal chart data
  const generateGoalChartData = useCallback(() => {
    const data = [];
    const yearsToInvest = GOAL_AGE - startAge;
    
    for (let age = startAge; age <= GOAL_AGE; age++) {
      const yearsInvested = age - startAge;
      const value = calculateCompoundGrowth(0, 7, yearsInvested, monthlyContribution);
      data.push({
        age,
        value: Math.round(value),
        goal: GOAL_TARGET,
      });
    }
    return data;
  }, [startAge, monthlyContribution]);

  const nextSlide = () => {
    if (currentSlide < 4) {
      setCurrentSlide((currentSlide + 1) as Slide);
    } else {
      onComplete?.();
    }
  };

  const slideLabels = ["Learn", "Reflect", "Insight", "Apply"];

  // Enhanced tooltip for chart showing all values
  const EnhancedTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = chartData.find(d => d.year === label);
      if (!data) return null;
      
      return (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-background/95 backdrop-blur-sm border border-border rounded-xl p-4 shadow-xl"
        >
          <p className="font-bold text-lg mb-2">Year {label}</p>
          <div className="space-y-2">
            <div className="flex justify-between gap-6">
              <span className="text-muted-foreground">Principal:</span>
              <span className="font-semibold">${data.principal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between gap-6">
              <span className="text-muted-foreground">Interest Earned:</span>
              <span className="font-semibold text-primary">${data.interestEarned.toLocaleString()}</span>
            </div>
            <div className="flex justify-between gap-6 pt-2 border-t border-border">
              <span className="text-muted-foreground">Total Value:</span>
              <span className="font-bold text-emerald-400">${data.compounded.toLocaleString()}</span>
            </div>
          </div>
        </motion.div>
      );
    }
    return null;
  };

  // Simple tooltip for other slides
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background/95 border border-border rounded-lg p-3 shadow-lg">
          <p className="font-semibold">Year {label}</p>
          <p className="text-primary">${payload[0]?.value?.toLocaleString()}</p>
        </div>
      );
    }
    return null;
  };

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
        {/* Slide 1: Learn */}
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
              
              {/* Chart Section - TOP */}
              <motion.div 
                className="h-80 relative mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {/* Years Slider - Overlaid on chart area */}
                <div className="absolute top-0 right-0 z-10 bg-background/80 backdrop-blur-sm rounded-lg p-3 border border-border">
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <div className="w-32">
                      <Slider
                        value={[years]}
                        onValueChange={(v) => setYears(v[0])}
                        min={1}
                        max={40}
                        step={1}
                      />
                    </div>
                    <span className="text-sm font-bold text-primary w-16">{years} years</span>
                  </div>
                </div>

                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={chartData}>
                    <defs>
                      <linearGradient id="compoundGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis 
                      dataKey="year" 
                      stroke="hsl(var(--muted-foreground))" 
                      fontSize={12}
                      label={{ value: "Years Invested", position: "bottom", offset: -5 }}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))" 
                      fontSize={12} 
                      tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`}
                    />
                    <Tooltip content={<EnhancedTooltip />} />
                    <Area 
                      type="monotone" 
                      dataKey="compounded" 
                      fill="url(#compoundGradient)" 
                      stroke="none"
                      animationDuration={chartAnimated ? 2000 : 0}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="principal" 
                      stroke="hsl(var(--muted-foreground))"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={false}
                      name="Principal"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="compounded" 
                      stroke="#10b981"
                      strokeWidth={3}
                      dot={false}
                      name="Compound Growth"
                      animationDuration={chartAnimated ? 2000 : 0}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
                
                {/* Legend */}
                <div className="absolute bottom-8 left-12 flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-0.5 bg-muted-foreground" style={{ borderStyle: "dashed" }} />
                    <span className="text-muted-foreground">Principal</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-0.5 bg-emerald-500" />
                    <span className="text-emerald-400">Compound Growth</span>
                  </div>
                </div>

                {/* Pulsing sparkle effect */}
                <motion.div
                  className="absolute right-16 top-12 pointer-events-none"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <Sparkles className="w-6 h-6 text-emerald-400" />
                </motion.div>
              </motion.div>

              {/* Sequential Text Slides - BOTTOM */}
              <div className="space-y-4 mb-8">
                {textSlides.map((slide, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ 
                      opacity: currentTextSlide > index ? 1 : 0.3,
                      x: currentTextSlide > index ? 0 : -10
                    }}
                    transition={{ duration: 0.5 }}
                    className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                      currentTextSlide > index 
                        ? "border-primary/30 bg-primary/5" 
                        : "border-border/50 bg-muted/20"
                    }`}
                  >
                    <motion.div
                      animate={currentTextSlide > index ? { scale: [1, 1.2, 1] } : {}}
                      transition={{ duration: 0.3 }}
                    >
                      <slide.icon 
                        className="w-8 h-8 flex-shrink-0" 
                        style={{ color: currentTextSlide > index ? slide.color : "hsl(var(--muted-foreground))" }}
                      />
                    </motion.div>
                    <p className={`text-lg transition-colors ${
                      currentTextSlide > index ? "text-foreground" : "text-muted-foreground"
                    }`}>
                      {slide.text}
                    </p>
                    {currentTextSlide > index && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="ml-auto"
                      >
                        <Sparkles className="w-5 h-5 text-primary" />
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Stats Summary */}
              <motion.div 
                className="grid grid-cols-3 gap-4 mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: currentTextSlide >= 3 ? 1 : 0.5 }}
                transition={{ delay: 0.3 }}
              >
                <div className="text-center p-4 rounded-xl bg-muted/50 border border-border">
                  <p className="text-xs text-muted-foreground mb-1">Starting Amount</p>
                  <p className="text-2xl font-bold">$1,000</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                  <p className="text-xs text-muted-foreground mb-1">Final Value</p>
                  <p className="text-2xl font-bold text-emerald-400">
                    ${chartData[chartData.length-1]?.compounded.toLocaleString()}
                  </p>
                </div>
                <div className="text-center p-4 rounded-xl bg-primary/10 border border-primary/30">
                  <p className="text-xs text-muted-foreground mb-1">Interest Earned</p>
                  <p className="text-2xl font-bold text-primary">
                    ${chartData[chartData.length-1]?.interestEarned.toLocaleString()}
                  </p>
                </div>
              </motion.div>

              <motion.div 
                className="flex justify-center relative z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: currentTextSlide >= 3 ? 1 : 0.5 }}
                transition={{ delay: 0.5 }}
              >
                <Button 
                  onClick={nextSlide} 
                  size="lg" 
                  className="gap-2"
                  disabled={currentTextSlide < 3}
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
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Why Starting Early Matters
              </motion.h2>
              <motion.p 
                className="text-center text-muted-foreground mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Notice how small changes in time drastically alter the outcome. Can you see why starting early matters more than investing larger sums later?
              </motion.p>

              {/* Chart with inflection points */}
              <motion.div 
                className="h-72 relative mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={chartData}>
                    <defs>
                      <linearGradient id="reflectGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="year" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area 
                      type="monotone" 
                      dataKey="compounded" 
                      fill="url(#reflectGradient)" 
                      stroke="none"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="compounded" 
                      stroke="#f59e0b"
                      strokeWidth={3}
                      dot={false}
                    />
                    {/* Inflection point markers */}
                    {inflectionPoints.map((point, index) => (
                      <ReferenceDot
                        key={index}
                        x={point.year}
                        y={point.value}
                        r={hoveredPoint === index ? 12 : 8}
                        fill={hoveredPoint === index ? "#f59e0b" : "#fbbf24"}
                        stroke="#fff"
                        strokeWidth={2}
                      />
                    ))}
                  </ComposedChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Inflection point cards */}
              <div className="grid md:grid-cols-3 gap-4 mb-8">
                {inflectionPoints.map((point, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + index * 0.2 }}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      hoveredPoint === index 
                        ? "border-amber-500 bg-amber-500/10 scale-105" 
                        : "border-border hover:border-amber-500/50"
                    }`}
                    onMouseEnter={() => setHoveredPoint(index)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <motion.div
                        animate={hoveredPoint === index ? { rotate: [0, 15, -15, 0] } : {}}
                        transition={{ duration: 0.5 }}
                      >
                        <Zap className="w-5 h-5 text-amber-400" />
                      </motion.div>
                      <span className="font-bold">Year {point.year}</span>
                    </div>
                    <p className="text-2xl font-bold text-amber-400 mb-2">
                      ${point.value.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">{point.explanation}</p>
                  </motion.div>
                ))}
              </div>

              <motion.p 
                className="text-center text-muted-foreground text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3 }}
              >
                Hover over the cards to see how compound growth accelerates at key moments
              </motion.p>

              <motion.div 
                className="flex justify-center mt-8 relative z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
              >
                <Button onClick={nextSlide} size="lg" className="gap-2">
                  Discover Insights <ArrowRight className="w-4 h-4" />
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
                className="text-2xl font-bold text-center mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                The Power of Compound Interest
              </motion.h2>

              {/* Key insights */}
              <motion.div 
                className="grid md:grid-cols-3 gap-4 mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {[
                  { icon: TrendingUp, text: "Compound interest accelerates wealth because your earnings generate earnings.", color: "emerald" },
                  { icon: Clock, text: "The earlier you start, the more dramatic the growth.", color: "blue" },
                  { icon: DollarSign, text: "Even small contributions consistently over time create large outcomes.", color: "purple" },
                ].map((insight, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.15 }}
                    className="p-4 rounded-xl bg-muted/50 border border-border"
                  >
                    <insight.icon className={`w-8 h-8 mb-3 text-${insight.color}-400`} style={{
                      color: insight.color === "emerald" ? "#10b981" : insight.color === "blue" ? "#3b82f6" : "#a855f7"
                    }} />
                    <p className="text-sm">{insight.text}</p>
                  </motion.div>
                ))}
              </motion.div>

              {/* Interest rate toggle */}
              <motion.div 
                className="mb-6 px-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">Adjust Annual Interest Rate</span>
                  <span className="text-lg font-bold text-blue-400">{interestRate}%</span>
                </div>
                <Slider
                  value={[interestRate]}
                  onValueChange={(v) => setInterestRate(v[0])}
                  min={2}
                  max={12}
                  step={1}
                  className="mb-4"
                />
                
                {/* Comparison toggle */}
                <div className="flex items-center gap-2 mt-4">
                  <Button 
                    variant={showComparison ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setShowComparison(!showComparison)}
                  >
                    Compare with {comparisonRate}%
                  </Button>
                  {showComparison && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-sm text-muted-foreground"
                    >
                      <Slider
                        value={[comparisonRate]}
                        onValueChange={(v) => setComparisonRate(v[0])}
                        min={2}
                        max={12}
                        step={1}
                        className="w-24"
                      />
                    </motion.div>
                  )}
                </div>
              </motion.div>

              {/* Chart */}
              <motion.div 
                className="h-64 relative mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={chartData}>
                    <defs>
                      <linearGradient id="insightGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="year" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area 
                      type="monotone" 
                      dataKey="compounded" 
                      fill="url(#insightGradient)" 
                      stroke="none"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="compounded" 
                      stroke="#3b82f6"
                      strokeWidth={3}
                      dot={false}
                    />
                    {showComparison && (
                      <Line 
                        type="monotone" 
                        dataKey="compounded"
                        data={generateCompoundData(30, comparisonRate)}
                        stroke="#6b7280"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={false}
                      />
                    )}
                  </ComposedChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Rate comparison popup */}
              <motion.div
                className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 mb-6"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.1 }}
              >
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div>
                    <p className="font-semibold text-blue-400">Rate Impact</p>
                    <p className="text-sm text-muted-foreground">
                      At {interestRate}% interest, $1,000 grows to ${chartData[chartData.length-1]?.compounded.toLocaleString()} in 30 years
                      {showComparison && ` vs $${generateCompoundData(30, comparisonRate)[30]?.compounded.toLocaleString()} at ${comparisonRate}%`}
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                className="flex justify-center mt-8 relative z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3 }}
              >
                <Button onClick={nextSlide} size="lg" className="gap-2">
                  Try the Challenge <ArrowRight className="w-4 h-4" />
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
            <Card className="p-8 relative overflow-hidden">
              {/* Confetti effect */}
              <AnimatePresence>
                {showConfetti && (
                  <motion.div 
                    className="absolute inset-0 pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {[...Array(20)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-3 h-3 rounded-full"
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: -20,
                          backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ec4899'][i % 4],
                        }}
                        initial={{ y: 0, opacity: 1 }}
                        animate={{ 
                          y: 600, 
                          opacity: 0,
                          rotate: Math.random() * 720,
                          x: (Math.random() - 0.5) * 200
                        }}
                        transition={{ 
                          duration: 2 + Math.random(), 
                          delay: i * 0.05,
                          ease: "easeOut"
                        }}
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              <Badge className="mb-4 bg-purple-500/20 text-purple-400 border-purple-500/30">Apply</Badge>
              
              <motion.h2 
                className="text-2xl font-bold text-center mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Reach $100,000 by Age 50
              </motion.h2>
              <motion.p 
                className="text-center text-muted-foreground mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Adjust your starting age and monthly contribution to hit the goal. See how time and consistency affect growth.
              </motion.p>

              {/* Controls */}
              <motion.div 
                className="grid md:grid-cols-2 gap-8 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">Starting Age</span>
                    <span className="text-lg font-bold">{startAge} years old</span>
                  </div>
                  <Slider
                    value={[startAge]}
                    onValueChange={(v) => setStartAge(v[0])}
                    min={18}
                    max={40}
                    step={1}
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">Monthly Contribution</span>
                    <span className="text-lg font-bold">${monthlyContribution}</span>
                  </div>
                  <Slider
                    value={[monthlyContribution]}
                    onValueChange={(v) => setMonthlyContribution(v[0])}
                    min={0}
                    max={1000}
                    step={25}
                  />
                </div>
              </motion.div>

              {/* Goal Chart */}
              <motion.div 
                className={`h-64 relative mb-6 transition-all ${
                  goalReached ? "border-2 border-emerald-500/30 rounded-xl" : ""
                }`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={generateGoalChartData()}>
                    <defs>
                      <linearGradient id="goalGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={goalReached ? "#10b981" : "#ef4444"} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={goalReached ? "#10b981" : "#ef4444"} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis 
                      dataKey="age" 
                      stroke="hsl(var(--muted-foreground))" 
                      fontSize={12}
                      label={{ value: 'Age', position: 'bottom', offset: -5 }}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))" 
                      fontSize={12} 
                      tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line 
                      type="monotone" 
                      dataKey="goal"
                      stroke="#a855f7"
                      strokeWidth={2}
                      strokeDasharray="10 5"
                      dot={false}
                      name="Goal"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      fill="url(#goalGradient)" 
                      stroke="none"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke={goalReached ? "#10b981" : "#ef4444"}
                      strokeWidth={3}
                      dot={false}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Result display */}
              <motion.div
                className={`p-6 rounded-xl border-2 mb-6 transition-all ${
                  goalReached 
                    ? "border-emerald-500 bg-emerald-500/10" 
                    : "border-rose-500 bg-rose-500/10"
                }`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  x: !goalReached ? [0, -5, 5, -5, 5, 0] : 0
                }}
                transition={{ 
                  opacity: { delay: 0.8 },
                  x: { duration: 0.4, delay: 0.8 }
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Your Total at Age 50</p>
                    <p className={`text-3xl font-bold ${goalReached ? "text-emerald-400" : "text-rose-400"}`}>
                      ${calculateCompoundGrowth(0, 7, GOAL_AGE - startAge, monthlyContribution).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground mb-1">Total Contributed</p>
                    <p className="text-xl font-semibold">
                      ${(monthlyContribution * (GOAL_AGE - startAge) * 12).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex items-center gap-2">
                    {goalReached ? (
                      <>
                        <Sparkles className="w-5 h-5 text-emerald-400" />
                        <span className="font-semibold text-emerald-400">Goal Reached! Great strategy!</span>
                      </>
                    ) : (
                      <>
                        <Target className="w-5 h-5 text-rose-400" />
                        <span className="font-semibold text-rose-400">
                          Need ${(GOAL_TARGET - calculateCompoundGrowth(0, 7, GOAL_AGE - startAge, monthlyContribution)).toLocaleString(undefined, { maximumFractionDigits: 0 })} more. Try starting earlier or contributing more!
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>

              <motion.div 
                className="flex justify-center mt-8 relative z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <Button 
                  onClick={nextSlide} 
                  size="lg" 
                  className={`gap-2 ${goalReached ? "bg-emerald-600 hover:bg-emerald-700" : ""}`}
                >
                  Complete Lesson <Sparkles className="w-4 h-4" />
                </Button>
              </motion.div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

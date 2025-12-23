import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Shield, TrendingUp, ArrowRight, Sparkles, Target, AlertTriangle, CheckCircle2 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, ReferenceLine, Area, ComposedChart } from "recharts";

type Slide = 1 | 2 | 3 | 4;

interface Lesson2Props {
  onComplete?: () => void;
}

// Generate chart data based on risk level
const generateChartData = (riskLevel: number, seed: number = 1) => {
  const data = [];
  let value = 1000;
  const volatility = riskLevel / 100;
  const baseGrowth = 0.005 + (riskLevel / 100) * 0.01;
  
  for (let year = 0; year <= 20; year++) {
    const randomFactor = Math.sin(year * seed * 0.5) * volatility * 150;
    value = value * (1 + baseGrowth) + randomFactor;
    value = Math.max(value, 200);
    data.push({
      year,
      value: Math.round(value),
    });
  }
  return data;
};

// Generate multiple trajectory paths
const generateMultiplePaths = (riskLevel: number, count: number = 7) => {
  const paths = [];
  for (let i = 0; i < count; i++) {
    paths.push(generateChartData(riskLevel, i + 1));
  }
  return paths;
};

export const Lesson2RiskRewardSlides = ({ onComplete }: Lesson2Props) => {
  const [currentSlide, setCurrentSlide] = useState<Slide>(1);
  const [riskLevel, setRiskLevel] = useState(50);
  const [showConfetti, setShowConfetti] = useState(false);
  const [selectedPath, setSelectedPath] = useState<number | null>(null);
  const [animatedPaths, setAnimatedPaths] = useState<number[]>([]);
  const [chartData, setChartData] = useState(generateChartData(50));
  const [multiplePaths, setMultiplePaths] = useState(generateMultiplePaths(50));

  // Update chart when risk changes
  useEffect(() => {
    setChartData(generateChartData(riskLevel));
    setMultiplePaths(generateMultiplePaths(riskLevel));
  }, [riskLevel]);

  // Animate paths on slide 3
  useEffect(() => {
    if (currentSlide === 3) {
      setAnimatedPaths([]);
      multiplePaths.forEach((_, index) => {
        setTimeout(() => {
          setAnimatedPaths(prev => [...prev, index]);
        }, index * 400);
      });
    }
  }, [currentSlide, multiplePaths]);

  const getRiskLabel = () => {
    if (riskLevel <= 33) return { text: "Low risk: small but steady growth", color: "text-emerald-400" };
    if (riskLevel <= 66) return { text: "Medium risk: higher gains but some volatility", color: "text-amber-400" };
    return { text: "High risk: large potential reward and possible losses", color: "text-rose-400" };
  };

  const handleSliderChange = (value: number[]) => {
    setRiskLevel(value[0]);
    if (value[0] >= 95 || value[0] <= 5) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 1500);
    }
  };

  const getPathOutcome = (pathIndex: number) => {
    const path = multiplePaths[pathIndex];
    const finalValue = path[path.length - 1].value;
    const maxValue = Math.max(...path.map(p => p.value));
    const minValue = Math.min(...path.map(p => p.value));
    return { finalValue, maxValue, minValue, volatility: maxValue - minValue };
  };

  const nextSlide = () => {
    if (currentSlide < 4) {
      setCurrentSlide((currentSlide + 1) as Slide);
    } else {
      onComplete?.();
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress indicator */}
      <div className="flex justify-center gap-2 mb-4">
        {[1, 2, 3, 4].map((slide) => (
          <motion.div
            key={slide}
            className={`h-2 rounded-full transition-all duration-300 ${
              slide === currentSlide 
                ? "w-8 bg-primary" 
                : slide < currentSlide 
                  ? "w-4 bg-primary/50" 
                  : "w-4 bg-muted"
            }`}
            layoutId="slideIndicator"
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Slide 1: Scenario Setup */}
        {currentSlide === 1 && (
          <motion.div
            key="slide1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-8 bg-gradient-to-br from-background via-background to-muted/20 border-2 overflow-hidden relative">
              {/* Background grid */}
              <div className="absolute inset-0 opacity-5">
                <svg width="100%" height="100%">
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              </div>

              <motion.h2 
                className="text-2xl font-bold text-center mb-8 relative z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Two investors. Same starting point. Different approaches.
              </motion.h2>

              <div className="grid md:grid-cols-2 gap-8 relative z-10">
                {/* Conservative Investor */}
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, type: "spring", bounce: 0.4 }}
                  className="text-center"
                >
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-emerald-500/20 flex items-center justify-center border-2 border-emerald-500/50">
                    <Shield className="w-12 h-12 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Conservative Investor</h3>
                  <p className="text-muted-foreground mb-4">Plays it safe, low risk</p>
                  <motion.div 
                    className="text-3xl font-bold text-emerald-400"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.8, type: "spring" }}
                  >
                    $1,000
                  </motion.div>
                  {/* Potential gain bar */}
                  <motion.div 
                    className="mt-4 h-2 bg-muted rounded-full overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                  >
                    <motion.div 
                      className="h-full bg-emerald-500/50"
                      initial={{ width: 0 }}
                      animate={{ width: "30%" }}
                      transition={{ delay: 1.4, duration: 0.8 }}
                    />
                  </motion.div>
                  <p className="text-xs text-muted-foreground mt-1">Potential gain range</p>
                </motion.div>

                {/* Growth Investor */}
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7, type: "spring", bounce: 0.4 }}
                  className="text-center"
                >
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-amber-500/20 flex items-center justify-center border-2 border-amber-500/50">
                    <TrendingUp className="w-12 h-12 text-amber-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Growth Investor</h3>
                  <p className="text-muted-foreground mb-4">Takes calculated risks, higher potential</p>
                  <motion.div 
                    className="text-3xl font-bold text-amber-400"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1.0, type: "spring" }}
                  >
                    $1,000
                  </motion.div>
                  {/* Potential gain bar */}
                  <motion.div 
                    className="mt-4 h-2 bg-muted rounded-full overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                  >
                    <motion.div 
                      className="h-full bg-amber-500/50"
                      initial={{ width: 0 }}
                      animate={{ width: "75%" }}
                      transition={{ delay: 1.6, duration: 0.8 }}
                    />
                  </motion.div>
                  <p className="text-xs text-muted-foreground mt-1">Potential gain range</p>
                </motion.div>
              </div>

              <motion.p 
                className="text-center text-lg text-muted-foreground mt-8 relative z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.8 }}
              >
                Both start with $1,000. One keeps it safe, one takes a calculated risk.
                <br />
                <span className="text-foreground font-semibold">Let's see what happens over time.</span>
              </motion.p>

              <motion.div 
                className="flex justify-center mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.2 }}
              >
                <Button onClick={nextSlide} size="lg" className="gap-2">
                  Explore Risk <ArrowRight className="w-4 h-4" />
                </Button>
              </motion.div>
            </Card>
          </motion.div>
        )}

        {/* Slide 2: Interactive Risk Slider */}
        {currentSlide === 2 && (
          <motion.div
            key="slide2"
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
                    className="absolute inset-0 pointer-events-none z-20"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {[...Array(20)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-2 h-2 rounded-full"
                        style={{
                          left: `${Math.random() * 100}%`,
                          backgroundColor: ['#10b981', '#f59e0b', '#ef4444', '#6366f1'][i % 4],
                        }}
                        initial={{ y: -20, opacity: 1 }}
                        animate={{ y: 400, opacity: 0, rotate: 360 }}
                        transition={{ duration: 1.5, delay: i * 0.05 }}
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.h2 
                className="text-2xl font-bold text-center mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Adjust the Risk Slider
              </motion.h2>
              <motion.p 
                className="text-center text-muted-foreground mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Watch how your $1,000 could grow or shrink. Notice how uncertainty changes with risk.
              </motion.p>

              {/* Risk Slider */}
              <motion.div 
                className="mb-8 px-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-emerald-400">Low Risk</span>
                  <span className="text-amber-400">Medium Risk</span>
                  <span className="text-rose-400">High Risk</span>
                </div>
                <Slider
                  value={[riskLevel]}
                  onValueChange={handleSliderChange}
                  max={100}
                  step={1}
                  className="mb-4"
                />
                <motion.div 
                  className={`text-center font-semibold ${getRiskLabel().color}`}
                  key={riskLevel}
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                >
                  {getRiskLabel().text}
                </motion.div>
              </motion.div>

              {/* Live Chart */}
              <motion.div 
                className="h-64 relative"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={chartData}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={riskLevel > 66 ? "#ef4444" : riskLevel > 33 ? "#f59e0b" : "#10b981"} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={riskLevel > 66 ? "#ef4444" : riskLevel > 33 ? "#f59e0b" : "#10b981"} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="year" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `$${(v/1000).toFixed(1)}k`} />
                    <ReferenceLine y={1000} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      fill="url(#colorValue)" 
                      stroke="none"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke={riskLevel > 66 ? "#ef4444" : riskLevel > 33 ? "#f59e0b" : "#10b981"}
                      strokeWidth={3}
                      dot={false}
                      animationDuration={500}
                    />
                  </ComposedChart>
                </ResponsiveContainer>

                {/* Animated arrows showing peaks and dips */}
                {riskLevel > 50 && (
                  <>
                    <motion.div 
                      className="absolute top-4 right-1/4 text-emerald-400"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      <TrendingUp className="w-6 h-6" />
                    </motion.div>
                    <motion.div 
                      className="absolute bottom-20 right-1/3 text-rose-400 rotate-180"
                      animate={{ y: [0, 5, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5, delay: 0.5 }}
                    >
                      <TrendingUp className="w-6 h-6" />
                    </motion.div>
                  </>
                )}
              </motion.div>

              {/* Stats */}
              <motion.div 
                className="grid grid-cols-3 gap-4 mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <div className="text-center p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground">Risk Level</p>
                  <p className="text-xl font-bold">{riskLevel}%</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground">Final Value</p>
                  <p className="text-xl font-bold text-primary">${chartData[chartData.length-1]?.value.toLocaleString()}</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground">Volatility</p>
                  <p className="text-xl font-bold">{riskLevel > 66 ? "High" : riskLevel > 33 ? "Medium" : "Low"}</p>
                </div>
              </motion.div>

              <motion.div 
                className="flex justify-center mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <Button onClick={nextSlide} size="lg" className="gap-2">
                  See All Outcomes <ArrowRight className="w-4 h-4" />
                </Button>
              </motion.div>
            </Card>
          </motion.div>
        )}

        {/* Slide 3: Animated Outcome Reveal */}
        {currentSlide === 3 && (
          <motion.div
            key="slide3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-8">
              <motion.h2 
                className="text-2xl font-bold text-center mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Multiple Possible Outcomes
              </motion.h2>
              <motion.p 
                className="text-center text-muted-foreground mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Higher risk increases the range of outcomes. Reward is not guaranteed; volatility is the cost.
              </motion.p>

              {/* Risk indicator */}
              <div className="flex justify-center mb-4">
                <Badge variant={riskLevel > 66 ? "destructive" : riskLevel > 33 ? "default" : "secondary"} className="text-sm">
                  {riskLevel > 66 ? "High Risk" : riskLevel > 33 ? "Medium Risk" : "Low Risk"} Selected
                </Badge>
              </div>

              {/* Multiple paths chart */}
              <motion.div 
                className="h-80 relative"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart>
                    <XAxis 
                      dataKey="year" 
                      stroke="hsl(var(--muted-foreground))" 
                      fontSize={12}
                      type="number"
                      domain={[0, 20]}
                      ticks={[0, 5, 10, 15, 20]}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))" 
                      fontSize={12} 
                      tickFormatter={(v) => `$${(v/1000).toFixed(1)}k`}
                      domain={['dataMin - 200', 'dataMax + 200']}
                    />
                    <ReferenceLine y={1000} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" label={{ value: 'Start', position: 'left', fontSize: 10 }} />
                    
                    {multiplePaths.map((path, index) => (
                      animatedPaths.includes(index) && (
                        <Line
                          key={index}
                          data={path}
                          type="monotone"
                          dataKey="value"
                          stroke={index === 3 ? "hsl(var(--primary))" : `hsl(${200 + index * 20}, 70%, 50%)`}
                          strokeWidth={index === 3 ? 3 : 1.5}
                          strokeOpacity={index === 3 ? 1 : 0.5}
                          dot={false}
                          animationDuration={800}
                        />
                      )
                    ))}
                  </LineChart>
                </ResponsiveContainer>

                {/* Max/Min annotations */}
                {animatedPaths.length === multiplePaths.length && (
                  <>
                    <motion.div 
                      className="absolute top-8 right-8 flex items-center gap-2 text-emerald-400"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 3 }}
                    >
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-sm font-semibold">Max Gain</span>
                    </motion.div>
                    <motion.div 
                      className="absolute bottom-24 right-8 flex items-center gap-2 text-rose-400"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 3.2 }}
                    >
                      <AlertTriangle className="w-4 h-4" />
                      <span className="text-sm font-semibold">Max Loss</span>
                    </motion.div>
                  </>
                )}
              </motion.div>

              {/* Insight text */}
              <motion.div 
                className="mt-6 p-4 rounded-lg bg-muted/50 border text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 3.5 }}
              >
                <p className="text-muted-foreground">
                  <span className="font-semibold text-foreground">This is the trade-off:</span> bigger swings can mean bigger gains, or bigger losses.
                </p>
              </motion.div>

              <motion.div 
                className="flex justify-center mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 4 }}
              >
                <Button onClick={nextSlide} size="lg" className="gap-2">
                  Reflect <ArrowRight className="w-4 h-4" />
                </Button>
              </motion.div>
            </Card>
          </motion.div>
        )}

        {/* Slide 4: Reflection + Insight */}
        {currentSlide === 4 && (
          <motion.div
            key="slide4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-8">
              <motion.h2 
                className="text-2xl font-bold text-center mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Which outcome could you realistically hold through?
              </motion.h2>

              {/* Interactive path selection */}
              <div className="grid md:grid-cols-3 gap-4 mb-8">
                {[
                  { label: "Conservative", desc: "Smaller gains, smaller swings", icon: Shield, color: "emerald" },
                  { label: "Balanced", desc: "Moderate gains and volatility", icon: Target, color: "amber" },
                  { label: "Aggressive", desc: "Higher potential, higher stress", icon: TrendingUp, color: "rose" },
                ].map((option, index) => {
                  const Icon = option.icon;
                  const isSelected = selectedPath === index;
                  return (
                    <motion.button
                      key={option.label}
                      className={`p-6 rounded-xl border-2 text-left transition-all ${
                        isSelected 
                          ? `border-${option.color}-500 bg-${option.color}-500/10` 
                          : "border-border hover:border-primary/50"
                      }`}
                      style={{
                        borderColor: isSelected ? (option.color === "emerald" ? "#10b981" : option.color === "amber" ? "#f59e0b" : "#ef4444") : undefined,
                        backgroundColor: isSelected ? (option.color === "emerald" ? "rgba(16, 185, 129, 0.1)" : option.color === "amber" ? "rgba(245, 158, 11, 0.1)" : "rgba(239, 68, 68, 0.1)") : undefined,
                      }}
                      onClick={() => setSelectedPath(index)}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Icon className={`w-8 h-8 mb-3`} style={{ color: option.color === "emerald" ? "#10b981" : option.color === "amber" ? "#f59e0b" : "#ef4444" }} />
                      <h3 className="font-bold mb-1">{option.label}</h3>
                      <p className="text-sm text-muted-foreground">{option.desc}</p>
                      {isSelected && (
                        <motion.div 
                          className="mt-3 flex items-center gap-2 text-primary"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span className="text-sm font-medium">Selected</span>
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* Insights */}
              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <p className="text-center">
                    <span className="font-semibold">Higher risk may give bigger rewards,</span> but also larger swings.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-center text-muted-foreground">
                    Your tolerance matters more than potential return.
                  </p>
                </div>
              </motion.div>

              {/* Final takeaway */}
              <motion.div 
                className="mt-8 p-6 rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 text-center"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 }}
              >
                <Sparkles className="w-8 h-8 mx-auto mb-3 text-primary" />
                <p className="text-lg font-semibold">
                  Risk is uncertainty. Reward compensates for it.
                </p>
                <p className="text-muted-foreground mt-1">
                  The best approach balances growth with comfort.
                </p>
              </motion.div>

              {/* Celebration effect for selected path */}
              <AnimatePresence>
                {selectedPath !== null && (
                  <motion.div 
                    className="flex justify-center mt-8"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Button onClick={nextSlide} size="lg" className="gap-2 bg-gradient-to-r from-primary to-primary/80">
                      Complete Lesson <Sparkles className="w-4 h-4" />
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

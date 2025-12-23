import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles, TrendingUp, TrendingDown, Target, AlertTriangle, Zap, Shield } from "lucide-react";
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
  const [lockedRisk, setLockedRisk] = useState(50);
  const [chartData, setChartData] = useState(generateChartData(50));
  const [multiplePaths, setMultiplePaths] = useState(generateMultiplePaths(50));
  const [hoveredArrow, setHoveredArrow] = useState<string | null>(null);
  const [animatedPaths, setAnimatedPaths] = useState<number[]>([]);
  const [showInsightText, setShowInsightText] = useState(false);

  // Update chart when risk changes (only on slide 1)
  useEffect(() => {
    if (currentSlide === 1) {
      setChartData(generateChartData(riskLevel));
    }
  }, [riskLevel, currentSlide]);

  // Lock in risk level when moving to slide 2
  useEffect(() => {
    if (currentSlide === 2) {
      setLockedRisk(riskLevel);
      setMultiplePaths(generateMultiplePaths(riskLevel));
    }
  }, [currentSlide]);

  // Animate paths on slide 3
  useEffect(() => {
    if (currentSlide === 3) {
      setAnimatedPaths([]);
      setShowInsightText(false);
      multiplePaths.forEach((_, index) => {
        setTimeout(() => {
          setAnimatedPaths(prev => [...prev, index]);
        }, index * 300);
      });
      setTimeout(() => setShowInsightText(true), multiplePaths.length * 300 + 500);
    }
  }, [currentSlide, multiplePaths]);

  const getRiskLabel = () => {
    if (riskLevel <= 33) return { text: "Low risk: small but steady growth", color: "text-emerald-400", level: "low" };
    if (riskLevel <= 66) return { text: "Medium risk: higher gains but some volatility", color: "text-amber-400", level: "medium" };
    return { text: "High risk: large potential reward and possible losses", color: "text-rose-400", level: "high" };
  };

  const getOutcomeStats = () => {
    const allFinalValues = multiplePaths.map(path => path[path.length - 1].value);
    const maxGain = Math.max(...allFinalValues);
    const minValue = Math.min(...allFinalValues);
    const median = allFinalValues.sort((a, b) => a - b)[Math.floor(allFinalValues.length / 2)];
    return { maxGain, minValue, median };
  };

  const nextSlide = () => {
    if (currentSlide < 4) {
      setCurrentSlide((currentSlide + 1) as Slide);
    } else {
      onComplete?.();
    }
  };

  const slideLabels = ["Experience", "Reflect", "Insight", "Conclusion"];

  return (
    <div className="space-y-6">
      {/* Progress indicator with labels */}
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
        {/* Slide 1: Experience */}
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
                className="text-2xl font-bold mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Choose Your Risk Level
              </motion.h2>
              <motion.p 
                className="text-muted-foreground mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Watch how your $1,000 could grow or shrink. Notice how the path changes with risk.
              </motion.p>

              {/* Risk Slider */}
              <motion.div 
                className="mb-8 px-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-emerald-400 flex items-center gap-1"><Shield className="w-4 h-4" /> Low Risk</span>
                  <span className="text-amber-400 flex items-center gap-1"><Target className="w-4 h-4" /> Medium</span>
                  <span className="text-rose-400 flex items-center gap-1"><Zap className="w-4 h-4" /> High Risk</span>
                </div>
                <Slider
                  value={[riskLevel]}
                  onValueChange={(v) => setRiskLevel(v[0])}
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
                  <p className="text-xs text-muted-foreground">Projected Value</p>
                  <p className="text-xl font-bold text-primary">${chartData[chartData.length-1]?.value.toLocaleString()}</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground">Volatility</p>
                  <p className="text-xl font-bold">{riskLevel > 66 ? "High" : riskLevel > 33 ? "Medium" : "Low"}</p>
                </div>
              </motion.div>

              <motion.div 
                className="flex justify-center mt-8 relative z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <Button onClick={nextSlide} size="lg" className="gap-2">
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
            <Card className="p-8 relative overflow-hidden">
              <Badge className="mb-4 bg-amber-500/20 text-amber-400 border-amber-500/30">Reflect</Badge>

              <motion.h2 
                className="text-2xl font-bold text-center mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Why did your chosen risk level create these possible outcomes?
              </motion.h2>

              {/* Arrows pointing to explanations */}
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {[
                  { 
                    key: "low", 
                    icon: Shield, 
                    title: "Low Risk",
                    color: "emerald",
                    desc: "Smaller swings mean less anxiety, but growth is slower. Your money stays safer.",
                    feedback: "Stability comes at the cost of growth potential."
                  },
                  { 
                    key: "medium", 
                    icon: Target, 
                    title: "Medium Risk",
                    color: "amber",
                    desc: "Balanced approach with moderate swings. You get some growth while managing stress.",
                    feedback: "A balanced approach for most investors."
                  },
                  { 
                    key: "high", 
                    icon: Zap, 
                    title: "High Risk",
                    color: "rose",
                    desc: "Large potential gains, but also large potential losses. Requires emotional discipline.",
                    feedback: "High rewards require high tolerance for volatility."
                  },
                ].map((item, index) => {
                  const Icon = item.icon;
                  const isHovered = hoveredArrow === item.key;
                  const isSelected = getRiskLabel().level === item.key;
                  
                  return (
                    <motion.div
                      key={item.key}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + index * 0.2 }}
                      className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all ${
                        isSelected 
                          ? `border-${item.color}-500 bg-${item.color}-500/10` 
                          : isHovered 
                            ? "border-primary/50 bg-muted/50" 
                            : "border-border"
                      }`}
                      style={{
                        borderColor: isSelected 
                          ? (item.color === "emerald" ? "#10b981" : item.color === "amber" ? "#f59e0b" : "#ef4444") 
                          : isHovered ? "hsl(var(--primary))" : undefined,
                        backgroundColor: isSelected 
                          ? (item.color === "emerald" ? "rgba(16, 185, 129, 0.1)" : item.color === "amber" ? "rgba(245, 158, 11, 0.1)" : "rgba(239, 68, 68, 0.1)") 
                          : undefined,
                      }}
                      onMouseEnter={() => setHoveredArrow(item.key)}
                      onMouseLeave={() => setHoveredArrow(null)}
                      whileHover={{ scale: 1.02, y: -5 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isSelected && (
                        <motion.div 
                          className="absolute -top-3 left-1/2 -translate-x-1/2"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <Badge className="bg-primary text-primary-foreground">Your Choice</Badge>
                        </motion.div>
                      )}
                      
                      <motion.div 
                        className="flex justify-center mb-4"
                        animate={isHovered ? { y: [0, -5, 0] } : {}}
                        transition={{ repeat: isHovered ? Infinity : 0, duration: 1 }}
                      >
                        <Icon 
                          className="w-10 h-10" 
                          style={{ color: item.color === "emerald" ? "#10b981" : item.color === "amber" ? "#f59e0b" : "#ef4444" }} 
                        />
                      </motion.div>
                      
                      <h3 className="font-bold text-center mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground text-center mb-3">{item.desc}</p>
                      
                      <AnimatePresence>
                        {isHovered && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-3 pt-3 border-t border-border"
                          >
                            <p className="text-sm font-medium text-center text-primary">{item.feedback}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>

              <motion.p 
                className="text-center text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                Hover over each option to understand the trade-offs
              </motion.p>

              <motion.div 
                className="flex justify-center mt-8 relative z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
              >
                <Button onClick={nextSlide} size="lg" className="gap-2">
                  See Your Outcomes <ArrowRight className="w-4 h-4" />
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
                className="text-2xl font-bold text-center mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Your Possible Outcomes
              </motion.h2>
              <motion.p 
                className="text-center text-muted-foreground mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Based on your {lockedRisk > 66 ? "high" : lockedRisk > 33 ? "medium" : "low"} risk choice ({lockedRisk}%)
              </motion.p>

              {/* Outcome Stats */}
              <motion.div 
                className="grid grid-cols-3 gap-4 mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="text-center p-4 rounded-xl bg-rose-500/10 border border-rose-500/30">
                  <TrendingDown className="w-6 h-6 mx-auto mb-2 text-rose-400" />
                  <p className="text-xs text-muted-foreground">Worst Case</p>
                  <p className="text-2xl font-bold text-rose-400">${getOutcomeStats().minValue.toLocaleString()}</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-primary/10 border border-primary/30 relative">
                  <motion.div 
                    className="absolute inset-0 rounded-xl border-2 border-primary"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  />
                  <Target className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <p className="text-xs text-muted-foreground">Median</p>
                  <p className="text-2xl font-bold text-primary">${getOutcomeStats().median.toLocaleString()}</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                  <TrendingUp className="w-6 h-6 mx-auto mb-2 text-emerald-400" />
                  <p className="text-xs text-muted-foreground">Best Case</p>
                  <p className="text-2xl font-bold text-emerald-400">${getOutcomeStats().maxGain.toLocaleString()}</p>
                </div>
              </motion.div>

              {/* Multiple paths chart */}
              <motion.div 
                className="h-72 relative"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
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
                    <ReferenceLine y={1000} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" />
                    
                    {multiplePaths.map((path, index) => {
                      const isMedian = index === 3;
                      return animatedPaths.includes(index) && (
                        <Line
                          key={index}
                          data={path}
                          type="monotone"
                          dataKey="value"
                          stroke={isMedian ? "hsl(var(--primary))" : `hsl(${200 + index * 20}, 60%, 50%)`}
                          strokeWidth={isMedian ? 4 : 1.5}
                          strokeOpacity={isMedian ? 1 : 0.4}
                          dot={false}
                          animationDuration={600}
                        />
                      );
                    })}
                  </LineChart>
                </ResponsiveContainer>

                {/* Median highlight label */}
                {animatedPaths.length === multiplePaths.length && (
                  <motion.div 
                    className="absolute top-4 right-4 px-3 py-1 rounded-full bg-primary/20 border border-primary/50 flex items-center gap-2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <motion.div 
                      className="w-2 h-2 rounded-full bg-primary"
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    />
                    <span className="text-sm font-medium">Median Path</span>
                  </motion.div>
                )}
              </motion.div>

              {/* Dynamic insight text */}
              <AnimatePresence>
                {showInsightText && (
                  <motion.div 
                    className="mt-6 p-4 rounded-xl bg-muted/50 border text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <p className="text-lg">
                      Based on your choice, your <span className="font-bold">$1,000</span> could grow to{" "}
                      <span className="font-bold text-primary">${getOutcomeStats().median.toLocaleString()}</span> on average, 
                      but swings could take it as low as{" "}
                      <span className="font-bold text-rose-400">${getOutcomeStats().minValue.toLocaleString()}</span> or as high as{" "}
                      <span className="font-bold text-emerald-400">${getOutcomeStats().maxGain.toLocaleString()}</span>.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div 
                className="flex justify-center mt-8 relative z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3 }}
              >
                <Button onClick={nextSlide} size="lg" className="gap-2">
                  Continue to Conclusion <ArrowRight className="w-4 h-4" />
                </Button>
              </motion.div>
            </Card>
          </motion.div>
        )}

        {/* Slide 4: Conclusion */}
        {currentSlide === 4 && (
          <motion.div
            key="slide4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-8">
              <Badge className="mb-4 bg-purple-500/20 text-purple-400 border-purple-500/30">Conclusion</Badge>

              <motion.div 
                className="text-center mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Sparkles className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h2 className="text-3xl font-bold mb-4">Risk vs. Reward</h2>
              </motion.div>

              {/* Key takeaways */}
              <motion.div 
                className="space-y-4 max-w-2xl mx-auto mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {[
                  "Higher risk may lead to higher returns, but also larger losses.",
                  "Your risk tolerance matters more than chasing maximum returns.",
                  "Time in the market helps smooth out volatility."
                ].map((point, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start gap-3 p-4 rounded-lg bg-muted/50"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.2 }}
                  >
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-sm font-bold text-primary">{index + 1}</span>
                    </div>
                    <p className="text-lg">{point}</p>
                  </motion.div>
                ))}
              </motion.div>

              {/* Final takeaway */}
              <motion.div 
                className="p-6 rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 text-center max-w-2xl mx-auto"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.3 }}
              >
                <p className="text-xl font-semibold">
                  Risk is uncertainty. Reward compensates for it.
                </p>
                <p className="text-muted-foreground mt-2">
                  The best approach balances growth potential with your personal comfort level.
                </p>
              </motion.div>

              <motion.div 
                className="flex justify-center mt-8 relative z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.6 }}
              >
                <Button onClick={nextSlide} size="lg" className="gap-2 bg-gradient-to-r from-primary to-primary/80">
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

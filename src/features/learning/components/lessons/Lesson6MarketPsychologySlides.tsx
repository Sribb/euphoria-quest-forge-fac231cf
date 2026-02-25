import { useState, useEffect, useRef } from "react";
import { DragSortChallenge } from "../interactive/DragSortChallenge";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, TrendingUp, TrendingDown, Brain, AlertTriangle, Sparkles, Heart, Flame, Snowflake, Eye, Target, Zap } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, ReferenceLine } from "recharts";

type Slide = 1 | 2 | 3 | 4;

interface Lesson6Props {
  onComplete?: () => void;
}

// Generate market cycle data
const generateMarketCycle = () => {
  const data = [];
  for (let i = 0; i <= 100; i++) {
    const base = Math.sin(i * 0.08) * 40 + 50;
    const noise = (Math.random() - 0.5) * 10;
    data.push({
      time: i,
      price: Math.max(10, base + noise),
      emotion: getEmotionAtPoint(base + noise),
    });
  }
  return data;
};

const getEmotionAtPoint = (price: number) => {
  if (price > 80) return "euphoria";
  if (price > 65) return "greed";
  if (price > 50) return "optimism";
  if (price > 35) return "fear";
  if (price > 20) return "panic";
  return "despair";
};

const EMOTIONS = {
  euphoria: { color: "#22c55e", icon: Flame, label: "Euphoria", desc: "Maximum risk - everyone is buying" },
  greed: { color: "#84cc16", icon: TrendingUp, label: "Greed", desc: "FOMO kicks in, prices overextended" },
  optimism: { color: "#eab308", icon: Heart, label: "Optimism", desc: "Healthy confidence, market rising" },
  fear: { color: "#f97316", icon: AlertTriangle, label: "Fear", desc: "Uncertainty grows, selling begins" },
  panic: { color: "#ef4444", icon: TrendingDown, label: "Panic", desc: "Mass selling, capitulation" },
  despair: { color: "#dc2626", icon: Snowflake, label: "Despair", desc: "Maximum opportunity - nobody wants to buy" },
};

const SCENARIOS = [
  { 
    headline: "🚀 Tech stocks surge 15% in one week!", 
    marketState: "euphoria",
    correctAction: "sell",
    explanation: "When everyone is euphoric, prices are often overextended. Smart money sells into strength."
  },
  { 
    headline: "📉 Market crashes 30% - Recession fears grow", 
    marketState: "panic",
    correctAction: "hold",
    explanation: "Panic selling locks in losses. If fundamentals are sound, hold or consider buying more."
  },
  { 
    headline: "😰 Your portfolio is down 20% this month", 
    marketState: "fear",
    correctAction: "buy",
    explanation: "Fear creates opportunity. If you have cash and believe in your investments, consider adding."
  },
  {
    headline: "📺 'Expert' says this stock will 10x!",
    marketState: "greed",
    correctAction: "research",
    explanation: "Tips from media often come when prices are high. Always do your own research first."
  },
];

export const Lesson6MarketPsychologySlides = ({ onComplete }: Lesson6Props) => {
  const [currentSlide, setCurrentSlide] = useState<Slide>(1);
  const [fearGreedIndex, setFearGreedIndex] = useState(50);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [userActions, setUserActions] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [emotionHistory, setEmotionHistory] = useState<string[]>([]);
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [priceData, setPriceData] = useState<{time: number, price: number}[]>([]);
  const [currentPrice, setCurrentPrice] = useState(50);
  
  const marketData = generateMarketCycle();

  const learnTexts = [
    "Markets are driven by two emotions: fear and greed.",
    "When others are fearful, opportunities arise for the brave.",
    "When others are greedy, risk is at its highest.",
    "Warren Buffett: 'Be fearful when others are greedy, greedy when others are fearful.'",
  ];

  useEffect(() => {
    if (currentSlide === 1) {
      const interval = setInterval(() => {
        setCurrentTextIndex(prev => (prev + 1) % learnTexts.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [currentSlide]);

  // Emotion meter simulation
  useEffect(() => {
    if (currentSlide === 2 && simulationRunning) {
      const interval = setInterval(() => {
        setPriceData(prev => {
          const lastPrice = prev.length > 0 ? prev[prev.length - 1].price : 50;
          const change = (Math.random() - 0.5) * 8;
          const newPrice = Math.max(10, Math.min(90, lastPrice + change));
          setCurrentPrice(newPrice);
          
          const emotion = getEmotionAtPoint(newPrice);
          setEmotionHistory(h => [...h.slice(-10), emotion]);
          
          if (prev.length > 50) {
            return [...prev.slice(1), { time: prev.length, price: newPrice }];
          }
          return [...prev, { time: prev.length, price: newPrice }];
        });
      }, 500);
      return () => clearInterval(interval);
    }
  }, [currentSlide, simulationRunning]);

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

  const handleScenarioAction = (action: string) => {
    setUserActions([...userActions, action]);
    setShowResult(true);
  };

  const nextScenario = () => {
    if (scenarioIndex < SCENARIOS.length - 1) {
      setScenarioIndex(scenarioIndex + 1);
      setShowResult(false);
    }
  };

  const getCurrentEmotion = () => {
    return getEmotionAtPoint(currentPrice);
  };

  const getEmotionConfig = (emotion: string) => {
    return EMOTIONS[emotion as keyof typeof EMOTIONS] || EMOTIONS.optimism;
  };

  const slideLabels = ["Learn", "Experience", "Insight", "Apply"];

  const score = userActions.filter((action, i) => action === SCENARIOS[i]?.correctAction).length;

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
        {/* Slide 1: Learn - Fear & Greed Concept */}
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
                className="text-2xl font-bold mb-2 flex items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Brain className="w-6 h-6" /> Fear & Greed: The Market's Drivers
              </motion.h2>

              {/* Emotion Spectrum */}
              <div className="my-8">
                <p className="text-center text-muted-foreground mb-6">Drag the slider to explore market emotions</p>
                
                <div className="relative mb-8">
                  <div className="h-4 rounded-full bg-gradient-to-r from-red-600 via-yellow-500 to-green-500 mb-4" />
                  <Slider
                    value={[fearGreedIndex]}
                    onValueChange={(v) => setFearGreedIndex(v[0])}
                    min={0}
                    max={100}
                    step={1}
                    className="mb-4"
                  />
                  <div className="flex justify-between text-sm">
                    <span className="text-red-500 font-medium">Extreme Fear</span>
                    <span className="text-yellow-500 font-medium">Neutral</span>
                    <span className="text-green-500 font-medium">Extreme Greed</span>
                  </div>
                </div>

                {/* Current State Display */}
                <motion.div 
                  className="p-6 rounded-xl border-2 text-center"
                  key={fearGreedIndex}
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  style={{ 
                    borderColor: fearGreedIndex < 30 ? "#dc2626" : fearGreedIndex < 70 ? "#eab308" : "#22c55e",
                    backgroundColor: fearGreedIndex < 30 ? "rgba(220, 38, 38, 0.1)" : fearGreedIndex < 70 ? "rgba(234, 179, 8, 0.1)" : "rgba(34, 197, 94, 0.1)"
                  }}
                >
                  <p className="text-4xl mb-2">{fearGreedIndex}</p>
                  <p className="text-xl font-bold" style={{ 
                    color: fearGreedIndex < 30 ? "#dc2626" : fearGreedIndex < 70 ? "#eab308" : "#22c55e"
                  }}>
                    {fearGreedIndex < 20 ? "Extreme Fear 😨" : 
                     fearGreedIndex < 40 ? "Fear 😟" :
                     fearGreedIndex < 60 ? "Neutral 😐" :
                     fearGreedIndex < 80 ? "Greed 😏" : "Extreme Greed 🤑"}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {fearGreedIndex < 30 ? "Potential buying opportunity - others are panicking" : 
                     fearGreedIndex < 70 ? "Market is balanced - proceed with normal caution" :
                     "Caution advised - prices may be overextended"}
                  </p>
                </motion.div>
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

              <motion.div 
                className="flex justify-center mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Button onClick={nextSlide} size="lg" className="gap-2">
                  Experience the Market <ArrowRight className="w-4 h-4" />
                </Button>
              </motion.div>
            </Card>
          </motion.div>
        )}

        {/* Slide 2: Experience - Live Emotion Meter */}
        {currentSlide === 2 && (
          <motion.div
            key="slide2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-8">
              <Badge className="mb-4 bg-amber-500/20 text-amber-400 border-amber-500/30">Experience</Badge>

              <motion.h2 
                className="text-2xl font-bold text-center mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                Watch Market Emotions in Real-Time
              </motion.h2>
              <motion.p 
                className="text-center text-muted-foreground mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Observe how prices and emotions are connected
              </motion.p>

              {/* Start/Stop Button */}
              <div className="flex justify-center mb-6">
                <Button 
                  onClick={() => setSimulationRunning(!simulationRunning)}
                  variant={simulationRunning ? "destructive" : "default"}
                  className="gap-2"
                >
                  {simulationRunning ? "Stop Simulation" : "Start Market Simulation"}
                  <Zap className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {/* Price Chart */}
                <div className="md:col-span-2">
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={priceData}>
                        <defs>
                          <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="time" hide />
                        <YAxis domain={[0, 100]} hide />
                        <ReferenceLine y={50} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" />
                        <Area 
                          type="monotone" 
                          dataKey="price" 
                          stroke="hsl(var(--primary))" 
                          fill="url(#priceGradient)" 
                          strokeWidth={2}
                          isAnimationActive={false}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Emotion Display */}
                <motion.div 
                  className="p-6 rounded-xl border-2 text-center flex flex-col justify-center"
                  key={getCurrentEmotion()}
                  animate={{ 
                    borderColor: getEmotionConfig(getCurrentEmotion()).color,
                    backgroundColor: `${getEmotionConfig(getCurrentEmotion()).color}20`
                  }}
                >
                  {(() => {
                    const config = getEmotionConfig(getCurrentEmotion());
                    const Icon = config.icon;
                    return (
                      <>
                        <Icon className="w-12 h-12 mx-auto mb-2" style={{ color: config.color }} />
                        <p className="text-xl font-bold" style={{ color: config.color }}>
                          {config.label}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">{config.desc}</p>
                      </>
                    );
                  })()}
                </motion.div>
              </div>

              {/* Emotion Cycle */}
              <motion.div 
                className="mt-6 p-4 bg-muted/30 rounded-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <h4 className="font-semibold mb-3 text-center">The Emotion Cycle</h4>
                <div className="flex justify-around items-center flex-wrap gap-2">
                  {Object.entries(EMOTIONS).map(([key, config]) => {
                    const Icon = config.icon;
                    const isActive = getCurrentEmotion() === key;
                    return (
                      <div 
                        key={key} 
                        className={`flex flex-col items-center p-2 rounded-lg transition-all ${
                          isActive ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : 'opacity-50'
                        }`}
                        style={{ 
                          backgroundColor: isActive ? `${config.color}20` : 'transparent'
                        }}
                      >
                        <Icon className="w-5 h-5" style={{ color: config.color }} />
                        <span className="text-xs mt-1">{config.label}</span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>

              <motion.div 
                className="flex justify-between mt-6"
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

        {/* Slide 3: Insight - Contrarian Thinking */}
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
                The Contrarian Advantage
              </motion.h2>
              <motion.p 
                className="text-center text-muted-foreground mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Why going against the crowd often works
              </motion.p>

              <div className="grid md:grid-cols-2 gap-6">
                {/* When Others are Fearful */}
                <motion.div 
                  className="p-6 bg-red-500/10 border border-red-500/30 rounded-xl"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-full bg-red-500/20">
                      <AlertTriangle className="w-6 h-6 text-red-500" />
                    </div>
                    <h3 className="text-lg font-bold">When Others Are Fearful...</h3>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-red-500">•</span>
                      <span>Prices are often below true value</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500">•</span>
                      <span>Quality companies become "on sale"</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500">•</span>
                      <span>Long-term investors accumulate positions</span>
                    </li>
                  </ul>
                  <div className="mt-4 p-3 bg-emerald-500/20 rounded-lg">
                    <p className="text-sm font-semibold text-emerald-400">→ Consider buying</p>
                  </div>
                </motion.div>

                {/* When Others are Greedy */}
                <motion.div 
                  className="p-6 bg-green-500/10 border border-green-500/30 rounded-xl"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-full bg-green-500/20">
                      <Flame className="w-6 h-6 text-green-500" />
                    </div>
                    <h3 className="text-lg font-bold">When Others Are Greedy...</h3>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-green-500">•</span>
                      <span>Prices are often above true value</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500">•</span>
                      <span>FOMO drives irrational buying</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500">•</span>
                      <span>Risk of correction increases</span>
                    </li>
                  </ul>
                  <div className="mt-4 p-3 bg-amber-500/20 rounded-lg">
                    <p className="text-sm font-semibold text-amber-400">→ Consider caution or selling</p>
                  </div>
                </motion.div>
              </div>

              {/* Key Quote */}
              <motion.div 
                className="mt-6 p-6 bg-primary/10 border border-primary/30 rounded-xl text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Eye className="w-8 h-8 mx-auto mb-3 text-primary" />
                <p className="text-lg italic">"The stock market is a device for transferring money from the impatient to the patient."</p>
                <p className="text-sm text-muted-foreground mt-2">— Warren Buffett</p>
              </motion.div>

              <motion.div 
                className="flex justify-between mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <Button variant="outline" onClick={prevSlide}>Back</Button>
                <Button onClick={nextSlide} size="lg" className="gap-2">
                  Apply Your Knowledge <ArrowRight className="w-4 h-4" />
                </Button>
              </motion.div>
            </Card>
          </motion.div>
        )}

        {/* Slide 4: Apply - Scenario Quiz */}
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
                What Would You Do?
              </motion.h2>
              <motion.p 
                className="text-center text-muted-foreground mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Test your emotional intelligence in market scenarios
              </motion.p>

              {scenarioIndex < SCENARIOS.length ? (
                <motion.div 
                  key={scenarioIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  {/* Scenario Card */}
                  <div className="p-6 bg-muted/30 rounded-xl text-center">
                    <p className="text-xs text-muted-foreground mb-2">Scenario {scenarioIndex + 1} of {SCENARIOS.length}</p>
                    <p className="text-xl font-bold">{SCENARIOS[scenarioIndex].headline}</p>
                    <Badge className="mt-3" style={{ 
                      backgroundColor: `${EMOTIONS[SCENARIOS[scenarioIndex].marketState as keyof typeof EMOTIONS]?.color}20`,
                      color: EMOTIONS[SCENARIOS[scenarioIndex].marketState as keyof typeof EMOTIONS]?.color
                    }}>
                      Market: {EMOTIONS[SCENARIOS[scenarioIndex].marketState as keyof typeof EMOTIONS]?.label}
                    </Badge>
                  </div>

                  {!showResult ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {["buy", "sell", "hold", "research"].map((action) => (
                        <Button
                          key={action}
                          variant="outline"
                          className="h-20 flex flex-col gap-1"
                          onClick={() => handleScenarioAction(action)}
                        >
                          {action === "buy" && <TrendingUp className="w-5 h-5 text-emerald-400" />}
                          {action === "sell" && <TrendingDown className="w-5 h-5 text-red-400" />}
                          {action === "hold" && <Target className="w-5 h-5 text-amber-400" />}
                          {action === "research" && <Eye className="w-5 h-5 text-blue-400" />}
                          <span className="capitalize font-medium">{action}</span>
                        </Button>
                      ))}
                    </div>
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      <div className={`p-4 rounded-lg border ${
                        userActions[scenarioIndex] === SCENARIOS[scenarioIndex].correctAction
                          ? 'border-emerald-500 bg-emerald-500/10'
                          : 'border-amber-500 bg-amber-500/10'
                      }`}>
                        <p className="font-semibold mb-2">
                          {userActions[scenarioIndex] === SCENARIOS[scenarioIndex].correctAction
                            ? "✓ Great thinking!" 
                            : `Consider: ${SCENARIOS[scenarioIndex].correctAction}`}
                        </p>
                        <p className="text-sm text-muted-foreground">{SCENARIOS[scenarioIndex].explanation}</p>
                      </div>
                      
                      {scenarioIndex < SCENARIOS.length - 1 ? (
                        <Button onClick={nextScenario} className="w-full">
                          Next Scenario <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      ) : (
                        <div className="text-center space-y-4">
                          <div className="p-4 bg-primary/10 rounded-lg">
                            <p className="text-lg font-bold">Your Score: {score}/{SCENARIOS.length}</p>
                            <p className="text-sm text-muted-foreground">
                              {score === SCENARIOS.length ? "Perfect! You think like a pro." :
                               score >= SCENARIOS.length / 2 ? "Good understanding of market psychology!" :
                               "Keep learning - emotional control takes practice!"}
                            </p>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              ) : null}

              {/* Interactive Challenge */}
              <DragSortChallenge
                title="🧠 Order the Market Emotion Cycle"
                description="Drag these emotions in the order they typically occur in a market cycle:"
                items={[
                  { id: "optimism", label: "😊 Optimism" },
                  { id: "euphoria", label: "🔥 Euphoria" },
                  { id: "fear", label: "😰 Fear" },
                  { id: "panic", label: "😱 Panic" },
                ]}
                correctOrder={["optimism", "euphoria", "fear", "panic"]}
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
                  className="gap-2 bg-gradient-to-r from-violet-500 to-amber-500"
                  disabled={userActions.length < SCENARIOS.length}
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

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  CheckCircle,
  Target,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Lightbulb,
  DollarSign,
  Home,
  Factory
} from "lucide-react";

type Slide = 1 | 2 | 3 | 4;

interface Lesson18Props {
  onComplete?: () => void;
}

const economicPhases = [
  {
    name: "Expansion",
    icon: TrendingUp,
    color: "emerald",
    description: "GDP rising, unemployment falling, consumer confidence high",
    bestAssets: ["Stocks", "Cyclicals", "Small Caps", "Real Estate"],
    worstAssets: ["Gold", "Long Bonds", "Defensive Stocks"],
    indicators: ["Rising GDP", "Low Unemployment", "High Consumer Spending"],
  },
  {
    name: "Peak",
    icon: Target,
    color: "amber",
    description: "Growth slowing, inflation rising, Fed tightening",
    bestAssets: ["Commodities", "Value Stocks", "Short Bonds", "Cash"],
    worstAssets: ["Growth Stocks", "Long Bonds", "Risky Credit"],
    indicators: ["High Inflation", "Fed Rate Hikes", "Yield Curve Flattening"],
  },
  {
    name: "Contraction",
    icon: TrendingDown,
    color: "destructive",
    description: "GDP falling, unemployment rising, recession fears",
    bestAssets: ["Bonds", "Gold", "Defensive Stocks", "Cash"],
    worstAssets: ["Cyclicals", "Small Caps", "High Yield Bonds"],
    indicators: ["Falling GDP", "Rising Unemployment", "Credit Tightening"],
  },
  {
    name: "Trough",
    icon: RefreshCw,
    color: "blue",
    description: "Economy bottoming, Fed easing, early recovery signs",
    bestAssets: ["Growth Stocks", "Cyclicals", "High Yield Bonds", "Real Estate"],
    worstAssets: ["Cash", "Short Bonds", "Defensive Stocks"],
    indicators: ["Fed Rate Cuts", "Stimulus Programs", "Improving Sentiment"],
  },
];

const reflectionQuestions = [
  {
    question: "Which assets typically perform best during an expansion?",
    options: [
      { text: "Stocks and cyclical sectors", correct: true },
      { text: "Gold and long-term bonds", correct: false },
      { text: "Cash and money market funds", correct: false },
    ],
  },
  {
    question: "What should you consider doing near an economic peak?",
    options: [
      { text: "Go all-in on growth stocks", correct: false },
      { text: "Shift toward defensive assets and reduce risk", correct: true },
      { text: "Take on maximum leverage", correct: false },
    ],
  },
  {
    question: "Why do bonds often outperform during contractions?",
    options: [
      { text: "Because inflation is high", correct: false },
      { text: "Because interest rates fall and bond prices rise", correct: true },
      { text: "Because company earnings increase", correct: false },
    ],
  },
];

export const Lesson18EconomicCyclesSlides = ({ onComplete }: Lesson18Props) => {
  const [currentSlide, setCurrentSlide] = useState<Slide>(1);
  const [selectedPhase, setSelectedPhase] = useState(0);
  const [allocations, setAllocations] = useState({ stocks: 60, bonds: 30, alternatives: 10 });
  const [reflectionIndex, setReflectionIndex] = useState(0);
  const [reflectionAnswers, setReflectionAnswers] = useState<boolean[]>([]);

  const phase = economicPhases[selectedPhase];

  const handleReflectionAnswer = (isCorrect: boolean) => {
    setReflectionAnswers([...reflectionAnswers, isCorrect]);
    if (reflectionIndex < reflectionQuestions.length - 1) {
      setTimeout(() => setReflectionIndex(reflectionIndex + 1), 1000);
    }
  };

  const rotatePhase = (direction: 1 | -1) => {
    setSelectedPhase((prev) => (prev + direction + 4) % 4);
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
        {/* Slide 1: Experience - Economic Cycle Wheel */}
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
              
              <h2 className="text-2xl font-bold mb-2">Economic Cycle Navigator</h2>
              <p className="text-muted-foreground mb-6">
                Economies move through predictable cycles. Learn which assets thrive in each phase.
              </p>

              {/* Cycle Wheel */}
              <div className="flex justify-center mb-6">
                <div className="relative w-64 h-64">
                  {economicPhases.map((p, idx) => {
                    const angle = (idx * 90 - 90) * (Math.PI / 180);
                    const x = 80 * Math.cos(angle);
                    const y = 80 * Math.sin(angle);
                    const isSelected = idx === selectedPhase;
                    
                    return (
                      <motion.button
                        key={p.name}
                        className={`absolute w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                          isSelected ? `bg-${p.color}-500 scale-125 z-10` : "bg-muted hover:bg-muted/80"
                        }`}
                        style={{
                          left: `calc(50% + ${x}px - 32px)`,
                          top: `calc(50% + ${y}px - 32px)`,
                        }}
                        onClick={() => setSelectedPhase(idx)}
                        whileHover={{ scale: isSelected ? 1.25 : 1.1 }}
                      >
                        <p.icon className={`w-6 h-6 ${isSelected ? "text-white" : "text-muted-foreground"}`} />
                      </motion.button>
                    );
                  })}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <RefreshCw className="w-8 h-8 text-muted-foreground animate-spin" style={{ animationDuration: "8s" }} />
                  </div>
                </div>
              </div>

              {/* Phase Navigation */}
              <div className="flex justify-center gap-4 mb-6">
                <Button variant="outline" onClick={() => rotatePhase(-1)}>← Previous</Button>
                <Button variant="outline" onClick={() => rotatePhase(1)}>Next →</Button>
              </div>

              {/* Phase Details */}
              <Card className={`p-6 bg-${phase.color}-500/10 border-${phase.color}-500/30 mb-6`}>
                <div className="flex items-center gap-3 mb-4">
                  <phase.icon className={`w-8 h-8 text-${phase.color}-500`} />
                  <div>
                    <h3 className="text-xl font-bold">{phase.name}</h3>
                    <p className="text-sm text-muted-foreground">{phase.description}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="text-sm font-bold text-muted-foreground mb-2">Key Indicators</h4>
                    <ul className="text-sm space-y-1">
                      {phase.indicators.map((ind) => (
                        <li key={ind} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          {ind}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-emerald-500 mb-2">Best Assets</h4>
                    <ul className="text-sm space-y-1">
                      {phase.bestAssets.map((asset) => (
                        <li key={asset} className="flex items-center gap-2">
                          <TrendingUp className="w-3 h-3 text-emerald-500" />
                          {asset}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-destructive mb-2">Worst Assets</h4>
                    <ul className="text-sm space-y-1">
                      {phase.worstAssets.map((asset) => (
                        <li key={asset} className="flex items-center gap-2">
                          <TrendingDown className="w-3 h-3 text-destructive" />
                          {asset}
                        </li>
                      ))}
                    </ul>
                  </div>
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
              
              <h2 className="text-2xl font-bold text-center mb-2">Cycle Investing Knowledge</h2>
              <p className="text-center text-muted-foreground mb-8">Test your understanding of economic cycles</p>

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
              
              <h2 className="text-2xl font-bold text-center mb-8">Economic Cycle Insights</h2>

              <div className="grid gap-6 mb-8">
                {[
                  {
                    title: "Cycles Are Inevitable",
                    description: "Every expansion eventually becomes a contraction. Recessions clear excesses and set the stage for the next expansion. Understanding this rhythm helps you stay rational.",
                    icon: RefreshCw,
                  },
                  {
                    title: "Sector Rotation Works",
                    description: "Different sectors lead in different phases: Tech and Consumer Discretionary in early expansion, Energy and Materials at peak, Utilities and Healthcare in contraction.",
                    icon: Factory,
                  },
                  {
                    title: "Don't Try to Time Perfectly",
                    description: "Cycle turning points are only clear in hindsight. Gradually shift allocations as indicators evolve rather than making dramatic all-or-nothing bets.",
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
              
              <h2 className="text-2xl font-bold text-center mb-2">Cycle-Aware Investing</h2>
              <p className="text-center text-muted-foreground mb-8">Apply economic cycle knowledge</p>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {economicPhases.map((p, idx) => (
                  <Card key={p.name} className={`p-4 bg-${p.color}-500/10 border-${p.color}-500/30`}>
                    <div className="flex items-center gap-2 mb-2">
                      <p.icon className={`w-5 h-5 text-${p.color}-500`} />
                      <h3 className="font-bold">{p.name}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{p.description}</p>
                    <p className="text-xs">
                      <span className="text-emerald-500 font-medium">Favor:</span> {p.bestAssets.slice(0, 2).join(", ")}
                    </p>
                  </Card>
                ))}
              </div>

              <Card className="p-4 bg-emerald-500/10 border border-emerald-500/30 mb-6">
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-emerald-500 mt-1" />
                  <div>
                    <h4 className="font-bold text-emerald-500">Key Takeaway</h4>
                    <p className="text-sm text-muted-foreground">
                      Stay diversified but tilt allocations based on cycle position. Watch leading indicators like yield curve, unemployment claims, and consumer sentiment to anticipate transitions.
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

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
  TrendingUp,
  TrendingDown,
  Clock,
  AlertTriangle,
  Lightbulb
} from "lucide-react";

type Slide = 1 | 2 | 3 | 4;

interface Lesson17Props {
  onComplete?: () => void;
}

const reflectionQuestions = [
  {
    question: "What does bond duration measure?",
    options: [
      { text: "How long until the bond matures", correct: false },
      { text: "Price sensitivity to interest rate changes", correct: true },
      { text: "The coupon rate of the bond", correct: false },
    ],
  },
  {
    question: "If interest rates rise 1% and your bond has 10-year duration, what happens?",
    options: [
      { text: "Bond price rises ~10%", correct: false },
      { text: "Bond price falls ~10%", correct: true },
      { text: "Nothing changes", correct: false },
    ],
  },
  {
    question: "An inverted yield curve (short rates > long rates) often signals:",
    options: [
      { text: "Strong economic growth ahead", correct: false },
      { text: "Potential recession ahead", correct: true },
      { text: "High inflation expectations", correct: false },
    ],
  },
];

export const Lesson17YieldCurveSlides = ({ onComplete }: Lesson17Props) => {
  const [currentSlide, setCurrentSlide] = useState<Slide>(1);
  const [duration, setDuration] = useState(5);
  const [rateChange, setRateChange] = useState(0);
  const [bondPrice] = useState(1000);
  const [curveType, setCurveType] = useState<"normal" | "flat" | "inverted">("normal");
  const [reflectionIndex, setReflectionIndex] = useState(0);
  const [reflectionAnswers, setReflectionAnswers] = useState<boolean[]>([]);

  const priceChange = -duration * rateChange;
  const newPrice = bondPrice * (1 + priceChange / 100);

  const yieldCurvePoints = {
    normal: [2, 2.5, 3, 3.5, 4, 4.5, 5],
    flat: [3.5, 3.5, 3.5, 3.5, 3.5, 3.5, 3.5],
    inverted: [5, 4.5, 4, 3.5, 3, 2.5, 2],
  };

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
  const maturities = ["3M", "1Y", "2Y", "5Y", "10Y", "20Y", "30Y"];

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
        {/* Slide 1: Experience - Yield Curve & Duration */}
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
              
              <h2 className="text-2xl font-bold mb-2">Yield Curve & Duration Explorer</h2>
              <p className="text-muted-foreground mb-6">
                The yield curve shows interest rates across maturities. Duration measures how sensitive bond prices are to rate changes.
              </p>

              {/* Yield Curve Type Selector */}
              <div className="flex gap-3 mb-6">
                {[
                  { type: "normal" as const, label: "Normal", color: "emerald" },
                  { type: "flat" as const, label: "Flat", color: "amber" },
                  { type: "inverted" as const, label: "Inverted", color: "destructive" },
                ].map((curve) => (
                  <motion.button
                    key={curve.type}
                    onClick={() => setCurveType(curve.type)}
                    className={`flex-1 p-3 rounded-xl border-2 transition-all ${
                      curveType === curve.type ? `border-${curve.color}-500 bg-${curve.color}-500/10` : "border-border"
                    }`}
                    whileHover={{ scale: 1.02 }}
                  >
                    <p className="font-bold">{curve.label}</p>
                  </motion.button>
                ))}
              </div>

              {/* Yield Curve Visualization */}
              <Card className="p-4 bg-muted/50 mb-6">
                <h3 className="font-bold mb-4">Treasury Yield Curve</h3>
                <div className="h-40 flex items-end gap-2">
                  {yieldCurvePoints[curveType].map((yield_, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ height: 0 }}
                      animate={{ height: `${yield_ * 15}%` }}
                      className="flex-1 bg-gradient-to-t from-primary to-primary/50 rounded-t relative group"
                    >
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                        {yield_}%
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  {maturities.map((m) => <span key={m}>{m}</span>)}
                </div>
              </Card>

              {/* Duration Simulator */}
              <Card className="p-4 bg-muted/50 mb-6">
                <h3 className="font-bold mb-4">Duration Price Sensitivity</h3>
                
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Bond Duration</span>
                      <span className="font-bold">{duration} years</span>
                    </div>
                    <Slider
                      value={[duration]}
                      onValueChange={(v) => setDuration(v[0])}
                      min={1}
                      max={20}
                      step={1}
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Interest Rate Change</span>
                      <span className={`font-bold ${rateChange > 0 ? "text-destructive" : rateChange < 0 ? "text-emerald-500" : ""}`}>
                        {rateChange > 0 ? "+" : ""}{rateChange}%
                      </span>
                    </div>
                    <Slider
                      value={[rateChange]}
                      onValueChange={(v) => setRateChange(v[0])}
                      min={-3}
                      max={3}
                      step={0.25}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-background border text-center">
                    <p className="text-xs text-muted-foreground">Original Price</p>
                    <p className="text-xl font-bold">${bondPrice}</p>
                  </div>
                  <div className={`p-3 rounded-xl text-center ${priceChange >= 0 ? "bg-emerald-500/10 border-emerald-500/30" : "bg-destructive/10 border-destructive/30"} border`}>
                    <p className="text-xs text-muted-foreground">Price Change</p>
                    <p className={`text-xl font-bold ${priceChange >= 0 ? "text-emerald-500" : "text-destructive"}`}>
                      {priceChange >= 0 ? "+" : ""}{priceChange.toFixed(1)}%
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-background border text-center">
                    <p className="text-xs text-muted-foreground">New Price</p>
                    <p className="text-xl font-bold">${newPrice.toFixed(0)}</p>
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
              
              <h2 className="text-2xl font-bold text-center mb-2">Understanding Bonds</h2>
              <p className="text-center text-muted-foreground mb-8">Test your knowledge of yield curves and duration</p>

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
              
              <h2 className="text-2xl font-bold text-center mb-8">Bond Market Insights</h2>

              <div className="grid gap-6 mb-8">
                {[
                  {
                    title: "Yield Curve as Economic Indicator",
                    description: "A normal curve (upward sloping) signals healthy growth. An inverted curve has preceded every US recession since 1955—it's the market's 'recession warning.'",
                    icon: TrendingUp,
                  },
                  {
                    title: "Duration = Risk Measure",
                    description: "Longer duration means more price volatility when rates change. In a rising rate environment, shorter duration bonds preserve capital better.",
                    icon: Clock,
                  },
                  {
                    title: "Bond Prices Move Opposite to Rates",
                    description: "This inverse relationship is fundamental: when rates rise, existing bonds become less attractive (their prices fall), and vice versa.",
                    icon: TrendingDown,
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
              
              <h2 className="text-2xl font-bold text-center mb-2">Apply Bond Knowledge</h2>
              <p className="text-center text-muted-foreground mb-8">Use yield curves and duration in your investing</p>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <Card className="p-4 bg-emerald-500/10 border border-emerald-500/30">
                  <h3 className="font-bold mb-3 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-500" />
                    When Rates Are Rising
                  </h3>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• Favor shorter duration bonds</li>
                    <li>• Consider floating rate notes</li>
                    <li>• Build bond ladders</li>
                    <li>• Hold less in long-term bonds</li>
                  </ul>
                </Card>
                <Card className="p-4 bg-blue-500/10 border border-blue-500/30">
                  <h3 className="font-bold mb-3 flex items-center gap-2">
                    <TrendingDown className="w-5 h-5 text-blue-500" />
                    When Rates Are Falling
                  </h3>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• Longer duration can boost returns</li>
                    <li>• Lock in yields before they drop</li>
                    <li>• Consider bond funds for price gains</li>
                    <li>• Reassess as rates stabilize</li>
                  </ul>
                </Card>
              </div>

              <Card className="p-4 bg-amber-500/10 border border-amber-500/30 mb-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-500 mt-1" />
                  <div>
                    <h4 className="font-bold text-amber-500">Watch the Curve</h4>
                    <p className="text-sm text-muted-foreground">
                      Monitor the yield curve shape. An inverted curve suggests it may be time to reduce risk in your portfolio and increase cash or short-term bonds.
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

import { useState, useEffect } from "react";
import { SliderSimulator } from "../interactive/SliderSimulator";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { ArrowRight, CheckCircle, Target, AlertTriangle, Timer, DollarSign, Lightbulb, TrendingDown } from "lucide-react";

type Slide = 1 | 2 | 3 | 4;
interface Lesson23Props { onComplete?: () => void; }

const reflectionQuestions = [
  { question: "What happens during a margin call?", options: [{ text: "You must deposit more funds or positions get liquidated", correct: true }, { text: "You receive a bonus from the broker", correct: false }, { text: "Nothing, it's just a warning", correct: false }] },
  { question: "Why is margin trading risky?", options: [{ text: "Losses are amplified just like gains", correct: true }, { text: "It's only risky for beginners", correct: false }, { text: "Brokers guarantee your positions", correct: false }] },
  { question: "How can you reduce margin call risk?", options: [{ text: "Use maximum leverage at all times", correct: false }, { text: "Keep leverage low and maintain cash buffer", correct: true }, { text: "Ignore maintenance margin requirements", correct: false }] },
];

export const Lesson23MarginRiskSlides = ({ onComplete }: Lesson23Props) => {
  const [currentSlide, setCurrentSlide] = useState<Slide>(1);
  const [accountValue, setAccountValue] = useState(50000);
  const [leverage, setLeverage] = useState(2);
  const [volatility, setVolatility] = useState(1);
  const [marginUsed, setMarginUsed] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [reflectionIndex, setReflectionIndex] = useState(0);
  const [reflectionAnswers, setReflectionAnswers] = useState<boolean[]>([]);

  const positionSize = accountValue * leverage;
  const maintenanceMargin = positionSize * 0.25;
  const marginCallLevel = maintenanceMargin / accountValue * 100;

  useEffect(() => {
    if (isSimulating && currentSlide === 1) {
      const interval = setInterval(() => {
        setMarginUsed((prev) => {
          const change = (Math.random() - 0.4) * volatility * 5;
          const newValue = Math.min(100, Math.max(0, prev + change));
          if (newValue >= 80) setIsSimulating(false);
          return newValue;
        });
      }, 300);
      return () => clearInterval(interval);
    }
  }, [isSimulating, volatility, currentSlide]);

  const handleReflectionAnswer = (isCorrect: boolean) => {
    setReflectionAnswers([...reflectionAnswers, isCorrect]);
    if (reflectionIndex < reflectionQuestions.length - 1) setTimeout(() => setReflectionIndex(reflectionIndex + 1), 1000);
  };
  const nextSlide = () => { if (currentSlide < 4) setCurrentSlide((currentSlide + 1) as Slide); else onComplete?.(); };
  const slideLabels = ["Experience", "Reflect", "Insight", "Apply"];

  return (
    <div className="space-y-6">
      <div className="flex justify-center gap-2 mb-4">
        {[1, 2, 3, 4].map((slide) => (<div key={slide} className="flex flex-col items-center"><motion.div className={`h-2 rounded-full transition-all duration-300 ${slide === currentSlide ? "w-8 bg-primary" : slide < currentSlide ? "w-4 bg-primary/50" : "w-4 bg-muted"}`} /><span className={`text-xs mt-1 ${slide === currentSlide ? "text-primary font-medium" : "text-muted-foreground"}`}>{slideLabels[slide - 1]}</span></div>))}
      </div>
      <AnimatePresence mode="wait">
        {currentSlide === 1 && (
          <motion.div key="slide1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <Card className="p-8">
              <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">Experience</Badge>
              <h2 className="text-2xl font-bold mb-2">Margin Call Simulator</h2>
              <p className="text-muted-foreground mb-6">See how leverage amplifies risk and how quickly margin calls can happen in volatile markets.</p>
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div><div className="flex justify-between mb-2"><span className="text-sm text-muted-foreground">Account Value</span><span className="font-bold">${accountValue.toLocaleString()}</span></div><Slider value={[accountValue]} onValueChange={(v) => setAccountValue(v[0])} min={10000} max={100000} step={5000} /></div>
                <div><div className="flex justify-between mb-2"><span className="text-sm text-muted-foreground">Leverage</span><span className="font-bold">{leverage}x</span></div><Slider value={[leverage]} onValueChange={(v) => setLeverage(v[0])} min={1} max={5} step={0.5} /></div>
              </div>
              <div className="mb-4"><div className="flex justify-between mb-2"><span className="text-sm text-muted-foreground">Market Volatility</span><span className="font-bold">{volatility === 1 ? "Normal" : volatility === 2 ? "High" : "Extreme"}</span></div><Slider value={[volatility]} onValueChange={(v) => setVolatility(v[0])} min={1} max={3} step={1} /></div>
              <div className="flex gap-3 mb-6">
                <Button onClick={() => { setIsSimulating(!isSimulating); if (!isSimulating) setMarginUsed(30); }} variant={isSimulating ? "destructive" : "default"}>{isSimulating ? "Stop" : "Start"} Simulation</Button>
                <Button variant="outline" onClick={() => setMarginUsed(0)}>Reset</Button>
              </div>
              <Card className="p-4 bg-muted/50 mb-6">
                <div className="flex justify-between mb-2"><span className="text-sm text-muted-foreground flex items-center gap-2"><Timer className="w-4 h-4" />Margin Usage</span><span className={`font-bold ${marginUsed > 70 ? "text-destructive" : marginUsed > 50 ? "text-amber-500" : "text-emerald-500"}`}>{marginUsed.toFixed(0)}%</span></div>
                <Progress value={marginUsed} className="h-4 mb-2" />
                <div className="flex justify-between text-xs text-muted-foreground"><span>Safe</span><span className="text-amber-500">Warning (50%)</span><span className="text-destructive">Margin Call (80%)</span></div>
              </Card>
              {marginUsed >= 80 && (<motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="p-4 rounded-xl bg-destructive/20 border border-destructive/50 mb-6"><div className="flex items-center gap-3"><AlertTriangle className="w-6 h-6 text-destructive" /><div><p className="font-bold text-destructive">MARGIN CALL!</p><p className="text-sm text-muted-foreground">Deposit funds or positions will be liquidated at a loss.</p></div></div></motion.div>)}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="p-3 rounded-xl bg-background border text-center"><p className="text-xs text-muted-foreground">Position Size</p><p className="font-bold">${positionSize.toLocaleString()}</p></div>
                <div className="p-3 rounded-xl bg-background border text-center"><p className="text-xs text-muted-foreground">Maint. Margin</p><p className="font-bold">${maintenanceMargin.toLocaleString()}</p></div>
                <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/30 text-center"><p className="text-xs text-muted-foreground">Call at Loss</p><p className="font-bold text-destructive">-{(100/leverage).toFixed(0)}%</p></div>
              </div>
              <div className="flex justify-center"><Button onClick={nextSlide} size="lg" className="gap-2">Continue to Reflect <ArrowRight className="w-4 h-4" /></Button></div>
            </Card>
          </motion.div>
        )}
        {currentSlide === 2 && (
          <motion.div key="slide2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <Card className="p-8">
              <Badge className="mb-4 bg-amber-500/20 text-amber-400 border-amber-500/30">Reflect</Badge>
              <h2 className="text-2xl font-bold text-center mb-8">Margin Trading Knowledge</h2>
              <Card className="p-6 bg-muted/50 mb-6">
                <div className="flex items-center gap-2 mb-4"><Target className="w-5 h-5 text-amber-500" /><span className="text-sm text-muted-foreground">Question {reflectionIndex + 1} of {reflectionQuestions.length}</span></div>
                <h3 className="font-bold text-lg mb-6">{reflectionQuestions[reflectionIndex].question}</h3>
                <div className="space-y-3">{reflectionQuestions[reflectionIndex].options.map((option, idx) => (<motion.button key={idx} onClick={() => handleReflectionAnswer(option.correct)} className={`w-full p-4 rounded-xl text-left border-2 transition-all ${reflectionAnswers[reflectionIndex] !== undefined ? option.correct ? "border-emerald-500 bg-emerald-500/10" : "border-border opacity-50" : "border-border hover:border-primary"}`} disabled={reflectionAnswers[reflectionIndex] !== undefined}>{option.text}{reflectionAnswers[reflectionIndex] !== undefined && option.correct && <CheckCircle className="w-5 h-5 text-emerald-500 inline ml-2" />}</motion.button>))}</div>
              </Card>
              <div className="flex justify-center"><Button onClick={nextSlide} size="lg" className="gap-2" disabled={reflectionAnswers.length < reflectionQuestions.length}>Continue to Insight <ArrowRight className="w-4 h-4" /></Button></div>
            </Card>
          </motion.div>
        )}
        {currentSlide === 3 && (
          <motion.div key="slide3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <Card className="p-8">
              <Badge className="mb-4 bg-blue-500/20 text-blue-400 border-blue-500/30">Insight</Badge>
              <h2 className="text-2xl font-bold text-center mb-8">Margin Trading Insights</h2>
              <div className="grid gap-6 mb-8">
                {[{ title: "Leverage Cuts Both Ways", description: "2x leverage means 2x gains AND 2x losses. A 50% drop wipes out a 2x leveraged position completely.", icon: TrendingDown }, { title: "Volatility Accelerates Risk", description: "In calm markets, leverage seems safe. In crashes, margin calls happen in hours, forcing you to sell at the worst time.", icon: AlertTriangle }, { title: "Professional Use Only", description: "Most retail traders who use margin lose money. If you use it, keep leverage under 1.5x and maintain large cash buffers.", icon: DollarSign }].map((insight, idx) => (<motion.div key={idx} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.2 }} className="p-6 rounded-xl bg-blue-500/10 border border-blue-500/30"><div className="flex items-start gap-4"><div className="p-3 rounded-xl bg-blue-500/20"><insight.icon className="w-6 h-6 text-blue-500" /></div><div><h3 className="font-bold mb-2">{insight.title}</h3><p className="text-muted-foreground">{insight.description}</p></div></div></motion.div>))}
              </div>
              <div className="flex justify-center"><Button onClick={nextSlide} size="lg" className="gap-2">Continue to Apply <ArrowRight className="w-4 h-4" /></Button></div>
            </Card>
          </motion.div>
        )}
        {currentSlide === 4 && (
          <motion.div key="slide4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <Card className="p-8">
              <Badge className="mb-4 bg-purple-500/20 text-purple-400 border-purple-500/30">Apply</Badge>
              <h2 className="text-2xl font-bold text-center mb-2">Margin Risk Management Rules</h2>
              <p className="text-center text-muted-foreground mb-8">If you ever use margin, follow these strict guidelines</p>

              <div className="space-y-4 mb-6">
                {[
                  { action: "Never use more than 1.5x leverage", tip: "At 2x leverage, a 50% drop wipes you out. At 1.5x, you survive to recover" },
                  { action: "Keep 30%+ cash buffer at all times", tip: "This prevents margin calls during normal volatility and gives you buying power in crashes" },
                  { action: "Set hard stop-losses before entering", tip: "Decide your exit point when calm, not when panicking during a margin call" },
                  { action: "Avoid margin during high volatility", tip: "VIX above 25? Pay down margin. Crashes happen when leverage is highest" },
                  { action: "Only margin with diversified holdings", tip: "Never use margin on single stocks. If you must, only on broad index ETFs" },
                ].map((item, idx) => (
                  <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="p-4 rounded-xl bg-muted/50 border border-border">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">{idx + 1}</div>
                      <div>
                        <p className="font-medium">{item.action}</p>
                        <p className="text-sm text-muted-foreground">{item.tip}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <Card className="p-4 bg-destructive/10 border border-destructive/30 mb-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-destructive mt-1" />
                  <div>
                    <h4 className="font-bold text-destructive">Critical Warning</h4>
                    <p className="text-sm text-muted-foreground">Most retail investors should never use margin. The math is against you: gains are capped, but losses can exceed your investment. If you wouldn't take a loan from a bank to buy stocks, don't use margin.</p>
                  </div>
                </div>
              <SliderSimulator title="⚠️ Margin Call Calculator" description="See when you'd get margin called:" sliders={[{ id: "equity", label: "Your Equity", min: 5000, max: 50000, step: 1000, defaultValue: 20000, unit: "$" },{ id: "borrowed", label: "Borrowed Amount", min: 5000, max: 50000, step: 1000, defaultValue: 20000, unit: "$" },{ id: "drop", label: "Stock Drop", min: 0, max: 50, step: 5, defaultValue: 25, unit: "%" }]} calculateResult={(vals) => { const total = vals.equity + vals.borrowed; const afterDrop = total * (1 - vals.drop / 100); const equityLeft = afterDrop - vals.borrowed; const marginRatio = equityLeft / afterDrop * 100; const called = marginRatio < 25; return { primary: called ? "⚠️ MARGIN CALL!" : `${marginRatio.toFixed(0)}% equity`, secondary: `Equity remaining: $${Math.round(equityLeft).toLocaleString()}`, insight: called ? "You must deposit more funds or positions will be liquidated!" : "Above 25% maintenance margin — safe for now." }; }} />
              </Card>
              <div className="flex justify-center"><Button onClick={nextSlide} size="lg" className="gap-2">Complete Lesson <CheckCircle className="w-4 h-4" /></Button></div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

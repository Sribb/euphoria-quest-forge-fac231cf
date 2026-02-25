import { useState } from "react";
import { SliderSimulator } from "../interactive/SliderSimulator";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { ArrowRight, CheckCircle, Target, TrendingDown, AlertTriangle, Lightbulb, DollarSign } from "lucide-react";

type Slide = 1 | 2 | 3 | 4;
interface Lesson25Props { onComplete?: () => void; }

const reflectionQuestions = [
  { question: "What's the maximum loss when shorting a stock?", options: [{ text: "100% of the short value", correct: false }, { text: "Theoretically unlimited", correct: true }, { text: "50% of the short value", correct: false }] },
  { question: "Why is short selling riskier than going long?", options: [{ text: "Stocks can rise infinitely but only fall to zero", correct: true }, { text: "Short selling is illegal", correct: false }, { text: "You pay higher commissions", correct: false }] },
  { question: "What is a 'short squeeze'?", options: [{ text: "When shorts are forced to buy, pushing prices higher", correct: true }, { text: "When a stock price drops rapidly", correct: false }, { text: "A type of options strategy", correct: false }] },
];

export const Lesson25ShortSellingSlides = ({ onComplete }: Lesson25Props) => {
  const [currentSlide, setCurrentSlide] = useState<Slide>(1);
  const [shortPrice, setShortPrice] = useState(100);
  const [currentPrice, setCurrentPrice] = useState(100);
  const [shares, setShares] = useState(100);
  const [reflectionIndex, setReflectionIndex] = useState(0);
  const [reflectionAnswers, setReflectionAnswers] = useState<boolean[]>([]);

  const profitLoss = (shortPrice - currentPrice) * shares;
  const percentChange = ((shortPrice - currentPrice) / shortPrice) * 100;

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
              <h2 className="text-2xl font-bold mb-2">Short Selling Loss Curve</h2>
              <p className="text-muted-foreground mb-6">Short selling profits when prices fall but has unlimited loss potential. See the asymmetric risk.</p>
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div><div className="flex justify-between mb-2"><span className="text-sm text-muted-foreground">Short Entry Price</span><span className="font-bold">${shortPrice}</span></div><Slider value={[shortPrice]} onValueChange={(v) => setShortPrice(v[0])} min={50} max={200} /></div>
                <div><div className="flex justify-between mb-2"><span className="text-sm text-muted-foreground">Current Stock Price</span><span className="font-bold">${currentPrice}</span></div><Slider value={[currentPrice]} onValueChange={(v) => setCurrentPrice(v[0])} min={10} max={500} /></div>
              </div>
              <Card className={`p-6 mb-6 ${profitLoss >= 0 ? "bg-emerald-500/10 border-emerald-500/30" : "bg-destructive/10 border-destructive/30"}`}>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div><p className="text-xs text-muted-foreground">Position Size</p><p className="font-bold">{shares} shares</p></div>
                  <div><p className="text-xs text-muted-foreground">Price Change</p><p className={`font-bold ${currentPrice <= shortPrice ? "text-emerald-500" : "text-destructive"}`}>{currentPrice <= shortPrice ? "" : "+"}{((currentPrice - shortPrice) / shortPrice * 100).toFixed(1)}%</p></div>
                  <div><p className="text-xs text-muted-foreground">Profit/Loss</p><p className={`text-2xl font-bold ${profitLoss >= 0 ? "text-emerald-500" : "text-destructive"}`}>{profitLoss >= 0 ? "+" : ""}{profitLoss.toLocaleString()}</p></div>
                </div>
              </Card>
              {currentPrice > shortPrice * 2 && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 rounded-xl bg-destructive/20 border border-destructive/50 mb-6"><div className="flex items-center gap-3"><AlertTriangle className="w-6 h-6 text-destructive" /><div><p className="font-bold text-destructive">Extreme Loss!</p><p className="text-sm text-muted-foreground">Stock doubled—your loss exceeds your original position value. This is unlimited risk in action.</p></div></div></motion.div>)}
              <Card className="p-4 bg-amber-500/10 border border-amber-500/30 mb-6"><p className="text-sm text-center"><strong>Key Asymmetry:</strong> Long position max loss = 100%. Short position max loss = ∞</p></Card>
              <div className="flex justify-center"><Button onClick={nextSlide} size="lg" className="gap-2">Continue to Reflect <ArrowRight className="w-4 h-4" /></Button></div>
            </Card>
          </motion.div>
        )}
        {currentSlide === 2 && (
          <motion.div key="slide2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <Card className="p-8">
              <Badge className="mb-4 bg-amber-500/20 text-amber-400 border-amber-500/30">Reflect</Badge>
              <h2 className="text-2xl font-bold text-center mb-8">Short Selling Knowledge</h2>
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
              <h2 className="text-2xl font-bold text-center mb-8">Short Selling Insights</h2>
              <div className="grid gap-6 mb-8">
                {[{ title: "Asymmetric Risk Profile", description: "Buying a stock: max loss is 100%. Shorting: no upper limit on losses. This fundamental asymmetry is why shorting is dangerous.", icon: TrendingDown }, { title: "Short Squeezes Destroy Shorts", description: "When a heavily shorted stock rises, shorts must buy to cover, pushing prices higher, forcing more covering—a self-reinforcing loop.", icon: AlertTriangle }, { title: "Timing Is Everything", description: "Being right about a stock being overvalued isn't enough. Markets can stay irrational longer than you can stay solvent.", icon: Lightbulb }].map((insight, idx) => (<motion.div key={idx} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.2 }} className="p-6 rounded-xl bg-blue-500/10 border border-blue-500/30"><div className="flex items-start gap-4"><div className="p-3 rounded-xl bg-blue-500/20"><insight.icon className="w-6 h-6 text-blue-500" /></div><div><h3 className="font-bold mb-2">{insight.title}</h3><p className="text-muted-foreground">{insight.description}</p></div></div></motion.div>))}
              </div>
              <div className="flex justify-center"><Button onClick={nextSlide} size="lg" className="gap-2">Continue to Apply <ArrowRight className="w-4 h-4" /></Button></div>
            </Card>
          </motion.div>
        )}
        {currentSlide === 4 && (
          <motion.div key="slide4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <Card className="p-8">
              <Badge className="mb-4 bg-purple-500/20 text-purple-400 border-purple-500/30">Apply</Badge>
              <h2 className="text-2xl font-bold text-center mb-2">Safer Alternatives to Short Selling</h2>
              <p className="text-center text-muted-foreground mb-8">How to profit from downturns without unlimited risk</p>

              <div className="space-y-4 mb-6">
                {[
                  { action: "Use inverse ETFs instead of shorting", tip: "Inverse S&P 500 ETFs have defined risk. You can only lose what you invest, not more" },
                  { action: "Buy put options for bearish bets", tip: "Puts give you downside exposure with max loss = premium paid. Much safer than shorting" },
                  { action: "Hedge with options, don't speculate", tip: "Protective puts on stocks you own is smart risk management, not gambling" },
                  { action: "If you must short, use strict stop-losses", tip: "Set a 20-25% stop-loss. Never let a short position run against you hoping it reverses" },
                  { action: "Size short positions tiny", tip: "Professional short sellers rarely exceed 2% of portfolio per position. You should use even less" },
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
                    <h4 className="font-bold text-destructive">Final Warning</h4>
                    <p className="text-sm text-muted-foreground">Short selling has destroyed professional hedge funds. If experts with billions and research teams blow up shorting, retail investors have even worse odds. When in doubt, simply reduce long exposure instead of going short.</p>
                  </div>
                </div>
              <SliderSimulator title="📉 Short Selling P&L" description="Calculate your short position profit/loss:" sliders={[{ id: "entry", label: "Short Entry Price", min: 20, max: 200, step: 5, defaultValue: 100, unit: "$" },{ id: "current", label: "Current Price", min: 20, max: 300, step: 5, defaultValue: 80, unit: "$" },{ id: "shares", label: "Shares Shorted", min: 10, max: 500, step: 10, defaultValue: 100 }]} calculateResult={(vals) => { const pl = (vals.entry - vals.current) * vals.shares; return { primary: `${pl >= 0 ? "+" : ""}$${pl.toLocaleString()}`, secondary: pl >= 0 ? "Profitable short! 📉" : "Loss — stock went against you 📈", insight: vals.current > vals.entry * 1.5 ? "Unlimited loss potential — this is why shorts are risky!" : "Remember: losses are theoretically unlimited when shorting." }; }} />
              </Card>
              <div className="flex justify-center"><Button onClick={nextSlide} size="lg" className="gap-2">Complete Lesson <CheckCircle className="w-4 h-4" /></Button></div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

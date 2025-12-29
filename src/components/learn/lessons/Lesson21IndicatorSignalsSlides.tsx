import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle, Target, Activity, TrendingUp, TrendingDown, Lightbulb } from "lucide-react";

type Slide = 1 | 2 | 3 | 4;
interface Lesson21Props { onComplete?: () => void; }

const indicators = [
  { name: "RSI", value: 72, signal: "overbought", description: "Relative Strength Index above 70" },
  { name: "MACD", value: 1, signal: "bullish", description: "MACD line above signal line" },
  { name: "Moving Avg", value: -1, signal: "bearish", description: "Price below 50-day MA" },
  { name: "Volume", value: 1, signal: "bullish", description: "Above average volume on up days" },
  { name: "Bollinger", value: 0, signal: "neutral", description: "Price within bands" },
  { name: "Stochastic", value: 85, signal: "overbought", description: "Above 80 threshold" },
];

const reflectionQuestions = [
  { question: "What does RSI above 70 typically indicate?", options: [{ text: "Oversold conditions", correct: false }, { text: "Overbought conditions", correct: true }, { text: "Neutral momentum", correct: false }] },
  { question: "Why use multiple indicators together?", options: [{ text: "Single indicators can give false signals", correct: true }, { text: "More indicators always means more profit", correct: false }, { text: "It's required by regulators", correct: false }] },
  { question: "What is indicator divergence?", options: [{ text: "When price and indicator move in opposite directions", correct: true }, { text: "When two indicators agree", correct: false }, { text: "When volume increases", correct: false }] },
];

export const Lesson21IndicatorSignalsSlides = ({ onComplete }: Lesson21Props) => {
  const [currentSlide, setCurrentSlide] = useState<Slide>(1);
  const [reflectionIndex, setReflectionIndex] = useState(0);
  const [reflectionAnswers, setReflectionAnswers] = useState<boolean[]>([]);

  const bullishCount = indicators.filter(i => i.signal === "bullish").length;
  const bearishCount = indicators.filter(i => i.signal === "bearish" || i.signal === "overbought").length;

  const handleReflectionAnswer = (isCorrect: boolean) => {
    setReflectionAnswers([...reflectionAnswers, isCorrect]);
    if (reflectionIndex < reflectionQuestions.length - 1) setTimeout(() => setReflectionIndex(reflectionIndex + 1), 1000);
  };

  const nextSlide = () => { if (currentSlide < 4) setCurrentSlide((currentSlide + 1) as Slide); else onComplete?.(); };
  const slideLabels = ["Experience", "Reflect", "Insight", "Apply"];

  return (
    <div className="space-y-6">
      <div className="flex justify-center gap-2 mb-4">
        {[1, 2, 3, 4].map((slide) => (
          <div key={slide} className="flex flex-col items-center">
            <motion.div className={`h-2 rounded-full transition-all duration-300 ${slide === currentSlide ? "w-8 bg-primary" : slide < currentSlide ? "w-4 bg-primary/50" : "w-4 bg-muted"}`} />
            <span className={`text-xs mt-1 ${slide === currentSlide ? "text-primary font-medium" : "text-muted-foreground"}`}>{slideLabels[slide - 1]}</span>
          </div>
        ))}
      </div>
      <AnimatePresence mode="wait">
        {currentSlide === 1 && (
          <motion.div key="slide1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <Card className="p-8">
              <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">Experience</Badge>
              <h2 className="text-2xl font-bold mb-2">Technical Indicator Heatmap</h2>
              <p className="text-muted-foreground mb-6">Technical indicators help identify momentum, trend, and potential reversals. See how multiple signals combine.</p>
              <div className="grid grid-cols-3 gap-3 mb-6">
                {indicators.map((ind) => (
                  <motion.div key={ind.name} className={`p-4 rounded-xl border-2 ${ind.signal === "bullish" ? "bg-emerald-500/10 border-emerald-500/30" : ind.signal === "bearish" || ind.signal === "overbought" ? "bg-destructive/10 border-destructive/30" : "bg-muted/50 border-border"}`} whileHover={{ scale: 1.02 }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-sm">{ind.name}</span>
                      {ind.signal === "bullish" ? <TrendingUp className="w-4 h-4 text-emerald-500" /> : ind.signal === "bearish" || ind.signal === "overbought" ? <TrendingDown className="w-4 h-4 text-destructive" /> : <Activity className="w-4 h-4 text-muted-foreground" />}
                    </div>
                    <p className="text-xs text-muted-foreground">{ind.description}</p>
                    <Badge variant="outline" className={`mt-2 text-xs ${ind.signal === "bullish" ? "text-emerald-500" : ind.signal === "bearish" || ind.signal === "overbought" ? "text-destructive" : ""}`}>{ind.signal}</Badge>
                  </motion.div>
                ))}
              </div>
              <Card className="p-4 bg-muted/50 mb-6">
                <h3 className="font-bold mb-3">Signal Summary</h3>
                <div className="flex gap-4">
                  <div className="flex-1 p-3 rounded-xl bg-emerald-500/10 text-center"><p className="text-2xl font-bold text-emerald-500">{bullishCount}</p><p className="text-xs text-muted-foreground">Bullish</p></div>
                  <div className="flex-1 p-3 rounded-xl bg-destructive/10 text-center"><p className="text-2xl font-bold text-destructive">{bearishCount}</p><p className="text-xs text-muted-foreground">Bearish/Caution</p></div>
                </div>
              </Card>
              <div className="flex justify-center"><Button onClick={nextSlide} size="lg" className="gap-2">Continue to Reflect <ArrowRight className="w-4 h-4" /></Button></div>
            </Card>
          </motion.div>
        )}
        {currentSlide === 2 && (
          <motion.div key="slide2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <Card className="p-8">
              <Badge className="mb-4 bg-amber-500/20 text-amber-400 border-amber-500/30">Reflect</Badge>
              <h2 className="text-2xl font-bold text-center mb-8">Understanding Indicators</h2>
              <Card className="p-6 bg-muted/50 mb-6">
                <div className="flex items-center gap-2 mb-4"><Target className="w-5 h-5 text-amber-500" /><span className="text-sm text-muted-foreground">Question {reflectionIndex + 1} of {reflectionQuestions.length}</span></div>
                <h3 className="font-bold text-lg mb-6">{reflectionQuestions[reflectionIndex].question}</h3>
                <div className="space-y-3">
                  {reflectionQuestions[reflectionIndex].options.map((option, idx) => (
                    <motion.button key={idx} onClick={() => handleReflectionAnswer(option.correct)} className={`w-full p-4 rounded-xl text-left border-2 transition-all ${reflectionAnswers[reflectionIndex] !== undefined ? option.correct ? "border-emerald-500 bg-emerald-500/10" : "border-border opacity-50" : "border-border hover:border-primary"}`} disabled={reflectionAnswers[reflectionIndex] !== undefined}>
                      {option.text}{reflectionAnswers[reflectionIndex] !== undefined && option.correct && <CheckCircle className="w-5 h-5 text-emerald-500 inline ml-2" />}
                    </motion.button>
                  ))}
                </div>
              </Card>
              <div className="flex justify-center"><Button onClick={nextSlide} size="lg" className="gap-2" disabled={reflectionAnswers.length < reflectionQuestions.length}>Continue to Insight <ArrowRight className="w-4 h-4" /></Button></div>
            </Card>
          </motion.div>
        )}
        {currentSlide === 3 && (
          <motion.div key="slide3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <Card className="p-8">
              <Badge className="mb-4 bg-blue-500/20 text-blue-400 border-blue-500/30">Insight</Badge>
              <h2 className="text-2xl font-bold text-center mb-8">Technical Analysis Insights</h2>
              <div className="grid gap-6 mb-8">
                {[{ title: "Confluence = Confidence", description: "When multiple indicators agree, the signal is stronger. Look for 3+ indicators pointing the same direction.", icon: Activity }, { title: "Divergence Warns of Reversals", description: "When price makes new highs but RSI doesn't, momentum is weakening. This often precedes trend changes.", icon: TrendingDown }, { title: "Indicators Lag Price", description: "Technical indicators are calculated from past prices. Use them to confirm, not predict. Price action leads.", icon: Lightbulb }].map((insight, idx) => (
                  <motion.div key={idx} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.2 }} className="p-6 rounded-xl bg-blue-500/10 border border-blue-500/30">
                    <div className="flex items-start gap-4"><div className="p-3 rounded-xl bg-blue-500/20"><insight.icon className="w-6 h-6 text-blue-500" /></div><div><h3 className="font-bold mb-2">{insight.title}</h3><p className="text-muted-foreground">{insight.description}</p></div></div>
                  </motion.div>
                ))}
              </div>
              <div className="flex justify-center"><Button onClick={nextSlide} size="lg" className="gap-2">Continue to Apply <ArrowRight className="w-4 h-4" /></Button></div>
            </Card>
          </motion.div>
        )}
        {currentSlide === 4 && (
          <motion.div key="slide4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <Card className="p-8">
              <Badge className="mb-4 bg-purple-500/20 text-purple-400 border-purple-500/30">Apply</Badge>
              <h2 className="text-2xl font-bold text-center mb-2">Build Your Indicator Toolkit</h2>
              <p className="text-center text-muted-foreground mb-8">Practical steps to use technical indicators effectively</p>
              
              <div className="space-y-4 mb-6">
                {[
                  { action: "Master 2-3 indicators deeply before adding more", tip: "RSI + MACD + Volume is enough for most traders. Complexity doesn't equal better results" },
                  { action: "Look for confluence before trading", tip: "Wait for 3+ indicators to agree. Single indicator signals have high false-positive rates" },
                  { action: "Watch for divergences as warnings", tip: "When price makes new highs but RSI doesn't, momentum is fading—be cautious" },
                  { action: "Adjust settings for your timeframe", tip: "Shorter periods (RSI-7) for day trading, longer (RSI-21) for swing trading" },
                  { action: "Backtest before trading live", tip: "Test your indicator strategy on historical data. If it doesn't work in the past, it won't work now" },
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

              <Card className="p-4 bg-emerald-500/10 border border-emerald-500/30 mb-6">
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-emerald-500 mt-1" />
                  <div>
                    <h4 className="font-bold text-emerald-500">Key Takeaway</h4>
                    <p className="text-sm text-muted-foreground">Indicators are tools, not crystal balls. They work best when combined with price action, volume analysis, and sound risk management. No indicator predicts the future.</p>
                  </div>
                </div>
              </Card>
              <div className="flex justify-center"><Button onClick={nextSlide} size="lg" className="gap-2">Complete Lesson <CheckCircle className="w-4 h-4" /></Button></div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

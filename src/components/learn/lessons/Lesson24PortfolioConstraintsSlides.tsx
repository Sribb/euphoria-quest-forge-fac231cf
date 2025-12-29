import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { ArrowRight, CheckCircle, Target, PieChart, AlertTriangle, Lightbulb, Shield } from "lucide-react";

type Slide = 1 | 2 | 3 | 4;
interface Lesson24Props { onComplete?: () => void; }

const reflectionQuestions = [
  { question: "Why have position size limits?", options: [{ text: "To prevent any single stock from dominating your portfolio", correct: true }, { text: "Because regulators require it", correct: false }, { text: "To minimize gains", correct: false }] },
  { question: "What's a typical max single position size for diversification?", options: [{ text: "50% of portfolio", correct: false }, { text: "5-10% of portfolio", correct: true }, { text: "1% of portfolio", correct: false }] },
  { question: "Why set risk budgets by asset class?", options: [{ text: "Different assets have different risk profiles", correct: true }, { text: "It's just for tax purposes", correct: false }, { text: "To avoid profitable investments", correct: false }] },
];

export const Lesson24PortfolioConstraintsSlides = ({ onComplete }: Lesson24Props) => {
  const [currentSlide, setCurrentSlide] = useState<Slide>(1);
  const [stocks, setStocks] = useState(60);
  const [bonds, setBonds] = useState(30);
  const [alternatives, setAlternatives] = useState(10);
  const [maxPosition, setMaxPosition] = useState(10);
  const [reflectionIndex, setReflectionIndex] = useState(0);
  const [reflectionAnswers, setReflectionAnswers] = useState<boolean[]>([]);

  const total = stocks + bonds + alternatives;
  const isValid = total === 100 && stocks >= 20 && bonds >= 10;

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
              <h2 className="text-2xl font-bold mb-2">Portfolio Constraint Builder</h2>
              <p className="text-muted-foreground mb-6">Professional portfolios have rules. Build your allocation with real-world constraints.</p>
              <Card className="p-4 bg-muted/50 mb-6">
                <h3 className="font-bold mb-4 flex items-center gap-2"><PieChart className="w-5 h-5" />Asset Allocation (must = 100%)</h3>
                <div className="space-y-4">
                  <div><div className="flex justify-between mb-2"><span className="text-sm">Stocks (min 20%)</span><span className={`font-bold ${stocks < 20 ? "text-destructive" : "text-emerald-500"}`}>{stocks}%</span></div><Slider value={[stocks]} onValueChange={(v) => setStocks(v[0])} min={0} max={100} /></div>
                  <div><div className="flex justify-between mb-2"><span className="text-sm">Bonds (min 10%)</span><span className={`font-bold ${bonds < 10 ? "text-destructive" : "text-blue-500"}`}>{bonds}%</span></div><Slider value={[bonds]} onValueChange={(v) => setBonds(v[0])} min={0} max={100} /></div>
                  <div><div className="flex justify-between mb-2"><span className="text-sm">Alternatives</span><span className="font-bold text-amber-500">{alternatives}%</span></div><Slider value={[alternatives]} onValueChange={(v) => setAlternatives(v[0])} min={0} max={30} /></div>
                </div>
                <div className={`mt-4 p-3 rounded-xl ${total === 100 ? "bg-emerald-500/10 border border-emerald-500/30" : "bg-destructive/10 border border-destructive/30"}`}><p className={`text-center font-bold ${total === 100 ? "text-emerald-500" : "text-destructive"}`}>Total: {total}% {total !== 100 && "(must be 100%)"}</p></div>
              </Card>
              <Card className="p-4 bg-muted/50 mb-6">
                <h3 className="font-bold mb-4 flex items-center gap-2"><Shield className="w-5 h-5" />Position Limits</h3>
                <div><div className="flex justify-between mb-2"><span className="text-sm">Max Single Position</span><span className="font-bold">{maxPosition}%</span></div><Slider value={[maxPosition]} onValueChange={(v) => setMaxPosition(v[0])} min={2} max={25} /></div>
                <p className="text-xs text-muted-foreground mt-2">Professional funds typically limit single positions to 5-10%</p>
              </Card>
              {!isValid && (<motion.div className="p-4 rounded-xl bg-amber-500/20 border border-amber-500/50 mb-6"><div className="flex items-center gap-3"><AlertTriangle className="w-5 h-5 text-amber-500" /><p className="text-sm">Constraints not met. Adjust allocations to continue.</p></div></motion.div>)}
              <div className="flex justify-center"><Button onClick={nextSlide} size="lg" className="gap-2" disabled={!isValid}>Continue to Reflect <ArrowRight className="w-4 h-4" /></Button></div>
            </Card>
          </motion.div>
        )}
        {currentSlide === 2 && (
          <motion.div key="slide2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <Card className="p-8">
              <Badge className="mb-4 bg-amber-500/20 text-amber-400 border-amber-500/30">Reflect</Badge>
              <h2 className="text-2xl font-bold text-center mb-8">Portfolio Management</h2>
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
              <h2 className="text-2xl font-bold text-center mb-8">Constraint Insights</h2>
              <div className="grid gap-6 mb-8">
                {[{ title: "Constraints Protect You From Yourself", description: "Without limits, it's tempting to concentrate in hot stocks. Rules prevent one bad bet from destroying your portfolio.", icon: Shield }, { title: "Rebalancing Enforces Discipline", description: "When a position grows past limits, you sell some. This naturally implements 'buy low, sell high.'", icon: PieChart }, { title: "Match Constraints to Goals", description: "Conservative investors need tighter constraints. Growth investors can allow more flexibility but should still have limits.", icon: Lightbulb }].map((insight, idx) => (<motion.div key={idx} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.2 }} className="p-6 rounded-xl bg-blue-500/10 border border-blue-500/30"><div className="flex items-start gap-4"><div className="p-3 rounded-xl bg-blue-500/20"><insight.icon className="w-6 h-6 text-blue-500" /></div><div><h3 className="font-bold mb-2">{insight.title}</h3><p className="text-muted-foreground">{insight.description}</p></div></div></motion.div>))}
              </div>
              <div className="flex justify-center"><Button onClick={nextSlide} size="lg" className="gap-2">Continue to Apply <ArrowRight className="w-4 h-4" /></Button></div>
            </Card>
          </motion.div>
        )}
        {currentSlide === 4 && (
          <motion.div key="slide4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <Card className="p-8">
              <Badge className="mb-4 bg-purple-500/20 text-purple-400 border-purple-500/30">Apply</Badge>
              <h2 className="text-2xl font-bold text-center mb-8">Your Portfolio Rules</h2>
              <Card className="p-4 bg-emerald-500/10 border border-emerald-500/30 mb-6"><div className="flex items-start gap-3"><Lightbulb className="w-5 h-5 text-emerald-500 mt-1" /><div><h4 className="font-bold text-emerald-500">Key Takeaway</h4><p className="text-sm text-muted-foreground">Write down your portfolio rules before investing: asset allocation ranges, max position sizes, and rebalancing triggers. Rules remove emotion from decisions.</p></div></div></Card>
              <div className="flex justify-center"><Button onClick={nextSlide} size="lg" className="gap-2">Complete Lesson <CheckCircle className="w-4 h-4" /></Button></div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

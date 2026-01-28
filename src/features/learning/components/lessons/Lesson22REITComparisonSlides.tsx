import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { ArrowRight, CheckCircle, Target, Home, Building, DollarSign, Lightbulb, Lock, Unlock } from "lucide-react";

type Slide = 1 | 2 | 3 | 4;
interface Lesson22Props { onComplete?: () => void; }

const reflectionQuestions = [
  { question: "What's the main advantage of REITs over direct property?", options: [{ text: "Higher returns guaranteed", correct: false }, { text: "Liquidity - you can sell shares instantly", correct: true }, { text: "No taxes on gains", correct: false }] },
  { question: "What's a disadvantage of direct real estate?", options: [{ text: "Illiquidity - hard to sell quickly", correct: true }, { text: "No control over the property", correct: false }, { text: "Cannot collect rent", correct: false }] },
  { question: "REITs are required to pay out what % of income as dividends?", options: [{ text: "50%", correct: false }, { text: "90%", correct: true }, { text: "25%", correct: false }] },
];

export const Lesson22REITComparisonSlides = ({ onComplete }: Lesson22Props) => {
  const [currentSlide, setCurrentSlide] = useState<Slide>(1);
  const [investment, setInvestment] = useState(100000);
  const [propertyYield, setPropertyYield] = useState(6);
  const [reitYield, setReitYield] = useState(4);
  const [reflectionIndex, setReflectionIndex] = useState(0);
  const [reflectionAnswers, setReflectionAnswers] = useState<boolean[]>([]);

  const propertyIncome = investment * (propertyYield / 100);
  const reitIncome = investment * (reitYield / 100);

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
              <h2 className="text-2xl font-bold mb-2">Property vs REIT Comparison</h2>
              <p className="text-muted-foreground mb-6">Compare direct real estate investment with REITs, including liquidity and cash flow differences.</p>
              <div className="mb-6">
                <div className="flex justify-between mb-2"><span className="text-sm text-muted-foreground">Investment Amount</span><span className="font-bold">${investment.toLocaleString()}</span></div>
                <Slider value={[investment]} onValueChange={(v) => setInvestment(v[0])} min={50000} max={500000} step={10000} />
              </div>
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <Card className="p-4 border-amber-500/30 bg-amber-500/5">
                  <div className="flex items-center gap-2 mb-3"><Home className="w-6 h-6 text-amber-500" /><span className="font-bold">Direct Property</span></div>
                  <div className="space-y-3">
                    <div className="flex justify-between"><span className="text-sm">Yield</span><span className="font-bold">{propertyYield}%</span></div>
                    <div className="flex justify-between"><span className="text-sm">Annual Income</span><span className="font-bold text-emerald-500">${propertyIncome.toLocaleString()}</span></div>
                    <div className="flex items-center gap-2 text-destructive text-sm"><Lock className="w-4 h-4" />Illiquid - months to sell</div>
                    <div className="text-xs text-muted-foreground">+ Full control, tax benefits<br/>- Maintenance, vacancies, large capital</div>
                  </div>
                </Card>
                <Card className="p-4 border-blue-500/30 bg-blue-500/5">
                  <div className="flex items-center gap-2 mb-3"><Building className="w-6 h-6 text-blue-500" /><span className="font-bold">REIT</span></div>
                  <div className="space-y-3">
                    <div className="flex justify-between"><span className="text-sm">Yield</span><span className="font-bold">{reitYield}%</span></div>
                    <div className="flex justify-between"><span className="text-sm">Annual Income</span><span className="font-bold text-emerald-500">${reitIncome.toLocaleString()}</span></div>
                    <div className="flex items-center gap-2 text-emerald-500 text-sm"><Unlock className="w-4 h-4" />Liquid - sell instantly</div>
                    <div className="text-xs text-muted-foreground">+ Diversified, professional management<br/>- No direct control, market volatility</div>
                  </div>
                </Card>
              </div>
              <div className="flex justify-center"><Button onClick={nextSlide} size="lg" className="gap-2">Continue to Reflect <ArrowRight className="w-4 h-4" /></Button></div>
            </Card>
          </motion.div>
        )}
        {currentSlide === 2 && (
          <motion.div key="slide2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <Card className="p-8">
              <Badge className="mb-4 bg-amber-500/20 text-amber-400 border-amber-500/30">Reflect</Badge>
              <h2 className="text-2xl font-bold text-center mb-8">Real Estate Knowledge</h2>
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
              <h2 className="text-2xl font-bold text-center mb-8">Real Estate Insights</h2>
              <div className="grid gap-6 mb-8">
                {[{ title: "Liquidity Has Value", description: "REITs trade like stocks. In emergencies, you can sell in seconds. Property sales take months and come with 6%+ transaction costs.", icon: Unlock }, { title: "Diversification Through REITs", description: "One REIT can own hundreds of properties across sectors (retail, industrial, healthcare). Direct ownership concentrates risk.", icon: Building }, { title: "Consider Both", description: "Many investors use REITs for liquidity and diversification while holding direct property for control and tax benefits.", icon: DollarSign }].map((insight, idx) => (<motion.div key={idx} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.2 }} className="p-6 rounded-xl bg-blue-500/10 border border-blue-500/30"><div className="flex items-start gap-4"><div className="p-3 rounded-xl bg-blue-500/20"><insight.icon className="w-6 h-6 text-blue-500" /></div><div><h3 className="font-bold mb-2">{insight.title}</h3><p className="text-muted-foreground">{insight.description}</p></div></div></motion.div>))}
              </div>
              <div className="flex justify-center"><Button onClick={nextSlide} size="lg" className="gap-2">Continue to Apply <ArrowRight className="w-4 h-4" /></Button></div>
            </Card>
          </motion.div>
        )}
        {currentSlide === 4 && (
          <motion.div key="slide4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <Card className="p-8">
              <Badge className="mb-4 bg-purple-500/20 text-purple-400 border-purple-500/30">Apply</Badge>
              <h2 className="text-2xl font-bold text-center mb-2">Real Estate Investment Strategy</h2>
              <p className="text-center text-muted-foreground mb-8">Choose the right approach for your situation</p>

              <div className="space-y-4 mb-6">
                {[
                  { action: "Assess your liquidity needs first", tip: "If you might need the money in 5 years, REITs are safer. Direct property requires 7-10 year horizons" },
                  { action: "Start with REITs for diversification", tip: "REIT index funds give exposure to thousands of properties across sectors for minimal investment" },
                  { action: "Consider REIT types carefully", tip: "Equity REITs own properties. Mortgage REITs lend money—much riskier. Know the difference" },
                  { action: "Evaluate tax implications", tip: "REIT dividends are taxed as ordinary income. Hold in tax-advantaged accounts when possible" },
                  { action: "Direct property for active investors only", tip: "Being a landlord is a part-time job. Factor in your time, not just returns" },
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
                    <p className="text-sm text-muted-foreground">REITs offer real estate exposure with stock-like liquidity and diversification. Direct property offers control but requires capital, time, and long holding periods. Most investors benefit from starting with REITs.</p>
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

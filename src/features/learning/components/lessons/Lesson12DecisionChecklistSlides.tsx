import { useState } from "react";
import { DragSortChallenge } from "../interactive/DragSortChallenge";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  ArrowRight, 
  CheckCircle,
  ClipboardList,
  Target,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  Shield
} from "lucide-react";

type Slide = 1 | 2 | 3 | 4;

interface Lesson12Props {
  onComplete?: () => void;
}

const investmentScenarios = [
  {
    name: "TechGrowth Inc.",
    description: "Fast-growing AI startup, no profits yet, PE ratio N/A",
    financials: { revenue: "+85% YoY", profit: "-$12M", debt: "Low", moat: "Uncertain" },
  },
  {
    name: "SteadyDividend Corp.",
    description: "30-year dividend history, slow growth, stable earnings",
    financials: { revenue: "+3% YoY", profit: "+$2.1B", debt: "Moderate", moat: "Strong" },
  },
];

const checklistItems = [
  { id: 1, category: "Financials", item: "Revenue trend is positive", icon: TrendingUp },
  { id: 2, category: "Financials", item: "Company is profitable or has clear path to profitability", icon: TrendingUp },
  { id: 3, category: "Risk", item: "Debt levels are manageable", icon: AlertTriangle },
  { id: 4, category: "Risk", item: "I understand the main risks", icon: AlertTriangle },
  { id: 5, category: "Valuation", item: "Price is reasonable relative to peers", icon: Target },
  { id: 6, category: "Moat", item: "Company has competitive advantage", icon: Shield },
  { id: 7, category: "Personal", item: "Fits my investment timeline", icon: ClipboardList },
  { id: 8, category: "Personal", item: "I can afford to lose this investment", icon: ClipboardList },
];

const reflectionQuestions = [
  {
    question: "Why is a checklist important before investing?",
    options: [
      { text: "It prevents emotional decision-making", correct: true },
      { text: "It guarantees profits", correct: false },
      { text: "It's required by law", correct: false },
    ],
  },
  {
    question: "What should you do if a stock fails multiple checklist items?",
    options: [
      { text: "Buy anyway if the price is low", correct: false },
      { text: "Reconsider or pass on the investment", correct: true },
      { text: "Ignore the checklist", correct: false },
    ],
  },
  {
    question: "Which is MOST important to verify before investing?",
    options: [
      { text: "The stock was mentioned on social media", correct: false },
      { text: "You understand the business and risks", correct: true },
      { text: "The stock price went up yesterday", correct: false },
    ],
  },
];

export const Lesson12DecisionChecklistSlides = ({ onComplete }: Lesson12Props) => {
  const [currentSlide, setCurrentSlide] = useState<Slide>(1);
  const [selectedScenario, setSelectedScenario] = useState(0);
  const [checkedItems, setCheckedItems] = useState<number[]>([]);
  const [reflectionIndex, setReflectionIndex] = useState(0);
  const [reflectionAnswers, setReflectionAnswers] = useState<boolean[]>([]);
  const [finalDecision, setFinalDecision] = useState<"buy" | "pass" | null>(null);

  const toggleCheckItem = (id: number) => {
    setCheckedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
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
  const checklistProgress = (checkedItems.length / checklistItems.length) * 100;

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
        {/* Slide 1: Experience - Investment Decision Checklist */}
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
              
              <h2 className="text-2xl font-bold mb-2">Investment Decision Checklist</h2>
              <p className="text-muted-foreground mb-6">
                Professional investors use systematic checklists to avoid emotional mistakes. Evaluate this investment.
              </p>

              {/* Scenario Selection */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {investmentScenarios.map((scenario, idx) => (
                  <motion.div
                    key={idx}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedScenario === idx ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => {
                      setSelectedScenario(idx);
                      setCheckedItems([]);
                    }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <h3 className="font-bold mb-2">{scenario.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{scenario.description}</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2 bg-muted rounded">Revenue: {scenario.financials.revenue}</div>
                      <div className="p-2 bg-muted rounded">Profit: {scenario.financials.profit}</div>
                      <div className="p-2 bg-muted rounded">Debt: {scenario.financials.debt}</div>
                      <div className="p-2 bg-muted rounded">Moat: {scenario.financials.moat}</div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Checklist Progress */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Checklist Progress</span>
                  <span className="font-bold text-primary">{checkedItems.length}/{checklistItems.length} items</span>
                </div>
                <Progress value={checklistProgress} className="h-2" />
              </div>

              {/* Checklist */}
              <Card className="p-4 bg-muted/50 mb-6">
                <div className="space-y-3">
                  {checklistItems.map((item) => (
                    <motion.div
                      key={item.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                        checkedItems.includes(item.id) 
                          ? "bg-emerald-500/10 border-emerald-500/30" 
                          : "bg-background border-border"
                      }`}
                      whileHover={{ scale: 1.01 }}
                    >
                      <Checkbox
                        checked={checkedItems.includes(item.id)}
                        onCheckedChange={() => toggleCheckItem(item.id)}
                      />
                      <item.icon className={`w-4 h-4 ${checkedItems.includes(item.id) ? "text-emerald-500" : "text-muted-foreground"}`} />
                      <span className={`flex-1 ${checkedItems.includes(item.id) ? "text-emerald-500" : ""}`}>
                        {item.item}
                      </span>
                      <Badge variant="outline" className="text-xs">{item.category}</Badge>
                    </motion.div>
                  ))}
                </div>
              </Card>

              <div className="flex justify-center">
                <Button 
                  onClick={nextSlide} 
                  size="lg" 
                  className="gap-2"
                  disabled={checkedItems.length < 4}
                >
                  {checkedItems.length < 4 ? `Check ${4 - checkedItems.length} more items` : "Continue to Reflect"}
                  <ArrowRight className="w-4 h-4" />
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
              
              <h2 className="text-2xl font-bold text-center mb-2">Why Use a Checklist?</h2>
              <p className="text-center text-muted-foreground mb-8">
                Test your understanding of systematic decision-making
              </p>

              <Card className="p-6 bg-muted/50 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="w-5 h-5 text-amber-500" />
                  <span className="text-sm text-muted-foreground">
                    Question {reflectionIndex + 1} of {reflectionQuestions.length}
                  </span>
                </div>
                
                <h3 className="font-bold text-lg mb-6">{reflectionQuestions[reflectionIndex].question}</h3>
                
                <div className="space-y-3">
                  {reflectionQuestions[reflectionIndex].options.map((option, idx) => (
                    <motion.button
                      key={idx}
                      onClick={() => handleReflectionAnswer(option.correct)}
                      className={`w-full p-4 rounded-xl text-left border-2 transition-all ${
                        reflectionAnswers[reflectionIndex] !== undefined
                          ? option.correct
                            ? "border-emerald-500 bg-emerald-500/10"
                            : "border-border opacity-50"
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
                  <div
                    key={idx}
                    className={`w-3 h-3 rounded-full transition-all ${
                      idx === reflectionIndex ? "bg-primary scale-125" : reflectionAnswers[idx] !== undefined ? "bg-emerald-500" : "bg-muted"
                    }`}
                  />
                ))}
              </div>

              <div className="flex justify-center">
                <Button 
                  onClick={nextSlide} 
                  size="lg" 
                  className="gap-2"
                  disabled={reflectionAnswers.length < reflectionQuestions.length}
                >
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
              
              <h2 className="text-2xl font-bold text-center mb-8">Decision Checklist Insights</h2>

              <div className="grid gap-6 mb-8">
                {[
                  {
                    title: "Systematic Thinking Beats Emotion",
                    description: "Warren Buffett uses checklists to avoid costly mistakes. A checklist forces you to slow down and consider all factors.",
                    icon: ClipboardList,
                    color: "emerald",
                  },
                  {
                    title: "Know What You Don't Know",
                    description: "If you can't check 'I understand the risks,' you shouldn't invest. Uncertainty is okay—ignorance is dangerous.",
                    icon: Lightbulb,
                    color: "amber",
                  },
                  {
                    title: "Pass on More Than You Buy",
                    description: "The best investors say 'no' to 99% of opportunities. A rigorous checklist helps you wait for the right ones.",
                    icon: Shield,
                    color: "blue",
                  },
                ].map((insight, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.2 }}
                    className={`p-6 rounded-xl bg-${insight.color}-500/10 border border-${insight.color}-500/30`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl bg-${insight.color}-500/20`}>
                        <insight.icon className={`w-6 h-6 text-${insight.color}-500`} />
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
              
              <h2 className="text-2xl font-bold text-center mb-2">Make Your Decision</h2>
              <p className="text-center text-muted-foreground mb-8">
                Based on your checklist analysis of {investmentScenarios[selectedScenario].name}, what's your call?
              </p>

              {/* Summary */}
              <Card className="p-6 bg-muted/50 mb-6">
                <h3 className="font-bold mb-4">Your Checklist Summary</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center">
                    <p className="text-3xl font-bold text-emerald-500">{checkedItems.length}</p>
                    <p className="text-sm text-muted-foreground">Items Passed</p>
                  </div>
                  <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/30 text-center">
                    <p className="text-3xl font-bold text-destructive">{checklistItems.length - checkedItems.length}</p>
                    <p className="text-sm text-muted-foreground">Items Failed</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {checkedItems.length >= 6 
                    ? "Strong checklist score—this could be a good investment candidate." 
                    : checkedItems.length >= 4
                      ? "Mixed results—proceed with caution or gather more information."
                      : "Low score—consider passing on this investment."}
                </p>
              </Card>

              {/* Decision */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <motion.button
                  className={`p-6 rounded-xl border-2 text-left transition-all ${
                    finalDecision === "buy" 
                      ? "border-emerald-500 bg-emerald-500/10" 
                      : "border-border hover:border-emerald-500/50"
                  }`}
                  onClick={() => setFinalDecision("buy")}
                  whileHover={{ scale: 1.02 }}
                >
                  <CheckCircle className="w-8 h-8 text-emerald-500 mb-3" />
                  <h3 className="font-bold text-lg mb-2">Buy / Invest</h3>
                  <p className="text-sm text-muted-foreground">
                    Checklist passed—add to portfolio
                  </p>
                </motion.button>
                
                <motion.button
                  className={`p-6 rounded-xl border-2 text-left transition-all ${
                    finalDecision === "pass" 
                      ? "border-amber-500 bg-amber-500/10" 
                      : "border-border hover:border-amber-500/50"
                  }`}
                  onClick={() => setFinalDecision("pass")}
                  whileHover={{ scale: 1.02 }}
                >
                  <AlertTriangle className="w-8 h-8 text-amber-500 mb-3" />
                  <h3 className="font-bold text-lg mb-2">Pass / Wait</h3>
                  <p className="text-sm text-muted-foreground">
                    Too many unknowns—need more research
                  </p>
                </motion.button>
              </div>

              {/* Interactive Challenge */}
              <DragSortChallenge
                title="📋 Investment Decision Process"
                description="Order these steps from FIRST to LAST when evaluating an investment:"
                items={[
                  { id: "research", label: "🔍 Research the company" },
                  { id: "valuation", label: "💲 Determine fair value" },
                  { id: "risk", label: "⚠️ Assess downside risk" },
                  { id: "size", label: "📐 Decide position size" },
                ]}
                correctOrder={["research", "valuation", "risk", "size"]}
              />

              <div className="flex justify-center">
                <Button 
                  onClick={nextSlide} 
                  size="lg" 
                  className="gap-2"
                  disabled={!finalDecision}
                >
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

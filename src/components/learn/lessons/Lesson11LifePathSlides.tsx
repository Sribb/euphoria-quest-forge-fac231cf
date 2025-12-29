import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { 
  ArrowRight, 
  Sparkles, 
  User,
  Briefcase,
  GraduationCap,
  Home,
  TrendingUp,
  DollarSign,
  Target,
  CheckCircle,
  Calendar
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Area, ComposedChart } from "recharts";

type Slide = 1 | 2 | 3 | 4;

interface Lesson11Props {
  onComplete?: () => void;
}

const careerPaths = [
  { id: "tech", name: "Tech Professional", icon: Briefcase, startSalary: 75000, growthRate: 0.08, color: "#3b82f6" },
  { id: "healthcare", name: "Healthcare", icon: User, startSalary: 60000, growthRate: 0.05, color: "#10b981" },
  { id: "entrepreneur", name: "Entrepreneur", icon: TrendingUp, startSalary: 40000, growthRate: 0.15, color: "#8b5cf6" },
  { id: "education", name: "Education", icon: GraduationCap, startSalary: 45000, growthRate: 0.03, color: "#f59e0b" },
];

const lifeEvents = [
  { age: 28, event: "Buy a home", cost: 50000, icon: Home },
  { age: 32, event: "Have children", cost: 15000, icon: User },
  { age: 40, event: "Kids' college fund", cost: 30000, icon: GraduationCap },
];

const reflectionQuestions = [
  {
    question: "You get a $10,000 bonus. What's the smartest move?",
    options: [
      { text: "Spend it on a vacation you deserve", correct: false, feedback: "Enjoyable, but doesn't build long-term wealth." },
      { text: "Invest it and let it compound for 20 years", correct: true, feedback: "Correct! At 7% return, this could become $38,700!" },
      { text: "Pay off low-interest debt", correct: false, feedback: "Depends on the rate—investing might be better long-term." },
    ],
  },
  {
    question: "Which has the biggest impact on retirement wealth?",
    options: [
      { text: "Getting higher investment returns", correct: false, feedback: "Returns matter, but you can't fully control them." },
      { text: "Starting to invest 10 years earlier", correct: true, feedback: "Correct! Time is the most powerful wealth builder due to compounding." },
      { text: "Earning a higher salary", correct: false, feedback: "Income helps, but doesn't guarantee wealth if you don't save." },
    ],
  },
];

export const Lesson11LifePathSlides = ({ onComplete }: Lesson11Props) => {
  const [currentSlide, setCurrentSlide] = useState<Slide>(1);
  const [selectedCareer, setSelectedCareer] = useState(0);
  const [savingsRate, setSavingsRate] = useState(15);
  const [investmentReturn, setInvestmentReturn] = useState(7);
  const [wealthData, setWealthData] = useState<any[]>([]);
  const [reflectionIndex, setReflectionIndex] = useState(0);
  const [reflectionAnswers, setReflectionAnswers] = useState<boolean[]>([]);
  const [challengeSavingsRate, setChallengeSavingsRate] = useState(20);
  const [challengeComplete, setChallengeComplete] = useState(false);

  const career = careerPaths[selectedCareer];

  // Calculate wealth trajectory
  useEffect(() => {
    const data = [];
    let wealth = 0;
    let salary = career.startSalary;
    
    for (let age = 22; age <= 65; age++) {
      // Apply career growth
      salary = career.startSalary * Math.pow(1 + career.growthRate, age - 22);
      // Cap salary growth
      salary = Math.min(salary, career.startSalary * 5);
      
      // Annual savings
      const annualSavings = salary * (savingsRate / 100);
      
      // Investment returns
      wealth = wealth * (1 + investmentReturn / 100) + annualSavings;
      
      // Life events (expenses)
      const event = lifeEvents.find(e => e.age === age);
      if (event) {
        wealth = Math.max(0, wealth - event.cost);
      }
      
      data.push({
        age,
        wealth: Math.round(wealth),
        salary: Math.round(salary),
        milestone: event?.event || null,
      });
    }
    
    setWealthData(data);
  }, [selectedCareer, savingsRate, investmentReturn, career]);

  const getFinalWealth = () => {
    if (wealthData.length === 0) return 0;
    return wealthData[wealthData.length - 1].wealth;
  };

  const handleReflectionAnswer = (isCorrect: boolean) => {
    setReflectionAnswers([...reflectionAnswers, isCorrect]);
    if (reflectionIndex < reflectionQuestions.length - 1) {
      setTimeout(() => setReflectionIndex(reflectionIndex + 1), 1500);
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
        {/* Slide 1: Experience - Life Path Simulator */}
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
                className="text-2xl font-bold mb-2 flex items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Calendar className="w-7 h-7 text-primary" />
                Life Path Financial Simulator
              </motion.h2>
              <motion.p 
                className="text-muted-foreground mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Choose your career, savings rate, and investment strategy to see your financial future.
              </motion.p>

              {/* Career Selection */}
              <div className="grid grid-cols-4 gap-3 mb-6">
                {careerPaths.map((c, idx) => {
                  const Icon = c.icon;
                  return (
                    <motion.div
                      key={c.id}
                      onClick={() => setSelectedCareer(idx)}
                      className={`p-4 rounded-xl border-2 cursor-pointer text-center transition-all ${
                        idx === selectedCareer 
                          ? "border-primary bg-primary/10" 
                          : "border-border hover:border-primary/50"
                      }`}
                      whileHover={{ scale: 1.02 }}
                    >
                      <Icon className="w-8 h-8 mx-auto mb-2" style={{ color: c.color }} />
                      <p className="font-semibold text-sm">{c.name}</p>
                      <p className="text-xs text-muted-foreground">${(c.startSalary / 1000).toFixed(0)}k start</p>
                    </motion.div>
                  );
                })}
              </div>

              {/* Sliders */}
              <Card className="p-6 bg-muted/50 mb-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" /> Savings Rate
                      </span>
                      <span className="font-bold text-primary">{savingsRate}%</span>
                    </div>
                    <Slider
                      value={[savingsRate]}
                      onValueChange={(v) => setSavingsRate(v[0])}
                      min={5}
                      max={50}
                      step={1}
                    />
                    <p className="text-xs text-muted-foreground mt-1">% of income saved & invested</p>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" /> Expected Return
                      </span>
                      <span className="font-bold text-emerald-500">{investmentReturn}%</span>
                    </div>
                    <Slider
                      value={[investmentReturn]}
                      onValueChange={(v) => setInvestmentReturn(v[0])}
                      min={3}
                      max={12}
                      step={0.5}
                    />
                    <p className="text-xs text-muted-foreground mt-1">Annual investment return</p>
                  </div>
                </div>
              </Card>

              {/* Wealth Chart */}
              <Card className="p-6 bg-muted/50 mb-6">
                <h3 className="font-bold mb-4">Your Financial Journey (Age 22-65)</h3>
                <div className="h-64 mb-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={wealthData}>
                      <defs>
                        <linearGradient id="wealthGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={career.color} stopOpacity={0.3}/>
                          <stop offset="95%" stopColor={career.color} stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="age" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `$${(v/1000000).toFixed(1)}M`} />
                      <Area type="monotone" dataKey="wealth" fill="url(#wealthGradient)" stroke="none" />
                      <Line 
                        type="monotone" 
                        dataKey="wealth" 
                        stroke={career.color}
                        strokeWidth={3}
                        dot={false}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>

                {/* Life Events */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {lifeEvents.map((event, idx) => {
                    const Icon = event.icon;
                    return (
                      <Badge key={idx} variant="secondary" className="gap-1">
                        <Icon className="w-3 h-3" /> Age {event.age}: {event.event}
                      </Badge>
                    );
                  })}
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 rounded-lg bg-background border border-border">
                    <p className="text-xs text-muted-foreground">Peak Salary</p>
                    <p className="text-xl font-bold">${Math.round(Math.min(career.startSalary * 5, career.startSalary * Math.pow(1 + career.growthRate, 43)) / 1000)}k</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-emerald-500/10">
                    <p className="text-xs text-muted-foreground">Retirement Wealth</p>
                    <p className="text-xl font-bold text-emerald-500">${(getFinalWealth() / 1000000).toFixed(2)}M</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-primary/10">
                    <p className="text-xs text-muted-foreground">Monthly Retirement Income</p>
                    <p className="text-xl font-bold text-primary">${Math.round(getFinalWealth() * 0.04 / 12).toLocaleString()}</p>
                  </div>
                </div>
              </Card>

              <motion.div 
                className="flex justify-center relative z-10"
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
            <Card className="p-8">
              <Badge className="mb-4 bg-amber-500/20 text-amber-400 border-amber-500/30">Reflect</Badge>
              
              <motion.h2 
                className="text-2xl font-bold text-center mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Money Decisions That Matter
              </motion.h2>
              <motion.p 
                className="text-center text-muted-foreground mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Test your understanding of lifetime wealth building
              </motion.p>

              <Card className="p-6 bg-muted/50 mb-6">
                <h3 className="font-bold text-lg mb-4">{reflectionQuestions[reflectionIndex].question}</h3>
                
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
                      <span className="font-medium">{option.text}</span>
                      {reflectionAnswers[reflectionIndex] !== undefined && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="text-sm text-muted-foreground mt-2"
                        >
                          {option.feedback}
                        </motion.p>
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
                      idx === reflectionIndex
                        ? "bg-primary scale-125"
                        : reflectionAnswers[idx] !== undefined
                          ? reflectionAnswers[idx]
                            ? "bg-emerald-500"
                            : "bg-destructive"
                          : "bg-muted"
                    }`}
                  />
                ))}
              </div>

              <motion.div className="flex justify-center relative z-10">
                <Button 
                  onClick={nextSlide} 
                  size="lg" 
                  className="gap-2"
                  disabled={reflectionAnswers.length < reflectionQuestions.length}
                >
                  Continue to Insight <ArrowRight className="w-4 h-4" />
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
                className="text-2xl font-bold text-center mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                The 3 Wealth Levers
              </motion.h2>

              <div className="grid gap-4 mb-8">
                {[
                  {
                    icon: Calendar,
                    title: "Time in Market",
                    description: "Starting 10 years earlier can more than double your retirement wealth. Compound interest needs time to work.",
                    stat: "2-3x more wealth",
                    color: "#10b981",
                  },
                  {
                    icon: DollarSign,
                    title: "Savings Rate",
                    description: "Going from 10% to 20% savings doubles your contributions. This is the lever you control most directly.",
                    stat: "Doubles contributions",
                    color: "#3b82f6",
                  },
                  {
                    icon: TrendingUp,
                    title: "Investment Returns",
                    description: "Each 1% in returns adds significantly over decades, but don't chase returns—focus on low costs.",
                    stat: "+25% per 1% annual gain",
                    color: "#8b5cf6",
                  },
                ].map((insight, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 * idx }}
                    className="flex gap-4 p-4 rounded-xl border border-border bg-muted/30"
                  >
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${insight.color}20` }}
                    >
                      <insight.icon className="w-6 h-6" style={{ color: insight.color }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-bold">{insight.title}</h3>
                        <Badge style={{ backgroundColor: `${insight.color}20`, color: insight.color }}>
                          {insight.stat}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{insight.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="p-6 rounded-xl bg-primary/10 border border-primary/30 mb-8"
              >
                <div className="flex items-start gap-3">
                  <Sparkles className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <p className="text-sm">
                    <strong>The magic formula:</strong> Start early, save consistently, invest in low-cost index funds, 
                    and don't panic sell during downturns. Wealth building is simple, but not easy—it requires patience and discipline.
                  </p>
                </div>
              </motion.div>

              <motion.div className="flex justify-center relative z-10">
                <Button onClick={nextSlide} size="lg" className="gap-2">
                  Apply What You Learned <ArrowRight className="w-4 h-4" />
                </Button>
              </motion.div>
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
              
              <motion.h2 
                className="text-2xl font-bold text-center mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Set Your Savings Commitment
              </motion.h2>
              <motion.p 
                className="text-center text-muted-foreground mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                What savings rate will you commit to for your financial future?
              </motion.p>

              <Card className="p-6 bg-muted/50 mb-6">
                <div className="text-center mb-6">
                  <p className="text-6xl font-bold text-primary mb-2">{challengeSavingsRate}%</p>
                  <p className="text-muted-foreground">of your income saved & invested</p>
                </div>
                
                <Slider
                  value={[challengeSavingsRate]}
                  onValueChange={(v) => setChallengeSavingsRate(v[0])}
                  min={5}
                  max={50}
                  step={1}
                  className="mb-6"
                />

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-3 rounded-lg bg-background border border-border">
                    <p className="text-xs text-muted-foreground">Monthly (on $60k)</p>
                    <p className="text-lg font-bold">${Math.round(60000 * challengeSavingsRate / 100 / 12)}</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-background border border-border">
                    <p className="text-xs text-muted-foreground">Yearly (on $60k)</p>
                    <p className="text-lg font-bold">${Math.round(60000 * challengeSavingsRate / 100).toLocaleString()}</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-emerald-500/10">
                    <p className="text-xs text-muted-foreground">In 30 years @ 7%</p>
                    <p className="text-lg font-bold text-emerald-500">
                      ${Math.round((60000 * challengeSavingsRate / 100) * (Math.pow(1.07, 30) - 1) / 0.07 / 1000)}k
                    </p>
                  </div>
                </div>

                <Button 
                  onClick={() => setChallengeComplete(true)} 
                  className="w-full gap-2"
                >
                  Commit to {challengeSavingsRate}% <Target className="w-4 h-4" />
                </Button>
              </Card>

              {challengeComplete && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-6 rounded-xl bg-emerald-500/20 border border-emerald-500/50 mb-8"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Sparkles className="w-8 h-8 text-emerald-500" />
                    <h3 className="font-bold text-lg">Excellent Commitment!</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Saving {challengeSavingsRate}% consistently will put you ahead of most people. 
                    {challengeSavingsRate >= 20 
                      ? " You're on track for financial independence!" 
                      : " Consider increasing by 1% each year until you reach 20%."}
                  </p>
                </motion.div>
              )}

              <motion.div className="flex justify-center relative z-10">
                <Button 
                  onClick={nextSlide} 
                  size="lg" 
                  className="gap-2"
                  disabled={!challengeComplete}
                >
                  Complete Lesson <CheckCircle className="w-4 h-4" />
                </Button>
              </motion.div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

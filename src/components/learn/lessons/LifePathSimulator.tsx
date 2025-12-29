import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { 
  User,
  Briefcase,
  GraduationCap,
  TrendingUp,
  PiggyBank,
  Target,
  Play,
  RotateCcw
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

interface LifeEvent {
  age: number;
  event: string;
  impact: "positive" | "negative" | "neutral";
  financialEffect: number;
  message: string;
}

const lifeEvents: LifeEvent[] = [
  { age: 25, event: "🎓 Graduate & First Job", impact: "positive", financialEffect: 5000, message: "Started career with $5K signing bonus!" },
  { age: 28, event: "💍 Marriage", impact: "neutral", financialEffect: -15000, message: "Wedding costs, but dual income ahead!" },
  { age: 30, event: "🏠 Buy First Home", impact: "neutral", financialEffect: -50000, message: "Down payment on home. Building equity!" },
  { age: 32, event: "👶 First Child", impact: "negative", financialEffect: -8000, message: "Childcare expenses increase costs." },
  { age: 35, event: "📈 Promotion", impact: "positive", financialEffect: 15000, message: "Big raise! Increased savings rate." },
  { age: 40, event: "🎢 Market Crash", impact: "negative", financialEffect: -0.3, message: "Portfolio dropped 30%. Stay the course!" },
  { age: 45, event: "💼 Career Peak", impact: "positive", financialEffect: 25000, message: "Peak earning years. Maximizing contributions!" },
  { age: 50, event: "🎓 Kids College", impact: "negative", financialEffect: -80000, message: "College tuition. Worth the investment!" },
  { age: 55, event: "📈 Bull Market", impact: "positive", financialEffect: 0.4, message: "Markets soared 40%! Compounding at work." },
  { age: 60, event: "🏖️ Early Retirement Option", impact: "neutral", financialEffect: 0, message: "Could retire early if prepared!" },
];

export const LifePathSimulator = () => {
  const [careerPath, setCareerPath] = useState<"high" | "medium" | "low">("medium");
  const [savingsRate, setSavingsRate] = useState(15);
  const [returnRate, setReturnRate] = useState(7);
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentAge, setCurrentAge] = useState(22);
  const [portfolioValue, setPortfolioValue] = useState(0);
  const [timeline, setTimeline] = useState<{ age: number; value: number }[]>([]);
  const [currentEvent, setCurrentEvent] = useState<LifeEvent | null>(null);
  const [simulationComplete, setSimulationComplete] = useState(false);

  const getSalary = (age: number) => {
    const baseSalaries = { high: 80000, medium: 55000, low: 40000 };
    const base = baseSalaries[careerPath];
    // Salary grows until 50, then plateaus
    const growthFactor = Math.min(age - 22, 28) * 0.025;
    return base * (1 + growthFactor);
  };

  const runSimulation = async () => {
    setIsSimulating(true);
    setCurrentAge(22);
    setPortfolioValue(0);
    setTimeline([]);
    setCurrentEvent(null);
    setSimulationComplete(false);

    let value = 0;
    const newTimeline: { age: number; value: number }[] = [];

    for (let age = 22; age <= 65; age++) {
      const salary = getSalary(age);
      const annualContribution = salary * (savingsRate / 100);
      
      // Apply investment return
      value = value * (1 + returnRate / 100) + annualContribution;

      // Check for life events
      const event = lifeEvents.find(e => e.age === age);
      if (event) {
        setCurrentEvent(event);
        
        if (typeof event.financialEffect === "number" && Math.abs(event.financialEffect) < 1) {
          // Percentage effect (market crash or boom)
          value = value * (1 + event.financialEffect);
        } else {
          // Absolute effect
          value = Math.max(0, value + event.financialEffect);
        }
        
        // Pause for animation
        await new Promise(r => setTimeout(r, 800));
      }

      newTimeline.push({ age, value: Math.round(value) });
      setTimeline([...newTimeline]);
      setCurrentAge(age);
      setPortfolioValue(Math.round(value));
      
      await new Promise(r => setTimeout(r, 100));
    }

    setIsSimulating(false);
    setSimulationComplete(true);
    setCurrentEvent(null);

    if (value >= 2000000) {
      toast.success("🎉 Excellent! You're a multi-millionaire retiree!");
    } else if (value >= 1000000) {
      toast.success("Great job! You've achieved millionaire status!");
    } else if (value >= 500000) {
      toast.info("Good progress! Consider increasing your savings rate.");
    } else {
      toast.warning("Room for improvement. Try higher savings or returns.");
    }
  };

  const reset = () => {
    setCurrentAge(22);
    setPortfolioValue(0);
    setTimeline([]);
    setCurrentEvent(null);
    setSimulationComplete(false);
  };

  const getCareerIcon = (path: string) => {
    switch (path) {
      case "high": return <Briefcase className="w-4 h-4" />;
      case "medium": return <User className="w-4 h-4" />;
      case "low": return <GraduationCap className="w-4 h-4" />;
    }
  };

  return (
    <Card className="p-6 space-y-6 bg-gradient-to-br from-background to-primary/5">
      <div>
        <h3 className="text-xl font-bold mb-1 flex items-center gap-2">
          <User className="w-5 h-5 text-primary" />
          Life Path Financial Simulator
        </h3>
        <p className="text-sm text-muted-foreground">
          Choose your career, savings rate, and returns - watch your financial life unfold
        </p>
      </div>

      {!isSimulating && !simulationComplete && (
        <div className="grid md:grid-cols-3 gap-4">
          {/* Career Path */}
          <Card className="p-4 bg-muted/30">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              Career Path
            </h4>
            <div className="space-y-2">
              {(["high", "medium", "low"] as const).map(path => (
                <Button
                  key={path}
                  variant={careerPath === path ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCareerPath(path)}
                  className="w-full justify-start"
                >
                  {getCareerIcon(path)}
                  <span className="ml-2 capitalize">{path} Income</span>
                  <span className="ml-auto text-xs">
                    ${path === "high" ? "80k" : path === "medium" ? "55k" : "40k"}+
                  </span>
                </Button>
              ))}
            </div>
          </Card>

          {/* Savings Rate */}
          <Card className="p-4 bg-muted/30">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <PiggyBank className="w-4 h-4" />
              Savings Rate
            </h4>
            <div className="space-y-4">
              <div className="text-center">
                <span className="text-3xl font-bold text-primary">{savingsRate}%</span>
                <p className="text-xs text-muted-foreground">of income saved</p>
              </div>
              <Slider
                value={[savingsRate]}
                onValueChange={([v]) => setSavingsRate(v)}
                min={5}
                max={40}
                step={1}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>5%</span>
                <span>20%</span>
                <span>40%</span>
              </div>
            </div>
          </Card>

          {/* Investment Return */}
          <Card className="p-4 bg-muted/30">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Expected Return
            </h4>
            <div className="space-y-4">
              <div className="text-center">
                <span className="text-3xl font-bold text-primary">{returnRate}%</span>
                <p className="text-xs text-muted-foreground">annual average</p>
              </div>
              <Slider
                value={[returnRate]}
                onValueChange={([v]) => setReturnRate(v)}
                min={4}
                max={12}
                step={0.5}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>4% (Bonds)</span>
                <span>7% (Balanced)</span>
                <span>12% (Aggressive)</span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {!isSimulating && !simulationComplete && (
        <Button onClick={runSimulation} size="lg" className="w-full">
          <Play className="w-4 h-4 mr-2" />
          Start Life Simulation
        </Button>
      )}

      {(isSimulating || simulationComplete) && (
        <div className="space-y-4">
          {/* Current Status */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-lg px-4 py-1">
                Age: {currentAge}
              </Badge>
              <span className="text-2xl font-bold text-primary">
                ${portfolioValue.toLocaleString()}
              </span>
            </div>
            {simulationComplete && (
              <Button variant="outline" onClick={reset}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            )}
          </div>

          {/* Life Event */}
          <AnimatePresence>
            {currentEvent && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
              >
                <Card className={`p-4 ${
                  currentEvent.impact === "positive" ? 'bg-success/10 border-success/30' :
                  currentEvent.impact === "negative" ? 'bg-destructive/10 border-destructive/30' :
                  'bg-warning/10 border-warning/30'
                }`}>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{currentEvent.event.split(' ')[0]}</span>
                    <div>
                      <h4 className="font-bold">{currentEvent.event.slice(2)}</h4>
                      <p className="text-sm text-muted-foreground">{currentEvent.message}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Progress Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Age 22</span>
              <span>Retirement at 65</span>
            </div>
            <Progress value={((currentAge - 22) / 43) * 100} className="h-2" />
          </div>

          {/* Chart */}
          {timeline.length > 0 && (
            <Card className="p-4 bg-muted/30">
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={timeline}>
                    <XAxis dataKey="age" tick={{ fontSize: 10 }} />
                    <YAxis 
                      tickFormatter={(v) => `$${(v/1000000).toFixed(1)}M`}
                      tick={{ fontSize: 10 }}
                    />
                    <Tooltip 
                      formatter={(value: number) => [`$${value.toLocaleString()}`, 'Portfolio']}
                      labelFormatter={(age) => `Age ${age}`}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          )}

          {/* Final Results */}
          {simulationComplete && (
            <Card className="p-4 bg-primary/10">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5 text-primary" />
                <h4 className="font-bold">Retirement Summary</h4>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-xs text-muted-foreground">Final Portfolio</div>
                  <div className="text-xl font-bold text-primary">${portfolioValue.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Monthly Income (4%)</div>
                  <div className="text-xl font-bold">${Math.round(portfolioValue * 0.04 / 12).toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Status</div>
                  <Badge className={portfolioValue >= 1000000 ? 'bg-success' : portfolioValue >= 500000 ? 'bg-warning' : 'bg-destructive'}>
                    {portfolioValue >= 1000000 ? '🎉 Millionaire' : portfolioValue >= 500000 ? '👍 On Track' : '⚠️ Needs Work'}
                  </Badge>
                </div>
              </div>
            </Card>
          )}
        </div>
      )}
    </Card>
  );
};

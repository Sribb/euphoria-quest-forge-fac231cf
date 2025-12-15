import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { 
  ArrowLeft, Wallet, PiggyBank, Home, Car, Coffee, 
  ShoppingBag, Smartphone, Heart, GraduationCap, TrendingUp,
  Check, X, Lightbulb, Target, Award, AlertTriangle, Zap
} from "lucide-react";
import { toast } from "sonner";

interface BudgetCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  amount: number;
  minAmount: number;
  maxAmount: number;
  type: "need" | "want" | "savings";
}

interface Scenario {
  id: string;
  title: string;
  description: string;
  impact: string;
  icon: React.ReactNode;
  incomeChange?: number;
  requiredActions: {
    categoryId: string;
    direction: "increase" | "decrease" | "maintain";
    minChange?: number;
    reason: string;
  }[];
  tips: string[];
  difficulty: "easy" | "medium" | "hard";
}

interface BudgetBalancerGameProps {
  onClose: () => void;
}

const INITIAL_BUDGET: BudgetCategory[] = [
  { id: "housing", name: "Housing/Rent", icon: <Home className="w-5 h-5" />, amount: 1500, minAmount: 800, maxAmount: 2500, type: "need" },
  { id: "utilities", name: "Utilities", icon: <Lightbulb className="w-5 h-5" />, amount: 200, minAmount: 100, maxAmount: 400, type: "need" },
  { id: "groceries", name: "Groceries", icon: <ShoppingBag className="w-5 h-5" />, amount: 400, minAmount: 200, maxAmount: 800, type: "need" },
  { id: "transport", name: "Transportation", icon: <Car className="w-5 h-5" />, amount: 300, minAmount: 50, maxAmount: 600, type: "need" },
  { id: "insurance", name: "Insurance", icon: <Heart className="w-5 h-5" />, amount: 250, minAmount: 150, maxAmount: 500, type: "need" },
  { id: "dining", name: "Dining Out", icon: <Coffee className="w-5 h-5" />, amount: 300, minAmount: 0, maxAmount: 600, type: "want" },
  { id: "entertainment", name: "Entertainment", icon: <Smartphone className="w-5 h-5" />, amount: 200, minAmount: 0, maxAmount: 500, type: "want" },
  { id: "shopping", name: "Shopping", icon: <ShoppingBag className="w-5 h-5" />, amount: 200, minAmount: 0, maxAmount: 500, type: "want" },
  { id: "emergency", name: "Emergency Fund", icon: <PiggyBank className="w-5 h-5" />, amount: 300, minAmount: 0, maxAmount: 1000, type: "savings" },
  { id: "investing", name: "Investments", icon: <TrendingUp className="w-5 h-5" />, amount: 350, minAmount: 0, maxAmount: 1500, type: "savings" },
];

const SCENARIOS: Scenario[] = [
  {
    id: "job-loss",
    title: "🚨 Job Loss",
    description: "You've been laid off unexpectedly. Your income drops to unemployment benefits while you search for a new job.",
    impact: "Income reduced by 60%",
    icon: <AlertTriangle className="w-6 h-6 text-destructive" />,
    incomeChange: -3000,
    requiredActions: [
      { categoryId: "dining", direction: "decrease", minChange: 200, reason: "Cut non-essential dining to survive on reduced income" },
      { categoryId: "entertainment", direction: "decrease", minChange: 150, reason: "Reduce entertainment spending during unemployment" },
      { categoryId: "shopping", direction: "decrease", minChange: 150, reason: "Pause non-essential purchases" },
      { categoryId: "emergency", direction: "decrease", reason: "May need to pause emergency savings temporarily" },
    ],
    tips: [
      "Cut wants drastically - dining, entertainment, shopping",
      "Don't touch emergency fund unless absolutely necessary",
      "Look for ways to reduce fixed costs (cheaper phone plan, etc.)",
      "Apply for unemployment benefits immediately"
    ],
    difficulty: "hard"
  },
  {
    id: "salary-raise",
    title: "🎉 20% Salary Raise!",
    description: "Congratulations! You've received a significant raise. How will you adjust your budget to avoid lifestyle creep?",
    impact: "Income increased by $1,000/month",
    icon: <Zap className="w-6 h-6 text-success" />,
    incomeChange: 1000,
    requiredActions: [
      { categoryId: "investing", direction: "increase", minChange: 400, reason: "Invest at least 40% of your raise" },
      { categoryId: "emergency", direction: "increase", minChange: 200, reason: "Boost emergency fund with extra income" },
    ],
    tips: [
      "Follow the 50/30/20 rule with new income",
      "Avoid lifestyle creep - don't increase wants proportionally",
      "Prioritize investments and savings with raises",
      "Consider increasing retirement contributions"
    ],
    difficulty: "easy"
  },
  {
    id: "medical-emergency",
    title: "🏥 Medical Emergency",
    description: "An unexpected surgery costs $8,000. Insurance covers half, but you owe $4,000 out of pocket.",
    impact: "Need to find $4,000 for medical bills",
    icon: <Heart className="w-6 h-6 text-destructive" />,
    incomeChange: 0,
    requiredActions: [
      { categoryId: "emergency", direction: "decrease", minChange: 300, reason: "This is exactly what emergency funds are for" },
      { categoryId: "dining", direction: "decrease", minChange: 200, reason: "Temporarily cut dining to rebuild savings" },
      { categoryId: "entertainment", direction: "decrease", minChange: 100, reason: "Reduce entertainment spending" },
    ],
    tips: [
      "Use emergency fund first - that's what it's for!",
      "Negotiate a payment plan if needed",
      "Cut wants temporarily to rebuild emergency fund",
      "Don't stop investing entirely, just reduce temporarily"
    ],
    difficulty: "medium"
  },
  {
    id: "new-baby",
    title: "👶 New Baby Arriving",
    description: "You're expecting a baby in 6 months! Childcare will cost $1,200/month and you need to prepare.",
    impact: "New expense: $1,200/month for childcare",
    icon: <Heart className="w-6 h-6 text-primary" />,
    incomeChange: 0,
    requiredActions: [
      { categoryId: "dining", direction: "decrease", minChange: 150, reason: "Reduce dining out to afford childcare" },
      { categoryId: "entertainment", direction: "decrease", minChange: 100, reason: "Less time for entertainment anyway!" },
      { categoryId: "shopping", direction: "decrease", minChange: 100, reason: "Prioritize baby needs over wants" },
      { categoryId: "emergency", direction: "increase", minChange: 100, reason: "Build buffer for unexpected baby expenses" },
    ],
    tips: [
      "Start adjusting budget 6 months before baby arrives",
      "Build up emergency fund for unexpected baby costs",
      "Look into FSA/dependent care benefits",
      "Cut wants, not savings - babies are expensive!"
    ],
    difficulty: "medium"
  },
  {
    id: "car-breakdown",
    title: "🚗 Car Needs Major Repair",
    description: "Your car needs a $2,500 repair. Without it, you can't get to work. You need to decide: repair, buy used, or go carless.",
    impact: "Need $2,500 for car repair",
    icon: <Car className="w-6 h-6 text-warning" />,
    incomeChange: 0,
    requiredActions: [
      { categoryId: "emergency", direction: "decrease", reason: "Use emergency fund for necessary transportation" },
      { categoryId: "transport", direction: "maintain", reason: "May need to increase if buying new car, or decrease if going carless" },
      { categoryId: "shopping", direction: "decrease", minChange: 100, reason: "Cut shopping to rebuild emergency fund" },
    ],
    tips: [
      "If repair is less than car value, usually worth fixing",
      "Consider if you can go car-free temporarily",
      "Use emergency fund - this is a real emergency",
      "Rebuild emergency fund ASAP after"
    ],
    difficulty: "easy"
  },
  {
    id: "rent-increase",
    title: "📈 Rent Going Up 15%",
    description: "Your landlord is raising rent by 15% ($225/month). You can move or absorb the cost.",
    impact: "Housing cost +$225/month",
    icon: <Home className="w-6 h-6 text-warning" />,
    incomeChange: 0,
    requiredActions: [
      { categoryId: "housing", direction: "increase", minChange: 225, reason: "Accepting higher rent" },
      { categoryId: "dining", direction: "decrease", minChange: 100, reason: "Offset rent increase by cutting dining" },
      { categoryId: "entertainment", direction: "decrease", minChange: 75, reason: "Reduce entertainment to balance budget" },
    ],
    tips: [
      "Calculate if moving costs less than rent increase",
      "Negotiate with landlord for smaller increase",
      "Cut wants to absorb fixed cost increases",
      "Consider getting a roommate"
    ],
    difficulty: "medium"
  },
  {
    id: "side-hustle",
    title: "💼 Side Hustle Takes Off",
    description: "Your side business is earning an extra $800/month! But it requires $200/month in expenses.",
    impact: "Net income +$600/month",
    icon: <Zap className="w-6 h-6 text-success" />,
    incomeChange: 600,
    requiredActions: [
      { categoryId: "investing", direction: "increase", minChange: 300, reason: "Invest majority of side income for compound growth" },
      { categoryId: "emergency", direction: "increase", minChange: 150, reason: "Side income is unstable - boost emergency fund" },
    ],
    tips: [
      "Side income is often variable - don't rely on it for needs",
      "Save/invest at least 50% of side income",
      "Set aside money for taxes (25-30%)",
      "Build 6-month emergency fund faster"
    ],
    difficulty: "easy"
  },
  {
    id: "inflation",
    title: "📊 High Inflation (8%)",
    description: "Groceries, gas, and utilities have all increased significantly. Your dollar doesn't go as far.",
    impact: "Everyday expenses up ~$300/month",
    icon: <TrendingUp className="w-6 h-6 text-destructive" />,
    incomeChange: 0,
    requiredActions: [
      { categoryId: "groceries", direction: "maintain", reason: "Try to optimize but food is essential" },
      { categoryId: "dining", direction: "decrease", minChange: 150, reason: "Cook at home more during high inflation" },
      { categoryId: "shopping", direction: "decrease", minChange: 100, reason: "Delay non-essential purchases" },
      { categoryId: "investing", direction: "maintain", reason: "Keep investing - stocks historically beat inflation" },
    ],
    tips: [
      "Buy store brands instead of name brands",
      "Cook at home more - restaurants inflate prices faster",
      "Don't stop investing - it's your inflation hedge",
      "Look for ways to increase income"
    ],
    difficulty: "hard"
  },
];

export const BudgetBalancerGame = ({ onClose }: BudgetBalancerGameProps) => {
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [budget, setBudget] = useState<BudgetCategory[]>(INITIAL_BUDGET.map(b => ({ ...b })));
  const [originalBudget] = useState<BudgetCategory[]>(INITIAL_BUDGET.map(b => ({ ...b })));
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<{ correct: string[]; incorrect: string[]; tips: string[] }>({ correct: [], incorrect: [], tips: [] });
  const [gameComplete, setGameComplete] = useState(false);
  const [baseIncome] = useState(5000);

  const currentScenario = SCENARIOS[currentScenarioIndex];
  const currentIncome = baseIncome + (currentScenario.incomeChange || 0);
  const totalSpending = budget.reduce((sum, c) => sum + c.amount, 0);
  const remaining = currentIncome - totalSpending;

  const needsTotal = budget.filter(c => c.type === "need").reduce((sum, c) => sum + c.amount, 0);
  const wantsTotal = budget.filter(c => c.type === "want").reduce((sum, c) => sum + c.amount, 0);
  const savingsTotal = budget.filter(c => c.type === "savings").reduce((sum, c) => sum + c.amount, 0);

  const updateCategory = (id: string, newAmount: number) => {
    setBudget(prev => 
      prev.map(c => c.id === id ? { ...c, amount: Math.max(c.minAmount, Math.min(c.maxAmount, newAmount)) } : c)
    );
  };

  const getChange = (categoryId: string): number => {
    const original = originalBudget.find(c => c.id === categoryId)?.amount || 0;
    const current = budget.find(c => c.id === categoryId)?.amount || 0;
    return current - original;
  };

  const submitBudget = () => {
    if (remaining < -100) {
      toast.error("Your budget is over! Reduce spending first.");
      return;
    }

    const correct: string[] = [];
    const incorrect: string[] = [];

    currentScenario.requiredActions.forEach(action => {
      const change = getChange(action.categoryId);
      const category = budget.find(c => c.id === action.categoryId);
      
      if (action.direction === "increase") {
        if (change >= (action.minChange || 50)) {
          correct.push(`✓ ${category?.name}: Increased correctly. ${action.reason}`);
        } else {
          incorrect.push(`✗ ${category?.name}: Should have increased more. ${action.reason}`);
        }
      } else if (action.direction === "decrease") {
        if (change <= -(action.minChange || 50)) {
          correct.push(`✓ ${category?.name}: Reduced correctly. ${action.reason}`);
        } else {
          incorrect.push(`✗ ${category?.name}: Should have reduced more. ${action.reason}`);
        }
      } else {
        if (Math.abs(change) <= 50) {
          correct.push(`✓ ${category?.name}: Maintained appropriately. ${action.reason}`);
        }
      }
    });

    // Bonus points for staying balanced
    if (remaining >= 0 && remaining <= 200) {
      correct.push("✓ Budget balanced perfectly!");
    }

    const points = correct.length * 100 - incorrect.length * 50;
    const difficultyBonus = currentScenario.difficulty === "hard" ? 150 : currentScenario.difficulty === "medium" ? 75 : 0;
    
    setScore(prev => prev + Math.max(0, points + difficultyBonus));
    setFeedback({ correct, incorrect, tips: currentScenario.tips });
    setShowResult(true);
  };

  const nextScenario = () => {
    if (currentScenarioIndex < SCENARIOS.length - 1) {
      setCurrentScenarioIndex(prev => prev + 1);
      setBudget(INITIAL_BUDGET.map(b => ({ ...b })));
      setShowResult(false);
      setFeedback({ correct: [], incorrect: [], tips: [] });
    } else {
      setGameComplete(true);
    }
  };

  const resetGame = () => {
    setCurrentScenarioIndex(0);
    setBudget(INITIAL_BUDGET.map(b => ({ ...b })));
    setScore(0);
    setShowResult(false);
    setFeedback({ correct: [], incorrect: [], tips: [] });
    setGameComplete(false);
  };

  const getCategoryColor = (type: string) => {
    switch (type) {
      case "need": return "border-l-primary";
      case "want": return "border-l-warning";
      case "savings": return "border-l-success";
      default: return "";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "bg-success/20 text-success";
      case "medium": return "bg-warning/20 text-warning";
      case "hard": return "bg-destructive/20 text-destructive";
      default: return "bg-muted text-muted-foreground";
    }
  };

  if (gameComplete) {
    const percentage = Math.round((score / (SCENARIOS.length * 300)) * 100);
    return (
      <div className="min-h-screen bg-background p-4">
        <Card className="max-w-2xl mx-auto p-8 text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-primary flex items-center justify-center">
            <Award className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold">All Scenarios Complete!</h1>
          <div className="text-5xl font-bold text-primary">{score} pts</div>
          <p className="text-muted-foreground">
            You handled {percentage}% of budget scenarios correctly
          </p>
          <div className="p-4 bg-muted rounded-lg text-left">
            <p className="font-semibold mb-2">Key Takeaways:</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Cut wants first, then optimize needs</li>
              <li>• Emergency fund is for real emergencies</li>
              <li>• Avoid lifestyle creep when income increases</li>
              <li>• Keep investing through tough times if possible</li>
            </ul>
          </div>
          <div className="flex gap-4 justify-center">
            <Button onClick={resetGame} size="lg">Play Again</Button>
            <Button variant="outline" onClick={onClose} size="lg">Back to Games</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={onClose} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Exit Game
        </Button>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="text-lg px-4 py-2">Score: {score}</Badge>
          <Badge variant="outline">Scenario {currentScenarioIndex + 1}/{SCENARIOS.length}</Badge>
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Scenario Prompt */}
        <Card className="p-6 border-2 border-primary/20 bg-gradient-accent">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              {currentScenario.icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-2xl font-bold">{currentScenario.title}</h2>
                <Badge className={getDifficultyColor(currentScenario.difficulty)}>
                  {currentScenario.difficulty}
                </Badge>
              </div>
              <p className="text-muted-foreground mb-3">{currentScenario.description}</p>
              <Badge variant="secondary" className="text-sm">
                {currentScenario.impact}
              </Badge>
            </div>
          </div>
        </Card>

        {/* Income & Budget Overview */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="p-4 text-center">
            <div className="text-sm text-muted-foreground">Monthly Income</div>
            <div className={`text-2xl font-bold ${currentScenario.incomeChange && currentScenario.incomeChange < 0 ? 'text-destructive' : currentScenario.incomeChange && currentScenario.incomeChange > 0 ? 'text-success' : ''}`}>
              ${currentIncome.toLocaleString()}
            </div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-sm text-muted-foreground">Needs (50%)</div>
            <div className="text-2xl font-bold text-primary">${needsTotal.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">{((needsTotal/currentIncome)*100).toFixed(0)}%</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-sm text-muted-foreground">Wants (30%)</div>
            <div className="text-2xl font-bold text-warning">${wantsTotal.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">{((wantsTotal/currentIncome)*100).toFixed(0)}%</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-sm text-muted-foreground">Savings (20%)</div>
            <div className="text-2xl font-bold text-success">${savingsTotal.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">{((savingsTotal/currentIncome)*100).toFixed(0)}%</div>
          </Card>
        </div>

        {/* Remaining Budget Bar */}
        <Card className={`p-4 ${remaining < 0 ? 'border-destructive bg-destructive/5' : 'border-success bg-success/5'}`}>
          <div className="flex justify-between items-center">
            <span className="font-semibold">Budget Balance</span>
            <span className={`text-xl font-bold ${remaining >= 0 ? 'text-success' : 'text-destructive'}`}>
              {remaining >= 0 ? '+' : ''}${remaining.toLocaleString()}
            </span>
          </div>
          <Progress value={Math.min(100, (totalSpending / currentIncome) * 100)} className="h-2 mt-2" />
        </Card>

        {!showResult ? (
          <>
            {/* Budget Categories */}
            <div className="grid md:grid-cols-2 gap-4">
              {budget.map(category => {
                const change = getChange(category.id);
                return (
                  <Card key={category.id} className={`p-4 border-l-4 ${getCategoryColor(category.type)}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {category.icon}
                        <span className="font-semibold">{category.name}</span>
                      </div>
                      {change !== 0 && (
                        <Badge variant={change > 0 ? "default" : "secondary"} className={change > 0 ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"}>
                          {change > 0 ? '+' : ''}{change}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-bold w-24">${category.amount}</span>
                      <Slider
                        value={[category.amount]}
                        onValueChange={([val]) => updateCategory(category.id, val)}
                        min={category.minAmount}
                        max={category.maxAmount}
                        step={25}
                        className="flex-1"
                      />
                    </div>
                  </Card>
                );
              })}
            </div>

            <Button onClick={submitBudget} size="lg" className="w-full" disabled={remaining < -100}>
              {remaining < -100 ? "Budget Over Limit!" : "Submit Budget Adjustments"}
            </Button>
          </>
        ) : (
          <Card className="p-6 space-y-4">
            <h3 className="text-xl font-bold">Budget Review</h3>
            
            {feedback.correct.length > 0 && (
              <div className="p-4 bg-success/10 rounded-lg space-y-2">
                <div className="font-semibold text-success flex items-center gap-2">
                  <Check className="w-5 h-5" /> What You Did Right
                </div>
                {feedback.correct.map((item, idx) => (
                  <p key={idx} className="text-sm text-muted-foreground">{item}</p>
                ))}
              </div>
            )}

            {feedback.incorrect.length > 0 && (
              <div className="p-4 bg-destructive/10 rounded-lg space-y-2">
                <div className="font-semibold text-destructive flex items-center gap-2">
                  <X className="w-5 h-5" /> Areas to Improve
                </div>
                {feedback.incorrect.map((item, idx) => (
                  <p key={idx} className="text-sm text-muted-foreground">{item}</p>
                ))}
              </div>
            )}

            <div className="p-4 bg-muted rounded-lg">
              <div className="font-semibold mb-2 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-warning" /> Pro Tips for This Scenario
              </div>
              <ul className="text-sm text-muted-foreground space-y-1">
                {feedback.tips.map((tip, idx) => (
                  <li key={idx}>• {tip}</li>
                ))}
              </ul>
            </div>

            <Button onClick={nextScenario} size="lg" className="w-full">
              {currentScenarioIndex < SCENARIOS.length - 1 ? "Next Scenario" : "See Final Results"}
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { 
  ArrowLeft, Wallet, PiggyBank, Home, Car, Coffee, 
  ShoppingBag, Smartphone, Heart, GraduationCap, TrendingUp,
  Check, X, Lightbulb, Target, Award, AlertTriangle, Zap,
  HelpCircle, ChevronRight, CreditCard, Briefcase, Users
} from "lucide-react";
import { toast } from "sonner";

interface BudgetCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  amount: number;
  minAmount: number;
  maxAmount: number;
  type: "need" | "want" | "savings" | "debt";
  isEssential?: boolean;
  maxReduction?: number; // Max percentage you can reduce essentials by
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
  { id: "housing", name: "Housing/Rent", icon: <Home className="w-5 h-5" />, amount: 1100, minAmount: 950, maxAmount: 1400, type: "need", isEssential: true, maxReduction: 15 },
  { id: "utilities", name: "Utilities", icon: <Lightbulb className="w-5 h-5" />, amount: 180, minAmount: 140, maxAmount: 250, type: "need", isEssential: true, maxReduction: 20 },
  { id: "groceries", name: "Groceries", icon: <ShoppingBag className="w-5 h-5" />, amount: 500, minAmount: 400, maxAmount: 700, type: "need", isEssential: true, maxReduction: 25 },
  { id: "transport", name: "Transportation", icon: <Car className="w-5 h-5" />, amount: 350, minAmount: 150, maxAmount: 500, type: "need", isEssential: true, maxReduction: 40 },
  { id: "insurance", name: "Insurance", icon: <Heart className="w-5 h-5" />, amount: 220, minAmount: 180, maxAmount: 300, type: "need", isEssential: true, maxReduction: 18 },
  { id: "student-loan", name: "Student Loan", icon: <GraduationCap className="w-5 h-5" />, amount: 150, minAmount: 100, maxAmount: 400, type: "debt" },
  { id: "credit-card", name: "Credit Card Debt", icon: <CreditCard className="w-5 h-5" />, amount: 50, minAmount: 25, maxAmount: 300, type: "debt" },
  { id: "dining", name: "Dining Out", icon: <Coffee className="w-5 h-5" />, amount: 300, minAmount: 0, maxAmount: 500, type: "want" },
  { id: "entertainment", name: "Entertainment", icon: <Smartphone className="w-5 h-5" />, amount: 200, minAmount: 0, maxAmount: 400, type: "want" },
  { id: "shopping", name: "Shopping", icon: <ShoppingBag className="w-5 h-5" />, amount: 180, minAmount: 0, maxAmount: 400, type: "want" },
  { id: "emergency", name: "Emergency Fund", icon: <PiggyBank className="w-5 h-5" />, amount: 400, minAmount: 0, maxAmount: 1000, type: "savings" },
  { id: "investing", name: "Investments", icon: <TrendingUp className="w-5 h-5" />, amount: 350, minAmount: 0, maxAmount: 1200, type: "savings" },
];

const SCENARIOS: Scenario[] = [
  {
    id: "job-loss",
    title: "🚨 Job Loss",
    description: "You've been laid off unexpectedly. Your income drops to unemployment benefits while you search for a new job.",
    impact: "Income reduced by 60%",
    icon: <AlertTriangle className="w-6 h-6 text-destructive" />,
    incomeChange: -2400,
    requiredActions: [
      { categoryId: "dining", direction: "decrease", minChange: 180, reason: "Cut non-essential dining to survive on reduced income" },
      { categoryId: "entertainment", direction: "decrease", minChange: 100, reason: "Reduce entertainment spending during unemployment" },
      { categoryId: "shopping", direction: "decrease", minChange: 80, reason: "Pause non-essential purchases" },
      { categoryId: "credit-card", direction: "decrease", reason: "Pay minimum on credit card to preserve cash" },
    ],
    tips: [
      "Cut wants drastically - dining, entertainment, shopping",
      "Pay only minimums on debt to preserve cash flow",
      "Don't touch emergency fund unless absolutely necessary",
      "Apply for unemployment benefits immediately"
    ],
    difficulty: "hard"
  },
  {
    id: "salary-raise",
    title: "🎉 20% Salary Raise!",
    description: "Congratulations! You've received a significant raise. How will you adjust your budget to avoid lifestyle creep?",
    impact: "Income increased by $800/month",
    icon: <Zap className="w-6 h-6 text-success" />,
    incomeChange: 800,
    requiredActions: [
      { categoryId: "investing", direction: "increase", minChange: 300, reason: "Invest at least 40% of your raise" },
      { categoryId: "emergency", direction: "increase", minChange: 150, reason: "Boost emergency fund with extra income" },
      { categoryId: "student-loan", direction: "increase", minChange: 100, reason: "Accelerate student loan payoff" },
    ],
    tips: [
      "Follow the 50/30/20 rule with new income",
      "Avoid lifestyle creep - don't increase wants proportionally",
      "Prioritize paying off high-interest debt first",
      "Consider increasing retirement contributions"
    ],
    difficulty: "easy"
  },
  {
    id: "student-loan-payoff",
    title: "🎓 Student Loan Payoff Push",
    description: "Your student loan interest rate increased to 7%. Financial advisors suggest paying it off aggressively before it grows.",
    impact: "Need extra $200/month for loans",
    icon: <GraduationCap className="w-6 h-6 text-primary" />,
    incomeChange: 0,
    requiredActions: [
      { categoryId: "student-loan", direction: "increase", minChange: 200, reason: "Increase loan payments to pay off faster" },
      { categoryId: "dining", direction: "decrease", minChange: 100, reason: "Cut dining to fund extra loan payments" },
      { categoryId: "entertainment", direction: "decrease", minChange: 50, reason: "Reduce entertainment to accelerate payoff" },
    ],
    tips: [
      "High-interest debt should be priority over investing",
      "Refinancing could lower your interest rate",
      "Every extra dollar toward principal saves interest",
      "Consider the debt avalanche method"
    ],
    difficulty: "medium"
  },
  {
    id: "getting-married",
    title: "💒 Getting Married",
    description: "Wedding costs average $30,000. You have 18 months to save. Your partner will contribute half, but you need $15,000.",
    impact: "Need to save $850/month for wedding",
    icon: <Heart className="w-6 h-6 text-primary" />,
    incomeChange: 0,
    requiredActions: [
      { categoryId: "emergency", direction: "increase", minChange: 300, reason: "Redirect savings toward wedding fund" },
      { categoryId: "dining", direction: "decrease", minChange: 150, reason: "Cook at home more to save for wedding" },
      { categoryId: "shopping", direction: "decrease", minChange: 100, reason: "Pause shopping to fund wedding" },
      { categoryId: "entertainment", direction: "decrease", minChange: 100, reason: "Free date nights while saving for the big day" },
    ],
    tips: [
      "Set a realistic wedding budget and stick to it",
      "Consider what's truly important vs nice-to-have",
      "Don't go into debt for a wedding",
      "Your partner's financial habits matter - align your budgets"
    ],
    difficulty: "medium"
  },
  {
    id: "starting-business",
    title: "🚀 Starting a Business",
    description: "You're launching a side business that could replace your income. Initial investment needed: $5,000 over 6 months.",
    impact: "Need $850/month for business startup",
    icon: <Briefcase className="w-6 h-6 text-primary" />,
    incomeChange: 0,
    requiredActions: [
      { categoryId: "investing", direction: "decrease", minChange: 150, reason: "Temporarily redirect investments to business" },
      { categoryId: "dining", direction: "decrease", minChange: 200, reason: "Cut dining out significantly" },
      { categoryId: "entertainment", direction: "decrease", minChange: 100, reason: "Reduce entertainment spending" },
      { categoryId: "shopping", direction: "decrease", minChange: 100, reason: "Pause discretionary shopping" },
    ],
    tips: [
      "Don't quit your job until business proves viable",
      "Keep emergency fund intact - business is risky",
      "Set a budget limit for the business investment",
      "Have a runway of 6+ months expenses saved"
    ],
    difficulty: "hard"
  },
  {
    id: "medical-emergency",
    title: "🏥 Medical Emergency",
    description: "An unexpected surgery costs $8,000. Insurance covers half, but you owe $4,000 out of pocket.",
    impact: "Need to find $4,000 for medical bills",
    icon: <Heart className="w-6 h-6 text-destructive" />,
    incomeChange: 0,
    requiredActions: [
      { categoryId: "emergency", direction: "decrease", minChange: 200, reason: "This is exactly what emergency funds are for" },
      { categoryId: "dining", direction: "decrease", minChange: 150, reason: "Temporarily cut dining to rebuild savings" },
      { categoryId: "entertainment", direction: "decrease", minChange: 80, reason: "Reduce entertainment spending" },
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
    icon: <Users className="w-6 h-6 text-primary" />,
    incomeChange: 0,
    requiredActions: [
      { categoryId: "dining", direction: "decrease", minChange: 150, reason: "Reduce dining out to afford childcare" },
      { categoryId: "entertainment", direction: "decrease", minChange: 100, reason: "Less time for entertainment anyway!" },
      { categoryId: "shopping", direction: "decrease", minChange: 80, reason: "Prioritize baby needs over wants" },
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
    id: "credit-card-crisis",
    title: "💳 Credit Card Interest Spike",
    description: "Your credit card APR jumped to 29.99%. With $3,000 balance, you're losing $75/month to interest alone.",
    impact: "Must pay off $3,000 ASAP",
    icon: <CreditCard className="w-6 h-6 text-destructive" />,
    incomeChange: 0,
    requiredActions: [
      { categoryId: "credit-card", direction: "increase", minChange: 200, reason: "Aggressively pay down high-interest debt" },
      { categoryId: "dining", direction: "decrease", minChange: 150, reason: "Every dollar goes to credit card payoff" },
      { categoryId: "shopping", direction: "decrease", minChange: 100, reason: "Stop all discretionary spending" },
      { categoryId: "investing", direction: "decrease", minChange: 100, reason: "Pause investing until 29% debt is gone" },
    ],
    tips: [
      "29% APR debt is an emergency - pay it off first",
      "Pause investing to kill high-interest debt",
      "Consider a 0% balance transfer card",
      "Cut all wants until the balance is $0"
    ],
    difficulty: "hard"
  },
  {
    id: "rent-increase",
    title: "📈 Rent Going Up 15%",
    description: "Your landlord is raising rent by 15% ($210/month). You can move or absorb the cost.",
    impact: "Housing cost +$210/month",
    icon: <Home className="w-6 h-6 text-warning" />,
    incomeChange: 0,
    requiredActions: [
      { categoryId: "dining", direction: "decrease", minChange: 100, reason: "Offset rent increase by cutting dining" },
      { categoryId: "entertainment", direction: "decrease", minChange: 60, reason: "Reduce entertainment to balance budget" },
      { categoryId: "shopping", direction: "decrease", minChange: 50, reason: "Cut shopping to cover rent increase" },
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
    id: "inflation",
    title: "📊 High Inflation (8%)",
    description: "Groceries, gas, and utilities have all increased significantly. Your dollar doesn't go as far.",
    impact: "Everyday expenses up ~$250/month",
    icon: <TrendingUp className="w-6 h-6 text-destructive" />,
    incomeChange: 0,
    requiredActions: [
      { categoryId: "dining", direction: "decrease", minChange: 150, reason: "Cook at home more during high inflation" },
      { categoryId: "shopping", direction: "decrease", minChange: 80, reason: "Delay non-essential purchases" },
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

const TUTORIAL_STEPS = [
  {
    title: "Welcome to Budget Balancer! 💰",
    content: "Life throws curveballs, and your budget needs to adapt. In this game, you'll face real-world scenarios and learn to adjust your spending wisely.",
    highlight: null,
  },
  {
    title: "Needs vs Wants vs Savings",
    content: "Your budget has three types:\n• Needs (blue) - Essential expenses like rent and groceries\n• Wants (orange) - Nice-to-haves like dining out\n• Savings (green) - Your future wealth",
    highlight: "categories",
  },
  {
    title: "Debt Payments Matter",
    content: "Student loans and credit cards have minimum payments. High-interest debt (like credit cards) should often be prioritized over investing!",
    highlight: "debt",
  },
  {
    title: "Essentials Are Hard to Cut",
    content: "You can't just stop paying rent or eating! Essential expenses (🔒) can only be reduced by 15-25%. Focus on cutting wants first.",
    highlight: "essentials",
  },
  {
    title: "Balance Your Budget",
    content: "After each scenario, adjust your sliders until the Budget Balance shows $0 or positive. Going negative means you're spending more than you earn!",
    highlight: "balance",
  },
  {
    title: "Ready to Play!",
    content: "You'll face 10 scenarios. Cut wants first, protect your emergency fund, and remember: every dollar has a job. Good luck!",
    highlight: null,
  },
];

export const BudgetBalancerGame = ({ onClose }: BudgetBalancerGameProps) => {
  const [showTutorial, setShowTutorial] = useState(true);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [budget, setBudget] = useState<BudgetCategory[]>(INITIAL_BUDGET.map(b => ({ ...b })));
  const [originalBudget] = useState<BudgetCategory[]>(INITIAL_BUDGET.map(b => ({ ...b })));
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<{ correct: string[]; incorrect: string[]; tips: string[] }>({ correct: [], incorrect: [], tips: [] });
  const [gameComplete, setGameComplete] = useState(false);
  const [baseIncome] = useState(4750);

  const currentScenario = SCENARIOS[currentScenarioIndex];
  const currentIncome = baseIncome + (currentScenario.incomeChange || 0);
  const totalSpending = budget.reduce((sum, c) => sum + c.amount, 0);
  const remaining = currentIncome - totalSpending;

  const needsTotal = budget.filter(c => c.type === "need").reduce((sum, c) => sum + c.amount, 0);
  const wantsTotal = budget.filter(c => c.type === "want").reduce((sum, c) => sum + c.amount, 0);
  const savingsTotal = budget.filter(c => c.type === "savings").reduce((sum, c) => sum + c.amount, 0);
  const debtTotal = budget.filter(c => c.type === "debt").reduce((sum, c) => sum + c.amount, 0);

  const updateCategory = (id: string, newAmount: number) => {
    setBudget(prev => 
      prev.map(c => {
        if (c.id !== id) return c;
        
        // For essential items, limit how much they can be reduced
        if (c.isEssential && c.maxReduction) {
          const originalAmount = originalBudget.find(ob => ob.id === id)?.amount || c.amount;
          const minAllowed = Math.round(originalAmount * (1 - c.maxReduction / 100));
          newAmount = Math.max(minAllowed, newAmount);
        }
        
        return { ...c, amount: Math.max(c.minAmount, Math.min(c.maxAmount, newAmount)) };
      })
    );
  };

  const getChange = (categoryId: string): number => {
    const original = originalBudget.find(c => c.id === categoryId)?.amount || 0;
    const current = budget.find(c => c.id === categoryId)?.amount || 0;
    return current - original;
  };

  const submitBudget = () => {
    if (remaining < -50) {
      toast.error("Your budget is over! Reduce spending to balance it.");
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

    if (remaining >= 0 && remaining <= 100) {
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
    setShowTutorial(false);
  };

  const getCategoryColor = (type: string) => {
    switch (type) {
      case "need": return "border-l-primary";
      case "want": return "border-l-warning";
      case "savings": return "border-l-success";
      case "debt": return "border-l-destructive";
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

  // Tutorial Mode
  if (showTutorial) {
    const step = TUTORIAL_STEPS[tutorialStep];
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <Card className="max-w-lg w-full p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <HelpCircle className="w-6 h-6 text-primary" />
            </div>
            <div>
              <Badge variant="outline" className="mb-1">Step {tutorialStep + 1}/{TUTORIAL_STEPS.length}</Badge>
              <h2 className="text-xl font-bold">{step.title}</h2>
            </div>
          </div>
          
          <p className="text-muted-foreground whitespace-pre-line">{step.content}</p>
          
          {step.highlight === "categories" && (
            <div className="grid grid-cols-3 gap-2 text-center text-sm">
              <div className="p-3 bg-primary/10 rounded-lg border-l-4 border-l-primary">
                <span className="font-semibold">Needs</span>
                <p className="text-xs text-muted-foreground">50%</p>
              </div>
              <div className="p-3 bg-warning/10 rounded-lg border-l-4 border-l-warning">
                <span className="font-semibold">Wants</span>
                <p className="text-xs text-muted-foreground">30%</p>
              </div>
              <div className="p-3 bg-success/10 rounded-lg border-l-4 border-l-success">
                <span className="font-semibold">Savings</span>
                <p className="text-xs text-muted-foreground">20%</p>
              </div>
            </div>
          )}
          
          {step.highlight === "debt" && (
            <div className="p-4 bg-destructive/10 rounded-lg border-l-4 border-l-destructive">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="w-5 h-5 text-destructive" />
                <span className="font-semibold">Debt Payments</span>
              </div>
              <p className="text-sm text-muted-foreground">
                29% credit card APR &gt; 7% investment returns. Pay off high-interest debt first!
              </p>
            </div>
          )}
          
          {step.highlight === "essentials" && (
            <div className="p-4 bg-muted rounded-lg">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>🔒 Rent</span>
                  <span className="text-muted-foreground">Max cut: 15%</span>
                </div>
                <div className="flex justify-between">
                  <span>🔒 Groceries</span>
                  <span className="text-muted-foreground">Max cut: 25%</span>
                </div>
                <div className="flex justify-between">
                  <span>🍕 Dining Out</span>
                  <span className="text-success">Can cut: 100%</span>
                </div>
              </div>
            </div>
          )}
          
          {step.highlight === "balance" && (
            <div className="p-4 bg-success/10 rounded-lg border border-success/20">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Budget Balance</span>
                <span className="text-success font-bold">+$0</span>
              </div>
              <Progress value={100} className="h-2 mt-2" />
            </div>
          )}

          <div className="flex justify-between">
            {tutorialStep > 0 ? (
              <Button variant="outline" onClick={() => setTutorialStep(prev => prev - 1)}>
                Back
              </Button>
            ) : (
              <Button variant="ghost" onClick={() => setShowTutorial(false)}>
                Skip Tutorial
              </Button>
            )}
            
            {tutorialStep < TUTORIAL_STEPS.length - 1 ? (
              <Button onClick={() => setTutorialStep(prev => prev + 1)} className="gap-2">
                Next <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button onClick={() => setShowTutorial(false)} className="gap-2">
                Start Playing! <Zap className="w-4 h-4" />
              </Button>
            )}
          </div>
        </Card>
      </div>
    );
  }

  if (gameComplete) {
    const percentage = Math.round((score / (SCENARIOS.length * 350)) * 100);
    return (
      <div className="min-h-screen bg-background p-4">
        <Card className="max-w-2xl mx-auto p-8 text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-primary flex items-center justify-center">
            <Award className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold">All Scenarios Complete!</h1>
          <div className="text-5xl font-bold text-primary">{score} pts</div>
          <p className="text-muted-foreground">
            You handled {Math.min(100, percentage)}% of budget scenarios correctly
          </p>
          <div className="p-4 bg-muted rounded-lg text-left">
            <p className="font-semibold mb-2">Key Takeaways:</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Cut wants first, essentials have limits</li>
              <li>• High-interest debt beats investing returns</li>
              <li>• Emergency fund is for real emergencies</li>
              <li>• Avoid lifestyle creep when income increases</li>
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
          <Button variant="ghost" size="sm" onClick={() => { setShowTutorial(true); setTutorialStep(0); }}>
            <HelpCircle className="w-4 h-4 mr-1" /> Tutorial
          </Button>
          <Badge variant="outline" className="text-lg px-4 py-2">Score: {score}</Badge>
          <Badge variant="outline">Scenario {currentScenarioIndex + 1}/{SCENARIOS.length}</Badge>
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Scenario Prompt */}
        <Card className="p-6 border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
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
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <Card className="p-3 text-center">
            <div className="text-xs text-muted-foreground">Monthly Income</div>
            <div className={`text-xl font-bold ${currentScenario.incomeChange && currentScenario.incomeChange < 0 ? 'text-destructive' : currentScenario.incomeChange && currentScenario.incomeChange > 0 ? 'text-success' : ''}`}>
              ${currentIncome.toLocaleString()}
            </div>
          </Card>
          <Card className="p-3 text-center border-l-4 border-l-primary">
            <div className="text-xs text-muted-foreground">Needs</div>
            <div className="text-xl font-bold text-primary">${needsTotal.toLocaleString()}</div>
          </Card>
          <Card className="p-3 text-center border-l-4 border-l-warning">
            <div className="text-xs text-muted-foreground">Wants</div>
            <div className="text-xl font-bold text-warning">${wantsTotal.toLocaleString()}</div>
          </Card>
          <Card className="p-3 text-center border-l-4 border-l-destructive">
            <div className="text-xs text-muted-foreground">Debt</div>
            <div className="text-xl font-bold text-destructive">${debtTotal.toLocaleString()}</div>
          </Card>
          <Card className="p-3 text-center border-l-4 border-l-success">
            <div className="text-xs text-muted-foreground">Savings</div>
            <div className="text-xl font-bold text-success">${savingsTotal.toLocaleString()}</div>
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
          {remaining < 0 && (
            <p className="text-xs text-destructive mt-1">⚠️ You're spending more than you earn! Cut expenses.</p>
          )}
        </Card>

        {!showResult ? (
          <>
            {/* Budget Categories */}
            <div className="grid md:grid-cols-2 gap-3">
              {budget.map(category => {
                const change = getChange(category.id);
                const original = originalBudget.find(c => c.id === category.id);
                
                return (
                  <Card key={category.id} className={`p-4 border-l-4 ${getCategoryColor(category.type)}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {category.icon}
                        <span className="font-semibold">{category.name}</span>
                        {category.isEssential && (
                          <span className="text-xs text-muted-foreground" title="Essential - limited reduction">🔒</span>
                        )}
                      </div>
                      {change !== 0 && (
                        <Badge variant={change > 0 ? "default" : "secondary"} className={change > 0 ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"}>
                          {change > 0 ? '+' : ''}{change}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xl font-bold w-20">${category.amount}</span>
                      <Slider
                        value={[category.amount]}
                        onValueChange={([val]) => updateCategory(category.id, val)}
                        min={category.minAmount}
                        max={category.maxAmount}
                        step={10}
                        className="flex-1"
                      />
                    </div>
                    {category.isEssential && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Min: ${category.minAmount} (can reduce max {category.maxReduction}%)
                      </p>
                    )}
                  </Card>
                );
              })}
            </div>

            <Button onClick={submitBudget} size="lg" className="w-full" disabled={remaining < -50}>
              {remaining < -50 ? "Budget Over Limit! Reduce Spending" : "Submit Budget Adjustments"}
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

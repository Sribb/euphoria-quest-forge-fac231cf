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
  HelpCircle, ChevronRight, CreditCard, Briefcase, Users,
  ChevronDown, ChevronUp, Flame, Wifi, Dumbbell, Music
} from "lucide-react";
import { toast } from "sonner";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface BudgetCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  amount: number;
  minAmount: number;
  maxAmount: number;
  type: "need" | "want" | "savings" | "debt";
  group: "essentials" | "lifestyle" | "debt" | "savings";
  isEssential?: boolean;
  maxReduction?: number;
}

interface Scenario {
  id: string;
  title: string;
  description: string;
  impact: string;
  icon: React.ReactNode;
  incomeChange?: number;
  debtChange?: { categoryId: string; amount: number }[];
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
  // Essentials (Housing & Utilities)
  { id: "housing", name: "Housing/Rent", icon: <Home className="w-5 h-5" />, amount: 1200, minAmount: 1000, maxAmount: 1600, type: "need", group: "essentials", isEssential: true, maxReduction: 15 },
  { id: "utilities", name: "Utilities", icon: <Lightbulb className="w-5 h-5" />, amount: 150, minAmount: 100, maxAmount: 250, type: "need", group: "essentials", isEssential: true, maxReduction: 20 },
  { id: "internet", name: "Internet & Phone", icon: <Wifi className="w-5 h-5" />, amount: 120, minAmount: 60, maxAmount: 200, type: "need", group: "essentials", isEssential: true, maxReduction: 40 },
  { id: "groceries", name: "Groceries", icon: <ShoppingBag className="w-5 h-5" />, amount: 450, minAmount: 300, maxAmount: 700, type: "need", group: "essentials", isEssential: true, maxReduction: 25 },
  { id: "transport", name: "Transportation", icon: <Car className="w-5 h-5" />, amount: 300, minAmount: 100, maxAmount: 500, type: "need", group: "essentials", isEssential: true, maxReduction: 40 },
  { id: "insurance", name: "Insurance", icon: <Heart className="w-5 h-5" />, amount: 200, minAmount: 150, maxAmount: 350, type: "need", group: "essentials", isEssential: true, maxReduction: 18 },
  
  // Lifestyle (Wants)
  { id: "dining", name: "Dining Out", icon: <Coffee className="w-5 h-5" />, amount: 250, minAmount: 0, maxAmount: 500, type: "want", group: "lifestyle" },
  { id: "entertainment", name: "Entertainment", icon: <Smartphone className="w-5 h-5" />, amount: 150, minAmount: 0, maxAmount: 400, type: "want", group: "lifestyle" },
  { id: "subscriptions", name: "Subscriptions", icon: <Music className="w-5 h-5" />, amount: 80, minAmount: 0, maxAmount: 200, type: "want", group: "lifestyle" },
  { id: "shopping", name: "Shopping", icon: <ShoppingBag className="w-5 h-5" />, amount: 150, minAmount: 0, maxAmount: 400, type: "want", group: "lifestyle" },
  { id: "fitness", name: "Gym & Fitness", icon: <Dumbbell className="w-5 h-5" />, amount: 60, minAmount: 0, maxAmount: 150, type: "want", group: "lifestyle" },
  
  // Debt
  { id: "student-loan", name: "Student Loan", icon: <GraduationCap className="w-5 h-5" />, amount: 100, minAmount: 50, maxAmount: 400, type: "debt", group: "debt" },
  { id: "credit-card", name: "Credit Card", icon: <CreditCard className="w-5 h-5" />, amount: 50, minAmount: 25, maxAmount: 300, type: "debt", group: "debt" },
  
  // Savings & Investments
  { id: "emergency", name: "Emergency Fund", icon: <PiggyBank className="w-5 h-5" />, amount: 300, minAmount: 0, maxAmount: 1000, type: "savings", group: "savings" },
  { id: "investing", name: "Investments", icon: <TrendingUp className="w-5 h-5" />, amount: 250, minAmount: 0, maxAmount: 1200, type: "savings", group: "savings" },
];

const CATEGORY_GROUPS = {
  essentials: {
    label: "🏠 Essentials",
    description: "Housing, utilities, food, transport",
    color: "primary",
    bgColor: "bg-primary/5",
    borderColor: "border-l-primary",
  },
  lifestyle: {
    label: "🎯 Lifestyle",
    description: "Dining, entertainment, subscriptions",
    color: "warning",
    bgColor: "bg-warning/5",
    borderColor: "border-l-warning",
  },
  debt: {
    label: "💳 Debt Payments",
    description: "Loans and credit cards",
    color: "destructive",
    bgColor: "bg-destructive/5",
    borderColor: "border-l-destructive",
  },
  savings: {
    label: "💰 Savings & Investing",
    description: "Emergency fund, investments",
    color: "success",
    bgColor: "bg-success/5",
    borderColor: "border-l-success",
  },
};

const SCENARIOS: Scenario[] = [
  {
    id: "salary-raise",
    title: "🎉 15% Salary Raise!",
    description: "Congratulations! You've received a raise. How will you use the extra money wisely?",
    impact: "Income increased by $600/month",
    icon: <Zap className="w-6 h-6 text-success" />,
    incomeChange: 600,
    requiredActions: [
      { categoryId: "investing", direction: "increase", minChange: 200, reason: "Invest at least 30% of your raise" },
      { categoryId: "emergency", direction: "increase", minChange: 100, reason: "Boost emergency fund" },
    ],
    tips: [
      "Avoid lifestyle creep - don't increase wants proportionally",
      "Prioritize investing and savings with extra income",
      "Consider paying off debt faster"
    ],
    difficulty: "easy"
  },
  {
    id: "car-repair",
    title: "🚗 Unexpected Car Repair",
    description: "Your car broke down and needs $1,500 in repairs. You put it on your credit card.",
    impact: "Credit card debt +$150/month for 10 months",
    icon: <AlertTriangle className="w-6 h-6 text-destructive" />,
    incomeChange: 0,
    debtChange: [{ categoryId: "credit-card", amount: 150 }],
    requiredActions: [
      { categoryId: "credit-card", direction: "increase", minChange: 100, reason: "Pay off car repair debt faster" },
      { categoryId: "dining", direction: "decrease", minChange: 80, reason: "Cut dining to pay off debt" },
    ],
    tips: [
      "Pay more than the minimum to avoid interest",
      "Cut wants temporarily to clear debt faster",
      "This is why emergency funds matter!"
    ],
    difficulty: "medium"
  },
  {
    id: "student-loan-pause",
    title: "📚 Student Loan Pause Ends",
    description: "Your student loan payment pause has ended. Payments resume at a higher rate.",
    impact: "Student loan +$100/month",
    icon: <GraduationCap className="w-6 h-6 text-destructive" />,
    incomeChange: 0,
    debtChange: [{ categoryId: "student-loan", amount: 100 }],
    requiredActions: [
      { categoryId: "student-loan", direction: "increase", minChange: 50, reason: "Account for resumed payments" },
      { categoryId: "entertainment", direction: "decrease", minChange: 50, reason: "Cut entertainment to cover payments" },
      { categoryId: "subscriptions", direction: "decrease", minChange: 30, reason: "Cancel some subscriptions" },
    ],
    tips: [
      "Review which subscriptions you actually use",
      "Consider income-driven repayment plans",
      "Don't sacrifice savings entirely for debt"
    ],
    difficulty: "medium"
  },
  {
    id: "debt-payoff",
    title: "🎊 Credit Card Paid Off!",
    description: "You've paid off your credit card! Now you have extra monthly cash flow.",
    impact: "Credit card debt eliminated! +$50/month freed up",
    icon: <Award className="w-6 h-6 text-success" />,
    incomeChange: 0,
    debtChange: [{ categoryId: "credit-card", amount: -50 }],
    requiredActions: [
      { categoryId: "investing", direction: "increase", minChange: 30, reason: "Redirect old debt payments to investing" },
      { categoryId: "emergency", direction: "increase", minChange: 20, reason: "Build emergency fund with freed cash" },
    ],
    tips: [
      "Don't let the freed money disappear into lifestyle",
      "Apply old debt payments to investments or other debt",
      "Celebrate but stay disciplined!"
    ],
    difficulty: "easy"
  },
  {
    id: "medical-bill",
    title: "🏥 Medical Bill",
    description: "An unexpected doctor visit and tests cost $800. You set up a payment plan.",
    impact: "New payment: $100/month for 8 months",
    icon: <Heart className="w-6 h-6 text-destructive" />,
    incomeChange: 0,
    debtChange: [{ categoryId: "credit-card", amount: 100 }],
    requiredActions: [
      { categoryId: "dining", direction: "decrease", minChange: 50, reason: "Reduce dining to cover medical payments" },
      { categoryId: "shopping", direction: "decrease", minChange: 50, reason: "Pause shopping temporarily" },
    ],
    tips: [
      "Always ask for payment plans - most providers offer them",
      "Medical debt often has 0% interest payment plans",
      "Don't drain emergency fund for non-emergencies"
    ],
    difficulty: "easy"
  },
  {
    id: "inflation",
    title: "📈 Rising Costs",
    description: "Groceries and utilities have increased due to inflation.",
    impact: "Essential costs up ~$80/month",
    icon: <TrendingUp className="w-6 h-6 text-warning" />,
    incomeChange: 0,
    requiredActions: [
      { categoryId: "dining", direction: "decrease", minChange: 50, reason: "Cook at home more during high inflation" },
      { categoryId: "shopping", direction: "decrease", minChange: 30, reason: "Delay non-essential purchases" },
      { categoryId: "investing", direction: "maintain", reason: "Keep investing - it beats inflation long-term" },
    ],
    tips: [
      "Buy store brands instead of name brands",
      "Meal plan to reduce grocery waste",
      "Don't stop investing - it's your inflation hedge"
    ],
    difficulty: "easy"
  },
  {
    id: "bonus",
    title: "💵 Annual Bonus!",
    description: "You received a $2,000 bonus! How will you allocate it wisely?",
    impact: "One-time +$2,000 (spread as +$500/month for 4 months)",
    icon: <Wallet className="w-6 h-6 text-success" />,
    incomeChange: 500,
    requiredActions: [
      { categoryId: "student-loan", direction: "increase", minChange: 150, reason: "Use bonus to pay down student loans" },
      { categoryId: "emergency", direction: "increase", minChange: 150, reason: "Boost emergency savings" },
    ],
    tips: [
      "Follow the 50/30/20 rule with bonus money",
      "Put at least half toward financial goals",
      "It's okay to treat yourself with a small portion"
    ],
    difficulty: "easy"
  },
  {
    id: "rent-increase",
    title: "🏠 Rent Going Up 10%",
    description: "Your landlord is raising rent by 10% when your lease renews.",
    impact: "Housing cost +$120/month",
    icon: <Home className="w-6 h-6 text-warning" />,
    incomeChange: 0,
    requiredActions: [
      { categoryId: "dining", direction: "decrease", minChange: 50, reason: "Offset rent increase by cutting dining" },
      { categoryId: "entertainment", direction: "decrease", minChange: 40, reason: "Reduce entertainment spending" },
      { categoryId: "subscriptions", direction: "decrease", minChange: 30, reason: "Cancel unused subscriptions" },
    ],
    tips: [
      "Negotiate with landlord for a smaller increase",
      "Calculate if moving costs less than the increase",
      "Cut wants to absorb fixed cost increases"
    ],
    difficulty: "medium"
  },
  {
    id: "side-hustle",
    title: "🚀 Side Hustle Income",
    description: "Your side project is earning steady money! Extra $400/month coming in.",
    impact: "Income increased by $400/month",
    icon: <Briefcase className="w-6 h-6 text-success" />,
    incomeChange: 400,
    requiredActions: [
      { categoryId: "investing", direction: "increase", minChange: 150, reason: "Invest most of your side income" },
      { categoryId: "student-loan", direction: "increase", minChange: 100, reason: "Accelerate debt payoff" },
    ],
    tips: [
      "Set aside 25-30% for taxes on side income",
      "Don't increase lifestyle with variable income",
      "Build a buffer for months when side income is lower"
    ],
    difficulty: "easy"
  },
  {
    id: "job-loss-partial",
    title: "⚠️ Hours Reduced",
    description: "Your company cut your hours by 20%. You need to adjust quickly.",
    impact: "Income reduced by $800/month",
    icon: <AlertTriangle className="w-6 h-6 text-destructive" />,
    incomeChange: -800,
    requiredActions: [
      { categoryId: "dining", direction: "decrease", minChange: 150, reason: "Cut dining significantly" },
      { categoryId: "entertainment", direction: "decrease", minChange: 100, reason: "Reduce entertainment" },
      { categoryId: "shopping", direction: "decrease", minChange: 100, reason: "Pause non-essential purchases" },
      { categoryId: "subscriptions", direction: "decrease", minChange: 50, reason: "Cancel subscriptions you don't need" },
    ],
    tips: [
      "Cut wants aggressively but protect essentials",
      "Look for additional income sources",
      "Use emergency fund only if absolutely necessary"
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
    title: "Organized Categories",
    content: "Your expenses are grouped into 4 categories you can click to expand:\n• 🏠 Essentials - Must-haves\n• 🎯 Lifestyle - Nice-to-haves\n• 💳 Debt - What you owe\n• 💰 Savings - Your future",
    highlight: "categories",
  },
  {
    title: "Debt Can Change!",
    content: "Some scenarios will add or remove debt. When unexpected expenses hit, your debt payments may increase. When you pay something off, you'll have more cash flow!",
    highlight: "debt",
  },
  {
    title: "Essentials Are Protected",
    content: "You can't just stop paying rent! Essential expenses (🔒) can only be reduced by 15-25%. Focus on cutting lifestyle spending first.",
    highlight: "essentials",
  },
  {
    title: "Balance Your Budget",
    content: "After each scenario, adjust your sliders until the Budget Balance shows $0 or positive. Going negative means trouble!",
    highlight: "balance",
  },
  {
    title: "Ready to Play!",
    content: "You'll face 10 scenarios. Cut lifestyle first, manage your debt, and remember: every dollar has a job. Good luck!",
    highlight: null,
  },
];

export const BudgetBalancerGame = ({ onClose }: BudgetBalancerGameProps) => {
  const [showTutorial, setShowTutorial] = useState(true);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [budget, setBudget] = useState<BudgetCategory[]>(INITIAL_BUDGET.map(b => ({ ...b })));
  const [originalBudget, setOriginalBudget] = useState<BudgetCategory[]>(INITIAL_BUDGET.map(b => ({ ...b })));
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<{ correct: string[]; incorrect: string[]; tips: string[] }>({ correct: [], incorrect: [], tips: [] });
  const [gameComplete, setGameComplete] = useState(false);
  const [baseIncome] = useState(4800);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    essentials: true,
    lifestyle: true,
    debt: true,
    savings: true,
  });

  const currentScenario = SCENARIOS[currentScenarioIndex];
  
  // Apply debt changes from scenario
  const getAdjustedBudget = () => {
    if (!currentScenario.debtChange) return budget;
    return budget.map(cat => {
      const debtMod = currentScenario.debtChange?.find(d => d.categoryId === cat.id);
      if (debtMod) {
        return { ...cat, amount: Math.max(cat.minAmount, cat.amount + debtMod.amount) };
      }
      return cat;
    });
  };

  const adjustedBudget = getAdjustedBudget();
  const currentIncome = baseIncome + (currentScenario.incomeChange || 0);
  const totalSpending = adjustedBudget.reduce((sum, c) => sum + c.amount, 0);
  const remaining = currentIncome - totalSpending;

  const groupTotals = {
    essentials: adjustedBudget.filter(c => c.group === "essentials").reduce((sum, c) => sum + c.amount, 0),
    lifestyle: adjustedBudget.filter(c => c.group === "lifestyle").reduce((sum, c) => sum + c.amount, 0),
    debt: adjustedBudget.filter(c => c.group === "debt").reduce((sum, c) => sum + c.amount, 0),
    savings: adjustedBudget.filter(c => c.group === "savings").reduce((sum, c) => sum + c.amount, 0),
  };

  const toggleGroup = (group: string) => {
    setExpandedGroups(prev => ({ ...prev, [group]: !prev[group] }));
  };

  const updateCategory = (id: string, newAmount: number) => {
    setBudget(prev => 
      prev.map(c => {
        if (c.id !== id) return c;
        
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
    const debtMod = currentScenario.debtChange?.find(d => d.categoryId === categoryId);
    const debtChange = debtMod ? debtMod.amount : 0;
    return (current + debtChange) - original;
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
      // Apply permanent debt changes to original budget
      const newOriginal = originalBudget.map(cat => {
        const debtMod = currentScenario.debtChange?.find(d => d.categoryId === cat.id);
        if (debtMod) {
          return { ...cat, amount: Math.max(cat.minAmount, Math.min(cat.maxAmount, cat.amount + debtMod.amount)) };
        }
        return cat;
      });
      
      setOriginalBudget(newOriginal);
      setBudget(newOriginal.map(b => ({ ...b })));
      setCurrentScenarioIndex(prev => prev + 1);
      setShowResult(false);
      setFeedback({ correct: [], incorrect: [], tips: [] });
    } else {
      setGameComplete(true);
    }
  };

  const resetGame = () => {
    setCurrentScenarioIndex(0);
    setOriginalBudget(INITIAL_BUDGET.map(b => ({ ...b })));
    setBudget(INITIAL_BUDGET.map(b => ({ ...b })));
    setScore(0);
    setShowResult(false);
    setFeedback({ correct: [], incorrect: [], tips: [] });
    setGameComplete(false);
    setShowTutorial(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "bg-success/20 text-success";
      case "medium": return "bg-warning/20 text-warning";
      case "hard": return "bg-destructive/20 text-destructive";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getGroupColorClass = (color: string) => {
    switch (color) {
      case "primary": return "text-primary";
      case "warning": return "text-warning";
      case "destructive": return "text-destructive";
      case "success": return "text-success";
      default: return "text-foreground";
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
            <div className="space-y-2">
              {Object.entries(CATEGORY_GROUPS).map(([key, group]) => (
                <div key={key} className={`p-3 rounded-lg border-l-4 ${group.borderColor} ${group.bgColor}`}>
                  <span className="font-semibold">{group.label}</span>
                  <p className="text-xs text-muted-foreground">{group.description}</p>
                </div>
              ))}
            </div>
          )}
          
          {step.highlight === "debt" && (
            <div className="space-y-2">
              <div className="p-4 bg-destructive/10 rounded-lg border-l-4 border-l-destructive">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-destructive" />
                  <span className="font-semibold">Debt Goes Up</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Unexpected expenses can add to your debt payments
                </p>
              </div>
              <div className="p-4 bg-success/10 rounded-lg border-l-4 border-l-success">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-success rotate-180" />
                  <span className="font-semibold">Debt Goes Down</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Paying off debt frees up cash for other goals!
                </p>
              </div>
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
              <li>• Cut lifestyle first, essentials have limits</li>
              <li>• Debt changes require quick adjustments</li>
              <li>• Emergency fund is for real emergencies</li>
              <li>• Use raises and bonuses wisely</li>
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
              {currentScenario.debtChange && (
                <Badge variant="outline" className="text-sm ml-2 border-destructive text-destructive">
                  <Flame className="w-3 h-3 mr-1" />
                  Debt Change
                </Badge>
              )}
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
            <div className="text-xs text-muted-foreground">Essentials</div>
            <div className="text-xl font-bold text-primary">${groupTotals.essentials.toLocaleString()}</div>
          </Card>
          <Card className="p-3 text-center border-l-4 border-l-warning">
            <div className="text-xs text-muted-foreground">Lifestyle</div>
            <div className="text-xl font-bold text-warning">${groupTotals.lifestyle.toLocaleString()}</div>
          </Card>
          <Card className="p-3 text-center border-l-4 border-l-destructive">
            <div className="text-xs text-muted-foreground">Debt</div>
            <div className="text-xl font-bold text-destructive">${groupTotals.debt.toLocaleString()}</div>
          </Card>
          <Card className="p-3 text-center border-l-4 border-l-success">
            <div className="text-xs text-muted-foreground">Savings</div>
            <div className="text-xl font-bold text-success">${groupTotals.savings.toLocaleString()}</div>
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
            {/* Budget Categories - Collapsible Groups */}
            <div className="space-y-4">
              {(Object.entries(CATEGORY_GROUPS) as [keyof typeof CATEGORY_GROUPS, typeof CATEGORY_GROUPS[keyof typeof CATEGORY_GROUPS]][]).map(([groupKey, groupInfo]) => {
                const groupCategories = adjustedBudget.filter(c => c.group === groupKey);
                const groupTotal = groupCategories.reduce((sum, c) => sum + c.amount, 0);
                
                return (
                  <Collapsible key={groupKey} open={expandedGroups[groupKey]} onOpenChange={() => toggleGroup(groupKey)}>
                    <CollapsibleTrigger asChild>
                      <Card className={`p-4 cursor-pointer hover:bg-accent/50 transition-colors border-l-4 ${groupInfo.borderColor}`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-lg font-semibold">{groupInfo.label}</span>
                            <span className="text-sm text-muted-foreground">({groupCategories.length} items)</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`text-xl font-bold ${getGroupColorClass(groupInfo.color)}`}>
                              ${groupTotal.toLocaleString()}
                            </span>
                            {expandedGroups[groupKey] ? (
                              <ChevronUp className="w-5 h-5 text-muted-foreground" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-muted-foreground" />
                            )}
                          </div>
                        </div>
                      </Card>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="grid md:grid-cols-2 gap-3 mt-3 pl-4">
                        {groupCategories.map(category => {
                          const change = getChange(category.id);
                          const debtMod = currentScenario.debtChange?.find(d => d.categoryId === category.id);
                          
                          return (
                            <Card key={category.id} className={`p-4 border-l-4 ${groupInfo.borderColor}`}>
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  {category.icon}
                                  <span className="font-semibold">{category.name}</span>
                                  {category.isEssential && (
                                    <span className="text-xs text-muted-foreground" title="Essential - limited reduction">🔒</span>
                                  )}
                                  {debtMod && (
                                    <Badge variant="outline" className={debtMod.amount > 0 ? "border-destructive text-destructive" : "border-success text-success"}>
                                      {debtMod.amount > 0 ? '+' : ''}{debtMod.amount}
                                    </Badge>
                                  )}
                                </div>
                                {change !== 0 && !debtMod && (
                                  <Badge variant={change > 0 ? "default" : "secondary"} className={change > 0 ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"}>
                                    {change > 0 ? '+' : ''}{change}
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-4">
                                <span className="text-xl font-bold w-20">
                                  ${(category.amount + (debtMod?.amount || 0)).toLocaleString()}
                                </span>
                                <Slider
                                  value={[category.amount + (debtMod?.amount || 0)]}
                                  onValueChange={([val]) => updateCategory(category.id, val - (debtMod?.amount || 0))}
                                  min={category.minAmount + (debtMod?.amount || 0)}
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
                    </CollapsibleContent>
                  </Collapsible>
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

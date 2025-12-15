import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { 
  ArrowLeft, Wallet, PiggyBank, Home, Car, Coffee, 
  ShoppingBag, Smartphone, Heart, GraduationCap, TrendingUp,
  Check, X, Lightbulb, Target, Award
} from "lucide-react";
import { toast } from "sonner";

interface BudgetCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  amount: number;
  type: "need" | "want" | "savings";
  tip: string;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  monthlyIncome: number;
  goal: string;
  goalAmount: number;
  categories: BudgetCategory[];
  timeLimit: number; // months
}

interface BudgetBalancerGameProps {
  onClose: () => void;
}

const CHALLENGES: Challenge[] = [
  {
    id: "1",
    title: "Fresh Graduate",
    description: "You just landed your first job! Create a budget that lets you save for an emergency fund while paying off student loans.",
    monthlyIncome: 3500,
    goal: "Build a $3,000 emergency fund",
    goalAmount: 3000,
    timeLimit: 12,
    categories: [
      { id: "rent", name: "Rent", icon: <Home className="w-5 h-5" />, amount: 1200, type: "need", tip: "Aim for 30% or less of income on housing" },
      { id: "utilities", name: "Utilities", icon: <Lightbulb className="w-5 h-5" />, amount: 150, type: "need", tip: "Turn off lights and lower thermostat to save" },
      { id: "groceries", name: "Groceries", icon: <ShoppingBag className="w-5 h-5" />, amount: 300, type: "need", tip: "Meal prep and use coupons to reduce costs" },
      { id: "transport", name: "Transportation", icon: <Car className="w-5 h-5" />, amount: 200, type: "need", tip: "Consider public transit or carpooling" },
      { id: "loans", name: "Student Loans", icon: <GraduationCap className="w-5 h-5" />, amount: 350, type: "need", tip: "Pay minimum now, increase when income rises" },
      { id: "phone", name: "Phone/Internet", icon: <Smartphone className="w-5 h-5" />, amount: 100, type: "need", tip: "Look for bundled plans or cheaper carriers" },
      { id: "dining", name: "Dining Out", icon: <Coffee className="w-5 h-5" />, amount: 200, type: "want", tip: "Limit to 2-3 times per week" },
      { id: "entertainment", name: "Entertainment", icon: <Heart className="w-5 h-5" />, amount: 100, type: "want", tip: "Use free activities and library resources" },
      { id: "savings", name: "Emergency Fund", icon: <PiggyBank className="w-5 h-5" />, amount: 250, type: "savings", tip: "Automate savings on payday!" },
      { id: "investing", name: "Investments", icon: <TrendingUp className="w-5 h-5" />, amount: 0, type: "savings", tip: "Start with employer 401k match" }
    ]
  },
  {
    id: "2",
    title: "Family of Four",
    description: "You're managing finances for a family. Balance childcare costs, mortgage payments, and saving for college.",
    monthlyIncome: 8000,
    goal: "Save $6,000 for vacation fund",
    goalAmount: 6000,
    timeLimit: 18,
    categories: [
      { id: "mortgage", name: "Mortgage", icon: <Home className="w-5 h-5" />, amount: 2200, type: "need", tip: "Consider refinancing if rates drop" },
      { id: "utilities", name: "Utilities", icon: <Lightbulb className="w-5 h-5" />, amount: 250, type: "need", tip: "Upgrade to energy-efficient appliances" },
      { id: "groceries", name: "Groceries", icon: <ShoppingBag className="w-5 h-5" />, amount: 800, type: "need", tip: "Buy in bulk for family staples" },
      { id: "cars", name: "Car Payments", icon: <Car className="w-5 h-5" />, amount: 600, type: "need", tip: "Consider one paid-off car if possible" },
      { id: "childcare", name: "Childcare", icon: <Heart className="w-5 h-5" />, amount: 1500, type: "need", tip: "Look into FSA dependent care benefits" },
      { id: "insurance", name: "Insurance", icon: <Target className="w-5 h-5" />, amount: 400, type: "need", tip: "Bundle home and auto for discounts" },
      { id: "dining", name: "Family Activities", icon: <Coffee className="w-5 h-5" />, amount: 300, type: "want", tip: "Free parks and community events" },
      { id: "shopping", name: "Shopping", icon: <ShoppingBag className="w-5 h-5" />, amount: 250, type: "want", tip: "Wait 48 hours before non-essential purchases" },
      { id: "college529", name: "College Fund (529)", icon: <GraduationCap className="w-5 h-5" />, amount: 400, type: "savings", tip: "Tax-advantaged growth for education" },
      { id: "vacation", name: "Vacation Fund", icon: <PiggyBank className="w-5 h-5" />, amount: 300, type: "savings", tip: "This is your goal savings!" }
    ]
  },
  {
    id: "3",
    title: "Side Hustle Entrepreneur",
    description: "You have a day job but started a side business. Balance regular expenses while reinvesting in your venture.",
    monthlyIncome: 5500,
    goal: "Invest $10,000 in your business",
    goalAmount: 10000,
    timeLimit: 24,
    categories: [
      { id: "rent", name: "Rent", icon: <Home className="w-5 h-5" />, amount: 1400, type: "need", tip: "Consider a home office deduction" },
      { id: "utilities", name: "Utilities", icon: <Lightbulb className="w-5 h-5" />, amount: 120, type: "need", tip: "Business portion may be deductible" },
      { id: "food", name: "Food", icon: <ShoppingBag className="w-5 h-5" />, amount: 400, type: "need", tip: "Quick meals save time for business" },
      { id: "transport", name: "Transportation", icon: <Car className="w-5 h-5" />, amount: 300, type: "need", tip: "Track business miles for deductions" },
      { id: "health", name: "Health Insurance", icon: <Heart className="w-5 h-5" />, amount: 350, type: "need", tip: "Essential for entrepreneurs" },
      { id: "software", name: "Business Tools", icon: <Smartphone className="w-5 h-5" />, amount: 200, type: "need", tip: "Invest in productivity software" },
      { id: "marketing", name: "Marketing", icon: <Target className="w-5 h-5" />, amount: 300, type: "want", tip: "Start with free social media" },
      { id: "courses", name: "Learning/Courses", icon: <GraduationCap className="w-5 h-5" />, amount: 150, type: "want", tip: "Invest in skills that generate revenue" },
      { id: "emergency", name: "Emergency Fund", icon: <PiggyBank className="w-5 h-5" />, amount: 300, type: "savings", tip: "6 months runway for entrepreneurs" },
      { id: "business", name: "Business Investment", icon: <TrendingUp className="w-5 h-5" />, amount: 500, type: "savings", tip: "Reinvest profits for growth" }
    ]
  }
];

export const BudgetBalancerGame = ({ onClose }: BudgetBalancerGameProps) => {
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [categories, setCategories] = useState<BudgetCategory[]>([]);
  const [month, setMonth] = useState(1);
  const [totalSaved, setTotalSaved] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [challengeComplete, setChallengeComplete] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [score, setScore] = useState(0);

  const currentChallenge = CHALLENGES[currentChallengeIndex];

  useEffect(() => {
    setCategories(currentChallenge.categories.map(c => ({ ...c })));
  }, [currentChallengeIndex]);

  const totalSpending = categories.reduce((sum, c) => sum + c.amount, 0);
  const remaining = currentChallenge.monthlyIncome - totalSpending;
  const needsTotal = categories.filter(c => c.type === "need").reduce((sum, c) => sum + c.amount, 0);
  const wantsTotal = categories.filter(c => c.type === "want").reduce((sum, c) => sum + c.amount, 0);
  const savingsTotal = categories.filter(c => c.type === "savings").reduce((sum, c) => sum + c.amount, 0);

  const needsPercent = (needsTotal / currentChallenge.monthlyIncome) * 100;
  const wantsPercent = (wantsTotal / currentChallenge.monthlyIncome) * 100;
  const savingsPercent = (savingsTotal / currentChallenge.monthlyIncome) * 100;

  const updateCategory = (id: string, newAmount: number) => {
    setCategories(prev => 
      prev.map(c => c.id === id ? { ...c, amount: Math.max(0, newAmount) } : c)
    );
  };

  const simulateMonth = () => {
    if (remaining < 0) {
      toast.error("You're overspending! Adjust your budget.");
      return;
    }

    const goalCategory = categories.find(c => c.name.includes("Fund") || c.name.includes("Investment") || c.name.includes("Vacation"));
    const monthlySavings = goalCategory?.amount || savingsTotal;
    
    setTotalSaved(prev => prev + monthlySavings);
    setMonth(prev => prev + 1);

    // Check if goal reached
    if (totalSaved + monthlySavings >= currentChallenge.goalAmount) {
      const monthsUsed = month;
      const efficiency = Math.round(((currentChallenge.timeLimit - monthsUsed) / currentChallenge.timeLimit) * 100);
      const points = 500 + (efficiency * 5);
      setScore(prev => prev + points);
      setChallengeComplete(true);
      toast.success(`Goal reached in ${monthsUsed} months! +${points} points`);
    } else if (month >= currentChallenge.timeLimit) {
      toast.error("Time's up! You didn't reach your goal.");
      setChallengeComplete(true);
    }
  };

  const nextChallenge = () => {
    if (currentChallengeIndex < CHALLENGES.length - 1) {
      setCurrentChallengeIndex(prev => prev + 1);
      setMonth(1);
      setTotalSaved(0);
      setChallengeComplete(false);
    } else {
      setGameComplete(true);
    }
  };

  const resetGame = () => {
    setCurrentChallengeIndex(0);
    setMonth(1);
    setTotalSaved(0);
    setScore(0);
    setChallengeComplete(false);
    setGameComplete(false);
    setCategories(CHALLENGES[0].categories.map(c => ({ ...c })));
  };

  const getCategoryColor = (type: string) => {
    switch (type) {
      case "need": return "bg-primary/10 border-primary/30";
      case "want": return "bg-warning/10 border-warning/30";
      case "savings": return "bg-success/10 border-success/30";
      default: return "bg-muted";
    }
  };

  if (gameComplete) {
    return (
      <div className="min-h-screen bg-background p-4">
        <Card className="max-w-2xl mx-auto p-8 text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-primary flex items-center justify-center">
            <Award className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold">All Challenges Complete!</h1>
          <div className="text-5xl font-bold text-primary">{score} pts</div>
          <div className="space-y-2">
            <p className="text-muted-foreground">You've mastered budgeting fundamentals!</p>
            <div className="p-4 bg-muted rounded-lg text-left">
              <p className="font-semibold mb-2">Key Takeaways:</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Follow the 50/30/20 rule: 50% needs, 30% wants, 20% savings</li>
                <li>• Automate your savings on payday</li>
                <li>• Cut wants before needs when times are tough</li>
                <li>• Every dollar should have a purpose</li>
              </ul>
            </div>
          </div>
          <div className="flex gap-4 justify-center">
            <Button onClick={resetGame} size="lg">
              Play Again
            </Button>
            <Button variant="outline" onClick={onClose} size="lg">
              Back to Games
            </Button>
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
          <Badge variant="outline" className="text-lg px-4 py-2">
            Score: {score}
          </Badge>
          <Badge variant="outline">
            Challenge {currentChallengeIndex + 1}/{CHALLENGES.length}
          </Badge>
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Challenge Info */}
        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{currentChallenge.title}</h2>
              <p className="text-muted-foreground mt-1">{currentChallenge.description}</p>
              <div className="flex gap-4 mt-3 flex-wrap">
                <Badge variant="secondary">
                  Monthly Income: ${currentChallenge.monthlyIncome.toLocaleString()}
                </Badge>
                <Badge variant="outline">
                  Goal: {currentChallenge.goal}
                </Badge>
                <Badge variant="outline">
                  Time Limit: {currentChallenge.timeLimit} months
                </Badge>
              </div>
            </div>
          </div>
        </Card>

        {/* Progress */}
        <Card className="p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold">Goal Progress</span>
            <span className="text-sm text-muted-foreground">
              Month {month} of {currentChallenge.timeLimit}
            </span>
          </div>
          <Progress 
            value={(totalSaved / currentChallenge.goalAmount) * 100} 
            className="h-4 mb-2"
          />
          <div className="flex justify-between text-sm">
            <span>${totalSaved.toLocaleString()} saved</span>
            <span className="text-muted-foreground">${currentChallenge.goalAmount.toLocaleString()} goal</span>
          </div>
        </Card>

        {/* Budget Overview */}
        <Card className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Budget Breakdown (50/30/20 Rule)</h3>
            <div className={`font-bold ${remaining >= 0 ? 'text-success' : 'text-destructive'}`}>
              ${remaining >= 0 ? '+' : ''}{remaining.toLocaleString()} remaining
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <div className="text-sm text-muted-foreground">Needs (target: 50%)</div>
              <div className="text-xl font-bold text-primary">{needsPercent.toFixed(0)}%</div>
              <div className="text-sm">${needsTotal.toLocaleString()}</div>
            </div>
            <div className="p-3 bg-warning/10 rounded-lg">
              <div className="text-sm text-muted-foreground">Wants (target: 30%)</div>
              <div className="text-xl font-bold text-warning">{wantsPercent.toFixed(0)}%</div>
              <div className="text-sm">${wantsTotal.toLocaleString()}</div>
            </div>
            <div className="p-3 bg-success/10 rounded-lg">
              <div className="text-sm text-muted-foreground">Savings (target: 20%)</div>
              <div className="text-xl font-bold text-success">{savingsPercent.toFixed(0)}%</div>
              <div className="text-sm">${savingsTotal.toLocaleString()}</div>
            </div>
          </div>
        </Card>

        {/* Categories */}
        {!challengeComplete ? (
          <>
            <div className="grid md:grid-cols-2 gap-4">
              {categories.map(category => (
                <Card key={category.id} className={`p-4 border ${getCategoryColor(category.type)}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {category.icon}
                      <span className="font-semibold">{category.name}</span>
                    </div>
                    <Badge variant="outline" className="capitalize">{category.type}</Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-2xl font-bold">${category.amount}</span>
                    </div>
                    <Slider
                      value={[category.amount]}
                      onValueChange={([val]) => updateCategory(category.id, val)}
                      max={currentChallenge.monthlyIncome / 2}
                      step={25}
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground">{category.tip}</p>
                  </div>
                </Card>
              ))}
            </div>

            <Button 
              onClick={simulateMonth} 
              size="lg" 
              className="w-full"
              disabled={remaining < 0}
            >
              {remaining < 0 ? "Budget Over Limit!" : `Complete Month ${month}`}
            </Button>
          </>
        ) : (
          <Card className="p-6 text-center space-y-4">
            {totalSaved >= currentChallenge.goalAmount ? (
              <>
                <div className="w-16 h-16 mx-auto rounded-full bg-success/20 flex items-center justify-center">
                  <Check className="w-8 h-8 text-success" />
                </div>
                <h3 className="text-2xl font-bold">Challenge Complete!</h3>
                <p className="text-muted-foreground">
                  You reached ${totalSaved.toLocaleString()} in {month - 1} months!
                </p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 mx-auto rounded-full bg-destructive/20 flex items-center justify-center">
                  <X className="w-8 h-8 text-destructive" />
                </div>
                <h3 className="text-2xl font-bold">Time's Up!</h3>
                <p className="text-muted-foreground">
                  You saved ${totalSaved.toLocaleString()} but needed ${currentChallenge.goalAmount.toLocaleString()}
                </p>
              </>
            )}
            <Button onClick={nextChallenge} size="lg">
              {currentChallengeIndex < CHALLENGES.length - 1 ? "Next Challenge" : "See Final Results"}
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

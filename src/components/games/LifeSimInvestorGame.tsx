import { useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  ArrowLeft, TrendingUp, TrendingDown, User, Briefcase, 
  DollarSign, Trophy, Calendar, Zap, Target, Play, Sparkles, 
  Star, Flame, Heart, Home, GraduationCap, Wallet, ChevronRight,
  AlertTriangle, Gift, Building2, PiggyBank, CreditCard, TrendingDown as TrendDown
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface PlayerState {
  age: number;
  cash: number;
  investments: number;
  debt: number;
  creditScore: number;
  salary: number;
  jobTitle: string;
  education: string;
  married: boolean;
  children: number;
  homeOwner: boolean;
  homeValue: number;
  riskTolerance: "low" | "medium" | "high";
  careerPath: "corporate" | "entrepreneur" | "freelance" | "none";
  emergencyFund: number;
  retirementAccount: number;
}

interface LifeEvent {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  type: "income" | "expense" | "investment" | "life" | "market" | "debt" | "opportunity";
  choices: {
    text: string;
    outcome: string;
    effect: Partial<PlayerState> & { 
      cashChange?: number; 
      investmentChange?: number;
      debtChange?: number;
      creditChange?: number;
      salaryMultiplier?: number;
      unlocks?: string[];
      blocks?: string[];
    };
  }[];
}

interface GameLog {
  year: number;
  text: string;
  type: "positive" | "negative" | "neutral" | "milestone";
}

interface LifeSimInvestorGameProps {
  onClose: () => void;
}

const formatMoney = (amount: number): string => {
  if (Math.abs(amount) >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
  if (Math.abs(amount) >= 1000) return `$${(amount / 1000).toFixed(0)}k`;
  return `$${amount.toFixed(0)}`;
};

export const LifeSimInvestorGame = ({ onClose }: LifeSimInvestorGameProps) => {
  const { user } = useAuth();
  const [showTutorial, setShowTutorial] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<LifeEvent | null>(null);
  const [gameLog, setGameLog] = useState<GameLog[]>([]);
  const [unlockedPaths, setUnlockedPaths] = useState<string[]>([]);
  const [blockedPaths, setBlockedPaths] = useState<string[]>([]);
  const [marketCondition, setMarketCondition] = useState<"boom" | "stable" | "recession">("stable");
  const [consecutiveGoodChoices, setConsecutiveGoodChoices] = useState(0);
  
  const [player, setPlayer] = useState<PlayerState>({
    age: 22,
    cash: 2500,
    investments: 0,
    debt: 35000, // Student loans
    creditScore: 680,
    salary: 0,
    jobTitle: "Unemployed",
    education: "College Graduate",
    married: false,
    children: 0,
    homeOwner: false,
    homeValue: 0,
    riskTolerance: "medium",
    careerPath: "none",
    emergencyFund: 0,
    retirementAccount: 0,
  });

  const netWorth = player.cash + player.investments + player.homeValue + player.retirementAccount + player.emergencyFund - player.debt;

  const addLog = useCallback((text: string, type: GameLog["type"]) => {
    setGameLog(prev => [...prev, { year: player.age, text, type }]);
  }, [player.age]);

  // Generate events based on player state
  const generateEvent = useCallback((): LifeEvent => {
    const events: LifeEvent[] = [];
    
    // CAREER EVENTS - based on career path and salary
    if (player.careerPath === "none" && player.age <= 25) {
      events.push({
        id: "first-job",
        title: "Job Hunt",
        description: "You've been sending out resumes. A few opportunities have come up.",
        icon: <Briefcase className="w-6 h-6" />,
        type: "income",
        choices: [
          { text: "Corporate Job ($45k)", outcome: "You start as an analyst at a big company.", effect: { salary: 45000, jobTitle: "Junior Analyst", careerPath: "corporate", cashChange: 0 } },
          { text: "Startup ($35k + equity)", outcome: "High risk, high reward. You join a startup.", effect: { salary: 35000, jobTitle: "Startup Associate", careerPath: "entrepreneur", unlocks: ["startup-growth"] } },
          { text: "Freelance ($30/hr)", outcome: "You become your own boss.", effect: { salary: 52000, jobTitle: "Freelancer", careerPath: "freelance", unlocks: ["freelance-gig"] } },
        ]
      });
    } else if (player.salary > 0 && Math.random() < 0.3) {
      // Raise/promotion events
      if (player.careerPath === "corporate" && !blockedPaths.includes("promotion")) {
        events.push({
          id: "promotion",
          title: "Performance Review",
          description: `Your manager wants to discuss your future at the company. Current salary: ${formatMoney(player.salary)}`,
          icon: <TrendingUp className="w-6 h-6" />,
          type: "income",
          choices: [
            { text: "Ask for promotion", outcome: "Bold! You got a 20% raise and new title.", effect: { salaryMultiplier: 1.2, jobTitle: "Senior " + player.jobTitle, creditChange: 10 } },
            { text: "Accept standard raise", outcome: "You got the standard 3% cost-of-living increase.", effect: { salaryMultiplier: 1.03 } },
            { text: "Negotiate remote work", outcome: "Same pay, but you save on commuting.", effect: { cashChange: 200 } },
          ]
        });
      }
      
      if (player.careerPath === "entrepreneur" && unlockedPaths.includes("startup-growth")) {
        events.push({
          id: "startup-event",
          title: "Startup News",
          description: "Your startup has been getting attention from investors.",
          icon: <Building2 className="w-6 h-6" />,
          type: "opportunity",
          choices: [
            { text: "Take funding ($50k)", outcome: "You got funding! Your salary doubles but you gave up equity.", effect: { salaryMultiplier: 2, cashChange: 50000, blocks: ["startup-ipo"] } },
            { text: "Bootstrap it", outcome: "Slow and steady. Your equity is intact.", effect: { salaryMultiplier: 1.1, unlocks: ["startup-ipo"] } },
            { text: "Get acquired", outcome: "Big payout! But the startup journey ends.", effect: { cashChange: 150000, salary: 0, jobTitle: "Unemployed", careerPath: "none" } },
          ]
        });
      }
    }

    // MARKET EVENTS - affect investments
    if (player.investments > 1000) {
      if (Math.random() < 0.25) {
        const marketEvents: LifeEvent[] = [
          {
            id: "market-boom",
            title: "🚀 Market Rally!",
            description: `Tech stocks are soaring! Your ${formatMoney(player.investments)} portfolio is up 25%.`,
            icon: <TrendingUp className="w-6 h-6" />,
            type: "market",
            choices: [
              { text: "Take profits", outcome: "Smart! You locked in gains.", effect: { investmentChange: player.investments * 0.25, cashChange: player.investments * 0.25, investments: player.investments * 0.75 } },
              { text: "Let it ride", outcome: "Diamond hands! Portfolio grew.", effect: { investmentChange: player.investments * 0.25 } },
              { text: "Buy more", outcome: "Doubled down on the rally!", effect: { investmentChange: Math.min(player.cash * 0.5, 5000), cashChange: -Math.min(player.cash * 0.5, 5000) } },
            ]
          },
          {
            id: "market-crash",
            title: "📉 Market Crash!",
            description: `Markets are down 30%. Your portfolio dropped to ${formatMoney(player.investments * 0.7)}.`,
            icon: <TrendDown className="w-6 h-6" />,
            type: "market",
            choices: [
              { text: "Panic sell", outcome: "You sold at the bottom. Losses locked in.", effect: { investments: 0, cashChange: player.investments * 0.7, blocks: ["recovery-gains"] } },
              { text: "Hold steady", outcome: "You weathered the storm.", effect: { investmentChange: -player.investments * 0.3, unlocks: ["recovery-gains"] } },
              { text: "Buy the dip", outcome: "Contrarian play!", effect: { investmentChange: Math.min(player.cash * 0.3, 3000) - player.investments * 0.3, cashChange: -Math.min(player.cash * 0.3, 3000), unlocks: ["recovery-gains"] } },
            ]
          }
        ];
        events.push(marketEvents[Math.floor(Math.random() * marketEvents.length)]);
      }
    }

    // EXPENSE/EMERGENCY EVENTS
    if (Math.random() < 0.2) {
      const emergencies: LifeEvent[] = [
        {
          id: "car-trouble",
          title: "🚗 Car Trouble",
          description: "Your car needs $2,500 in repairs or you need to buy a new one.",
          icon: <AlertTriangle className="w-6 h-6" />,
          type: "expense",
          choices: [
            { text: "Pay for repairs", outcome: player.cash >= 2500 ? "Fixed! Back on the road." : "Had to put it on credit card.", effect: player.cash >= 2500 ? { cashChange: -2500 } : { debtChange: 2500, creditChange: -20 } },
            { text: "Buy used car ($8k)", outcome: "New wheels!", effect: player.cash >= 8000 ? { cashChange: -8000 } : { debtChange: 8000, creditChange: -10 } },
            { text: "Use public transit", outcome: "Saving money but losing time.", effect: { cashChange: 100, salaryMultiplier: 0.95 } },
          ]
        },
        {
          id: "medical-bill",
          title: "🏥 Medical Emergency",
          description: "Unexpected surgery. Bill: $5,000 after insurance.",
          icon: <Heart className="w-6 h-6" />,
          type: "expense",
          choices: [
            { text: "Pay in full", outcome: "Paid off, credit score improved!", effect: { cashChange: -5000, creditChange: 15 } },
            { text: "Payment plan", outcome: "Manageable monthly payments.", effect: { debtChange: 5000 } },
            { text: "Negotiate bill", outcome: "Got it reduced to $3,000!", effect: { cashChange: -3000 } },
          ]
        },
      ];
      
      if (player.emergencyFund >= 3000) {
        emergencies[0].choices.unshift({
          text: "Use emergency fund",
          outcome: "This is what it's for!",
          effect: { emergencyFund: player.emergencyFund - 2500 }
        });
      }
      
      events.push(emergencies[Math.floor(Math.random() * emergencies.length)]);
    }

    // LIFE MILESTONE EVENTS based on age
    if (player.age >= 25 && !player.married && Math.random() < 0.15) {
      events.push({
        id: "relationship",
        title: "💍 Love & Money",
        description: "Your partner of 2 years wants to get married. Wedding costs: $15-30k.",
        icon: <Heart className="w-6 h-6" />,
        type: "life",
        choices: [
          { text: "Big wedding ($30k)", outcome: "Dream wedding! But expensive.", effect: { married: true, cashChange: -30000, creditChange: -10 } },
          { text: "Simple ceremony ($5k)", outcome: "Intimate and meaningful.", effect: { married: true, cashChange: -5000, salaryMultiplier: 1.1 } },
          { text: "Courthouse ($500)", outcome: "Practical! More money for your future.", effect: { married: true, cashChange: -500, unlocks: ["dual-income"] } },
        ]
      });
    }

    if (player.married && player.children === 0 && player.age >= 28 && Math.random() < 0.1) {
      events.push({
        id: "children",
        title: "👶 Family Planning",
        description: "You're thinking about starting a family. Kids cost ~$15k/year.",
        icon: <Heart className="w-6 h-6" />,
        type: "life",
        choices: [
          { text: "Have a child", outcome: "Congratulations! A new chapter begins.", effect: { children: 1, unlocks: ["childcare-costs"] } },
          { text: "Wait a few years", outcome: "More time to build wealth first.", effect: { cashChange: 5000 } },
          { text: "Decide against it", outcome: "You focus on other goals.", effect: { blocks: ["children"] } },
        ]
      });
    }

    // HOUSING EVENTS
    if (!player.homeOwner && player.age >= 26 && player.salary > 50000 && Math.random() < 0.15) {
      const downPayment = 40000;
      events.push({
        id: "buy-home",
        title: "🏠 Buy a Home?",
        description: `A nice starter home is available for $300k. You need ${formatMoney(downPayment)} down.`,
        icon: <Home className="w-6 h-6" />,
        type: "opportunity",
        choices: [
          { text: "Buy it", outcome: player.cash >= downPayment ? "You're a homeowner!" : "Not enough for down payment.", effect: player.cash >= downPayment ? { homeOwner: true, homeValue: 300000, cashChange: -downPayment, debtChange: 260000, creditChange: 30 } : {} },
          { text: "Keep renting", outcome: "Flexibility is worth something.", effect: { cashChange: 500 } },
          { text: "Save for bigger home", outcome: "Delayed gratification.", effect: { unlocks: ["bigger-home"] } },
        ]
      });
    }

    // INVESTMENT OPPORTUNITIES
    if (player.cash > 5000 && Math.random() < 0.25) {
      events.push({
        id: "invest-opp",
        title: "💹 Investment Opportunity",
        description: `You have ${formatMoney(player.cash)} in savings. How should you invest?`,
        icon: <TrendingUp className="w-6 h-6" />,
        type: "investment",
        choices: [
          { text: "Index funds (safe)", outcome: "Diversified and steady.", effect: { investmentChange: Math.min(player.cash * 0.5, 10000), cashChange: -Math.min(player.cash * 0.5, 10000), riskTolerance: "low" } },
          { text: "Individual stocks", outcome: "Higher risk, higher reward.", effect: { investmentChange: Math.min(player.cash * 0.4, 8000), cashChange: -Math.min(player.cash * 0.4, 8000), riskTolerance: "high" } },
          { text: "Build emergency fund", outcome: "Smart! 6 months of expenses saved.", effect: { emergencyFund: player.emergencyFund + Math.min(player.cash * 0.3, 5000), cashChange: -Math.min(player.cash * 0.3, 5000) } },
          { text: "Max out 401k", outcome: "Tax-advantaged retirement savings!", effect: { retirementAccount: player.retirementAccount + Math.min(player.cash * 0.4, 22500), cashChange: -Math.min(player.cash * 0.4, 22500) } },
        ]
      });
    }

    // DEBT EVENTS
    if (player.debt > 10000 && Math.random() < 0.2) {
      events.push({
        id: "debt-decision",
        title: "💳 Debt Strategy",
        description: `You owe ${formatMoney(player.debt)}. Interest is eating your wealth.`,
        icon: <CreditCard className="w-6 h-6" />,
        type: "debt",
        choices: [
          { text: "Aggressive payoff", outcome: "Paid down debt significantly!", effect: { debtChange: -Math.min(player.cash * 0.8, player.debt), cashChange: -Math.min(player.cash * 0.8, player.debt), creditChange: 25 } },
          { text: "Minimum payments", outcome: "Keeping options open, but interest accrues.", effect: { debtChange: player.debt * 0.05 } },
          { text: "Refinance", outcome: "Lower interest rate!", effect: { debtChange: -player.debt * 0.1, creditChange: 10 } },
        ]
      });
    }

    // SIDE INCOME / WINDFALL
    if (Math.random() < 0.1) {
      const windfalls: LifeEvent[] = [
        {
          id: "bonus",
          title: "🎁 Unexpected Bonus",
          description: "Your company had a great quarter! You got a $5,000 bonus.",
          icon: <Gift className="w-6 h-6" />,
          type: "income",
          choices: [
            { text: "Save it all", outcome: "Emergency fund growing!", effect: { cashChange: 5000 } },
            { text: "Invest it", outcome: "Put it to work!", effect: { investmentChange: 5000 } },
            { text: "Pay off debt", outcome: "Debt reduced!", effect: { debtChange: -5000, creditChange: 10 } },
            { text: "Treat yourself", outcome: "YOLO! But was it worth it?", effect: { cashChange: 1000 } },
          ]
        },
        {
          id: "inheritance",
          title: "💰 Inheritance",
          description: "A distant relative left you $25,000. What will you do?",
          icon: <Gift className="w-6 h-6" />,
          type: "income",
          choices: [
            { text: "Invest wisely", outcome: "Building generational wealth.", effect: { investmentChange: 20000, cashChange: 5000 } },
            { text: "Buy a rental property", outcome: "Passive income stream!", effect: { cashChange: -25000, homeValue: player.homeValue + 150000, debtChange: 125000, unlocks: ["rental-income"] } },
            { text: "Pay off all debt", outcome: "Freedom from debt!", effect: { cashChange: 25000 - Math.min(player.debt, 25000), debtChange: -Math.min(player.debt, 25000), creditChange: 50 } },
          ]
        }
      ];
      events.push(windfalls[Math.floor(Math.random() * windfalls.length)]);
    }

    // Education/Skill events
    if (player.age <= 35 && Math.random() < 0.1) {
      events.push({
        id: "education",
        title: "📚 Career Development",
        description: "An MBA program or certification could boost your career.",
        icon: <GraduationCap className="w-6 h-6" />,
        type: "opportunity",
        choices: [
          { text: "Get MBA ($80k)", outcome: "2 years later... worth it!", effect: { debtChange: 80000, salaryMultiplier: 1.5, education: "MBA", unlocks: ["executive-track"] } },
          { text: "Online cert ($2k)", outcome: "Quick boost to your skills.", effect: { cashChange: -2000, salaryMultiplier: 1.1 } },
          { text: "Learn on the job", outcome: "Experience is the best teacher.", effect: { salaryMultiplier: 1.05 } },
        ]
      });
    }

    // Default fallback - yearly summary
    if (events.length === 0) {
      const yearlyIncome = player.salary;
      const yearlyExpenses = 24000 + (player.children * 15000) + (player.homeOwner ? 12000 : 18000);
      const netCashFlow = yearlyIncome - yearlyExpenses;
      
      events.push({
        id: "yearly-summary",
        title: "📅 Year in Review",
        description: `Income: ${formatMoney(yearlyIncome)} | Expenses: ${formatMoney(yearlyExpenses)} | Net: ${formatMoney(netCashFlow)}`,
        icon: <Calendar className="w-6 h-6" />,
        type: "neutral" as any,
        choices: [
          { text: "Save aggressively", outcome: "Living frugally pays off.", effect: { cashChange: Math.max(netCashFlow * 0.7, 0) } },
          { text: "Balanced approach", outcome: "Enjoying life while saving.", effect: { cashChange: Math.max(netCashFlow * 0.5, 0) } },
          { text: "Live it up", outcome: "Memories made, money spent.", effect: { cashChange: Math.max(netCashFlow * 0.2, -5000) } },
        ]
      });
    }

    // Weight events based on player state for variety
    return events[Math.floor(Math.random() * events.length)];
  }, [player, unlockedPaths, blockedPaths]);

  const handleChoice = (choice: LifeEvent["choices"][0]) => {
    if (!currentEvent) return;

    // Apply effects
    setPlayer(prev => {
      const updated = { ...prev };
      
      if (choice.effect.cashChange) updated.cash = Math.max(0, updated.cash + choice.effect.cashChange);
      if (choice.effect.investmentChange) updated.investments = Math.max(0, updated.investments + choice.effect.investmentChange);
      if (choice.effect.debtChange) updated.debt = Math.max(0, updated.debt + choice.effect.debtChange);
      if (choice.effect.creditChange) updated.creditScore = Math.max(300, Math.min(850, updated.creditScore + choice.effect.creditChange));
      if (choice.effect.salaryMultiplier) updated.salary = Math.floor(updated.salary * choice.effect.salaryMultiplier);
      if (choice.effect.salary !== undefined) updated.salary = choice.effect.salary;
      if (choice.effect.jobTitle) updated.jobTitle = choice.effect.jobTitle;
      if (choice.effect.careerPath) updated.careerPath = choice.effect.careerPath;
      if (choice.effect.married !== undefined) updated.married = choice.effect.married;
      if (choice.effect.children !== undefined) updated.children = choice.effect.children;
      if (choice.effect.homeOwner !== undefined) updated.homeOwner = choice.effect.homeOwner;
      if (choice.effect.homeValue !== undefined) updated.homeValue = choice.effect.homeValue;
      if (choice.effect.education) updated.education = choice.effect.education;
      if (choice.effect.riskTolerance) updated.riskTolerance = choice.effect.riskTolerance;
      if (choice.effect.emergencyFund !== undefined) updated.emergencyFund = choice.effect.emergencyFund;
      if (choice.effect.retirementAccount !== undefined) updated.retirementAccount = choice.effect.retirementAccount;
      if (choice.effect.investments !== undefined) updated.investments = choice.effect.investments;
      
      return updated;
    });

    // Handle unlocks/blocks
    if (choice.effect.unlocks) {
      setUnlockedPaths(prev => [...new Set([...prev, ...choice.effect.unlocks!])]);
    }
    if (choice.effect.blocks) {
      setBlockedPaths(prev => [...new Set([...prev, ...choice.effect.blocks!])]);
    }

    // Track good financial choices
    if (choice.effect.debtChange && choice.effect.debtChange < 0) {
      setConsecutiveGoodChoices(prev => prev + 1);
    }

    // Log the outcome
    const logType: GameLog["type"] = 
      (choice.effect.cashChange && choice.effect.cashChange > 0) || 
      (choice.effect.investmentChange && choice.effect.investmentChange > 0) ? "positive" :
      (choice.effect.debtChange && choice.effect.debtChange > 0) ? "negative" : "neutral";
    
    addLog(`${currentEvent.title}: ${choice.outcome}`, logType);

    // Apply passive effects (investment growth, debt interest)
    setPlayer(prev => {
      const investmentGrowth = prev.investments * (marketCondition === "boom" ? 0.12 : marketCondition === "recession" ? -0.05 : 0.07);
      const homeAppreciation = prev.homeValue * 0.03;
      const debtInterest = prev.debt * 0.05;
      const retirementGrowth = prev.retirementAccount * 0.08;
      
      return {
        ...prev,
        age: prev.age + 1,
        investments: Math.max(0, prev.investments + investmentGrowth),
        homeValue: prev.homeValue + homeAppreciation,
        debt: prev.debt + debtInterest,
        retirementAccount: prev.retirementAccount + retirementGrowth,
      };
    });

    // Update market conditions
    const marketRoll = Math.random();
    if (marketRoll < 0.1) setMarketCondition("boom");
    else if (marketRoll < 0.2) setMarketCondition("recession");
    else setMarketCondition("stable");

    setCurrentEvent(null);

    // Check game over
    if (player.age >= 64) {
      endGame();
    }
  };

  const advanceYear = () => {
    const event = generateEvent();
    setCurrentEvent(event);
  };

  const endGame = async () => {
    setGameOver(true);
    const finalNetWorth = netWorth;
    const score = Math.floor(finalNetWorth / 1000) + (consecutiveGoodChoices * 50);
    const coinsEarned = Math.floor(score / 100);

    try {
      if (user?.id) {
        await supabase.from("game_sessions").insert({
          user_id: user.id,
          game_id: "life-sim-investor",
          score,
          coins_earned: coinsEarned,
          completed: true,
        });
        await supabase.rpc("increment_coins", { user_id_param: user.id, amount: coinsEarned });
      }
      toast.success(`Retired with ${formatMoney(finalNetWorth)}! Earned ${coinsEarned} coins.`);
    } catch (error) {
      console.error("Error saving game:", error);
    }
  };

  const getGrade = () => {
    if (netWorth >= 2000000) return { grade: "A+", label: "Millionaire", color: "text-yellow-500" };
    if (netWorth >= 1000000) return { grade: "A", label: "Wealthy", color: "text-success" };
    if (netWorth >= 500000) return { grade: "B", label: "Comfortable", color: "text-primary" };
    if (netWorth >= 100000) return { grade: "C", label: "Stable", color: "text-warning" };
    if (netWorth >= 0) return { grade: "D", label: "Getting By", color: "text-muted-foreground" };
    return { grade: "F", label: "In Debt", color: "text-destructive" };
  };

  // Tutorial Screen
  if (showTutorial) {
    return (
      <div className="fixed inset-0 bg-background z-50 overflow-y-auto">
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4">
          <div className="max-w-2xl mx-auto">
            <Button variant="ghost" onClick={onClose} className="mb-4 gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4" />
              Back to Games
            </Button>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative">
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-card via-card to-primary/10 border border-border/50 shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary/20 to-transparent rounded-full blur-3xl" />
                
                <div className="relative p-8">
                  <div className="text-center mb-8">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring" }}
                      className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary/70 mb-4 shadow-lg"
                    >
                      <Trophy className="w-10 h-10 text-primary-foreground" />
                    </motion.div>
                    <h1 className="text-3xl font-black text-foreground mb-2">Financial Life</h1>
                    <p className="text-muted-foreground">Make choices. Build wealth. Retire rich.</p>
                  </div>

                  <div className="space-y-4 mb-8">
                    {[
                      { icon: <Calendar className="w-5 h-5" />, title: "Year-by-Year Choices", description: "Navigate life events that pop up based on your age, income, and past decisions.", color: "from-blue-500 to-blue-600" },
                      { icon: <TrendingUp className="w-5 h-5" />, title: "Compounding Decisions", description: "Early choices unlock or block future opportunities. Every decision matters.", color: "from-success to-emerald-600" },
                      { icon: <Zap className="w-5 h-5" />, title: "Random Events", description: "Market crashes, windfalls, emergencies—handle whatever life throws at you.", color: "from-warning to-orange-600" },
                      { icon: <Target className="w-5 h-5" />, title: "Retire Wealthy", description: "Maximize your net worth by age 65. Can you become a millionaire?", color: "from-purple-500 to-purple-600" }
                    ].map((step, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + i * 0.1 }}
                        className="flex items-start gap-4 p-4 rounded-xl bg-background/50 border border-border/30"
                      >
                        <div className={`flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white shadow-md`}>
                          {step.icon}
                        </div>
                        <div>
                          <h3 className="font-bold text-foreground">{step.title}</h3>
                          <p className="text-sm text-muted-foreground">{step.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="p-4 rounded-xl bg-primary/10 border border-primary/20 mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Flame className="w-5 h-5 text-primary" />
                      <span className="font-bold text-foreground">Pro Tips</span>
                    </div>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li className="flex items-center gap-2"><Sparkles className="w-3 h-3 text-warning" />Build an emergency fund before investing</li>
                      <li className="flex items-center gap-2"><Star className="w-3 h-3 text-warning" />Pay off high-interest debt first</li>
                      <li className="flex items-center gap-2"><Sparkles className="w-3 h-3 text-warning" />Your choices today shape tomorrow's options</li>
                    </ul>
                  </motion.div>

                  <Button onClick={() => { setShowTutorial(false); advanceYear(); }} className="w-full h-14 text-lg font-bold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg gap-2">
                    <Play className="w-5 h-5" />
                    Start Your Life
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  // Game Over Screen
  if (gameOver) {
    const grade = getGrade();
    return (
      <div className="fixed inset-0 bg-background z-50 overflow-y-auto">
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4 flex items-center justify-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full">
            <Card className="p-8 text-center bg-gradient-to-br from-card to-primary/5 border-primary/20">
              <Trophy className={`w-16 h-16 mx-auto mb-4 ${grade.color}`} />
              <h1 className="text-3xl font-black mb-2">Retired at 65!</h1>
              <p className="text-muted-foreground mb-6">{player.jobTitle} • {player.education}</p>
              
              <div className="space-y-4 mb-6">
                <div className="p-4 rounded-xl bg-background/50 border border-border/50">
                  <div className="text-4xl font-black text-primary">{formatMoney(netWorth)}</div>
                  <div className="text-sm text-muted-foreground">Final Net Worth</div>
                </div>
                
                <div className={`p-4 rounded-xl bg-background/50 border border-border/50`}>
                  <div className={`text-4xl font-black ${grade.color}`}>{grade.grade}</div>
                  <div className="text-sm text-muted-foreground">{grade.label}</div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="p-3 rounded-lg bg-background/50 border border-border/30">
                    <div className="font-bold text-foreground">{formatMoney(player.investments)}</div>
                    <div className="text-muted-foreground">Investments</div>
                  </div>
                  <div className="p-3 rounded-lg bg-background/50 border border-border/30">
                    <div className="font-bold text-foreground">{formatMoney(player.retirementAccount)}</div>
                    <div className="text-muted-foreground">401k</div>
                  </div>
                  <div className="p-3 rounded-lg bg-background/50 border border-border/30">
                    <div className="font-bold text-foreground">{player.married ? "Yes" : "No"}</div>
                    <div className="text-muted-foreground">Married</div>
                  </div>
                  <div className="p-3 rounded-lg bg-background/50 border border-border/30">
                    <div className="font-bold text-foreground">{player.children}</div>
                    <div className="text-muted-foreground">Children</div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={onClose} variant="outline" className="flex-1">Exit</Button>
                <Button onClick={() => window.location.reload()} className="flex-1">Play Again</Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  // Main Game UI
  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      {/* Header */}
      <div className="border-b border-border/50 bg-gradient-to-r from-card via-card to-primary/5 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={onClose}><ArrowLeft className="w-5 h-5" /></Button>
              <div>
                <h1 className="font-bold text-lg">Financial Life</h1>
                <p className="text-xs text-muted-foreground">{player.jobTitle} • Age {player.age}</p>
              </div>
            </div>
            <Badge variant={marketCondition === "boom" ? "default" : marketCondition === "recession" ? "destructive" : "secondary"}>
              {marketCondition === "boom" ? "📈 Bull Market" : marketCondition === "recession" ? "📉 Recession" : "📊 Stable"}
            </Badge>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 text-center">
              <div className="text-xs text-muted-foreground flex items-center justify-center gap-1"><Wallet className="w-3 h-3" />Net Worth</div>
              <div className={`font-black ${netWorth >= 0 ? 'text-primary' : 'text-destructive'}`}>{formatMoney(netWorth)}</div>
            </div>
            <div className="p-2 rounded-lg bg-muted/30 border border-border/50 text-center">
              <div className="text-xs text-muted-foreground flex items-center justify-center gap-1"><DollarSign className="w-3 h-3" />Cash</div>
              <div className="font-bold text-foreground">{formatMoney(player.cash)}</div>
            </div>
            <div className="p-2 rounded-lg bg-muted/30 border border-border/50 text-center">
              <div className="text-xs text-muted-foreground flex items-center justify-center gap-1"><CreditCard className="w-3 h-3" />Debt</div>
              <div className="font-bold text-destructive">{formatMoney(player.debt)}</div>
            </div>
            <div className="p-2 rounded-lg bg-muted/30 border border-border/50 text-center">
              <div className="text-xs text-muted-foreground flex items-center justify-center gap-1"><Star className="w-3 h-3" />Credit</div>
              <div className="font-bold text-foreground">{player.creditScore}</div>
            </div>
          </div>

          {/* Progress */}
          <div className="mt-3">
            <Progress value={((player.age - 22) / 43) * 100} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Age 22</span>
              <span>Retirement 65</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex flex-col max-w-2xl mx-auto w-full">
        <ScrollArea className="flex-1 p-4">
          {/* Life Log */}
          <div className="space-y-2 mb-4">
            {gameLog.slice(-8).map((log, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`p-3 rounded-lg border text-sm ${
                  log.type === "positive" ? "bg-success/10 border-success/30 text-success" :
                  log.type === "negative" ? "bg-destructive/10 border-destructive/30 text-destructive" :
                  log.type === "milestone" ? "bg-primary/10 border-primary/30 text-primary" :
                  "bg-muted/30 border-border/50 text-muted-foreground"
                }`}
              >
                <span className="font-medium">Age {log.year}:</span> {log.text}
              </motion.div>
            ))}
          </div>

          {/* Current Event */}
          <AnimatePresence mode="wait">
            {currentEvent && (
              <motion.div
                key={currentEvent.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-4"
              >
                <Card className={`p-6 border-2 ${
                  currentEvent.type === "income" ? "border-success/50 bg-gradient-to-br from-success/5 to-card" :
                  currentEvent.type === "expense" ? "border-destructive/50 bg-gradient-to-br from-destructive/5 to-card" :
                  currentEvent.type === "investment" ? "border-primary/50 bg-gradient-to-br from-primary/5 to-card" :
                  currentEvent.type === "market" ? "border-warning/50 bg-gradient-to-br from-warning/5 to-card" :
                  currentEvent.type === "life" ? "border-pink-500/50 bg-gradient-to-br from-pink-500/5 to-card" :
                  "border-border bg-card"
                }`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      currentEvent.type === "income" ? "bg-success/20 text-success" :
                      currentEvent.type === "expense" ? "bg-destructive/20 text-destructive" :
                      currentEvent.type === "investment" ? "bg-primary/20 text-primary" :
                      currentEvent.type === "market" ? "bg-warning/20 text-warning" :
                      currentEvent.type === "life" ? "bg-pink-500/20 text-pink-500" :
                      "bg-muted text-muted-foreground"
                    }`}>
                      {currentEvent.icon}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-foreground">{currentEvent.title}</h2>
                      <p className="text-sm text-muted-foreground">{currentEvent.description}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {currentEvent.choices.map((choice, i) => (
                      <Button
                        key={i}
                        variant="outline"
                        className="w-full justify-between h-auto py-3 px-4 text-left hover:bg-primary/5 hover:border-primary/50 group"
                        onClick={() => handleChoice(choice)}
                      >
                        <span className="font-medium">{choice.text}</span>
                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </Button>
                    ))}
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Quick Stats Panel */}
          {!currentEvent && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Card className="p-4 mb-4 bg-gradient-to-br from-muted/30 to-card">
                <h3 className="font-bold mb-3 text-foreground flex items-center gap-2">
                  <User className="w-4 h-4" /> Your Life at {player.age}
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Job:</span>
                    <span className="font-medium text-foreground">{player.jobTitle}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Salary:</span>
                    <span className="font-medium text-foreground">{formatMoney(player.salary)}/yr</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Invested:</span>
                    <span className="font-medium text-success">{formatMoney(player.investments)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <PiggyBank className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">401k:</span>
                    <span className="font-medium text-primary">{formatMoney(player.retirementAccount)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Home className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Home:</span>
                    <span className="font-medium text-foreground">{player.homeOwner ? formatMoney(player.homeValue) : "Renting"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Family:</span>
                    <span className="font-medium text-foreground">{player.married ? `Married${player.children > 0 ? `, ${player.children} kid${player.children > 1 ? 's' : ''}` : ''}` : "Single"}</span>
                  </div>
                </div>
              </Card>

              <Button onClick={advanceYear} className="w-full h-14 text-lg font-bold gap-2 bg-gradient-to-r from-primary to-primary/80">
                <Calendar className="w-5 h-5" />
                Next Year (Age {player.age + 1})
              </Button>
            </motion.div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
};

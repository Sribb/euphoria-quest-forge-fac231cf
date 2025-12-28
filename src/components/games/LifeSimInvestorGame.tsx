import { useState, useCallback, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  ArrowLeft, TrendingUp, TrendingDown, Briefcase, 
  DollarSign, Trophy, Calendar, Zap, Target, Play, Sparkles, 
  Star, Flame, Heart, Home, Wallet, ChevronRight,
  AlertTriangle, Gift, PiggyBank, Timer, Rocket, Award
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";

interface PlayerState {
  age: number;
  cash: number;
  investments: number;
  salary: number;
  jobTitle: string;
  yearlyInvestmentRate: number; // % of income invested
  totalInvested: number; // Track lifetime contributions
  firstInvestmentAge: number | null;
}

interface LifeEvent {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  type: "invest" | "spend" | "career" | "lesson";
  choices: {
    text: string;
    outcome: string;
    investPercent?: number;
    cashChange?: number;
    salaryChange?: number;
    lesson?: string;
  }[];
}

interface WealthHistory {
  age: number;
  invested: number;
  growth: number;
  total: number;
}

interface LifeSimInvestorGameProps {
  onClose: () => void;
}

const GOAL = 1000000; // $1M goal
const ANNUAL_RETURN = 0.08; // 8% average annual return
const RETIREMENT_AGE = 65;
const START_AGE = 22;

const formatMoney = (amount: number): string => {
  if (Math.abs(amount) >= 1000000) return `$${(amount / 1000000).toFixed(2)}M`;
  if (Math.abs(amount) >= 1000) return `$${(amount / 1000).toFixed(0)}k`;
  return `$${amount.toFixed(0)}`;
};

export const LifeSimInvestorGame = ({ onClose }: LifeSimInvestorGameProps) => {
  const { user } = useAuth();
  const [showTutorial, setShowTutorial] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<LifeEvent | null>(null);
  const [wealthHistory, setWealthHistory] = useState<WealthHistory[]>([]);
  const [comparisonHistory, setComparisonHistory] = useState<WealthHistory[]>([]);
  const [showLesson, setShowLesson] = useState<string | null>(null);
  
  const [player, setPlayer] = useState<PlayerState>({
    age: START_AGE,
    cash: 5000,
    investments: 0,
    salary: 45000,
    jobTitle: "Entry-Level",
    yearlyInvestmentRate: 0,
    totalInvested: 0,
    firstInvestmentAge: null,
  });

  // Calculate compound growth
  const totalWealth = player.cash + player.investments;
  const progressToGoal = Math.min((totalWealth / GOAL) * 100, 100);
  const yearsPlayed = player.age - START_AGE;

  // Generate the "what if you started at 22" comparison
  const generateComparison = useCallback((currentAge: number, monthlyInvestment: number) => {
    const comparison: WealthHistory[] = [];
    let invested = 0;
    let total = 0;
    
    for (let age = START_AGE; age <= currentAge; age++) {
      const yearlyContribution = monthlyInvestment * 12;
      invested += yearlyContribution;
      total = (total + yearlyContribution) * (1 + ANNUAL_RETURN);
      comparison.push({ age, invested, growth: total - invested, total });
    }
    
    return comparison;
  }, []);

  // Generate investment-focused events
  const generateEvent = useCallback((): LifeEvent => {
    const age = player.age;
    const hasInvested = player.investments > 0;
    
    // Early game: Focus on teaching investing basics
    if (age <= 25 && !hasInvested) {
      return {
        id: "first-invest-" + age,
        title: "💡 Your First Paycheck",
        description: `You earned ${formatMoney(player.salary)} this year. Your friend says you should start investing. "Even $200/month can become $500k+ by retirement!"`,
        icon: <PiggyBank className="w-6 h-6" />,
        type: "invest",
        choices: [
          { text: "Start with 20% ($750/mo)", outcome: "Smart! Time is your greatest asset.", investPercent: 20, lesson: "Starting early is the #1 factor in building wealth. A 22-year-old investing $500/mo will have MORE than a 32-year-old investing $1000/mo!" },
          { text: "Start with 10% ($375/mo)", outcome: "Good start! Every bit counts.", investPercent: 10, lesson: "Even small amounts grow huge over time. $375/mo at 8% = $1.1M by 65!" },
          { text: "Just save 5% ($188/mo)", outcome: "Better than nothing, but you're missing out on compound growth.", investPercent: 5, lesson: "Waiting costs you. Each year you delay costs you ~$100k in retirement!" },
          { text: "I'll start later", outcome: "You spent it all. Future you will regret this.", investPercent: 0, lesson: "⚠️ COSTLY MISTAKE: Waiting even 5 years can cost you $300k+ in compound growth!" },
        ]
      };
    }

    // Career growth events
    if (age % 3 === 0 && age <= 45) {
      const raiseAmount = Math.floor(player.salary * 0.15);
      return {
        id: "raise-" + age,
        title: "📈 Promotion Time!",
        description: `You got a ${formatMoney(raiseAmount)}/year raise! What will you do with the extra income?`,
        icon: <Briefcase className="w-6 h-6" />,
        type: "career",
        choices: [
          { text: "Invest the entire raise", outcome: "Lifestyle creep avoided! Your future self thanks you.", salaryChange: raiseAmount, investPercent: Math.min(player.yearlyInvestmentRate + 5, 40), lesson: "The 'raise rule': Invest at least 50% of every raise. You won't miss what you never had!" },
          { text: "Invest half, spend half", outcome: "Balanced approach.", salaryChange: raiseAmount, investPercent: Math.min(player.yearlyInvestmentRate + 2, 35) },
          { text: "Upgrade lifestyle", outcome: "Nice car! But your investment rate stayed flat.", salaryChange: raiseAmount, cashChange: -5000 },
        ]
      };
    }

    // Mid-game: Show compound effects
    if (hasInvested && age >= 30 && age <= 40) {
      const yearsInvested = player.firstInvestmentAge ? age - player.firstInvestmentAge : 0;
      const compoundGrowth = player.investments - player.totalInvested;
      
      if (compoundGrowth > player.totalInvested * 0.3) {
        return {
          id: "compound-lesson-" + age,
          title: "🚀 The Magic is Working!",
          description: `After ${yearsInvested} years, you've contributed ${formatMoney(player.totalInvested)} but your investments are worth ${formatMoney(player.investments)}! That's ${formatMoney(compoundGrowth)} in FREE MONEY from compound growth!`,
          icon: <Sparkles className="w-6 h-6" />,
          type: "lesson",
          choices: [
            { text: "Double down - invest more!", outcome: "Accelerating toward your goal!", investPercent: Math.min(player.yearlyInvestmentRate + 5, 50), lesson: "This is compound interest in action. Your money is now making more money than you do in some months!" },
            { text: "Stay the course", outcome: "Consistency is key.", lesson: "Einstein called compound interest the 8th wonder of the world. You're seeing why!" },
          ]
        };
      }
    }

    // Temptation events - test discipline
    if (Math.random() < 0.3) {
      const temptations: LifeEvent[] = [
        {
          id: "car-" + age,
          title: "🚗 Dream Car",
          description: `A luxury car catches your eye. It's $40,000. You could afford the payments, but it would cut into your investments.`,
          icon: <AlertTriangle className="w-6 h-6" />,
          type: "spend",
          choices: [
            { text: "Buy it (reduce investing)", outcome: "Nice wheels! But your wealth goal just got further away.", investPercent: Math.max(player.yearlyInvestmentRate - 10, 0), cashChange: -10000, lesson: "A $40k car at age 30 could have been $300k+ by retirement if invested instead." },
            { text: "Buy reliable used ($15k)", outcome: "Smart choice! A car is transportation, not an investment.", cashChange: -15000 },
            { text: "Keep current car, invest the difference", outcome: "Future millionaire mindset!", lesson: "The average millionaire drives a 4-year-old car. Wealth is built by spending less than you earn." },
          ]
        },
        {
          id: "vacation-" + age,
          title: "✈️ Luxury Vacation",
          description: `Friends invite you on a $8,000 luxury vacation. You've been working hard...`,
          icon: <Heart className="w-6 h-6" />,
          type: "spend",
          choices: [
            { text: "YOLO! Full luxury trip", outcome: "Amazing memories! But it cost more than money.", cashChange: -8000, investPercent: Math.max(player.yearlyInvestmentRate - 3, 0), lesson: "$8k invested at 30 = $80k at 65. Is one trip worth $80k?" },
            { text: "Budget version ($2k)", outcome: "Still had fun! And kept investing.", cashChange: -2000 },
            { text: "Staycation, invest the rest", outcome: "Delayed gratification = future abundance.", lesson: "Rich people look poor, poor people look rich. Focus on net worth, not appearances." },
          ]
        },
      ];
      return temptations[Math.floor(Math.random() * temptations.length)];
    }

    // Market events
    if (player.investments > 10000 && Math.random() < 0.2) {
      const dropAmount = Math.floor(player.investments * 0.2);
      return {
        id: "market-drop-" + age,
        title: "📉 Market Drops 20%!",
        description: `Your ${formatMoney(player.investments)} portfolio just lost ${formatMoney(dropAmount)}! News is scary. What do you do?`,
        icon: <TrendingDown className="w-6 h-6" />,
        type: "lesson",
        choices: [
          { text: "Panic sell everything", outcome: "You locked in losses. This is the #1 wealth destroyer.", investPercent: 0, cashChange: player.investments * 0.8, lesson: "⚠️ TIME IN the market beats TIMING the market. Those who sold in 2008 missed the 400% recovery!" },
          { text: "Stop investing, wait it out", outcome: "You kept what you had, but missed buying low.", lesson: "Stopping contributions during crashes means missing the best buying opportunities." },
          { text: "Keep investing (buy the dip!)", outcome: "You bought low! This is how wealth is built.", lesson: "✅ Market drops are SALES. The S&P 500 has recovered from every crash in history. Stay the course!" },
        ]
      };
    }

    // Late game: Final push or regret
    if (age >= 50 && totalWealth < GOAL * 0.5) {
      return {
        id: "late-regret-" + age,
        title: "😰 Reality Check",
        description: `At ${age}, you have ${formatMoney(totalWealth)}. The goal is ${formatMoney(GOAL)}. If only you had started earlier...`,
        icon: <Timer className="w-6 h-6" />,
        type: "lesson",
        choices: [
          { text: "Max out investing now!", outcome: "Better late than never, but time is not on your side.", investPercent: 40, lesson: "Starting at 50 means you need to save 3-4x more per month than if you started at 22. Time is the real wealth." },
          { text: "Accept the situation", outcome: "Some wealth is better than none.", lesson: "The best time to plant a tree was 20 years ago. The second best time is now." },
        ]
      };
    }

    // Default: Regular investment decision
    const monthlyInvestment = (player.salary * player.yearlyInvestmentRate / 100) / 12;
    return {
      id: "invest-decision-" + age,
      title: "📊 Annual Investment Review",
      description: `You're investing ${formatMoney(monthlyInvestment)}/month (${player.yearlyInvestmentRate}% of income). Your investments: ${formatMoney(player.investments)}`,
      icon: <TrendingUp className="w-6 h-6" />,
      type: "invest",
      choices: [
        { text: "Increase to " + Math.min(player.yearlyInvestmentRate + 5, 50) + "%", outcome: "Accelerating wealth building!", investPercent: Math.min(player.yearlyInvestmentRate + 5, 50), lesson: "Every 5% increase compounds. At $75k salary, 5% more = $312/mo = $500k+ extra by 65!" },
        { text: "Keep at " + player.yearlyInvestmentRate + "%", outcome: "Steady progress.", investPercent: player.yearlyInvestmentRate },
        { text: "Reduce investing", outcome: "More spending money now, less wealth later.", investPercent: Math.max(player.yearlyInvestmentRate - 5, 0), lesson: "Each % reduction costs you ~$50k+ in compound growth over time." },
      ]
    };
  }, [player]);

  const handleChoice = (choice: LifeEvent["choices"][0]) => {
    if (!currentEvent) return;

    // Show lesson if available
    if (choice.lesson) {
      setShowLesson(choice.lesson);
    }

    // Apply effects
    setPlayer(prev => {
      const updated = { ...prev };
      
      if (choice.investPercent !== undefined) {
        updated.yearlyInvestmentRate = choice.investPercent;
        if (choice.investPercent > 0 && !prev.firstInvestmentAge) {
          updated.firstInvestmentAge = prev.age;
        }
      }
      if (choice.cashChange) updated.cash = Math.max(0, updated.cash + choice.cashChange);
      if (choice.salaryChange) updated.salary = updated.salary + choice.salaryChange;
      
      return updated;
    });

    toast.success(choice.outcome);
    setCurrentEvent(null);
  };

  const advanceYear = () => {
    // If showing lesson, clear it first
    if (showLesson) {
      setShowLesson(null);
    }

    // Apply yearly investment and growth
    setPlayer(prev => {
      const yearlyContribution = (prev.salary * prev.yearlyInvestmentRate / 100);
      const livingExpenses = prev.salary * 0.6; // 60% goes to living
      const cashAfterExpenses = prev.cash + prev.salary - livingExpenses - yearlyContribution;
      
      // Apply compound growth to investments
      const investmentGrowth = prev.investments * ANNUAL_RETURN;
      const newInvestments = prev.investments + yearlyContribution + investmentGrowth;
      
      const newState = {
        ...prev,
        age: prev.age + 1,
        cash: Math.max(0, cashAfterExpenses),
        investments: newInvestments,
        totalInvested: prev.totalInvested + yearlyContribution,
      };

      // Update wealth history
      setWealthHistory(h => [...h, {
        age: newState.age,
        invested: newState.totalInvested,
        growth: newState.investments - newState.totalInvested,
        total: newState.investments
      }]);

      // Generate comparison (if started at 22 with same monthly amount)
      const monthlyAmount = yearlyContribution / 12;
      if (monthlyAmount > 0) {
        setComparisonHistory(generateComparison(newState.age, monthlyAmount));
      }

      return newState;
    });

    // Check win/lose condition
    const newTotal = player.investments + (player.investments * ANNUAL_RETURN) + 
                     (player.salary * player.yearlyInvestmentRate / 100);
    
    if (newTotal >= GOAL) {
      setWon(true);
      setGameOver(true);
      return;
    }

    if (player.age >= RETIREMENT_AGE - 1) {
      setGameOver(true);
      return;
    }

    // Generate next event
    const event = generateEvent();
    setCurrentEvent(event);
  };

  const endGame = async () => {
    const yearsToGoal = won ? player.age - START_AGE : null;
    const score = won 
      ? Math.max(1000 - (yearsToGoal || 43) * 20, 100) // Faster = higher score
      : Math.floor(totalWealth / 10000);
    const coinsEarned = Math.floor(score / 50);

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
    } catch (error) {
      console.error("Error saving game:", error);
    }
  };

  useEffect(() => {
    if (gameOver) {
      endGame();
    }
  }, [gameOver]);

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
                      <Target className="w-10 h-10 text-primary-foreground" />
                    </motion.div>
                    <h1 className="text-3xl font-black text-foreground mb-2">Race to $1 Million</h1>
                    <p className="text-muted-foreground">The earlier you invest, the faster you win!</p>
                  </div>

                  {/* The Core Lesson */}
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }} 
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="p-4 rounded-xl bg-gradient-to-r from-success/20 to-success/5 border border-success/30 mb-6"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <Rocket className="w-6 h-6 text-success" />
                      <span className="font-bold text-lg text-success">The Power of Starting Early</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="p-3 rounded-lg bg-background/50">
                        <div className="text-success font-bold">Start at 22</div>
                        <div className="text-muted-foreground">$500/month → <span className="text-success font-bold">$1.7M</span> by 65</div>
                      </div>
                      <div className="p-3 rounded-lg bg-background/50">
                        <div className="text-destructive font-bold">Start at 32</div>
                        <div className="text-muted-foreground">$500/month → <span className="text-destructive font-bold">$745k</span> by 65</div>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 text-center">
                      <strong>10 years of delay = $1 MILLION less!</strong> Time is your greatest asset.
                    </p>
                  </motion.div>

                  <div className="space-y-3 mb-6">
                    {[
                      { icon: <Target className="w-5 h-5" />, title: "Goal: Reach $1,000,000", description: "Hit the million-dollar mark before retirement at 65", color: "from-primary to-primary/60" },
                      { icon: <Timer className="w-5 h-5" />, title: "Speed Matters", description: "The faster you reach $1M, the higher your score", color: "from-warning to-warning/60" },
                      { icon: <TrendingUp className="w-5 h-5" />, title: "Compound Growth", description: "Your investments grow 8% per year automatically", color: "from-success to-success/60" },
                    ].map((step, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + i * 0.1 }}
                        className="flex items-start gap-3 p-3 rounded-xl bg-background/50 border border-border/30"
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

                  <Button onClick={() => { setShowTutorial(false); advanceYear(); }} className="w-full h-14 text-lg font-bold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg gap-2">
                    <Play className="w-5 h-5" />
                    Start at Age 22
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
    const yearsToGoal = won ? player.age - START_AGE : null;
    return (
      <div className="fixed inset-0 bg-background z-50 overflow-y-auto">
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4 flex items-center justify-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full">
            <Card className={`p-8 text-center border-2 ${won ? 'bg-gradient-to-br from-success/10 to-card border-success/30' : 'bg-gradient-to-br from-card to-muted/20 border-border'}`}>
              {won ? (
                <>
                  <Trophy className="w-20 h-20 mx-auto mb-4 text-success" />
                  <h1 className="text-3xl font-black text-success mb-2">MILLIONAIRE!</h1>
                  <p className="text-muted-foreground mb-4">You reached $1M at age {player.age}!</p>
                  
                  <div className="p-4 rounded-xl bg-success/10 border border-success/30 mb-4">
                    <div className="text-4xl font-black text-success">{yearsToGoal} years</div>
                    <div className="text-sm text-muted-foreground">Time to $1 Million</div>
                  </div>

                  {player.firstInvestmentAge && (
                    <div className="p-3 rounded-lg bg-background/50 border border-border/50 mb-4 text-sm">
                      <span className="text-muted-foreground">Started investing at age </span>
                      <span className="font-bold text-foreground">{player.firstInvestmentAge}</span>
                      {player.firstInvestmentAge <= 23 && (
                        <Badge className="ml-2 bg-success/20 text-success border-success/30">Early Bird!</Badge>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <>
                  <Timer className="w-20 h-20 mx-auto mb-4 text-muted-foreground" />
                  <h1 className="text-3xl font-black text-foreground mb-2">Time's Up!</h1>
                  <p className="text-muted-foreground mb-4">You retired at 65 with {formatMoney(totalWealth)}</p>
                  
                  <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/30 mb-4">
                    <div className="text-2xl font-bold text-destructive">{formatMoney(GOAL - totalWealth)} short</div>
                    <div className="text-sm text-muted-foreground">of the $1M goal</div>
                  </div>

                  {player.firstInvestmentAge && player.firstInvestmentAge > 25 && (
                    <div className="p-3 rounded-lg bg-warning/10 border border-warning/30 mb-4 text-sm">
                      <p className="text-warning">💡 If you had started at 22 instead of {player.firstInvestmentAge}, you would have had an extra <strong>{formatMoney((player.firstInvestmentAge - 22) * 50000)}+</strong> from compound growth!</p>
                    </div>
                  )}
                </>
              )}

              {/* Growth Chart */}
              {wealthHistory.length > 2 && (
                <div className="h-32 mb-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={wealthHistory}>
                      <defs>
                        <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="age" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                      <Tooltip formatter={(v: number) => formatMoney(v)} />
                      <Area type="monotone" dataKey="total" stroke="hsl(var(--primary))" fill="url(#colorTotal)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}

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
  const monthlyInvestment = (player.salary * player.yearlyInvestmentRate / 100) / 12;

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      {/* Header */}
      <div className="border-b border-border/50 bg-gradient-to-r from-card via-card to-primary/5 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={onClose}><ArrowLeft className="w-5 h-5" /></Button>
              <div>
                <h1 className="font-bold text-lg">Race to $1 Million</h1>
                <p className="text-xs text-muted-foreground">Age {player.age} • {player.jobTitle}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-muted-foreground">Investing</div>
              <div className="font-bold text-primary">{formatMoney(monthlyInvestment)}/mo</div>
            </div>
          </div>

          {/* Goal Progress */}
          <div className="mb-2">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground">Progress to $1M</span>
              <span className="font-bold text-primary">{formatMoney(player.investments)}</span>
            </div>
            <div className="relative">
              <Progress value={progressToGoal} className="h-4" />
              <div className="absolute right-0 top-0 h-4 w-0.5 bg-success"></div>
            </div>
            <div className="flex justify-between text-xs mt-1 text-muted-foreground">
              <span>$0</span>
              <span className="text-success font-medium">$1M Goal</span>
            </div>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 rounded-lg bg-muted/30 border border-border/50">
              <div className="text-xs text-muted-foreground">Total Invested</div>
              <div className="font-bold text-foreground">{formatMoney(player.totalInvested)}</div>
            </div>
            <div className="p-2 rounded-lg bg-success/10 border border-success/30">
              <div className="text-xs text-muted-foreground">Compound Growth</div>
              <div className="font-bold text-success">+{formatMoney(player.investments - player.totalInvested)}</div>
            </div>
            <div className="p-2 rounded-lg bg-muted/30 border border-border/50">
              <div className="text-xs text-muted-foreground">Years Left</div>
              <div className="font-bold text-foreground">{RETIREMENT_AGE - player.age}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex flex-col max-w-2xl mx-auto w-full">
        <ScrollArea className="flex-1 p-4">
          {/* Lesson Modal */}
          <AnimatePresence>
            {showLesson && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-4 p-4 rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/30"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <div className="font-bold text-foreground mb-1">💡 Financial Lesson</div>
                    <p className="text-sm text-muted-foreground">{showLesson}</p>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="mt-2 w-full"
                  onClick={() => setShowLesson(null)}
                >
                  Got it!
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Wealth Growth Chart */}
          {wealthHistory.length > 1 && !currentEvent && (
            <Card className="p-4 mb-4 bg-gradient-to-br from-muted/30 to-card">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-sm text-foreground">Your Wealth Journey</h3>
                <Badge variant="outline" className="text-xs">
                  {player.firstInvestmentAge ? `Started at ${player.firstInvestmentAge}` : 'Not investing yet'}
                </Badge>
              </div>
              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={wealthHistory}>
                    <defs>
                      <linearGradient id="colorInvested" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.5}/>
                        <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="age" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                    <Tooltip formatter={(v: number) => formatMoney(v)} />
                    <Area type="monotone" dataKey="invested" stackId="1" stroke="hsl(var(--muted-foreground))" fill="url(#colorInvested)" name="Your Contributions" />
                    <Area type="monotone" dataKey="growth" stackId="1" stroke="hsl(var(--success))" fill="url(#colorGrowth)" name="Compound Growth" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-4 mt-2 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-muted-foreground/30"></div>
                  <span className="text-muted-foreground">Your Money</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-success/50"></div>
                  <span className="text-muted-foreground">Free Growth</span>
                </div>
              </div>
            </Card>
          )}

          {/* Current Event */}
          <AnimatePresence mode="wait">
            {currentEvent && !showLesson && (
              <motion.div
                key={currentEvent.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-4"
              >
                <Card className={`p-6 border-2 ${
                  currentEvent.type === "invest" ? "border-primary/50 bg-gradient-to-br from-primary/5 to-card" :
                  currentEvent.type === "spend" ? "border-warning/50 bg-gradient-to-br from-warning/5 to-card" :
                  currentEvent.type === "lesson" ? "border-success/50 bg-gradient-to-br from-success/5 to-card" :
                  "border-border bg-card"
                }`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      currentEvent.type === "invest" ? "bg-primary/20 text-primary" :
                      currentEvent.type === "spend" ? "bg-warning/20 text-warning" :
                      currentEvent.type === "lesson" ? "bg-success/20 text-success" :
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

          {/* Next Year Button */}
          {!currentEvent && !showLesson && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
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

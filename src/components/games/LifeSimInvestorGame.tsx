import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, TrendingUp, TrendingDown, User, Briefcase, Home, 
  Heart, GraduationCap, DollarSign, AlertTriangle, Trophy, 
  Calendar, Zap, Target, BarChart3, PieChart, Shield, Activity,
  Play, Pause, FastForward, Sparkles, Star, Flame, Clock, Wallet
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart as RePieChart, Pie, Cell, AreaChart, Area } from "recharts";

interface Character {
  name: string;
  age: number;
  career: string;
  salary: number;
  netWorth: number;
  riskTolerance: "conservative" | "moderate" | "aggressive";
  education: string;
  married: boolean;
  children: number;
  homeValue: number;
  mortgage: number;
}

interface Portfolio {
  cash: number;
  stocks: { symbol: string; shares: number; avgCost: number; currentPrice: number }[];
  bonds: { type: string; amount: number; rate: number; maturity: number }[];
  etfs: { symbol: string; shares: number; avgCost: number; currentPrice: number }[];
  realEstate: { type: string; value: number; income: number }[];
}

interface MarketCondition {
  phase: "bull" | "bear" | "sideways" | "crash" | "recovery";
  volatility: number;
  sentiment: number;
  interestRate: number;
}

interface LifeEvent {
  id: string;
  type: "career" | "family" | "emergency" | "opportunity" | "market";
  title: string;
  description: string;
  impact: {
    cash?: number;
    salary?: number;
    expenses?: number;
    riskTolerance?: "conservative" | "moderate" | "aggressive";
    mortgage?: number;
    homeValue?: number;
  };
  choices: {
    text: string;
    outcome: string;
    effect: any;
  }[];
}

interface LifeSimInvestorGameProps {
  onClose: () => void;
}

const INITIAL_STOCKS = [
  { symbol: "AAPL", name: "Apple Inc.", price: 180, volatility: 0.25, sector: "Technology" },
  { symbol: "MSFT", name: "Microsoft", price: 380, volatility: 0.22, sector: "Technology" },
  { symbol: "GOOGL", name: "Alphabet", price: 140, volatility: 0.28, sector: "Technology" },
  { symbol: "AMZN", name: "Amazon", price: 145, volatility: 0.30, sector: "Consumer" },
  { symbol: "TSLA", name: "Tesla", price: 250, volatility: 0.45, sector: "Automotive" },
  { symbol: "NVDA", name: "NVIDIA", price: 495, volatility: 0.35, sector: "Technology" },
  { symbol: "JPM", name: "JPMorgan", price: 145, volatility: 0.20, sector: "Financial" },
  { symbol: "JNJ", name: "J&J", price: 160, volatility: 0.15, sector: "Healthcare" },
];

const INITIAL_ETFS = [
  { symbol: "SPY", name: "S&P 500", price: 450, volatility: 0.15, sector: "Broad Market" },
  { symbol: "QQQ", name: "NASDAQ 100", price: 380, volatility: 0.20, sector: "Technology" },
  { symbol: "VTI", name: "Total Market", price: 230, volatility: 0.16, sector: "Broad Market" },
  { symbol: "AGG", name: "Bond ETF", price: 105, volatility: 0.05, sector: "Fixed Income" },
];

const COLORS = ['hsl(var(--primary))', 'hsl(var(--success))', 'hsl(var(--warning))', 'hsl(var(--destructive))', 'hsl(var(--accent))', '#8b5cf6'];

export const LifeSimInvestorGame = ({ onClose }: LifeSimInvestorGameProps) => {
  const { user } = useAuth();
  const [showTutorial, setShowTutorial] = useState(true);
  
  const [character, setCharacter] = useState<Character>({
    name: "You",
    age: 22,
    career: "Entry-Level Professional",
    salary: 45000,
    netWorth: 5000,
    riskTolerance: "moderate",
    education: "Bachelor's Degree",
    married: false,
    children: 0,
    homeValue: 0,
    mortgage: 0,
  });

  const [portfolio, setPortfolio] = useState<Portfolio>({
    cash: 5000,
    stocks: [],
    bonds: [],
    etfs: [],
    realEstate: [],
  });

  const [market, setMarket] = useState<MarketCondition>({
    phase: "bull",
    volatility: 0.15,
    sentiment: 0.6,
    interestRate: 4.5,
  });

  const [stockPrices, setStockPrices] = useState(
    [...INITIAL_STOCKS, ...INITIAL_ETFS].reduce((acc, stock) => ({ ...acc, [stock.symbol]: stock.price }), {} as Record<string, number>)
  );

  const [year, setYear] = useState(0);
  const [month, setMonth] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1500);
  const [netWorthHistory, setNetWorthHistory] = useState<{ year: number; value: number; month: number }[]>([{ year: 0, month: 0, value: 5000 }]);
  const [currentEvent, setCurrentEvent] = useState<LifeEvent | null>(null);
  const [tradeAmount, setTradeAmount] = useState<number>(1000);
  const [gameScore, setGameScore] = useState(0);
  const [lastEventType, setLastEventType] = useState<string>("");

  // Calculate total portfolio value
  const calculatePortfolioValue = () => {
    const stockValue = portfolio.stocks.reduce((sum, s) => sum + (s.shares * stockPrices[s.symbol]), 0);
    const bondValue = portfolio.bonds.reduce((sum, b) => sum + b.amount, 0);
    const etfValue = portfolio.etfs.reduce((sum, e) => sum + (e.shares * stockPrices[e.symbol]), 0);
    const realEstateValue = portfolio.realEstate.reduce((sum, r) => sum + r.value, 0);
    return portfolio.cash + stockValue + bondValue + etfValue + realEstateValue;
  };

  // Generate life events
  const generateLifeEvent = async (): Promise<LifeEvent | null> => {
    const eventRoll = Math.random() * 100;
    const recentEventTypes = [lastEventType];
    
    if (eventRoll < 15 && !recentEventTypes.includes("career")) {
      setLastEventType("career");
      const careerEvents = [
        {
          id: `promotion-${Date.now()}`,
          type: "career" as const,
          title: "🎯 Promotion Opportunity",
          description: `You've been offered a promotion with a ${Math.floor(Math.random() * 20 + 15)}% salary increase.`,
          impact: { salary: character.salary * 0.25 },
          choices: [
            { text: "Accept Promotion", outcome: "Salary increased! More income for investing.", effect: { salary: character.salary * 0.25 } },
            { text: "Negotiate for More", outcome: "Bold move! Got 30% increase.", effect: { salary: character.salary * 0.3 } },
            { text: "Decline", outcome: "Stayed in role, +$5k bonus.", effect: { cash: 5000 } }
          ]
        },
        {
          id: `job-change-${Date.now()}`,
          type: "career" as const,
          title: "💼 Job Offer",
          description: "A competitor offers 40% higher salary but requires relocation.",
          impact: { salary: character.salary * 0.4 },
          choices: [
            { text: "Accept & Relocate", outcome: "New job! Higher income but relocation costs $15k.", effect: { salary: character.salary * 0.4, cash: -15000 } },
            { text: "Decline", outcome: "Current employer matched offer!", effect: { salary: character.salary * 0.2 } }
          ]
        }
      ];
      return careerEvents[Math.floor(Math.random() * careerEvents.length)];
    }

    if (eventRoll < 35 && !recentEventTypes.includes("market")) {
      setLastEventType("market");
      const marketEvents = [
        {
          id: `market-crash-${Date.now()}`,
          type: "market" as const,
          title: "🔴 MARKET CRASH",
          description: "Black swan event! Markets down 15-25%. What do you do?",
          impact: {},
          choices: [
            { text: "Panic Sell", outcome: "Locked in losses.", effect: { riskTolerance: "conservative" as const, sellAll: true } },
            { text: "Hold & Wait", outcome: "Diamond hands. Markets recover eventually.", effect: {} },
            { text: "Buy the Dip", outcome: "Contrarian play!", effect: { cash: -10000, buyDip: true } }
          ]
        },
        {
          id: `tech-boom-${Date.now()}`,
          type: "market" as const,
          title: "🚀 Tech Boom",
          description: "AI breakthrough! Tech stocks surge 20%.",
          impact: {},
          choices: [
            { text: "Ride the Wave", outcome: "Your tech holdings soared!", effect: { techBoost: true } },
            { text: "Take Profits", outcome: "Sold tech positions, secured gains.", effect: { sellTech: true } },
            { text: "Buy More", outcome: "Doubled down on tech!", effect: { cash: -5000, buyTech: true } }
          ]
        }
      ];
      return marketEvents[Math.floor(Math.random() * marketEvents.length)];
    }

    if (eventRoll < 50 && !recentEventTypes.includes("emergency")) {
      setLastEventType("emergency");
      const emergencyEvents = [
        {
          id: `health-crisis-${Date.now()}`,
          type: "emergency" as const,
          title: "🏥 Health Emergency",
          description: "Unexpected surgery required. Out-of-pocket: $7,500.",
          impact: { cash: -7500 },
          choices: [
            { text: "Pay with Cash", outcome: "Paid $7,500. Emergency fund depleted.", effect: { cash: -7500 } },
            { text: "Liquidate Stocks", outcome: "Sold stocks for medical bills.", effect: { liquidateForEmergency: true } },
            { text: "Payment Plan", outcome: "Monthly payments of $500.", effect: { cash: -500 } }
          ]
        },
        {
          id: `car-repair-${Date.now()}`,
          type: "emergency" as const,
          title: "🚗 Car Breakdown",
          description: "Car transmission failed. $4,000 to fix.",
          impact: { cash: -4000 },
          choices: [
            { text: "Pay Cash", outcome: "Paid with savings.", effect: { cash: -4000 } },
            { text: "Sell Investments", outcome: "Liquidated assets.", effect: { liquidateForEmergency: true } }
          ]
        }
      ];
      return emergencyEvents[Math.floor(Math.random() * emergencyEvents.length)];
    }

    if (eventRoll < 70 && !recentEventTypes.includes("opportunity")) {
      setLastEventType("opportunity");
      const opportunityEvents = [
        {
          id: `windfall-${Date.now()}`,
          type: "opportunity" as const,
          title: "💰 Windfall!",
          description: "Inheritance or bonus! You received $25,000.",
          impact: { cash: 25000 },
          choices: [
            { text: "Invest It All", outcome: "Put $25k to work!", effect: { cash: 25000, investWindfall: true } },
            { text: "Save It", outcome: "Balanced approach.", effect: { cash: 25000 } },
            { text: "Pay Off Debt", outcome: "Paid down mortgage.", effect: { cash: 5000, mortgage: -20000 } }
          ]
        },
        {
          id: `side-hustle-${Date.now()}`,
          type: "opportunity" as const,
          title: "💼 Side Business",
          description: "Friend offers partnership. Invest $15k for $2k/month income.",
          impact: {},
          choices: [
            { text: "Invest", outcome: "Now earning $2k/month passive income!", effect: { cash: -15000, passiveIncome: 2000 } },
            { text: "Pass", outcome: "Stayed focused on day job.", effect: {} }
          ]
        }
      ];
      return opportunityEvents[Math.floor(Math.random() * opportunityEvents.length)];
    }

    if (eventRoll < 85 && !recentEventTypes.includes("family")) {
      setLastEventType("family");
      if (character.age > 25 && !character.married) {
        return {
          id: `marriage-${Date.now()}`,
          type: "family" as const,
          title: "💍 Marriage",
          description: "Your partner proposes! Marriage combines finances.",
          impact: { expenses: 20000 },
          choices: [
            { text: "Get Married", outcome: "Combined income! +$15k net.", effect: { married: true, cash: 15000 } },
            { text: "Stay Single", outcome: "Remained independent.", effect: {} }
          ]
        };
      }
      if (character.married && character.children === 0 && character.age > 28) {
        return {
          id: `children-${Date.now()}`,
          type: "family" as const,
          title: "👶 Starting a Family",
          description: "You're expecting! Childcare costs $1,500/month.",
          impact: { expenses: 1500 },
          choices: [
            { text: "Have Child", outcome: "New family member!", effect: { children: 1, cash: 5000 } },
            { text: "Wait Longer", outcome: "Postponed for financial stability.", effect: {} }
          ]
        };
      }
    }

    return null;
  };

  // Update market conditions
  const updateMarket = () => {
    const rand = Math.random();
    let newPhase = market.phase;
    
    if (rand < 0.05) {
      newPhase = "crash";
      toast.error("🔴 Market Crash!", { description: "Stocks are plummeting!" });
    } else if (rand < 0.15) {
      newPhase = "bear";
    } else if (rand < 0.65) {
      newPhase = "bull";
    } else if (rand < 0.80) {
      newPhase = "sideways";
    } else {
      newPhase = "recovery";
    }

    setMarket({
      phase: newPhase,
      volatility: Math.max(0.05, Math.min(0.5, market.volatility + (Math.random() - 0.5) * 0.1)),
      sentiment: Math.max(-1, Math.min(1, market.sentiment + (Math.random() - 0.5) * 0.2)),
      interestRate: market.interestRate + (Math.random() - 0.5) * 0.5,
    });
  };

  // Update stock prices
  const updateStockPrices = () => {
    const multipliers: Record<string, number> = {
      bull: 1.02,
      bear: 0.98,
      sideways: 1.0,
      crash: 0.85,
      recovery: 1.05,
    };

    const newPrices: Record<string, number> = {};
    const allAssets = [...INITIAL_STOCKS, ...INITIAL_ETFS];
    
    allAssets.forEach(stock => {
      const baseChange = multipliers[market.phase];
      const volatilityFactor = (Math.random() - 0.5) * stock.volatility;
      const sentimentFactor = market.sentiment * 0.01;
      const change = baseChange * (1 + volatilityFactor + sentimentFactor);
      newPrices[stock.symbol] = Math.max(10, stockPrices[stock.symbol] * change);
    });

    setStockPrices(newPrices);
    
    setPortfolio(prev => ({
      ...prev,
      stocks: prev.stocks.map(s => ({ ...s, currentPrice: newPrices[s.symbol] })),
      etfs: prev.etfs.map(e => ({ ...e, currentPrice: newPrices[e.symbol] }))
    }));
  };

  // Advance time
  const advanceTime = async () => {
    const newMonth = month + 1;
    const newYear = month === 11 ? year + 1 : year;
    const newAge = Math.floor(22 + newYear);

    setMonth(newMonth % 12);
    setYear(newYear);

    const monthlyIncome = character.salary / 12;
    const monthlyExpenses = 2000 + (character.children * 500) + (character.mortgage ? 1800 : 1200);
    const netMonthly = monthlyIncome - monthlyExpenses;

    setPortfolio(prev => ({ ...prev, cash: prev.cash + netMonthly }));

    if (newMonth === 0) {
      portfolio.bonds.forEach(bond => {
        const interest = bond.amount * (bond.rate / 100);
        setPortfolio(prev => ({ ...prev, cash: prev.cash + interest }));
      });

      portfolio.realEstate.forEach(re => {
        const income = re.income * 12;
        setPortfolio(prev => ({ ...prev, cash: prev.cash + income }));
      });

      if (character.homeValue > 0) {
        setCharacter(prev => ({ ...prev, homeValue: prev.homeValue * 1.03 }));
      }

      const totalValue = calculatePortfolioValue() + character.homeValue - character.mortgage;
      setNetWorthHistory(prev => [...prev, { year: newYear, month: newMonth, value: totalValue }]);
      setGameScore(prev => prev + Math.floor(totalValue / 10000));
    }

    updateMarket();
    updateStockPrices();

    if (newMonth % 3 === 0 && Math.random() < 0.30 && !currentEvent) {
      const event = await generateLifeEvent();
      if (event) setCurrentEvent(event);
    }

    setCharacter(prev => ({ ...prev, age: newAge }));

    if (newAge >= 65) {
      setIsPlaying(false);
      endGame(calculatePortfolioValue() + character.homeValue - character.mortgage);
    }
  };

  // Handle event choices
  const handleEventChoice = (choice: any) => {
    if (!currentEvent) return;

    if (choice.effect.salary) {
      setCharacter(prev => ({ ...prev, salary: prev.salary + choice.effect.salary }));
    }
    if (choice.effect.cash !== undefined) {
      setPortfolio(prev => ({ ...prev, cash: prev.cash + choice.effect.cash }));
    }
    if (choice.effect.married !== undefined) {
      setCharacter(prev => ({ ...prev, married: choice.effect.married }));
    }
    if (choice.effect.children) {
      setCharacter(prev => ({ ...prev, children: prev.children + choice.effect.children }));
    }
    if (choice.effect.riskTolerance) {
      setCharacter(prev => ({ ...prev, riskTolerance: choice.effect.riskTolerance }));
    }
    if (choice.effect.mortgage) {
      setCharacter(prev => ({ ...prev, mortgage: prev.mortgage + choice.effect.mortgage }));
    }
    if (choice.effect.sellAll) {
      const stockValue = portfolio.stocks.reduce((sum, s) => sum + (s.shares * stockPrices[s.symbol]), 0);
      const etfValue = portfolio.etfs.reduce((sum, e) => sum + (e.shares * stockPrices[e.symbol]), 0);
      setPortfolio(prev => ({ ...prev, cash: prev.cash + stockValue + etfValue, stocks: [], etfs: [] }));
    }
    if (choice.effect.buyDip && portfolio.cash >= 10000) {
      ["AAPL", "MSFT", "GOOGL"].forEach(symbol => {
        const price = stockPrices[symbol];
        const shares = Math.floor(3333 / price);
        buyStock(symbol, shares);
      });
    }
    if (choice.effect.techBoost) {
      const newPrices = { ...stockPrices };
      ["AAPL", "MSFT", "GOOGL", "NVDA", "TSLA"].forEach(symbol => {
        newPrices[symbol] *= 1.2;
      });
      setStockPrices(newPrices);
    }

    toast.success(choice.outcome);
    setCurrentEvent(null);
  };

  // Trading functions
  const buyStock = (symbol: string, customShares?: number) => {
    const price = stockPrices[symbol];
    const shares = customShares || Math.floor(tradeAmount / price);
    const cost = shares * price;

    if (portfolio.cash < cost) {
      toast.error("Insufficient cash!");
      return;
    }

    const existing = portfolio.stocks.find(s => s.symbol === symbol);
    if (existing) {
      const totalShares = existing.shares + shares;
      const avgCost = ((existing.avgCost * existing.shares) + cost) / totalShares;
      setPortfolio(prev => ({
        ...prev,
        cash: prev.cash - cost,
        stocks: prev.stocks.map(s =>
          s.symbol === symbol ? { ...s, shares: totalShares, avgCost, currentPrice: price } : s
        )
      }));
    } else {
      setPortfolio(prev => ({
        ...prev,
        cash: prev.cash - cost,
        stocks: [...prev.stocks, { symbol, shares, avgCost: price, currentPrice: price }]
      }));
    }

    toast.success(`Bought ${shares} ${symbol} @ $${price.toFixed(2)}`);
  };

  const sellStock = (symbol: string) => {
    const holding = portfolio.stocks.find(s => s.symbol === symbol);
    if (!holding) return;

    const value = holding.shares * stockPrices[symbol];
    const profit = value - (holding.shares * holding.avgCost);

    setPortfolio(prev => ({
      ...prev,
      cash: prev.cash + value,
      stocks: prev.stocks.filter(s => s.symbol !== symbol)
    }));

    toast.success(`Sold ${symbol} for $${value.toFixed(0)} (${profit >= 0 ? '+' : ''}$${profit.toFixed(0)})`);
  };

  const buyETF = (symbol: string) => {
    const price = stockPrices[symbol];
    const shares = Math.floor(tradeAmount / price);
    const cost = shares * price;

    if (portfolio.cash < cost) {
      toast.error("Insufficient cash!");
      return;
    }

    const existing = portfolio.etfs.find(e => e.symbol === symbol);
    if (existing) {
      const totalShares = existing.shares + shares;
      const avgCost = ((existing.avgCost * existing.shares) + cost) / totalShares;
      setPortfolio(prev => ({
        ...prev,
        cash: prev.cash - cost,
        etfs: prev.etfs.map(e =>
          e.symbol === symbol ? { ...e, shares: totalShares, avgCost, currentPrice: price } : e
        )
      }));
    } else {
      setPortfolio(prev => ({
        ...prev,
        cash: prev.cash - cost,
        etfs: [...prev.etfs, { symbol, shares, avgCost: price, currentPrice: price }]
      }));
    }

    toast.success(`Bought ${shares} ${symbol} @ $${price.toFixed(2)}`);
  };

  const sellETF = (symbol: string) => {
    const holding = portfolio.etfs.find(e => e.symbol === symbol);
    if (!holding) return;

    const value = holding.shares * stockPrices[symbol];
    setPortfolio(prev => ({
      ...prev,
      cash: prev.cash + value,
      etfs: prev.etfs.filter(e => e.symbol !== symbol)
    }));

    toast.success(`Sold ${symbol} for $${value.toFixed(0)}`);
  };

  const buyBond = () => {
    if (portfolio.cash < 1000) {
      toast.error("Insufficient cash!");
      return;
    }
    setPortfolio(prev => ({
      ...prev,
      cash: prev.cash - 1000,
      bonds: [...prev.bonds, { type: "Corporate Bond", amount: 1000, rate: market.interestRate + 2, maturity: 5 }]
    }));
    toast.success("Purchased $1,000 Bond");
  };

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(advanceTime, speed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, speed, month, year, portfolio, character, stockPrices, market]);

  const endGame = async (finalNetWorth: number) => {
    const coinsEarned = Math.floor(gameScore / 100);
    try {
      if (user?.id) {
        await supabase.from("game_sessions").insert({
          user_id: user.id,
          game_id: "life-sim-investor",
          score: gameScore,
          coins_earned: coinsEarned,
          completed: true,
        });
        await supabase.rpc("increment_coins", { user_id_param: user.id, amount: coinsEarned });
      }
      toast.success(`Game Over! Final Net Worth: $${finalNetWorth.toLocaleString()}. Earned ${coinsEarned} coins!`);
    } catch (error) {
      console.error("Error saving game:", error);
    }
  };

  const totalPortfolioValue = calculatePortfolioValue();
  const netWorth = totalPortfolioValue + character.homeValue - character.mortgage;
  const initialValue = 5000;
  const roi = ((netWorth - initialValue) / initialValue) * 100;

  const portfolioAllocation = [
    { name: "Cash", value: portfolio.cash, color: COLORS[0] },
    { name: "Stocks", value: portfolio.stocks.reduce((sum, s) => sum + (s.shares * stockPrices[s.symbol]), 0), color: COLORS[1] },
    { name: "ETFs", value: portfolio.etfs.reduce((sum, e) => sum + (e.shares * stockPrices[e.symbol]), 0), color: COLORS[2] },
    { name: "Bonds", value: portfolio.bonds.reduce((sum, b) => sum + b.amount, 0), color: COLORS[3] },
    { name: "Real Estate", value: portfolio.realEstate.reduce((sum, r) => sum + r.value, 0), color: COLORS[4] }
  ].filter(item => item.value > 0);

  // Tutorial Screen
  if (showTutorial) {
    return (
      <div className="fixed inset-0 bg-background z-50 overflow-y-auto">
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4">
          <div className="max-w-2xl mx-auto">
            <Button
              variant="ghost"
              onClick={onClose}
              className="mb-4 gap-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Games
            </Button>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative"
            >
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-card via-card to-primary/10 border border-border/50 shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary/20 to-transparent rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-success/20 to-transparent rounded-full blur-2xl" />
                
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
                    <h1 className="text-3xl font-black text-foreground mb-2">Life Simulator</h1>
                    <p className="text-muted-foreground">Build wealth from age 22 to retirement</p>
                  </div>

                  <div className="space-y-4 mb-8">
                    {[
                      {
                        icon: <Calendar className="w-5 h-5" />,
                        title: "Live Your Financial Life",
                        description: "Time passes monthly. Manage income, expenses, and investments.",
                        color: "from-blue-500 to-blue-600"
                      },
                      {
                        icon: <TrendingUp className="w-5 h-5" />,
                        title: "Build Your Portfolio",
                        description: "Invest in stocks, ETFs, bonds, and real estate.",
                        color: "from-success to-emerald-600"
                      },
                      {
                        icon: <Zap className="w-5 h-5" />,
                        title: "Navigate Life Events",
                        description: "Handle career changes, emergencies, and market crashes.",
                        color: "from-warning to-orange-600"
                      },
                      {
                        icon: <Target className="w-5 h-5" />,
                        title: "Reach Retirement",
                        description: "Maximize your net worth by age 65 to win!",
                        color: "from-purple-500 to-purple-600"
                      }
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

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="p-4 rounded-xl bg-primary/10 border border-primary/20 mb-6"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Flame className="w-5 h-5 text-primary" />
                      <span className="font-bold text-foreground">Pro Tips</span>
                    </div>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li className="flex items-center gap-2">
                        <Sparkles className="w-3 h-3 text-warning" />
                        Diversify across asset classes to reduce risk
                      </li>
                      <li className="flex items-center gap-2">
                        <Star className="w-3 h-3 text-warning" />
                        Keep emergency cash for unexpected events
                      </li>
                    </ul>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    <Button
                      onClick={() => setShowTutorial(false)}
                      className="w-full h-14 text-lg font-bold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg gap-2"
                    >
                      <Play className="w-5 h-5" />
                      Start Your Journey
                    </Button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-background z-50 overflow-hidden flex flex-col">
      {/* Top Header */}
      <div className="border-b border-border/50 bg-gradient-to-r from-card via-card to-primary/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-muted">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="font-bold text-lg">Life Simulator</h1>
                <p className="text-xs text-muted-foreground">Age {character.age} • Year {year}</p>
              </div>
            </div>

            {/* Game Controls */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1">
                <Button
                  size="sm"
                  variant={speed === 2000 ? "secondary" : "ghost"}
                  onClick={() => setSpeed(2000)}
                  className="h-8 px-2"
                >
                  <Clock className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant={speed === 1000 ? "secondary" : "ghost"}
                  onClick={() => setSpeed(1000)}
                  className="h-8 px-2"
                >
                  <Play className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant={speed === 500 ? "secondary" : "ghost"}
                  onClick={() => setSpeed(500)}
                  className="h-8 px-2"
                >
                  <FastForward className="w-4 h-4" />
                </Button>
              </div>
              
              <Button
                size="sm"
                variant={isPlaying ? "destructive" : "default"}
                onClick={() => setIsPlaying(!isPlaying)}
                className="gap-2"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isPlaying ? "Pause" : "Play"}
              </Button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-4 gap-3 mt-3">
            <motion.div 
              className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20"
              animate={{ scale: isPlaying ? [1, 1.02, 1] : 1 }}
              transition={{ duration: 1, repeat: isPlaying ? Infinity : 0 }}
            >
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                <Wallet className="w-3 h-3" />
                Net Worth
              </div>
              <div className="text-xl font-black text-primary">${(netWorth / 1000).toFixed(0)}k</div>
            </motion.div>
            
            <div className="p-3 rounded-xl bg-gradient-to-br from-success/10 to-success/5 border border-success/20">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                <TrendingUp className="w-3 h-3" />
                ROI
              </div>
              <div className={`text-xl font-black ${roi >= 0 ? 'text-success' : 'text-destructive'}`}>
                {roi >= 0 ? '+' : ''}{roi.toFixed(0)}%
              </div>
            </div>
            
            <div className="p-3 rounded-xl bg-gradient-to-br from-warning/10 to-warning/5 border border-warning/20">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                <DollarSign className="w-3 h-3" />
                Cash
              </div>
              <div className="text-xl font-black text-warning">${(portfolio.cash / 1000).toFixed(0)}k</div>
            </div>
            
            <div className="p-3 rounded-xl bg-muted/30 border border-border/50">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                <BarChart3 className="w-3 h-3" />
                Market
              </div>
              <Badge variant={market.phase === "crash" ? "destructive" : market.phase === "bull" ? "default" : "secondary"} className="font-bold">
                {market.phase.toUpperCase()}
              </Badge>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-3">
            <Progress value={((character.age - 22) / 43) * 100} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Age 22</span>
              <span>Retirement at 65</span>
            </div>
          </div>
        </div>
      </div>

      {/* Life Event Modal */}
      <AnimatePresence>
        {currentEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`max-w-lg w-full rounded-2xl shadow-2xl overflow-hidden ${
                currentEvent.type === "market" ? "bg-gradient-to-br from-destructive/10 to-card border-destructive/30" :
                currentEvent.type === "opportunity" ? "bg-gradient-to-br from-success/10 to-card border-success/30" :
                currentEvent.type === "emergency" ? "bg-gradient-to-br from-warning/10 to-card border-warning/30" :
                currentEvent.type === "career" ? "bg-gradient-to-br from-primary/10 to-card border-primary/30" :
                "bg-gradient-to-br from-accent/10 to-card border-accent/30"
              } border`}
            >
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    currentEvent.type === "market" ? "bg-destructive/20 text-destructive" :
                    currentEvent.type === "opportunity" ? "bg-success/20 text-success" :
                    currentEvent.type === "emergency" ? "bg-warning/20 text-warning" :
                    currentEvent.type === "career" ? "bg-primary/20 text-primary" :
                    "bg-accent/20 text-accent"
                  }`}>
                    {currentEvent.type === "market" && <TrendingDown className="w-6 h-6" />}
                    {currentEvent.type === "opportunity" && <Zap className="w-6 h-6" />}
                    {currentEvent.type === "emergency" && <AlertTriangle className="w-6 h-6" />}
                    {currentEvent.type === "career" && <Briefcase className="w-6 h-6" />}
                    {currentEvent.type === "family" && <Heart className="w-6 h-6" />}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{currentEvent.title}</h3>
                    <Badge variant="outline" className="capitalize mt-1">{currentEvent.type}</Badge>
                  </div>
                </div>
                
                <p className="text-muted-foreground mb-6">{currentEvent.description}</p>
                
                <div className="space-y-2">
                  {currentEvent.choices.map((choice, idx) => (
                    <Button
                      key={idx}
                      variant={idx === 0 ? "default" : "outline"}
                      className="w-full justify-start text-left h-auto py-3 px-4"
                      onClick={() => handleEventChoice(choice)}
                    >
                      <div>
                        <div className="font-semibold">{choice.text}</div>
                        <div className="text-xs text-muted-foreground">{choice.outcome}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="trade" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4 bg-muted/50">
              <TabsTrigger value="trade" className="gap-2">
                <TrendingUp className="w-4 h-4" />
                Trade
              </TabsTrigger>
              <TabsTrigger value="portfolio" className="gap-2">
                <PieChart className="w-4 h-4" />
                Portfolio
              </TabsTrigger>
              <TabsTrigger value="life" className="gap-2">
                <User className="w-4 h-4" />
                Life
              </TabsTrigger>
              <TabsTrigger value="analytics" className="gap-2">
                <BarChart3 className="w-4 h-4" />
                Analytics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="trade" className="space-y-4">
              {/* Trade Amount */}
              <Card className="p-4 bg-gradient-to-r from-muted/30 to-muted/10 border-border/50">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <label className="text-sm font-medium mb-2 block">Trade Amount</label>
                    <div className="flex gap-2">
                      {[500, 1000, 2500, 5000].map(amount => (
                        <Button
                          key={amount}
                          size="sm"
                          variant={tradeAmount === amount ? "default" : "outline"}
                          onClick={() => setTradeAmount(amount)}
                        >
                          ${amount}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">Available</div>
                    <div className="text-2xl font-bold text-success">${portfolio.cash.toLocaleString()}</div>
                  </div>
                </div>
              </Card>

              {/* Assets Grid */}
              <div className="grid md:grid-cols-2 gap-4">
                {/* Stocks */}
                <Card className="p-4">
                  <h3 className="font-bold mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    Stocks
                  </h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {INITIAL_STOCKS.map((stock) => {
                      const price = stockPrices[stock.symbol];
                      const change = ((price - stock.price) / stock.price) * 100;
                      const holding = portfolio.stocks.find(s => s.symbol === stock.symbol);

                      return (
                        <div key={stock.symbol} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                          <div className="flex-1">
                            <div className="font-bold">{stock.symbol}</div>
                            <div className="text-xs text-muted-foreground">{stock.name}</div>
                            {holding && (
                              <div className="text-xs text-primary mt-1">
                                {holding.shares.toFixed(1)} shares
                              </div>
                            )}
                          </div>
                          <div className="text-right mr-3">
                            <div className="font-bold">${price.toFixed(2)}</div>
                            <div className={`text-xs ${change >= 0 ? 'text-success' : 'text-destructive'}`}>
                              {change >= 0 ? '+' : ''}{change.toFixed(1)}%
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button size="sm" onClick={() => buyStock(stock.symbol)} disabled={portfolio.cash < tradeAmount}>
                              Buy
                            </Button>
                            {holding && (
                              <Button size="sm" variant="outline" onClick={() => sellStock(stock.symbol)}>
                                Sell
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>

                {/* ETFs */}
                <Card className="p-4">
                  <h3 className="font-bold mb-3 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-primary" />
                    ETFs
                  </h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {INITIAL_ETFS.map((etf) => {
                      const price = stockPrices[etf.symbol];
                      const change = ((price - etf.price) / etf.price) * 100;
                      const holding = portfolio.etfs.find(e => e.symbol === etf.symbol);

                      return (
                        <div key={etf.symbol} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                          <div className="flex-1">
                            <div className="font-bold">{etf.symbol}</div>
                            <div className="text-xs text-muted-foreground">{etf.name}</div>
                            {holding && <div className="text-xs text-primary">{holding.shares.toFixed(1)} shares</div>}
                          </div>
                          <div className="text-right mr-3">
                            <div className="font-bold">${price.toFixed(2)}</div>
                            <div className={`text-xs ${change >= 0 ? 'text-success' : 'text-destructive'}`}>
                              {change >= 0 ? '+' : ''}{change.toFixed(1)}%
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button size="sm" onClick={() => buyETF(etf.symbol)} disabled={portfolio.cash < tradeAmount}>
                              Buy
                            </Button>
                            {holding && (
                              <Button size="sm" variant="outline" onClick={() => sellETF(etf.symbol)}>
                                Sell
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Bonds */}
                  <div className="mt-4 pt-4 border-t border-border/50">
                    <h4 className="font-bold mb-2 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-primary" />
                      Bonds
                    </h4>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                      <div>
                        <div className="font-bold">Corporate Bond</div>
                        <div className="text-xs text-muted-foreground">{(market.interestRate + 2).toFixed(1)}% APY • 5yr</div>
                      </div>
                      <Button size="sm" onClick={buyBond} disabled={portfolio.cash < 1000}>
                        Buy $1,000
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="portfolio" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                {/* Allocation Chart */}
                <Card className="p-6">
                  <h3 className="font-bold mb-4 flex items-center gap-2">
                    <PieChart className="w-5 h-5 text-primary" />
                    Allocation
                  </h3>
                  {portfolioAllocation.length > 0 ? (
                    <ResponsiveContainer width="100%" height={220}>
                      <RePieChart>
                        <Pie
                          data={portfolioAllocation}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          dataKey="value"
                          stroke="none"
                        >
                          {portfolioAllocation.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, 'Value']} />
                      </RePieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-48 flex items-center justify-center text-muted-foreground">
                      Start investing to see allocation
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2 mt-4 justify-center">
                    {portfolioAllocation.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span>{item.name}</span>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Holdings List */}
                <Card className="p-6">
                  <h3 className="font-bold mb-4">Holdings</h3>
                  <div className="space-y-2 max-h-72 overflow-y-auto">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-success/10 border border-success/20">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-success" />
                        <span className="font-semibold">Cash</span>
                      </div>
                      <span className="font-bold">${portfolio.cash.toLocaleString()}</span>
                    </div>
                    
                    {portfolio.stocks.map(stock => {
                      const value = stock.shares * stockPrices[stock.symbol];
                      const profit = value - (stock.shares * stock.avgCost);
                      return (
                        <div key={stock.symbol} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                          <div>
                            <div className="font-semibold">{stock.symbol}</div>
                            <div className="text-xs text-muted-foreground">{stock.shares.toFixed(2)} shares</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold">${value.toFixed(0)}</div>
                            <div className={`text-xs ${profit >= 0 ? 'text-success' : 'text-destructive'}`}>
                              {profit >= 0 ? '+' : ''}${profit.toFixed(0)}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    
                    {portfolio.etfs.map(etf => {
                      const value = etf.shares * stockPrices[etf.symbol];
                      return (
                        <div key={etf.symbol} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                          <div>
                            <div className="font-semibold">{etf.symbol} <Badge variant="secondary" className="text-xs">ETF</Badge></div>
                            <div className="text-xs text-muted-foreground">{etf.shares.toFixed(2)} shares</div>
                          </div>
                          <div className="font-bold">${value.toFixed(0)}</div>
                        </div>
                      );
                    })}
                    
                    {portfolio.bonds.map((bond, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                        <div>
                          <div className="font-semibold">{bond.type}</div>
                          <div className="text-xs text-muted-foreground">{bond.rate.toFixed(1)}% APY</div>
                        </div>
                        <div className="font-bold">${bond.amount.toLocaleString()}</div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="life" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Card className="p-6">
                  <h3 className="font-bold mb-4">Personal Info</h3>
                  <div className="space-y-3">
                    {[
                      { icon: User, label: "Age", value: `${character.age} years old` },
                      { icon: Briefcase, label: "Career", value: character.career },
                      { icon: GraduationCap, label: "Education", value: character.education },
                      { icon: Heart, label: "Family", value: `${character.married ? 'Married' : 'Single'}, ${character.children} children` },
                      { icon: Home, label: "Housing", value: character.homeValue > 0 ? `Home: $${(character.homeValue / 1000).toFixed(0)}k` : 'Renting' },
                      { icon: Shield, label: "Risk Profile", value: character.riskTolerance },
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                        <item.icon className="w-5 h-5 text-primary" />
                        <div className="flex-1">
                          <div className="text-xs text-muted-foreground">{item.label}</div>
                          <div className="font-semibold capitalize">{item.value}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="font-bold mb-4">Finances</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 rounded-lg bg-success/10 border border-success/20">
                      <span>Annual Salary</span>
                      <span className="font-bold text-success">${character.salary.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                      <span>Monthly Income</span>
                      <span className="font-bold">${(character.salary / 12).toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                      <span>Monthly Expenses</span>
                      <span className="font-bold text-destructive">
                        ${(2000 + (character.children * 500) + (character.mortgage ? 1800 : 1200)).toLocaleString()}
                      </span>
                    </div>
                    {character.mortgage > 0 && (
                      <div className="flex justify-between items-center p-3 rounded-lg bg-warning/10 border border-warning/20">
                        <span>Mortgage Balance</span>
                        <span className="font-bold text-warning">${character.mortgage.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              {/* Metrics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Card className="p-4 bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20">
                  <Trophy className="w-5 h-5 text-warning mb-2" />
                  <div className="text-2xl font-black text-warning">{gameScore.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">Score</div>
                </Card>
                <Card className="p-4 bg-gradient-to-br from-success/10 to-success/5 border-success/20">
                  <TrendingUp className="w-5 h-5 text-success mb-2" />
                  <div className="text-2xl font-black text-success">{roi.toFixed(0)}%</div>
                  <div className="text-xs text-muted-foreground">Total ROI</div>
                </Card>
                <Card className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                  <Calendar className="w-5 h-5 text-primary mb-2" />
                  <div className="text-2xl font-black text-primary">{year}</div>
                  <div className="text-xs text-muted-foreground">Years Played</div>
                </Card>
                <Card className="p-4 bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
                  <Activity className="w-5 h-5 text-accent mb-2" />
                  <div className="text-2xl font-black text-accent">${(netWorth / 1000).toFixed(0)}k</div>
                  <div className="text-xs text-muted-foreground">Net Worth</div>
                </Card>
              </div>

              {/* Net Worth Chart */}
              <Card className="p-6">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Net Worth Over Time
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={netWorthHistory}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="year" tick={{ fontSize: 12 }} tickFormatter={(v) => `Y${v}`} />
                    <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, 'Net Worth']} />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorValue)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

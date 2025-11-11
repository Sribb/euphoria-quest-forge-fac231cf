import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
  // Import Activity icon at the top
  import { 
    ArrowLeft, TrendingUp, TrendingDown, User, Briefcase, Home, 
    Heart, GraduationCap, DollarSign, AlertTriangle, Trophy, 
    Calendar, Zap, Target, BarChart3, PieChart, Shield, Activity
  } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart as RePieChart, Pie, Cell } from "recharts";

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
  options: { type: "call" | "put"; symbol: string; strike: number; expiry: string; premium: number }[];
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
  { symbol: "MSFT", name: "Microsoft Corp.", price: 380, volatility: 0.22, sector: "Technology" },
  { symbol: "GOOGL", name: "Alphabet Inc.", price: 140, volatility: 0.28, sector: "Technology" },
  { symbol: "AMZN", name: "Amazon.com Inc.", price: 145, volatility: 0.30, sector: "Consumer" },
  { symbol: "TSLA", name: "Tesla Inc.", price: 250, volatility: 0.45, sector: "Automotive" },
  { symbol: "NVDA", name: "NVIDIA Corp.", price: 495, volatility: 0.35, sector: "Technology" },
  { symbol: "JPM", name: "JPMorgan Chase", price: 145, volatility: 0.20, sector: "Financial" },
  { symbol: "JNJ", name: "Johnson & Johnson", price: 160, volatility: 0.15, sector: "Healthcare" },
];

const INITIAL_ETFS = [
  { symbol: "SPY", name: "S&P 500 ETF", price: 450, volatility: 0.15, sector: "Broad Market" },
  { symbol: "QQQ", name: "NASDAQ 100 ETF", price: 380, volatility: 0.20, sector: "Technology" },
  { symbol: "VTI", name: "Total Market ETF", price: 230, volatility: 0.16, sector: "Broad Market" },
  { symbol: "AGG", name: "Bond Aggregate ETF", price: 105, volatility: 0.05, sector: "Fixed Income" },
];

const COLORS = ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444'];

export const LifeSimInvestorGame = ({ onClose }: LifeSimInvestorGameProps) => {
  const { user } = useAuth();
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
    options: [],
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
  const [speed, setSpeed] = useState(1500); // Slower default speed
  const [netWorthHistory, setNetWorthHistory] = useState<{ year: number; value: number; month: number }[]>([{ year: 0, month: 0, value: 5000 }]);
  const [currentEvent, setCurrentEvent] = useState<LifeEvent | null>(null);
  const [tradeAmount, setTradeAmount] = useState<number>(1000);
  const [gameScore, setGameScore] = useState(0);
  const [roi, setRoi] = useState(0);
  const [riskAdjustedReturn, setRiskAdjustedReturn] = useState(0);
  const [eventSurvivalScore, setEventSurvivalScore] = useState(100);
  const [activeTab, setActiveTab] = useState<string>("stocks");
  const [marketNews, setMarketNews] = useState<string[]>([]);
  const [sectorExposure, setSectorExposure] = useState<Record<string, number>>({});
  const [lastEventType, setLastEventType] = useState<string>("");
  const [portfolioAnimation, setPortfolioAnimation] = useState(false);

  // Calculate total portfolio value
  const calculatePortfolioValue = () => {
    const stockValue = portfolio.stocks.reduce((sum, s) => sum + (s.shares * stockPrices[s.symbol]), 0);
    const bondValue = portfolio.bonds.reduce((sum, b) => sum + b.amount, 0);
    const etfValue = portfolio.etfs.reduce((sum, e) => sum + (e.shares * stockPrices[e.symbol]), 0);
    const realEstateValue = portfolio.realEstate.reduce((sum, r) => sum + r.value, 0);
    return portfolio.cash + stockValue + bondValue + etfValue + realEstateValue;
  };

  // Generate diverse life events
  const generateLifeEvent = async (): Promise<LifeEvent | null> => {
    const eventChance = Math.random();
    const eventRoll = Math.random() * 100;
    
    // Prevent repetitive events
    const recentEventTypes = [lastEventType];
    
    // CAREER EVENTS (15% chance)
    if (eventRoll < 15 && !recentEventTypes.includes("career")) {
      setLastEventType("career");
      const careerEvents = [
        {
          id: `promotion-${Date.now()}`,
          type: "career" as const,
          title: "🎯 Promotion Opportunity",
          description: `You've been offered a promotion to Senior ${character.career} with a ${Math.floor(Math.random() * 20 + 15)}% salary increase and more responsibilities.`,
          impact: { salary: character.salary * 0.25 },
          choices: [
            { text: "Accept Promotion", outcome: "Salary increased! More income for investing.", effect: { salary: character.salary * 0.25 } },
            { text: "Negotiate for More", outcome: "Bold move! Got 30% increase.", effect: { salary: character.salary * 0.3 } },
            { text: "Decline - Work/Life Balance", outcome: "Stayed in role, +$5k bonus.", effect: { cash: 5000 } }
          ]
        },
        {
          id: `job-change-${Date.now()}`,
          type: "career" as const,
          title: "💼 Job Offer",
          description: "A competitor offers you a position with 40% higher salary but requires relocation and selling investments.",
          impact: { salary: character.salary * 0.4 },
          choices: [
            { text: "Accept & Relocate", outcome: "New job! Higher income but relocation costs $15k.", effect: { salary: character.salary * 0.4, cash: -15000 } },
            { text: "Decline Offer", outcome: "Stayed put. Current employer matched offer!", effect: { salary: character.salary * 0.2 } }
          ]
        }
      ];
      return careerEvents[Math.floor(Math.random() * careerEvents.length)];
    }

    // MARKET EVENTS (20% chance)
    if (eventRoll < 35 && !recentEventTypes.includes("market")) {
      setLastEventType("market");
      const marketEvents = [
        {
          id: `market-crash-${Date.now()}`,
          type: "market" as const,
          title: "🔴 MARKET CRASH",
          description: "Black swan event! Markets down 15-25%. Your portfolio is bleeding. What do you do?",
          impact: {},
          choices: [
            { text: "Panic Sell Everything", outcome: "Locked in losses. Risk tolerance decreased.", effect: { riskTolerance: "conservative" as const, sellAll: true } },
            { text: "Hold & Wait", outcome: "Diamond hands. Markets recover eventually.", effect: {} },
            { text: "Buy the Dip Aggressively", outcome: "Contrarian play! Invested $10k at discount.", effect: { cash: -10000, buyDip: true } }
          ]
        },
        {
          id: `tech-boom-${Date.now()}`,
          type: "market" as const,
          title: "🚀 Tech Sector Boom",
          description: "AI breakthrough! Tech stocks surge 20%. Are you positioned to benefit?",
          impact: {},
          choices: [
            { text: "Ride the Wave", outcome: "Your tech holdings soared!", effect: { techBoost: true } },
            { text: "Take Profits", outcome: "Sold tech positions, secured gains.", effect: { sellTech: true } },
            { text: "Buy More Tech", outcome: "Doubled down on tech!", effect: { cash: -5000, buyTech: true } }
          ]
        },
        {
          id: `ipo-opportunity-${Date.now()}`,
          type: "market" as const,
          title: "🌟 IPO Opportunity",
          description: "Hot tech startup going public. Pre-IPO shares available at $50. High risk, high reward.",
          impact: {},
          choices: [
            { text: "Invest $10,000", outcome: "Risky bet! Could 3x or lose 50%.", effect: { cash: -10000, ipoShares: 200 } },
            { text: "Pass on IPO", outcome: "Stayed conservative.", effect: {} }
          ]
        },
        {
          id: `stock-split-${Date.now()}`,
          type: "market" as const,
          title: "📊 Stock Split Announcement",
          description: "One of your holdings announced a 3-for-1 split. Share count triples, price adjusts.",
          impact: {},
          choices: [
            { text: "Hold Through Split", outcome: "Shares tripled! More liquidity.", effect: { stockSplit: true } },
            { text: "Sell Before Split", outcome: "Took profits early.", effect: { sellSplit: true } }
          ]
        }
      ];
      return marketEvents[Math.floor(Math.random() * marketEvents.length)];
    }

    // EMERGENCY EVENTS (15% chance)
    if (eventRoll < 50 && !recentEventTypes.includes("emergency")) {
      setLastEventType("emergency");
      const emergencyEvents = [
        {
          id: `health-crisis-${Date.now()}`,
          type: "emergency" as const,
          title: "🏥 Health Emergency",
          description: "Unexpected surgery required. Out-of-pocket costs: $25,000. Insurance covers 70%.",
          impact: { cash: -7500 },
          choices: [
            { text: "Pay with Cash", outcome: "Paid $7,500. Emergency fund depleted.", effect: { cash: -7500 } },
            { text: "Liquidate Stocks", outcome: "Sold stocks for medical bills.", effect: { liquidateForEmergency: true } },
            { text: "Payment Plan", outcome: "Monthly payments of $500 for 18 months.", effect: { expenses: 500, eventScore: -5 } }
          ]
        },
        {
          id: `tax-audit-${Date.now()}`,
          type: "emergency" as const,
          title: "📋 IRS Tax Audit",
          description: "You're being audited. Owe $8,000 in back taxes plus penalties.",
          impact: { cash: -8000 },
          choices: [
            { text: "Pay Immediately", outcome: "Paid $8,000. Ouch.", effect: { cash: -8000 } },
            { text: "Contest Audit", outcome: "Negotiated down to $5,000!", effect: { cash: -5000 } }
          ]
        },
        {
          id: `home-repair-${Date.now()}`,
          type: "emergency" as const,
          title: "🏠 Major Home Repair",
          description: character.homeValue > 0 ? "Foundation damage requires $30,000 repair." : "Car transmission failed. $4,000 to fix.",
          impact: { cash: character.homeValue > 0 ? -30000 : -4000 },
          choices: [
            { text: "Pay Cash", outcome: "Paid with savings.", effect: { cash: character.homeValue > 0 ? -30000 : -4000 } },
            { text: "Home Equity Loan", outcome: "Borrowed against home.", effect: { mortgage: 30000, cash: 0 } },
            { text: "Sell Investments", outcome: "Liquidated assets.", effect: { liquidateForEmergency: true } }
          ]
        }
      ];
      return emergencyEvents[Math.floor(Math.random() * emergencyEvents.length)];
    }

    // OPPORTUNITY EVENTS (20% chance)
    if (eventRoll < 70 && !recentEventTypes.includes("opportunity")) {
      setLastEventType("opportunity");
      const opportunityEvents = [
        {
          id: `windfall-${Date.now()}`,
          type: "opportunity" as const,
          title: "💰 Unexpected Windfall",
          description: "Inheritance, bonus, or lottery win! You received $25,000.",
          impact: { cash: 25000 },
          choices: [
            { text: "Invest It All", outcome: "Put $25k to work in the market!", effect: { cash: 25000, investWindfall: true } },
            { text: "Save 50%, Invest 50%", outcome: "Balanced approach.", effect: { cash: 25000 } },
            { text: "Pay Off Debt", outcome: "Paid down mortgage.", effect: { cash: 5000, mortgage: -20000 } }
          ]
        },
        {
          id: `side-hustle-${Date.now()}`,
          type: "opportunity" as const,
          title: "💼 Side Business Opportunity",
          description: "Friend offers partnership in side business. Invest $15k for 30% stake, projected $2k/month income.",
          impact: {},
          choices: [
            { text: "Invest in Business", outcome: "Now earning $2k/month passive income!", effect: { cash: -15000, expenses: -2000 } },
            { text: "Pass on Opportunity", outcome: "Stayed focused on day job.", effect: {} }
          ]
        },
        {
          id: `real-estate-deal-${Date.now()}`,
          type: "opportunity" as const,
          title: "🏘️ Real Estate Opportunity",
          description: "Distressed property available at $180k, worth $250k. Needs $20k repairs.",
          impact: {},
          choices: [
            { text: "Buy & Flip", outcome: "Invested $200k total. Could profit $50k!", effect: { cash: -200000, realEstateDeal: true } },
            { text: "Pass on Deal", outcome: "Too risky right now.", effect: {} }
          ]
        },
        {
          id: `company-stock-${Date.now()}`,
          type: "opportunity" as const,
          title: "📈 Employee Stock Options",
          description: "Your company offers discounted stock options. Buy $10k worth at 15% discount.",
          impact: {},
          choices: [
            { text: "Buy Options", outcome: "Instant 15% gain + potential upside!", effect: { cash: -10000, companyStock: true } },
            { text: "Decline Options", outcome: "Kept cash liquid.", effect: {} }
          ]
        }
      ];
      return opportunityEvents[Math.floor(Math.random() * opportunityEvents.length)];
    }

    // FAMILY EVENTS (15% chance)
    if (eventRoll < 85 && !recentEventTypes.includes("family")) {
      setLastEventType("family");
      if (character.age > 25 && !character.married) {
        return {
          id: `marriage-${Date.now()}`,
          type: "family" as const,
          title: "💍 Marriage Proposal",
          description: "Your partner proposes! Marriage combines finances and brings dual income.",
          impact: { expenses: 20000 },
          choices: [
            { text: "Get Married", outcome: "Combined income! +$40k cash but wedding costs $25k.", effect: { married: true, cash: 15000 } },
            { text: "Stay Single", outcome: "Remained independent.", effect: {} }
          ]
        };
      }
      if (character.married && character.children === 0 && character.age > 28) {
        return {
          id: `children-${Date.now()}`,
          type: "family" as const,
          title: "👶 Starting a Family",
          description: "You're expecting! Childcare costs $1,500/month but tax benefits help.",
          impact: { expenses: 1500 },
          choices: [
            { text: "Have Child", outcome: "New family member! Higher expenses but immeasurable joy.", effect: { children: 1, expenses: 1500, cash: 5000 } },
            { text: "Wait Longer", outcome: "Postponed for financial stability.", effect: {} }
          ]
        };
      }
    }

    // SOCIAL EVENTS (10% chance)
    if (eventRoll < 95 && !recentEventTypes.includes("social")) {
      setLastEventType("social");
      const socialEvents = [
        {
          id: `network-event-${Date.now()}`,
          type: "opportunity" as const,
          title: "🤝 Networking Event",
          description: "Industry conference could lead to better job opportunities. Costs $3,000 to attend.",
          impact: {},
          choices: [
            { text: "Attend Conference", outcome: "Made valuable connections! Job offer incoming.", effect: { cash: -3000, networking: true } },
            { text: "Skip Event", outcome: "Saved money, missed opportunities.", effect: {} }
          ]
        },
        {
          id: `charity-${Date.now()}`,
          type: "opportunity" as const,
          title: "❤️ Charity Opportunity",
          description: "Major charity event. Donate $5,000 for tax write-off and good karma.",
          impact: {},
          choices: [
            { text: "Donate $5,000", outcome: "Tax deduction + positive impact!", effect: { cash: -5000, eventScore: 10 } },
            { text: "Donate $1,000", outcome: "Modest contribution.", effect: { cash: -1000, eventScore: 3 } },
            { text: "Pass This Time", outcome: "Kept funds for investing.", effect: {} }
          ]
        }
      ];
      return socialEvents[Math.floor(Math.random() * socialEvents.length)];
    }

    // RECESSION EVENT (5% chance)
    if (eventRoll >= 95 && market.phase === "bear") {
      setLastEventType("market");
      return {
        id: `recession-${Date.now()}`,
        type: "market" as const,
        title: "📉 RECESSION WARNING",
        description: "Economy entering recession. Layoffs increasing, portfolio down 20%. Your job at risk.",
        impact: {},
        choices: [
          { text: "Emergency Cash Mode", outcome: "Liquidated 50% of portfolio, kept job.", effect: { liquidateHalf: true } },
          { text: "Stay Invested", outcome: "Held positions. Lost job, unemployment for 6 months.", effect: { salary: -character.salary * 0.5, eventScore: -15 } },
          { text: "Hedge with Puts", outcome: "Bought protection. Limited downside.", effect: { cash: -3000, hedge: true } }
        ]
      };
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

    const volatilityChange = (Math.random() - 0.5) * 0.1;
    const sentimentChange = (Math.random() - 0.5) * 0.2;

    setMarket({
      phase: newPhase,
      volatility: Math.max(0.05, Math.min(0.5, market.volatility + volatilityChange)),
      sentiment: Math.max(-1, Math.min(1, market.sentiment + sentimentChange)),
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
    
    // Update portfolio current prices
    setPortfolio(prev => ({
      ...prev,
      stocks: prev.stocks.map(s => ({ ...s, currentPrice: newPrices[s.symbol] })),
      etfs: prev.etfs.map(e => ({ ...e, currentPrice: newPrices[e.symbol] }))
    }));

    // Generate market news occasionally
    if (Math.random() < 0.2) {
      generateMarketNews();
    }
  };

  // Generate market news and earnings
  const generateMarketNews = () => {
    const newsTypes = [
      `${INITIAL_STOCKS[Math.floor(Math.random() * INITIAL_STOCKS.length)].name} reports strong earnings, stock rallies`,
      `Federal Reserve ${Math.random() > 0.5 ? 'raises' : 'cuts'} interest rates by 0.25%`,
      `${market.phase === 'bull' ? 'Bull market continues' : 'Market correction underway'} as investors ${market.sentiment > 0 ? 'remain optimistic' : 'grow cautious'}`,
      `Tech sector ${Math.random() > 0.5 ? 'outperforms' : 'underperforms'} broader market`,
      `Economic data shows ${Math.random() > 0.5 ? 'stronger than expected' : 'weaker than expected'} growth`
    ];
    
    const news = newsTypes[Math.floor(Math.random() * newsTypes.length)];
    setMarketNews(prev => [news, ...prev.slice(0, 4)]);
  };

  // Age character and progress time
  const advanceTime = async () => {
    const newMonth = month + 1;
    const newYear = month === 11 ? year + 1 : year;
    const newAge = Math.floor(22 + newYear);

    setMonth(newMonth % 12);
    setYear(newYear);

    // Monthly income
    const monthlyIncome = character.salary / 12;
    const monthlyExpenses = 2000 + (character.children * 500) + (character.mortgage ? 1800 : 1200);
    const netMonthly = monthlyIncome - monthlyExpenses;

    setPortfolio(prev => ({ ...prev, cash: prev.cash + netMonthly }));

    // Update investments (bonds interest, real estate appreciation)
    if (newMonth === 0) {
      // Annual updates
      portfolio.bonds.forEach(bond => {
        const interest = bond.amount * (bond.rate / 100);
        setPortfolio(prev => ({ ...prev, cash: prev.cash + interest }));
      });

      portfolio.realEstate.forEach(re => {
        const income = re.income * 12;
        setPortfolio(prev => ({ ...prev, cash: prev.cash + income }));
      });

      // Home appreciation
      if (character.homeValue > 0) {
        const appreciation = character.homeValue * 0.03;
        setCharacter(prev => ({ ...prev, homeValue: prev.homeValue + appreciation }));
      }

      // Track net worth monthly
      const totalValue = calculatePortfolioValue() + character.homeValue - character.mortgage;
      setNetWorthHistory(prev => [...prev, { year: newYear, month: newMonth, value: totalValue }]);
      
      // Calculate ROI and Risk-Adjusted Return
      const initialValue = 5000;
      const currentValue = totalValue;
      const roiCalc = ((currentValue - initialValue) / initialValue) * 100;
      setRoi(roiCalc);
      
      const volatilityPenalty = market.volatility * 10;
      const riskAdjusted = roiCalc / (1 + volatilityPenalty);
      setRiskAdjustedReturn(riskAdjusted);
      
      // Calculate score
      const scoreIncrease = Math.floor(totalValue / 10000);
      setGameScore(prev => prev + scoreIncrease);
    }

    // Update market monthly
    updateMarket();
    updateStockPrices();

    // Generate life events - quarterly instead of random
    // Events trigger every 3 months (quarter) with 30% chance
    if (newMonth % 3 === 0 && Math.random() < 0.30 && !currentEvent) {
      const event = await generateLifeEvent();
      if (event) setCurrentEvent(event);
    }

    setCharacter(prev => ({ ...prev, age: newAge }));

    // Check retirement
    if (newAge >= 65) {
      setIsPlaying(false);
      endGame(calculatePortfolioValue() + character.homeValue - character.mortgage);
    }
  };

  // Handle event choices with enhanced effects
  const handleEventChoice = (choice: any) => {
    if (!currentEvent) return;

    // Update event survival score
    const eventImpact = choice.effect.eventScore || 0;
    setEventSurvivalScore(prev => Math.max(0, Math.min(100, prev + eventImpact)));

    // Salary changes
    if (choice.effect.salary) {
      setCharacter(prev => ({ ...prev, salary: prev.salary + choice.effect.salary }));
    }

    // Cash changes
    if (choice.effect.cash !== undefined) {
      setPortfolio(prev => ({ ...prev, cash: prev.cash + choice.effect.cash }));
      triggerPortfolioAnimation();
    }

    // Marriage
    if (choice.effect.married !== undefined) {
      setCharacter(prev => ({ ...prev, married: choice.effect.married }));
    }

    // Children
    if (choice.effect.children) {
      setCharacter(prev => ({ ...prev, children: prev.children + choice.effect.children }));
    }

    // Risk tolerance
    if (choice.effect.riskTolerance) {
      setCharacter(prev => ({ ...prev, riskTolerance: choice.effect.riskTolerance }));
    }

    // Home value and mortgage
    if (choice.effect.homeValue) {
      setCharacter(prev => ({
        ...prev,
        homeValue: choice.effect.homeValue,
        mortgage: choice.effect.mortgage || prev.mortgage
      }));
    }

    if (choice.effect.mortgage) {
      setCharacter(prev => ({ ...prev, mortgage: prev.mortgage + choice.effect.mortgage }));
    }

    // Expenses
    if (choice.effect.expenses) {
      // Store recurring expenses separately if needed
    }

    // Sell all stocks
    if (choice.effect.sellAll) {
      const stockValue = portfolio.stocks.reduce((sum, s) => sum + (s.shares * stockPrices[s.symbol]), 0);
      const etfValue = portfolio.etfs.reduce((sum, e) => sum + (e.shares * stockPrices[e.symbol]), 0);
      setPortfolio(prev => ({
        ...prev,
        cash: prev.cash + stockValue + etfValue,
        stocks: [],
        etfs: []
      }));
      triggerPortfolioAnimation();
    }

    // Buy dip
    if (choice.effect.buyDip && portfolio.cash >= 10000) {
      // Distribute across quality stocks
      const qualityStocks = ["AAPL", "MSFT", "GOOGL"];
      qualityStocks.forEach(symbol => {
        const price = stockPrices[symbol];
        const shares = Math.floor(3333 / price);
        buyStock(symbol, shares);
      });
    }

    // Tech boost
    if (choice.effect.techBoost) {
      // Boost tech stock prices by 20%
      const newPrices = { ...stockPrices };
      ["AAPL", "MSFT", "GOOGL", "NVDA", "TSLA"].forEach(symbol => {
        newPrices[symbol] *= 1.2;
      });
      setStockPrices(newPrices);
      updatePortfolioPrices(newPrices);
      triggerPortfolioAnimation();
    }

    // Sell tech
    if (choice.effect.sellTech) {
      portfolio.stocks.filter(s => ["AAPL", "MSFT", "GOOGL", "NVDA", "TSLA"].includes(s.symbol)).forEach(stock => {
        sellStock(stock.symbol);
      });
    }

    // Liquidate for emergency
    if (choice.effect.liquidateForEmergency) {
      const neededCash = Math.abs(currentEvent.impact.cash || 7500);
      let liquidated = 0;
      const sortedStocks = [...portfolio.stocks].sort((a, b) => {
        const profitA = (stockPrices[a.symbol] - a.avgCost) / a.avgCost;
        const profitB = (stockPrices[b.symbol] - b.avgCost) / b.avgCost;
        return profitB - profitA; // Sell winners first
      });

      for (const stock of sortedStocks) {
        if (liquidated >= neededCash) break;
        const value = stock.shares * stockPrices[stock.symbol];
        sellStock(stock.symbol);
        liquidated += value;
      }
      triggerPortfolioAnimation();
    }

    // Liquidate half
    if (choice.effect.liquidateHalf) {
      const halfStocks = portfolio.stocks.slice(0, Math.ceil(portfolio.stocks.length / 2));
      halfStocks.forEach(stock => sellStock(stock.symbol));
      triggerPortfolioAnimation();
    }

    toast.success(choice.outcome);
    setCurrentEvent(null);
  };

  const triggerPortfolioAnimation = () => {
    setPortfolioAnimation(true);
    setTimeout(() => setPortfolioAnimation(false), 1000);
  };

  const updatePortfolioPrices = (newPrices: Record<string, number>) => {
    setPortfolio(prev => ({
      ...prev,
      stocks: prev.stocks.map(s => ({ ...s, currentPrice: newPrices[s.symbol] })),
      etfs: prev.etfs.map(e => ({ ...e, currentPrice: newPrices[e.symbol] }))
    }));
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
          s.symbol === symbol
            ? { ...s, shares: totalShares, avgCost, currentPrice: price }
            : s
        )
      }));
    } else {
      setPortfolio(prev => ({
        ...prev,
        cash: prev.cash - cost,
        stocks: [...prev.stocks, { symbol, shares, avgCost: price, currentPrice: price }]
      }));
    }

    updateSectorExposure();
    triggerPortfolioAnimation();
    toast.success(`Bought ${shares} shares of ${symbol} for $${cost.toFixed(2)}`);
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

    updateSectorExposure();
    triggerPortfolioAnimation();
    toast.success(`Sold ${symbol} for $${value.toFixed(2)}. Profit: $${profit.toFixed(2)}`);
  };

  const updateSectorExposure = () => {
    const exposure: Record<string, number> = {};
    const totalValue = calculatePortfolioValue();

    portfolio.stocks.forEach(stock => {
      const stockInfo = INITIAL_STOCKS.find(s => s.symbol === stock.symbol);
      if (stockInfo) {
        const value = stock.shares * stockPrices[stock.symbol];
        const sector = stockInfo.sector;
        exposure[sector] = (exposure[sector] || 0) + (value / totalValue) * 100;
      }
    });

    setSectorExposure(exposure);
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
          e.symbol === symbol
            ? { ...e, shares: totalShares, avgCost, currentPrice: price }
            : e
        )
      }));
    } else {
      setPortfolio(prev => ({
        ...prev,
        cash: prev.cash - cost,
        etfs: [...prev.etfs, { symbol, shares, avgCost: price, currentPrice: price }]
      }));
    }

    toast.success(`Bought ${shares} shares of ${symbol} ETF for $${cost.toFixed(2)}`);
  };

  const sellETF = (symbol: string) => {
    const holding = portfolio.etfs.find(e => e.symbol === symbol);
    if (!holding) return;

    const value = holding.shares * stockPrices[symbol];
    const profit = value - (holding.shares * holding.avgCost);

    setPortfolio(prev => ({
      ...prev,
      cash: prev.cash + value,
      etfs: prev.etfs.filter(e => e.symbol !== symbol)
    }));

    toast.success(`Sold ${symbol} ETF for $${value.toFixed(2)}. Profit: $${profit.toFixed(2)}`);
  };

  const buyOption = (symbol: string, type: "call" | "put") => {
    const underlyingPrice = stockPrices[symbol];
    const strike = type === "call" ? underlyingPrice * 1.05 : underlyingPrice * 0.95;
    const premium = underlyingPrice * 0.05; // 5% of stock price
    
    if (portfolio.cash < premium * 100) { // Options are for 100 shares
      toast.error("Insufficient cash!");
      return;
    }

    const cost = premium * 100;
    const expiry = `${year + 1}-${month + 1}`;

    setPortfolio(prev => ({
      ...prev,
      cash: prev.cash - cost,
      options: [...prev.options, { type, symbol, strike, expiry, premium }]
    }));

    toast.success(`Bought ${type.toUpperCase()} option on ${symbol} for $${cost.toFixed(2)}`);
  };

  const buyBond = () => {
    const amount = 1000;
    if (portfolio.cash < amount) {
      toast.error("Insufficient cash!");
      return;
    }

    setPortfolio(prev => ({
      ...prev,
      cash: prev.cash - amount,
      bonds: [...prev.bonds, { type: "Corporate Bond", amount, rate: market.interestRate + 2, maturity: 5 }]
    }));

    toast.success("Purchased $1,000 Corporate Bond");
  };

  const buyRealEstate = () => {
    const cost = 150000;
    if (portfolio.cash < cost) {
      toast.error("Insufficient cash for investment property!");
      return;
    }

    setPortfolio(prev => ({
      ...prev,
      cash: prev.cash - cost,
      realEstate: [...prev.realEstate, { type: "Rental Property", value: cost, income: 1200 }]
    }));

    toast.success("Purchased investment property generating $1,200/month rent!");
  };

  // Game control
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(advanceTime, speed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, speed, month, year]);

  // Update sector exposure when portfolio changes
  useEffect(() => {
    updateSectorExposure();
  }, [portfolio.stocks, stockPrices]);

  const endGame = async (finalNetWorth: number) => {
    const coinsEarned = Math.floor(gameScore / 100);
    
    try {
      await supabase.from("game_sessions").insert({
        user_id: user?.id,
        game_id: "life-sim-investor",
        score: gameScore,
        coins_earned: coinsEarned,
        completed: true,
      });

      await supabase.rpc("increment_coins", {
        user_id_param: user?.id,
        amount: coinsEarned,
      });

      toast.success(`Game Over! Final Net Worth: $${finalNetWorth.toLocaleString()}. Earned ${coinsEarned} coins!`);
    } catch (error) {
      console.error("Error saving game:", error);
    }
  };

  const portfolioAllocation = [
    { name: "Cash", value: portfolio.cash },
    { name: "Stocks", value: portfolio.stocks.reduce((sum, s) => sum + (s.shares * stockPrices[s.symbol]), 0) },
    { name: "Bonds", value: portfolio.bonds.reduce((sum, b) => sum + b.amount, 0) },
    { name: "ETFs", value: portfolio.etfs.reduce((sum, e) => sum + (e.shares * stockPrices[e.symbol]), 0) },
    { name: "Real Estate", value: portfolio.realEstate.reduce((sum, r) => sum + r.value, 0) + character.homeValue }
  ].filter(item => item.value > 0);

  const totalPortfolioValue = calculatePortfolioValue();
  const netWorth = totalPortfolioValue + character.homeValue - character.mortgage;

  return (
    <div className="min-h-screen bg-background p-4 pb-24">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Badge variant="outline">Score: {gameScore}</Badge>
            <Button
              size="sm"
              variant={isPlaying ? "destructive" : "default"}
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? "Pause" : "Play"}
            </Button>
          </div>
        </div>

        <Card className="p-6 bg-gradient-accent border-0">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Age</div>
              <div className="text-2xl font-bold">{character.age}</div>
              <div className="text-xs">Year {year}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Career</div>
              <div className="text-lg font-semibold">{character.career}</div>
              <div className="text-xs text-success">${(character.salary / 1000).toFixed(0)}k/year</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Net Worth</div>
              <div className="text-2xl font-bold text-primary">${(netWorth / 1000).toFixed(0)}k</div>
              <div className="text-xs">Portfolio: ${(totalPortfolioValue / 1000).toFixed(0)}k</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Market</div>
              <Badge variant={market.phase === "crash" ? "destructive" : market.phase === "bull" ? "default" : "secondary"}>
                {market.phase.toUpperCase()}
              </Badge>
              <div className="text-xs mt-1">Vol: {(market.volatility * 100).toFixed(0)}%</div>
            </div>
          </div>

          <Progress value={((character.age - 22) / 43) * 100} className="mt-4" />
          <div className="text-xs text-muted-foreground text-center mt-1">
            Progress to Retirement (Age 65)
          </div>
        </Card>
      </div>

      {/* Life Event Modal - Enhanced with visual distinction */}
      {currentEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <Card className={`max-w-lg w-full p-6 animate-scale-in shadow-2xl ${
            currentEvent.type === "market" ? "border-destructive/50 bg-destructive/5" :
            currentEvent.type === "opportunity" ? "border-success/50 bg-success/5" :
            currentEvent.type === "emergency" ? "border-warning/50 bg-warning/5" :
            currentEvent.type === "career" ? "border-primary/50 bg-primary/5" :
            "border-accent/50 bg-accent/5"
          }`}>
            <div className="flex items-center gap-3 mb-4">
              {currentEvent.type === "market" && <TrendingDown className="w-7 h-7 text-destructive animate-pulse" />}
              {currentEvent.type === "opportunity" && <Zap className="w-7 h-7 text-success animate-pulse" />}
              {currentEvent.type === "emergency" && <AlertTriangle className="w-7 h-7 text-warning animate-pulse" />}
              {currentEvent.type === "career" && <Briefcase className="w-7 h-7 text-primary animate-pulse" />}
              {currentEvent.type === "family" && <Heart className="w-7 h-7 text-accent animate-pulse" />}
              <div className="flex-1">
                <h3 className="text-xl font-bold">{currentEvent.title}</h3>
                <Badge variant="outline" className="mt-1 capitalize">
                  {currentEvent.type} Event
                </Badge>
              </div>
            </div>
            <p className="text-muted-foreground mb-6 text-sm leading-relaxed">{currentEvent.description}</p>
            <div className="space-y-3">
              {currentEvent.choices.map((choice, idx) => (
                <Button
                  key={idx}
                  variant={idx === 0 ? "default" : "outline"}
                  className="w-full justify-start text-left h-auto py-4 hover:scale-[1.02] transition-transform"
                  onClick={() => handleEventChoice(choice)}
                >
                  <div className="w-full">
                    <div className="font-semibold mb-1 flex items-center gap-2">
                      {idx === 0 && <Target className="w-4 h-4" />}
                      {choice.text}
                    </div>
                    <div className="text-xs text-muted-foreground leading-relaxed">{choice.outcome}</div>
                  </div>
                </Button>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        <Tabs defaultValue="portfolio" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="trade">Trade</TabsTrigger>
            <TabsTrigger value="life">Life</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="portfolio" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Card className={`p-6 transition-all duration-500 ${portfolioAnimation ? 'ring-2 ring-primary shadow-lg scale-[1.02]' : ''}`}>
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-primary" />
                  Portfolio Allocation
                </h3>
                {portfolioAllocation.length > 0 ? (
                  <ResponsiveContainer width="100%" height={200}>
                    <RePieChart>
                      <Pie
                        data={portfolioAllocation}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) => `${entry.name}: $${(entry.value / 1000).toFixed(0)}k (${((entry.value / totalPortfolioValue) * 100).toFixed(1)}%)`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {portfolioAllocation.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, 'Value']} />
                    </RePieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    Start investing to build your portfolio
                  </div>
                )}
              </Card>

              <Card className="p-6">
                <h3 className="font-bold mb-4">Holdings</h3>
                <div className="space-y-3 max-h-[250px] overflow-y-auto">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-success" />
                      <span className="font-semibold">Cash</span>
                    </div>
                    <span className="font-bold">${portfolio.cash.toLocaleString()}</span>
                  </div>
                  {portfolio.stocks.map((stock) => {
                    const currentValue = stock.shares * stockPrices[stock.symbol];
                    const profit = currentValue - (stock.shares * stock.avgCost);
                    const profitPercent = (profit / (stock.shares * stock.avgCost)) * 100;

                    return (
                      <div key={stock.symbol} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div>
                          <div className="font-semibold flex items-center gap-2">
                            {stock.symbol}
                            <Badge variant="outline" className="text-xs">Stock</Badge>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {stock.shares.toFixed(2)} shares @ ${stock.avgCost.toFixed(2)}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">${currentValue.toFixed(0)}</div>
                          <div className={`text-xs ${profit >= 0 ? 'text-success' : 'text-destructive'}`}>
                            {profit >= 0 ? '+' : ''}{profitPercent.toFixed(1)}%
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {portfolio.etfs.map((etf) => {
                    const currentValue = etf.shares * stockPrices[etf.symbol];
                    const profit = currentValue - (etf.shares * etf.avgCost);
                    const profitPercent = (profit / (etf.shares * etf.avgCost)) * 100;

                    return (
                      <div key={etf.symbol} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div>
                          <div className="font-semibold flex items-center gap-2">
                            {etf.symbol}
                            <Badge variant="secondary" className="text-xs">ETF</Badge>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {etf.shares.toFixed(2)} shares @ ${etf.avgCost.toFixed(2)}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">${currentValue.toFixed(0)}</div>
                          <div className={`text-xs ${profit >= 0 ? 'text-success' : 'text-destructive'}`}>
                            {profit >= 0 ? '+' : ''}{profitPercent.toFixed(1)}%
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {portfolio.options.map((option, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <div className="font-semibold flex items-center gap-2">
                          {option.symbol} {option.type.toUpperCase()}
                          <Badge variant="destructive" className="text-xs">Option</Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Strike ${option.strike.toFixed(2)} • Exp: {option.expiry}
                        </div>
                      </div>
                      <div className="font-bold">${(option.premium * 100).toFixed(0)}</div>
                    </div>
                  ))}
                  {portfolio.bonds.map((bond, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <div className="font-semibold flex items-center gap-2">
                          {bond.type}
                          <Badge variant="default" className="text-xs">Bond</Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {bond.rate.toFixed(2)}% APY, {bond.maturity}yr
                        </div>
                      </div>
                      <div className="font-bold">${bond.amount.toLocaleString()}</div>
                    </div>
                  ))}
                  {portfolio.realEstate.map((prop, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <div className="font-semibold flex items-center gap-2">
                          {prop.type}
                          <Badge className="text-xs">Real Estate</Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          ${prop.income}/month income
                        </div>
                      </div>
                      <div className="font-bold">${prop.value.toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="trade" className="space-y-4">
            {/* Trade Amount Input */}
            <Card className="p-4 bg-gradient-accent">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <label className="text-sm font-semibold mb-2 block">Trade Amount</label>
                  <input
                    type="number"
                    value={tradeAmount}
                    onChange={(e) => setTradeAmount(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full px-3 py-2 bg-background border rounded-lg"
                    min="0"
                    step="100"
                  />
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Available Cash</div>
                  <div className="text-xl font-bold text-success">${portfolio.cash.toLocaleString()}</div>
                </div>
              </div>
            </Card>

            {/* Market News */}
            {marketNews.length > 0 && (
              <Card className="p-4">
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-warning" />
                  Market News
                </h3>
                <div className="space-y-2">
                  {marketNews.map((news, idx) => (
                    <div key={idx} className="text-sm text-muted-foreground p-2 bg-muted rounded">
                      {news}
                    </div>
                  ))}
                </div>
              </Card>
            )}

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="stocks">Stocks</TabsTrigger>
                <TabsTrigger value="etfs">ETFs</TabsTrigger>
                <TabsTrigger value="options">Options</TabsTrigger>
                <TabsTrigger value="bonds">Bonds</TabsTrigger>
                <TabsTrigger value="realestate">Real Estate</TabsTrigger>
              </TabsList>

              <TabsContent value="stocks" className="space-y-3 mt-4">
                {INITIAL_STOCKS.map((stock) => {
                  const price = stockPrices[stock.symbol];
                  const change = ((price - stock.price) / stock.price) * 100;
                  const holding = portfolio.stocks.find(s => s.symbol === stock.symbol);

                  return (
                    <Card key={stock.symbol} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="font-bold text-lg">{stock.symbol}</div>
                          <div className="text-sm text-muted-foreground">{stock.name}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {stock.sector} • Vol: {(stock.volatility * 100).toFixed(0)}%
                          </div>
                          {holding && (
                            <div className="text-xs text-primary mt-1">
                              Holding: {holding.shares} shares @ ${holding.avgCost.toFixed(2)}
                            </div>
                          )}
                        </div>
                        <div className="text-right mr-4">
                          <div className="text-xl font-bold">${price.toFixed(2)}</div>
                          <div className={`text-sm flex items-center gap-1 justify-end ${change >= 0 ? 'text-success' : 'text-destructive'}`}>
                            {change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                            {change >= 0 ? '+' : ''}{change.toFixed(2)}%
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button size="sm" variant="default" onClick={() => buyStock(stock.symbol)}>
                            Buy
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => sellStock(stock.symbol)}
                            disabled={!holding}
                          >
                            Sell
                          </Button>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </TabsContent>

              <TabsContent value="etfs" className="space-y-3 mt-4">
                {INITIAL_ETFS.map((etf) => {
                  const price = stockPrices[etf.symbol];
                  const change = ((price - etf.price) / etf.price) * 100;
                  const holding = portfolio.etfs.find(e => e.symbol === etf.symbol);

                  return (
                    <Card key={etf.symbol} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="font-bold text-lg">{etf.symbol}</div>
                          <div className="text-sm text-muted-foreground">{etf.name}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {etf.sector} • Vol: {(etf.volatility * 100).toFixed(0)}%
                          </div>
                          {holding && (
                            <div className="text-xs text-primary mt-1">
                              Holding: {holding.shares} shares @ ${holding.avgCost.toFixed(2)}
                            </div>
                          )}
                        </div>
                        <div className="text-right mr-4">
                          <div className="text-xl font-bold">${price.toFixed(2)}</div>
                          <div className={`text-sm flex items-center gap-1 justify-end ${change >= 0 ? 'text-success' : 'text-destructive'}`}>
                            {change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                            {change >= 0 ? '+' : ''}{change.toFixed(2)}%
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button size="sm" variant="default" onClick={() => buyETF(etf.symbol)}>
                            Buy
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => sellETF(etf.symbol)}
                            disabled={!holding}
                          >
                            Sell
                          </Button>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </TabsContent>

              <TabsContent value="options" className="space-y-3 mt-4">
                <div className="p-4 bg-muted/50 rounded-lg mb-4">
                  <p className="text-sm text-muted-foreground">
                    Options are contracts giving you the right to buy (CALL) or sell (PUT) stocks at a set price. 
                    High risk, high reward strategy. Premium cost = 5% of stock price × 100 shares.
                  </p>
                </div>
                {INITIAL_STOCKS.slice(0, 5).map((stock) => {
                  const price = stockPrices[stock.symbol];
                  const callStrike = price * 1.05;
                  const putStrike = price * 0.95;
                  const premium = price * 0.05;

                  return (
                    <Card key={stock.symbol} className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <div className="font-bold text-lg">{stock.symbol}</div>
                          <div className="text-sm text-muted-foreground">Current: ${price.toFixed(2)}</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-success/10 rounded-lg">
                          <div className="text-xs text-muted-foreground mb-1">CALL Option</div>
                          <div className="text-sm font-semibold">Strike: ${callStrike.toFixed(2)}</div>
                          <div className="text-xs text-muted-foreground">Cost: ${(premium * 100).toFixed(0)}</div>
                          <Button 
                            size="sm" 
                            className="w-full mt-2" 
                            variant="outline"
                            onClick={() => buyOption(stock.symbol, "call")}
                          >
                            Buy CALL
                          </Button>
                        </div>
                        <div className="p-3 bg-destructive/10 rounded-lg">
                          <div className="text-xs text-muted-foreground mb-1">PUT Option</div>
                          <div className="text-sm font-semibold">Strike: ${putStrike.toFixed(2)}</div>
                          <div className="text-xs text-muted-foreground">Cost: ${(premium * 100).toFixed(0)}</div>
                          <Button 
                            size="sm" 
                            className="w-full mt-2" 
                            variant="outline"
                            onClick={() => buyOption(stock.symbol, "put")}
                          >
                            Buy PUT
                          </Button>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </TabsContent>

              <TabsContent value="bonds" className="space-y-3 mt-4">
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-lg">Corporate Bonds</h3>
                      <p className="text-sm text-muted-foreground">
                        Fixed income security with {(market.interestRate + 2).toFixed(2)}% annual return
                      </p>
                    </div>
                    <Shield className="w-8 h-8 text-primary" />
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Face Value:</span>
                      <span className="font-semibold">$1,000</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Interest Rate:</span>
                      <span className="font-semibold text-success">{(market.interestRate + 2).toFixed(2)}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Maturity:</span>
                      <span className="font-semibold">5 years</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Risk:</span>
                      <span className="font-semibold text-success">Low</span>
                    </div>
                  </div>
                  <Button onClick={buyBond} disabled={portfolio.cash < 1000} className="w-full">
                    Purchase Bond ($1,000)
                  </Button>
                </Card>
              </TabsContent>

              <TabsContent value="realestate" className="space-y-3 mt-4">
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-lg">Investment Property</h3>
                      <p className="text-sm text-muted-foreground">
                        Rental property generating monthly passive income
                      </p>
                    </div>
                    <Home className="w-8 h-8 text-primary" />
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Purchase Price:</span>
                      <span className="font-semibold">$150,000</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Monthly Rent:</span>
                      <span className="font-semibold text-success">$1,200</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Annual Yield:</span>
                      <span className="font-semibold text-success">9.6%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Appreciation:</span>
                      <span className="font-semibold">~3% per year</span>
                    </div>
                  </div>
                  <Button onClick={buyRealEstate} disabled={portfolio.cash < 150000} className="w-full">
                    Purchase Property ($150,000)
                  </Button>
                </Card>

                {portfolio.realEstate.length > 0 && (
                  <Card className="p-4">
                    <h4 className="font-semibold mb-3">Your Properties</h4>
                    <div className="space-y-2">
                      {portfolio.realEstate.map((prop, idx) => (
                        <div key={idx} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                          <div>
                            <div className="font-semibold">{prop.type}</div>
                            <div className="text-xs text-muted-foreground">
                              ${prop.income}/month rent
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold">${prop.value.toLocaleString()}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="life" className="space-y-4">
            <Card className="p-6">
              <h3 className="font-bold mb-4">Life Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <User className="w-5 h-5 text-primary" />
                    <div>
                      <div className="font-semibold">Age</div>
                      <div className="text-sm text-muted-foreground">{character.age} years old</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <Briefcase className="w-5 h-5 text-primary" />
                    <div>
                      <div className="font-semibold">Career</div>
                      <div className="text-sm text-muted-foreground">{character.career}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <GraduationCap className="w-5 h-5 text-primary" />
                    <div>
                      <div className="font-semibold">Education</div>
                      <div className="text-sm text-muted-foreground">{character.education}</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <Heart className="w-5 h-5 text-primary" />
                    <div>
                      <div className="font-semibold">Family</div>
                      <div className="text-sm text-muted-foreground">
                        {character.married ? 'Married' : 'Single'}, {character.children} children
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <Home className="w-5 h-5 text-primary" />
                    <div>
                      <div className="font-semibold">Housing</div>
                      <div className="text-sm text-muted-foreground">
                        {character.homeValue > 0 ? `Home: $${(character.homeValue / 1000).toFixed(0)}k` : 'Renting'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <Shield className="w-5 h-5 text-primary" />
                    <div>
                      <div className="font-semibold">Risk Profile</div>
                      <div className="text-sm text-muted-foreground capitalize">{character.riskTolerance}</div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-bold mb-4">Financial Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <span className="text-muted-foreground">Annual Salary</span>
                  <span className="font-bold text-success">${character.salary.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <span className="text-muted-foreground">Monthly Income</span>
                  <span className="font-bold text-success">${(character.salary / 12).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <span className="text-muted-foreground">Monthly Expenses</span>
                  <span className="font-bold text-destructive">
                    ${(2000 + (character.children * 500) + (character.mortgage ? 1800 : 1200)).toLocaleString()}
                  </span>
                </div>
                {character.mortgage > 0 && (
                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <span className="text-muted-foreground">Mortgage Balance</span>
                    <span className="font-bold text-warning">${character.mortgage.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            {/* Enhanced Metrics Grid */}
            <div className="grid md:grid-cols-4 gap-4 mb-4">
              <Card className="p-6 bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20">
                <div className="flex items-center gap-3 mb-2">
                  <Trophy className="w-6 h-6 text-warning" />
                  <h4 className="font-semibold">Score</h4>
                </div>
                <div className="text-3xl font-bold text-warning">{gameScore.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">Total game score</p>
              </Card>
              
              <Card className="p-6 bg-gradient-to-br from-success/10 to-success/5 border-success/20">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="w-6 h-6 text-success" />
                  <h4 className="font-semibold">ROI</h4>
                </div>
                <div className="text-3xl font-bold text-success">{roi.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground mt-1">Return on investment</p>
              </Card>
              
              <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                <div className="flex items-center gap-3 mb-2">
                  <Target className="w-6 h-6 text-primary" />
                  <h4 className="font-semibold">Risk-Adjusted</h4>
                </div>
                <div className="text-3xl font-bold text-primary">{riskAdjustedReturn.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground mt-1">Risk-adjusted return</p>
              </Card>
              
              <Card className="p-6 bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
                <div className="flex items-center gap-3 mb-2">
                  <Shield className="w-6 h-6 text-accent" />
                  <h4 className="font-semibold">Event Survival</h4>
                </div>
                <div className="text-3xl font-bold text-accent">{eventSurvivalScore}</div>
                <p className="text-xs text-muted-foreground mt-1">Event handling score</p>
              </Card>
            </div>

            <Card className="p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Net Worth Growth Over Time
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={netWorthHistory}>
                  <XAxis 
                    dataKey={(entry) => `Y${entry.year}`} 
                    className="text-xs"
                  />
                  <YAxis 
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                    className="text-xs"
                  />
                  <Tooltip 
                    formatter={(value: number) => [`$${value.toLocaleString()}`, 'Net Worth']}
                    labelFormatter={(label) => `Year ${label.slice(1)}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3} 
                    dot={{ fill: 'hsl(var(--primary))', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <div className="grid md:grid-cols-2 gap-4">
              <Card className="p-6">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-primary" />
                  Sector Exposure
                </h3>
                {Object.keys(sectorExposure).length > 0 ? (
                  <div className="space-y-3">
                    {Object.entries(sectorExposure).map(([sector, percent]) => (
                      <div key={sector}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium">{sector}</span>
                          <span className="text-muted-foreground">{percent.toFixed(1)}%</span>
                        </div>
                        <Progress value={percent} className="h-2" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    No stock holdings yet
                  </div>
                )}
              </Card>

              <Card className="p-6">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  Performance Summary
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <span className="text-sm text-muted-foreground">Years Played</span>
                    <span className="font-bold">{year}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <span className="text-sm text-muted-foreground">Current Age</span>
                    <span className="font-bold">{character.age}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <span className="text-sm text-muted-foreground">Market Phase</span>
                    <Badge variant={market.phase === "crash" ? "destructive" : market.phase === "bull" ? "default" : "secondary"}>
                      {market.phase.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <span className="text-sm text-muted-foreground">Portfolio Value</span>
                    <span className="font-bold text-primary">${(totalPortfolioValue / 1000).toFixed(0)}k</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <span className="text-sm text-muted-foreground">Net Worth</span>
                    <span className="font-bold text-success">${(netWorth / 1000).toFixed(0)}k</span>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
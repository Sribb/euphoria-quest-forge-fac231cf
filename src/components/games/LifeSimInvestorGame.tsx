import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, TrendingUp, TrendingDown, User, Briefcase, Home, 
  Heart, GraduationCap, DollarSign, AlertTriangle, Trophy, 
  Calendar, Zap, Target, BarChart3, PieChart, Shield
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
  { symbol: "AAPL", price: 180, volatility: 0.25 },
  { symbol: "MSFT", price: 380, volatility: 0.22 },
  { symbol: "GOOGL", price: 140, volatility: 0.28 },
  { symbol: "AMZN", price: 145, volatility: 0.30 },
  { symbol: "TSLA", price: 250, volatility: 0.45 },
  { symbol: "NVDA", price: 495, volatility: 0.35 },
  { symbol: "JPM", price: 145, volatility: 0.20 },
  { symbol: "JNJ", price: 160, volatility: 0.15 },
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
    INITIAL_STOCKS.reduce((acc, stock) => ({ ...acc, [stock.symbol]: stock.price }), {} as Record<string, number>)
  );

  const [year, setYear] = useState(0);
  const [month, setMonth] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [netWorthHistory, setNetWorthHistory] = useState<{ year: number; value: number }[]>([{ year: 0, value: 5000 }]);
  const [currentEvent, setCurrentEvent] = useState<LifeEvent | null>(null);
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  const [tradeAmount, setTradeAmount] = useState<number>(100);
  const [gameScore, setGameScore] = useState(0);

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
    const eventChance = Math.random();
    
    if (eventChance < 0.3) {
      // Career events
      if (character.age % 5 === 0 && character.age < 60) {
        return {
          id: `career-${Date.now()}`,
          type: "career",
          title: "Promotion Opportunity",
          description: `Your manager offers you a promotion to Senior ${character.career}. This would increase your salary significantly but requires more responsibility.`,
          impact: { salary: character.salary * 0.3 },
          choices: [
            {
              text: "Accept Promotion",
              outcome: "Your salary increased! More income to invest.",
              effect: { salary: character.salary * 0.3 }
            },
            {
              text: "Decline - Focus on Investing",
              outcome: "You stayed in your role to focus on growing your portfolio.",
              effect: { cash: 5000 }
            }
          ]
        };
      }
    }

    if (eventChance < 0.5 && character.age > 25 && !character.married) {
      return {
        id: `family-${Date.now()}`,
        type: "family",
        title: "Marriage Decision",
        description: "Your partner proposes marriage. This will combine finances and affect your financial planning.",
        impact: { expenses: 20000 },
        choices: [
          {
            text: "Get Married",
            outcome: "Combined finances! +$30,000 but wedding costs $20,000.",
            effect: { married: true, cash: 10000 }
          },
          {
            text: "Stay Single",
            outcome: "You remain financially independent.",
            effect: {}
          }
        ]
      };
    }

    if (eventChance < 0.65 && market.phase === "crash") {
      return {
        id: `market-${Date.now()}`,
        type: "market",
        title: "🔴 MARKET CRASH!",
        description: "The stock market is plummeting! Your portfolio is down significantly. What's your strategy?",
        impact: {},
        choices: [
          {
            text: "Panic Sell Everything",
            outcome: "You locked in major losses. Emotional decisions cost you.",
            effect: { riskTolerance: "conservative" }
          },
          {
            text: "Hold and Wait",
            outcome: "You stayed calm. Markets recover over time.",
            effect: {}
          },
          {
            text: "Buy the Dip",
            outcome: "Contrarian investing! You bought quality assets cheap.",
            effect: { cash: -5000 }
          }
        ]
      };
    }

    if (eventChance < 0.75) {
      return {
        id: `emergency-${Date.now()}`,
        type: "emergency",
        title: "Unexpected Expense",
        description: character.homeValue > 0 ? "Your home needs a $15,000 roof repair." : "Your car broke down. Repair costs $3,000.",
        impact: { cash: character.homeValue > 0 ? -15000 : -3000 },
        choices: [
          {
            text: "Pay with Cash",
            outcome: "You paid outright. Emergency fund depleted.",
            effect: { cash: character.homeValue > 0 ? -15000 : -3000 }
          },
          {
            text: "Sell Investments",
            outcome: "You liquidated stocks to cover costs.",
            effect: { sellStocks: true }
          },
          {
            text: "Take Out Loan",
            outcome: "You borrowed money. Interest will add up.",
            effect: { cash: -500, expenses: 200 }
          }
        ]
      };
    }

    if (eventChance < 0.9 && character.age > 30 && character.homeValue === 0) {
      return {
        id: `opportunity-${Date.now()}`,
        type: "opportunity",
        title: "Buy Your First Home",
        description: "A nice house is available for $350,000. This is a major financial decision.",
        impact: { mortgage: 280000 },
        choices: [
          {
            text: "Buy Home (20% Down)",
            outcome: "You're a homeowner! Building equity but monthly mortgage payments.",
            effect: { homeValue: 350000, mortgage: 280000, cash: -70000, expenses: 1800 }
          },
          {
            text: "Keep Renting",
            outcome: "You stayed flexible. More capital for investing.",
            effect: {}
          }
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
    INITIAL_STOCKS.forEach(stock => {
      const baseChange = multipliers[market.phase];
      const volatilityFactor = (Math.random() - 0.5) * stock.volatility;
      const sentimentFactor = market.sentiment * 0.01;
      
      const change = baseChange * (1 + volatilityFactor + sentimentFactor);
      newPrices[stock.symbol] = Math.max(10, stockPrices[stock.symbol] * change);
    });

    setStockPrices(newPrices);
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

      // Track net worth
      const totalValue = calculatePortfolioValue() + character.homeValue - character.mortgage;
      setNetWorthHistory(prev => [...prev, { year: newYear, value: totalValue }]);
      
      // Calculate score
      const scoreIncrease = Math.floor(totalValue / 10000);
      setGameScore(prev => prev + scoreIncrease);
    }

    // Update market monthly
    updateMarket();
    updateStockPrices();

    // Generate life events
    if (Math.random() < 0.15 && !currentEvent) {
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
    if (choice.effect.riskTolerance) {
      setCharacter(prev => ({ ...prev, riskTolerance: choice.effect.riskTolerance }));
    }
    if (choice.effect.homeValue) {
      setCharacter(prev => ({
        ...prev,
        homeValue: choice.effect.homeValue,
        mortgage: choice.effect.mortgage
      }));
    }
    if (choice.effect.sellStocks) {
      const stockValue = portfolio.stocks.reduce((sum, s) => sum + (s.shares * stockPrices[s.symbol]), 0) * 0.3;
      setPortfolio(prev => ({
        ...prev,
        cash: prev.cash + stockValue,
        stocks: prev.stocks.map(s => ({ ...s, shares: s.shares * 0.7 }))
      }));
    }

    toast.success(choice.outcome);
    setCurrentEvent(null);
  };

  // Trading functions
  const buyStock = (symbol: string) => {
    const price = stockPrices[symbol];
    const shares = Math.floor(tradeAmount / price);
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

    toast.success(`Sold ${symbol} for $${value.toFixed(2)}. Profit: $${profit.toFixed(2)}`);
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

  // Game control
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(advanceTime, speed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, speed, month, year]);

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

      {/* Life Event Modal */}
      {currentEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-lg w-full p-6 animate-scale-in">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-warning" />
              <h3 className="text-xl font-bold">{currentEvent.title}</h3>
            </div>
            <p className="text-muted-foreground mb-6">{currentEvent.description}</p>
            <div className="space-y-3">
              {currentEvent.choices.map((choice, idx) => (
                <Button
                  key={idx}
                  variant="outline"
                  className="w-full justify-start text-left h-auto py-3"
                  onClick={() => handleEventChoice(choice)}
                >
                  <div>
                    <div className="font-semibold">{choice.text}</div>
                    <div className="text-xs text-muted-foreground mt-1">{choice.outcome}</div>
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
              <Card className="p-6">
                <h3 className="font-bold mb-4">Portfolio Allocation</h3>
                {portfolioAllocation.length > 0 ? (
                  <ResponsiveContainer width="100%" height={200}>
                    <RePieChart>
                      <Pie
                        data={portfolioAllocation}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) => `${entry.name}: $${(entry.value / 1000).toFixed(0)}k`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {portfolioAllocation.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
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
                          <div className="font-semibold">{stock.symbol}</div>
                          <div className="text-xs text-muted-foreground">
                            {stock.shares} shares @ ${stock.avgCost.toFixed(2)}
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
                  {portfolio.bonds.map((bond, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <div className="font-semibold">{bond.type}</div>
                        <div className="text-xs text-muted-foreground">
                          {bond.rate}% APY, {bond.maturity}yr
                        </div>
                      </div>
                      <div className="font-bold">${bond.amount.toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="trade" className="space-y-4">
            <Card className="p-6">
              <h3 className="font-bold mb-4">Stock Market</h3>
              <div className="space-y-3">
                {INITIAL_STOCKS.map((stock) => {
                  const price = stockPrices[stock.symbol];
                  const change = ((price - stock.price) / stock.price) * 100;

                  return (
                    <div key={stock.symbol} className="flex items-center justify-between p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
                      <div className="flex-1">
                        <div className="font-bold">{stock.symbol}</div>
                        <div className="text-sm text-muted-foreground">
                          Volatility: {(stock.volatility * 100).toFixed(0)}%
                        </div>
                      </div>
                      <div className="text-right mr-4">
                        <div className="font-bold">${price.toFixed(2)}</div>
                        <div className={`text-sm flex items-center gap-1 ${change >= 0 ? 'text-success' : 'text-destructive'}`}>
                          {change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          {change >= 0 ? '+' : ''}{change.toFixed(2)}%
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="default" onClick={() => buyStock(stock.symbol)}>
                          Buy
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => sellStock(stock.symbol)}
                          disabled={!portfolio.stocks.find(s => s.symbol === stock.symbol)}
                        >
                          Sell
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 p-4 bg-card border rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">Bonds & Fixed Income</h4>
                    <p className="text-sm text-muted-foreground">Safe, steady returns</p>
                  </div>
                  <Button onClick={buyBond} disabled={portfolio.cash < 1000}>
                    Buy Bond ($1,000)
                  </Button>
                </div>
              </div>
            </Card>
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
            <Card className="p-6">
              <h3 className="font-bold mb-4">Net Worth Growth</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={netWorthHistory}>
                  <XAxis dataKey="year" />
                  <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                  <Line type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <div className="grid md:grid-cols-3 gap-4">
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Trophy className="w-5 h-5 text-warning" />
                  <h4 className="font-semibold">Score</h4>
                </div>
                <div className="text-3xl font-bold">{gameScore.toLocaleString()}</div>
              </Card>
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Target className="w-5 h-5 text-success" />
                  <h4 className="font-semibold">ROI</h4>
                </div>
                <div className="text-3xl font-bold text-success">
                  {(((netWorth - 5000) / 5000) * 100).toFixed(1)}%
                </div>
              </Card>
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  <h4 className="font-semibold">Years Played</h4>
                </div>
                <div className="text-3xl font-bold">{year}</div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
import { useState, useEffect, useMemo } from "react";
import { Brain, TrendingUp, TrendingDown, Activity, Trophy, X, DollarSign, BarChart3, HelpCircle, ArrowLeft, Zap, Target, Shield, Flame, Clock, Calendar, Star, Award } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { useAIMarket } from "@/hooks/useAIMarket";
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { motion } from "framer-motion";

interface AICompetitorGameProps {
  onClose: () => void;
}

interface Trader {
  id: string;
  name: string;
  capital: number;
  initialCapital: number;
  strategy: string;
  strategyDetails: TradingStyle;
  trades: number;
  winRate: number;
  lastAction?: string;
  lastTradeTime?: number;
  holdings: Record<string, { shares: number; avgPrice: number }>;
}

interface StockPrice {
  symbol: string;
  price: number;
  change: number;
}

type Difficulty = 'easy' | 'medium' | 'hard';

interface DifficultySettings {
  label: string;
  description: string;
  gameDuration: number;
  tradeCooldown: number;
  aiTradeInterval: number;
  aiSkillMultiplier: number;
  startingCapital: number;
  color: string;
  icon: React.ReactNode;
}

interface TradingStyle {
  id: string;
  name: string;
  description: string;
  extremeDescription: string;
  icon: React.ReactNode;
  color: string;
  tradeDecision: (prices: StockPrice[], holdings: Record<string, { shares: number; avgPrice: number }>, capital: number) => TradeDecision | null;
}

interface TradeDecision {
  action: 'buy' | 'sell';
  symbol: string;
  shares: number;
}

interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  condition: (userStats: { trades: number; capital: number; holdings: Record<string, any>; rank: number }) => boolean;
  reward: string;
  icon: React.ReactNode;
}

// ============== TUTORIAL STEPS ==============
const TUTORIAL_STEPS = [
  {
    title: "Welcome to AI Competitor Challenge!",
    content: "Compete against 4 AI traders with unique investing personalities. Your goal: outperform them all and finish #1 on the leaderboard!",
    highlight: "intro",
  },
  {
    title: "Extreme AI Personalities",
    content: "Each AI trader follows an extreme investing style. Some are ultra-aggressive day traders, others are patient value hunters. Learn their patterns to outsmart them!",
    highlight: "styles",
  },
  {
    title: "Live Stock Market",
    content: "Watch real-time price movements across 6 stocks. Prices fluctuate every 2 seconds. Use these movements to your advantage!",
    highlight: "stocks",
  },
  {
    title: "Trading Mechanics",
    content: "Click a stock to select it, then BUY or SELL. There's a cooldown between trades to encourage thoughtful decisions rather than button mashing.",
    highlight: "trading",
  },
  {
    title: "Portfolio Value = Rank",
    content: "Your rank is based on total portfolio value (cash + holdings). Watch the leaderboard update live as you and the AI bots trade!",
    highlight: "leaderboard",
  },
  {
    title: "Ready to Compete!",
    content: "Choose your difficulty and beat those AI traders! Harder difficulties have faster, smarter opponents. Good luck!",
    highlight: null,
  },
];

// ============== DIFFICULTY SETTINGS ==============
const DIFFICULTY_SETTINGS: Record<Difficulty, DifficultySettings> = {
  easy: {
    label: "Easy",
    description: "Slower AI, longer cooldowns, 7 min game",
    gameDuration: 420,
    tradeCooldown: 2000,
    aiTradeInterval: 6000,
    aiSkillMultiplier: 0.7,
    startingCapital: 12000,
    color: "text-success",
    icon: <Shield className="w-5 h-5" />,
  },
  medium: {
    label: "Medium",
    description: "Balanced gameplay, 5 min game",
    gameDuration: 300,
    tradeCooldown: 3000,
    aiTradeInterval: 4000,
    aiSkillMultiplier: 1.0,
    startingCapital: 10000,
    color: "text-warning",
    icon: <Target className="w-5 h-5" />,
  },
  hard: {
    label: "Hard",
    description: "Fast & smart AI, 4 min game",
    gameDuration: 240,
    tradeCooldown: 4000,
    aiTradeInterval: 2500,
    aiSkillMultiplier: 1.4,
    startingCapital: 8000,
    color: "text-destructive",
    icon: <Flame className="w-5 h-5" />,
  },
};

// ============== 10 EXTREME TRADING STYLES ==============
const TRADING_STYLES: TradingStyle[] = [
  {
    id: "yolo_trader",
    name: "YOLO Trader",
    description: "All-in mentality, maximum risk",
    extremeDescription: "Goes ALL-IN on single stocks. Either wins big or loses everything. No middle ground.",
    icon: <Zap className="w-4 h-4" />,
    color: "bg-red-500",
    tradeDecision: (prices, holdings, capital) => {
      // EXTREME: Always goes all-in on the most volatile stock
      const mostVolatile = [...prices].sort((a, b) => Math.abs(b.change) - Math.abs(a.change))[0];
      const maxShares = Math.floor(capital / mostVolatile.price);
      if (maxShares > 0 && Math.random() > 0.3) {
        return { action: 'buy', symbol: mostVolatile.symbol, shares: Math.floor(maxShares * 0.8) };
      }
      // Sell everything if price drops
      const holding = holdings[mostVolatile.symbol];
      if (holding && mostVolatile.change < -0.2) {
        return { action: 'sell', symbol: mostVolatile.symbol, shares: holding.shares };
      }
      return null;
    },
  },
  {
    id: "contrarian",
    name: "Extreme Contrarian",
    description: "Always bets against the crowd",
    extremeDescription: "Buys ONLY when stocks crash hard. Sells ONLY at peaks. Maximum counter-trend.",
    icon: <TrendingDown className="w-4 h-4" />,
    color: "bg-purple-500",
    tradeDecision: (prices, holdings, capital) => {
      // EXTREME: Buy the biggest loser, sell the biggest winner
      const sorted = [...prices].sort((a, b) => a.change - b.change);
      const biggestLoser = sorted[0];
      const biggestWinner = sorted[sorted.length - 1];
      
      if (biggestLoser.change < -0.4 && Math.random() > 0.2) {
        const shares = Math.floor((capital * 0.5) / biggestLoser.price);
        if (shares > 0) return { action: 'buy', symbol: biggestLoser.symbol, shares };
      }
      if (biggestWinner.change > 0.4 && holdings[biggestWinner.symbol]) {
        return { action: 'sell', symbol: biggestWinner.symbol, shares: holdings[biggestWinner.symbol].shares };
      }
      return null;
    },
  },
  {
    id: "momentum_chaser",
    name: "Momentum Maniac",
    description: "Chases trends relentlessly",
    extremeDescription: "Piles into ANY rising stock. Keeps buying as long as it's green. Never fights the trend.",
    icon: <TrendingUp className="w-4 h-4" />,
    color: "bg-green-500",
    tradeDecision: (prices, holdings, capital) => {
      // EXTREME: Buy anything going up, aggressively
      const risers = prices.filter(p => p.change > 0.15);
      if (risers.length > 0 && Math.random() > 0.15) {
        const stock = risers[Math.floor(Math.random() * risers.length)];
        const shares = Math.floor((capital * 0.4) / stock.price);
        if (shares > 0) return { action: 'buy', symbol: stock.symbol, shares };
      }
      // Dump anything that turns red
      for (const [symbol, holding] of Object.entries(holdings)) {
        const price = prices.find(p => p.symbol === symbol);
        if (price && price.change < -0.1 && holding.shares > 0) {
          return { action: 'sell', symbol, shares: holding.shares };
        }
      }
      return null;
    },
  },
  {
    id: "penny_pincher",
    name: "Penny Pincher",
    description: "Only buys the cheapest stocks",
    extremeDescription: "Obsessed with low prices. Buys in massive quantities of the cheapest stocks only.",
    icon: <DollarSign className="w-4 h-4" />,
    color: "bg-yellow-500",
    tradeDecision: (prices, holdings, capital) => {
      // EXTREME: Only buy the absolute cheapest stock
      const cheapest = [...prices].sort((a, b) => a.price - b.price)[0];
      if (Math.random() > 0.25) {
        const shares = Math.floor((capital * 0.6) / cheapest.price);
        if (shares > 0) return { action: 'buy', symbol: cheapest.symbol, shares };
      }
      return null;
    },
  },
  {
    id: "diamond_hands",
    name: "Diamond Hands",
    description: "Never sells, only accumulates",
    extremeDescription: "NEVER sells. EVER. Just keeps buying and holding no matter what. True believer mentality.",
    icon: <Star className="w-4 h-4" />,
    color: "bg-cyan-500",
    tradeDecision: (prices, holdings, capital) => {
      // EXTREME: Only buys, diversified across everything
      if (capital > 100 && Math.random() > 0.2) {
        const randomStock = prices[Math.floor(Math.random() * prices.length)];
        const shares = Math.floor((capital * 0.25) / randomStock.price);
        if (shares > 0) return { action: 'buy', symbol: randomStock.symbol, shares };
      }
      return null; // NEVER sells
    },
  },
  {
    id: "scalper",
    name: "Rapid Scalper",
    description: "Micro-profits on every tick",
    extremeDescription: "Trades constantly for tiny gains. In and out within seconds. Volume over value.",
    icon: <Clock className="w-4 h-4" />,
    color: "bg-orange-500",
    tradeDecision: (prices, holdings, capital) => {
      // EXTREME: Always trading, tiny positions, quick flips
      if (Math.random() > 0.1) {
        const stock = prices[Math.floor(Math.random() * prices.length)];
        const holding = holdings[stock.symbol];
        
        if (holding && holding.shares > 3 && stock.change > 0.05) {
          // Quick profit take
          return { action: 'sell', symbol: stock.symbol, shares: Math.ceil(holding.shares / 2) };
        }
        if (!holding || holding.shares < 5) {
          const shares = Math.floor((capital * 0.15) / stock.price);
          if (shares > 0) return { action: 'buy', symbol: stock.symbol, shares };
        }
      }
      return null;
    },
  },
  {
    id: "sector_rotator",
    name: "Sector Rotator",
    description: "Shifts between sectors constantly",
    extremeDescription: "Dumps entire positions to chase the next hot sector. All or nothing sector bets.",
    icon: <Activity className="w-4 h-4" />,
    color: "bg-pink-500",
    tradeDecision: (prices, holdings, capital) => {
      // EXTREME: Sells everything in one sector, buys everything in another
      const holdingSymbols = Object.keys(holdings);
      
      // Find best and worst performing stocks
      const bestStock = [...prices].sort((a, b) => b.change - a.change)[0];
      const worstHolding = holdingSymbols
        .map(s => ({ symbol: s, change: prices.find(p => p.symbol === s)?.change || 0, shares: holdings[s].shares }))
        .sort((a, b) => a.change - b.change)[0];
      
      if (worstHolding && worstHolding.change < 0 && Math.random() > 0.3) {
        return { action: 'sell', symbol: worstHolding.symbol, shares: worstHolding.shares };
      }
      if (bestStock.change > 0.2 && Math.random() > 0.25) {
        const shares = Math.floor((capital * 0.5) / bestStock.price);
        if (shares > 0) return { action: 'buy', symbol: bestStock.symbol, shares };
      }
      return null;
    },
  },
  {
    id: "fear_trader",
    name: "Fear Trader",
    description: "Panics at every dip",
    extremeDescription: "Sells IMMEDIATELY at any sign of red. Extremely loss-averse. Panic sells constantly.",
    icon: <Shield className="w-4 h-4" />,
    color: "bg-gray-500",
    tradeDecision: (prices, holdings, capital) => {
      // EXTREME: Panic sell anything that goes red
      for (const [symbol, holding] of Object.entries(holdings)) {
        const price = prices.find(p => p.symbol === symbol);
        if (price && price.change < -0.05 && Math.random() > 0.1) {
          return { action: 'sell', symbol, shares: holding.shares };
        }
      }
      // Only buy very stable stocks
      const stableStocks = prices.filter(p => Math.abs(p.change) < 0.1);
      if (stableStocks.length > 0 && Math.random() > 0.5) {
        const stock = stableStocks[Math.floor(Math.random() * stableStocks.length)];
        const shares = Math.floor((capital * 0.2) / stock.price);
        if (shares > 0) return { action: 'buy', symbol: stock.symbol, shares };
      }
      return null;
    },
  },
  {
    id: "whale",
    name: "Market Whale",
    description: "Massive position sizes",
    extremeDescription: "Takes ENORMOUS positions that can move markets. Bets big or goes home.",
    icon: <Trophy className="w-4 h-4" />,
    color: "bg-blue-500",
    tradeDecision: (prices, holdings, capital) => {
      // EXTREME: Huge position sizes, infrequent but massive trades
      if (Math.random() > 0.6) {
        const stock = prices[Math.floor(Math.random() * prices.length)];
        const shares = Math.floor((capital * 0.7) / stock.price);
        if (shares > 0) return { action: 'buy', symbol: stock.symbol, shares };
      }
      // Big sells too
      const holdingEntries = Object.entries(holdings);
      if (holdingEntries.length > 0 && Math.random() > 0.7) {
        const [symbol, holding] = holdingEntries[Math.floor(Math.random() * holdingEntries.length)];
        return { action: 'sell', symbol, shares: holding.shares };
      }
      return null;
    },
  },
  {
    id: "value_hunter",
    name: "Deep Value Hunter",
    description: "Only buys heavily discounted stocks",
    extremeDescription: "Waits for MASSIVE dips. Only buys when stocks crash 40%+. Extreme patience.",
    icon: <Target className="w-4 h-4" />,
    color: "bg-emerald-500",
    tradeDecision: (prices, holdings, capital) => {
      // EXTREME: Only buy if price crashed significantly
      const crashed = prices.filter(p => p.change < -0.5);
      if (crashed.length > 0 && Math.random() > 0.2) {
        const stock = crashed[Math.floor(Math.random() * crashed.length)];
        const shares = Math.floor((capital * 0.4) / stock.price);
        if (shares > 0) return { action: 'buy', symbol: stock.symbol, shares };
      }
      // Sell at modest gains
      for (const [symbol, holding] of Object.entries(holdings)) {
        const price = prices.find(p => p.symbol === symbol);
        if (price && price.change > 0.3 && Math.random() > 0.3) {
          return { action: 'sell', symbol, shares: holding.shares };
        }
      }
      return null;
    },
  },
];

// ============== DAILY CHALLENGES ==============
const DAILY_CHALLENGES: DailyChallenge[] = [
  {
    id: "conservative_win",
    title: "Conservative Champion",
    description: "Win with fewer than 10 trades",
    condition: (stats) => stats.rank === 1 && stats.trades < 10,
    reward: "+50 XP Bonus",
    icon: <Shield className="w-4 h-4" />,
  },
  {
    id: "trading_machine",
    title: "Trading Machine",
    description: "Make 20+ trades and finish top 3",
    condition: (stats) => stats.rank <= 3 && stats.trades >= 20,
    reward: "+75 XP Bonus",
    icon: <Activity className="w-4 h-4" />,
  },
  {
    id: "underdog",
    title: "Underdog Victory",
    description: "Win after being ranked #5 at some point",
    condition: (stats) => stats.rank === 1,
    reward: "+100 XP Bonus",
    icon: <Star className="w-4 h-4" />,
  },
  {
    id: "profit_master",
    title: "Profit Master",
    description: "Finish with 25%+ profit",
    condition: (stats) => (stats.capital - 10000) / 10000 >= 0.25,
    reward: "+80 XP Bonus",
    icon: <TrendingUp className="w-4 h-4" />,
  },
  {
    id: "diversified",
    title: "Diversified Portfolio",
    description: "Hold 4+ different stocks at game end",
    condition: (stats) => Object.keys(stats.holdings).length >= 4,
    reward: "+60 XP Bonus",
    icon: <BarChart3 className="w-4 h-4" />,
  },
];

// Get today's challenge based on date
const getTodaysChallenge = (): DailyChallenge => {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  return DAILY_CHALLENGES[dayOfYear % DAILY_CHALLENGES.length];
};

// Shuffle array and pick n items
const pickRandomStyles = (n: number): TradingStyle[] => {
  const shuffled = [...TRADING_STYLES].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
};

// AI Trader Names
const AI_NAMES = [
  "AlphaBot", "TradeMaster AI", "QuantumTrader", "NeuralNet",
  "DeepMind Trader", "SkyNet Capital", "Robo Buffett", "AI Gordon Gekko"
];

export const AICompetitorGame = ({ onClose }: AICompetitorGameProps) => {
  const { user } = useAuth();
  const { session, initializeSession, updatePrices, isLoading } = useAIMarket(user?.id);
  const { toast } = useToast();
  
  // Game state
  const [showTutorial, setShowTutorial] = useState(true);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(300);
  const [gameEnded, setGameEnded] = useState(false);
  
  // User state
  const [userCapital, setUserCapital] = useState(10000);
  const [userTrades, setUserTrades] = useState(0);
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  const [lastUserTradeTime, setLastUserTradeTime] = useState(0);
  const [userHoldings, setUserHoldings] = useState<Record<string, { shares: number; avgPrice: number }>>({});
  
  // AI state
  const [traders, setTraders] = useState<Trader[]>([]);
  const [selectedStyles, setSelectedStyles] = useState<TradingStyle[]>([]);
  
  // Stock prices
  const [stockPrices, setStockPrices] = useState<StockPrice[]>([
    { symbol: 'AAPL', price: 178.50, change: 0 },
    { symbol: 'TSLA', price: 245.20, change: 0 },
    { symbol: 'NVDA', price: 485.30, change: 0 },
    { symbol: 'MSFT', price: 378.90, change: 0 },
    { symbol: 'GOOGL', price: 142.75, change: 0 },
    { symbol: 'AMZN', price: 178.25, change: 0 }
  ]);

  const todaysChallenge = useMemo(() => getTodaysChallenge(), []);
  const settings = difficulty ? DIFFICULTY_SETTINGS[difficulty] : null;

  // Initialize game when difficulty is selected
  useEffect(() => {
    if (difficulty && !gameStarted) {
      const styles = pickRandomStyles(4);
      setSelectedStyles(styles);
      
      const shuffledNames = [...AI_NAMES].sort(() => Math.random() - 0.5);
      
      const aiTraders: Trader[] = styles.map((style, index) => ({
        id: `ai-${index}`,
        name: shuffledNames[index],
        capital: DIFFICULTY_SETTINGS[difficulty].startingCapital,
        initialCapital: DIFFICULTY_SETTINGS[difficulty].startingCapital,
        strategy: style.id,
        strategyDetails: style,
        trades: 0,
        winRate: 0,
        lastAction: undefined,
        lastTradeTime: 0,
        holdings: {},
      }));
      
      setTraders(aiTraders);
      setUserCapital(DIFFICULTY_SETTINGS[difficulty].startingCapital);
      setTimeRemaining(DIFFICULTY_SETTINGS[difficulty].gameDuration);
      setGameStarted(true);
      
      if (!session && !isLoading) {
        initializeSession.mutate();
      }
    }
  }, [difficulty, session, isLoading]);

  // Game timer
  useEffect(() => {
    if (!gameStarted || timeRemaining <= 0 || gameEnded) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleGameEnd();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, timeRemaining, gameEnded]);

  // Price and AI trade updates
  useEffect(() => {
    if (!gameStarted || !settings || gameEnded) return;

    const priceInterval = setInterval(() => {
      updateStockPrices();
    }, 2000);

    const tradeInterval = setInterval(() => {
      updatePrices.mutate();
      simulateAITrades();
    }, settings.aiTradeInterval);

    return () => {
      clearInterval(priceInterval);
      clearInterval(tradeInterval);
    };
  }, [gameStarted, settings, gameEnded]);

  const updateStockPrices = () => {
    setStockPrices(prev => prev.map(stock => {
      const changePercent = (Math.random() - 0.5) * 0.03; // -1.5% to +1.5%
      const newPrice = Math.max(1, stock.price * (1 + changePercent));
      return {
        ...stock,
        price: newPrice,
        change: changePercent * 100
      };
    }));
  };

  const simulateAITrades = () => {
    if (!settings) return;
    
    setTraders(prevTraders => 
      prevTraders.map(trader => {
        // Apply skill multiplier - smarter AI makes better decisions
        const shouldTrade = Math.random() < (0.5 * settings.aiSkillMultiplier);
        if (!shouldTrade) {
          return { ...trader, lastAction: 'analyzing market...' };
        }
        
        const decision = trader.strategyDetails.tradeDecision(stockPrices, trader.holdings, trader.capital);
        
        if (!decision) {
          return { ...trader, lastAction: 'holding position' };
        }

        const stockPrice = stockPrices.find(p => p.symbol === decision.symbol);
        if (!stockPrice) return trader;

        const tradeValue = stockPrice.price * decision.shares;
        let newCapital = trader.capital;
        let newHoldings = { ...trader.holdings };

        if (decision.action === 'buy') {
          if (trader.capital >= tradeValue) {
            newCapital = trader.capital - tradeValue;
            const existingHolding = newHoldings[decision.symbol] || { shares: 0, avgPrice: 0 };
            const totalShares = existingHolding.shares + decision.shares;
            const totalCost = (existingHolding.shares * existingHolding.avgPrice) + tradeValue;
            newHoldings[decision.symbol] = {
              shares: totalShares,
              avgPrice: totalCost / totalShares
            };
          } else {
            return { ...trader, lastAction: 'insufficient funds' };
          }
        } else {
          const existingHolding = newHoldings[decision.symbol];
          if (existingHolding && existingHolding.shares >= decision.shares) {
            newCapital = trader.capital + tradeValue;
            newHoldings[decision.symbol] = {
              shares: existingHolding.shares - decision.shares,
              avgPrice: existingHolding.avgPrice
            };
            if (newHoldings[decision.symbol].shares === 0) {
              delete newHoldings[decision.symbol];
            }
          } else {
            newCapital = trader.capital + (tradeValue * 0.95);
          }
        }

        return {
          ...trader,
          capital: newCapital,
          holdings: newHoldings,
          trades: trader.trades + 1,
          winRate: Math.random() > 0.4 ? Math.min(1, trader.winRate + 0.02) : Math.max(0, trader.winRate - 0.01),
          lastAction: `${decision.action === 'buy' ? '🟢 bought' : '🔴 sold'} ${decision.shares} ${decision.symbol} @ $${stockPrice.price.toFixed(2)}`,
          lastTradeTime: Date.now()
        };
      })
    );
  };

  const canTrade = () => {
    if (!settings) return false;
    return Date.now() - lastUserTradeTime >= settings.tradeCooldown;
  };

  const getCooldownRemaining = () => {
    if (!settings) return 0;
    const remaining = settings.tradeCooldown - (Date.now() - lastUserTradeTime);
    return Math.max(0, Math.ceil(remaining / 1000));
  };

  const handleTrade = (action: 'buy' | 'sell') => {
    if (!selectedStock || !settings) {
      toast({
        title: "Select a stock",
        description: "Choose a stock to trade",
        variant: "destructive"
      });
      return;
    }

    if (!canTrade()) {
      toast({
        title: "Trade Cooldown",
        description: `Wait ${getCooldownRemaining()} seconds`,
        variant: "destructive"
      });
      return;
    }

    const stockPrice = stockPrices.find(p => p.symbol === selectedStock);
    if (!stockPrice) return;

    const shares = Math.floor(Math.random() * 10) + 5;
    const tradeValue = stockPrice.price * shares;

    if (action === 'buy') {
      if (userCapital < tradeValue) {
        toast({
          title: "Insufficient Funds",
          description: `Need $${tradeValue.toFixed(2)}, have $${userCapital.toFixed(2)}`,
          variant: "destructive"
        });
        return;
      }

      setUserCapital(prev => prev - tradeValue);
      setUserHoldings(prev => {
        const existing = prev[selectedStock] || { shares: 0, avgPrice: 0 };
        const totalShares = existing.shares + shares;
        const totalCost = (existing.shares * existing.avgPrice) + tradeValue;
        return {
          ...prev,
          [selectedStock]: { shares: totalShares, avgPrice: totalCost / totalShares }
        };
      });

      toast({
        title: `🟢 Bought ${shares} ${selectedStock}`,
        description: `$${tradeValue.toFixed(2)} @ $${stockPrice.price.toFixed(2)}/share`
      });
    } else {
      const holding = userHoldings[selectedStock];
      if (!holding || holding.shares < shares) {
        const proceeds = tradeValue * 0.95;
        setUserCapital(prev => prev + proceeds);
        toast({
          title: `🔴 Short Sold ${shares} ${selectedStock}`,
          description: `Proceeds: $${proceeds.toFixed(2)}`
        });
      } else {
        setUserCapital(prev => prev + tradeValue);
        setUserHoldings(prev => {
          const newShares = prev[selectedStock].shares - shares;
          if (newShares === 0) {
            const { [selectedStock]: _, ...rest } = prev;
            return rest;
          }
          return { ...prev, [selectedStock]: { ...prev[selectedStock], shares: newShares } };
        });

        const profit = (stockPrice.price - holding.avgPrice) * shares;
        toast({
          title: `🔴 Sold ${shares} ${selectedStock}`,
          description: profit >= 0 ? `Profit: +$${profit.toFixed(2)}` : `Loss: -$${Math.abs(profit).toFixed(2)}`,
          variant: profit >= 0 ? "default" : "destructive"
        });
      }
    }
    
    setUserTrades(prev => prev + 1);
    setLastUserTradeTime(Date.now());
  };

  const getUserTotalValue = () => {
    const holdingsValue = Object.entries(userHoldings).reduce((total, [symbol, holding]) => {
      const price = stockPrices.find(p => p.symbol === symbol)?.price || 0;
      return total + (holding.shares * price);
    }, 0);
    return userCapital + holdingsValue;
  };

  const getTraderTotalValue = (trader: Trader) => {
    const holdingsValue = Object.entries(trader.holdings).reduce((total, [symbol, holding]) => {
      const price = stockPrices.find(p => p.symbol === symbol)?.price || 0;
      return total + (holding.shares * price);
    }, 0);
    return trader.capital + holdingsValue;
  };

  const handleGameEnd = () => {
    setGameEnded(true);
    const leaderboard = getLeaderboard();
    const userRank = leaderboard.findIndex(t => t.name.includes('You')) + 1;
    
    // Check daily challenge
    const userStats = {
      trades: userTrades,
      capital: getUserTotalValue(),
      holdings: userHoldings,
      rank: userRank
    };
    
    const challengeCompleted = todaysChallenge.condition(userStats);
    
    toast({
      title: userRank === 1 ? "🏆 Victory!" : `Competition Ended!`,
      description: `You finished #${userRank}${challengeCompleted ? ` + ${todaysChallenge.reward}!` : ''}`,
      duration: 5000
    });
  };

  const getLeaderboard = () => {
    const userTotalValue = getUserTotalValue();
    const initialCap = settings?.startingCapital || 10000;
    const allTraders = [
      { name: 'You (Player)', capital: userTotalValue, initialCapital: initialCap, trades: userTrades, strategy: 'player', strategyDetails: null, holdings: userHoldings },
      ...traders.map(t => ({ ...t, capital: getTraderTotalValue(t) }))
    ].sort((a, b) => b.capital - a.capital);
    return allTraders;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProfitLoss = (current: number, initial: number) => current - initial;
  const getProfitLossPercent = (current: number, initial: number) => 
    ((getProfitLoss(current, initial) / initial) * 100).toFixed(2);

  // ============== TUTORIAL SCREEN ==============
  if (showTutorial) {
    const step = TUTORIAL_STEPS[tutorialStep];
    return (
      <div className="fixed inset-0 bg-background z-50 overflow-y-auto">
        <div className="min-h-screen p-4 flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="max-w-lg w-full"
          >
            <Button variant="ghost" onClick={onClose} className="mb-4 gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4" />
              Back to Games
            </Button>
            
            <Card className="p-8 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <Brain className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <Badge variant="outline" className="mb-1">Step {tutorialStep + 1}/{TUTORIAL_STEPS.length}</Badge>
                  <h2 className="text-xl font-bold">{step.title}</h2>
                </div>
              </div>
              
              <p className="text-muted-foreground">{step.content}</p>
              
              {step.highlight === "styles" && (
                <div className="grid grid-cols-2 gap-2">
                  {TRADING_STYLES.slice(0, 4).map(style => (
                    <div key={style.id} className={`p-3 rounded-lg border ${style.color}/20 border-${style.color.replace('bg-', '')}/30`}>
                      <div className="flex items-center gap-2 mb-1">
                        {style.icon}
                        <span className="font-semibold text-sm">{style.name}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{style.description}</p>
                    </div>
                  ))}
                </div>
              )}
              
              {step.highlight === "stocks" && (
                <div className="grid grid-cols-3 gap-2">
                  {['AAPL', 'TSLA', 'NVDA', 'MSFT', 'GOOGL', 'AMZN'].map(symbol => (
                    <div key={symbol} className="p-2 rounded-lg bg-muted text-center">
                      <span className="font-bold text-sm">{symbol}</span>
                    </div>
                  ))}
                </div>
              )}
              
              {step.highlight === "trading" && (
                <div className="flex gap-3">
                  <div className="flex-1 p-3 rounded-lg bg-success/20 border border-success/30 text-center">
                    <TrendingUp className="w-6 h-6 mx-auto mb-1 text-success" />
                    <span className="font-semibold text-success">BUY</span>
                  </div>
                  <div className="flex-1 p-3 rounded-lg bg-destructive/20 border border-destructive/30 text-center">
                    <TrendingDown className="w-6 h-6 mx-auto mb-1 text-destructive" />
                    <span className="font-semibold text-destructive">SELL</span>
                  </div>
                </div>
              )}
              
              {step.highlight === "leaderboard" && (
                <div className="space-y-2">
                  {['#1 You', '#2 AlphaBot', '#3 TradeMaster'].map((name, i) => (
                    <div key={i} className={`p-2 rounded-lg ${i === 0 ? 'bg-primary/20 border border-primary/30' : 'bg-muted'}`}>
                      <span className="font-semibold text-sm">{name}</span>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="flex justify-between gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setTutorialStep(prev => Math.max(0, prev - 1))}
                  disabled={tutorialStep === 0}
                >
                  Back
                </Button>
                {tutorialStep < TUTORIAL_STEPS.length - 1 ? (
                  <Button onClick={() => setTutorialStep(prev => prev + 1)}>
                    Next
                  </Button>
                ) : (
                  <Button onClick={() => setShowTutorial(false)} className="bg-primary">
                    Choose Difficulty →
                  </Button>
                )}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  // ============== DIFFICULTY SELECTION ==============
  if (!difficulty) {
    return (
      <div className="fixed inset-0 bg-background z-50 overflow-y-auto">
        <div className="min-h-screen p-4 flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl w-full"
          >
            <Button variant="ghost" onClick={() => setShowTutorial(true)} className="mb-4 gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4" />
              Back to Tutorial
            </Button>
            
            <Card className="p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Select Difficulty</h2>
                <p className="text-muted-foreground">Choose how challenging you want the competition to be</p>
              </div>
              
              {/* Daily Challenge Banner */}
              <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-warning/20 to-warning/5 border border-warning/30">
                <div className="flex items-center gap-3">
                  <Calendar className="w-6 h-6 text-warning" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-warning">Today's Challenge:</span>
                      <Badge variant="outline" className="border-warning/50 text-warning">{todaysChallenge.reward}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{todaysChallenge.title} - {todaysChallenge.description}</p>
                  </div>
                </div>
              </div>
              
              <div className="grid gap-4">
                {(Object.entries(DIFFICULTY_SETTINGS) as [Difficulty, DifficultySettings][]).map(([key, setting]) => (
                  <motion.button
                    key={key}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setDifficulty(key)}
                    className="w-full p-6 rounded-xl border-2 border-border hover:border-primary/50 bg-card text-left transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${setting.color} bg-current/10`}>
                          {setting.icon}
                        </div>
                        <div>
                          <h3 className={`text-xl font-bold ${setting.color}`}>{setting.label}</h3>
                          <p className="text-sm text-muted-foreground">{setting.description}</p>
                        </div>
                      </div>
                      <div className="text-right text-sm text-muted-foreground">
                        <div>Start: ${setting.startingCapital.toLocaleString()}</div>
                        <div>{Math.floor(setting.gameDuration / 60)} min</div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
              
              <Button variant="ghost" onClick={onClose} className="w-full mt-6">
                Cancel
              </Button>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  // ============== LOADING SCREEN ==============
  if (!gameStarted) {
    return (
      <div className="fixed inset-0 bg-background z-50 flex items-center justify-center p-6">
        <Card className="w-full max-w-2xl p-8 bg-card">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
              <Brain className="w-8 h-8 text-white animate-pulse" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center mb-4">Setting Up Competition...</h2>
          <Progress value={isLoading ? 50 : 100} className="mb-4" />
          <p className="text-center text-muted-foreground">
            Selecting 4 extreme trading personalities...
          </p>
        </Card>
      </div>
    );
  }

  // ============== MAIN GAME ==============
  const leaderboard = getLeaderboard();
  const userRank = leaderboard.findIndex(t => t.name.includes('You')) + 1;
  const initialCap = settings?.startingCapital || 10000;

  return (
    <div className="fixed inset-0 bg-background z-50 overflow-auto">
      {/* Header */}
      <div className="sticky top-0 bg-card/95 backdrop-blur-sm border-b border-border z-10 p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold">AI Competitor Challenge</h1>
                <Badge className={DIFFICULTY_SETTINGS[difficulty].color.replace('text-', 'bg-').replace('success', 'success/20').replace('warning', 'warning/20').replace('destructive', 'destructive/20')}>
                  {DIFFICULTY_SETTINGS[difficulty].label}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">Beat {traders.length} AI traders!</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className={`text-2xl font-bold ${timeRemaining < 60 ? 'text-destructive animate-pulse' : 'text-primary'}`}>
                {formatTime(timeRemaining)}
              </div>
              <div className="text-xs text-muted-foreground">Time Left</div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Daily Challenge Reminder */}
        <Card className="p-4 bg-warning/10 border-warning/30">
          <div className="flex items-center gap-3">
            <Award className="w-5 h-5 text-warning" />
            <div className="flex-1">
              <span className="font-semibold text-warning">{todaysChallenge.title}:</span>
              <span className="text-muted-foreground ml-2">{todaysChallenge.description}</span>
            </div>
            <Badge variant="outline" className="border-warning/50 text-warning">{todaysChallenge.reward}</Badge>
          </div>
        </Card>

        {/* Leaderboard */}
        <Card className="p-6 bg-gradient-to-br from-card to-primary/5 border-0">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-lg">Live Leaderboard</h3>
          </div>
          <div className="space-y-3">
            {leaderboard.map((trader, idx) => {
              const isUser = trader.name.includes('You');
              const profitLoss = getProfitLoss(trader.capital, trader.initialCapital);
              const profitLossPercent = getProfitLossPercent(trader.capital, trader.initialCapital);
              const isProfit = profitLoss >= 0;
              const style = selectedStyles.find(s => s.id === trader.strategy);

              return (
                <TooltipProvider key={trader.name}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div 
                        className={`p-4 rounded-xl border transition-all ${
                          isUser 
                            ? 'bg-primary/10 border-primary shadow-lg' 
                            : 'bg-card border-border hover:border-primary/30'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${
                              idx === 0 ? 'bg-yellow-500/20 text-yellow-500' :
                              idx === 1 ? 'bg-gray-400/20 text-gray-400' :
                              idx === 2 ? 'bg-orange-500/20 text-orange-500' :
                              'bg-muted text-muted-foreground'
                            }`}>
                              #{idx + 1}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold">{trader.name}</span>
                                {style && (
                                  <Badge variant="outline" className="text-xs flex items-center gap-1">
                                    {style.icon}
                                    {style.name}
                                  </Badge>
                                )}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {trader.trades} trades
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="font-bold text-lg">
                              ${trader.capital.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                            <div className={`text-sm font-medium flex items-center gap-1 justify-end ${
                              isProfit ? 'text-success' : 'text-destructive'
                            }`}>
                              {isProfit ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                              {isProfit ? '+' : ''}{profitLossPercent}%
                            </div>
                          </div>
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p className="font-semibold mb-1">{trader.name}</p>
                      {style ? (
                        <p className="text-sm">{style.extremeDescription}</p>
                      ) : (
                        <p className="text-sm">Your trading strategy - make it count!</p>
                      )}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            })}
          </div>
        </Card>

        {/* Trading Panel */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Your Stats */}
          <Card className="p-6 bg-gradient-to-br from-primary to-primary/80 text-white">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Your Performance
            </h3>
            <div className="space-y-4">
              <div>
                <div className="text-sm opacity-80 mb-1">Portfolio Value</div>
                <div className="text-3xl font-bold">
                  ${getUserTotalValue().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm opacity-80 mb-1">P&L</div>
                  <div className={`text-xl font-bold ${
                    getProfitLoss(getUserTotalValue(), initialCap) >= 0 ? 'text-green-300' : 'text-red-300'
                  }`}>
                    {getProfitLoss(getUserTotalValue(), initialCap) >= 0 ? '+' : ''}
                    ${Math.abs(getProfitLoss(getUserTotalValue(), initialCap)).toFixed(2)}
                  </div>
                </div>
                <div>
                  <div className="text-sm opacity-80 mb-1">Rank</div>
                  <div className="text-xl font-bold">#{userRank}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm opacity-80 mb-1">Cash</div>
                  <div className="text-lg font-bold">${userCapital.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-sm opacity-80 mb-1">Trades</div>
                  <div className="text-lg font-bold">{userTrades}</div>
                </div>
              </div>
              {Object.keys(userHoldings).length > 0 && (
                <div>
                  <div className="text-sm opacity-80 mb-2">Holdings</div>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(userHoldings).map(([symbol, holding]) => (
                      <Badge key={symbol} variant="secondary" className="bg-white/20 text-white">
                        {symbol}: {holding.shares}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Quick Trade */}
          <Card className="p-6">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Quick Trade
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Select Stock</label>
                <div className="grid grid-cols-2 gap-2">
                  {stockPrices.map(stock => (
                    <Button
                      key={stock.symbol}
                      variant={selectedStock === stock.symbol ? "default" : "outline"}
                      onClick={() => setSelectedStock(stock.symbol)}
                      className="w-full justify-between px-3"
                    >
                      <span className="font-bold">{stock.symbol}</span>
                      <span className={`text-xs ${stock.change >= 0 ? 'text-success' : 'text-destructive'}`}>
                        ${stock.price.toFixed(2)} {stock.change >= 0 ? '↑' : '↓'}
                      </span>
                    </Button>
                  ))}
                </div>
              </div>
              
              {!canTrade() && (
                <div className="text-center p-2 bg-warning/10 rounded-lg border border-warning/20">
                  <div className="text-sm font-medium text-warning">Cooldown: {getCooldownRemaining()}s</div>
                  <Progress value={(1 - getCooldownRemaining() / (settings?.tradeCooldown ? settings.tradeCooldown / 1000 : 3)) * 100} className="h-1 mt-1" />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <Button 
                  size="lg"
                  className="bg-success hover:bg-success/90 text-white"
                  onClick={() => handleTrade('buy')}
                  disabled={!selectedStock || !canTrade() || gameEnded}
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Buy
                </Button>
                <Button 
                  size="lg"
                  className="bg-destructive hover:bg-destructive/90 text-white"
                  onClick={() => handleTrade('sell')}
                  disabled={!selectedStock || !canTrade() || gameEnded}
                >
                  <TrendingDown className="w-4 h-4 mr-2" />
                  Sell
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* AI Activity Feed */}
        <Card className="p-6">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            AI Activity Feed
          </h3>
          <div className="space-y-2 max-h-64 overflow-auto">
            {traders.filter(t => t.lastAction).map((trader, idx) => {
              const style = selectedStyles.find(s => s.id === trader.strategy);
              return (
                <div key={`${trader.id}-${idx}`} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${style?.color || 'bg-primary'}/20`}>
                    {style?.icon || <Brain className="w-4 h-4" />}
                  </div>
                  <div className="flex-1">
                    <span className="font-medium">{trader.name}</span>
                    <span className="text-muted-foreground"> {trader.lastAction}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">{style?.name || 'AI'}</Badge>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Tutorial Button */}
        <div className="text-center">
          <Button variant="ghost" onClick={() => { setShowTutorial(true); setTutorialStep(0); }} className="gap-2">
            <HelpCircle className="w-4 h-4" />
            View Tutorial
          </Button>
        </div>
      </div>
    </div>
  );
};

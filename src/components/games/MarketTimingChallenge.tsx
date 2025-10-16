import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { X, TrendingUp, TrendingDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface MarketTimingChallengeProps {
  onClose: () => void;
}

interface StockData {
  symbol: string;
  name: string;
  price: number;
  trend: "up" | "down";
  changePercent: number;
}

const stocks: StockData[] = [
  { symbol: "AAPL", name: "Apple Inc.", price: 178.50, trend: "up", changePercent: 2.3 },
  { symbol: "MSFT", name: "Microsoft Corp.", price: 415.20, trend: "up", changePercent: 1.8 },
  { symbol: "GOOGL", name: "Alphabet Inc.", price: 142.30, trend: "down", changePercent: -1.2 },
  { symbol: "AMZN", name: "Amazon.com Inc.", price: 178.90, trend: "up", changePercent: 3.1 },
  { symbol: "TSLA", name: "Tesla Inc.", price: 242.80, trend: "down", changePercent: -2.5 },
  { symbol: "NVDA", name: "NVIDIA Corp.", price: 725.40, trend: "up", changePercent: 4.2 },
];

export const MarketTimingChallenge = ({ onClose }: MarketTimingChallengeProps) => {
  const { user } = useAuth();
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [portfolio, setPortfolio] = useState(10000);
  const [currentStock, setCurrentStock] = useState<StockData | null>(null);
  const [position, setPosition] = useState<"none" | "long" | "short">("none");
  const [positionPrice, setPositionPrice] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [gameActive, setGameActive] = useState(true);
  const [showResult, setShowResult] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const totalRounds = 8;

  useEffect(() => {
    if (gameActive && round <= totalRounds) {
      selectNewStock();
    }
  }, [gameActive, round, totalRounds]);

  useEffect(() => {
    if (!gameActive || position === "none") return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          resolvePosition();
          return 10;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameActive, position]);

  const selectNewStock = () => {
    const randomStock = stocks[Math.floor(Math.random() * stocks.length)];
    setCurrentStock(randomStock);
    setPosition("none");
    setTimeLeft(10);
    setShowResult(false);
  };

  const handleTrade = (action: "long" | "short") => {
    if (!currentStock || position !== "none") return;
    
    setPosition(action);
    setPositionPrice(currentStock.price);
  };

  const resolvePosition = () => {
    if (!currentStock || position === "none") return;

    const priceMove = (currentStock.changePercent / 100) * currentStock.price;
    const newPrice = currentStock.price + priceMove;
    const profitLoss = position === "long" 
      ? (newPrice - positionPrice) * 100
      : (positionPrice - newPrice) * 100;

    const newPortfolio = portfolio + profitLoss;
    setPortfolio(newPortfolio);

    if (profitLoss > 0) {
      setScore(score + 1);
      setResultMessage(`✅ Correct! Profit: $${profitLoss.toFixed(2)}`);
      toast.success(`Great call! Made $${profitLoss.toFixed(2)}`);
    } else {
      setResultMessage(`❌ Wrong direction. Loss: $${Math.abs(profitLoss).toFixed(2)}`);
      toast.error(`Wrong call! Lost $${Math.abs(profitLoss).toFixed(2)}`);
    }

    setShowResult(true);

    setTimeout(() => {
      if (round < totalRounds) {
        setRound(round + 1);
      } else {
        endGame(newPortfolio);
      }
    }, 2000);
  };

  const endGame = async (finalPortfolio: number) => {
    setGameActive(false);
    const profitLoss = finalPortfolio - 10000;
    const coinsEarned = Math.max(0, Math.floor(score * 15 + profitLoss / 50));

    try {
      const { error: coinsError } = await supabase.rpc('increment_coins', {
        user_id_param: user?.id,
        amount: coinsEarned,
      });

      if (coinsError) throw coinsError;

      const { error: sessionError } = await supabase.from("game_sessions").insert({
        user_id: user?.id,
        game_id: "00000000-0000-0000-0000-000000000003",
        score: score,
        coins_earned: coinsEarned,
        completed: true,
      });

      if (sessionError) throw sessionError;

      toast.success(`Game complete! Earned ${coinsEarned} coins`);
    } catch (error) {
      console.error('Error saving game:', error);
    }
  };

  if (!gameActive) {
    const profitLoss = portfolio - 10000;
    return (
      <div className="fixed inset-0 bg-background/95 z-50 flex items-center justify-center p-6">
        <Card className="p-8 max-w-md w-full text-center">
          <h2 className="text-3xl font-bold mb-6">Game Over!</h2>
          <div className="space-y-3 mb-6">
            <p className="text-xl">Correct Calls: {score}/{totalRounds}</p>
            <p className="text-lg">Starting Portfolio: $10,000.00</p>
            <p className="text-lg">Final Portfolio: ${portfolio.toFixed(2)}</p>
            <p className={`text-2xl font-bold ${profitLoss >= 0 ? "text-success" : "text-destructive"}`}>
              {profitLoss >= 0 ? "+" : ""}${profitLoss.toFixed(2)} ({((profitLoss / 10000) * 100).toFixed(2)}%)
            </p>
          </div>
          <Button onClick={onClose} className="w-full bg-gradient-primary">
            Close
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-background/95 z-50 overflow-y-auto">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Market Timing Challenge</h1>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-6 h-6" />
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Round</p>
            <p className="text-2xl font-bold">{round}/{totalRounds}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Score</p>
            <p className="text-2xl font-bold text-primary">{score}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Portfolio</p>
            <p className="text-2xl font-bold">${portfolio.toFixed(2)}</p>
          </Card>
        </div>

        {currentStock && (
          <>
            <Card className="p-6 mb-6 bg-gradient-hero border-0">
              <div className="text-center mb-4">
                <h2 className="text-3xl font-bold mb-2">{currentStock.symbol}</h2>
                <p className="text-lg text-muted-foreground mb-4">{currentStock.name}</p>
                <div className="text-5xl font-bold mb-2">${currentStock.price.toFixed(2)}</div>
                {position !== "none" && (
                  <div className="mt-4">
                    <Progress value={(timeLeft / 10) * 100} className="h-2 mb-2" />
                    <p className="text-sm text-muted-foreground">Resolving in {timeLeft}s...</p>
                  </div>
                )}
              </div>

              {showResult && (
                <div className={`p-4 rounded-lg text-center text-lg font-bold ${resultMessage.includes("✅") ? "bg-success/20" : "bg-destructive/20"}`}>
                  {resultMessage}
                </div>
              )}
            </Card>

            {position === "none" && !showResult && (
              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={() => handleTrade("long")}
                  className="h-32 text-xl font-bold bg-success hover:bg-success/80 flex flex-col gap-2"
                >
                  <TrendingUp className="w-12 h-12" />
                  BUY (Go Long)
                  <span className="text-sm font-normal">Predict price will rise</span>
                </Button>
                <Button
                  onClick={() => handleTrade("short")}
                  className="h-32 text-xl font-bold bg-destructive hover:bg-destructive/80 flex flex-col gap-2"
                >
                  <TrendingDown className="w-12 h-12" />
                  SELL (Go Short)
                  <span className="text-sm font-normal">Predict price will fall</span>
                </Button>
              </div>
            )}

            {position !== "none" && !showResult && (
              <Card className="p-6 text-center">
                <p className="text-lg mb-2">
                  Position: <span className="font-bold">{position === "long" ? "LONG (Bullish)" : "SHORT (Bearish)"}</span>
                </p>
                <p className="text-muted-foreground">Entry Price: ${positionPrice.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground mt-2">Waiting for market to move...</p>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
};

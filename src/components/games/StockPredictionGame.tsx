import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, TrendingUp, TrendingDown } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Progress } from "@/components/ui/progress";

interface StockPredictionGameProps {
  onClose: () => void;
}

export const StockPredictionGame = ({ onClose }: StockPredictionGameProps) => {
  const { user } = useAuth();
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [currentPrice, setCurrentPrice] = useState(150);
  const [priceHistory, setPriceHistory] = useState<number[]>([145, 148, 150]);
  const [timeLeft, setTimeLeft] = useState(10);
  const [hasGuessed, setHasGuessed] = useState(false);

  useEffect(() => {
    if (hasGuessed) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleMissed();
          return 10;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [hasGuessed, round]);

  const handleMissed = () => {
    toast.error("Time's up!");
    nextRound(false);
  };

  const handleGuess = (direction: "up" | "down") => {
    if (hasGuessed) return;
    setHasGuessed(true);

    const nextPrice = currentPrice + (Math.random() - 0.4) * 10;
    const actualDirection = nextPrice > currentPrice ? "up" : "down";
    const isCorrect = direction === actualDirection;

    setTimeout(() => {
      setCurrentPrice(nextPrice);
      setPriceHistory([...priceHistory.slice(-4), nextPrice]);

      if (isCorrect) {
        const points = Math.ceil(timeLeft * 10);
        setScore(score + points);
        toast.success(`Correct! +${points} points`);
      } else {
        toast.error("Wrong prediction!");
      }

      setTimeout(() => nextRound(isCorrect), 1000);
    }, 500);
  };

  const nextRound = async (won: boolean) => {
    setHasGuessed(false);
    setTimeLeft(10);

    if (round >= 5) {
      await endGame();
    } else {
      setRound(round + 1);
    }
  };

  const endGame = async () => {
    const coins = Math.floor(score / 10);

    try {
      // Update coins atomically
      const { error: coinsError } = await supabase.rpc('increment_coins', {
        user_id_param: user?.id,
        amount: coins,
      });

      if (coinsError) throw coinsError;

      const { error: sessionError } = await supabase.from("game_sessions").insert({
        user_id: user?.id,
        game_id: "stock-prediction",
        score,
        coins_earned: coins,
        completed: true,
      });

      if (sessionError) throw sessionError;

      toast.success(`Game Over! You earned ${coins} coins!`);
    } catch (error) {
      console.error('Error saving game:', error);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-background/95 z-50 overflow-y-auto">
      <div className="max-w-2xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Stock Prediction Challenge</h1>
            <p className="text-muted-foreground">Predict if the stock goes up or down!</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-6 h-6" />
          </Button>
        </div>

        <div className="grid gap-4 mb-6">
          <Card className="p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">Round {round}/5</span>
              <span className="text-sm text-muted-foreground">Score: {score}</span>
            </div>
            <Progress value={(timeLeft / 10) * 100} className="h-2" />
            <p className="text-center mt-2 text-sm">{timeLeft}s remaining</p>
          </Card>

          <Card className="p-6">
            <h2 className="text-4xl font-bold text-center mb-4">${currentPrice.toFixed(2)}</h2>
            <div className="flex gap-2 mb-4 justify-center">
              {priceHistory.map((price, i) => (
                <div
                  key={i}
                  className={`w-12 h-20 rounded ${
                    i > 0 && price > priceHistory[i - 1] ? "bg-success/20" : "bg-destructive/20"
                  }`}
                  style={{ height: `${60 + (price - 140)}px` }}
                />
              ))}
            </div>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <Button
              size="lg"
              onClick={() => handleGuess("up")}
              disabled={hasGuessed}
              className="h-24 text-xl bg-success hover:bg-success/90"
            >
              <TrendingUp className="w-8 h-8 mr-2" />
              Up
            </Button>
            <Button
              size="lg"
              onClick={() => handleGuess("down")}
              disabled={hasGuessed}
              className="h-24 text-xl bg-destructive hover:bg-destructive/90"
            >
              <TrendingDown className="w-8 h-8 mr-2" />
              Down
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

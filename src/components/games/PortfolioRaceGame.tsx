import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Progress } from "@/components/ui/progress";

interface PortfolioRaceGameProps {
  onClose: () => void;
}

export const PortfolioRaceGame = ({ onClose }: PortfolioRaceGameProps) => {
  const { user } = useAuth();
  const [cash, setCash] = useState(10000);
  const [portfolio, setPortfolio] = useState({ stocks: 0, bonds: 0, crypto: 0 });
  const [prices, setPrices] = useState({ stocks: 100, bonds: 50, crypto: 200 });
  const [day, setDay] = useState(1);
  const [gameActive, setGameActive] = useState(true);

  useEffect(() => {
    if (!gameActive || day > 30) return;

    const timer = setInterval(() => {
      // Update prices randomly
      setPrices({
        stocks: Math.max(50, prices.stocks + (Math.random() - 0.5) * 10),
        bonds: Math.max(40, prices.bonds + (Math.random() - 0.5) * 3),
        crypto: Math.max(100, prices.crypto + (Math.random() - 0.5) * 30),
      });

      setDay(day + 1);

      if (day >= 30) {
        endGame();
      }
    }, 2000);

    return () => clearInterval(timer);
  }, [day, gameActive, prices]);

  const buyAsset = (asset: keyof typeof portfolio, amount: number) => {
    const cost = prices[asset] * amount;
    if (cash >= cost) {
      setCash(cash - cost);
      setPortfolio({ ...portfolio, [asset]: portfolio[asset] + amount });
      toast.success(`Bought ${amount} ${asset}!`);
    } else {
      toast.error("Not enough cash!");
    }
  };

  const sellAsset = (asset: keyof typeof portfolio, amount: number) => {
    if (portfolio[asset] >= amount) {
      const value = prices[asset] * amount;
      setCash(cash + value);
      setPortfolio({ ...portfolio, [asset]: portfolio[asset] - amount });
      toast.success(`Sold ${amount} ${asset}!`);
    } else {
      toast.error("Not enough assets!");
    }
  };

  const getTotalValue = () => {
    return (
      cash +
      portfolio.stocks * prices.stocks +
      portfolio.bonds * prices.bonds +
      portfolio.crypto * prices.crypto
    );
  };

  const endGame = async () => {
    setGameActive(false);
    const totalValue = getTotalValue();
    const profit = totalValue - 10000;
    const score = Math.max(0, Math.floor(profit));
    const coins = Math.floor(score / 100);

    // Get current coins
    const { data: profile } = await supabase
      .from("profiles")
      .select("coins")
      .eq("id", user?.id)
      .single();

    const { error } = await supabase.from("game_sessions").insert({
      user_id: user?.id,
      game_id: "portfolio-race",
      score,
      coins_earned: coins,
      completed: true,
    });

    if (!error && profile) {
      await supabase.from("profiles").update({
        coins: profile.coins + coins,
      }).eq("id", user?.id);

      toast.success(
        `Game Over! Portfolio Value: $${totalValue.toFixed(2)} | Profit: $${profit.toFixed(2)} | Earned ${coins} coins!`
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-background/95 z-50 overflow-y-auto">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Portfolio Race</h1>
            <p className="text-muted-foreground">Build the best portfolio in 30 days!</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-6 h-6" />
          </Button>
        </div>

        <Card className="p-4 mb-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-muted-foreground">Day</p>
              <p className="text-2xl font-bold">{day}/30</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Cash</p>
              <p className="text-2xl font-bold">${cash.toFixed(0)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Value</p>
              <p className="text-2xl font-bold text-success">${getTotalValue().toFixed(0)}</p>
            </div>
          </div>
          <Progress value={(day / 30) * 100} className="mt-4 h-2" />
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(["stocks", "bonds", "crypto"] as const).map((asset) => (
            <Card key={asset} className="p-4">
              <h3 className="font-bold capitalize mb-2">{asset}</h3>
              <p className="text-2xl font-bold mb-1">${prices[asset].toFixed(2)}</p>
              <p className="text-sm text-muted-foreground mb-4">Owned: {portfolio[asset]}</p>
              <div className="space-y-2">
                <Button
                  variant="default"
                  size="sm"
                  className="w-full"
                  onClick={() => buyAsset(asset, 1)}
                  disabled={!gameActive}
                >
                  Buy 1
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => sellAsset(asset, 1)}
                  disabled={!gameActive}
                >
                  Sell 1
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

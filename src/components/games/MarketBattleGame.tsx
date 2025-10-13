import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Zap } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Progress } from "@/components/ui/progress";

interface MarketBattleGameProps {
  onClose: () => void;
}

type Asset = {
  name: string;
  type: "good" | "bad";
  emoji: string;
  x: number;
  y: number;
  speed: number;
};

export const MarketBattleGame = ({ onClose }: MarketBattleGameProps) => {
  const { user } = useAuth();
  const [score, setScore] = useState(0);
  const [balance, setBalance] = useState(10000);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [gameActive, setGameActive] = useState(true);
  const [timeLeft, setTimeLeft] = useState(60);
  const [speed, setSpeed] = useState(1);

  const assetTypes = [
    { name: "Blue Chip Stock", type: "good", emoji: "📈", value: 100 },
    { name: "Index Fund", type: "good", emoji: "📊", value: 150 },
    { name: "Growth Stock", type: "good", emoji: "🚀", value: 200 },
    { name: "Junk Bond", type: "bad", emoji: "💣", value: -300 },
    { name: "Penny Stock", type: "bad", emoji: "⚠️", value: -200 },
    { name: "Risky Crypto", type: "bad", emoji: "🎲", value: -250 },
  ];

  useEffect(() => {
    if (!gameActive) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameActive]);

  useEffect(() => {
    if (!gameActive) return;

    const spawnAsset = () => {
      const asset = assetTypes[Math.floor(Math.random() * assetTypes.length)];
      const newAsset: Asset = {
        ...asset,
        type: asset.type as "good" | "bad",
        x: Math.random() * 80,
        y: -10,
        speed: (Math.random() * 2 + 1) * speed,
      };
      setAssets((prev) => [...prev, newAsset]);
    };

    const spawnInterval = setInterval(spawnAsset, 1500 / speed);

    return () => clearInterval(spawnInterval);
  }, [gameActive, speed]);

  useEffect(() => {
    if (!gameActive) return;

    const moveAssets = setInterval(() => {
      setAssets((prev) => {
        const updated = prev.map((asset) => ({
          ...asset,
          y: asset.y + asset.speed,
        }));

        // Remove assets that went off screen and penalize missed good assets
        const filtered = updated.filter((asset) => {
          if (asset.y > 100) {
            if (asset.type === "good") {
              setBalance((b) => Math.max(0, b - 100));
              toast.error("Missed opportunity!");
            }
            return false;
          }
          return true;
        });

        return filtered;
      });
    }, 50);

    return () => clearInterval(moveAssets);
  }, [gameActive]);

  useEffect(() => {
    // Increase speed as score increases
    const newSpeed = 1 + Math.floor(score / 500) * 0.5;
    setSpeed(newSpeed);
  }, [score]);

  const handleAssetClick = (index: number, asset: Asset) => {
    const assetValue = assetTypes.find((a) => a.name === asset.name);
    if (!assetValue) return;

    if (asset.type === "good") {
      setScore(score + Math.abs(assetValue.value));
      setBalance(balance + Math.abs(assetValue.value));
      toast.success(`+${Math.abs(assetValue.value)}!`);
    } else {
      setScore(Math.max(0, score - 50));
      setBalance(Math.max(0, balance + assetValue.value));
      toast.error(`${assetValue.value}!`);
    }

    setAssets((prev) => prev.filter((_, i) => i !== index));
  };

  const endGame = async () => {
    setGameActive(false);
    const coins = Math.floor(score / 20);

    const { data: profile } = await supabase
      .from("profiles")
      .select("coins")
      .eq("id", user?.id)
      .single();

    const { error: sessionError } = await supabase.from("game_sessions").insert({
      user_id: user?.id,
      game_id: "market-battle",
      score,
      coins_earned: coins,
      completed: true,
    });

    if (!sessionError && profile) {
      await supabase
        .from("profiles")
        .update({ coins: profile.coins + coins })
        .eq("id", user?.id);

      toast.success(`Game Over! You earned ${coins} coins!`);
    }

    setTimeout(() => onClose(), 2000);
  };

  return (
    <div className="fixed inset-0 bg-background/95 z-50 overflow-hidden">
      <div className="max-w-4xl mx-auto p-6 h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold">Market Battle</h1>
            <p className="text-muted-foreground">Click good assets, avoid bad ones!</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-6 h-6" />
          </Button>
        </div>

        <Card className="p-4 mb-4">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-sm text-muted-foreground">Score</p>
              <p className="text-2xl font-bold text-primary">{score}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Balance</p>
              <p className="text-2xl font-bold text-success">${balance}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Time</p>
              <p className="text-2xl font-bold text-warning">{timeLeft}s</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Speed</p>
              <p className="text-2xl font-bold flex items-center justify-center gap-1">
                {speed.toFixed(1)}x <Zap className="w-5 h-5 text-warning" />
              </p>
            </div>
          </div>
          <Progress value={(timeLeft / 60) * 100} className="mt-4 h-2" />
        </Card>

        <Card className="flex-1 bg-gradient-to-b from-background/50 to-background/80 relative overflow-hidden">
          {assets.map((asset, index) => (
            <button
              key={index}
              onClick={() => handleAssetClick(index, asset)}
              className={`absolute text-4xl cursor-pointer hover:scale-125 transition-transform ${
                asset.type === "bad" ? "animate-pulse" : ""
              }`}
              style={{
                left: `${asset.x}%`,
                top: `${asset.y}%`,
              }}
            >
              {asset.emoji}
            </button>
          ))}

          {!gameActive && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/90">
              <div className="text-center">
                <h2 className="text-4xl font-bold mb-2">Game Over!</h2>
                <p className="text-2xl">Final Score: {score}</p>
              </div>
            </div>
          )}
        </Card>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <Card className="p-3 bg-success/20 border-success/30">
            <p className="text-sm font-semibold mb-2">✓ Click These:</p>
            <div className="flex gap-2 text-2xl">
              <span>📈</span>
              <span>📊</span>
              <span>🚀</span>
            </div>
          </Card>
          <Card className="p-3 bg-destructive/20 border-destructive/30">
            <p className="text-sm font-semibold mb-2">✗ Avoid These:</p>
            <div className="flex gap-2 text-2xl">
              <span>💣</span>
              <span>⚠️</span>
              <span>🎲</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

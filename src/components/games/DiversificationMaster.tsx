import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { X, AlertTriangle, CheckCircle2, PieChart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface DiversificationMasterProps {
  onClose: () => void;
}

interface Asset {
  id: string;
  name: string;
  category: "stocks" | "bonds" | "realestate" | "commodities" | "cash";
  risk: "low" | "medium" | "high";
  return: number;
  allocation: number;
}

const availableAssets: Omit<Asset, "allocation">[] = [
  { id: "1", name: "S&P 500 Index", category: "stocks", risk: "medium", return: 10.5 },
  { id: "2", name: "Tech Growth Stocks", category: "stocks", risk: "high", return: 15.2 },
  { id: "3", name: "Dividend Aristocrats", category: "stocks", risk: "low", return: 8.0 },
  { id: "4", name: "Treasury Bonds", category: "bonds", risk: "low", return: 4.5 },
  { id: "5", name: "Corporate Bonds", category: "bonds", risk: "medium", return: 6.2 },
  { id: "6", name: "REITs", category: "realestate", risk: "medium", return: 9.0 },
  { id: "7", name: "Gold", category: "commodities", risk: "medium", return: 5.5 },
  { id: "8", name: "Cash/Money Market", category: "cash", risk: "low", return: 3.0 },
];

const scenarios = [
  {
    name: "Conservative Retirement (Age 60+)",
    description: "Preserve capital with steady income. Low risk tolerance.",
    target: { stocks: 30, bonds: 50, realestate: 10, commodities: 5, cash: 5 },
    advice: "Focus on capital preservation and income generation through bonds and dividend stocks."
  },
  {
    name: "Balanced Growth (Age 40-50)",
    description: "Balance growth and stability. Moderate risk tolerance.",
    target: { stocks: 50, bonds: 30, realestate: 10, commodities: 5, cash: 5 },
    advice: "A 60/40 portfolio balances growth potential with downside protection."
  },
  {
    name: "Aggressive Growth (Age 20-30)",
    description: "Maximize long-term growth. High risk tolerance, long time horizon.",
    target: { stocks: 70, bonds: 15, realestate: 10, commodities: 5, cash: 0 },
    advice: "Young investors can afford more volatility for higher returns over decades."
  },
  {
    name: "Inflation Hedge",
    description: "Protect against rising inflation with real assets.",
    target: { stocks: 40, bonds: 20, realestate: 20, commodities: 15, cash: 5 },
    advice: "Real estate and commodities historically perform well during inflationary periods."
  },
];

export const DiversificationMaster = ({ onClose }: DiversificationMasterProps) => {
  const { user } = useAuth();
  const [currentScenario, setCurrentScenario] = useState(0);
  const [portfolio, setPortfolio] = useState<Asset[]>([]);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState<{ score: number; message: string; details: string[] }>({
    score: 0,
    message: "",
    details: []
  });

  const scenario = scenarios[currentScenario];

  const addAsset = (asset: Omit<Asset, "allocation">) => {
    const existing = portfolio.find(p => p.id === asset.id);
    if (existing) {
      toast.error("Asset already in portfolio");
      return;
    }
    setPortfolio([...portfolio, { ...asset, allocation: 0 }]);
  };

  const removeAsset = (id: string) => {
    setPortfolio(portfolio.filter(p => p.id !== id));
  };

  const updateAllocation = (id: string, value: number) => {
    setPortfolio(portfolio.map(p => 
      p.id === id ? { ...p, allocation: Math.max(0, Math.min(100, value)) } : p
    ));
  };

  const getTotalAllocation = () => {
    return portfolio.reduce((sum, asset) => sum + asset.allocation, 0);
  };

  const getCategoryAllocation = () => {
    const totals: Record<string, number> = {
      stocks: 0,
      bonds: 0,
      realestate: 0,
      commodities: 0,
      cash: 0
    };
    
    portfolio.forEach(asset => {
      totals[asset.category] += asset.allocation;
    });
    
    return totals;
  };

  const evaluatePortfolio = () => {
    const total = getTotalAllocation();
    if (Math.abs(total - 100) > 0.1) {
      toast.error("Portfolio must total 100%");
      return;
    }

    const allocation = getCategoryAllocation();
    const target = scenario.target;

    let totalDiff = 0;
    const details: string[] = [];

    Object.keys(target).forEach(category => {
      const diff = Math.abs(allocation[category] - target[category]);
      totalDiff += diff;
      
      const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
      if (diff > 5) {
        details.push(`${categoryName}: ${allocation[category].toFixed(1)}% (target: ${target[category]}%) - ${diff > 10 ? "❌ Far off" : "⚠️ Close"}`);
      } else {
        details.push(`${categoryName}: ${allocation[category].toFixed(1)}% ✅ Perfect!`);
      }
    });

    const portfolioScore = Math.max(0, 100 - totalDiff * 2);
    let message = "";
    
    if (portfolioScore >= 90) {
      message = "🎉 Excellent! You've created a well-diversified portfolio that matches the scenario perfectly.";
      setScore(score + 3);
    } else if (portfolioScore >= 70) {
      message = "👍 Good job! Your portfolio is reasonably diversified with minor improvements needed.";
      setScore(score + 2);
    } else if (portfolioScore >= 50) {
      message = "⚠️ Fair attempt. Your portfolio needs better diversification to match the scenario.";
      setScore(score + 1);
    } else {
      message = "❌ Poor diversification. Review the scenario requirements and adjust your allocations.";
    }

    setFeedback({ score: portfolioScore, message, details });
    setShowFeedback(true);
  };

  const nextScenario = () => {
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(currentScenario + 1);
      setPortfolio([]);
      setShowFeedback(false);
    } else {
      endGame();
    }
  };

  const endGame = async () => {
    const coinsEarned = score * 10;

    try {
      const { error: coinsError } = await supabase.rpc('increment_coins', {
        user_id_param: user?.id,
        amount: coinsEarned,
      });

      if (coinsError) throw coinsError;

      const { error: sessionError } = await supabase.from("game_sessions").insert({
        user_id: user?.id,
        game_id: "00000000-0000-0000-0000-000000000004",
        score: score,
        coins_earned: coinsEarned,
        completed: true,
      });

      if (sessionError) throw sessionError;

      toast.success(`Game complete! Earned ${coinsEarned} coins`);
    } catch (error) {
      console.error('Error saving game:', error);
    }

    onClose();
  };

  const totalAllocation = getTotalAllocation();

  return (
    <div className="fixed inset-0 bg-background/95 z-50 overflow-y-auto">
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Diversification Master</h1>
            <p className="text-muted-foreground">Scenario {currentScenario + 1} of {scenarios.length}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-6 h-6" />
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Score</p>
            <p className="text-2xl font-bold text-primary">{score}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Total Allocation</p>
            <p className={`text-2xl font-bold ${Math.abs(totalAllocation - 100) < 0.1 ? "text-success" : "text-destructive"}`}>
              {totalAllocation.toFixed(1)}%
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Assets</p>
            <p className="text-2xl font-bold">{portfolio.length}</p>
          </Card>
        </div>

        <Card className="p-6 mb-6 bg-gradient-hero border-0">
          <div className="flex items-start gap-4">
            <PieChart className="w-12 h-12 text-primary flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-bold mb-2">{scenario.name}</h2>
              <p className="text-muted-foreground mb-3">{scenario.description}</p>
              <p className="text-sm"><strong>Strategy:</strong> {scenario.advice}</p>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-bold mb-4">Available Assets</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {availableAssets.map(asset => (
                <Card key={asset.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold">{asset.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {asset.category.charAt(0).toUpperCase() + asset.category.slice(1)} • {asset.risk} risk • {asset.return}% return
                      </p>
                    </div>
                    <Button onClick={() => addAsset(asset)} size="sm">
                      Add
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Your Portfolio</h3>
            {portfolio.length === 0 ? (
              <Card className="p-8 text-center text-muted-foreground">
                Add assets from the left to build your portfolio
              </Card>
            ) : (
              <div className="space-y-3">
                {portfolio.map(asset => (
                  <Card key={asset.id} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-bold">{asset.name}</p>
                      <Button variant="ghost" size="sm" onClick={() => removeAsset(asset.id)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="1"
                        value={asset.allocation}
                        onChange={(e) => updateAllocation(asset.id, parseFloat(e.target.value) || 0)}
                        className="w-20 px-3 py-1 rounded border bg-background"
                      />
                      <Progress value={asset.allocation} className="flex-1" />
                      <span className="text-sm font-bold w-12">{asset.allocation.toFixed(1)}%</span>
                    </div>
                  </Card>
                ))}
                
                <Button
                  onClick={evaluatePortfolio}
                  disabled={Math.abs(totalAllocation - 100) > 0.1}
                  className="w-full bg-gradient-primary mt-4"
                >
                  {Math.abs(totalAllocation - 100) > 0.1 ? "Must total 100%" : "Evaluate Portfolio"}
                </Button>
              </div>
            )}
          </div>
        </div>

        {showFeedback && (
          <Card className="p-6 mt-6 border-2 border-primary">
            <h3 className="text-xl font-bold mb-3">Portfolio Evaluation</h3>
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-bold">Score:</span>
                <span className="text-2xl font-bold text-primary">{feedback.score.toFixed(0)}/100</span>
              </div>
              <Progress value={feedback.score} className="h-3" />
            </div>
            <p className="text-lg mb-4">{feedback.message}</p>
            <div className="space-y-2 mb-4">
              {feedback.details.map((detail, i) => (
                <p key={i} className="text-sm">{detail}</p>
              ))}
            </div>
            <Button onClick={nextScenario} className="w-full bg-gradient-primary">
              {currentScenario < scenarios.length - 1 ? "Next Scenario" : "Finish Game"}
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

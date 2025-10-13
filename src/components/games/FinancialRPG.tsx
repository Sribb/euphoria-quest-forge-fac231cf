import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Heart, DollarSign, Briefcase } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Progress } from "@/components/ui/progress";

interface FinancialRPGProps {
  onClose: () => void;
}

type Scenario = {
  title: string;
  description: string;
  choices: {
    text: string;
    wealth: number;
    happiness: number;
    portfolio: number;
    consequence: string;
  }[];
};

export const FinancialRPG = ({ onClose }: FinancialRPGProps) => {
  const { user } = useAuth();
  const [wealth, setWealth] = useState(50000);
  const [happiness, setHappiness] = useState(80);
  const [portfolio, setPortfolio] = useState(10000);
  const [stage, setStage] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);

  const scenarios: Scenario[] = [
    {
      title: "Starting Your Career",
      description: "You just graduated and landed your first job making $50,000/year. What's your financial strategy?",
      choices: [
        {
          text: "Save 20% and invest in index funds (Warren Buffett's advice)",
          wealth: 5000,
          happiness: 5,
          portfolio: 10000,
          consequence: "Smart choice! Your disciplined saving builds a strong foundation. Portfolio grows steadily.",
        },
        {
          text: "Spend on lifestyle upgrades and save nothing",
          wealth: -10000,
          happiness: 15,
          portfolio: -5000,
          consequence: "You enjoy life now, but your future self may regret this. No portfolio growth.",
        },
        {
          text: "Save aggressively (50%) but invest nothing",
          wealth: 15000,
          happiness: -10,
          portfolio: 0,
          consequence: "You're saving well, but missing out on compound growth. Cash loses value to inflation.",
        },
      ],
    },
    {
      title: "The Market Crash",
      description: "The market crashes 30%! Your portfolio drops significantly. How do you respond?",
      choices: [
        {
          text: "Panic sell everything to prevent more losses",
          wealth: -5000,
          happiness: -15,
          portfolio: -20000,
          consequence: "You sold at the bottom! Classic mistake. Buy high, sell low is not the way.",
        },
        {
          text: "Hold steady and keep investing (Buy the dip)",
          wealth: 0,
          happiness: -5,
          portfolio: 15000,
          consequence: "Buffett would be proud! You stayed calm and bought quality assets at a discount.",
        },
        {
          text: "Stop investing and wait for recovery",
          wealth: 0,
          happiness: -10,
          portfolio: -5000,
          consequence: "You missed the best buying opportunity. Timing the market rarely works.",
        },
      ],
    },
    {
      title: "Career Opportunity",
      description: "A startup offers you equity worth potentially $200,000, but the salary is 20% less. What do you do?",
      choices: [
        {
          text: "Take the risk - startups can create wealth",
          wealth: -10000,
          happiness: 5,
          portfolio: 50000,
          consequence: "Bold move! The startup succeeds and your equity is worth a fortune.",
        },
        {
          text: "Negotiate for both equity and salary",
          wealth: 5000,
          happiness: 10,
          portfolio: 20000,
          consequence: "Smart negotiation! You got the best of both worlds.",
        },
        {
          text: "Stay at your stable job with benefits",
          wealth: 10000,
          happiness: 0,
          portfolio: 5000,
          consequence: "Safe choice. You maintain steady income but miss the upside potential.",
        },
      ],
    },
    {
      title: "The Windfall",
      description: "You receive $50,000 inheritance. How do you use it?",
      choices: [
        {
          text: "Invest it all in a diversified portfolio",
          wealth: 0,
          happiness: 0,
          portfolio: 50000,
          consequence: "Excellent! Your inheritance will compound over decades, creating generational wealth.",
        },
        {
          text: "Buy a luxury car you've always wanted",
          wealth: -50000,
          happiness: 20,
          portfolio: -10000,
          consequence: "The car depreciates 30% instantly. An expensive decision that provides temporary happiness.",
        },
        {
          text: "Split: 60% invest, 20% emergency fund, 20% enjoy",
          wealth: 10000,
          happiness: 10,
          portfolio: 30000,
          consequence: "Balanced approach! You secure your future while also enjoying the present.",
        },
      ],
    },
    {
      title: "Retirement Planning",
      description: "You're 40 years old. Time to think seriously about retirement. What's your strategy?",
      choices: [
        {
          text: "Max out 401(k) and IRA contributions",
          wealth: -5000,
          happiness: 0,
          portfolio: 40000,
          consequence: "Tax-advantaged investing at its finest! Your future self will thank you.",
        },
        {
          text: "Live for today, retirement is far away",
          wealth: 10000,
          happiness: 15,
          portfolio: -15000,
          consequence: "Dangerous thinking. Time is your greatest asset in investing.",
        },
        {
          text: "Consult a financial advisor and create a plan",
          wealth: -2000,
          happiness: 10,
          portfolio: 35000,
          consequence: "Professional guidance pays off! You have a clear path to retirement security.",
        },
      ],
    },
  ];

  const currentScenario = scenarios[stage];

  const handleChoice = async (choiceIndex: number) => {
    const choice = currentScenario.choices[choiceIndex];
    setSelectedChoice(choiceIndex);

    // Update stats
    setWealth(wealth + choice.wealth);
    setHappiness(Math.max(0, Math.min(100, happiness + choice.happiness)));
    setPortfolio(Math.max(0, portfolio + choice.portfolio));

    toast.info(choice.consequence);

    // Wait before moving to next scenario
    setTimeout(() => {
      if (stage < scenarios.length - 1) {
        setStage(stage + 1);
        setSelectedChoice(null);
      } else {
        endGame();
      }
    }, 3000);
  };

  const endGame = async () => {
    const finalScore = wealth + portfolio + happiness * 100;
    const coins = Math.floor(finalScore / 500);

    const { data: profile } = await supabase
      .from("profiles")
      .select("coins")
      .eq("id", user?.id)
      .single();

    const { error: sessionError } = await supabase.from("game_sessions").insert({
      user_id: user?.id,
      game_id: "financial-rpg",
      score: finalScore,
      coins_earned: coins,
      completed: true,
    });

    if (!sessionError && profile) {
      await supabase
        .from("profiles")
        .update({ coins: profile.coins + coins })
        .eq("id", user?.id);

      toast.success(`Journey Complete! You earned ${coins} coins!`);
    }

    setTimeout(() => onClose(), 2000);
  };

  const happinessPercent = happiness;
  const progressPercent = ((stage + 1) / scenarios.length) * 100;

  return (
    <div className="fixed inset-0 bg-background/95 z-50 overflow-y-auto">
      <div className="max-w-3xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Financial Life Journey</h1>
            <p className="text-muted-foreground">Make wise decisions to build wealth and happiness</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-6 h-6" />
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="p-4 bg-gradient-hero border-success/20">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-success" />
              <span className="text-sm text-muted-foreground">Wealth</span>
            </div>
            <p className="text-2xl font-bold text-success">${wealth.toLocaleString()}</p>
          </Card>

          <Card className="p-4 bg-gradient-hero border-warning/20">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="w-5 h-5 text-warning" />
              <span className="text-sm text-muted-foreground">Happiness</span>
            </div>
            <p className="text-2xl font-bold text-warning">{happiness}%</p>
            <Progress value={happinessPercent} className="h-2 mt-2" />
          </Card>

          <Card className="p-4 bg-gradient-hero border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <Briefcase className="w-5 h-5 text-primary" />
              <span className="text-sm text-muted-foreground">Portfolio</span>
            </div>
            <p className="text-2xl font-bold text-primary">${portfolio.toLocaleString()}</p>
          </Card>
        </div>

        {/* Progress */}
        <Card className="p-4 mb-6 bg-gradient-hero">
          <div className="flex justify-between text-sm mb-2">
            <span>Life Stage {stage + 1} of {scenarios.length}</span>
            <span className="font-semibold">{Math.round(progressPercent)}%</span>
          </div>
          <Progress value={progressPercent} className="h-3" />
        </Card>

        {/* Scenario */}
        <Card className="p-6 bg-gradient-hero border-0 mb-6">
          <h2 className="text-2xl font-bold mb-2">{currentScenario.title}</h2>
          <p className="text-muted-foreground mb-6">{currentScenario.description}</p>

          <div className="space-y-3">
            {currentScenario.choices.map((choice, index) => (
              <Button
                key={index}
                variant={selectedChoice === index ? "default" : "outline"}
                className="w-full justify-start text-left h-auto py-4 px-6"
                onClick={() => handleChoice(index)}
                disabled={selectedChoice !== null}
              >
                <span className="flex-1">{choice.text}</span>
              </Button>
            ))}
          </div>
        </Card>

        {/* Educational Tip */}
        <Card className="p-4 bg-gradient-primary/20 border-primary/30">
          <p className="text-sm">
            <span className="font-semibold">💡 Investment Wisdom:</span> "The stock market is a device for 
            transferring money from the impatient to the patient." - Warren Buffett
          </p>
        </Card>
      </div>
    </div>
  );
};

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, TrendingUp, TrendingDown, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { playGameWin, playCorrect, playIncorrect } from "@/lib/soundEffects";

const macroScenarios = [
  {
    event: "Federal Reserve raises interest rates by 0.75%",
    correctImpacts: ["bonds_down", "dollar_up", "stocks_down"],
    impacts: [
      { id: "bonds_down", label: "Bond Prices Fall", correct: true, reason: "Higher rates → existing bonds less valuable" },
      { id: "bonds_up", label: "Bond Prices Rise", correct: false, reason: "Inverse relationship with rates" },
      { id: "dollar_up", label: "USD Strengthens", correct: true, reason: "Higher yields attract foreign capital" },
      { id: "dollar_down", label: "USD Weakens", correct: false, reason: "Opposite effect occurs" },
      { id: "stocks_down", label: "Stock Market Declines", correct: true, reason: "Higher discount rates → lower valuations" },
      { id: "stocks_up", label: "Stock Market Rallies", correct: false, reason: "Rate hikes typically pressure equities" },
    ]
  },
  {
    event: "Inflation data comes in 2% above expectations",
    correctImpacts: ["gold_up", "real_estate_pressure", "consumer_stocks_down"],
    impacts: [
      { id: "gold_up", label: "Gold Prices Rise", correct: true, reason: "Gold hedges against inflation" },
      { id: "gold_down", label: "Gold Prices Fall", correct: false, reason: "Inflation typically boosts gold" },
      { id: "real_estate_pressure", label: "Real Estate Under Pressure", correct: true, reason: "Higher mortgage rates reduce demand" },
      { id: "real_estate_boom", label: "Real Estate Booms", correct: false, reason: "Inflation hurts affordability" },
      { id: "consumer_stocks_down", label: "Consumer Stocks Decline", correct: true, reason: "Reduced purchasing power → lower sales" },
      { id: "consumer_stocks_up", label: "Consumer Stocks Rally", correct: false, reason: "Inflation hurts consumer spending" },
    ]
  },
];

interface MarketMindsetGameProps {
  onClose: () => void;
}

export const MarketMindsetGame = ({ onClose }: MarketMindsetGameProps) => {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedImpacts, setSelectedImpacts] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const scenario = macroScenarios[currentScenario];

  const handleToggleImpact = (impactId: string) => {
    if (submitted) return;
    if (selectedImpacts.includes(impactId)) {
      setSelectedImpacts(selectedImpacts.filter(id => id !== impactId));
    } else {
      setSelectedImpacts([...selectedImpacts, impactId]);
    }
  };

  const handleSubmit = () => {
    const correctSelections = selectedImpacts.filter(id =>
      scenario.correctImpacts.includes(id)
    ).length;
    const incorrectSelections = selectedImpacts.filter(id =>
      !scenario.correctImpacts.includes(id)
    ).length;

    const points = correctSelections * 10 - incorrectSelections * 5;
    setScore(score + Math.max(0, points));
    setSubmitted(true);
  };

  const handleNext = () => {
    if (currentScenario < macroScenarios.length - 1) {
      setCurrentScenario(currentScenario + 1);
      setSelectedImpacts([]);
      setSubmitted(false);
    } else {
      toast.success(`Market Mindset complete! Score: ${score}`);
      playGameWin();
    }
  };

  return (
    <div className="fixed inset-0 bg-background/95 z-50 overflow-y-auto animate-fade-in">
      <div className="container max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6 animate-scale-in">
          <Button variant="ghost" size="icon" onClick={onClose} className="hover-scale">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1 text-center">
            <h2 className="text-2xl font-bold">Market Mindset</h2>
            <p className="text-muted-foreground">Macro-economic cause and effect</p>
          </div>
          <Badge variant="secondary" className="text-lg px-4 py-2">Score: {score}</Badge>
        </div>

        <Card className="p-8">
          <Badge className="mb-4">Scenario {currentScenario + 1} of {macroScenarios.length}</Badge>
          <div className="p-6 bg-gradient-hero rounded-lg mb-6">
            <h3 className="text-xl font-bold text-white mb-2">Breaking News</h3>
            <p className="text-white/90 text-lg">{scenario.event}</p>
          </div>

          <p className="text-sm text-muted-foreground mb-6">
            Select ALL correct market impacts from this macro event:
          </p>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {scenario.impacts.map((impact) => {
              const isSelected = selectedImpacts.includes(impact.id);
              const isCorrect = scenario.correctImpacts.includes(impact.id);
              const showResult = submitted;

              return (
                <Button
                  key={impact.id}
                  variant={isSelected ? "default" : "outline"}
                  className={`h-auto py-4 px-6 justify-start text-left ${
                    showResult
                      ? isCorrect && isSelected
                        ? "border-success bg-success/10"
                        : !isCorrect && isSelected
                        ? "border-destructive bg-destructive/10"
                        : isCorrect
                        ? "border-warning bg-warning/10"
                        : ""
                      : ""
                  }`}
                  onClick={() => handleToggleImpact(impact.id)}
                  disabled={submitted}
                >
                  <div className="flex items-center gap-3">
                    {showResult && isCorrect && <span className="text-success">✓</span>}
                    {showResult && !isCorrect && isSelected && <span className="text-destructive">✗</span>}
                    <span>{impact.label}</span>
                  </div>
                </Button>
              );
            })}
          </div>

          {submitted && (
            <div className="p-6 bg-primary/10 rounded-lg mb-6">
              <h4 className="font-bold mb-3">Causal Chain Explanation:</h4>
              <div className="space-y-2 text-sm">
                {scenario.impacts
                  .filter(i => scenario.correctImpacts.includes(i.id))
                  .map((impact) => (
                    <p key={impact.id}>
                      <strong>{impact.label}:</strong> {impact.reason}
                    </p>
                  ))}
              </div>
            </div>
          )}

          {!submitted ? (
            <Button
              onClick={handleSubmit}
              disabled={selectedImpacts.length === 0}
              className="w-full"
              size="lg"
            >
              Submit Predictions
            </Button>
          ) : (
            <Button onClick={handleNext} className="w-full" size="lg">
              {currentScenario < macroScenarios.length - 1 ? "Next Scenario" : "Finish"}
            </Button>
          )}
        </Card>
      </div>
    </div>
  );
};

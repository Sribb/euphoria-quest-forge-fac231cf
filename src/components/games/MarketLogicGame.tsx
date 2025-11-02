import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus, X } from "lucide-react";
import { toast } from "sonner";

const scenarios = [
  {
    headline: "Tech Giant Reports 25% Revenue Growth, Beats Analyst Expectations",
    correctAnswer: "up",
    reasoning: "Strong earnings typically increase investor confidence and drive prices higher",
    options: [
      { value: "up", label: "Price Goes Up", reason: "Higher earnings → investor optimism → buying pressure" },
      { value: "down", label: "Price Goes Down", reason: "Incorrect - positive earnings news typically drives prices up" },
      { value: "neutral", label: "No Change", reason: "Unlikely - significant earnings beats usually move markets" },
    ]
  },
  {
    headline: "Federal Reserve Announces Unexpected Interest Rate Hike",
    correctAnswer: "down",
    reasoning: "Higher rates increase borrowing costs and reduce corporate valuations",
    options: [
      { value: "up", label: "Price Goes Up", reason: "Incorrect - rate hikes typically pressure stock prices" },
      { value: "down", label: "Price Goes Down", reason: "Higher rates → increased costs → lower valuations → selling pressure" },
      { value: "neutral", label: "No Change", reason: "Unlikely - rate changes significantly impact equity markets" },
    ]
  },
  {
    headline: "Major Product Recall Announced Due to Safety Concerns",
    correctAnswer: "down",
    reasoning: "Recalls damage brand reputation and create financial liabilities",
    options: [
      { value: "up", label: "Price Goes Up", reason: "Incorrect - recalls negatively impact company value" },
      { value: "down", label: "Price Goes Down", reason: "Recall costs + reputation damage → investor concerns → selling" },
      { value: "neutral", label: "No Change", reason: "Unlikely - recalls typically trigger immediate price reactions" },
    ]
  },
];

interface MarketLogicGameProps {
  onClose: () => void;
}

export const MarketLogicGame = ({ onClose }: MarketLogicGameProps) => {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const scenario = scenarios[currentScenario];
  const isCorrect = selectedAnswer === scenario.correctAnswer;

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    setShowFeedback(true);
    if (answer === scenario.correctAnswer) {
      setScore(score + 10);
    }
  };

  const handleNext = () => {
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(currentScenario + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      toast.success(`Game complete! Final score: ${score}/${scenarios.length * 10}`);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-background/95 z-50 overflow-y-auto">
      <div className="container max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Market Logic</h2>
            <p className="text-muted-foreground">Understand price movements through cause and effect</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="text-lg px-4 py-2">
              Score: {score}
            </Badge>
            <Button variant="outline" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <Card className="p-8">
          <div className="mb-6">
            <Badge className="mb-4">
              Scenario {currentScenario + 1} of {scenarios.length}
            </Badge>
            <h3 className="text-xl font-bold mb-4 leading-relaxed">{scenario.headline}</h3>
          </div>

          <div className="space-y-3 mb-6">
            {scenario.options.map((option) => (
              <Button
                key={option.value}
                variant={selectedAnswer === option.value ? "default" : "outline"}
                className="w-full justify-start text-left h-auto py-4 px-6"
                onClick={() => !showFeedback && handleAnswer(option.value)}
                disabled={showFeedback}
              >
                <div className="flex items-center gap-3 w-full">
                  {option.value === "up" && <TrendingUp className="w-5 h-5 text-success" />}
                  {option.value === "down" && <TrendingDown className="w-5 h-5 text-destructive" />}
                  {option.value === "neutral" && <Minus className="w-5 h-5 text-muted-foreground" />}
                  <span className="font-semibold">{option.label}</span>
                </div>
              </Button>
            ))}
          </div>

          {showFeedback && (
            <div className={`p-6 rounded-lg mb-6 ${isCorrect ? "bg-success/10 border border-success" : "bg-destructive/10 border border-destructive"}`}>
              <h4 className="font-bold text-lg mb-2">
                {isCorrect ? "✓ Correct!" : "✗ Incorrect"}
              </h4>
              <p className="mb-3">{scenario.reasoning}</p>
              <div className="text-sm space-y-2">
                {scenario.options.map((opt) => (
                  <p key={opt.value} className={opt.value === scenario.correctAnswer ? "font-semibold" : "text-muted-foreground"}>
                    <strong>{opt.label}:</strong> {opt.reason}
                  </p>
                ))}
              </div>
            </div>
          )}

          {showFeedback && (
            <Button onClick={handleNext} className="w-full" size="lg">
              {currentScenario < scenarios.length - 1 ? "Next Scenario" : "Finish Game"}
            </Button>
          )}
        </Card>
      </div>
    </div>
  );
};

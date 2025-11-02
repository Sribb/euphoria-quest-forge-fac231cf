import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { toast } from "sonner";

const chartScenarios = [
  {
    description: "Strong uptrend with higher highs and higher lows. Volume increasing.",
    pattern: "Bullish Continuation",
    correctAnswer: "continues_up",
    options: [
      { value: "continues_up", label: "Continue Upward", reason: "Strong momentum + volume confirms trend" },
      { value: "reverses_down", label: "Reverses Downward", reason: "No reversal signals present" },
      { value: "consolidates", label: "Consolidates Sideways", reason: "Momentum suggests continuation" },
    ]
  },
  {
    description: "Price touches resistance level three times, volume declining.",
    pattern: "Triple Top Formation",
    correctAnswer: "reverses_down",
    options: [
      { value: "continues_up", label: "Breaks Through Resistance", reason: "Declining volume suggests weakness" },
      { value: "reverses_down", label: "Breaks Down", reason: "Triple top + weak volume = bearish reversal" },
      { value: "consolidates", label: "Range-Bound Trading", reason: "Pattern suggests imminent breakout/breakdown" },
    ]
  },
];

interface ChartDecoderGameProps {
  onClose: () => void;
}

export const ChartDecoderGame = ({ onClose }: ChartDecoderGameProps) => {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const scenario = chartScenarios[currentScenario];

  const handleAnswer = (answer: string) => {
    setSelected(answer);
    setShowFeedback(true);
    if (answer === scenario.correctAnswer) setScore(score + 15);
  };

  const handleNext = () => {
    if (currentScenario < chartScenarios.length - 1) {
      setCurrentScenario(currentScenario + 1);
      setSelected(null);
      setShowFeedback(false);
    } else {
      toast.success(`Chart Decoder complete! Score: ${score}`);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-background/95 z-50 overflow-y-auto">
      <div className="container max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Chart Decoder</h2>
            <p className="text-muted-foreground">Identify logical chart continuations</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="text-lg px-4 py-2">Score: {score}</Badge>
            <Button variant="outline" size="icon" onClick={onClose}><X className="w-5 h-5" /></Button>
          </div>
        </div>

        <Card className="p-8">
          <Badge className="mb-4">Pattern {currentScenario + 1}</Badge>
          <h3 className="text-lg font-bold mb-2">{scenario.pattern}</h3>
          <p className="text-muted-foreground mb-6">{scenario.description}</p>

          <div className="space-y-3 mb-6">
            {scenario.options.map((opt) => (
              <Button
                key={opt.value}
                variant={selected === opt.value ? "default" : "outline"}
                className="w-full text-left justify-start h-auto py-4"
                onClick={() => !showFeedback && handleAnswer(opt.value)}
                disabled={showFeedback}
              >
                {opt.label}
              </Button>
            ))}
          </div>

          {showFeedback && (
            <div className={`p-6 rounded-lg mb-6 ${selected === scenario.correctAnswer ? "bg-success/10" : "bg-destructive/10"}`}>
              <h4 className="font-bold mb-2">{selected === scenario.correctAnswer ? "✓ Correct!" : "✗ Incorrect"}</h4>
              {scenario.options.map((opt) => (
                <p key={opt.value} className="text-sm mb-1"><strong>{opt.label}:</strong> {opt.reason}</p>
              ))}
            </div>
          )}

          {showFeedback && (
            <Button onClick={handleNext} className="w-full" size="lg">
              {currentScenario < chartScenarios.length - 1 ? "Next Pattern" : "Finish"}
            </Button>
          )}
        </Card>
      </div>
    </div>
  );
};

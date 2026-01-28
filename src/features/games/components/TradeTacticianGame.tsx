import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const tradingScenarios = [
  {
    situation: "Stock is at $95. You want to buy if it dips to $90 to catch support.",
    correctOrderType: "limit",
    correctPrice: 90,
    explanation: "Use a LIMIT buy order at $90 to ensure you don't overpay"
  },
  {
    situation: "You own shares at $100. Protect against losses if price falls below $85.",
    correctOrderType: "stop",
    correctPrice: 85,
    explanation: "Use a STOP-LOSS sell order at $85 to limit downside risk"
  },
  {
    situation: "Stock breaking out above $120 resistance. You want to buy on confirmation.",
    correctOrderType: "stop",
    correctPrice: 120,
    explanation: "Use a BUY-STOP at $120 to enter once breakout is confirmed"
  },
];

interface TradeTacticianGameProps {
  onClose: () => void;
}

export const TradeTacticianGame = ({ onClose }: TradeTacticianGameProps) => {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [orderType, setOrderType] = useState("");
  const [price, setPrice] = useState("");
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);

  const scenario = tradingScenarios[currentScenario];

  const handleSubmit = () => {
    const isCorrectType = orderType === scenario.correctOrderType;
    const isCorrectPrice = parseFloat(price) === scenario.correctPrice;

    if (isCorrectType && isCorrectPrice) {
      setScore(score + 20);
      setFeedback(`✓ Correct! ${scenario.explanation}`);
    } else {
      setFeedback(`✗ Incorrect. ${scenario.explanation}`);
    }
  };

  const handleNext = () => {
    if (currentScenario < tradingScenarios.length - 1) {
      setCurrentScenario(currentScenario + 1);
      setOrderType("");
      setPrice("");
      setFeedback(null);
    } else {
      toast.success(`Trade Tactician complete! Score: ${score}/${tradingScenarios.length * 20}`);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-background/95 z-50 overflow-y-auto animate-fade-in">
      <div className="container max-w-3xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6 animate-scale-in">
          <Button variant="ghost" size="icon" onClick={onClose} className="hover-scale">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1 text-center">
            <h2 className="text-2xl font-bold">Trade Tactician</h2>
            <p className="text-muted-foreground">Master order execution logic</p>
          </div>
          <Badge variant="secondary" className="text-lg px-4 py-2">Score: {score}</Badge>
        </div>

        <Card className="p-8">
          <Badge className="mb-4">Scenario {currentScenario + 1} of {tradingScenarios.length}</Badge>
          <p className="text-lg mb-6 leading-relaxed">{scenario.situation}</p>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2">Order Type</label>
              <Select value={orderType} onValueChange={setOrderType} disabled={!!feedback}>
                <SelectTrigger>
                  <SelectValue placeholder="Select order type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="market">Market Order</SelectItem>
                  <SelectItem value="limit">Limit Order</SelectItem>
                  <SelectItem value="stop">Stop Order</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Price ($)</label>
              <Input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Enter price"
                disabled={!!feedback}
              />
            </div>
          </div>

          {!feedback ? (
            <Button
              onClick={handleSubmit}
              disabled={!orderType || !price}
              className="w-full"
              size="lg"
            >
              Submit Trade Logic
            </Button>
          ) : (
            <>
              <div className={`p-6 rounded-lg mb-6 ${feedback.startsWith("✓") ? "bg-success/10 border border-success" : "bg-destructive/10 border border-destructive"}`}>
                <p className="font-medium">{feedback}</p>
              </div>
              <Button onClick={handleNext} className="w-full" size="lg">
                {currentScenario < tradingScenarios.length - 1 ? "Next Scenario" : "Finish"}
              </Button>
            </>
          )}
        </Card>
      </div>
    </div>
  );
};

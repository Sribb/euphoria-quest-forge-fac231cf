import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

const portfolios = [
  {
    name: "Tech Growth Portfolio",
    volatility: "High",
    beta: 1.5,
    expectedReturn: 18,
    risk: 5
  },
  {
    name: "Dividend Blue Chips",
    volatility: "Low",
    beta: 0.7,
    expectedReturn: 8,
    risk: 2
  },
  {
    name: "Balanced Index Fund",
    volatility: "Medium",
    beta: 1.0,
    expectedReturn: 12,
    risk: 3
  },
  {
    name: "Crypto Speculative",
    volatility: "Very High",
    beta: 2.5,
    expectedReturn: 35,
    risk: 9
  },
];

interface RiskRewardMatrixProps {
  onClose: () => void;
}

export const RiskRewardMatrix = ({ onClose }: RiskRewardMatrixProps) => {
  const [sortedPortfolios, setSortedPortfolios] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const correctOrder = portfolios
    .sort((a, b) => a.risk - b.risk)
    .map(p => p.name);

  const handleDrop = (portfolioName: string) => {
    if (!sortedPortfolios.includes(portfolioName)) {
      setSortedPortfolios([...sortedPortfolios, portfolioName]);
    }
  };

  const handleRemove = (index: number) => {
    setSortedPortfolios(sortedPortfolios.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    let points = 0;
    sortedPortfolios.forEach((name, idx) => {
      if (name === correctOrder[idx]) points += 25;
    });
    setScore(points);
    setSubmitted(true);
    if (points === 100) {
      toast.success("Perfect! You understand risk/reward relationships!");
    }
  };

  return (
    <div className="fixed inset-0 bg-background/95 z-50 overflow-y-auto">
      <div className="container max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Risk/Reward Matrix</h2>
            <p className="text-muted-foreground">Arrange portfolios from safest to riskiest</p>
          </div>
          <Button variant="outline" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="font-bold mb-4">Available Portfolios</h3>
            <div className="space-y-3">
              {portfolios.filter(p => !sortedPortfolios.includes(p.name)).map((portfolio) => (
                <Button
                  key={portfolio.name}
                  variant="outline"
                  className="w-full text-left justify-start h-auto py-4"
                  onClick={() => handleDrop(portfolio.name)}
                  disabled={submitted}
                >
                  <div className="w-full">
                    <div className="font-semibold mb-1">{portfolio.name}</div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div>Return: {portfolio.expectedReturn}% | Beta: {portfolio.beta}</div>
                      <div>Volatility: {portfolio.volatility}</div>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Your Ranking (Safest → Riskiest)
            </h3>
            <div className="space-y-3 mb-6">
              {sortedPortfolios.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">Drag portfolios here</p>
              ) : (
                sortedPortfolios.map((name, idx) => {
                  const portfolio = portfolios.find(p => p.name === name)!;
                  const isCorrect = submitted && name === correctOrder[idx];
                  return (
                    <div
                      key={name}
                      className={`p-4 rounded-lg border ${submitted ? (isCorrect ? "border-success bg-success/10" : "border-destructive bg-destructive/10") : "border-border"}`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <Badge className="mb-2">#{idx + 1}</Badge>
                          <div className="font-semibold">{name}</div>
                          <div className="text-xs text-muted-foreground">
                            Risk: {portfolio.risk}/10 | Return: {portfolio.expectedReturn}%
                          </div>
                        </div>
                        {!submitted && (
                          <Button variant="ghost" size="sm" onClick={() => handleRemove(idx)}>
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {sortedPortfolios.length === portfolios.length && !submitted && (
              <Button onClick={handleSubmit} className="w-full" size="lg">
                Submit Ranking
              </Button>
            )}

            {submitted && (
              <div className="p-4 bg-primary/10 rounded-lg">
                <p className="font-bold text-lg mb-2">Score: {score}/100</p>
                <p className="text-sm mb-3">Lower risk = lower volatility + lower beta</p>
                <Button onClick={onClose} className="w-full">Close</Button>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

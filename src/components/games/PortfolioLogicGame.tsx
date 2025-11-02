import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { X, TrendingUp } from "lucide-react";
import { toast } from "sonner";

const stocks = [
  { symbol: "TECH", sector: "Technology", beta: 1.8, expectedReturn: 15 },
  { symbol: "UTIL", sector: "Utilities", beta: 0.5, expectedReturn: 6 },
  { symbol: "FINC", sector: "Financials", beta: 1.2, expectedReturn: 11 },
  { symbol: "HLTH", sector: "Healthcare", beta: 0.9, expectedReturn: 9 },
];

interface PortfolioLogicGameProps {
  onClose: () => void;
}

export const PortfolioLogicGame = ({ onClose }: PortfolioLogicGameProps) => {
  const [allocations, setAllocations] = useState<Record<string, number>>({
    TECH: 25,
    UTIL: 25,
    FINC: 25,
    HLTH: 25,
  });
  const [submitted, setSubmitted] = useState(false);

  const targetReturn = 10;
  const maxRisk = 1.2;

  const totalAllocation = Object.values(allocations).reduce((sum, val) => sum + val, 0);
  const portfolioReturn = stocks.reduce(
    (sum, stock) => sum + (allocations[stock.symbol] / 100) * stock.expectedReturn,
    0
  );
  const portfolioBeta = stocks.reduce(
    (sum, stock) => sum + (allocations[stock.symbol] / 100) * stock.beta,
    0
  );

  const handleAllocationChange = (symbol: string, value: number[]) => {
    setAllocations({ ...allocations, [symbol]: value[0] });
  };

  const handleSubmit = () => {
    setSubmitted(true);
    const meetsReturn = portfolioReturn >= targetReturn;
    const meetsBeta = portfolioBeta <= maxRisk;
    const meetsAllocation = totalAllocation === 100;

    if (meetsReturn && meetsBeta && meetsAllocation) {
      toast.success("Perfect portfolio optimization!");
    } else {
      toast.error("Portfolio doesn't meet all requirements");
    }
  };

  const meetsReturn = portfolioReturn >= targetReturn;
  const meetsBeta = portfolioBeta <= maxRisk;
  const meetsAllocation = totalAllocation === 100;

  return (
    <div className="fixed inset-0 bg-background/95 z-50 overflow-y-auto">
      <div className="container max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Portfolio Logic</h2>
            <p className="text-muted-foreground">Optimize allocation under constraints</p>
          </div>
          <Button variant="outline" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="font-bold mb-4">Adjust Allocations</h3>
            <div className="space-y-6">
              {stocks.map((stock) => (
                <div key={stock.symbol}>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="font-semibold">{stock.symbol}</span>
                      <span className="text-xs text-muted-foreground ml-2">{stock.sector}</span>
                    </div>
                    <Badge variant="secondary">{allocations[stock.symbol]}%</Badge>
                  </div>
                  <Slider
                    value={[allocations[stock.symbol]]}
                    onValueChange={(val) => handleAllocationChange(stock.symbol, val)}
                    max={100}
                    step={5}
                    disabled={submitted}
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    Beta: {stock.beta} | Return: {stock.expectedReturn}%
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Portfolio Metrics
            </h3>

            <div className="space-y-4 mb-6">
              <div className={`p-4 rounded-lg ${meetsAllocation ? "bg-success/10" : "bg-destructive/10"}`}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Total Allocation</span>
                  <span className="font-bold">{totalAllocation}%</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">Target: 100%</div>
              </div>

              <div className={`p-4 rounded-lg ${meetsReturn ? "bg-success/10" : "bg-destructive/10"}`}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Expected Return</span>
                  <span className="font-bold">{portfolioReturn.toFixed(2)}%</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">Target: ≥{targetReturn}%</div>
              </div>

              <div className={`p-4 rounded-lg ${meetsBeta ? "bg-success/10" : "bg-destructive/10"}`}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Portfolio Beta (Risk)</span>
                  <span className="font-bold">{portfolioBeta.toFixed(2)}</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">Target: ≤{maxRisk}</div>
              </div>
            </div>

            {!submitted ? (
              <Button
                onClick={handleSubmit}
                disabled={totalAllocation !== 100}
                className="w-full"
                size="lg"
              >
                Submit Portfolio
              </Button>
            ) : (
              <div className="space-y-3">
                <div className={`p-4 rounded-lg ${meetsReturn && meetsBeta && meetsAllocation ? "bg-success/10" : "bg-destructive/10"}`}>
                  <p className="font-bold mb-2">
                    {meetsReturn && meetsBeta && meetsAllocation ? "✓ Success!" : "✗ Not Optimal"}
                  </p>
                  <p className="text-sm">
                    {meetsReturn && meetsBeta && meetsAllocation
                      ? "Perfect balance of return and risk!"
                      : "Adjust allocations to meet all constraints"}
                  </p>
                </div>
                <Button onClick={onClose} className="w-full">Close</Button>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

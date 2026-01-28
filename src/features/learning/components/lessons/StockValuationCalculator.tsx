import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calculator, TrendingUp, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { AIContextualHelp } from "../AIContextualHelp";

interface Stock {
  name: string;
  marketPrice: number;
  eps: number;
  bookValue: number;
  dividendYield: number;
  growthRate: number;
}

const sampleStocks: Stock[] = [
  {
    name: "Tech Giant Corp",
    marketPrice: 150,
    eps: 6,
    bookValue: 50,
    dividendYield: 2.0,
    growthRate: 15
  },
  {
    name: "Value Retail Inc",
    marketPrice: 45,
    eps: 5,
    bookValue: 60,
    dividendYield: 4.5,
    growthRate: 5
  },
  {
    name: "Speculative Startup",
    marketPrice: 200,
    eps: 2,
    bookValue: 30,
    dividendYield: 0,
    growthRate: 50
  }
];

export const StockValuationCalculator = () => {
  const [selectedStock, setSelectedStock] = useState(0);
  const [userFairValue, setUserFairValue] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);

  const stock = sampleStocks[selectedStock];
  
  // Benjamin Graham's formula: Fair Value = EPS × (8.5 + 2g)
  const fairValue = stock.eps * (8.5 + 2 * stock.growthRate);
  const peRatio = stock.marketPrice / stock.eps;
  const pbRatio = stock.marketPrice / stock.bookValue;
  const marginOfSafety = ((fairValue - stock.marketPrice) / fairValue * 100).toFixed(1);
  
  const isUndervalued = stock.marketPrice < fairValue * 0.9;
  const isOvervalued = stock.marketPrice > fairValue * 1.1;

  const checkAnswer = () => {
    const userValue = parseFloat(userFairValue);
    if (isNaN(userValue)) {
      toast.error("Please enter a valid number");
      return;
    }

    setShowAnswer(true);
    const difference = Math.abs(userValue - fairValue);
    const percentDiff = (difference / fairValue) * 100;

    if (percentDiff < 10) {
      toast.success("Excellent! Your valuation is very close!");
    } else if (percentDiff < 20) {
      toast("Good attempt! You're on the right track.");
    } else {
      toast.error("Review the Graham formula and key metrics.");
    }
  };

  const nextStock = () => {
    setSelectedStock((prev) => (prev + 1) % sampleStocks.length);
    setUserFairValue("");
    setShowAnswer(false);
  };

  return (
    <Card className="p-6 space-y-6 bg-gradient-to-br from-background to-muted/20">
      <div>
        <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
          <Calculator className="w-5 h-5 text-primary" />
          Stock Valuation Calculator
        </h3>
        <p className="text-sm text-muted-foreground">
          Use Benjamin Graham's formula to determine if a stock is undervalued
        </p>
      </div>

      <Card className="p-4 bg-muted/30">
        <h4 className="font-bold text-lg mb-3">{stock.name}</h4>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-xs text-muted-foreground">Market Price</div>
            <div className="text-2xl font-bold">${stock.marketPrice}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Earnings Per Share</div>
            <div className="text-2xl font-bold text-primary">${stock.eps}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Book Value</div>
            <div className="text-lg font-bold">${stock.bookValue}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Growth Rate</div>
            <div className="text-lg font-bold">{stock.growthRate}%</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">P/E Ratio</div>
            <div className="text-lg font-bold">{peRatio.toFixed(1)}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Dividend Yield</div>
            <div className="text-lg font-bold">{stock.dividendYield}%</div>
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">
            Calculate Fair Value using Graham's Formula:
          </label>
          <div className="text-xs text-muted-foreground mb-2 p-3 bg-muted/30 rounded">
            <strong>Fair Value = EPS × (8.5 + 2g)</strong>
            <br />
            where g = growth rate in %
          </div>
          <Input
            type="number"
            placeholder="Enter your fair value estimate"
            value={userFairValue}
            onChange={(e) => setUserFairValue(e.target.value)}
            className="mb-2"
          />
          <Button onClick={checkAnswer} className="w-full">
            Check Answer
          </Button>
        </div>

        {showAnswer && (
          <Card className="p-4 bg-muted/50 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">Valuation Analysis</h4>
              {isUndervalued ? (
                <CheckCircle2 className="w-5 h-5 text-success" />
              ) : isOvervalued ? (
                <XCircle className="w-5 h-5 text-destructive" />
              ) : (
                <TrendingUp className="w-5 h-5 text-warning" />
              )}
            </div>
            
            <div className="space-y-2 text-sm">
              <p>
                <strong>Your Estimate:</strong> ${parseFloat(userFairValue).toFixed(2)}
              </p>
              <p>
                <strong><AIContextualHelp term="Graham Fair Value" lessonId="7" lessonTitle="Value Investing">Graham Fair Value</AIContextualHelp>:</strong> ${fairValue.toFixed(2)}
              </p>
              <p>
                <strong>Market Price:</strong> ${stock.marketPrice}
              </p>
              <p>
                <strong><AIContextualHelp term="Margin of Safety" lessonId="7" lessonTitle="Value Investing">Margin of Safety</AIContextualHelp>:</strong>{" "}
                <span className={parseFloat(marginOfSafety) > 0 ? "text-success" : "text-destructive"}>
                  {marginOfSafety}%
                </span>
              </p>
              <p className="text-xs text-muted-foreground mt-3">
                <strong>Calculation:</strong> {stock.eps} × (8.5 + 2 × {stock.growthRate}) = ${fairValue.toFixed(2)}
              </p>
            </div>

            <div className="pt-3 border-t">
              <p className="text-sm font-semibold mb-1">Investment Decision:</p>
              <p className="text-sm">
                {isUndervalued ? (
                  <span className="text-success">
                    ✓ UNDERVALUED - Consider buying. Stock trading below intrinsic value with {Math.abs(parseFloat(marginOfSafety))}% margin of safety.
                  </span>
                ) : isOvervalued ? (
                  <span className="text-destructive">
                    ✗ OVERVALUED - Avoid or sell. Stock trading {Math.abs(parseFloat(marginOfSafety))}% above fair value.
                  </span>
                ) : (
                  <span className="text-warning">
                    ⚠ FAIRLY VALUED - Stock near fair value. Wait for better entry point.
                  </span>
                )}
              </p>
            </div>

            <Button onClick={nextStock} variant="outline" className="w-full mt-2">
              Next Stock
            </Button>
          </Card>
        )}
      </div>
    </Card>
  );
};

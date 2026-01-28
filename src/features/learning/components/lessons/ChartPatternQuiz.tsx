import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, BarChart3 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { toast } from "sonner";

interface Pattern {
  name: string;
  type: "bullish" | "bearish" | "continuation";
  data: { x: number; price: number }[];
  description: string;
  meaning: string;
}

const patterns: Pattern[] = [
  {
    name: "Head and Shoulders",
    type: "bearish",
    data: [
      { x: 0, price: 100 },
      { x: 1, price: 110 },
      { x: 2, price: 105 },
      { x: 3, price: 120 },
      { x: 4, price: 105 },
      { x: 5, price: 110 },
      { x: 6, price: 100 },
    ],
    description: "Three peaks with the middle peak (head) higher than the two shoulders",
    meaning: "Signals trend reversal from bullish to bearish"
  },
  {
    name: "Cup and Handle",
    type: "bullish",
    data: [
      { x: 0, price: 100 },
      { x: 1, price: 95 },
      { x: 2, price: 90 },
      { x: 3, price: 85 },
      { x: 4, price: 90 },
      { x: 5, price: 95 },
      { x: 6, price: 98 },
      { x: 7, price: 96 },
      { x: 8, price: 105 },
    ],
    description: "U-shaped pattern followed by a slight downward drift (handle)",
    meaning: "Bullish continuation pattern signaling potential breakout"
  },
  {
    name: "Double Bottom",
    type: "bullish",
    data: [
      { x: 0, price: 100 },
      { x: 1, price: 85 },
      { x: 2, price: 95 },
      { x: 3, price: 85 },
      { x: 4, price: 105 },
    ],
    description: "Two consecutive lows at approximately the same level",
    meaning: "Bullish reversal indicating strong support level"
  },
  {
    name: "Ascending Triangle",
    type: "bullish",
    data: [
      { x: 0, price: 80 },
      { x: 1, price: 100 },
      { x: 2, price: 90 },
      { x: 3, price: 100 },
      { x: 4, price: 95 },
      { x: 5, price: 100 },
      { x: 6, price: 110 },
    ],
    description: "Rising lows with consistent highs forming horizontal resistance",
    meaning: "Bullish pattern suggesting upward breakout"
  },
  {
    name: "Descending Triangle",
    type: "bearish",
    data: [
      { x: 0, price: 120 },
      { x: 1, price: 100 },
      { x: 2, price: 110 },
      { x: 3, price: 100 },
      { x: 4, price: 105 },
      { x: 5, price: 100 },
      { x: 6, price: 90 },
    ],
    description: "Declining highs with consistent lows forming horizontal support",
    meaning: "Bearish pattern suggesting downward breakout"
  }
];

export const ChartPatternQuiz = () => {
  const [currentPattern, setCurrentPattern] = useState(0);
  const [selectedType, setSelectedType] = useState<"bullish" | "bearish" | "continuation" | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);

  const pattern = patterns[currentPattern];

  const checkAnswer = (type: "bullish" | "bearish" | "continuation") => {
    setSelectedType(type);
    setShowAnswer(true);

    if (type === pattern.type) {
      setScore((prev) => prev + 20);
      toast.success("Correct! You identified the pattern!");
    } else {
      toast.error("Not quite. Study the pattern characteristics carefully.");
    }
  };

  const nextPattern = () => {
    if (currentPattern < patterns.length - 1) {
      setCurrentPattern((prev) => prev + 1);
      setSelectedType(null);
      setShowAnswer(false);
    } else {
      toast.success(`Quiz complete! Final score: ${score}/100`);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "bullish":
        return "text-success";
      case "bearish":
        return "text-destructive";
      case "continuation":
        return "text-warning";
      default:
        return "";
    }
  };

  return (
    <Card className="p-6 space-y-6 bg-gradient-to-br from-background to-muted/20">
      <div>
        <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          Chart Pattern Recognition
        </h3>
        <p className="text-sm text-muted-foreground">
          Learn to identify key technical patterns that signal market movements
        </p>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">
          Pattern {currentPattern + 1}/{patterns.length}
        </span>
        <span className="text-lg font-bold text-primary">Score: {score}/100</span>
      </div>

      <Card className="p-4 bg-muted/30">
        <h4 className="font-bold text-lg mb-4 text-center">
          Identify This Pattern
        </h4>
        
        <div className="h-64 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={pattern.data}>
              <XAxis dataKey="x" hide />
              <YAxis domain={['dataMin - 5', 'dataMax + 5']} hide />
              <Line
                type="monotone"
                dataKey="price"
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--primary))', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <p className="text-sm text-muted-foreground text-center">
          Study the price movement and identify the pattern type
        </p>
      </Card>

      {!showAnswer && (
        <div className="space-y-3">
          <p className="text-sm font-medium">What type of pattern is this?</p>
          <div className="grid grid-cols-3 gap-3">
            <Button
              onClick={() => checkAnswer("bullish")}
              variant="outline"
              size="lg"
              className="flex-col h-20 hover:bg-success/10 hover:border-success"
            >
              <TrendingUp className="w-5 h-5 mb-1 text-success" />
              <span className="font-semibold">Bullish</span>
              <span className="text-xs text-muted-foreground">Upward signal</span>
            </Button>
            <Button
              onClick={() => checkAnswer("bearish")}
              variant="outline"
              size="lg"
              className="flex-col h-20 hover:bg-destructive/10 hover:border-destructive"
            >
              <TrendingUp className="w-5 h-5 mb-1 text-destructive rotate-180" />
              <span className="font-semibold">Bearish</span>
              <span className="text-xs text-muted-foreground">Downward signal</span>
            </Button>
            <Button
              onClick={() => checkAnswer("continuation")}
              variant="outline"
              size="lg"
              className="flex-col h-20 hover:bg-warning/10 hover:border-warning"
            >
              <BarChart3 className="w-5 h-5 mb-1 text-warning" />
              <span className="font-semibold">Continuation</span>
              <span className="text-xs text-muted-foreground">Trend continues</span>
            </Button>
          </div>
        </div>
      )}

      {showAnswer && (
        <Card className="p-4 bg-muted/50 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">Pattern Analysis</h4>
            {selectedType === pattern.type ? (
              <span className="text-success font-semibold">✓ Correct</span>
            ) : (
              <span className="text-destructive font-semibold">✗ Incorrect</span>
            )}
          </div>
          
          <div className="space-y-2 text-sm">
            <p>
              <strong>Pattern Name:</strong> {pattern.name}
            </p>
            <p>
              <strong>Type:</strong>{" "}
              <span className={`font-semibold ${getTypeColor(pattern.type)}`}>
                {pattern.type.toUpperCase()}
              </span>
            </p>
            <p>
              <strong>Description:</strong> {pattern.description}
            </p>
            <p>
              <strong>Meaning:</strong> {pattern.meaning}
            </p>
          </div>

          <div className="pt-3 border-t">
            <p className="text-xs text-muted-foreground">
              <strong>Trading Tip:</strong> Wait for pattern confirmation with volume and consider 
              risk management with stop-loss orders. No pattern is 100% reliable.
            </p>
          </div>

          <Button onClick={nextPattern} className="w-full mt-2">
            {currentPattern < patterns.length - 1 ? "Next Pattern" : "Complete Quiz"}
          </Button>
        </Card>
      )}
    </Card>
  );
};

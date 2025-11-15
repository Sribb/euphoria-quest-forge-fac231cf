import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { TrendingDown, TrendingUp, Brain, DollarSign } from "lucide-react";
import { toast } from "sonner";

interface Scenario {
  id: number;
  title: string;
  description: string;
  marketSentiment: "fear" | "greed" | "neutral";
  currentPrice: number;
  fairValue: number;
  newsHeadlines: string[];
}

const scenarios: Scenario[] = [
  {
    id: 1,
    title: "Market Panic",
    description: "The market has dropped 20% in a month due to economic concerns.",
    marketSentiment: "fear",
    currentPrice: 80,
    fairValue: 100,
    newsHeadlines: [
      "📉 Markets in free fall as recession fears mount",
      "🔴 Investors flee to cash",
      "⚠️ Analysts predict further decline"
    ]
  },
  {
    id: 2,
    title: "Euphoric Rally",
    description: "Stocks have surged 40% this year on optimism.",
    marketSentiment: "greed",
    currentPrice: 140,
    fairValue: 100,
    newsHeadlines: [
      "📈 Market hits all-time highs!",
      "🚀 Everyone's making money in stocks",
      "💰 FOMO drives buying frenzy"
    ]
  },
  {
    id: 3,
    title: "Tech Bubble",
    description: "Tech stocks valued at 60x earnings amid hype.",
    marketSentiment: "greed",
    currentPrice: 180,
    fairValue: 100,
    newsHeadlines: [
      "🎯 This time is different, say experts",
      "💎 Valuations don't matter in new economy",
      "🌟 Get in before you miss out!"
    ]
  },
  {
    id: 4,
    title: "Crisis Bottom",
    description: "Markets down 50% from peak. Fear at maximum.",
    marketSentiment: "fear",
    currentPrice: 50,
    fairValue: 100,
    newsHeadlines: [
      "💥 Worst crash in decades",
      "🏚️ Investors lose life savings",
      "📉 More pain ahead, experts warn"
    ]
  }
];

export const FearGreedSimulator = () => {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [decision, setDecision] = useState<"buy" | "sell" | "hold" | null>(null);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);

  const scenario = scenarios[currentScenario];
  const sentimentColor = scenario.marketSentiment === "fear" ? "text-destructive" : "text-warning";
  const priceVsValue = ((scenario.currentPrice - scenario.fairValue) / scenario.fairValue * 100).toFixed(0);

  const handleDecision = (choice: "buy" | "sell" | "hold") => {
    setDecision(choice);
    setShowFeedback(true);

    // Scoring logic: contrarian investing wins
    let points = 0;
    const isOvervalued = scenario.currentPrice > scenario.fairValue * 1.2;
    const isUndervalued = scenario.currentPrice < scenario.fairValue * 0.8;

    if (scenario.marketSentiment === "fear" && choice === "buy" && isUndervalued) {
      points = 100;
      toast.success("Excellent! Being greedy when others are fearful!");
    } else if (scenario.marketSentiment === "greed" && choice === "sell" && isOvervalued) {
      points = 100;
      toast.success("Brilliant! Being fearful when others are greedy!");
    } else if (choice === "hold") {
      points = 50;
      toast("Safe choice, but you missed an opportunity.");
    } else {
      points = 0;
      toast.error("Following the crowd rarely leads to profits.");
    }

    setScore(prev => prev + points);
  };

  const nextScenario = () => {
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(prev => prev + 1);
      setDecision(null);
      setShowFeedback(false);
    } else {
      toast.success(`Simulation complete! Final score: ${score}/400`);
    }
  };

  const getOptimalDecision = () => {
    const isOvervalued = scenario.currentPrice > scenario.fairValue * 1.2;
    const isUndervalued = scenario.currentPrice < scenario.fairValue * 0.8;
    
    if (isUndervalued) return "BUY";
    if (isOvervalued) return "SELL";
    return "HOLD";
  };

  return (
    <Card className="p-6 space-y-6 bg-gradient-to-br from-background to-muted/20">
      <div>
        <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
          <Brain className="w-5 h-5 text-primary" />
          Fear & Greed Simulator
        </h3>
        <p className="text-sm text-muted-foreground">
          "Be fearful when others are greedy, and greedy when others are fearful" - Warren Buffett
        </p>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <span className="text-sm text-muted-foreground">Scenario {currentScenario + 1}/4</span>
        </div>
        <div className="text-right">
          <span className="text-sm text-muted-foreground">Score: </span>
          <span className="text-lg font-bold text-primary">{score}/400</span>
        </div>
      </div>
      <Progress value={(currentScenario / scenarios.length) * 100} className="h-2" />

      <Card className="p-4 border-2 border-muted">
        <h4 className="font-bold text-lg mb-2">{scenario.title}</h4>
        <p className="text-sm text-muted-foreground mb-3">{scenario.description}</p>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-xs text-muted-foreground">Current Price</div>
            <div className="text-2xl font-bold">${scenario.currentPrice}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Fair Value</div>
            <div className="text-2xl font-bold text-primary">${scenario.fairValue}</div>
          </div>
        </div>

        <div className={`text-sm font-semibold mb-3 ${sentimentColor}`}>
          Market Sentiment: {scenario.marketSentiment.toUpperCase()} 
          ({priceVsValue}% vs fair value)
        </div>

        <div className="space-y-1 mb-4">
          <div className="text-xs font-semibold text-muted-foreground">News Headlines:</div>
          {scenario.newsHeadlines.map((headline, i) => (
            <div key={i} className="text-xs pl-2 border-l-2 border-muted">
              {headline}
            </div>
          ))}
        </div>
      </Card>

      {!decision && (
        <div className="grid grid-cols-3 gap-3">
          <Button
            onClick={() => handleDecision("buy")}
            variant="outline"
            size="lg"
            className="flex-col h-20 hover:bg-success/10 hover:border-success"
          >
            <TrendingUp className="w-5 h-5 mb-1 text-success" />
            <span className="font-semibold">BUY</span>
          </Button>
          <Button
            onClick={() => handleDecision("hold")}
            variant="outline"
            size="lg"
            className="flex-col h-20"
          >
            <DollarSign className="w-5 h-5 mb-1" />
            <span className="font-semibold">HOLD</span>
          </Button>
          <Button
            onClick={() => handleDecision("sell")}
            variant="outline"
            size="lg"
            className="flex-col h-20 hover:bg-destructive/10 hover:border-destructive"
          >
            <TrendingDown className="w-5 h-5 mb-1 text-destructive" />
            <span className="font-semibold">SELL</span>
          </Button>
        </div>
      )}

      {showFeedback && (
        <Card className="p-4 bg-muted/50 space-y-2">
          <h4 className="font-semibold">Analysis</h4>
          <p className="text-sm">
            <strong>Your Decision:</strong> {decision?.toUpperCase()}
          </p>
          <p className="text-sm">
            <strong>Optimal Decision:</strong> {getOptimalDecision()}
          </p>
          <p className="text-sm">
            <strong>Reasoning:</strong>{" "}
            {scenario.currentPrice < scenario.fairValue * 0.8
              ? "Stock is undervalued - a buying opportunity despite fear."
              : scenario.currentPrice > scenario.fairValue * 1.2
              ? "Stock is overvalued - time to take profits despite hype."
              : "Stock is fairly valued - holding is reasonable."}
          </p>
          <Button onClick={nextScenario} className="w-full mt-4">
            {currentScenario < scenarios.length - 1 ? "Next Scenario" : "Complete"}
          </Button>
        </Card>
      )}
    </Card>
  );
};

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, AlertTriangle, CheckCircle, XCircle } from "lucide-react";

const biases = [
  { name: "Loss Aversion", description: "Losses feel 2x worse than equivalent gains feel good", example: "Holding losers too long" },
  { name: "Anchoring", description: "Over-relying on first piece of information", example: "Fixating on purchase price" },
  { name: "Herding", description: "Following the crowd instead of own analysis", example: "Buying at market peaks" },
  { name: "Overconfidence", description: "Overestimating your own abilities", example: "Excessive trading" },
  { name: "Recency Bias", description: "Giving more weight to recent events", example: "Chasing recent winners" },
  { name: "Confirmation Bias", description: "Seeking info that confirms existing beliefs", example: "Ignoring warning signs" },
];

const scenarios = [
  { situation: "Stock dropped 20%, but fundamentals unchanged", biasResponse: "Sell to avoid more pain", rationalResponse: "Reassess and potentially buy more" },
  { situation: "Everyone is buying tech stocks", biasResponse: "Join in to not miss out", rationalResponse: "Evaluate valuations independently" },
  { situation: "You predicted last 3 market moves correctly", biasResponse: "Increase position sizes", rationalResponse: "Maintain risk management rules" },
];

export const BehavioralEconomics = () => {
  const [selectedBias, setSelectedBias] = useState(0);
  const [currentScenario, setCurrentScenario] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          Behavioral Economics in Investing
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {biases.map((b, idx) => (
            <button
              key={b.name}
              onClick={() => setSelectedBias(idx)}
              className={`p-3 rounded-lg text-left transition-all ${
                selectedBias === idx ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
              }`}
            >
              <p className="font-medium text-sm">{b.name}</p>
            </button>
          ))}
        </div>

        <Card className="bg-muted/50">
          <CardContent className="pt-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
              <div>
                <h4 className="font-semibold">{biases[selectedBias].name}</h4>
                <p className="text-sm text-muted-foreground mt-1">{biases[selectedBias].description}</p>
                <p className="text-sm mt-2"><span className="font-medium">Example:</span> {biases[selectedBias].example}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div>
          <h4 className="font-semibold mb-3">Scenario Challenge</h4>
          <Card className="bg-blue-500/10">
            <CardContent className="pt-4">
              <p className="font-medium">{scenarios[currentScenario].situation}</p>
              
              {!showAnswer ? (
                <div className="mt-4 space-y-2">
                  <button
                    onClick={() => setShowAnswer(true)}
                    className="w-full p-3 text-left rounded-lg bg-red-500/20 hover:bg-red-500/30 transition-all"
                  >
                    <XCircle className="h-4 w-4 inline mr-2 text-red-500" />
                    {scenarios[currentScenario].biasResponse}
                  </button>
                  <button
                    onClick={() => setShowAnswer(true)}
                    className="w-full p-3 text-left rounded-lg bg-green-500/20 hover:bg-green-500/30 transition-all"
                  >
                    <CheckCircle className="h-4 w-4 inline mr-2 text-green-500" />
                    {scenarios[currentScenario].rationalResponse}
                  </button>
                </div>
              ) : (
                <div className="mt-4 space-y-2">
                  <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/50">
                    <Badge variant="destructive" className="mb-1">Biased Response</Badge>
                    <p className="text-sm">{scenarios[currentScenario].biasResponse}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-green-500/20 border border-green-500/50">
                    <Badge className="mb-1 bg-green-500">Rational Response</Badge>
                    <p className="text-sm">{scenarios[currentScenario].rationalResponse}</p>
                  </div>
                  <button
                    onClick={() => {
                      setCurrentScenario((currentScenario + 1) % scenarios.length);
                      setShowAnswer(false);
                    }}
                    className="w-full p-2 bg-primary text-primary-foreground rounded-lg mt-2"
                  >
                    Next Scenario
                  </button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="p-3 bg-primary/10 rounded-lg">
          <p className="text-sm"><strong>💡 Key Insight:</strong> Awareness is the first step to overcoming biases. Create rules-based systems and checklists to bypass emotional decision-making during market stress.</p>
        </div>
      </CardContent>
    </Card>
  );
};

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown, DollarSign, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface InteractiveLessonSimulationProps {
  lessonId: string;
  simulationType: "portfolio" | "risk" | "compound" | "diversification";
  onComplete?: (score: number) => void;
}

export const InteractiveLessonSimulation = ({
  lessonId,
  simulationType,
  onComplete,
}: InteractiveLessonSimulationProps) => {
  const [investmentAmount, setInvestmentAmount] = useState(10000);
  const [riskLevel, setRiskLevel] = useState(50);
  const [timeHorizon, setTimeHorizon] = useState(10);
  const [chartData, setChartData] = useState<any[]>([]);
  const [results, setResults] = useState<any>(null);
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);

  useEffect(() => {
    generateSimulation();
  }, [investmentAmount, riskLevel, timeHorizon]);

  const generateSimulation = () => {
    const data = [];
    let value = investmentAmount;

    for (let year = 0; year <= timeHorizon; year++) {
      const volatility = (riskLevel / 100) * 0.3;
      const expectedReturn = 0.07 + (riskLevel / 100) * 0.05;
      const randomFactor = 1 + (Math.random() - 0.5) * volatility;
      
      if (year > 0) {
        value = value * (1 + expectedReturn) * randomFactor;
      }

      data.push({
        year,
        value: Math.round(value),
        invested: investmentAmount,
      });
    }

    setChartData(data);
    setResults({
      finalValue: Math.round(value),
      totalReturn: Math.round(value - investmentAmount),
      returnPercentage: (((value - investmentAmount) / investmentAmount) * 100).toFixed(2),
    });
  };

  const handleGetAIFeedback = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("ai-lesson-assistant", {
        body: {
          action: "simulation_feedback",
          lessonId,
          simulationData: {
            type: simulationType,
            investmentAmount,
            riskLevel,
            timeHorizon,
            results,
          },
        },
      });

      if (error) throw error;
      setAiFeedback(data.response);
      
      // Calculate score based on risk-adjusted returns
      const score = Math.min(100, Math.round((results.returnPercentage / 10) * (100 - Math.abs(50 - riskLevel))));
      onComplete?.(score);
    } catch (error) {
      console.error("Simulation feedback error:", error);
      toast.error("Failed to get AI feedback");
    }
  };

  return (
    <Card className="p-6 space-y-6 bg-gradient-hero">
      <div>
        <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Interactive Investment Simulation
        </h3>
        <p className="text-sm text-muted-foreground">
          Adjust the parameters and watch how your investment grows over time
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">
            Initial Investment: ${investmentAmount.toLocaleString()}
          </label>
          <Slider
            value={[investmentAmount]}
            onValueChange={([value]) => setInvestmentAmount(value)}
            min={1000}
            max={100000}
            step={1000}
            className="w-full"
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">
            Risk Level: {riskLevel}% {riskLevel < 30 ? "(Conservative)" : riskLevel > 70 ? "(Aggressive)" : "(Moderate)"}
          </label>
          <Slider
            value={[riskLevel]}
            onValueChange={([value]) => setRiskLevel(value)}
            min={0}
            max={100}
            step={5}
            className="w-full"
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">
            Time Horizon: {timeHorizon} years
          </label>
          <Slider
            value={[timeHorizon]}
            onValueChange={([value]) => setTimeHorizon(value)}
            min={1}
            max={30}
            step={1}
            className="w-full"
          />
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="year" label={{ value: "Years", position: "insideBottom", offset: -5 }} />
            <YAxis label={{ value: "Value ($)", angle: -90, position: "insideLeft" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="invested"
              stroke="hsl(var(--muted-foreground))"
              strokeWidth={1}
              strokeDasharray="5 5"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {results && (
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-4 bg-card">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground">Final Value</span>
            </div>
            <p className="text-xl font-bold">${results.finalValue.toLocaleString()}</p>
          </Card>
          <Card className="p-4 bg-card">
            <div className="flex items-center gap-2 mb-1">
              {results.totalReturn >= 0 ? (
                <TrendingUp className="w-4 h-4 text-success" />
              ) : (
                <TrendingDown className="w-4 h-4 text-destructive" />
              )}
              <span className="text-xs text-muted-foreground">Total Return</span>
            </div>
            <p className="text-xl font-bold">${results.totalReturn.toLocaleString()}</p>
          </Card>
          <Card className="p-4 bg-card">
            <div className="flex items-center gap-2 mb-1">
              <AlertCircle className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground">Return %</span>
            </div>
            <p className="text-xl font-bold">{results.returnPercentage}%</p>
          </Card>
        </div>
      )}

      <Button
        onClick={handleGetAIFeedback}
        className="w-full bg-gradient-primary"
        disabled={!results}
      >
        Get AI Feedback on Your Strategy
      </Button>

      {aiFeedback && (
        <Card className="p-4 bg-primary/5 border-primary/20">
          <div className="flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold mb-2">AI Coach Feedback</h4>
              <div className="text-sm text-muted-foreground leading-relaxed prose prose-sm max-w-none dark:prose-invert">
                {aiFeedback.split('\n').map((line, i) => (
                  <p key={i} className="mb-2 last:mb-0">{line}</p>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}
    </Card>
  );
};
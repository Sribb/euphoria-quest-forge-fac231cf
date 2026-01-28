import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { supabase } from "@/integrations/supabase/client";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export const RiskSimulator = () => {
  const [riskLevel, setRiskLevel] = useState(50);
  const [simulationData, setSimulationData] = useState<any[]>([]);
  const [aiAnalysis, setAiAnalysis] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const riskLabels: Record<number, string> = {
    0: "Very Low Risk",
    25: "Low Risk",
    50: "Medium Risk",
    75: "High Risk",
    100: "Very High Risk",
  };

  const getRiskLabel = () => {
    if (riskLevel < 20) return riskLabels[0];
    if (riskLevel < 40) return riskLabels[25];
    if (riskLevel < 60) return riskLabels[50];
    if (riskLevel < 80) return riskLabels[75];
    return riskLabels[100];
  };

  const runSimulation = async () => {
    setIsLoading(true);

    // Generate market simulation data
    const months = 12;
    const baseReturn = 0.08; // 8% annual
    const volatility = (riskLevel / 100) * 0.4; // Up to 40% volatility
    
    let portfolio = 10000;
    const data = [{ month: 0, Conservative: 10000, YourPortfolio: 10000, Aggressive: 10000 }];

    for (let i = 1; i <= months; i++) {
      // Your portfolio with selected risk
      const yourReturn = (baseReturn + (Math.random() - 0.5) * volatility) / 12;
      portfolio *= (1 + yourReturn);

      // Conservative portfolio
      const conservativeReturn = (0.05 + (Math.random() - 0.5) * 0.05) / 12;
      const conservative = data[i - 1].Conservative * (1 + conservativeReturn);

      // Aggressive portfolio
      const aggressiveReturn = (0.12 + (Math.random() - 0.5) * 0.6) / 12;
      const aggressive = data[i - 1].Aggressive * (1 + aggressiveReturn);

      data.push({
        month: i,
        Conservative: Math.round(conservative),
        YourPortfolio: Math.round(portfolio),
        Aggressive: Math.round(aggressive),
      });
    }

    setSimulationData(data);

    // Get AI analysis
    try {
      const finalReturn = ((portfolio - 10000) / 10000) * 100;
      const { data: aiData, error } = await supabase.functions.invoke("interactive-lesson-ai", {
        body: {
          lessonType: "risk-simulator",
          userInput: `Analyze this risk simulation result: Risk level ${riskLevel}%, Final return: ${finalReturn.toFixed(2)}%`,
          context: {
            lessonId: "risk-vs-reward",
            riskLevel,
            finalReturn,
            volatility: volatility * 100,
          },
        },
      });

      if (error) throw error;
      if (aiData?.error) {
        toast({ title: "Error", description: aiData.error, variant: "destructive" });
        return;
      }

      setAiAnalysis(aiData.response);

      if (aiData.xpAwarded) {
        toast({
          title: "Simulation Complete! 🎉",
          description: `+${aiData.xpAwarded} XP earned`,
        });
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-6 h-6 text-primary" />
          <h3 className="text-xl font-bold">AI Risk Simulator</h3>
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium">Select Your Risk Level</label>
              <span className="text-sm text-muted-foreground">{getRiskLabel()}</span>
            </div>
            <Slider
              value={[riskLevel]}
              onValueChange={([value]) => setRiskLevel(value)}
              max={100}
              step={1}
              className="mb-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Safe</span>
              <span>Balanced</span>
              <span>Aggressive</span>
            </div>
          </div>

          <Button
            onClick={runSimulation}
            disabled={isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? "Running Simulation..." : "Run Market Simulation"}
          </Button>

          {simulationData.length > 0 && (
            <>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={simulationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" label={{ value: "Months", position: "insideBottom", offset: -5 }} />
                    <YAxis label={{ value: "Portfolio Value ($)", angle: -90, position: "insideLeft" }} />
                    <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                    <Legend />
                    <Line type="monotone" dataKey="Conservative" stroke="#10b981" strokeWidth={2} />
                    <Line type="monotone" dataKey="YourPortfolio" stroke="#3b82f6" strokeWidth={3} />
                    <Line type="monotone" dataKey="Aggressive" stroke="#ef4444" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {aiAnalysis && (
                <Card className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    AI Analysis
                  </h4>
                  <p className="text-sm whitespace-pre-wrap">{aiAnalysis}</p>
                </Card>
              )}
            </>
          )}
        </div>
      </Card>
    </div>
  );
};

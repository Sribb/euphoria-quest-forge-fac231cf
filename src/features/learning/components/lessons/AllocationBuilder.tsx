import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { TrendingUp, TrendingDown } from "lucide-react";

export const AllocationBuilder = () => {
  const [stocksPercent, setStocksPercent] = useState([60]);
  const [marketMode, setMarketMode] = useState<"bull" | "bear" | "recession">("bull");
  const [results, setResults] = useState<any>(null);
  const [aiAnalysis, setAiAnalysis] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const bondsPercent = 100 - stocksPercent[0];

  const data = [
    { name: "Stocks", value: stocksPercent[0] },
    { name: "Bonds", value: bondsPercent },
  ];

  const COLORS = ["#3b82f6", "#10b981"];

  const runBacktest = async () => {
    setIsLoading(true);

    // Simulate returns based on allocation and market mode
    const marketReturns: Record<string, { stocks: number; bonds: number }> = {
      bull: { stocks: 15, bonds: 4 },
      bear: { stocks: -12, bonds: 3 },
      recession: { stocks: -25, bonds: 6 },
    };

    const returns = marketReturns[marketMode];
    const portfolioReturn = (stocksPercent[0] / 100) * returns.stocks + (bondsPercent / 100) * returns.bonds;
    const volatility = (stocksPercent[0] / 100) * 18 + (bondsPercent / 100) * 5;

    setResults({
      expectedReturn: portfolioReturn.toFixed(2),
      volatility: volatility.toFixed(2),
      sharpeRatio: (portfolioReturn / volatility).toFixed(2),
    });

    try {
      const { data, error } = await supabase.functions.invoke("interactive-lesson-ai", {
        body: {
          lessonType: "allocation-builder",
          userInput: `Analyze ${stocksPercent[0]}% stocks / ${bondsPercent}% bonds in ${marketMode} market`,
          context: {
            lessonId: "stocks-vs-bonds",
            stocksPercent: stocksPercent[0],
            bondsPercent,
            marketMode,
            portfolioReturn,
            volatility,
          },
        },
      });

      if (error) throw error;
      setAiAnalysis(data.response);

      if (data.xpAwarded) {
        toast({
          title: "Backtest Complete! 📊",
          description: `+${data.xpAwarded} XP earned`,
        });
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-6 h-6 text-primary" />
        <h3 className="text-xl font-bold">AI Allocation Builder</h3>
      </div>

      <div className="space-y-6">
        <div>
          <label className="text-sm font-medium mb-2 block">
            Asset Allocation: {stocksPercent[0]}% Stocks / {bondsPercent}% Bonds
          </label>
          <Slider
            value={stocksPercent}
            onValueChange={setStocksPercent}
            max={100}
            step={5}
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>All Bonds</span>
            <span>Balanced</span>
            <span>All Stocks</span>
          </div>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Market Condition</label>
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant={marketMode === "bull" ? "default" : "outline"}
              onClick={() => setMarketMode("bull")}
              className="flex flex-col items-center gap-1"
            >
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs">Bull Market</span>
            </Button>
            <Button
              variant={marketMode === "bear" ? "default" : "outline"}
              onClick={() => setMarketMode("bear")}
              className="flex flex-col items-center gap-1"
            >
              <TrendingDown className="w-4 h-4" />
              <span className="text-xs">Bear Market</span>
            </Button>
            <Button
              variant={marketMode === "recession" ? "default" : "outline"}
              onClick={() => setMarketMode("recession")}
              className="flex flex-col items-center gap-1"
            >
              <TrendingDown className="w-4 h-4" />
              <span className="text-xs">Recession</span>
            </Button>
          </div>
        </div>

        <Button onClick={runBacktest} disabled={isLoading} className="w-full" size="lg">
          {isLoading ? "Running Backtest..." : "Run Historical Backtest"}
        </Button>

        {results && (
          <>
            <div className="grid grid-cols-3 gap-4">
              <Card className="p-4 text-center">
                <div className="text-sm text-muted-foreground mb-1">Expected Return</div>
                <div className={`text-2xl font-bold ${Number(results.expectedReturn) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {results.expectedReturn}%
                </div>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-sm text-muted-foreground mb-1">Volatility</div>
                <div className="text-2xl font-bold">{results.volatility}%</div>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-sm text-muted-foreground mb-1">Sharpe Ratio</div>
                <div className="text-2xl font-bold">{results.sharpeRatio}</div>
              </Card>
            </div>

            <Card className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
              <h4 className="font-semibold mb-2">📈 AI Analysis</h4>
              <p className="text-sm whitespace-pre-wrap">{aiAnalysis}</p>
            </Card>
          </>
        )}
      </div>
    </Card>
  );
};

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { TrendingUp } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const CompoundVisualizer = () => {
  const [principal, setPrincipal] = useState(10000);
  const [rate, setRate] = useState(8);
  const [years, setYears] = useState(30);
  const [startAge, setStartAge] = useState([25]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [aiInsight, setAiInsight] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const calculate = async () => {
    setIsLoading(true);

    // Early starter (selected age)
    const earlyData: any[] = [];
    let earlyValue = principal;
    for (let i = 0; i <= years; i++) {
      earlyData.push({
        year: startAge[0] + i,
        EarlyStart: Math.round(earlyValue),
        LateStart: 0,
      });
      earlyValue *= (1 + rate / 100);
    }

    // Late starter (10 years later)
    let lateValue = principal;
    for (let i = 0; i <= years; i++) {
      const age = startAge[0] + i;
      if (age >= startAge[0] + 10) {
        lateValue *= (1 + rate / 100);
        earlyData[i].LateStart = Math.round(lateValue);
      }
    }

    setChartData(earlyData);

    // Get AI explanation
    try {
      const { data, error } = await supabase.functions.invoke("interactive-lesson-ai", {
        body: {
          lessonType: "compound-visualizer",
          userInput: `Explain the compound interest result: $${principal} at ${rate}% for ${years} years, starting at age ${startAge[0]}`,
          context: {
            lessonId: "compound-interest",
            principal,
            rate,
            years,
            startAge: startAge[0],
            finalEarly: earlyData[years].EarlyStart,
            finalLate: earlyData[years].LateStart,
          },
        },
      });

      if (error) throw error;
      setAiInsight(data.response);

      if (data.xpAwarded) {
        toast({
          title: "Calculation Complete! 📈",
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
        <TrendingUp className="w-6 h-6 text-green-600" />
        <h3 className="text-xl font-bold">Compound Interest Visualizer</h3>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="text-sm font-medium mb-2 block">Initial Investment ($)</label>
          <Input
            type="number"
            value={principal}
            onChange={(e) => setPrincipal(Number(e.target.value))}
            min={1000}
            max={1000000}
            step={1000}
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Annual Return (%)</label>
          <Input
            type="number"
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            min={1}
            max={20}
            step={0.5}
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Investment Period (Years)</label>
          <Input
            type="number"
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            min={5}
            max={50}
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Starting Age: {startAge[0]}</label>
          <Slider
            value={startAge}
            onValueChange={setStartAge}
            min={18}
            max={50}
            step={1}
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>18</span>
            <span>50</span>
          </div>
        </div>
      </div>

      <Button onClick={calculate} disabled={isLoading} className="w-full mb-6" size="lg">
        {isLoading ? "Calculating..." : "Visualize Growth"}
      </Button>

      {chartData.length > 0 && (
        <>
          <div className="h-80 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" label={{ value: "Age", position: "insideBottom", offset: -5 }} />
                <YAxis label={{ value: "Portfolio Value ($)", angle: -90, position: "insideLeft" }} />
                <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                <Legend />
                <Line type="monotone" dataKey="EarlyStart" stroke="#10b981" strokeWidth={3} name="Start Early" />
                <Line type="monotone" dataKey="LateStart" stroke="#ef4444" strokeWidth={3} name="Start Late" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
            <h4 className="font-semibold mb-2">💡 AI Insight</h4>
            <p className="text-sm whitespace-pre-wrap">{aiInsight}</p>
          </Card>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <Card className="p-4 bg-green-50 dark:bg-green-950/20">
              <div className="text-sm text-muted-foreground">Early Start (Age {startAge[0]})</div>
              <div className="text-2xl font-bold text-green-600">
                ${chartData[years]?.EarlyStart.toLocaleString()}
              </div>
            </Card>
            <Card className="p-4 bg-red-50 dark:bg-red-950/20">
              <div className="text-sm text-muted-foreground">Late Start (Age {startAge[0] + 10})</div>
              <div className="text-2xl font-bold text-red-600">
                ${chartData[years]?.LateStart.toLocaleString()}
              </div>
            </Card>
          </div>
        </>
      )}
    </Card>
  );
};

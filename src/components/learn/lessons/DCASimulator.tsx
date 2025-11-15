import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Calendar, DollarSign, TrendingUp } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { toast } from "sonner";

export const DCASimulator = () => {
  const [monthlyInvestment, setMonthlyInvestment] = useState(500);
  const [lumpSum, setLumpSum] = useState(6000);
  const [months, setMonths] = useState(12);
  const [showResults, setShowResults] = useState(false);

  // Simulate market with volatility
  const generateMarketData = () => {
    const data = [];
    let price = 100;
    let dcaShares = 0;
    let dcaInvested = 0;
    let lumpSumShares = lumpSum / price;

    data.push({
      month: 0,
      price: price.toFixed(2),
      dcaValue: 0,
      lumpSumValue: (lumpSumShares * price).toFixed(2),
      dcaShares: 0,
      lumpSumShares: lumpSumShares.toFixed(2),
    });

    for (let month = 1; month <= months; month++) {
      // Random price movement (+/- 15%)
      const change = (Math.random() - 0.5) * 0.3;
      price = price * (1 + change);
      price = Math.max(price, 20); // Floor price

      // DCA: buy shares each month
      dcaShares += monthlyInvestment / price;
      dcaInvested += monthlyInvestment;

      data.push({
        month,
        price: price.toFixed(2),
        dcaValue: (dcaShares * price).toFixed(2),
        lumpSumValue: (lumpSumShares * price).toFixed(2),
        dcaShares: dcaShares.toFixed(2),
        lumpSumShares: lumpSumShares.toFixed(2),
      });
    }

    return data;
  };

  const [chartData, setChartData] = useState<any[]>([]);

  const runSimulation = () => {
    const data = generateMarketData();
    setChartData(data);
    setShowResults(true);

    const finalData = data[data.length - 1];
    const dcaReturn = ((parseFloat(finalData.dcaValue) - monthlyInvestment * months) / (monthlyInvestment * months)) * 100;
    const lumpSumReturn = ((parseFloat(finalData.lumpSumValue) - lumpSum) / lumpSum) * 100;

    toast.success("Simulation complete!");
  };

  const dcaTotal = monthlyInvestment * months;
  const finalDCAValue = showResults ? parseFloat(chartData[chartData.length - 1]?.dcaValue || 0) : 0;
  const finalLumpSumValue = showResults ? parseFloat(chartData[chartData.length - 1]?.lumpSumValue || 0) : 0;

  return (
    <Card className="p-6 space-y-6 bg-gradient-to-br from-background to-muted/20">
      <div>
        <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          Dollar-Cost Averaging vs Lump Sum
        </h3>
        <p className="text-sm text-muted-foreground">
          Compare investing regularly vs investing all at once
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card className="p-4 bg-primary/5 border-primary/20">
          <h4 className="font-semibold mb-3 text-sm">Dollar-Cost Averaging (DCA)</h4>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium mb-1 block">
                Monthly Investment: ${monthlyInvestment}
              </label>
              <Slider
                value={[monthlyInvestment]}
                onValueChange={([value]) => setMonthlyInvestment(value)}
                min={100}
                max={2000}
                step={100}
                className="w-full"
              />
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">
                Time Period: {months} months
              </label>
              <Slider
                value={[months]}
                onValueChange={([value]) => setMonths(value)}
                min={6}
                max={36}
                step={6}
                className="w-full"
              />
            </div>
            <div className="pt-2 border-t text-sm">
              <strong>Total Invested:</strong> ${dcaTotal.toLocaleString()}
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-muted/30">
          <h4 className="font-semibold mb-3 text-sm">Lump Sum Investment</h4>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium mb-1 block">
                One-Time Investment: ${lumpSum}
              </label>
              <Slider
                value={[lumpSum]}
                onValueChange={([value]) => setLumpSum(value)}
                min={1000}
                max={20000}
                step={1000}
                className="w-full"
              />
            </div>
            <p className="text-xs text-muted-foreground pt-8">
              Invest the entire amount at month 0 and let it grow
            </p>
            <div className="pt-2 border-t text-sm">
              <strong>Total Invested:</strong> ${lumpSum.toLocaleString()}
            </div>
          </div>
        </Card>
      </div>

      <Button onClick={runSimulation} className="w-full" size="lg">
        <TrendingUp className="w-4 h-4 mr-2" />
        Run Simulation
      </Button>

      {showResults && chartData.length > 0 && (
        <>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground)/0.2)" />
                <XAxis dataKey="month" label={{ value: "Month", position: "insideBottom", offset: -5 }} />
                <YAxis label={{ value: "Value ($)", angle: -90, position: "insideLeft" }} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="dcaValue"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  name="DCA Portfolio"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="lumpSumValue"
                  stroke="hsl(var(--success))"
                  strokeWidth={2}
                  name="Lump Sum Portfolio"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4 bg-primary/10 border-primary/30">
              <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-primary" />
                DCA Result
              </h4>
              <div className="space-y-1 text-sm">
                <p>
                  <strong>Invested:</strong> ${dcaTotal.toLocaleString()}
                </p>
                <p>
                  <strong>Final Value:</strong> ${finalDCAValue.toLocaleString()}
                </p>
                <p>
                  <strong>Return:</strong>{" "}
                  <span className={finalDCAValue > dcaTotal ? "text-success" : "text-destructive"}>
                    {(((finalDCAValue - dcaTotal) / dcaTotal) * 100).toFixed(1)}%
                  </span>
                </p>
              </div>
            </Card>

            <Card className="p-4 bg-success/10 border-success/30">
              <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-success" />
                Lump Sum Result
              </h4>
              <div className="space-y-1 text-sm">
                <p>
                  <strong>Invested:</strong> ${lumpSum.toLocaleString()}
                </p>
                <p>
                  <strong>Final Value:</strong> ${finalLumpSumValue.toLocaleString()}
                </p>
                <p>
                  <strong>Return:</strong>{" "}
                  <span className={finalLumpSumValue > lumpSum ? "text-success" : "text-destructive"}>
                    {(((finalLumpSumValue - lumpSum) / lumpSum) * 100).toFixed(1)}%
                  </span>
                </p>
              </div>
            </Card>
          </div>

          <Card className="p-4 bg-muted/50">
            <h4 className="font-semibold mb-2 text-sm">Key Insights</h4>
            <ul className="text-xs space-y-1 text-muted-foreground">
              <li>• <strong>DCA reduces timing risk</strong> by spreading purchases over time</li>
              <li>• <strong>Lump sum often wins</strong> in rising markets due to more time invested</li>
              <li>• <strong>DCA provides peace of mind</strong> during volatile markets</li>
              <li>• <strong>Best strategy depends</strong> on your risk tolerance and market conditions</li>
              <li>• <strong>Both are better than not investing</strong> - the key is to start!</li>
            </ul>
          </Card>
        </>
      )}
    </Card>
  );
};

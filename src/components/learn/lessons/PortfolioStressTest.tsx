import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { 
  Activity, 
  TrendingUp, 
  TrendingDown,
  Minus,
  AlertTriangle,
  Zap,
  BarChart3
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, ReferenceLine } from "recharts";

interface Asset {
  name: string;
  allocation: number;
  recessionImpact: number;
  boomImpact: number;
  sidewaysImpact: number;
}

const defaultAssets: Asset[] = [
  { name: "US Stocks", allocation: 40, recessionImpact: -35, boomImpact: 25, sidewaysImpact: 5 },
  { name: "Int'l Stocks", allocation: 20, recessionImpact: -40, boomImpact: 28, sidewaysImpact: 4 },
  { name: "Bonds", allocation: 25, recessionImpact: 8, boomImpact: -2, sidewaysImpact: 3 },
  { name: "Real Estate", allocation: 10, recessionImpact: -20, boomImpact: 15, sidewaysImpact: 6 },
  { name: "Cash", allocation: 5, recessionImpact: 0, boomImpact: 1, sidewaysImpact: 1 },
];

type MarketScenario = "recession" | "boom" | "sideways";

interface ScenarioResult {
  scenario: MarketScenario;
  return: number;
  volatility: number;
  timeline: { month: number; value: number }[];
}

export const PortfolioStressTest = () => {
  const [assets, setAssets] = useState<Asset[]>(defaultAssets);
  const [activeScenario, setActiveScenario] = useState<MarketScenario | null>(null);
  const [result, setResult] = useState<ScenarioResult | null>(null);
  const [initialValue] = useState(100000);

  const updateAllocation = (index: number, newValue: number) => {
    const newAssets = [...assets];
    const diff = newValue - assets[index].allocation;
    
    // Adjust other allocations proportionally
    const othersTotal = assets.reduce((sum, a, i) => i === index ? sum : sum + a.allocation, 0);
    
    newAssets[index].allocation = newValue;
    
    if (othersTotal > 0) {
      newAssets.forEach((asset, i) => {
        if (i !== index) {
          asset.allocation = Math.max(0, asset.allocation - (diff * asset.allocation / othersTotal));
        }
      });
    }

    // Normalize to 100%
    const total = newAssets.reduce((sum, a) => sum + a.allocation, 0);
    newAssets.forEach(a => a.allocation = (a.allocation / total) * 100);

    setAssets(newAssets);
  };

  const runScenario = (scenario: MarketScenario) => {
    setActiveScenario(scenario);

    // Calculate weighted return
    let portfolioReturn = 0;
    let portfolioVolatility = 0;

    assets.forEach(asset => {
      const impact = scenario === "recession" 
        ? asset.recessionImpact 
        : scenario === "boom" 
          ? asset.boomImpact 
          : asset.sidewaysImpact;
      
      portfolioReturn += (asset.allocation / 100) * impact;
      portfolioVolatility += (asset.allocation / 100) * Math.abs(impact) * 0.5;
    });

    // Generate timeline data
    const timeline: { month: number; value: number }[] = [];
    let currentValue = initialValue;
    const monthlyReturn = portfolioReturn / 12;
    const volatility = portfolioVolatility / 12;

    for (let month = 0; month <= 12; month++) {
      timeline.push({ month, value: Math.round(currentValue) });
      
      // Add some randomness based on volatility
      const randomFactor = 1 + (Math.random() - 0.5) * volatility * 0.02;
      currentValue = currentValue * (1 + monthlyReturn / 100) * randomFactor;
    }

    setResult({
      scenario,
      return: portfolioReturn,
      volatility: portfolioVolatility,
      timeline
    });

    if (scenario === "recession" && portfolioReturn > -15) {
      toast.success("Your portfolio held up well in the recession!");
    } else if (scenario === "boom" && portfolioReturn > 18) {
      toast.success("Great gains during the boom!");
    } else if (scenario === "recession" && portfolioReturn < -25) {
      toast.error("Heavy losses! Consider more defensive allocations.");
    }
  };

  const getScenarioIcon = (scenario: MarketScenario) => {
    switch (scenario) {
      case "recession": return <TrendingDown className="w-4 h-4" />;
      case "boom": return <TrendingUp className="w-4 h-4" />;
      case "sideways": return <Minus className="w-4 h-4" />;
    }
  };

  const getScenarioColor = (scenario: MarketScenario) => {
    switch (scenario) {
      case "recession": return "text-destructive";
      case "boom": return "text-success";
      case "sideways": return "text-warning";
    }
  };

  const finalValue = result ? result.timeline[result.timeline.length - 1].value : initialValue;
  const returnAmount = finalValue - initialValue;

  return (
    <Card className="p-6 space-y-6 bg-gradient-to-br from-background to-muted/10">
      <div>
        <h3 className="text-xl font-bold mb-1 flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          Portfolio Stress Test Lab
        </h3>
        <p className="text-sm text-muted-foreground">
          Adjust your allocation and simulate recessions, booms, and sideways markets
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Allocation Sliders */}
        <Card className="p-4 bg-muted/30 space-y-4">
          <h4 className="font-semibold flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Portfolio Allocation
          </h4>
          
          {assets.map((asset, idx) => (
            <div key={asset.name} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{asset.name}</span>
                <span className="font-bold">{asset.allocation.toFixed(0)}%</span>
              </div>
              <Slider
                value={[asset.allocation]}
                onValueChange={([v]) => updateAllocation(idx, v)}
                min={0}
                max={80}
                step={5}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span className="text-destructive">Recession: {asset.recessionImpact > 0 ? '+' : ''}{asset.recessionImpact}%</span>
                <span className="text-success">Boom: +{asset.boomImpact}%</span>
              </div>
            </div>
          ))}

          <div className="pt-2 border-t">
            <div className="text-xs text-muted-foreground mb-2">
              Total Allocation: {assets.reduce((sum, a) => sum + a.allocation, 0).toFixed(0)}%
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setAssets(defaultAssets)}
              className="w-full"
            >
              Reset to Default
            </Button>
          </div>
        </Card>

        {/* Scenario Simulator */}
        <div className="space-y-4">
          <Card className="p-4 bg-muted/30">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Run Stress Test
            </h4>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant={activeScenario === "recession" ? "default" : "outline"}
                onClick={() => runScenario("recession")}
                className="flex-col h-20 hover:bg-destructive/10 hover:border-destructive"
              >
                <TrendingDown className="w-5 h-5 mb-1 text-destructive" />
                <span className="text-xs">Recession</span>
                <span className="text-xs text-muted-foreground">-20% avg</span>
              </Button>
              <Button
                variant={activeScenario === "sideways" ? "default" : "outline"}
                onClick={() => runScenario("sideways")}
                className="flex-col h-20 hover:bg-warning/10 hover:border-warning"
              >
                <Minus className="w-5 h-5 mb-1 text-warning" />
                <span className="text-xs">Sideways</span>
                <span className="text-xs text-muted-foreground">±5% avg</span>
              </Button>
              <Button
                variant={activeScenario === "boom" ? "default" : "outline"}
                onClick={() => runScenario("boom")}
                className="flex-col h-20 hover:bg-success/10 hover:border-success"
              >
                <TrendingUp className="w-5 h-5 mb-1 text-success" />
                <span className="text-xs">Boom</span>
                <span className="text-xs text-muted-foreground">+20% avg</span>
              </Button>
            </div>
          </Card>

          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card className={`p-4 ${
                  result.return >= 0 
                    ? 'bg-success/10 border-success/30' 
                    : 'bg-destructive/10 border-destructive/30'
                }`}>
                  <div className="flex justify-between items-center mb-3">
                    <Badge className={getScenarioColor(result.scenario)}>
                      {getScenarioIcon(result.scenario)}
                      <span className="ml-1 capitalize">{result.scenario}</span>
                    </Badge>
                    <span className={`text-lg font-bold ${result.return >= 0 ? 'text-success' : 'text-destructive'}`}>
                      {result.return >= 0 ? '+' : ''}{result.return.toFixed(1)}%
                    </span>
                  </div>

                  {/* Chart */}
                  <div className="h-40 mb-3">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={result.timeline}>
                        <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                        <YAxis 
                          domain={['dataMin - 5000', 'dataMax + 5000']} 
                          tick={{ fontSize: 10 }}
                          tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`}
                        />
                        <ReferenceLine y={initialValue} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" />
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke={result.return >= 0 ? 'hsl(var(--success))' : 'hsl(var(--destructive))'}
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-center text-sm">
                    <div>
                      <div className="text-xs text-muted-foreground">Starting</div>
                      <div className="font-bold">${initialValue.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Ending</div>
                      <div className="font-bold">${finalValue.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Change</div>
                      <div className={`font-bold ${returnAmount >= 0 ? 'text-success' : 'text-destructive'}`}>
                        {returnAmount >= 0 ? '+' : ''}${returnAmount.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Educational Insights */}
      <Card className="p-4 bg-primary/5">
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-warning mt-0.5" />
          <div className="text-xs text-muted-foreground">
            <strong>Key Insight:</strong> Diversification across asset classes helps reduce portfolio volatility. 
            Bonds and cash provide stability during recessions, while stocks capture growth during booms. 
            The right mix depends on your risk tolerance and time horizon.
          </div>
        </div>
      </Card>
    </Card>
  );
};

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { ArrowRightLeft, DollarSign, TrendingUp, TrendingDown } from "lucide-react";

const currencyPairs = [
  { pair: "EUR/USD", rate: 1.0875, change: 0.15, spread: 0.0001 },
  { pair: "GBP/USD", rate: 1.2650, change: -0.22, spread: 0.0002 },
  { pair: "USD/JPY", rate: 149.50, change: 0.45, spread: 0.01 },
  { pair: "USD/CHF", rate: 0.8820, change: -0.08, spread: 0.0001 },
];

export const ForexSimulator = () => {
  const [selectedPair, setSelectedPair] = useState(0);
  const [positionSize, setPositionSize] = useState(10000);
  const [leverage, setLeverage] = useState(10);

  const pair = currencyPairs[selectedPair];
  const marginRequired = positionSize / leverage;
  const pipValue = (positionSize * 0.0001).toFixed(2);
  const potentialProfit = (parseFloat(pipValue) * 50).toFixed(2);
  const potentialLoss = (parseFloat(pipValue) * 30).toFixed(2);

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowRightLeft className="h-5 w-5 text-primary" />
          Forex Trading Simulator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-2">
          {currencyPairs.map((cp, idx) => (
            <button
              key={cp.pair}
              onClick={() => setSelectedPair(idx)}
              className={`p-3 rounded-lg text-left transition-all ${
                selectedPair === idx ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
              }`}
            >
              <p className="font-bold">{cp.pair}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm">{cp.rate}</span>
                <span className={`text-xs flex items-center ${cp.change >= 0 ? "text-green-400" : "text-red-400"}`}>
                  {cp.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {cp.change > 0 ? "+" : ""}{cp.change}%
                </span>
              </div>
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4" /> Position Size: ${positionSize.toLocaleString()}
            </label>
            <Slider value={[positionSize]} onValueChange={([v]) => setPositionSize(v)} min={1000} max={100000} step={1000} className="mt-2" />
          </div>
          
          <div>
            <label className="text-sm font-medium">Leverage: {leverage}:1</label>
            <Slider value={[leverage]} onValueChange={([v]) => setLeverage(v)} min={1} max={50} step={1} className="mt-2" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-muted/50">
            <CardContent className="pt-4">
              <p className="text-sm text-muted-foreground">Margin Required</p>
              <p className="text-xl font-bold">${marginRequired.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card className="bg-muted/50">
            <CardContent className="pt-4">
              <p className="text-sm text-muted-foreground">Pip Value</p>
              <p className="text-xl font-bold">${pipValue}</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-4">
          <Card className="flex-1 bg-green-500/10">
            <CardContent className="pt-4 text-center">
              <p className="text-sm text-muted-foreground">50 Pip Gain</p>
              <p className="text-lg font-bold text-green-500">+${potentialProfit}</p>
            </CardContent>
          </Card>
          <Card className="flex-1 bg-red-500/10">
            <CardContent className="pt-4 text-center">
              <p className="text-sm text-muted-foreground">30 Pip Loss</p>
              <p className="text-lg font-bold text-red-500">-${potentialLoss}</p>
            </CardContent>
          </Card>
        </div>

        <div className="p-3 bg-primary/10 rounded-lg">
          <p className="text-sm"><strong>⚠️ Warning:</strong> Forex trading with leverage amplifies both gains and losses. A {leverage}:1 leverage means a 1% market move equals a {leverage}% change in your position. Always use stop-losses!</p>
        </div>
      </CardContent>
    </Card>
  );
};

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { BarChart3, TrendingUp, DollarSign, Percent } from "lucide-react";

const etfTypes = [
  {
    name: "S&P 500 Index ETF",
    ticker: "SPY/VOO",
    expenseRatio: 0.03,
    holdings: 500,
    type: "Broad Market",
    historicalReturn: 10.5,
    description: "Tracks the 500 largest US companies. The most popular ETF choice."
  },
  {
    name: "Total Stock Market ETF",
    ticker: "VTI",
    expenseRatio: 0.03,
    holdings: 4000,
    type: "Broad Market",
    historicalReturn: 10.3,
    description: "Includes large, mid, and small cap US stocks for total market exposure."
  },
  {
    name: "International Developed ETF",
    ticker: "VXUS",
    expenseRatio: 0.07,
    holdings: 7500,
    type: "International",
    historicalReturn: 6.5,
    description: "Exposure to developed international markets like Europe and Japan."
  },
  {
    name: "Bond Market ETF",
    ticker: "BND",
    expenseRatio: 0.03,
    holdings: 10000,
    type: "Fixed Income",
    historicalReturn: 4.2,
    description: "Diversified bond exposure for stability and income."
  },
  {
    name: "High-Dividend ETF",
    ticker: "VYM",
    expenseRatio: 0.06,
    holdings: 450,
    type: "Dividend",
    historicalReturn: 9.8,
    description: "Focuses on high-dividend-yielding stocks for income investors."
  }
];

export const ETFComparison = () => {
  const [investment, setInvestment] = useState(10000);
  const [years, setYears] = useState(20);
  const [selectedETFs, setSelectedETFs] = useState<number[]>([0]);

  const toggleETF = (idx: number) => {
    setSelectedETFs(prev => 
      prev.includes(idx) 
        ? prev.filter(i => i !== idx) 
        : prev.length < 3 ? [...prev, idx] : prev
    );
  };

  const calculateGrowth = (returnRate: number, expenseRatio: number) => {
    const netReturn = (returnRate - expenseRatio) / 100;
    return investment * Math.pow(1 + netReturn, years);
  };

  const calculateFeeCost = (returnRate: number, expenseRatio: number) => {
    const withFees = calculateGrowth(returnRate, expenseRatio);
    const withoutFees = calculateGrowth(returnRate, 0);
    return withoutFees - withFees;
  };

  return (
    <Card className="p-6 bg-card/50 border-primary/20">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-5 h-5 text-primary" />
        <h3 className="font-bold text-lg">ETF Comparison Tool</h3>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Initial Investment: ${investment.toLocaleString()}</label>
            <Slider
              value={[investment]}
              onValueChange={([v]) => setInvestment(v)}
              min={1000}
              max={100000}
              step={1000}
              className="mt-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Investment Period: {years} years</label>
            <Slider
              value={[years]}
              onValueChange={([v]) => setYears(v)}
              min={5}
              max={40}
              step={1}
              className="mt-2"
            />
          </div>

          <p className="text-sm text-muted-foreground">Select up to 3 ETFs to compare:</p>

          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {etfTypes.map((etf, idx) => (
              <Card
                key={idx}
                className={`p-3 cursor-pointer transition-all ${
                  selectedETFs.includes(idx) 
                    ? 'ring-2 ring-primary bg-primary/5' 
                    : 'hover:bg-muted/30'
                }`}
                onClick={() => toggleETF(idx)}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-sm">{etf.name}</span>
                  <Badge variant="secondary">{etf.ticker}</Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{etf.description}</p>
                <div className="flex gap-3 text-xs">
                  <span className="flex items-center gap-1">
                    <Percent className="w-3 h-3" />
                    {etf.expenseRatio}% fee
                  </span>
                  <span className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {etf.historicalReturn}% avg
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <Card className="p-4 bg-muted/30">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Projected Growth ({years} years)
            </h4>
            
            {selectedETFs.length === 0 ? (
              <p className="text-sm text-muted-foreground">Select at least one ETF to see projections</p>
            ) : (
              <div className="space-y-3">
                {selectedETFs.map(idx => {
                  const etf = etfTypes[idx];
                  const finalValue = calculateGrowth(etf.historicalReturn, etf.expenseRatio);
                  const feeCost = calculateFeeCost(etf.historicalReturn, etf.expenseRatio);
                  
                  return (
                    <div key={idx} className="p-3 bg-background rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-sm">{etf.ticker}</span>
                        <span className="text-lg font-bold text-primary">
                          ${finalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Expense Ratio: {etf.expenseRatio}%</span>
                        <span className="text-destructive">
                          Fees Cost: ${feeCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          <Card className="p-4 bg-success/10 border-success/30">
            <h4 className="font-semibold mb-2 text-success">Key Takeaway</h4>
            <p className="text-sm">
              Even small expense ratio differences compound into significant costs over time. 
              A 1% higher fee on ${investment.toLocaleString()} over {years} years can cost you 
              <span className="font-bold"> ${(calculateFeeCost(10, 1.03) - calculateFeeCost(10, 0.03)).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>!
            </p>
          </Card>

          <div className="text-xs text-muted-foreground p-3 bg-muted/20 rounded-lg">
            <strong>Disclaimer:</strong> Historical returns are not guaranteed. Past performance does not indicate future results.
          </div>
        </div>
      </div>
    </Card>
  );
};
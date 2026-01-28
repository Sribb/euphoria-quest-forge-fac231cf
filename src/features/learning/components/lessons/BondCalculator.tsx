import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Banknote, TrendingUp, Calendar, Percent, Shield } from "lucide-react";
import { AIContextualHelp } from "../AIContextualHelp";

const bondTypes = [
  { name: "Treasury Bond", risk: "Very Low", yield: 4.5, rating: "AAA", description: "US Government backed, safest option" },
  { name: "Investment Grade Corporate", risk: "Low", yield: 5.5, rating: "BBB+", description: "High-quality corporate debt" },
  { name: "High Yield (Junk)", risk: "High", yield: 8.0, rating: "BB", description: "Higher returns, higher default risk" },
  { name: "Municipal Bond", risk: "Low", yield: 3.5, rating: "AA", description: "Tax-free income, state/local government" },
];

export const BondCalculator = () => {
  const [principal, setPrincipal] = useState(10000);
  const [selectedBond, setSelectedBond] = useState(0);
  const [years, setYears] = useState(10);
  const [currentRates, setCurrentRates] = useState(5);

  const bond = bondTypes[selectedBond];
  
  // Calculate annual income
  const annualIncome = principal * (bond.yield / 100);
  const totalIncome = annualIncome * years;
  const totalReturn = principal + totalIncome;

  // Bond price sensitivity to rate changes
  const duration = years * 0.8; // Simplified duration estimate
  const rateChange = currentRates - bond.yield;
  const priceChange = -duration * rateChange;
  const estimatedPrice = principal * (1 + priceChange / 100);

  return (
    <Card className="p-6 bg-card/50 border-primary/20">
      <div className="flex items-center gap-2 mb-4">
        <Banknote className="w-5 h-5 text-primary" />
        <h3 className="font-bold text-lg">Bond Yield Calculator</h3>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Investment Amount: ${principal.toLocaleString()}</label>
            <Slider
              value={[principal]}
              onValueChange={([v]) => setPrincipal(v)}
              min={1000}
              max={100000}
              step={1000}
              className="mt-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Hold Period: {years} years</label>
            <Slider
              value={[years]}
              onValueChange={([v]) => setYears(v)}
              min={1}
              max={30}
              step={1}
              className="mt-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Market Interest Rate: {currentRates}%</label>
            <Slider
              value={[currentRates]}
              onValueChange={([v]) => setCurrentRates(v)}
              min={1}
              max={10}
              step={0.25}
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Adjust to see how rate changes affect bond prices
            </p>
          </div>

          <p className="text-sm font-medium">Select Bond Type:</p>
          <div className="space-y-2">
            {bondTypes.map((b, idx) => (
              <Card
                key={idx}
                className={`p-3 cursor-pointer transition-all ${
                  selectedBond === idx 
                    ? 'ring-2 ring-primary bg-primary/5' 
                    : 'hover:bg-muted/30'
                }`}
                onClick={() => setSelectedBond(idx)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-sm">{b.name}</span>
                    <p className="text-xs text-muted-foreground">{b.description}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant={b.risk === "Very Low" ? "default" : b.risk === "Low" ? "secondary" : "destructive"}>
                      {b.rating}
                    </Badge>
                    <p className="text-sm font-semibold text-primary mt-1">{b.yield}% yield</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <Card className="p-4 bg-muted/30">
            <h4 className="font-semibold mb-3">Income Projection</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-2 bg-background rounded">
                <span className="text-sm text-muted-foreground">Annual Income:</span>
                <span className="font-bold text-success">${annualIncome.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-background rounded">
                <span className="text-sm text-muted-foreground">Total Income ({years} yrs):</span>
                <span className="font-bold text-success">${totalIncome.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-background rounded border-t-2 border-primary">
                <span className="text-sm font-semibold">Total Return:</span>
                <span className="font-bold text-lg">${totalReturn.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
              </div>
            </div>
          </Card>

          <Card className={`p-4 ${priceChange >= 0 ? 'bg-success/10 border-success/30' : 'bg-destructive/10 border-destructive/30'}`}>
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <TrendingUp className={`w-4 h-4 ${priceChange >= 0 ? 'text-success' : 'text-destructive'}`} />
              Interest Rate Impact
            </h4>
            <p className="text-sm mb-2">
              If market rates {currentRates > bond.yield ? 'rise' : 'fall'} to {currentRates}%:
            </p>
            <div className="flex justify-between items-center">
              <span className="text-sm">Bond Price Change:</span>
              <span className={`font-bold ${priceChange >= 0 ? 'text-success' : 'text-destructive'}`}>
                {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-sm">Estimated Value:</span>
              <span className="font-bold">${estimatedPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>
          </Card>

          <div className="p-4 bg-muted/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-primary" />
              <span className="font-semibold text-sm">Key Insight</span>
            </div>
            <p className="text-xs text-muted-foreground">
              <strong>Inverse Relationship:</strong> When <AIContextualHelp term="interest rates" lessonId="17" lessonTitle="Bonds">interest rates</AIContextualHelp> rise, existing <AIContextualHelp term="bond prices" lessonId="17" lessonTitle="Bonds">bond prices</AIContextualHelp> fall (and vice versa). 
              Longer-<AIContextualHelp term="duration" lessonId="17" lessonTitle="Bonds">duration</AIContextualHelp> bonds are more sensitive to rate changes. If you hold to <AIContextualHelp term="maturity" lessonId="17" lessonTitle="Bonds">maturity</AIContextualHelp>, you receive <AIContextualHelp term="face value" lessonId="17" lessonTitle="Bonds">face value</AIContextualHelp> regardless of interim price changes.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};
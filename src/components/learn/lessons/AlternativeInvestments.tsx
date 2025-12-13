import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Palette, Wine, Watch, Briefcase, TrendingUp, Lock, Clock } from "lucide-react";

const alternatives = [
  { name: "Fine Art", icon: Palette, minInvestment: 10000, liquidity: "Low", returns: "8-12%", correlation: 0.1 },
  { name: "Wine Collections", icon: Wine, minInvestment: 5000, liquidity: "Low", returns: "5-10%", correlation: 0.05 },
  { name: "Luxury Watches", icon: Watch, minInvestment: 15000, liquidity: "Medium", returns: "6-15%", correlation: 0.15 },
  { name: "Private Equity", icon: Briefcase, minInvestment: 250000, liquidity: "Very Low", returns: "15-25%", correlation: 0.6 },
];

export const AlternativeInvestments = () => {
  const [selected, setSelected] = useState<number | null>(null);
  const [portfolioAllocation, setPortfolioAllocation] = useState(10);

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5 text-primary" />
          Alternative Investments Explorer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-sm text-muted-foreground">Explore non-traditional investments that can diversify your portfolio beyond stocks and bonds.</p>

        <div className="grid grid-cols-2 gap-3">
          {alternatives.map((alt, idx) => {
            const Icon = alt.icon;
            return (
              <div
                key={alt.name}
                onClick={() => setSelected(idx)}
                className={`p-4 rounded-lg cursor-pointer transition-all ${
                  selected === idx ? "bg-primary/10 border-2 border-primary" : "bg-muted/50 border border-border hover:border-primary/50"
                }`}
              >
                <Icon className="h-8 w-8 text-primary mb-2" />
                <p className="font-semibold">{alt.name}</p>
                <p className="text-xs text-muted-foreground">Min: ${alt.minInvestment.toLocaleString()}</p>
              </div>
            );
          })}
        </div>

        {selected !== null && (
          <Card className="bg-muted/50 animate-fade-in">
            <CardContent className="pt-4 space-y-4">
              <h4 className="font-semibold">{alternatives[selected].name} Details</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <div>
                    <p className="text-muted-foreground">Expected Returns</p>
                    <p className="font-bold">{alternatives[selected].returns}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-yellow-500" />
                  <div>
                    <p className="text-muted-foreground">Liquidity</p>
                    <Badge variant="secondary">{alternatives[selected].liquidity}</Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <div>
                    <p className="text-muted-foreground">Stock Correlation</p>
                    <p className="font-bold">{alternatives[selected].correlation}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div>
          <label className="text-sm font-medium">Suggested Portfolio Allocation: {portfolioAllocation}%</label>
          <Progress value={portfolioAllocation} className="mt-2" />
          <p className="text-xs text-muted-foreground mt-1">Experts recommend 5-20% allocation to alternatives</p>
        </div>

        <div className="p-3 bg-primary/10 rounded-lg">
          <p className="text-sm"><strong>💡 Key Insight:</strong> Alternative investments offer low correlation to traditional markets, potentially reducing overall portfolio risk. However, they often require longer holding periods and higher minimum investments.</p>
        </div>
      </CardContent>
    </Card>
  );
};

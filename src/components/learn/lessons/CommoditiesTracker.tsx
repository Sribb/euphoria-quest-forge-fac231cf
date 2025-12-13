import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Gem, Wheat, Fuel, Factory } from "lucide-react";

const commodities = [
  { name: "Gold", category: "Precious Metals", price: 2045, change: 2.3, icon: Gem, correlation: -0.2 },
  { name: "Silver", category: "Precious Metals", price: 24.5, change: 1.8, icon: Gem, correlation: -0.15 },
  { name: "Crude Oil", category: "Energy", price: 78.5, change: -1.2, icon: Fuel, correlation: 0.4 },
  { name: "Natural Gas", category: "Energy", price: 2.85, change: -3.5, icon: Fuel, correlation: 0.3 },
  { name: "Wheat", category: "Agriculture", price: 612, change: 0.8, icon: Wheat, correlation: 0.1 },
  { name: "Copper", category: "Industrial Metals", price: 4.12, change: 1.5, icon: Factory, correlation: 0.5 },
];

export const CommoditiesTracker = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const commodity = commodities.find(c => c.name === selected);

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gem className="h-5 w-5 text-primary" />
          Commodities Market Explorer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">Explore different commodities and understand their role in portfolio diversification.</p>
        
        <div className="space-y-2">
          {commodities.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.name}
                onClick={() => setSelected(item.name)}
                className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${
                  selected === item.name ? "bg-primary/10 border border-primary" : "bg-muted/50 hover:bg-muted"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">${item.price}</p>
                  <div className="flex items-center gap-1">
                    {item.change >= 0 ? (
                      <TrendingUp className="h-3 w-3 text-green-500" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-500" />
                    )}
                    <span className={`text-sm ${item.change >= 0 ? "text-green-500" : "text-red-500"}`}>
                      {item.change > 0 ? "+" : ""}{item.change}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {commodity && (
          <Card className="bg-muted/50 animate-fade-in">
            <CardContent className="pt-4">
              <h4 className="font-semibold mb-3">{commodity.name} Analysis</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Stock Correlation</p>
                  <Badge variant={commodity.correlation < 0 ? "secondary" : "default"}>
                    {commodity.correlation > 0 ? "+" : ""}{commodity.correlation}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">
                    {commodity.correlation < 0 ? "Good diversifier" : "Moves with stocks"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Inflation Hedge</p>
                  <Badge variant={commodity.category === "Precious Metals" ? "default" : "secondary"}>
                    {commodity.category === "Precious Metals" ? "Strong" : "Moderate"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="p-3 bg-primary/10 rounded-lg">
          <p className="text-sm"><strong>💡 Key Insight:</strong> Commodities with negative stock correlation (like gold) can reduce portfolio volatility during market downturns, while industrial commodities tend to rise with economic growth.</p>
        </div>
      </CardContent>
    </Card>
  );
};

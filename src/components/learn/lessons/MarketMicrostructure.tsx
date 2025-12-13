import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Clock, Users, Zap } from "lucide-react";

const concepts = [
  { name: "Bid-Ask Spread", description: "The difference between the highest buy price and lowest sell price", impact: "Trading cost" },
  { name: "Market Depth", description: "Volume of orders at different price levels", impact: "Liquidity indicator" },
  { name: "Order Flow", description: "The net buying/selling pressure from incoming orders", impact: "Price direction" },
  { name: "Dark Pools", description: "Private exchanges where large orders execute anonymously", impact: "Hidden liquidity" },
];

const orderBook = [
  { price: 150.05, askSize: 500, bidSize: 0 },
  { price: 150.04, askSize: 1200, bidSize: 0 },
  { price: 150.03, askSize: 800, bidSize: 0 },
  { price: 150.00, askSize: 0, bidSize: 1500 },
  { price: 149.99, askSize: 0, bidSize: 900 },
  { price: 149.98, askSize: 0, bidSize: 600 },
];

export const MarketMicrostructure = () => {
  const [selectedConcept, setSelectedConcept] = useState(0);

  const spread = 150.03 - 150.00;
  const maxSize = Math.max(...orderBook.map(o => Math.max(o.askSize, o.bidSize)));

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          Market Microstructure Explorer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-2">
          {concepts.map((c, idx) => (
            <button
              key={c.name}
              onClick={() => setSelectedConcept(idx)}
              className={`p-3 rounded-lg text-left transition-all ${
                selectedConcept === idx ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
              }`}
            >
              <p className="font-medium text-sm">{c.name}</p>
              <p className="text-xs opacity-80">{c.impact}</p>
            </button>
          ))}
        </div>

        <Card className="bg-muted/50">
          <CardContent className="pt-4">
            <h4 className="font-semibold mb-2">{concepts[selectedConcept].name}</h4>
            <p className="text-sm text-muted-foreground">{concepts[selectedConcept].description}</p>
          </CardContent>
        </Card>

        <div>
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Users className="h-4 w-4" /> Live Order Book
          </h4>
          <div className="space-y-1">
            {orderBook.map((level, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm">
                <div className="w-24 text-right">
                  {level.bidSize > 0 && (
                    <div className="flex items-center justify-end gap-1">
                      <div 
                        className="h-4 bg-green-500/30 rounded"
                        style={{ width: `${(level.bidSize / maxSize) * 60}px` }}
                      />
                      <span className="text-green-500">{level.bidSize}</span>
                    </div>
                  )}
                </div>
                <div className={`w-16 text-center font-mono ${level.bidSize > 0 ? "text-green-500" : "text-red-500"}`}>
                  ${level.price.toFixed(2)}
                </div>
                <div className="w-24">
                  {level.askSize > 0 && (
                    <div className="flex items-center gap-1">
                      <span className="text-red-500">{level.askSize}</span>
                      <div 
                        className="h-4 bg-red-500/30 rounded"
                        style={{ width: `${(level.askSize / maxSize) * 60}px` }}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-3 bg-muted/50 rounded-lg">
            <Clock className="h-4 w-4 mx-auto mb-1 text-primary" />
            <p className="font-bold">${spread.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground">Spread</p>
          </div>
          <div className="p-3 bg-muted/50 rounded-lg">
            <Zap className="h-4 w-4 mx-auto mb-1 text-yellow-500" />
            <p className="font-bold">3,000</p>
            <p className="text-xs text-muted-foreground">Bid Depth</p>
          </div>
          <div className="p-3 bg-muted/50 rounded-lg">
            <BarChart3 className="h-4 w-4 mx-auto mb-1 text-blue-500" />
            <p className="font-bold">2,500</p>
            <p className="text-xs text-muted-foreground">Ask Depth</p>
          </div>
        </div>

        <div className="p-3 bg-primary/10 rounded-lg">
          <p className="text-sm"><strong>💡 Key Insight:</strong> The bid-ask spread represents a hidden trading cost. Tight spreads indicate high liquidity, while wide spreads suggest lower liquidity and higher trading costs.</p>
        </div>
      </CardContent>
    </Card>
  );
};

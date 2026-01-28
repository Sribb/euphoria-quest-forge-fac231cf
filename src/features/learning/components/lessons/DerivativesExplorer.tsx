import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { TrendingUp, ArrowRightLeft, Shield, Zap } from "lucide-react";

const derivatives = [
  { name: "Futures Contract", use: "Hedging/Speculation", leverage: "10-20x", settlement: "Physical/Cash" },
  { name: "Forward Contract", use: "Custom Hedging", leverage: "None", settlement: "Physical" },
  { name: "Interest Rate Swap", use: "Rate Management", leverage: "Notional", settlement: "Net Cash" },
  { name: "Credit Default Swap", use: "Credit Protection", leverage: "High", settlement: "Cash" },
];

export const DerivativesExplorer = () => {
  const [selected, setSelected] = useState(0);
  const [futuresPrice, setFuturesPrice] = useState(100);
  const [spotPrice, setSpotPrice] = useState(98);

  const basis = futuresPrice - spotPrice;
  const derivative = derivatives[selected];

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowRightLeft className="h-5 w-5 text-primary" />
          Derivatives Beyond Options
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-2">
          {derivatives.map((d, idx) => (
            <button
              key={d.name}
              onClick={() => setSelected(idx)}
              className={`p-3 rounded-lg text-left transition-all ${
                selected === idx ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
              }`}
            >
              <p className="font-medium text-sm">{d.name}</p>
              <p className="text-xs opacity-80">{d.use}</p>
            </button>
          ))}
        </div>

        <Card className="bg-muted/50">
          <CardContent className="pt-4 space-y-3">
            <h4 className="font-semibold">{derivative.name}</h4>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div>
                <p className="text-muted-foreground">Use Case</p>
                <p className="font-medium">{derivative.use}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Leverage</p>
                <Badge variant="secondary">{derivative.leverage}</Badge>
              </div>
              <div>
                <p className="text-muted-foreground">Settlement</p>
                <p className="font-medium">{derivative.settlement}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h4 className="font-semibold">Futures Basis Calculator</h4>
          <div>
            <label className="text-sm">Spot Price: ${spotPrice}</label>
            <Slider value={[spotPrice]} onValueChange={([v]) => setSpotPrice(v)} min={80} max={120} className="mt-2" />
          </div>
          <div>
            <label className="text-sm">Futures Price: ${futuresPrice}</label>
            <Slider value={[futuresPrice]} onValueChange={([v]) => setFuturesPrice(v)} min={80} max={120} className="mt-2" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Card className={basis > 0 ? "bg-green-500/10" : "bg-red-500/10"}>
              <CardContent className="pt-4 text-center">
                <TrendingUp className="h-5 w-5 mx-auto mb-1" />
                <p className="text-xl font-bold">${basis.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">Basis (F - S)</p>
              </CardContent>
            </Card>
            <Card className="bg-muted/50">
              <CardContent className="pt-4 text-center">
                <Shield className="h-5 w-5 mx-auto mb-1 text-primary" />
                <p className="text-xl font-bold">{basis > 0 ? "Contango" : "Backwardation"}</p>
                <p className="text-xs text-muted-foreground">Market State</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="p-3 bg-primary/10 rounded-lg">
          <p className="text-sm"><strong>💡 Key Insight:</strong> Derivatives allow precise risk transfer. Contango (futures &gt; spot) is normal due to storage costs, while backwardation often signals supply concerns.</p>
        </div>
      </CardContent>
    </Card>
  );
};

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Building2, Cpu, Heart, Fuel, ShoppingCart, Landmark } from "lucide-react";

const sectors = [
  { name: "Technology", icon: Cpu, performance: 12.5, pe: 28, risk: "High", color: "text-blue-500" },
  { name: "Healthcare", icon: Heart, performance: 8.2, pe: 22, risk: "Medium", color: "text-green-500" },
  { name: "Energy", icon: Fuel, performance: -3.4, pe: 12, risk: "High", color: "text-orange-500" },
  { name: "Consumer", icon: ShoppingCart, performance: 5.8, pe: 19, risk: "Medium", color: "text-purple-500" },
  { name: "Financials", icon: Landmark, performance: 7.1, pe: 14, risk: "Medium", color: "text-yellow-500" },
  { name: "Real Estate", icon: Building2, performance: 2.3, pe: 35, risk: "Low", color: "text-teal-500" },
];

export const SectorAnalyzer = () => {
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const selected = sectors.find(s => s.name === selectedSector);

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-primary" />
          Sector Rotation Analyzer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">Click on sectors to analyze their characteristics and rotation signals.</p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {sectors.map((sector) => {
            const Icon = sector.icon;
            return (
              <div
                key={sector.name}
                onClick={() => setSelectedSector(sector.name)}
                className={`p-4 rounded-lg border cursor-pointer transition-all hover:scale-105 ${
                  selectedSector === sector.name ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon className={`h-5 w-5 ${sector.color}`} />
                  <span className="font-medium text-sm">{sector.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  {sector.performance >= 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  )}
                  <span className={sector.performance >= 0 ? "text-green-500" : "text-red-500"}>
                    {sector.performance > 0 ? "+" : ""}{sector.performance}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {selected && (
          <Card className="bg-muted/50 animate-fade-in">
            <CardContent className="pt-4 space-y-3">
              <h4 className="font-semibold">{selected.name} Sector Analysis</h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">P/E Ratio</p>
                  <p className="font-bold text-lg">{selected.pe}x</p>
                </div>
                <div>
                  <p className="text-muted-foreground">YTD Return</p>
                  <p className={`font-bold text-lg ${selected.performance >= 0 ? "text-green-500" : "text-red-500"}`}>
                    {selected.performance > 0 ? "+" : ""}{selected.performance}%
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Risk Level</p>
                  <Badge variant={selected.risk === "High" ? "destructive" : selected.risk === "Medium" ? "default" : "secondary"}>
                    {selected.risk}
                  </Badge>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Sector Momentum</p>
                <Progress value={50 + selected.performance * 3} className="h-2" />
              </div>
            </CardContent>
          </Card>
        )}

        <div className="p-3 bg-primary/10 rounded-lg">
          <p className="text-sm"><strong>💡 Key Insight:</strong> Sector rotation strategies involve shifting investments between sectors based on economic cycles. Technology often leads in expansion, while utilities and healthcare are defensive during contractions.</p>
        </div>
      </CardContent>
    </Card>
  );
};

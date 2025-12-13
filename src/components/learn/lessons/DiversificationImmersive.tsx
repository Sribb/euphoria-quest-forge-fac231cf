import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Layers, Zap, Trophy, AlertTriangle, 
  Building, Cpu, Droplet, ShoppingCart,
  Plane, Heart, Factory, Coins, Wheat, Globe
} from "lucide-react";

type Phase = "hook" | "building" | "simulation" | "results";

interface Asset {
  id: string;
  name: string;
  icon: typeof Building;
  sector: string;
  color: string;
  volatility: number;
}

const allAssets: Asset[] = [
  { id: "tech1", name: "TechGiant Inc", icon: Cpu, sector: "Technology", color: "text-blue-500", volatility: 25 },
  { id: "tech2", name: "CloudSoft Corp", icon: Cpu, sector: "Technology", color: "text-blue-400", volatility: 30 },
  { id: "oil1", name: "PetroMax Energy", icon: Droplet, sector: "Energy", color: "text-yellow-600", volatility: 35 },
  { id: "retail1", name: "MegaMart Retail", icon: ShoppingCart, sector: "Retail", color: "text-green-500", volatility: 20 },
  { id: "airline1", name: "SkyHigh Airlines", icon: Plane, sector: "Travel", color: "text-purple-500", volatility: 40 },
  { id: "health1", name: "PharmaCure Labs", icon: Heart, sector: "Healthcare", color: "text-red-500", volatility: 15 },
  { id: "mfg1", name: "SteelWorks Heavy", icon: Factory, sector: "Manufacturing", color: "text-gray-500", volatility: 25 },
  { id: "bank1", name: "National Bank Co", icon: Coins, sector: "Finance", color: "text-emerald-500", volatility: 20 },
  { id: "food1", name: "GrainCorp Foods", icon: Wheat, sector: "Consumer Staples", color: "text-amber-500", volatility: 10 },
  { id: "intl1", name: "GlobalTrade ETF", icon: Globe, sector: "International", color: "text-cyan-500", volatility: 22 }
];

export const DiversificationImmersive = () => {
  const [phase, setPhase] = useState<Phase>("hook");
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [portfolioValues, setPortfolioValues] = useState<Record<string, number>>({});
  const [bankruptAsset, setBankruptAsset] = useState<string | null>(null);
  const [currentEvent, setCurrentEvent] = useState<number>(0);
  const [totalValue, setTotalValue] = useState(100000);
  const [isSimulating, setIsSimulating] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  const [events, setEvents] = useState<string[]>([]);

  const toggleAsset = (assetId: string) => {
    if (selectedAssets.includes(assetId)) {
      setSelectedAssets(prev => prev.filter(id => id !== assetId));
    } else if (selectedAssets.length < 5) {
      setSelectedAssets(prev => [...prev, assetId]);
    }
  };

  const startSimulation = () => {
    // Initialize portfolio values (equal weight)
    const valuePerAsset = 100000 / selectedAssets.length;
    const values: Record<string, number> = {};
    selectedAssets.forEach(id => {
      values[id] = valuePerAsset;
    });
    setPortfolioValues(values);
    
    // Select random asset to go bankrupt
    const randomIndex = Math.floor(Math.random() * selectedAssets.length);
    setBankruptAsset(selectedAssets[randomIndex]);
    
    setPhase("simulation");
    setIsSimulating(true);
  };

  useEffect(() => {
    if (!isSimulating || currentEvent >= 5) {
      if (currentEvent >= 5) {
        calculateResults();
      }
      return;
    }

    const timer = setTimeout(() => {
      const newValues = { ...portfolioValues };
      let eventDescription = "";

      switch (currentEvent) {
        case 0:
          // Normal market movement
          eventDescription = "📊 Normal market conditions";
          Object.keys(newValues).forEach(id => {
            const asset = allAssets.find(a => a.id === id);
            const change = (Math.random() - 0.3) * (asset?.volatility || 20) / 2;
            newValues[id] = newValues[id] * (1 + change / 100);
          });
          break;
        case 1:
          // Sector-specific event
          eventDescription = "⚡ Tech sector rallies on AI news";
          Object.keys(newValues).forEach(id => {
            const asset = allAssets.find(a => a.id === id);
            const change = asset?.sector === "Technology" ? 15 : (Math.random() - 0.5) * 10;
            newValues[id] = newValues[id] * (1 + change / 100);
          });
          break;
        case 2:
          // Market correction
          eventDescription = "📉 Market correction across all sectors";
          Object.keys(newValues).forEach(id => {
            const change = -(Math.random() * 15 + 5);
            newValues[id] = newValues[id] * (1 + change / 100);
          });
          break;
        case 3:
          // BANKRUPTCY EVENT
          eventDescription = `💥 SCANDAL: ${allAssets.find(a => a.id === bankruptAsset)?.name} files for bankruptcy!`;
          if (bankruptAsset) {
            newValues[bankruptAsset] = 0;
          }
          break;
        case 4:
          // Recovery
          eventDescription = "📈 Market recovery, defensive sectors outperform";
          Object.keys(newValues).forEach(id => {
            if (id !== bankruptAsset) {
              const asset = allAssets.find(a => a.id === id);
              const isDefensive = ["Healthcare", "Consumer Staples", "Finance"].includes(asset?.sector || "");
              const change = isDefensive ? 12 : 5;
              newValues[id] = newValues[id] * (1 + change / 100);
            }
          });
          break;
      }

      setEvents(prev => [...prev, eventDescription]);
      setPortfolioValues(newValues);
      setTotalValue(Object.values(newValues).reduce((a, b) => a + b, 0));
      setCurrentEvent(prev => prev + 1);
    }, 1500);

    return () => clearTimeout(timer);
  }, [isSimulating, currentEvent, portfolioValues, bankruptAsset]);

  const calculateResults = () => {
    setIsSimulating(false);
    
    let xp = 100; // Base XP
    
    // Calculate portfolio saved
    const percentageSaved = (totalValue / 100000) * 100;
    
    // Bonus for surviving bankruptcy
    if (percentageSaved > 50) {
      xp += 100;
    }
    if (percentageSaved > 75) {
      xp += 100;
    }
    if (percentageSaved > 90) {
      xp += 100;
    }
    
    // Count unique sectors
    const sectors = new Set(selectedAssets.map(id => allAssets.find(a => a.id === id)?.sector));
    if (sectors.size >= 4) {
      xp += 150; // Diversification bonus
    } else if (sectors.size >= 3) {
      xp += 75;
    }
    
    // Penalty for concentrated portfolio (same sector)
    const sectorCounts: Record<string, number> = {};
    selectedAssets.forEach(id => {
      const sector = allAssets.find(a => a.id === id)?.sector || "";
      sectorCounts[sector] = (sectorCounts[sector] || 0) + 1;
    });
    if (Object.values(sectorCounts).some(count => count >= 3)) {
      xp -= 100; // Concentration penalty
    }

    setXpEarned(Math.max(0, xp));
    setPhase("results");
  };

  const renderHook = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center p-6 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-2xl border border-red-500/30">
        <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4 animate-pulse" />
        <h2 className="text-2xl font-bold text-foreground mb-2">THE UNLUCKY DRAW</h2>
        <p className="text-muted-foreground text-lg mb-4">
          One of your investments will go to ZERO.
        </p>
        <p className="text-sm text-muted-foreground">
          Can you build a portfolio that survives the bankruptcy?
        </p>
      </div>

      <Button onClick={() => setPhase("building")} className="w-full" size="lg">
        <Layers className="h-5 w-5 mr-2" />
        Build Your Portfolio
      </Button>
    </div>
  );

  const renderBuilding = () => {
    const sectors = new Set(selectedAssets.map(id => allAssets.find(a => a.id === id)?.sector));
    
    return (
      <div className="space-y-6 animate-fade-in">
        <Card className="border-primary/30">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Layers className="h-5 w-5" />
                Portfolio Builder
              </span>
              <Badge variant={selectedAssets.length === 5 ? "default" : "secondary"}>
                {selectedAssets.length}/5 Selected
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              {allAssets.map((asset) => {
                const isSelected = selectedAssets.includes(asset.id);
                const Icon = asset.icon;
                return (
                  <Button
                    key={asset.id}
                    variant="outline"
                    className={`h-auto p-3 flex items-center gap-2 justify-start transition-all ${
                      isSelected ? "border-primary bg-primary/10 ring-2 ring-primary" : ""
                    }`}
                    onClick={() => toggleAsset(asset.id)}
                    disabled={!isSelected && selectedAssets.length >= 5}
                  >
                    <Icon className={`h-5 w-5 ${asset.color}`} />
                    <div className="text-left">
                      <p className="text-xs font-semibold truncate">{asset.name}</p>
                      <p className="text-[10px] text-muted-foreground">{asset.sector}</p>
                    </div>
                  </Button>
                );
              })}
            </div>

            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Sector Diversity:</span>
                <Badge variant={sectors.size >= 4 ? "default" : sectors.size >= 2 ? "secondary" : "destructive"}>
                  {sectors.size} Sectors
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {sectors.size >= 4 ? "Excellent diversification!" : 
                 sectors.size >= 2 ? "Good, but could be more diverse" :
                 "Warning: High concentration risk!"}
              </p>
            </div>

            <Button 
              onClick={startSimulation}
              disabled={selectedAssets.length !== 5}
              className="w-full"
            >
              <Zap className="h-4 w-4 mr-2" />
              Run Simulation
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderSimulation = () => (
    <div className="space-y-6 animate-fade-in">
      <Card className="border-primary/30">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Market Simulation</span>
            <Badge>Event {currentEvent + 1}/5</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current event */}
          {events.length > 0 && (
            <div className={`p-4 rounded-lg ${
              events[events.length - 1].includes("SCANDAL") 
                ? "bg-red-500/20 border-2 border-red-500 animate-pulse" 
                : "bg-muted/50"
            }`}>
              <p className="font-medium">{events[events.length - 1]}</p>
            </div>
          )}

          {/* Portfolio breakdown */}
          <div className="space-y-2">
            {selectedAssets.map((id) => {
              const asset = allAssets.find(a => a.id === id);
              const value = portfolioValues[id] || 0;
              const isBankrupt = id === bankruptAsset && value === 0;
              const Icon = asset?.icon || Building;
              
              return (
                <div 
                  key={id}
                  className={`flex items-center justify-between p-2 rounded-lg ${
                    isBankrupt ? "bg-red-500/20 line-through opacity-50" : "bg-muted/30"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className={`h-4 w-4 ${asset?.color}`} />
                    <span className="text-sm">{asset?.name}</span>
                  </div>
                  <span className={`font-mono text-sm ${isBankrupt ? 'text-red-500' : 'text-foreground'}`}>
                    ${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Total value */}
          <div className="p-4 bg-primary/10 rounded-lg text-center">
            <p className="text-sm text-muted-foreground">Total Portfolio Value</p>
            <p className={`text-3xl font-bold ${totalValue >= 100000 ? 'text-green-500' : 'text-red-500'}`}>
              ${totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
            <p className={`text-sm ${totalValue >= 100000 ? 'text-green-500' : 'text-red-500'}`}>
              {((totalValue / 100000 - 1) * 100).toFixed(1)}%
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderResults = () => {
    const percentageSaved = (totalValue / 100000) * 100;
    const bankruptAssetData = allAssets.find(a => a.id === bankruptAsset);
    const sectors = new Set(selectedAssets.map(id => allAssets.find(a => a.id === id)?.sector));

    return (
      <div className="space-y-6 animate-fade-in">
        <div className="text-center p-6 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-2xl">
          <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-2">SIMULATION COMPLETE</h2>
          <div className="text-5xl font-bold text-primary">+{xpEarned} XP</div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Card className="border-green-500/30">
            <CardContent className="pt-4 text-center">
              <p className="text-sm text-muted-foreground">Portfolio Saved</p>
              <p className={`text-2xl font-bold ${percentageSaved >= 75 ? 'text-green-500' : 'text-orange-500'}`}>
                {percentageSaved.toFixed(1)}%
              </p>
            </CardContent>
          </Card>
          <Card className="border-red-500/30">
            <CardContent className="pt-4 text-center">
              <p className="text-sm text-muted-foreground">Bankrupt Asset</p>
              <p className="text-lg font-bold text-red-500">
                {bankruptAssetData?.name}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="pt-4 space-y-3">
            <h4 className="font-semibold">XP Breakdown:</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Completion Bonus</span>
                <span className="text-green-500">+100 XP</span>
              </div>
              {percentageSaved > 50 && (
                <div className="flex justify-between">
                  <span>Survived Bankruptcy (50%+)</span>
                  <span className="text-green-500">+100 XP</span>
                </div>
              )}
              {percentageSaved > 75 && (
                <div className="flex justify-between">
                  <span>Strong Survival (75%+)</span>
                  <span className="text-green-500">+100 XP</span>
                </div>
              )}
              {percentageSaved > 90 && (
                <div className="flex justify-between">
                  <span>Excellent Resilience (90%+)</span>
                  <span className="text-green-500">+100 XP</span>
                </div>
              )}
              {sectors.size >= 4 && (
                <div className="flex justify-between">
                  <span>Maximum Diversification (4+ sectors)</span>
                  <span className="text-green-500">+150 XP</span>
                </div>
              )}
              {sectors.size === 3 && (
                <div className="flex justify-between">
                  <span>Good Diversification (3 sectors)</span>
                  <span className="text-green-500">+75 XP</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="p-4 bg-primary/10 rounded-lg">
          <p className="text-sm">
            <strong>💡 Key Insight:</strong> Diversification across sectors protected your portfolio from 
            company-specific risk. When {bankruptAssetData?.name} went bankrupt, your other holdings 
            preserved {percentageSaved.toFixed(0)}% of your wealth. This is unsystematic risk elimination in action!
          </p>
        </div>

        <Button onClick={() => {
          setPhase("hook");
          setSelectedAssets([]);
          setPortfolioValues({});
          setBankruptAsset(null);
          setCurrentEvent(0);
          setTotalValue(100000);
          setEvents([]);
        }} className="w-full">
          <Zap className="h-4 w-4 mr-2" />
          Try Different Portfolio
        </Button>
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      {phase === "hook" && renderHook()}
      {phase === "building" && renderBuilding()}
      {phase === "simulation" && renderSimulation()}
      {phase === "results" && renderResults()}
    </div>
  );
};

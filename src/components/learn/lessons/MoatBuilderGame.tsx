import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Shield, 
  Plus, 
  Minus,
  TrendingUp,
  TrendingDown,
  Building2,
  Sparkles,
  Crown
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface MoatAdvantage {
  id: string;
  name: string;
  description: string;
  icon: string;
  profitImpact: number;
  durabilityImpact: number;
  costToAdd: number;
}

const moatAdvantages: MoatAdvantage[] = [
  {
    id: "brand",
    name: "Brand Power",
    description: "Strong brand recognition and customer loyalty",
    icon: "👑",
    profitImpact: 15,
    durabilityImpact: 20,
    costToAdd: 30
  },
  {
    id: "network",
    name: "Network Effects",
    description: "Value increases with more users",
    icon: "🌐",
    profitImpact: 25,
    durabilityImpact: 30,
    costToAdd: 40
  },
  {
    id: "switching",
    name: "Switching Costs",
    description: "High cost for customers to switch to competitors",
    icon: "🔒",
    profitImpact: 18,
    durabilityImpact: 25,
    costToAdd: 25
  },
  {
    id: "cost",
    name: "Cost Advantages",
    description: "Lower costs than competitors through scale or efficiency",
    icon: "📉",
    profitImpact: 20,
    durabilityImpact: 15,
    costToAdd: 35
  },
  {
    id: "patent",
    name: "Patents & IP",
    description: "Legal protection for products or processes",
    icon: "📜",
    profitImpact: 22,
    durabilityImpact: 18,
    costToAdd: 28
  },
  {
    id: "regulation",
    name: "Regulatory Barrier",
    description: "Government licenses or regulations limit competition",
    icon: "🏛️",
    profitImpact: 20,
    durabilityImpact: 35,
    costToAdd: 45
  },
];

interface Company {
  name: string;
  industry: string;
  baseProfit: number;
  moats: string[];
}

const startingCompanies: Company[] = [
  { name: "TechStartup Inc", industry: "Software", baseProfit: 100, moats: [] },
  { name: "RetailCo", industry: "Retail", baseProfit: 80, moats: [] },
  { name: "FinanceApp", industry: "Fintech", baseProfit: 120, moats: [] },
];

export const MoatBuilderGame = () => {
  const [selectedCompany, setSelectedCompany] = useState(0);
  const [companies, setCompanies] = useState<Company[]>(startingCompanies);
  const [budget, setBudget] = useState(100);
  const [year, setYear] = useState(1);
  const [simulationComplete, setSimulationComplete] = useState(false);
  const [history, setHistory] = useState<{ year: number; profit: number; durability: number }[]>([]);

  const company = companies[selectedCompany];

  const calculateMetrics = (moatIds: string[]) => {
    let totalProfit = company.baseProfit;
    let totalDurability = 10; // Base durability

    moatIds.forEach(moatId => {
      const moat = moatAdvantages.find(m => m.id === moatId);
      if (moat) {
        totalProfit += (company.baseProfit * moat.profitImpact) / 100;
        totalDurability += moat.durabilityImpact;
      }
    });

    // Synergy bonus for multiple moats
    if (moatIds.length >= 2) {
      totalProfit *= 1.1;
      totalDurability *= 1.15;
    }
    if (moatIds.length >= 4) {
      totalProfit *= 1.15;
      totalDurability *= 1.2;
    }

    return { profit: Math.round(totalProfit), durability: Math.min(100, Math.round(totalDurability)) };
  };

  const { profit, durability } = calculateMetrics(company.moats);

  const addMoat = (moatId: string) => {
    const moat = moatAdvantages.find(m => m.id === moatId);
    if (!moat) return;

    if (company.moats.includes(moatId)) {
      toast.error("You already have this advantage!");
      return;
    }

    if (budget < moat.costToAdd) {
      toast.error("Not enough budget!");
      return;
    }

    const updatedCompanies = [...companies];
    updatedCompanies[selectedCompany] = {
      ...company,
      moats: [...company.moats, moatId]
    };
    setCompanies(updatedCompanies);
    setBudget(budget - moat.costToAdd);
    toast.success(`Added ${moat.name} to ${company.name}!`);
  };

  const removeMoat = (moatId: string) => {
    const moat = moatAdvantages.find(m => m.id === moatId);
    if (!moat) return;

    const updatedCompanies = [...companies];
    updatedCompanies[selectedCompany] = {
      ...company,
      moats: company.moats.filter(m => m !== moatId)
    };
    setCompanies(updatedCompanies);
    setBudget(budget + Math.round(moat.costToAdd * 0.5)); // Partial refund
    toast.info(`Removed ${moat.name}`);
  };

  const simulateYear = () => {
    const newYear = year + 1;
    const metrics = calculateMetrics(company.moats);
    
    // Competition erodes profits based on durability
    const erosionFactor = Math.max(0.7, 1 - (100 - metrics.durability) / 200);
    const adjustedProfit = Math.round(metrics.profit * erosionFactor);
    
    setHistory([...history, { 
      year: newYear, 
      profit: adjustedProfit, 
      durability: metrics.durability 
    }]);
    setYear(newYear);
    setBudget(budget + Math.round(adjustedProfit * 0.1)); // Reinvest profits

    if (newYear >= 5) {
      setSimulationComplete(true);
      const avgProfit = history.reduce((sum, h) => sum + h.profit, adjustedProfit) / history.length;
      if (avgProfit > 180) {
        toast.success("🏆 Excellent! You built a durable competitive advantage!");
      } else if (avgProfit > 140) {
        toast.success("Good job! Your moat strategy was effective.");
      } else {
        toast.info("Your moat could be stronger. Try different combinations!");
      }
    }
  };

  const resetGame = () => {
    setCompanies(startingCompanies);
    setBudget(100);
    setYear(1);
    setSimulationComplete(false);
    setHistory([]);
  };

  const getDurabilityColor = (d: number) => {
    if (d >= 70) return "text-success";
    if (d >= 40) return "text-warning";
    return "text-destructive";
  };

  return (
    <Card className="p-6 space-y-6 bg-gradient-to-br from-background to-primary/5">
      <div>
        <h3 className="text-xl font-bold mb-1 flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          Moat Builder: Competitive Advantage Simulator
        </h3>
        <p className="text-sm text-muted-foreground">
          Add competitive advantages and watch how profit durability changes over time
        </p>
      </div>

      {/* Company Selector & Stats */}
      <div className="flex gap-2 flex-wrap">
        {companies.map((c, idx) => (
          <Button
            key={c.name}
            variant={selectedCompany === idx ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCompany(idx)}
          >
            <Building2 className="w-3 h-3 mr-1" />
            {c.name}
          </Button>
        ))}
      </div>

      {/* Main Dashboard */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Metrics Panel */}
        <Card className="p-4 bg-muted/30 space-y-4">
          <div className="flex justify-between items-center">
            <Badge variant="outline">Year {year}</Badge>
            <Badge className="bg-primary/20 text-primary">
              Budget: ${budget}
            </Badge>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  Annual Profit
                </span>
                <span className="font-bold text-lg">${profit}M</span>
              </div>
              <Progress value={(profit / 300) * 100} className="h-3" />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="flex items-center gap-1">
                  <Shield className="w-4 h-4" />
                  Moat Durability
                </span>
                <span className={`font-bold text-lg ${getDurabilityColor(durability)}`}>
                  {durability}%
                </span>
              </div>
              <Progress 
                value={durability} 
                className={`h-3 ${durability >= 70 ? '[&>div]:bg-success' : durability >= 40 ? '[&>div]:bg-warning' : '[&>div]:bg-destructive'}`}
              />
            </div>
          </div>

          {/* Active Moats */}
          <div>
            <p className="text-xs font-semibold mb-2">Active Moats ({company.moats.length}):</p>
            <div className="flex flex-wrap gap-2">
              {company.moats.length === 0 ? (
                <span className="text-xs text-muted-foreground">No moats yet - vulnerable to competition!</span>
              ) : (
                company.moats.map(moatId => {
                  const moat = moatAdvantages.find(m => m.id === moatId);
                  return moat ? (
                    <Badge 
                      key={moatId} 
                      variant="secondary" 
                      className="cursor-pointer hover:bg-destructive/20"
                      onClick={() => removeMoat(moatId)}
                    >
                      {moat.icon} {moat.name}
                      <Minus className="w-3 h-3 ml-1" />
                    </Badge>
                  ) : null;
                })
              )}
            </div>
          </div>

          {/* History */}
          {history.length > 0 && (
            <div className="pt-2 border-t">
              <p className="text-xs font-semibold mb-2">Profit History:</p>
              <div className="flex gap-2">
                {history.map((h, idx) => (
                  <div key={idx} className="text-center">
                    <div className="text-xs text-muted-foreground">Y{h.year}</div>
                    <div className="text-sm font-bold">${h.profit}M</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!simulationComplete ? (
            <Button onClick={simulateYear} className="w-full" size="lg">
              <Sparkles className="w-4 h-4 mr-2" />
              Simulate Year {year + 1}
            </Button>
          ) : (
            <Button onClick={resetGame} variant="outline" className="w-full">
              Start New Game
            </Button>
          )}
        </Card>

        {/* Moat Shop */}
        <Card className="p-4 bg-muted/30">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Crown className="w-4 h-4 text-warning" />
            Competitive Advantages Shop
          </h4>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {moatAdvantages.map(moat => {
              const owned = company.moats.includes(moat.id);
              const canAfford = budget >= moat.costToAdd;

              return (
                <motion.div
                  key={moat.id}
                  whileHover={{ scale: 1.02 }}
                  className={`p-3 rounded-lg border transition-all ${
                    owned 
                      ? 'bg-success/10 border-success/30' 
                      : canAfford 
                        ? 'bg-background hover:border-primary cursor-pointer' 
                        : 'bg-muted/50 opacity-60'
                  }`}
                  onClick={() => !owned && canAfford && addMoat(moat.id)}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-semibold text-sm flex items-center gap-2">
                      <span className="text-lg">{moat.icon}</span>
                      {moat.name}
                    </span>
                    <Badge variant={owned ? "default" : "outline"} className="text-xs">
                      {owned ? "Owned" : `$${moat.costToAdd}`}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{moat.description}</p>
                  <div className="flex gap-4 text-xs">
                    <span className="text-success">+{moat.profitImpact}% profit</span>
                    <span className="text-primary">+{moat.durabilityImpact}% durability</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Educational Footer */}
      <div className="p-3 bg-primary/5 rounded-lg">
        <p className="text-xs text-muted-foreground">
          <strong>💡 Key Insight:</strong> Companies with strong economic moats can sustain profits longer because 
          competitors cannot easily replicate their advantages. Multiple moats create synergies that compound protection.
        </p>
      </div>
    </Card>
  );
};

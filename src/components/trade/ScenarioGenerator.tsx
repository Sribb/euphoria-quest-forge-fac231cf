import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  Activity,
  Zap,
  Globe,
  ShoppingCart,
  Brain,
  Loader2
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export interface PresetScenario {
  id: string;
  title: string;
  description: string;
  type: "rally" | "dip" | "sideways" | "sector_surge" | "geopolitical" | "growth";
  severity: "low" | "medium" | "high";
  affected_symbols: string[];
  volatility: number; // as percentage (e.g., 80 = 80%)
  probability: number; // as percentage (e.g., 60 = 60%)
  difficultyModifier: number;
  priceChanges: { symbol: string; startPrice: number; endPrice: number }[];
}

interface ScenarioGeneratorProps {
  sessionId: string;
  onScenarioSelect: (scenario: PresetScenario) => void;
  selectedScenario: PresetScenario | null;
}

// Preset scenarios as specified
const PRESET_SCENARIOS: PresetScenario[] = [
  {
    id: "tech-earnings-rally",
    title: "Tech Earnings Beat Rally",
    description: "Major tech companies (AAPL, GOOGL, MSFT) report earnings far above expectations, driving a broad market rally with strong bullish momentum across the sector.",
    type: "rally",
    severity: "medium",
    affected_symbols: ["AAPL", "GOOGL", "MSFT"],
    volatility: 80,
    probability: 60,
    difficultyModifier: 2,
    priceChanges: [
      { symbol: "AAPL", startPrice: 178.50, endPrice: 192.30 },
      { symbol: "GOOGL", startPrice: 141.20, endPrice: 155.80 },
      { symbol: "MSFT", startPrice: 378.90, endPrice: 412.50 }
    ]
  },
  {
    id: "interest-rate-scare",
    title: "Interest Rate Hike Scare",
    description: "Unexpectedly hawkish Federal Reserve statements cause a market dip, especially for growth stocks. Investors flee to safety as rate hike fears intensify.",
    type: "dip",
    severity: "high",
    affected_symbols: ["TSLA", "NVDA", "AMZN"],
    volatility: 120,
    probability: 40,
    difficultyModifier: 3,
    priceChanges: [
      { symbol: "TSLA", startPrice: 248.50, endPrice: 198.40 },
      { symbol: "NVDA", startPrice: 875.30, endPrice: 742.80 },
      { symbol: "AMZN", startPrice: 178.90, endPrice: 156.20 }
    ]
  },
  {
    id: "holiday-sideways",
    title: "Holiday Shopping Sideways Trend",
    description: "Mixed retail and tech indicators create consolidation ahead of holiday spending data. Markets trade in a narrow range as investors await clearer signals.",
    type: "sideways",
    severity: "low",
    affected_symbols: ["AMZN", "AAPL", "V"],
    volatility: 50,
    probability: 70,
    difficultyModifier: 1,
    priceChanges: [
      { symbol: "AMZN", startPrice: 178.90, endPrice: 181.20 },
      { symbol: "AAPL", startPrice: 178.50, endPrice: 176.80 },
      { symbol: "V", startPrice: 275.40, endPrice: 278.90 }
    ]
  },
  {
    id: "ai-sector-boom",
    title: "AI Sector Boom",
    description: "Breakthroughs in AI research and major product announcements drive explosive growth in AI-focused companies. NVDA leads the charge with record demand.",
    type: "sector_surge",
    severity: "medium",
    affected_symbols: ["NVDA", "GOOGL", "MSFT"],
    volatility: 90,
    probability: 55,
    difficultyModifier: 2,
    priceChanges: [
      { symbol: "NVDA", startPrice: 875.30, endPrice: 1024.60 },
      { symbol: "GOOGL", startPrice: 141.20, endPrice: 162.40 },
      { symbol: "MSFT", startPrice: 378.90, endPrice: 425.30 }
    ]
  },
  {
    id: "geopolitical-asia",
    title: "Geopolitical Tensions in Asia",
    description: "Manufacturing disruptions and supply chain concerns increase uncertainty. Tech hardware and EV makers face headwinds from regional instability.",
    type: "geopolitical",
    severity: "high",
    affected_symbols: ["AAPL", "TSLA", "NVDA"],
    volatility: 150,
    probability: 30,
    difficultyModifier: 3,
    priceChanges: [
      { symbol: "AAPL", startPrice: 178.50, endPrice: 152.30 },
      { symbol: "TSLA", startPrice: 248.50, endPrice: 195.20 },
      { symbol: "NVDA", startPrice: 875.30, endPrice: 768.40 }
    ]
  },
  {
    id: "ecommerce-payments-growth",
    title: "E-commerce and Digital Payments Growth",
    description: "Strong quarterly results from AMZN and V push related sectors upward. Digital commerce continues its steady expansion with robust consumer spending.",
    type: "growth",
    severity: "medium",
    affected_symbols: ["AMZN", "V"],
    volatility: 70,
    probability: 65,
    difficultyModifier: 2,
    priceChanges: [
      { symbol: "AMZN", startPrice: 178.90, endPrice: 198.40 },
      { symbol: "V", startPrice: 275.40, endPrice: 298.60 }
    ]
  }
];

// Calculate P/L for a scenario
export const calculateProfitLoss = (
  startPrice: number, 
  endPrice: number, 
  quantity: number = 1
): { profitLoss: number; percentChange: number } => {
  const profitLoss = (endPrice - startPrice) * quantity;
  const percentChange = ((endPrice - startPrice) / startPrice) * 100;
  return { profitLoss, percentChange };
};

export const ScenarioGenerator = ({ sessionId, onScenarioSelect, selectedScenario }: ScenarioGeneratorProps) => {
  const [scenarios, setScenarios] = useState<PresetScenario[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateScenarios = async () => {
    setIsGenerating(true);
    
    // Simulate a brief loading state for UX
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Shuffle and return all preset scenarios
    const shuffled = [...PRESET_SCENARIOS].sort(() => Math.random() - 0.5);
    setScenarios(shuffled);
    
    toast({
      title: "Scenarios Generated",
      description: `${shuffled.length} market scenarios ready to simulate`,
    });
    
    setIsGenerating(false);
  };

  const getScenarioIcon = (type: string) => {
    switch (type) {
      case "rally": return <TrendingUp className="w-5 h-5 text-success" />;
      case "dip": return <TrendingDown className="w-5 h-5 text-destructive" />;
      case "sideways": return <Activity className="w-5 h-5 text-muted-foreground" />;
      case "sector_surge": return <Brain className="w-5 h-5 text-primary" />;
      case "geopolitical": return <Globe className="w-5 h-5 text-warning" />;
      case "growth": return <ShoppingCart className="w-5 h-5 text-accent" />;
      default: return <Zap className="w-5 h-5" />;
    }
  };

  const getSeverityClass = (severity: string): string => {
    switch (severity) {
      case "high": return "bg-destructive text-destructive-foreground";
      case "medium": return "bg-warning text-warning-foreground";
      case "low": return "bg-success text-success-foreground";
      default: return "bg-secondary text-secondary-foreground";
    }
  };

  return (
    <div className="space-y-4">
      <Card className="p-6 bg-gradient-to-br from-primary/20 to-accent/10 border-primary/30">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-primary animate-pulse" />
            <div>
              <h2 className="text-xl font-bold">AI Scenario Generator</h2>
              <p className="text-sm text-muted-foreground">
                Test your strategies with realistic market scenarios
              </p>
            </div>
          </div>
          <Button
            onClick={generateScenarios}
            disabled={isGenerating}
            className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Scenarios
              </>
            )}
          </Button>
        </div>
      </Card>

      {scenarios.length === 0 ? (
        <Card className="p-12 text-center border-dashed">
          <Sparkles className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No Scenarios Yet</h3>
          <p className="text-muted-foreground mb-6">
            Click "Generate Scenarios" to load preset market situations
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {scenarios.map((scenario) => {
            const isSelected = selectedScenario?.id === scenario.id;
            
            return (
              <Card
                key={scenario.id}
                className={`p-5 cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] ${
                  isSelected 
                    ? 'border-primary border-2 shadow-glow bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => onScenarioSelect(scenario)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                    {getScenarioIcon(scenario.type)}
                  </div>
                  <div className="flex gap-2">
                    <Badge className={getSeverityClass(scenario.severity)}>
                      {scenario.severity}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {scenario.probability}%
                    </Badge>
                  </div>
                </div>
                
                <h3 className="font-bold mb-2 line-clamp-2">{scenario.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                  {scenario.description}
                </p>
                
                {/* Price Changes Preview */}
                <div className="space-y-2 mb-4">
                  {scenario.priceChanges.map((change) => {
                    const { profitLoss, percentChange } = calculateProfitLoss(
                      change.startPrice, 
                      change.endPrice
                    );
                    const isPositive = profitLoss >= 0;
                    
                    return (
                      <div key={change.symbol} className="flex items-center justify-between text-sm">
                        <span className="font-medium">{change.symbol}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">
                            ${change.startPrice.toFixed(2)} → ${change.endPrice.toFixed(2)}
                          </span>
                          <span className={isPositive ? "text-success font-semibold" : "text-destructive font-semibold"}>
                            {isPositive ? "+" : ""}{percentChange.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border pt-3">
                  <div className="flex items-center gap-1">
                    <Activity className="w-3 h-3" />
                    <span>Volatility: {scenario.volatility}%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    <span>Difficulty: +{scenario.difficultyModifier}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1 mt-3">
                  {scenario.affected_symbols.map((symbol) => (
                    <Badge key={symbol} variant="secondary" className="text-xs">
                      {symbol}
                    </Badge>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

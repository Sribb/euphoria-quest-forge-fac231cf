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
  DollarSign,
  Loader2
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface Scenario {
  id: string;
  title: string;
  description: string;
  type: string;
  severity: string;
  affected_symbols: string[];
  volatility: number;
  probability: number;
}

interface ScenarioGeneratorProps {
  sessionId: string;
  onScenarioSelect: (scenario: Scenario) => void;
  selectedScenario: Scenario | null;
}

export const ScenarioGenerator = ({ sessionId, onScenarioSelect, selectedScenario }: ScenarioGeneratorProps) => {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateScenarios = async () => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-market-scenarios', {
        body: { sessionId, count: 6 }
      });

      if (error) throw error;

      setScenarios(data.scenarios);
      toast({
        title: "Scenarios Generated",
        description: `${data.scenarios.length} market scenarios ready to simulate`,
      });
    } catch (error) {
      console.error('Error generating scenarios:', error);
      toast({
        title: "Error",
        description: "Failed to generate scenarios",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const getScenarioIcon = (type: string) => {
    switch (type) {
      case "rally": return <TrendingUp className="w-5 h-5 text-success" />;
      case "dip": return <TrendingDown className="w-5 h-5 text-destructive" />;
      case "sideways": return <Activity className="w-5 h-5 text-muted-foreground" />;
      case "sector_surge": return <Zap className="w-5 h-5 text-warning" />;
      case "geopolitical": return <Globe className="w-5 h-5 text-accent" />;
      default: return <DollarSign className="w-5 h-5" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "destructive";
      case "medium": return "warning";
      case "low": return "success";
      default: return "secondary";
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
                Create realistic market situations and test your trading strategies
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
            Click "Generate Scenarios" to create AI-powered market situations
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {scenarios.map((scenario) => (
            <Card
              key={scenario.id}
              className={`p-5 cursor-pointer transition-all hover:shadow-lg hover:scale-105 ${
                selectedScenario?.id === scenario.id 
                  ? 'border-primary border-2 shadow-glow bg-primary/5' 
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => onScenarioSelect(scenario)}
            >
              <div className="flex items-start justify-between mb-3">
                {getScenarioIcon(scenario.type)}
                <div className="flex gap-2">
                  <Badge variant={getSeverityColor(scenario.severity) as any}>
                    {scenario.severity}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {(scenario.probability * 100).toFixed(0)}%
                  </Badge>
                </div>
              </div>
              
              <h3 className="font-bold mb-2 line-clamp-2">{scenario.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                {scenario.description}
              </p>
              
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Activity className="w-3 h-3" />
                <span>Volatility: {(scenario.volatility * 100).toFixed(0)}%</span>
              </div>
              
              {scenario.affected_symbols && scenario.affected_symbols.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {scenario.affected_symbols.slice(0, 3).map((symbol) => (
                    <Badge key={symbol} variant="secondary" className="text-xs">
                      {symbol}
                    </Badge>
                  ))}
                  {scenario.affected_symbols.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{scenario.affected_symbols.length - 3}
                    </Badge>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

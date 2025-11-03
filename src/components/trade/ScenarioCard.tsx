import { TrendingUp, TrendingDown, Activity, AlertTriangle, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface ScenarioCardProps {
  scenario: any;
  onSelect: () => void;
}

export const ScenarioCard = ({ scenario, onSelect }: ScenarioCardProps) => {
  const getTypeIcon = () => {
    switch (scenario.type) {
      case 'rally':
        return <TrendingUp className="w-5 h-5 text-success" />;
      case 'dip':
        return <TrendingDown className="w-5 h-5 text-destructive" />;
      case 'sideways':
        return <Activity className="w-5 h-5 text-muted-foreground" />;
      case 'sector_surge':
        return <Zap className="w-5 h-5 text-warning" />;
      case 'geopolitical':
        return <AlertTriangle className="w-5 h-5 text-destructive" />;
      default:
        return <Activity className="w-5 h-5" />;
    }
  };

  const getSeverityColor = () => {
    switch (scenario.severity) {
      case 'high':
        return 'bg-destructive/20 text-destructive';
      case 'medium':
        return 'bg-warning/20 text-warning';
      case 'low':
        return 'bg-success/20 text-success';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card className="p-6 hover:border-primary/50 transition-all cursor-pointer group animate-fade-in">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            {getTypeIcon()}
          </div>
          <div>
            <h4 className="font-bold">{scenario.title}</h4>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-xs">
                {scenario.type.replace('_', ' ')}
              </Badge>
              <Badge className={getSeverityColor()}>
                {scenario.severity}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-4">{scenario.description}</p>

      <div className="space-y-3 mb-4">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-muted-foreground">Probability</span>
            <span className="font-medium">{(scenario.probability * 100).toFixed(0)}%</span>
          </div>
          <Progress value={scenario.probability * 100} className="h-2" />
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-muted-foreground">Market Volatility</span>
            <span className="font-medium">{(scenario.volatility * 100).toFixed(0)}%</span>
          </div>
          <Progress value={scenario.volatility * 100} className="h-2" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        {scenario.affected_symbols?.slice(0, 4).map((symbol: string, i: number) => (
          <div key={i} className="px-2 py-1 rounded bg-muted/50 text-xs text-center">
            {symbol}
          </div>
        ))}
      </div>

      <Button
        onClick={onSelect}
        className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all"
      >
        Test This Scenario
      </Button>
    </Card>
  );
};
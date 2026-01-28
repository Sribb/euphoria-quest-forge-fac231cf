import { useState } from 'react';
import { GitBranch, TrendingUp, TrendingDown, Users, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AIScenarioViewerProps {
  sessionId: string;
  proposedAction?: any;
}

export const AIScenarioViewer = ({ sessionId, proposedAction }: AIScenarioViewerProps) => {
  const [scenarios, setScenarios] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateScenarios = async () => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-scenario-generation', {
        body: {
          sessionId,
          proposedAction: proposedAction || { type: 'hold', description: 'Current position' },
          timeHorizon: 60,
        },
      });

      if (error) throw error;
      setScenarios(data.scenarios || []);
      
      toast({
        title: 'Scenarios Generated',
        description: `Generated ${data.scenarios.length} possible market outcomes`,
      });
    } catch (error: any) {
      toast({
        title: 'Generation Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const getProbabilityColor = (probability: number) => {
    if (probability > 0.6) return 'bg-success/20 text-success';
    if (probability > 0.3) return 'bg-warning/20 text-warning';
    return 'bg-muted text-muted-foreground';
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <GitBranch className="w-5 h-5 text-primary" />
          <div>
            <h3 className="font-bold">Alternative Scenarios</h3>
            <p className="text-sm text-muted-foreground">
              AI-generated parallel market outcomes
            </p>
          </div>
        </div>
        <Button
          onClick={generateScenarios}
          disabled={isGenerating}
          size="sm"
        >
          {isGenerating ? 'Generating...' : 'Generate Scenarios'}
        </Button>
      </div>

      {scenarios.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <GitBranch className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No scenarios generated yet</p>
          <p className="text-sm mt-1">Click generate to see possible market outcomes</p>
        </div>
      ) : (
        <div className="space-y-4">
          {scenarios.map((scenario, idx) => (
            <Card
              key={idx}
              className="p-4 hover:border-primary/50 transition-all animate-fade-in"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold">{scenario.title}</h4>
                    <Badge className={getProbabilityColor(scenario.probability)}>
                      {(scenario.probability * 100).toFixed(0)}% likely
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{scenario.description}</p>
                </div>
              </div>

              {/* Market Changes */}
              <div className="mb-3">
                <h5 className="text-sm font-medium mb-2 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  Price Changes
                </h5>
                <div className="grid grid-cols-2 gap-2">
                  {scenario.market_changes?.slice(0, 4).map((change: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded bg-muted/50">
                      <span className="text-xs font-medium">{change.symbol}</span>
                      <span
                        className={`text-xs font-bold ${
                          change.price_change_percent > 0 ? 'text-success' : 'text-destructive'
                        }`}
                      >
                        {change.price_change_percent > 0 ? '+' : ''}
                        {change.price_change_percent.toFixed(2)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Competitor Actions */}
              {scenario.competitor_actions && scenario.competitor_actions.length > 0 && (
                <div className="mb-3">
                  <h5 className="text-sm font-medium mb-2 flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    Competitor Reactions
                  </h5>
                  <div className="space-y-1">
                    {scenario.competitor_actions.slice(0, 2).map((action: string, i: number) => (
                      <div key={i} className="text-xs text-muted-foreground flex items-start gap-1">
                        <ArrowRight className="w-3 h-3 mt-0.5 flex-shrink-0" />
                        <span>{action}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* User Outcome */}
              <div className="p-3 rounded-lg bg-card/50 border border-border">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Your Outcome</span>
                  <span
                    className={`text-sm font-bold ${
                      scenario.user_outcome.profit_loss > 0 ? 'text-success' : 'text-destructive'
                    }`}
                  >
                    {scenario.user_outcome.profit_loss > 0 ? '+' : ''}$
                    {scenario.user_outcome.profit_loss.toFixed(2)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {scenario.user_outcome.description}
                </p>
              </div>

              {/* Alternative Actions */}
              {scenario.alternative_actions && scenario.alternative_actions.length > 0 && (
                <div className="mt-3 pt-3 border-t border-border">
                  <h5 className="text-xs font-medium mb-2">Alternative Actions:</h5>
                  <div className="space-y-2">
                    {scenario.alternative_actions.map((alt: any, i: number) => (
                      <div key={i} className="text-xs p-2 rounded bg-muted/30">
                        <div className="font-medium mb-1">{alt.action}</div>
                        <div className="text-muted-foreground">{alt.expected_result}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </Card>
  );
};
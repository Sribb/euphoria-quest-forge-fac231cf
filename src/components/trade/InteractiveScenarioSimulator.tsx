import { useState, useEffect } from 'react';
import { Brain, TrendingUp, TrendingDown, Activity, Zap, Target, Shield, DollarSign } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ScenarioCard } from './ScenarioCard';
import { ActionPanel } from './ActionPanel';
import { OutcomeVisualizer } from './OutcomeVisualizer';
import { DecisionFeedback } from './DecisionFeedback';

interface InteractiveScenarioSimulatorProps {
  sessionId: string;
  userId: string;
}

export const InteractiveScenarioSimulator = ({ sessionId, userId }: InteractiveScenarioSimulatorProps) => {
  const [scenarios, setScenarios] = useState<any[]>([]);
  const [selectedScenario, setSelectedScenario] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [executedAction, setExecutedAction] = useState<any>(null);
  const [outcome, setOutcome] = useState<any>(null);
  const [feedback, setFeedback] = useState<any>(null);
  const { toast } = useToast();

  const generateScenarios = async () => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-market-scenarios', {
        body: { sessionId, count: 5 },
      });

      if (error) throw error;
      setScenarios(data.scenarios || []);
      
      toast({
        title: 'Scenarios Generated',
        description: `${data.scenarios.length} realistic market scenarios ready`,
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

  const executeAction = async (action: any) => {
    if (!selectedScenario) return;

    try {
      const { data, error } = await supabase.functions.invoke('execute-scenario-action', {
        body: {
          sessionId,
          userId,
          scenarioId: selectedScenario.id,
          action,
        },
      });

      if (error) throw error;

      setExecutedAction(action);
      setOutcome(data.outcome);
      setFeedback(data.feedback);

      toast({
        title: 'Action Executed',
        description: data.outcome.result_summary,
      });
    } catch (error: any) {
      toast({
        title: 'Execution Failed',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const resetSimulation = () => {
    setSelectedScenario(null);
    setExecutedAction(null);
    setOutcome(null);
    setFeedback(null);
  };

  useEffect(() => {
    generateScenarios();
  }, [sessionId]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 bg-gradient-hero border-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <Brain className="w-6 h-6 text-primary animate-pulse" />
            </div>
            <div>
              <h3 className="text-xl font-bold">AI Trading Simulator</h3>
              <p className="text-sm text-muted-foreground">
                Test decisions against realistic market scenarios
              </p>
            </div>
          </div>
          <Button
            onClick={generateScenarios}
            disabled={isGenerating}
            variant="secondary"
          >
            {isGenerating ? 'Generating...' : 'New Scenarios'}
          </Button>
        </div>
      </Card>

      {!selectedScenario ? (
        /* Scenario Selection */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {scenarios.map((scenario, idx) => (
            <ScenarioCard
              key={idx}
              scenario={scenario}
              onSelect={() => setSelectedScenario(scenario)}
            />
          ))}
        </div>
      ) : (
        /* Interactive Trading Interface */
        <Tabs defaultValue="action" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="action">Take Action</TabsTrigger>
            <TabsTrigger value="outcome" disabled={!outcome}>
              Outcome
            </TabsTrigger>
            <TabsTrigger value="feedback" disabled={!feedback}>
              Feedback
            </TabsTrigger>
          </TabsList>

          <TabsContent value="action" className="space-y-4 mt-6">
            <Card className="p-6 border-primary/30">
              <h4 className="font-bold mb-2">{selectedScenario.title}</h4>
              <p className="text-sm text-muted-foreground mb-4">
                {selectedScenario.description}
              </p>
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="p-3 rounded-lg bg-muted/50">
                  <div className="text-xs text-muted-foreground mb-1">Type</div>
                  <Badge variant="outline">{selectedScenario.type}</Badge>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <div className="text-xs text-muted-foreground mb-1">Severity</div>
                  <Badge className={
                    selectedScenario.severity === 'high' ? 'bg-destructive/20 text-destructive' :
                    selectedScenario.severity === 'medium' ? 'bg-warning/20 text-warning' :
                    'bg-success/20 text-success'
                  }>
                    {selectedScenario.severity}
                  </Badge>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <div className="text-xs text-muted-foreground mb-1">Volatility</div>
                  <Progress value={selectedScenario.volatility * 100} className="h-2 mt-1" />
                </div>
              </div>
            </Card>

            <ActionPanel
              scenario={selectedScenario}
              onExecute={executeAction}
              disabled={!!executedAction}
            />

            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={resetSimulation}>
                Back to Scenarios
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="outcome" className="space-y-4 mt-6">
            {outcome && (
              <OutcomeVisualizer
                outcome={outcome}
                scenario={selectedScenario}
                action={executedAction}
              />
            )}
          </TabsContent>

          <TabsContent value="feedback" className="space-y-4 mt-6">
            {feedback && (
              <DecisionFeedback
                feedback={feedback}
                outcome={outcome}
                onReset={resetSimulation}
              />
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};
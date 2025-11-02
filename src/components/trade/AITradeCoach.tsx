import { useState } from 'react';
import { Sparkles, TrendingUp, AlertCircle, Lightbulb, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AITradeCoachProps {
  sessionId: string;
  symbol: string;
  quantity: number;
  side: string;
  proposedPrice: number;
}

export const AITradeCoach = ({
  sessionId,
  symbol,
  quantity,
  side,
  proposedPrice,
}: AITradeCoachProps) => {
  const [analysis, setAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const analyzeTrade = async () => {
    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-trade-analysis', {
        body: {
          sessionId,
          symbol,
          quantity,
          side,
          proposedPrice,
        },
      });

      if (error) throw error;
      setAnalysis(data.analysis);
    } catch (error: any) {
      toast({
        title: 'Analysis Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'bg-success/20 text-success';
      case 'medium':
        return 'bg-warning/20 text-warning';
      case 'high':
      case 'very_high':
        return 'bg-destructive/20 text-destructive';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card className="p-6 border-primary/20 bg-gradient-accent">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-primary animate-pulse" />
        </div>
        <div>
          <h3 className="font-bold">AI Trade Coach</h3>
          <p className="text-sm text-muted-foreground">
            Get predictive insights before you trade
          </p>
        </div>
      </div>

      {!analysis ? (
        <Button
          onClick={analyzeTrade}
          disabled={isAnalyzing}
          className="w-full"
          size="lg"
        >
          {isAnalyzing ? 'Analyzing...' : 'Analyze This Trade'}
        </Button>
      ) : (
        <Tabs defaultValue="impact" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="impact">Impact</TabsTrigger>
            <TabsTrigger value="risk">Risk</TabsTrigger>
            <TabsTrigger value="alternatives">Alternatives</TabsTrigger>
          </TabsList>

          <TabsContent value="impact" className="space-y-4 mt-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Opportunity Score</span>
                <span className="text-lg font-bold">
                  {(analysis.opportunity_score * 100).toFixed(0)}%
                </span>
              </div>
              <Progress value={analysis.opportunity_score * 100} className="h-2" />
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Market Impact Prediction
              </h4>
              {analysis.impact_prediction.competitor_reactions?.map(
                (reaction: any, idx: number) => (
                  <div key={idx} className="p-3 rounded-lg bg-card/50">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{reaction.competitor}</span>
                      <Badge variant="outline" className="text-xs">
                        {(reaction.confidence * 100).toFixed(0)}% confident
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {reaction.likely_action}
                    </p>
                  </div>
                )
              )}
            </div>

            <div className="p-4 rounded-lg bg-card/50 border border-border">
              <h4 className="font-semibold mb-2">AI Recommendation</h4>
              <p className="text-sm">{analysis.ai_recommendation}</p>
            </div>
          </TabsContent>

          <TabsContent value="risk" className="space-y-4 mt-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium">Overall Risk</span>
                <Badge className={getRiskColor(analysis.risk_assessment.overall_risk)}>
                  {analysis.risk_assessment.overall_risk.toUpperCase()}
                </Badge>
              </div>
              <div className="space-y-2">
                {analysis.risk_assessment.specific_risks?.map(
                  (risk: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{risk}</span>
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="p-4 rounded-lg bg-card/50 border border-border">
              <h4 className="font-semibold mb-2">Reasoning</h4>
              <p className="text-sm text-muted-foreground">{analysis.reasoning}</p>
            </div>
          </TabsContent>

          <TabsContent value="alternatives" className="space-y-3 mt-4">
            <h4 className="font-semibold flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              Alternative Strategies
            </h4>
            {analysis.alternative_strategies?.map((strategy: any, idx: number) => (
              <Card key={idx} className="p-4 hover:border-primary transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <h5 className="font-medium">{strategy.strategy}</h5>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {strategy.description}
                </p>
                <div className="p-2 rounded bg-muted/50">
                  <span className="text-xs font-medium">Expected Outcome:</span>
                  <p className="text-xs text-muted-foreground mt-1">
                    {strategy.expected_outcome}
                  </p>
                </div>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      )}
    </Card>
  );
};
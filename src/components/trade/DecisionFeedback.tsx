import { Brain, Award, TrendingUp, AlertTriangle, Lightbulb, BarChart } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface DecisionFeedbackProps {
  feedback: any;
  outcome: any;
  onReset: () => void;
}

export const DecisionFeedback = ({ feedback, outcome, onReset }: DecisionFeedbackProps) => {
  const getQualityColor = () => {
    if (feedback.quality_score >= 80) return 'text-success';
    if (feedback.quality_score >= 60) return 'text-warning';
    return 'text-destructive';
  };

  const getStrategyAlignment = () => {
    switch (feedback.strategy_alignment) {
      case 'aggressive':
        return { icon: TrendingUp, color: 'text-destructive', bg: 'bg-destructive/20' };
      case 'moderate':
        return { icon: BarChart, color: 'text-warning', bg: 'bg-warning/20' };
      case 'conservative':
        return { icon: AlertTriangle, color: 'text-success', bg: 'bg-success/20' };
      default:
        return { icon: BarChart, color: 'text-muted-foreground', bg: 'bg-muted' };
    }
  };

  const strategy = getStrategyAlignment();
  const StrategyIcon = strategy.icon;

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Decision Quality Score */}
      <Card className="p-6 bg-gradient-accent border-0 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Decision Quality</h3>
              <p className="text-sm opacity-90">{feedback.feedback_summary}</p>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-4xl font-bold ${getQualityColor()}`}>
              {feedback.quality_score}
            </div>
            <div className="text-sm opacity-90">/ 100</div>
          </div>
        </div>
        <Progress value={feedback.quality_score} className="h-3" />
      </Card>

      {/* Strategy Alignment */}
      <Card className="p-6">
        <h4 className="font-bold mb-4 flex items-center gap-2">
          <StrategyIcon className={`w-5 h-5 ${strategy.color}`} />
          Strategy Analysis
        </h4>
        <div className="p-4 rounded-lg bg-muted/50 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Your Trading Style</span>
            <Badge className={strategy.bg}>
              {feedback.strategy_alignment}
            </Badge>
          </div>
          <p className="text-sm">{feedback.strategy_explanation}</p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-lg bg-muted/30 text-center">
            <div className="text-2xl font-bold text-destructive">
              {feedback.risk_score || 0}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Risk Score</div>
          </div>
          <div className="p-3 rounded-lg bg-muted/30 text-center">
            <div className="text-2xl font-bold text-primary">
              {feedback.timing_score || 0}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Timing</div>
          </div>
          <div className="p-3 rounded-lg bg-muted/30 text-center">
            <div className="text-2xl font-bold text-success">
              {feedback.execution_score || 0}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Execution</div>
          </div>
        </div>
      </Card>

      {/* Key Insights */}
      <Card className="p-6">
        <h4 className="font-bold mb-4 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-warning" />
          Key Insights
        </h4>
        <div className="space-y-3">
          {feedback.insights?.map((insight: string, idx: number) => (
            <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-primary">{idx + 1}</span>
              </div>
              <p className="text-sm">{insight}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Improvement Recommendations */}
      <Card className="p-6">
        <h4 className="font-bold mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-warning" />
          Improvement Recommendations
        </h4>
        <div className="space-y-2">
          {feedback.recommendations?.map((rec: string, idx: number) => (
            <div key={idx} className="flex items-start gap-2 text-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span>{rec}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Performance History */}
      {feedback.performance_history && (
        <Card className="p-6">
          <h4 className="font-bold mb-4">Your Progress</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Total Decisions</div>
              <div className="text-2xl font-bold">{feedback.performance_history.total_decisions}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Win Rate</div>
              <div className="text-2xl font-bold text-success">
                {feedback.performance_history.win_rate?.toFixed(1)}%
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Avg Quality</div>
              <div className="text-2xl font-bold text-primary">
                {feedback.performance_history.avg_quality?.toFixed(1)}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Total P&L</div>
              <div className={`text-2xl font-bold ${feedback.performance_history.total_profit > 0 ? 'text-success' : 'text-destructive'}`}>
                ${feedback.performance_history.total_profit?.toFixed(2)}
              </div>
            </div>
          </div>
        </Card>
      )}

      <div className="flex justify-end">
        <Button onClick={onReset} size="lg">
          Try Another Scenario
        </Button>
      </div>
    </div>
  );
};
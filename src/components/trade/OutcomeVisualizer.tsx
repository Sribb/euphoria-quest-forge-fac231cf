import { TrendingUp, TrendingDown, DollarSign, Target, Activity, Users } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface OutcomeVisualizerProps {
  outcome: any;
  scenario: any;
  action: any;
}

export const OutcomeVisualizer = ({ outcome, scenario, action }: OutcomeVisualizerProps) => {
  const isProfitable = outcome.profit_loss > 0;

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Result Summary */}
      <Card className={`p-6 border-2 ${isProfitable ? 'border-success/50 bg-success/5' : 'border-destructive/50 bg-destructive/5'}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {isProfitable ? (
              <TrendingUp className="w-8 h-8 text-success" />
            ) : (
              <TrendingDown className="w-8 h-8 text-destructive" />
            )}
            <div>
              <h3 className="text-xl font-bold">
                {isProfitable ? 'Profitable Decision' : 'Loss Incurred'}
              </h3>
              <p className="text-sm text-muted-foreground">{outcome.result_summary}</p>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-3xl font-bold ${isProfitable ? 'text-success' : 'text-destructive'}`}>
              {isProfitable ? '+' : ''}${outcome.profit_loss.toFixed(2)}
            </div>
            <div className="text-sm text-muted-foreground">
              {((outcome.profit_loss / outcome.initial_investment) * 100).toFixed(2)}% return
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3 mt-4">
          <div className="p-3 rounded-lg bg-background">
            <div className="text-xs text-muted-foreground mb-1">Entry Price</div>
            <div className="font-bold">${outcome.entry_price?.toFixed(2) || 0}</div>
          </div>
          <div className="p-3 rounded-lg bg-background">
            <div className="text-xs text-muted-foreground mb-1">Exit Price</div>
            <div className="font-bold">${outcome.exit_price?.toFixed(2) || 0}</div>
          </div>
          <div className="p-3 rounded-lg bg-background">
            <div className="text-xs text-muted-foreground mb-1">Duration</div>
            <div className="font-bold">{outcome.duration_minutes || 0} min</div>
          </div>
          <div className="p-3 rounded-lg bg-background">
            <div className="text-xs text-muted-foreground mb-1">Success Rate</div>
            <div className="font-bold">{outcome.success_probability?.toFixed(0) || 50}%</div>
          </div>
        </div>
      </Card>

      {/* Price Movement Chart */}
      <Card className="p-6">
        <h4 className="font-bold mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Price Movement During Trade
        </h4>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={outcome.price_history || []}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="time" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Market Impact */}
      <Card className="p-6">
        <h4 className="font-bold mb-4 flex items-center gap-2">
          <Target className="w-5 h-5" />
          Market Impact Analysis
        </h4>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Your Trade Impact</span>
              <span className="font-medium">{(outcome.market_impact * 100).toFixed(2)}%</span>
            </div>
            <Progress value={outcome.market_impact * 100} className="h-2" />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Volatility Change</span>
              <span className="font-medium">{(outcome.volatility_change * 100).toFixed(2)}%</span>
            </div>
            <Progress value={Math.abs(outcome.volatility_change) * 100} className="h-2" />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Sentiment Shift</span>
              <span className="font-medium">{outcome.sentiment_shift > 0 ? 'Positive' : 'Negative'}</span>
            </div>
            <Progress
              value={Math.abs(outcome.sentiment_shift) * 100}
              className={`h-2 ${outcome.sentiment_shift > 0 ? '[&>div]:bg-success' : '[&>div]:bg-destructive'}`}
            />
          </div>
        </div>
      </Card>

      {/* Competitor Reactions */}
      {outcome.competitor_reactions && outcome.competitor_reactions.length > 0 && (
        <Card className="p-6">
          <h4 className="font-bold mb-4 flex items-center gap-2">
            <Users className="w-5 h-5" />
            AI Competitor Reactions
          </h4>
          <div className="space-y-2">
            {outcome.competitor_reactions.map((reaction: any, idx: number) => (
              <div key={idx} className="p-3 rounded-lg bg-muted/50">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm">{reaction.competitor}</span>
                  <Badge variant="outline">{reaction.action}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{reaction.reasoning}</p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
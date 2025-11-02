import { Brain, TrendingUp, TrendingDown, Activity, AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface AIMarketPanelProps {
  session: any;
  aiPrices: any[];
  competitors: any[];
  activeEvents: any[];
  onUpdatePrices: () => void;
  onTriggerEvent: () => void;
  isUpdating: boolean;
}

export const AIMarketPanel = ({
  session,
  aiPrices,
  competitors,
  activeEvents,
  onUpdatePrices,
  onTriggerEvent,
  isUpdating,
}: AIMarketPanelProps) => {
  if (!session) return null;

  const getTrendIcon = () => {
    switch (session.market_trend) {
      case 'bullish':
        return <TrendingUp className="w-5 h-5 text-success" />;
      case 'bearish':
        return <TrendingDown className="w-5 h-5 text-destructive" />;
      default:
        return <Activity className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getTrendColor = () => {
    switch (session.market_trend) {
      case 'bullish':
        return 'bg-success/20 text-success';
      case 'bearish':
        return 'bg-destructive/20 text-destructive';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-4">
      <Card className="p-6 bg-gradient-hero border-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Brain className="w-5 h-5 text-primary animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold">AI Market Engine</h3>
              <p className="text-sm text-muted-foreground">Session: {session.session_name}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={onUpdatePrices}
              disabled={isUpdating}
              className="animate-fade-in"
            >
              {isUpdating ? 'Updating...' : 'Tick Market'}
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={onTriggerEvent}
              className="animate-fade-in"
            >
              Trigger Event
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {getTrendIcon()}
              <span className="text-sm font-medium">Market Trend</span>
            </div>
            <Badge className={getTrendColor()}>
              {session.market_trend.toUpperCase()}
            </Badge>
          </div>

          <div className="space-y-2">
            <span className="text-sm font-medium">Volatility</span>
            <div>
              <Progress value={session.market_volatility * 100} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {(session.market_volatility * 100).toFixed(0)}%
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-sm font-medium">Total Trades</span>
            <p className="text-2xl font-bold">{session.total_trades}</p>
          </div>
        </div>
      </Card>

      {/* Active Events */}
      {activeEvents && activeEvents.length > 0 && (
        <Card className="p-4 border-warning bg-warning/5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold mb-2">Active Market Events</h4>
              <div className="space-y-2">
                {activeEvents.map((event) => (
                  <div key={event.id} className="text-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{event.title}</span>
                      <Badge variant="outline" className="text-xs">
                        {event.severity}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-xs mt-1">
                      {event.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* AI Competitors */}
      {competitors && competitors.length > 0 && (
        <Card className="p-4">
          <h4 className="font-semibold mb-3">AI Competitors</h4>
          <div className="grid grid-cols-2 gap-3">
            {competitors.map((competitor) => (
              <div
                key={competitor.id}
                className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">{competitor.name}</span>
                  <Badge variant="secondary" className="text-xs">
                    {competitor.strategy_type}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div className="flex justify-between">
                    <span>Capital:</span>
                    <span className="font-medium">
                      ${Number(competitor.capital).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Trades:</span>
                    <span className="font-medium">{competitor.total_trades}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Win Rate:</span>
                    <span className="font-medium">
                      {(Number(competitor.win_rate) * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
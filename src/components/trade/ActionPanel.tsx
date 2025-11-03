import { useState } from 'react';
import { TrendingUp, TrendingDown, Shield, DollarSign } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

interface ActionPanelProps {
  scenario: any;
  onExecute: (action: any) => void;
  disabled: boolean;
}

export const ActionPanel = ({ scenario, onExecute, disabled }: ActionPanelProps) => {
  const [selectedAction, setSelectedAction] = useState<string>('');
  const [symbol, setSymbol] = useState(scenario.affected_symbols?.[0] || 'AAPL');
  const [quantity, setQuantity] = useState(10);
  const [stopLoss, setStopLoss] = useState(5);

  const actions = [
    {
      id: 'buy',
      label: 'Buy Long',
      icon: TrendingUp,
      color: 'bg-success/20 hover:bg-success/30 text-success border-success/50',
      description: 'Buy shares expecting price increase'
    },
    {
      id: 'sell',
      label: 'Sell/Short',
      icon: TrendingDown,
      color: 'bg-destructive/20 hover:bg-destructive/30 text-destructive border-destructive/50',
      description: 'Sell or short expecting price decrease'
    },
    {
      id: 'hedge',
      label: 'Hedge',
      icon: Shield,
      color: 'bg-warning/20 hover:bg-warning/30 text-warning border-warning/50',
      description: 'Protect position with opposite trade'
    },
    {
      id: 'hold',
      label: 'Hold Cash',
      icon: DollarSign,
      color: 'bg-muted hover:bg-muted/80 text-foreground border-border',
      description: 'Wait and observe market movement'
    },
  ];

  const handleExecute = () => {
    if (!selectedAction) return;

    const action = {
      type: selectedAction,
      symbol,
      quantity: selectedAction === 'hold' ? 0 : quantity,
      stopLoss: selectedAction === 'hold' ? 0 : stopLoss,
      timestamp: new Date().toISOString(),
    };

    onExecute(action);
  };

  return (
    <Card className="p-6">
      <h4 className="font-bold mb-4">Choose Your Action</h4>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              onClick={() => setSelectedAction(action.id)}
              disabled={disabled}
              className={`p-4 rounded-lg border-2 transition-all ${action.color} ${
                selectedAction === action.id ? 'ring-2 ring-primary scale-105' : ''
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <Icon className="w-6 h-6 mb-2 mx-auto" />
              <div className="font-bold text-sm mb-1">{action.label}</div>
              <div className="text-xs opacity-80">{action.description}</div>
            </button>
          );
        })}
      </div>

      {selectedAction && selectedAction !== 'hold' && (
        <div className="space-y-4 p-4 rounded-lg bg-muted/30 mb-4">
          <div className="space-y-2">
            <Label>Select Symbol</Label>
            <select
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              className="w-full p-2 rounded-md bg-background border border-input"
              disabled={disabled}
            >
              {scenario.affected_symbols?.map((sym: string) => (
                <option key={sym} value={sym}>{sym}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label>Quantity: {quantity} shares</Label>
            <Slider
              value={[quantity]}
              onValueChange={([val]) => setQuantity(val)}
              min={1}
              max={100}
              step={1}
              disabled={disabled}
            />
          </div>

          <div className="space-y-2">
            <Label>Stop Loss: {stopLoss}%</Label>
            <Slider
              value={[stopLoss]}
              onValueChange={([val]) => setStopLoss(val)}
              min={0}
              max={20}
              step={1}
              disabled={disabled}
            />
          </div>
        </div>
      )}

      <Button
        onClick={handleExecute}
        disabled={!selectedAction || disabled}
        className="w-full"
        size="lg"
      >
        Execute Decision
      </Button>
    </Card>
  );
};
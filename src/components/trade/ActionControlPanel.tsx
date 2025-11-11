import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  Pause,
  Shield,
  Zap,
  Bot,
  DollarSign,
  Loader2
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ActionType = "buy" | "sell" | "hold" | "hedge" | "leverage" | "auto";

interface Action {
  type: ActionType;
  symbol: string;
  quantity: number;
  stopLoss?: number;
  leverage?: number;
}

interface ActionControlPanelProps {
  scenario: any;
  onExecute: (action: Action) => void;
  isExecuting: boolean;
  disabled?: boolean;
}

export const ActionControlPanel = ({ scenario, onExecute, isExecuting, disabled }: ActionControlPanelProps) => {
  const [selectedAction, setSelectedAction] = useState<ActionType>("buy");
  const [symbol, setSymbol] = useState(scenario?.affected_symbols?.[0] || "AAPL");
  const [quantity, setQuantity] = useState("100");
  const [stopLoss, setStopLoss] = useState("5");
  const [leverage, setLeverage] = useState([1]);

  const actions = [
    {
      type: "buy" as ActionType,
      icon: <TrendingUp className="w-5 h-5" />,
      label: "Buy",
      description: "Take long position for gains",
      color: "text-success border-success/50 hover:bg-success/10",
    },
    {
      type: "sell" as ActionType,
      icon: <TrendingDown className="w-5 h-5" />,
      label: "Sell/Short",
      description: "Profit from downward movement",
      color: "text-destructive border-destructive/50 hover:bg-destructive/10",
    },
    {
      type: "hold" as ActionType,
      icon: <Pause className="w-5 h-5" />,
      label: "Hold",
      description: "Stay neutral, observe market",
      color: "text-muted-foreground border-border hover:bg-muted/50",
    },
    {
      type: "hedge" as ActionType,
      icon: <Shield className="w-5 h-5" />,
      label: "Hedge",
      description: "Offset exposure defensively",
      color: "text-warning border-warning/50 hover:bg-warning/10",
    },
    {
      type: "leverage" as ActionType,
      icon: <Zap className="w-5 h-5" />,
      label: "Leverage",
      description: "Scale position size up/down",
      color: "text-accent border-accent/50 hover:bg-accent/10",
    },
    {
      type: "auto" as ActionType,
      icon: <Bot className="w-5 h-5" />,
      label: "Auto-AI",
      description: "Let AI execute autonomously",
      color: "text-primary border-primary/50 hover:bg-primary/10",
    },
  ];

  const handleExecute = () => {
    const action: Action = {
      type: selectedAction,
      symbol,
      quantity: parseInt(quantity) || 0,
      stopLoss: parseFloat(stopLoss) || undefined,
      leverage: selectedAction === "leverage" ? leverage[0] : undefined,
    };
    onExecute(action);
  };

  const isValid = symbol && (selectedAction === "hold" || selectedAction === "auto" || parseInt(quantity) > 0);

  return (
    <Card className="p-6 bg-gradient-to-br from-card to-background border-border/50">
      <div className="flex items-center gap-3 mb-6">
        <DollarSign className="w-6 h-6 text-primary" />
        <div>
          <h3 className="text-lg font-bold">Action Control Panel</h3>
          <p className="text-sm text-muted-foreground">
            Choose your strategy and execute
          </p>
        </div>
      </div>

      {/* Action Selection */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
        {actions.map((action) => (
          <Button
            key={action.type}
            variant="outline"
            className={`h-auto py-4 flex flex-col items-center gap-2 ${
              selectedAction === action.type
                ? `${action.color} border-2`
                : "border-border"
            }`}
            onClick={() => setSelectedAction(action.type)}
            disabled={disabled}
          >
            <div className={selectedAction === action.type ? action.color : "text-muted-foreground"}>
              {action.icon}
            </div>
            <div className="text-center">
              <div className="font-semibold text-sm">{action.label}</div>
              <div className="text-xs text-muted-foreground line-clamp-2">
                {action.description}
              </div>
            </div>
          </Button>
        ))}
      </div>

      {/* Configuration */}
      {selectedAction !== "hold" && selectedAction !== "auto" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="symbol" className="text-sm mb-2">Symbol</Label>
              <Select value={symbol} onValueChange={setSymbol} disabled={disabled}>
                <SelectTrigger id="symbol" className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {scenario?.affected_symbols && scenario.affected_symbols.length > 0 ? (
                    scenario.affected_symbols.map((sym: string) => (
                      <SelectItem key={sym} value={sym}>{sym}</SelectItem>
                    ))
                  ) : (
                    <>
                      <SelectItem value="AAPL">AAPL</SelectItem>
                      <SelectItem value="GOOGL">GOOGL</SelectItem>
                      <SelectItem value="MSFT">MSFT</SelectItem>
                      <SelectItem value="AMZN">AMZN</SelectItem>
                      <SelectItem value="TSLA">TSLA</SelectItem>
                      <SelectItem value="NVDA">NVDA</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="quantity" className="text-sm mb-2">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="100"
                className="bg-background"
                disabled={disabled}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="stopLoss" className="text-sm mb-2">
              Stop Loss (%)
            </Label>
            <Input
              id="stopLoss"
              type="number"
              value={stopLoss}
              onChange={(e) => setStopLoss(e.target.value)}
              placeholder="5"
              className="bg-background"
              disabled={disabled}
            />
          </div>

          {selectedAction === "leverage" && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm">Leverage Multiplier</Label>
                <Badge variant="outline">{leverage[0]}x</Badge>
              </div>
              <Slider
                value={leverage}
                onValueChange={setLeverage}
                min={1}
                max={5}
                step={0.5}
                className="w-full"
                disabled={disabled}
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>1x (Conservative)</span>
                <span>5x (Aggressive)</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Execute Button */}
      <Button
        onClick={handleExecute}
        disabled={!isValid || isExecuting || disabled}
        className="w-full mt-6 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30 h-12"
      >
        {isExecuting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Executing...
          </>
        ) : (
          <>
            <Zap className="w-4 h-4 mr-2" />
            Execute {actions.find(a => a.type === selectedAction)?.label} Action
          </>
        )}
      </Button>

      {selectedAction === "auto" && (
        <div className="mt-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
          <div className="flex items-start gap-3">
            <Bot className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <div className="font-semibold text-sm mb-1">AI Autopilot Mode</div>
              <p className="text-xs text-muted-foreground">
                The AI will analyze market conditions in real-time and execute optimal trades automatically based on the scenario evolution and your risk profile.
              </p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

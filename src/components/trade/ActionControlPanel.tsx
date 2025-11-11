import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  TrendingUp,
  TrendingDown,
  Pause,
  Shield,
  Zap,
  Bot,
  DollarSign,
  Loader2,
  AlertCircle
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
      description: "Long position for gains",
      tooltip: "Open long position expecting price increase",
      color: "text-success border-success/50 hover:bg-success/10 data-[selected=true]:bg-success/20 data-[selected=true]:border-success",
    },
    {
      type: "sell" as ActionType,
      icon: <TrendingDown className="w-5 h-5" />,
      label: "Sell/Short",
      description: "Profit from decline",
      tooltip: "Short position expecting price decrease",
      color: "text-destructive border-destructive/50 hover:bg-destructive/10 data-[selected=true]:bg-destructive/20 data-[selected=true]:border-destructive",
    },
    {
      type: "hold" as ActionType,
      icon: <Pause className="w-5 h-5" />,
      label: "Hold",
      description: "Maintain capital",
      tooltip: "Stay neutral and observe market conditions",
      color: "text-muted-foreground border-border hover:bg-muted/50 data-[selected=true]:bg-muted data-[selected=true]:border-foreground",
    },
    {
      type: "hedge" as ActionType,
      icon: <Shield className="w-5 h-5" />,
      label: "Hedge",
      description: "Defensive position",
      tooltip: "Offset exposure with protective positions",
      color: "text-warning border-warning/50 hover:bg-warning/10 data-[selected=true]:bg-warning/20 data-[selected=true]:border-warning",
    },
    {
      type: "leverage" as ActionType,
      icon: <Zap className="w-5 h-5" />,
      label: "Leverage",
      description: "Scale position size",
      tooltip: "Amplify position based on confidence",
      color: "text-accent border-accent/50 hover:bg-accent/10 data-[selected=true]:bg-accent/20 data-[selected=true]:border-accent",
    },
    {
      type: "auto" as ActionType,
      icon: <Bot className="w-5 h-5" />,
      label: "Auto-AI",
      description: "AI autonomous trading",
      tooltip: "Let AI execute and adapt automatically",
      color: "text-primary border-primary/50 hover:bg-primary/10 data-[selected=true]:bg-primary/20 data-[selected=true]:border-primary",
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
    <Card className="p-6 bg-gradient-to-br from-card to-background border-border/50 shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <DollarSign className="w-6 h-6 text-primary animate-pulse" />
        <div>
          <h3 className="text-lg font-bold">Action Control Panel</h3>
          <p className="text-sm text-muted-foreground">
            {disabled ? "Select a scenario to begin" : "Choose and execute your strategy"}
          </p>
        </div>
      </div>

      {/* Action Selection with Tooltips */}
      <TooltipProvider>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
          {actions.map((action) => (
            <Tooltip key={action.type}>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  data-selected={selectedAction === action.type}
                  className={`h-auto py-4 flex flex-col items-center gap-2 transition-all duration-200 ${
                    selectedAction === action.type
                      ? `${action.color} scale-105 shadow-lg ring-2 ring-offset-2`
                      : `${action.color} hover:scale-105`
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
              </TooltipTrigger>
              <TooltipContent side="bottom" className="bg-popover border-primary/20">
                <p className="text-sm">{action.tooltip}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </TooltipProvider>

      {/* Configuration */}
      {selectedAction !== "hold" && selectedAction !== "auto" && (
        <div className="space-y-4 animate-fade-in">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="symbol" className="text-sm mb-2 flex items-center gap-1">
                Symbol
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <AlertCircle className="w-3 h-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">Stock ticker to trade</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
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
              <Label htmlFor="quantity" className="text-sm mb-2 flex items-center gap-1">
                Quantity
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <AlertCircle className="w-3 h-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">Number of shares to trade</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
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
            <Label htmlFor="stopLoss" className="text-sm mb-2 flex items-center gap-1">
              Stop Loss (%)
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <AlertCircle className="w-3 h-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Auto-exit if loss exceeds this %</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
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
            <div className="animate-fade-in">
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm flex items-center gap-1">
                  Leverage Multiplier
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <AlertCircle className="w-3 h-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">Higher leverage = higher risk & reward</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <Badge variant="outline" className="animate-pulse">{leverage[0]}x</Badge>
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
                <span>1x (Safe)</span>
                <span>5x (High Risk)</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Execute Button */}
      <Button
        onClick={handleExecute}
        disabled={!isValid || isExecuting || disabled}
        className={`w-full mt-6 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30 h-14 text-lg font-bold transition-all duration-300 ${
          !disabled && isValid && !isExecuting ? 'animate-pulse hover:scale-105' : ''
        }`}
      >
        {isExecuting ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Executing Trade...
          </>
        ) : (
          <>
            <Zap className="w-5 h-5 mr-2" />
            Execute {actions.find(a => a.type === selectedAction)?.label} {symbol ? `on ${symbol}` : ''}
          </>
        )}
      </Button>

      {/* Info Box */}
      {selectedAction === "auto" && !disabled && (
        <div className="mt-4 p-4 bg-primary/10 rounded-lg border border-primary/20 animate-fade-in">
          <div className="flex items-start gap-3">
            <Bot className="w-5 h-5 text-primary mt-0.5 animate-pulse" />
            <div>
              <div className="font-semibold text-sm mb-1">AI Autopilot Engaged</div>
              <p className="text-xs text-muted-foreground">
                AI will analyze real-time conditions and execute optimal trades automatically based on scenario evolution and risk parameters.
              </p>
            </div>
          </div>
        </div>
      )}

      {disabled && (
        <div className="mt-4 p-4 bg-accent/10 rounded-lg border border-accent/20 animate-fade-in">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-accent mt-0.5" />
            <div>
              <div className="font-semibold text-sm mb-1 text-accent">No Scenario Selected</div>
              <p className="text-xs text-muted-foreground">
                Generate or select a market scenario from the left panel to unlock trading actions
              </p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};
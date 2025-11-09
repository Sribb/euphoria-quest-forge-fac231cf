import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, 
  Send, 
  TrendingUp, 
  Target, 
  Lightbulb,
  DollarSign,
  Activity,
  Sparkles
} from "lucide-react";
import TradingViewWidget from "@/components/TradingViewWidget";

type OrderType = "market" | "limit" | "stop" | "stop-limit";

export const AIInsightReactor = () => {
  const [question, setQuestion] = useState("");
  const [aiResponse, setAiResponse] = useState<any>(null);
  const [isThinking, setIsThinking] = useState(false);
  const [learningMode, setLearningMode] = useState(true);
  const [orderType, setOrderType] = useState<OrderType>("market");
  const [symbol, setSymbol] = useState("AAPL");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");

  const handleAskMarket = () => {
    if (!question.trim()) return;
    setIsThinking(true);
    
    // Simulate AI response
    setTimeout(() => {
      setAiResponse({
        context: "Tech stocks surged this week due to renewed investor confidence in AI infrastructure spending and positive earnings surprises from major players.",
        impact: ["AAPL +3.2%", "MSFT +2.8%", "NVDA +5.1%", "GOOGL +2.3%"],
        strategy: "Consider rotating into AI-focused ETFs for diversified exposure while maintaining defensive positions in healthcare and utilities.",
      });
      setIsThinking(false);
    }, 1500);
  };

  const handleTrade = () => {
    console.log("Trade executed:", { symbol, orderType, quantity, price });
  };

  return (
    <div className="h-full overflow-y-auto space-y-4 pr-2">
      {/* Ask the Market */}
      <Card className="p-5 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
        <div className="flex items-center gap-2 mb-3">
          <Brain className="w-5 h-5 text-primary animate-pulse" />
          <h3 className="font-bold">Ask the Market</h3>
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="e.g., 'Why did tech outperform this week?'"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAskMarket()}
            className="bg-background/50 border-border/50"
          />
          <Button
            onClick={handleAskMarket}
            disabled={!question.trim() || isThinking}
            className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30"
          >
            {isThinking ? (
              <Activity className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </Card>

      {/* AI Response Cards */}
      {aiResponse && (
        <div className="space-y-3 animate-fade-in">
          <Card className="p-4 bg-gradient-to-r from-primary/5 to-transparent border-l-4 border-l-primary">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-primary" />
              <h4 className="font-semibold text-sm">Market Context</h4>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {aiResponse.context}
            </p>
            {learningMode && (
              <div className="mt-3 p-2 bg-accent/10 rounded-lg border border-accent/20">
                <p className="text-xs text-accent flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  This means: Market sentiment improved due to strong fundamentals and positive news flow.
                </p>
              </div>
            )}
          </Card>

          <Card className="p-4 bg-gradient-to-r from-success/5 to-transparent border-l-4 border-l-success">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-success" />
              <h4 className="font-semibold text-sm">Stock Impact</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {aiResponse.impact.map((stock: string, i: number) => (
                <Badge
                  key={i}
                  variant="outline"
                  className="border-success/50 text-success"
                >
                  {stock}
                </Badge>
              ))}
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-r from-accent/5 to-transparent border-l-4 border-l-accent">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-4 h-4 text-accent" />
              <h4 className="font-semibold text-sm">Strategy Tip</h4>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {aiResponse.strategy}
            </p>
          </Card>
        </div>
      )}

      {/* AI Learning Mode Toggle */}
      <Card className="p-4 bg-card/50 border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-accent" />
            <Label htmlFor="learning-mode" className="text-sm cursor-pointer">
              AI Learning Mode
            </Label>
          </div>
          <Switch
            id="learning-mode"
            checked={learningMode}
            onCheckedChange={setLearningMode}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Converts complex terms into plain-language explanations
        </p>
      </Card>

      {/* TradingView Chart */}
      <Card className="p-4 bg-card/50 border-border/50">
        <h3 className="text-sm font-semibold mb-3">Live Market Chart</h3>
        <TradingViewWidget symbol={`NASDAQ:${symbol}`} height={350} />
      </Card>

      {/* Trading Interface */}
      <Card className="p-5 bg-gradient-to-br from-accent/10 to-background border-accent/20">
        <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-success" />
          Execute Trade
        </h3>

        <div className="space-y-3">
          <div>
            <Label htmlFor="symbol" className="text-xs text-muted-foreground">Symbol</Label>
            <Input
              id="symbol"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              placeholder="AAPL"
              className="bg-background/50 border-border/50 mt-1"
            />
          </div>

          <Tabs value={orderType} onValueChange={(v) => setOrderType(v as OrderType)}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="market" className="text-xs">Market</TabsTrigger>
              <TabsTrigger value="limit" className="text-xs">Limit</TabsTrigger>
              <TabsTrigger value="stop" className="text-xs">Stop</TabsTrigger>
              <TabsTrigger value="stop-limit" className="text-xs">Stop-Limit</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="quantity" className="text-xs text-muted-foreground">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="100"
                className="bg-background/50 border-border/50 mt-1"
              />
            </div>
            {(orderType === "limit" || orderType === "stop-limit") && (
              <div>
                <Label htmlFor="price" className="text-xs text-muted-foreground">Price</Label>
                <Input
                  id="price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="150.00"
                  className="bg-background/50 border-border/50 mt-1"
                />
              </div>
            )}
          </div>

          <Button
            onClick={handleTrade}
            disabled={!symbol || !quantity}
            className="w-full bg-success hover:bg-success/90 shadow-lg shadow-success/30"
          >
            <DollarSign className="w-4 h-4 mr-2" />
            Confirm Trade ({orderType})
          </Button>
        </div>
      </Card>
    </div>
  );
};

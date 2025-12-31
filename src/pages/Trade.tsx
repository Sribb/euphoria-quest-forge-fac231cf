import { TrendingUp, ArrowLeft, Brain, BarChart3, Zap } from "lucide-react";
import { InteractiveAIMarket } from "@/components/trade/InteractiveAIMarket";
import { PortfolioOverview } from "@/components/trade/PortfolioOverview";
import { AssetAllocation } from "@/components/trade/AssetAllocation";
import { TransactionHistory } from "@/components/trade/TransactionHistory";
import { StockTrading } from "@/components/trade/StockTrading";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useAIMarket } from "@/hooks/useAIMarket";

interface TradeProps {
  onNavigate: (tab: string) => void;
  onStockSearch?: () => void;
}

const Trade = ({ onNavigate, onStockSearch }: TradeProps) => {
  const { user } = useAuth();
  const { session } = useAIMarket(user?.id);

  return (
    <div className="min-h-screen bg-background pb-24 pt-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 px-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onNavigate("dashboard")}
            className="hover-scale smooth-transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="w-12 h-12 rounded-xl bg-gradient-success flex items-center justify-center shadow-glow animate-scale-in">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Trade Terminal</h1>
            <p className="text-sm text-muted-foreground">Intelligent market simulation & execution</p>
          </div>
        </div>
        
        {session && (
          <Badge variant="outline" className="bg-success/10 text-success border-success/50 px-4 py-2">
            <div className="w-2 h-2 rounded-full bg-success mr-2 animate-pulse" />
            AI Market Active
          </Badge>
        )}
      </div>

      {/* Tabbed Interface */}
      <div className="px-6">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="ai-market" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              AI Market
            </TabsTrigger>
            <TabsTrigger value="trade" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Trade
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6 animate-fade-in">
            <PortfolioOverview />
            <AssetAllocation />
            <TransactionHistory />
          </TabsContent>

          {/* AI Market Tab */}
          <TabsContent value="ai-market" className="animate-fade-in">
            <InteractiveAIMarket />
          </TabsContent>

          {/* Trade Tab */}
          <TabsContent value="trade" className="animate-fade-in">
            <StockTrading />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Trade;

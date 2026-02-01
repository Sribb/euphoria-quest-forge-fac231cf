import { TrendingUp, ArrowLeft, Brain, BarChart3, Zap } from "lucide-react";
import { InteractiveAIMarket } from "@/features/trading/components/InteractiveAIMarket";
import { PortfolioOverview } from "@/features/trading/components/PortfolioOverview";
import { AssetAllocation } from "@/features/trading/components/AssetAllocation";
import { TransactionHistory } from "@/features/trading/components/TransactionHistory";
import { StockTrading } from "@/features/trading/components/StockTrading";
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 md:mb-6 px-4 md:px-6 gap-3">
        <div className="flex items-center gap-2 md:gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onNavigate("dashboard")}
            className="hover-scale smooth-transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-success flex items-center justify-center shadow-glow animate-scale-in">
            <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold">Trade Terminal</h1>
            <p className="text-xs md:text-sm text-muted-foreground">Intelligent market simulation</p>
          </div>
        </div>
        
        {session && (
          <Badge variant="outline" className="bg-success/10 text-success border-success/50 px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm">
            <div className="w-2 h-2 rounded-full bg-success mr-2 animate-pulse" />
            AI Market Active
          </Badge>
        )}
      </div>

      {/* Tabbed Interface */}
      <div className="px-4 md:px-6">
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

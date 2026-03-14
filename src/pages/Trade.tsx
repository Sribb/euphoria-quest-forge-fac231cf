import { TrendingUp, Brain, BarChart3, Zap, PieChart } from "lucide-react";
import { InteractiveAIMarket } from "@/features/trading/components/InteractiveAIMarket";
import { PortfolioOverview } from "@/features/trading/components/PortfolioOverview";
import { PortfolioAnalyzer } from "@/features/trading/components/PortfolioAnalyzer";
import { AssetAllocation } from "@/features/trading/components/AssetAllocation";
import { TransactionHistory } from "@/features/trading/components/TransactionHistory";
import { StockTrading } from "@/features/trading/components/StockTrading";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useAIMarket } from "@/hooks/useAIMarket";
import { motion } from "framer-motion";

interface TradeProps {
  onNavigate: (tab: string) => void;
  onStockSearch?: () => void;
}

const Trade = ({ onNavigate, onStockSearch }: TradeProps) => {
  const { user } = useAuth();
  const { session } = useAIMarket(user?.id);

  return (
    <motion.div 
      className="min-h-screen bg-background pb-24 pt-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6 px-1">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-success flex items-center justify-center shadow-glow-soft">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Trade Terminal</h1>
            <p className="text-sm text-muted-foreground">AI-powered market simulation</p>
          </div>
        </div>
        
        {session && (
          <Badge variant="outline" className="bg-success/10 text-success border-success/30 px-3 py-1.5 text-xs">
            <div className="w-2 h-2 rounded-full bg-success mr-2 animate-pulse" />
            AI Market Active
          </Badge>
        )}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6 bg-muted/50 backdrop-blur-sm">
          <TabsTrigger value="overview" className="gap-2 text-xs sm:text-sm">
            <BarChart3 className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="ai-market" className="gap-2 text-xs sm:text-sm">
            <Brain className="w-4 h-4" />
            AI Market
          </TabsTrigger>
          <TabsTrigger value="trade" className="gap-2 text-xs sm:text-sm">
            <Zap className="w-4 h-4" />
            Trade
          </TabsTrigger>
          <TabsTrigger value="analyze" className="gap-2 text-xs sm:text-sm">
            <PieChart className="w-4 h-4" />
            Analyze
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <PortfolioOverview />
          <AssetAllocation />
          <TransactionHistory />
        </TabsContent>

        <TabsContent value="ai-market">
          <InteractiveAIMarket />
        </TabsContent>

        <TabsContent value="trade">
          <StockTrading />
        </TabsContent>

        <TabsContent value="analyze">
          <PortfolioAnalyzer />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default Trade;

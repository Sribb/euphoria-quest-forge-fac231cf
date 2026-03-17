import { useState } from "react";
import { TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePaperTrading } from "@/hooks/usePaperTrading";
import { WatchlistRow } from "@/features/paper-trading/components/WatchlistRow";
import { StockSearchBar } from "@/features/paper-trading/components/StockSearch";
import { MarketList } from "@/features/paper-trading/components/MarketList";
import { PortfolioTab } from "@/features/paper-trading/components/PortfolioTab";
import { HistoryTab } from "@/features/paper-trading/components/HistoryTab";
import { StockDetailModal } from "@/features/paper-trading/components/StockDetailModal";
import { motion } from "framer-motion";

interface TradeProps {
  onNavigate: (tab: string) => void;
  onStockSearch?: () => void;
}

const Trade = ({ onNavigate }: TradeProps) => {
  const { data } = usePaperTrading();
  const [activeTab, setActiveTab] = useState("discover");
  const [selectedStock, setSelectedStock] = useState<string | null>(null);

  if (selectedStock) {
    return <StockDetailModal symbol={selectedStock} onBack={() => setSelectedStock(null)} />;
  }

  return (
    <motion.div
      className="min-h-screen bg-background pb-24 pt-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5 px-1">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-success flex items-center justify-center shadow-glow-soft">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Paper Trading</h1>
            <p className="text-xs text-muted-foreground">Virtual money — practice risk free</p>
          </div>
        </div>
        <Badge variant="outline" className="bg-success/10 text-success border-success/30 px-3 py-1.5 text-sm font-semibold">
          ${data.paper_cash.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} available
        </Badge>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-5 bg-muted/50 backdrop-blur-sm">
          <TabsTrigger value="discover">Discover</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="discover" className="space-y-5">
          <WatchlistRow onSelect={setSelectedStock} />
          <StockSearchBar onSelect={setSelectedStock} />
          <MarketList onSelect={setSelectedStock} />
        </TabsContent>

        <TabsContent value="portfolio">
          <PortfolioTab onSelectStock={setSelectedStock} onSwitchTab={setActiveTab} />
        </TabsContent>

        <TabsContent value="history">
          <HistoryTab />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default Trade;

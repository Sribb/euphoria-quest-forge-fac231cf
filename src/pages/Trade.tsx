import { useState } from "react";
import { TrendingUp } from "lucide-react";
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
      className="min-h-screen bg-background pb-8"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-[12px] bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Paper Trading</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Virtual money — practice risk free</p>
          </div>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-[10px] px-4 py-2">
          <span className="text-xs text-muted-foreground">Available</span>
          <div className="text-sm font-bold text-emerald-400">
            ${data.paper_cash.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6 bg-muted/30 border border-border/40 backdrop-blur-sm rounded-[10px] h-11">
          <TabsTrigger value="discover" className="rounded-[8px] text-sm font-semibold data-[state=active]:shadow-sm">Discover</TabsTrigger>
          <TabsTrigger value="portfolio" className="rounded-[8px] text-sm font-semibold data-[state=active]:shadow-sm">Portfolio</TabsTrigger>
          <TabsTrigger value="history" className="rounded-[8px] text-sm font-semibold data-[state=active]:shadow-sm">History</TabsTrigger>
        </TabsList>

        <TabsContent value="discover" className="space-y-6 mt-0">
          <WatchlistRow onSelect={setSelectedStock} />
          <StockSearchBar onSelect={setSelectedStock} />
          <MarketList onSelect={setSelectedStock} />
        </TabsContent>

        <TabsContent value="portfolio" className="mt-0">
          <PortfolioTab onSelectStock={setSelectedStock} onSwitchTab={setActiveTab} />
        </TabsContent>

        <TabsContent value="history" className="mt-0">
          <HistoryTab />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default Trade;
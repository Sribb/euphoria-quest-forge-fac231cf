import { useState } from "react";
import { PortfolioGraph } from "./PortfolioGraph";
import { AllocationPieChart } from "./AllocationPieChart";
import { MarketTicker } from "./MarketTicker";
import { QuickTradePanel } from "./QuickTradePanel";
import { AskPluto } from "./AskPluto";
import { StockTickerBar } from "./StockTickerBar";
import { StockDetailModal } from "@/features/paper-trading/components/StockDetailModal";
import { motion } from "framer-motion";

interface TradeDashboardProps {
  onNavigate?: (tab: string) => void;
}

export const TradeDashboard = ({ onNavigate }: TradeDashboardProps) => {
  const [selectedStock, setSelectedStock] = useState<string | null>(null);

  if (selectedStock) {
    return <StockDetailModal symbol={selectedStock} onBack={() => setSelectedStock(null)} />;
  }

  return (
    <motion.div
      className="space-y-6 pb-8"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      {/* Live stock ticker bar */}
      <StockTickerBar />

      {/* Market cards row */}
      <MarketTicker onSelect={setSelectedStock} />

      {/* Portfolio performance chart */}
      <PortfolioGraph />

      {/* Two-column: Allocation + Quick Trade */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <AllocationPieChart />
        </div>
        <div className="lg:col-span-2">
          <QuickTradePanel />
        </div>
      </div>

      {/* Ask Pluto floating assistant */}
      <AskPluto />
    </motion.div>
  );
};

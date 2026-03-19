import { useState } from "react";
import { PortfolioGraph } from "./PortfolioGraph";
import { AllocationPieChart } from "./AllocationPieChart";
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Live stock ticker bar */}
      <StockTickerBar />

      {/* Portfolio performance chart */}
      <PortfolioGraph />

      {/* Two-column: Allocation + Quick Trade */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <motion.div
          className="lg:col-span-3"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
        >
          <AllocationPieChart />
        </motion.div>
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
        >
          <QuickTradePanel />
        </motion.div>
      </div>

      {/* Ask Pluto floating assistant */}
      <AskPluto />
    </motion.div>
  );
};

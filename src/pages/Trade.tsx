import { useState } from "react";
import { TrendingUp, ArrowLeft } from "lucide-react";
import { PortfolioSummary } from "@/components/trade/PortfolioSummary";
import { AssetAllocation } from "@/components/trade/AssetAllocation";
import { StockTrading } from "@/components/trade/StockTrading";
import { TransactionHistory } from "@/components/trade/TransactionHistory";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TradingViewChart } from "@/components/learn/TradingViewChart";

interface TradeProps {
  onNavigate: (tab: string) => void;
  onStockSearch?: () => void;
}

const Trade = ({ onNavigate, onStockSearch }: TradeProps) => {
  return (
    <div className="space-y-6 pb-24 animate-fade-in">
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
          <h1 className="text-2xl font-bold">Trade</h1>
          <p className="text-muted-foreground">Professional trading simulator with realistic execution</p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4 smooth-transition">
          <TabsTrigger value="overview" className="smooth-transition">Overview</TabsTrigger>
          <TabsTrigger value="trade" className="smooth-transition">Trade</TabsTrigger>
          <TabsTrigger value="history" className="smooth-transition">History</TabsTrigger>
          <TabsTrigger value="chart" className="smooth-transition">Chart</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6 animate-fade-in">
          <PortfolioSummary />
          <AssetAllocation />

          <Card className="p-6 bg-gradient-accent border-0">
            <h3 className="text-lg font-bold mb-3 text-white">Explore Individual Stocks</h3>
            <p className="text-sm text-white/80 mb-4">
              Search and analyze individual stocks with real-time data and advanced charts.
            </p>
            <Button 
              className="w-full bg-white text-primary hover:bg-white/90 font-semibold"
              onClick={onStockSearch}
            >
              Search Stocks
            </Button>
          </Card>
        </TabsContent>

        <TabsContent value="trade" className="mt-6 animate-fade-in">
          <StockTrading />
        </TabsContent>

        <TabsContent value="history" className="mt-6 animate-fade-in">
          <TransactionHistory />
        </TabsContent>

        <TabsContent value="chart" className="mt-6 animate-fade-in">
          <TradingViewChart />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Trade;

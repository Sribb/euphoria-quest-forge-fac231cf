import { useState } from "react";
import { TrendingUp, ChevronLeft } from "lucide-react";
import { PortfolioSummary } from "@/components/trade/PortfolioSummary";
import { AssetAllocation } from "@/components/trade/AssetAllocation";
import { StockTrading } from "@/components/trade/StockTrading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { TradingViewChart } from "@/components/learn/TradingViewChart";

interface TradeProps {
  onNavigate: (tab: string) => void;
  onStockSearch?: () => void;
}

const Trade = ({ onNavigate, onStockSearch }: TradeProps) => {
  const { user } = useAuth();

  const { data: portfolio } = useQuery({
    queryKey: ["portfolio", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("portfolios")
        .select("*")
        .eq("user_id", user?.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  return (
    <div className="space-y-6 pb-24">
      <div className="flex items-center gap-3 animate-fade-in">
        <div className="w-12 h-12 rounded-xl bg-gradient-success flex items-center justify-center shadow-glow">
          <TrendingUp className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Trade</h1>
          <p className="text-muted-foreground">Buy and sell stocks with real-time market data</p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trade">Trade Stocks</TabsTrigger>
          <TabsTrigger value="chart">Live Chart</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
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

        <TabsContent value="trade" className="mt-6">
          <StockTrading />
        </TabsContent>

        <TabsContent value="chart" className="mt-6">
          <TradingViewChart />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Trade;

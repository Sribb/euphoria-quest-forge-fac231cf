import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { alphaVantageService } from "@/lib/alphaVantageService";

export const usePortfolioValue = () => {
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

  const { data: portfolioAssets = [] } = useQuery({
    queryKey: ["portfolio-assets", portfolio?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("portfolio_assets")
        .select("*")
        .eq("portfolio_id", portfolio?.id);
      
      if (error) throw error;
      return data;
    },
    enabled: !!portfolio?.id,
  });

  // Fetch live prices for all holdings with longer intervals to avoid rate limits
  const { data: livePrices = {} } = useQuery({
    queryKey: ["live-prices", portfolioAssets.map(a => a.asset_name).join(",")],
    queryFn: async () => {
      if (portfolioAssets.length === 0) return {};
      
      const symbols = portfolioAssets.map(a => a.asset_name);
      const pricesMap = await alphaVantageService.getMultipleQuotes(symbols);
      
      return Object.fromEntries(
        Array.from(pricesMap.entries()).map(([symbol, quote]) => [symbol, quote.price])
      );
    },
    enabled: portfolioAssets.length > 0,
    refetchInterval: 120000, // Refresh every 2 minutes to avoid rate limits
    staleTime: 60000, // Consider data fresh for 1 minute
  });

  // Fetch pending settlements
  const { data: pendingSettlements = [] } = useQuery({
    queryKey: ["pending-settlements", portfolio?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("settlements")
        .select("*")
        .eq("portfolio_id", portfolio?.id)
        .eq("status", "pending");
      
      if (error) throw error;
      return data;
    },
    enabled: !!portfolio?.id,
  });

  // Calculate total portfolio value with live prices
  const calculatePortfolioValue = () => {
    if (!portfolio) return { 
      totalValue: 10000, 
      positionsValue: 0, 
      cash: 10000, 
      unsettledCash: 0,
      buyingPower: 10000,
      unrealizedPnL: 0 
    };

    const cash = Number(portfolio.cash_balance);
    const unsettledCash = Number(portfolio.unsettled_cash || 0);
    let positionsValue = 0;
    let unrealizedPnL = 0;

    portfolioAssets.forEach((asset) => {
      const currentPrice = livePrices[asset.asset_name] || Number(asset.current_price);
      const quantity = Number(asset.quantity);
      const purchasePrice = Number(asset.purchase_price);
      
      const positionValue = currentPrice * quantity;
      const positionCost = purchasePrice * quantity;
      
      positionsValue += positionValue;
      unrealizedPnL += (positionValue - positionCost);
    });

    const totalValue = cash + positionsValue + unsettledCash;
    const buyingPower = cash; // Cash available for trading (excludes unsettled)

    return {
      totalValue,
      positionsValue,
      cash,
      unsettledCash,
      buyingPower,
      unrealizedPnL,
    };
  };

  return {
    portfolio,
    portfolioAssets,
    livePrices,
    pendingSettlements,
    ...calculatePortfolioValue(),
  };
};

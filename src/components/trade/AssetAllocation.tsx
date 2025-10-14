import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const AssetAllocation = () => {
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

  const totalValue = portfolio ? portfolio.total_value : 10000;
  const cashBalance = portfolio ? portfolio.cash_balance : 10000;

  const stocksValue = portfolioAssets.reduce((sum, asset) => {
    return sum + (asset.current_price * asset.quantity);
  }, 0);

  const assets = [
    { 
      name: "Stocks", 
      value: totalValue > 0 ? (stocksValue / totalValue) * 100 : 0, 
      color: "bg-primary", 
      amount: stocksValue 
    },
    { 
      name: "Cash", 
      value: totalValue > 0 ? (cashBalance / totalValue) * 100 : 100, 
      color: "bg-success", 
      amount: cashBalance 
    },
  ].filter(asset => asset.value > 0);

  return (
    <Card className="p-6 animate-fade-in" style={{ animationDelay: "100ms" }}>
      <h3 className="text-lg font-bold mb-4">Asset Allocation</h3>

      <div className="space-y-4">
        {assets.map((asset) => (
          <div key={asset.name} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${asset.color}`} />
                <span className="font-medium">{asset.name}</span>
              </div>
              <div className="text-right">
                <div className="font-bold">{asset.value.toFixed(1)}%</div>
                <div className="text-xs text-muted-foreground">
                  ${asset.amount.toFixed(2)}
                </div>
              </div>
            </div>
            <Progress value={asset.value} className="h-2" />
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gradient-hero rounded-lg">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Risk Level</span>
          <span className="font-bold text-warning">Moderate</span>
        </div>
      </div>
    </Card>
  );
};

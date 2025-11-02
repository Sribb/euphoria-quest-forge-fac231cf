import { Wallet, TrendingUp, Award, PieChart } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface PortfolioHubProps {
  onNavigate: (tab: string) => void;
}

export const PortfolioHub = ({ onNavigate }: PortfolioHubProps) => {
  const { user } = useAuth();

  const { data: portfolioData } = useQuery({
    queryKey: ["portfolio_overview", user?.id],
    queryFn: async () => {
      const { data: portfolio } = await supabase
        .from("portfolios")
        .select("*")
        .eq("user_id", user?.id)
        .single();

      const { data: assets } = await supabase
        .from("portfolio_assets")
        .select("*")
        .eq("portfolio_id", portfolio?.id);

      const totalValue = (portfolio?.total_value || 0) + (portfolio?.cash_balance || 0);
      const cashBalance = portfolio?.cash_balance || 0;
      const assetsCount = assets?.length || 0;
      
      // Calculate returns manually
      const initialValue = 100000; // Starting value
      const returns = totalValue > 0 ? ((totalValue - initialValue) / initialValue) * 100 : 0;

      return {
        totalValue,
        cashBalance,
        assetsCount,
        returns,
      };
    },
    enabled: !!user?.id,
  });

  // Placeholder for certificates - can be connected to actual table later
  const certificates = 0;

  const isPositive = (portfolioData?.returns || 0) >= 0;

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="w-5 h-5 text-primary" />
          Portfolio & Achievements
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-gradient-hero rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Total Value</span>
            <TrendingUp className={`w-4 h-4 ${isPositive ? "text-success" : "text-destructive"}`} />
          </div>
          <p className="text-3xl font-bold">${portfolioData?.totalValue.toFixed(2) || "0.00"}</p>
          <p className={`text-sm font-semibold mt-1 ${isPositive ? "text-success" : "text-destructive"}`}>
            {isPositive ? "+" : ""}{portfolioData?.returns.toFixed(2)}% Returns
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <PieChart className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground">Assets</span>
            </div>
            <p className="text-xl font-bold">{portfolioData?.assetsCount || 0}</p>
          </div>
          <div className="p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Award className="w-4 h-4 text-warning" />
              <span className="text-xs text-muted-foreground">Certificates</span>
            </div>
            <p className="text-xl font-bold">{certificates || 0}</p>
          </div>
        </div>

        <div className="space-y-2">
          <Button 
            className="w-full" 
            onClick={() => onNavigate("trade")}
          >
            View Portfolio
          </Button>
          <Button 
            variant="outline"
            className="w-full" 
            onClick={() => onNavigate("certificates")}
          >
            View Certificates
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

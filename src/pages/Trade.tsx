import { TrendingUp } from "lucide-react";
import { PortfolioSummary } from "@/components/trade/PortfolioSummary";
import { AssetAllocation } from "@/components/trade/AssetAllocation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface TradeProps {
  onNavigate: (tab: string) => void;
}

const Trade = ({ onNavigate }: TradeProps) => {
  return (
    <div className="space-y-6 pb-24">
      <div className="flex items-center gap-3 animate-fade-in">
        <div className="w-12 h-12 rounded-xl bg-gradient-success flex items-center justify-center shadow-glow">
          <TrendingUp className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Trade</h1>
          <p className="text-muted-foreground">Manage your simulated portfolio</p>
        </div>
      </div>

      <PortfolioSummary />
      <AssetAllocation />

      <Card className="p-6 bg-gradient-hero border-0 animate-fade-in" style={{ animationDelay: "200ms" }}>
        <h3 className="text-lg font-bold mb-3">Ready for Real Trading?</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Complete 5 more lessons and maintain a 10-day streak to unlock real investing.
        </p>
        <Button className="w-full bg-gradient-primary hover:opacity-90" disabled>
          Unlock Real Trading
        </Button>
      </Card>
    </div>
  );
};

export default Trade;

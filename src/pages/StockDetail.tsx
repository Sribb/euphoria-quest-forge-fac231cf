import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import TradingViewWidget from "@/shared/components/TradingViewWidget";

interface StockDetailProps {
  symbol: string;
  onBack: () => void;
}

const StockDetail = ({ symbol, onBack }: StockDetailProps) => {

  const { data: stock } = useQuery({
    queryKey: ["stock", symbol],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("stocks")
        .select("*")
        .eq("symbol", symbol)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-6 pb-24 pt-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-semibold">{symbol}</h1>
          <p className="text-muted-foreground">{stock?.name}</p>
        </div>
      </div>

      {stock?.description && (
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">{stock.description}</p>
        </Card>
      )}

      <Card className="p-4">
        <h3 className="font-semibold mb-3">{symbol} Chart</h3>
        <TradingViewWidget 
          symbol={`${stock?.exchange || 'NASDAQ'}:${symbol}`}
          height={610}
        />
      </Card>
    </div>
  );
};

export default StockDetail;

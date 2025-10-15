import { Card } from "@/components/ui/card";
import TradingViewWidget from "@/components/TradingViewWidget";

interface TradingViewChartProps {
  onPriceUpdate?: (data: { price: number; change: number }) => void;
}

export const TradingViewChart = ({ onPriceUpdate }: TradingViewChartProps) => {
  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-3">Live Market Chart</h3>
      <TradingViewWidget symbol="NASDAQ:AAPL" height={500} />
    </Card>
  );
};

import { useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";

interface TradingViewChartProps {
  onPriceUpdate?: (data: { price: number; change: number }) => void;
}

declare global {
  interface Window {
    TradingView: any;
  }
}

export const TradingViewChart = ({ onPriceUpdate }: TradingViewChartProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = () => {
      if (containerRef.current && window.TradingView) {
        new window.TradingView.widget({
          autosize: true,
          symbol: "NASDAQ:AAPL",
          interval: "D",
          timezone: "Etc/UTC",
          theme: "dark",
          style: "1",
          locale: "en",
          toolbar_bg: "#0a0a0f",
          enable_publishing: false,
          backgroundColor: "#0a0a0f",
          gridColor: "rgba(255, 255, 255, 0.06)",
          hide_side_toolbar: false,
          allow_symbol_change: true,
          container_id: "tradingview_widget",
          studies: [
            "STD;SMA",
          ],
        });
      }
    };
    document.head.appendChild(script);

    // Simulate price updates for the insight component
    const interval = setInterval(() => {
      const price = 150 + Math.random() * 20;
      const change = (Math.random() - 0.5) * 4;
      onPriceUpdate?.({ price, change });
    }, 3000);

    return () => {
      clearInterval(interval);
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [onPriceUpdate]);

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-3">Live Market Chart</h3>
      <div id="tradingview_widget" ref={containerRef} style={{ height: "500px" }} />
    </Card>
  );
};

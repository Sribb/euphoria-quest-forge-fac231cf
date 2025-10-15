import { useEffect, useRef } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface StockDetailProps {
  symbol: string;
  onBack: () => void;
}

declare global {
  interface Window {
    TradingView: any;
  }
}

const StockDetail = ({ symbol, onBack }: StockDetailProps) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const overviewRef = useRef<HTMLDivElement>(null);
  const fundamentalRef = useRef<HTMLDivElement>(null);
  const technicalRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const newsRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = () => {
      if (!window.TradingView) return;

      // Advanced Chart
      if (chartRef.current) {
        new window.TradingView.widget({
          autosize: true,
          symbol: `${stock?.exchange}:${symbol}`,
          interval: "D",
          timezone: "Etc/UTC",
          theme: "dark",
          style: "1",
          locale: "en",
          toolbar_bg: "#0a0a0f",
          enable_publishing: false,
          backgroundColor: "#0a0a0f",
          allow_symbol_change: false,
          container_id: "tradingview_chart",
          studies: ["STD;SMA", "STD;MACD"],
        });
      }

      // Symbol Overview
      if (overviewRef.current) {
        new window.TradingView.MiniChart({
          container_id: "tradingview_overview",
          symbol: `${stock?.exchange}:${symbol}`,
          locale: "en",
          width: "100%",
          height: "250",
          colorTheme: "dark",
          isTransparent: false,
        });
      }

      // Fundamental Data
      if (fundamentalRef.current) {
        new window.TradingView.FundamentalData({
          container_id: "tradingview_fundamental",
          symbol: `${stock?.exchange}:${symbol}`,
          colorTheme: "dark",
          isTransparent: false,
          width: "100%",
          height: "400",
          locale: "en",
        });
      }

      // Technical Analysis
      if (technicalRef.current) {
        new window.TradingView.TechnicalAnalysis({
          container_id: "tradingview_technical",
          symbol: `${stock?.exchange}:${symbol}`,
          colorTheme: "dark",
          isTransparent: false,
          width: "100%",
          height: "400",
          locale: "en",
        });
      }

      // Company Profile
      if (profileRef.current) {
        new window.TradingView.CompanyProfile({
          container_id: "tradingview_profile",
          symbol: `${stock?.exchange}:${symbol}`,
          colorTheme: "dark",
          isTransparent: false,
          width: "100%",
          height: "400",
          locale: "en",
        });
      }

      // Timeline (News)
      if (newsRef.current) {
        new window.TradingView.Timeline({
          container_id: "tradingview_news",
          feedMode: "symbol",
          symbol: `${stock?.exchange}:${symbol}`,
          colorTheme: "dark",
          isTransparent: false,
          width: "100%",
          height: "400",
          locale: "en",
        });
      }
    };
    
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [symbol, stock]);

  return (
    <div className="space-y-6 pb-24">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{symbol}</h1>
          <p className="text-muted-foreground">{stock?.name}</p>
        </div>
      </div>

      {stock?.description && (
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">{stock.description}</p>
        </Card>
      )}

      {/* Symbol Overview */}
      <Card className="p-4">
        <h3 className="font-semibold mb-3">Symbol Overview</h3>
        <div id="tradingview_overview" ref={overviewRef} style={{ height: "250px" }} />
      </Card>

      {/* Advanced Chart */}
      <Card className="p-4">
        <h3 className="font-semibold mb-3">Advanced Chart</h3>
        <div id="tradingview_chart" ref={chartRef} style={{ height: "500px" }} />
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Fundamental Data */}
        <Card className="p-4">
          <h3 className="font-semibold mb-3">Fundamental Data</h3>
          <div id="tradingview_fundamental" ref={fundamentalRef} />
        </Card>

        {/* Technical Analysis */}
        <Card className="p-4">
          <h3 className="font-semibold mb-3">Technical Analysis</h3>
          <div id="tradingview_technical" ref={technicalRef} />
        </Card>
      </div>

      {/* Company Profile */}
      <Card className="p-4">
        <h3 className="font-semibold mb-3">Company Profile</h3>
        <div id="tradingview_profile" ref={profileRef} />
      </Card>

      {/* Top Stories */}
      <Card className="p-4">
        <h3 className="font-semibold mb-3">Top Stories</h3>
        <div id="tradingview_news" ref={newsRef} />
      </Card>
    </div>
  );
};

export default StockDetail;

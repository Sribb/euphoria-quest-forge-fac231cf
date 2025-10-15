import { useEffect, useRef, memo } from 'react';

interface TradingViewWidgetProps {
  symbol: string;
  width?: number;
  height?: number;
}

function TradingViewWidget({ symbol, width = 980, height = 610 }: TradingViewWidgetProps) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;
    
    // Clear previous content
    container.current.innerHTML = '';
    
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      allow_symbol_change: true,
      calendar: false,
      details: true,
      hide_side_toolbar: true,
      hide_top_toolbar: false,
      hide_legend: false,
      hide_volume: false,
      hotlist: false,
      interval: "D",
      locale: "en",
      save_image: true,
      style: "1",
      symbol: symbol,
      theme: "dark",
      timezone: "Etc/UTC",
      backgroundColor: "rgba(0, 0, 0, 0)",
      gridColor: "rgba(255, 255, 255, 0.06)",
      watchlist: [],
      withdateranges: false,
      range: "12M",
      compareSymbols: [],
      studies: [],
      width: "100%",
      height: height
    });
    
    container.current.appendChild(script);
  }, [symbol, width, height]);

  return (
    <div className="tradingview-widget-container" ref={container}>
      <div className="tradingview-widget-container__widget"></div>
    </div>
  );
}

export default memo(TradingViewWidget);

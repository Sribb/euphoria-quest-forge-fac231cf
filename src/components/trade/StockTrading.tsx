import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Search, TrendingUp, TrendingDown, ShoppingCart, RefreshCw, Zap } from "lucide-react";
import { OrderDialog } from "@/components/trade/OrderDialog";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { alphaVantageService } from "@/lib/alphaVantageService";
import { usePortfolioValue } from "@/hooks/usePortfolioValue";
import { placeOrder } from "@/lib/orderService";
import { orderSchema, type OrderInput } from "@/lib/orderValidation";
import { OrderManagement } from "@/components/trade/OrderManagement";

const popularStocks = [
  { symbol: "AAPL", name: "Apple Inc.", price: 185.92, change: 2.34, changePercent: 1.27, sector: "Technology" },
  { symbol: "MSFT", name: "Microsoft Corp.", price: 378.91, change: 5.12, changePercent: 1.37, sector: "Technology" },
  { symbol: "GOOGL", name: "Alphabet Inc.", price: 140.23, change: -1.45, changePercent: -1.02, sector: "Technology" },
  { symbol: "AMZN", name: "Amazon.com Inc.", price: 153.45, change: 3.21, changePercent: 2.14, sector: "Consumer" },
  { symbol: "TSLA", name: "Tesla Inc.", price: 248.67, change: -4.32, changePercent: -1.71, sector: "Automotive" },
  { symbol: "NVDA", name: "NVIDIA Corp.", price: 495.22, change: 12.45, changePercent: 2.58, sector: "Technology" },
  { symbol: "META", name: "Meta Platforms", price: 352.78, change: 6.89, changePercent: 1.99, sector: "Technology" },
  { symbol: "JPM", name: "JPMorgan Chase", price: 168.45, change: 1.23, changePercent: 0.73, sector: "Financial" },
];

export const StockTrading = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedStock, setSelectedStock] = useState(popularStocks[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [liveSymbol, setLiveSymbol] = useState("AAPL");
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [dialogStock, setDialogStock] = useState<any>(null);
  const { portfolio, portfolioAssets, livePrices, buyingPower, unsettledCash } = usePortfolioValue();

  const { data: liveQuote, isLoading: quoteLoading } = useQuery({
    queryKey: ["stockQuote", liveSymbol],
    queryFn: () => alphaVantageService.getGlobalQuote(liveSymbol),
    enabled: !!liveSymbol,
    refetchInterval: 60000,
    retry: 1,
  });

  const handleSearchLive = async () => {
    if (!searchQuery || searchQuery.length < 1) return;
    
    try {
      const results = await alphaVantageService.searchSymbol(searchQuery);
      if (results.length > 0) {
        setLiveSymbol(results[0].symbol);
        toast.success(`Found: ${results[0].name}`);
      } else {
        toast.error("No stocks found");
      }
    } catch (error) {
      toast.error("Search failed");
    }
  };

  const filteredStocks = searchQuery
    ? popularStocks.filter(
        (stock) =>
          stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
          stock.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : popularStocks;

  const openOrderDialog = (stock: any) => {
    setDialogStock(stock);
    setOrderDialogOpen(true);
  };

  const handleQuickBuy = async (stock: any) => {
    openOrderDialog(stock);
  };

  const handleSellStock = (asset: any) => {
    const currentPrice = livePrices[asset.asset_name] || Number(asset.current_price);
    openOrderDialog({
      symbol: asset.asset_name,
      name: asset.asset_type,
      price: currentPrice,
    });
  };

  const getCurrentHolding = (symbol: string) => {
    const asset = portfolioAssets.find(a => a.asset_name === symbol);
    return asset ? Number(asset.quantity) : 0;
  };

  return (
    <>
      {dialogStock && (
        <OrderDialog
          open={orderDialogOpen}
          onOpenChange={setOrderDialogOpen}
          stock={dialogStock}
          userId={user?.id || ''}
          portfolioId={portfolio?.id || ''}
          buyingPower={buyingPower}
          unsettledCash={unsettledCash}
          currentHolding={getCurrentHolding(dialogStock.symbol)}
        />
      )}

      <Tabs defaultValue="buy" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6 smooth-transition">
          <TabsTrigger value="buy" className="smooth-transition">Buy Stocks</TabsTrigger>
          <TabsTrigger value="positions" className="smooth-transition">Positions</TabsTrigger>
          <TabsTrigger value="orders" className="smooth-transition">Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="buy" className="space-y-6 animate-fade-in">
          {liveQuote && (
            <Card className="p-6 bg-gradient-hero border-0 animate-scale-in smooth-transition">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold">{liveSymbol}</h3>
              <p className="text-sm text-muted-foreground">Live Market Data</p>
            </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => queryClient.invalidateQueries({ queryKey: ["stockQuote", liveSymbol] })}
                disabled={quoteLoading}
                className="smooth-transition hover-scale"
              >
                <RefreshCw className={`w-4 h-4 ${quoteLoading ? "animate-spin" : ""}`} />
              </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Price</p>
              <p className="text-3xl font-bold">${liveQuote.price.toFixed(2)}</p>
            </div>
            <div className={`text-right ${liveQuote.change >= 0 ? "text-success" : "text-destructive"}`}>
              <p className="text-sm">Change</p>
              <p className="text-xl font-bold">
                {liveQuote.change >= 0 ? "+" : ""}{liveQuote.change.toFixed(2)} ({liveQuote.changePercent.toFixed(2)}%)
              </p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3 mt-4 text-sm">
            <div>
              <p className="text-muted-foreground">Open</p>
              <p className="font-bold">${liveQuote.open.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">High</p>
              <p className="font-bold">${liveQuote.high.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Low</p>
              <p className="font-bold">${liveQuote.low.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Volume</p>
              <p className="font-bold">{(liveQuote.volume / 1000000).toFixed(2)}M</p>
            </div>
          </div>

            <div className="flex gap-2 mt-4">
              <Input
                placeholder="Search live data (e.g., AAPL)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearchLive()}
                className="smooth-transition"
              />
              <Button onClick={handleSearchLive} className="smooth-transition hover-scale">
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        )}

        <Card className="p-6 animate-fade-in" style={{ animationDelay: "100ms" }}>
          <div className="flex items-center gap-3 mb-4">
            <ShoppingCart className="w-6 h-6 text-primary" />
            <h3 className="text-xl font-bold">Available Stocks</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6 max-h-[400px] overflow-y-auto">
            {filteredStocks.map((stock, index) => {
              const isPositive = stock.change >= 0;
              
              return (
                <div
                  key={stock.symbol}
                  className="p-4 rounded-lg border border-border hover:border-primary/50 smooth-transition hover-scale animate-fade-in cursor-pointer"
                  style={{ animationDelay: `${index * 50}ms` }}
                  onClick={() => setSelectedStock(stock)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold">{stock.symbol}</h4>
                        <Badge variant="outline" className="text-xs">
                          {stock.sector}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{stock.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <div className="text-2xl font-bold">${stock.price.toFixed(2)}</div>
                    <div className={`flex items-center gap-1 ${isPositive ? "text-success" : "text-destructive"}`}>
                      {isPositive ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      <span className="text-sm font-semibold">
                        {isPositive ? "+" : ""}{stock.changePercent.toFixed(2)}%
                      </span>
                    </div>
                  </div>

                  <Button 
                    className="w-full bg-gradient-primary smooth-transition hover-scale"
                    onClick={() => handleQuickBuy(stock)}
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Trade {stock.symbol}
                  </Button>
                </div>
              );
            })}
          </div>
        </Card>
      </TabsContent>

        <TabsContent value="orders" className="space-y-4 animate-fade-in">
          <OrderManagement />
        </TabsContent>

        <TabsContent value="positions" className="space-y-4 animate-fade-in">
          {portfolioAssets.length === 0 ? (
            <Card className="p-8 text-center animate-fade-in">
              <p className="text-muted-foreground">No positions yet. Start trading to build your portfolio!</p>
            </Card>
          ) : (
            portfolioAssets.map((asset, index) => {
            const currentPrice = livePrices[asset.asset_name] || Number(asset.current_price);
            const purchasePrice = Number(asset.purchase_price);
            const quantity = Number(asset.quantity);
            const positionValue = currentPrice * quantity;
            const costBasis = purchasePrice * quantity;
            const unrealizedPnL = positionValue - costBasis;
            const pnlPercent = (unrealizedPnL / costBasis) * 100;
            const isProfitable = unrealizedPnL >= 0;

              return (
                <Card key={asset.id} className="p-6 animate-fade-in smooth-transition hover:border-primary/50" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold">{asset.asset_name}</h3>
                    <p className="text-sm text-muted-foreground">{asset.asset_type}</p>
                  </div>
                  <Badge variant={isProfitable ? "default" : "destructive"}>
                    {isProfitable ? "+" : ""}{pnlPercent.toFixed(2)}%
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Quantity</p>
                    <p className="text-lg font-bold">{quantity}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Current Price</p>
                    <p className="text-lg font-bold">${currentPrice.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Purchase Price</p>
                    <p className="text-lg font-bold">${purchasePrice.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Position Value</p>
                    <p className="text-lg font-bold">${positionValue.toFixed(2)}</p>
                  </div>
                </div>

                <div className={`p-4 rounded-lg mb-4 ${isProfitable ? "bg-success/10" : "bg-destructive/10"}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Unrealized P&L</span>
                    <div className="text-right">
                      <p className={`text-lg font-bold ${isProfitable ? "text-success" : "text-destructive"}`}>
                        {isProfitable ? "+" : ""}${unrealizedPnL.toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Cost: ${costBasis.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                <Button 
                  className="w-full bg-gradient-primary smooth-transition hover-scale"
                  onClick={() => handleSellStock(asset)}
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Trade {asset.asset_name}
                </Button>
              </Card>
            );
          })
        )}
      </TabsContent>
    </Tabs>
  </>
  );
};

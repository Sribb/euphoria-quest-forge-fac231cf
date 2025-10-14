import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, TrendingUp, TrendingDown, DollarSign, ShoppingCart, Wallet } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useQueryClient } from "@tanstack/react-query";

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
  const [quantity, setQuantity] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

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

  const filteredStocks = searchQuery
    ? popularStocks.filter(
        (stock) =>
          stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
          stock.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : popularStocks;

  const totalCost = selectedStock.price * quantity;
  const canAfford = portfolio && totalCost <= portfolio.cash_balance;

  const handleBuyStock = async () => {
    if (!user || !portfolio || !canAfford) {
      toast.error("Insufficient funds");
      return;
    }

    try {
      // Update cash balance
      const newCashBalance = portfolio.cash_balance - totalCost;
      const { error: portfolioError } = await supabase
        .from("portfolios")
        .update({ 
          cash_balance: newCashBalance,
          total_value: portfolio.total_value + totalCost,
          updated_at: new Date().toISOString()
        })
        .eq("id", portfolio.id);

      if (portfolioError) throw portfolioError;

      // Check if asset already exists
      const { data: existingAsset } = await supabase
        .from("portfolio_assets")
        .select("*")
        .eq("portfolio_id", portfolio.id)
        .eq("asset_name", selectedStock.symbol)
        .single();

      if (existingAsset) {
        // Update existing asset
        const newQuantity = existingAsset.quantity + quantity;
        const avgPrice = ((existingAsset.purchase_price * existingAsset.quantity) + (selectedStock.price * quantity)) / newQuantity;
        
        const { error: assetError } = await supabase
          .from("portfolio_assets")
          .update({
            quantity: newQuantity,
            purchase_price: avgPrice,
            current_price: selectedStock.price,
            updated_at: new Date().toISOString()
          })
          .eq("id", existingAsset.id);

        if (assetError) throw assetError;
      } else {
        // Create new asset
        const { error: assetError } = await supabase
          .from("portfolio_assets")
          .insert({
            portfolio_id: portfolio.id,
            asset_name: selectedStock.symbol,
            asset_type: "Stock",
            quantity: quantity,
            purchase_price: selectedStock.price,
            current_price: selectedStock.price,
          });

        if (assetError) throw assetError;
      }

      toast.success(`Purchased ${quantity} shares of ${selectedStock.symbol}`);
      queryClient.invalidateQueries({ queryKey: ["portfolio"] });
      setQuantity(1);
    } catch (error) {
      console.error("Error buying stock:", error);
      toast.error("Failed to purchase stock");
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <ShoppingCart className="w-6 h-6 text-primary" />
          <h3 className="text-xl font-bold">Buy Stocks</h3>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search stocks by symbol or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6 max-h-[400px] overflow-y-auto">
          {filteredStocks.map((stock) => {
            const isPositive = stock.change >= 0;
            const isSelected = selectedStock.symbol === stock.symbol;
            
            return (
              <div
                key={stock.symbol}
                onClick={() => setSelectedStock(stock)}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold">{stock.symbol}</h4>
                      <Badge variant="outline" className="text-xs">
                        {stock.sector}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{stock.name}</p>
                  </div>
                  {isSelected && (
                    <Badge variant="default" className="text-xs">
                      Selected
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between">
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
              </div>
            );
          })}
        </div>
      </Card>

      <Card className="p-6 bg-gradient-hero border-0">
        <h3 className="text-lg font-bold mb-4">Order Details</h3>

        <div className="space-y-4">
          <div className="p-4 bg-card rounded-lg">
            <p className="text-sm text-muted-foreground mb-2">Selected Stock</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-lg">{selectedStock.symbol}</p>
                <p className="text-sm text-muted-foreground">{selectedStock.name}</p>
              </div>
              <p className="text-2xl font-bold">${selectedStock.price.toFixed(2)}</p>
            </div>
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Quantity</label>
            <Input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="text-lg font-semibold"
            />
          </div>

          <div className="p-4 bg-card rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Price per share</span>
              <span className="font-semibold">${selectedStock.price.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Quantity</span>
              <span className="font-semibold">{quantity}</span>
            </div>
            <div className="h-px bg-border my-2" />
            <div className="flex items-center justify-between text-lg">
              <span className="font-bold">Total Cost</span>
              <span className="font-bold text-primary">${totalCost.toFixed(2)}</span>
            </div>
          </div>

          {portfolio && (
            <div className="p-4 bg-card rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Wallet className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Available Cash</span>
              </div>
              <p className="text-2xl font-bold">
                ${portfolio.cash_balance.toLocaleString()}
              </p>
              {!canAfford && (
                <p className="text-sm text-destructive mt-2">Insufficient funds</p>
              )}
            </div>
          )}

          <Button
            onClick={handleBuyStock}
            disabled={!canAfford || !portfolio}
            className="w-full text-lg py-6 bg-gradient-primary hover:opacity-90"
          >
            <DollarSign className="w-5 h-5 mr-2" />
            Buy {quantity} {quantity === 1 ? "Share" : "Shares"}
          </Button>
        </div>
      </Card>
    </div>
  );
};

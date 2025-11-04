import { useState } from "react";
import { Search, TrendingUp, ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";

interface StockSearchProps {
  onNavigate: (tab: string) => void;
  onSelectStock: (symbol: string) => void;
  onBack: () => void;
}

const StockSearch = ({ onNavigate, onSelectStock, onBack }: StockSearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: stocks = [], isLoading } = useQuery({
    queryKey: ["stocks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("stocks")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data;
    },
  });

  const filteredStocks = stocks.filter(
    (stock) =>
      stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-24 pt-4">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="shrink-0"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Stock Search</h1>
          <p className="text-muted-foreground">Find and analyze individual stocks</p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="Search by symbol or company name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-card animate-pulse rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredStocks.map((stock) => (
            <Card
              key={stock.id}
              className="p-4 cursor-pointer hover:bg-accent/50 transition-colors"
              onClick={() => onSelectStock(stock.symbol)}
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="font-bold text-lg">{stock.symbol}</h3>
                  <p className="text-sm text-muted-foreground">{stock.name}</p>
                </div>
                <TrendingUp className="w-5 h-5 text-success" />
              </div>
              <div className="flex gap-2">
                <Badge variant="secondary">{stock.exchange}</Badge>
                {stock.sector && <Badge variant="outline">{stock.sector}</Badge>}
              </div>
            </Card>
          ))}
          {filteredStocks.length === 0 && (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No stocks found matching your search</p>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default StockSearch;

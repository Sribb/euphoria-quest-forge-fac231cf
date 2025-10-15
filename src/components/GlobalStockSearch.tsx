import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";

interface GlobalStockSearchProps {
  onSelectStock: (symbol: string) => void;
}

export const GlobalStockSearch = ({ onSelectStock }: GlobalStockSearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);

  const { data: stocks = [] } = useQuery({
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

  const filteredStocks = searchQuery
    ? stocks.filter(
        (stock) =>
          stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
          stock.name.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  return (
    <div className="relative flex-1 max-w-md">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <Input
        placeholder="Search the markets"
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          setShowResults(true);
        }}
        onFocus={() => setShowResults(true)}
        onBlur={() => setTimeout(() => setShowResults(false), 200)}
        className="pl-9"
      />
      {showResults && filteredStocks.length > 0 && (
        <Card className="absolute top-full mt-2 w-full z-50 max-h-64 overflow-y-auto">
          {filteredStocks.map((stock) => (
            <div
              key={stock.id}
              className="p-3 hover:bg-accent cursor-pointer border-b last:border-0"
              onClick={() => {
                onSelectStock(stock.symbol);
                setSearchQuery("");
                setShowResults(false);
              }}
            >
              <div className="font-semibold">{stock.symbol}</div>
              <div className="text-sm text-muted-foreground">{stock.name}</div>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
};

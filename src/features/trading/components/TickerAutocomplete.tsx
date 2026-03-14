import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Search } from "lucide-react";

interface TickerAutocompleteProps {
  value: string;
  onChange: (symbol: string, name: string) => void;
  placeholder?: string;
}

export const TickerAutocomplete = ({ value, onChange, placeholder = "Search ticker..." }: TickerAutocompleteProps) => {
  const [query, setQuery] = useState(value);
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { data: stocks = [] } = useQuery({
    queryKey: ["stocks-list"],
    queryFn: async () => {
      const { data, error } = await supabase.from("stocks").select("symbol, name").order("symbol");
      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 10,
  });

  const filtered = query.length > 0
    ? stocks.filter(
        (s) =>
          s.symbol.toLowerCase().includes(query.toLowerCase()) ||
          s.name.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 6)
    : [];

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
        <Input
          placeholder={placeholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value.toUpperCase());
            setOpen(true);
          }}
          onFocus={() => query.length > 0 && setOpen(true)}
          className="pl-8 font-mono text-sm"
          maxLength={10}
        />
      </div>
      {open && filtered.length > 0 && (
        <div className="absolute top-full mt-1 w-full z-50 bg-popover border border-border rounded-lg shadow-lg overflow-hidden">
          {filtered.map((stock) => (
            <button
              key={stock.symbol}
              type="button"
              className="w-full text-left px-3 py-2 hover:bg-accent transition-colors flex items-center justify-between gap-2"
              onMouseDown={(e) => {
                e.preventDefault();
                onChange(stock.symbol, stock.name);
                setQuery(stock.symbol);
                setOpen(false);
              }}
            >
              <span className="font-mono font-semibold text-sm">{stock.symbol}</span>
              <span className="text-xs text-muted-foreground truncate">{stock.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

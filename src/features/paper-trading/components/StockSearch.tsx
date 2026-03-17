import { useState, useCallback } from "react";
import { searchSymbol, SearchResult } from "@/lib/finnhub";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Props { onSelect: (symbol: string) => void; }

export const StockSearchBar = ({ onSelect }: Props) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const debounceRef = useCallback(() => {
    let timer: NodeJS.Timeout;
    return (q: string) => {
      clearTimeout(timer);
      if (q.length < 1) { setResults([]); setOpen(false); return; }
      timer = setTimeout(async () => {
        setLoading(true);
        try {
          const r = await searchSymbol(q);
          setResults(r);
          setOpen(r.length > 0);
        } catch { setResults([]); }
        setLoading(false);
      }, 500);
    };
  }, [])();

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search any stock, ETF..."
          value={query}
          onChange={(e) => { setQuery(e.target.value); debounceRef(e.target.value); }}
          onFocus={() => results.length > 0 && setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 200)}
          className="pl-9 bg-card/60 border-border"
        />
        {loading && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-muted-foreground" />}
      </div>
      {open && (
        <div className="absolute z-50 top-full mt-1 left-0 right-0 bg-card border border-border rounded-xl shadow-xl max-h-64 overflow-y-auto">
          {results.map((r) => (
            <button
              key={r.symbol}
              onClick={() => { onSelect(r.symbol); setOpen(false); setQuery(""); }}
              className="w-full px-4 py-3 flex items-center gap-3 hover:bg-muted/50 transition-colors text-left"
            >
              <span className="font-bold text-foreground text-sm">{r.symbol}</span>
              <span className="text-xs text-muted-foreground truncate flex-1">{r.description}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary">Stock</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

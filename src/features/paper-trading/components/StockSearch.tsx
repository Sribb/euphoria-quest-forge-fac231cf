import { useState, useCallback } from "react";
import { searchSymbol, SearchResult } from "@/lib/finnhub";
import { Search, Loader2 } from "lucide-react";

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
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          placeholder="Search any stock, ETF..."
          value={query}
          onChange={(e) => { setQuery(e.target.value); debounceRef(e.target.value); }}
          onFocus={() => results.length > 0 && setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 200)}
          className="w-full h-11 pl-10 pr-10 bg-muted/20 border border-border/40 rounded-[12px] text-sm placeholder:text-muted-foreground/60 outline-none focus:border-primary/40 focus:bg-muted/30 transition-all"
        />
        {loading && <Loader2 className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-muted-foreground" />}
      </div>
      {open && (
        <div className="absolute z-50 top-full mt-1.5 left-0 right-0 bg-card border border-border/50 rounded-[12px] shadow-2xl max-h-72 overflow-y-auto">
          {results.map((r) => (
            <button
              key={r.symbol}
              onClick={() => { onSelect(r.symbol); setOpen(false); setQuery(""); }}
              className="w-full px-4 py-3 flex items-center gap-3 hover:bg-muted/30 transition-colors text-left first:rounded-t-[12px] last:rounded-b-[12px]"
            >
              <span className="font-bold text-foreground text-sm">{r.symbol}</span>
              <span className="text-xs text-muted-foreground truncate flex-1">{r.description}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-[6px] bg-primary/10 text-primary font-semibold">Stock</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
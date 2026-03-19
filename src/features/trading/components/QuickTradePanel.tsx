import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePaperTrading } from "@/hooks/usePaperTrading";
import { Search, ArrowUpRight, ArrowDownRight, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { getQuote } from "@/lib/finnhub";
import { formatDollar } from "@/lib/formatters";

type OrderType = "market" | "limit";

export const QuickTradePanel = () => {
  const { buy, sell, isBuying, isSelling, data } = usePaperTrading();
  const [symbol, setSymbol] = useState("");
  const [shares, setShares] = useState("");
  const [side, setSide] = useState<"BUY" | "SELL">("BUY");
  const [orderType, setOrderType] = useState<OrderType>("market");
  const [limitPrice, setLimitPrice] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const cleanSymbol = symbol.trim().toUpperCase();

  const { data: quote } = useQuery({
    queryKey: ["quote", cleanSymbol],
    queryFn: () => getQuote(cleanSymbol),
    enabled: cleanSymbol.length >= 1 && cleanSymbol.length <= 5,
    staleTime: 30000,
  });

  const price = quote?.c ?? 0;
  const total = price * Number(shares || 0);
  const canTrade = cleanSymbol && Number(shares) > 0 && price > 0;

  const holding = data.paper_holdings[cleanSymbol];

  const handleSubmit = () => {
    if (!canTrade) return;
    if (!showConfirm) {
      setShowConfirm(true);
      return;
    }
    if (side === "BUY") {
      buy({ symbol: cleanSymbol, shares: Number(shares) });
    } else {
      sell({ symbol: cleanSymbol, shares: Number(shares) });
    }
    setShowConfirm(false);
    setSymbol("");
    setShares("");
  };

  return (
    <Card className="p-6 border border-border/50 bg-card/60 backdrop-blur-sm">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-4">Quick Trade</h3>

      {/* Side toggle */}
      <div className="flex gap-1 p-1 bg-muted/40 rounded-lg mb-4">
        <button
          onClick={() => { setSide("BUY"); setShowConfirm(false); }}
          className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${
            side === "BUY"
              ? "bg-success/15 text-success shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <ArrowUpRight className="w-3.5 h-3.5 inline mr-1" />Buy
        </button>
        <button
          onClick={() => { setSide("SELL"); setShowConfirm(false); }}
          className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${
            side === "SELL"
              ? "bg-destructive/15 text-destructive shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <ArrowDownRight className="w-3.5 h-3.5 inline mr-1" />Sell
        </button>
      </div>

      {/* Symbol */}
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Symbol (e.g. AAPL)"
          value={symbol}
          onChange={(e) => { setSymbol(e.target.value); setShowConfirm(false); }}
          className="pl-9 bg-muted/30 border-border/40 text-sm font-mono uppercase"
        />
      </div>

      {/* Price display */}
      {price > 0 && cleanSymbol && (
        <div className="flex items-center justify-between px-1 mb-3">
          <span className="text-xs text-muted-foreground">Price</span>
          <span className="text-sm font-bold text-foreground">{formatDollar(price, 2)}</span>
        </div>
      )}

      {/* Order type */}
      <div className="flex gap-1 p-0.5 bg-muted/30 rounded-md mb-3">
        {(["market", "limit"] as OrderType[]).map((t) => (
          <button
            key={t}
            onClick={() => setOrderType(t)}
            className={`flex-1 py-1.5 text-[11px] font-semibold rounded capitalize transition-all ${
              orderType === t ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {orderType === "limit" && (
        <Input
          type="number"
          placeholder="Limit price"
          value={limitPrice}
          onChange={(e) => setLimitPrice(e.target.value)}
          className="mb-3 bg-muted/30 border-border/40 text-sm"
        />
      )}

      {/* Shares */}
      <Input
        type="number"
        placeholder="Shares"
        value={shares}
        onChange={(e) => { setShares(e.target.value); setShowConfirm(false); }}
        className="mb-3 bg-muted/30 border-border/40 text-sm"
        min={1}
      />

      {/* Order summary */}
      {canTrade && (
        <div className="flex items-center justify-between px-1 mb-4">
          <span className="text-xs text-muted-foreground">Est. Total</span>
          <span className="text-sm font-bold text-foreground">{formatDollar(total, 2)}</span>
        </div>
      )}

      {holding && side === "SELL" && (
        <p className="text-[11px] text-muted-foreground mb-3">
          You hold {holding.shares} shares @ avg {formatDollar(holding.avgCost, 2)}
        </p>
      )}

      <AnimatePresence mode="wait">
        {showConfirm ? (
          <motion.div
            key="confirm"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="space-y-2"
          >
            <p className="text-xs text-center text-muted-foreground">
              {side} {shares} {cleanSymbol} @ {formatDollar(price, 2)}?
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowConfirm(false)}
                className="flex-1 text-xs"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSubmit}
                disabled={isBuying || isSelling}
                className={`flex-1 text-xs ${
                  side === "BUY"
                    ? "bg-success hover:bg-success/90 text-success-foreground"
                    : "bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                }`}
              >
                {(isBuying || isSelling) && <Loader2 className="w-3 h-3 mr-1 animate-spin" />}
                Confirm {side}
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div key="submit" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Button
              onClick={handleSubmit}
              disabled={!canTrade}
              className={`w-full text-xs font-bold ${
                side === "BUY"
                  ? "bg-success hover:bg-success/90 text-success-foreground"
                  : "bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              }`}
            >
              Review {side} Order
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

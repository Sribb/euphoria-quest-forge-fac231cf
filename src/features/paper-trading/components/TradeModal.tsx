import { useState } from "react";
import { Button } from "@/components/ui/button";
import { usePaperTrading } from "@/hooks/usePaperTrading";
import { Minus, Plus, X } from "lucide-react";

interface Props {
  symbol: string;
  initialMode: "BUY" | "SELL";
  currentPrice: number;
  onClose: () => void;
}

export const TradeModal = ({ symbol, initialMode, currentPrice, onClose }: Props) => {
  const [mode, setMode] = useState(initialMode);
  const [shares, setShares] = useState(1);
  const { data, buy, sell, isBuying, isSelling } = usePaperTrading();

  const total = shares * currentPrice;
  const ownedShares = data.paper_holdings[symbol]?.shares ?? 0;

  const insufficientFunds = mode === "BUY" && total > data.paper_cash;
  const notEnoughShares = mode === "SELL" && shares > ownedShares;
  const invalid = shares <= 0 || insufficientFunds || notEnoughShares;

  const handleConfirm = () => {
    if (mode === "BUY") buy({ symbol, shares }, { onSuccess: onClose });
    else sell({ symbol, shares }, { onSuccess: onClose });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60" onClick={onClose}>
      <div className="w-full max-w-lg bg-card border-t border-border rounded-t-2xl p-6 space-y-5 animate-slide-up" onClick={e => e.stopPropagation()}>
        {/* Handle */}
        <div className="flex justify-center"><div className="w-10 h-1 rounded-full bg-muted-foreground/30" /></div>
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">{mode} {symbol}</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">${currentPrice.toFixed(2)}</span>
            <Button variant="ghost" size="icon" onClick={onClose} className="w-8 h-8"><X className="w-4 h-4" /></Button>
          </div>
        </div>

        {/* Mode Toggle */}
        <div className="flex gap-1 bg-muted/50 rounded-lg p-1">
          <button onClick={() => setMode("BUY")} className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${mode === "BUY" ? 'bg-success text-white' : 'text-muted-foreground'}`}>Buy</button>
          <button onClick={() => setMode("SELL")} className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${mode === "SELL" ? 'bg-destructive text-white' : 'text-muted-foreground'}`}>Sell</button>
        </div>

        {/* Shares Input */}
        <div className="flex items-center justify-center gap-6">
          <Button variant="outline" size="icon" onClick={() => setShares(Math.max(1, shares - 1))} className="w-12 h-12 rounded-full"><Minus className="w-5 h-5" /></Button>
          <div className="text-center">
            <input
              type="number"
              value={shares}
              onChange={(e) => setShares(Math.max(0, parseInt(e.target.value) || 0))}
              className="text-4xl font-bold bg-transparent text-center w-24 outline-none"
              min={1}
            />
            <div className="text-xs text-muted-foreground">shares</div>
          </div>
          <Button variant="outline" size="icon" onClick={() => setShares(shares + 1)} className="w-12 h-12 rounded-full"><Plus className="w-5 h-5" /></Button>
        </div>

        {/* Calculated Display */}
        <div className="space-y-1.5 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">Estimated {mode === "BUY" ? "Cost" : "Proceeds"}</span><span className="font-semibold">${total.toFixed(2)}</span></div>
          {mode === "BUY" ? (
            <div className="flex justify-between"><span className="text-muted-foreground">Available Cash</span><span className="font-semibold">${data.paper_cash.toFixed(2)}</span></div>
          ) : (
            <div className="flex justify-between"><span className="text-muted-foreground">Shares Owned</span><span className="font-semibold">{ownedShares}</span></div>
          )}
          <div className="flex justify-between"><span className="text-muted-foreground">Order Type</span><span>Market Order</span></div>
        </div>

        {/* Warnings */}
        {insufficientFunds && <p className="text-destructive text-sm font-medium">⚠ Insufficient funds</p>}
        {notEnoughShares && <p className="text-destructive text-sm font-medium">⚠ Not enough shares</p>}

        {/* Confirm */}
        <Button
          onClick={handleConfirm}
          disabled={invalid || isBuying || isSelling}
          className={`w-full py-6 text-base font-bold ${mode === "BUY" ? 'bg-success hover:bg-success/90' : 'bg-destructive hover:bg-destructive/90'} text-white`}
        >
          {isBuying || isSelling ? "Processing..." : `${mode} ${shares} share${shares !== 1 ? 's' : ''} for $${total.toFixed(2)}`}
        </Button>
      </div>
    </div>
  );
};

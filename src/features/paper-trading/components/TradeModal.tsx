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
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-lg bg-card border-t border-border/50 rounded-t-[20px] p-6 space-y-5"
        style={{ animation: 'slideUp 0.3s ease-out' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="flex justify-center">
          <div className="w-10 h-1 rounded-full bg-muted-foreground/20" />
        </div>
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">{mode} {symbol}</h2>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground font-medium tabular-nums">${currentPrice.toFixed(2)}</span>
            <button onClick={onClose} className="w-8 h-8 rounded-[8px] flex items-center justify-center hover:bg-muted/60 transition-colors">
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Mode Toggle */}
        <div className="flex gap-1 bg-muted/30 rounded-[10px] p-1 border border-border/40">
          <button
            onClick={() => setMode("BUY")}
            className={`flex-1 py-2.5 rounded-[8px] text-sm font-semibold transition-all ${
              mode === "BUY" ? 'bg-emerald-500 text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Buy
          </button>
          <button
            onClick={() => setMode("SELL")}
            className={`flex-1 py-2.5 rounded-[8px] text-sm font-semibold transition-all ${
              mode === "SELL" ? 'bg-destructive text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Sell
          </button>
        </div>

        {/* Shares Input */}
        <div className="flex items-center justify-center gap-8 py-2">
          <button
            onClick={() => setShares(Math.max(1, shares - 1))}
            className="w-12 h-12 rounded-[12px] border border-border/50 flex items-center justify-center hover:bg-muted/40 transition-colors"
          >
            <Minus className="w-5 h-5 text-muted-foreground" />
          </button>
          <div className="text-center">
            <input
              type="number"
              value={shares}
              onChange={(e) => setShares(Math.max(0, parseInt(e.target.value) || 0))}
              className="text-4xl font-bold bg-transparent text-center w-24 outline-none tabular-nums"
              min={1}
            />
            <div className="text-xs text-muted-foreground mt-1">shares</div>
          </div>
          <button
            onClick={() => setShares(shares + 1)}
            className="w-12 h-12 rounded-[12px] border border-border/50 flex items-center justify-center hover:bg-muted/40 transition-colors"
          >
            <Plus className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Calculated Display */}
        <div className="space-y-2 text-sm bg-muted/15 rounded-[12px] p-4 border border-border/30">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Estimated {mode === "BUY" ? "Cost" : "Proceeds"}</span>
            <span className="font-bold tabular-nums">${total.toFixed(2)}</span>
          </div>
          {mode === "BUY" ? (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Available Cash</span>
              <span className="font-semibold tabular-nums">${data.paper_cash.toFixed(2)}</span>
            </div>
          ) : (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shares Owned</span>
              <span className="font-semibold tabular-nums">{ownedShares}</span>
            </div>
          )}
          <div className="flex justify-between border-t border-border/30 pt-2 mt-1">
            <span className="text-muted-foreground">Order Type</span>
            <span className="font-medium">Market Order</span>
          </div>
        </div>

        {/* Warnings */}
        {insufficientFunds && (
          <div className="text-destructive text-sm font-medium bg-destructive/10 rounded-[8px] px-3 py-2 border border-destructive/20">
            ⚠ Insufficient funds
          </div>
        )}
        {notEnoughShares && (
          <div className="text-destructive text-sm font-medium bg-destructive/10 rounded-[8px] px-3 py-2 border border-destructive/20">
            ⚠ Not enough shares
          </div>
        )}

        {/* Confirm */}
        <Button
          onClick={handleConfirm}
          disabled={invalid || isBuying || isSelling}
          className={`w-full h-[52px] text-base font-bold rounded-[12px] transition-all ${
            mode === "BUY"
              ? 'bg-emerald-500 hover:bg-emerald-400 shadow-lg shadow-emerald-500/20'
              : 'bg-destructive hover:bg-destructive/90 shadow-lg shadow-destructive/20'
          } text-white`}
        >
          {isBuying || isSelling ? "Processing..." : `${mode} ${shares} share${shares !== 1 ? 's' : ''} for $${total.toFixed(2)}`}
        </Button>
      </div>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { getQuote } from "@/lib/finnhub";
import { v4 as uuid } from "crypto";

export interface PaperHolding {
  shares: number;
  avgCost: number;
}

export interface PaperTrade {
  id: string;
  symbol: string;
  type: "BUY" | "SELL";
  shares: number;
  price: number;
  total: number;
  timestamp: string;
  pnl?: number;
}

export interface PaperTradingData {
  paper_cash: number;
  paper_holdings: Record<string, PaperHolding>;
  paper_trades: PaperTrade[];
}

function genId() {
  return crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export const usePaperTrading = () => {
  const { user } = useAuth();
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["paper-trading", user?.id],
    queryFn: async (): Promise<PaperTradingData> => {
      if (!user?.id) return { paper_cash: 10000, paper_holdings: {}, paper_trades: [] };
      const { data, error } = await supabase
        .from("paper_trading")
        .select("paper_cash, paper_holdings, paper_trades")
        .eq("user_id", user.id)
        .maybeSingle();
      if (error) throw error;
      if (!data) return { paper_cash: 10000, paper_holdings: {}, paper_trades: [] };
      return {
        paper_cash: data.paper_cash as number,
        paper_holdings: (data.paper_holdings || {}) as Record<string, PaperHolding>,
        paper_trades: (data.paper_trades || []) as PaperTrade[],
      };
    },
    enabled: !!user?.id,
  });

  const save = async (d: PaperTradingData) => {
    if (!user?.id) return;
    const { error } = await supabase.rpc("update_paper_portfolio", {
      p_user_id: user.id,
      p_cash: d.paper_cash,
      p_holdings: d.paper_holdings as any,
      p_trades: d.paper_trades as any,
    });
    if (error) throw error;
  };

  const buyMutation = useMutation({
    mutationFn: async ({ symbol, shares }: { symbol: string; shares: number }) => {
      if (!data || !user?.id) throw new Error("Not ready");
      const quote = await getQuote(symbol);
      const price = quote.c;
      const total = price * shares;
      if (total > data.paper_cash) throw new Error("Insufficient funds");

      const holdings = { ...data.paper_holdings };
      const existing = holdings[symbol];
      if (existing) {
        const newShares = existing.shares + shares;
        holdings[symbol] = {
          shares: newShares,
          avgCost: (existing.shares * existing.avgCost + shares * price) / newShares,
        };
      } else {
        holdings[symbol] = { shares, avgCost: price };
      }

      const trade: PaperTrade = { id: genId(), symbol, type: "BUY", shares, price, total, timestamp: new Date().toISOString() };
      const newData: PaperTradingData = {
        paper_cash: data.paper_cash - total,
        paper_holdings: holdings,
        paper_trades: [trade, ...data.paper_trades],
      };
      await save(newData);
      return { trade, avgCost: holdings[symbol].avgCost };
    },
    onSuccess: ({ trade, avgCost }) => {
      qc.invalidateQueries({ queryKey: ["paper-trading"] });
      toast(`📈 Bought ${trade.shares} shares of ${trade.symbol} at $${trade.price.toFixed(2)}. Your avg cost is $${avgCost.toFixed(2)}.`);
    },
    onError: (e) => toast.error(e.message),
  });

  const sellMutation = useMutation({
    mutationFn: async ({ symbol, shares }: { symbol: string; shares: number }) => {
      if (!data || !user?.id) throw new Error("Not ready");
      const holding = data.paper_holdings[symbol];
      if (!holding || holding.shares < shares) throw new Error("Not enough shares");

      const quote = await getQuote(symbol);
      const price = quote.c;
      const total = price * shares;
      const pnl = (price - holding.avgCost) * shares;

      const holdings = { ...data.paper_holdings };
      const remaining = holding.shares - shares;
      if (remaining <= 0) {
        delete holdings[symbol];
      } else {
        holdings[symbol] = { shares: remaining, avgCost: holding.avgCost };
      }

      const trade: PaperTrade = { id: genId(), symbol, type: "SELL", shares, price, total, timestamp: new Date().toISOString(), pnl };
      const newData: PaperTradingData = {
        paper_cash: data.paper_cash + total,
        paper_holdings: holdings,
        paper_trades: [trade, ...data.paper_trades],
      };
      await save(newData);
      return { trade, pnl };
    },
    onSuccess: ({ trade, pnl }) => {
      qc.invalidateQueries({ queryKey: ["paper-trading"] });
      if (pnl > 0.01) toast(`🎉 Sold ${trade.symbol} for a +$${pnl.toFixed(2)} gain! Great trade.`);
      else if (pnl < -0.01) toast(`📚 Sold ${trade.symbol} for -$${Math.abs(pnl).toFixed(2)}. Losses are part of learning — review what changed.`);
      else toast(`⚖️ Sold ${trade.symbol} at breakeven. No gain, no loss.`);
    },
    onError: (e) => toast.error(e.message),
  });

  const resetMutation = useMutation({
    mutationFn: async () => {
      await save({ paper_cash: 10000, paper_holdings: {}, paper_trades: [] });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["paper-trading"] });
      toast("Portfolio reset to $10,000.");
    },
  });

  return {
    data: data || { paper_cash: 10000, paper_holdings: {}, paper_trades: [] },
    isLoading,
    buy: buyMutation.mutate,
    sell: sellMutation.mutate,
    reset: resetMutation.mutate,
    isBuying: buyMutation.isPending,
    isSelling: sellMutation.isPending,
  };
};

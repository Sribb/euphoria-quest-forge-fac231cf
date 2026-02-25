import { usePortfolioValue } from "@/hooks/usePortfolioValue";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import { formatCurrency } from "@/lib/formatters";

export const DailyPnLCard = () => {
  const { user } = useAuth();
  const { totalValue } = usePortfolioValue();

  const { data: previousValue } = useQuery({
    queryKey: ["previous-day-value", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(23, 59, 59, 999);

      const { data } = await supabase
        .from("transaction_logs")
        .select("balance_after")
        .eq("user_id", user.id)
        .lte("created_at", yesterday.toISOString())
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      return data?.balance_after ? Number(data.balance_after) : 10000;
    },
    enabled: !!user?.id,
  });

  const baseValue = previousValue ?? 10000;
  const pnl = totalValue - baseValue;
  const pnlPercent = baseValue > 0 ? (pnl / baseValue) * 100 : 0;
  const isPositive = pnl >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative overflow-hidden rounded-2xl border border-border/50 p-5"
    >
      {/* Pulsing glow */}
      <motion.div
        className={`absolute inset-0 rounded-2xl ${
          isPositive
            ? "bg-gradient-to-br from-emerald-500/10 to-green-500/5"
            : "bg-gradient-to-br from-red-500/10 to-rose-500/5"
        }`}
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
            Today
          </p>
          <p
            className={`text-2xl font-bold tracking-tight ${
              isPositive ? "text-emerald-500" : "text-red-500"
            }`}
          >
            {isPositive ? "+" : ""}${formatCurrency(Math.abs(pnl))}
          </p>
          <p
            className={`text-sm font-medium mt-0.5 ${
              isPositive ? "text-emerald-400/80" : "text-red-400/80"
            }`}
          >
            {isPositive ? "+" : ""}
            {pnlPercent.toFixed(2)}%
          </p>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${
            isPositive ? "bg-emerald-500/15" : "bg-red-500/15"
          }`}
        >
          {isPositive ? (
            <TrendingUp className="h-5 w-5 text-emerald-500" />
          ) : (
            <TrendingDown className="h-5 w-5 text-red-500" />
          )}
        </div>
      </div>
    </motion.div>
  );
};

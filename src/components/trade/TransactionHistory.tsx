import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";
import { ArrowUpCircle, ArrowDownCircle, RefreshCw } from "lucide-react";

export const TransactionHistory = () => {
  const { user } = useAuth();

  const { data: transactions = [] } = useQuery({
    queryKey: ["transaction-logs", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("transaction_logs")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'BUY':
        return <ArrowUpCircle className="w-4 h-4 text-primary" />;
      case 'SELL':
        return <ArrowDownCircle className="w-4 h-4 text-success" />;
      case 'SETTLEMENT':
        return <RefreshCw className="w-4 h-4 text-warning" />;
      default:
        return null;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'BUY':
        return 'text-primary';
      case 'SELL':
        return 'text-success';
      case 'SETTLEMENT':
        return 'text-warning';
      default:
        return 'text-foreground';
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-xl font-bold mb-4">Transaction History</h3>

      {transactions.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">No transactions yet</p>
      ) : (
        <div className="space-y-2">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="p-3 border border-border rounded-lg hover:border-primary/50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className="mt-1">
                    {getTransactionIcon(tx.transaction_type)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{tx.description}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span>{format(new Date(tx.created_at), "MMM d, yyyy HH:mm")}</span>
                      {tx.symbol && (
                        <Badge variant="outline" className="text-xs">
                          {tx.symbol}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  {tx.amount && (
                    <p className={`font-bold ${getTransactionColor(tx.transaction_type)}`}>
                      {tx.transaction_type === 'BUY' ? '-' : '+'}${Math.abs(Number(tx.amount)).toFixed(2)}
                    </p>
                  )}
                  {tx.fee > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Fee: ${Number(tx.fee).toFixed(2)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

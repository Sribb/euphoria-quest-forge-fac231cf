import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { cancelOrder } from "@/lib/orderService";
import { toast } from "sonner";
import { format } from "date-fns";

export const OrderManagement = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: orders = [] } = useQuery({
    queryKey: ["orders", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  const handleCancelOrder = async (orderId: string) => {
    const result = await cancelOrder(orderId);
    if (result.success) {
      toast.success("Order canceled successfully");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    } else {
      toast.error(result.error || "Failed to cancel order");
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'filled':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'pending':
      case 'new':
        return <Clock className="w-4 h-4 text-warning" />;
      case 'canceled':
        return <XCircle className="w-4 h-4 text-muted-foreground" />;
      case 'rejected':
        return <AlertCircle className="w-4 h-4 text-destructive" />;
      default:
        return null;
    }
  };

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'filled':
        return 'default';
      case 'pending':
      case 'new':
        return 'secondary';
      case 'canceled':
        return 'outline';
      case 'rejected':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-xl font-bold mb-4">Recent Orders</h3>

      {orders.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">No orders yet</p>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div
              key={order.id}
              className="p-4 border border-border rounded-lg hover:border-primary/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold">{order.symbol}</h4>
                    <Badge variant={order.side === 'buy' ? 'default' : 'destructive'}>
                      {order.side.toUpperCase()}
                    </Badge>
                    <Badge variant={getStatusVariant(order.status)}>
                      <span className="flex items-center gap-1">
                        {getStatusIcon(order.status)}
                        {order.status.toUpperCase()}
                      </span>
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {order.order_type.charAt(0).toUpperCase() + order.order_type.slice(1)} Order
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold">
                    {order.quantity} shares
                  </p>
                  {order.average_fill_price && (
                    <p className="text-sm text-muted-foreground">
                      @ ${Number(order.average_fill_price).toFixed(2)}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                <div>
                  <span className="text-muted-foreground">Placed:</span>{" "}
                  <span className="font-medium">
                    {format(new Date(order.placed_at), "MMM d, HH:mm")}
                  </span>
                </div>
                {order.filled_at && (
                  <div>
                    <span className="text-muted-foreground">Filled:</span>{" "}
                    <span className="font-medium">
                      {format(new Date(order.filled_at), "MMM d, HH:mm")}
                    </span>
                  </div>
                )}
                {order.commission > 0 && (
                  <div>
                    <span className="text-muted-foreground">Commission:</span>{" "}
                    <span className="font-medium">${Number(order.commission).toFixed(2)}</span>
                  </div>
                )}
              </div>

              {order.rejection_reason && (
                <div className="p-2 bg-destructive/10 rounded text-sm text-destructive mb-2">
                  {order.rejection_reason}
                </div>
              )}

              {(order.status === 'pending' || order.status === 'new') && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => handleCancelOrder(order.id)}
                >
                  Cancel Order
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

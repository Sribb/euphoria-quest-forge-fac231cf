import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { DollarSign, AlertCircle } from "lucide-react";
import { orderSchema, type OrderInput } from "@/lib/orderValidation";
import { placeOrder } from "@/lib/orderService";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface OrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stock: {
    symbol: string;
    name: string;
    price: number;
  };
  userId: string;
  portfolioId: string;
  buyingPower: number;
  unsettledCash: number;
  currentHolding?: number;
}

export const OrderDialog = ({
  open,
  onOpenChange,
  stock,
  userId,
  portfolioId,
  buyingPower,
  unsettledCash,
  currentHolding = 0,
}: OrderDialogProps) => {
  const queryClient = useQueryClient();
  const [orderType, setOrderType] = useState<'market' | 'limit' | 'stop' | 'stop-limit'>('market');
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [quantity, setQuantity] = useState(1);
  const [limitPrice, setLimitPrice] = useState(stock.price.toFixed(2));
  const [stopPrice, setStopPrice] = useState((stock.price * 0.95).toFixed(2));
  const [isPlacing, setIsPlacing] = useState(false);

  const estimatedCost = stock.price * quantity;
  const canAfford = estimatedCost <= buyingPower;
  const canSell = currentHolding >= quantity;

  const handlePlaceOrder = async () => {
    setIsPlacing(true);

    try {
      const orderInput: OrderInput = {
        symbol: stock.symbol,
        side,
        orderType,
        quantity,
        price: orderType === 'limit' || orderType === 'stop-limit' ? parseFloat(limitPrice) : undefined,
        stopPrice: orderType === 'stop' || orderType === 'stop-limit' ? parseFloat(stopPrice) : undefined,
      };

      const validation = orderSchema.safeParse(orderInput);
      if (!validation.success) {
        toast.error(validation.error.errors[0].message);
        setIsPlacing(false);
        return;
      }

      const result = await placeOrder(userId, portfolioId, orderInput, stock.price);

      if (result.success) {
        toast.success(
          <div className="animate-fade-in">
            <div className="font-bold">{`Order Placed: ${side.toUpperCase()} ${quantity} ${stock.symbol}`}</div>
            <div className="text-sm text-muted-foreground">
              {orderType === 'market' ? 'Executed immediately' : 'Pending execution'}
            </div>
          </div>
        );
        queryClient.invalidateQueries({ queryKey: ["portfolio"] });
        queryClient.invalidateQueries({ queryKey: ["portfolio-assets"] });
        queryClient.invalidateQueries({ queryKey: ["orders"] });
        onOpenChange(false);
        resetForm();
      } else {
        if (result.errors && result.errors.length > 0) {
          result.errors.forEach(error => toast.error(error));
        } else {
          toast.error(result.error || "Failed to place order");
        }
      }
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsPlacing(false);
    }
  };

  const resetForm = () => {
    setOrderType('market');
    setSide('buy');
    setQuantity(1);
    setLimitPrice(stock.price.toFixed(2));
    setStopPrice((stock.price * 0.95).toFixed(2));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] animate-scale-in">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-primary" />
            Place Order
          </DialogTitle>
          <DialogDescription>
            <div className="flex items-center justify-between mt-2">
              <span>{stock.symbol} - {stock.name}</span>
              <Badge className="text-lg">${stock.price.toFixed(2)}</Badge>
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Side</Label>
              <Select value={side} onValueChange={(v) => setSide(v as 'buy' | 'sell')}>
                <SelectTrigger className="smooth-transition">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="buy">Buy</SelectItem>
                  <SelectItem value="sell">Sell</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Order Type</Label>
              <Select value={orderType} onValueChange={(v) => setOrderType(v as any)}>
                <SelectTrigger className="smooth-transition">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="market">Market</SelectItem>
                  <SelectItem value="limit">Limit</SelectItem>
                  <SelectItem value="stop">Stop</SelectItem>
                  <SelectItem value="stop-limit">Stop-Limit</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Quantity</Label>
            <Input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="smooth-transition"
            />
          </div>

          {(orderType === 'limit' || orderType === 'stop-limit') && (
            <div className="animate-fade-in">
              <Label>Limit Price</Label>
              <Input
                type="number"
                step="0.01"
                value={limitPrice}
                onChange={(e) => setLimitPrice(e.target.value)}
                className="smooth-transition"
              />
            </div>
          )}

          {(orderType === 'stop' || orderType === 'stop-limit') && (
            <div className="animate-fade-in">
              <Label>Stop Price</Label>
              <Input
                type="number"
                step="0.01"
                value={stopPrice}
                onChange={(e) => setStopPrice(e.target.value)}
                className="smooth-transition"
              />
            </div>
          )}

          {orderType === 'market' && (
            <Alert className="animate-fade-in bg-primary/10 border-primary">
              <AlertDescription>
                Market orders execute immediately at the current market price with possible slippage.
              </AlertDescription>
            </Alert>
          )}

          {orderType !== 'market' && (
            <Alert className="animate-fade-in bg-warning/10 border-warning">
              <AlertDescription>
                {orderType.charAt(0).toUpperCase() + orderType.slice(1)} orders will be executed when conditions are met.
              </AlertDescription>
            </Alert>
          )}

          <div className="p-4 bg-card rounded-lg border space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Estimated {side === 'buy' ? 'Cost' : 'Proceeds'}</span>
              <span className="font-bold">${estimatedCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Buying Power</span>
              <span className={canAfford ? "text-success font-semibold" : "text-destructive font-semibold"}>
                ${buyingPower.toFixed(2)}
              </span>
            </div>
            {side === 'sell' && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Current Holding</span>
                <span className={canSell ? "text-success font-semibold" : "text-destructive font-semibold"}>
                  {currentHolding} shares
                </span>
              </div>
            )}
          </div>

          {side === 'buy' && !canAfford && (
            <Alert className="animate-fade-in border-destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Insufficient buying power for this order</AlertDescription>
            </Alert>
          )}

          {side === 'sell' && !canSell && (
            <Alert className="animate-fade-in border-destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Insufficient shares to sell</AlertDescription>
            </Alert>
          )}

          {unsettledCash > 0 && (
            <Alert className="animate-fade-in bg-info/10 border-info">
              <AlertDescription className="text-sm">
                ${unsettledCash.toFixed(2)} in unsettled funds (T+2 settlement)
              </AlertDescription>
            </Alert>
          )}
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1 smooth-transition"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 bg-gradient-primary smooth-transition"
            onClick={handlePlaceOrder}
            disabled={
              isPlacing ||
              (side === 'buy' && !canAfford) ||
              (side === 'sell' && !canSell)
            }
          >
            {isPlacing ? "Placing..." : `Place ${side === 'buy' ? 'Buy' : 'Sell'} Order`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

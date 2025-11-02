import { supabase } from "@/integrations/supabase/client";
import { OrderInput } from "./orderValidation";

export interface OrderResult {
  success: boolean;
  orderId?: string;
  error?: string;
  errors?: string[];
}

export const placeOrder = async (
  userId: string,
  portfolioId: string,
  orderInput: OrderInput,
  currentPrice: number
): Promise<OrderResult> => {
  try {
    console.log("🔒 Calling secure trade execution endpoint...");
    
    const { data, error } = await supabase.functions.invoke('execute-trade', {
      body: {
        symbol: orderInput.symbol,
        side: orderInput.side,
        orderType: orderInput.orderType,
        quantity: orderInput.quantity,
        price: orderInput.price,
        stopPrice: orderInput.stopPrice,
        currentPrice: currentPrice,
        portfolioId: portfolioId,
      },
    });

    if (error) {
      console.error("❌ Trade execution error:", error);
      return { success: false, error: error.message || "Failed to execute trade" };
    }

    if (!data?.success) {
      console.error("❌ Trade rejected:", data?.error);
      return { success: false, error: data?.error || "Trade rejected" };
    }

    console.log("✅ Trade executed successfully via secure endpoint");
    return { success: true, orderId: data.order?.id };
  } catch (error) {
    console.error("Unexpected error in placeOrder:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
};

// Note: fillOrder is now handled server-side via execute-trade edge function
// This legacy function is kept for limit/stop orders that may fill later
// For market orders, execution happens entirely on the secure server

export const cancelOrder = async (orderId: string): Promise<OrderResult> => {
  try {
    const { error } = await supabase
      .from("orders")
      .update({
        status: 'canceled',
        canceled_at: new Date().toISOString(),
      })
      .eq("id", orderId)
      .in("status", ['new', 'pending']);

    if (error) {
      return { success: false, error: "Failed to cancel order" };
    }

    return { success: true };
  } catch (error) {
    console.error("Error canceling order:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
};

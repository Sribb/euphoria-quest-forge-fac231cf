import { supabase } from "@/integrations/supabase/client";
import { OrderInput, validatePreTrade, calculateCommission, calculateSettlementDate } from "./orderValidation";
import { alphaVantageService } from "./alphaVantageService";

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
    // Fetch portfolio data
    const { data: portfolio, error: portfolioError } = await supabase
      .from("portfolios")
      .select("*")
      .eq("id", portfolioId)
      .single();

    if (portfolioError || !portfolio) {
      return { success: false, error: "Portfolio not found" };
    }

    // Fetch existing position if selling
    let holdingQuantity = 0;
    if (orderInput.side === 'sell') {
      const { data: asset } = await supabase
        .from("portfolio_assets")
        .select("quantity")
        .eq("portfolio_id", portfolioId)
        .eq("asset_name", orderInput.symbol)
        .single();
      
      holdingQuantity = asset ? Number(asset.quantity) : 0;
    }

    // Pre-trade validation
    const validation = validatePreTrade(
      orderInput,
      Number(portfolio.cash_balance),
      currentPrice,
      holdingQuantity
    );

    if (!validation.isValid) {
      return {
        success: false,
        error: "Order validation failed",
        errors: validation.errors,
      };
    }

    // Calculate costs
    const orderValue = currentPrice * orderInput.quantity;
    const commission = calculateCommission(orderValue);

    // Create order record
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: userId,
        portfolio_id: portfolioId,
        symbol: orderInput.symbol,
        order_type: orderInput.orderType,
        side: orderInput.side,
        quantity: orderInput.quantity,
        price: orderInput.price,
        stop_price: orderInput.stopPrice,
        status: 'pending',
        commission: commission,
      })
      .select()
      .single();

    if (orderError || !order) {
      return { success: false, error: "Failed to create order" };
    }

    // For market orders, immediately fill
    if (orderInput.orderType === 'market') {
      const fillResult = await fillOrder(order.id, currentPrice);
      if (!fillResult.success) {
        return fillResult;
      }
    }

    return {
      success: true,
      orderId: order.id,
    };
  } catch (error) {
    console.error("Error placing order:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
};

// Simulate realistic slippage (educational trading simulator)
const calculateSlippage = (price: number, side: 'buy' | 'sell', quantity: number): number => {
  // Slippage increases with quantity and volatility
  const baseSlippage = 0.001; // 0.1% base slippage
  const quantityFactor = Math.min(quantity / 1000, 0.005); // Up to 0.5% for large orders
  const randomFactor = (Math.random() - 0.5) * 0.002; // Random ±0.1%
  
  const totalSlippage = baseSlippage + quantityFactor + randomFactor;
  return side === 'buy' ? price * (1 + totalSlippage) : price * (1 - totalSlippage);
};

// Simulate partial fills for large orders (educational)
const simulatePartialFill = (quantity: number): number => {
  if (quantity <= 100) return quantity; // Small orders fill completely
  
  // Large orders might fill partially (80-100%)
  const fillRate = 0.8 + Math.random() * 0.2;
  return Math.floor(quantity * fillRate);
};

export const fillOrder = async (
  orderId: string,
  fillPrice: number,
  allowPartialFill: boolean = false
): Promise<OrderResult> => {
  try {
    // Fetch order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (orderError || !order) {
      return { success: false, error: "Order not found" };
    }

    if (order.status !== 'pending' && order.status !== 'new') {
      return { success: false, error: "Order cannot be filled" };
    }

    // Fetch portfolio
    const { data: portfolio, error: portfolioError } = await supabase
      .from("portfolios")
      .select("*")
      .eq("id", order.portfolio_id)
      .single();

    if (portfolioError || !portfolio) {
      return { success: false, error: "Portfolio not found" };
    }

    // Apply realistic slippage
    const adjustedPrice = calculateSlippage(fillPrice, order.side as 'buy' | 'sell', Number(order.quantity));
    
    // Simulate partial fills for educational purposes
    const requestedQuantity = Number(order.quantity);
    const filledQuantity = allowPartialFill ? simulatePartialFill(requestedQuantity) : requestedQuantity;
    
    const orderValue = adjustedPrice * filledQuantity;
    const commission = Number(order.commission);
    const totalCost = orderValue + commission;

    const balanceBefore = Number(portfolio.cash_balance);
    let balanceAfter = balanceBefore;

    if (order.side === 'buy') {
      // Deduct cash immediately
      balanceAfter = balanceBefore - totalCost;

      // Update or create position
      const { data: existingAsset } = await supabase
        .from("portfolio_assets")
        .select("*")
        .eq("portfolio_id", order.portfolio_id)
        .eq("asset_name", order.symbol)
        .single();

      if (existingAsset) {
        const existingQty = Number(existingAsset.quantity);
        const existingCost = Number(existingAsset.purchase_price);
        const newQuantity = existingQty + filledQuantity;
        const avgPrice = ((existingCost * existingQty) + (adjustedPrice * filledQuantity)) / newQuantity;

        await supabase
          .from("portfolio_assets")
          .update({
            quantity: newQuantity,
            purchase_price: avgPrice,
            current_price: adjustedPrice,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingAsset.id);
      } else {
        await supabase
          .from("portfolio_assets")
          .insert({
            portfolio_id: order.portfolio_id,
            asset_name: order.symbol,
            asset_type: "Stock",
            quantity: filledQuantity,
            purchase_price: adjustedPrice,
            current_price: adjustedPrice,
          });
      }
    } else {
      // Sell order - add cash (will be unsettled)
      balanceAfter = balanceBefore;

      // Update position
      const { data: existingAsset } = await supabase
        .from("portfolio_assets")
        .select("*")
        .eq("portfolio_id", order.portfolio_id)
        .eq("asset_name", order.symbol)
        .single();

      if (existingAsset) {
        const remainingQty = Number(existingAsset.quantity) - filledQuantity;
        
        if (remainingQty > 0) {
          await supabase
            .from("portfolio_assets")
            .update({
              quantity: remainingQty,
              current_price: adjustedPrice,
              updated_at: new Date().toISOString(),
            })
            .eq("id", existingAsset.id);
        } else {
          await supabase
            .from("portfolio_assets")
            .delete()
            .eq("id", existingAsset.id);
        }
      }
    }

    // Update portfolio cash balance
    await supabase
      .from("portfolios")
      .update({
        cash_balance: balanceAfter,
        updated_at: new Date().toISOString(),
      })
      .eq("id", order.portfolio_id);

    // Update order status (partial or full fill)
    const orderStatus = filledQuantity < requestedQuantity ? 'partially_filled' : 'filled';
    await supabase
      .from("orders")
      .update({
        status: orderStatus,
        filled_quantity: filledQuantity,
        average_fill_price: adjustedPrice,
        filled_at: new Date().toISOString(),
      })
      .eq("id", orderId);

    // Create transaction log
    const slippageAmount = Math.abs(adjustedPrice - fillPrice) * filledQuantity;
    const descriptionSuffix = filledQuantity < requestedQuantity ? ` (Partial: ${filledQuantity}/${requestedQuantity})` : '';
    
    await supabase
      .from("transaction_logs")
      .insert({
        user_id: order.user_id,
        portfolio_id: order.portfolio_id,
        order_id: orderId,
        transaction_type: order.side === 'buy' ? 'BUY' : 'SELL',
        symbol: order.symbol,
        quantity: filledQuantity,
        price: adjustedPrice,
        amount: orderValue,
        fee: commission,
        balance_before: balanceBefore,
        balance_after: balanceAfter,
        description: `${order.side.toUpperCase()} ${filledQuantity} ${order.symbol} @ $${adjustedPrice.toFixed(2)}${descriptionSuffix}${slippageAmount > 0.01 ? ` (Slippage: $${slippageAmount.toFixed(2)})` : ''}`,
      });

    // Create settlement record (T+2)
    const settlementDate = calculateSettlementDate(new Date());
    const settlementAmount = order.side === 'sell' ? orderValue - commission : 0;

    if (order.side === 'sell' && settlementAmount > 0) {
      await supabase
        .from("settlements")
        .insert({
          user_id: order.user_id,
          portfolio_id: order.portfolio_id,
          order_id: orderId,
          amount: settlementAmount,
          settlement_date: settlementDate.toISOString().split('T')[0],
          status: 'pending',
        });

      // Track unsettled cash
      await supabase
        .from("portfolios")
        .update({
          unsettled_cash: Number(portfolio.unsettled_cash || 0) + settlementAmount,
        })
        .eq("id", order.portfolio_id);
    }

    return { success: true, orderId: orderId };
  } catch (error) {
    console.error("Error filling order:", error);
    return { success: false, error: "Failed to fill order" };
  }
};

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

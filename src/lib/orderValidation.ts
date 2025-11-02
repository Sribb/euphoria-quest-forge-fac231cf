import { z } from 'zod';

export const orderSchema = z.object({
  symbol: z.string()
    .trim()
    .min(1, "Symbol is required")
    .max(10, "Symbol must be less than 10 characters")
    .regex(/^[A-Z]+$/, "Symbol must contain only uppercase letters"),
  side: z.enum(['buy', 'sell'], { errorMap: () => ({ message: "Side must be 'buy' or 'sell'" }) }),
  orderType: z.enum(['market', 'limit', 'stop'], { errorMap: () => ({ message: "Order type must be 'market', 'limit', or 'stop'" }) }),
  quantity: z.number()
    .positive("Quantity must be positive")
    .int("Quantity must be a whole number")
    .max(100000, "Quantity cannot exceed 100,000 shares"),
  price: z.number().positive().optional(),
  stopPrice: z.number().positive().optional(),
});

export type OrderInput = z.infer<typeof orderSchema>;

export interface PreTradeCheck {
  isValid: boolean;
  errors: string[];
}

export const validatePreTrade = (
  order: OrderInput,
  availableCash: number,
  currentPrice: number,
  holdingQuantity: number = 0
): PreTradeCheck => {
  const errors: string[] = [];

  // Market hours check - DISABLED FOR DEMO (enable for production)
  // Uncomment below to enforce market hours
  /*
  const now = new Date();
  const hour = now.getUTCHours();
  const day = now.getUTCDay();
  
  const isWeekend = day === 0 || day === 6;
  const isMarketHours = hour >= 14 && hour < 21;
  
  if (isWeekend || !isMarketHours) {
    errors.push("Market is closed. Trading hours: Mon-Fri 9:30 AM - 4:00 PM EST");
  }
  */

  // Symbol validation (basic check - would normally verify against exchange)
  if (order.symbol.length < 1 || order.symbol.length > 5) {
    errors.push("Invalid symbol format");
  }

  // Quantity validation
  if (order.quantity < 1) {
    errors.push("Quantity must be at least 1");
  }

  // Buying power check for buy orders
  if (order.side === 'buy') {
    const estimatedCost = currentPrice * order.quantity;
    const commissionFee = calculateCommission(estimatedCost);
    const totalCost = estimatedCost + commissionFee;

    if (totalCost > availableCash) {
      errors.push(
        `Insufficient buying power. Required: $${totalCost.toFixed(2)}, Available: $${availableCash.toFixed(2)}`
      );
    }
  }

  // Sell validation - check if user has enough shares
  if (order.side === 'sell' && order.quantity > holdingQuantity) {
    errors.push(
      `Insufficient shares. Attempting to sell ${order.quantity}, but only ${holdingQuantity} available`
    );
  }

  // Order type specific validation
  if (order.orderType === 'limit' && !order.price) {
    errors.push("Limit orders require a limit price");
  }

  if (order.orderType === 'stop' && !order.stopPrice) {
    errors.push("Stop orders require a stop price");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const calculateCommission = (orderValue: number): number => {
  // Flat $0 commission (modern brokerages)
  // Can be changed to: Math.max(0.50, orderValue * 0.001) for percentage-based
  return 0;
};

export const calculateSettlementDate = (tradeDate: Date): Date => {
  // T+2 settlement for US equities
  const settlementDate = new Date(tradeDate);
  let daysToAdd = 0;
  
  while (daysToAdd < 2) {
    settlementDate.setDate(settlementDate.getDate() + 1);
    const day = settlementDate.getDay();
    
    // Skip weekends
    if (day !== 0 && day !== 6) {
      daysToAdd++;
    }
  }
  
  return settlementDate;
};

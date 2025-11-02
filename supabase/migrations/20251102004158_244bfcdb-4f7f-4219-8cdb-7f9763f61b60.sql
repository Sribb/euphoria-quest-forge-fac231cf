-- Create orders table for order lifecycle management
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  portfolio_id UUID NOT NULL,
  symbol TEXT NOT NULL,
  order_type TEXT NOT NULL CHECK (order_type IN ('market', 'limit', 'stop')),
  side TEXT NOT NULL CHECK (side IN ('buy', 'sell')),
  quantity NUMERIC NOT NULL CHECK (quantity > 0),
  price NUMERIC,
  stop_price NUMERIC,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'pending', 'filled', 'partially_filled', 'canceled', 'rejected')),
  filled_quantity NUMERIC DEFAULT 0,
  average_fill_price NUMERIC,
  commission NUMERIC DEFAULT 0,
  rejection_reason TEXT,
  placed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  filled_at TIMESTAMPTZ,
  canceled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create settlements table for T+2 tracking
CREATE TABLE IF NOT EXISTS public.settlements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  portfolio_id UUID NOT NULL,
  order_id UUID NOT NULL,
  amount NUMERIC NOT NULL,
  settlement_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'settled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  settled_at TIMESTAMPTZ
);

-- Create transaction_logs table for audit trail
CREATE TABLE IF NOT EXISTS public.transaction_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  portfolio_id UUID NOT NULL,
  order_id UUID,
  transaction_type TEXT NOT NULL,
  symbol TEXT,
  quantity NUMERIC,
  price NUMERIC,
  amount NUMERIC,
  fee NUMERIC,
  balance_before NUMERIC,
  balance_after NUMERIC,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add unsettled_cash to portfolios
ALTER TABLE public.portfolios 
ADD COLUMN IF NOT EXISTS unsettled_cash NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS buying_power NUMERIC DEFAULT 10000;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_portfolio_id ON public.orders(portfolio_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_settlements_user_id ON public.settlements(user_id);
CREATE INDEX IF NOT EXISTS idx_settlements_date ON public.settlements(settlement_date);
CREATE INDEX IF NOT EXISTS idx_transaction_logs_user_id ON public.transaction_logs(user_id);

-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transaction_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for orders
CREATE POLICY "Users can view their own orders"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own orders"
  ON public.orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own orders"
  ON public.orders FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for settlements
CREATE POLICY "Users can view their own settlements"
  ON public.settlements FOR SELECT
  USING (auth.uid() = user_id);

-- RLS Policies for transaction_logs
CREATE POLICY "Users can view their own transaction logs"
  ON public.transaction_logs FOR SELECT
  USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
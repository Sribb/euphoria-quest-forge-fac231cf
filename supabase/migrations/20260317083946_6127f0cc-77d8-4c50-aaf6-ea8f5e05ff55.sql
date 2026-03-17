
CREATE TABLE public.paper_trading (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  paper_cash float8 NOT NULL DEFAULT 10000,
  paper_holdings jsonb NOT NULL DEFAULT '{}',
  paper_trades jsonb NOT NULL DEFAULT '[]',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.paper_trading ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own paper trading data"
  ON public.paper_trading FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own paper trading data"
  ON public.paper_trading FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own paper trading data"
  ON public.paper_trading FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.update_paper_portfolio(
  p_user_id uuid,
  p_cash float8,
  p_holdings jsonb,
  p_trades jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.paper_trading (user_id, paper_cash, paper_holdings, paper_trades, updated_at)
  VALUES (p_user_id, p_cash, p_holdings, p_trades, now())
  ON CONFLICT (user_id) DO UPDATE SET
    paper_cash = EXCLUDED.paper_cash,
    paper_holdings = EXCLUDED.paper_holdings,
    paper_trades = EXCLUDED.paper_trades,
    updated_at = now();
END;
$$;

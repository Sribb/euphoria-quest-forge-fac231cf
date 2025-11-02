-- AI Market Sessions: Each user gets a unique AI-driven market instance
CREATE TABLE public.ai_market_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_name TEXT NOT NULL DEFAULT 'Market Session',
  session_seed TEXT NOT NULL, -- Seed for deterministic AI behavior
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_active_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  market_volatility DECIMAL NOT NULL DEFAULT 0.5, -- 0-1 scale
  market_trend TEXT NOT NULL DEFAULT 'neutral', -- bullish, bearish, neutral
  total_trades INTEGER NOT NULL DEFAULT 0,
  session_status TEXT NOT NULL DEFAULT 'active', -- active, paused, ended
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- AI Competitors: Adaptive traders with distinct strategies
CREATE TABLE public.ai_competitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.ai_market_sessions(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  strategy_type TEXT NOT NULL, -- aggressive, conservative, momentum, contrarian, value
  personality_traits JSONB NOT NULL DEFAULT '{}', -- risk_tolerance, adaptability, etc.
  capital DECIMAL NOT NULL DEFAULT 100000,
  portfolio JSONB NOT NULL DEFAULT '{}', -- {symbol: quantity}
  performance_score DECIMAL NOT NULL DEFAULT 0,
  total_trades INTEGER NOT NULL DEFAULT 0,
  win_rate DECIMAL NOT NULL DEFAULT 0,
  learning_data JSONB NOT NULL DEFAULT '{}', -- Stores observed patterns
  last_action_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- AI Market Events: Macro and micro events that create scenarios
CREATE TABLE public.ai_market_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.ai_market_sessions(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL, -- macro, micro, user_triggered
  severity TEXT NOT NULL, -- low, medium, high, critical
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  affected_symbols TEXT[] NOT NULL DEFAULT '{}',
  affected_sectors TEXT[] NOT NULL DEFAULT '{}',
  impact_multiplier DECIMAL NOT NULL DEFAULT 1.0,
  duration_minutes INTEGER NOT NULL DEFAULT 30,
  triggered_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  cause_chain JSONB NOT NULL DEFAULT '[]', -- Multi-step cause-effect
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- AI Stock Prices: Dynamic prices per session
CREATE TABLE public.ai_stock_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.ai_market_sessions(id) ON DELETE CASCADE,
  symbol TEXT NOT NULL,
  current_price DECIMAL NOT NULL,
  previous_price DECIMAL NOT NULL,
  day_open DECIMAL NOT NULL,
  day_high DECIMAL NOT NULL,
  day_low DECIMAL NOT NULL,
  volume INTEGER NOT NULL DEFAULT 0,
  ai_sentiment DECIMAL NOT NULL DEFAULT 0, -- -1 to 1
  price_momentum DECIMAL NOT NULL DEFAULT 0,
  volatility_index DECIMAL NOT NULL DEFAULT 0.5,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(session_id, symbol)
);

-- AI Scenario Predictions: Alternative market outcomes
CREATE TABLE public.ai_scenario_predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.ai_market_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  scenario_type TEXT NOT NULL, -- what_if, alternative, prediction
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  proposed_action JSONB NOT NULL, -- The trade or action being simulated
  predicted_outcomes JSONB NOT NULL DEFAULT '[]', -- Array of possible outcomes
  probability_distribution JSONB NOT NULL DEFAULT '{}',
  time_horizon_minutes INTEGER NOT NULL DEFAULT 60,
  confidence_score DECIMAL NOT NULL DEFAULT 0.5,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- AI Trade Analysis: Predictive coaching for trades
CREATE TABLE public.ai_trade_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.ai_market_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  trade_type TEXT NOT NULL, -- buy, sell
  symbol TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  proposed_price DECIMAL NOT NULL,
  analysis_type TEXT NOT NULL, -- pre_trade, post_trade, coaching
  impact_prediction JSONB NOT NULL, -- Market impact, competitor reactions
  risk_assessment JSONB NOT NULL,
  opportunity_score DECIMAL NOT NULL DEFAULT 0.5,
  ai_recommendation TEXT NOT NULL,
  reasoning TEXT NOT NULL,
  alternative_strategies JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ai_market_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_competitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_market_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_stock_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_scenario_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_trade_analysis ENABLE ROW LEVEL SECURITY;

-- RLS Policies for ai_market_sessions
CREATE POLICY "Users can view their own market sessions"
  ON public.ai_market_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own market sessions"
  ON public.ai_market_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own market sessions"
  ON public.ai_market_sessions FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for ai_competitors (read-only for users)
CREATE POLICY "Users can view competitors in their sessions"
  ON public.ai_competitors FOR SELECT
  USING (
    session_id IN (
      SELECT id FROM public.ai_market_sessions WHERE user_id = auth.uid()
    )
  );

-- RLS Policies for ai_market_events
CREATE POLICY "Users can view events in their sessions"
  ON public.ai_market_events FOR SELECT
  USING (
    session_id IN (
      SELECT id FROM public.ai_market_sessions WHERE user_id = auth.uid()
    )
  );

-- RLS Policies for ai_stock_prices
CREATE POLICY "Users can view prices in their sessions"
  ON public.ai_stock_prices FOR SELECT
  USING (
    session_id IN (
      SELECT id FROM public.ai_market_sessions WHERE user_id = auth.uid()
    )
  );

-- RLS Policies for ai_scenario_predictions
CREATE POLICY "Users can view their own scenario predictions"
  ON public.ai_scenario_predictions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own scenario predictions"
  ON public.ai_scenario_predictions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for ai_trade_analysis
CREATE POLICY "Users can view their own trade analysis"
  ON public.ai_trade_analysis FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own trade analysis"
  ON public.ai_trade_analysis FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_ai_market_sessions_user_id ON public.ai_market_sessions(user_id);
CREATE INDEX idx_ai_market_sessions_status ON public.ai_market_sessions(session_status);
CREATE INDEX idx_ai_competitors_session_id ON public.ai_competitors(session_id);
CREATE INDEX idx_ai_market_events_session_id ON public.ai_market_events(session_id);
CREATE INDEX idx_ai_market_events_active ON public.ai_market_events(is_active);
CREATE INDEX idx_ai_stock_prices_session_symbol ON public.ai_stock_prices(session_id, symbol);
CREATE INDEX idx_ai_scenario_predictions_session_user ON public.ai_scenario_predictions(session_id, user_id);
CREATE INDEX idx_ai_trade_analysis_session_user ON public.ai_trade_analysis(session_id, user_id);

-- Trigger for updating updated_at
CREATE TRIGGER update_ai_market_sessions_updated_at
  BEFORE UPDATE ON public.ai_market_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ai_competitors_updated_at
  BEFORE UPDATE ON public.ai_competitors
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for live updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.ai_stock_prices;
ALTER PUBLICATION supabase_realtime ADD TABLE public.ai_market_events;
ALTER PUBLICATION supabase_realtime ADD TABLE public.ai_competitors;
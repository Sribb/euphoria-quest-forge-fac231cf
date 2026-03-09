
-- User inventory for purchased power-ups and items
CREATE TABLE public.user_inventory (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  item_type TEXT NOT NULL, -- 'double_xp', 'streak_freeze', 'heart_refill', 'hint', 'avatar_item', 'profile_theme', 'profile_frame', 'profile_badge'
  item_id TEXT NOT NULL, -- identifier for the specific item
  quantity INTEGER NOT NULL DEFAULT 1,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb, -- extra data like expiry, customization details
  acquired_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  used_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN NOT NULL DEFAULT false, -- for items that are "equipped" or active
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Active power-ups (time-limited effects)
CREATE TABLE public.active_powerups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  powerup_type TEXT NOT NULL, -- 'double_xp', 'hint_available'
  activated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Purchase history / coin transaction log
CREATE TABLE public.coin_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  amount INTEGER NOT NULL, -- positive = earned, negative = spent
  balance_after INTEGER NOT NULL DEFAULT 0,
  transaction_type TEXT NOT NULL, -- 'earn_lesson', 'earn_streak', 'earn_game', 'earn_achievement', 'spend_shop', 'earn_daily_challenge'
  description TEXT NOT NULL,
  item_id TEXT, -- reference to shop item if purchase
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- RLS policies
ALTER TABLE public.user_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.active_powerups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coin_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own inventory" ON public.user_inventory FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own inventory" ON public.user_inventory FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own inventory" ON public.user_inventory FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own powerups" ON public.active_powerups FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own powerups" ON public.active_powerups FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own powerups" ON public.active_powerups FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own coin transactions" ON public.coin_transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own coin transactions" ON public.coin_transactions FOR INSERT WITH CHECK (auth.uid() = user_id);

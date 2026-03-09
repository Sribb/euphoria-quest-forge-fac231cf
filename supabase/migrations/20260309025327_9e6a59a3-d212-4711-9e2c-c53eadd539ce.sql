
CREATE TABLE public.user_hearts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  hearts_remaining integer NOT NULL DEFAULT 5,
  max_hearts integer NOT NULL DEFAULT 5,
  last_reset_date date NOT NULL DEFAULT CURRENT_DATE,
  hearts_earned_today integer NOT NULL DEFAULT 0,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE public.user_hearts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own hearts" ON public.user_hearts
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own hearts" ON public.user_hearts
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own hearts" ON public.user_hearts
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

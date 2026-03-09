
-- Daily challenge progress tracking
CREATE TABLE public.daily_challenge_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  challenge_day integer NOT NULL,
  selected_answer integer NOT NULL,
  is_correct boolean NOT NULL,
  xp_earned integer NOT NULL DEFAULT 0,
  completed_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, challenge_day)
);

-- Daily challenge streak tracking (separate from main streak)
CREATE TABLE public.daily_challenge_streaks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  current_streak integer NOT NULL DEFAULT 0,
  longest_streak integer NOT NULL DEFAULT 0,
  last_completed_day integer,
  last_completed_date date,
  total_completed integer NOT NULL DEFAULT 0,
  total_correct integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE public.daily_challenge_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_challenge_streaks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own challenge progress" ON public.daily_challenge_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own challenge progress" ON public.daily_challenge_progress FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own challenge streak" ON public.daily_challenge_streaks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own challenge streak" ON public.daily_challenge_streaks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own challenge streak" ON public.daily_challenge_streaks FOR UPDATE USING (auth.uid() = user_id);

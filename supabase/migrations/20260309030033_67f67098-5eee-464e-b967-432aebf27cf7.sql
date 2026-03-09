
ALTER TABLE public.streaks 
  ADD COLUMN IF NOT EXISTS streak_freezes integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS freeze_used_today boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS milestone_7 boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS milestone_30 boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS milestone_100 boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS milestone_365 boolean NOT NULL DEFAULT false;

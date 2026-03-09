
-- Weekly leagues table for Duolingo-style division system
CREATE TABLE public.weekly_leagues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  week_start date NOT NULL,
  division text NOT NULL DEFAULT 'bronze',
  league_group integer NOT NULL DEFAULT 1,
  weekly_xp integer NOT NULL DEFAULT 0,
  rank_in_league integer,
  previous_rank integer,
  is_promoted boolean NOT NULL DEFAULT false,
  is_demoted boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, week_start)
);

ALTER TABLE public.weekly_leagues ENABLE ROW LEVEL SECURITY;

-- Everyone can see league rankings (anonymized in the app layer)
CREATE POLICY "Anyone can view league rankings"
  ON public.weekly_leagues FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own league entry"
  ON public.weekly_leagues FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own league entry"
  ON public.weekly_leagues FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Enable realtime for weekly_leagues
ALTER PUBLICATION supabase_realtime ADD TABLE public.weekly_leagues;

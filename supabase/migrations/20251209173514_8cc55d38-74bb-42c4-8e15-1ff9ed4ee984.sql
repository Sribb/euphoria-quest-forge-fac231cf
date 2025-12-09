-- Add XP and mentor mode to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS experience_points integer NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS mentor_mode_enabled boolean NOT NULL DEFAULT false;

-- Create XP level thresholds table
CREATE TABLE public.xp_level_thresholds (
  level integer PRIMARY KEY,
  xp_required integer NOT NULL,
  title text NOT NULL,
  rewards jsonb DEFAULT '{}',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.xp_level_thresholds ENABLE ROW LEVEL SECURITY;

-- Anyone can view level thresholds
CREATE POLICY "Anyone can view xp level thresholds" ON public.xp_level_thresholds
  FOR SELECT USING (true);

-- Create pattern insights table for mentor tips
CREATE TABLE public.pattern_insights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pattern_id text NOT NULL,
  pattern_name text NOT NULL,
  insight_text text NOT NULL,
  difficulty text NOT NULL DEFAULT 'beginner',
  category text NOT NULL DEFAULT 'general',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.pattern_insights ENABLE ROW LEVEL SECURITY;

-- Anyone can view pattern insights
CREATE POLICY "Anyone can view pattern insights" ON public.pattern_insights
  FOR SELECT USING (true);

-- Track which insights user has seen (for non-repeating delivery)
CREATE TABLE public.user_seen_insights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  insight_id uuid NOT NULL REFERENCES public.pattern_insights(id) ON DELETE CASCADE,
  seen_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, insight_id)
);

-- Enable RLS
ALTER TABLE public.user_seen_insights ENABLE ROW LEVEL SECURITY;

-- Users can view their own seen insights
CREATE POLICY "Users can view own seen insights" ON public.user_seen_insights
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own seen insights
CREATE POLICY "Users can insert own seen insights" ON public.user_seen_insights
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create seasonal themes table
CREATE TABLE public.seasonal_themes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  theme_id text NOT NULL UNIQUE,
  name text NOT NULL,
  description text,
  start_date date NOT NULL,
  end_date date NOT NULL,
  is_active boolean NOT NULL DEFAULT false,
  color_scheme jsonb NOT NULL DEFAULT '{}',
  particle_effects jsonb DEFAULT '{}',
  bonus_rewards jsonb DEFAULT '{}',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.seasonal_themes ENABLE ROW LEVEL SECURITY;

-- Anyone can view seasonal themes
CREATE POLICY "Anyone can view seasonal themes" ON public.seasonal_themes
  FOR SELECT USING (true);

-- Create function to calculate user level from XP
CREATE OR REPLACE FUNCTION public.calculate_level_from_xp(xp integer)
RETURNS integer
LANGUAGE sql
STABLE
AS $$
  SELECT COALESCE(
    (SELECT level FROM public.xp_level_thresholds 
     WHERE xp_required <= xp 
     ORDER BY level DESC 
     LIMIT 1),
    1
  );
$$;

-- Create function to add XP and return new level
CREATE OR REPLACE FUNCTION public.add_experience_points(user_id_param uuid, xp_amount integer)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  old_xp integer;
  new_xp integer;
  old_level integer;
  new_level integer;
  result jsonb;
BEGIN
  -- Get current XP
  SELECT experience_points INTO old_xp FROM profiles WHERE id = user_id_param;
  old_level := calculate_level_from_xp(old_xp);
  
  -- Add XP
  new_xp := old_xp + xp_amount;
  UPDATE profiles SET experience_points = new_xp, level = calculate_level_from_xp(new_xp) WHERE id = user_id_param;
  
  new_level := calculate_level_from_xp(new_xp);
  
  -- Return result
  result := jsonb_build_object(
    'old_xp', old_xp,
    'new_xp', new_xp,
    'xp_gained', xp_amount,
    'old_level', old_level,
    'new_level', new_level,
    'leveled_up', new_level > old_level
  );
  
  RETURN result;
END;
$$;

-- Enable realtime for key tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.portfolios;
ALTER PUBLICATION supabase_realtime ADD TABLE public.portfolio_assets;
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.ai_market_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
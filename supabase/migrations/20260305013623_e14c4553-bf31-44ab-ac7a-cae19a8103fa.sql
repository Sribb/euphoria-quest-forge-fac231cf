
-- Store A/B test variant assignment and analytics
CREATE TABLE public.onboarding_ab_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  variant TEXT NOT NULL CHECK (variant IN ('A', 'B')),
  step_number INTEGER NOT NULL,
  step_name TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('started', 'completed', 'dropped')),
  response JSONB DEFAULT NULL,
  time_spent_ms INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Store which variant a user was assigned
CREATE TABLE public.onboarding_ab_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  variant TEXT NOT NULL CHECK (variant IN ('A', 'B')),
  completed BOOLEAN NOT NULL DEFAULT false,
  total_time_ms INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ DEFAULT NULL
);

-- Enable RLS
ALTER TABLE public.onboarding_ab_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_ab_assignments ENABLE ROW LEVEL SECURITY;

-- Users can insert/read their own analytics
CREATE POLICY "Users can insert own analytics" ON public.onboarding_ab_analytics
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own analytics" ON public.onboarding_ab_analytics
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Users can manage own assignment
CREATE POLICY "Users can insert own assignment" ON public.onboarding_ab_assignments
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own assignment" ON public.onboarding_ab_assignments
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can update own assignment" ON public.onboarding_ab_assignments
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Admins can read all for analysis
CREATE POLICY "Admins can read all analytics" ON public.onboarding_ab_analytics
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can read all assignments" ON public.onboarding_ab_assignments
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

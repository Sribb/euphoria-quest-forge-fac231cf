
-- Assignment templates table
CREATE TABLE public.assignment_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  educator_id uuid NOT NULL,
  name text NOT NULL,
  description text,
  template_type text NOT NULL DEFAULT 'custom', -- 'custom', 'semester', 'year'
  is_public boolean NOT NULL DEFAULT false,
  meeting_days text[] NOT NULL DEFAULT '{}'::text[], -- e.g. '{monday,wednesday,friday}'
  items jsonb NOT NULL DEFAULT '[]'::jsonb, -- array of {lesson_id, title, instructions, week_offset, day_of_week}
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.assignment_templates ENABLE ROW LEVEL SECURITY;

-- Educators manage their own templates
CREATE POLICY "Educators can manage own templates"
  ON public.assignment_templates FOR ALL
  USING (educator_id = auth.uid())
  WITH CHECK (educator_id = auth.uid());

-- Anyone can view public templates (pre-built pacing guides)
CREATE POLICY "Anyone can view public templates"
  ON public.assignment_templates FOR SELECT
  USING (is_public = true);

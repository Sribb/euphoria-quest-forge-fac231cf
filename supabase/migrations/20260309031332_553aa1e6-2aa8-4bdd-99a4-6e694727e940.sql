
CREATE TABLE public.spaced_repetition_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  lesson_id uuid REFERENCES public.lessons(id) ON DELETE CASCADE NOT NULL,
  concept_key text NOT NULL,
  concept_label text NOT NULL,
  pathway text NOT NULL DEFAULT 'investing',
  ease_factor numeric NOT NULL DEFAULT 2.5,
  interval_days integer NOT NULL DEFAULT 1,
  repetition_count integer NOT NULL DEFAULT 0,
  last_reviewed_at timestamp with time zone,
  next_review_at timestamp with time zone NOT NULL DEFAULT now(),
  mastery_level text NOT NULL DEFAULT 'new',
  is_cracked boolean NOT NULL DEFAULT false,
  consecutive_correct integer NOT NULL DEFAULT 0,
  total_reviews integer NOT NULL DEFAULT 0,
  correct_reviews integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, concept_key)
);

ALTER TABLE public.spaced_repetition_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own SR items" ON public.spaced_repetition_items
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own SR items" ON public.spaced_repetition_items
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own SR items" ON public.spaced_repetition_items
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

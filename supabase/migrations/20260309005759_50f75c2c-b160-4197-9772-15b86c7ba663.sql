-- Table to track real-time student activity during class sessions
CREATE TABLE public.student_activity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  class_id uuid REFERENCES public.classes(id) ON DELETE SET NULL,
  current_lesson_id uuid REFERENCES public.lessons(id) ON DELETE SET NULL,
  lesson_title text,
  completion_percentage integer NOT NULL DEFAULT 0,
  session_started_at timestamp with time zone NOT NULL DEFAULT now(),
  last_active_at timestamp with time zone NOT NULL DEFAULT now(),
  last_interaction_type text DEFAULT 'viewing',
  is_online boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  
  UNIQUE(user_id, class_id)
);

CREATE INDEX idx_student_activity_class ON public.student_activity(class_id);
CREATE INDEX idx_student_activity_last_active ON public.student_activity(last_active_at);

ALTER TABLE public.student_activity ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can manage own activity"
  ON public.student_activity FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Educators can view class activity"
  ON public.student_activity FOR SELECT
  USING (
    class_id IN (
      SELECT id FROM public.classes WHERE educator_id = auth.uid()
    )
  );

ALTER PUBLICATION supabase_realtime ADD TABLE public.student_activity;
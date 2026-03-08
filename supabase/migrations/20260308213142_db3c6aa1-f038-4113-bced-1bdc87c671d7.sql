
-- Data deletion requests table for FERPA/COPPA compliance
CREATE TABLE public.data_deletion_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  educator_id UUID NOT NULL,
  student_id UUID NOT NULL,
  student_name TEXT NOT NULL DEFAULT 'Unknown Student',
  class_id UUID REFERENCES public.classes(id) ON DELETE SET NULL,
  class_name TEXT,
  deletion_type TEXT NOT NULL DEFAULT 'individual',
  reason TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  requested_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  scheduled_purge_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '30 days'),
  cancelled_at TIMESTAMP WITH TIME ZONE,
  purged_at TIMESTAMP WITH TIME ZONE,
  certificate_url TEXT,
  data_categories JSONB NOT NULL DEFAULT '["lesson_progress","quiz_scores","game_sessions","achievements","messages","portfolio","community_posts"]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.data_deletion_requests ENABLE ROW LEVEL SECURITY;

-- Educators can manage deletion requests they created
CREATE POLICY "Educators can view their deletion requests"
  ON public.data_deletion_requests FOR SELECT
  USING (educator_id = auth.uid());

CREATE POLICY "Educators can create deletion requests"
  ON public.data_deletion_requests FOR INSERT
  WITH CHECK (educator_id = auth.uid() AND (has_role(auth.uid(), 'educator') OR has_role(auth.uid(), 'admin')));

CREATE POLICY "Educators can update their deletion requests"
  ON public.data_deletion_requests FOR UPDATE
  USING (educator_id = auth.uid());

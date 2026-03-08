
-- Add grade_level and COPPA flag to classes table
ALTER TABLE public.classes 
  ADD COLUMN IF NOT EXISTS grade_level text DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS requires_coppa_consent boolean NOT NULL DEFAULT false;

-- Create parental_consents table
CREATE TABLE public.parental_consents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL,
  class_id uuid REFERENCES public.classes(id) ON DELETE CASCADE NOT NULL,
  parent_email text NOT NULL,
  consent_status text NOT NULL DEFAULT 'pending',
  consent_token uuid NOT NULL DEFAULT gen_random_uuid(),
  requested_at timestamptz NOT NULL DEFAULT now(),
  responded_at timestamptz,
  revoked_at timestamptz,
  deletion_requested_at timestamptz,
  requested_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(student_id, class_id)
);

-- Enable RLS
ALTER TABLE public.parental_consents ENABLE ROW LEVEL SECURITY;

-- Educators can manage consents for their classes
CREATE POLICY "Educators can view consents for their classes"
  ON public.parental_consents
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.classes c
      WHERE c.id = parental_consents.class_id
      AND c.educator_id = auth.uid()
    )
  );

CREATE POLICY "Educators can insert consents for their classes"
  ON public.parental_consents
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.classes c
      WHERE c.id = parental_consents.class_id
      AND c.educator_id = auth.uid()
    )
  );

CREATE POLICY "Educators can update consents for their classes"
  ON public.parental_consents
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.classes c
      WHERE c.id = parental_consents.class_id
      AND c.educator_id = auth.uid()
    )
  );

-- Public policy for parent consent responses (via token, handled by edge function)
-- Edge functions use service role, so no additional RLS needed for parent actions

-- Add updated_at trigger
CREATE TRIGGER update_parental_consents_updated_at
  BEFORE UPDATE ON public.parental_consents
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

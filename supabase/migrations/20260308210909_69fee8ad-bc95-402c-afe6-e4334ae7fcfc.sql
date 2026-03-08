
-- Create dpa_records table
CREATE TABLE public.dpa_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  district_name text NOT NULL,
  district_address text NOT NULL,
  signatory_name text NOT NULL,
  signatory_title text NOT NULL,
  signatory_email text NOT NULL,
  state text NOT NULL,
  student_count integer NOT NULL,
  term_years integer NOT NULL DEFAULT 1,
  contract_start_date date NOT NULL,
  generated_at timestamp with time zone NOT NULL DEFAULT now(),
  pdf_url text,
  status text NOT NULL DEFAULT 'generated',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.dpa_records ENABLE ROW LEVEL SECURITY;

-- Users can view their own DPA records
CREATE POLICY "Users can view own DPA records"
  ON public.dpa_records FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can insert their own DPA records
CREATE POLICY "Users can insert own DPA records"
  ON public.dpa_records FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own DPA records
CREATE POLICY "Users can update own DPA records"
  ON public.dpa_records FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create storage bucket for DPA documents
INSERT INTO storage.buckets (id, name, public) VALUES ('dpa-documents', 'dpa-documents', false);

-- Storage policies for dpa-documents
CREATE POLICY "Users can upload own DPA docs"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'dpa-documents' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can view own DPA docs"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'dpa-documents' AND (storage.foldername(name))[1] = auth.uid()::text);

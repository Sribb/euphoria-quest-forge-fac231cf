
ALTER TABLE public.classes 
  ADD COLUMN IF NOT EXISTS period_block text DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS display_color text DEFAULT '#6366f1',
  ADD COLUMN IF NOT EXISTS archived_at timestamp with time zone DEFAULT NULL;

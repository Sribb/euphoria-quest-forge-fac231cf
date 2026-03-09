
ALTER TABLE public.user_lesson_progress 
ADD COLUMN IF NOT EXISTS legendary_completed boolean NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS legendary_score integer DEFAULT NULL,
ADD COLUMN IF NOT EXISTS legendary_completed_at timestamp with time zone DEFAULT NULL;

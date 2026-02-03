-- Add 'educator' and 'mentor' to the app_role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'educator';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'mentor';
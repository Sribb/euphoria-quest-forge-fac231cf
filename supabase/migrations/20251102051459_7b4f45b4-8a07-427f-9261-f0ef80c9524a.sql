-- Create table for AI lesson interactions (chat history and analytics)
CREATE TABLE IF NOT EXISTS public.ai_lesson_interactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  interaction_type TEXT NOT NULL CHECK (interaction_type IN ('chat', 'contextual_help', 'adaptive_guidance', 'simulation_feedback')),
  user_input TEXT,
  ai_response TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.ai_lesson_interactions ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own AI interactions"
ON public.ai_lesson_interactions
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own AI interactions"
ON public.ai_lesson_interactions
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_ai_lesson_interactions_user_lesson ON public.ai_lesson_interactions(user_id, lesson_id);
CREATE INDEX idx_ai_lesson_interactions_created_at ON public.ai_lesson_interactions(created_at DESC);
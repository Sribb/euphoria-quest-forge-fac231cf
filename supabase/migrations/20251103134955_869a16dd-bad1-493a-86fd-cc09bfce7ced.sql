-- Add mastery tracking columns to user_lesson_progress
ALTER TABLE user_lesson_progress
ADD COLUMN IF NOT EXISTS mastery_level TEXT DEFAULT 'beginner' CHECK (mastery_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
ADD COLUMN IF NOT EXISTS quiz_attempts INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS quiz_score INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS weak_areas JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS challenge_history JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS last_challenge_at TIMESTAMP WITH TIME ZONE;

-- Create table for tracking individual question performance
CREATE TABLE IF NOT EXISTS lesson_question_performance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  topic_category TEXT NOT NULL,
  difficulty_level TEXT NOT NULL CHECK (difficulty_level IN ('easy', 'medium', 'hard')),
  is_correct BOOLEAN NOT NULL,
  time_taken_seconds INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, lesson_id, question_text)
);

-- Enable RLS
ALTER TABLE lesson_question_performance ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view own question performance"
  ON lesson_question_performance FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own question performance"
  ON lesson_question_performance FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Add index for performance queries
CREATE INDEX IF NOT EXISTS idx_question_performance_user_lesson 
  ON lesson_question_performance(user_id, lesson_id);
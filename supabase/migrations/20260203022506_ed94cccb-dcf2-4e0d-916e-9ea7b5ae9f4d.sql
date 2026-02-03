-- Create announcements table for educator communications
CREATE TABLE public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  target_role TEXT DEFAULT NULL,
  is_published BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create direct messages table
CREATE TABLE public.educator_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject TEXT,
  content TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create automated reminders table
CREATE TABLE public.automated_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  trigger_type TEXT NOT NULL CHECK (trigger_type IN ('inactivity', 'low_progress', 'milestone', 'scheduled')),
  trigger_config JSONB NOT NULL DEFAULT '{}',
  target_users TEXT NOT NULL DEFAULT 'all' CHECK (target_users IN ('all', 'students', 'struggling', 'custom')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_triggered_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create educator notes table for tracking student observations
CREATE TABLE public.educator_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  educator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  note TEXT NOT NULL,
  note_type TEXT NOT NULL DEFAULT 'general' CHECK (note_type IN ('general', 'concern', 'praise', 'action_item')),
  is_private BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create session attendance tracking
CREATE TABLE public.live_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  session_type TEXT NOT NULL DEFAULT 'webinar' CHECK (session_type IN ('webinar', 'qa', 'workshop', 'mentoring')),
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  max_participants INTEGER,
  recording_url TEXT,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.session_attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.live_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  left_at TIMESTAMP WITH TIME ZONE,
  duration_minutes INTEGER,
  participation_score INTEGER DEFAULT 0,
  UNIQUE(session_id, user_id)
);

-- Enable RLS on all tables
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.educator_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automated_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.educator_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_attendance ENABLE ROW LEVEL SECURITY;

-- Announcements policies
CREATE POLICY "Educators can manage announcements"
ON public.announcements FOR ALL
USING (public.has_role(auth.uid(), 'educator') OR public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'educator') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view published announcements"
ON public.announcements FOR SELECT
USING (is_published = true AND (expires_at IS NULL OR expires_at > now()));

-- Educator messages policies
CREATE POLICY "Users can view their own messages"
ON public.educator_messages FOR SELECT
USING (sender_id = auth.uid() OR recipient_id = auth.uid());

CREATE POLICY "Educators can send messages"
ON public.educator_messages FOR INSERT
WITH CHECK (sender_id = auth.uid() AND (public.has_role(auth.uid(), 'educator') OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'mentor')));

CREATE POLICY "Recipients can update message read status"
ON public.educator_messages FOR UPDATE
USING (recipient_id = auth.uid());

-- Automated reminders policies
CREATE POLICY "Educators can manage reminders"
ON public.automated_reminders FOR ALL
USING (public.has_role(auth.uid(), 'educator') OR public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'educator') OR public.has_role(auth.uid(), 'admin'));

-- Educator notes policies
CREATE POLICY "Educators can manage their notes"
ON public.educator_notes FOR ALL
USING (educator_id = auth.uid() AND (public.has_role(auth.uid(), 'educator') OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'mentor')))
WITH CHECK (educator_id = auth.uid() AND (public.has_role(auth.uid(), 'educator') OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'mentor')));

-- Live sessions policies
CREATE POLICY "Anyone can view sessions"
ON public.live_sessions FOR SELECT
USING (true);

CREATE POLICY "Educators can manage sessions"
ON public.live_sessions FOR ALL
USING (host_id = auth.uid() OR public.has_role(auth.uid(), 'educator') OR public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'educator') OR public.has_role(auth.uid(), 'admin'));

-- Session attendance policies
CREATE POLICY "Users can view their own attendance"
ON public.session_attendance FOR SELECT
USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'educator') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can record their attendance"
ON public.session_attendance FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Educators can update attendance"
ON public.session_attendance FOR UPDATE
USING (public.has_role(auth.uid(), 'educator') OR public.has_role(auth.uid(), 'admin'));

-- Create function to get user statistics for educators
CREATE OR REPLACE FUNCTION public.get_educator_user_stats()
RETURNS TABLE (
  total_users BIGINT,
  active_users_7d BIGINT,
  avg_lesson_completion NUMERIC,
  total_lessons_completed BIGINT,
  avg_quiz_score NUMERIC
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    (SELECT COUNT(*) FROM profiles) as total_users,
    (SELECT COUNT(*) FROM profiles WHERE updated_at > now() - interval '7 days') as active_users_7d,
    (SELECT COALESCE(AVG(progress), 0) FROM user_lesson_progress) as avg_lesson_completion,
    (SELECT COUNT(*) FROM user_lesson_progress WHERE completed = true) as total_lessons_completed,
    (SELECT COALESCE(AVG(quiz_score), 0) FROM user_lesson_progress WHERE quiz_score IS NOT NULL) as avg_quiz_score
$$;

-- Create function to get struggling users (low progress or inactive)
CREATE OR REPLACE FUNCTION public.get_struggling_users()
RETURNS TABLE (
  user_id UUID,
  display_name TEXT,
  email TEXT,
  last_active TIMESTAMP WITH TIME ZONE,
  avg_progress NUMERIC,
  lessons_started BIGINT,
  lessons_completed BIGINT
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    p.id as user_id,
    p.display_name,
    u.email,
    p.updated_at as last_active,
    COALESCE(AVG(ulp.progress), 0) as avg_progress,
    COUNT(ulp.id) as lessons_started,
    COUNT(CASE WHEN ulp.completed THEN 1 END) as lessons_completed
  FROM profiles p
  LEFT JOIN auth.users u ON u.id = p.id
  LEFT JOIN user_lesson_progress ulp ON ulp.user_id = p.id
  GROUP BY p.id, p.display_name, u.email, p.updated_at
  HAVING COALESCE(AVG(ulp.progress), 0) < 30 OR p.updated_at < now() - interval '14 days'
  ORDER BY avg_progress ASC, p.updated_at ASC
$$;

-- Create indexes for performance
CREATE INDEX idx_announcements_published ON public.announcements(is_published, published_at);
CREATE INDEX idx_educator_messages_recipient ON public.educator_messages(recipient_id, is_read);
CREATE INDEX idx_educator_messages_sender ON public.educator_messages(sender_id);
CREATE INDEX idx_educator_notes_student ON public.educator_notes(student_id);
CREATE INDEX idx_live_sessions_scheduled ON public.live_sessions(scheduled_at, status);
CREATE INDEX idx_session_attendance_user ON public.session_attendance(user_id);
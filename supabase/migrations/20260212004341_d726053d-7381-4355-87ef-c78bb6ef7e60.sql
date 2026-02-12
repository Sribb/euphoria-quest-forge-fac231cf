
-- Educator profiles table
CREATE TABLE public.educator_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  school_name TEXT NOT NULL,
  subject TEXT,
  grade_level TEXT,
  estimated_class_size INTEGER DEFAULT 30,
  is_premium BOOLEAN DEFAULT false,
  premium_since TIMESTAMPTZ,
  stripe_customer_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.educator_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Educators can view own profile" ON public.educator_profiles
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Educators can insert own profile" ON public.educator_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Educators can update own profile" ON public.educator_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE TRIGGER update_educator_profiles_updated_at
  BEFORE UPDATE ON public.educator_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Classes table (no RLS policies referencing class_members yet)
CREATE TABLE public.classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  educator_id UUID NOT NULL,
  class_name TEXT NOT NULL,
  class_code TEXT NOT NULL UNIQUE,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  max_students INTEGER DEFAULT 50,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Educators can manage own classes" ON public.classes
  FOR ALL USING (auth.uid() = educator_id);

CREATE TRIGGER update_classes_updated_at
  BEFORE UPDATE ON public.classes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Class members table
CREATE TABLE public.class_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  student_id UUID NOT NULL,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(class_id, student_id)
);

ALTER TABLE public.class_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Educators can view their class members" ON public.class_members
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.classes c WHERE c.id = class_members.class_id AND c.educator_id = auth.uid())
  );
CREATE POLICY "Students can view own memberships" ON public.class_members
  FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Students can join classes" ON public.class_members
  FOR INSERT WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Students can leave classes" ON public.class_members
  FOR DELETE USING (auth.uid() = student_id);

-- Now add the student view policy on classes
CREATE POLICY "Students can view classes they belong to" ON public.classes
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.class_members cm WHERE cm.class_id = classes.id AND cm.student_id = auth.uid())
  );

-- Direct messages
CREATE TABLE public.direct_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL,
  receiver_id UUID NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.direct_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own DMs" ON public.direct_messages
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "Users can send DMs" ON public.direct_messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Users can mark DMs as read" ON public.direct_messages
  FOR UPDATE USING (auth.uid() = receiver_id);

-- Message groups
CREATE TABLE public.message_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  creator_id UUID NOT NULL,
  avatar_color TEXT DEFAULT '#9b87f5',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.message_groups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create groups" ON public.message_groups
  FOR INSERT WITH CHECK (auth.uid() = creator_id);
CREATE POLICY "Creators can update groups" ON public.message_groups
  FOR UPDATE USING (auth.uid() = creator_id);

CREATE TRIGGER update_message_groups_updated_at
  BEFORE UPDATE ON public.message_groups
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Group members
CREATE TABLE public.group_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES public.message_groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role TEXT DEFAULT 'member',
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(group_id, user_id)
);

ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can join groups" ON public.group_members
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can leave groups" ON public.group_members
  FOR DELETE USING (auth.uid() = user_id);

-- Now add view policies that reference group_members
CREATE POLICY "Group members can view groups" ON public.message_groups
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.group_members gm WHERE gm.group_id = message_groups.id AND gm.user_id = auth.uid())
  );

CREATE POLICY "Members can view group members" ON public.group_members
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.group_members gm WHERE gm.group_id = group_members.group_id AND gm.user_id = auth.uid())
  );

-- Group messages
CREATE TABLE public.group_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES public.message_groups(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.group_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Group members can view messages" ON public.group_messages
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.group_members gm WHERE gm.group_id = group_messages.group_id AND gm.user_id = auth.uid())
  );
CREATE POLICY "Group members can send messages" ON public.group_messages
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (SELECT 1 FROM public.group_members gm WHERE gm.group_id = group_messages.group_id AND gm.user_id = auth.uid())
  );

-- Enable realtime for messaging
ALTER PUBLICATION supabase_realtime ADD TABLE public.direct_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.group_messages;

-- Function to generate unique class codes
CREATE OR REPLACE FUNCTION public.generate_class_code()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  new_code TEXT;
  code_exists BOOLEAN;
BEGIN
  LOOP
    new_code := upper(substr(md5(random()::text), 1, 6));
    SELECT EXISTS (SELECT 1 FROM public.classes WHERE class_code = new_code) INTO code_exists;
    EXIT WHEN NOT code_exists;
  END LOOP;
  RETURN new_code;
END;
$$;

-- Add user_roles view policy for users to see own role
CREATE POLICY "Users can view own role" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

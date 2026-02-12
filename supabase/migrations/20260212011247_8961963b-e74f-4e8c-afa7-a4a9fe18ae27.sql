
-- Fix classes policies: drop restrictive, create permissive
DROP POLICY IF EXISTS "Educators can manage own classes" ON public.classes;
DROP POLICY IF EXISTS "Students can view classes they belong to" ON public.classes;

CREATE POLICY "Educators can manage own classes"
ON public.classes
FOR ALL
USING (auth.uid() = educator_id)
WITH CHECK (auth.uid() = educator_id);

-- Use a security definer function to avoid recursion when students check membership
CREATE OR REPLACE FUNCTION public.is_class_member(_class_id uuid, _user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.class_members
    WHERE class_id = _class_id AND student_id = _user_id
  );
$$;

CREATE POLICY "Students can view classes they belong to"
ON public.classes
FOR SELECT
USING (public.is_class_member(id, auth.uid()));

-- Fix class_members policies: drop restrictive, create permissive
DROP POLICY IF EXISTS "Educators can view their class members" ON public.class_members;
DROP POLICY IF EXISTS "Students can join classes" ON public.class_members;
DROP POLICY IF EXISTS "Students can leave classes" ON public.class_members;
DROP POLICY IF EXISTS "Students can view own memberships" ON public.class_members;

-- Use security definer to check class ownership without hitting classes RLS
CREATE OR REPLACE FUNCTION public.is_class_educator(_class_id uuid, _user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.classes
    WHERE id = _class_id AND educator_id = _user_id
  );
$$;

CREATE POLICY "Educators can view their class members"
ON public.class_members
FOR SELECT
USING (public.is_class_educator(class_id, auth.uid()));

CREATE POLICY "Educators can delete class members"
ON public.class_members
FOR DELETE
USING (public.is_class_educator(class_id, auth.uid()));

CREATE POLICY "Students can join classes"
ON public.class_members
FOR INSERT
WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can leave classes"
ON public.class_members
FOR DELETE
USING (auth.uid() = student_id);

CREATE POLICY "Students can view own memberships"
ON public.class_members
FOR SELECT
USING (auth.uid() = student_id);

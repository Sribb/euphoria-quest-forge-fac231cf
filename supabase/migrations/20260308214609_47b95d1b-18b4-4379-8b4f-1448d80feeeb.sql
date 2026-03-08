
-- Assignments: tracks quests assigned to classes or individual students
CREATE TABLE public.assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  educator_id uuid NOT NULL,
  lesson_id uuid NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  title text NOT NULL,
  instructions text,
  -- targeting: 'class' or 'students'
  target_type text NOT NULL DEFAULT 'class',
  -- for class-level assignments
  class_ids uuid[] NOT NULL DEFAULT '{}',
  -- for student-level differentiation
  student_ids uuid[] NOT NULL DEFAULT '{}',
  due_date timestamp with time zone,
  scheduled_at timestamp with time zone,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;

-- Educators can manage their own assignments
CREATE POLICY "Educators can manage own assignments"
  ON public.assignments FOR ALL
  TO authenticated
  USING (educator_id = auth.uid())
  WITH CHECK (educator_id = auth.uid());

-- Students can view assignments for their classes
CREATE POLICY "Students can view their assignments"
  ON public.assignments FOR SELECT
  TO authenticated
  USING (
    -- Class-level: student is in one of the assigned classes
    EXISTS (
      SELECT 1 FROM public.class_members cm
      WHERE cm.student_id = auth.uid()
        AND cm.class_id = ANY(assignments.class_ids)
    )
    OR
    -- Student-level: directly assigned
    auth.uid() = ANY(assignments.student_ids)
  );

-- Track individual student completion of assignments
CREATE TABLE public.assignment_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id uuid NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
  student_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  score integer,
  started_at timestamp with time zone,
  completed_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(assignment_id, student_id)
);

ALTER TABLE public.assignment_submissions ENABLE ROW LEVEL SECURITY;

-- Students can view and update their own submissions
CREATE POLICY "Students can manage own submissions"
  ON public.assignment_submissions FOR ALL
  TO authenticated
  USING (student_id = auth.uid())
  WITH CHECK (student_id = auth.uid());

-- Educators can view submissions for their assignments
CREATE POLICY "Educators can view submissions for their assignments"
  ON public.assignment_submissions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.assignments a
      WHERE a.id = assignment_submissions.assignment_id
        AND a.educator_id = auth.uid()
    )
  );

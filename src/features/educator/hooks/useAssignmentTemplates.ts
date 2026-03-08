import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export interface TemplateItem {
  lesson_id: string;
  title: string;
  instructions?: string;
  week_offset: number; // weeks from start date
  day_of_week: string; // 'monday', 'tuesday', etc.
}

export interface AssignmentTemplate {
  id: string;
  educator_id: string;
  name: string;
  description: string | null;
  template_type: string;
  is_public: boolean;
  meeting_days: string[];
  items: TemplateItem[];
  created_at: string;
  updated_at: string;
}

export interface CreateTemplateInput {
  name: string;
  description?: string;
  templateType: "custom" | "semester" | "year";
  meetingDays: string[];
  items: TemplateItem[];
}

export interface ApplyTemplateInput {
  templateId: string;
  classIds: string[];
  startDate: Date;
}

const DAYS_MAP: Record<string, number> = {
  sunday: 0, monday: 1, tuesday: 2, wednesday: 3,
  thursday: 4, friday: 5, saturday: 6,
};

export const useAssignmentTemplates = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: templates, isLoading } = useQuery({
    queryKey: ["assignment-templates", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      // Get own templates + public templates
      const { data, error } = await supabase
        .from("assignment_templates")
        .select("*")
        .or(`educator_id.eq.${user.id},is_public.eq.true`)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data || []).map((t: any) => ({
        ...t,
        items: (t.items as any) || [],
      })) as AssignmentTemplate[];
    },
    enabled: !!user?.id,
  });

  const createTemplate = useMutation({
    mutationFn: async (input: CreateTemplateInput) => {
      if (!user?.id) throw new Error("Not authenticated");
      const { error } = await supabase.from("assignment_templates").insert({
        educator_id: user.id,
        name: input.name,
        description: input.description || null,
        template_type: input.templateType,
        meeting_days: input.meetingDays,
        items: input.items as any,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assignment-templates"] });
      toast.success("Template saved!");
    },
    onError: (e) => toast.error("Failed to save template: " + e.message),
  });

  const deleteTemplate = useMutation({
    mutationFn: async (templateId: string) => {
      const { error } = await supabase.from("assignment_templates").delete().eq("id", templateId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assignment-templates"] });
      toast.success("Template deleted");
    },
    onError: (e) => toast.error("Failed to delete template: " + e.message),
  });

  const applyTemplate = useMutation({
    mutationFn: async (input: ApplyTemplateInput) => {
      if (!user?.id) throw new Error("Not authenticated");
      const template = templates?.find(t => t.id === input.templateId);
      if (!template) throw new Error("Template not found");

      const startDate = new Date(input.startDate);
      const assignments = template.items.map(item => {
        // Calculate the actual date based on week_offset and day_of_week
        const targetDay = DAYS_MAP[item.day_of_week] ?? 1;
        const startDay = startDate.getDay();
        let dayOffset = targetDay - startDay;
        if (dayOffset < 0) dayOffset += 7;
        const date = new Date(startDate);
        date.setDate(date.getDate() + dayOffset + (item.week_offset * 7));

        return {
          educator_id: user.id,
          lesson_id: item.lesson_id,
          title: item.title,
          instructions: item.instructions || null,
          target_type: "class",
          class_ids: input.classIds,
          student_ids: [],
          due_date: date.toISOString(),
          scheduled_at: null,
          is_published: true,
        };
      });

      const { error } = await supabase.from("assignments").insert(assignments);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["educator-assignments"] });
      toast.success("Template applied! Assignments created.");
    },
    onError: (e) => toast.error("Failed to apply template: " + e.message),
  });

  return {
    templates: templates || [],
    isLoading,
    createTemplate,
    deleteTemplate,
    applyTemplate,
  };
};

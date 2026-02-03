import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const useEducatorRole = () => {
  const { user } = useAuth();

  const { data: hasEducatorAccess, isLoading } = useQuery({
    queryKey: ["educator-access", user?.id],
    queryFn: async () => {
      if (!user?.id) return false;

      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .in("role", ["educator", "admin", "mentor"]);

      if (error) {
        console.error("Error checking educator role:", error);
        return false;
      }

      return data && data.length > 0;
    },
    enabled: !!user?.id,
  });

  const { data: userRole } = useQuery({
    queryKey: ["user-role", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .single();

      if (error) return "user";
      return data?.role || "user";
    },
    enabled: !!user?.id,
  });

  return {
    hasEducatorAccess: hasEducatorAccess ?? false,
    userRole: userRole ?? "user",
    isLoading,
  };
};

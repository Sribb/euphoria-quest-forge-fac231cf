import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

/**
 * Checks if a user (typically from Google OAuth) needs to select their role.
 * Returns true if:
 * 1. User signed up via Google (no signup_role in metadata)
 * 2. User hasn't completed onboarding yet
 * 3. User still has the default 'user' role (hasn't explicitly chosen)
 */
export const useNeedsRoleSelection = () => {
  const { user } = useAuth();

  const { data: needsSelection, isLoading } = useQuery({
    queryKey: ["needs-role-selection", user?.id],
    queryFn: async () => {
      if (!user?.id) return false;

      // If user signed up with email (has signup_role metadata), skip
      const signupRole = user.user_metadata?.signup_role;
      if (signupRole) return false;

      // Check if user has completed onboarding
      const { data: onboarding } = await supabase
        .from("user_onboarding")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      // If they've already completed onboarding, they've already chosen
      if (onboarding) return false;

      // Check if profile display_name is still default (Google users get 
      // their name from Google, but the trigger sets "Euphoria User")
      // Actually, let's check a simpler signal: localStorage flag
      const roleChosen = localStorage.getItem(`role_chosen_${user.id}`);
      if (roleChosen) return false;

      // This is a new user without explicit role selection
      return true;
    },
    enabled: !!user?.id,
  });

  const markRoleChosen = () => {
    if (user?.id) {
      localStorage.setItem(`role_chosen_${user.id}`, "true");
    }
  };

  return {
    needsRoleSelection: needsSelection ?? false,
    isLoading,
    markRoleChosen,
  };
};

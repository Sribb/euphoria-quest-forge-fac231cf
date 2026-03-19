import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useCallback, useRef } from "react";

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  notification_type: string;
  category: string;
  icon: string;
  action_url: string | null;
  is_read: boolean;
  is_pushed: boolean;
  read_at: string | null;
  created_at: string;
  expires_at: string | null;
}

export interface NotificationPreferences {
  id: string;
  user_id: string;
  streak_alerts: boolean;
  achievement_alerts: boolean;
  weekly_summary: boolean;
  re_engagement: boolean;
  push_enabled: boolean;
  push_subscription: any;
  quiet_hours_start: number;
  quiet_hours_end: number;
  max_daily_notifications: number;
  notifications_today: number;
}

export const useNotifications = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const lastGenerateRef = useRef<number>(0);

  // Fetch notifications
  const {
    data: notifications = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["notifications", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      return (data || []) as Notification[];
    },
    enabled: !!user?.id,
    staleTime: 30000,
  });

  // Fetch preferences
  const { data: preferences } = useQuery({
    queryKey: ["notification-preferences", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from("notification_preferences")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        // Create default preferences
        const { data: newPrefs, error: insertError } = await supabase
          .from("notification_preferences")
          .insert({ user_id: user.id })
          .select()
          .single();

        if (insertError) throw insertError;
        return newPrefs as NotificationPreferences;
      }

      return data as NotificationPreferences;
    },
    enabled: !!user?.id,
  });

  // Mark as read
  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      if (!user?.id) return;
      await supabase
        .from("notifications")
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq("id", notificationId)
        .eq("user_id", user.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  // Mark all as read
  const markAllReadMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) return;
      await supabase
        .from("notifications")
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq("user_id", user.id)
        .eq("is_read", false);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  // Update preferences
  const updatePreferencesMutation = useMutation({
    mutationFn: async (updates: Partial<NotificationPreferences>) => {
      if (!user?.id) return;
      await supabase
        .from("notification_preferences")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("user_id", user.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notification-preferences"] });
    },
  });

  // Generate notifications (throttled to once per 5 min)
  const generateNotifications = useCallback(async () => {
    if (!user?.id) return;
    const now = Date.now();
    if (now - lastGenerateRef.current < 30 * 60 * 1000) return;
    lastGenerateRef.current = now;

    try {
      await supabase.functions.invoke("generate-notifications", {
        body: { userId: user.id },
      });
      refetch();
    } catch (err) {
      console.error("Failed to generate notifications:", err);
    }
  }, [user?.id, refetch]);

  // Subscribe to realtime notifications
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel("user-notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          queryClient.invalidateQueries({ queryKey: ["notifications"] });

          // Show browser notification if enabled and supported
          if (preferences?.push_enabled && "Notification" in window && Notification.permission === "granted") {
            const n = payload.new as Notification;
            new window.Notification(n.title, {
              body: n.message,
              icon: "/favicon.ico",
              tag: n.id,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, preferences?.push_enabled, queryClient]);

  // Auto-generate on mount
  useEffect(() => {
    generateNotifications();
  }, [generateNotifications]);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  // Request push permission
  const requestPushPermission = async () => {
    if (!("Notification" in window)) return false;
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      updatePreferencesMutation.mutate({ push_enabled: true } as any);
      return true;
    }
    return false;
  };

  return {
    notifications,
    unreadCount,
    isLoading,
    preferences,
    markAsRead: markAsReadMutation.mutate,
    markAllRead: markAllReadMutation.mutate,
    updatePreferences: updatePreferencesMutation.mutate,
    requestPushPermission,
    generateNotifications,
  };
};

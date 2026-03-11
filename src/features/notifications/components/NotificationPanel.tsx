import { useState, useRef, useEffect } from "react";
import { Bell, Check, CheckCheck, Settings, X, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useNotifications, Notification } from "../hooks/useNotifications";
import { formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

interface NotificationPanelProps {
  onNavigate?: (path: string) => void;
}

const getCategoryStyle = (category: string) => {
  switch (category) {
    case "urgent":
      return "border-l-destructive bg-destructive/5";
    case "celebration":
      return "border-l-warning bg-warning/5";
    case "info":
      return "border-l-primary bg-primary/5";
    default:
      return "border-l-border bg-card";
  }
};

export const NotificationPanel = ({ onNavigate }: NotificationPanelProps) => {
  const {
    notifications,
    unreadCount,
    preferences,
    markAsRead,
    markAllRead,
    updatePreferences,
    requestPushPermission,
  } = useNotifications();

  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setShowSettings(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.is_read) {
      markAsRead(notification.id);
    }
    if (notification.action_url && onNavigate) {
      const tab = notification.action_url.replace("/", "");
      onNavigate(tab);
      setIsOpen(false);
    }
  };

  const handlePushToggle = async (enabled: boolean) => {
    if (enabled) {
      const granted = await requestPushPermission();
      if (!granted) return;
    } else {
      updatePreferences({ push_enabled: false } as any);
    }
  };

  return (
    <div ref={panelRef} className="relative">
      {/* Bell trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl hover:bg-muted transition-colors"
      >
        <Bell className="w-5 h-5 text-foreground" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-destructive text-destructive-foreground text-[10px] font-black px-1 animate-pulse">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Panel dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="fixed left-[228px] top-[60px] w-[380px] max-w-[calc(100vw-16px)] max-h-[520px] bg-card border border-border rounded-2xl shadow-xl z-50 overflow-hidden md:left-[228px] md:top-[60px]"
            style={{ position: 'fixed' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
              <h3 className="font-black text-foreground text-base">Notifications</h3>
              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => markAllRead()}
                    className="text-xs h-7 px-2"
                  >
                    <CheckCheck className="w-3.5 h-3.5 mr-1" />
                    Read all
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => setShowSettings(!showSettings)}
                >
                  <Settings className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {showSettings ? (
              <div className="p-4 space-y-4">
                <h4 className="font-bold text-sm text-foreground">Notification Settings</h4>

                <div className="space-y-3">
                  {[
                    { key: "streak_alerts", label: "Streak Protection Alerts", desc: "Warn when your streak is at risk" },
                    { key: "achievement_alerts", label: "Achievement Celebrations", desc: "Notify when you earn badges" },
                    { key: "weekly_summary", label: "Weekly Progress Summary", desc: "Sunday recap of your week" },
                    { key: "re_engagement", label: "Re-engagement Nudges", desc: "Reminders when you're inactive" },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-foreground">{item.label}</p>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                      <Switch
                        checked={(preferences as any)?.[item.key] ?? true}
                        onCheckedChange={(val) =>
                          updatePreferences({ [item.key]: val } as any)
                        }
                      />
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                        {preferences?.push_enabled ? (
                          <Volume2 className="w-4 h-4 text-primary" />
                        ) : (
                          <VolumeX className="w-4 h-4 text-muted-foreground" />
                        )}
                        Browser Push Notifications
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Get alerts even when the app is closed
                      </p>
                    </div>
                    <Switch
                      checked={preferences?.push_enabled ?? false}
                      onCheckedChange={handlePushToggle}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <ScrollArea className="max-h-[420px]">
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 px-4">
                    <Bell className="w-10 h-10 text-muted-foreground/40 mb-3" />
                    <p className="text-sm font-semibold text-muted-foreground">No notifications yet</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      You'll see streak alerts, achievements, and more here
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {notifications.map((notification) => (
                      <button
                        key={notification.id}
                        onClick={() => handleNotificationClick(notification)}
                        className={cn(
                          "w-full text-left px-4 py-3 border-l-[3px] transition-colors hover:bg-muted/50",
                          getCategoryStyle(notification.category),
                          !notification.is_read && "bg-primary/5"
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-lg flex-shrink-0 mt-0.5">
                            {notification.icon}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p
                                className={cn(
                                  "text-sm truncate",
                                  notification.is_read
                                    ? "font-medium text-foreground"
                                    : "font-bold text-foreground"
                                )}
                              >
                                {notification.title}
                              </p>
                              {!notification.is_read && (
                                <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                              {notification.message}
                            </p>
                            <p className="text-[10px] text-muted-foreground/70 mt-1">
                              {formatDistanceToNow(new Date(notification.created_at), {
                                addSuffix: true,
                              })}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </ScrollArea>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

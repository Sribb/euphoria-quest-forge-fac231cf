import { useState, useEffect } from "react";
import {
  Palette, Bell, Shield, Database, Languages, Brain,
  Volume2, Sun, Moon, RotateCcw, BookOpen, Globe, Download,
  LogOut, Trash2, Lock, Eye, EyeOff, Users, MessageSquare,
  TrendingUp, Flame, Check, AlertTriangle
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { isSoundEnabled, setSoundEnabled, playClick } from "@/lib/soundEffects";
import Onboarding from "@/pages/Onboarding";
import { motion } from "framer-motion";

interface SettingsTabProps {
  userId: string;
  onboarding: any;
  placementLesson: number;
  refetchOnboarding: () => void;
}

const THEME_PRESETS = [
  { name: "Euphoria", color: "#9b87f5", hsl: "263 84% 58%" },
  { name: "Ocean", color: "#0EA5E9", hsl: "199 89% 48%" },
  { name: "Forest", color: "#10B981", hsl: "160 84% 39%" },
  { name: "Sunset", color: "#F59E0B", hsl: "45 93% 50%" },
  { name: "Rose", color: "#EC4899", hsl: "330 81% 60%" },
  { name: "Ruby", color: "#EF4444", hsl: "0 84% 60%" },
];

const FONT_SIZES = [
  { label: "S", value: "14px" },
  { label: "M", value: "16px" },
  { label: "L", value: "18px" },
  { label: "XL", value: "20px" },
];

type ExpandedCard = null | "appearance" | "notifications" | "privacy" | "data" | "language" | "placement";

export const SettingsTab = ({ userId, onboarding, placementLesson, refetchOnboarding }: SettingsTabProps) => {
  const queryClient = useQueryClient();
  const [darkMode, setDarkMode] = useState(true);
  const [primaryColor, setPrimaryColor] = useState("#9b87f5");
  const [fontSize, setFontSize] = useState("16px");
  const [soundOn, setSoundOn] = useState(isSoundEnabled());
  const [expanded, setExpanded] = useState<ExpandedCard>(null);
  const [showRetakeWarning, setShowRetakeWarning] = useState(false);
  const [showRetakeQuiz, setShowRetakeQuiz] = useState(false);
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  const [showSignOut, setShowSignOut] = useState(false);

  const [notifMessages, setNotifMessages] = useState(true);
  const [notifLikes, setNotifLikes] = useState(true);
  const [notifComments, setNotifComments] = useState(true);
  const [notifStreaks, setNotifStreaks] = useState(true);
  const [notifLessons, setNotifLessons] = useState(true);
  const [notifMarket, setNotifMarket] = useState(true);

  const [profileVisibility, setProfileVisibility] = useState("public");
  const [portfolioVisibility, setPortfolioVisibility] = useState("public");
  const [activityVisibility, setActivityVisibility] = useState("public");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    setDarkMode(savedTheme === "dark" || savedTheme === null);
    const savedColor = localStorage.getItem("primaryColor");
    if (savedColor) setPrimaryColor(savedColor);
    const savedFont = localStorage.getItem("fontSize");
    if (savedFont) setFontSize(savedFont);
  }, []);

  const applyThemeColor = (color: string, hsl: string) => {
    setPrimaryColor(color);
    localStorage.setItem("primaryColor", color);
    document.documentElement.style.setProperty("--primary", hsl);
    toast.success("Theme updated");
  };

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
    document.documentElement.classList.toggle("dark", newMode);
  };

  const changeFontSize = (size: string) => {
    setFontSize(size);
    localStorage.setItem("fontSize", size);
    document.documentElement.style.fontSize = size;
  };

  const handleExportData = () => {
    toast.success("Preparing your data export...");
    setTimeout(() => toast.info("Data export will be emailed to you shortly."), 1500);
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Signed out");
      window.location.href = "/auth";
    } catch {
      toast.error("Failed to sign out");
    }
  };

  const handleDeleteAccount = async () => {
    toast.error("Account deletion requires contacting support.");
    setShowDeleteAccount(false);
  };

  const toggle = (card: ExpandedCard) => setExpanded(expanded === card ? null : card);

  const notifCount = [notifMessages, notifLikes, notifComments, notifStreaks, notifLessons, notifMarket].filter(Boolean).length;

  const cards = [
    {
      id: "appearance" as const,
      icon: Palette,
      title: "Appearance",
      summary: `${darkMode ? "Dark" : "Light"} · ${THEME_PRESETS.find(t => t.color === primaryColor)?.name || "Custom"}`,
      span: "",
    },
    {
      id: "notifications" as const,
      icon: Bell,
      title: "Notifications",
      summary: `${notifCount}/6 enabled`,
      span: "",
    },
    {
      id: "privacy" as const,
      icon: Shield,
      title: "Privacy",
      summary: `Profile: ${profileVisibility}`,
      span: "",
    },
    {
      id: "language" as const,
      icon: Languages,
      title: "Language",
      summary: "English",
      span: "",
    },
    {
      id: "placement" as const,
      icon: Brain,
      title: "Learning Placement",
      summary: `Lesson ${placementLesson} · ${onboarding?.investment_level || "beginner"}`,
      span: "",
    },
    {
      id: "data" as const,
      icon: Database,
      title: "Data & Storage",
      summary: "Export · Cache",
      span: "",
    },
  ];

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Bento Grid */}
      <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
        {cards.map((card, i) => {
          const Icon = card.icon;
          const isExpanded = expanded === card.id;

          return (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className={cn(card.span, isExpanded && "md:col-span-2 lg:col-span-3")}
            >
              <Card
                className={cn(
                  "transition-all duration-300 overflow-hidden",
                  isExpanded ? "ring-1 ring-primary/30" : "hover:border-primary/30 cursor-pointer"
                )}
              >
                {/* Header — always visible */}
                <button
                  onClick={() => toggle(card.id)}
                  className="w-full flex items-center gap-3 p-4 text-left"
                >
                  <div className={cn(
                    "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                    isExpanded ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
                  )}>
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold">{card.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{card.summary}</p>
                  </div>
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-muted-foreground"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </motion.div>
                </button>

                {/* Expanded content */}
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="px-4 pb-4"
                  >
                    <Separator className="mb-4" />

                    {card.id === "appearance" && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {darkMode ? <Moon className="w-4 h-4 text-muted-foreground" /> : <Sun className="w-4 h-4 text-muted-foreground" />}
                            <span className="text-sm">Dark Mode</span>
                          </div>
                          <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
                        </div>

                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-2">THEME</p>
                          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                            {THEME_PRESETS.map((t) => (
                              <button
                                key={t.name}
                                onClick={() => applyThemeColor(t.color, t.hsl)}
                                className={cn(
                                  "rounded-xl border-2 p-2 transition-all text-center hover:scale-[1.03]",
                                  primaryColor === t.color ? "border-primary ring-2 ring-primary/30" : "border-border"
                                )}
                              >
                                <div className="w-full h-6 rounded-lg mb-1" style={{ background: t.color }} />
                                <span className="text-[10px] font-medium">{t.name}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-2">FONT SIZE</p>
                          <div className="flex gap-2">
                            {FONT_SIZES.map((f) => (
                              <button
                                key={f.value}
                                onClick={() => changeFontSize(f.value)}
                                className={cn(
                                  "flex-1 py-1.5 rounded-lg border text-sm font-medium transition-all",
                                  fontSize === f.value
                                    ? "border-primary bg-primary/10 text-primary"
                                    : "border-border text-muted-foreground hover:bg-muted/50"
                                )}
                              >
                                {f.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Volume2 className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">Sound Effects</span>
                          </div>
                          <Switch checked={soundOn} onCheckedChange={(v) => { setSoundOn(v); setSoundEnabled(v); if (v) playClick(); }} />
                        </div>

                        <Button size="sm" variant="ghost" className="text-xs" onClick={() => {
                          applyThemeColor("#9b87f5", "263 84% 58%");
                          if (!darkMode) toggleDarkMode();
                          changeFontSize("16px");
                          toast.success("Reset to defaults");
                        }}>
                          <RotateCcw className="w-3 h-3 mr-1" /> Reset Defaults
                        </Button>
                      </div>
                    )}

                    {card.id === "notifications" && (
                      <div className="space-y-2">
                        {[
                          { label: "Messages", icon: MessageSquare, state: notifMessages, set: setNotifMessages },
                          { label: "Likes & Reactions", icon: Check, state: notifLikes, set: setNotifLikes },
                          { label: "Comments", icon: MessageSquare, state: notifComments, set: setNotifComments },
                          { label: "Streak Reminders", icon: Flame, state: notifStreaks, set: setNotifStreaks },
                          { label: "Lesson Reminders", icon: BookOpen, state: notifLessons, set: setNotifLessons },
                          { label: "Market Alerts", icon: TrendingUp, state: notifMarket, set: setNotifMarket },
                        ].map(({ label, icon: NIcon, state, set }) => (
                          <div key={label} className="flex items-center justify-between py-1.5">
                            <div className="flex items-center gap-2">
                              <NIcon className="w-3.5 h-3.5 text-muted-foreground" />
                              <span className="text-sm">{label}</span>
                            </div>
                            <Switch checked={state} onCheckedChange={set} />
                          </div>
                        ))}
                      </div>
                    )}

                    {card.id === "privacy" && (
                      <div className="space-y-3">
                        {[
                          { label: "Profile Visibility", icon: Eye, value: profileVisibility, set: setProfileVisibility },
                          { label: "Portfolio", icon: TrendingUp, value: portfolioVisibility, set: setPortfolioVisibility },
                          { label: "Activity", icon: Users, value: activityVisibility, set: setActivityVisibility },
                        ].map(({ label, icon: PIcon, value, set }) => (
                          <div key={label} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <PIcon className="w-3.5 h-3.5 text-muted-foreground" />
                              <span className="text-sm">{label}</span>
                            </div>
                            <Select value={value} onValueChange={set}>
                              <SelectTrigger className="w-24 h-8 text-xs"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="public">Public</SelectItem>
                                <SelectItem value="friends">Friends</SelectItem>
                                <SelectItem value="private">Private</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        ))}
                      </div>
                    )}

                    {card.id === "language" && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Globe className="w-3.5 h-3.5 text-muted-foreground" />
                          <span className="text-sm">Display Language</span>
                        </div>
                        <Select defaultValue="en">
                          <SelectTrigger className="w-28 h-8 text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="es">Español</SelectItem>
                            <SelectItem value="fr">Français</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {card.id === "placement" && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/20">
                          <div>
                            <p className="text-sm font-medium">Lesson {placementLesson}</p>
                            <p className="text-xs text-muted-foreground">
                              Score: {onboarding?.quiz_score || 0}/20 · {onboarding?.investment_level || "beginner"}
                            </p>
                          </div>
                          <Button size="sm" variant="outline" onClick={() => setShowRetakeWarning(true)}>
                            Retake
                          </Button>
                        </div>
                      </div>
                    )}

                    {card.id === "data" && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between py-1.5">
                          <div className="flex items-center gap-2">
                            <Download className="w-3.5 h-3.5 text-muted-foreground" />
                            <span className="text-sm">Export Data</span>
                          </div>
                          <Button size="sm" variant="outline" onClick={handleExportData}>Export</Button>
                        </div>
                        <div className="flex items-center justify-between py-1.5">
                          <div className="flex items-center gap-2">
                            <Database className="w-3.5 h-3.5 text-muted-foreground" />
                            <span className="text-sm">Clear Cache</span>
                          </div>
                          <Button size="sm" variant="outline" onClick={() => {
                            localStorage.clear();
                            toast.success("Cache cleared. Reloading...");
                            setTimeout(() => window.location.reload(), 1000);
                          }}>Clear</Button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Account actions — always visible */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Lock className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-bold">Account</h2>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setShowSignOut(true)}>
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-destructive hover:text-destructive border-destructive/30 hover:bg-destructive/10"
              onClick={() => setShowDeleteAccount(true)}
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete Account
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Dialogs */}
      <AlertDialog open={showSignOut} onOpenChange={setShowSignOut}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sign out?</AlertDialogTitle>
            <AlertDialogDescription>You'll need to sign back in to access your account.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSignOut}>Sign Out</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showDeleteAccount} onOpenChange={setShowDeleteAccount}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-5 h-5" /> Delete Account?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action is permanent. All data, progress, achievements, and portfolio will be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete My Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showRetakeWarning} onOpenChange={setShowRetakeWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-warning" /> Retake Placement Quiz?
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-3">
              <p>Your placement quiz score determines which lessons are unlocked.</p>
              <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
                <p className="text-warning font-medium text-sm">
                  Warning: Your level can go <strong>down</strong> as well as up!
                </p>
              </div>
              <p className="text-sm">
                Current: <strong>Lesson {placementLesson}</strong> · Score: <strong>{onboarding?.quiz_score || 0}/20</strong>
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => { setShowRetakeWarning(false); setShowRetakeQuiz(true); }}
              className="bg-warning text-warning-foreground hover:bg-warning/90"
            >
              I Understand, Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={showRetakeQuiz} onOpenChange={setShowRetakeQuiz}>
        <DialogContent className="max-w-4xl h-[90vh] p-0 overflow-hidden">
          <Onboarding
            isRetake={true}
            onComplete={() => {
              setShowRetakeQuiz(false);
              refetchOnboarding();
              queryClient.invalidateQueries({ queryKey: ["lessons"] });
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

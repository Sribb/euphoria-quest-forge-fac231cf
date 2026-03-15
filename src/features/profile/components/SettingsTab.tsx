import { useState, useEffect } from "react";
import {
  Palette, Bell, Shield, Globe, Link2, Database, HelpCircle, Languages,
  Download, LogOut, Trash2, RotateCcw, BookOpen, Brain, Volume2, Sun, Moon,
  Monitor, ChevronRight, Eye, EyeOff, Users, Lock, MessageSquare,
  TrendingUp, Flame, AlertTriangle, Check
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
  { label: "Small", value: "14px", class: "text-sm" },
  { label: "Default", value: "16px", class: "text-base" },
  { label: "Large", value: "18px", class: "text-lg" },
  { label: "Extra Large", value: "20px", class: "text-xl" },
];

function SettingRow({
  icon: Icon, title, description, children, className
}: {
  icon: any; title: string; description: string; children: React.ReactNode; className?: string;
}) {
  return (
    <div className={cn("flex items-center justify-between gap-4 py-3", className)}>
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <Icon className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
        <div className="min-w-0">
          <p className="text-sm font-medium">{title}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

export const SettingsTab = ({ userId, onboarding, placementLesson, refetchOnboarding }: SettingsTabProps) => {
  const queryClient = useQueryClient();
  const [darkMode, setDarkMode] = useState(true);
  const [primaryColor, setPrimaryColor] = useState("#9b87f5");
  const [fontSize, setFontSize] = useState("16px");
  const [soundOn, setSoundOn] = useState(isSoundEnabled());
  const [showRetakeWarning, setShowRetakeWarning] = useState(false);
  const [showRetakeQuiz, setShowRetakeQuiz] = useState(false);
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  const [showSignOut, setShowSignOut] = useState(false);

  // Notification states
  const [notifMessages, setNotifMessages] = useState(true);
  const [notifLikes, setNotifLikes] = useState(true);
  const [notifComments, setNotifComments] = useState(true);
  const [notifStreaks, setNotifStreaks] = useState(true);
  const [notifLessons, setNotifLessons] = useState(true);
  const [notifMarket, setNotifMarket] = useState(true);

  // Privacy states
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
    toast.success(`${newMode ? "Dark" : "Light"} mode`);
  };

  const changeFontSize = (size: string) => {
    setFontSize(size);
    localStorage.setItem("fontSize", size);
    document.documentElement.style.fontSize = size;
    toast.success("Font size updated");
  };

  const handleResetAppearance = () => {
    applyThemeColor("#9b87f5", "263 84% 58%");
    if (!darkMode) toggleDarkMode();
    changeFontSize("16px");
    toast.success("Appearance reset to defaults");
  };

  const handleExportData = () => {
    toast.success("Preparing your data export...");
    // In a real app, this would trigger an edge function
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

  return (
    <div className="space-y-4 animate-fade-in">
      {/* APPEARANCE */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Palette className="w-4.5 h-4.5 text-primary" />
            <h2 className="text-base font-bold">Appearance</h2>
          </div>

          <SettingRow icon={darkMode ? Moon : Sun} title="Dark Mode" description="Toggle dark and light theme">
            <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
          </SettingRow>

          <Separator className="my-1" />

          {/* Theme Selector */}
          <div className="py-3">
            <p className="text-sm font-medium mb-2">Theme</p>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {THEME_PRESETS.map((t) => (
                <button
                  key={t.name}
                  onClick={() => applyThemeColor(t.color, t.hsl)}
                  className={cn(
                    "rounded-xl border-2 p-2.5 transition-all text-center hover:scale-[1.03]",
                    primaryColor === t.color
                      ? "border-primary ring-2 ring-primary/30"
                      : "border-border"
                  )}
                >
                  <div
                    className="w-full h-8 rounded-lg mb-1.5"
                    style={{ background: `linear-gradient(135deg, ${t.color}, ${t.color}dd)` }}
                  />
                  <span className="text-[11px] font-medium">{t.name}</span>
                </button>
              ))}
            </div>
          </div>

          <Separator className="my-1" />

          {/* Font Size */}
          <div className="py-3">
            <p className="text-sm font-medium mb-2">Font Size</p>
            <div className="flex gap-2">
              {FONT_SIZES.map((f) => (
                <button
                  key={f.value}
                  onClick={() => changeFontSize(f.value)}
                  className={cn(
                    "flex-1 py-2 rounded-lg border text-center transition-all",
                    fontSize === f.value
                      ? "border-primary bg-primary/10 text-primary font-semibold"
                      : "border-border text-muted-foreground hover:bg-muted/50"
                  )}
                >
                  <span className={f.class}>{f.label}</span>
                </button>
              ))}
            </div>
          </div>

          <Separator className="my-1" />

          <SettingRow icon={Volume2} title="Sound Effects" description="Interaction sounds and rewards">
            <Switch
              checked={soundOn}
              onCheckedChange={(checked) => {
                setSoundOn(checked);
                setSoundEnabled(checked);
                if (checked) playClick();
              }}
            />
          </SettingRow>

          <Separator className="my-1" />

          <SettingRow icon={RotateCcw} title="Reset Appearance" description="Restore defaults">
            <Button size="sm" variant="ghost" onClick={handleResetAppearance}>
              Reset
            </Button>
          </SettingRow>
        </Card>
      </motion.div>

      {/* NOTIFICATIONS */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-4.5 h-4.5 text-primary" />
            <h2 className="text-base font-bold">Notifications</h2>
          </div>

          <SettingRow icon={MessageSquare} title="Messages" description="Direct and group messages">
            <Switch checked={notifMessages} onCheckedChange={setNotifMessages} />
          </SettingRow>
          <Separator className="my-1" />
          <SettingRow icon={Check} title="Likes & Reactions" description="When someone likes your content">
            <Switch checked={notifLikes} onCheckedChange={setNotifLikes} />
          </SettingRow>
          <Separator className="my-1" />
          <SettingRow icon={MessageSquare} title="Comments" description="Replies to your posts">
            <Switch checked={notifComments} onCheckedChange={setNotifComments} />
          </SettingRow>
          <Separator className="my-1" />
          <SettingRow icon={Flame} title="Streak Reminders" description="Don't lose your streak!">
            <Switch checked={notifStreaks} onCheckedChange={setNotifStreaks} />
          </SettingRow>
          <Separator className="my-1" />
          <SettingRow icon={BookOpen} title="Lesson Reminders" description="Continue your learning">
            <Switch checked={notifLessons} onCheckedChange={setNotifLessons} />
          </SettingRow>
          <Separator className="my-1" />
          <SettingRow icon={TrendingUp} title="Market Alerts" description="Portfolio and trade updates">
            <Switch checked={notifMarket} onCheckedChange={setNotifMarket} />
          </SettingRow>
        </Card>
      </motion.div>

      {/* PRIVACY */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-4.5 h-4.5 text-primary" />
            <h2 className="text-base font-bold">Privacy</h2>
          </div>

          <SettingRow icon={Eye} title="Profile Visibility" description="Who can see your profile">
            <Select value={profileVisibility} onValueChange={setProfileVisibility}>
              <SelectTrigger className="w-28 h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="friends">Friends</SelectItem>
                <SelectItem value="private">Private</SelectItem>
              </SelectContent>
            </Select>
          </SettingRow>
          <Separator className="my-1" />
          <SettingRow icon={TrendingUp} title="Portfolio" description="Who can see your holdings">
            <Select value={portfolioVisibility} onValueChange={setPortfolioVisibility}>
              <SelectTrigger className="w-28 h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="friends">Friends</SelectItem>
                <SelectItem value="private">Private</SelectItem>
              </SelectContent>
            </Select>
          </SettingRow>
          <Separator className="my-1" />
          <SettingRow icon={Users} title="Activity" description="Who can see your activity">
            <Select value={activityVisibility} onValueChange={setActivityVisibility}>
              <SelectTrigger className="w-28 h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="friends">Friends</SelectItem>
                <SelectItem value="private">Private</SelectItem>
              </SelectContent>
            </Select>
          </SettingRow>
        </Card>
      </motion.div>

      {/* CONNECTED ACCOUNTS */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Link2 className="w-4.5 h-4.5 text-primary" />
            <h2 className="text-base font-bold">Connected Accounts</h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg border border-border">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-sm">G</div>
                <div>
                  <p className="text-sm font-medium">Google</p>
                  <p className="text-xs text-muted-foreground">Sign-in provider</p>
                </div>
              </div>
              <Button size="sm" variant="outline" disabled>Connected</Button>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border border-border">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-sm">🍎</div>
                <div>
                  <p className="text-sm font-medium">Apple</p>
                  <p className="text-xs text-muted-foreground">Not connected</p>
                </div>
              </div>
              <Button size="sm" variant="outline">Connect</Button>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* LEARNING PLACEMENT */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="w-4.5 h-4.5 text-primary" />
            <h2 className="text-base font-bold">Learning Placement</h2>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg border border-border">
            <div>
              <p className="text-sm font-medium">Current Placement: Lesson {placementLesson}</p>
              <p className="text-xs text-muted-foreground">
                Score: {onboarding?.quiz_score || 0}/20 • Level: {onboarding?.investment_level || "beginner"}
              </p>
            </div>
            <Button size="sm" variant="outline" onClick={() => setShowRetakeWarning(true)}>
              Retake
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* DATA & STORAGE */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Database className="w-4.5 h-4.5 text-primary" />
            <h2 className="text-base font-bold">Data & Storage</h2>
          </div>
          <SettingRow icon={Download} title="Export Data" description="Download your learning data and portfolio history">
            <Button size="sm" variant="outline" onClick={handleExportData}>
              Export
            </Button>
          </SettingRow>
          <Separator className="my-1" />
          <SettingRow icon={Database} title="Clear Cache" description="Clear cached content and temporary files">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                localStorage.clear();
                toast.success("Cache cleared. Page will reload.");
                setTimeout(() => window.location.reload(), 1000);
              }}
            >
              Clear
            </Button>
          </SettingRow>
        </Card>
      </motion.div>

      {/* LANGUAGE */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Languages className="w-4.5 h-4.5 text-primary" />
            <h2 className="text-base font-bold">Language & Region</h2>
          </div>
          <SettingRow icon={Globe} title="Language" description="Display language">
            <Select defaultValue="en">
              <SelectTrigger className="w-28 h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
              </SelectContent>
            </Select>
          </SettingRow>
        </Card>
      </motion.div>

      {/* HELP */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
        <Card className="p-5">
          <button className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <HelpCircle className="w-4.5 h-4.5 text-primary" />
              <div className="text-left">
                <p className="text-sm font-medium">Help & Support</p>
                <p className="text-xs text-muted-foreground">FAQ, feedback, and contact</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        </Card>
      </motion.div>

      {/* ACCOUNT */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Lock className="w-4.5 h-4.5 text-primary" />
            <h2 className="text-base font-bold">Account</h2>
          </div>
          <Button
            variant="outline"
            className="w-full justify-start gap-2 mb-2"
            onClick={() => setShowSignOut(true)}
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start gap-2 text-destructive hover:text-destructive border-destructive/30 hover:bg-destructive/10"
            onClick={() => setShowDeleteAccount(true)}
          >
            <Trash2 className="w-4 h-4" /> Delete Account
          </Button>
        </Card>
      </motion.div>

      {/* DIALOGS */}
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
              This action is permanent and cannot be undone. All your data, progress, achievements, and portfolio will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
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
                Current: <strong>Lesson {placementLesson}</strong> • Score: <strong>{onboarding?.quiz_score || 0}/20</strong>
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

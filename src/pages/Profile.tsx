import { User, Award, TrendingUp, Target, Edit, Palette, Bell, Lock, Settings as SettingsIcon, RotateCcw, Brain, BookOpen } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useOnboarding } from "@/hooks/useOnboarding";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { formatDollar } from "@/lib/formatters";
import { useNavigate } from "react-router-dom";
import Onboarding from "./Onboarding";
const PRESET_AVATARS = [{
  id: 1,
  color: "#9b87f5",
  alt: "Purple avatar"
}, {
  id: 2,
  color: "#0EA5E9",
  alt: "Blue avatar"
}, {
  id: 3,
  color: "#10B981",
  alt: "Green avatar"
}, {
  id: 4,
  color: "#F59E0B",
  alt: "Orange avatar"
}, {
  id: 5,
  color: "#EF4444",
  alt: "Red avatar"
}, {
  id: 6,
  color: "#EC4899",
  alt: "Pink avatar"
}, {
  id: 7,
  color: "#8B5CF6",
  alt: "Violet avatar"
}, {
  id: 8,
  color: "#14B8A6",
  alt: "Teal avatar"
}];
interface ProfileProps {
  onNavigate: (tab: string) => void;
}
const Profile = ({
  onNavigate
}: ProfileProps) => {
  const {
    user
  } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    onboarding,
    placementLesson,
    refetch: refetchOnboarding
  } = useOnboarding();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#9b87f5");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState<string>("");
  const [showAvatarDialog, setShowAvatarDialog] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [showRetakeWarning, setShowRetakeWarning] = useState(false);
  const [showRetakeQuiz, setShowRetakeQuiz] = useState(false);
  useEffect(() => {
    // Load theme preference from localStorage
    const savedTheme = localStorage.getItem("theme");
    setDarkMode(savedTheme === "dark" || savedTheme === null);
    const savedColor = localStorage.getItem("primaryColor");
    if (savedColor) setPrimaryColor(savedColor);
  }, []);
  const {
    data: profile
  } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("profiles").select("*").eq("id", user?.id).single();
      if (error) throw error;
      setDisplayName(data.display_name || "");
      setSelectedAvatar(data.avatar_url || "");
      return data;
    },
    enabled: !!user?.id
  });
  const {
    data: portfolio
  } = useQuery({
    queryKey: ["portfolio", user?.id],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("portfolios").select("*").eq("user_id", user?.id).single();
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id
  });
  const {
    data: streak
  } = useQuery({
    queryKey: ["streak", user?.id],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("streaks").select("*").eq("user_id", user?.id).single();
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id
  });
  const {
    data: userAchievements
  } = useQuery({
    queryKey: ["userAchievements", user?.id],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("user_achievements").select(`
          *,
          achievements(*)
        `).eq("user_id", user?.id);
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id
  });
  const updateProfileMutation = useMutation({
    mutationFn: async (newDisplayName: string) => {
      const {
        error
      } = await supabase.from("profiles").update({
        display_name: newDisplayName
      }).eq("id", user?.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["profile"]
      });
      setIsEditing(false);
      toast.success("Profile updated!");
    },
    onError: () => {
      toast.error("Failed to update profile");
    }
  });
  const updateAvatarMutation = useMutation({
    mutationFn: async (avatarUrl: string) => {
      const {
        error
      } = await supabase.from("profiles").update({
        avatar_url: avatarUrl
      }).eq("id", user?.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["profile"]
      });
      setShowAvatarDialog(false);
      toast.success("Avatar updated!");
    },
    onError: () => {
      toast.error("Failed to update avatar");
    }
  });
  const portfolioReturn = portfolio ? (Number(portfolio.total_value) - 10000) / 10000 * 100 : 0;
  const applyThemeColor = (color: string) => {
    setPrimaryColor(color);
    localStorage.setItem("primaryColor", color);

    // Convert hex to HSL
    const r = parseInt(color.slice(1, 3), 16) / 255;
    const g = parseInt(color.slice(3, 5), 16) / 255;
    const b = parseInt(color.slice(5, 7), 16) / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0,
      s = 0,
      l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
          break;
        case g:
          h = ((b - r) / d + 2) / 6;
          break;
        case b:
          h = ((r - g) / d + 4) / 6;
          break;
      }
    }
    h = Math.round(h * 360);
    s = Math.round(s * 100);
    l = Math.round(l * 100);
    document.documentElement.style.setProperty("--primary", `${h} ${s}% ${l}%`);
    toast.success("Theme color updated");
  };
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
    if (newMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    toast.success(`${newMode ? "Dark" : "Light"} mode enabled`);
  };
  const handleResetPersonalization = async () => {
    try {
      // Reset to default values
      const defaultColor = "#9b87f5";
      const defaultAvatar = "#9b87f5";
      const defaultTheme = "dark";

      // Reset theme
      setDarkMode(true);
      localStorage.setItem("theme", defaultTheme);
      document.documentElement.classList.add("dark");

      // Reset color
      setPrimaryColor(defaultColor);
      localStorage.setItem("primaryColor", defaultColor);
      document.documentElement.style.setProperty("--primary", "262 83% 58%");

      // Reset avatar and display name in database
      const {
        error
      } = await supabase.from("profiles").update({
        avatar_url: defaultAvatar,
        display_name: "Euphoria User"
      }).eq("id", user?.id);
      if (error) throw error;
      setDisplayName("Euphoria User");
      setSelectedAvatar(defaultAvatar);
      queryClient.invalidateQueries({
        queryKey: ["profile"]
      });
      setShowResetDialog(false);
      toast.success("Personalization settings reset to defaults");
    } catch (error) {
      toast.error("Failed to reset personalization settings");
    }
  };
  return <div className="space-y-6 pt-4">
      <div className="flex items-center gap-3 animate-fade-in">
        <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
          <User className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Profile & Settings</h1>
          <p className="text-muted-foreground">Manage your account and preferences</p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6 animate-fade-in">
          <Card className="p-6 bg-gradient-hero border-0">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <Dialog open={showAvatarDialog} onOpenChange={setShowAvatarDialog}>
                  <DialogTrigger asChild>
                    <button className="relative group">
                      <Avatar className="w-20 h-20 cursor-pointer ring-2 ring-primary/20 group-hover:ring-primary transition-all">
                        <AvatarFallback className="text-3xl font-bold text-white" style={{
                        backgroundColor: profile?.avatar_url || "#9b87f5"
                      }}>
                          {displayName ? displayName[0].toUpperCase() : "E"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        <Edit className="w-5 h-5 text-white" />
                      </div>
                    </button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Choose Your Avatar</DialogTitle>
                      <DialogDescription>
                        Select a color for your profile avatar
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6 py-4">
                      {/* Preview */}
                      <div className="flex justify-center">
                        <Avatar className="w-24 h-24 ring-2 ring-primary/20">
                          <AvatarFallback className="text-4xl font-bold text-white" style={{
                          backgroundColor: selectedAvatar || "#9b87f5"
                        }}>
                            {displayName ? displayName[0].toUpperCase() : "E"}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      {/* Avatar Selection */}
                      <div>
                        <Label className="mb-3 block">Select Color</Label>
                        <div className="grid grid-cols-4 gap-3">
                          {PRESET_AVATARS.map(avatar => <button key={avatar.id} onClick={() => setSelectedAvatar(avatar.color)} className={`relative w-full aspect-square rounded-lg transition-all hover:scale-105 ${selectedAvatar === avatar.color ? "ring-2 ring-primary ring-offset-2" : "ring-1 ring-border"}`} style={{
                          backgroundColor: avatar.color
                        }} title={avatar.alt} aria-label={avatar.alt}>
                              <span className="text-2xl text-white font-bold">
                                {displayName ? displayName[0].toUpperCase() : "E"}
                              </span>
                            </button>)}
                        </div>
                      </div>
                      <Button onClick={() => updateAvatarMutation.mutate(selectedAvatar)} disabled={updateAvatarMutation.isPending} className="w-full">
                        Save Avatar
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <div>
                  {isEditing ? <div className="flex gap-2">
                      <Input value={displayName} onChange={e => setDisplayName(e.target.value)} className="w-48" />
                      <Button size="sm" onClick={() => updateProfileMutation.mutate(displayName)}>
                        Save
                      </Button>
                    </div> : <h2 className="text-2xl font-bold">{displayName || "Euphoria User"}</h2>}
                  <p className="text-muted-foreground">{user?.email}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge>Level {profile?.level || 1}</Badge>
                    <Badge variant="outline">{profile?.coins || 0} coins</Badge>
                  </div>
                </div>
              </div>
              {!isEditing && <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>}
            </div>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <span className="text-sm text-muted-foreground">Portfolio Value</span>
              </div>
              <p className="text-2xl font-bold">
                {formatDollar(Number(portfolio?.total_value) || 0, 2)}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {portfolioReturn >= 0 ? "+" : ""}{portfolioReturn.toFixed(2)}% return
              </p>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5 text-primary" />
                <span className="text-sm text-muted-foreground">Current Streak</span>
              </div>
              <p className="text-2xl font-bold">{streak?.current_streak || 0} days</p>
              <p className="text-sm text-muted-foreground mt-1">
                Longest: {streak?.longest_streak || 0} days
              </p>
            </Card>
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6 animate-fade-in">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Palette className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold">Appearance</h2>
            </div>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">Dark Mode</p>
                  <p className="text-sm text-muted-foreground">Toggle between light and dark theme</p>
                </div>
                <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
              </div>

              <div>
                <Label htmlFor="primaryColor">Primary Color</Label>
                <div className="flex items-center gap-4 mt-2">
                  <Input id="primaryColor" type="color" value={primaryColor} onChange={e => applyThemeColor(e.target.value)} className="w-20 h-12 cursor-pointer" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">
                      Choose your preferred accent color for buttons, links, and highlights
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => applyThemeColor("#9b87f5")} className="w-8 h-8 rounded-full border-2 border-border" style={{
                  backgroundColor: "#9b87f5"
                }} title="Purple (Default)" />
                  <button onClick={() => applyThemeColor("#0EA5E9")} className="w-8 h-8 rounded-full border-2 border-border" style={{
                  backgroundColor: "#0EA5E9"
                }} title="Blue" />
                  <button onClick={() => applyThemeColor("#10B981")} className="w-8 h-8 rounded-full border-2 border-border" style={{
                  backgroundColor: "#10B981"
                }} title="Green" />
                  <button onClick={() => applyThemeColor("#F59E0B")} className="w-8 h-8 rounded-full border-2 border-border" style={{
                  backgroundColor: "#F59E0B"
                }} title="Orange" />
                  <button onClick={() => applyThemeColor("#EF4444")} className="w-8 h-8 rounded-full border-2 border-border" style={{
                  backgroundColor: "#EF4444"
                }} title="Red" />
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Bell className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold">Notifications</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">Enable Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive updates about lessons, games, and achievements</p>
                </div>
                <Switch checked={notificationsEnabled} onCheckedChange={checked => {
                setNotificationsEnabled(checked);
                toast.success(checked ? "Notifications enabled" : "Notifications disabled");
              }} />
              </div>
            </div>
          </Card>

          

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Brain className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold">Learning Placement</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div>
                  <p className="font-semibold">Current Placement: Lesson {placementLesson}</p>
                  <p className="text-sm text-muted-foreground">
                    Score: {onboarding?.quiz_score || 0}/20 • Level: {onboarding?.investment_level || "beginner"}
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={() => setShowRetakeWarning(true)}>
                  <BookOpen className="w-4 h-4 mr-2" />
                  Retake Quiz
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Retake the placement quiz to improve your score and unlock more lessons (max: Lesson 25).
              </p>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <SettingsIcon className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold">Account Management</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div>
                  <p className="font-semibold">Reset Personalization</p>
                  <p className="text-sm text-muted-foreground">Restore color theme, avatar, and display name to defaults</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => setShowResetDialog(true)}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </div>
            </div>
          </Card>

          {/* Retake Quiz Warning Dialog */}
          <AlertDialog open={showRetakeWarning} onOpenChange={setShowRetakeWarning}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-amber-500" />
                  Retake Placement Quiz?
                </AlertDialogTitle>
                <AlertDialogDescription className="space-y-3">
                  <p>
                    Your placement quiz score determines which lessons are unlocked for you.
                  </p>
                  <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                    <p className="text-amber-600 dark:text-amber-400 font-medium text-sm">
                      ⚠️ Warning: Your level can go <strong>down</strong> as well as up!
                    </p>
                    <p className="text-amber-600/80 dark:text-amber-400/80 text-sm mt-1">
                      If you score lower than before, you may have fewer lessons unlocked than you currently do.
                    </p>
                  </div>
                  <p className="text-sm">
                    Current placement: <strong>Lesson {placementLesson}</strong> • Score: <strong>{onboarding?.quiz_score || 0}/20</strong>
                  </p>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => {
                setShowRetakeWarning(false);
                setShowRetakeQuiz(true);
              }} className="bg-amber-500 hover:bg-amber-600 text-white">
                  I Understand, Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Retake Quiz Dialog */}
          <Dialog open={showRetakeQuiz} onOpenChange={setShowRetakeQuiz}>
            <DialogContent className="max-w-4xl h-[90vh] p-0 overflow-hidden">
              <Onboarding isRetake={true} onComplete={() => {
              setShowRetakeQuiz(false);
              refetchOnboarding();
              queryClient.invalidateQueries({
                queryKey: ["lessons"]
              });
            }} />
            </DialogContent>
          </Dialog>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Lock className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold">Security</h2>
            </div>
            <div className="space-y-4">
              <Button variant="outline" onClick={async () => {
              try {
                await supabase.auth.signOut();
                toast.success("Signed out successfully");
                window.location.href = "/auth";
              } catch (error) {
                toast.error("Failed to sign out");
              }
            }} className="w-full">
                Sign Out
              </Button>
            </div>
          </Card>

          <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Reset Personalization Settings?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will restore your color theme, profile picture, and display name to their original default values. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleResetPersonalization}>
                  Reset to Defaults
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-6 animate-fade-in">
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Award className="w-5 h-5" />
              Your Achievements
            </h3>
            {userAchievements && userAchievements.length > 0 ? <div className="grid grid-cols-2 gap-3">
                {userAchievements.map(ua => {
              const achievement = ua.achievements as any;
              return <div key={ua.id} className="p-4 bg-gradient-hero rounded-lg border border-primary/20">
                      <div className="text-3xl mb-2">{achievement.icon}</div>
                      <p className="font-bold text-sm">{achievement.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {achievement.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Earned {new Date(ua.earned_at).toLocaleDateString()}
                      </p>
                    </div>;
            })}
              </div> : <p className="text-center text-muted-foreground py-12">
                Complete games and lessons to earn achievements!
              </p>}
          </Card>
        </TabsContent>
      </Tabs>
    </div>;
};
export default Profile;
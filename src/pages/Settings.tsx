import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Settings as SettingsIcon, Palette, Bell, Lock, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface SettingsProps {
  onNavigate: (tab: string) => void;
}

const Settings = ({ onNavigate }: SettingsProps) => {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#9b87f5");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUserSettings();
  }, [user]);

  const loadUserSettings = async () => {
    if (!user) return;

    const { data: profile } = await supabase
      .from("profiles")
      .select("display_name")
      .eq("id", user.id)
      .single();

    if (profile) {
      setDisplayName(profile.display_name || "");
    }

    // Load theme preference from localStorage
    const savedTheme = localStorage.getItem("theme");
    setDarkMode(savedTheme === "dark" || savedTheme === null);

    const savedColor = localStorage.getItem("primaryColor");
    if (savedColor) setPrimaryColor(savedColor);
  };

  const saveProfile = async () => {
    if (!user) return;
    setLoading(true);

    const { error } = await supabase
      .from("profiles")
      .update({ display_name: displayName })
      .eq("id", user.id);

    if (error) {
      toast.error("Failed to update profile");
    } else {
      toast.success("Profile updated successfully");
    }

    setLoading(false);
  };

  const applyThemeColor = (color: string) => {
    setPrimaryColor(color);
    localStorage.setItem("primaryColor", color);

    // Convert hex to HSL
    const r = parseInt(color.slice(1, 3), 16) / 255;
    const g = parseInt(color.slice(3, 5), 16) / 255;
    const b = parseInt(color.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
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

  return (
    <div className="space-y-6 pb-24">
      <div className="flex items-center gap-3 animate-fade-in">
        <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
          <SettingsIcon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Customize your Euphoria experience</p>
        </div>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <User className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-bold">Profile Settings</h2>
        </div>
        <div className="space-y-4">
          <div>
            <Label htmlFor="displayName">Display Name</Label>
            <Input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Enter your display name"
              className="mt-2"
            />
          </div>
          <Button onClick={saveProfile} disabled={loading} className="bg-gradient-primary">
            {loading ? "Saving..." : "Save Profile"}
          </Button>
        </div>
      </Card>

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
              <Input
                id="primaryColor"
                type="color"
                value={primaryColor}
                onChange={(e) => applyThemeColor(e.target.value)}
                className="w-20 h-12 cursor-pointer"
              />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">
                  Choose your preferred accent color for buttons, links, and highlights
                </p>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => applyThemeColor("#9b87f5")}
                className="w-8 h-8 rounded-full border-2 border-border"
                style={{ backgroundColor: "#9b87f5" }}
                title="Purple (Default)"
              />
              <button
                onClick={() => applyThemeColor("#0EA5E9")}
                className="w-8 h-8 rounded-full border-2 border-border"
                style={{ backgroundColor: "#0EA5E9" }}
                title="Blue"
              />
              <button
                onClick={() => applyThemeColor("#10B981")}
                className="w-8 h-8 rounded-full border-2 border-border"
                style={{ backgroundColor: "#10B981" }}
                title="Green"
              />
              <button
                onClick={() => applyThemeColor("#F59E0B")}
                className="w-8 h-8 rounded-full border-2 border-border"
                style={{ backgroundColor: "#F59E0B" }}
                title="Orange"
              />
              <button
                onClick={() => applyThemeColor("#EF4444")}
                className="w-8 h-8 rounded-full border-2 border-border"
                style={{ backgroundColor: "#EF4444" }}
                title="Red"
              />
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
            <Switch
              checked={notificationsEnabled}
              onCheckedChange={(checked) => {
                setNotificationsEnabled(checked);
                toast.success(checked ? "Notifications enabled" : "Notifications disabled");
              }}
            />
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-gradient-gold border-0">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <span className="text-xl">👑</span>
          </div>
          <h2 className="text-xl font-bold text-white">Premium Subscription</h2>
        </div>
        <div className="space-y-4">
          <p className="text-white/90">
            Upgrade to Premium to unlock exclusive features:
          </p>
          <ul className="space-y-2 text-sm text-white/80">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-white/80" />
              Real-time market data and advanced charts
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-white/80" />
              Unlimited stock analysis tools
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-white/80" />
              Priority support and exclusive lessons
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-white/80" />
              Ad-free experience
            </li>
          </ul>
          <Button 
            className="w-full bg-white text-primary hover:bg-white/90 font-bold"
            disabled
          >
            Coming Soon - $9.99/month
          </Button>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Lock className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-bold">Security</h2>
        </div>
        <div className="space-y-4">
          <Button
            variant="outline"
            onClick={async () => {
              try {
                await supabase.auth.signOut();
                toast.success("Signed out successfully");
                window.location.href = "/auth";
              } catch (error) {
                toast.error("Failed to sign out");
              }
            }}
            className="w-full"
          >
            Sign Out
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Settings;

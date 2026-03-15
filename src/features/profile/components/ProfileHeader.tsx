import { useState, useRef } from "react";
import { Camera, Edit3, Check, X, Share2, ImagePlus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface ProfileHeaderProps {
  profile: any;
  userId: string;
  email: string;
}

export const ProfileHeader = ({ profile, userId, email }: ProfileHeaderProps) => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(profile?.display_name || "");
  const [username, setUsername] = useState(profile?.username || "");
  const [bio, setBio] = useState((profile as any)?.bio || "");
  const [uploading, setUploading] = useState(false);
  const avatarRef = useRef<HTMLInputElement>(null);
  const bannerRef = useRef<HTMLInputElement>(null);

  const avatarUrl = profile?.avatar_url;
  const bannerUrl = (profile as any)?.banner_url;
  const isColorAvatar = avatarUrl?.startsWith("#") || !avatarUrl;

  const handleImageUpload = async (file: File, type: "avatar" | "banner") => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large. Max 5MB.");
      return;
    }
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${userId}/${type}-${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true });
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(path);

      const updateField = type === "avatar" ? "avatar_url" : "banner_url";
      const { error } = await supabase
        .from("profiles")
        .update({ [updateField]: publicUrl } as any)
        .eq("id", userId);
      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success(`${type === "avatar" ? "Profile photo" : "Banner"} updated!`);
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          display_name: displayName,
          username,
          bio,
        } as any)
        .eq("id", userId);
      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      setIsEditing(false);
      toast.success("Profile updated!");
    } catch {
      toast.error("Failed to update profile");
    }
  };

  const handleShareProfile = () => {
    const url = `${window.location.origin}/profile/${username || userId}`;
    navigator.clipboard.writeText(url);
    toast.success("Profile link copied!");
  };

  const xpForLevel = (lvl: number) => lvl * 100;
  const currentLevel = profile?.level || 1;
  const currentXP = profile?.experience_points || 0;
  const xpThisLevel = currentXP - xpForLevel(currentLevel - 1);
  const xpNeeded = xpForLevel(currentLevel) - xpForLevel(currentLevel - 1);
  const levelProgress = Math.min((xpThisLevel / xpNeeded) * 100, 100);

  return (
    <div className="relative animate-fade-in">
      {/* Banner */}
      <div className="relative h-36 md:h-48 rounded-xl overflow-hidden bg-gradient-to-r from-primary/20 via-primary/10 to-accent/20">
        {bannerUrl && (
          <img src={bannerUrl} alt="Banner" className="w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
        <button
          onClick={() => bannerRef.current?.click()}
          className="absolute top-3 right-3 p-2 rounded-lg bg-background/60 backdrop-blur-sm text-foreground/80 hover:bg-background/80 transition-all"
        >
          <ImagePlus className="w-4 h-4" />
        </button>
        <input
          ref={bannerRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], "banner")}
        />
      </div>

      {/* Avatar + Info */}
      <div className="relative px-4 md:px-6 -mt-14 md:-mt-16">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4">
          {/* Avatar */}
          <div className="relative group">
            <Avatar className="w-24 h-24 md:w-28 md:h-28 ring-4 ring-background shadow-lg">
              {!isColorAvatar && avatarUrl ? (
                <AvatarImage src={avatarUrl} alt={displayName} className="object-cover" />
              ) : null}
              <AvatarFallback
                className="text-3xl md:text-4xl font-bold text-primary-foreground"
                style={{ backgroundColor: isColorAvatar ? (avatarUrl || "hsl(var(--primary))") : "hsl(var(--primary))" }}
              >
                {displayName?.[0]?.toUpperCase() || "E"}
              </AvatarFallback>
            </Avatar>
            <button
              onClick={() => avatarRef.current?.click()}
              className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Camera className="w-6 h-6 text-white" />
            </button>
            <input
              ref={avatarRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], "avatar")}
            />
          </div>

          {/* Name + Bio */}
          <div className="flex-1 min-w-0 pb-1">
            {isEditing ? (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Display name"
                    className="text-lg font-bold h-9"
                  />
                  <Input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="@username"
                    className="h-9 w-40"
                  />
                </div>
                <Textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell others about your investing interests..."
                  className="resize-none h-16 text-sm"
                  maxLength={160}
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleSave}>
                    <Check className="w-3.5 h-3.5 mr-1" /> Save
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)}>
                    <X className="w-3.5 h-3.5 mr-1" /> Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl md:text-2xl font-bold truncate">
                    {displayName || "Euphoria User"}
                  </h1>
                  <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                    Level {currentLevel}
                  </Badge>
                </div>
                {username && (
                  <p className="text-sm text-muted-foreground">@{username}</p>
                )}
                <p className="text-sm text-muted-foreground mt-0.5">{email}</p>
                {(profile as any)?.bio && (
                  <p className="text-sm text-foreground/80 mt-1.5 line-clamp-2">
                    {(profile as any).bio}
                  </p>
                )}
              </>
            )}
          </div>

          {/* Actions */}
          {!isEditing && (
            <div className="flex gap-2 sm:pb-1">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setDisplayName(profile?.display_name || "");
                  setUsername(profile?.username || "");
                  setBio((profile as any)?.bio || "");
                  setIsEditing(true);
                }}
              >
                <Edit3 className="w-3.5 h-3.5 mr-1.5" /> Edit Profile
              </Button>
              <Button size="sm" variant="ghost" onClick={handleShareProfile}>
                <Share2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          )}
        </div>

        {/* Level progress bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span>Level {currentLevel}</span>
            <span>{Math.round(levelProgress)}% to Level {currentLevel + 1}</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-[hsl(273,84%,65%)] rounded-full transition-all duration-700 ease-out"
              style={{ width: `${levelProgress}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-muted-foreground mt-1">
            <span>{profile?.coins || 0} Euphorium</span>
            <span>{currentXP} XP total</span>
          </div>
        </div>
      </div>
    </div>
  );
};

import { useState, useEffect } from "react";
import { MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Image as ImageIcon, Smile, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { PostCard } from "./PostCard";

const FEED_TABS = ["For You", "Following", "Trending"] as const;
type FeedTab = (typeof FEED_TABS)[number];

export const TwitterFeed = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [newPostContent, setNewPostContent] = useState("");
  const [activeTab, setActiveTab] = useState<FeedTab>("For You");

  // Realtime subscription for posts, likes, comments, reposts
  useEffect(() => {
    const channel = supabase
      .channel("social-feed-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "posts" }, () => {
        queryClient.invalidateQueries({ queryKey: ["community-posts"] });
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "likes" }, () => {
        queryClient.invalidateQueries({ queryKey: ["community-posts"] });
        queryClient.invalidateQueries({ queryKey: ["user-likes"] });
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "comments" }, () => {
        queryClient.invalidateQueries({ queryKey: ["community-posts"] });
        queryClient.invalidateQueries({ queryKey: ["comments"] });
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "reposts" }, () => {
        queryClient.invalidateQueries({ queryKey: ["community-posts"] });
        queryClient.invalidateQueries({ queryKey: ["user-reposts"] });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  // Fetch posts
  const { data: posts, isLoading } = useQuery({
    queryKey: ["community-posts", activeTab],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*, profiles(display_name, avatar_url, username)")
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data;
    },
  });

  // Fetch user's likes
  const { data: userLikes } = useQuery({
    queryKey: ["user-likes", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("likes")
        .select("post_id")
        .eq("user_id", user?.id!);
      if (error) throw error;
      return new Set(data.map((l) => l.post_id));
    },
    enabled: !!user?.id,
  });

  // Fetch user's reposts
  const { data: userReposts } = useQuery({
    queryKey: ["user-reposts", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reposts")
        .select("post_id")
        .eq("user_id", user?.id!);
      if (error) throw error;
      return new Set(data.map((r: any) => r.post_id));
    },
    enabled: !!user?.id,
  });

  // Fetch user's bookmarks
  const { data: userBookmarks } = useQuery({
    queryKey: ["user-bookmarks", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookmarks")
        .select("post_id")
        .eq("user_id", user?.id!);
      if (error) throw error;
      return new Set(data.map((b: any) => b.post_id));
    },
    enabled: !!user?.id,
  });

  // Create post
  const createPostMutation = useMutation({
    mutationFn: async () => {
      if (!newPostContent.trim()) return;
      const { error } = await supabase.from("posts").insert({
        user_id: user?.id!,
        content: newPostContent.trim(),
        category: "general",
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setNewPostContent("");
      queryClient.invalidateQueries({ queryKey: ["community-posts"] });
      toast.success("Posted!");
    },
    onError: () => toast.error("Failed to post"),
  });

  return (
    <div className="max-w-[600px] mx-auto">
      {/* Tab navigation */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="flex">
          {FEED_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "flex-1 py-3.5 text-sm font-medium transition-colors relative",
                "hover:bg-muted/50",
                activeTab === tab ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {tab}
              {activeTab === tab && (
                <motion.div
                  layoutId="feed-tab-indicator"
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-[3px] rounded-full bg-primary"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Compose area */}
      <div className="border-b border-border px-4 py-3">
        <div className="flex gap-3">
          <Avatar className="w-10 h-10 shrink-0 mt-1">
            <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-sm">
              {user?.email?.[0]?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <Textarea
              placeholder="What's happening?"
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              className="border-none shadow-none resize-none bg-transparent text-[15px] leading-relaxed placeholder:text-muted-foreground/60 p-0 min-h-[52px] focus-visible:ring-0"
              rows={2}
            />
            <div className="flex items-center justify-between pt-2 border-t border-border/50">
              <div className="flex items-center -ml-2">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:bg-primary/10 rounded-full">
                  <ImageIcon className="w-[18px] h-[18px]" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:bg-primary/10 rounded-full">
                  <Smile className="w-[18px] h-[18px]" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:bg-primary/10 rounded-full">
                  <MapPin className="w-[18px] h-[18px]" />
                </Button>
              </div>
              <Button
                size="sm"
                onClick={() => createPostMutation.mutate()}
                disabled={!newPostContent.trim() || createPostMutation.isPending}
                className="rounded-full px-5 h-9 font-bold text-sm bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {createPostMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Post"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-7 h-7 animate-spin text-primary" />
        </div>
      ) : posts?.length === 0 ? (
        <div className="py-16 text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
            <MessageSquare className="w-7 h-7 text-primary" />
          </div>
          <p className="text-lg font-semibold text-foreground">Be the first to share</p>
          <p className="text-sm text-muted-foreground">Start a conversation and connect with the community.</p>
        </div>
      ) : (
        posts?.map((post: any, i: number) => (
          <PostCard
            key={post.id}
            post={post}
            index={i}
            userLikes={userLikes}
            userReposts={userReposts}
            userBookmarks={userBookmarks}
          />
        ))
      )}
    </div>
  );
};

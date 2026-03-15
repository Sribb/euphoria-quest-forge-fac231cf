import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  MessageSquare, Heart, Repeat2, Share, Bookmark, BarChart3,
  Loader2, Image as ImageIcon, Smile, MapPin,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

const FEED_TABS = ["For You", "Following", "Trending"] as const;
type FeedTab = (typeof FEED_TABS)[number];

export const TwitterFeed = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [newPostContent, setNewPostContent] = useState("");
  const [activeTab, setActiveTab] = useState<FeedTab>("For You");

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

  // Like/unlike
  const toggleLikeMutation = useMutation({
    mutationFn: async (postId: string) => {
      const liked = userLikes?.has(postId);
      if (liked) {
        await supabase.from("likes").delete().eq("post_id", postId).eq("user_id", user?.id!);
      } else {
        await supabase.from("likes").insert({ post_id: postId, user_id: user?.id! });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-likes"] });
      queryClient.invalidateQueries({ queryKey: ["community-posts"] });
    },
  });

  const formatHandle = (profile: any) => {
    if (profile?.username) return `@${profile.username}`;
    if (profile?.display_name) return `@${profile.display_name.toLowerCase().replace(/\s+/g, "")}`;
    return "@user";
  };

  const formatCount = (n: number) => {
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
    return n.toString();
  };

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
        <div className="py-16 text-center">
          <p className="text-muted-foreground text-[15px]">No posts yet. Be the first to share something!</p>
        </div>
      ) : (
        <AnimatePresence>
          {posts?.map((post: any, i: number) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.03 }}
              className="border-b border-border px-4 py-3 hover:bg-muted/30 transition-colors cursor-pointer"
            >
              <div className="flex gap-3">
                {/* Avatar */}
                <Avatar className="w-10 h-10 shrink-0">
                  <AvatarFallback
                    className="font-semibold text-sm text-primary-foreground"
                    style={{ backgroundColor: post.profiles?.avatar_url || "hsl(263 84% 58%)" }}
                  >
                    {post.profiles?.display_name?.[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {/* Header line */}
                  <div className="flex items-center gap-1 mb-0.5">
                    <span className="font-bold text-[15px] text-foreground truncate">
                      {post.profiles?.display_name || "Anonymous"}
                    </span>
                    <span className="text-muted-foreground text-[13px] truncate">
                      {formatHandle(post.profiles)}
                    </span>
                    <span className="text-muted-foreground text-[13px]">·</span>
                    <span className="text-muted-foreground text-[13px] shrink-0">
                      {formatDistanceToNow(new Date(post.created_at), { addSuffix: false })}
                    </span>
                  </div>

                  {/* Post body */}
                  <p className="text-[15px] leading-[1.45] text-foreground whitespace-pre-wrap mb-0.5">
                    {post.content}
                  </p>

                  {post.image_url && (
                    <img
                      src={post.image_url}
                      alt="Post media"
                      className="mt-3 rounded-2xl border border-border max-h-80 object-cover w-full"
                    />
                  )}

                  {/* Interaction bar */}
                  <div className="flex items-center justify-between mt-2 -ml-2 max-w-[425px]">
                    {/* Reply */}
                    <button className="group flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors">
                      <div className="p-1.5 rounded-full group-hover:bg-primary/10 transition-colors">
                        <MessageSquare className="w-[17px] h-[17px]" />
                      </div>
                      <span className="text-[13px]">{post.comments_count || ""}</span>
                    </button>

                    {/* Repost */}
                    <button className="group flex items-center gap-1.5 text-muted-foreground hover:text-success transition-colors">
                      <div className="p-1.5 rounded-full group-hover:bg-success/10 transition-colors">
                        <Repeat2 className="w-[17px] h-[17px]" />
                      </div>
                      <span className="text-[13px]"></span>
                    </button>

                    {/* Like */}
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleLikeMutation.mutate(post.id); }}
                      className={cn(
                        "group flex items-center gap-1.5 transition-colors",
                        userLikes?.has(post.id) ? "text-destructive" : "text-muted-foreground hover:text-destructive"
                      )}
                    >
                      <div className={cn(
                        "p-1.5 rounded-full transition-colors",
                        userLikes?.has(post.id) ? "bg-destructive/10" : "group-hover:bg-destructive/10"
                      )}>
                        <Heart className={cn("w-[17px] h-[17px]", userLikes?.has(post.id) && "fill-current")} />
                      </div>
                      <span className="text-[13px]">{post.likes_count ? formatCount(post.likes_count) : ""}</span>
                    </button>

                    {/* Views */}
                    <button className="group flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors">
                      <div className="p-1.5 rounded-full group-hover:bg-primary/10 transition-colors">
                        <BarChart3 className="w-[17px] h-[17px]" />
                      </div>
                      <span className="text-[13px]">{formatCount(Math.floor(Math.random() * 500) + 10)}</span>
                    </button>

                    {/* Bookmark & Share */}
                    <div className="flex items-center">
                      <button className="group p-1.5 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                        <Bookmark className="w-[17px] h-[17px]" />
                      </button>
                      <button className="group p-1.5 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                        <Share className="w-[17px] h-[17px]" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      )}
    </div>
  );
};

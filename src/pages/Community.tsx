import { useState, useEffect } from "react";
import { Users, TrendingUp, Clock, Filter, ArrowLeft, Play } from "lucide-react";
import StoryFeed from "@/features/community/stories/StoryFeed";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { PostCard } from "@/features/community/components/PostCard";
import { CreatePostDialog } from "@/features/community/components/CreatePostDialog";
import { Skeleton } from "@/components/ui/skeleton";

interface CommunityProps {
  onNavigate: (tab: string) => void;
}

const CATEGORIES = [
  { value: "all", label: "All Posts", icon: "🌐" },
  { value: "strategy", label: "Strategies", icon: "📊" },
  { value: "screenshot", label: "Screenshots", icon: "📸" },
  { value: "question", label: "Questions", icon: "❓" },
  { value: "success", label: "Success Stories", icon: "🎉" },
  { value: "discussion", label: "Discussions", icon: "💬" },
];

const Community = ({ onNavigate }: CommunityProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [sortBy, setSortBy] = useState<"recent" | "popular">("recent");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showStoryFeed, setShowStoryFeed] = useState(false);

  const { data: posts, isLoading, refetch } = useQuery({
    queryKey: ["posts", sortBy, categoryFilter],
    queryFn: async () => {
      let query = supabase
        .from("posts")
        .select(`
          *,
          profiles(display_name, avatar_url)
        `);
      
      if (categoryFilter !== "all") {
        query = query.eq("category", categoryFilter);
      }
      
      if (sortBy === "recent") {
        query = query.order("created_at", { ascending: false });
      } else {
        query = query.order("likes_count", { ascending: false });
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    },
    staleTime: 30000,
  });

  const { data: userLikes } = useQuery({
    queryKey: ["user_likes", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from("likes")
        .select("post_id")
        .eq("user_id", user.id);
      
      if (error) throw error;
      return data.map(like => like.post_id);
    },
    enabled: !!user?.id,
    staleTime: 60000,
  });

  // Real-time updates
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel('community-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'posts'
        },
        () => {
          refetch();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'likes'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["user_likes", user.id] });
          refetch();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'comments'
        },
        () => {
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, refetch, queryClient]);

  const toggleLikeMutation = useMutation({
    mutationFn: async (postId: string) => {
      const { data: existingLike } = await supabase
        .from("likes")
        .select("id")
        .eq("post_id", postId)
        .eq("user_id", user?.id)
        .maybeSingle();

      if (existingLike) {
        const { error } = await supabase.from("likes").delete().eq("id", existingLike.id);
        if (error) throw error;
        return { action: 'unlike' };
      } else {
        const { error } = await supabase.from("likes").insert({ post_id: postId, user_id: user?.id });
        if (error) throw error;
        return { action: 'like' };
      }
    },
    onMutate: async (postId) => {
      // Cancel queries
      await queryClient.cancelQueries({ queryKey: ["posts"] });
      await queryClient.cancelQueries({ queryKey: ["user_likes"] });

      const previousPosts = queryClient.getQueryData(["posts", sortBy]);
      const previousLikes = queryClient.getQueryData(["user_likes", user?.id]);

      // Optimistically update posts
      queryClient.setQueryData(["posts", sortBy, categoryFilter], (old: any[]) => 
        old?.map(post => {
          if (post.id === postId) {
            const isLiked = (previousLikes as string[] || []).includes(postId);
            return {
              ...post,
              likes_count: post.likes_count + (isLiked ? -1 : 1)
            };
          }
          return post;
        })
      );

      // Optimistically update user likes
      queryClient.setQueryData(["user_likes", user?.id], (old: string[] = []) => {
        if (old.includes(postId)) {
          return old.filter(id => id !== postId);
        }
        return [...old, postId];
      });

      return { previousPosts, previousLikes };
    },
    onError: (error, postId, context) => {
      // Rollback on error
      if (context?.previousPosts) {
        queryClient.setQueryData(["posts", sortBy, categoryFilter], context.previousPosts);
      }
      if (context?.previousLikes) {
        queryClient.setQueryData(["user_likes", user?.id], context.previousLikes);
      }
      toast.error("Failed to update like");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["user_likes"] });
    },
  });

  return (
    <>
      {/* Story Feed Modal */}
      <StoryFeed isOpen={showStoryFeed} onClose={() => setShowStoryFeed(false)} />
      
      <div className="space-y-6 pb-24 pt-4">
        {/* Header */}
        <div className="flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onNavigate('dashboard')}
              className="hover-scale"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="w-12 h-12 rounded-xl bg-gradient-accent flex items-center justify-center shadow-glow">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Community</h1>
              <p className="text-sm text-muted-foreground">Share strategies, wins, and insights</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setShowStoryFeed(true)}
              className="bg-gradient-primary text-primary-foreground border-0"
            >
              <Play className="w-4 h-4 mr-2" />
              Stories
            </Button>
            <CreatePostDialog />
          </div>
        </div>

        {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-3 animate-fade-in">
        <Card className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <p className="text-xs text-muted-foreground mb-1">Total Posts</p>
          <p className="text-2xl font-bold">{posts?.length || 0}</p>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-success/10 to-success/5 border-success/20">
          <p className="text-xs text-muted-foreground mb-1">Active Today</p>
          <p className="text-2xl font-bold">
            {posts?.filter(p => 
              new Date(p.created_at).toDateString() === new Date().toDateString()
            ).length || 0}
          </p>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
          <p className="text-xs text-muted-foreground mb-1">Categories</p>
          <p className="text-2xl font-bold">{CATEGORIES.length - 1}</p>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 animate-fade-in">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Category</span>
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  <span className="flex items-center gap-2">
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Sort By</span>
          </div>
          <Tabs value={sortBy} onValueChange={(v) => setSortBy(v as "recent" | "popular")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="recent" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span className="hidden sm:inline">Recent</span>
              </TabsTrigger>
              <TabsTrigger value="popular" className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                <span className="hidden sm:inline">Popular</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Active Filter Badge */}
      {categoryFilter !== "all" && (
        <div className="flex items-center gap-2 animate-fade-in">
          <Badge variant="secondary" className="text-sm">
            {CATEGORIES.find(c => c.value === categoryFilter)?.icon}{" "}
            {CATEGORIES.find(c => c.value === categoryFilter)?.label}
          </Badge>
        </div>
      )}

      {/* Posts Feed */}
      <div className="space-y-4">
        {isLoading ? (
          <>
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden">
                <div className="p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                  <Skeleton className="h-20 w-full" />
                </div>
                <Skeleton className="h-64 w-full" />
                <div className="p-4 flex gap-4">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-20" />
                </div>
              </Card>
            ))}
          </>
        ) : posts && posts.length > 0 ? (
          posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onToggleLike={(postId) => toggleLikeMutation.mutate(postId)}
              isLiked={userLikes?.includes(post.id) || false}
            />
          ))
        ) : (
          <Card className="p-12 text-center border-dashed">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <Users className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No posts in this category</h3>
            <p className="text-muted-foreground mb-4">
              {categoryFilter === "all" 
                ? "Be the first to share something with the community!" 
                : "No posts found. Try a different category or create the first post!"}
            </p>
            <CreatePostDialog />
          </Card>
        )}
      </div>
    </div>
    </>
  );
};

export default Community;

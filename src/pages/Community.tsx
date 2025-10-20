import { useState, useEffect } from "react";
import { MessageCircle, Send, TrendingUp, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { PostCard } from "@/components/community/PostCard";
import { Skeleton } from "@/components/ui/skeleton";

interface CommunityProps {
  onNavigate: (tab: string) => void;
}

const Community = ({ onNavigate }: CommunityProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [newPost, setNewPost] = useState("");
  const [sortBy, setSortBy] = useState<"recent" | "popular">("recent");

  const { data: posts, isLoading, refetch } = useQuery({
    queryKey: ["posts", sortBy],
    queryFn: async () => {
      let query = supabase
        .from("posts")
        .select(`
          *,
          profiles(display_name, avatar_url)
        `);
      
      if (sortBy === "recent") {
        query = query.order("created_at", { ascending: false });
      } else {
        query = query.order("likes_count", { ascending: false });
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    },
    staleTime: 30000, // Consider data fresh for 30 seconds
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

  const createPostMutation = useMutation({
    mutationFn: async (content: string) => {
      if (content.trim().length < 3) {
        throw new Error("Post must be at least 3 characters");
      }
      if (content.length > 2000) {
        throw new Error("Post must be less than 2000 characters");
      }

      const { error } = await supabase
        .from("posts")
        .insert({ user_id: user?.id, content: content.trim() });
      
      if (error) throw error;
    },
    onMutate: async (content) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["posts"] });

      // Snapshot previous value
      const previousPosts = queryClient.getQueryData(["posts", sortBy]);

      // Optimistically update
      queryClient.setQueryData(["posts", sortBy], (old: any[]) => [{
        id: 'temp-' + Date.now(),
        content: content.trim(),
        created_at: new Date().toISOString(),
        likes_count: 0,
        comments_count: 0,
        user_id: user?.id,
        profiles: { display_name: 'You' }
      }, ...(old || [])]);

      return { previousPosts };
    },
    onSuccess: () => {
      setNewPost("");
      toast.success("Post created!");
      refetch();
    },
    onError: (error: any, newPost, context) => {
      // Rollback on error
      if (context?.previousPosts) {
        queryClient.setQueryData(["posts", sortBy], context.previousPosts);
      }
      toast.error(error.message || "Failed to create post");
    },
  });

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
      queryClient.setQueryData(["posts", sortBy], (old: any[]) => 
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
        queryClient.setQueryData(["posts", sortBy], context.previousPosts);
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
    <div className="space-y-6 pb-24">
      <div className="flex items-center gap-3 animate-fade-in">
        <div className="w-12 h-12 rounded-xl bg-gradient-accent flex items-center justify-center shadow-glow">
          <MessageCircle className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Community</h1>
          <p className="text-muted-foreground">Connect with fellow investors</p>
        </div>
      </div>

      <Card className="p-6 animate-fade-in">
        <h3 className="text-lg font-bold mb-4">Create a Post</h3>
        <Textarea
          placeholder="Share your investing insights, wins, or questions..."
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          className="mb-3"
          rows={4}
          maxLength={2000}
        />
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">
            {newPost.length}/2000 characters
          </span>
          <Button
            onClick={() => createPostMutation.mutate(newPost)}
            disabled={!newPost.trim() || newPost.trim().length < 3 || createPostMutation.isPending}
            className="bg-gradient-primary"
          >
            <Send className="w-4 h-4 mr-2" />
            {createPostMutation.isPending ? "Posting..." : "Post"}
          </Button>
        </div>
      </Card>

      <div className="animate-fade-in">
        <Tabs value={sortBy} onValueChange={(v) => setSortBy(v as "recent" | "popular")} className="mb-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="recent" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Recent
            </TabsTrigger>
            <TabsTrigger value="popular" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Popular
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <>
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-6 space-y-3">
                <div className="flex items-start gap-3">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <Skeleton className="h-20 w-full" />
                <div className="flex gap-4">
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
          <Card className="p-12 text-center">
            <MessageCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
            <p className="text-muted-foreground">Be the first to share something with the community!</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Community;

import { useState } from "react";
import { MessageCircle, Heart, Send, Trash2, ImagePlus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

interface CommunityProps {
  onNavigate: (tab: string) => void;
}

const Community = ({ onNavigate }: CommunityProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [newPost, setNewPost] = useState("");
  const [newComment, setNewComment] = useState<Record<string, string>>({});
  const [showComments, setShowComments] = useState<Record<string, boolean>>({});

  const { data: posts } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select(`
          *,
          profiles(display_name)
        `)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const createPostMutation = useMutation({
    mutationFn: async (content: string) => {
      const { error } = await supabase
        .from("posts")
        .insert({ user_id: user?.id, content });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      setNewPost("");
      toast.success("Post created!");
    },
    onError: () => {
      toast.error("Failed to create post");
    },
  });

  const toggleLikeMutation = useMutation({
    mutationFn: async (postId: string) => {
      const { data: existingLike } = await supabase
        .from("likes")
        .select("id")
        .eq("post_id", postId)
        .eq("user_id", user?.id)
        .single();

      if (existingLike) {
        await supabase.from("likes").delete().eq("id", existingLike.id);
      } else {
        await supabase.from("likes").insert({ post_id: postId, user_id: user?.id });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const createCommentMutation = useMutation({
    mutationFn: async ({ postId, content }: { postId: string; content: string }) => {
      const { error } = await supabase
        .from("comments")
        .insert({ post_id: postId, user_id: user?.id, content });
      
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["comments", variables.postId] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      setNewComment(prev => ({ ...prev, [variables.postId]: "" }));
      toast.success("Comment added!");
    },
  });

  const getComments = (postId: string) => {
    return useQuery({
      queryKey: ["comments", postId],
      queryFn: async () => {
        const { data, error } = await supabase
          .from("comments")
          .select(`
            *,
            profiles(display_name)
          `)
          .eq("post_id", postId)
          .order("created_at", { ascending: true });
        
        if (error) throw error;
        return data;
      },
      enabled: showComments[postId] === true,
    });
  };

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

      <Card className="p-6">
        <h3 className="text-lg font-bold mb-4">Create a Post</h3>
        <Textarea
          placeholder="Share your investing insights, wins, or questions..."
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          className="mb-3"
          rows={4}
        />
        <Button
          onClick={() => createPostMutation.mutate(newPost)}
          disabled={!newPost.trim() || createPostMutation.isPending}
          className="w-full"
        >
          <Send className="w-4 h-4 mr-2" />
          Post
        </Button>
      </Card>

      <div className="space-y-4">
        {posts?.map((post) => {
          const commentsQuery = getComments(post.id);
          const displayName = (post.profiles as any)?.display_name || "Investor";
          
          return (
            <Card key={post.id} className="p-6">
              <div className="flex items-start gap-3 mb-4">
                <Avatar>
                  <AvatarFallback>{displayName[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-bold">{displayName}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(post.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <p className="mb-4 whitespace-pre-wrap">{post.content}</p>

              <div className="flex items-center gap-4 pt-3 border-t">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleLikeMutation.mutate(post.id)}
                  className="gap-2"
                >
                  <Heart className="w-4 h-4" />
                  {post.likes_count}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowComments(prev => ({ ...prev, [post.id]: !prev[post.id] }))}
                  className="gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  {post.comments_count}
                </Button>
              </div>

              {showComments[post.id] && (
                <div className="mt-4 pt-4 border-t space-y-3">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Write a comment..."
                      value={newComment[post.id] || ""}
                      onChange={(e) => setNewComment(prev => ({ ...prev, [post.id]: e.target.value }))}
                    />
                    <Button
                      size="sm"
                      onClick={() => createCommentMutation.mutate({
                        postId: post.id,
                        content: newComment[post.id],
                      })}
                      disabled={!newComment[post.id]?.trim()}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>

                  {commentsQuery.data?.map((comment) => (
                    <div key={comment.id} className="flex gap-2 p-3 bg-muted rounded-lg">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="text-xs">
                          {((comment.profiles as any)?.display_name || "I")[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-semibold">
                          {(comment.profiles as any)?.display_name || "Investor"}
                        </p>
                        <p className="text-sm">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Community;

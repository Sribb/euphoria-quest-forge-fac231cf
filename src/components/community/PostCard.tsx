import { useState, useEffect } from "react";
import { MessageCircle, Heart, Send, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface PostCardProps {
  post: any;
  onToggleLike: (postId: string) => void;
  isLiked: boolean;
}

export const PostCard = ({ post, onToggleLike, isLiked }: PostCardProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");

  const { data: comments, refetch: refetchComments } = useQuery({
    queryKey: ["comments", post.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("comments")
        .select(`
          *,
          profiles(display_name, avatar_url)
        `)
        .eq("post_id", post.id)
        .order("created_at", { ascending: true });
      
      if (error) throw error;
      return data;
    },
    enabled: showComments,
    staleTime: 30000,
  });

  // Real-time comment updates
  useEffect(() => {
    if (!showComments) return;

    const channel = supabase
      .channel(`comments-${post.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'comments',
          filter: `post_id=eq.${post.id}`
        },
        () => {
          refetchComments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [showComments, post.id, refetchComments]);

  const createCommentMutation = useMutation({
    mutationFn: async ({ postId, content }: { postId: string; content: string }) => {
      if (content.trim().length < 1) {
        throw new Error("Comment cannot be empty");
      }
      if (content.length > 500) {
        throw new Error("Comment must be less than 500 characters");
      }

      const { error } = await supabase
        .from("comments")
        .insert({ post_id: postId, user_id: user?.id, content: content.trim() });
      
      if (error) throw error;
    },
    onMutate: async ({ postId, content }) => {
      await queryClient.cancelQueries({ queryKey: ["comments", postId] });

      const previousComments = queryClient.getQueryData(["comments", postId]);

      // Optimistically add comment
      queryClient.setQueryData(["comments", postId], (old: any[] = []) => [...old, {
        id: 'temp-' + Date.now(),
        content: content.trim(),
        created_at: new Date().toISOString(),
        user_id: user?.id,
        profiles: { display_name: 'You' }
      }]);

      return { previousComments };
    },
    onSuccess: () => {
      setNewComment("");
      toast.success("Comment added!");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      refetchComments();
    },
    onError: (error: any, variables, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(["comments", post.id], context.previousComments);
      }
      toast.error(error.message || "Failed to add comment");
    },
  });

  const displayName = (post.profiles as any)?.display_name || "Investor";

  return (
    <Card className="p-6">
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
          onClick={() => onToggleLike(post.id)}
          className={cn(
            "gap-2 transition-all",
            isLiked && "text-red-500"
          )}
        >
          <Heart className={cn("w-4 h-4", isLiked && "fill-red-500")} />
          {post.likes_count || 0}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowComments(!showComments)}
          className="gap-2"
        >
          <MessageCircle className="w-4 h-4" />
          {post.comments_count || 0}
        </Button>
      </div>

      {showComments && (
        <div className="mt-4 pt-4 border-t space-y-3 animate-fade-in">
          <div className="flex gap-2">
            <Input
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              maxLength={500}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey && newComment.trim()) {
                  e.preventDefault();
                  createCommentMutation.mutate({
                    postId: post.id,
                    content: newComment,
                  });
                }
              }}
            />
            <Button
              size="sm"
              onClick={() => createCommentMutation.mutate({
                postId: post.id,
                content: newComment,
              })}
              disabled={!newComment.trim() || createCommentMutation.isPending}
              className="bg-gradient-primary"
            >
              {createCommentMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>

          {comments && comments.length > 0 ? (
            <div className="space-y-2">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-2 p-3 bg-muted rounded-lg animate-fade-in">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="text-xs">
                      {((comment.profiles as any)?.display_name || "I")[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold">
                        {(comment.profiles as any)?.display_name || "Investor"}
                      </p>
                      <span className="text-xs text-muted-foreground">
                        {new Date(comment.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-sm text-muted-foreground py-4">
              No comments yet. Be the first to comment!
            </p>
          )}
        </div>
      )}
    </Card>
  );
};

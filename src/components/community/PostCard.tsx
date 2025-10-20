import { useState, useEffect } from "react";
import { MessageCircle, Heart, Send, Loader2, MoreVertical, Bookmark } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const CATEGORY_ICONS: Record<string, string> = {
  strategy: "📊",
  screenshot: "📸",
  question: "❓",
  success: "🎉",
  discussion: "💬",
  general: "📝",
};

const CATEGORY_LABELS: Record<string, string> = {
  strategy: "Strategy",
  screenshot: "Screenshot",
  question: "Question",
  success: "Success Story",
  discussion: "Discussion",
  general: "General",
};

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
  const avatarUrl = (post.profiles as any)?.avatar_url;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10 border-2 border-primary/20">
            <AvatarImage src={avatarUrl} />
            <AvatarFallback className="bg-gradient-primary text-white">
              {displayName[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-bold text-sm">{displayName}</p>
              {post.category && (
                <Badge variant="secondary" className="text-xs">
                  {CATEGORY_ICONS[post.category]} {CATEGORY_LABELS[post.category]}
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {new Date(post.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreVertical className="w-4 h-4" />
        </Button>
      </div>

      {/* Image */}
      {post.image_url && (
        <div className="relative w-full bg-muted">
          {post.media_type === 'video' ? (
            <video
              src={post.image_url}
              controls
              className="w-full max-h-[500px] object-contain"
            />
          ) : (
            <img
              src={post.image_url}
              alt="Post content"
              className="w-full max-h-[500px] object-contain"
            />
          )}
        </div>
      )}

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleLike(post.id)}
              className={cn(
                "gap-2 hover:scale-110 transition-transform",
                isLiked && "text-red-500"
              )}
            >
              <Heart className={cn("w-5 h-5", isLiked && "fill-red-500")} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowComments(!showComments)}
              className="gap-2 hover:scale-110 transition-transform"
            >
              <MessageCircle className="w-5 h-5" />
            </Button>
          </div>
          <Button variant="ghost" size="sm" className="hover:scale-110 transition-transform">
            <Bookmark className="w-5 h-5" />
          </Button>
        </div>

        {/* Likes Count */}
        {post.likes_count > 0 && (
          <p className="text-sm font-semibold">
            {post.likes_count} {post.likes_count === 1 ? "like" : "likes"}
          </p>
        )}

        {/* Post Content */}
        <div>
          <p className="text-sm">
            <span className="font-semibold mr-2">{displayName}</span>
            <span className="whitespace-pre-wrap">{post.content}</span>
          </p>
        </div>

        {/* View Comments Link */}
        {post.comments_count > 0 && !showComments && (
          <button
            onClick={() => setShowComments(true)}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            View all {post.comments_count} comments
          </button>
        )}
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="px-4 pb-4 space-y-3 border-t pt-4 animate-fade-in">
          <div className="flex gap-2">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="text-xs">You</AvatarFallback>
            </Avatar>
            <div className="flex-1 flex gap-2">
              <Input
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                maxLength={500}
                className="flex-1"
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
                className="bg-gradient-primary px-6"
              >
                {createCommentMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Post"
                )}
              </Button>
            </div>
          </div>

          {comments && comments.length > 0 ? (
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-2 animate-fade-in">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="text-xs">
                      {((comment.profiles as any)?.display_name || "I")[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 bg-muted rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold">
                        {(comment.profiles as any)?.display_name || "Investor"}
                      </p>
                      <span className="text-xs text-muted-foreground">
                        {new Date(comment.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
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

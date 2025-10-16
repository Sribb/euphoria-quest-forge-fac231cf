import { useState } from "react";
import { MessageCircle, Heart, Send } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface PostCardProps {
  post: any;
  onToggleLike: (postId: string) => void;
}

export const PostCard = ({ post, onToggleLike }: PostCardProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");

  const { data: comments } = useQuery({
    queryKey: ["comments", post.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("comments")
        .select(`
          *,
          profiles(display_name)
        `)
        .eq("post_id", post.id)
        .order("created_at", { ascending: true });
      
      if (error) throw error;
      return data;
    },
    enabled: showComments,
  });

  const createCommentMutation = useMutation({
    mutationFn: async ({ postId, content }: { postId: string; content: string }) => {
      const { error } = await supabase
        .from("comments")
        .insert({ post_id: postId, user_id: user?.id, content });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", post.id] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      setNewComment("");
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
          className="gap-2"
        >
          <Heart className="w-4 h-4" />
          {post.likes_count}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowComments(!showComments)}
          className="gap-2"
        >
          <MessageCircle className="w-4 h-4" />
          {post.comments_count}
        </Button>
      </div>

      {showComments && (
        <div className="mt-4 pt-4 border-t space-y-3">
          <div className="flex gap-2">
            <Input
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <Button
              size="sm"
              onClick={() => createCommentMutation.mutate({
                postId: post.id,
                content: newComment,
              })}
              disabled={!newComment.trim() || createCommentMutation.isPending}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>

          {comments?.map((comment) => (
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
};

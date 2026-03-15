import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Heart, Loader2, Send } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface CommentSectionProps {
  postId: string;
}

export const CommentSection = ({ postId }: CommentSectionProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [newComment, setNewComment] = useState("");

  const { data: comments, isLoading } = useQuery({
    queryKey: ["comments", postId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("comments")
        .select("*, profiles(display_name, avatar_url, username)")
        .eq("post_id", postId)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const { data: likedComments } = useQuery({
    queryKey: ["comment-likes", postId, user?.id],
    queryFn: async () => {
      if (!comments?.length) return new Set<string>();
      const { data, error } = await supabase
        .from("comment_likes")
        .select("comment_id")
        .eq("user_id", user!.id)
        .in("comment_id", comments.map((c: any) => c.id));
      if (error) throw error;
      return new Set(data.map((l: any) => l.comment_id));
    },
    enabled: !!user?.id && !!comments?.length,
  });

  const addCommentMutation = useMutation({
    mutationFn: async () => {
      if (!newComment.trim() || !user) return;
      const { error } = await supabase.from("comments").insert({
        post_id: postId,
        user_id: user.id,
        content: newComment.trim(),
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setNewComment("");
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      queryClient.invalidateQueries({ queryKey: ["community-posts"] });
    },
    onError: () => toast.error("Failed to add comment"),
  });

  const toggleCommentLike = useMutation({
    mutationFn: async (commentId: string) => {
      if (!user) return;
      const liked = likedComments?.has(commentId);
      if (liked) {
        await supabase.from("comment_likes").delete().eq("comment_id", commentId).eq("user_id", user.id);
      } else {
        await supabase.from("comment_likes").insert({ comment_id: commentId, user_id: user.id });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comment-likes", postId] });
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
  });

  return (
    <div className="border-t border-border mt-2 pt-2">
      {/* Comment input */}
      <div className="flex items-center gap-2 mb-3">
        <Avatar className="w-7 h-7 shrink-0">
          <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
            {user?.email?.[0]?.toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 flex items-center gap-1.5 bg-muted/40 rounded-full px-3 py-1.5">
          <input
            type="text"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && newComment.trim() && addCommentMutation.mutate()}
            className="flex-1 bg-transparent text-[13px] outline-none placeholder:text-muted-foreground/60"
          />
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-primary rounded-full"
            disabled={!newComment.trim() || addCommentMutation.isPending}
            onClick={() => addCommentMutation.mutate()}
          >
            {addCommentMutation.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
          </Button>
        </div>
      </div>

      {/* Comments list */}
      {isLoading ? (
        <div className="flex justify-center py-3">
          <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <AnimatePresence>
          {comments?.map((comment: any) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-2 mb-2.5"
            >
              <Avatar className="w-6 h-6 shrink-0 mt-0.5">
                <AvatarFallback
                  className="text-[10px] font-semibold text-primary-foreground"
                  style={{ backgroundColor: comment.profiles?.avatar_url || "hsl(263 84% 58%)" }}
                >
                  {comment.profiles?.display_name?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 mb-0.5">
                  <span className="font-semibold text-[12px] text-foreground truncate">
                    {comment.profiles?.display_name || "Anonymous"}
                  </span>
                  <span className="text-muted-foreground text-[11px]">·</span>
                  <span className="text-muted-foreground text-[11px] shrink-0">
                    {formatDistanceToNow(new Date(comment.created_at), { addSuffix: false })}
                  </span>
                </div>
                <p className="text-[13px] leading-relaxed text-foreground">{comment.content}</p>
                <button
                  onClick={() => toggleCommentLike.mutate(comment.id)}
                  className={cn(
                    "flex items-center gap-1 mt-1 text-[11px] transition-colors",
                    likedComments?.has(comment.id) ? "text-destructive" : "text-muted-foreground hover:text-destructive"
                  )}
                >
                  <Heart className={cn("w-3 h-3", likedComments?.has(comment.id) && "fill-current")} />
                  {(comment as any).likes_count > 0 && <span>{(comment as any).likes_count}</span>}
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      )}
    </div>
  );
};

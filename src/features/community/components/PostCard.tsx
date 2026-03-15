import { useState, useEffect } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  MessageSquare, Heart, Repeat2, Share, Bookmark, BarChart3,
  MoreHorizontal, Pencil, Trash2,
} from "lucide-react";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { CommentSection } from "./CommentSection";
import { ShareMenu } from "./ShareMenu";
import { EditPostDialog } from "./EditPostDialog";
import { DeletePostDialog } from "./DeletePostDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PostCardProps {
  post: any;
  index: number;
  userLikes: Set<string> | undefined;
  userReposts: Set<string> | undefined;
  userBookmarks: Set<string> | undefined;
}

export const PostCard = ({ post, index, userLikes, userReposts, userBookmarks }: PostCardProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showComments, setShowComments] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const isAuthor = user?.id === post.user_id;

  // Track view (unique per user per post)
  useEffect(() => {
    if (!user?.id) return;
    supabase
      .from("post_views")
      .upsert({ user_id: user.id, post_id: post.id }, { onConflict: "user_id,post_id", ignoreDuplicates: true })
      .then();
  }, [post.id, user?.id]);

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: ["community-posts"] });
    queryClient.invalidateQueries({ queryKey: ["user-likes"] });
    queryClient.invalidateQueries({ queryKey: ["user-reposts"] });
    queryClient.invalidateQueries({ queryKey: ["user-bookmarks"] });
  };

  const toggleLike = useMutation({
    mutationFn: async () => {
      if (!user) return;
      if (userLikes?.has(post.id)) {
        await supabase.from("likes").delete().eq("post_id", post.id).eq("user_id", user.id);
      } else {
        await supabase.from("likes").insert({ post_id: post.id, user_id: user.id });
      }
    },
    onSuccess: invalidateAll,
  });

  const toggleRepost = useMutation({
    mutationFn: async () => {
      if (!user) return;
      if (userReposts?.has(post.id)) {
        await supabase.from("reposts").delete().eq("post_id", post.id).eq("user_id", user.id);
      } else {
        await supabase.from("reposts").insert({ post_id: post.id, user_id: user.id });
      }
    },
    onSuccess: () => {
      invalidateAll();
      toast.success(userReposts?.has(post.id) ? "Repost removed" : "Reposted!");
    },
  });

  const toggleBookmark = useMutation({
    mutationFn: async () => {
      if (!user) return;
      if (userBookmarks?.has(post.id)) {
        await supabase.from("bookmarks").delete().eq("post_id", post.id).eq("user_id", user.id);
      } else {
        await supabase.from("bookmarks").insert({ post_id: post.id, user_id: user.id });
      }
    },
    onSuccess: () => {
      invalidateAll();
      toast.success(userBookmarks?.has(post.id) ? "Bookmark removed" : "Bookmarked!");
    },
  });

  const editPost = useMutation({
    mutationFn: async (content: string) => {
      const { error } = await supabase
        .from("posts")
        .update({ content, edited_at: new Date().toISOString() } as any)
        .eq("id", post.id);
      if (error) throw error;
    },
    onSuccess: () => {
      setShowEditDialog(false);
      queryClient.invalidateQueries({ queryKey: ["community-posts"] });
      toast.success("Post updated");
    },
    onError: () => toast.error("Failed to update post"),
  });

  const deletePost = useMutation({
    mutationFn: async () => {
      // Delete associated data first (cascading handles likes/comments/reposts via FK)
      const { error } = await supabase.from("posts").delete().eq("id", post.id);
      if (error) throw error;
    },
    onSuccess: () => {
      setShowDeleteDialog(false);
      queryClient.invalidateQueries({ queryKey: ["community-posts"] });
      toast.success("Post deleted");
    },
    onError: () => toast.error("Failed to delete post"),
  });

  const formatHandle = (profile: any) => {
    if (profile?.username) return `@${profile.username}`;
    if (profile?.display_name) return `@${profile.display_name.toLowerCase().replace(/\s+/g, "")}`;
    return "@user";
  };

  const formatCount = (n: number) => {
    if (!n) return "";
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
    return n.toString();
  };

  // Show repost attribution
  const repostedBy = post._repostedBy;

  return (
    <>
      <motion.article
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: index * 0.03 }}
        className="border-b border-border px-4 py-3 hover:bg-muted/30 transition-colors"
      >
        {repostedBy && (
          <div className="flex items-center gap-1.5 text-muted-foreground text-[12px] mb-1.5 ml-12">
            <Repeat2 className="w-3.5 h-3.5" />
            <span>Reposted by {repostedBy}</span>
          </div>
        )}
        <div className="flex gap-3">
          <Avatar className="w-10 h-10 shrink-0">
            <AvatarFallback
              className="font-semibold text-sm text-primary-foreground"
              style={{ backgroundColor: post.profiles?.avatar_url || "hsl(263 84% 58%)" }}
            >
              {post.profiles?.display_name?.[0]?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            {/* Header */}
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
              {(post as any).edited_at && (
                <span className="text-muted-foreground text-[11px] italic shrink-0">(edited)</span>
              )}
              {/* Author menu */}
              {isAuthor && (
                <div className="ml-auto">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-1 rounded-full hover:bg-muted transition-colors text-muted-foreground">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-36">
                      <DropdownMenuItem onClick={() => setShowEditDialog(true)} className="cursor-pointer">
                        <Pencil className="w-4 h-4 mr-2" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setShowDeleteDialog(true)} className="cursor-pointer text-destructive focus:text-destructive">
                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>

            {/* Body */}
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
              {/* Comment */}
              <button
                onClick={() => setShowComments(!showComments)}
                className="group flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors"
              >
                <div className="p-1.5 rounded-full group-hover:bg-primary/10 transition-colors">
                  <MessageSquare className="w-[17px] h-[17px]" />
                </div>
                <span className="text-[13px]">{formatCount(post.comments_count)}</span>
              </button>

              {/* Repost */}
              <button
                onClick={(e) => { e.stopPropagation(); toggleRepost.mutate(); }}
                className={cn(
                  "group flex items-center gap-1.5 transition-colors",
                  userReposts?.has(post.id) ? "text-green-500" : "text-muted-foreground hover:text-green-500"
                )}
              >
                <div className={cn(
                  "p-1.5 rounded-full transition-colors",
                  userReposts?.has(post.id) ? "bg-green-500/10" : "group-hover:bg-green-500/10"
                )}>
                  <Repeat2 className="w-[17px] h-[17px]" />
                </div>
                <span className="text-[13px]">{formatCount((post as any).reposts_count || 0)}</span>
              </button>

              {/* Like */}
              <button
                onClick={(e) => { e.stopPropagation(); toggleLike.mutate(); }}
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
                <span className="text-[13px]">{formatCount(post.likes_count)}</span>
              </button>

              {/* Views */}
              <button className="group flex items-center gap-1.5 text-muted-foreground transition-colors">
                <div className="p-1.5 rounded-full transition-colors">
                  <BarChart3 className="w-[17px] h-[17px]" />
                </div>
                <span className="text-[13px]">{formatCount((post as any).views_count || 0)}</span>
              </button>

              {/* Bookmark & Share */}
              <div className="flex items-center">
                <button
                  onClick={(e) => { e.stopPropagation(); toggleBookmark.mutate(); }}
                  className={cn(
                    "group p-1.5 rounded-full transition-colors",
                    userBookmarks?.has(post.id) ? "text-primary" : "text-muted-foreground hover:text-primary hover:bg-primary/10"
                  )}
                >
                  <Bookmark className={cn("w-[17px] h-[17px]", userBookmarks?.has(post.id) && "fill-current")} />
                </button>
                <ShareMenu postId={post.id}>
                  <button className="group p-1.5 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                    <Share className="w-[17px] h-[17px]" />
                  </button>
                </ShareMenu>
              </div>
            </div>

            {/* Comments section */}
            {showComments && <CommentSection postId={post.id} />}
          </div>
        </div>
      </motion.article>

      <EditPostDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        initialContent={post.content}
        onSave={(content) => editPost.mutate(content)}
        isPending={editPost.isPending}
      />
      <DeletePostDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={() => deletePost.mutate()}
      />
    </>
  );
};

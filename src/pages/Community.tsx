import { useState } from "react";
import { MessageCircle, Send } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { PostCard } from "@/components/community/PostCard";

interface CommunityProps {
  onNavigate: (tab: string) => void;
}

const Community = ({ onNavigate }: CommunityProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [newPost, setNewPost] = useState("");

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
        {posts?.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onToggleLike={(postId) => toggleLikeMutation.mutate(postId)}
          />
        ))}
      </div>
    </div>
  );
};

export default Community;

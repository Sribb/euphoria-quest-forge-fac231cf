import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  MessageSquare, Heart, Send, Plus, Users, Hash, Image as ImageIcon,
  Search, MoreHorizontal, Loader2, Smile
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";

interface CommunityProps {
  onNavigate: (tab: string) => void;
}

const Community = ({ onNavigate }: CommunityProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [newPostContent, setNewPostContent] = useState("");
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [dmMessage, setDmMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch posts
  const { data: posts, isLoading: postsLoading } = useQuery({
    queryKey: ["community-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*, profiles(display_name, avatar_url)")
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

  // Fetch DM conversations
  const { data: dmConversations } = useQuery({
    queryKey: ["dm-conversations", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("direct_messages")
        .select("*")
        .or(`sender_id.eq.${user?.id},receiver_id.eq.${user?.id}`)
        .order("created_at", { ascending: false });
      if (error) throw error;

      // Group by conversation partner and fetch their profiles
      const convos = new Map<string, any>();
      const partnerIds = new Set<string>();
      data?.forEach((msg: any) => {
        const partnerId = msg.sender_id === user?.id ? msg.receiver_id : msg.sender_id;
        partnerIds.add(partnerId);
        if (!convos.has(partnerId)) {
          convos.set(partnerId, {
            partnerId,
            partnerName: "User",
            partnerAvatar: "#9b87f5",
            lastMessage: msg.content,
            lastMessageAt: msg.created_at,
            unread: msg.receiver_id === user?.id && !msg.is_read,
          });
        }
      });

      // Fetch partner profiles
      if (partnerIds.size > 0) {
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id, display_name, avatar_url")
          .in("id", Array.from(partnerIds));
        profiles?.forEach((p: any) => {
          const convo = convos.get(p.id);
          if (convo) {
            convo.partnerName = p.display_name || "User";
            convo.partnerAvatar = p.avatar_url || "#9b87f5";
          }
        });
      }

      return Array.from(convos.values());
    },
    enabled: !!user?.id,
  });

  // Fetch messages for active conversation
  const { data: activeMessages } = useQuery({
    queryKey: ["dm-messages", activeConversation],
    queryFn: async () => {
      if (!activeConversation) return [];
      const { data, error } = await supabase
        .from("direct_messages")
        .select("*")
        .or(
          `and(sender_id.eq.${user?.id},receiver_id.eq.${activeConversation}),and(sender_id.eq.${activeConversation},receiver_id.eq.${user?.id})`
        )
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!activeConversation && !!user?.id,
  });

  // Fetch groups
  const { data: groups } = useQuery({
    queryKey: ["message-groups", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("message_groups")
        .select("*, group_members!inner(user_id)")
        .eq("group_members.user_id", user?.id!);
      if (error) throw error;
      return data;
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
      toast.success("Post shared!");
    },
    onError: () => toast.error("Failed to create post"),
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

  // Send DM
  const sendDmMutation = useMutation({
    mutationFn: async () => {
      if (!dmMessage.trim() || !activeConversation) return;
      const { error } = await supabase.from("direct_messages").insert({
        sender_id: user?.id!,
        receiver_id: activeConversation,
        content: dmMessage.trim(),
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setDmMessage("");
      queryClient.invalidateQueries({ queryKey: ["dm-messages"] });
      queryClient.invalidateQueries({ queryKey: ["dm-conversations"] });
    },
    onError: () => toast.error("Failed to send message"),
  });

  // Realtime subscriptions
  useEffect(() => {
    if (!user?.id) return;

    const dmChannel = supabase
      .channel("dm-realtime")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "direct_messages" }, () => {
        queryClient.invalidateQueries({ queryKey: ["dm-messages"] });
        queryClient.invalidateQueries({ queryKey: ["dm-conversations"] });
      })
      .subscribe();

    return () => { supabase.removeChannel(dmChannel); };
  }, [user?.id, queryClient]);

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeMessages]);

  const activePartner = dmConversations?.find((c) => c.partnerId === activeConversation);

  return (
    <div className="space-y-4 pt-2 pb-20">
      <div className="flex items-center gap-3 animate-fade-in">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
          <Users className="w-5 h-5 md:w-6 md:h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-bold">Community</h1>
          <p className="text-sm text-muted-foreground">Connect, discuss & grow together</p>
        </div>
      </div>

      <Tabs defaultValue="feed" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="feed" className="text-xs md:text-sm">
            <MessageSquare className="w-4 h-4 mr-1" /> Feed
          </TabsTrigger>
          <TabsTrigger value="dms" className="text-xs md:text-sm">
            <Send className="w-4 h-4 mr-1" /> Messages
          </TabsTrigger>
          <TabsTrigger value="groups" className="text-xs md:text-sm">
            <Hash className="w-4 h-4 mr-1" /> Groups
          </TabsTrigger>
        </TabsList>

        {/* Feed Tab */}
        <TabsContent value="feed" className="space-y-4">
          {/* New Post */}
          <Card className="p-4 border-border">
            <div className="flex gap-3">
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-primary/20 text-primary font-bold">
                  {user?.email?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-3">
                <Input
                  placeholder="Share a thought, insight, or question..."
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  className="bg-background/50 border-border"
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && createPostMutation.mutate()}
                />
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="text-muted-foreground">
                      <ImageIcon className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-muted-foreground">
                      <Smile className="w-4 h-4" />
                    </Button>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => createPostMutation.mutate()}
                    disabled={!newPostContent.trim() || createPostMutation.isPending}
                    className="bg-gradient-primary shadow-glow"
                  >
                    {createPostMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Post"}
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Posts */}
          {postsLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <AnimatePresence>
              {posts?.map((post: any, i: number) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="p-4 border-border hover:border-primary/30 transition-colors">
                    <div className="flex gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback
                          className="font-bold text-white"
                          style={{ backgroundColor: post.profiles?.avatar_url || "#9b87f5" }}
                        >
                          {post.profiles?.display_name?.[0]?.toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold truncate">
                            {post.profiles?.display_name || "Anonymous"}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                          </span>
                          {post.category && post.category !== "general" && (
                            <Badge variant="outline" className="text-[10px]">
                              {post.category}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{post.content}</p>
                        {post.image_url && (
                          <img
                            src={post.image_url}
                            alt="Post"
                            className="mt-3 rounded-lg max-h-64 object-cover w-full"
                          />
                        )}
                        <div className="flex items-center gap-4 mt-3">
                          <button
                            onClick={() => toggleLikeMutation.mutate(post.id)}
                            className={`flex items-center gap-1 text-sm transition-colors ${
                              userLikes?.has(post.id) ? "text-destructive" : "text-muted-foreground hover:text-destructive"
                            }`}
                          >
                            <Heart className={`w-4 h-4 ${userLikes?.has(post.id) ? "fill-current" : ""}`} />
                            {post.likes_count || 0}
                          </button>
                          <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
                            <MessageSquare className="w-4 h-4" />
                            {post.comments_count || 0}
                          </button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          )}

          {posts?.length === 0 && !postsLoading && (
            <Card className="p-12 text-center border-border">
              <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
              <p className="text-muted-foreground">Be the first to share something!</p>
            </Card>
          )}
        </TabsContent>

        {/* DMs Tab */}
        <TabsContent value="dms" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 min-h-[500px]">
            {/* Conversation list */}
            <Card className="p-3 border-border md:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <Search className="w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-8 text-sm bg-background/50"
                />
              </div>
              <ScrollArea className="h-[400px]">
                {dmConversations?.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    <Send className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    No messages yet
                  </div>
                ) : (
                  dmConversations?.map((convo) => (
                    <button
                      key={convo.partnerId}
                      onClick={() => setActiveConversation(convo.partnerId)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                        activeConversation === convo.partnerId
                          ? "bg-primary/10 border border-primary/20"
                          : "hover:bg-muted/50"
                      }`}
                    >
                      <Avatar className="w-9 h-9">
                        <AvatarFallback
                          className="text-white font-bold text-sm"
                          style={{ backgroundColor: convo.partnerAvatar || "#9b87f5" }}
                        >
                          {convo.partnerName?.[0]?.toUpperCase() || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm truncate">{convo.partnerName || "User"}</span>
                          {convo.unread && <div className="w-2 h-2 rounded-full bg-primary" />}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{convo.lastMessage}</p>
                      </div>
                    </button>
                  ))
                )}
              </ScrollArea>
            </Card>

            {/* Message area */}
            <Card className="p-4 border-border md:col-span-2 flex flex-col">
              {activeConversation ? (
                <>
                  <div className="flex items-center gap-3 pb-3 border-b border-border mb-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback
                        className="text-white font-bold text-sm"
                        style={{ backgroundColor: activePartner?.partnerAvatar || "#9b87f5" }}
                      >
                        {activePartner?.partnerName?.[0]?.toUpperCase() || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-semibold">{activePartner?.partnerName || "User"}</span>
                  </div>
                  <ScrollArea className="flex-1 h-[350px] pr-3">
                    <div className="space-y-3">
                      {activeMessages?.map((msg: any) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.sender_id === user?.id ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm ${
                              msg.sender_id === user?.id
                                ? "bg-primary text-primary-foreground rounded-br-md"
                                : "bg-muted rounded-bl-md"
                            }`}
                          >
                            {msg.content}
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>
                  <div className="flex gap-2 mt-3 pt-3 border-t border-border">
                    <Input
                      placeholder="Type a message..."
                      value={dmMessage}
                      onChange={(e) => setDmMessage(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && sendDmMutation.mutate()}
                      className="bg-background/50"
                    />
                    <Button
                      onClick={() => sendDmMutation.mutate()}
                      disabled={!dmMessage.trim() || sendDmMutation.isPending}
                      className="bg-gradient-primary shadow-glow"
                      size="icon"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <Send className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p className="font-medium">Select a conversation</p>
                    <p className="text-sm">Or start a new one from a user's profile</p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </TabsContent>

        {/* Groups Tab */}
        <TabsContent value="groups" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Your Groups</h3>
            <Button size="sm" className="bg-gradient-primary shadow-glow">
              <Plus className="w-4 h-4 mr-1" /> Create Group
            </Button>
          </div>

          {groups?.length === 0 ? (
            <Card className="p-12 text-center border-border">
              <Hash className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No groups yet</h3>
              <p className="text-muted-foreground mb-4">Create or join a group to start chatting</p>
              <Button className="bg-gradient-primary shadow-glow">
                <Plus className="w-4 h-4 mr-1" /> Create Your First Group
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {groups?.map((group: any) => (
                <Card key={group.id} className="p-4 border-border hover:border-primary/30 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white"
                      style={{ backgroundColor: group.avatar_color || "#9b87f5" }}
                    >
                      <Hash className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{group.name}</h4>
                      <p className="text-xs text-muted-foreground">{group.description || "No description"}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Community;

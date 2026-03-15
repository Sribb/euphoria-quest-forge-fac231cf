import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Search, Send, ArrowLeft, Plus, Smile, Paperclip, Loader2, MessageSquare,
  Check, CheckCheck, X, UserPlus, AlertCircle, RotateCcw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { format, isToday, isYesterday } from "date-fns";
import { useIsMobile } from "@/hooks/use-mobile";

// Helper for tables not yet in auto-generated types
const db = supabase as any;

type ConversationStatus = "pending" | "active";
type RequestStatus = "pending" | "accepted" | "declined";

interface Conversation {
  id: string;
  participant_one: string;
  participant_two: string;
  last_message_content: string | null;
  last_message_at: string;
  status: ConversationStatus;
  created_at: string;
  partner?: { id: string; display_name: string; avatar_url: string | null };
  unreadCount?: number;
}

interface MessageRequest {
  id: string;
  sender_id: string;
  recipient_id: string;
  conversation_id: string;
  intro_message: string | null;
  status: RequestStatus;
  created_at: string;
  sender?: { display_name: string; avatar_url: string | null };
}

export const IMessageChat = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [dmMessage, setDmMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewMessage, setShowNewMessage] = useState(false);
  const [newMsgSearch, setNewMsgSearch] = useState("");
  const [newMsgIntro, setNewMsgIntro] = useState("");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"messages" | "requests">("messages");
  const [typingPartner, setTypingPartner] = useState(false);
  const [failedMessages, setFailedMessages] = useState<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastTypingBroadcast = useRef(0);

  // ── Fetch conversations ──
  const { data: conversations = [], isLoading: convosLoading } = useQuery({
    queryKey: ["conversations", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await (supabase as any)
        .from("conversations")
        .select("*")
        .or(`participant_one.eq.${user.id},participant_two.eq.${user.id}`)
        .eq("status", "active")
        .order("last_message_at", { ascending: false });
      if (error) throw error;

      const partnerIds = (data || []).map((c: any) =>
        c.participant_one === user.id ? c.participant_two : c.participant_one
      );

      let profilesMap: Record<string, any> = {};
      if (partnerIds.length > 0) {
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id, display_name, avatar_url")
          .in("id", partnerIds);
        profiles?.forEach((p: any) => { profilesMap[p.id] = p; });
      }

      const convos: Conversation[] = [];
      for (const c of data || []) {
        const partnerId = c.participant_one === user.id ? c.participant_two : c.participant_one;
        const { count } = await db
          .from("direct_messages")
          .select("*", { count: "exact", head: true })
          .eq("conversation_id", c.id)
          .eq("receiver_id", user.id)
          .eq("is_read", false);

        convos.push({
          ...c,
          partner: profilesMap[partnerId] || { id: partnerId, display_name: "User", avatar_url: null },
          unreadCount: count || 0,
        });
      }
      return convos;
    },
    enabled: !!user?.id,
  });

  // ── Fetch message requests (incoming) ──
  const { data: incomingRequests = [] } = useQuery({
    queryKey: ["message-requests-incoming", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await db
        .from("message_requests")
        .select("*")
        .eq("recipient_id", user.id)
        .eq("status", "pending")
        .order("created_at", { ascending: false });
      if (error) throw error;

      const senderIds = (data || []).map((r: any) => r.sender_id);
      let sendersMap: Record<string, any> = {};
      if (senderIds.length > 0) {
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id, display_name, avatar_url")
          .in("id", senderIds);
        profiles?.forEach((p: any) => { sendersMap[p.id] = p; });
      }

      return (data || []).map((r: any) => ({
        ...r,
        sender: sendersMap[r.sender_id] || { display_name: "User", avatar_url: null },
      })) as MessageRequest[];
    },
    enabled: !!user?.id,
  });

  // ── Fetch sent pending requests ──
  const { data: sentRequests = [] } = useQuery({
    queryKey: ["message-requests-sent", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await db
        .from("message_requests")
        .select("recipient_id")
        .eq("sender_id", user.id)
        .eq("status", "pending");
      if (error) throw error;
      return new Set((data || []).map((r: any) => r.recipient_id));
    },
    enabled: !!user?.id,
  });

  // ── Fetch messages for active conversation ──
  const { data: activeMessages = [] } = useQuery({
    queryKey: ["conversation-messages", activeConversationId],
    queryFn: async () => {
      if (!activeConversationId) return [];
      const { data, error } = await db
        .from("direct_messages")
        .select("*")
        .eq("conversation_id", activeConversationId)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data || [];
    },
    enabled: !!activeConversationId && !!user?.id,
  });

  // ── User search for new message ──
  const { data: searchResults = [] } = useQuery({
    queryKey: ["user-search", newMsgSearch],
    queryFn: async () => {
      if (!newMsgSearch.trim() || newMsgSearch.length < 2) return [];
      const { data, error } = await supabase
        .from("profiles")
        .select("id, display_name, avatar_url, username")
        .or(`display_name.ilike.%${newMsgSearch}%,username.ilike.%${newMsgSearch}%`)
        .neq("id", user?.id!)
        .limit(8);
      if (error) throw error;
      return data || [];
    },
    enabled: !!newMsgSearch && newMsgSearch.length >= 2 && !!user?.id,
  });

  // ── Mark messages as read ──
  useEffect(() => {
    if (!activeConversationId || !user?.id) return;
    const markRead = async () => {
      // Mark messages as read
      await db
        .from("direct_messages")
        .update({ is_read: true } as any)
        .eq("conversation_id", activeConversationId)
        .eq("receiver_id", user.id)
        .eq("is_read", false);

      // Mark corresponding message notifications as read
      await (supabase as any)
        .from("notifications")
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq("user_id", user.id)
        .eq("notification_type", "message")
        .eq("is_read", false)
        .like("action_url", `%conversation=${activeConversationId}%`);

      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    };
    markRead();
  }, [activeConversationId, activeMessages?.length, user?.id, queryClient]);

  // ── Send message request ──
  const sendRequestMutation = useMutation({
    mutationFn: async () => {
      if (!selectedUser || !user?.id) throw new Error("No user selected");

      // Check if conversation already exists
      const { data: existing } = await db
        .from("conversations")
        .select("id, status")
        .or(
          `and(participant_one.eq.${user.id},participant_two.eq.${selectedUser.id}),and(participant_one.eq.${selectedUser.id},participant_two.eq.${user.id})`
        );

      if (existing && existing.length > 0) {
        const convo = existing[0] as any;
        if (convo.status === "active") {
          return { action: "open" as const, conversationId: convo.id as string };
        }
        throw new Error("A request is already pending with this user");
      }

      // Create conversation in pending state
      const { data: convo, error: convoErr } = await db
        .from("conversations")
        .insert({
          participant_one: user.id,
          participant_two: selectedUser.id,
          status: "pending",
          last_message_content: newMsgIntro.trim() || null,
        })
        .select()
        .single();
      if (convoErr) throw convoErr;

      // Create message request
      const { error: reqErr } = await db
        .from("message_requests")
        .insert({
          sender_id: user.id,
          recipient_id: selectedUser.id,
          conversation_id: (convo as any).id,
          intro_message: newMsgIntro.trim() || null,
        });
      if (reqErr) throw reqErr;

      return { action: "sent" as const, conversationId: (convo as any).id as string };
    },
    onSuccess: (result) => {
      if (result?.action === "open") {
        setActiveConversationId(result.conversationId);
        toast.success("Conversation already exists!");
      } else {
        toast.success("Message request sent!");
      }
      setShowNewMessage(false);
      setSelectedUser(null);
      setNewMsgSearch("");
      setNewMsgIntro("");
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      queryClient.invalidateQueries({ queryKey: ["message-requests-sent"] });
    },
    onError: (err: any) => toast.error(err.message || "Failed to send request"),
  });

  // ── Accept request ──
  const acceptRequestMutation = useMutation({
    mutationFn: async (request: MessageRequest) => {
      await db
        .from("message_requests")
        .update({ status: "accepted", updated_at: new Date().toISOString() })
        .eq("id", request.id);

      await db
        .from("conversations")
        .update({ status: "active", updated_at: new Date().toISOString() })
        .eq("id", request.conversation_id);

      if (request.intro_message) {
        await db.from("direct_messages").insert({
          sender_id: request.sender_id,
          receiver_id: request.recipient_id,
          content: request.intro_message,
          conversation_id: request.conversation_id,
        });
      }

      return request.conversation_id;
    },
    onSuccess: (conversationId) => {
      setActiveConversationId(conversationId);
      setActiveTab("messages");
      queryClient.invalidateQueries({ queryKey: ["message-requests-incoming"] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      queryClient.invalidateQueries({ queryKey: ["conversation-messages"] });
      toast.success("Request accepted!");
    },
    onError: () => toast.error("Failed to accept request"),
  });

  // ── Decline request ──
  const declineRequestMutation = useMutation({
    mutationFn: async (request: MessageRequest) => {
      await db
        .from("message_requests")
        .update({ status: "declined", updated_at: new Date().toISOString() })
        .eq("id", request.id);
      await db.from("conversations").delete().eq("id", request.conversation_id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["message-requests-incoming"] });
      toast.success("Request declined");
    },
    onError: () => toast.error("Failed to decline request"),
  });

  // ── Send message ──
  const sendMessageMutation = useMutation({
    mutationFn: async () => {
      if (!dmMessage.trim() || !activeConversationId || !user?.id) return;
      const activeConvo = conversations.find(c => c.id === activeConversationId);
      if (!activeConvo) throw new Error("Conversation not found");

      const receiverId = activeConvo.participant_one === user.id
        ? activeConvo.participant_two
        : activeConvo.participant_one;

      const { error } = await db.from("direct_messages").insert({
        sender_id: user.id,
        receiver_id: receiverId,
        content: dmMessage.trim(),
        conversation_id: activeConversationId,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setDmMessage("");
      queryClient.invalidateQueries({ queryKey: ["conversation-messages"] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
    onError: () => {
      toast.error("Failed to send. Tap to retry.");
    },
  });

  // ── Delete message ──
  const deleteMessageMutation = useMutation({
    mutationFn: async (messageId: string) => {
      const { error } = await db
        .from("direct_messages")
        .delete()
        .eq("id", messageId)
        .eq("sender_id", user?.id!);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversation-messages"] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });

  // ── Delete conversation ──
  const deleteConversationMutation = useMutation({
    mutationFn: async (conversationId: string) => {
      await db
        .from("direct_messages")
        .delete()
        .eq("conversation_id", conversationId);
      await db
        .from("conversations")
        .delete()
        .eq("id", conversationId);
    },
    onSuccess: () => {
      setActiveConversationId(null);
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      toast.success("Conversation deleted");
    },
  });

  // ── Realtime subscriptions ──
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel("messaging-realtime")
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "direct_messages",
      }, async (payload: any) => {
        queryClient.invalidateQueries({ queryKey: ["conversation-messages"] });
        queryClient.invalidateQueries({ queryKey: ["conversations"] });

        // Create notification for incoming messages (not from self, not currently viewing)
        const msg = payload.new;
        if (msg && msg.receiver_id === user.id && msg.sender_id !== user.id) {
          // Don't notify if user is currently viewing this conversation
          if (msg.conversation_id === activeConversationId) return;

          // Look up sender name
          const { data: senderProfile } = await supabase
            .from("profiles")
            .select("display_name")
            .eq("id", msg.sender_id)
            .single();

          const senderName = senderProfile?.display_name || "Someone";
          const preview = msg.content?.length > 60 ? msg.content.substring(0, 60) + "…" : msg.content;

          await (supabase as any).from("notifications").insert({
            user_id: user.id,
            title: `${senderName} sent you a message`,
            message: preview,
            notification_type: "message",
            category: "info",
            icon: "💬",
            action_url: `community?conversation=${msg.conversation_id}`,
            is_read: false,
          });
        }
      })
      .on("postgres_changes", {
        event: "UPDATE",
        schema: "public",
        table: "direct_messages",
      }, () => {
        queryClient.invalidateQueries({ queryKey: ["conversation-messages"] });
        queryClient.invalidateQueries({ queryKey: ["conversations"] });
      })
      .on("postgres_changes", {
        event: "DELETE",
        schema: "public",
        table: "direct_messages",
      }, () => {
        queryClient.invalidateQueries({ queryKey: ["conversation-messages"] });
        queryClient.invalidateQueries({ queryKey: ["conversations"] });
      })
      .on("postgres_changes", {
        event: "*",
        schema: "public",
        table: "conversations",
      }, () => {
        queryClient.invalidateQueries({ queryKey: ["conversations"] });
      })
      .on("postgres_changes", {
        event: "*",
        schema: "public",
        table: "message_requests",
      }, () => {
        queryClient.invalidateQueries({ queryKey: ["message-requests-incoming"] });
        queryClient.invalidateQueries({ queryKey: ["message-requests-sent"] });
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user?.id, queryClient, activeConversationId]);

  // ── Typing indicator via presence ──
  useEffect(() => {
    if (!activeConversationId || !user?.id) return;

    const channel = supabase.channel(`typing:${activeConversationId}`, {
      config: { presence: { key: user.id } },
    });

    channel.on("presence", { event: "sync" }, () => {
      const state = channel.presenceState();
      const otherTyping = Object.entries(state).some(
        ([key, val]) => key !== user.id && (val as any[])?.[0]?.typing
      );
      setTypingPartner(otherTyping);
    });

    channel.subscribe();

    return () => {
      supabase.removeChannel(channel);
      setTypingPartner(false);
    };
  }, [activeConversationId, user?.id]);

  const broadcastTyping = useCallback(() => {
    if (!activeConversationId || !user?.id) return;
    const now = Date.now();
    if (now - lastTypingBroadcast.current < 2000) return;
    lastTypingBroadcast.current = now;

    const channel = supabase.channel(`typing:${activeConversationId}`);
    channel.track({ typing: true });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      channel.track({ typing: false });
    }, 3000);
  }, [activeConversationId, user?.id]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeMessages, typingPartner]);

  // ── Helpers ──
  const activeConvo = conversations.find(c => c.id === activeConversationId);

  const filteredConvos = conversations.filter(c =>
    c.partner?.display_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalUnread = conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0);
  const requestCount = incomingRequests.length;

  const formatMessageTime = (dateStr: string) => {
    const d = new Date(dateStr);
    if (isToday(d)) return format(d, "h:mm a");
    if (isYesterday(d)) return "Yesterday";
    return format(d, "MMM d");
  };

  const groupedMessages = (activeMessages || []).reduce((acc: any[], msg: any, i: number) => {
    if (i === 0 || new Date(msg.created_at).getTime() - new Date(activeMessages[i - 1].created_at).getTime() > 1800000) {
      acc.push({ type: "timestamp", time: msg.created_at });
    }
    acc.push({ type: "message", ...msg });
    return acc;
  }, []);

  const showThread = !isMobile || activeConversationId;
  const showList = !isMobile || !activeConversationId;

  const hasExistingConvo = (userId: string) => {
    return conversations.some(c => c.partner?.id === userId) ||
      (sentRequests instanceof Set && sentRequests.has(userId));
  };

  return (
    <>
      <div className="flex h-[calc(100vh-180px)] min-h-[500px] rounded-2xl overflow-hidden border border-border/30 bg-card/30 backdrop-blur-2xl shadow-xl shadow-black/10">
        {/* ── Conversation List ── */}
        <AnimatePresence mode="wait">
          {showList && (
            <motion.div
              key="list"
              initial={isMobile ? { x: -20, opacity: 0 } : false}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "flex flex-col border-r border-border/20",
                isMobile ? "w-full" : "w-[340px] shrink-0"
              )}
            >
              {/* List header */}
              <div className="px-4 pt-5 pb-3">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-foreground tracking-tight">Messages</h2>
                  <button
                    onClick={() => setShowNewMessage(true)}
                    className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4 text-primary" />
                  </button>
                </div>

                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
                  <input
                    type="text"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-9 pl-9 pr-4 rounded-xl bg-muted/40 backdrop-blur-sm border-0 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                  />
                </div>

                {/* Tabs: Messages / Requests */}
                <div className="flex mt-3 gap-1">
                  <button
                    onClick={() => setActiveTab("messages")}
                    className={cn(
                      "flex-1 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer",
                      activeTab === "messages"
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted/30"
                    )}
                  >
                    Messages
                    {totalUnread > 0 && (
                      <Badge className="ml-1.5 h-4 min-w-[16px] px-1 text-[10px] bg-primary text-primary-foreground">{totalUnread}</Badge>
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab("requests")}
                    className={cn(
                      "flex-1 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer",
                      activeTab === "requests"
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted/30"
                    )}
                  >
                    Requests
                    {requestCount > 0 && (
                      <Badge className="ml-1.5 h-4 min-w-[16px] px-1 text-[10px] bg-destructive text-destructive-foreground">{requestCount}</Badge>
                    )}
                  </button>
                </div>
              </div>

              {/* List content */}
              <ScrollArea className="flex-1">
                <div className="px-2 pb-2">
                  {activeTab === "messages" ? (
                    /* Conversations list */
                    !filteredConvos || filteredConvos.length === 0 ? (
                      <div className="text-center py-16">
                        <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-muted/40 flex items-center justify-center">
                          <MessageSquare className="w-7 h-7 text-muted-foreground/40" />
                        </div>
                        <p className="text-sm font-medium text-muted-foreground/60">No messages yet</p>
                        <p className="text-xs text-muted-foreground/40 mt-1">Tap + to start a conversation</p>
                      </div>
                    ) : (
                      filteredConvos.map((convo) => {
                        const isActive = activeConversationId === convo.id;
                        return (
                          <button
                            key={convo.id}
                            onClick={() => setActiveConversationId(convo.id)}
                            className={cn(
                              "w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all duration-150 cursor-pointer mb-0.5 group",
                              isActive ? "bg-primary/10" : "hover:bg-muted/30"
                            )}
                          >
                            <Avatar className="w-11 h-11 shrink-0">
                              <AvatarFallback
                                className="text-primary-foreground font-semibold text-sm"
                                style={{ backgroundColor: convo.partner?.avatar_url || "hsl(263 84% 58%)" }}
                              >
                                {convo.partner?.display_name?.[0]?.toUpperCase() || "?"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <span className={cn(
                                  "text-sm truncate",
                                  (convo.unreadCount || 0) > 0 ? "font-semibold text-foreground" : "font-medium text-foreground/80"
                                )}>
                                  {convo.partner?.display_name || "User"}
                                </span>
                                <span className="text-[11px] text-muted-foreground/60 shrink-0">
                                  {formatMessageTime(convo.last_message_at)}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 mt-0.5">
                                <p className={cn(
                                  "text-xs truncate flex-1",
                                  (convo.unreadCount || 0) > 0 ? "text-foreground/70 font-medium" : "text-muted-foreground/60"
                                )}>
                                  {convo.last_message_content || "No messages yet"}
                                </p>
                                {(convo.unreadCount || 0) > 0 && (
                                  <div className="min-w-[18px] h-[18px] rounded-full bg-primary flex items-center justify-center shrink-0">
                                    <span className="text-[10px] font-bold text-primary-foreground">{convo.unreadCount}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </button>
                        );
                      })
                    )
                  ) : (
                    /* Requests list */
                    incomingRequests.length === 0 ? (
                      <div className="text-center py-16">
                        <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-muted/40 flex items-center justify-center">
                          <UserPlus className="w-7 h-7 text-muted-foreground/40" />
                        </div>
                        <p className="text-sm font-medium text-muted-foreground/60">No pending requests</p>
                        <p className="text-xs text-muted-foreground/40 mt-1">When someone messages you, it'll appear here</p>
                      </div>
                    ) : (
                      incomingRequests.map((req) => (
                        <div key={req.id} className="px-3 py-3 rounded-xl mb-1 bg-muted/20 border border-border/20">
                          <div className="flex items-center gap-3 mb-2">
                            <Avatar className="w-10 h-10 shrink-0">
                              <AvatarFallback
                                className="text-primary-foreground font-semibold text-sm"
                                style={{ backgroundColor: req.sender?.avatar_url || "hsl(263 84% 58%)" }}
                              >
                                {req.sender?.display_name?.[0]?.toUpperCase() || "?"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-foreground truncate">{req.sender?.display_name || "User"}</p>
                              <p className="text-[11px] text-muted-foreground/60">{formatMessageTime(req.created_at)}</p>
                            </div>
                          </div>
                          {req.intro_message && (
                            <p className="text-xs text-muted-foreground mb-3 px-1 line-clamp-2">"{req.intro_message}"</p>
                          )}
                          <div className="flex gap-2">
                            <button
                              onClick={() => acceptRequestMutation.mutate(req)}
                              disabled={acceptRequestMutation.isPending}
                              className="flex-1 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors cursor-pointer disabled:opacity-50"
                            >
                              {acceptRequestMutation.isPending ? <Loader2 className="w-3 h-3 animate-spin mx-auto" /> : "Accept"}
                            </button>
                            <button
                              onClick={() => declineRequestMutation.mutate(req)}
                              disabled={declineRequestMutation.isPending}
                              className="flex-1 py-2 rounded-lg bg-muted/40 text-foreground text-xs font-semibold hover:bg-muted/60 transition-colors cursor-pointer disabled:opacity-50"
                            >
                              Decline
                            </button>
                          </div>
                        </div>
                      ))
                    )
                  )}
                </div>
              </ScrollArea>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Message Thread ── */}
        <AnimatePresence mode="wait">
          {showThread && (
            <motion.div
              key={`thread-${activeConversationId || "empty"}`}
              initial={isMobile ? { x: 20, opacity: 0 } : { opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={isMobile ? { x: 20, opacity: 0 } : { opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex-1 flex flex-col min-w-0"
            >
              {activeConversationId && activeConvo ? (
                <>
                  {/* Thread header */}
                  <div className="flex items-center gap-3 px-5 py-3.5 border-b border-border/20 bg-card/40 backdrop-blur-xl">
                    {isMobile && (
                      <button
                        onClick={() => setActiveConversationId(null)}
                        className="p-1 -ml-1 rounded-lg hover:bg-muted/30 transition-colors cursor-pointer"
                      >
                        <ArrowLeft className="w-5 h-5 text-primary" />
                      </button>
                    )}
                    <Avatar className="w-9 h-9">
                      <AvatarFallback
                        className="text-primary-foreground font-semibold text-sm"
                        style={{ backgroundColor: activeConvo.partner?.avatar_url || "hsl(263 84% 58%)" }}
                      >
                        {activeConvo.partner?.display_name?.[0]?.toUpperCase() || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-foreground leading-tight">
                        {activeConvo.partner?.display_name || "User"}
                      </p>
                      <p className="text-[11px] text-muted-foreground/60">
                        {typingPartner ? "typing..." : "Active now"}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        if (confirm("Delete this conversation?")) {
                          deleteConversationMutation.mutate(activeConversationId);
                        }
                      }}
                      className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Messages area */}
                  <ScrollArea className="flex-1 px-4">
                    <div className="py-4 space-y-1 max-w-2xl mx-auto">
                      {groupedMessages.map((item: any, i: number) => {
                        if (item.type === "timestamp") {
                          const d = new Date(item.time);
                          const label = isToday(d)
                            ? format(d, "h:mm a")
                            : isYesterday(d)
                              ? `Yesterday ${format(d, "h:mm a")}`
                              : format(d, "MMM d, h:mm a");
                          return (
                            <div key={`ts-${i}`} className="flex justify-center py-3">
                              <span className="text-[11px] text-muted-foreground/50 font-medium px-3 py-1 rounded-full bg-muted/20 backdrop-blur-sm">
                                {label}
                              </span>
                            </div>
                          );
                        }

                        const isMine = item.sender_id === user?.id;
                        const isFailed = failedMessages.has(item.id);

                        return (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 6, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.15 }}
                            className={cn("flex mb-0.5 group", isMine ? "justify-end" : "justify-start")}
                          >
                            <div className="relative max-w-[75%]">
                              <div
                                className={cn(
                                  "px-4 py-2.5 text-[14px] leading-relaxed break-words overflow-hidden whitespace-pre-wrap",
                                  isMine
                                    ? "bg-primary text-primary-foreground rounded-[20px] rounded-br-[6px]"
                                    : "bg-muted/40 backdrop-blur-sm text-foreground rounded-[20px] rounded-bl-[6px] border border-border/10"
                                )}
                              >
                                {item.content}
                              </div>
                              {/* Delete button (own messages) */}
                              {isMine && (
                                <button
                                  onClick={() => deleteMessageMutation.mutate(item.id)}
                                  className="absolute -left-7 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1 rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all cursor-pointer"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          </motion.div>
                        );
                      })}

                      {/* Typing indicator */}
                      {typingPartner && (
                        <motion.div
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex justify-start"
                        >
                          <div className="bg-muted/40 backdrop-blur-sm rounded-[20px] rounded-bl-[6px] border border-border/10 px-4 py-3">
                            <div className="flex gap-1">
                              <div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                              <div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                              <div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "300ms" }} />
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* Read receipt */}
                      {activeMessages && activeMessages.length > 0 && activeMessages[activeMessages.length - 1].sender_id === user?.id && (
                        <div className="flex justify-end pr-1">
                          <span className="text-[10px] text-muted-foreground/40 font-medium flex items-center gap-0.5">
                            {activeMessages[activeMessages.length - 1].is_read ? (
                              <><CheckCheck className="w-3 h-3" /> Read</>
                            ) : (
                              <><Check className="w-3 h-3" /> Delivered</>
                            )}
                          </span>
                        </div>
                      )}

                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>

                  {/* Input bar */}
                  <div className="px-4 py-3 border-t border-border/15 bg-card/30 backdrop-blur-xl">
                    <div className="flex items-end gap-2 max-w-2xl mx-auto">
                      <button className="p-2 rounded-full hover:bg-muted/30 transition-colors text-muted-foreground/60 hover:text-muted-foreground cursor-pointer shrink-0 mb-0.5">
                        <Paperclip className="w-5 h-5" />
                      </button>
                      <div className="flex-1 flex items-end gap-2 bg-muted/30 backdrop-blur-sm rounded-[22px] border border-border/15 px-4 py-2">
                        <textarea
                          value={dmMessage}
                          onChange={(e) => {
                            setDmMessage(e.target.value);
                            broadcastTyping();
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              sendMessageMutation.mutate();
                            }
                          }}
                          placeholder="Message"
                          rows={1}
                          className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none resize-none min-h-[20px] max-h-[120px] leading-relaxed"
                          style={{ height: "20px" }}
                          onInput={(e) => {
                            const t = e.currentTarget;
                            t.style.height = "20px";
                            t.style.height = Math.min(t.scrollHeight, 120) + "px";
                          }}
                        />
                        <button className="p-1 rounded-full hover:bg-muted/30 transition-colors text-muted-foreground/60 hover:text-muted-foreground cursor-pointer shrink-0">
                          <Smile className="w-5 h-5" />
                        </button>
                      </div>
                      <button
                        onClick={() => sendMessageMutation.mutate()}
                        disabled={!dmMessage.trim() || sendMessageMutation.isPending}
                        className={cn(
                          "w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 shrink-0 mb-0.5 cursor-pointer",
                          dmMessage.trim()
                            ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:shadow-lg scale-100"
                            : "bg-muted/30 text-muted-foreground/30 cursor-not-allowed"
                        )}
                      >
                        {sendMessageMutation.isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Send className="w-4 h-4 ml-0.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                /* Empty state */
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted/20 backdrop-blur-sm flex items-center justify-center">
                      <MessageSquare className="w-9 h-9 text-muted-foreground/30" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground/80 mb-1">Your Messages</h3>
                    <p className="text-sm text-muted-foreground/50 max-w-[240px]">
                      Select a conversation or tap + to start a new one
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── New Message Dialog ── */}
      <Dialog open={showNewMessage} onOpenChange={setShowNewMessage}>
        <DialogContent className="sm:max-w-md bg-card/90 backdrop-blur-2xl border-border/30">
          <DialogHeader>
            <DialogTitle className="text-foreground">New Message</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* User search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
              <input
                type="text"
                placeholder="Search by username or display name..."
                value={newMsgSearch}
                onChange={(e) => {
                  setNewMsgSearch(e.target.value);
                  setSelectedUser(null);
                }}
                className="w-full h-10 pl-9 pr-4 rounded-xl bg-muted/40 backdrop-blur-sm border border-border/20 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
              />
            </div>

            {/* Search results dropdown */}
            {newMsgSearch.length >= 2 && !selectedUser && (
              <div className="rounded-xl border border-border/20 bg-card/60 backdrop-blur-sm overflow-hidden max-h-[200px] overflow-y-auto">
                {searchResults.length === 0 ? (
                  <p className="text-xs text-muted-foreground/60 text-center py-4">No users found</p>
                ) : (
                  searchResults.map((u: any) => {
                    const alreadyExists = hasExistingConvo(u.id);
                    return (
                      <button
                        key={u.id}
                        onClick={() => {
                          if (!alreadyExists) {
                            setSelectedUser(u);
                            setNewMsgSearch(u.display_name || u.username || "");
                          }
                        }}
                        disabled={alreadyExists}
                        className={cn(
                          "w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors text-left cursor-pointer border-b border-border/10 last:border-0",
                          alreadyExists && "opacity-50 cursor-not-allowed"
                        )}
                      >
                        <Avatar className="w-9 h-9 shrink-0">
                          <AvatarFallback
                            className="text-primary-foreground font-semibold text-xs"
                            style={{ backgroundColor: u.avatar_url || "hsl(263 84% 58%)" }}
                          >
                            {(u.display_name || u.username)?.[0]?.toUpperCase() || "?"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{u.display_name || "User"}</p>
                          {u.username && <p className="text-xs text-muted-foreground/60">@{u.username}</p>}
                        </div>
                        {alreadyExists && (
                          <span className="text-[10px] text-muted-foreground/60">Already connected</span>
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            )}

            {/* Selected user indicator */}
            {selectedUser && (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/5 border border-primary/10">
                <Avatar className="w-9 h-9 shrink-0">
                  <AvatarFallback
                    className="text-primary-foreground font-semibold text-xs"
                    style={{ backgroundColor: selectedUser.avatar_url || "hsl(263 84% 58%)" }}
                  >
                    {(selectedUser.display_name || selectedUser.username)?.[0]?.toUpperCase() || "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{selectedUser.display_name || "User"}</p>
                  {selectedUser.username && <p className="text-xs text-muted-foreground/60">@{selectedUser.username}</p>}
                </div>
                <button
                  onClick={() => { setSelectedUser(null); setNewMsgSearch(""); }}
                  className="p-1 rounded-full hover:bg-muted/30 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            )}

            {/* Intro message */}
            {selectedUser && (
              <textarea
                value={newMsgIntro}
                onChange={(e) => setNewMsgIntro(e.target.value)}
                placeholder="Add an intro message (optional)..."
                rows={3}
                className="w-full rounded-xl bg-muted/30 backdrop-blur-sm border border-border/20 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all resize-none"
              />
            )}

            {/* Send button */}
            <button
              onClick={() => sendRequestMutation.mutate()}
              disabled={!selectedUser || sendRequestMutation.isPending}
              className={cn(
                "w-full py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer",
                selectedUser
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-muted/30 text-muted-foreground/40 cursor-not-allowed"
              )}
            >
              {sendRequestMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mx-auto" />
              ) : (
                "Send Message Request"
              )}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

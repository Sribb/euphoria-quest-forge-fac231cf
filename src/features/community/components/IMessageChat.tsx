import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Search, Send, ArrowLeft, Plus, Smile, Paperclip, Loader2, MessageSquare,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { formatDistanceToNow, format, isToday, isYesterday } from "date-fns";
import { useIsMobile } from "@/hooks/use-mobile";

export const IMessageChat = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [dmMessage, setDmMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ── Data fetching (unchanged logic) ──
  const { data: dmConversations } = useQuery({
    queryKey: ["dm-conversations", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("direct_messages")
        .select("*")
        .or(`sender_id.eq.${user?.id},receiver_id.eq.${user?.id}`)
        .order("created_at", { ascending: false });
      if (error) throw error;

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

  // Realtime
  useEffect(() => {
    if (!user?.id) return;
    const ch = supabase
      .channel("dm-realtime-imessage")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "direct_messages" }, () => {
        queryClient.invalidateQueries({ queryKey: ["dm-messages"] });
        queryClient.invalidateQueries({ queryKey: ["dm-conversations"] });
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [user?.id, queryClient]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeMessages]);

  const activePartner = dmConversations?.find((c) => c.partnerId === activeConversation);

  const filteredConvos = dmConversations?.filter((c) =>
    c.partnerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatMessageTime = (dateStr: string) => {
    const d = new Date(dateStr);
    if (isToday(d)) return format(d, "h:mm a");
    if (isYesterday(d)) return "Yesterday";
    return format(d, "MMM d");
  };

  // Group messages by time gaps for timestamp separators
  const groupedMessages = activeMessages?.reduce((acc: any[], msg: any, i: number) => {
    if (i === 0 || new Date(msg.created_at).getTime() - new Date(activeMessages[i - 1].created_at).getTime() > 1800000) {
      acc.push({ type: "timestamp", time: msg.created_at });
    }
    acc.push({ type: "message", ...msg });
    return acc;
  }, []) ?? [];

  const showThread = !isMobile || activeConversation;
  const showList = !isMobile || !activeConversation;

  return (
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
                <button className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors cursor-pointer">
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
            </div>

            {/* Conversations */}
            <ScrollArea className="flex-1">
              <div className="px-2 pb-2">
                {!filteredConvos || filteredConvos.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-muted/40 flex items-center justify-center">
                      <MessageSquare className="w-7 h-7 text-muted-foreground/40" />
                    </div>
                    <p className="text-sm font-medium text-muted-foreground/60">No messages yet</p>
                    <p className="text-xs text-muted-foreground/40 mt-1">Start a conversation from a profile</p>
                  </div>
                ) : (
                  filteredConvos.map((convo) => {
                    const isActive = activeConversation === convo.partnerId;
                    return (
                      <button
                        key={convo.partnerId}
                        onClick={() => setActiveConversation(convo.partnerId)}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all duration-150 cursor-pointer mb-0.5",
                          isActive
                            ? "bg-primary/10"
                            : "hover:bg-muted/30"
                        )}
                      >
                        <Avatar className="w-11 h-11 shrink-0">
                          <AvatarFallback
                            className="text-white font-semibold text-sm"
                            style={{ backgroundColor: convo.partnerAvatar || "#9b87f5" }}
                          >
                            {convo.partnerName?.[0]?.toUpperCase() || "?"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className={cn(
                              "text-sm truncate",
                              convo.unread ? "font-semibold text-foreground" : "font-medium text-foreground/80"
                            )}>
                              {convo.partnerName}
                            </span>
                            <span className="text-[11px] text-muted-foreground/60 shrink-0">
                              {formatMessageTime(convo.lastMessageAt)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <p className={cn(
                              "text-xs truncate flex-1",
                              convo.unread ? "text-foreground/70 font-medium" : "text-muted-foreground/60"
                            )}>
                              {convo.lastMessage}
                            </p>
                            {convo.unread && (
                              <div className="w-2.5 h-2.5 rounded-full bg-primary shrink-0" />
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })
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
            key={`thread-${activeConversation || "empty"}`}
            initial={isMobile ? { x: 20, opacity: 0 } : { opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={isMobile ? { x: 20, opacity: 0 } : { opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex-1 flex flex-col min-w-0"
          >
            {activeConversation ? (
              <>
                {/* Thread header */}
                <div className="flex items-center gap-3 px-5 py-3.5 border-b border-border/20 bg-card/40 backdrop-blur-xl">
                  {isMobile && (
                    <button
                      onClick={() => setActiveConversation(null)}
                      className="p-1 -ml-1 rounded-lg hover:bg-muted/30 transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-5 h-5 text-primary" />
                    </button>
                  )}
                  <Avatar className="w-9 h-9">
                    <AvatarFallback
                      className="text-white font-semibold text-sm"
                      style={{ backgroundColor: activePartner?.partnerAvatar || "#9b87f5" }}
                    >
                      {activePartner?.partnerName?.[0]?.toUpperCase() || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold text-foreground leading-tight">
                      {activePartner?.partnerName || "User"}
                    </p>
                    <p className="text-[11px] text-muted-foreground/60">Active now</p>
                  </div>
                </div>

                {/* Messages area */}
                <ScrollArea className="flex-1 px-4">
                  <div className="py-4 space-y-1 max-w-2xl mx-auto">
                    {groupedMessages.map((item: any, i: number) => {
                      if (item.type === "timestamp") {
                        const d = new Date(item.time);
                        const label = isToday(d) ? format(d, "h:mm a") : isYesterday(d) ? `Yesterday ${format(d, "h:mm a")}` : format(d, "MMM d, h:mm a");
                        return (
                          <div key={`ts-${i}`} className="flex justify-center py-3">
                            <span className="text-[11px] text-muted-foreground/50 font-medium px-3 py-1 rounded-full bg-muted/20 backdrop-blur-sm">
                              {label}
                            </span>
                          </div>
                        );
                      }

                      const isMine = item.sender_id === user?.id;
                      const isLast = i === groupedMessages.length - 1;

                      return (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 6, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ duration: 0.15 }}
                          className={cn("flex mb-0.5", isMine ? "justify-end" : "justify-start")}
                        >
                          <div
                            className={cn(
                              "max-w-[75%] px-4 py-2.5 text-[14px] leading-relaxed",
                              isMine
                                ? "bg-primary text-primary-foreground rounded-[20px] rounded-br-[6px]"
                                : "bg-muted/40 backdrop-blur-sm text-foreground rounded-[20px] rounded-bl-[6px] border border-border/10"
                            )}
                          >
                            {item.content}
                          </div>
                        </motion.div>
                      );
                    })}

                    {/* Read receipt for last sent message */}
                    {activeMessages && activeMessages.length > 0 && activeMessages[activeMessages.length - 1].sender_id === user?.id && (
                      <div className="flex justify-end pr-1">
                        <span className="text-[10px] text-muted-foreground/40 font-medium">Delivered</span>
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
                        onChange={(e) => setDmMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            sendDmMutation.mutate();
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
                      onClick={() => sendDmMutation.mutate()}
                      disabled={!dmMessage.trim() || sendDmMutation.isPending}
                      className={cn(
                        "w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 shrink-0 mb-0.5 cursor-pointer",
                        dmMessage.trim()
                          ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:shadow-lg scale-100"
                          : "bg-muted/30 text-muted-foreground/30 cursor-not-allowed"
                      )}
                    >
                      {sendDmMutation.isPending ? (
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
                    Select a conversation or start a new one from a user's profile
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

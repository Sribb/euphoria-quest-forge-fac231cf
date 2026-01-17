import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Brain, Send, Loader2, Sparkles, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import euphoriaLogo from "@/assets/euphoria-logo-button.png";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const presetQuestions = [
  "How am I doing?",
  "What should I learn next?",
  "Analyze my portfolio",
];

export const GlobalAIAssistant = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const streamChat = async (userMessage: string) => {
    if (!user) return;

    const userMsg: Message = { role: "user", content: userMessage };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    let assistantContent = "";
    const upsertAssistant = (chunk: string) => {
      assistantContent += chunk;
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantContent } : m));
        }
        return [...prev, { role: "assistant", content: assistantContent }];
      });
    };

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Please log in to use AI chat");
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analytics-chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ messages: [...messages, userMsg] }),
        }
      );

      if (response.status === 429) {
        toast.error("Rate limit exceeded. Please try again in a moment.");
        setMessages(prev => prev.slice(0, -1));
        return;
      }

      if (response.status === 402) {
        toast.error("AI credits depleted. Please add credits to continue.");
        setMessages(prev => prev.slice(0, -1));
        return;
      }

      if (!response.ok || !response.body) {
        throw new Error("Failed to start stream");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let streamDone = false;

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") {
            streamDone = true;
            break;
          }

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) upsertAssistant(content);
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      if (textBuffer.trim()) {
        for (let raw of textBuffer.split("\n")) {
          if (!raw || raw.startsWith(":") || raw.trim() === "") continue;
          if (!raw.startsWith("data: ")) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === "[DONE]") continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) upsertAssistant(content);
          } catch { /* ignore */ }
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      toast.error("Failed to get AI response");
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const message = input.trim();
    setInput("");
    await streamChat(message);
  };

  const handlePresetQuestion = (question: string) => {
    streamChat(question);
  };

  return (
    <>
      {/* Floating Logo Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="fixed bottom-24 right-4 z-[100] w-14 h-14 rounded-full bg-card border-2 border-primary/30 shadow-glow flex items-center justify-center overflow-hidden hover:border-primary/60 transition-colors duration-300"
        whileTap={{ scale: 0.85 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
      >
        <motion.img 
          src={euphoriaLogo} 
          alt="Euphoria AI" 
          className="w-10 h-10 object-contain"
          animate={{ rotate: isHovered ? 360 : 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-44 right-4 z-[100] w-[360px] max-w-[calc(100vw-2rem)]"
          >
            <Card className="border-primary/20 shadow-glow overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-4 bg-gradient-primary">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Euphoria AI</h3>
                    <p className="text-xs text-white/80">Your personal guide</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white/20 w-8 h-8"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Chat Content */}
              <div className="p-4">
                {messages.length === 0 ? (
                  <div className="space-y-4">
                    <div className="p-6 text-center border-2 border-dashed border-primary/20 rounded-lg bg-gradient-primary/5">
                      <Brain className="w-10 h-10 mx-auto mb-3 text-primary animate-pulse" />
                      <p className="text-sm text-muted-foreground mb-4">
                        Ask me anything about your progress!
                      </p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {presetQuestions.map((question, idx) => (
                          <Button
                            key={idx}
                            variant="outline"
                            size="sm"
                            onClick={() => handlePresetQuestion(question)}
                            disabled={isLoading}
                            className="text-xs hover-scale bg-gradient-primary/10 border-primary/30"
                          >
                            <Sparkles className="w-3 h-3 mr-1 text-primary" />
                            {question}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <ScrollArea className="h-[300px] pr-2" ref={scrollRef}>
                    <div className="space-y-3">
                      {messages.map((msg, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[85%] p-3 rounded-lg text-sm ${
                              msg.role === "user"
                                ? "bg-gradient-primary text-white shadow-glow"
                                : "bg-muted/80 border border-border"
                            }`}
                          >
                            <div className="whitespace-pre-wrap break-words">
                              {msg.content.split('\n').map((line, i) => (
                                <p key={i} className="mb-1 last:mb-0">{line}</p>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </ScrollArea>
                )}

                {/* Input */}
                <div className="flex gap-2 mt-4">
                  <Input
                    placeholder="Ask anything..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSend()}
                    disabled={isLoading}
                    className="flex-1 bg-background/50 border-primary/20 text-sm"
                  />
                  <Button
                    onClick={handleSend}
                    disabled={isLoading || !input.trim()}
                    size="icon"
                    className="bg-gradient-primary shrink-0 hover-scale shadow-glow"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                    ) : (
                      <Send className="w-4 h-4 text-white" />
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Loader2, X, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { usePaperTrading } from "@/hooks/usePaperTrading";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const PRESETS = [
  "What is a P/E ratio?",
  "How do ETFs work?",
  "Summarize my portfolio",
];

export const AskPluto = () => {
  const { user } = useAuth();
  const { data: tradingData } = usePaperTrading();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const buildContext = () => {
    const holdingsValue = Object.entries(tradingData.paper_holdings).reduce((sum, [, h]) => sum + h.shares * h.avgCost, 0);
    const totalValue = tradingData.paper_cash + holdingsValue;
    const unrealizedPnL = totalValue - 10000;
    const holdings = Object.entries(tradingData.paper_holdings)
      .map(([sym, h]) => `${sym}: ${h.shares} shares @ $${h.avgCost.toFixed(2)} avg`)
      .join(", ");
    return `User portfolio: Total value $${totalValue.toFixed(2)}, Cash $${tradingData.paper_cash.toFixed(2)}, Unrealized P&L $${unrealizedPnL.toFixed(2)}, Total trades: ${tradingData.paper_trades.length}. Holdings: ${holdings || "None"}.`;
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || !user || isLoading) return;
    const userMsg: Message = { role: "user", content: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const allMessages = [...messages, userMsg];
      const response = await supabase.functions.invoke("ask-pluto", {
        body: { messages: allMessages, context: buildContext() },
      });

      if (response.error) throw response.error;
      const content = response.data?.content || response.data?.message || "I couldn't process that. Try again!";
      setMessages((prev) => [...prev, { role: "assistant", content }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Something went wrong. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating trigger with purple glow */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:scale-105 transition-transform"
            style={{
              boxShadow: "0 0 24px 6px hsl(263 84% 58% / 0.35), 0 4px 16px hsl(263 84% 58% / 0.2)",
            }}
          >
            <MessageCircle className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] max-h-[520px] flex flex-col"
          >
            <Card className="flex flex-col h-[520px] border border-border/50 bg-card/95 backdrop-blur-xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-border/40 bg-primary/5">
                <div>
                  <h3 className="text-sm font-bold text-foreground">Ask Pluto</h3>
                  <p className="text-[10px] text-muted-foreground">Financial literacy assistant</p>
                </div>
                <button onClick={() => setIsOpen(false)} className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-muted/60 transition-colors">
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 px-4 py-3" ref={scrollRef}>
                {messages.length === 0 && (
                  <div className="space-y-3 mt-4">
                    <p className="text-xs text-muted-foreground text-center">
                      Hi! I'm Pluto 🪐 — I help you learn about markets and understand your data. I'm not a financial advisor.
                    </p>
                    <div className="flex flex-wrap gap-1.5 justify-center">
                      {PRESETS.map((p) => (
                        <button
                          key={p}
                          onClick={() => sendMessage(p)}
                          className="text-[11px] px-3 py-1.5 rounded-full border border-border/50 bg-muted/30 text-foreground hover:bg-muted/60 transition-colors"
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={`mb-3 max-w-[85%] ${m.role === "user" ? "ml-auto" : "mr-auto"}`}
                  >
                    <div
                      className={`rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                        m.role === "user"
                          ? "bg-primary text-primary-foreground rounded-br-md"
                          : "bg-muted/60 text-foreground rounded-bl-md"
                      }`}
                    >
                      {m.role === "assistant" ? (
                        <div className="prose prose-xs prose-invert max-w-none [&_p]:m-0 [&_p]:text-xs">
                          <ReactMarkdown>{m.content}</ReactMarkdown>
                        </div>
                      ) : (
                        m.content
                      )}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Pluto is thinking...
                  </div>
                )}
              </ScrollArea>

              {/* Input */}
              <div className="px-4 py-3 border-t border-border/40">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    sendMessage(input);
                  }}
                  className="flex gap-2"
                >
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about markets, concepts..."
                    className="flex-1 text-xs bg-muted/30 border-border/40"
                    disabled={isLoading}
                  />
                  <Button
                    type="submit"
                    size="icon"
                    disabled={!input.trim() || isLoading}
                    className="w-8 h-8 bg-primary hover:bg-primary/90"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </Button>
                </form>
                <p className="text-[9px] text-muted-foreground text-center mt-1.5">
                  Pluto doesn't offer financial advice. Consult a licensed advisor.
                </p>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

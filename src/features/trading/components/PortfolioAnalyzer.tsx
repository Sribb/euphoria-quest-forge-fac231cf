import { useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PieChart, Plus, Trash2, Sparkles, AlertTriangle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";

interface Holding {
  id: string;
  ticker: string;
  allocation: string;
}

const ANALYZE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-portfolio`;

export const PortfolioAnalyzer = () => {
  const [holdings, setHoldings] = useState<Holding[]>([
    { id: crypto.randomUUID(), ticker: "", allocation: "" },
  ]);
  const [analysis, setAnalysis] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const addHolding = () => {
    if (holdings.length >= 25) return;
    setHoldings((prev) => [...prev, { id: crypto.randomUUID(), ticker: "", allocation: "" }]);
  };

  const removeHolding = (id: string) => {
    if (holdings.length <= 1) return;
    setHoldings((prev) => prev.filter((h) => h.id !== id));
  };

  const updateHolding = (id: string, field: "ticker" | "allocation", value: string) => {
    setHoldings((prev) =>
      prev.map((h) =>
        h.id === id
          ? {
              ...h,
              [field]:
                field === "ticker"
                  ? value.toUpperCase().replace(/[^A-Z0-9.]/g, "").slice(0, 10)
                  : value.replace(/[^0-9.]/g, "").slice(0, 6),
            }
          : h
      )
    );
  };

  const totalAllocation = holdings.reduce((s, h) => s + (parseFloat(h.allocation) || 0), 0);

  const analyze = useCallback(async () => {
    const valid = holdings.filter((h) => h.ticker && parseFloat(h.allocation) > 0);
    if (valid.length === 0) {
      toast.error("Add at least one holding with a ticker and allocation %.");
      return;
    }

    setIsAnalyzing(true);
    setAnalysis("");

    try {
      const resp = await fetch(ANALYZE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          holdings: valid.map((h) => ({ ticker: h.ticker, allocation: parseFloat(h.allocation) })),
        }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: "Analysis failed" }));
        toast.error(err.error || "Analysis failed. Please try again.");
        setIsAnalyzing(false);
        return;
      }

      if (!resp.body) throw new Error("No response stream");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              fullText += content;
              setAnalysis(fullText);
            }
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to analyze portfolio. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  }, [holdings]);

  return (
    <div className="space-y-6">
      {/* Input Card */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-2">
          <PieChart className="w-5 h-5 text-primary" />
          <h3 className="text-xl font-bold">Portfolio Analyzer</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-6">
          Enter your holdings below and let AI analyze your portfolio diversification.
        </p>

        {/* Holdings List */}
        <div className="space-y-3 mb-4">
          <div className="grid grid-cols-[1fr_100px_40px] gap-3 text-xs font-medium text-muted-foreground px-1">
            <span>Ticker / Symbol</span>
            <span>Allocation %</span>
            <span />
          </div>

          <AnimatePresence initial={false}>
            {holdings.map((h, i) => (
              <motion.div
                key={h.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="grid grid-cols-[1fr_100px_40px] gap-3 items-center"
              >
                <Input
                  placeholder="e.g. AAPL"
                  value={h.ticker}
                  onChange={(e) => updateHolding(h.id, "ticker", e.target.value)}
                  className="font-mono"
                  maxLength={10}
                />
                <Input
                  placeholder="%"
                  value={h.allocation}
                  onChange={(e) => updateHolding(h.id, "allocation", e.target.value)}
                  className="text-right"
                  maxLength={6}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeHolding(h.id)}
                  disabled={holdings.length <= 1}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Total & Add */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="outline" size="sm" onClick={addHolding} disabled={holdings.length >= 25}>
            <Plus className="w-4 h-4 mr-1" /> Add Holding
          </Button>
          <Badge
            variant="outline"
            className={
              Math.abs(totalAllocation - 100) < 0.01
                ? "bg-success/10 text-success border-success/30"
                : "bg-warning/10 text-warning border-warning/30"
            }
          >
            Total: {totalAllocation.toFixed(1)}%
          </Badge>
        </div>

        {/* Analyze Button */}
        <Button
          className="w-full gap-2"
          size="lg"
          onClick={analyze}
          disabled={isAnalyzing || holdings.every((h) => !h.ticker)}
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Analyzing…
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" /> Analyze My Portfolio
            </>
          )}
        </Button>
      </Card>

      {/* Analysis Result */}
      <AnimatePresence>
        {analysis && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-bold">AI Analysis</h3>
              </div>

              <div className="prose prose-sm prose-invert max-w-none [&_h1]:text-lg [&_h2]:text-base [&_h3]:text-sm [&_p]:text-muted-foreground [&_li]:text-muted-foreground [&_strong]:text-foreground">
                <ReactMarkdown>{analysis}</ReactMarkdown>
              </div>

              {/* Disclaimer */}
              <div className="mt-6 flex items-start gap-2 p-3 rounded-lg bg-warning/5 border border-warning/20">
                <AlertTriangle className="w-4 h-4 text-warning mt-0.5 shrink-0" />
                <p className="text-xs text-warning/80">
                  <strong className="text-warning">Educational Only.</strong> This analysis is for
                  learning purposes and does NOT constitute financial advice. Always consult a
                  qualified financial advisor before making investment decisions.
                </p>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

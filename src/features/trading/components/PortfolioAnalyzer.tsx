import { useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PieChart, Plus, Trash2, Sparkles, Loader2, DollarSign, Hash } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { TickerAutocomplete } from "./TickerAutocomplete";
import { AnalysisResults } from "./AnalysisResults";

interface Holding {
  id: string;
  ticker: string;
  name: string;
  inputMode: "shares" | "dollars";
  value: string; // shares count or dollar amount
}

const ANALYZE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-portfolio`;

export const PortfolioAnalyzer = () => {
  const [holdings, setHoldings] = useState<Holding[]>([
    { id: crypto.randomUUID(), ticker: "", name: "", inputMode: "dollars", value: "" },
  ]);
  const [analysis, setAnalysis] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const addHolding = () => {
    if (holdings.length >= 25) return;
    setHoldings((prev) => [
      ...prev,
      { id: crypto.randomUUID(), ticker: "", name: "", inputMode: "dollars", value: "" },
    ]);
  };

  const removeHolding = (id: string) => {
    if (holdings.length <= 1) return;
    setHoldings((prev) => prev.filter((h) => h.id !== id));
  };

  const updateTicker = (id: string, symbol: string, name: string) => {
    setHoldings((prev) => prev.map((h) => (h.id === id ? { ...h, ticker: symbol, name } : h)));
  };

  const updateValue = (id: string, val: string) => {
    const sanitized = val.replace(/[^0-9.]/g, "").slice(0, 12);
    setHoldings((prev) => prev.map((h) => (h.id === id ? { ...h, value: sanitized } : h)));
  };

  const toggleMode = (id: string) => {
    setHoldings((prev) =>
      prev.map((h) =>
        h.id === id ? { ...h, inputMode: h.inputMode === "shares" ? "dollars" : "shares", value: "" } : h
      )
    );
  };

  // Calculate allocation percentages from dollar amounts / share values
  const totalValue = holdings.reduce((s, h) => s + (parseFloat(h.value) || 0), 0);

  const getAllocation = (h: Holding) => {
    const v = parseFloat(h.value) || 0;
    if (totalValue === 0) return 0;
    return (v / totalValue) * 100;
  };

  const analyze = useCallback(async () => {
    const valid = holdings.filter((h) => h.ticker && parseFloat(h.value) > 0);
    if (valid.length === 0) {
      toast.error("Add at least one holding with a ticker and amount.");
      return;
    }

    setIsAnalyzing(true);
    setAnalysis("");

    try {
      const holdingsData = valid.map((h) => ({
        ticker: h.ticker,
        name: h.name,
        allocation: getAllocation(h),
        inputMode: h.inputMode,
        rawValue: parseFloat(h.value),
      }));

      const resp = await fetch(ANALYZE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ holdings: holdingsData }),
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
  }, [holdings, totalValue]);

  return (
    <div className="space-y-6">
      {/* Input Card */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-2">
          <PieChart className="w-5 h-5 text-primary" />
          <h3 className="text-xl font-bold">Portfolio Analyzer</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-6">
          Enter your holdings and let AI evaluate your diversification. Enter dollar amounts or share quantities.
        </p>

        {/* Holdings List */}
        <div className="space-y-3 mb-4">
          <div className="grid grid-cols-[1fr_44px_120px_40px] gap-2 text-xs font-medium text-muted-foreground px-1">
            <span>Ticker / Symbol</span>
            <span />
            <span className="text-right">Amount</span>
            <span />
          </div>

          <AnimatePresence initial={false}>
            {holdings.map((h) => (
              <motion.div
                key={h.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="grid grid-cols-[1fr_44px_120px_40px] gap-2 items-center"
              >
                <TickerAutocomplete
                  value={h.ticker}
                  onChange={(symbol, name) => updateTicker(h.id, symbol, name)}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleMode(h.id)}
                  className="text-muted-foreground hover:text-foreground h-10 w-10"
                  title={h.inputMode === "dollars" ? "Switch to shares" : "Switch to dollars"}
                >
                  {h.inputMode === "dollars" ? (
                    <DollarSign className="w-4 h-4" />
                  ) : (
                    <Hash className="w-4 h-4" />
                  )}
                </Button>
                <Input
                  placeholder={h.inputMode === "dollars" ? "$0.00" : "Shares"}
                  value={h.value}
                  onChange={(e) => updateValue(h.id, e.target.value)}
                  className="text-right text-sm"
                  maxLength={12}
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

        {/* Allocation preview badges */}
        {totalValue > 0 && (
          <div className="flex flex-wrap gap-2 mb-4 px-1">
            {holdings
              .filter((h) => h.ticker && parseFloat(h.value) > 0)
              .map((h) => (
                <Badge key={h.id} variant="outline" className="text-xs bg-muted/50">
                  {h.ticker}: {getAllocation(h).toFixed(1)}%
                </Badge>
              ))}
          </div>
        )}

        {/* Add + Analyze */}
        <div className="flex items-center justify-between mb-4">
          <Button variant="outline" size="sm" onClick={addHolding} disabled={holdings.length >= 25}>
            <Plus className="w-4 h-4 mr-1" /> Add Holding
          </Button>
        </div>

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
            <AnalysisResults analysis={analysis} isStreaming={isAnalyzing} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

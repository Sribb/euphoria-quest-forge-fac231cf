import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Shield, TrendingUp, PieChart, Target, Lightbulb } from "lucide-react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";

interface AnalysisResultsProps {
  analysis: string;
  isStreaming: boolean;
}

const sectionConfig: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  "sector": { icon: PieChart, color: "text-primary", bg: "bg-primary/10" },
  "risk": { icon: Shield, color: "text-warning", bg: "bg-warning/10" },
  "diversification": { icon: Target, color: "text-success", bg: "bg-success/10" },
  "recommendation": { icon: Lightbulb, color: "text-accent-foreground", bg: "bg-accent/50" },
  "overview": { icon: TrendingUp, color: "text-primary", bg: "bg-primary/10" },
};

function getSectionStyle(title: string) {
  const lower = title.toLowerCase();
  for (const [key, val] of Object.entries(sectionConfig)) {
    if (lower.includes(key)) return val;
  }
  return sectionConfig.overview;
}

function parseIntoSections(text: string) {
  // Split by markdown h2 headers
  const parts = text.split(/^## /m).filter(Boolean);
  if (parts.length <= 1) {
    // Try h1
    const h1Parts = text.split(/^# /m).filter(Boolean);
    if (h1Parts.length <= 1) return [{ title: "", content: text }];
    return h1Parts.map((p) => {
      const nl = p.indexOf("\n");
      if (nl === -1) return { title: p.trim(), content: "" };
      return { title: p.slice(0, nl).trim(), content: p.slice(nl + 1).trim() };
    });
  }
  return parts.map((p) => {
    const nl = p.indexOf("\n");
    if (nl === -1) return { title: p.trim(), content: "" };
    return { title: p.slice(0, nl).trim(), content: p.slice(nl + 1).trim() };
  });
}

export const AnalysisResults = ({ analysis, isStreaming }: AnalysisResultsProps) => {
  const sections = parseIntoSections(analysis);
  const hasMultipleSections = sections.length > 1 || (sections.length === 1 && sections[0].title);

  return (
    <div className="space-y-4">
      {hasMultipleSections ? (
        sections.map((section, i) => {
          const style = getSectionStyle(section.title);
          const Icon = style.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <Card className="p-4 border-border/50">
                {section.title && (
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className={`w-8 h-8 rounded-lg ${style.bg} flex items-center justify-center`}>
                      <Icon className={`w-4 h-4 ${style.color}`} />
                    </div>
                    <h3 className="font-semibold text-sm">{section.title}</h3>
                  </div>
                )}
                <div className="prose prose-sm prose-invert max-w-none text-muted-foreground [&_strong]:text-foreground [&_li]:text-muted-foreground [&_p]:leading-relaxed text-[13px]">
                  <ReactMarkdown>{section.content || section.title}</ReactMarkdown>
                </div>
              </Card>
            </motion.div>
          );
        })
      ) : (
        <Card className="p-4">
          <div className="prose prose-sm prose-invert max-w-none text-muted-foreground [&_strong]:text-foreground [&_li]:text-muted-foreground text-[13px]">
            <ReactMarkdown>{analysis}</ReactMarkdown>
          </div>
        </Card>
      )}

      {isStreaming && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground px-1">
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
          Analyzing...
        </div>
      )}

      {/* Disclaimer */}
      <div className="flex items-start gap-2 p-3 rounded-lg bg-warning/5 border border-warning/20">
        <AlertTriangle className="w-4 h-4 text-warning mt-0.5 shrink-0" />
        <p className="text-xs text-warning/80">
          <strong className="text-warning">Educational Only.</strong> This analysis is for
          learning purposes and does NOT constitute financial advice. Always consult a
          qualified financial advisor before making investment decisions.
        </p>
      </div>
    </div>
  );
};

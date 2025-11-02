import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Sparkles, TrendingUp, Target, Loader2 } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface AIInsightsPanelProps {
  analysisType: "overview" | "learning" | "trading" | "behavioral";
  title: string;
  description: string;
  icon: React.ReactNode;
}

export const AIInsightsPanel = ({ analysisType, title, description, icon }: AIInsightsPanelProps) => {
  const { user } = useAuth();
  const [insights, setInsights] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [metrics, setMetrics] = useState<any>(null);

  const generateInsights = async () => {
    if (!user) return;
    
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("analytics-ai-insights", {
        body: { analysisType, filters: {} },
      });

      if (error) throw error;

      setInsights(data.insights);
      setMetrics(data.metrics);
      toast.success("AI insights generated!");
    } catch (error) {
      console.error("Error generating insights:", error);
      toast.error("Failed to generate insights");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="p-6 animate-fade-in">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
            {icon}
          </div>
          <div>
            <h3 className="text-lg font-bold">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        <Button
          onClick={generateInsights}
          disabled={isGenerating}
          className="bg-gradient-accent hover:opacity-90"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Insights
            </>
          )}
        </Button>
      </div>

      {insights && (
        <div className="mt-4 space-y-4">
          <div className="p-4 bg-gradient-hero/10 border border-primary/20 rounded-lg">
            <div className="prose prose-sm max-w-none">
              {insights.split('\n').map((line, idx) => (
                <p key={idx} className="mb-2 last:mb-0">{line}</p>
              ))}
            </div>
          </div>

          {metrics && (
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-gradient-success/10 border border-success/20 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Learning</p>
                <p className="text-lg font-bold">
                  {metrics.learning.completedLessons}/{metrics.learning.totalLessons}
                </p>
                <p className="text-xs text-muted-foreground">lessons</p>
              </div>
              <div className="p-3 bg-gradient-accent/10 border border-accent/20 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Gaming</p>
                <p className="text-lg font-bold">{metrics.gaming.avgScore.toFixed(0)}</p>
                <p className="text-xs text-muted-foreground">avg score</p>
              </div>
              <div className="p-3 bg-gradient-primary/10 border border-primary/20 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Trading</p>
                <p className="text-lg font-bold">{metrics.trading.portfolioReturn.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground">return</p>
              </div>
            </div>
          )}
        </div>
      )}

      {!insights && !isGenerating && (
        <div className="mt-4 p-8 text-center text-muted-foreground border-2 border-dashed rounded-lg">
          <Brain className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Click "Generate Insights" to get AI-powered analysis</p>
        </div>
      )}
    </Card>
  );
};

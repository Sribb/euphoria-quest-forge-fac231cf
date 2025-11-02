import { useState } from "react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { HelpCircle, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AIContextualHelpProps {
  term: string;
  lessonId: string;
  lessonTitle: string;
  children?: React.ReactNode;
}

export const AIContextualHelp = ({
  term,
  lessonId,
  lessonTitle,
  children,
}: AIContextualHelpProps) => {
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchExplanation = async () => {
    if (explanation) return; // Already loaded

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-lesson-assistant", {
        body: {
          action: "contextual_help",
          lessonId,
          userQuestion: term,
        },
      });

      if (error) throw error;
      setExplanation(data.response);
    } catch (error) {
      console.error("Contextual help error:", error);
      toast.error("Failed to load explanation");
      setExplanation("Unable to load explanation at this time.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <HoverCard openDelay={300}>
      <HoverCardTrigger asChild>
        <span
          className="inline-flex items-center gap-1 cursor-help border-b-2 border-dotted border-primary/50 hover:border-primary transition-colors"
          onMouseEnter={fetchExplanation}
        >
          {children || term}
          <HelpCircle className="w-3 h-3 text-primary" />
        </span>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 p-4" side="top">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary">
            <Sparkles className="w-4 h-4" />
            <h4 className="font-semibold text-sm">AI Explanation</h4>
          </div>
          {isLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          ) : (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {explanation || "Hover to see AI explanation"}
            </p>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
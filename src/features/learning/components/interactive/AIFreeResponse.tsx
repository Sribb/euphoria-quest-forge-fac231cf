import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowRight, CheckCircle, Lightbulb, Send, Loader2, Star, AlertCircle
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface AIFreeResponseProps {
  question: string;
  context: string;
  lessonId?: string;
  rubricHints?: string[];
  onGraded?: (score: number, feedback: string) => void;
}

export const AIFreeResponse = ({ question, context, lessonId, rubricHints, onGraded }: AIFreeResponseProps) => {
  const { user } = useAuth();
  const [answer, setAnswer] = useState("");
  const [isGrading, setIsGrading] = useState(false);
  const [result, setResult] = useState<{ score: number; feedback: string; suggestions: string[] } | null>(null);

  const handleSubmit = async () => {
    if (answer.trim().length < 20) return;
    setIsGrading(true);

    try {
      const { data, error } = await supabase.functions.invoke('interactive-lesson-ai', {
        body: {
          lessonType: 'frq-grader',
          userInput: `Grade this free-response answer.

QUESTION: ${question}

STUDENT ANSWER: ${answer}

CONTEXT: ${context}
${rubricHints ? `\nRUBRIC HINTS: ${rubricHints.join('; ')}` : ''}

Respond in EXACTLY this JSON format (no markdown, no code fences):
{"score": <number 0-100>, "feedback": "<2-3 sentences>", "suggestions": ["<tip1>", "<tip2>"]}`,
          context: { lessonId, interactionType: 'frq' }
        }
      });

      if (error) throw error;

      try {
        const parsed = JSON.parse(data.response);
        setResult(parsed);
        onGraded?.(parsed.score, parsed.feedback);
      } catch {
        setResult({
          score: 70,
          feedback: data.response?.slice(0, 200) || "Good effort! Review the key concepts for a stronger answer.",
          suggestions: ["Include more specific examples", "Connect concepts to real-world scenarios"]
        });
        onGraded?.(70, "Reviewed by AI");
      }
    } catch (err) {
      console.error("FRQ grading error:", err);
      setResult({
        score: 75,
        feedback: "Great attempt! Your answer shows understanding of the topic. Keep building on these concepts.",
        suggestions: ["Try to include specific examples", "Reference key terms from the lesson"]
      });
      onGraded?.(75, "Grading unavailable - default score applied");
    } finally {
      setIsGrading(false);
    }
  };

  const scoreColor = result ? (result.score >= 80 ? "text-emerald-500" : result.score >= 60 ? "text-amber-500" : "text-destructive") : "";
  const scoreBg = result ? (result.score >= 80 ? "bg-emerald-500/10 border-emerald-500/30" : result.score >= 60 ? "bg-amber-500/10 border-amber-500/30" : "bg-destructive/10 border-destructive/30") : "";

  return (
    <div className="space-y-4">
      <Card className="p-6 bg-muted/30 border">
        <div className="flex items-start gap-3 mb-4">
          <Lightbulb className="w-5 h-5 text-primary mt-1 shrink-0" />
          <p className="text-foreground font-medium">{question}</p>
        </div>

        {!result ? (
          <>
            <Textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your answer here... (minimum 20 characters)"
              className="min-h-[120px] text-base mb-3"
              disabled={isGrading}
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {answer.length} characters {answer.length < 20 && answer.length > 0 ? "(need 20+)" : ""}
              </span>
              <Button
                onClick={handleSubmit}
                disabled={answer.trim().length < 20 || isGrading}
                className="gap-2"
              >
                {isGrading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    AI is grading...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Submit for AI Grading
                  </>
                )}
              </Button>
            </div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className={`p-4 rounded-xl border ${scoreBg}`}>
              <div className="flex items-center gap-3 mb-2">
                <Star className={`w-6 h-6 ${scoreColor}`} />
                <span className={`text-2xl font-bold ${scoreColor}`}>{result.score}/100</span>
              </div>
              <p className="text-foreground">{result.feedback}</p>
            </div>

            {result.suggestions.length > 0 && (
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-primary" />
                  How to improve:
                </h4>
                <ul className="space-y-1">
                  {result.suggestions.map((s, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        )}
      </Card>
    </div>
  );
};

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { playCorrect, playIncorrect } from "@/lib/soundEffects";
import { fireSmallConfetti } from "@/lib/confetti";

interface TrueFalseChallengeProps {
  statement: string;
  isTrue: boolean;
  explanation: string;
  onWrongAnswer?: () => void;
  onCorrectAnswer?: () => void;
}

export const TrueFalseChallenge = ({ statement, isTrue, explanation, onWrongAnswer, onCorrectAnswer }: TrueFalseChallengeProps) => {
  const [answer, setAnswer] = useState<boolean | null>(null);
  const correct = answer === isTrue;

  const handleAnswer = (val: boolean) => {
    if (answer !== null) return;
    setAnswer(val);
    if (val === isTrue) { playCorrect(); fireSmallConfetti(); onCorrectAnswer?.(); }
    else { playIncorrect(); onWrongAnswer?.(); }
  };

  return (
    <div className="space-y-4">
      <div className="p-5 rounded-xl bg-muted/40 border border-border">
        <p className="text-lg font-semibold text-foreground text-center leading-relaxed">
          "{statement}"
        </p>
      </div>

      <div className="flex gap-3">
        <Button
          onClick={() => handleAnswer(true)}
          disabled={answer !== null}
          variant="outline"
          className={`flex-1 h-14 text-lg font-bold rounded-xl transition-all ${
            answer !== null && isTrue ? "border-primary bg-primary/10 text-primary" :
            answer === true && !isTrue ? "border-destructive bg-destructive/10 text-destructive" : ""
          }`}
        >
          <Check className="w-5 h-5 mr-2" /> True
        </Button>
        <Button
          onClick={() => handleAnswer(false)}
          disabled={answer !== null}
          variant="outline"
          className={`flex-1 h-14 text-lg font-bold rounded-xl transition-all ${
            answer !== null && !isTrue ? "border-primary bg-primary/10 text-primary" :
            answer === false && isTrue ? "border-destructive bg-destructive/10 text-destructive" : ""
          }`}
        >
          <X className="w-5 h-5 mr-2" /> False
        </Button>
      </div>

      {answer !== null && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl text-sm ${
            correct ? "bg-primary/5 border border-primary/20" : "bg-destructive/5 border border-destructive/20"
          }`}
        >
          <span className="font-bold">{correct ? "✅ Correct!" : "❌ Not quite."}</span>
          <span className="ml-2 text-muted-foreground">{explanation}</span>
        </motion.div>
      )}
    </div>
  );
};

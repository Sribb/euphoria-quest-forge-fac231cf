import { useState } from "react";
import { motion } from "framer-motion";
import { playCorrect, playIncorrect } from "@/lib/soundEffects";
import { fireSmallConfetti } from "@/lib/confetti";

interface FillInBlankProps {
  sentence: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  onWrongAnswer?: () => void;
  onCorrectAnswer?: () => void;
}

export const FillInBlank = ({ sentence, options, correctIndex, explanation, onWrongAnswer, onCorrectAnswer }: FillInBlankProps) => {
  const [selected, setSelected] = useState<number | null>(null);
  const isCorrect = selected === correctIndex;

  const handleSelect = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    if (i === correctIndex) { playCorrect(); fireSmallConfetti(); onCorrectAnswer?.(); }
    else { playIncorrect(); onWrongAnswer?.(); }
  };

  const parts = sentence.split("___");

  return (
    <div className="space-y-5">
      <div className="p-5 rounded-xl bg-muted/30 border border-border">
        <p className="text-lg text-foreground leading-relaxed text-center">
          {parts[0]}
          <span className={`inline-block min-w-[120px] mx-1 px-3 py-1 rounded-lg border-2 border-dashed font-bold text-center ${
            selected !== null
              ? isCorrect ? "border-primary bg-primary/10 text-primary" : "border-destructive bg-destructive/10 text-destructive"
              : "border-primary/40 text-primary/60"
          }`}>
            {selected !== null ? options[selected] : "?"}
          </span>
          {parts[1] || ""}
        </p>
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        {options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleSelect(i)}
            disabled={selected !== null}
            className={`px-4 py-2.5 rounded-xl border-2 font-medium text-sm transition-all ${
              selected === null
                ? "border-border bg-background hover:border-primary hover:bg-primary/5 text-foreground"
                : i === correctIndex
                  ? "border-primary bg-primary/10 text-primary"
                  : i === selected
                    ? "border-destructive bg-destructive/10 text-destructive line-through"
                    : "border-border opacity-40 text-muted-foreground"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>

      {selected !== null && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-3 rounded-xl text-sm ${
            isCorrect ? "bg-primary/5 border border-primary/20" : "bg-destructive/5 border border-destructive/20"
          }`}
        >
          <span className="font-bold">{isCorrect ? "Perfect!" : "The answer is: " + options[correctIndex]}</span>
          <span className="ml-2 text-muted-foreground">{explanation}</span>
        </motion.div>
      )}
    </div>
  );
};

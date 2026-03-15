
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Zap } from 'lucide-react';
import type { ChallengeQuestion } from '../types';

interface Props {
  questions: ChallengeQuestion[];
  onComplete: (score: number) => void;
}

export function ChallengeRound({ questions, onComplete }: Props) {
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [sel, setSel] = useState<number | null>(null);
  const current = questions[idx];

  const pick = (i: number) => {
    if (sel !== null) return;
    setSel(i);
    const correct = i === current.correct;
    if (correct) setScore(s => s + 1);
    setTimeout(() => {
      if (idx + 1 < questions.length) {
        setIdx(x => x + 1);
        setSel(null);
      } else {
        onComplete(score + (correct ? 1 : 0));
      }
    }, 1500);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-6 px-4 w-full max-w-lg mx-auto">
      <div className="flex items-center gap-2 text-amber-400">
        <Zap className="w-5 h-5 fill-amber-400" />
        <span className="font-black text-lg">Challenge Round</span>
      </div>
      <div className="flex gap-1.5">
        {questions.map((_, i) => (
          <div key={i} className={cn("w-8 h-1.5 rounded-full transition-all",
            i < idx ? "bg-primary" : i === idx ? "bg-primary/50" : "bg-muted")} />
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={idx} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
          className="w-full flex flex-col gap-4">
          <h2 className="text-lg font-bold text-foreground text-center">{current.question}</h2>
          <div className="flex flex-col gap-2 w-full">
            {current.options.map((o, i) => (
              <Button key={i} variant={sel === i ? (i === current.correct ? "default" : "destructive") : "outline"}
                onClick={() => pick(i)} disabled={sel !== null}
                className={cn("justify-start text-sm rounded-xl h-auto py-3 px-4",
                  sel !== null && i === current.correct && "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                )}>{o}</Button>
            ))}
          </div>
          {sel !== null && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className={cn("text-sm text-center p-3 rounded-xl",
                sel === current.correct ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
              )}>{current.explanation}</motion.p>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

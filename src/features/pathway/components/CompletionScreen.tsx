
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Trophy, Star, RotateCcw, ArrowRight } from 'lucide-react';

interface Props {
  score: number;
  total: number;
  xpEarned: number;
  lessonTitle: string;
  onContinue: () => void;
  onRetry: () => void;
}

export function CompletionScreen({ score, total, xpEarned, lessonTitle, onContinue, onRetry }: Props) {
  const passed = score >= Math.ceil(total * 0.6);
  const perfect = score === total;
  const messages = perfect
    ? ["Perfect score! You're on fire!", "Flawless! Nothing gets past you!", "Legendary performance!"]
    : passed
    ? ["Great job! Keep going!", "Nice work! You're making progress!", "Well done! Onward!"]
    : ["Keep pushing! Every attempt counts!", "Almost there! Try again!", "Don't give up! Review and retry!"];
  const msg = messages[Math.floor(Math.random() * messages.length)];

  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center gap-6 px-4 w-full max-w-md mx-auto text-center">
      <motion.div initial={{ rotate: -20, scale: 0 }} animate={{ rotate: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200 }} className="relative">
        {perfect ? (
          <div className="w-24 h-24 rounded-full bg-amber-500/20 flex items-center justify-center">
            <Star className="w-12 h-12 text-amber-400 fill-amber-400" />
          </div>
        ) : passed ? (
          <div className="w-24 h-24 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <Trophy className="w-12 h-12 text-emerald-400" />
          </div>
        ) : (
          <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
            <RotateCcw className="w-12 h-12 text-muted-foreground" />
          </div>
        )}
      </motion.div>
      <div>
        <h2 className="text-2xl font-black text-foreground">{passed ? 'Lesson Complete!' : 'Not Quite...'}</h2>
        <p className="text-muted-foreground text-sm mt-1">{lessonTitle}</p>
      </div>
      <p className="text-lg text-foreground italic">{msg}</p>
      <div className="flex gap-6 items-center">
        <div className="text-center">
          <p className="text-3xl font-black text-primary">{score}/{total}</p>
          <p className="text-xs text-muted-foreground">Score</p>
        </div>
        <div className="w-px h-10 bg-border" />
        <div className="text-center">
          <p className="text-3xl font-black text-amber-400">+{xpEarned}</p>
          <p className="text-xs text-muted-foreground">XP Earned</p>
        </div>
      </div>
      {passed ? (
        <Button onClick={onContinue} className="px-8 rounded-xl gap-2">
          Continue <ArrowRight className="w-4 h-4" />
        </Button>
      ) : (
        <div className="flex gap-3">
          <Button variant="outline" onClick={onContinue} className="rounded-xl">Skip</Button>
          <Button onClick={onRetry} className="px-8 rounded-xl gap-2">
            <RotateCcw className="w-4 h-4" /> Retry
          </Button>
        </div>
      )}
    </motion.div>
  );
}

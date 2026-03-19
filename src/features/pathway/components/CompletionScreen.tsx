
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Trophy, Star, ArrowRight } from 'lucide-react';
import { fireConfetti } from '@/lib/confetti';
import { playLessonComplete } from '@/lib/soundEffects';
import { useEffect } from 'react';

interface Props {
  xpEarned: number;
  lessonTitle: string;
  onContinue: () => void;
  onRetry: () => void;
}

export function CompletionScreen({ xpEarned, lessonTitle, onContinue, onRetry }: Props) {
  useEffect(() => {
    fireConfetti();
    playLessonComplete();
  }, []);

  const messages = [
    "Great job! Keep going!",
    "Nice work! You're making progress!",
    "Well done! Onward!",
    "Lesson complete! You're crushing it!",
  ];
  const msg = messages[Math.floor(Math.random() * messages.length)];

  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center gap-6 px-4 w-full max-w-md mx-auto text-center">
      <motion.div initial={{ rotate: -20, scale: 0 }} animate={{ rotate: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200 }} className="relative">
        <div className="w-24 h-24 rounded-full bg-emerald-500/20 flex items-center justify-center">
          <Trophy className="w-12 h-12 text-emerald-400" />
        </div>
      </motion.div>
      <div>
        <h2 className="text-2xl font-black text-foreground">Lesson Complete!</h2>
        <p className="text-muted-foreground text-sm mt-1">{lessonTitle}</p>
      </div>
      <p className="text-lg text-foreground italic">{msg}</p>
      <div className="text-center">
        <p className="text-3xl font-black text-amber-400">+{xpEarned}</p>
        <p className="text-xs text-muted-foreground">XP Earned</p>
      </div>
      <Button onClick={onContinue} className="px-8 rounded-xl gap-2">
        Continue <ArrowRight className="w-4 h-4" />
      </Button>
    </motion.div>
  );
}

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Heart, ArrowRight, RotateCcw, Trophy, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ChallengeQuestion } from '../types';
import { playCorrect, playIncorrect, playReward, playError } from '@/lib/soundEffects';
import { fireSmallConfetti } from '@/lib/confetti';
import { useHints } from '@/hooks/useHints';

interface Props {
  questions: ChallengeQuestion[];
  onPass: () => void;
  onFail: () => void;
  lessonTitle: string;
}

export function ChallengeRound({ questions, onPass, onFail, lessonTitle }: Props) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [hearts, setHearts] = useState(3);
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [phase, setPhase] = useState<'quiz' | 'passed' | 'failed'>('quiz');
  const [eliminated, setEliminated] = useState<Set<number>>(new Set());
  const { hints, useHint, getResetTimeRemaining } = useHints();

  const activeQuestions = questions.slice(0, 4);
  const current = activeQuestions[currentIdx];

  const handleSelect = (idx: number) => {
    if (submitted || eliminated.has(idx)) return;
    setSelected(idx);
  };

  const handleUseHint = async () => {
    if (submitted || !current || hints <= 0) return;
    const success = await useHint();
    if (!success) return;

    // Eliminate one wrong answer that hasn't been eliminated yet
    const wrongIndices = current.options
      .map((_, i) => i)
      .filter(i => i !== current.correct && !eliminated.has(i));

    if (wrongIndices.length > 0) {
      const toRemove = wrongIndices[Math.floor(Math.random() * wrongIndices.length)];
      setEliminated(prev => new Set([...prev, toRemove]));
      // If selected was eliminated, deselect
      if (selected === toRemove) setSelected(null);
    }
  };

  const handleSubmit = () => {
    if (selected === null || submitted) return;
    setSubmitted(true);

    const isCorrect = selected === current.correct;
    if (isCorrect) {
      playCorrect();
      fireSmallConfetti();
      setCorrectCount(c => c + 1);
    } else {
      playIncorrect();
      const newHearts = hearts - 1;
      setHearts(newHearts);
      if (newHearts <= 0) {
        setTimeout(() => {
          playError();
          setPhase('failed');
        }, 1200);
        return;
      }
    }
  };

  const handleContinue = () => {
    if (currentIdx + 1 < activeQuestions.length) {
      setCurrentIdx(i => i + 1);
      setSelected(null);
      setSubmitted(false);
      setEliminated(new Set());
    } else {
      playReward();
      setPhase('passed');
    }
  };

  const handleRetry = () => {
    setCurrentIdx(0);
    setHearts(3);
    setSelected(null);
    setSubmitted(false);
    setCorrectCount(0);
    setPhase('quiz');
    setEliminated(new Set());
  };

  if (phase === 'passed') {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-6 px-4 w-full max-w-md mx-auto text-center py-12">
        <motion.div initial={{ rotate: -20, scale: 0 }} animate={{ rotate: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}>
          <div className="w-24 h-24 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <Trophy className="w-12 h-12 text-emerald-400" />
          </div>
        </motion.div>
        <h2 className="text-2xl font-black text-foreground">Mastery Achieved!</h2>
        <p className="text-muted-foreground">You passed the challenge with {hearts} heart{hearts !== 1 ? 's' : ''} remaining.</p>
        <div className="flex gap-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <Heart key={i} className={cn("w-6 h-6", i < hearts ? "text-red-500 fill-red-500" : "text-muted-foreground/30")} />
          ))}
        </div>
        <Button onClick={onPass} className="px-8 rounded-xl gap-2">
          Continue <ArrowRight className="w-4 h-4" />
        </Button>
      </motion.div>
    );
  }

  if (phase === 'failed') {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-6 px-4 w-full max-w-md mx-auto text-center py-12">
        <div className="w-24 h-24 rounded-full bg-red-500/20 flex items-center justify-center">
          <Heart className="w-12 h-12 text-red-400" />
        </div>
        <h2 className="text-2xl font-black text-foreground">Out of Hearts</h2>
        <p className="text-muted-foreground">Don't worry — you only need to redo the challenge questions, not the whole lesson.</p>
        <div className="flex gap-3">
          <Button onClick={handleRetry} className="px-6 rounded-xl gap-2">
            <RotateCcw className="w-4 h-4" /> Try Again
          </Button>
          <Button variant="ghost" onClick={onFail} className="px-6 rounded-xl text-muted-foreground">
            Exit
          </Button>
        </div>
      </motion.div>
    );
  }

  if (!current) return null;

  const resetTime = getResetTimeRemaining();

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-5 px-6 w-full min-h-[70vh]" style={{ maxWidth: '800px', margin: '0 auto' }}>
      
      {/* Header with hearts and hints */}
      <div className="flex items-center justify-between w-full" style={{ maxWidth: '680px' }}>
        <div>
          <span className="text-xs font-bold text-primary uppercase tracking-widest">✦ MASTERY CHALLENGE</span>
          <p className="text-xs text-muted-foreground mt-0.5">{lessonTitle}</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Hint button */}
          <button
            onClick={handleUseHint}
            disabled={submitted || hints <= 0}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all",
              hints > 0 && !submitted
                ? "bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 cursor-pointer"
                : "bg-muted/20 text-muted-foreground/40 cursor-not-allowed"
            )}
            title={resetTime ? `Free hints reset in ${resetTime}` : 'Use a hint to eliminate a wrong answer'}
          >
            <Lightbulb className="w-4 h-4" />
            {hints}
          </button>
          {/* Hearts */}
          <div className="flex items-center gap-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <motion.div key={i} animate={i >= hearts ? { scale: [1, 0.5, 0], opacity: [1, 0.5, 0] } : {}}>
                <Heart className={cn("w-6 h-6 transition-all", i < hearts ? "text-red-500 fill-red-500" : "text-muted-foreground/20")} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Progress dots */}
      <div className="flex gap-2">
        {activeQuestions.map((_, i) => (
          <div key={i} className={cn(
            "w-3 h-3 rounded-full transition-all",
            i < currentIdx ? "bg-emerald-500" : i === currentIdx ? "bg-primary ring-2 ring-primary/30" : "bg-muted"
          )} />
        ))}
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div key={currentIdx} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
          className="w-full flex flex-col items-center gap-5" style={{ maxWidth: '680px' }}>
          
          <h2 className="text-lg lg:text-xl font-bold text-foreground text-center leading-snug">
            {current.question}
          </h2>

          <div className="flex flex-col gap-3 w-full">
            {current.options.map((option, i) => (
              <motion.div key={i}
                animate={eliminated.has(i) ? { opacity: 0.3, scale: 0.95, x: -8 } : { opacity: 1, scale: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Button
                  variant={submitted && i === selected
                    ? (i === current.correct ? "default" : "destructive")
                    : selected === i ? "default" : "outline"
                  }
                  onClick={() => handleSelect(i)}
                  disabled={submitted || eliminated.has(i)}
                  className={cn(
                    "justify-start text-left rounded-xl h-auto whitespace-normal leading-relaxed text-[16px] py-4 px-5 w-full",
                    submitted && i === current.correct && "border-emerald-500 bg-emerald-500/10 text-emerald-400",
                    eliminated.has(i) && "line-through opacity-30"
                  )}
                >
                  {option}
                </Button>
              </motion.div>
            ))}
          </div>

          {/* Submit button */}
          {selected !== null && !submitted && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Button onClick={handleSubmit} className="px-10 rounded-xl text-base" size="lg">Submit</Button>
            </motion.div>
          )}

          {/* Feedback */}
          {submitted && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full flex flex-col items-center gap-4">
              <p className={cn("text-sm text-center p-4 rounded-xl leading-relaxed w-full",
                selected === current.correct ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
              )}>
                {current.explanation}
              </p>
              {hearts > 0 && (
                <Button onClick={handleContinue} className="px-12 rounded-xl gap-2 text-base font-bold" size="lg" style={{ width: '100%', maxWidth: '600px' }}>
                  Continue <ArrowRight className="w-4 h-4" />
                </Button>
              )}
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

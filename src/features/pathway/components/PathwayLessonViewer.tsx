
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { StepRenderer } from './StepRenderer';
import { ChallengeRound } from './ChallengeRound';
import { CompletionScreen } from './CompletionScreen';
import { loadCourseLessons } from '../courseIndex';
import { usePathwayProgress } from '../usePathwayProgress';
import type { PathwayLesson } from '../types';
import { EuphoriaSpinner } from '@/shared/components/EuphoriaSpinner';

interface Props {
  courseId: string;
  lessonNumber: number;
  onClose: () => void;
  onNextLesson?: () => void;
}

type Phase = 'steps' | 'challenge' | 'complete';

export function PathwayLessonViewer({ courseId, lessonNumber, onClose, onNextLesson }: Props) {
  const [lesson, setLesson] = useState<PathwayLesson | null>(null);
  const [phase, setPhase] = useState<Phase>('steps');
  const [stepIdx, setStepIdx] = useState(0);
  const [correctSteps, setCorrectSteps] = useState(0);
  const [challengeScore, setChallengeScore] = useState(0);
  const { completeLesson } = usePathwayProgress();

  useEffect(() => {
    loadCourseLessons(courseId).then(lessons => {
      const l = lessons.find(l => l.num === lessonNumber);
      if (l) setLesson(l);
    });
  }, [courseId, lessonNumber]);

  if (!lesson) return <div className="fixed inset-0 bg-background z-50 flex items-center justify-center"><EuphoriaSpinner size="lg" /></div>;

  const totalSteps = lesson.steps.length;
  const progress = phase === 'steps' ? (stepIdx / totalSteps) * 100 : 100;

  const handleStepComplete = (correct: boolean) => {
    if (correct) setCorrectSteps(c => c + 1);
    if (stepIdx + 1 < totalSteps) {
      setStepIdx(i => i + 1);
    } else {
      setPhase('challenge');
    }
  };

  const handleChallengeComplete = (score: number) => {
    setChallengeScore(score);
    const baseXp = lesson.xp;
    const bonus = score === lesson.challenge.length ? Math.round(baseXp * 0.5) : 0;
    const totalXp = baseXp + bonus;
    completeLesson.mutate({ courseId, lessonNumber, score, xpEarned: totalXp });
    setPhase('complete');
  };

  const handleRetry = () => {
    setPhase('steps');
    setStepIdx(0);
    setCorrectSteps(0);
    setChallengeScore(0);
  };

  const xpEarned = lesson.xp + (challengeScore === lesson.challenge.length ? Math.round(lesson.xp * 0.5) : 0);

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border/30">
        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full shrink-0">
          <X className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <div className="relative h-2 bg-muted rounded-full overflow-hidden">
            <motion.div className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-accent rounded-full"
              animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }} />
          </div>
        </div>
        <span className="text-xs text-muted-foreground font-bold shrink-0 min-w-[60px] text-right">
          {phase === 'steps' ? `${stepIdx + 1}/${totalSteps}` : phase === 'challenge' ? 'Challenge' : 'Done'}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto flex items-start justify-center py-8 px-2">
        <AnimatePresence mode="wait">
          {phase === 'steps' && (
            <motion.div key={`step-${stepIdx}`} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
              className="w-full">
              <StepRenderer step={lesson.steps[stepIdx]} onComplete={handleStepComplete} onClose={onClose} />
            </motion.div>
          )}
          {phase === 'challenge' && (
            <motion.div key="challenge" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full">
              <ChallengeRound questions={lesson.challenge} onComplete={handleChallengeComplete} />
            </motion.div>
          )}
          {phase === 'complete' && (
            <motion.div key="complete" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full">
              <CompletionScreen
                score={challengeScore}
                total={lesson.challenge.length}
                xpEarned={xpEarned}
                lessonTitle={lesson.title}
                onContinue={onNextLesson || onClose}
                onRetry={handleRetry}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

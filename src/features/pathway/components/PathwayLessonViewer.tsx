
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

/* Ambient glow orb positions alternate per step */
function getOrbPositions(stepIdx: number) {
  const isEven = stepIdx % 2 === 0;
  return {
    orb1: isEven ? { top: '5%', left: '5%' } : { top: '10%', right: '10%' },
    orb2: isEven ? { bottom: '10%', right: '8%' } : { bottom: '5%', left: '12%' },
  };
}

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

  if (!lesson) return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'radial-gradient(ellipse at 30% 20%, #1a0a2e 0%, #0d0618 40%, #07030f 100%)' }}>
      <EuphoriaSpinner size="lg" />
    </div>
  );

  const totalSteps = lesson.steps.length;
  const totalWithChallenge = totalSteps + 1; // challenge is last numbered step
  const progress = phase === 'steps' ? ((stepIdx + 1) / totalWithChallenge) * 100
    : phase === 'challenge' ? (totalSteps / totalWithChallenge) * 100
    : 100;

  const stepLabel = phase === 'steps' ? `${stepIdx + 1}/${totalWithChallenge}`
    : phase === 'challenge' ? `${totalSteps + 1}/${totalWithChallenge}`
    : 'Done';

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

  const orbPos = getOrbPositions(stepIdx);
  const isChallenge = phase === 'challenge';

  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-hidden">
      {/* ── LAYERED BACKGROUND ── */}
      {/* Base: deep purple radial gradient */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at 30% 20%, #1a0a2e 0%, #0d0618 40%, #07030f 100%)'
      }} />

      {/* Grid dot pattern at 4% opacity */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.04 }}>
        <defs>
          <pattern id="dotGrid" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="white" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dotGrid)" />
      </svg>

      {/* Ambient glow orbs — alternate position per step */}
      <div className="absolute pointer-events-none" style={{
        ...orbPos.orb1,
        width: isChallenge ? '400px' : '300px',
        height: isChallenge ? '400px' : '300px',
        borderRadius: '50%',
        background: isChallenge
          ? 'radial-gradient(circle, rgba(124, 58, 237, 0.15) 0%, transparent 70%)'
          : 'radial-gradient(circle, rgba(124, 58, 237, 0.08) 0%, transparent 70%)',
        transition: 'all 0.6s ease',
      }} />
      <div className="absolute pointer-events-none" style={{
        ...orbPos.orb2,
        width: isChallenge ? '500px' : '400px',
        height: isChallenge ? '500px' : '400px',
        borderRadius: '50%',
        background: isChallenge
          ? 'radial-gradient(circle, rgba(109, 40, 217, 0.12) 0%, transparent 70%)'
          : 'radial-gradient(circle, rgba(109, 40, 217, 0.06) 0%, transparent 70%)',
        transition: 'all 0.6s ease',
      }} />

      {/* ── FIXED NAV BAR ── */}
      <div className="relative z-20 flex items-center gap-3 px-4 h-14 shrink-0" style={{
        backdropFilter: 'blur(12px)',
        background: 'rgba(7, 3, 15, 0.7)',
        borderBottom: '1px solid rgba(139, 92, 246, 0.1)',
      }}>
        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full shrink-0 text-foreground/70 hover:text-foreground">
          <X className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <div className="relative h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <motion.div className="absolute inset-y-0 left-0 rounded-full"
              style={{ background: 'linear-gradient(90deg, hsl(var(--primary)), hsl(var(--accent)))' }}
              animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }} />
          </div>
        </div>
        <span className="text-xs text-muted-foreground font-bold shrink-0 min-w-[60px] text-right">
          {stepLabel}
        </span>
      </div>

      {/* ── CONTENT ── */}
      <div className="relative z-10 flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {phase === 'steps' && (
            <motion.div key={`step-${stepIdx}`} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
              className="w-full min-h-full">
              {/* Frosted content surface */}
              <div className="w-full min-h-[calc(100vh-56px)] px-4 sm:px-6 pt-8 pb-12" style={{
                background: 'rgba(255, 255, 255, 0.02)',
                borderLeft: '1px solid rgba(139, 92, 246, 0.08)',
                borderRight: '1px solid rgba(139, 92, 246, 0.08)',
              }}>
                <StepRenderer step={lesson.steps[stepIdx]} onComplete={handleStepComplete} onClose={onClose} />
              </div>
            </motion.div>
          )}
          {phase === 'challenge' && (
            <motion.div key="challenge" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="w-full min-h-full">
              <div className="w-full min-h-[calc(100vh-56px)] px-4 sm:px-6 pt-8 pb-12" style={{
                background: 'rgba(255, 255, 255, 0.02)',
              }}>
                <ChallengeRound questions={lesson.challenge} onComplete={handleChallengeComplete} />
              </div>
            </motion.div>
          )}
          {phase === 'complete' && (
            <motion.div key="complete" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="w-full min-h-full">
              <div className="w-full min-h-[calc(100vh-56px)] px-4 sm:px-6 pt-8 pb-12 flex items-center justify-center" style={{
                background: 'rgba(255, 255, 255, 0.02)',
              }}>
                <CompletionScreen
                  score={challengeScore}
                  total={lesson.challenge.length}
                  xpEarned={xpEarned}
                  lessonTitle={lesson.title}
                  onContinue={onNextLesson || onClose}
                  onRetry={handleRetry}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

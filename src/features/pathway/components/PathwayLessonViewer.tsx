
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { StepRenderer } from './StepRenderer';
import { CompletionScreen } from './CompletionScreen';
import { ChallengeRound } from './ChallengeRound';
import { HintProvider } from './HintContext';
import { loadCourseLessons } from '../courseIndex';
import { usePathwayProgress } from '../usePathwayProgress';
import type { PathwayLesson } from '../types';
import { EuphoriaSpinner } from '@/shared/components/EuphoriaSpinner';
import { playClick } from '@/lib/soundEffects';

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
  const hasChallenge = lesson.challenge && lesson.challenge.length >= 4;
  
  const progress = phase === 'steps'
    ? ((stepIdx + 1) / totalSteps) * (hasChallenge ? 80 : 100)
    : phase === 'challenge' ? 90 : 100;

  const stepLabel = phase === 'steps'
    ? `${stepIdx + 1}/${totalSteps}`
    : phase === 'challenge' ? 'Challenge' : 'Done';

  const handleStepComplete = (correct: boolean) => {
    if (correct) setCorrectSteps(c => c + 1);
    
    // Play click sound for step transitions
    playClick();
    
    if (stepIdx + 1 < totalSteps) {
      setStepIdx(i => i + 1);
    } else {
      // All steps done — go to challenge if available
      if (hasChallenge) {
        setPhase('challenge');
      } else {
        const xpEarned = lesson.xp;
        completeLesson.mutate({ courseId, lessonNumber, score: correctSteps + (correct ? 1 : 0), xpEarned });
        setPhase('complete');
      }
    }
  };

  const handleChallengePass = () => {
    const xpEarned = lesson.xp;
    completeLesson.mutate({ courseId, lessonNumber, score: correctSteps, xpEarned });
    setPhase('complete');
  };

  const handleChallengeFail = () => {
    // Exit the lesson — they can retry later
    onClose();
  };

  const handleRetry = () => {
    setPhase('steps');
    setStepIdx(0);
    setCorrectSteps(0);
  };

  const orbPos = getOrbPositions(stepIdx);

  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-hidden">
      {/* ── LAYERED BACKGROUND ── */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at 30% 20%, #1a0a2e 0%, #0d0618 40%, #07030f 100%)'
      }} />

      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.04 }}>
        <defs>
          <pattern id="dotGrid" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="white" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dotGrid)" />
      </svg>

      <div className="absolute pointer-events-none" style={{
        ...orbPos.orb1,
        width: '300px', height: '300px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(124, 58, 237, 0.08) 0%, transparent 70%)',
        transition: 'all 0.6s ease',
      }} />
      <div className="absolute pointer-events-none" style={{
        ...orbPos.orb2,
        width: '400px', height: '400px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(109, 40, 217, 0.06) 0%, transparent 70%)',
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
              <div className="w-full min-h-[calc(100vh-56px)] px-4 sm:px-6 pt-8 pb-12" style={{
                background: 'rgba(255, 255, 255, 0.02)',
                borderLeft: '1px solid rgba(139, 92, 246, 0.08)',
                borderRight: '1px solid rgba(139, 92, 246, 0.08)',
              }}>
                <StepRenderer step={lesson.steps[stepIdx]} onComplete={handleStepComplete} onClose={onClose} />
              </div>
            </motion.div>
          )}
          {phase === 'challenge' && lesson.challenge && (
            <motion.div key="challenge" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
              className="w-full min-h-full">
              <div className="w-full min-h-[calc(100vh-56px)] px-4 sm:px-6 pt-8 pb-12 flex items-center justify-center" style={{
                background: 'rgba(255, 255, 255, 0.02)',
              }}>
                <ChallengeRound
                  questions={lesson.challenge}
                  onPass={handleChallengePass}
                  onFail={handleChallengeFail}
                  lessonTitle={lesson.title}
                />
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
                  xpEarned={lesson.xp}
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

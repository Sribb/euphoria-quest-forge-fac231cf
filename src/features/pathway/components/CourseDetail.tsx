
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle2, Lock, Play, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { loadCourseLessons, getCourseById } from '../courseIndex';
import { usePathwayProgress } from '../usePathwayProgress';
import { PathwayLessonViewer } from './PathwayLessonViewer';
import type { PathwayLesson } from '../types';
import { EuphoriaSpinner } from '@/shared/components/EuphoriaSpinner';

interface Props {
  courseId: string;
  onBack: () => void;
}

export function CourseDetail({ courseId, onBack }: Props) {
  const [lessons, setLessons] = useState<PathwayLesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeLesson, setActiveLesson] = useState<number | null>(null);
  const { isLessonCompleted, getCompletedLessons } = usePathwayProgress();
  const course = getCourseById(courseId);

  useEffect(() => {
    setLoading(true);
    loadCourseLessons(courseId).then(l => { setLessons(l); setLoading(false); });
  }, [courseId]);

  if (activeLesson !== null) {
    const nextLesson = lessons.find(l => l.num === activeLesson + 1);
    return (
      <PathwayLessonViewer
        courseId={courseId}
        lessonNumber={activeLesson}
        onClose={() => setActiveLesson(null)}
        onNextLesson={nextLesson ? () => setActiveLesson(activeLesson + 1) : undefined}
      />
    );
  }

  if (loading) return <div className="flex items-center justify-center py-20"><EuphoriaSpinner size="lg" /></div>;

  const completed = getCompletedLessons(courseId);
  const progressPct = Math.round((completed / (course?.totalLessons || 50)) * 100);

  const isUnlocked = (num: number) => {
    if (num === 1) return true;
    return isLessonCompleted(courseId, num - 1);
  };

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border/30 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full"><ArrowLeft className="w-5 h-5" /></Button>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-black text-foreground truncate">{course?.title}</h1>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${progressPct}%` }} />
              </div>
              <span className="text-xs font-bold text-muted-foreground">{completed}/50</span>
            </div>
          </div>
        </div>
      </div>

      {/* Lesson List */}
      <div className="max-w-2xl mx-auto px-4 py-6 flex flex-col gap-2">
        {lessons.map((lesson, idx) => {
          const done = isLessonCompleted(courseId, lesson.num);
          const unlocked = isUnlocked(lesson.num);
          const isNext = unlocked && !done;
          const isMilestone = lesson.num % 10 === 0;

          return (
            <motion.div key={lesson.num}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.02 }}
              onClick={() => unlocked && setActiveLesson(lesson.num)}
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all",
                done ? "bg-emerald-500/5 border-emerald-500/20" :
                isNext ? "bg-primary/5 border-primary/30 ring-1 ring-primary/20" :
                unlocked ? "bg-card border-border hover:border-primary/40" :
                "bg-card/50 border-border/30 opacity-50 cursor-not-allowed"
              )}>
              <div className={cn("w-9 h-9 rounded-full flex items-center justify-center shrink-0",
                done ? "bg-emerald-500/20" : isNext ? "bg-primary/20" : "bg-muted"
              )}>
                {done ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> :
                 !unlocked ? <Lock className="w-4 h-4 text-muted-foreground" /> :
                 isNext ? <Play className="w-4 h-4 text-primary fill-primary" /> :
                 <span className="text-xs font-bold text-muted-foreground">{lesson.num}</span>}
              </div>
              <div className="flex-1 min-w-0">
                <p className={cn("text-sm font-semibold truncate", done ? "text-emerald-400" : "text-foreground")}>
                  {lesson.title}
                </p>
                <p className="text-xs text-muted-foreground">{lesson.xp} XP{isMilestone ? ' · Challenge Level' : ''}</p>
              </div>
              {isNext && <Zap className="w-4 h-4 text-primary shrink-0" />}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

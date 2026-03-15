
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getCoursesByTier } from '../courseIndex';
import { usePathwayProgress } from '../usePathwayProgress';
import { CourseDetail } from './CourseDetail';
import type { TierLevel } from '../types';

const TIERS: { id: TierLevel; label: string; sub: string; colorClass: string; unlockText: string }[] = [
  { id: 'easy', label: 'Easy', sub: 'Start Here', colorClass: 'text-emerald-400', unlockText: '' },
  { id: 'intermediate', label: 'Intermediate', sub: 'Build On It', colorClass: 'text-amber-400', unlockText: 'Complete 2 Easy courses to unlock' },
  { id: 'advanced', label: 'Advanced', sub: 'Master It', colorClass: 'text-red-400', unlockText: 'Complete 3 Intermediate courses to unlock' },
];

export function PathwayPage() {
  const [activeCourse, setActiveCourse] = useState<string | null>(null);
  const { isTierUnlocked, getCompletedLessons } = usePathwayProgress();

  if (activeCourse) {
    return <CourseDetail courseId={activeCourse} onBack={() => setActiveCourse(null)} />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-20">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-black text-foreground">Learning Pathway</h1>
        <p className="text-sm text-muted-foreground mt-1">12 courses · 600 lessons · Your year-long journey</p>
      </div>

      <div className="flex flex-col gap-8">
        {TIERS.map((tier, ti) => {
          const unlocked = isTierUnlocked(tier.id);
          const courses = getCoursesByTier(tier.id);
          const tierCompleted = courses.reduce((s, c) => s + getCompletedLessons(c.id), 0);
          const tierTotal = courses.reduce((s, c) => s + c.totalLessons, 0);
          const tierPct = tierTotal > 0 ? Math.round((tierCompleted / tierTotal) * 100) : 0;

          return (
            <motion.div key={tier.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: ti * 0.1 }} className="relative">
              {/* Tier Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className={cn("text-xs font-black uppercase tracking-widest", tier.colorClass)}>
                    {tier.label}
                  </span>
                  <span className="text-xs text-muted-foreground">— {tier.sub}</span>
                  {!unlocked && <Lock className="w-3.5 h-3.5 text-muted-foreground" />}
                </div>
                <span className={cn("text-xs font-bold", tier.colorClass)}>{tierPct}%</span>
              </div>
              <div className="h-1 bg-muted rounded-full overflow-hidden mb-4">
                <div className={cn("h-full rounded-full transition-all",
                  tier.id === 'easy' ? "bg-emerald-500" : tier.id === 'intermediate' ? "bg-amber-500" : "bg-red-500"
                )} style={{ width: `${tierPct}%` }} />
              </div>

              {!unlocked && (
                <div className="absolute inset-0 top-12 bg-background/60 backdrop-blur-sm rounded-2xl flex items-center justify-center z-10">
                  <div className="text-center p-4">
                    <Lock className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">{tier.unlockText}</p>
                  </div>
                </div>
              )}

              {/* Course Cards */}
              <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 snap-x snap-mandatory scrollbar-hide">
                {courses.map(course => {
                  const completed = getCompletedLessons(course.id);
                  const pct = Math.round((completed / course.totalLessons) * 100);
                  const remaining = course.totalLessons - completed;
                  const estDays = Math.ceil(remaining / 1.5);

                  return (
                    <motion.div key={course.id} whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}
                      onClick={() => unlocked && setActiveCourse(course.id)}
                      className={cn(
                        "snap-start shrink-0 w-[220px] p-4 rounded-2xl border transition-all cursor-pointer",
                        unlocked ? "bg-card border-border hover:border-primary/40" : "bg-card/50 border-border/30"
                      )}>
                      <div className="flex items-start justify-between mb-3">
                        <span className="text-3xl">{course.icon}</span>
                        <span className={cn("text-[10px] font-bold uppercase px-2 py-0.5 rounded-full",
                          tier.id === 'easy' ? "bg-emerald-500/20 text-emerald-400" :
                          tier.id === 'intermediate' ? "bg-amber-500/20 text-amber-400" :
                          "bg-red-500/20 text-red-400"
                        )}>{tier.label}</span>
                      </div>
                      <h3 className="text-sm font-bold text-foreground mb-1 line-clamp-2">{course.title}</h3>
                      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{course.description}</p>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div className={cn("h-full rounded-full",
                            tier.id === 'easy' ? "bg-emerald-500" : tier.id === 'intermediate' ? "bg-amber-500" : "bg-red-500"
                          )} style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-[10px] font-bold text-muted-foreground">{completed}/{course.totalLessons}</span>
                      </div>
                      {remaining > 0 && (
                        <p className="text-[10px] text-muted-foreground">~{estDays} days remaining</p>
                      )}
                      {completed === course.totalLessons && (
                        <p className="text-[10px] font-bold text-emerald-400">Completed!</p>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

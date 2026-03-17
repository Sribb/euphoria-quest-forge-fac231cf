
import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { ArrowRight, Check, X as XIcon, ChevronLeft, ChevronRight, Sparkles, TrendingUp, AlertTriangle, BookOpen, Zap } from 'lucide-react';
import type {
  HookOpenerStep, StakesCardStep, TeachingSlideStep, MicroCheckStep,
  InteractiveGraphStep, CaseStudyStep, MisconceptionsStep, KeyTermsCardsStep,
  SimulationFinaleStep, SummaryCardsStep, WhatsNextStep
} from '../types';

/* ─── Hook Opener ─── */
export function HookOpenerView({ step, onComplete }: { step: HookOpenerStep; onComplete: (c: boolean) => void }) {
  const [animPhase, setAnimPhase] = useState(0);

  // Simulate chart growth animation
  useState(() => {
    const t1 = setTimeout(() => setAnimPhase(1), 400);
    const t2 = setTimeout(() => setAnimPhase(2), 1000);
    const t3 = setTimeout(() => setAnimPhase(3), 1600);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-0 w-full min-h-[70vh] relative">
      {/* Visual area */}
      <div className="w-full flex-1 flex items-center justify-center bg-gradient-to-b from-primary/10 via-primary/5 to-transparent px-6 py-10">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, duration: 0.8 }}
          className="w-full max-w-md">
          {/* SVG Chart visualization */}
          <svg viewBox="0 0 400 200" className="w-full h-auto" style={{ pointerEvents: 'auto' }}>
            <defs>
              <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* Grid lines */}
            {[40, 80, 120, 160].map(y => (
              <line key={y} x1="40" y1={y} x2="380" y2={y} stroke="hsl(var(--border))" strokeWidth="0.5" strokeDasharray="4 4" />
            ))}
            {/* Growth curve */}
            <motion.path
              d="M40,170 Q100,165 140,155 Q180,140 220,120 Q260,90 300,55 Q340,25 380,10"
              fill="none" stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round"
              initial={{ pathLength: 0 }} animate={{ pathLength: animPhase >= 1 ? 1 : 0 }}
              transition={{ duration: 2, ease: "easeOut" }}
            />
            {/* Area under curve */}
            <motion.path
              d="M40,170 Q100,165 140,155 Q180,140 220,120 Q260,90 300,55 Q340,25 380,10 L380,180 L40,180 Z"
              fill="url(#chartGrad)"
              initial={{ opacity: 0 }} animate={{ opacity: animPhase >= 2 ? 0.6 : 0 }}
              transition={{ duration: 0.8 }}
            />
            {/* Milestone labels */}
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: animPhase >= 2 ? 1 : 0 }} transition={{ delay: 0.3 }}>
              <text x="40" y="195" fill="hsl(var(--muted-foreground))" fontSize="10" textAnchor="middle">1990</text>
              <text x="140" y="195" fill="hsl(var(--muted-foreground))" fontSize="10" textAnchor="middle">2000</text>
              <text x="260" y="195" fill="hsl(var(--muted-foreground))" fontSize="10" textAnchor="middle">2010</text>
              <text x="380" y="195" fill="hsl(var(--muted-foreground))" fontSize="10" textAnchor="middle">2024</text>
            </motion.g>
            {/* Value labels */}
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: animPhase >= 3 ? 1 : 0 }}>
              <circle cx="40" cy="170" r="4" fill="hsl(var(--primary))" />
              <text x="40" y="162" fill="hsl(var(--foreground))" fontSize="11" fontWeight="bold" textAnchor="middle">$1K</text>
              <circle cx="380" cy="10" r="5" fill="hsl(var(--primary))" />
              <text x="380" y="6" fill="hsl(var(--foreground))" fontSize="12" fontWeight="bold" textAnchor="middle">$23K</text>
            </motion.g>
          </svg>
          <p className="text-xs text-center text-muted-foreground mt-2 italic">{step.visualDescription}</p>
        </motion.div>
      </div>

      {/* Text overlay */}
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
        className="px-6 pb-8 pt-6 text-center max-w-lg mx-auto">
        <h1 className="text-3xl font-black text-foreground mb-4 tracking-tight">{step.title}</h1>
        <p className="text-base text-muted-foreground leading-relaxed mb-3">{step.fact}</p>
        <p className="text-sm text-foreground/70 leading-relaxed">{step.outcome}</p>
        <Button onClick={() => onComplete(true)} className="mt-8 px-10 rounded-xl gap-2 text-base font-bold" size="lg">
          Begin <ArrowRight className="w-4 h-4" />
        </Button>
      </motion.div>
    </motion.div>
  );
}

/* ─── Stakes Card ─── */
export function StakesCardView({ step, onComplete }: { step: StakesCardStep; onComplete: (c: boolean) => void }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-6 px-4 w-full max-w-lg mx-auto">
      <h2 className="text-xl font-black text-foreground text-center">Why This Matters</h2>
      <div className="grid grid-cols-2 gap-4 w-full">
        {/* WITHOUT */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
          className="p-5 rounded-2xl border-2 border-red-500/30 bg-red-500/5 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <XIcon className="w-5 h-5 text-red-400" />
            <span className="text-sm font-bold text-red-400 uppercase tracking-wider">Without</span>
          </div>
          <p className="text-sm font-semibold text-foreground">{step.without.label}</p>
          <p className="text-xs text-muted-foreground leading-relaxed">{step.without.detail}</p>
        </motion.div>
        {/* WITH */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}
          className="p-5 rounded-2xl border-2 border-emerald-500/30 bg-emerald-500/5 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 text-emerald-400" />
            <span className="text-sm font-bold text-emerald-400 uppercase tracking-wider">With</span>
          </div>
          <p className="text-sm font-semibold text-foreground">{step.with.label}</p>
          <p className="text-xs text-muted-foreground leading-relaxed">{step.with.detail}</p>
        </motion.div>
      </div>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
        className="text-sm text-muted-foreground text-center italic">This is why it matters. Let's go.</motion.p>
      <Button onClick={() => onComplete(true)} className="px-8 rounded-xl gap-2">
        Continue <ArrowRight className="w-4 h-4" />
      </Button>
    </motion.div>
  );
}

/* ─── Teaching Slide ─── */
export function TeachingSlideView({ step, onComplete }: { step: TeachingSlideStep; onComplete: (c: boolean) => void }) {
  const [revealedTerms, setRevealedTerms] = useState<Set<string>>(new Set());
  const [activeTerm, setActiveTerm] = useState<string | null>(null);

  const toggleTerm = (term: string) => {
    setRevealedTerms(prev => new Set(prev).add(term));
    setActiveTerm(activeTerm === term ? null : term);
  };

  const activeTermData = step.highlightedTerms.find(t => t.term === activeTerm);

  const renderParagraph = (text: string, idx: number) => {
    let result = text;
    const parts: (string | { term: string })[] = [];
    let remaining = result;

    // Find and split by highlighted terms
    for (const ht of step.highlightedTerms) {
      const termLower = ht.term.toLowerCase();
      const idx = remaining.toLowerCase().indexOf(termLower);
      if (idx !== -1) {
        // Term found inline
      }
    }

    // Simple approach: render text and underline terms
    return (
      <p key={idx} className="text-sm text-foreground/90 leading-relaxed">
        {text.split(/(\b\w+\b)/g).map((word, wi) => {
          const matchedTerm = step.highlightedTerms.find(
            t => t.term.toLowerCase() === word.toLowerCase()
          );
          if (matchedTerm) {
            return (
              <span key={wi} onClick={() => toggleTerm(matchedTerm.term)}
                className="text-primary underline decoration-primary/50 decoration-2 underline-offset-2 cursor-pointer hover:decoration-primary transition-all font-medium"
                style={{ pointerEvents: 'auto' }}>
                {word}
              </span>
            );
          }
          return <span key={wi}>{word}</span>;
        })}
      </p>
    );
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-5 px-4 w-full max-w-lg mx-auto">
      <div className="flex items-center gap-2">
        <BookOpen className="w-4 h-4 text-primary" />
        <span className="text-xs font-bold text-primary uppercase tracking-widest">{step.sectionLabel}</span>
      </div>
      <h2 className="text-2xl font-black text-foreground">{step.title}</h2>

      {/* Diagram placeholder */}
      <div className="w-full p-6 rounded-2xl bg-card border border-border/50 text-center">
        <div className="w-full h-32 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mb-3">
          <TrendingUp className="w-12 h-12 text-primary/40" />
        </div>
        <p className="text-xs text-muted-foreground italic">{step.diagramDescription}</p>
      </div>

      {/* Paragraphs with highlighted terms */}
      <div className="flex flex-col gap-4">
        {step.paragraphs.map((p, i) => renderParagraph(p, i))}
      </div>

      {/* Term tooltip */}
      <AnimatePresence>
        {activeTermData && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
            className="p-4 rounded-2xl bg-primary/10 border border-primary/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-primary">{activeTermData.term}</span>
              <Button variant="ghost" size="sm" onClick={() => setActiveTerm(null)} className="h-6 w-6 p-0 rounded-full">
                <XIcon className="w-3 h-3" />
              </Button>
            </div>
            <p className="text-xs text-foreground/80 mb-1">{activeTermData.definition}</p>
            <p className="text-xs text-muted-foreground italic">e.g., {activeTermData.example}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Real example callout */}
      {step.realExample && (
        <div className="p-4 rounded-2xl bg-accent/10 border border-accent/30">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-accent-foreground" />
            <span className="text-xs font-bold text-accent-foreground uppercase">Real Example</span>
          </div>
          <p className="text-sm text-foreground">
            <strong>{step.realExample.company}</strong> — {step.realExample.metric}
          </p>
          <p className="text-xs text-muted-foreground mt-1">{step.realExample.explanation}</p>
        </div>
      )}

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span className="text-primary">💡</span>
        <span>Tap underlined terms to see definitions</span>
      </div>

      <Button onClick={() => onComplete(true)} className="px-8 rounded-xl self-center gap-2">
        Continue <ArrowRight className="w-4 h-4" />
      </Button>
    </motion.div>
  );
}

/* ─── Micro Check ─── */
export function MicroCheckView({ step, onComplete }: { step: MicroCheckStep; onComplete: (c: boolean) => void }) {
  const [sel, setSel] = useState<number | null>(null);
  const isCorrect = sel !== null && sel === step.correct;

  const pick = (i: number) => {
    if (sel !== null) return;
    setSel(i);
    setTimeout(() => onComplete(i === step.correct), 2000);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-5 px-4 w-full max-w-lg mx-auto">
      <div className="flex items-center gap-2">
        <Zap className="w-4 h-4 text-primary" />
        <span className="text-xs font-bold text-primary uppercase tracking-widest">Quick Check</span>
      </div>
      <h2 className="text-lg font-bold text-foreground text-center">{step.question}</h2>
      <div className="flex flex-col gap-2 w-full">
        {step.options.map((o, i) => (
          <Button key={i}
            variant={sel === i ? (i === step.correct ? "default" : "destructive") : "outline"}
            onClick={() => pick(i)} disabled={sel !== null}
            className={cn("justify-start text-left text-sm rounded-xl h-auto py-3 px-4",
              sel !== null && i === step.correct && "border-emerald-500 bg-emerald-500/10 text-emerald-400"
            )}>{o}</Button>
        ))}
      </div>
      {sel !== null && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className={cn("text-sm text-center p-4 rounded-xl w-full",
            isCorrect ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
          )}>
          {isCorrect ? step.explanationCorrect : step.explanationWrong}
        </motion.p>
      )}
    </motion.div>
  );
}

/* ─── Interactive Graph ─── */
export function InteractiveGraphView({ step, onComplete }: { step: InteractiveGraphStep; onComplete: (c: boolean) => void }) {
  const defaultSliders = step.sliders?.map(s => s.default) ?? [];
  const [values, setValues] = useState<number[]>(defaultSliders);
  const [revealedInsights, setRevealedInsights] = useState(0);

  const updateSlider = (idx: number, val: number) => {
    const next = [...values];
    next[idx] = val;
    setValues(next);
    if (revealedInsights < step.insights.length) {
      setRevealedInsights(prev => Math.min(prev + 1, step.insights.length));
    }
  };

  // Calculate compound growth for the exponential graph type
  const computedValue = useMemo(() => {
    if (step.graphType === 'exponential' && step.sliders && values.length >= 2) {
      const principal = 1000;
      const rate = values[0] / 100;
      const years = values[1];
      return Math.round(principal * Math.pow(1 + rate, years));
    }
    return 0;
  }, [step.graphType, step.sliders, values]);

  // Generate curve points for SVG
  const curvePoints = useMemo(() => {
    if (step.graphType !== 'exponential' || !step.sliders || values.length < 2) return '';
    const rate = values[0] / 100;
    const years = values[1];
    const points: string[] = [];
    const maxVal = 1000 * Math.pow(1 + rate, years);
    const chartH = 160;
    const chartW = 320;
    for (let y = 0; y <= years; y++) {
      const val = 1000 * Math.pow(1 + rate, y);
      const x = 40 + (y / Math.max(years, 1)) * chartW;
      const yPos = 180 - (val / Math.max(maxVal, 1)) * chartH;
      points.push(`${x},${yPos}`);
    }
    return points.join(' ');
  }, [step.graphType, values, step.sliders]);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-5 px-4 w-full max-w-lg mx-auto">
      <div className="flex items-center gap-2">
        <TrendingUp className="w-4 h-4 text-primary" />
        <span className="text-xs font-bold text-primary uppercase tracking-widest">{step.sectionLabel}</span>
      </div>
      <h2 className="text-2xl font-black text-foreground">{step.title}</h2>

      {/* Interactive Graph */}
      <div className="w-full p-4 rounded-2xl bg-card border border-border/50">
        {step.graphType === 'exponential' && (
          <>
            <svg viewBox="0 0 400 200" className="w-full h-auto mb-2" style={{ pointerEvents: 'auto' }}>
              <defs>
                <linearGradient id="igGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                </linearGradient>
              </defs>
              {[60, 100, 140, 180].map(y => (
                <line key={y} x1="40" y1={y} x2="360" y2={y} stroke="hsl(var(--border))" strokeWidth="0.5" strokeDasharray="4 4" />
              ))}
              {curvePoints && (
                <>
                  <polyline points={curvePoints} fill="none" stroke="hsl(var(--primary))" strokeWidth="2.5" strokeLinecap="round" />
                  <polygon points={`${curvePoints} 360,180 40,180`} fill="url(#igGrad)" opacity="0.5" />
                </>
              )}
              <text x="40" y="195" fill="hsl(var(--muted-foreground))" fontSize="10">Year 0</text>
              <text x="360" y="195" fill="hsl(var(--muted-foreground))" fontSize="10" textAnchor="end">Year {values[1] || 10}</text>
            </svg>
            <div className="text-center mb-4">
              <span className="text-xs text-muted-foreground">Final value: </span>
              <span className="text-2xl font-black text-primary">${computedValue.toLocaleString()}</span>
            </div>
          </>
        )}

        {/* Sliders */}
        {step.sliders?.map((s, i) => (
          <div key={i} className="mb-4">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>{s.label}</span>
              <span className="font-bold text-foreground">{values[i]}{s.unit}</span>
            </div>
            <Slider min={s.min} max={s.max} step={1} value={[values[i]]}
              onValueChange={([v]) => updateSlider(i, v)} className="w-full" />
          </div>
        ))}
      </div>

      {/* Paragraphs */}
      <div className="flex flex-col gap-3">
        {step.paragraphs.map((p, i) => (
          <p key={i} className="text-sm text-foreground/90 leading-relaxed">{p}</p>
        ))}
      </div>

      {/* Insights revealed */}
      <div className="flex flex-col gap-2">
        {step.insights.slice(0, revealedInsights).map((ins, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
            className="flex items-start gap-2 p-3 rounded-xl bg-primary/5 border border-primary/20">
            <span className="text-primary font-bold text-sm">{i + 1}.</span>
            <p className="text-xs text-foreground/80">{ins}</p>
          </motion.div>
        ))}
      </div>

      {step.realExample && (
        <div className="p-4 rounded-2xl bg-accent/10 border border-accent/30">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-accent-foreground" />
            <span className="text-xs font-bold text-accent-foreground uppercase">Real Example</span>
          </div>
          <p className="text-sm text-foreground"><strong>{step.realExample.company}</strong> — {step.realExample.metric}</p>
          <p className="text-xs text-muted-foreground mt-1">{step.realExample.explanation}</p>
        </div>
      )}

      <Button onClick={() => onComplete(true)} className="px-8 rounded-xl self-center gap-2">
        Continue <ArrowRight className="w-4 h-4" />
      </Button>
    </motion.div>
  );
}

/* ─── Case Study ─── */
export function CaseStudyView({ step, onComplete }: { step: CaseStudyStep; onComplete: (c: boolean) => void }) {
  const [revealedIdx, setRevealedIdx] = useState(0);

  const revealNext = () => {
    if (revealedIdx < step.events.length) {
      setRevealedIdx(prev => prev + 1);
    }
  };

  const allRevealed = revealedIdx >= step.events.length;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-5 px-4 w-full max-w-lg mx-auto">
      <div className="flex items-center gap-2">
        <BookOpen className="w-4 h-4 text-primary" />
        <span className="text-xs font-bold text-primary uppercase tracking-widest">Real World</span>
      </div>
      <h2 className="text-2xl font-black text-foreground">{step.title}</h2>

      {/* Timeline */}
      <div className="relative pl-6">
        <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-border" />
        {step.events.map((evt, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: i < revealedIdx ? 1 : 0.2, x: i < revealedIdx ? 0 : -10 }}
            transition={{ delay: i < revealedIdx ? 0 : 0 }}
            className="relative mb-6 last:mb-0"
            onClick={() => { if (i === revealedIdx) revealNext(); }}
            style={{ cursor: i === revealedIdx ? 'pointer' : 'default', pointerEvents: 'auto' }}
          >
            <div className={cn("absolute -left-[18px] top-1 w-3 h-3 rounded-full border-2",
              i < revealedIdx ? "bg-primary border-primary" : "bg-card border-border"
            )} />
            <span className="text-xs font-bold text-primary">{evt.date}</span>
            <p className="text-sm font-semibold text-foreground mt-0.5">{evt.event}</p>
            {i < revealedIdx && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="text-xs text-muted-foreground mt-1 leading-relaxed">{evt.context}</motion.p>
            )}
          </motion.div>
        ))}
      </div>

      {!allRevealed && (
        <Button variant="outline" onClick={revealNext} className="rounded-xl self-center gap-2 text-sm">
          Reveal next event <ChevronRight className="w-4 h-4" />
        </Button>
      )}

      {allRevealed && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="p-4 rounded-2xl bg-primary/10 border border-primary/30">
            <span className="text-xs font-bold text-primary uppercase">The Lesson</span>
            <p className="text-sm text-foreground mt-2 leading-relaxed">{step.lesson}</p>
          </motion.div>
          <Button onClick={() => onComplete(true)} className="px-8 rounded-xl self-center gap-2">
            Continue <ArrowRight className="w-4 h-4" />
          </Button>
        </>
      )}
    </motion.div>
  );
}

/* ─── Misconceptions ─── */
export function MisconceptionsView({ step, onComplete }: { step: MisconceptionsStep; onComplete: (c: boolean) => void }) {
  const [revealedIdx, setRevealedIdx] = useState(0);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-5 px-4 w-full max-w-lg mx-auto">
      <div className="flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-yellow-400" />
        <span className="text-xs font-bold text-yellow-400 uppercase tracking-widest">{step.title}</span>
      </div>
      <h2 className="text-xl font-black text-foreground">{step.subtitle}</h2>

      <div className="flex flex-col gap-4">
        {step.items.map((item, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: i <= revealedIdx ? 1 : 0.3, y: i <= revealedIdx ? 0 : 10 }}
            onClick={() => { if (i === revealedIdx && revealedIdx < step.items.length) setRevealedIdx(prev => prev + 1); }}
            style={{ cursor: i === revealedIdx ? 'pointer' : 'default', pointerEvents: 'auto' }}
            className={cn("p-4 rounded-2xl border transition-all", i <= revealedIdx ? "border-border bg-card" : "border-border/30 bg-card/50")}
          >
            <div className="flex items-start gap-3 mb-2">
              <XIcon className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
              <p className="text-sm text-red-400 line-through">{item.myth}</p>
            </div>
            {i < revealedIdx && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="flex items-start gap-3 mb-2">
                  <Check className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <p className="text-sm text-emerald-400 font-medium">{item.truth}</p>
                </div>
                <p className="text-xs text-muted-foreground ml-7 leading-relaxed">{item.explanation}</p>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {revealedIdx > step.items.length - 1 && (
        <Button onClick={() => onComplete(true)} className="px-8 rounded-xl self-center gap-2">
          Continue <ArrowRight className="w-4 h-4" />
        </Button>
      )}
      {revealedIdx <= step.items.length - 1 && (
        <Button variant="outline" onClick={() => setRevealedIdx(prev => prev + 1)} className="rounded-xl self-center text-sm">
          Tap to reveal truth
        </Button>
      )}
    </motion.div>
  );
}

/* ─── Key Terms Cards ─── */
export function KeyTermsCardsView({ step, onComplete }: { step: KeyTermsCardsStep; onComplete: (c: boolean) => void }) {
  const [idx, setIdx] = useState(0);
  const [viewed, setViewed] = useState<Set<number>>(new Set([0]));

  const goTo = (dir: number) => {
    const next = Math.max(0, Math.min(step.terms.length - 1, idx + dir));
    setIdx(next);
    setViewed(prev => new Set(prev).add(next));
  };

  const allViewed = viewed.size === step.terms.length;
  const term = step.terms[idx];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-5 px-4 w-full max-w-lg mx-auto">
      <div className="flex items-center gap-2">
        <BookOpen className="w-4 h-4 text-primary" />
        <span className="text-xs font-bold text-primary uppercase tracking-widest">Know the Language</span>
      </div>
      <p className="text-xs text-muted-foreground">These terms will appear throughout this pathway</p>

      {/* Card */}
      <AnimatePresence mode="wait">
        <motion.div key={idx} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
          className="w-full p-6 rounded-2xl bg-card border border-border min-h-[200px]">
          <h3 className="text-xl font-black text-foreground mb-3">{term.term}</h3>
          <p className="text-sm text-foreground/90 leading-relaxed mb-3">{term.definition}</p>
          <p className="text-xs text-muted-foreground italic mb-3">e.g., {term.example}</p>
          <div className="p-3 rounded-xl bg-muted/30 border border-border/50">
            <span className="text-xs text-muted-foreground">Used in a sentence:</span>
            <p className="text-sm text-foreground mt-1 italic">"{term.sentence}"</p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => goTo(-1)} disabled={idx === 0} className="rounded-full">
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <div className="flex gap-1.5">
          {step.terms.map((_, i) => (
            <div key={i} className={cn("w-2 h-2 rounded-full transition-all",
              i === idx ? "bg-primary scale-125" : viewed.has(i) ? "bg-primary/40" : "bg-border"
            )} />
          ))}
        </div>
        <Button variant="outline" size="icon" onClick={() => goTo(1)} disabled={idx === step.terms.length - 1} className="rounded-full">
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">{idx + 1} of {step.terms.length}</p>

      {allViewed && (
        <Button onClick={() => onComplete(true)} className="px-8 rounded-xl gap-2">
          Continue <ArrowRight className="w-4 h-4" />
        </Button>
      )}
    </motion.div>
  );
}

/* ─── Simulation Finale ─── */
export function SimulationFinaleView({ step, onComplete }: { step: SimulationFinaleStep; onComplete: (c: boolean) => void }) {
  const [decisionIdx, setDecisionIdx] = useState(0);
  const [choices, setChoices] = useState<number[]>([]);
  const [showConsequence, setShowConsequence] = useState(false);
  const [done, setDone] = useState(false);

  const currentDecision = step.decisions[decisionIdx];
  const totalScore = choices.reduce((sum, ci, di) => sum + step.decisions[di].options[ci].score, 0);
  const maxScore = step.decisions.reduce((sum, d) => sum + Math.max(...d.options.map(o => o.score)), 0);

  const pick = (i: number) => {
    if (showConsequence) return;
    setChoices(prev => [...prev, i]);
    setShowConsequence(true);
  };

  const advance = () => {
    setShowConsequence(false);
    if (decisionIdx + 1 < step.decisions.length) {
      setDecisionIdx(prev => prev + 1);
    } else {
      setDone(true);
    }
  };

  if (done) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-5 px-4 w-full max-w-lg mx-auto text-center">
        <Sparkles className="w-10 h-10 text-primary" />
        <h2 className="text-2xl font-black text-foreground">Simulation Complete</h2>
        <div className="p-5 rounded-2xl bg-card border border-border w-full">
          <p className="text-sm text-muted-foreground mb-2">Your outcome</p>
          <p className="text-3xl font-black text-primary mb-4">{totalScore}/{maxScore}</p>
          <p className="text-sm text-muted-foreground mb-2">Optimal outcome</p>
          <p className="text-sm text-foreground mb-4">{step.optimalOutcome}</p>
          <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
            <p className="text-xs font-bold text-primary uppercase mb-1">The Principle</p>
            <p className="text-sm text-foreground">{step.principle}</p>
          </div>
        </div>
        <Button onClick={() => onComplete(totalScore >= maxScore * 0.6)} className="px-8 rounded-xl gap-2">
          Continue <ArrowRight className="w-4 h-4" />
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-5 px-4 w-full max-w-lg mx-auto">
      <div className="flex items-center gap-2">
        <Zap className="w-4 h-4 text-primary" />
        <span className="text-xs font-bold text-primary uppercase tracking-widest">Simulation</span>
      </div>
      <h2 className="text-xl font-black text-foreground text-center">{step.title}</h2>
      {decisionIdx === 0 && !showConsequence && (
        <p className="text-sm text-muted-foreground text-center leading-relaxed">{step.setup}</p>
      )}

      <div className="flex gap-1.5 mb-2">
        {step.decisions.map((_, i) => (
          <div key={i} className={cn("h-1.5 rounded-full flex-1 transition-all",
            i < decisionIdx ? "bg-primary" : i === decisionIdx ? "bg-primary/50" : "bg-border"
          )} />
        ))}
      </div>

      <div className="w-full p-4 rounded-2xl bg-card border border-border">
        <p className="text-sm text-foreground font-medium mb-3">{currentDecision.prompt}</p>
        <div className="flex flex-col gap-2">
          {currentDecision.options.map((opt, i) => (
            <Button key={i} variant={choices[decisionIdx] === i ? "default" : "outline"}
              onClick={() => pick(i)} disabled={showConsequence}
              className="justify-start text-left text-sm rounded-xl h-auto py-3 px-4">{opt.label}</Button>
          ))}
        </div>
      </div>

      {showConsequence && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="w-full p-4 rounded-2xl bg-primary/5 border border-primary/20">
          <p className="text-sm text-foreground">{currentDecision.options[choices[decisionIdx]].consequence}</p>
          <Button onClick={advance} className="mt-3 rounded-xl gap-2 text-sm" size="sm">
            {decisionIdx + 1 < step.decisions.length ? 'Next Decision' : 'See Results'} <ArrowRight className="w-4 h-4" />
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}

/* ─── Summary Cards ─── */
export function SummaryCardsView({ step, onComplete }: { step: SummaryCardsStep; onComplete: (c: boolean) => void }) {
  const [idx, setIdx] = useState(0);
  const [viewed, setViewed] = useState<Set<number>>(new Set([0]));

  const goTo = (dir: number) => {
    const next = Math.max(0, Math.min(step.cards.length - 1, idx + dir));
    setIdx(next);
    setViewed(prev => new Set(prev).add(next));
  };

  const allViewed = viewed.size === step.cards.length;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-5 px-4 w-full max-w-lg mx-auto text-center">
      <Sparkles className="w-8 h-8 text-primary" />
      <h2 className="text-2xl font-black text-foreground">Lesson Complete</h2>
      <p className="text-sm text-muted-foreground">{step.lessonTitle}</p>
      <p className="text-xs text-muted-foreground">Here's what you now know:</p>

      <AnimatePresence mode="wait">
        <motion.div key={idx} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
          className="w-full p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 min-h-[140px] flex flex-col justify-center">
          <p className="text-base font-bold text-foreground mb-2">{step.cards[idx].takeaway}</p>
          <p className="text-sm text-muted-foreground leading-relaxed">{step.cards[idx].detail}</p>
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => goTo(-1)} disabled={idx === 0} className="rounded-full">
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <div className="flex gap-1.5">
          {step.cards.map((_, i) => (
            <div key={i} className={cn("w-2 h-2 rounded-full", i === idx ? "bg-primary" : "bg-border")} />
          ))}
        </div>
        <Button variant="outline" size="icon" onClick={() => goTo(1)} disabled={idx === step.cards.length - 1} className="rounded-full">
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {allViewed && (
        <Button onClick={() => onComplete(true)} className="px-8 rounded-xl gap-2">
          Continue to Results <ArrowRight className="w-4 h-4" />
        </Button>
      )}
    </motion.div>
  );
}

/* ─── What's Next ─── */
export function WhatsNextView({ step, onComplete, onClose }: { step: WhatsNextStep; onComplete: (c: boolean) => void; onClose?: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-5 px-4 w-full max-w-lg mx-auto text-center">
      <h2 className="text-xl font-black text-foreground">You're Building Momentum</h2>

      {/* Progress indication */}
      <div className="w-full p-5 rounded-2xl bg-card border border-border">
        <p className="text-xs text-muted-foreground mb-3 uppercase tracking-widest font-bold">Next Lesson</p>
        <h3 className="text-lg font-bold text-foreground mb-2">{step.nextTitle}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-3">{step.preview}</p>
        <p className="text-xs text-muted-foreground">~{step.estimatedTime} minutes</p>
      </div>

      <div className="flex gap-3">
        <Button onClick={() => onComplete(true)} className="px-8 rounded-xl gap-2">
          Start Next Lesson <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
      <Button variant="ghost" onClick={onClose || (() => onComplete(true))} className="text-sm text-muted-foreground">
        Back to Dashboard
      </Button>
    </motion.div>
  );
}

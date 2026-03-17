
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Slider } from '@/components/ui/slider';
import { ArrowRight, TrendingUp, BarChart3, Shield, Home, Coins } from 'lucide-react';
import type {
  LessonStep, ConceptStep, TapRevealStep, FillBlankStep, DragSortStep,
  QuizStep, TrueFalseStep, MatchStep, SliderStep, ScenarioStep,
  BuildItStep, ProgressiveCalcStep, VisualInteractiveStep,
  HookOpenerStep, StakesCardStep, TeachingSlideStep, MicroCheckStep,
  InteractiveGraphStep, CaseStudyStep, MisconceptionsStep, KeyTermsCardsStep,
  SimulationFinaleStep, SummaryCardsStep, WhatsNextStep
} from '../types';
import {
  HookOpenerView, StakesCardView, TeachingSlideView, MicroCheckView,
  InteractiveGraphView, CaseStudyView, MisconceptionsView, KeyTermsCardsView,
  SimulationFinaleView, SummaryCardsView, WhatsNextView
} from './TemplateStepRenderers';

interface Props {
  step: LessonStep;
  onComplete: (correct: boolean) => void;
  onClose?: () => void;
}

/* ─── Concept ─── */
function ConceptView({ step, onComplete }: { step: ConceptStep; onComplete: (c: boolean) => void }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-6 text-center px-6 min-h-[85vh]">
      <span className="text-6xl">{step.emoji}</span>
      <h2 className="text-2xl font-black text-foreground">{step.title}</h2>
      <p className="text-muted-foreground leading-relaxed max-w-md text-base">{step.body}</p>
      <Button onClick={() => onComplete(true)} className="mt-4 px-8 rounded-xl">Continue</Button>
    </motion.div>
  );
}

/* ─── Tap Reveal — Desktop 2x2 grid with card flip ─── */
function TapRevealView({ step, onComplete }: { step: TapRevealStep; onComplete: (c: boolean) => void }) {
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const toggle = (i: number) => setRevealed(prev => new Set(prev).add(i));
  const allDone = revealed.size === step.cards.length;

  const cardTints = [
    'rgba(59,130,246,0.08)',   // dark blue
    'rgba(16,185,129,0.08)',   // dark green
    'rgba(139,92,246,0.08)',   // dark purple
    'rgba(245,158,11,0.08)',   // dark amber
  ];
  const cardBorders = [
    'rgba(59,130,246,0.3)',
    'rgba(16,185,129,0.3)',
    'rgba(139,92,246,0.3)',
    'rgba(245,158,11,0.3)',
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-5 px-6 w-full min-h-[85vh]" style={{ maxWidth: '900px', margin: '0 auto' }}>
      <span className="text-xs font-bold text-primary uppercase tracking-widest">✦ TAP TO REVEAL</span>
      <h2 className="text-xl lg:text-2xl font-bold text-foreground">{step.title}</h2>
      <p className="text-sm text-muted-foreground">Tap each card to reveal the answer</p>
      {/* Desktop: 2x2 grid, each card 280px tall, 380px+ wide */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
        {step.cards.map(([front, back], i) => (
          <div key={i} className="perspective-1000" style={{ perspective: '1000px' }}>
            <motion.div
              onClick={() => toggle(i)}
              className="cursor-pointer relative"
              style={{
                transformStyle: 'preserve-3d',
                minHeight: '280px',
                pointerEvents: 'auto',
              }}
              animate={{ rotateY: revealed.has(i) ? 180 : 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* Front face */}
              <div
                className={cn("absolute inset-0 rounded-2xl border-2 flex flex-col items-center justify-center text-center p-6 backface-hidden")}
                style={{
                  background: cardTints[i % 4],
                  borderColor: revealed.has(i) ? 'transparent' : cardBorders[i % 4],
                  backfaceVisibility: 'hidden',
                  animation: !revealed.has(i) ? 'pulse-border 2s ease-in-out infinite' : 'none',
                  boxShadow: !revealed.has(i) ? `0 0 20px ${cardBorders[i % 4]}` : 'none',
                }}
              >
                <span className="text-4xl text-muted-foreground/30 mb-3">?</span>
                <p className="text-base lg:text-lg font-semibold text-foreground">{front}</p>
                <span className="text-xs text-muted-foreground/50 mt-3">Tap to reveal</span>
              </div>
              {/* Back face */}
              <div
                className="absolute inset-0 rounded-2xl border-2 flex flex-col items-center justify-center text-center p-6"
                style={{
                  background: cardTints[i % 4],
                  borderColor: cardBorders[i % 4],
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                }}
              >
                <p className="font-bold text-base text-primary mb-2">{front}</p>
                <p className="text-sm text-foreground/80 leading-relaxed">{back}</p>
              </div>
            </motion.div>
          </div>
        ))}
      </div>
      <Button onClick={() => onComplete(true)}
        disabled={!allDone}
        className={cn("px-8 rounded-xl transition-opacity", !allDone && "opacity-40 pointer-events-none")}>
        Continue
      </Button>
    </motion.div>
  );
}

/* ─── Fill Blank ─── */
function FillBlankView({ step, onComplete }: { step: FillBlankStep; onComplete: (c: boolean) => void }) {
  const [sel, setSel] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const parts = step.sentence.split('___');

  const pick = (i: number) => {
    if (submitted) return;
    setSel(i);
  };

  const submit = () => {
    if (sel === null || submitted) return;
    setSubmitted(true);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-6 px-6 w-full min-h-[85vh]" style={{ maxWidth: '720px', margin: '0 auto' }}>
      <span className="text-xs font-bold text-primary uppercase tracking-widest">✦ FILL IN THE BLANK</span>
      <p className="text-lg lg:text-xl text-foreground text-center leading-relaxed" style={{ maxWidth: '720px' }}>
        {parts[0]}
        <span className={cn("inline-block px-3 py-1 mx-1 rounded-lg font-bold min-w-[80px] text-center transition-all",
          submitted
            ? (sel === step.correct ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400")
            : sel !== null ? "bg-primary/20 text-primary border border-primary/40" : "border-2 border-dashed border-primary/30 text-muted-foreground"
        )}>{sel !== null ? step.options[sel] : '\u00A0\u00A0\u00A0'}</span>
        {parts.slice(1).join('')}
      </p>
      <div className="grid grid-cols-2 gap-3 w-full" style={{ maxWidth: '680px' }}>
        {step.options.map((o, i) => (
          <Button key={i}
            variant={submitted && i === sel ? (i === step.correct ? "default" : "destructive") : sel === i ? "default" : "outline"}
            onClick={() => pick(i)} disabled={submitted}
            className={cn("text-[17px] rounded-xl transition-all py-5",
              submitted && i === step.correct && "border-emerald-500 bg-emerald-500/10 text-emerald-400"
            )}>{o}</Button>
        ))}
      </div>
      {sel !== null && !submitted && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Button onClick={submit} className="px-10 rounded-xl text-base" size="lg">Submit</Button>
        </motion.div>
      )}
      {submitted && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full flex flex-col items-center gap-4" style={{ maxWidth: '680px' }}>
          <p className={cn("text-sm text-center p-4 rounded-xl w-full leading-relaxed",
            sel === step.correct ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
          )}>
            {sel === step.correct
              ? "Correct! Well done."
              : `The correct answer is "${step.options[step.correct]}".`}
          </p>
          <Button onClick={() => onComplete(sel === step.correct)} className="px-12 rounded-xl gap-2 text-base font-bold" size="lg" style={{ width: '100%', maxWidth: '600px' }}>
            Continue <ArrowRight className="w-4 h-4" />
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}

/* ─── Drag Sort (tap-to-order) — Desktop sized ─── */
function DragSortView({ step, onComplete }: { step: DragSortStep; onComplete: (c: boolean) => void }) {
  const [shuffled] = useState(() => [...step.items].sort(() => Math.random() - 0.5));
  const [order, setOrder] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const addItem = (item: string) => {
    if (order.includes(item) || submitted) return;
    setOrder(prev => [...prev, item]);
  };
  const removeItem = (idx: number) => {
    if (submitted) return;
    setOrder(prev => prev.filter((_, i) => i !== idx));
  };
  const reset = () => { setOrder([]); setSubmitted(false); };

  const handleSubmit = () => {
    const correct = order.every((v, i) => v === step.items[i]);
    setIsCorrect(correct);
    setSubmitted(true);
  };

  const allFilled = order.length === shuffled.length;

  const ordinalLabels = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-5 px-6 w-full min-h-[85vh]" style={{ maxWidth: '900px', margin: '0 auto' }}>
      <span className="text-xs font-bold text-primary uppercase tracking-widest">✦ PUT IN ORDER</span>
      <h2 className="text-lg lg:text-xl font-bold text-foreground text-center" style={{ maxWidth: '720px' }}>{step.prompt}</h2>

      {/* Slots — horizontal row on desktop */}
      <div className="flex flex-wrap gap-3 w-full justify-center">
        {step.items.map((_, i) => (
          <div key={i}
            onClick={() => order[i] && removeItem(i)}
            className={cn(
              "rounded-xl border-2 border-dashed flex items-center justify-center text-center transition-all cursor-pointer",
              order[i]
                ? submitted
                  ? order[i] === step.items[i] ? "border-emerald-500/50 bg-emerald-500/10" : "border-red-500/50 bg-red-500/10"
                  : "border-primary/40 bg-primary/5"
                : "border-border/40"
            )}
            style={{ minWidth: '180px', height: '60px', pointerEvents: 'auto' }}
          >
            {order[i] ? (
              <span className="text-sm font-medium text-foreground px-3">{order[i]}</span>
            ) : (
              <span className="text-xs text-muted-foreground/50">{ordinalLabels[i] || `${i+1}th`}</span>
            )}
          </div>
        ))}
      </div>

      {/* Item bank */}
      <div className="flex flex-wrap gap-3 w-full justify-center">
        {shuffled.map((item, i) => (
          <Button key={i} variant="outline" onClick={() => addItem(item)}
            disabled={order.includes(item)}
            className={cn("text-sm rounded-xl whitespace-normal h-auto py-3 px-5 text-left", order.includes(item) && "opacity-30")}
            style={{ minWidth: '160px' }}
          >{item}</Button>
        ))}
      </div>

      <div className="flex gap-3 items-center">
        {order.length > 0 && !submitted && (
          <Button variant="ghost" onClick={reset} className="text-sm text-muted-foreground">Reset All</Button>
        )}
        {allFilled && !submitted && (
          <Button onClick={handleSubmit} className="px-10 rounded-xl text-base" size="lg">Submit</Button>
        )}
      </div>

      {submitted && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full flex flex-col items-center gap-4" style={{ maxWidth: '680px' }}>
          <p className={cn("text-sm text-center p-4 rounded-xl w-full",
            isCorrect ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
          )}>
            {isCorrect ? "Perfect order! Well done." : "Not quite right. Try again!"}
          </p>
          {isCorrect ? (
            <Button onClick={() => onComplete(true)} className="px-12 rounded-xl gap-2 text-base font-bold" size="lg" style={{ width: '100%', maxWidth: '600px' }}>
              Continue <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button variant="outline" onClick={reset} className="rounded-xl">Try Again</Button>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}

/* ─── Quiz — Manual continue, desktop sized ─── */
function QuizView({ step, onComplete }: { step: QuizStep; onComplete: (c: boolean) => void }) {
  const [sel, setSel] = useState<number | null>(null);
  const pick = (i: number) => {
    if (sel !== null) return;
    setSel(i);
  };
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-5 px-6 w-full min-h-[85vh]" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <span className="text-xs font-bold text-primary uppercase tracking-widest">✦ MULTIPLE CHOICE</span>
      <h2 className="text-lg lg:text-xl font-bold text-foreground text-center leading-snug" style={{ maxWidth: '720px' }}>{step.question}</h2>
      <div className="flex flex-col gap-3 w-full" style={{ maxWidth: '680px' }}>
        {step.options.map((o, i) => (
          <Button key={i} variant={sel === i ? (i === step.correct ? "default" : "destructive") : "outline"}
            onClick={() => pick(i)} disabled={sel !== null}
            className={cn("justify-start text-left rounded-xl h-auto whitespace-normal leading-relaxed",
              "text-[17px] py-5 px-5",
              sel !== null && i === step.correct && "border-emerald-500 bg-emerald-500/10 text-emerald-400"
            )}>{o}</Button>
        ))}
      </div>
      {sel !== null && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full flex flex-col items-center gap-4" style={{ maxWidth: '680px' }}>
          <p className={cn("text-sm text-center p-4 rounded-xl leading-relaxed w-full",
            sel === step.correct ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
          )}>{step.explanation}</p>
          <Button onClick={() => onComplete(sel === step.correct)} className="px-12 rounded-xl gap-2 text-base font-bold" size="lg" style={{ width: '100%', maxWidth: '600px' }}>
            Continue <ArrowRight className="w-4 h-4" />
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}

/* ─── True/False — with explanation panel ─── */
function TrueFalseView({ step, onComplete }: { step: TrueFalseStep; onComplete: (c: boolean) => void }) {
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [lastCorrect, setLastCorrect] = useState<boolean | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const current = step.statements[idx];

  const answer = (val: boolean) => {
    if (answered) return;
    setAnswered(true);
    const correct = val === current.a;
    setLastCorrect(correct);
    if (correct) setScore(s => s + 1);
    setShowExplanation(true);
  };

  const dismiss = () => {
    setShowExplanation(false);
    const correct = lastCorrect;
    if (idx + 1 < step.statements.length) {
      setIdx(i => i + 1); setAnswered(false); setLastCorrect(null);
    } else {
      onComplete(score + (correct ? 0 : 0) >= Math.ceil(step.statements.length / 2));
    }
  };

  const getExplanation = () => {
    const s = current.s.toLowerCase();
    if (s.includes('expert')) {
      return `${current.a ? 'True' : 'False'}. Index funds were specifically created so that non-experts could invest successfully by buying the entire market rather than trying to pick winners. Vanguard's Total Stock Market Index Fund requires zero expertise and has outperformed 92% of professional fund managers over 15-year periods.`;
    }
    if (s.includes('saving alone')) {
      return `${current.a ? 'True' : 'False'}. At 3% inflation, money in savings loses purchasing power every year. You need investment returns exceeding inflation to build real wealth over time.`;
    }
    if (s.includes('always recovered')) {
      return `${current.a ? 'True' : 'False'}. The U.S. stock market has recovered from every crash in history — including the Great Depression, 2008, and COVID. The longest recovery took about 5.5 years.`;
    }
    if (s.includes('25 vs 35') || s.includes('starting')) {
      return `${current.a ? 'True' : 'False'}. Thanks to compound growth, starting 10 years earlier with the same contributions can result in 2-3x more wealth at retirement. Time is the most powerful variable.`;
    }
    if (s.includes('lost money') && s.includes('20-year')) {
      return `${current.a ? 'True' : 'False'}. A diversified portfolio of U.S. stocks has generated positive returns in every 20-year rolling period in market history, including periods spanning the Great Depression and 2008 crisis.`;
    }
    return `${current.a ? 'True' : 'False'}. This is an important concept to understand as you build your investing knowledge.`;
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-6 px-6 w-full min-h-[85vh]" style={{ maxWidth: '700px', margin: '0 auto' }}>
      <span className="text-xs font-bold text-primary uppercase tracking-widest">✦ TRUE OR FALSE</span>
      <p className="text-xs text-muted-foreground">{idx + 1} of {step.statements.length}</p>
      <AnimatePresence mode="wait">
        <motion.div key={idx} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
          className={cn("w-full p-6 rounded-2xl border text-center",
            lastCorrect === true ? "border-emerald-500/50 bg-emerald-500/10" :
            lastCorrect === false ? "border-red-500/50 bg-red-500/10" : "border-border"
          )} style={{ background: lastCorrect === null ? 'rgba(255,255,255,0.03)' : undefined, maxWidth: '680px' }}>
          <p className="text-lg lg:text-xl font-semibold text-foreground">{current.s}</p>
        </motion.div>
      </AnimatePresence>
      {!answered && (
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => answer(true)} className="px-10 py-5 rounded-xl text-lg text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10">True</Button>
          <Button variant="outline" onClick={() => answer(false)} className="px-10 py-5 rounded-xl text-lg text-red-400 border-red-500/30 hover:bg-red-500/10">False</Button>
        </div>
      )}
      <AnimatePresence>
        {showExplanation && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className="w-full p-5 rounded-2xl" style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(139,92,246,0.2)',
              maxWidth: '680px',
            }}>
            <p className={cn("text-sm font-bold mb-2", lastCorrect ? "text-emerald-400" : "text-red-400")}>
              {lastCorrect ? '✓ Correct!' : '✗ Incorrect'}
            </p>
            <p className="text-sm text-foreground/90 leading-relaxed mb-4">{getExplanation()}</p>
            <Button onClick={dismiss} className="rounded-xl px-8" size="lg">
              {idx + 1 < step.statements.length ? 'Next Statement' : 'Finish'}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── Match — Desktop two-column with icons and progress counter ─── */
function MatchView({ step, onComplete }: { step: MatchStep; onComplete: (c: boolean) => void }) {
  const [shuffledRight] = useState(() => [...step.pairs.map(p => p[1])].sort(() => Math.random() - 0.5));
  const [selLeft, setSelLeft] = useState<number | null>(null);
  const [matched, setMatched] = useState<Map<number, number>>(new Map());
  const [wrong, setWrong] = useState<{ left: number; right: number } | null>(null);
  const tapLeft = (i: number) => { if (!matched.has(i)) { setSelLeft(i); setWrong(null); } };
  const tapRight = (ri: number) => {
    if (selLeft === null) return;
    const correctRight = step.pairs[selLeft][1];
    if (shuffledRight[ri] === correctRight) {
      const next = new Map(matched).set(selLeft, ri);
      setMatched(next); setSelLeft(null);
      if (next.size === step.pairs.length) setTimeout(() => onComplete(true), 600);
    } else {
      setWrong({ left: selLeft, right: ri });
      setTimeout(() => { setWrong(null); setSelLeft(null); }, 600);
    }
  };

  const matchedRightIndices = new Set(matched.values());

  // Icons for common asset matching
  const getIcon = (term: string) => {
    const t = term.toLowerCase();
    if (t.includes('stock')) return <TrendingUp className="w-5 h-5 text-primary/60" />;
    if (t.includes('bond')) return <Shield className="w-5 h-5 text-primary/60" />;
    if (t.includes('real estate')) return <Home className="w-5 h-5 text-primary/60" />;
    if (t.includes('cash')) return <Coins className="w-5 h-5 text-primary/60" />;
    return <BarChart3 className="w-5 h-5 text-primary/60" />;
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-4 px-6 w-full min-h-[85vh]" style={{ maxWidth: '900px', margin: '0 auto' }}>
      <span className="text-xs font-bold text-primary uppercase tracking-widest">✦ MATCH THE PAIRS</span>
      <h2 className="text-lg lg:text-xl font-bold text-foreground">{step.title}</h2>
      <p className="text-sm text-muted-foreground">{matched.size} of {step.pairs.length} matched</p>

      {/* Desktop: two columns, 380px each, 48px gap */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 w-full justify-center">
        {/* Left column — asset names with icons */}
        <div className="flex flex-col gap-3" style={{ width: '100%', maxWidth: '380px' }}>
          {step.pairs.map((p, i) => (
            <motion.div key={i} whileTap={{ scale: 0.97 }} onClick={() => tapLeft(i)}
              className={cn("flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all",
                matched.has(i) ? "bg-emerald-500/10 border-emerald-500/40 opacity-60" :
                selLeft === i ? "bg-primary/15 border-primary ring-2 ring-primary/20" :
                wrong?.left === i ? "bg-red-500/10 border-red-500/40" :
                "border-border/60 hover:border-primary/50"
              )} style={{ height: '90px', pointerEvents: 'auto', background: matched.has(i) ? undefined : 'rgba(255,255,255,0.02)' }}>
              {getIcon(p[0])}
              <span className="text-base font-medium text-foreground">{p[0]}</span>
            </motion.div>
          ))}
        </div>
        {/* Right column — descriptions */}
        <div className="flex flex-col gap-3" style={{ width: '100%', maxWidth: '380px' }}>
          {shuffledRight.map((r, ri) => {
            const isMatched = matchedRightIndices.has(ri);
            return (
              <motion.div key={ri} whileTap={{ scale: 0.97 }} onClick={() => tapRight(ri)}
                className={cn("flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all",
                  isMatched ? "bg-emerald-500/10 border-emerald-500/40 opacity-60" :
                  wrong?.right === ri ? "bg-red-500/10 border-red-500/40" :
                  selLeft !== null ? "border-border/60 hover:border-accent" : "border-border/40"
                )} style={{ height: '90px', pointerEvents: 'auto', background: isMatched ? undefined : 'rgba(255,255,255,0.02)' }}>
                <span className="text-sm text-foreground leading-relaxed">{r}</span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Slider — with reveal state, manual continue ─── */
function SliderView({ step, onComplete }: { step: SliderStep; onComplete: (c: boolean) => void }) {
  const [val, setVal] = useState(Math.round((step.min + step.max) / 2));
  const [submitted, setSubmitted] = useState(false);
  const [showReveal, setShowReveal] = useState(false);

  const submit = () => {
    setSubmitted(true);
    setTimeout(() => setShowReveal(true), 300);
  };

  const tolerance = (step.max - step.min) * 0.15;
  const isClose = Math.abs(val - step.correct) <= tolerance;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-6 px-6 w-full min-h-[85vh]" style={{ maxWidth: '700px', margin: '0 auto' }}>
      <span className="text-xs font-bold text-primary uppercase tracking-widest">✦ SLIDER PREDICTION</span>
      <h2 className="text-lg lg:text-xl font-bold text-foreground text-center" style={{ maxWidth: '720px' }}>{step.question}</h2>
      <div className="w-full px-4" style={{ maxWidth: '680px' }}>
        <Slider min={step.min} max={step.max} step={1}
          value={[submitted && showReveal ? step.correct : val]}
          onValueChange={([v]) => !submitted && setVal(v)}
          disabled={submitted} className="w-full" />
      </div>
      <p className="text-3xl font-black text-primary">{submitted && showReveal ? step.correct : val}{step.unit}</p>
      {showReveal && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="w-full p-5 rounded-2xl text-center" style={{
            background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)',
            maxWidth: '680px',
          }}>
          <p className="text-sm text-muted-foreground mb-1">The actual answer is</p>
          <p className="text-2xl font-black text-primary mb-3">~{step.correct}{step.unit}</p>
          <p className="text-sm text-foreground/80 leading-relaxed">
            After 30 years of investing $400 per month at 8% annual return, your total contributions would be approximately $144,000. Your final balance would be approximately $600,000. That means $456,000 — over 75% — came from compound returns, not your own money.
          </p>
        </motion.div>
      )}
      {!submitted && <Button onClick={submit} className="px-10 rounded-xl text-base" size="lg">Submit</Button>}
      {showReveal && (
        <Button onClick={() => onComplete(isClose)} className="px-12 rounded-xl gap-2 text-base font-bold" size="lg" style={{ width: '100%', maxWidth: '600px' }}>
          Continue <ArrowRight className="w-4 h-4" />
        </Button>
      )}
    </motion.div>
  );
}

/* ─── Scenario — Manual continue ─── */
function ScenarioView({ step, onComplete }: { step: ScenarioStep; onComplete: (c: boolean) => void }) {
  const [sel, setSel] = useState<number | null>(null);
  const pick = (i: number) => {
    if (sel !== null) return;
    setSel(i);
  };
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-5 px-6 w-full min-h-[85vh]" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <span className="text-xs font-bold text-primary uppercase tracking-widest">✦ SCENARIO</span>
      {/* Scenario card */}
      <div className="w-full p-5 rounded-2xl" style={{
        background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.15)',
        maxWidth: '720px',
      }}>
        <p className="text-base text-foreground leading-relaxed">{step.situation}</p>
      </div>
      <div className="flex flex-col gap-3 w-full" style={{ maxWidth: '680px' }}>
        {step.choices.map((ch, i) => (
          <div key={i}>
            <Button variant={sel === i ? (ch.correct ? "default" : "destructive") : "outline"}
              onClick={() => pick(i)} disabled={sel !== null}
              className="w-full justify-start text-left rounded-xl h-auto py-4 px-5 whitespace-normal leading-relaxed text-[17px]">{ch.label}</Button>
            {sel === i && (
              <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                className={cn("text-sm mt-2 p-4 rounded-xl leading-relaxed", ch.correct ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400")}>{ch.outcome}</motion.p>
            )}
          </div>
        ))}
      </div>
      {sel !== null && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full flex justify-center">
          <Button onClick={() => onComplete(step.choices[sel].correct)} className="px-12 rounded-xl gap-2 text-base font-bold" size="lg" style={{ width: '100%', maxWidth: '600px' }}>
            Continue <ArrowRight className="w-4 h-4" />
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}

/* ─── Build It ─── */
function BuildItView({ step, onComplete }: { step: BuildItStep; onComplete: (c: boolean) => void }) {
  const [selections, setSelections] = useState<(number | null)[]>(new Array(step.slots.length).fill(null));
  const [done, setDone] = useState(false);
  const setSlot = (si: number, oi: number) => { const next = [...selections]; next[si] = oi; setSelections(next); };
  const submit = () => {
    setDone(true);
    const correct = selections.every((s, i) => s === step.slots[i].correct);
    setTimeout(() => onComplete(correct), 1200);
  };
  const allFilled = selections.every(s => s !== null);
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-5 px-6 w-full min-h-[85vh]" style={{ maxWidth: '700px', margin: '0 auto' }}>
      <h2 className="text-lg font-bold text-foreground">{step.title}</h2>
      <p className="text-sm text-muted-foreground">{step.instruction}</p>
      <div className="flex flex-col gap-4 w-full">
        {step.slots.map((slot, si) => (
          <div key={si} className="flex flex-col gap-2">
            <p className="text-sm font-semibold text-foreground">{slot.label}</p>
            <div className="flex gap-2 flex-wrap">
              {slot.options.map((o, oi) => (
                <Button key={oi} size="sm" variant={selections[si] === oi ? (done ? (oi === slot.correct ? "default" : "destructive") : "default") : "outline"}
                  onClick={() => !done && setSlot(si, oi)} className="text-xs rounded-xl">{o}</Button>
              ))}
            </div>
          </div>
        ))}
      </div>
      {allFilled && !done && <Button onClick={submit} className="px-8 rounded-xl">Check</Button>}
    </motion.div>
  );
}

/* ─── Progressive Calc ─── */
function ProgressiveCalcView({ step, onComplete }: { step: ProgressiveCalcStep; onComplete: (c: boolean) => void }) {
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [sel, setSel] = useState<number | null>(null);
  const current = step.calcSteps[idx];
  const pick = (i: number) => {
    if (sel !== null) return;
    setSel(i);
    const correct = i === current.correct;
    if (correct) setScore(s => s + 1);
    setTimeout(() => {
      if (idx + 1 < step.calcSteps.length) { setIdx(x => x + 1); setSel(null); }
      else { onComplete(score + (correct ? 1 : 0) >= Math.ceil(step.calcSteps.length / 2)); }
    }, 800);
  };
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-5 px-6 w-full min-h-[85vh]" style={{ maxWidth: '700px', margin: '0 auto' }}>
      <h2 className="text-lg font-bold text-foreground">{step.title}</h2>
      <p className="text-xs text-muted-foreground">Step {idx + 1} of {step.calcSteps.length}</p>
      <AnimatePresence mode="wait">
        <motion.div key={idx} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
          className="w-full p-5 rounded-2xl border border-border text-center" style={{ background: 'rgba(255,255,255,0.03)' }}>
          <p className="text-base text-foreground">{current.prompt}</p>
        </motion.div>
      </AnimatePresence>
      <div className="grid grid-cols-2 gap-2 w-full" style={{ maxWidth: '680px' }}>
        {current.options.map((o, i) => (
          <Button key={i} variant={sel === i ? (i === current.correct ? "default" : "destructive") : "outline"}
            onClick={() => pick(i)} disabled={sel !== null} className="text-sm rounded-xl">{o}</Button>
        ))}
      </div>
    </motion.div>
  );
}

/* ─── Visual Interactive ─── */
function VisualInteractiveView({ step, onComplete }: { step: VisualInteractiveStep; onComplete: (c: boolean) => void }) {
  const [sel, setSel] = useState<number | null>(null);
  const pick = (i: number) => {
    if (sel !== null) return;
    setSel(i);
  };
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-5 px-6 w-full min-h-[85vh]" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="w-full p-5 rounded-2xl border border-border text-center" style={{ background: 'rgba(255,255,255,0.03)', maxWidth: '720px' }}>
        <p className="text-sm text-muted-foreground italic">{step.description}</p>
      </div>
      <h2 className="text-lg lg:text-xl font-bold text-foreground text-center" style={{ maxWidth: '720px' }}>{step.question}</h2>
      <div className="flex flex-col gap-3 w-full" style={{ maxWidth: '680px' }}>
        {step.options.map((o, i) => (
          <Button key={i} variant={sel === i ? (i === step.correct ? "default" : "destructive") : "outline"}
            onClick={() => pick(i)} disabled={sel !== null}
            className={cn("justify-start text-left rounded-xl h-auto py-4 px-5 whitespace-normal leading-relaxed text-[17px]",
              sel !== null && i === step.correct && "border-emerald-500 bg-emerald-500/10 text-emerald-400"
            )}>{o}</Button>
        ))}
      </div>
      {sel !== null && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full flex justify-center">
          <Button onClick={() => onComplete(sel === step.correct)} className="px-12 rounded-xl gap-2 text-base font-bold" size="lg" style={{ width: '100%', maxWidth: '600px' }}>
            Continue <ArrowRight className="w-4 h-4" />
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}

/* ─── Main Router ─── */
export function StepRenderer({ step, onComplete, onClose }: Props) {
  switch (step.type) {
    case 'concept': return <ConceptView step={step} onComplete={onComplete} />;
    case 'tapReveal': return <TapRevealView step={step} onComplete={onComplete} />;
    case 'fillBlank': return <FillBlankView step={step} onComplete={onComplete} />;
    case 'dragSort': return <DragSortView step={step} onComplete={onComplete} />;
    case 'quiz': return <QuizView step={step} onComplete={onComplete} />;
    case 'trueFalse': return <TrueFalseView step={step} onComplete={onComplete} />;
    case 'match': return <MatchView step={step} onComplete={onComplete} />;
    case 'slider': return <SliderView step={step} onComplete={onComplete} />;
    case 'scenario': return <ScenarioView step={step} onComplete={onComplete} />;
    case 'buildIt': return <BuildItView step={step} onComplete={onComplete} />;
    case 'progressiveCalc': return <ProgressiveCalcView step={step} onComplete={onComplete} />;
    case 'visualInteractive': return <VisualInteractiveView step={step} onComplete={onComplete} />;
    case 'hookOpener': return <HookOpenerView step={step} onComplete={onComplete} />;
    case 'stakesCard': return <StakesCardView step={step} onComplete={onComplete} />;
    case 'teachingSlide': return <TeachingSlideView step={step} onComplete={onComplete} />;
    case 'microCheck': return <MicroCheckView step={step} onComplete={onComplete} />;
    case 'interactiveGraph': return <InteractiveGraphView step={step} onComplete={onComplete} />;
    case 'caseStudy': return <CaseStudyView step={step} onComplete={onComplete} />;
    case 'misconceptions': return <MisconceptionsView step={step} onComplete={onComplete} />;
    case 'keyTermsCards': return <KeyTermsCardsView step={step} onComplete={onComplete} />;
    case 'simulationFinale': return <SimulationFinaleView step={step} onComplete={onComplete} />;
    case 'summaryCards': return <SummaryCardsView step={step} onComplete={onComplete} />;
    case 'whatsNext': return <WhatsNextView step={step} onComplete={onComplete} onClose={onClose} />;
    default: return null;
  }
}

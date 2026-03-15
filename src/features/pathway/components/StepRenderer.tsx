
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Slider } from '@/components/ui/slider';
import type { LessonStep, ConceptStep, TapRevealStep, FillBlankStep, DragSortStep, QuizStep, TrueFalseStep, MatchStep, SliderStep, ScenarioStep, BuildItStep, ProgressiveCalcStep, VisualInteractiveStep } from '../types';

interface Props { step: LessonStep; onComplete: (correct: boolean) => void; }

/* ─── Concept ─── */
function ConceptView({ step, onComplete }: { step: ConceptStep; onComplete: (c: boolean) => void }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-6 text-center px-4">
      <span className="text-6xl">{step.emoji}</span>
      <h2 className="text-2xl font-black text-foreground">{step.title}</h2>
      <p className="text-muted-foreground leading-relaxed max-w-md text-base">{step.body}</p>
      <Button onClick={() => onComplete(true)} className="mt-4 px-8 rounded-xl">Continue</Button>
    </motion.div>
  );
}

/* ─── Tap Reveal ─── */
function TapRevealView({ step, onComplete }: { step: TapRevealStep; onComplete: (c: boolean) => void }) {
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const toggle = (i: number) => setRevealed(prev => new Set(prev).add(i));
  const allDone = revealed.size === step.cards.length;
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-5 px-4 w-full max-w-lg mx-auto">
      <h2 className="text-xl font-bold text-foreground">{step.title}</h2>
      <p className="text-sm text-muted-foreground">Tap each card to reveal</p>
      <div className="grid grid-cols-2 gap-3 w-full">
        {step.cards.map(([front, back], i) => (
          <motion.div key={i} whileTap={{ scale: 0.95 }} onClick={() => toggle(i)}
            className={cn("p-4 rounded-xl border cursor-pointer min-h-[90px] flex items-center justify-center text-center transition-all",
              revealed.has(i) ? "bg-primary/10 border-primary/40" : "bg-card border-border hover:border-primary/50"
            )}>
            {revealed.has(i) ? (
              <div><p className="font-bold text-sm text-primary">{front}</p><p className="text-xs text-muted-foreground mt-1">{back}</p></div>
            ) : <span className="text-3xl text-muted-foreground">?</span>}
          </motion.div>
        ))}
      </div>
      {allDone && <Button onClick={() => onComplete(true)} className="px-8 rounded-xl">Continue</Button>}
    </motion.div>
  );
}

/* ─── Fill Blank ─── */
function FillBlankView({ step, onComplete }: { step: FillBlankStep; onComplete: (c: boolean) => void }) {
  const [sel, setSel] = useState<number | null>(null);
  const [done, setDone] = useState(false);
  const parts = step.sentence.split('___');
  const pick = (i: number) => {
    if (done) return;
    setSel(i); setDone(true);
    setTimeout(() => onComplete(i === step.correct), 1200);
  };
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-6 px-4 w-full max-w-lg mx-auto">
      <p className="text-lg text-foreground text-center leading-relaxed">
        {parts[0]}
        <span className={cn("inline-block px-3 py-1 mx-1 rounded-lg font-bold min-w-[80px] text-center",
          sel !== null ? (sel === step.correct ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400") : "bg-primary/20 text-primary"
        )}>{sel !== null ? step.options[sel] : '???'}</span>
        {parts.slice(1).join('')}
      </p>
      <div className="grid grid-cols-2 gap-2 w-full">
        {step.options.map((o, i) => (
          <Button key={i} variant={sel === i ? (i === step.correct ? "default" : "destructive") : "outline"}
            onClick={() => pick(i)} disabled={done} className="text-sm rounded-xl">{o}</Button>
        ))}
      </div>
    </motion.div>
  );
}

/* ─── Drag Sort (tap-to-order) ─── */
function DragSortView({ step, onComplete }: { step: DragSortStep; onComplete: (c: boolean) => void }) {
  const [shuffled] = useState(() => [...step.items].sort(() => Math.random() - 0.5));
  const [order, setOrder] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const addItem = (item: string) => {
    if (order.includes(item) || done) return;
    const next = [...order, item];
    setOrder(next);
    if (next.length === shuffled.length) {
      setDone(true);
      const correct = next.every((v, i) => v === step.items[i]);
      setTimeout(() => onComplete(correct), 1000);
    }
  };
  const reset = () => { setOrder([]); setDone(false); };
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-5 px-4 w-full max-w-lg mx-auto">
      <h2 className="text-lg font-bold text-foreground text-center">{step.prompt}</h2>
      <p className="text-xs text-muted-foreground">Tap items in the correct order</p>
      <div className="flex flex-col gap-2 w-full min-h-[120px] p-3 rounded-xl border border-dashed border-border bg-card/50">
        {order.length === 0 && <p className="text-xs text-muted-foreground text-center py-4">Tap items below to order them</p>}
        {order.map((item, i) => (
          <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-primary/10 border border-primary/30">
            <span className="text-xs font-bold text-primary w-5">{i + 1}.</span>
            <span className="text-sm text-foreground">{item}</span>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2 w-full">
        {shuffled.map((item, i) => (
          <Button key={i} variant="outline" size="sm" onClick={() => addItem(item)}
            disabled={order.includes(item)} className={cn("text-xs rounded-xl", order.includes(item) && "opacity-40")}>{item}</Button>
        ))}
      </div>
      {done && !order.every((v, i) => v === step.items[i]) && (
        <Button variant="outline" size="sm" onClick={reset} className="rounded-xl">Try Again</Button>
      )}
    </motion.div>
  );
}

/* ─── Quiz ─── */
function QuizView({ step, onComplete }: { step: QuizStep; onComplete: (c: boolean) => void }) {
  const [sel, setSel] = useState<number | null>(null);
  const pick = (i: number) => {
    if (sel !== null) return;
    setSel(i);
    setTimeout(() => onComplete(i === step.correct), 1500);
  };
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-5 px-4 w-full max-w-lg mx-auto">
      <h2 className="text-lg font-bold text-foreground text-center">{step.question}</h2>
      <div className="flex flex-col gap-2 w-full">
        {step.options.map((o, i) => (
          <Button key={i} variant={sel === i ? (i === step.correct ? "default" : "destructive") : "outline"}
            onClick={() => pick(i)} disabled={sel !== null}
            className={cn("justify-start text-left text-sm rounded-xl h-auto py-3 px-4",
              sel !== null && i === step.correct && "border-emerald-500 bg-emerald-500/10 text-emerald-400"
            )}>{o}</Button>
        ))}
      </div>
      {sel !== null && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={cn("text-sm text-center p-3 rounded-xl",
          sel === step.correct ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
        )}>{step.explanation}</motion.p>
      )}
    </motion.div>
  );
}

/* ─── True/False ─── */
function TrueFalseView({ step, onComplete }: { step: TrueFalseStep; onComplete: (c: boolean) => void }) {
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [lastCorrect, setLastCorrect] = useState<boolean | null>(null);
  const current = step.statements[idx];
  const answer = (val: boolean) => {
    if (answered) return;
    setAnswered(true);
    const correct = val === current.a;
    setLastCorrect(correct);
    if (correct) setScore(s => s + 1);
    setTimeout(() => {
      if (idx + 1 < step.statements.length) {
        setIdx(i => i + 1); setAnswered(false); setLastCorrect(null);
      } else {
        onComplete(score + (correct ? 1 : 0) >= Math.ceil(step.statements.length / 2));
      }
    }, 1000);
  };
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-6 px-4 w-full max-w-lg mx-auto">
      <p className="text-xs text-muted-foreground">{idx + 1} of {step.statements.length}</p>
      <AnimatePresence mode="wait">
        <motion.div key={idx} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
          className={cn("w-full p-6 rounded-2xl border text-center",
            lastCorrect === true ? "border-emerald-500/50 bg-emerald-500/10" :
            lastCorrect === false ? "border-red-500/50 bg-red-500/10" : "border-border bg-card"
          )}>
          <p className="text-lg font-semibold text-foreground">{current.s}</p>
        </motion.div>
      </AnimatePresence>
      <div className="flex gap-4">
        <Button variant="outline" onClick={() => answer(true)} disabled={answered} className="px-8 rounded-xl text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10">True</Button>
        <Button variant="outline" onClick={() => answer(false)} disabled={answered} className="px-8 rounded-xl text-red-400 border-red-500/30 hover:bg-red-500/10">False</Button>
      </div>
    </motion.div>
  );
}

/* ─── Match ─── */
function MatchView({ step, onComplete }: { step: MatchStep; onComplete: (c: boolean) => void }) {
  const [shuffledRight] = useState(() => [...step.pairs.map(p => p[1])].sort(() => Math.random() - 0.5));
  const [selLeft, setSelLeft] = useState<number | null>(null);
  const [matched, setMatched] = useState<Map<number, number>>(new Map());
  const [wrong, setWrong] = useState<number | null>(null);
  const tapLeft = (i: number) => { if (!matched.has(i)) setSelLeft(i); };
  const tapRight = (ri: number) => {
    if (selLeft === null) return;
    const correctRight = step.pairs[selLeft][1];
    if (shuffledRight[ri] === correctRight) {
      const next = new Map(matched).set(selLeft, ri);
      setMatched(next);
      setSelLeft(null);
      if (next.size === step.pairs.length) setTimeout(() => onComplete(true), 600);
    } else {
      setWrong(ri);
      setTimeout(() => { setWrong(null); setSelLeft(null); }, 600);
    }
  };
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-4 px-4 w-full max-w-lg mx-auto">
      <h2 className="text-lg font-bold text-foreground">{step.title}</h2>
      <p className="text-xs text-muted-foreground">Tap a term, then tap its match</p>
      <div className="grid grid-cols-2 gap-3 w-full">
        <div className="flex flex-col gap-2">
          {step.pairs.map((p, i) => (
            <motion.div key={i} whileTap={{ scale: 0.95 }} onClick={() => tapLeft(i)}
              className={cn("p-3 rounded-xl border text-sm cursor-pointer transition-all text-center",
                matched.has(i) ? "bg-emerald-500/10 border-emerald-500/40 opacity-60" :
                selLeft === i ? "bg-primary/20 border-primary" : "bg-card border-border hover:border-primary/50"
              )}>{p[0]}</motion.div>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          {shuffledRight.map((r, i) => {
            const isMatched = [...matched.values()].includes(i);
            return (
              <motion.div key={i} whileTap={{ scale: 0.95 }} onClick={() => tapRight(i)}
                className={cn("p-3 rounded-xl border text-sm cursor-pointer transition-all text-center",
                  isMatched ? "bg-emerald-500/10 border-emerald-500/40 opacity-60" :
                  wrong === i ? "bg-red-500/10 border-red-500/40" : "bg-card border-border hover:border-primary/50"
                )}>{r}</motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Slider ─── */
function SliderView({ step, onComplete }: { step: SliderStep; onComplete: (c: boolean) => void }) {
  const [val, setVal] = useState(Math.round((step.min + step.max) / 2));
  const [submitted, setSubmitted] = useState(false);
  const submit = () => {
    setSubmitted(true);
    const tolerance = (step.max - step.min) * 0.15;
    setTimeout(() => onComplete(Math.abs(val - step.correct) <= tolerance), 1500);
  };
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-6 px-4 w-full max-w-lg mx-auto">
      <h2 className="text-lg font-bold text-foreground text-center">{step.question}</h2>
      <div className="w-full px-4">
        <Slider min={step.min} max={step.max} step={1} value={[val]} onValueChange={([v]) => setVal(v)} disabled={submitted} className="w-full" />
      </div>
      <p className="text-3xl font-black text-primary">{val}{step.unit}</p>
      {submitted && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
          <p className="text-sm text-muted-foreground">The answer is</p>
          <p className="text-2xl font-black text-emerald-400">{step.correct}{step.unit}</p>
        </motion.div>
      )}
      {!submitted && <Button onClick={submit} className="px-8 rounded-xl">Submit</Button>}
    </motion.div>
  );
}

/* ─── Scenario ─── */
function ScenarioView({ step, onComplete }: { step: ScenarioStep; onComplete: (c: boolean) => void }) {
  const [sel, setSel] = useState<number | null>(null);
  const pick = (i: number) => {
    if (sel !== null) return;
    setSel(i);
    setTimeout(() => onComplete(step.choices[i].correct), 2000);
  };
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-5 px-4 w-full max-w-lg mx-auto">
      <div className="w-full p-5 rounded-2xl bg-card border border-border">
        <p className="text-base text-foreground leading-relaxed">{step.situation}</p>
      </div>
      <div className="flex flex-col gap-2 w-full">
        {step.choices.map((ch, i) => (
          <div key={i}>
            <Button variant={sel === i ? (ch.correct ? "default" : "destructive") : "outline"}
              onClick={() => pick(i)} disabled={sel !== null} className="w-full justify-start text-sm rounded-xl h-auto py-3 px-4">{ch.label}</Button>
            {sel === i && (
              <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                className={cn("text-xs mt-1 p-3 rounded-lg", ch.correct ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400")}>{ch.outcome}</motion.p>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ─── Build It ─── */
function BuildItView({ step, onComplete }: { step: BuildItStep; onComplete: (c: boolean) => void }) {
  const [selections, setSelections] = useState<(number | null)[]>(new Array(step.slots.length).fill(null));
  const [done, setDone] = useState(false);
  const setSlot = (si: number, oi: number) => {
    const next = [...selections]; next[si] = oi; setSelections(next);
  };
  const submit = () => {
    setDone(true);
    const correct = selections.every((s, i) => s === step.slots[i].correct);
    setTimeout(() => onComplete(correct), 1200);
  };
  const allFilled = selections.every(s => s !== null);
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-5 px-4 w-full max-w-lg mx-auto">
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
      if (idx + 1 < step.calcSteps.length) {
        setIdx(x => x + 1); setSel(null);
      } else {
        onComplete(score + (correct ? 1 : 0) >= Math.ceil(step.calcSteps.length / 2));
      }
    }, 800);
  };
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-5 px-4 w-full max-w-lg mx-auto">
      <h2 className="text-lg font-bold text-foreground">{step.title}</h2>
      <p className="text-xs text-muted-foreground">Step {idx + 1} of {step.calcSteps.length}</p>
      <AnimatePresence mode="wait">
        <motion.div key={idx} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
          className="w-full p-5 rounded-2xl bg-card border border-border text-center">
          <p className="text-base text-foreground">{current.prompt}</p>
        </motion.div>
      </AnimatePresence>
      <div className="grid grid-cols-2 gap-2 w-full">
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
    setTimeout(() => onComplete(i === step.correct), 1200);
  };
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-5 px-4 w-full max-w-lg mx-auto">
      <div className="w-full p-5 rounded-2xl bg-card/80 border border-border text-center">
        <p className="text-sm text-muted-foreground italic">{step.description}</p>
      </div>
      <h2 className="text-lg font-bold text-foreground text-center">{step.question}</h2>
      <div className="flex flex-col gap-2 w-full">
        {step.options.map((o, i) => (
          <Button key={i} variant={sel === i ? (i === step.correct ? "default" : "destructive") : "outline"}
            onClick={() => pick(i)} disabled={sel !== null} className="justify-start text-sm rounded-xl h-auto py-3 px-4">{o}</Button>
        ))}
      </div>
    </motion.div>
  );
}

/* ─── Main Router ─── */
export function StepRenderer({ step, onComplete }: Props) {
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
    default: return null;
  }
}

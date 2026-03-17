
import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { ArrowRight, Check, X as XIcon, ChevronLeft, ChevronRight, Sparkles, TrendingUp, AlertTriangle, BookOpen, Zap, Heart } from 'lucide-react';
import type {
  HookOpenerStep, StakesCardStep, TeachingSlideStep, MicroCheckStep,
  InteractiveGraphStep, CaseStudyStep, MisconceptionsStep, KeyTermsCardsStep,
  SimulationFinaleStep, SummaryCardsStep, WhatsNextStep
} from '../types';
import {
  HookChartRiskReward, HookChartCompounding, HookChartStocksBonds, HookChartDiversification,
  StakesIllustrationRisk, StakesIllustrationDiversified,
  StakesIllustrationLateStart, StakesIllustrationEarlyStart,
  StakesIllustrationAllStocks, StakesIllustrationBalanced,
  StakesIllustrationConcentrated, StakesIllustrationDiversifiedGrid,
  DiagramRiskSpectrum, DiagramSnowball, DiagramStockVsBond, DiagramCorrelationMatrix
} from './LessonVisuals';

/* ─── Helpers to detect lesson context ─── */
function detectLesson(title: string): number {
  const t = title.toLowerCase();
  if (t.includes('risk') && t.includes('reward')) return 2;
  if (t.includes('compound') || t.includes('magic')) return 3;
  if (t.includes('stocks') && t.includes('bonds')) return 4;
  if (t.includes('diversif')) return 5;
  return 1;
}

/* ─── Hook Opener ─── */
export function HookOpenerView({ step, onComplete }: { step: HookOpenerStep; onComplete: (c: boolean) => void }) {
  const [animPhase, setAnimPhase] = useState(0);
  const lessonNum = detectLesson(step.title);

  useEffect(() => {
    const t1 = setTimeout(() => setAnimPhase(1), 400);
    const t2 = setTimeout(() => setAnimPhase(2), 1000);
    const t3 = setTimeout(() => setAnimPhase(3), 1600);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  const renderChart = () => {
    // If the step provides custom SVG, render it directly
    if (step.chartSvg) {
      return <div dangerouslySetInnerHTML={{ __html: step.chartSvg }} className="w-full flex items-center justify-center" style={{ minHeight: '280px' }} />;
    }
    switch (lessonNum) {
      case 2: return <HookChartRiskReward animPhase={animPhase} />;
      case 3: return <HookChartCompounding animPhase={animPhase} />;
      case 4: return <HookChartStocksBonds animPhase={animPhase} />;
      case 5: return <HookChartDiversification animPhase={animPhase} />;
      default:
        // Lesson 1 — original S&P 500 growth chart
        return (
          <svg viewBox="0 0 700 350" className="w-full h-auto" style={{ pointerEvents: 'auto', minHeight: '280px' }}>
            <defs>
              <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
              </linearGradient>
            </defs>
            {[80, 140, 200, 260].map(y => (
              <line key={y} x1="60" y1={y} x2="660" y2={y} stroke="rgba(139,92,246,0.12)" strokeWidth="0.5" strokeDasharray="4 4" />
            ))}
            <motion.path
              d="M60,300 Q120,298 180,290 Q240,275 300,250 Q360,210 420,160 Q480,105 540,65 Q600,45 660,35"
              fill="none" stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round"
              initial={{ pathLength: 0 }} animate={{ pathLength: animPhase >= 1 ? 1 : 0 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
            <motion.path
              d="M60,300 Q120,298 180,290 Q240,275 300,250 Q360,210 420,160 Q480,105 540,65 Q600,45 660,35 L660,320 L60,320 Z"
              fill="url(#chartGrad)"
              initial={{ opacity: 0 }} animate={{ opacity: animPhase >= 2 ? 0.6 : 0 }}
              transition={{ duration: 0.8 }}
            />
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: animPhase >= 2 ? 1 : 0 }} transition={{ delay: 0.3 }}>
              <text x="60" y="340" fill="rgba(255,255,255,0.5)" fontSize="13" textAnchor="middle">1990</text>
              <text x="360" y="340" fill="rgba(255,255,255,0.5)" fontSize="13" textAnchor="middle">2007</text>
              <text x="660" y="340" fill="rgba(255,255,255,0.5)" fontSize="13" textAnchor="middle">2024</text>
            </motion.g>
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: animPhase >= 3 ? 1 : 0 }}>
              <circle cx="60" cy="300" r="6" fill="hsl(var(--primary))" />
              <text x="80" y="295" fill="white" fontSize="16" fontWeight="bold">$1K</text>
              <circle cx="660" cy="35" r="7" fill="hsl(var(--primary))" />
              <text x="635" y="26" fill="white" fontSize="17" fontWeight="bold" textAnchor="end">$23K</text>
            </motion.g>
          </svg>
        );
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-0 w-full min-h-[85vh] relative">
      <div className="w-full flex-1 flex items-center justify-center px-0 py-6" style={{
        background: 'linear-gradient(180deg, #1a0a2e 0%, #0d0618 60%, transparent 100%)',
      }}>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, duration: 0.8 }}
          className="w-full px-4" style={{ maxWidth: '800px' }}>
          {renderChart()}
          <p className="text-xs text-center text-muted-foreground mt-2 italic">{step.visualDescription}</p>
        </motion.div>
      </div>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
        className="mx-4 -mt-4 mb-8 p-8 rounded-2xl text-center self-center" style={{
          maxWidth: '700px', width: '100%',
          background: 'rgba(255, 255, 255, 0.04)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(139, 92, 246, 0.2)',
        }}>
        <h1 className="text-3xl font-black text-foreground mb-4 tracking-tight">{step.title}</h1>
        <p className="text-base text-muted-foreground leading-relaxed mb-3">{step.fact}</p>
        <p className="text-sm text-foreground/70 leading-relaxed">{step.outcome}</p>
        <Button onClick={() => onComplete(true)} className="mt-6 px-10 rounded-xl gap-2 text-base font-bold" size="lg">
          Begin <ArrowRight className="w-4 h-4" />
        </Button>
      </motion.div>
    </motion.div>
  );
}

/* ─── Stakes Card ─── */
export function StakesCardView({ step, onComplete }: { step: StakesCardStep; onComplete: (c: boolean) => void }) {
  const lessonNum = detectLessonFromStakes(step);

  function detectLessonFromStakes(s: StakesCardStep): number {
    const w = s.without.label.toLowerCase();
    if (w.includes('single stock') && w.includes('80%')) return 2;
    if (w.includes('22') || w.includes('starting at')) return 3;
    if (w.includes('100% stocks') && w.includes('2008')) return 4;
    if (w.includes('meta') || w.includes('100%')) return 5;
    return 1;
  }

  const renderWithoutSVG = () => {
    if (step.withoutSvg) {
      return <div dangerouslySetInnerHTML={{ __html: step.withoutSvg }} className="w-full flex items-center justify-center" />;
    }
    switch (lessonNum) {
      case 2: return <StakesIllustrationRisk />;
      case 3: return <StakesIllustrationLateStart />;
      case 4: return <StakesIllustrationAllStocks />;
      case 5: return <StakesIllustrationConcentrated />;
      default: return (
        <svg viewBox="0 0 360 200" className="w-full" style={{ maxWidth: '440px' }}>
          <rect x="30" y="40" width="70" height="120" rx="10" fill="rgba(239,68,68,0.10)" stroke="rgba(239,68,68,0.3)" strokeWidth="1.5" />
          <text x="65" y="95" textAnchor="middle" fill="#f87171" fontSize="22" fontWeight="bold">$10K</text>
          <text x="65" y="178" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="11">Today</text>
          <line x1="110" y1="100" x2="130" y2="100" stroke="rgba(239,68,68,0.4)" strokeWidth="1.5" />
          <polygon points="128,96 136,100 128,104" fill="rgba(239,68,68,0.4)" />
          <rect x="140" y="60" width="70" height="100" rx="10" fill="rgba(239,68,68,0.08)" stroke="rgba(239,68,68,0.25)" strokeWidth="1.5" />
          <text x="175" y="105" textAnchor="middle" fill="#f87171" fontSize="20" fontWeight="bold">$8.5K</text>
          <text x="175" y="178" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="11">5 Years</text>
          <line x1="220" y1="110" x2="240" y2="110" stroke="rgba(239,68,68,0.4)" strokeWidth="1.5" />
          <polygon points="238,106 246,110 238,114" fill="rgba(239,68,68,0.4)" />
          <rect x="250" y="85" width="70" height="75" rx="10" fill="rgba(239,68,68,0.06)" stroke="rgba(239,68,68,0.2)" strokeWidth="1.5" />
          <text x="285" y="118" textAnchor="middle" fill="#f87171" fontSize="18" fontWeight="bold">$7.4K</text>
          <text x="285" y="178" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="11">10 Years</text>
          <line x1="65" y1="30" x2="285" y2="75" stroke="#ef4444" strokeWidth="2" strokeDasharray="6,4" />
          <polygon points="282,70 290,77 282,80" fill="#ef4444" />
          <text x="180" y="16" textAnchor="middle" fill="#ef4444" fontSize="12" fontWeight="600">Purchasing power lost to inflation</text>
        </svg>
      );
    }
  };

  const renderWithSVG = () => {
    if (step.withSvg) {
      return <div dangerouslySetInnerHTML={{ __html: step.withSvg }} className="w-full flex items-center justify-center" />;
    }
    switch (lessonNum) {
      case 2: return <StakesIllustrationDiversified />;
      case 3: return <StakesIllustrationEarlyStart />;
      case 4: return <StakesIllustrationBalanced />;
      case 5: return <StakesIllustrationDiversifiedGrid />;
      default: return (
        <svg viewBox="0 0 280 220" className="w-full" style={{ maxWidth: '320px', maxHeight: '220px' }}>
          <rect x="50" y="140" width="50" height="60" rx="6" fill="rgba(16,185,129,0.15)" stroke="rgba(16,185,129,0.4)" strokeWidth="1.5" />
          <text x="75" y="175" textAnchor="middle" fill="#10b981" fontSize="11" fontWeight="bold">$5K</text>
          <rect x="115" y="95" width="50" height="105" rx="6" fill="rgba(16,185,129,0.2)" stroke="rgba(16,185,129,0.5)" strokeWidth="1.5" />
          <text x="140" y="155" textAnchor="middle" fill="#10b981" fontSize="11" fontWeight="bold">$15K</text>
          <rect x="180" y="35" width="50" height="165" rx="6" fill="rgba(16,185,129,0.3)" stroke="rgba(16,185,129,0.6)" strokeWidth="2" />
          <text x="205" y="125" textAnchor="middle" fill="#10b981" fontSize="12" fontWeight="bold">$26K</text>
          <line x1="205" y1="30" x2="205" y2="-5" stroke="#10b981" strokeWidth="3" />
          <polygon points="198,-3 205,-15 212,-3" fill="#10b981" />
          <text x="205" y="-20" textAnchor="middle" fill="#10b981" fontSize="13" fontWeight="bold">+10% avg return</text>
          <text x="75" y="212" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="10">Year 5</text>
          <text x="140" y="212" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="10">Year 15</text>
          <text x="205" y="212" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="10">Year 30</text>
        </svg>
      );
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-6 w-full min-h-[85vh] pt-4 px-6">
      <h2 className="text-2xl font-black text-foreground text-center">Why This Matters</h2>
      <div className="flex flex-col lg:flex-row gap-6 w-full" style={{ maxWidth: '1100px' }}>
        {/* WITHOUT panel */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
          className="flex-1 p-8 rounded-2xl border-2 border-red-500/30 flex flex-col gap-4" style={{
            background: 'rgba(239,68,68,0.04)', minHeight: '55vh',
          }}>
          <div className="flex items-center gap-2">
            <XIcon className="w-5 h-5 text-red-400" />
            <span className="text-sm font-bold text-red-400 uppercase tracking-wider">
              {step.withoutLabel || (lessonNum === 2 ? 'Concentrated' : lessonNum === 3 ? 'Starting Late' : lessonNum === 4 ? '100% Stocks' : lessonNum === 5 ? 'Single Stock' : 'Without Investing')}
            </span>
          </div>
          <div className="flex-1 flex items-center justify-center px-4">
            {renderWithoutSVG()}
          </div>
          <p className="text-base font-semibold text-foreground">{step.without.label}</p>
          <p className="text-sm text-muted-foreground leading-relaxed">{step.without.detail}</p>
        </motion.div>
        {/* WITH panel */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}
          className="flex-1 p-8 rounded-2xl border-2 border-emerald-500/30 flex flex-col gap-4" style={{
            background: 'rgba(16,185,129,0.04)', minHeight: '55vh',
          }}>
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 text-emerald-400" />
            <span className="text-sm font-bold text-emerald-400 uppercase tracking-wider">
              {step.withLabel || (lessonNum === 2 ? 'Diversified' : lessonNum === 3 ? 'Starting Early' : lessonNum === 4 ? '60/40 Balanced' : lessonNum === 5 ? 'Diversified Portfolio' : 'With Investing')}
            </span>
          </div>
          <div className="flex-1 flex items-center justify-center">
            {renderWithSVG()}
          </div>
          <p className="text-base font-semibold text-foreground">{step.with.label}</p>
          <p className="text-sm text-muted-foreground leading-relaxed">{step.with.detail}</p>
        </motion.div>
      </div>
      <Button onClick={() => onComplete(true)} className="px-10 rounded-xl gap-2 text-base font-bold" size="lg">
        Continue <ArrowRight className="w-4 h-4" />
      </Button>
    </motion.div>
  );
}

/* ─── Teaching Slide ─── */
export function TeachingSlideView({ step, onComplete }: { step: TeachingSlideStep; onComplete: (c: boolean) => void }) {
  const [revealedTerms, setRevealedTerms] = useState<Set<string>>(new Set());
  const [activeTerm, setActiveTerm] = useState<string | null>(null);
  const [canContinue, setCanContinue] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const lessonNum = detectLesson(step.title);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setCanContinue(true); },
      { rootMargin: '100px', threshold: 0.1 }
    );
    if (bottomRef.current) observer.observe(bottomRef.current);
    return () => observer.disconnect();
  }, []);

  const toggleTerm = (term: string) => {
    setRevealedTerms(prev => new Set(prev).add(term));
    setActiveTerm(activeTerm === term ? null : term);
  };

  const activeTermData = step.highlightedTerms.find(t => t.term === activeTerm);

  const renderParagraph = (text: string, idx: number) => {
    return (
      <p key={idx} className="text-sm lg:text-base text-foreground/90 leading-relaxed">
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

  const renderDiagram = () => {
    if (step.diagramSvg) {
      return <div dangerouslySetInnerHTML={{ __html: step.diagramSvg }} className="w-full flex items-center justify-center" />;
    }
    switch (lessonNum) {
      case 2: return <DiagramRiskSpectrum />;
      case 3: return <DiagramSnowball />;
      case 4: return <DiagramStockVsBond />;
      case 5: return <DiagramCorrelationMatrix />;
      default:
        // Lesson 1 — Bank → Inflation → Investment flow
        return (
          <svg viewBox="0 0 480 520" className="w-full h-auto" style={{ minHeight: '420px' }}>
            <motion.g initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <rect x="130" y="20" width="220" height="100" rx="14" fill="rgba(59,130,246,0.12)" stroke="rgba(59,130,246,0.4)" strokeWidth="2" />
              <text x="240" y="60" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">Bank Account</text>
              <text x="240" y="88" textAnchor="middle" fill="#10b981" fontSize="14">1% return</text>
            </motion.g>
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              <line x1="240" y1="125" x2="240" y2="175" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
              <polygon points="234,172 240,184 246,172" fill="rgba(255,255,255,0.3)" />
              <text x="260" y="158" fill="#ef4444" fontSize="13" fontWeight="bold">loses to</text>
            </motion.g>
            <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
              <rect x="130" y="190" width="220" height="100" rx="14" fill="rgba(239,68,68,0.1)" stroke="rgba(239,68,68,0.4)" strokeWidth="2" />
              <text x="240" y="230" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">Inflation</text>
              <text x="240" y="258" textAnchor="middle" fill="#f59e0b" fontSize="14">3% per year</text>
            </motion.g>
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
              <line x1="240" y1="295" x2="240" y2="345" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
              <polygon points="234,342 240,354 246,342" fill="rgba(255,255,255,0.3)" />
              <text x="260" y="328" fill="#10b981" fontSize="13" fontWeight="bold">beaten by</text>
            </motion.g>
            <motion.g initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.9 }}>
              <rect x="130" y="360" width="220" height="100" rx="14" fill="rgba(16,185,129,0.12)" stroke="rgba(16,185,129,0.4)" strokeWidth="2" />
              <text x="240" y="400" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">Investment</text>
              <text x="240" y="428" textAnchor="middle" fill="#10b981" fontSize="14">8-10% return</text>
            </motion.g>
          </svg>
        );
    }
  };

  return (
    <motion.div ref={scrollRef} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="w-full min-h-[85vh]">
      <div className="flex flex-col lg:flex-row w-full" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Left column — text content */}
        <div className="flex-1 lg:w-[55%] flex flex-col gap-5 px-6 lg:px-10 py-6 lg:overflow-y-auto" style={{ maxHeight: 'calc(100vh - 56px)' }}>
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold text-primary uppercase tracking-widest">{step.sectionLabel}</span>
          </div>
          <h2 className="text-2xl lg:text-3xl font-black text-foreground">{step.title}</h2>
          <div className="flex flex-col gap-4">
            {step.paragraphs.map((p, i) => renderParagraph(p, i))}
          </div>
          <AnimatePresence>
            {activeTermData && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                className="p-4 rounded-2xl" style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.3)' }}>
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
          {step.realExample && (
            <div className="p-4 rounded-2xl" style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)' }}>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold text-primary uppercase">Real Example</span>
              </div>
              <p className="text-sm text-foreground"><strong>{step.realExample.company}</strong> — {step.realExample.metric}</p>
              <p className="text-xs text-muted-foreground mt-1">{step.realExample.explanation}</p>
            </div>
          )}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="text-primary">💡</span>
            <span>Tap underlined terms to see definitions</span>
          </div>
          <div ref={bottomRef} />
          <Button onClick={() => onComplete(true)}
            disabled={!canContinue}
            className={cn("px-8 rounded-xl self-center gap-2 transition-opacity mb-6", !canContinue && "opacity-40 pointer-events-none")}>
            Continue <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
        {/* Right column — sticky diagram (desktop only) */}
        <div className="hidden lg:flex lg:w-[45%] items-start justify-center py-6 px-6" style={{
          position: 'sticky', top: '56px', height: 'calc(100vh - 56px)',
          background: 'rgba(255,255,255,0.015)',
          borderLeft: '1px solid rgba(139,92,246,0.1)',
        }}>
          <div className="w-full flex items-center justify-center h-full">
            <div className="w-full p-6 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(139,92,246,0.15)' }}>
              {renderDiagram()}
            </div>
          </div>
        </div>
        {/* Mobile: inline diagram */}
        <div className="lg:hidden px-6 pb-6">
          <div className="w-full p-4 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(139,92,246,0.15)' }}>
            {renderDiagram()}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Micro Check — Manual Continue (no auto-advance) ─── */
export function MicroCheckView({ step, onComplete }: { step: MicroCheckStep; onComplete: (c: boolean) => void }) {
  const [sel, setSel] = useState<number | null>(null);
  const isCorrect = sel !== null && sel === step.correct;

  const pick = (i: number) => {
    if (sel !== null) return;
    setSel(i);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-5 w-full min-h-[85vh] px-6 pt-4">
      <span className="text-xs font-bold text-primary uppercase tracking-widest">✦ QUICK CHECK</span>
      <h2 className="text-lg lg:text-xl font-bold text-foreground text-center" style={{ maxWidth: '720px' }}>{step.question}</h2>
      <div className="flex flex-col gap-3 w-full" style={{ maxWidth: '680px' }}>
        {step.options.map((o, i) => (
          <Button key={i}
            variant={sel === i ? (i === step.correct ? "default" : "destructive") : "outline"}
            onClick={() => pick(i)} disabled={sel !== null}
            className={cn("justify-start text-left rounded-xl h-auto whitespace-normal leading-relaxed",
              "text-[17px] py-5 px-5",
              sel !== null && i === step.correct && "border-emerald-500 bg-emerald-500/10 text-emerald-400"
            )}>{o}</Button>
        ))}
      </div>
      {sel !== null && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full flex flex-col items-center gap-4" style={{ maxWidth: '680px' }}>
          <p className={cn("text-sm text-center p-4 rounded-xl w-full leading-relaxed",
            isCorrect ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
          )}>
            {isCorrect ? step.explanationCorrect : step.explanationWrong}
          </p>
          <Button onClick={() => onComplete(isCorrect)} className="px-12 rounded-xl gap-2 text-base font-bold" size="lg" style={{ width: '100%', maxWidth: '600px' }}>
            Continue <ArrowRight className="w-4 h-4" />
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}

/* ─── Interactive Graph (supports exponential, comparison, pie) ─── */
export function InteractiveGraphView({ step, onComplete }: { step: InteractiveGraphStep; onComplete: (c: boolean) => void }) {
  const defaultSliders = step.sliders?.map(s => s.default) ?? [];
  const [values, setValues] = useState<number[]>(defaultSliders);
  const [revealedInsights, setRevealedInsights] = useState(0);
  const [touched, setTouched] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowPrompt(true), 1000);
    return () => clearTimeout(t);
  }, []);

  const updateSlider = (idx: number, val: number) => {
    setTouched(true);
    const next = [...values];
    next[idx] = val;
    setValues(next);
    if (revealedInsights < step.insights.length) {
      setRevealedInsights(prev => Math.min(prev + 1, step.insights.length));
    }
  };

  // Exponential graph calculations
  const computedValue = useMemo(() => {
    if (step.graphType === 'exponential' && step.sliders && values.length >= 2) {
      if (step.sliders.length >= 3) {
        // 3-slider: starting amount, monthly contribution, annual return
        const principal = values[0];
        const monthly = values[1];
        const rate = values[2] / 100;
        const years = 40; // fixed for compound calc
        const monthlyRate = rate / 12;
        const months = years * 12;
        const futureVal = principal * Math.pow(1 + rate, years) + monthly * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
        return Math.round(futureVal);
      }
      const principal = 1000;
      const rate = values[0] / 100;
      const years = values[1];
      return Math.round(principal * Math.pow(1 + rate, years));
    }
    return 0;
  }, [step.graphType, step.sliders, values]);

  const curvePoints = useMemo(() => {
    if (step.graphType !== 'exponential' || !step.sliders || values.length < 2) return '';
    const rate = (step.sliders.length >= 3 ? values[2] : values[0]) / 100;
    const years = step.sliders.length >= 3 ? 40 : values[1];
    const principal = step.sliders.length >= 3 ? values[0] : 1000;
    const monthly = step.sliders.length >= 3 ? values[1] : 0;
    const points: string[] = [];
    let maxVal = principal;
    // Calculate max for scaling
    for (let y = 0; y <= years; y++) {
      const monthlyRate = rate / 12;
      const months = y * 12;
      const val = principal * Math.pow(1 + rate, y) + (monthly > 0 ? monthly * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) : 0);
      if (val > maxVal) maxVal = val;
    }
    const chartH = 230;
    const chartW = 620;
    for (let y = 0; y <= years; y++) {
      const monthlyRate = rate / 12;
      const months = y * 12;
      const val = principal * Math.pow(1 + rate, y) + (monthly > 0 ? monthly * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) : 0);
      const x = 60 + (y / Math.max(years, 1)) * chartW;
      const yPos = 260 - (val / Math.max(maxVal, 1)) * chartH;
      points.push(`${x},${yPos}`);
    }
    return points.join(' ');
  }, [step.graphType, values, step.sliders]);

  const yLabels = useMemo(() => {
    if (step.graphType !== 'exponential' || !step.sliders || values.length < 2) return [];
    const rate = (step.sliders.length >= 3 ? values[2] : values[0]) / 100;
    const years = step.sliders.length >= 3 ? 40 : values[1];
    const principal = step.sliders.length >= 3 ? values[0] : 1000;
    const monthly = step.sliders.length >= 3 ? values[1] : 0;
    const monthlyRate = rate / 12;
    const months = years * 12;
    const maxVal = principal * Math.pow(1 + rate, years) + (monthly > 0 ? monthly * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) : 0);
    return [0, 0.25, 0.5, 0.75, 1].map(frac => {
      const val = Math.round(maxVal * frac);
      const yPos = 260 - frac * 230;
      return { val: val >= 1000000 ? `$${(val / 1000000).toFixed(1)}M` : val >= 1000 ? `$${(val / 1000).toFixed(0)}K` : `$${val}`, y: yPos };
    });
  }, [step.graphType, values, step.sliders]);

  // Comparison graph calculations
  const comparisonData = useMemo(() => {
    if (step.graphType !== 'comparison' || !step.sliders || values.length < 2) return null;
    const stockAlloc = values[0] / 100;
    const years = values[1];
    const stockReturn = 0.10;
    const bondReturn = 0.05;

    const conservativeLine: string[] = [];
    const aggressiveLine: string[] = [];
    const chartW = 620;
    const chartH = 230;

    // Conservative: 40% stocks, 60% bonds (or slider-based)
    const consStock = Math.min(stockAlloc, 0.4);
    const consBond = 1 - consStock;
    const consRate = consStock * stockReturn + consBond * bondReturn;

    // Aggressive: slider-based
    const aggRate = stockAlloc * stockReturn + (1 - stockAlloc) * bondReturn;

    let maxVal = 10000;
    for (let y = 0; y <= years; y++) {
      const consVal = 10000 * Math.pow(1 + consRate, y);
      const aggVal = 10000 * Math.pow(1 + aggRate, y);
      if (consVal > maxVal) maxVal = consVal;
      if (aggVal > maxVal) maxVal = aggVal;
    }

    for (let y = 0; y <= years; y++) {
      const x = 60 + (y / Math.max(years, 1)) * chartW;
      const consVal = 10000 * Math.pow(1 + consRate, y);
      const aggVal = 10000 * Math.pow(1 + aggRate, y);
      conservativeLine.push(`${x},${260 - (consVal / maxVal) * chartH}`);
      aggressiveLine.push(`${x},${260 - (aggVal / maxVal) * chartH}`);
    }

    const finalCons = Math.round(10000 * Math.pow(1 + consRate, years));
    const finalAgg = Math.round(10000 * Math.pow(1 + aggRate, years));

    return {
      consPoints: conservativeLine.join(' '),
      aggPoints: aggressiveLine.join(' '),
      finalCons,
      finalAgg,
      years,
    };
  }, [step.graphType, values, step.sliders]);

  // Pie chart calculations
  const pieData = useMemo(() => {
    if (step.graphType !== 'pie' || !step.sliders) return null;
    const total = values.reduce((a, b) => a + b, 0);
    const normalized = values.map(v => total > 0 ? v / total : 0);
    const colors = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6'];
    const labels = step.sliders.map(s => s.label);

    // Calculate risk score (weighted by position)
    const riskWeights = [0.7, 0.8, 0.2, 0.5]; // US stocks=high, Intl=high, Bonds=low, RE=medium
    const riskScore = normalized.reduce((sum, n, i) => sum + n * (riskWeights[i] || 0.5) * 100, 0);
    const volatility = (riskScore * 0.25).toFixed(1);

    // Build SVG arc paths
    let cumAngle = -90;
    const arcs = normalized.map((frac, i) => {
      const angle = frac * 360;
      const startAngle = cumAngle;
      cumAngle += angle;
      const endAngle = cumAngle;
      const startRad = (startAngle * Math.PI) / 180;
      const endRad = (endAngle * Math.PI) / 180;
      const r = 90;
      const cx = 150;
      const cy = 150;
      const x1 = cx + r * Math.cos(startRad);
      const y1 = cy + r * Math.sin(startRad);
      const x2 = cx + r * Math.cos(endRad);
      const y2 = cy + r * Math.sin(endRad);
      const largeArc = angle > 180 ? 1 : 0;
      const d = frac > 0.001 ? `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${largeArc},1 ${x2},${y2} Z` : '';
      return { d, color: colors[i], label: labels[i], pct: Math.round(frac * 100) };
    });

    return { arcs, riskScore: Math.round(riskScore), volatility, total };
  }, [step.graphType, values, step.sliders]);

  const renderGraph = () => {
    if (step.graphType === 'comparison' && comparisonData) {
      return (
        <svg viewBox="0 0 720 300" className="w-full h-auto mb-4" style={{ minHeight: '260px' }}>
          {[80, 130, 180, 230].map(y => (
            <line key={y} x1="60" y1={y} x2="680" y2={y} stroke="rgba(139,92,246,0.1)" strokeWidth="0.5" strokeDasharray="4 4" />
          ))}
          {/* Conservative line */}
          <polyline points={comparisonData.consPoints} fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="8 4" />
          {/* Aggressive line */}
          <polyline points={comparisonData.aggPoints} fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />
          {/* Labels */}
          <text x="60" y="280" fill="rgba(255,255,255,0.5)" fontSize="12">Year 0</text>
          <text x="680" y="280" fill="rgba(255,255,255,0.5)" fontSize="12" textAnchor="end">Year {comparisonData.years}</text>
          {/* Legend */}
          <rect x="60" y="15" width="12" height="12" rx="3" fill="#10b981" />
          <text x="78" y="25" fill="#10b981" fontSize="11" fontWeight="600">Your allocation: ${comparisonData.finalAgg.toLocaleString()}</text>
          <rect x="350" y="15" width="12" height="12" rx="3" fill="#3b82f6" />
          <text x="368" y="25" fill="#3b82f6" fontSize="11" fontWeight="600">Conservative: ${comparisonData.finalCons.toLocaleString()}</text>
        </svg>
      );
    }

    if (step.graphType === 'pie' && pieData) {
      return (
        <div className="flex flex-col lg:flex-row items-center gap-6 mb-4">
          <svg viewBox="0 0 300 300" className="w-full lg:w-1/2 h-auto" style={{ maxWidth: '300px', minHeight: '250px' }}>
            {pieData.arcs.map((arc, i) => (
              arc.d && <motion.path key={i} d={arc.d} fill={arc.color} fillOpacity="0.6" stroke={arc.color} strokeWidth="2"
                initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: i * 0.1 }} />
            ))}
            <circle cx="150" cy="150" r="40" fill="#0d0618" />
            <text x="150" y="145" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">Risk</text>
            <text x="150" y="165" textAnchor="middle" fill="hsl(var(--primary))" fontSize="18" fontWeight="black">{pieData.riskScore}</text>
          </svg>
          <div className="flex flex-col gap-2 w-full lg:w-1/2">
            {pieData.arcs.map((arc, i) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded-lg" style={{ background: `${arc.color}11` }}>
                <div className="w-4 h-4 rounded" style={{ background: arc.color }} />
                <span className="text-sm text-foreground flex-1">{arc.label}</span>
                <span className="text-sm font-bold" style={{ color: arc.color }}>{arc.pct}%</span>
              </div>
            ))}
            <div className="mt-2 p-3 rounded-xl" style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)' }}>
              <p className="text-xs text-muted-foreground">Projected Annual Volatility</p>
              <p className="text-lg font-bold text-primary">±{pieData.volatility}%</p>
            </div>
          </div>
        </div>
      );
    }

    // Default: exponential
    return (
      <>
        <svg viewBox="0 0 720 300" className="w-full h-auto mb-4" style={{ pointerEvents: 'auto', minHeight: '260px' }}>
          <defs>
            <linearGradient id="igGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[80, 130, 180, 230].map(y => (
            <line key={y} x1="60" y1={y} x2="680" y2={y} stroke="rgba(139,92,246,0.1)" strokeWidth="0.5" strokeDasharray="4 4" />
          ))}
          {yLabels.map((l, i) => (
            <text key={i} x="50" y={l.y + 4} fill="rgba(255,255,255,0.4)" fontSize="11" textAnchor="end">{l.val}</text>
          ))}
          {curvePoints && (
            <>
              <polyline points={curvePoints} fill="none" stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round" />
              <polygon points={`${curvePoints} 680,260 60,260`} fill="url(#igGrad)" opacity="0.5" />
            </>
          )}
          <text x="60" y="280" fill="rgba(255,255,255,0.5)" fontSize="12">Year 0</text>
          <text x="680" y="280" fill="rgba(255,255,255,0.5)" fontSize="12" textAnchor="end">
            {step.sliders && step.sliders.length >= 3 ? 'Year 40' : `Year ${values[1] || 10}`}
          </text>
        </svg>
        <div className="text-center mb-4">
          <span className="text-xs text-muted-foreground">Final value: </span>
          <span className="text-2xl font-black text-primary">${computedValue.toLocaleString()}</span>
        </div>
      </>
    );
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-5 px-6 w-full min-h-[85vh]" style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div className="flex items-center gap-2">
        <TrendingUp className="w-4 h-4 text-primary" />
        <span className="text-xs font-bold text-primary uppercase tracking-widest">{step.sectionLabel}</span>
      </div>
      <h2 className="text-2xl lg:text-3xl font-black text-foreground">{step.title}</h2>

      <div className="w-full p-6 rounded-2xl relative" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(139,92,246,0.15)' }}>
        {renderGraph()}

        {/* Bouncing prompt arrow */}
        {showPrompt && !touched && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, -6, 0] }}
            transition={{ y: { repeat: Infinity, duration: 1.2 } }}
            className="flex items-center gap-2 justify-center mb-3"
          >
            <span className="text-primary text-[15px] font-medium">Try it yourself →</span>
          </motion.div>
        )}

        {step.sliders?.map((s, i) => (
          <div key={i} className="mb-4">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>{s.label}</span>
              <span className="font-bold text-foreground">
                {s.unit === '$' ? `$${values[i].toLocaleString()}` : `${values[i]}${s.unit}`}
              </span>
            </div>
            <Slider min={s.min} max={s.max} step={s.max > 1000 ? 100 : 1} value={[values[i]]}
              onValueChange={([v]) => updateSlider(i, v)} className="w-full" />
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {step.paragraphs.map((p, i) => (
          <p key={i} className="text-sm lg:text-base text-foreground/90 leading-relaxed">{p}</p>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        {step.insights.slice(0, revealedInsights).map((ins, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
            className="flex items-start gap-2 p-3 rounded-xl" style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.15)' }}>
            <span className="text-primary font-bold text-sm">{i + 1}.</span>
            <p className="text-xs text-foreground/80">{ins}</p>
          </motion.div>
        ))}
      </div>

      {step.realExample && (
        <div className="p-4 rounded-2xl" style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)' }}>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold text-primary uppercase">Real Example</span>
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
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);

  const revealNext = () => {
    if (revealedIdx < step.events.length) {
      setRevealedIdx(prev => prev + 1);
    }
  };

  const allRevealed = revealedIdx >= step.events.length;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-5 px-6 w-full min-h-[85vh]" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="flex items-center gap-2">
        <BookOpen className="w-4 h-4 text-primary" />
        <span className="text-xs font-bold text-primary uppercase tracking-widest">Real World</span>
      </div>
      <h2 className="text-2xl lg:text-3xl font-black text-foreground">{step.title}</h2>

      <div className="relative pl-6">
        <div className="absolute left-2 top-2 bottom-2 w-0.5" style={{ background: 'rgba(139,92,246,0.2)' }} />
        {step.events.map((evt, i) => (
          <motion.div key={i}
            ref={el => { nodeRefs.current[i] = el; }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: i < revealedIdx ? 1 : 0.2, y: i < revealedIdx ? 0 : 12 }}
            transition={{ duration: 0.4, delay: i < revealedIdx ? i * 0.15 : 0 }}
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
            className="p-4 rounded-2xl" style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.25)' }}>
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
  const [canContinue, setCanContinue] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setCanContinue(true); },
      { rootMargin: '100px', threshold: 0.1 }
    );
    if (bottomRef.current) observer.observe(bottomRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-5 px-6 w-full min-h-[85vh]" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-yellow-400" />
        <span className="text-xs font-bold text-yellow-400 uppercase tracking-widest">{step.title}</span>
      </div>
      <h2 className="text-xl lg:text-2xl font-black text-foreground">{step.subtitle}</h2>

      <div className="flex flex-col gap-4">
        {step.items.map((item, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: i <= revealedIdx ? 1 : 0.3, y: i <= revealedIdx ? 0 : 10 }}
            onClick={() => { if (i === revealedIdx && revealedIdx < step.items.length) setRevealedIdx(prev => prev + 1); }}
            style={{ cursor: i === revealedIdx ? 'pointer' : 'default', pointerEvents: 'auto' }}
            className={cn("p-4 rounded-2xl border transition-all",
              i <= revealedIdx ? "border-border/50 bg-card/50" : "border-border/20 bg-card/20"
            )}
          >
            <div className="flex items-start gap-3 mb-2">
              <XIcon className="w-4 h-4 text-muted-foreground/50 mt-0.5 shrink-0" />
              <p className="text-sm text-muted-foreground/40 line-through decoration-muted-foreground/30">{item.myth}</p>
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

      <div ref={bottomRef} />

      {revealedIdx > step.items.length - 1 && (
        <Button onClick={() => onComplete(true)}
          disabled={!canContinue}
          className={cn("px-8 rounded-xl self-center gap-2 transition-opacity", !canContinue && "opacity-40 pointer-events-none")}>
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
  const [saved, setSaved] = useState<Set<number>>(new Set());
  const viewTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    viewTimerRef.current = setTimeout(() => {
      setViewed(prev => new Set(prev).add(idx));
    }, 1500);
    return () => { if (viewTimerRef.current) clearTimeout(viewTimerRef.current); };
  }, [idx]);

  const goTo = (dir: number) => {
    setViewed(prev => new Set(prev).add(idx));
    const next = Math.max(0, Math.min(step.terms.length - 1, idx + dir));
    setIdx(next);
  };

  const toggleSave = () => {
    setSaved(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx); else next.add(idx);
      return next;
    });
  };

  const allViewed = viewed.size === step.terms.length;
  const term = step.terms[idx];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-5 px-6 w-full min-h-[85vh]" style={{ maxWidth: '700px', margin: '0 auto' }}>
      <div className="flex items-center gap-2">
        <BookOpen className="w-4 h-4 text-primary" />
        <span className="text-xs font-bold text-primary uppercase tracking-widest">Know the Language</span>
      </div>
      <p className="text-xs text-muted-foreground">These terms will appear throughout this pathway</p>

      <AnimatePresence mode="wait">
        <motion.div key={idx} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
          className="w-full p-8 rounded-2xl min-h-[240px] relative" style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(139,92,246,0.25)',
          }}>
          <button onClick={toggleSave} className="absolute top-4 right-4 p-1.5 rounded-full transition-colors hover:bg-primary/10" style={{ pointerEvents: 'auto' }}>
            <Heart className={cn("w-5 h-5 transition-all", saved.has(idx) ? "fill-primary text-primary" : "text-muted-foreground/40")} />
          </button>
          <h3 className="text-xl font-black text-foreground mb-3">{term.term}</h3>
          <p className="text-sm text-foreground/90 leading-relaxed mb-3">{term.definition}</p>
          <p className="text-xs text-muted-foreground italic mb-3">e.g., {term.example}</p>
          <div className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(139,92,246,0.1)' }}>
            <span className="text-xs text-muted-foreground">Used in a sentence:</span>
            <p className="text-sm text-foreground mt-1 italic">"{term.sentence}"</p>
          </div>
        </motion.div>
      </AnimatePresence>

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

      <Button onClick={() => onComplete(true)}
        disabled={!allViewed}
        className={cn("px-8 rounded-xl gap-2 transition-opacity", !allViewed && "opacity-40 pointer-events-none")}>
        Continue <ArrowRight className="w-4 h-4" />
      </Button>
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
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-5 px-6 w-full min-h-[85vh] text-center" style={{ maxWidth: '700px', margin: '0 auto' }}>
        <Sparkles className="w-10 h-10 text-primary" />
        <h2 className="text-2xl font-black text-foreground">Simulation Complete</h2>
        <div className="p-5 rounded-2xl w-full" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(139,92,246,0.2)' }}>
          <p className="text-sm text-muted-foreground mb-2">Your outcome</p>
          <p className="text-3xl font-black text-primary mb-4">{totalScore}/{maxScore}</p>
          <p className="text-sm text-muted-foreground mb-2">Optimal outcome</p>
          <p className="text-sm text-foreground mb-4">{step.optimalOutcome}</p>
          <div className="p-3 rounded-xl" style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}>
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
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-5 px-6 w-full min-h-[85vh]" style={{ maxWidth: '700px', margin: '0 auto' }}>
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

      <div className="w-full p-4 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(139,92,246,0.15)' }}>
        <p className="text-sm text-foreground font-medium mb-3">{currentDecision.prompt}</p>
        <div className="flex flex-col gap-2">
          {currentDecision.options.map((opt, i) => (
            <Button key={i} variant={choices[decisionIdx] === i ? "default" : "outline"}
              onClick={() => pick(i)} disabled={showConsequence}
              className="justify-start text-left text-sm rounded-xl h-auto py-3 px-4 whitespace-normal leading-relaxed">{opt.label}</Button>
          ))}
        </div>
      </div>

      {showConsequence && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="w-full p-4 rounded-2xl" style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.2)' }}>
          <p className="text-sm text-foreground leading-relaxed">{currentDecision.options[choices[decisionIdx]].consequence}</p>
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
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-5 px-6 w-full min-h-[85vh] text-center" style={{ maxWidth: '700px', margin: '0 auto' }}>
      <Sparkles className="w-8 h-8 text-primary" />
      <h2 className="text-2xl font-black text-foreground">Lesson Complete</h2>
      <p className="text-sm text-muted-foreground">{step.lessonTitle}</p>
      <p className="text-xs text-muted-foreground">Here's what you now know:</p>

      <AnimatePresence mode="wait">
        <motion.div key={idx} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
          className="w-full p-6 rounded-2xl min-h-[140px] flex flex-col justify-center" style={{
            background: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(139,92,246,0.05))',
            border: '1px solid rgba(139,92,246,0.2)',
          }}>
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
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-5 px-6 w-full min-h-[85vh] text-center" style={{ maxWidth: '700px', margin: '0 auto' }}>
      <h2 className="text-xl font-black text-foreground">You're Building Momentum</h2>

      <div className="w-full p-5 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(139,92,246,0.15)' }}>
        <p className="text-xs text-muted-foreground mb-3 uppercase tracking-widest font-bold">Next Lesson</p>
        <h3 className="text-lg font-bold text-foreground mb-2">{step.nextTitle}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-3">{step.preview}</p>
        <p className="text-xs text-muted-foreground">~{step.estimatedTime} minutes</p>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onClose} className="rounded-xl">Back to Dashboard</Button>
        <Button onClick={() => onComplete(true)} className="px-6 rounded-xl gap-2">
          Next Lesson <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
}

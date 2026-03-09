import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  ArrowLeft, CreditCard, TrendingUp, TrendingDown, Clock,
  ChevronRight, RotateCcw, Award, PieChart, Calendar,
  CheckCircle2, XCircle, AlertTriangle, Minus, Plus, Shield
} from "lucide-react";

// ─── Types ─────────────────────────────────────────────
interface FICOFactors {
  paymentHistory: number;   // 0-100 score within this factor
  creditUtilization: number;
  lengthOfHistory: number;
  creditMix: number;
  newInquiries: number;
}

interface CreditState {
  score: number;
  factors: FICOFactors;
  balance: number;
  creditLimit: number;
  accountAge: number; // months
  numAccounts: number;
  recentInquiries: number;
  missedPayments: number;
  onTimePayments: number;
  hasAutoLoan: boolean;
  hasMortgage: boolean;
}

interface Decision {
  id: string;
  label: string;
  icon: string;
  description: string;
  apply: (state: CreditState) => { state: CreditState; explanation: string; delta: number };
}

interface MonthEntry {
  month: number;
  score: number;
  delta: number;
  action: string;
  explanation: string;
}

interface Scenario {
  id: string;
  title: string;
  description: string;
  emoji: string;
  startingState: CreditState;
  goal: string;
  targetScore: number;
  maxMonths: number;
}

// ─── FICO Calculation ──────────────────────────────────
function calcFICOScore(f: FICOFactors): number {
  const raw = f.paymentHistory * 0.35 + f.creditUtilization * 0.30 +
    f.lengthOfHistory * 0.15 + f.creditMix * 0.10 + f.newInquiries * 0.10;
  return Math.round(300 + (raw / 100) * 550);
}

function updateFactors(s: CreditState): FICOFactors {
  const utilization = s.creditLimit > 0 ? (s.balance / s.creditLimit) * 100 : 100;
  const utilizationScore = utilization <= 10 ? 100 : utilization <= 30 ? 85 : utilization <= 50 ? 60 : utilization <= 75 ? 35 : 10;
  const totalPayments = s.onTimePayments + s.missedPayments;
  const paymentScore = totalPayments > 0 ? Math.round((s.onTimePayments / totalPayments) * 100) : 50;
  const historyScore = Math.min(100, Math.round((s.accountAge / 84) * 100)); // 7 years = 100
  const mixScore = [s.numAccounts > 0, s.hasAutoLoan, s.hasMortgage].filter(Boolean).length * 33;
  const inquiryScore = Math.max(0, 100 - s.recentInquiries * 20);

  return {
    paymentHistory: Math.max(0, Math.min(100, paymentScore)),
    creditUtilization: Math.max(0, Math.min(100, utilizationScore)),
    lengthOfHistory: Math.max(0, Math.min(100, historyScore)),
    creditMix: Math.max(0, Math.min(100, Math.round(mixScore))),
    newInquiries: Math.max(0, Math.min(100, inquiryScore)),
  };
}

// ─── Decisions ─────────────────────────────────────────
const DECISIONS: Decision[] = [
  {
    id: "pay-min", label: "Pay minimum balance", icon: "💳", description: "Pay the minimum due on time",
    apply: (s) => {
      const ns = { ...s, balance: Math.max(0, s.balance - 50), onTimePayments: s.onTimePayments + 1, accountAge: s.accountAge + 1 };
      ns.factors = updateFactors(ns);
      const newScore = calcFICOScore(ns.factors);
      const delta = newScore - s.score;
      return { state: { ...ns, score: newScore }, explanation: "On-time minimum payment helps payment history, but carrying a balance keeps utilization high.", delta };
    },
  },
  {
    id: "pay-full", label: "Pay full balance", icon: "✅", description: "Pay the entire statement balance",
    apply: (s) => {
      const ns = { ...s, balance: 0, onTimePayments: s.onTimePayments + 1, accountAge: s.accountAge + 1 };
      ns.factors = updateFactors(ns);
      const newScore = calcFICOScore(ns.factors);
      const delta = newScore - s.score;
      return { state: { ...ns, score: newScore }, explanation: "Paying in full keeps utilization near 0% — the best strategy for your score.", delta };
    },
  },
  {
    id: "miss-payment", label: "Miss this month's payment", icon: "❌", description: "Skip the payment entirely",
    apply: (s) => {
      const ns = { ...s, balance: Math.min(s.creditLimit, s.balance + 75), missedPayments: s.missedPayments + 1, accountAge: s.accountAge + 1 };
      ns.factors = updateFactors(ns);
      const newScore = calcFICOScore(ns.factors);
      const delta = newScore - s.score;
      return { state: { ...ns, score: newScore }, explanation: "Missed payments are devastating — payment history is 35% of your FICO score. This stays on your record for 7 years.", delta };
    },
  },
  {
    id: "new-card", label: "Apply for a new credit card", icon: "🆕", description: "Open a new credit card account",
    apply: (s) => {
      const ns = { ...s, numAccounts: s.numAccounts + 1, creditLimit: s.creditLimit + 3000, recentInquiries: s.recentInquiries + 1, accountAge: s.accountAge + 1 };
      ns.factors = updateFactors(ns);
      const newScore = calcFICOScore(ns.factors);
      const delta = newScore - s.score;
      return { state: { ...ns, score: newScore }, explanation: "New card adds a hard inquiry (temporary -10 to -20pts) but increases total credit limit, reducing utilization long-term.", delta };
    },
  },
  {
    id: "credit-increase", label: "Request a credit limit increase", icon: "📈", description: "Ask your issuer for a higher limit",
    apply: (s) => {
      const ns = { ...s, creditLimit: s.creditLimit + 2000, recentInquiries: s.recentInquiries + 1, accountAge: s.accountAge + 1 };
      ns.factors = updateFactors(ns);
      const newScore = calcFICOScore(ns.factors);
      const delta = newScore - s.score;
      return { state: { ...ns, score: newScore }, explanation: "Higher limit reduces utilization ratio. The soft/hard inquiry depends on issuer — we modeled a hard pull here.", delta };
    },
  },
  {
    id: "auto-loan", label: "Open an auto loan", icon: "🚗", description: "Finance a vehicle purchase",
    apply: (s) => {
      const ns = { ...s, hasAutoLoan: true, recentInquiries: s.recentInquiries + 1, numAccounts: s.numAccounts + 1, accountAge: s.accountAge + 1 };
      ns.factors = updateFactors(ns);
      const newScore = calcFICOScore(ns.factors);
      const delta = newScore - s.score;
      return { state: { ...ns, score: newScore }, explanation: "Auto loan adds credit mix diversity (installment loan) but creates a hard inquiry. Good long-term if paid on time.", delta };
    },
  },
  {
    id: "close-old", label: "Close your oldest credit card", icon: "🗑️", description: "Cancel your longest-held account",
    apply: (s) => {
      const ns = { ...s, numAccounts: Math.max(1, s.numAccounts - 1), creditLimit: Math.max(1000, s.creditLimit - 3000), accountAge: Math.max(1, Math.round(s.accountAge * 0.6)) + 1 };
      ns.factors = updateFactors(ns);
      const newScore = calcFICOScore(ns.factors);
      const delta = newScore - s.score;
      return { state: { ...ns, score: newScore }, explanation: "Closing old accounts shortens average history and reduces total credit limit — usually a bad move.", delta };
    },
  },
  {
    id: "use-90pct", label: "Use 90% of available credit", icon: "🔥", description: "Max out most of your credit",
    apply: (s) => {
      const ns = { ...s, balance: Math.round(s.creditLimit * 0.9), onTimePayments: s.onTimePayments + 1, accountAge: s.accountAge + 1 };
      ns.factors = updateFactors(ns);
      const newScore = calcFICOScore(ns.factors);
      const delta = newScore - s.score;
      return { state: { ...ns, score: newScore }, explanation: "High utilization (>30%) significantly hurts your score. Keeping below 10% is ideal.", delta };
    },
  },
  {
    id: "keep-low", label: "Keep utilization under 10%", icon: "🎯", description: "Spend conservatively this month",
    apply: (s) => {
      const ns = { ...s, balance: Math.round(s.creditLimit * 0.08), onTimePayments: s.onTimePayments + 1, accountAge: s.accountAge + 1 };
      ns.factors = updateFactors(ns);
      const newScore = calcFICOScore(ns.factors);
      const delta = newScore - s.score;
      return { state: { ...ns, score: newScore }, explanation: "Low utilization (<10%) is one of the fastest ways to boost your score. Lenders see you as low risk.", delta };
    },
  },
];

// ─── Scenarios ─────────────────────────────────────────
const SCENARIOS: Scenario[] = [
  {
    id: "rebuild", title: "The Rebuild", emoji: "🔨",
    description: "Start after a bankruptcy at 520 — reach 680 in 12 months",
    goal: "Reach 680", targetScore: 680, maxMonths: 12,
    startingState: { score: 520, factors: { paymentHistory: 30, creditUtilization: 70, lengthOfHistory: 20, creditMix: 15, newInquiries: 40 }, balance: 2800, creditLimit: 3000, accountAge: 6, numAccounts: 1, recentInquiries: 3, missedPayments: 8, onTimePayments: 4, hasAutoLoan: false, hasMortgage: false },
  },
  {
    id: "optimizer", title: "The Optimizer", emoji: "⚡",
    description: "Current score is 710 — reach 800 without new debt",
    goal: "Reach 800", targetScore: 800, maxMonths: 18,
    startingState: { score: 710, factors: { paymentHistory: 80, creditUtilization: 60, lengthOfHistory: 55, creditMix: 50, newInquiries: 70 }, balance: 2000, creditLimit: 8000, accountAge: 36, numAccounts: 3, recentInquiries: 1, missedPayments: 2, onTimePayments: 34, hasAutoLoan: false, hasMortgage: false },
  },
  {
    id: "first-timer", title: "The First Timer", emoji: "🌱",
    description: "No credit history — get approved for a car loan in 18 months",
    goal: "Reach 680 for auto loan approval", targetScore: 680, maxMonths: 18,
    startingState: { score: 300, factors: { paymentHistory: 50, creditUtilization: 100, lengthOfHistory: 0, creditMix: 0, newInquiries: 100 }, balance: 0, creditLimit: 500, accountAge: 0, numAccounts: 0, recentInquiries: 0, missedPayments: 0, onTimePayments: 0, hasAutoLoan: false, hasMortgage: false },
  },
  {
    id: "cautionary", title: "The Cautionary Tale", emoji: "⚠️",
    description: "See how bad decisions destroy a 780 score",
    goal: "Try to keep score above 700", targetScore: 700, maxMonths: 12,
    startingState: { score: 780, factors: { paymentHistory: 95, creditUtilization: 90, lengthOfHistory: 70, creditMix: 65, newInquiries: 85 }, balance: 500, creditLimit: 15000, accountAge: 60, numAccounts: 4, recentInquiries: 0, missedPayments: 1, onTimePayments: 58, hasAutoLoan: true, hasMortgage: false },
  },
];

// ─── Gauge Component ───────────────────────────────────
const ScoreGauge = ({ score, prevScore }: { score: number; prevScore?: number }) => {
  const pct = Math.max(0, Math.min(1, (score - 300) / 550));
  const angle = -135 + pct * 270; // arc from -135 to 135 degrees

  const getScoreLabel = (s: number) => {
    if (s >= 800) return { label: "Exceptional", color: "text-emerald-500" };
    if (s >= 740) return { label: "Very Good", color: "text-emerald-400" };
    if (s >= 670) return { label: "Good", color: "text-yellow-400" };
    if (s >= 580) return { label: "Fair", color: "text-orange-400" };
    return { label: "Poor", color: "text-destructive" };
  };

  const info = getScoreLabel(score);
  const delta = prevScore !== undefined ? score - prevScore : 0;

  // SVG arc
  const cx = 150, cy = 140, r = 110;
  const startAngle = -225 * (Math.PI / 180);
  const endAngle = 45 * (Math.PI / 180);
  const scoreAngle = startAngle + pct * (endAngle - startAngle);

  const arcPath = (start: number, end: number) => {
    const x1 = cx + r * Math.cos(start), y1 = cy + r * Math.sin(start);
    const x2 = cx + r * Math.cos(end), y2 = cy + r * Math.sin(end);
    const large = end - start > Math.PI ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
  };

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 300 200" className="w-full max-w-[280px]">
        {/* Background arc */}
        <path d={arcPath(startAngle, endAngle)} fill="none" stroke="hsl(var(--muted))" strokeWidth="18" strokeLinecap="round" />
        {/* Score arc - colored segments */}
        <path d={arcPath(startAngle, startAngle + 0.2 * (endAngle - startAngle))} fill="none" stroke="hsl(var(--destructive))" strokeWidth="18" strokeLinecap="round" opacity="0.3" />
        <path d={arcPath(startAngle + 0.2 * (endAngle - startAngle), startAngle + 0.4 * (endAngle - startAngle))} fill="none" stroke="hsl(30 90% 55%)" strokeWidth="18" strokeLinecap="round" opacity="0.3" />
        <path d={arcPath(startAngle + 0.4 * (endAngle - startAngle), startAngle + 0.6 * (endAngle - startAngle))} fill="none" stroke="hsl(50 90% 50%)" strokeWidth="18" strokeLinecap="round" opacity="0.3" />
        <path d={arcPath(startAngle + 0.6 * (endAngle - startAngle), startAngle + 0.8 * (endAngle - startAngle))} fill="none" stroke="hsl(120 50% 50%)" strokeWidth="18" strokeLinecap="round" opacity="0.3" />
        <path d={arcPath(startAngle + 0.8 * (endAngle - startAngle), endAngle)} fill="none" stroke="hsl(150 60% 40%)" strokeWidth="18" strokeLinecap="round" opacity="0.3" />
        {/* Active arc */}
        <motion.path
          d={arcPath(startAngle, scoreAngle)}
          fill="none"
          stroke={score >= 740 ? "hsl(150 60% 40%)" : score >= 670 ? "hsl(50 90% 50%)" : score >= 580 ? "hsl(30 90% 55%)" : "hsl(var(--destructive))"}
          strokeWidth="20"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
        {/* Labels */}
        <text x="40" y="190" fill="hsl(var(--muted-foreground))" fontSize="11" textAnchor="middle">300</text>
        <text x="260" y="190" fill="hsl(var(--muted-foreground))" fontSize="11" textAnchor="middle">850</text>
      </svg>
      <div className="text-center -mt-16 relative z-10">
        <motion.p
          key={score}
          className="text-5xl font-black"
          initial={{ scale: 1.3, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          {score}
        </motion.p>
        <p className={`text-sm font-bold ${info.color}`}>{info.label}</p>
        {delta !== 0 && (
          <motion.p
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className={`text-sm font-bold mt-1 ${delta > 0 ? "text-emerald-500" : "text-destructive"}`}
          >
            {delta > 0 ? <TrendingUp className="w-3.5 h-3.5 inline mr-0.5" /> : <TrendingDown className="w-3.5 h-3.5 inline mr-0.5" />}
            {delta > 0 ? "+" : ""}{delta} pts
          </motion.p>
        )}
      </div>
    </div>
  );
};

// ─── Factor Breakdown ──────────────────────────────────
const FACTOR_META = [
  { key: "paymentHistory" as const, label: "Payment History", weight: "35%", icon: Calendar, color: "bg-emerald-500" },
  { key: "creditUtilization" as const, label: "Credit Utilization", weight: "30%", icon: CreditCard, color: "bg-primary" },
  { key: "lengthOfHistory" as const, label: "Length of History", weight: "15%", icon: Clock, color: "bg-amber-500" },
  { key: "creditMix" as const, label: "Credit Mix", weight: "10%", icon: PieChart, color: "bg-purple-500" },
  { key: "newInquiries" as const, label: "New Inquiries", weight: "10%", icon: Shield, color: "bg-sky-500" },
];

const FactorBreakdown = ({ factors }: { factors: FICOFactors }) => (
  <div className="space-y-3">
    <p className="text-xs font-semibold text-muted-foreground uppercase">FICO Factor Breakdown</p>
    {FACTOR_META.map(f => (
      <div key={f.key} className="space-y-1">
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-1.5 font-medium">
            <f.icon className="w-3.5 h-3.5 text-muted-foreground" /> {f.label}
            <span className="text-xs text-muted-foreground">({f.weight})</span>
          </span>
          <span className="font-bold">{factors[f.key]}/100</span>
        </div>
        <div className="h-2.5 rounded-full bg-muted/50 overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${f.color}`}
            initial={false}
            animate={{ width: `${factors[f.key]}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    ))}
  </div>
);

// ─── History Timeline ──────────────────────────────────
const HistoryTimeline = ({ entries }: { entries: MonthEntry[] }) => (
  <div className="space-y-2">
    <p className="text-xs font-semibold text-muted-foreground uppercase">Decision History</p>
    <div className="overflow-x-auto pb-2">
      <div className="flex gap-2 min-w-min">
        <TooltipProvider>
          {entries.map((e, i) => (
            <Tooltip key={i}>
              <TooltipTrigger asChild>
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className={`flex flex-col items-center gap-1 p-2 rounded-lg border cursor-pointer min-w-[56px] ${
                    e.delta > 0 ? "bg-emerald-500/5 border-emerald-500/20" :
                    e.delta < 0 ? "bg-destructive/5 border-destructive/20" :
                    "bg-muted/30 border-border/50"
                  }`}
                >
                  <span className="text-[10px] text-muted-foreground">M{e.month}</span>
                  {e.delta > 0 ? <TrendingUp className="w-3 h-3 text-emerald-500" /> :
                   e.delta < 0 ? <TrendingDown className="w-3 h-3 text-destructive" /> :
                   <Minus className="w-3 h-3 text-muted-foreground" />}
                  <span className={`text-xs font-bold ${e.delta > 0 ? "text-emerald-500" : e.delta < 0 ? "text-destructive" : ""}`}>
                    {e.delta > 0 ? "+" : ""}{e.delta}
                  </span>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-[250px]">
                <p className="font-bold text-xs">{e.action}</p>
                <p className="text-xs text-muted-foreground mt-1">{e.explanation}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </div>
    </div>
    {/* Mountain range path */}
    {entries.length > 1 && (
      <svg viewBox={`0 0 ${entries.length * 40} 60`} className="w-full h-12 mt-1">
        <polyline
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="2"
          points={entries.map((e, i) => `${i * 40 + 20},${60 - ((e.score - 300) / 550) * 55}`).join(" ")}
        />
        {entries.map((e, i) => (
          <circle
            key={i}
            cx={i * 40 + 20}
            cy={60 - ((e.score - 300) / 550) * 55}
            r="3"
            fill={e.delta >= 0 ? "hsl(150 60% 40%)" : "hsl(var(--destructive))"}
          />
        ))}
      </svg>
    )}
  </div>
);

// ─── Main Component ────────────────────────────────────
export const CreditScoreSimulator = ({ onClose }: { onClose: () => void }) => {
  const [phase, setPhase] = useState<"select" | "play" | "result">("select");
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [creditState, setCreditState] = useState<CreditState | null>(null);
  const [prevScore, setPrevScore] = useState<number | undefined>();
  const [history, setHistory] = useState<MonthEntry[]>([]);
  const [currentMonth, setCurrentMonth] = useState(1);
  const [lastExplanation, setLastExplanation] = useState<string | null>(null);

  const goalReached = creditState && scenario && creditState.score >= scenario.targetScore;
  const monthsUp = scenario && currentMonth > scenario.maxMonths;

  const startScenario = (s: Scenario) => {
    setScenario(s);
    const factors = updateFactors(s.startingState);
    const score = calcFICOScore(factors);
    setCreditState({ ...s.startingState, factors, score });
    setPrevScore(undefined);
    setHistory([]);
    setCurrentMonth(1);
    setLastExplanation(null);
    setPhase("play");
  };

  const makeDecision = useCallback((d: Decision) => {
    if (!creditState || !scenario) return;
    const { state: ns, explanation, delta } = d.apply({ ...creditState });
    // Age inquiries after 6 months
    if (currentMonth % 6 === 0 && ns.recentInquiries > 0) {
      ns.recentInquiries = Math.max(0, ns.recentInquiries - 1);
      ns.factors = updateFactors(ns);
      ns.score = calcFICOScore(ns.factors);
    }
    setPrevScore(creditState.score);
    const entry: MonthEntry = { month: currentMonth, score: ns.score, delta: ns.score - creditState.score, action: d.label, explanation };
    setHistory(prev => [...prev, entry]);
    setCreditState(ns);
    setLastExplanation(explanation);
    setCurrentMonth(prev => prev + 1);

    if (ns.score >= scenario.targetScore || currentMonth >= scenario.maxMonths) {
      setTimeout(() => setPhase("result"), 800);
    }
  }, [creditState, scenario, currentMonth]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border/50 px-4 py-3">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <Button variant="ghost" size="sm" onClick={onClose} className="gap-1.5">
            <ArrowLeft className="w-4 h-4" /> Exit
          </Button>
          <div className="text-center">
            <h1 className="font-black text-sm">Credit Score Simulator</h1>
            {phase === "play" && scenario && (
              <p className="text-xs text-muted-foreground">Month {Math.min(currentMonth, scenario.maxMonths)} of {scenario.maxMonths} · {scenario.title}</p>
            )}
          </div>
          <div className="w-16" />
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-4">
        <AnimatePresence mode="wait">
          {/* Scenario select */}
          {phase === "select" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="text-center space-y-2">
                <CreditCard className="w-10 h-10 mx-auto text-primary" />
                <h2 className="text-2xl font-black">Choose a Scenario</h2>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  Each scenario challenges you to manage credit decisions and hit a target FICO score.
                </p>
              </div>
              <div className="grid gap-3">
                {SCENARIOS.map(s => (
                  <Card key={s.id} className="p-4 border-border/50 hover:border-primary/40 cursor-pointer transition-all group" onClick={() => startScenario(s)}>
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">{s.emoji}</span>
                      <div className="flex-1">
                        <h3 className="font-bold">{s.title}</h3>
                        <p className="text-sm text-muted-foreground">{s.description}</p>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="secondary" className="text-xs">🎯 {s.goal}</Badge>
                          <Badge variant="outline" className="text-xs">{s.maxMonths} months</Badge>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary mt-1" />
                    </div>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {/* Gameplay */}
          {phase === "play" && creditState && scenario && (
            <motion.div key="play" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
              {/* Gauge */}
              <Card className="p-4 pt-6 border-border/50">
                <ScoreGauge score={creditState.score} prevScore={prevScore} />
              </Card>

              {/* Explanation toast */}
              <AnimatePresence>
                {lastExplanation && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 text-sm">
                      <p className="font-semibold text-xs text-primary mb-1">📘 Why did your score change?</p>
                      <p className="text-muted-foreground text-xs">{lastExplanation}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Factor breakdown */}
              <Card className="p-4 border-border/50">
                <FactorBreakdown factors={creditState.factors} />
              </Card>

              {/* Decision cards */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase">Make a Decision</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {DECISIONS.map(d => (
                    <Card
                      key={d.id}
                      className="p-3 border-border/50 hover:border-primary/40 cursor-pointer transition-all group"
                      onClick={() => makeDecision(d)}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{d.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate">{d.label}</p>
                          <p className="text-xs text-muted-foreground truncate">{d.description}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Timeline */}
              {history.length > 0 && (
                <Card className="p-4 border-border/50">
                  <HistoryTimeline entries={history} />
                </Card>
              )}

              {/* Goal status */}
              <div className="p-3 rounded-xl bg-muted/30 border border-border/50 flex items-center justify-between">
                <div className="text-sm">
                  <span className="text-muted-foreground">Goal: </span>
                  <span className="font-bold">{scenario.goal} ({scenario.targetScore})</span>
                </div>
                <Badge variant={creditState.score >= scenario.targetScore ? "default" : "secondary"}>
                  {creditState.score >= scenario.targetScore ? "✅ Reached!" : `${scenario.targetScore - creditState.score} pts to go`}
                </Badge>
              </div>
            </motion.div>
          )}

          {/* Results */}
          {phase === "result" && creditState && scenario && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="text-center space-y-2">
                {goalReached ? (
                  <>
                    <span className="text-5xl">🏆</span>
                    <h2 className="text-2xl font-black text-emerald-500">Goal Reached!</h2>
                  </>
                ) : (
                  <>
                    <span className="text-5xl">📊</span>
                    <h2 className="text-2xl font-black">Time's Up</h2>
                  </>
                )}
                <p className="text-sm text-muted-foreground">{scenario.title} — {goalReached ? "You hit your target!" : `Fell short of ${scenario.targetScore}`}</p>
              </div>

              <Card className="p-4 pt-6 border-border/50">
                <ScoreGauge score={creditState.score} />
              </Card>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                <Card className="p-3 text-center border-border/50">
                  <p className="text-xs text-muted-foreground">Decisions</p>
                  <p className="text-xl font-black">{history.length}</p>
                </Card>
                <Card className="p-3 text-center border-border/50">
                  <p className="text-xs text-muted-foreground">Best Δ</p>
                  <p className="text-xl font-black text-emerald-500">+{Math.max(0, ...history.map(h => h.delta))}</p>
                </Card>
                <Card className="p-3 text-center border-border/50">
                  <p className="text-xs text-muted-foreground">Worst Δ</p>
                  <p className="text-xl font-black text-destructive">{Math.min(0, ...history.map(h => h.delta))}</p>
                </Card>
              </div>

              {history.length > 0 && (
                <Card className="p-4 border-border/50">
                  <HistoryTimeline entries={history} />
                </Card>
              )}

              {/* Insight */}
              <Card className="p-4 border-primary/20 bg-primary/5">
                <p className="text-sm font-bold mb-1">📋 Insight Report</p>
                <p className="text-xs text-muted-foreground">
                  {goalReached
                    ? `Excellent! You reached ${creditState.score} in ${history.length} months. The key was consistent on-time payments and keeping utilization low — the two biggest FICO factors (65% combined).`
                    : `You ended at ${creditState.score}, ${scenario.targetScore - creditState.score} points short. Focus on payment history (35%) and utilization (30%) — they're the fastest levers to move your score.`}
                </p>
              </Card>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 gap-1.5" onClick={() => setPhase("select")}>
                  <RotateCcw className="w-4 h-4" /> Try Another
                </Button>
                <Button className="flex-1 gap-1.5" onClick={onClose}>
                  <ArrowLeft className="w-4 h-4" /> Back to Games
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

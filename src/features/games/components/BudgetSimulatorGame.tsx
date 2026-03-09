import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import {
  ArrowLeft, Play, Home, Utensils, Car, Sparkles, PiggyBank,
  Heart, TrendingUp, TrendingDown, AlertTriangle, CheckCircle2,
  XCircle, DollarSign, Calendar, Award, ChevronRight, RotateCcw,
  Briefcase, GraduationCap, Wrench, CircleDollarSign
} from "lucide-react";

// ─── Types ─────────────────────────────────────────────
interface LifeProfile {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  income: number;
  backstory: string;
  startingExpenses: CategoryBudget;
}

interface CategoryBudget {
  housing: number;
  food: number;
  transport: number;
  entertainment: number;
  savings: number;
}

interface LifeEvent {
  title: string;
  description: string;
  icon: string;
  type: "expense" | "income" | "mixed";
  impact: Partial<CategoryBudget> & { incomeChange?: number };
  severity: "minor" | "moderate" | "major";
}

interface MonthRecord {
  month: number;
  income: number;
  budget: CategoryBudget;
  events: LifeEvent[];
  savings: number;
  budgetHealth: number;
  stressScore: number;
}

// ─── Data ──────────────────────────────────────────────
const PROFILES: LifeProfile[] = [
  {
    id: "grad",
    title: "Recent Graduate",
    subtitle: "College grad earning $3,200/month",
    icon: <GraduationCap className="w-8 h-8" />,
    income: 3200,
    backstory: "Fresh out of college with $28K in student loans. Living in a shared apartment, figuring out adulting.",
    startingExpenses: { housing: 900, food: 350, transport: 200, entertainment: 250, savings: 300 },
  },
  {
    id: "parent",
    title: "Single Parent",
    subtitle: "Single parent with $4,500/month",
    icon: <Heart className="w-8 h-8" />,
    income: 4500,
    backstory: "Raising a child alone with a steady job. Childcare costs are real, but so is your determination.",
    startingExpenses: { housing: 1400, food: 600, transport: 300, entertainment: 150, savings: 400 },
  },
  {
    id: "trade",
    title: "Trade Worker",
    subtitle: "Skilled worker with $5,100/month",
    icon: <Wrench className="w-8 h-8" />,
    income: 5100,
    backstory: "Electrician with a good wage but unpredictable overtime. Own a truck with payments.",
    startingExpenses: { housing: 1300, food: 500, transport: 450, entertainment: 300, savings: 500 },
  },
];

const EVENT_POOL: LifeEvent[] = [
  { title: "Car Breakdown", description: "Your car needs a $400–$1,800 repair bill.", icon: "🚗", type: "expense", impact: { transport: 600 }, severity: "moderate" },
  { title: "Medical Copay", description: "Unexpected doctor visit costs $200–$900.", icon: "🏥", type: "expense", impact: { housing: 400 }, severity: "moderate" },
  { title: "Job Bonus!", description: "Great work! You received a $300–$800 windfall.", icon: "💼", type: "income", impact: { incomeChange: 500 }, severity: "minor" },
  { title: "Rent Increase", description: "Your landlord raised rent by $75–$150/month.", icon: "📈", type: "expense", impact: { housing: 125 }, severity: "major" },
  { title: "Friend's Wedding", description: "Gift, outfit, and travel: $200–$600.", icon: "💒", type: "expense", impact: { entertainment: 400 }, severity: "minor" },
  { title: "Side Gig Income", description: "Freelance work brought in extra $150–$500.", icon: "💰", type: "income", impact: { incomeChange: 300 }, severity: "minor" },
  { title: "Phone Repair", description: "Cracked screen costs $150–$350.", icon: "📱", type: "expense", impact: { entertainment: 250 }, severity: "minor" },
  { title: "Grocery Prices Spike", description: "Inflation hits — food costs up $50–$150 this month.", icon: "🛒", type: "expense", impact: { food: 100 }, severity: "minor" },
  { title: "Tax Refund", description: "You got a $400–$1,200 tax refund!", icon: "📋", type: "income", impact: { incomeChange: 700 }, severity: "moderate" },
  { title: "Pet Emergency", description: "Vet bill of $300–$800.", icon: "🐕", type: "expense", impact: { housing: 500 }, severity: "moderate" },
  { title: "Utility Spike", description: "Extreme weather caused a $80–$200 utility increase.", icon: "⚡", type: "expense", impact: { housing: 140 }, severity: "minor" },
  { title: "Holiday Season", description: "Gifts and celebrations cost $200–$500 extra.", icon: "🎄", type: "expense", impact: { entertainment: 350 }, severity: "moderate" },
];

const CATEGORIES = [
  { key: "housing" as const, label: "Housing", icon: Home, color: "text-blue-500", bg: "bg-blue-500" },
  { key: "food" as const, label: "Food", icon: Utensils, color: "text-emerald-500", bg: "bg-emerald-500" },
  { key: "transport" as const, label: "Transport", icon: Car, color: "text-amber-500", bg: "bg-amber-500" },
  { key: "entertainment" as const, label: "Entertainment", icon: Sparkles, color: "text-purple-500", bg: "bg-purple-500" },
  { key: "savings" as const, label: "Savings", icon: PiggyBank, color: "text-primary", bg: "bg-primary" },
];

const CATEGORY_LIMITS: Record<keyof CategoryBudget, { min: number; max: number; step: number }> = {
  housing: { min: 400, max: 2500, step: 25 },
  food: { min: 100, max: 1200, step: 25 },
  transport: { min: 0, max: 800, step: 25 },
  entertainment: { min: 0, max: 800, step: 25 },
  savings: { min: 0, max: 2000, step: 25 },
};

// ─── Helpers ───────────────────────────────────────────
function calcHealth(income: number, budget: CategoryBudget): number {
  const total = Object.values(budget).reduce((a, b) => a + b, 0);
  const ratio = total / income;
  if (ratio <= 0.85) return 100;
  if (ratio <= 0.95) return 80;
  if (ratio <= 1.0) return 60;
  if (ratio <= 1.1) return 35;
  return 10;
}

function getHealthColor(h: number) {
  if (h >= 80) return "text-emerald-500";
  if (h >= 60) return "text-amber-500";
  return "text-destructive";
}

function getHealthBg(h: number) {
  if (h >= 80) return "bg-emerald-500";
  if (h >= 60) return "bg-amber-500";
  return "bg-destructive";
}

function randomEvent(): LifeEvent {
  return EVENT_POOL[Math.floor(Math.random() * EVENT_POOL.length)];
}

function calcGrade(score: number): { letter: string; color: string } {
  if (score >= 90) return { letter: "A+", color: "text-emerald-500" };
  if (score >= 80) return { letter: "A", color: "text-emerald-500" };
  if (score >= 70) return { letter: "B", color: "text-primary" };
  if (score >= 60) return { letter: "C", color: "text-amber-500" };
  if (score >= 50) return { letter: "D", color: "text-orange-500" };
  return { letter: "F", color: "text-destructive" };
}

// ─── Sub-components ────────────────────────────────────
const ProfileSelection = ({ onSelect }: { onSelect: (p: LifeProfile) => void }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
    <div className="text-center space-y-2">
      <h2 className="text-2xl font-black">Choose Your Life Path</h2>
      <p className="text-muted-foreground text-sm">Each profile has different income, expenses, and challenges</p>
    </div>
    <div className="grid gap-4">
      {PROFILES.map((p) => (
        <Card
          key={p.id}
          className="p-5 border-border/50 hover:border-primary/40 cursor-pointer transition-all group"
          onClick={() => onSelect(p)}
        >
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 group-hover:scale-110 transition-transform">
              {p.icon}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg">{p.title}</h3>
              <p className="text-sm text-muted-foreground mb-2">{p.backstory}</p>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  <DollarSign className="w-3 h-3 mr-0.5" />${p.income.toLocaleString()}/mo
                </Badge>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors mt-2" />
          </div>
        </Card>
      ))}
    </div>
  </motion.div>
);

const EventCard = ({ event, onDismiss }: { event: LifeEvent; onDismiss: () => void }) => (
  <motion.div
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    exit={{ scale: 0.8, opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
    onClick={onDismiss}
  >
    <Card className="max-w-sm w-full p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
      <div className="text-center space-y-2">
        <span className="text-5xl">{event.icon}</span>
        <h3 className="text-xl font-black">{event.title}</h3>
        <Badge variant={event.type === "income" ? "default" : "destructive"} className="text-xs">
          {event.type === "income" ? "💰 Income Event" : "⚠️ Expense Event"}
        </Badge>
      </div>
      <p className="text-sm text-muted-foreground text-center">{event.description}</p>
      <div className="space-y-1">
        {event.impact.incomeChange && (
          <div className="flex justify-between text-sm p-2 rounded-lg bg-primary/5">
            <span>Extra Income</span>
            <span className="font-bold text-primary">+${event.impact.incomeChange}</span>
          </div>
        )}
        {Object.entries(event.impact).filter(([k]) => k !== "incomeChange").map(([key, val]) => (
          <div key={key} className="flex justify-between text-sm p-2 rounded-lg bg-destructive/5">
            <span className="capitalize">{key}</span>
            <span className="font-bold text-destructive">+${val as number}</span>
          </div>
        ))}
      </div>
      <Button className="w-full" onClick={onDismiss}>Got It — Adjust My Budget</Button>
    </Card>
  </motion.div>
);

const MonthlyReport = ({ record, onContinue, isLast }: { record: MonthRecord; onContinue: () => void; isLast: boolean }) => {
  const totalSpent = record.budget.housing + record.budget.food + record.budget.transport + record.budget.entertainment;
  const surplus = record.income - totalSpent - record.budget.savings;
  const savingsRate = Math.round((record.budget.savings / record.income) * 100);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <div className="text-center space-y-1">
        <h3 className="text-xl font-black">Month {record.month} Report</h3>
        <p className="text-sm text-muted-foreground">Monthly Statement</p>
      </div>

      {/* Budget vs Actual bars */}
      <div className="space-y-3">
        {CATEGORIES.filter(c => c.key !== "savings").map((cat) => {
          const val = record.budget[cat.key];
          const pct = Math.min((val / record.income) * 100, 100);
          return (
            <div key={cat.key} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="font-medium flex items-center gap-1.5">
                  <cat.icon className={`w-3.5 h-3.5 ${cat.color}`} />{cat.label}
                </span>
                <span className="font-bold">${val.toLocaleString()}</span>
              </div>
              <div className="h-2.5 rounded-full bg-muted/50 overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${cat.bg}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 text-center">
          <p className="text-xs text-muted-foreground">Savings</p>
          <p className="text-lg font-black text-primary">${record.budget.savings}</p>
        </div>
        <div className={`p-3 rounded-xl text-center ${surplus >= 0 ? "bg-emerald-500/5 border border-emerald-500/20" : "bg-destructive/5 border border-destructive/20"}`}>
          <p className="text-xs text-muted-foreground">Surplus</p>
          <p className={`text-lg font-black ${surplus >= 0 ? "text-emerald-500" : "text-destructive"}`}>${surplus.toLocaleString()}</p>
        </div>
        <div className="p-3 rounded-xl bg-muted/30 border border-border text-center">
          <p className="text-xs text-muted-foreground">Save Rate</p>
          <p className="text-lg font-black">{savingsRate}%</p>
        </div>
      </div>

      {/* Events */}
      {record.events.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase">Events This Month</p>
          {record.events.map((e, i) => (
            <div key={i} className="flex items-center gap-2 text-sm p-2 rounded-lg bg-muted/30">
              <span>{e.icon}</span>
              <span>{e.title}</span>
            </div>
          ))}
        </div>
      )}

      <Button className="w-full" onClick={onContinue}>
        {isLast ? "View Final Results" : `Continue to Month ${record.month + 1}`}
      </Button>
    </motion.div>
  );
};

// ─── Main Component ────────────────────────────────────
export const BudgetSimulatorGame = ({ onClose }: { onClose: () => void }) => {
  const [phase, setPhase] = useState<"select" | "play" | "report" | "final">("select");
  const [profile, setProfile] = useState<LifeProfile | null>(null);
  const [month, setMonth] = useState(1);
  const [income, setIncome] = useState(0);
  const [budget, setBudget] = useState<CategoryBudget>({ housing: 0, food: 0, transport: 0, entertainment: 0, savings: 0 });
  const [history, setHistory] = useState<MonthRecord[]>([]);
  const [pendingEvent, setPendingEvent] = useState<LifeEvent | null>(null);
  const [monthEvents, setMonthEvents] = useState<LifeEvent[]>([]);

  const totalSpending = useMemo(() => Object.values(budget).reduce((a, b) => a + b, 0), [budget]);
  const surplus = income - totalSpending;
  const health = calcHealth(income, budget);

  const handleSelectProfile = (p: LifeProfile) => {
    setProfile(p);
    setIncome(p.income);
    setBudget({ ...p.startingExpenses });
    setMonth(1);
    setHistory([]);
    setMonthEvents([]);
    setPhase("play");
  };

  const handleSliderChange = useCallback((key: keyof CategoryBudget, val: number[]) => {
    setBudget(prev => ({ ...prev, [key]: val[0] }));
  }, []);

  const submitMonth = () => {
    const record: MonthRecord = {
      month,
      income,
      budget: { ...budget },
      events: [...monthEvents],
      savings: budget.savings,
      budgetHealth: health,
      stressScore: surplus < 0 ? Math.abs(surplus) / income * 100 : 0,
    };
    setHistory(prev => [...prev, record]);
    setPhase("report");
  };

  const advanceMonth = () => {
    if (month >= 12) {
      setPhase("final");
      return;
    }
    const nextMonth = month + 1;
    setMonth(nextMonth);
    setMonthEvents([]);

    // 30% chance of event each month
    if (Math.random() < 0.3) {
      const event = randomEvent();
      setMonthEvents([event]);
      // Apply event impacts
      if (event.impact.incomeChange) {
        setIncome(prev => prev + event.impact.incomeChange!);
      }
      setBudget(prev => {
        const next = { ...prev };
        Object.entries(event.impact).forEach(([k, v]) => {
          if (k !== "incomeChange" && k in next) {
            (next as any)[k] = Math.max(0, (next as any)[k] + (v as number));
          }
        });
        return next;
      });
      setPendingEvent(event);
    }
    setPhase("play");
  };

  // ─── Final Scores ─────────────────────────────────
  const finalScores = useMemo(() => {
    if (history.length === 0) return null;
    const avgSavingsRate = history.reduce((s, r) => s + (r.savings / r.income) * 100, 0) / history.length;
    const overspendMonths = history.filter(r => {
      const total = Object.values(r.budget).reduce((a, b) => a + b, 0);
      return total > r.income;
    }).length;
    const eventMonths = history.filter(r => r.events.length > 0).length;
    const eventMonthsHandled = history.filter(r => r.events.length > 0 && r.budgetHealth >= 60).length;
    const resilience = eventMonths > 0 ? (eventMonthsHandled / eventMonths) * 100 : 100;
    const debtAvoidance = Math.max(0, 100 - overspendMonths * 15);
    const composite = Math.round(avgSavingsRate * 0.35 + debtAvoidance * 0.3 + resilience * 0.35);

    return { avgSavingsRate: Math.round(avgSavingsRate), debtAvoidance, resilience: Math.round(resilience), composite };
  }, [history]);

  // ─── Render ────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border/50 px-4 py-3">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <Button variant="ghost" size="sm" onClick={onClose} className="gap-1.5">
            <ArrowLeft className="w-4 h-4" /> Exit
          </Button>
          <div className="text-center">
            <h1 className="font-black text-sm">Budget Simulator</h1>
            {phase !== "select" && phase !== "final" && (
              <p className="text-xs text-muted-foreground">Month {month} of 12</p>
            )}
          </div>
          {phase !== "select" && phase !== "final" ? (
            <Badge variant="outline" className="text-xs">
              <DollarSign className="w-3 h-3 mr-0.5" />${income.toLocaleString()}/mo
            </Badge>
          ) : <div className="w-16" />}
        </div>
        {phase !== "select" && phase !== "final" && (
          <div className="max-w-2xl mx-auto mt-2">
            <Progress value={(month / 12) * 100} className="h-1.5" />
          </div>
        )}
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-4">
        <AnimatePresence mode="wait">
          {/* Event popup */}
          {pendingEvent && (
            <EventCard event={pendingEvent} onDismiss={() => setPendingEvent(null)} />
          )}

          {/* Profile selection */}
          {phase === "select" && <ProfileSelection onSelect={handleSelectProfile} />}

          {/* Budget dashboard */}
          {phase === "play" && (
            <motion.div key={`play-${month}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-5">
              {/* Health gauge */}
              <Card className="p-4 border-border/50">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Budget Health</p>
                    <p className={`text-3xl font-black ${getHealthColor(health)}`}>{health}%</p>
                  </div>
                  <div className={`w-16 h-16 rounded-full border-4 ${health >= 80 ? "border-emerald-500" : health >= 60 ? "border-amber-500" : "border-destructive"} flex items-center justify-center`}>
                    {health >= 80 ? <CheckCircle2 className="w-7 h-7 text-emerald-500" /> :
                     health >= 60 ? <AlertTriangle className="w-7 h-7 text-amber-500" /> :
                     <XCircle className="w-7 h-7 text-destructive" />}
                  </div>
                </div>
                <div className="h-3 rounded-full bg-muted/50 overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${getHealthBg(health)}`}
                    initial={false}
                    animate={{ width: `${health}%` }}
                    transition={{ type: "spring", stiffness: 200, damping: 25 }}
                  />
                </div>
                <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                  <span>Spending: ${totalSpending.toLocaleString()}</span>
                  <span className={surplus >= 0 ? "text-emerald-500 font-bold" : "text-destructive font-bold"}>
                    {surplus >= 0 ? `$${surplus} surplus` : `$${Math.abs(surplus)} over`}
                  </span>
                </div>
              </Card>

              {/* Category sliders */}
              <div className="space-y-4">
                {CATEGORIES.map((cat) => {
                  const limits = CATEGORY_LIMITS[cat.key];
                  const val = budget[cat.key];
                  const pct = Math.round((val / income) * 100);
                  return (
                    <Card key={cat.key} className="p-4 border-border/50">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-lg ${cat.bg}/15 flex items-center justify-center`}>
                            <cat.icon className={`w-4 h-4 ${cat.color}`} />
                          </div>
                          <span className="font-semibold text-sm">{cat.label}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-sm">${val.toLocaleString()}</span>
                          <span className="text-xs text-muted-foreground ml-1">({pct}%)</span>
                        </div>
                      </div>
                      <Slider
                        min={limits.min}
                        max={limits.max}
                        step={limits.step}
                        value={[val]}
                        onValueChange={(v) => handleSliderChange(cat.key, v)}
                        className="w-full"
                      />
                    </Card>
                  );
                })}
              </div>

              {/* Events banner */}
              {monthEvents.length > 0 && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-2">
                  <span className="text-lg">{monthEvents[0].icon}</span>
                  <div className="flex-1">
                    <p className="text-sm font-bold">{monthEvents[0].title}</p>
                    <p className="text-xs text-muted-foreground">{monthEvents[0].description}</p>
                  </div>
                </div>
              )}

              {/* Submit */}
              <Button
                className="w-full gap-2"
                size="lg"
                onClick={submitMonth}
                variant={surplus < 0 ? "destructive" : "default"}
              >
                <Calendar className="w-4 h-4" />
                End Month {month}
              </Button>

              {surplus < 0 && (
                <p className="text-xs text-destructive text-center font-medium">
                  ⚠️ You're spending more than you earn. Reduce some categories!
                </p>
              )}
            </motion.div>
          )}

          {/* Monthly report */}
          {phase === "report" && history.length > 0 && (
            <MonthlyReport
              record={history[history.length - 1]}
              onContinue={advanceMonth}
              isLast={month >= 12}
            />
          )}

          {/* Final results */}
          {phase === "final" && finalScores && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="text-center space-y-2">
                <Award className="w-12 h-12 mx-auto text-primary" />
                <h2 className="text-2xl font-black">12-Month Results</h2>
                <p className="text-sm text-muted-foreground">{profile?.title} — Financial Journey Complete</p>
              </div>

              {/* Grade */}
              <Card className="p-6 text-center border-primary/30 bg-primary/5">
                <p className="text-sm text-muted-foreground mb-1">Final Grade</p>
                <p className={`text-6xl font-black ${calcGrade(finalScores.composite).color}`}>
                  {calcGrade(finalScores.composite).letter}
                </p>
                <p className="text-sm text-muted-foreground mt-1">Overall Score: {finalScores.composite}/100</p>
              </Card>

              {/* Breakdown */}
              <div className="space-y-3">
                {[
                  { label: "Savings Rate", value: finalScores.avgSavingsRate, suffix: "%", desc: "% of income saved on average", benchmark: 20 },
                  { label: "Debt Avoidance", value: finalScores.debtAvoidance, suffix: "/100", desc: "Bonus for staying within income", benchmark: 80 },
                  { label: "Event Resilience", value: finalScores.resilience, suffix: "%", desc: "How well you handled surprise expenses", benchmark: 70 },
                ].map((item) => (
                  <Card key={item.label} className="p-4 border-border/50">
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <p className="font-bold text-sm">{item.label}</p>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                      <span className={`text-xl font-black ${item.value >= item.benchmark ? "text-emerald-500" : "text-amber-500"}`}>
                        {item.value}{item.suffix}
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-muted/50 overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${item.value >= item.benchmark ? "bg-emerald-500" : "bg-amber-500"}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(item.value, 100)}%` }}
                        transition={{ duration: 0.8 }}
                      />
                    </div>
                  </Card>
                ))}
              </div>

              {/* 12-month savings journey sparkline */}
              <Card className="p-4 border-border/50">
                <p className="text-xs font-semibold text-muted-foreground uppercase mb-3">Savings Over 12 Months</p>
                <div className="flex items-end gap-1 h-20">
                  {history.map((r, i) => {
                    const maxSav = Math.max(...history.map(h => h.savings), 1);
                    const pct = (r.savings / maxSav) * 100;
                    return (
                      <motion.div
                        key={i}
                        className="flex-1 rounded-t bg-primary/70 hover:bg-primary transition-colors"
                        initial={{ height: 0 }}
                        animate={{ height: `${Math.max(pct, 5)}%` }}
                        transition={{ delay: i * 0.05, duration: 0.4 }}
                        title={`Month ${r.month}: $${r.savings}`}
                      />
                    );
                  })}
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Month 1</span>
                  <span>Month 12</span>
                </div>
              </Card>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 gap-1.5" onClick={() => { setPhase("select"); setHistory([]); setMonth(1); }}>
                  <RotateCcw className="w-4 h-4" /> Play Again
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

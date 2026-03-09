import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft, ChevronRight, RotateCcw, DollarSign, TrendingUp, TrendingDown,
  Users, ShoppingBag, Megaphone, Package, CreditCard, Store, Utensils,
  GraduationCap, Shirt, Award, AlertTriangle, Sparkles, BarChart3,
  ArrowUpRight, ArrowDownRight, Minus, Flame
} from "lucide-react";

// ─── Types ─────────────────────────────────────────────
interface BusinessType {
  id: string;
  name: string;
  emoji: string;
  icon: React.ReactNode;
  description: string;
  baseCosts: { cogs: number; labor: number; rent: number; marketing: number; loan: number };
  baseRevenue: { unitPrice: number; avgOrders: number };
  riskProfile: string;
}

interface GameState {
  month: number;
  cash: number;
  revenue: number;
  expenses: number;
  netProfit: number;
  staff: number;
  priceLevel: "low" | "medium" | "premium";
  marketingChannel: "none" | "social" | "flyers" | "both";
  reputation: number; // 0-100
  inventory: number;
  loanBalance: number;
  monthlyLoanPayment: number;
  cogs: number;
  labor: number;
  rent: number;
  marketing: number;
  unitsSold: number;
  unitPrice: number;
}

interface MonthRecord {
  month: number;
  revenue: number;
  expenses: number;
  netProfit: number;
  cash: number;
  event: MarketEvent | null;
  decisions: string[];
}

interface MarketEvent {
  title: string;
  description: string;
  icon: string;
  effect: (s: GameState) => GameState;
  type: "positive" | "negative" | "neutral";
}

interface Decision {
  id: string;
  label: string;
  icon: string;
  description: string;
  apply: (s: GameState) => { state: GameState; feedback: string };
  available?: (s: GameState) => boolean;
}

// ─── Business Types ────────────────────────────────────
const BUSINESSES: BusinessType[] = [
  {
    id: "food-truck", name: "Food Truck", emoji: "🚚", icon: <Utensils className="w-8 h-8" />,
    description: "Low overhead, high foot traffic. Weather and location matter. $10K startup.",
    baseCosts: { cogs: 800, labor: 1200, rent: 400, marketing: 200, loan: 0 },
    baseRevenue: { unitPrice: 12, avgOrders: 250 },
    riskProfile: "Medium risk — weather dependent, low fixed costs",
  },
  {
    id: "boutique", name: "Online Boutique", emoji: "👗", icon: <Shirt className="w-8 h-8" />,
    description: "Trendy clothing store. High margins but inventory risk. $10K startup.",
    baseCosts: { cogs: 1200, labor: 600, rent: 300, marketing: 400, loan: 0 },
    baseRevenue: { unitPrice: 45, avgOrders: 80 },
    riskProfile: "Higher risk — trend dependent, inventory management critical",
  },
  {
    id: "tutoring", name: "Tutoring Service", emoji: "📚", icon: <GraduationCap className="w-8 h-8" />,
    description: "Knowledge-based, low COGS. Scales with staff. $10K startup.",
    baseCosts: { cogs: 200, labor: 1500, rent: 500, marketing: 300, loan: 0 },
    baseRevenue: { unitPrice: 60, avgOrders: 55 },
    riskProfile: "Lower risk — steady demand, labor-intensive",
  },
];

// ─── Market Events ─────────────────────────────────────
const createEvents = (bizId: string): MarketEvent[] => [
  {
    title: "Seasonal Demand Spike", description: "Holiday rush! Orders up 40% this month.", icon: "🎄", type: "positive",
    effect: (s) => ({ ...s, unitsSold: Math.round(s.unitsSold * 1.4) }),
  },
  {
    title: "Summer Slump", description: "Slow season hits — orders drop 25%.", icon: "☀️", type: "negative",
    effect: (s) => ({ ...s, unitsSold: Math.round(s.unitsSold * 0.75) }),
  },
  {
    title: "Competitor Opens Nearby", description: "A rival enters your market — you lose 20% market share.", icon: "⚔️", type: "negative",
    effect: (s) => ({ ...s, unitsSold: Math.round(s.unitsSold * 0.8), reputation: Math.max(0, s.reputation - 5) }),
  },
  {
    title: "Viral Social Media Post", description: "Your business goes viral! Demand surges 60% for this month.", icon: "📱", type: "positive",
    effect: (s) => ({ ...s, unitsSold: Math.round(s.unitsSold * 1.6), reputation: Math.min(100, s.reputation + 10) }),
  },
  {
    title: "Supply Chain Disruption", description: "Material costs rise 20% this month.", icon: "🚢", type: "negative",
    effect: (s) => ({ ...s, cogs: Math.round(s.cogs * 1.2) }),
  },
  {
    title: bizId === "food-truck" ? "Health Inspection" : "Quality Audit", description: "Pass or pay: $500 fine if reputation is below 50.", icon: "🔍", type: "neutral",
    effect: (s) => s.reputation < 50 ? { ...s, cash: s.cash - 500 } : { ...s, reputation: Math.min(100, s.reputation + 5) },
  },
  {
    title: "Local News Feature", description: "A journalist writes about your business — foot traffic boosts!", icon: "📰", type: "positive",
    effect: (s) => ({ ...s, unitsSold: Math.round(s.unitsSold * 1.3), reputation: Math.min(100, s.reputation + 8) }),
  },
  {
    title: "Economic Recession", description: "Customers tighten spending — orders drop 30%, avg order value down 15%.", icon: "📉", type: "negative",
    effect: (s) => ({ ...s, unitsSold: Math.round(s.unitsSold * 0.7), unitPrice: Math.round(s.unitPrice * 0.85) }),
  },
];

// ─── Decisions ─────────────────────────────────────────
const createDecisions = (): Decision[] => [
  {
    id: "price-low", label: "Set price: Low", icon: "🏷️", description: "Lower prices attract more customers but cut margins",
    apply: (s) => {
      const ns = { ...s, priceLevel: "low" as const, unitPrice: Math.round(s.unitPrice * 0.75), unitsSold: Math.round(s.unitsSold * 1.3) };
      return { state: ns, feedback: "Lower prices boosted volume but reduced per-unit profit." };
    },
  },
  {
    id: "price-premium", label: "Set price: Premium", icon: "💎", description: "Higher prices for better margins, fewer sales",
    apply: (s) => {
      const ns = { ...s, priceLevel: "premium" as const, unitPrice: Math.round(s.unitPrice * 1.3), unitsSold: Math.round(s.unitsSold * 0.8) };
      return { state: ns, feedback: "Premium pricing increased margins but reduced order volume." };
    },
  },
  {
    id: "marketing-social", label: "Run social media ads", icon: "📱", description: "Spend $400 on targeted social ads",
    apply: (s) => {
      const ns = { ...s, marketing: s.marketing + 400, marketingChannel: "social" as const, unitsSold: Math.round(s.unitsSold * 1.2) };
      return { state: ns, feedback: "Social ads drove 20% more traffic this month." };
    },
  },
  {
    id: "marketing-flyers", label: "Distribute flyers locally", icon: "📄", description: "Spend $150 on local flyer distribution",
    apply: (s) => {
      const ns = { ...s, marketing: s.marketing + 150, marketingChannel: "flyers" as const, unitsSold: Math.round(s.unitsSold * 1.1) };
      return { state: ns, feedback: "Flyers brought in some local customers — modest boost." };
    },
  },
  {
    id: "hire", label: "Hire staff (+1)", icon: "👤", description: "Hire one employee — increases capacity and labor cost",
    apply: (s) => {
      const ns = { ...s, staff: s.staff + 1, labor: s.labor + 800, unitsSold: Math.round(s.unitsSold * 1.15) };
      return { state: ns, feedback: "New hire increased capacity. Labor costs rose by $800/mo." };
    },
  },
  {
    id: "fire", label: "Let go staff (-1)", icon: "👋", description: "Reduce headcount to cut costs",
    apply: (s) => {
      if (s.staff <= 1) return { state: s, feedback: "You need at least 1 staff member." };
      const ns = { ...s, staff: s.staff - 1, labor: Math.max(400, s.labor - 800), unitsSold: Math.round(s.unitsSold * 0.9), reputation: Math.max(0, s.reputation - 3) };
      return { state: ns, feedback: "Reduced staff cut costs but capacity and morale dropped." };
    },
    available: (s) => s.staff > 1,
  },
  {
    id: "inventory-up", label: "Stock up inventory", icon: "📦", description: "Buy extra inventory — costs $600 upfront, prevents stockouts",
    apply: (s) => {
      const ns = { ...s, inventory: s.inventory + 50, cogs: s.cogs + 600 };
      return { state: ns, feedback: "Stocked up! You won't miss sales from stockouts this month." };
    },
  },
  {
    id: "loan", label: "Take a small business loan", icon: "🏦", description: "Borrow $3,000 at $250/mo repayment for 12 months",
    apply: (s) => {
      const ns = { ...s, cash: s.cash + 3000, loanBalance: s.loanBalance + 3000, monthlyLoanPayment: s.monthlyLoanPayment + 250 };
      return { state: ns, feedback: "Received $3,000 loan. Monthly payment: $250 for 12 months." };
    },
    available: (s) => s.loanBalance < 6000,
  },
  {
    id: "discount", label: "Offer a limited-time discount", icon: "🎉", description: "20% off this month — drives volume",
    apply: (s) => {
      const ns = { ...s, unitPrice: Math.round(s.unitPrice * 0.8), unitsSold: Math.round(s.unitsSold * 1.5) };
      return { state: ns, feedback: "Discount drove 50% more orders but at lower margins." };
    },
  },
  {
    id: "expand", label: "Expand to second location", icon: "🏪", description: "Add a location — $2,000 upfront, +$600/mo rent, +50% capacity",
    apply: (s) => {
      if (s.cash < 2000) return { state: s, feedback: "Not enough cash to expand. Need $2,000." };
      const ns = { ...s, cash: s.cash - 2000, rent: s.rent + 600, unitsSold: Math.round(s.unitsSold * 1.5), staff: s.staff + 1, labor: s.labor + 800 };
      return { state: ns, feedback: "Expanded! Higher capacity but fixed costs increased significantly." };
    },
    available: (s) => s.cash >= 2000,
  },
  {
    id: "reviews", label: "Respond to customer reviews", icon: "⭐", description: "Spend time managing reputation — boosts loyalty",
    apply: (s) => {
      const ns = { ...s, reputation: Math.min(100, s.reputation + 8), unitsSold: Math.round(s.unitsSold * 1.05) };
      return { state: ns, feedback: "Engaging with customers improved reputation and repeat business." };
    },
  },
];

// ─── Helpers ───────────────────────────────────────────
function calcMonthFinancials(s: GameState): { revenue: number; expenses: number; netProfit: number } {
  const revenue = s.unitsSold * s.unitPrice;
  const expenses = s.cogs + s.labor + s.rent + s.marketing + s.monthlyLoanPayment;
  return { revenue, expenses, netProfit: revenue - expenses };
}

function cashRunwayMonths(cash: number, monthlyBurn: number): number {
  if (monthlyBurn <= 0) return 99;
  return Math.max(0, Math.round(cash / monthlyBurn));
}

// ─── Sub-components ────────────────────────────────────
const BusinessSelection = ({ onSelect }: { onSelect: (b: BusinessType) => void }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
    <div className="text-center space-y-2">
      <Store className="w-10 h-10 mx-auto text-primary" />
      <h2 className="text-2xl font-black">Choose Your Business</h2>
      <p className="text-sm text-muted-foreground">You have $10,000 in starting capital and 18 months to build a profitable business.</p>
    </div>
    <div className="grid gap-4">
      {BUSINESSES.map(b => (
        <Card key={b.id} className="p-5 border-border/50 hover:border-primary/40 cursor-pointer transition-all group" onClick={() => onSelect(b)}>
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 group-hover:scale-110 transition-transform">
              {b.icon}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg">{b.emoji} {b.name}</h3>
              <p className="text-sm text-muted-foreground mb-2">{b.description}</p>
              <Badge variant="secondary" className="text-xs">{b.riskProfile}</Badge>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary mt-2" />
          </div>
        </Card>
      ))}
    </div>
  </motion.div>
);

const KPITile = ({ label, value, prefix, trend, color }: { label: string; value: number; prefix?: string; trend?: "up" | "down" | "flat"; color: string }) => (
  <Card className="p-3 border-border/50">
    <p className="text-xs text-muted-foreground">{label}</p>
    <div className="flex items-center gap-1 mt-0.5">
      {trend === "up" && <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />}
      {trend === "down" && <ArrowDownRight className="w-3.5 h-3.5 text-destructive" />}
      <p className={`text-lg font-black ${color}`}>{prefix || "$"}{Math.abs(value).toLocaleString()}</p>
    </div>
  </Card>
);

const ProfitLossChart = ({ history }: { history: MonthRecord[] }) => {
  if (history.length === 0) return null;
  const maxVal = Math.max(...history.map(h => Math.max(h.revenue, h.expenses)), 1);

  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold text-muted-foreground uppercase">Profit & Loss</p>
      <div className="flex items-end gap-1 h-32">
        {history.map((h, i) => {
          const revH = (h.revenue / maxVal) * 100;
          const expH = (h.expenses / maxVal) * 100;
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
              <div className="w-full flex gap-px justify-center" style={{ height: `${Math.max(revH, expH)}%` }}>
                <motion.div
                  className="w-1/2 rounded-t bg-primary/70"
                  initial={{ height: 0 }}
                  animate={{ height: `${revH}%` }}
                  transition={{ delay: i * 0.03 }}
                  title={`Rev: $${h.revenue}`}
                  style={{ alignSelf: "flex-end" }}
                />
                <motion.div
                  className="w-1/2 rounded-t bg-destructive/50"
                  initial={{ height: 0 }}
                  animate={{ height: `${expH}%` }}
                  transition={{ delay: i * 0.03 }}
                  title={`Exp: $${h.expenses}`}
                  style={{ alignSelf: "flex-end" }}
                />
              </div>
              <span className="text-[9px] text-muted-foreground">{h.month}</span>
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-4 justify-center text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-primary/70" /> Revenue</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-destructive/50" /> Expenses</span>
      </div>
    </div>
  );
};

const LedgerView = ({ state, biz }: { state: GameState; biz: BusinessType }) => {
  const { revenue, expenses, netProfit } = calcMonthFinancials(state);
  const rows = [
    { label: "Revenue", sublabel: `${state.unitsSold} units × $${state.unitPrice}`, value: revenue, type: "revenue" },
    { label: "COGS", sublabel: "Cost of goods sold", value: -state.cogs, type: "expense" },
    { label: "Labor", sublabel: `${state.staff} staff`, value: -state.labor, type: "expense" },
    { label: "Rent / Overhead", sublabel: "Fixed monthly", value: -state.rent, type: "expense" },
    { label: "Marketing", sublabel: state.marketingChannel, value: -state.marketing, type: "expense" },
    ...(state.monthlyLoanPayment > 0 ? [{ label: "Loan Payment", sublabel: `Balance: $${state.loanBalance.toLocaleString()}`, value: -state.monthlyLoanPayment, type: "expense" }] : []),
    { label: "Net Profit", sublabel: "", value: netProfit, type: netProfit >= 0 ? "profit" : "loss" },
  ];

  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold text-muted-foreground uppercase">Ledger View</p>
      <div className="rounded-xl border border-border/50 overflow-hidden">
        {rows.map((r, i) => (
          <div key={i} className={`flex items-center justify-between px-3 py-2 text-sm ${
            r.type === "profit" ? "bg-emerald-500/5 font-bold border-t-2 border-border" :
            r.type === "loss" ? "bg-destructive/5 font-bold border-t-2 border-border" :
            i % 2 === 0 ? "bg-muted/20" : ""
          }`}>
            <div>
              <span className={r.type === "revenue" ? "text-primary" : ""}>{r.label}</span>
              {r.sublabel && <span className="text-xs text-muted-foreground ml-2">{r.sublabel}</span>}
            </div>
            <span className={
              r.value > 0 ? "text-emerald-500 font-bold" :
              r.value < 0 ? "text-destructive font-bold" : ""
            }>
              {r.value >= 0 ? "+" : ""}{r.value < 0 ? "-" : ""}${Math.abs(r.value).toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Main Component ────────────────────────────────────
export const BusinessStartupSimulator = ({ onClose }: { onClose: () => void }) => {
  const [phase, setPhase] = useState<"select" | "play" | "result">("select");
  const [business, setBusiness] = useState<BusinessType | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [history, setHistory] = useState<MonthRecord[]>([]);
  const [currentMonth, setCurrentMonth] = useState(1);
  const [monthDecisions, setMonthDecisions] = useState<string[]>([]);
  const [currentEvent, setCurrentEvent] = useState<MarketEvent | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const events = useMemo(() => business ? createEvents(business.id) : [], [business]);
  const decisions = useMemo(() => createDecisions(), []);

  const startBusiness = (b: BusinessType) => {
    setBusiness(b);
    const initial: GameState = {
      month: 1, cash: 10000,
      revenue: 0, expenses: 0, netProfit: 0,
      staff: 2, priceLevel: "medium", marketingChannel: "none",
      reputation: 50, inventory: 30, loanBalance: 0, monthlyLoanPayment: 0,
      cogs: b.baseCosts.cogs, labor: b.baseCosts.labor, rent: b.baseCosts.rent,
      marketing: b.baseCosts.marketing,
      unitsSold: b.baseRevenue.avgOrders, unitPrice: b.baseRevenue.unitPrice,
    };
    setGameState(initial);
    setHistory([]);
    setCurrentMonth(1);
    setMonthDecisions([]);
    setFeedback(null);
    setPhase("play");
  };

  const applyDecision = useCallback((d: Decision) => {
    if (!gameState) return;
    const { state: ns, feedback: fb } = d.apply({ ...gameState });
    setGameState(ns);
    setMonthDecisions(prev => [...prev, d.label]);
    setFeedback(fb);
  }, [gameState]);

  const endMonth = useCallback(() => {
    if (!gameState || !business) return;
    let s = { ...gameState };

    // Random event (35% chance)
    let event: MarketEvent | null = null;
    if (Math.random() < 0.35) {
      event = events[Math.floor(Math.random() * events.length)];
      s = event.effect(s);
      setCurrentEvent(event);
      setShowEventModal(true);
    }

    // Calc financials
    const { revenue, expenses, netProfit } = calcMonthFinancials(s);
    s.revenue = revenue;
    s.expenses = expenses;
    s.netProfit = netProfit;
    s.cash = s.cash + netProfit;

    // Loan amortization
    if (s.loanBalance > 0) {
      s.loanBalance = Math.max(0, s.loanBalance - (s.monthlyLoanPayment - 50)); // principal portion
      if (s.loanBalance <= 0) s.monthlyLoanPayment = 0;
    }

    // Reputation drift
    if (netProfit > 0) s.reputation = Math.min(100, s.reputation + 2);
    else s.reputation = Math.max(0, s.reputation - 2);

    const record: MonthRecord = { month: currentMonth, revenue, expenses, netProfit, cash: s.cash, event, decisions: [...monthDecisions] };
    setHistory(prev => [...prev, record]);
    setGameState(s);

    // Reset monthly adjustments for next month
    s.marketing = business.baseCosts.marketing;
    s.unitsSold = Math.round(business.baseRevenue.avgOrders * (1 + (s.reputation - 50) / 100));
    s.unitPrice = business.baseRevenue.unitPrice * (s.priceLevel === "low" ? 0.8 : s.priceLevel === "premium" ? 1.25 : 1);
    setGameState({ ...s });

    if (currentMonth >= 18 || s.cash <= 0) {
      setTimeout(() => setPhase("result"), event ? 1500 : 300);
    } else {
      setCurrentMonth(prev => prev + 1);
      setMonthDecisions([]);
      setFeedback(null);
    }
  }, [gameState, business, currentMonth, events, monthDecisions]);

  // Computed values
  const financials = gameState ? calcMonthFinancials(gameState) : null;
  const burn = financials && financials.netProfit < 0 ? Math.abs(financials.netProfit) : 0;
  const runway = gameState ? cashRunwayMonths(gameState.cash, burn) : 99;

  // Final scores
  const finalScore = useMemo(() => {
    if (history.length === 0 || !gameState) return null;
    const totalProfit = history.reduce((s, r) => s + r.netProfit, 0);
    const profitableMonths = history.filter(r => r.netProfit > 0).length;
    const breakEvenMonth = history.findIndex(r => r.netProfit > 0) + 1;
    const bankrupt = gameState.cash <= 0;
    const valuation = Math.max(0, Math.round(totalProfit * 3 + gameState.cash));

    let grade = "F";
    if (bankrupt) grade = "F";
    else if (profitableMonths >= 12 && totalProfit > 5000) grade = "A+";
    else if (profitableMonths >= 9) grade = "A";
    else if (profitableMonths >= 6) grade = "B";
    else if (profitableMonths >= 3) grade = "C";
    else grade = "D";

    return { totalProfit, profitableMonths, breakEvenMonth, bankrupt, valuation, grade };
  }, [history, gameState]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border/50 px-4 py-3">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <Button variant="ghost" size="sm" onClick={onClose} className="gap-1.5">
            <ArrowLeft className="w-4 h-4" /> Exit
          </Button>
          <div className="text-center">
            <h1 className="font-black text-sm">Business Startup Simulator</h1>
            {phase === "play" && <p className="text-xs text-muted-foreground">Month {currentMonth} of 18 · {business?.name}</p>}
          </div>
          {phase === "play" && gameState ? (
            <Badge variant="outline" className="text-xs"><DollarSign className="w-3 h-3 mr-0.5" />${gameState.cash.toLocaleString()}</Badge>
          ) : <div className="w-16" />}
        </div>
        {phase === "play" && <div className="max-w-2xl mx-auto mt-2"><Progress value={(currentMonth / 18) * 100} className="h-1.5" /></div>}
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-4">
        {/* Event Modal */}
        <AnimatePresence>
          {showEventModal && currentEvent && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setShowEventModal(false)}>
              <Card className="max-w-sm w-full p-6 space-y-4" onClick={e => e.stopPropagation()}>
                <div className="text-center space-y-2">
                  <span className="text-5xl">{currentEvent.icon}</span>
                  <h3 className="text-xl font-black">{currentEvent.title}</h3>
                  <Badge variant={currentEvent.type === "positive" ? "default" : currentEvent.type === "negative" ? "destructive" : "secondary"}>
                    {currentEvent.type === "positive" ? "📈 Positive" : currentEvent.type === "negative" ? "📉 Negative" : "ℹ️ Neutral"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground text-center">{currentEvent.description}</p>
                <Button className="w-full" onClick={() => setShowEventModal(false)}>Continue</Button>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {/* Business selection */}
          {phase === "select" && <BusinessSelection onSelect={startBusiness} />}

          {/* Gameplay */}
          {phase === "play" && gameState && business && financials && (
            <motion.div key={`play-${currentMonth}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              {/* KPI tiles */}
              <div className="grid grid-cols-3 gap-3">
                <KPITile label="Revenue" value={financials.revenue} trend={financials.revenue > 0 ? "up" : "flat"} color="text-primary" />
                <KPITile label="Expenses" value={financials.expenses} trend="flat" color="text-amber-500" />
                <KPITile label="Net P/L" value={financials.netProfit} trend={financials.netProfit >= 0 ? "up" : "down"} color={financials.netProfit >= 0 ? "text-emerald-500" : "text-destructive"} />
              </div>

              {/* Cash Runway */}
              <Card className="p-3 border-border/50">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5 text-sm">
                    <Flame className="w-4 h-4 text-amber-500" />
                    <span className="font-semibold">Cash Runway</span>
                  </div>
                  <span className={`text-sm font-bold ${runway > 6 ? "text-emerald-500" : runway > 3 ? "text-amber-500" : "text-destructive"}`}>
                    {burn > 0 ? `${runway} months` : "Profitable ✓"}
                  </span>
                </div>
                <div className="h-2.5 rounded-full bg-muted/50 overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${runway > 6 ? "bg-emerald-500" : runway > 3 ? "bg-amber-500" : "bg-destructive"}`}
                    initial={false}
                    animate={{ width: `${Math.min(100, (runway / 18) * 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Rep: {gameState.reputation}/100</span>
                  <span>Staff: {gameState.staff}</span>
                  <span>Cash: ${gameState.cash.toLocaleString()}</span>
                </div>
              </Card>

              {/* Tabs: Dashboard / Ledger */}
              <Tabs defaultValue="dashboard">
                <TabsList className="w-full grid grid-cols-2">
                  <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                  <TabsTrigger value="ledger">Ledger View</TabsTrigger>
                </TabsList>
                <TabsContent value="dashboard" className="space-y-4 mt-3">
                  {history.length > 0 && (
                    <Card className="p-4 border-border/50"><ProfitLossChart history={history} /></Card>
                  )}
                </TabsContent>
                <TabsContent value="ledger" className="mt-3">
                  <Card className="p-4 border-border/50"><LedgerView state={gameState} biz={business} /></Card>
                </TabsContent>
              </Tabs>

              {/* Feedback */}
              <AnimatePresence>
                {feedback && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 text-xs text-muted-foreground">
                      💡 {feedback}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Decisions */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Monthly Decisions</p>
                  <Badge variant="secondary" className="text-xs">{monthDecisions.length} made</Badge>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {decisions.filter(d => !d.available || d.available(gameState)).map(d => (
                    <Card key={d.id} className="p-3 border-border/50 hover:border-primary/40 cursor-pointer transition-all" onClick={() => applyDecision(d)}>
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

              {/* End month button */}
              <Button className="w-full gap-2" size="lg" onClick={endMonth}>
                <BarChart3 className="w-4 h-4" /> End Month {currentMonth}
              </Button>

              {gameState.cash < 1000 && (
                <p className="text-xs text-destructive text-center font-medium">⚠️ Cash is running low! Consider cutting costs or taking a loan.</p>
              )}
            </motion.div>
          )}

          {/* Results */}
          {phase === "result" && finalScore && gameState && business && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="text-center space-y-2">
                {finalScore.bankrupt ? (
                  <><span className="text-5xl">💔</span><h2 className="text-2xl font-black text-destructive">Business Failed</h2></>
                ) : (
                  <><Award className="w-12 h-12 mx-auto text-primary" /><h2 className="text-2xl font-black">18-Month Results</h2></>
                )}
                <p className="text-sm text-muted-foreground">{business.emoji} {business.name}</p>
              </div>

              {/* Grade */}
              <Card className="p-6 text-center border-primary/30 bg-primary/5">
                <p className="text-sm text-muted-foreground mb-1">Final Grade</p>
                <p className={`text-6xl font-black ${
                  finalScore.grade.startsWith("A") ? "text-emerald-500" :
                  finalScore.grade === "B" ? "text-primary" :
                  finalScore.grade === "C" ? "text-amber-500" : "text-destructive"
                }`}>{finalScore.grade}</p>
              </Card>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Total Profit", value: `$${finalScore.totalProfit.toLocaleString()}`, color: finalScore.totalProfit >= 0 ? "text-emerald-500" : "text-destructive" },
                  { label: "Profitable Months", value: `${finalScore.profitableMonths}/18`, color: finalScore.profitableMonths >= 9 ? "text-emerald-500" : "text-amber-500" },
                  { label: "Break-Even Month", value: finalScore.breakEvenMonth > 0 ? `Month ${finalScore.breakEvenMonth}` : "Never", color: finalScore.breakEvenMonth > 0 && finalScore.breakEvenMonth <= 6 ? "text-emerald-500" : "text-amber-500" },
                  { label: "Valuation", value: `$${finalScore.valuation.toLocaleString()}`, color: "text-primary" },
                ].map(s => (
                  <Card key={s.label} className="p-3 border-border/50 text-center">
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                    <p className={`text-lg font-black ${s.color}`}>{s.value}</p>
                  </Card>
                ))}
              </div>

              {/* P&L chart */}
              {history.length > 0 && (
                <Card className="p-4 border-border/50"><ProfitLossChart history={history} /></Card>
              )}

              {/* Insight */}
              <Card className="p-4 border-primary/20 bg-primary/5">
                <p className="text-sm font-bold mb-1">📋 Post-Mortem</p>
                <p className="text-xs text-muted-foreground">
                  {finalScore.bankrupt
                    ? "Your business ran out of cash. Key lesson: monitor your burn rate and cash runway closely. Even profitable businesses fail without cash flow management."
                    : finalScore.profitableMonths >= 12
                    ? `Excellent performance! ${finalScore.profitableMonths} profitable months shows strong business fundamentals. Your estimated exit valuation is $${finalScore.valuation.toLocaleString()}.`
                    : `Mixed results with ${finalScore.profitableMonths} profitable months. Focus on reaching profitability faster by controlling costs early and scaling marketing once unit economics are proven.`}
                </p>
              </Card>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 gap-1.5" onClick={() => { setPhase("select"); setHistory([]); }}>
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

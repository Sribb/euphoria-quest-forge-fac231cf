import React, { useState, useMemo } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import {
  BookOpen,
  TrendingUp,
  Bot,
  Gamepad2,
  Search,
  Plus,
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  Settings,
  Info,
  Database,
  Mail,
  List,
  User,
  Heart,
  Flame,
  Trophy,
  Star,
  DollarSign,
  PieChart,
  BrainCircuit,
  Target,
  Zap,
  FileText,
  Folder,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TabConfig {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: string;
  header: string;
  description: string;
}

const TABS: TabConfig[] = [
  {
    id: "lessons",
    label: "Lessons",
    icon: BookOpen,
    header: "Interactive Curriculum",
    description: "Bite-sized lessons with real market scenarios.",
  },
  {
    id: "portfolio",
    label: "Portfolio",
    icon: TrendingUp,
    header: "Portfolio Tracker",
    description: "Track your simulated investments in real time.",
    badge: "Live",
  },
  {
    id: "ai-coach",
    label: "AI Coach",
    icon: Bot,
    header: "AI-Powered Mentor",
    description: "Personalized guidance that adapts to you.",
    badge: "New",
  },
  {
    id: "games",
    label: "Games",
    icon: Gamepad2,
    header: "Investment Games",
    description: "Compete, earn XP, and climb the leaderboard.",
  },
];

const BentoCard = () => {
  const [activeTab, setActiveTab] = useState(TABS[0]);

  const content = useMemo(() => {
    switch (activeTab.id) {
      case "lessons":
        return <LessonsDashboard />;
      case "portfolio":
        return <PortfolioDashboard />;
      case "ai-coach":
        return <AICoachDashboard />;
      case "games":
        return <GamesDashboard />;
      default:
        return null;
    }
  }, [activeTab.id]);

  return (
    <div className="w-full max-w-4xl mx-auto relative z-10">
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex flex-col gap-1 px-1">
          <h3 className="font-heading text-xl font-bold text-foreground">
            Euphoria Platform
          </h3>
          <p className="text-sm text-muted-foreground">
            Everything you need to master investing — lessons, simulations, and
            AI coaching in one place.
          </p>
        </div>

        {/* Main Card */}
        <div className="rounded-xl border border-white/[0.07] bg-card overflow-hidden">
          <LayoutGroup>
            {/* Window Chrome */}
            <div className="flex items-center justify-between border-b border-white/[0.07] px-4 py-2.5">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-[hsl(0_40%_45%)]" />
                  <div className="w-2 h-2 rounded-full bg-[hsl(45_50%_45%)]" />
                  <div className="w-2 h-2 rounded-full bg-[hsl(142_40%_40%)]" />
                </div>
                <span className="text-[11px] text-muted-foreground font-medium">
                  Euphoria
                </span>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex min-h-[380px]">
              {/* Sidebar Tabs */}
              <div className="w-[180px] border-r border-white/[0.07] p-2 flex flex-col gap-0.5 shrink-0">
                {TABS.map((tab) => {
                  const isActive = activeTab.id === tab.id;
                  const Icon = tab.icon;

                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab)}
                      className={cn(
                        "relative flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-colors cursor-pointer text-left",
                        isActive
                          ? "text-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <Icon className="w-3.5 h-3.5 shrink-0" />
                      <span className="font-medium">{tab.label}</span>
                      {tab.badge && (
                        <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded-md bg-primary/15 text-primary font-medium">
                          {tab.badge}
                        </span>
                      )}

                      {isActive && (
                        <motion.div
                          layoutId="bento-active-bg"
                          className="absolute inset-0 rounded-lg bg-white/[0.06]"
                          transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                        />
                      )}
                      {isActive && (
                        <motion.div
                          layoutId="bento-active-border"
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-4 rounded-full bg-primary"
                          transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Main Content Panel */}
              <div className="flex-1 p-4 flex flex-col gap-3 overflow-hidden">
                {/* Tab Header */}
                <div className="flex flex-col gap-0.5">
                  <h4 className="text-sm font-semibold text-foreground">
                    {activeTab.header}
                  </h4>
                  <p className="text-[11px] text-muted-foreground">
                    {activeTab.description}
                  </p>
                </div>

                {/* Tab Content */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                    className="flex-1"
                  >
                    {content}
                  </motion.div>
                </AnimatePresence>

                {/* Footer */}
                <div className="flex items-center justify-between pt-2 border-t border-white/[0.05]">
                  <span className="text-[10px] text-muted-foreground/60">
                    euphoria.app
                  </span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] text-muted-foreground/60">
                      Simulation Active
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </LayoutGroup>
        </div>
      </div>
    </div>
  );
};

export default BentoCard;

/* ─── Tab Content Components ─── */

const LessonsDashboard = () => (
  <div className="flex flex-col gap-3 h-full">
    {/* Progress Card */}
    <div className="rounded-lg border border-white/[0.07] bg-white/[0.02] p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-foreground">
          Learning Progress
        </span>
        <span className="text-[10px] text-primary font-medium">72%</span>
      </div>
      <div className="w-full h-1.5 rounded-full bg-white/[0.06]">
        <div className="h-full w-[72%] rounded-full bg-primary" />
      </div>
      <p className="text-[10px] text-muted-foreground mt-2">
        18 of 25 lessons completed
      </p>
    </div>

    {/* Lesson Cards */}
    <div className="grid grid-cols-2 gap-2">
      {[
        { title: "Intro to Investing", status: "Completed", icon: CheckCircle2, color: "text-emerald-400" },
        { title: "Reading Charts", status: "In Progress", icon: BarChart3, color: "text-primary" },
        { title: "Risk Management", status: "Locked", icon: Target, color: "text-muted-foreground/40" },
        { title: "Portfolio Strategy", status: "Locked", icon: PieChart, color: "text-muted-foreground/40" },
      ].map((lesson, i) => (
        <div
          key={i}
          className="rounded-lg border border-white/[0.07] bg-white/[0.02] p-2.5 flex flex-col gap-1.5"
        >
          <lesson.icon className={cn("w-3.5 h-3.5", lesson.color)} />
          <span className="text-[11px] font-medium text-foreground">
            {lesson.title}
          </span>
          <span className="text-[9px] text-muted-foreground">{lesson.status}</span>
        </div>
      ))}
    </div>
  </div>
);

const PortfolioDashboard = () => (
  <div className="flex flex-col gap-3 h-full">
    {/* Portfolio Value */}
    <div className="rounded-lg border border-white/[0.07] bg-white/[0.02] p-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] text-muted-foreground mb-0.5">Total Value</p>
          <p className="text-lg font-heading font-bold text-foreground">$12,847</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-emerald-400 font-medium">+12.4%</p>
          <p className="text-[9px] text-muted-foreground">This month</p>
        </div>
      </div>
      {/* Mini chart bars */}
      <div className="flex items-end gap-1 mt-3 h-8">
        {[40, 55, 35, 65, 50, 70, 60, 80, 75, 90, 85, 95].map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-sm bg-primary/30"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
    </div>

    {/* Holdings */}
    <div className="space-y-1.5">
      {[
        { symbol: "AAPL", name: "Apple Inc.", change: "+2.1%", positive: true },
        { symbol: "TSLA", name: "Tesla Inc.", change: "-0.8%", positive: false },
        { symbol: "VOO", name: "Vanguard S&P 500", change: "+1.4%", positive: true },
      ].map((stock, i) => (
        <div
          key={i}
          className="flex items-center justify-between rounded-lg border border-white/[0.07] bg-white/[0.02] px-3 py-2"
        >
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-white/[0.06] flex items-center justify-center">
              <DollarSign className="w-3 h-3 text-muted-foreground" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-foreground">{stock.symbol}</p>
              <p className="text-[9px] text-muted-foreground">{stock.name}</p>
            </div>
          </div>
          <span
            className={cn(
              "text-[11px] font-medium",
              stock.positive ? "text-emerald-400" : "text-red-400"
            )}
          >
            {stock.change}
          </span>
        </div>
      ))}
    </div>
  </div>
);

const AICoachDashboard = () => (
  <div className="flex flex-col gap-3 h-full">
    {/* Quick Action Cards */}
    <div className="grid grid-cols-2 gap-2">
      {[
        { title: "Ask a Question", desc: "Get instant answers.", icon: BrainCircuit },
        { title: "Review Mistakes", desc: "Learn from errors.", icon: Target },
      ].map((card, i) => (
        <div
          key={i}
          className="rounded-lg border border-white/[0.07] bg-white/[0.02] p-3 flex flex-col gap-2"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium text-foreground">{card.title}</p>
              <p className="text-[9px] text-muted-foreground">{card.desc}</p>
            </div>
            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
              <card.icon className="w-3.5 h-3.5 text-primary" />
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* AI Insight */}
    <div className="rounded-lg border border-primary/20 bg-primary/[0.04] p-3">
      <div className="flex items-start gap-2">
        <Zap className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
        <div>
          <p className="text-[11px] font-medium text-foreground mb-1">
            Weekly Insight
          </p>
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            You're strongest in portfolio diversification but tend to over-invest
            in single sectors. Try the Risk Management lesson next.
          </p>
        </div>
      </div>
    </div>

    {/* Weak Areas */}
    <div className="rounded-lg border border-white/[0.07] bg-white/[0.02] p-3">
      <p className="text-[10px] font-medium text-foreground mb-2">Areas to Improve</p>
      <div className="space-y-1.5">
        {[
          { area: "Technical Analysis", score: 45 },
          { area: "Options Trading", score: 28 },
          { area: "Market Timing", score: 62 },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-[9px] text-muted-foreground w-24 shrink-0">{item.area}</span>
            <div className="flex-1 h-1 rounded-full bg-white/[0.06]">
              <div
                className="h-full rounded-full bg-primary/60"
                style={{ width: `${item.score}%` }}
              />
            </div>
            <span className="text-[9px] text-muted-foreground w-6 text-right">{item.score}%</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const GamesDashboard = () => (
  <div className="flex flex-col gap-3 h-full">
    {/* Stats Row */}
    <div className="grid grid-cols-3 gap-2">
      {[
        { label: "XP Earned", value: "4,280", icon: Star, color: "text-amber-400" },
        { label: "Streak", value: "12 days", icon: Flame, color: "text-orange-400" },
        { label: "Rank", value: "#47", icon: Trophy, color: "text-primary" },
      ].map((stat, i) => (
        <div
          key={i}
          className="rounded-lg border border-white/[0.07] bg-white/[0.02] p-2.5 text-center"
        >
          <stat.icon className={cn("w-3.5 h-3.5 mx-auto mb-1", stat.color)} />
          <p className="text-xs font-bold text-foreground">{stat.value}</p>
          <p className="text-[8px] text-muted-foreground">{stat.label}</p>
        </div>
      ))}
    </div>

    {/* Game List */}
    <div className="space-y-1.5">
      {[
        { title: "Bull vs Bear", desc: "Predict market direction", reward: "50 XP", status: "Play Now" },
        { title: "Portfolio Challenge", desc: "Beat the S&P 500", reward: "100 XP", status: "Play Now" },
        { title: "Speed Trading", desc: "React to breaking news", reward: "75 XP", status: "Locked" },
      ].map((game, i) => (
        <div
          key={i}
          className="flex items-center justify-between rounded-lg border border-white/[0.07] bg-white/[0.02] px-3 py-2.5"
        >
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-white/[0.06] flex items-center justify-center">
              <Gamepad2 className="w-3.5 h-3.5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-foreground">{game.title}</p>
              <p className="text-[9px] text-muted-foreground">{game.desc}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[9px] text-primary font-medium">{game.reward}</p>
            <p className="text-[8px] text-muted-foreground">{game.status}</p>
          </div>
        </div>
      ))}
    </div>

    {/* Hearts */}
    <div className="flex items-center gap-2 rounded-lg border border-white/[0.07] bg-white/[0.02] px-3 py-2">
      <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" />
      <span className="text-[10px] text-foreground font-medium">4 lives remaining</span>
      <span className="text-[9px] text-muted-foreground ml-auto">Refills in 2h</span>
    </div>
  </div>
);

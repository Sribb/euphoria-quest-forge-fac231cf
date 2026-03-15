import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, TrendingUp, Gamepad2, Brain, GraduationCap, Award,
  BarChart3, Zap, Trophy, Target, Coins, Star, ArrowUpRight, ArrowDownRight,
  LineChart, Users, Flame, ChevronRight
} from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Interactive Lessons",
    subtitle: "25+ hands-on simulations",
    description: "Learn by making real decisions in scenario-based lessons that adapt to your skill level.",
  },
  {
    icon: TrendingUp,
    title: "AI Market Simulation",
    subtitle: "Real-time trading engine",
    description: "Trade with AI-driven events, breaking news, and dynamic pricing — zero real money risk.",
  },
  {
    icon: Gamepad2,
    title: "Investment Games",
    subtitle: "5 competitive modes",
    description: "Master investing through play, competition, and strategy with leaderboards and rewards.",
  },
  {
    icon: Brain,
    title: "AI Coach",
    subtitle: "Personalized guidance",
    description: "Get instant, personalized feedback on every trade decision and portfolio move.",
  },
  {
    icon: GraduationCap,
    title: "Educator Tools",
    subtitle: "Classroom management",
    description: "Create classes, track student progress, identify struggling learners, and export analytics.",
  },
  {
    icon: Award,
    title: "XP & Levels",
    subtitle: "Gamified progression",
    description: "Earn XP, unlock badges, maintain streaks, and compete on global leaderboards.",
  },
];

// ── Mock preview panels for each feature ──────────────────────────
const LessonsPreview = () => (
  <div className="space-y-4">
    <div className="flex items-center gap-3 mb-6">
      <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
        <BookOpen className="w-5 h-5 text-primary" />
      </div>
      <div>
        <p className="text-sm font-medium text-foreground">Lesson 5: Risk & Reward</p>
        <p className="text-xs text-muted-foreground">Intermediate · 12 min</p>
      </div>
    </div>
    <div className="bg-muted/30 rounded-xl p-5 border border-white/[0.07]">
      <p className="text-sm font-medium mb-3">📊 Scenario: You have $10,000 to invest</p>
      <p className="text-xs text-muted-foreground mb-4">The market just dropped 15%. What's your move?</p>
      <div className="grid grid-cols-2 gap-2">
        {["Buy the dip", "Hold position", "Sell everything", "Hedge with bonds"].map((opt) => (
          <div key={opt} className="px-3 py-2.5 rounded-lg bg-card border border-white/[0.07] text-xs font-medium hover:border-primary/40 transition-colors cursor-pointer text-center">
            {opt}
          </div>
        ))}
      </div>
    </div>
    <div className="flex items-center justify-between px-1">
      <div className="flex items-center gap-1.5">
        <div className="w-2 h-2 rounded-full bg-primary" />
        <div className="w-2 h-2 rounded-full bg-primary" />
        <div className="w-2 h-2 rounded-full bg-primary" />
        <div className="w-2 h-2 rounded-full bg-primary/30" />
        <div className="w-2 h-2 rounded-full bg-primary/30" />
      </div>
      <p className="text-[10px] text-muted-foreground">3 of 5 complete</p>
    </div>
  </div>
);

const MarketPreview = () => {
  const prices = [42, 45, 43, 48, 52, 49, 55, 58, 54, 60, 63, 59, 65];
  const max = Math.max(...prices);
  const min = Math.min(...prices);
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="text-sm font-medium text-foreground">AAPL</p>
          <p className="text-xs text-muted-foreground">Apple Inc.</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-success">$187.44</p>
          <p className="text-xs text-success flex items-center gap-0.5 justify-end"><ArrowUpRight className="w-3 h-3" />+2.34%</p>
        </div>
      </div>
      <div className="h-32 flex items-end gap-[3px] px-1">
        {prices.map((p, i) => (
          <motion.div
            key={i}
            className="flex-1 rounded-t bg-gradient-to-t from-success/60 to-success/20"
            initial={{ height: 0 }}
            animate={{ height: `${((p - min) / (max - min)) * 100 + 15}%` }}
            transition={{ delay: i * 0.05, duration: 0.4 }}
          />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-muted/30 rounded-lg p-2.5 border border-white/[0.07] text-center">
          <p className="text-[10px] text-muted-foreground">Volume</p>
          <p className="text-xs font-medium">52.3M</p>
        </div>
        <div className="bg-muted/30 rounded-lg p-2.5 border border-white/[0.07] text-center">
          <p className="text-[10px] text-muted-foreground">P/E Ratio</p>
          <p className="text-xs font-medium">28.4</p>
        </div>
        <div className="bg-muted/30 rounded-lg p-2.5 border border-white/[0.07] text-center">
          <p className="text-[10px] text-muted-foreground">Mkt Cap</p>
          <p className="text-xs font-medium">2.89T</p>
        </div>
      </div>
    </div>
  );
};

const GamesPreview = () => (
  <div className="space-y-3">
    <div className="flex items-center gap-2 mb-4">
      <Trophy className="w-5 h-5 text-warning" />
      <p className="text-sm font-medium text-foreground">Leaderboard — Trend Master</p>
    </div>
    {[
      { name: "Alex R.", score: "12,450", rank: 1, change: "+3" },
      { name: "Mia K.", score: "11,200", rank: 2, change: "+1" },
      { name: "You", score: "10,890", rank: 3, change: "+5", highlight: true },
      { name: "Sam P.", score: "9,750", rank: 4, change: "-2" },
    ].map((p) => (
      <div key={p.name} className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${p.highlight ? "bg-primary/10 border-primary/30" : "bg-muted/20 border-white/[0.07]"}`}>
        <div className="flex items-center gap-3">
          <span className={`text-sm font-medium w-6 text-center ${p.rank === 1 ? "text-warning" : "text-muted-foreground"}`}>#{p.rank}</span>
          <span className="text-sm font-medium">{p.name}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-success font-medium">{p.change}</span>
          <span className="text-sm font-medium">{p.score}</span>
        </div>
      </div>
    ))}
  </div>
);

const CoachPreview = () => (
  <div className="space-y-4">
    <div className="flex items-center gap-3 mb-2">
      <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center">
        <Brain className="w-4 h-4 text-primary" />
      </div>
      <div>
        <p className="text-sm font-medium text-foreground">AI Coach</p>
        <p className="text-[10px] text-muted-foreground">Analyzing your portfolio…</p>
      </div>
    </div>
    <div className="bg-muted/30 rounded-xl p-4 border border-white/[0.07] space-y-3">
      <div className="flex items-start gap-2">
        <Zap className="w-4 h-4 text-warning mt-0.5 flex-shrink-0" />
        <p className="text-xs leading-relaxed"><span className="font-medium">Insight:</span> Your portfolio is 78% tech stocks. Consider diversifying into healthcare or consumer staples to reduce sector risk.</p>
      </div>
      <div className="flex items-start gap-2">
        <Target className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
        <p className="text-xs leading-relaxed"><span className="font-medium">Opportunity:</span> MSFT is trading 12% below its 52-week average. This aligns with your growth strategy.</p>
      </div>
    </div>
    <div className="flex gap-2">
      <div className="flex-1 bg-success/10 border border-success/20 rounded-lg p-3 text-center">
        <p className="text-lg font-bold text-success">A-</p>
        <p className="text-[10px] text-muted-foreground">Risk Score</p>
      </div>
      <div className="flex-1 bg-primary/10 border border-primary/20 rounded-lg p-3 text-center">
        <p className="text-lg font-bold text-primary">87%</p>
        <p className="text-[10px] text-muted-foreground">Accuracy</p>
      </div>
      <div className="flex-1 bg-warning/10 border border-warning/20 rounded-lg p-3 text-center">
        <p className="text-lg font-bold text-warning">14</p>
        <p className="text-[10px] text-muted-foreground">Tips Given</p>
      </div>
    </div>
  </div>
);

const EducatorPreview = () => (
  <div className="space-y-4">
    <div className="flex items-center justify-between mb-2">
      <p className="text-sm font-medium text-foreground">AP Econ — Period 3</p>
      <span className="text-[10px] bg-success/10 text-success px-2 py-1 rounded-full font-medium">24 Active</span>
    </div>
    <div className="grid grid-cols-2 gap-3">
      <div className="bg-muted/30 rounded-xl p-3.5 border border-white/[0.07]">
        <p className="text-[10px] text-muted-foreground mb-1">Avg. Completion</p>
        <p className="text-xl font-bold">73%</p>
        <div className="w-full h-[3px] bg-white/[0.1] rounded-full mt-2 overflow-hidden">
          <motion.div className="h-full bg-primary rounded-full" initial={{ width: 0 }} animate={{ width: "73%" }} transition={{ duration: 1, delay: 0.3 }} />
        </div>
      </div>
      <div className="bg-muted/30 rounded-xl p-3.5 border border-white/[0.07]">
        <p className="text-[10px] text-muted-foreground mb-1">Avg. Quiz Score</p>
        <p className="text-xl font-bold">82%</p>
        <div className="w-full h-[3px] bg-white/[0.1] rounded-full mt-2 overflow-hidden">
          <motion.div className="h-full bg-success rounded-full" initial={{ width: 0 }} animate={{ width: "82%" }} transition={{ duration: 1, delay: 0.4 }} />
        </div>
      </div>
    </div>
    <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-3">
      <p className="text-[10px] font-medium text-destructive mb-1.5">⚠ 3 Students Need Attention</p>
      <p className="text-[10px] text-muted-foreground">Behind pace on Lessons 4–6. Consider assigning review exercises.</p>
    </div>
  </div>
);

const XPPreview = () => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-foreground">Level 14 — Market Strategist</p>
        <p className="text-xs text-muted-foreground">2,340 / 3,000 XP to Level 15</p>
      </div>
      <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center text-sm font-bold text-primary">14</div>
    </div>
    <div className="w-full h-[3px] bg-white/[0.1] rounded-full overflow-hidden">
      <motion.div className="h-full bg-primary rounded-full relative" initial={{ width: 0 }} animate={{ width: "78%" }} transition={{ duration: 1.2 }}>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
      </motion.div>
    </div>
    <div className="space-y-2.5">
      <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Recent Achievements</p>
      {[
        { icon: Flame, label: "7-Day Streak", xp: "+50 XP", color: "text-warning" },
        { icon: Trophy, label: "Lesson Ace", xp: "+100 XP", color: "text-primary" },
        { icon: Star, label: "First Trade", xp: "+75 XP", color: "text-success" },
      ].map((a) => (
        <div key={a.label} className="flex items-center justify-between p-2.5 rounded-lg bg-muted/20 border border-white/[0.07]">
          <div className="flex items-center gap-2.5">
            <a.icon className={`w-4 h-4 ${a.color}`} />
            <span className="text-xs font-medium">{a.label}</span>
          </div>
          <span className="text-[10px] font-medium text-success">{a.xp}</span>
        </div>
      ))}
    </div>
  </div>
);

const previewComponents = [LessonsPreview, MarketPreview, GamesPreview, CoachPreview, EducatorPreview, XPPreview];

export const FeatureShowcase = () => {
  const [active, setActive] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    if (!autoPlay) return;
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % features.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [autoPlay]);

  const handleSelect = (i: number) => {
    setActive(i);
    setAutoPlay(false);
    setTimeout(() => setAutoPlay(true), 15000);
  };

  const ActivePreview = previewComponents[active];
  const activeFeature = features[active];

  return (
    <section id="features" className="py-28 md:py-36 relative overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header — left-aligned */}
        <motion.div
          className="mb-20 max-w-xl"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-[11px] font-medium text-primary uppercase tracking-[0.15em] mb-4">Features</p>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-5 leading-[1.08]">
            Everything you need to master investing
          </h2>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-[480px]">
            From interactive lessons to AI-powered trading — gamified for maximum retention.
          </p>
        </motion.div>

        {/* Split Layout */}
        <motion.div
          className="grid lg:grid-cols-[380px_1fr] gap-8 lg:gap-12 items-start"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Left: Feature List — left-border selection */}
          <div className="space-y-1">
            {features.map((f, i) => {
              const isActive = i === active;
              return (
                <motion.button
                  key={i}
                  onClick={() => handleSelect(i)}
                  className={`w-full text-left p-4 rounded-lg transition-all duration-300 relative ${
                    isActive
                      ? "border-l-2 border-l-primary bg-[hsl(263_70%_50%/0.06)]"
                      : "border-l-2 border-l-transparent hover:bg-white/[0.02]"
                  }`}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                      isActive ? "bg-transparent" : "bg-transparent"
                    }`}>
                      <f.icon className={`w-[18px] h-[18px] transition-colors duration-300 ${isActive ? "text-foreground" : "text-muted-foreground"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium transition-colors duration-300 ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                        {f.title}
                      </p>
                      <AnimatePresence>
                        {isActive && (
                          <motion.p
                            className="text-[11px] text-muted-foreground mt-0.5"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            {f.subtitle}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Expandable description */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.p
                        className="text-xs text-muted-foreground leading-relaxed pl-[52px] pr-4 mt-2"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        {f.description}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  {/* Auto-play progress bar */}
                  {isActive && autoPlay && (
                    <motion.div
                      className="absolute bottom-0 left-0 h-[2px] bg-primary"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 5, ease: "linear" }}
                      key={`progress-${active}`}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Right: Preview Panel */}
          <div className="relative">
            <div className="rounded-xl bg-card border border-white/[0.07] p-6 md:p-8 min-h-[420px] relative overflow-hidden">
              {/* Top bar — muted dots */}
              <div className="flex items-center gap-1.5 mb-6">
                <div className="w-2 h-2 rounded-full bg-destructive/50" />
                <div className="w-2 h-2 rounded-full bg-warning/50" />
                <div className="w-2 h-2 rounded-full bg-success/50" />
                <span className="ml-3 text-[10px] text-muted-foreground/50 font-medium">{activeFeature.title}</span>
              </div>

              {/* Animated content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, x: 20, scale: 0.98 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -20, scale: 0.98 }}
                  transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="relative z-10"
                >
                  <ActivePreview />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

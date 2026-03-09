import { Trophy, Brain, Users, Coins, TrendingUp, Globe, Wallet, Gamepad2, Zap, Play, Star, Clock, CircleDollarSign, CreditCard, Store } from "lucide-react";
import { useState } from "react";
import { LifeSimInvestorGame } from "@/features/games/components/LifeSimInvestorGame";
import { TrendMasterGame } from "@/features/games/components/TrendMasterGame";
import { AICompetitorGame } from "@/features/games/components/AICompetitorGame";
import { MarketReactionGame } from "@/features/games/components/MarketReactionGame";
import { BudgetBalancerGame } from "@/features/games/components/BudgetBalancerGame";
import { BudgetSimulatorGame } from "@/features/games/components/BudgetSimulatorGame";
import { CreditScoreSimulator } from "@/features/games/components/CreditScoreSimulator";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface GamesProps {
  onNavigate: (tab: string) => void;
}

const games = [
  {
    id: "trend-master",
    title: "Trend Master",
    description: "Master 20+ real chart patterns from uptrends to head-and-shoulders. Interactive charts with instant feedback.",
    icon: TrendingUp,
    color: "text-primary",
    bg: "bg-primary/10",
    badge: "Featured",
    badgeColor: "bg-primary/20 text-primary",
    stats: "20+ Patterns",
    featured: true,
  },
  {
    id: "market-reaction",
    title: "Market Reaction",
    description: "Predict bullish, bearish, or neutral reactions to real-world news scenarios. Learn how global events move markets.",
    icon: Globe,
    color: "text-warning",
    bg: "bg-warning/10",
    badge: "New",
    badgeColor: "bg-success/20 text-success",
    stats: "15 Scenarios",
  },
  {
    id: "budget-balancer",
    title: "Budget Balancer",
    description: "Master the 50/30/20 rule! Balance needs, wants, and savings across life scenarios from fresh graduate to entrepreneur.",
    icon: Wallet,
    color: "text-success",
    bg: "bg-success/10",
    badge: "New",
    badgeColor: "bg-success/20 text-success",
    stats: "3 Challenges",
  },
  {
    id: "life-sim",
    title: "Life Sim: Investor Journey",
    description: "Live a full investing life from age 22 to retirement! Make career moves, buy homes, and manage portfolios.",
    icon: Trophy,
    color: "text-warning",
    bg: "bg-warning/10",
    badge: "Epic",
    badgeColor: "bg-warning/20 text-warning",
    stats: "40+ Years",
  },
  {
    id: "budget-sim",
    title: "Budget Simulator",
    description: "Live 12 months managing real budgets as a college grad, single parent, or trade worker. Handle surprise expenses and build savings.",
    icon: CircleDollarSign,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    badge: "New",
    badgeColor: "bg-emerald-500/20 text-emerald-500",
    stats: "12 Months",
  },
  {
    id: "ai-competitor",
    title: "AI Challenge",
    description: "Compete against 4 AI traders with unique strategies. Can you outperform Momentum Mike and Value Victor?",
    icon: Brain,
    color: "text-accent",
    bg: "bg-accent/10",
    badge: "Competitive",
    badgeColor: "bg-accent/20 text-accent",
    stats: "4 AI Opponents",
  },
  {
    id: "credit-sim",
    title: "Credit Score Simulator",
    description: "Build or destroy a FICO score over 24 months. Learn how payments, utilization, and inquiries affect your credit.",
    icon: CreditCard,
    color: "text-sky-500",
    bg: "bg-sky-500/10",
    badge: "New",
    badgeColor: "bg-sky-500/20 text-sky-500",
    stats: "4 Scenarios",
  },
];

const Games = ({ onNavigate }: GamesProps) => {
  const [activeGame, setActiveGame] = useState<string | null>(null);

  const gameComponents: Record<string, React.ReactNode> = {
    "life-sim": <LifeSimInvestorGame onClose={() => setActiveGame(null)} />,
    "trend-master": <TrendMasterGame onClose={() => setActiveGame(null)} />,
    "ai-competitor": <AICompetitorGame onClose={() => setActiveGame(null)} />,
    "market-reaction": <MarketReactionGame onClose={() => setActiveGame(null)} />,
    "budget-balancer": <BudgetBalancerGame onClose={() => setActiveGame(null)} />,
    "budget-sim": <BudgetSimulatorGame onClose={() => setActiveGame(null)} />,
    "credit-sim": <CreditScoreSimulator onClose={() => setActiveGame(null)} />,
  };

  if (activeGame && gameComponents[activeGame]) {
    return <>{gameComponents[activeGame]}</>;
  }

  const featured = games.find(g => g.featured);
  const rest = games.filter(g => !g.featured);

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };
  const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };

  return (
    <motion.div className="space-y-6 pb-20" variants={stagger} initial="hidden" animate="show">
      {/* Header */}
      <motion.div variants={fadeUp} className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow-soft">
          <Gamepad2 className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Investment Games</h1>
          <p className="text-sm text-muted-foreground">Learn investing through interactive challenges</p>
        </div>
      </motion.div>

      {/* Featured Game */}
      {featured && (
        <motion.div variants={fadeUp}>
          <Card className="relative overflow-hidden border-0 bg-gradient-primary p-6 md:p-8 shadow-glow-soft">
            <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
            <div className="relative flex flex-col md:flex-row gap-6 items-center">
              <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center shadow-glow flex-shrink-0">
                <featured.icon className="w-10 h-10 text-white" />
              </div>
              <div className="flex-1 text-center md:text-left text-white">
                <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
                  <h3 className="font-bold text-2xl">{featured.title}</h3>
                  <Badge className="bg-white/20 text-white border-0">{featured.badge}</Badge>
                </div>
                <p className="text-white/85 mb-4 max-w-xl">{featured.description}</p>
                <div className="flex items-center gap-4 flex-wrap justify-center md:justify-start text-sm">
                  <span className="flex items-center gap-1.5 font-medium"><Star className="w-4 h-4" /> {featured.stats}</span>
                  <Badge variant="outline" className="bg-white/10 border-white/30 text-white">Educational</Badge>
                </div>
              </div>
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-white/90 shadow-lg gap-2 px-8 flex-shrink-0"
                onClick={() => setActiveGame(featured.id)}
              >
                <Play className="w-5 h-5" />
                Start Game
              </Button>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Game Grid */}
      <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-4" variants={stagger}>
        {rest.map((game) => (
          <motion.div key={game.id} variants={fadeUp}>
            <Card 
              className="p-5 border-border/50 bg-card/60 backdrop-blur-sm hover:border-primary/30 hover:shadow-md transition-all duration-300 cursor-pointer group h-full flex flex-col"
              onClick={() => setActiveGame(game.id)}
            >
              <div className="flex items-start gap-4 mb-3">
                <div className={`w-12 h-12 rounded-xl ${game.bg} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                  <game.icon className={`w-6 h-6 ${game.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-lg truncate">{game.title}</h3>
                    <Badge className={`${game.badgeColor} border-0 text-xs flex-shrink-0`}>{game.badge}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{game.description}</p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/30">
                <span className="text-xs font-semibold text-muted-foreground">{game.stats}</span>
                <Button size="sm" variant="ghost" className="gap-1.5 text-primary hover:text-primary">
                  <Play className="w-3.5 h-3.5" /> Play
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default Games;

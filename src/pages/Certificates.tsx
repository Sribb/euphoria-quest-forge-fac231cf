import { useState, useEffect } from "react";
import { Award, Trophy, Sparkles, Shield, Star, TrendingUp, Medal, Crown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { CertificateCard, Certificate } from "@/features/certificates/components/CertificateCard";
import { CertificateDetailDialog } from "@/features/certificates/components/CertificateDetailDialog";
import { BadgesShowcase } from "@/features/badges/components/BadgesShowcase";
import { AwardUnlockOverlay } from "@/features/certificates/components/AwardUnlockOverlay";
import { useBadgeProgress } from "@/features/badges/hooks/useBadgeProgress";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CertificatesProps {
  onNavigate: (tab: string) => void;
}

const PRESTIGE_TIERS = [
  { key: "easy", label: "Beginner", icon: Star, accent: "emerald", bgClass: "bg-emerald-500/10", borderClass: "border-emerald-500/30", textClass: "text-emerald-400", ringColor: "stroke-emerald-500", gradient: "from-emerald-500 to-teal-500", count: 0, total: 0 },
  { key: "medium", label: "Advanced", icon: TrendingUp, accent: "blue", bgClass: "bg-blue-500/10", borderClass: "border-blue-500/30", textClass: "text-blue-400", ringColor: "stroke-blue-500", gradient: "from-blue-500 to-indigo-500", count: 0, total: 0 },
  { key: "hard", label: "Elite", icon: Shield, accent: "purple", bgClass: "bg-primary/10", borderClass: "border-primary/30", textClass: "text-primary", ringColor: "stroke-[hsl(var(--primary))]", gradient: "from-purple-500 to-violet-500", count: 0, total: 0 },
  { key: "master", label: "Fellow", icon: Crown, accent: "amber", bgClass: "bg-amber-500/10", borderClass: "border-amber-500/30", textClass: "text-amber-400", ringColor: "stroke-amber-500", gradient: "from-amber-500 to-orange-500", count: 0, total: 0 },
];

const Certificates = ({ onNavigate }: CertificatesProps) => {
  const { user } = useAuth();
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeView, setActiveView] = useState<"overview" | "badges" | "certificates">("overview");
  const [unlockOverlay, setUnlockOverlay] = useState<{ title: string; description: string; tier: string } | null>(null);

  const { badges, totalEarned: totalBadgesEarned, totalBadges } = useBadgeProgress();

  // Fetch profile
  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", user?.id).single();
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // Fetch issued certificates
  const { data: issuedCerts } = useQuery({
    queryKey: ["user-certificates", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_certificates")
        .select("*")
        .eq("user_id", user?.id!)
        .order("issued_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  // Fetch data for progress calculation
  const { data: lessonProgress } = useQuery({
    queryKey: ["lesson_progress", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("user_lesson_progress").select("*").eq("user_id", user?.id);
      return data || [];
    },
    enabled: !!user?.id,
  });

  const { data: orders } = useQuery({
    queryKey: ["orders", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("orders").select("*").eq("user_id", user?.id);
      return data || [];
    },
    enabled: !!user?.id,
  });

  const { data: transactions } = useQuery({
    queryKey: ["transactions", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("transactions").select("*").eq("user_id", user?.id);
      return data || [];
    },
    enabled: !!user?.id,
  });

  const { data: gameSessions } = useQuery({
    queryKey: ["game_sessions", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("game_sessions").select("*").eq("user_id", user?.id);
      return data || [];
    },
    enabled: !!user?.id,
  });

  // Calculate progress
  const completedTrades = orders?.filter(o => o.status === "filled").length || 0;
  const positiveTrades = transactions?.filter(t => t.transaction_type === "trade" && t.amount > 0).length || 0;
  const completedLessons = lessonProgress?.filter(l => l.completed).length || 0;
  const totalGames = gameSessions?.length || 0;
  const completedGames = gameSessions?.filter(g => g.completed).length || 0;
  const avgGameScore = gameSessions?.reduce((sum, g) => sum + g.score, 0) / (totalGames || 1) || 0;
  const trendMasterGames = gameSessions?.filter(g => g.score >= 80 && g.completed).length || 0;
  const consecutiveAccuracy = trendMasterGames >= 10;

  // Define certificates
  const certificates: Certificate[] = [
    // BEGINNER (Easy) Tier
    { id: "first-trade", title: "First Trade Completed", description: "Execute your first trade and enter the world of investing.", tier: "easy", category: "trading", requirements: [{ text: "Execute your first trade", completed: completedTrades >= 1 }], progress: completedTrades >= 1 ? 100 : 0, unlocked: true, earned: completedTrades >= 1 },
    { id: "learning-starter", title: "Learning Starter", description: "Complete the first module in the Learning Pathway.", tier: "easy", category: "learning", requirements: [{ text: "Complete the first Learning module", completed: completedLessons >= 1 }], progress: completedLessons >= 1 ? 100 : 0, unlocked: true, earned: completedLessons >= 1 },
    { id: "game-explorer", title: "Game Explorer", description: "Complete three mini-games to test your skills.", tier: "easy", category: "games", requirements: [{ text: "Complete 3 mini-games", completed: completedGames >= 3 }], progress: Math.min((completedGames / 3) * 100, 100), unlocked: true, earned: completedGames >= 3 },
    { id: "finance-foundations", title: "Finance Foundations", description: "Demonstrate understanding of core financial concepts.", tier: "easy", category: "learning", requirements: [{ text: "Complete 3 learning modules", completed: completedLessons >= 3 }], progress: Math.min((completedLessons / 3) * 100, 100), unlocked: true, earned: completedLessons >= 3 },

    // ADVANCED (Medium) Tier
    { id: "consistent-trader", title: "Consistent Trader", description: "Complete 10 successful trades with positive returns.", tier: "medium", category: "trading", requirements: [{ text: "Complete 10 trades", completed: completedTrades >= 10 }, { text: "Achieve positive returns", completed: positiveTrades >= 10 }], progress: Math.min(((completedTrades / 10) * 50 + (positiveTrades / 10) * 50), 100), unlocked: completedTrades >= 1, earned: completedTrades >= 10 && positiveTrades >= 10 },
    { id: "investment-strategist", title: "Investment Strategist", description: "Finish 5 Learning Pathway modules and expand your knowledge.", tier: "medium", category: "learning", requirements: [{ text: "Complete 5 Learning modules", completed: completedLessons >= 5 }], progress: Math.min((completedLessons / 5) * 100, 100), unlocked: completedLessons >= 1, earned: completedLessons >= 5 },
    { id: "game-strategist", title: "Game Strategist", description: "Achieve 80% accuracy in 5 consecutive Games challenges.", tier: "medium", category: "games", requirements: [{ text: "Score 80+ in 5 games", completed: trendMasterGames >= 5 }], progress: Math.min((trendMasterGames / 5) * 100, 100), unlocked: completedGames >= 3, earned: trendMasterGames >= 5 },
    { id: "startup-builder", title: "Startup Builder", description: "Master entrepreneurial thinking through 8 lessons.", tier: "medium", category: "learning", requirements: [{ text: "Complete 8 Learning modules", completed: completedLessons >= 8 }], progress: Math.min((completedLessons / 8) * 100, 100), unlocked: completedLessons >= 3, earned: completedLessons >= 8 },

    // ELITE (Hard) Tier
    { id: "market-analyzer", title: "Market Analyzer", description: "Achieve 90% accuracy in 10 consecutive Trend Master charts.", tier: "hard", category: "games", requirements: [{ text: "Score 90+ in 10 games", completed: trendMasterGames >= 10 }, { text: "Maintain consistency", completed: consecutiveAccuracy }], progress: Math.min((trendMasterGames / 10) * 100, 100), unlocked: trendMasterGames >= 5, earned: trendMasterGames >= 10 && consecutiveAccuracy },
    { id: "advanced-learner", title: "Advanced Learner", description: "Complete all modules in one Learning Pathway subject.", tier: "hard", category: "learning", requirements: [{ text: "Complete all modules in a subject", completed: completedLessons >= 15 }], progress: Math.min((completedLessons / 15) * 100, 100), unlocked: completedLessons >= 5, earned: completedLessons >= 15 },
    { id: "ai-innovator", title: "AI Innovator", description: "Leverage AI tools across 20 game and learning sessions.", tier: "hard", category: "games", requirements: [{ text: "Complete 20 games", completed: completedGames >= 20 }, { text: "Average score above 75", completed: avgGameScore >= 75 }], progress: Math.min(((completedGames / 20) * 50 + (avgGameScore / 75) * 50), 100), unlocked: trendMasterGames >= 5, earned: completedGames >= 20 && avgGameScore >= 75 },

    // FELLOW (Master) Tier
    { id: "euphoria-fellow", title: "Euphoria Fellow", description: "Complete all Beginner, Advanced, and Elite certificates.", tier: "master", category: "learning", requirements: [{ text: "Earn all Beginner tier certificates", completed: false }, { text: "Earn all Advanced tier certificates", completed: false }, { text: "Earn all Elite tier certificates", completed: false }], progress: 0, unlocked: false, earned: false },
    { id: "portfolio-virtuoso", title: "Portfolio Virtuoso", description: "Maintain consistent positive performance over 30 trades.", tier: "master", category: "trading", requirements: [{ text: "Complete 30 trades", completed: completedTrades >= 30 }, { text: "Maintain positive returns", completed: positiveTrades >= 30 }], progress: Math.min((completedTrades / 30) * 100, 100), unlocked: completedTrades >= 10 && positiveTrades >= 10, earned: completedTrades >= 30 && positiveTrades >= 30 },
    { id: "legendary-gamer", title: "Legendary Gamer", description: "Achieve top leaderboard ranking across all challenges.", tier: "master", category: "games", requirements: [{ text: "Complete 50 games", completed: totalGames >= 50 }, { text: "Average score above 90", completed: avgGameScore >= 90 }], progress: Math.min(((totalGames / 50) * 50 + (avgGameScore / 90) * 50), 100), unlocked: completedGames >= 20 && avgGameScore >= 75, earned: totalGames >= 50 && avgGameScore >= 90 },
    { id: "pitch-winner", title: "Pitch Competition Winner", description: "Win a Euphoria pitch competition or simulation.", tier: "master", category: "trading", requirements: [{ text: "Win a competition", completed: false }], progress: 0, unlocked: false, earned: false },
  ];

  // Group by tier
  const certsByTier = {
    easy: certificates.filter(c => c.tier === "easy"),
    medium: certificates.filter(c => c.tier === "medium"),
    hard: certificates.filter(c => c.tier === "hard"),
    master: certificates.filter(c => c.tier === "master"),
  };

  const totalEarned = certificates.filter(c => c.earned).length;
  const totalCertificates = certificates.length;

  // Update prestige tiers
  const prestigeTiers = PRESTIGE_TIERS.map(t => ({
    ...t,
    count: certsByTier[t.key as keyof typeof certsByTier].filter(c => c.earned).length,
    total: certsByTier[t.key as keyof typeof certsByTier].length,
  }));

  // Featured achievements (recently earned)
  const recentCerts = (issuedCerts || []).slice(0, 3);
  const profileName = profile?.display_name || user?.email?.split("@")[0] || "Student";

  return (
    <div className="min-h-screen pb-24 pt-4">
      {/* Unlock overlay */}
      {unlockOverlay && (
        <AwardUnlockOverlay
          title={unlockOverlay.title}
          description={unlockOverlay.description}
          tier={unlockOverlay.tier}
          onClose={() => setUnlockOverlay(null)}
        />
      )}

      {/* Premium Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(273,84%,65%)] flex items-center justify-center shadow-lg">
                <Trophy className="w-7 h-7 text-primary-foreground" />
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white">
                {totalEarned}
              </div>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Awards & Credentials</h1>
              <p className="text-sm text-muted-foreground">Your professional achievement portfolio</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full">
              <Medal className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold">{totalBadgesEarned} Badges</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full">
              <Award className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-semibold">{totalEarned} Certs</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <Tabs value={activeView} onValueChange={(v) => setActiveView(v as any)}>
        <TabsList className="mb-6 bg-muted/50 p-1">
          <TabsTrigger value="overview" className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Sparkles className="w-4 h-4" /> Overview
          </TabsTrigger>
          <TabsTrigger value="badges" className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <span>🏅</span> Badges ({totalBadges})
          </TabsTrigger>
          <TabsTrigger value="certificates" className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Award className="w-4 h-4" /> Certificates ({totalCertificates})
          </TabsTrigger>
        </TabsList>

        {/* OVERVIEW TAB */}
        <TabsContent value="overview">
          <div className="space-y-6">
            {/* Prestige Tiers */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {prestigeTiers.map((tier, i) => {
                  const Icon = tier.icon;
                  return (
                    <motion.div
                      key={tier.key}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.08 }}
                    >
                      <Card className={cn(
                        "relative overflow-hidden p-4 text-center border-2 transition-all hover:-translate-y-0.5",
                        tier.count === tier.total && tier.total > 0
                          ? "border-primary/30 bg-primary/5"
                          : "border-border"
                      )}>
                        <div className={cn("w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center bg-gradient-to-br text-white", tier.gradient)}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-sm mb-1">{tier.label}</h3>
                        <p className="text-2xl font-bold text-foreground">{tier.count}<span className="text-sm text-muted-foreground font-normal">/{tier.total}</span></p>
                        <Progress value={tier.total ? (tier.count / tier.total) * 100 : 0} className="h-1.5 mt-2" />
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Overall Progress */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-6 bg-gradient-to-r from-primary/5 via-background to-primary/5 border-primary/10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-bold">Credential Progress</h3>
                  </div>
                  <span className="text-sm font-bold text-primary">{Math.round((totalEarned / totalCertificates) * 100)}%</span>
                </div>
                <Progress value={(totalEarned / totalCertificates) * 100} className="h-3 mb-4" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-background/60 rounded-lg">
                    <p className="text-2xl font-bold text-primary">{totalEarned}</p>
                    <p className="text-xs text-muted-foreground">Certificates Earned</p>
                  </div>
                  <div className="text-center p-3 bg-background/60 rounded-lg">
                    <p className="text-2xl font-bold text-primary">{totalBadgesEarned}</p>
                    <p className="text-xs text-muted-foreground">Badges Collected</p>
                  </div>
                  <div className="text-center p-3 bg-background/60 rounded-lg">
                    <p className="text-2xl font-bold text-primary">{recentCerts.length}</p>
                    <p className="text-xs text-muted-foreground">Claimed Credentials</p>
                  </div>
                  <div className="text-center p-3 bg-background/60 rounded-lg">
                    <p className="text-2xl font-bold text-primary">{totalCertificates - totalEarned}</p>
                    <p className="text-xs text-muted-foreground">Remaining</p>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Recently Earned */}
            {recentCerts.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-3"
              >
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" /> Recently Earned Credentials
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {recentCerts.map((cert: any, i: number) => (
                    <Card key={cert.id} className="p-4 border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(273,84%,65%)] flex items-center justify-center text-white shrink-0">
                          <Award className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-semibold text-sm truncate">{cert.title}</h4>
                          <p className="text-xs text-muted-foreground">
                            Earned {new Date(cert.issued_at).toLocaleDateString()}
                          </p>
                          <p className="text-[10px] text-muted-foreground font-mono mt-1">{cert.credential_id}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Featured Badges */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <span>🏆</span> Top Badges
                </h2>
                <button onClick={() => setActiveView("badges")} className="text-sm text-primary font-medium hover:underline">
                  View All →
                </button>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 gap-2">
                {badges.filter(b => b.earned).slice(0, 6).map(badge => (
                  <Card key={badge.id} className="p-3 text-center bg-primary/5 border-primary/10">
                    <div className="text-3xl mb-1">{badge.icon}</div>
                    <p className="text-[11px] font-semibold truncate">{badge.title}</p>
                  </Card>
                ))}
                {badges.filter(b => b.earned).length === 0 && (
                  <p className="col-span-full text-sm text-muted-foreground text-center py-4">
                    Start learning to earn your first badges!
                  </p>
                )}
              </div>
            </motion.div>

            {/* Next Certificates to Earn */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-3"
            >
              <h2 className="text-lg font-bold flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" /> Next Up
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {certificates
                  .filter(c => !c.earned && c.unlocked && c.progress > 0)
                  .sort((a, b) => b.progress - a.progress)
                  .slice(0, 4)
                  .map(cert => (
                    <Card
                      key={cert.id}
                      className="p-4 cursor-pointer hover:bg-muted/30 transition-colors"
                      onClick={() => { setSelectedCertificate(cert); setDialogOpen(true); }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="shrink-0">
                          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                            <Award className="w-5 h-5 text-muted-foreground" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm truncate">{cert.title}</h4>
                          <p className="text-xs text-muted-foreground truncate">{cert.description}</p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <Progress value={cert.progress} className="h-1.5 flex-1" />
                            <span className="text-[11px] font-semibold text-primary">{Math.round(cert.progress)}%</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
              </div>
            </motion.div>
          </div>
        </TabsContent>

        {/* BADGES TAB */}
        <TabsContent value="badges">
          <BadgesShowcase />
        </TabsContent>

        {/* CERTIFICATES TAB */}
        <TabsContent value="certificates">
          <div className="space-y-6 md:space-y-8">
            {/* Tier Sections */}
            {(["easy", "medium", "hard", "master"] as const).map((tierKey, tierIdx) => {
              const tier = prestigeTiers[tierIdx];
              const certs = certsByTier[tierKey];
              return (
                <motion.div
                  key={tierKey}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: tierIdx * 0.1 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-3">
                    <Badge className={cn("bg-gradient-to-r text-white border-0", tier.gradient)}>
                      {tier.label.toUpperCase()}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {certs.filter(c => c.earned).length} / {certs.length} completed
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {certs.map(cert => (
                      <CertificateCard
                        key={cert.id}
                        certificate={cert}
                        onClick={() => { setSelectedCertificate(cert); setDialogOpen(true); }}
                      />
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Detail Dialog */}
      <CertificateDetailDialog
        certificate={selectedCertificate}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onNavigate={onNavigate}
        profileName={profileName}
      />
    </div>
  );
};

export default Certificates;

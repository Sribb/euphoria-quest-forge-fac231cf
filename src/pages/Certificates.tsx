import { useState } from "react";
import { Award, Trophy, Medal } from "lucide-react";
import { Card } from "@/components/ui/card";
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
import { cn } from "@/lib/utils";

interface CertificatesProps {
  onNavigate: (tab: string) => void;
}

const TIER_META = {
  easy: { label: "Beginner", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", gradient: "from-emerald-500/5 to-transparent", dot: "bg-emerald-500", bar: "from-emerald-500 to-teal-500" },
  medium: { label: "Advanced", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", gradient: "from-blue-500/5 to-transparent", dot: "bg-blue-500", bar: "from-blue-500 to-indigo-500" },
  hard: { label: "Elite", color: "text-primary", bg: "bg-primary/10", border: "border-primary/20", gradient: "from-primary/5 to-transparent", dot: "bg-primary", bar: "from-purple-500 to-violet-500" },
  master: { label: "Fellow", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", gradient: "from-amber-500/5 to-transparent", dot: "bg-amber-500", bar: "from-amber-500 to-orange-500" },
} as const;

const Certificates = ({ onNavigate }: CertificatesProps) => {
  const { user } = useAuth();
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeView, setActiveView] = useState<"badges" | "certificates">("certificates");
  const [unlockOverlay, setUnlockOverlay] = useState<{ title: string; description: string; tier: string } | null>(null);

  const { totalEarned: totalBadgesEarned, totalBadges } = useBadgeProgress();

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", user?.id).single();
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

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

  const certificates: Certificate[] = [
    { id: "first-trade", title: "First Trade Completed", description: "Execute your first trade.", tier: "easy", category: "trading", requirements: [{ text: "Execute your first trade", completed: completedTrades >= 1 }], progress: completedTrades >= 1 ? 100 : 0, unlocked: true, earned: completedTrades >= 1 },
    { id: "learning-starter", title: "Learning Starter", description: "Complete the first Learning module.", tier: "easy", category: "learning", requirements: [{ text: "Complete the first module", completed: completedLessons >= 1 }], progress: completedLessons >= 1 ? 100 : 0, unlocked: true, earned: completedLessons >= 1 },
    { id: "game-explorer", title: "Game Explorer", description: "Complete three mini-games.", tier: "easy", category: "games", requirements: [{ text: "Complete 3 mini-games", completed: completedGames >= 3 }], progress: Math.min((completedGames / 3) * 100, 100), unlocked: true, earned: completedGames >= 3 },
    { id: "finance-foundations", title: "Finance Foundations", description: "Complete 3 learning modules.", tier: "easy", category: "learning", requirements: [{ text: "Complete 3 modules", completed: completedLessons >= 3 }], progress: Math.min((completedLessons / 3) * 100, 100), unlocked: true, earned: completedLessons >= 3 },
    { id: "consistent-trader", title: "Consistent Trader", description: "Complete 10 successful trades.", tier: "medium", category: "trading", requirements: [{ text: "Complete 10 trades", completed: completedTrades >= 10 }, { text: "Positive returns", completed: positiveTrades >= 10 }], progress: Math.min(((completedTrades / 10) * 50 + (positiveTrades / 10) * 50), 100), unlocked: completedTrades >= 1, earned: completedTrades >= 10 && positiveTrades >= 10 },
    { id: "investment-strategist", title: "Investment Strategist", description: "Finish 5 Learning modules.", tier: "medium", category: "learning", requirements: [{ text: "Complete 5 modules", completed: completedLessons >= 5 }], progress: Math.min((completedLessons / 5) * 100, 100), unlocked: completedLessons >= 1, earned: completedLessons >= 5 },
    { id: "game-strategist", title: "Game Strategist", description: "Score 80%+ in 5 games.", tier: "medium", category: "games", requirements: [{ text: "Score 80+ in 5 games", completed: trendMasterGames >= 5 }], progress: Math.min((trendMasterGames / 5) * 100, 100), unlocked: completedGames >= 3, earned: trendMasterGames >= 5 },
    { id: "startup-builder", title: "Startup Builder", description: "Complete 8 learning modules.", tier: "medium", category: "learning", requirements: [{ text: "Complete 8 modules", completed: completedLessons >= 8 }], progress: Math.min((completedLessons / 8) * 100, 100), unlocked: completedLessons >= 3, earned: completedLessons >= 8 },
    { id: "market-analyzer", title: "Market Analyzer", description: "Score 90%+ in 10 games consistently.", tier: "hard", category: "games", requirements: [{ text: "Score 90+ in 10 games", completed: trendMasterGames >= 10 }, { text: "Maintain consistency", completed: consecutiveAccuracy }], progress: Math.min((trendMasterGames / 10) * 100, 100), unlocked: trendMasterGames >= 5, earned: trendMasterGames >= 10 && consecutiveAccuracy },
    { id: "advanced-learner", title: "Advanced Learner", description: "Complete all modules in a subject.", tier: "hard", category: "learning", requirements: [{ text: "Complete all modules in a subject", completed: completedLessons >= 15 }], progress: Math.min((completedLessons / 15) * 100, 100), unlocked: completedLessons >= 5, earned: completedLessons >= 15 },
    { id: "ai-innovator", title: "AI Innovator", description: "Complete 20 games with 75+ avg score.", tier: "hard", category: "games", requirements: [{ text: "Complete 20 games", completed: completedGames >= 20 }, { text: "Avg score above 75", completed: avgGameScore >= 75 }], progress: Math.min(((completedGames / 20) * 50 + (avgGameScore / 75) * 50), 100), unlocked: trendMasterGames >= 5, earned: completedGames >= 20 && avgGameScore >= 75 },
    { id: "euphoria-fellow", title: "Euphoria Fellow", description: "Earn all lower-tier certificates.", tier: "master", category: "learning", requirements: [{ text: "Earn all Beginner certs", completed: false }, { text: "Earn all Advanced certs", completed: false }, { text: "Earn all Elite certs", completed: false }], progress: 0, unlocked: false, earned: false },
    { id: "portfolio-virtuoso", title: "Portfolio Virtuoso", description: "30 trades with positive returns.", tier: "master", category: "trading", requirements: [{ text: "Complete 30 trades", completed: completedTrades >= 30 }, { text: "Positive returns", completed: positiveTrades >= 30 }], progress: Math.min((completedTrades / 30) * 100, 100), unlocked: completedTrades >= 10 && positiveTrades >= 10, earned: completedTrades >= 30 && positiveTrades >= 30 },
    { id: "legendary-gamer", title: "Legendary Gamer", description: "50 games with 90+ avg score.", tier: "master", category: "games", requirements: [{ text: "Complete 50 games", completed: totalGames >= 50 }, { text: "Avg score above 90", completed: avgGameScore >= 90 }], progress: Math.min(((totalGames / 50) * 50 + (avgGameScore / 90) * 50), 100), unlocked: completedGames >= 20 && avgGameScore >= 75, earned: totalGames >= 50 && avgGameScore >= 90 },
    { id: "pitch-winner", title: "Pitch Competition Winner", description: "Win a pitch competition.", tier: "master", category: "trading", requirements: [{ text: "Win a competition", completed: false }], progress: 0, unlocked: false, earned: false },
  ];

  const certsByTier = {
    easy: certificates.filter(c => c.tier === "easy"),
    medium: certificates.filter(c => c.tier === "medium"),
    hard: certificates.filter(c => c.tier === "hard"),
    master: certificates.filter(c => c.tier === "master"),
  };

  const totalEarned = certificates.filter(c => c.earned).length;
  const totalCertificates = certificates.length;
  const profileName = profile?.display_name || user?.email?.split("@")[0] || "Student";

  return (
    <div className="min-h-screen pb-24 pt-4">
      {unlockOverlay && (
        <AwardUnlockOverlay
          title={unlockOverlay.title}
          description={unlockOverlay.description}
          tier={unlockOverlay.tier}
          onClose={() => setUnlockOverlay(null)}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(273,84%,65%)] flex items-center justify-center">
            <Trophy className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-semibold">Awards</h1>
            <p className="text-xs text-muted-foreground">{totalEarned} certs · {totalBadgesEarned} badges earned</p>
          </div>
        </div>
      </div>

      {/* Overall Progress */}
      <Card className="p-4 mb-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Overall Progress</span>
          <span className="text-sm font-bold text-primary">{totalEarned}/{totalCertificates}</span>
        </div>
        <Progress value={totalCertificates > 0 ? (totalEarned / totalCertificates) * 100 : 0} className="h-2.5" />
        <div className="grid grid-cols-4 gap-2 mt-3">
          {(["easy", "medium", "hard", "master"] as const).map(key => {
            const meta = TIER_META[key];
            const earned = certsByTier[key].filter(c => c.earned).length;
            const total = certsByTier[key].length;
            return (
              <div key={key} className="text-center">
                <p className={cn("text-lg font-bold tabular-nums", meta.color)}>
                  {earned}<span className="text-xs text-muted-foreground font-normal">/{total}</span>
                </p>
                <p className="text-[10px] text-muted-foreground">{meta.label}</p>
              </div>
            );
          })}
        </div>
      </Card>

      <Tabs value={activeView} onValueChange={(v) => setActiveView(v as any)}>
        <TabsList className="mb-5 bg-muted/50 p-1">
          <TabsTrigger value="certificates" className="gap-1.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Award className="w-4 h-4" /> Certificates
          </TabsTrigger>
          <TabsTrigger value="badges" className="gap-1.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Medal className="w-4 h-4" /> Badges
          </TabsTrigger>
        </TabsList>

        <TabsContent value="certificates">
          {totalEarned === 0 && (
            <div className="text-center py-10 space-y-3 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
                <Award className="w-7 h-7 text-primary" />
              </div>
              <p className="text-lg font-semibold text-foreground">Complete a pathway to earn your first certificate</p>
              <p className="text-sm text-muted-foreground">Keep learning and trading to unlock awards below.</p>
            </div>
          )}
          <div className="space-y-6">
            {(["easy", "medium", "hard", "master"] as const).map(tierKey => {
              const meta = TIER_META[tierKey];
              const certs = certsByTier[tierKey];
              const earnedCount = certs.filter(c => c.earned).length;

              return (
                <div
                  key={tierKey}
                  className={cn("rounded-xl border p-4 bg-gradient-to-br", meta.border, meta.gradient)}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className={cn("w-2 h-2 rounded-full", meta.dot)} />
                    <h2 className={cn("text-base font-bold", meta.color)}>{meta.label}</h2>
                    <span className="text-xs text-muted-foreground">{earnedCount}/{certs.length}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {certs.map(cert => (
                      <CertificateCard
                        key={cert.id}
                        certificate={cert}
                        onClick={() => { setSelectedCertificate(cert); setDialogOpen(true); }}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="badges">
          <BadgesShowcase />
        </TabsContent>
      </Tabs>

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

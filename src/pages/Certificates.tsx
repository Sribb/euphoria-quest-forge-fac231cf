import { useState } from "react";
import { Award, Trophy, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { CertificateCard, Certificate } from "@/features/certificates/components/CertificateCard";
import { CertificateDetailDialog } from "@/features/certificates/components/CertificateDetailDialog";
import { BadgesShowcase } from "@/features/badges/components/BadgesShowcase";

interface CertificatesProps {
  onNavigate: (tab: string) => void;
}

const Certificates = ({ onNavigate }: CertificatesProps) => {
  const { user } = useAuth();
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeView, setActiveView] = useState<"badges" | "certificates">("badges");

  // Fetch user data
  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const { data: transactions } = useQuery({
    queryKey: ["transactions", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user?.id);
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const { data: gameSessions } = useQuery({
    queryKey: ["game_sessions", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("game_sessions")
        .select("*")
        .eq("user_id", user?.id);
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const { data: lessonProgress } = useQuery({
    queryKey: ["lesson_progress", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_lesson_progress")
        .select("*")
        .eq("user_id", user?.id);
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const { data: orders } = useQuery({
    queryKey: ["orders", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user?.id);
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // Calculate progress metrics
  const completedTrades = orders?.filter(o => o.status === "filled").length || 0;
  const positiveTrades = transactions?.filter(t => t.transaction_type === "trade" && t.amount > 0).length || 0;
  const completedLessons = lessonProgress?.filter(l => l.completed).length || 0;
  const totalGames = gameSessions?.length || 0;
  const completedGames = gameSessions?.filter(g => g.completed).length || 0;
  const avgGameScore = gameSessions?.reduce((sum, g) => sum + g.score, 0) / (totalGames || 1) || 0;
  const trendMasterGames = gameSessions?.filter(g => g.score >= 80 && g.completed).length || 0;
  const consecutiveAccuracy = trendMasterGames >= 10;

  // Define all certificates
  const certificates: Certificate[] = [
    // EASY TIER
    {
      id: "first-trade",
      title: "First Trade Completed",
      description: "Execute your first trade successfully and enter the world of investing.",
      tier: "easy",
      category: "trading",
      requirements: [
        { text: "Execute your first trade", completed: completedTrades >= 1 },
      ],
      progress: completedTrades >= 1 ? 100 : 0,
      unlocked: true,
      earned: completedTrades >= 1,
    },
    {
      id: "learning-starter",
      title: "Learning Starter",
      description: "Complete the first module in the Learning Pathway and begin your education.",
      tier: "easy",
      category: "learning",
      requirements: [
        { text: "Complete the first Learning module", completed: completedLessons >= 1 },
      ],
      progress: completedLessons >= 1 ? 100 : 0,
      unlocked: true,
      earned: completedLessons >= 1,
    },
    {
      id: "game-explorer",
      title: "Game Explorer",
      description: "Complete three mini-games in the Games section to test your skills.",
      tier: "easy",
      category: "games",
      requirements: [
        { text: "Complete 3 mini-games", completed: completedGames >= 3 },
      ],
      progress: Math.min((completedGames / 3) * 100, 100),
      unlocked: true,
      earned: completedGames >= 3,
    },
    {
      id: "ai-chat-initiator",
      title: "AI Chat Initiator",
      description: "Ask your first question to the AI Analytics Assistant.",
      tier: "easy",
      category: "analytics",
      requirements: [
        { text: "Start a conversation with AI Analytics", completed: true }, // Placeholder - would track in real implementation
      ],
      progress: 100,
      unlocked: true,
      earned: true,
    },

    // MEDIUM TIER
    {
      id: "consistent-trader",
      title: "Consistent Trader",
      description: "Complete 10 successful trades with positive returns.",
      tier: "medium",
      category: "trading",
      requirements: [
        { text: "Complete 10 trades", completed: completedTrades >= 10 },
        { text: "Achieve positive returns", completed: positiveTrades >= 10 },
      ],
      progress: Math.min(((completedTrades / 10) * 50 + (positiveTrades / 10) * 50), 100),
      unlocked: completedTrades >= 1,
      earned: completedTrades >= 10 && positiveTrades >= 10,
    },
    {
      id: "pathway-progress",
      title: "Pathway Progress",
      description: "Finish 5 Learning Pathway modules and expand your knowledge.",
      tier: "medium",
      category: "learning",
      requirements: [
        { text: "Complete 5 Learning modules", completed: completedLessons >= 5 },
      ],
      progress: Math.min((completedLessons / 5) * 100, 100),
      unlocked: completedLessons >= 1,
      earned: completedLessons >= 5,
    },
    {
      id: "game-strategist",
      title: "Game Strategist",
      description: "Achieve 80% accuracy in 5 consecutive Games challenges.",
      tier: "medium",
      category: "games",
      requirements: [
        { text: "Score 80+ in 5 games", completed: trendMasterGames >= 5 },
      ],
      progress: Math.min((trendMasterGames / 5) * 100, 100),
      unlocked: completedGames >= 3,
      earned: trendMasterGames >= 5,
    },
    {
      id: "insight-seeker",
      title: "Insight Seeker",
      description: "Receive 10 actionable insights from the AI Analytics Assistant.",
      tier: "medium",
      category: "analytics",
      requirements: [
        { text: "Receive 10 AI insights", completed: true }, // Placeholder
      ],
      progress: 100,
      unlocked: true,
      earned: true,
    },

    // HARD TIER
    {
      id: "market-analyzer",
      title: "Market Analyzer",
      description: "Achieve 90% accuracy in 10 consecutive Trend Master charts.",
      tier: "hard",
      category: "games",
      requirements: [
        { text: "Score 90+ in 10 Trend Master games", completed: trendMasterGames >= 10 },
        { text: "Maintain consistency", completed: consecutiveAccuracy },
      ],
      progress: Math.min((trendMasterGames / 10) * 100, 100),
      unlocked: trendMasterGames >= 5,
      earned: trendMasterGames >= 10 && consecutiveAccuracy,
    },
    {
      id: "advanced-learner",
      title: "Advanced Learner",
      description: "Complete all modules in one Learning Pathway subject.",
      tier: "hard",
      category: "learning",
      requirements: [
        { text: "Complete all modules in a subject", completed: completedLessons >= 15 },
      ],
      progress: Math.min((completedLessons / 15) * 100, 100),
      unlocked: completedLessons >= 5,
      earned: completedLessons >= 15,
    },
    {
      id: "game-master",
      title: "Game Master",
      description: "Unlock all medium-tier game achievements.",
      tier: "hard",
      category: "games",
      requirements: [
        { text: "Complete all medium-tier achievements", completed: completedGames >= 20 },
        { text: "Average score above 75", completed: avgGameScore >= 75 },
      ],
      progress: Math.min(((completedGames / 20) * 50 + (avgGameScore / 75) * 50), 100),
      unlocked: trendMasterGames >= 5,
      earned: completedGames >= 20 && avgGameScore >= 75,
    },
    {
      id: "data-interpreter",
      title: "Data Interpreter",
      description: "Correctly predict outcomes in 5 AI Analytics simulations.",
      tier: "hard",
      category: "analytics",
      requirements: [
        { text: "Complete 5 scenario predictions", completed: false }, // Placeholder
      ],
      progress: 0,
      unlocked: true,
      earned: false,
    },

    // MASTER TIER
    {
      id: "euphoria-expert",
      title: "Euphoria Expert",
      description: "Complete all Easy, Medium, and Hard certificates.",
      tier: "master",
      category: "analytics",
      requirements: [
        { text: "Earn all Easy tier certificates", completed: false },
        { text: "Earn all Medium tier certificates", completed: false },
        { text: "Earn all Hard tier certificates", completed: false },
      ],
      progress: 0,
      unlocked: false,
      earned: false,
    },
    {
      id: "portfolio-virtuoso",
      title: "Portfolio Virtuoso",
      description: "Maintain consistent positive portfolio performance over 30 trades.",
      tier: "master",
      category: "trading",
      requirements: [
        { text: "Complete 30 trades", completed: completedTrades >= 30 },
        { text: "Maintain positive returns", completed: positiveTrades >= 30 },
      ],
      progress: Math.min((completedTrades / 30) * 100, 100),
      unlocked: completedTrades >= 10 && positiveTrades >= 10,
      earned: completedTrades >= 30 && positiveTrades >= 30,
    },
    {
      id: "legendary-gamer",
      title: "Legendary Gamer",
      description: "Achieve top 1% leaderboard ranking in all Games challenges.",
      tier: "master",
      category: "games",
      requirements: [
        { text: "Complete 50 games", completed: totalGames >= 50 },
        { text: "Average score above 90", completed: avgGameScore >= 90 },
      ],
      progress: Math.min(((totalGames / 50) * 50 + (avgGameScore / 90) * 50), 100),
      unlocked: completedGames >= 20 && avgGameScore >= 75,
      earned: totalGames >= 50 && avgGameScore >= 90,
    },
    {
      id: "ai-strategist",
      title: "AI Strategist",
      description: "Solve all advanced AI Analytics scenarios correctly.",
      tier: "master",
      category: "analytics",
      requirements: [
        { text: "Complete all advanced scenarios", completed: false }, // Placeholder
      ],
      progress: 0,
      unlocked: false,
      earned: false,
    },
  ];

  // Group certificates by tier
  const certificatesByTier = {
    easy: certificates.filter(c => c.tier === "easy"),
    medium: certificates.filter(c => c.tier === "medium"),
    hard: certificates.filter(c => c.tier === "hard"),
    master: certificates.filter(c => c.tier === "master"),
  };

  // Calculate total stats
  const totalEarned = certificates.filter(c => c.earned).length;
  const totalCertificates = certificates.length;
  const overallProgress = (totalEarned / totalCertificates) * 100;

  const handleCertificateClick = (cert: Certificate) => {
    setSelectedCertificate(cert);
    setDialogOpen(true);
  };

  return (
    <div className="min-h-screen space-y-6 md:space-y-8 pb-24 pt-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-glow animate-pulse">
            <Award className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Certificates</h1>
            <p className="text-sm text-muted-foreground">Your journey to mastery</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-gradient-primary/10 border border-primary/20 rounded-full">
          <Trophy className="w-4 h-4 md:w-5 md:h-5 text-primary" />
          <span className="text-xs md:text-sm font-semibold">{totalEarned}/{totalCertificates} Earned</span>
        </div>
      </div>

      {/* Progress Overview */}
      <Card className="p-6 bg-gradient-hero border-primary/20 animate-fade-in">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-bold">Overall Progress</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-background/50 rounded-lg">
            <p className="text-3xl font-bold text-emerald-500">{certificatesByTier.easy.filter(c => c.earned).length}</p>
            <p className="text-sm text-muted-foreground">Easy Tier</p>
          </div>
          <div className="text-center p-4 bg-background/50 rounded-lg">
            <p className="text-3xl font-bold text-blue-500">{certificatesByTier.medium.filter(c => c.earned).length}</p>
            <p className="text-sm text-muted-foreground">Medium Tier</p>
          </div>
          <div className="text-center p-4 bg-background/50 rounded-lg">
            <p className="text-3xl font-bold text-purple-500">{certificatesByTier.hard.filter(c => c.earned).length}</p>
            <p className="text-sm text-muted-foreground">Hard Tier</p>
          </div>
          <div className="text-center p-4 bg-background/50 rounded-lg">
            <p className="text-3xl font-bold text-amber-500">{certificatesByTier.master.filter(c => c.earned).length}</p>
            <p className="text-sm text-muted-foreground">Master Tier</p>
          </div>
        </div>
      </Card>

      {/* Easy Tier */}
      <div className="space-y-4 animate-fade-in">
        <div className="flex items-center gap-3">
          <Badge className="bg-gradient-to-r from-emerald-500 to-green-500 text-white">EASY TIER</Badge>
          <span className="text-sm text-muted-foreground">
            {certificatesByTier.easy.filter(c => c.earned).length} / {certificatesByTier.easy.length} completed
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {certificatesByTier.easy.map(cert => (
            <CertificateCard key={cert.id} certificate={cert} onClick={() => handleCertificateClick(cert)} />
          ))}
        </div>
      </div>

      {/* Medium Tier */}
      <div className="space-y-4 animate-fade-in" style={{ animationDelay: "100ms" }}>
        <div className="flex items-center gap-3">
          <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">MEDIUM TIER</Badge>
          <span className="text-sm text-muted-foreground">
            {certificatesByTier.medium.filter(c => c.earned).length} / {certificatesByTier.medium.length} completed
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {certificatesByTier.medium.map(cert => (
            <CertificateCard key={cert.id} certificate={cert} onClick={() => handleCertificateClick(cert)} />
          ))}
        </div>
      </div>

      {/* Hard Tier */}
      <div className="space-y-4 animate-fade-in" style={{ animationDelay: "200ms" }}>
        <div className="flex items-center gap-3">
          <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">HARD TIER</Badge>
          <span className="text-sm text-muted-foreground">
            {certificatesByTier.hard.filter(c => c.earned).length} / {certificatesByTier.hard.length} completed
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {certificatesByTier.hard.map(cert => (
            <CertificateCard key={cert.id} certificate={cert} onClick={() => handleCertificateClick(cert)} />
          ))}
        </div>
      </div>

      {/* Master Tier */}
      <div className="space-y-4 animate-fade-in" style={{ animationDelay: "300ms" }}>
        <div className="flex items-center gap-3">
          <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-glow">MASTER TIER</Badge>
          <span className="text-sm text-muted-foreground">
            {certificatesByTier.master.filter(c => c.earned).length} / {certificatesByTier.master.length} completed
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {certificatesByTier.master.map(cert => (
            <CertificateCard key={cert.id} certificate={cert} onClick={() => handleCertificateClick(cert)} />
          ))}
        </div>
      </div>

      {/* Detail Dialog */}
      <CertificateDetailDialog
        certificate={selectedCertificate}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onNavigate={onNavigate}
      />
    </div>
  );
};

export default Certificates;

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Lock, Award, CheckCircle2, TrendingUp, Target, Brain, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Certificate {
  id: string;
  title: string;
  description: string;
  tier: "easy" | "medium" | "hard" | "master";
  category: "trading" | "games" | "analytics" | "learning";
  requirements: {
    text: string;
    completed: boolean;
  }[];
  progress: number;
  unlocked: boolean;
  earned: boolean;
  earnedDate?: string;
}

interface CertificateCardProps {
  certificate: Certificate;
  onClick: () => void;
}

const tierColors = {
  easy: {
    gradient: "from-emerald-500/20 to-green-500/20",
    border: "border-emerald-500/30",
    icon: "bg-gradient-to-br from-emerald-500 to-green-500",
    glow: "shadow-[0_0_30px_rgba(16,185,129,0.3)]",
  },
  medium: {
    gradient: "from-blue-500/20 to-cyan-500/20",
    border: "border-blue-500/30",
    icon: "bg-gradient-to-br from-blue-500 to-cyan-500",
    glow: "shadow-[0_0_30px_rgba(59,130,246,0.3)]",
  },
  hard: {
    gradient: "from-purple-500/20 to-pink-500/20",
    border: "border-purple-500/30",
    icon: "bg-gradient-to-br from-purple-500 to-pink-500",
    glow: "shadow-[0_0_30px_rgba(168,85,247,0.3)]",
  },
  master: {
    gradient: "from-amber-500/20 to-orange-500/20",
    border: "border-amber-500/30",
    icon: "bg-gradient-to-br from-amber-500 to-orange-500",
    glow: "shadow-[0_0_40px_rgba(245,158,11,0.4)]",
  },
};

const categoryIcons = {
  trading: TrendingUp,
  games: Target,
  analytics: Brain,
  learning: BookOpen,
};

export const CertificateCard = ({ certificate, onClick }: CertificateCardProps) => {
  const colors = tierColors[certificate.tier];
  const CategoryIcon = categoryIcons[certificate.category];
  const completedRequirements = certificate.requirements.filter(r => r.completed).length;
  const totalRequirements = certificate.requirements.length;

  return (
    <Card
      onClick={onClick}
      className={cn(
        "group relative p-6 cursor-pointer transition-all duration-300 overflow-hidden",
        "hover:-translate-y-2 hover:scale-[1.02]",
        certificate.earned
          ? `bg-gradient-to-br ${colors.gradient} ${colors.border} border-2 ${colors.glow}`
          : certificate.progress >= 100
          ? `bg-gradient-to-br ${colors.gradient} ${colors.border} border-2 animate-pulse ${colors.glow}`
          : "bg-card/50 border-border hover:border-primary/50",
        certificate.unlocked ? "" : "opacity-60"
      )}
    >
      {/* Sparkle effect for earned certificates */}
      {certificate.earned && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-32 h-32 bg-white/10 rounded-full blur-3xl -top-10 -right-10 animate-pulse" />
          <div className="absolute w-32 h-32 bg-white/10 rounded-full blur-3xl -bottom-10 -left-10 animate-pulse" style={{ animationDelay: "1s" }} />
        </div>
      )}

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className={cn("w-14 h-14 rounded-xl flex items-center justify-center", colors.icon, certificate.earned ? "animate-pulse" : "")}>
            {certificate.earned || certificate.progress >= 100 ? (
              <Award className="w-7 h-7 text-white" />
            ) : certificate.unlocked ? (
              <CategoryIcon className="w-7 h-7 text-white" />
            ) : (
              <Lock className="w-7 h-7 text-white/70" />
            )}
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge variant="outline" className={cn("text-xs", colors.border)}>
              {certificate.tier.toUpperCase()}
            </Badge>
            {certificate.earned && (
              <Badge className="bg-gradient-primary text-white">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Earned
              </Badge>
            )}
            {certificate.progress >= 100 && !certificate.earned && (
              <Badge className="bg-gradient-accent text-white animate-pulse">
                Ready to Claim!
              </Badge>
            )}
          </div>
        </div>

        {/* Title & Description */}
        <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
          {certificate.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {certificate.description}
        </p>

        {/* Progress Ring Visual */}
        <div className="relative mb-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-semibold text-primary">{Math.round(certificate.progress)}%</span>
          </div>
          <Progress 
            value={certificate.progress} 
            className={cn("h-3", certificate.progress >= 100 ? "bg-gradient-primary" : "")} 
          />
          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
            <span>{completedRequirements}/{totalRequirements} requirements met</span>
          </div>
        </div>

        {/* Earned Date */}
        {certificate.earnedDate && (
          <p className="text-xs text-muted-foreground">
            Earned {new Date(certificate.earnedDate).toLocaleDateString()}
          </p>
        )}
      </div>

      {/* Hover glow effect */}
      <div className={cn(
        "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none",
        certificate.earned ? colors.glow : ""
      )} />
    </Card>
  );
};

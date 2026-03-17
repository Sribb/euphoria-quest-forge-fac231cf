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
    gradient: "from-emerald-500/15 to-emerald-500/5",
    border: "border-emerald-500/30",
    borderEarned: "border-emerald-500/60",
    icon: "bg-gradient-to-br from-emerald-500 to-green-500",
    glow: "shadow-[0_0_20px_rgba(16,185,129,0.2)]",
    text: "text-emerald-400",
  },
  medium: {
    gradient: "from-blue-500/15 to-blue-500/5",
    border: "border-blue-500/30",
    borderEarned: "border-blue-500/60",
    icon: "bg-gradient-to-br from-blue-500 to-cyan-500",
    glow: "shadow-[0_0_20px_rgba(59,130,246,0.2)]",
    text: "text-blue-400",
  },
  hard: {
    gradient: "from-primary/15 to-primary/5",
    border: "border-primary/30",
    borderEarned: "border-primary/60",
    icon: "bg-gradient-to-br from-purple-500 to-pink-500",
    glow: "shadow-[0_0_20px_rgba(168,85,247,0.2)]",
    text: "text-primary",
  },
  master: {
    gradient: "from-amber-500/15 to-amber-500/5",
    border: "border-amber-500/30",
    borderEarned: "border-amber-500/60",
    icon: "bg-gradient-to-br from-amber-500 to-orange-500",
    glow: "shadow-[0_0_20px_rgba(245,158,11,0.25)]",
    text: "text-amber-400",
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
        "group relative p-4 cursor-pointer transition-all duration-300 overflow-hidden",
        "hover:-translate-y-1 hover:shadow-lg",
        certificate.earned
          ? cn("bg-gradient-to-br border-2", colors.gradient, colors.borderEarned, colors.glow)
          : certificate.unlocked
            ? "bg-card/40 border-border/60 hover:border-border"
            : "bg-card/20 border-border/30 opacity-50"
      )}
    >
      <div className="relative z-[1]">
        {/* Header row */}
        <div className="flex items-start justify-between mb-3">
          <div className={cn(
            "w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0",
            certificate.earned ? colors.icon : "bg-muted/60"
          )}>
            {certificate.earned || certificate.progress >= 100 ? (
              <Award className="w-5 h-5 text-white" />
            ) : certificate.unlocked ? (
              <CategoryIcon className="w-5 h-5 text-muted-foreground" />
            ) : (
              <Lock className="w-5 h-5 text-muted-foreground/50" />
            )}
          </div>
          <div className="flex flex-col items-end gap-1.5">
            {certificate.earned && (
              <Badge className="bg-gradient-to-r from-emerald-500 to-green-500 text-white border-0 text-[10px] px-2 py-0.5">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Earned
              </Badge>
            )}
            {certificate.progress >= 100 && !certificate.earned && (
              <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 text-[10px] animate-pulse">
                Claim!
              </Badge>
            )}
          </div>
        </div>

        {/* Title & Description */}
        <h3 className={cn(
          "font-bold text-sm mb-1 line-clamp-1 transition-colors",
          certificate.earned ? "group-hover:text-foreground" : "text-muted-foreground group-hover:text-foreground/80"
        )}>
          {certificate.title}
        </h3>
        <p className="text-[11px] text-muted-foreground mb-3 line-clamp-2 leading-relaxed">
          {certificate.description}
        </p>

        {/* Progress */}
        <div>
          <div className="flex items-center justify-between text-[11px] mb-1.5">
            <span className="text-muted-foreground">{completedRequirements}/{totalRequirements} tasks</span>
            <span className={cn("font-bold tabular-nums", certificate.earned ? colors.text : "text-muted-foreground")}>
              {Math.round(certificate.progress)}%
            </span>
          </div>
          <Progress value={certificate.progress} className="h-1.5" />
        </div>
      </div>
    </Card>
  );
};

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Award, CheckCircle2, ArrowRight, Lock, Download, Share2 } from "lucide-react";
import { Certificate } from "./CertificateCard";
import { cn } from "@/lib/utils";

interface CertificateDetailDialogProps {
  certificate: Certificate | null;
  open: boolean;
  onClose: () => void;
  onNavigate: (destination: string) => void;
}

const tierColors = {
  easy: "from-emerald-500 to-green-500",
  medium: "from-blue-500 to-cyan-500",
  hard: "from-purple-500 to-pink-500",
  master: "from-amber-500 to-orange-500",
};

const getNextSteps = (certificate: Certificate | null) => {
  if (!certificate) return [];
  
  const incompleteRequirements = certificate.requirements.filter(r => !r.completed);
  if (incompleteRequirements.length === 0) return [];

  const steps = incompleteRequirements.map(req => {
    if (req.text.includes("trade")) return { text: req.text, link: "trade", label: "Go to Trading" };
    if (req.text.includes("game") || req.text.includes("Game")) return { text: req.text, link: "games", label: "Play Games" };
    if (req.text.includes("Analytics") || req.text.includes("scenario")) return { text: req.text, link: "analytics", label: "View Analytics" };
    if (req.text.includes("lesson") || req.text.includes("module") || req.text.includes("Pathway")) return { text: req.text, link: "learn", label: "Continue Learning" };
    return { text: req.text, link: "", label: "Complete this" };
  });

  return steps;
};

export const CertificateDetailDialog = ({ certificate, open, onClose, onNavigate }: CertificateDetailDialogProps) => {
  if (!certificate) return null;

  const tierGradient = tierColors[certificate.tier];
  const completedCount = certificate.requirements.filter(r => r.completed).length;
  const totalCount = certificate.requirements.length;
  const nextSteps = getNextSteps(certificate);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className={cn("w-20 h-20 rounded-2xl flex items-center justify-center mb-4 shadow-glow", `bg-gradient-to-br ${tierGradient}`)}>
            {certificate.earned || certificate.progress >= 100 ? (
              <Award className="w-10 h-10 text-white" />
            ) : (
              <Lock className="w-10 h-10 text-white/70" />
            )}
          </div>
          <DialogTitle className="text-2xl font-bold flex items-center gap-3">
            {certificate.title}
            <Badge variant="outline" className="text-xs">
              {certificate.tier.toUpperCase()} TIER
            </Badge>
          </DialogTitle>
          <p className="text-muted-foreground">{certificate.description}</p>
        </DialogHeader>

        {/* Progress Overview */}
        <div className="space-y-4 py-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold">Overall Progress</span>
              <span className="text-sm font-bold text-primary">{Math.round(certificate.progress)}%</span>
            </div>
            <Progress value={certificate.progress} className="h-3" />
            <p className="text-xs text-muted-foreground mt-1">
              {completedCount} of {totalCount} requirements completed
            </p>
          </div>

          {/* Requirements List */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Requirements:</h3>
            {certificate.requirements.map((req, idx) => (
              <div
                key={idx}
                className={cn(
                  "flex items-start gap-3 p-3 rounded-lg border transition-all",
                  req.completed 
                    ? "bg-success/10 border-success/30" 
                    : "bg-muted/30 border-border"
                )}
              >
                <div className="mt-0.5">
                  {req.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-success" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-muted-foreground" />
                  )}
                </div>
                <span className={cn("text-sm flex-1", req.completed && "line-through opacity-70")}>
                  {req.text}
                </span>
              </div>
            ))}
          </div>

          {/* Next Steps */}
          {nextSteps.length > 0 && (
            <div className="space-y-3 p-4 bg-gradient-primary/10 border border-primary/20 rounded-lg">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <ArrowRight className="w-4 h-4" />
                Next Steps
              </h3>
              <div className="space-y-2">
                {nextSteps.map((step, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-2">
                    <span className="text-sm text-muted-foreground flex-1">{step.text}</span>
                    {step.link && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          onNavigate(step.link);
                          onClose();
                        }}
                        className="shrink-0"
                      >
                        {step.label}
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            {certificate.earned && (
              <>
                <Button className="flex-1 bg-gradient-primary">
                  <Download className="w-4 h-4 mr-2" />
                  Download Certificate
                </Button>
                <Button variant="outline" className="flex-1">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Achievement
                </Button>
              </>
            )}
            {certificate.progress >= 100 && !certificate.earned && (
              <Button className="flex-1 bg-gradient-accent animate-pulse">
                <Award className="w-4 h-4 mr-2" />
                Claim Certificate
              </Button>
            )}
            {certificate.progress < 100 && nextSteps.length > 0 && (
              <Button
                className="flex-1 bg-gradient-primary"
                onClick={() => {
                  if (nextSteps[0].link) {
                    onNavigate(nextSteps[0].link);
                    onClose();
                  }
                }}
              >
                Continue Progress
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

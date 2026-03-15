import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Award, CheckCircle2, ArrowRight, Lock, Download, Share2, Linkedin, Copy, ExternalLink, Check, Shield } from "lucide-react";
import { Certificate } from "./CertificateCard";
import { ProfessionalCertificate } from "./ProfessionalCertificate";
import { downloadCertificatePDF, generateLinkedInShareUrl, generateVerificationUrl } from "../utils/certificateUtils";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import confetti from "canvas-confetti";

interface CertificateDetailDialogProps {
  certificate: Certificate | null;
  open: boolean;
  onClose: () => void;
  onNavigate: (destination: string) => void;
  profileName?: string;
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
  return incompleteRequirements.map(req => {
    if (req.text.includes("trade")) return { text: req.text, link: "trade", label: "Go to Trading" };
    if (req.text.includes("game") || req.text.includes("Game")) return { text: req.text, link: "games", label: "Play Games" };
    if (req.text.includes("Analytics") || req.text.includes("scenario")) return { text: req.text, link: "analytics", label: "View Analytics" };
    if (req.text.includes("lesson") || req.text.includes("module") || req.text.includes("Pathway")) return { text: req.text, link: "learn", label: "Continue Learning" };
    return { text: req.text, link: "", label: "Complete this" };
  });
};

export const CertificateDetailDialog = ({ certificate, open, onClose, onNavigate, profileName }: CertificateDetailDialogProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const certRef = useRef<HTMLDivElement>(null);
  const [showCert, setShowCert] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  // Check if already claimed
  const { data: issuedCert } = useQuery({
    queryKey: ["issued-cert", certificate?.id, user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("user_certificates")
        .select("*")
        .eq("user_id", user!.id)
        .eq("certificate_type", certificate!.id)
        .maybeSingle();
      return data;
    },
    enabled: !!user?.id && !!certificate?.id && open,
  });

  const claimMutation = useMutation({
    mutationFn: async () => {
      if (!certificate || !user) return;
      const { data, error } = await supabase.from("user_certificates").insert({
        user_id: user.id,
        certificate_type: certificate.id,
        title: certificate.title,
        description: certificate.description,
        tier: certificate.tier,
        category: certificate.category,
      } as any).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issued-cert"] });
      queryClient.invalidateQueries({ queryKey: ["user-certificates"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      // Fire confetti
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
      toast.success("🎉 Certificate claimed!");
    },
    onError: () => toast.error("Failed to claim certificate"),
  });

  if (!certificate) return null;

  const tierGradient = tierColors[certificate.tier];
  const completedCount = certificate.requirements.filter(r => r.completed).length;
  const totalCount = certificate.requirements.length;
  const nextSteps = getNextSteps(certificate);
  const credentialId = (issuedCert as any)?.credential_id || "—";
  const issuedDate = (issuedCert as any)?.issued_at || new Date().toISOString();
  const canClaim = certificate.progress >= 100 && !issuedCert;
  const isClaimed = !!issuedCert;
  const recipientName = profileName || user?.email?.split("@")[0] || "Student";

  const handleDownload = async () => {
    setShowCert(true);
    // Wait for render
    setTimeout(async () => {
      if (certRef.current) {
        await downloadCertificatePDF(certRef.current, {
          recipientName,
          title: certificate.title,
          description: certificate.description,
          issueDate: issuedDate,
          credentialId,
          tier: certificate.tier,
        });
      }
      setShowCert(false);
    }, 500);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(generateVerificationUrl(credentialId));
    setCopied(true);
    toast.success("Verification link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLinkedInShare = () => {
    window.open(generateLinkedInShareUrl({
      recipientName,
      title: certificate.title,
      description: certificate.description,
      issueDate: issuedDate,
      credentialId,
      tier: certificate.tier,
    }), "_blank");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className={cn("w-20 h-20 rounded-2xl flex items-center justify-center mb-4 shadow-glow", `bg-gradient-to-br ${tierGradient}`)}>
            {isClaimed || certificate.earned ? (
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

        <div className="space-y-4 py-4">
          {/* Progress */}
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

          {/* Requirements */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Requirements:</h3>
            {certificate.requirements.map((req, idx) => (
              <div
                key={idx}
                className={cn(
                  "flex items-start gap-3 p-3 rounded-lg border transition-all",
                  req.completed ? "bg-success/10 border-success/30" : "bg-muted/30 border-border"
                )}
              >
                <div className="mt-0.5">
                  {req.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-success" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-muted-foreground" />
                  )}
                </div>
                <span className={cn("text-sm flex-1", req.completed && "line-through opacity-70")}>{req.text}</span>
              </div>
            ))}
          </div>

          {/* Credential info for claimed certs */}
          {isClaimed && (
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl space-y-2">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                Credential Details
              </h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs">Credential ID</p>
                  <p className="font-mono font-semibold">{credentialId}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Issued</p>
                  <p className="font-semibold">{new Date(issuedDate).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          )}

          {/* Next Steps */}
          {nextSteps.length > 0 && (
            <div className="space-y-3 p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <ArrowRight className="w-4 h-4" /> Next Steps
              </h3>
              <div className="space-y-2">
                {nextSteps.map((step, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-2">
                    <span className="text-sm text-muted-foreground flex-1">{step.text}</span>
                    {step.link && (
                      <Button size="sm" variant="outline" onClick={() => { onNavigate(step.link); onClose(); }} className="shrink-0">
                        {step.label}
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-3 pt-4">
            {canClaim && (
              <Button
                className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 animate-pulse"
                onClick={() => claimMutation.mutate()}
                disabled={claimMutation.isPending}
              >
                <Award className="w-4 h-4 mr-2" />
                Claim Certificate
              </Button>
            )}
            {isClaimed && (
              <>
                <Button onClick={handleDownload} className="flex-1">
                  <Download className="w-4 h-4 mr-2" /> Download PDF
                </Button>
                <Button variant="outline" onClick={handleLinkedInShare} className="flex-1">
                  <Linkedin className="w-4 h-4 mr-2" /> Add to LinkedIn
                </Button>
                <Button variant="outline" onClick={handleCopyLink}>
                  {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                  {copied ? "Copied!" : "Copy Link"}
                </Button>
              </>
            )}
            {!canClaim && !isClaimed && certificate.progress < 100 && nextSteps.length > 0 && (
              <Button
                className="flex-1"
                onClick={() => {
                  if (nextSteps[0].link) {
                    onNavigate(nextSteps[0].link);
                    onClose();
                  }
                }}
              >
                Continue Progress <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>

        {/* Hidden cert for PDF rendering */}
        {showCert && (
          <div className="fixed -left-[9999px] top-0">
            <ProfessionalCertificate
              ref={certRef}
              recipientName={recipientName}
              title={certificate.title}
              description={certificate.description}
              issueDate={issuedDate}
              credentialId={credentialId}
              tier={certificate.tier}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

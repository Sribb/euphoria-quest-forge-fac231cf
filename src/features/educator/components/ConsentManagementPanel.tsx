import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ShieldCheck, Mail, RefreshCw, Clock, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { useParentalConsent } from "../hooks/useParentalConsent";
import { ClassMember } from "../hooks/useClassManagement";

interface ConsentManagementPanelProps {
  classId: string;
  className: string;
  members: ClassMember[];
}

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  pending: { label: "Pending", color: "bg-warning/10 text-warning border-warning/30", icon: Clock },
  granted: { label: "Granted", color: "bg-success/10 text-success border-success/30", icon: CheckCircle2 },
  denied: { label: "Denied", color: "bg-destructive/10 text-destructive border-destructive/30", icon: XCircle },
  revoked: { label: "Revoked", color: "bg-destructive/10 text-destructive border-destructive/30", icon: AlertTriangle },
  none: { label: "Not Sent", color: "bg-muted/30 text-muted-foreground border-border/50", icon: Mail },
};

export const ConsentManagementPanel = ({ classId, className, members }: ConsentManagementPanelProps) => {
  const { consents, requestConsent, resendConsent, getConsentStatus } = useParentalConsent(classId);
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [parentEmail, setParentEmail] = useState("");

  const handleRequestConsent = async () => {
    if (!parentEmail.trim() || !selectedStudentId) return;
    await requestConsent.mutateAsync({
      studentId: selectedStudentId,
      parentEmail: parentEmail.trim(),
      classId,
    });
    setParentEmail("");
    setSelectedStudentId("");
    setRequestDialogOpen(false);
  };

  const pendingCount = members.filter(m => getConsentStatus(m.student_id) === "pending").length;
  const grantedCount = members.filter(m => getConsentStatus(m.student_id) === "granted").length;
  const noConsentCount = members.filter(m => getConsentStatus(m.student_id) === "none").length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-primary" />
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">COPPA Consent Status</h4>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="text-success font-medium">{grantedCount} granted</span>
          <span>·</span>
          <span className="text-warning font-medium">{pendingCount} pending</span>
          <span>·</span>
          <span>{noConsentCount} not sent</span>
        </div>
      </div>

      <div className="space-y-2">
        {members.map((member) => {
          const status = getConsentStatus(member.student_id);
          const config = statusConfig[status] || statusConfig.none;
          const StatusIcon = config.icon;
          const consent = consents.find(c => c.student_id === member.student_id);

          return (
            <div
              key={member.id}
              className="flex items-center gap-3 p-3 rounded-xl bg-muted/20 border border-border/50"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-primary-foreground">
                  {(member.display_name || "S")[0].toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{member.display_name || "Student"}</p>
                {consent && (
                  <p className="text-[10px] text-muted-foreground">{consent.parent_email}</p>
                )}
              </div>
              <Badge variant="outline" className={`text-[10px] gap-1 ${config.color}`}>
                <StatusIcon className="w-3 h-3" />
                {config.label}
              </Badge>
              <div className="flex items-center gap-1 shrink-0">
                {status === "none" && (
                  <Dialog open={requestDialogOpen && selectedStudentId === member.student_id} onOpenChange={(open) => {
                    setRequestDialogOpen(open);
                    if (open) setSelectedStudentId(member.student_id);
                  }}>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline" className="h-7 text-xs gap-1">
                        <Mail className="w-3 h-3" />
                        Request
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-sm">
                      <DialogHeader>
                        <DialogTitle className="text-base">Request Parental Consent</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-3 pt-2">
                        <p className="text-sm text-muted-foreground">
                          Send a consent request to <strong>{member.display_name}</strong>'s parent or guardian.
                        </p>
                        <div className="space-y-1.5">
                          <Label className="text-xs">Parent/Guardian Email</Label>
                          <Input
                            type="email"
                            placeholder="parent@example.com"
                            value={parentEmail}
                            onChange={(e) => setParentEmail(e.target.value)}
                            className="bg-muted/30 border-border/50"
                          />
                        </div>
                        <Button
                          onClick={handleRequestConsent}
                          disabled={requestConsent.isPending || !parentEmail.trim()}
                          className="w-full bg-gradient-primary font-semibold"
                        >
                          {requestConsent.isPending ? "Sending…" : "Send Consent Request"}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
                {status === "pending" && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 text-xs gap-1 text-muted-foreground"
                    onClick={() => consent && resendConsent.mutate(consent.id)}
                    disabled={resendConsent.isPending}
                  >
                    <RefreshCw className="w-3 h-3" />
                    Resend
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

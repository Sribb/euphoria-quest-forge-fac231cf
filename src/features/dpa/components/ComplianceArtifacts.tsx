import { FileText, Download, Shield, Lock, Eye, Receipt, FileSpreadsheet } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const artifacts = [
  { icon: Shield, title: "FERPA Compliance Attestation", description: "Letter confirming Euphoria's FERPA compliance and school-official designation.", link: "/ferpa" },
  { icon: Lock, title: "COPPA Compliance Statement", description: "Overview of parental consent mechanisms and data practices for students under 13.", link: null },
  { icon: FileText, title: "Data Retention & Deletion Policy", description: "Policy document covering retention periods, deletion procedures, and certification.", link: "/privacy" },
  { icon: Eye, title: "Security Practices Overview", description: "Summary of encryption, access controls, monitoring, and incident response.", link: null },
  { icon: Receipt, title: "Accessibility / VPAT", description: "Voluntary Product Accessibility Template documenting Section 508 conformance.", link: null },
];

export const ComplianceArtifacts = () => {
  const navigate = useNavigate();

  return (
    <div className="mt-12">
      <h2 className="text-xl font-semibold text-foreground mb-1">Compliance Artifacts</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Downloadable documents commonly requested during district procurement reviews.
      </p>
      <div className="grid gap-3 md:grid-cols-2">
        {artifacts.map((a) => (
          <Card key={a.title} className="p-4 border-border/50 bg-card/60 backdrop-blur-sm flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <a.icon className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">{a.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{a.description}</p>
            </div>
            {a.link && (
              <Button size="sm" variant="ghost" className="shrink-0 gap-1 text-xs" onClick={() => navigate(a.link!)}>
                View
              </Button>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

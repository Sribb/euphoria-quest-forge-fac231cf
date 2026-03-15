import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Award, CheckCircle2, Shield, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const VerifyCertificate = () => {
  const { credentialId } = useParams<{ credentialId: string }>();
  const [cert, setCert] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function verify() {
      if (!credentialId) { setNotFound(true); setLoading(false); return; }
      
      const { data, error } = await supabase
        .from("user_certificates")
        .select("*")
        .eq("credential_id", credentialId)
        .maybeSingle();

      if (error || !data) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setCert(data);

      // Get profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("display_name, username, avatar_url")
        .eq("id", (data as any).user_id)
        .single();

      setProfile(profileData);
      setLoading(false);
    }
    verify();
  }, [credentialId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <Card className="max-w-md w-full p-8 text-center">
          <Shield className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Certificate Not Found</h1>
          <p className="text-muted-foreground">
            The credential ID "{credentialId}" does not match any certificate in our records.
          </p>
        </Card>
      </div>
    );
  }

  const tierColors: Record<string, string> = {
    easy: "from-emerald-500 to-teal-500",
    medium: "from-blue-500 to-indigo-500",
    hard: "from-purple-500 to-violet-500",
    master: "from-amber-500 to-orange-500",
    beginner: "from-emerald-500 to-teal-500",
    advanced: "from-blue-500 to-indigo-500",
    elite: "from-purple-500 to-violet-500",
    fellow: "from-amber-500 to-orange-500",
  };

  const accent = tierColors[cert.tier] || tierColors.beginner;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex items-center justify-center px-4 py-12">
      <Card className="max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className={`bg-gradient-to-r ${accent} p-6 text-white text-center`}>
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3">
            <Award className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-bold mb-1">{cert.title}</h1>
          <Badge className="bg-white/20 text-white border-white/30 text-xs">
            {cert.tier?.toUpperCase()} TIER
          </Badge>
        </div>

        {/* Verification status */}
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-3 p-4 bg-success/10 border border-success/30 rounded-xl">
            <CheckCircle2 className="w-6 h-6 text-success shrink-0" />
            <div>
              <p className="font-semibold text-sm">Verified Certificate</p>
              <p className="text-xs text-muted-foreground">This credential has been verified by Euphoria.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Recipient</p>
                <p className="font-semibold text-lg">{profile?.display_name || "Student"}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Issue Date</p>
                <p className="font-semibold">
                  {new Date(cert.issued_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                </p>
              </div>
            </div>

            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Credential ID</p>
                <p className="font-mono font-semibold">{cert.credential_id}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Issued By</p>
                <p className="font-semibold">Euphoria</p>
              </div>
            </div>

            {cert.description && (
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Description</p>
                <p className="text-sm text-foreground">{cert.description}</p>
              </div>
            )}
          </div>

          <Button asChild variant="outline" className="w-full">
            <a href="/" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4 mr-2" />
              Learn more about Euphoria
            </a>
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default VerifyCertificate;

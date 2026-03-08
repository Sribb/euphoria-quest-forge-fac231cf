import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheck, CheckCircle2, XCircle, Trash2, Loader2, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/euphoria-logo-button.png";

type ConsentAction = "grant" | "deny" | "revoke" | "delete";

const ParentConsent = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [consentInfo, setConsentInfo] = useState<{
    studentName: string;
    className: string;
    status: string;
  } | null>(null);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    loadConsentInfo();
  }, [token]);

  const loadConsentInfo = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("parent-consent-action", {
        body: { action: "info", token },
      });
      if (error) throw error;
      setConsentInfo(data);
    } catch {
      setConsentInfo(null);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action: ConsentAction) => {
    if (!token) return;
    setSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke("parent-consent-action", {
        body: { action, token },
      });
      if (error) throw error;
      setResult({ success: true, message: data.message });
    } catch (err: any) {
      setResult({ success: false, message: err.message || "Something went wrong" });
    } finally {
      setSubmitting(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <Card className="max-w-md w-full p-8 text-center border-border/50 bg-card/60">
          <XCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h1 className="text-xl font-bold mb-2">Invalid Link</h1>
          <p className="text-sm text-muted-foreground mb-4">This consent link is missing or invalid. Please use the link from the email sent to you.</p>
          <Button variant="outline" className="gap-2" onClick={() => navigate("/")}>
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (result) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <Card className="max-w-md w-full p-8 text-center border-border/50 bg-card/60">
          {result.success ? (
            <CheckCircle2 className="w-12 h-12 text-success mx-auto mb-4" />
          ) : (
            <XCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          )}
          <h1 className="text-xl font-bold mb-2">{result.success ? "Thank You" : "Error"}</h1>
          <p className="text-sm text-muted-foreground">{result.message}</p>
        </Card>
      </div>
    );
  }

  if (!consentInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <Card className="max-w-md w-full p-8 text-center border-border/50 bg-card/60">
          <XCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h1 className="text-xl font-bold mb-2">Consent Not Found</h1>
          <p className="text-sm text-muted-foreground">This consent request may have expired or been processed already.</p>
        </Card>
      </div>
    );
  }

  const isAlreadyGranted = consentInfo.status === "granted";

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-hero opacity-30 blur-3xl" />
      <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
        <Card className="max-w-lg w-full border-border/50 bg-card/60 backdrop-blur-xl overflow-hidden">
          <div className="p-6 border-b border-border/50 bg-primary/5 flex items-center gap-3">
            <img src={logo} alt="Euphoria" className="w-8 h-8 object-contain" />
            <div>
              <h1 className="text-lg font-bold">Parental Consent</h1>
              <p className="text-xs text-muted-foreground">Euphoria Financial Literacy Platform</p>
            </div>
          </div>

          <div className="p-6 space-y-5">
            <div className="p-4 rounded-xl bg-muted/20 border border-border/30">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold">COPPA Notice</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your child <strong className="text-foreground">{consentInfo.studentName}</strong> has been enrolled in 
                <strong className="text-foreground"> {consentInfo.className}</strong> on Euphoria. 
                Under COPPA, we require parental consent before collecting data from students under 13.
              </p>
            </div>

            <div className="space-y-2 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">What data we collect:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Lesson progress and quiz scores</li>
                <li>Experience points and achievements</li>
                <li>Display name (no real name required)</li>
              </ul>
              <p className="mt-3 font-medium text-foreground">Your rights:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Revoke consent at any time</li>
                <li>Request deletion of all collected data</li>
                <li>Review data collected about your child</li>
              </ul>
            </div>

            {isAlreadyGranted ? (
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-success/10 border border-success/30 text-sm text-success flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Consent is currently granted
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    className="border-destructive/30 text-destructive hover:bg-destructive/10"
                    onClick={() => handleAction("revoke")}
                    disabled={submitting}
                  >
                    Revoke Consent
                  </Button>
                  <Button
                    variant="outline"
                    className="border-destructive/30 text-destructive hover:bg-destructive/10 gap-1"
                    onClick={() => handleAction("delete")}
                    disabled={submitting}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete Data
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={() => handleAction("deny")}
                  disabled={submitting}
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Deny Consent"}
                </Button>
                <Button
                  className="bg-gradient-primary shadow-glow font-semibold"
                  onClick={() => handleAction("grant")}
                  disabled={submitting}
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Grant Consent"}
                </Button>
              </div>
            )}

            <p className="text-[10px] text-muted-foreground/60 text-center">
              For questions, contact us at privacy@euphoria.edu · <a href="/privacy" className="underline">Privacy Policy</a>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ParentConsent;

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  Copy, CheckCircle, AlertCircle, Trash2, ChevronRight, ChevronLeft,
  School, ExternalLink, Link2, Settings, Rocket, PartyPopper
} from "lucide-react";

interface LtiPlatform {
  id: string;
  name: string;
  issuer: string;
  client_id: string;
  deployment_id: string;
  auth_login_url: string;
  auth_token_url: string;
  jwks_url: string;
  created_at: string;
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

const ENDPOINTS = {
  "JWKS URL": `${supabaseUrl}/functions/v1/lti-jwks`,
  "OIDC Login URL": `${supabaseUrl}/functions/v1/lti-oidc-login`,
  "Launch URL": `${supabaseUrl}/functions/v1/lti-launch`,
  "Deep Linking URL": `${supabaseUrl}/functions/v1/lti-content-picker`,
};

const TOTAL_STEPS = 5;

export const LtiSetupWizard = ({ onBack }: { onBack: () => void }) => {
  const { user } = useAuth();
  const [step, setStep] = useState(0); // 0 = overview of registered platforms
  const [platforms, setPlatforms] = useState<LtiPlatform[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    issuer: "",
    client_id: "",
    deployment_id: "",
    auth_login_url: "",
    auth_token_url: "",
    jwks_url: "",
  });

  useEffect(() => {
    if (user) loadPlatforms();
  }, [user]);

  const loadPlatforms = async () => {
    const { data } = await supabase
      .from("lti_platforms")
      .select("*")
      .order("created_at", { ascending: false }) as any;
    setPlatforms(data || []);
    setLoading(false);
  };

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const handleSave = async () => {
    if (!form.name || !form.issuer || !form.client_id || !form.deployment_id) {
      toast.error("Please fill in all required fields");
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("lti_platforms").insert({
      ...form,
      educator_id: user!.id,
    } as any);
    if (error) {
      toast.error("Failed to save: " + error.message);
    } else {
      toast.success("Canvas instance registered!");
      setForm({ name: "", issuer: "", client_id: "", deployment_id: "", auth_login_url: "", auth_token_url: "", jwks_url: "" });
      loadPlatforms();
      setStep(TOTAL_STEPS); // go to success
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("lti_platforms").delete().eq("id", id) as any;
    if (error) toast.error("Failed to delete");
    else { toast.success("Platform removed"); loadPlatforms(); }
  };

  const progressPercent = step === 0 ? 0 : Math.round((step / TOTAL_STEPS) * 100);

  // --- Wizard Steps ---
  const renderStep = () => {
    switch (step) {
      case 0:
        return <OverviewStep platforms={platforms} loading={loading} onStart={() => setStep(1)} onDelete={handleDelete} />;
      case 1:
        return <Step1_CreateKey endpoints={ENDPOINTS} copy={copy} />;
      case 2:
        return <Step2_ConfigureKey endpoints={ENDPOINTS} copy={copy} />;
      case 3:
        return <Step3_EnableServices />;
      case 4:
        return <Step4_RegisterDetails form={form} setForm={setForm} saving={saving} onSave={handleSave} />;
      case TOTAL_STEPS:
        return <SuccessStep onFinish={() => setStep(0)} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 py-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={step === 0 ? onBack : () => setStep(0)}>
          <ChevronLeft className="w-4 h-4 mr-1" /> {step === 0 ? "Back" : "Overview"}
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <School className="w-6 h-6 text-primary" />
            Canvas LTI Setup
          </h1>
          {step > 0 && step < TOTAL_STEPS && (
            <p className="text-xs text-muted-foreground mt-1">Step {step} of {TOTAL_STEPS - 1}</p>
          )}
        </div>
      </div>

      {/* Progress */}
      {step > 0 && step < TOTAL_STEPS && (
        <Progress value={progressPercent} className="h-2" />
      )}

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      {step > 0 && step < TOTAL_STEPS && (
        <div className="flex justify-between pt-2">
          <Button variant="outline" onClick={() => setStep(step - 1)}>
            <ChevronLeft className="w-4 h-4 mr-1" /> Previous
          </Button>
          {step < 4 ? (
            <Button onClick={() => setStep(step + 1)}>
              Next <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : null}
        </div>
      )}
    </div>
  );
};

// --- Sub-components ---

function OverviewStep({ platforms, loading, onStart, onDelete }: {
  platforms: LtiPlatform[];
  loading: boolean;
  onStart: () => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="space-y-6">
      {/* CTA */}
      <Card className="p-8 text-center border-primary/20 bg-primary/5">
        <Rocket className="w-12 h-12 text-primary mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-2">Connect Euphoria to Canvas</h2>
        <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
          Follow our guided tutorial to register Euphoria as an LTI 1.3 tool in your Canvas instance. It only takes a few minutes.
        </p>
        <Button size="lg" onClick={onStart} className="gap-2">
          <Settings className="w-5 h-5" /> Set Up My LTI
        </Button>
      </Card>

      {/* Existing platforms */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Registered Canvas Instances</h3>
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : platforms.length === 0 ? (
          <div className="text-center py-6">
            <AlertCircle className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No instances registered yet. Use the wizard above to get started.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {platforms.map((p) => (
              <div key={p.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border">
                <div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    <span className="font-medium text-sm">{p.name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 font-mono">{p.issuer}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => onDelete(p.id)}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

function EndpointRow({ label, url, copy }: { label: string; url: string; copy: (t: string) => void }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-medium text-muted-foreground w-36 shrink-0">{label}</span>
      <code className="text-xs bg-muted px-3 py-1.5 rounded flex-1 overflow-x-auto">{url}</code>
      <Button variant="ghost" size="icon" className="shrink-0" onClick={() => copy(url)}>
        <Copy className="w-4 h-4" />
      </Button>
    </div>
  );
}

function Step1_CreateKey({ endpoints, copy }: { endpoints: Record<string, string>; copy: (t: string) => void }) {
  return (
    <Card className="p-6 space-y-5">
      <div>
        <Badge variant="secondary" className="mb-2">Step 1</Badge>
        <h2 className="text-lg font-bold">Create a Developer Key in Canvas</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Open your Canvas Admin panel and create a new LTI Developer Key.
        </p>
      </div>
      <ol className="space-y-3 text-sm">
        <li className="flex gap-2">
          <span className="text-primary font-bold shrink-0">1.</span>
          <span>Go to <strong>Canvas Admin → Developer Keys → + Developer Key → LTI Key</strong></span>
        </li>
        <li className="flex gap-2">
          <span className="text-primary font-bold shrink-0">2.</span>
          <span>Set the <strong>Method</strong> to <code className="bg-muted px-1 rounded text-xs">Manual Entry</code></span>
        </li>
        <li className="flex gap-2">
          <span className="text-primary font-bold shrink-0">3.</span>
          <span>You'll need the URLs below for the next step — you can copy them now.</span>
        </li>
      </ol>
      <div className="border rounded-lg p-4 space-y-2 bg-muted/20">
        <div className="flex items-center gap-2 mb-3">
          <Link2 className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold">Your Euphoria Endpoints</span>
        </div>
        {Object.entries(endpoints).map(([label, url]) => (
          <EndpointRow key={label} label={label} url={url} copy={copy} />
        ))}
      </div>
    </Card>
  );
}

function Step2_ConfigureKey({ endpoints, copy }: { endpoints: Record<string, string>; copy: (t: string) => void }) {
  return (
    <Card className="p-6 space-y-5">
      <div>
        <Badge variant="secondary" className="mb-2">Step 2</Badge>
        <h2 className="text-lg font-bold">Configure the LTI Key</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Paste the Euphoria endpoints into the Canvas Developer Key form.
        </p>
      </div>
      <ol className="space-y-3 text-sm">
        <li className="flex gap-2">
          <span className="text-primary font-bold shrink-0">1.</span>
          <span>Set <strong>Target Link URI</strong> to:</span>
        </li>
        <div className="ml-5">
          <EndpointRow label="Launch URL" url={endpoints["Launch URL"]} copy={copy} />
        </div>
        <li className="flex gap-2">
          <span className="text-primary font-bold shrink-0">2.</span>
          <span>Set <strong>OpenID Connect Initiation URL</strong> to:</span>
        </li>
        <div className="ml-5">
          <EndpointRow label="OIDC Login URL" url={endpoints["OIDC Login URL"]} copy={copy} />
        </div>
        <li className="flex gap-2">
          <span className="text-primary font-bold shrink-0">3.</span>
          <span>Set <strong>JWK Method</strong> to "Public JWK URL" and enter:</span>
        </li>
        <div className="ml-5">
          <EndpointRow label="JWKS URL" url={endpoints["JWKS URL"]} copy={copy} />
        </div>
      </ol>
    </Card>
  );
}

function Step3_EnableServices() {
  return (
    <Card className="p-6 space-y-5">
      <div>
        <Badge variant="secondary" className="mb-2">Step 3</Badge>
        <h2 className="text-lg font-bold">Enable LTI Services & Save</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Enable grade passback and finish the Canvas-side setup.
        </p>
      </div>
      <ol className="space-y-3 text-sm">
        <li className="flex gap-2">
          <span className="text-primary font-bold shrink-0">1.</span>
          <span>Under <strong>LTI Advantage Services</strong>, enable:<br />
            <code className="bg-muted px-1 rounded text-xs">Can create and view assignment data</code> and{" "}
            <code className="bg-muted px-1 rounded text-xs">Can create and update submission results</code>
          </span>
        </li>
        <li className="flex gap-2">
          <span className="text-primary font-bold shrink-0">2.</span>
          <span>Under <strong>Additional Settings → Deep Linking</strong>, set the Content Item Return URL.</span>
        </li>
        <li className="flex gap-2">
          <span className="text-primary font-bold shrink-0">3.</span>
          <span><strong>Save</strong> the key, then copy the <strong>Client ID</strong> shown and turn the key <strong>ON</strong>.</span>
        </li>
        <li className="flex gap-2">
          <span className="text-primary font-bold shrink-0">4.</span>
          <span>Go to <strong>Settings → Apps → + App → By Client ID</strong>, paste the Client ID, and confirm.</span>
        </li>
      </ol>
      <div className="rounded-lg bg-primary/5 border border-primary/20 p-4 text-sm">
        <p className="font-medium text-primary">✨ Almost done!</p>
        <p className="text-muted-foreground mt-1">
          Now click <strong>Next</strong> and enter the details from Canvas to complete the connection.
        </p>
      </div>
    </Card>
  );
}

function Step4_RegisterDetails({ form, setForm, saving, onSave }: {
  form: any;
  setForm: (f: any) => void;
  saving: boolean;
  onSave: () => void;
}) {
  return (
    <Card className="p-6 space-y-5">
      <div>
        <Badge variant="secondary" className="mb-2">Step 4</Badge>
        <h2 className="text-lg font-bold">Register Your Canvas Details</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Enter the information from your Canvas Developer Key to complete the connection.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label className="text-xs">Display Name *</Label>
          <Input placeholder="My School Canvas" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div>
          <Label className="text-xs">Issuer URL *</Label>
          <Input placeholder="https://canvas.instructure.com" value={form.issuer} onChange={(e) => setForm({ ...form, issuer: e.target.value })} />
        </div>
        <div>
          <Label className="text-xs">Client ID *</Label>
          <Input placeholder="10000000000001" value={form.client_id} onChange={(e) => setForm({ ...form, client_id: e.target.value })} />
        </div>
        <div>
          <Label className="text-xs">Deployment ID *</Label>
          <Input placeholder="1" value={form.deployment_id} onChange={(e) => setForm({ ...form, deployment_id: e.target.value })} />
        </div>
        <div>
          <Label className="text-xs">Auth Login URL</Label>
          <Input placeholder="https://sso.canvaslms.com/api/lti/authorize_redirect" value={form.auth_login_url} onChange={(e) => setForm({ ...form, auth_login_url: e.target.value })} />
        </div>
        <div>
          <Label className="text-xs">Token URL</Label>
          <Input placeholder="https://sso.canvaslms.com/login/oauth2/token" value={form.auth_token_url} onChange={(e) => setForm({ ...form, auth_token_url: e.target.value })} />
        </div>
        <div className="sm:col-span-2">
          <Label className="text-xs">Platform JWKS URL</Label>
          <Input placeholder="https://sso.canvaslms.com/api/lti/security/jwks" value={form.jwks_url} onChange={(e) => setForm({ ...form, jwks_url: e.target.value })} />
        </div>
      </div>
      <div className="flex justify-end">
        <Button onClick={onSave} disabled={saving} size="lg" className="gap-2">
          {saving ? "Saving..." : "Complete Setup"} <CheckCircle className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
}

function SuccessStep({ onFinish }: { onFinish: () => void }) {
  return (
    <Card className="p-8 text-center border-primary/20">
      <PartyPopper className="w-14 h-14 text-primary mx-auto mb-4" />
      <h2 className="text-xl font-bold mb-2">You're All Set!</h2>
      <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
        Your Canvas instance has been connected. Students can now launch Euphoria directly from Canvas assignments.
      </p>
      <Button onClick={onFinish} size="lg">View My Instances</Button>
    </Card>
  );
}

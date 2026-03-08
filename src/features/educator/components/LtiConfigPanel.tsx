import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Settings, Copy, ExternalLink, Plus, Trash2, CheckCircle, AlertCircle, Link2
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

export const LtiConfigPanel = () => {
  const { user } = useAuth();
  const [platforms, setPlatforms] = useState<LtiPlatform[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
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

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

  const endpoints = {
    jwks: `${supabaseUrl}/functions/v1/lti-jwks`,
    oidcLogin: `${supabaseUrl}/functions/v1/lti-oidc-login`,
    launch: `${supabaseUrl}/functions/v1/lti-launch`,
    deepLinking: `${supabaseUrl}/functions/v1/lti-content-picker`,
  };

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

  const copyToClipboard = (text: string) => {
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
      toast.success("Canvas platform registered!");
      setShowAddForm(false);
      setForm({ name: "", issuer: "", client_id: "", deployment_id: "", auth_login_url: "", auth_token_url: "", jwks_url: "" });
      loadPlatforms();
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("lti_platforms").delete().eq("id", id) as any;
    if (error) {
      toast.error("Failed to delete");
    } else {
      toast.success("Platform removed");
      loadPlatforms();
    }
  };

  const canvasInstructions = [
    "Go to Canvas Admin → Developer Keys → + Developer Key → LTI Key",
    "Set Method to 'Manual Entry'",
    `Set Target Link URI to: ${endpoints.launch}`,
    `Set OpenID Connect Initiation URL to: ${endpoints.oidcLogin}`,
    `Set JWK Method to 'Public JWK URL' and enter: ${endpoints.jwks}`,
    "Under LTI Advantage Services, enable: Can create and view assignment data, Can create and update submission results",
    "Under Additional Settings → Deep Linking, set Content Item Return URL",
    "Save the key, then copy the Client ID and turn the key ON",
    "Go to Settings → Apps → + App → By Client ID, paste the Client ID",
  ];

  return (
    <div className="space-y-6">
      {/* Endpoint Reference */}
      <Card className="p-6 border-primary/20">
        <div className="flex items-center gap-2 mb-4">
          <Link2 className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">LTI 1.3 Endpoints</h3>
          <Badge variant="secondary">Ready</Badge>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Use these URLs when registering Euphoria as an LTI tool in Canvas.
        </p>
        <div className="space-y-3">
          {Object.entries(endpoints).map(([key, url]) => (
            <div key={key} className="flex items-center gap-3">
              <span className="text-xs font-mono text-muted-foreground w-32 shrink-0 capitalize">
                {key.replace(/([A-Z])/g, " $1")}:
              </span>
              <code className="text-xs bg-muted px-3 py-1.5 rounded flex-1 overflow-x-auto">{url}</code>
              <Button variant="ghost" size="icon" className="shrink-0" onClick={() => copyToClipboard(url)}>
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Setup Instructions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Canvas Setup Instructions
        </h3>
        <ol className="space-y-2">
          {canvasInstructions.map((step, i) => (
            <li key={i} className="text-sm text-muted-foreground flex gap-2">
              <span className="text-primary font-semibold shrink-0">{i + 1}.</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </Card>

      {/* Registered Platforms */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Registered Canvas Instances</h3>
          <Button size="sm" onClick={() => setShowAddForm(true)} className="gap-2">
            <Plus className="w-4 h-4" /> Add Canvas Instance
          </Button>
        </div>

        {loading ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : platforms.length === 0 && !showAddForm ? (
          <div className="text-center py-8">
            <AlertCircle className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No Canvas instances registered yet.</p>
            <p className="text-xs text-muted-foreground mt-1">Follow the setup instructions above, then add your Canvas details here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {platforms.map((p) => (
              <div key={p.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border">
                <div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span className="font-medium text-sm">{p.name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 font-mono">{p.issuer}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {showAddForm && (
          <div className="mt-4 p-4 border rounded-lg bg-muted/20 space-y-3">
            <h4 className="font-semibold text-sm">Register Canvas Instance</h4>
            <div className="grid grid-cols-2 gap-3">
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
              <div className="col-span-2">
                <Label className="text-xs">Platform JWKS URL</Label>
                <Input placeholder="https://sso.canvaslms.com/api/lti/security/jwks" value={form.jwks_url} onChange={(e) => setForm({ ...form, jwks_url: e.target.value })} />
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <Button onClick={handleSave} disabled={saving} size="sm">
                {saving ? "Saving..." : "Register Platform"}
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowAddForm(false)}>Cancel</Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

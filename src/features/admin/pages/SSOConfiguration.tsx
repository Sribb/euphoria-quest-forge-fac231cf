import { ArrowLeft, Shield, CheckCircle2, XCircle, AlertTriangle, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { motion } from "framer-motion";

interface Props { onBack: () => void; }

const providers = [
  { id: "azure", name: "Azure AD", logo: "🔷" },
  { id: "google", name: "Google Workspace", logo: "🟢" },
  { id: "clever", name: "Clever", logo: "🔵" },
  { id: "classlink", name: "ClassLink", logo: "🟠" },
  { id: "okta", name: "Okta", logo: "🟣" },
];

const configFields = [
  { id: "entityId", label: "Entity ID / Issuer", placeholder: "https://sts.windows.net/{tenant-id}/", valid: true },
  { id: "ssoUrl", label: "SSO Login URL", placeholder: "https://login.microsoftonline.com/{tenant}/saml2", valid: true },
  { id: "cert", label: "X.509 Certificate", placeholder: "Paste certificate or upload XML...", valid: false },
  { id: "logoutUrl", label: "Logout URL (optional)", placeholder: "https://login.microsoftonline.com/common/wsfederation?wa=wsignout1.0", valid: true },
];

export const SSOConfiguration = ({ onBack }: Props) => {
  const [phase, setPhase] = useState(1);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack}><ArrowLeft className="h-5 w-5" /></Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">SSO Configuration</h1>
          <p className="text-sm text-muted-foreground">Identity provider setup, testing, and troubleshooting</p>
        </div>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2">
        {[1, 2, 3].map(p => (
          <div key={p} className="flex items-center gap-2 flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${phase >= p ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>{p}</div>
            <span className={`text-xs ${phase >= p ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
              {p === 1 ? 'IdP Setup' : p === 2 ? 'Attribute Mapping' : 'Test & Activate'}
            </span>
            {p < 3 && <ChevronRight className="h-3 w-3 text-muted-foreground" />}
          </div>
        ))}
      </div>

      {phase === 1 && (
        <motion.div className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Card className="p-4 border-border/50">
            <h3 className="font-semibold text-foreground text-sm mb-3">Select Identity Provider</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {providers.map(p => (
                <Card
                  key={p.id}
                  className={`p-3 cursor-pointer text-center transition-all ${selectedProvider === p.id ? 'border-primary bg-primary/5' : 'border-border/50 hover:border-primary/30'}`}
                  onClick={() => setSelectedProvider(p.id)}
                >
                  <span className="text-2xl">{p.logo}</span>
                  <p className="text-xs font-medium text-foreground mt-1">{p.name}</p>
                </Card>
              ))}
            </div>
          </Card>

          {selectedProvider && (
            <Card className="p-4 border-border/50">
              <h3 className="font-semibold text-foreground text-sm mb-3">Configuration Fields</h3>
              <div className="space-y-3">
                {configFields.map(f => (
                  <div key={f.id}>
                    <Label className="text-xs">{f.label}</Label>
                    <div className="relative mt-1">
                      <Input placeholder={f.placeholder} className="pr-8" />
                      <div className="absolute right-2 top-1/2 -translate-y-1/2">
                        {f.valid ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-400" />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button className="mt-4" onClick={() => setPhase(2)}>Continue to Attribute Mapping</Button>
            </Card>
          )}
        </motion.div>
      )}

      {phase === 2 && (
        <motion.div className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Card className="p-4 border-border/50">
            <h3 className="font-semibold text-foreground text-sm mb-3">Attribute Mapping</h3>
            <div className="space-y-2">
              {[["email", "User Email"], ["firstName", "First Name"], ["lastName", "Last Name"], ["role", "User Role"]].map(([idp, platform]) => (
                <div key={idp} className="flex items-center gap-3 p-2 rounded-lg bg-muted/20 border border-border/30">
                  <span className="text-xs font-mono text-foreground flex-1">{idp}</span>
                  <ChevronRight className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs font-medium text-primary flex-1 text-right">{platform}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-4">
              <Button variant="outline" onClick={() => setPhase(1)}>Back</Button>
              <Button onClick={() => setPhase(3)}>Continue to Test</Button>
            </div>
          </Card>
        </motion.div>
      )}

      {phase === 3 && (
        <motion.div className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-center">
            <p className="text-sm font-bold text-amber-500">⚠️ TEST — NOT PRODUCTION</p>
          </div>
          <Card className="p-4 border-border/50 text-center">
            <Shield className="h-8 w-8 mx-auto text-primary mb-2" />
            <h3 className="font-semibold text-foreground text-sm mb-2">Ready to Test</h3>
            <p className="text-xs text-muted-foreground mb-4">Click below to generate a test login link. Authenticate with a test account to verify the SAML flow.</p>
            <div className="flex gap-2 justify-center">
              <Button variant="outline" onClick={() => setPhase(2)}>Back</Button>
              <Button>Generate Test Login</Button>
              <Button variant="default" className="bg-green-600 hover:bg-green-700">Activate SSO</Button>
            </div>
          </Card>

          <Card className="p-4 border-border/50">
            <h3 className="font-semibold text-foreground text-sm mb-2 flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-amber-500" />Troubleshooting Wizard</h3>
            <p className="text-xs text-muted-foreground mb-3">Common SSO issues and resolutions</p>
            <div className="space-y-1.5">
              {["Clock skew between IdP and SP", "Certificate expired or mismatched", "Attribute name mismatch", "Missing NameID in assertion", "Redirect URI not whitelisted"].map(issue => (
                <div key={issue} className="p-2 rounded-lg border border-border/30 text-xs text-foreground hover:bg-muted/10 cursor-pointer transition-colors">{issue}</div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

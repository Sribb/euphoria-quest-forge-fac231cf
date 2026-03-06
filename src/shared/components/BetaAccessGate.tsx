import { useState, useEffect } from "react";
import { Lock, ArrowRight, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import logo from "@/assets/euphoria-logo-button.png";

const BETA_CODE = "euphoria@INV!";
const STORAGE_KEY = "euphoria_beta_access";

export const BetaAccessGate = ({ children }: { children: React.ReactNode }) => {
  const [hasAccess, setHasAccess] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY) === "granted") {
      setHasAccess(true);
    }
    setChecking(false);
  }, []);

  if (checking) return null;
  if (hasAccess) return <>{children}</>;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code === BETA_CODE) {
      sessionStorage.setItem(STORAGE_KEY, "granted");
      setHasAccess(true);
    } else {
      setError("Invalid access code. This site is currently in private beta.");
      setCode("");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(262_83%_58%/0.1),transparent_60%)]" />

      <div className="relative w-full max-w-sm mx-4 rounded-2xl border border-border bg-card/95 backdrop-blur-xl p-8 shadow-2xl">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
            <img src={logo} alt="Euphoria" className="w-9 h-9 object-contain" />
          </div>
          <h2 className="text-xl font-bold mb-1">Private Beta</h2>
          <p className="text-sm text-muted-foreground">
            Enter your access code to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="password"
              placeholder="Access code"
              value={code}
              onChange={(e) => { setCode(e.target.value); setError(""); }}
              className="pl-10 bg-background/50"
              autoFocus
            />
          </div>

          {error && (
            <div className="flex items-start gap-2 text-destructive text-xs bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2.5">
              <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-gradient-primary shadow-glow-soft hover:shadow-glow transition-all"
            disabled={!code.trim()}
          >
            Enter <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </form>

        <div className="text-center mt-6 space-y-1">
          <p className="text-xs text-muted-foreground">Don't have an access code?</p>
          <a
            href="https://euphoriainv.com"
            className="text-xs text-primary hover:text-primary/80 underline underline-offset-2 transition-colors"
          >
            Join the waitlist →
          </a>
        </div>
      </div>
    </div>
  );
};

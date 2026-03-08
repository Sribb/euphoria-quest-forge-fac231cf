import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock, ArrowRight } from "lucide-react";
import euphoriaLogo from "@/assets/euphoria-logo-button.png";

const BETA_CODE = "euphoria@INV!";

interface Props {
  onUnlock: () => void;
}

export const BetaAccessGate = ({ onUnlock }: Props) => {
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const [shaking, setShaking] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code === BETA_CODE) {
      onUnlock();
    } else {
      setError(true);
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-sm w-full text-center space-y-6"
      >
        <img src={euphoriaLogo} alt="Euphoria" className="w-14 h-14 mx-auto rounded-2xl shadow-[var(--shadow-glow)]" />
        <div>
          <h1 className="text-2xl font-bold">Private Beta</h1>
          <p className="text-muted-foreground text-sm mt-1">Enter your access code to continue</p>
        </div>

        <motion.form
          onSubmit={handleSubmit}
          animate={shaking ? { x: [-8, 8, -6, 6, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="space-y-3"
        >
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="password"
              placeholder="Access code"
              value={code}
              onChange={(e) => { setCode(e.target.value); setError(false); }}
              className={`pl-10 ${error ? "border-destructive" : ""}`}
              autoFocus
            />
          </div>
          {error && <p className="text-destructive text-xs">Invalid access code</p>}
          <Button type="submit" className="w-full gap-2">
            Enter <ArrowRight className="w-4 h-4" />
          </Button>
        </motion.form>

        <a
          href="https://euphoriainv.com"
          className="inline-block text-sm text-primary hover:underline"
        >
          Join the waitlist →
        </a>
      </motion.div>
    </div>
  );
};

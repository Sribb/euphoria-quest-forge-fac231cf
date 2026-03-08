import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock, ArrowRight } from "lucide-react";
import euphoriaLogo from "@/assets/euphoria-logo-button.png";

const BETA_CODE = "euphoria@INV!";

interface Props {
  onUnlock: () => void;
}

const FloatingParticle = ({ delay, x, y, size }: { delay: number; x: number; y: number; size: number }) => (
  <motion.div
    className="absolute rounded-full bg-primary/20 blur-sm"
    style={{ width: size, height: size, left: `${x}%`, top: `${y}%` }}
    animate={{
      y: [0, -30, 0],
      opacity: [0, 0.6, 0],
      scale: [0.8, 1.2, 0.8],
    }}
    transition={{
      duration: 4 + Math.random() * 2,
      repeat: Infinity,
      delay,
      ease: "easeInOut",
    }}
  />
);

export const BetaAccessGate = ({ onUnlock }: Props) => {
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const [shaking, setShaking] = useState(false);

  const particles = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        delay: Math.random() * 4,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 4 + Math.random() * 8,
      })),
    []
  );

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
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Radial glow */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary/8 blur-[120px]"
          animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-primary/12 blur-[80px]"
          animate={{ scale: [1.1, 0.95, 1.1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((p) => (
          <FloatingParticle key={p.id} delay={p.delay} x={p.x} y={p.y} size={p.size} />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative max-w-sm w-full text-center space-y-6 z-10"
      >
        <motion.img
          src={euphoriaLogo}
          alt="Euphoria"
          className="w-14 h-14 mx-auto rounded-2xl shadow-[var(--shadow-glow)]"
          animate={{ boxShadow: ["0 0 20px hsl(var(--primary) / 0.3)", "0 0 40px hsl(var(--primary) / 0.5)", "0 0 20px hsl(var(--primary) / 0.3)"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
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

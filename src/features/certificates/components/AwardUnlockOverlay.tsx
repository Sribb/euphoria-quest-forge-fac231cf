import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, X, Download, Share2, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import confetti from "canvas-confetti";
import { cn } from "@/lib/utils";

interface AwardUnlockOverlayProps {
  title: string;
  description: string;
  tier: string;
  onClose: () => void;
  onDownload?: () => void;
  onShare?: () => void;
}

const tierAccent: Record<string, string> = {
  easy: "from-emerald-400 to-teal-500",
  medium: "from-blue-400 to-indigo-500",
  hard: "from-purple-400 to-violet-500",
  master: "from-amber-400 to-orange-500",
  beginner: "from-emerald-400 to-teal-500",
  advanced: "from-blue-400 to-indigo-500",
  elite: "from-purple-400 to-violet-500",
  fellow: "from-amber-400 to-orange-500",
};

export const AwardUnlockOverlay = ({ title, description, tier, onClose, onDownload, onShare }: AwardUnlockOverlayProps) => {
  const accent = tierAccent[tier] || tierAccent.easy;

  useEffect(() => {
    // Triple confetti burst
    const fire = (delay: number) => {
      setTimeout(() => {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6, x: 0.3 + Math.random() * 0.4 } });
      }, delay);
    };
    fire(0);
    fire(300);
    fire(600);
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", duration: 0.6 }}
          onClick={(e) => e.stopPropagation()}
          className="relative max-w-sm w-full mx-4"
        >
          {/* Glow ring */}
          <div className={cn("absolute -inset-4 rounded-3xl bg-gradient-to-r opacity-30 blur-2xl animate-pulse", accent)} />
          
          <div className="relative bg-card rounded-2xl p-8 text-center border border-border shadow-2xl">
            <button onClick={onClose} className="absolute top-3 right-3 text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>

            {/* Badge animation */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", delay: 0.2, duration: 0.8 }}
              className={cn("w-24 h-24 rounded-2xl mx-auto mb-6 flex items-center justify-center bg-gradient-to-br shadow-lg", accent)}
            >
              <Award className="w-12 h-12 text-white" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <p className="text-sm text-primary font-semibold uppercase tracking-wider mb-2">
                🎉 Achievement Unlocked!
              </p>
              <h2 className="text-2xl font-bold mb-2">{title}</h2>
              <p className="text-sm text-muted-foreground mb-6">{description}</p>

              <div className="flex gap-2">
                {onDownload && (
                  <Button onClick={onDownload} size="sm" className="flex-1">
                    <Download className="w-4 h-4 mr-1" /> Download
                  </Button>
                )}
                {onShare && (
                  <Button onClick={onShare} size="sm" variant="outline" className="flex-1">
                    <Share2 className="w-4 h-4 mr-1" /> Share
                  </Button>
                )}
                {!onDownload && !onShare && (
                  <Button onClick={onClose} className="w-full">
                    Awesome!
                  </Button>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

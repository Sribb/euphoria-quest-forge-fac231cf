import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, RotateCcw, BookOpen, Play, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { playCorrect, playIncorrect, playClick } from "@/lib/soundEffects";
import { fireSmallConfetti } from "@/lib/confetti";

interface HeartsDepletedProps {
  onEarnHeart: () => Promise<boolean>;
  onClose: () => void;
  canEarnMore: boolean;
  heartsEarnedToday: number;
  maxEarnPerDay: number;
}

const REVIEW_QUESTIONS = [
  { q: "Stocks represent ownership in a ___.", options: ["company", "bank", "government"], correct: 0 },
  { q: "Diversification helps reduce ___.", options: ["returns", "risk", "taxes"], correct: 1 },
  { q: "A budget tracks income and ___.", options: ["debts", "stocks", "expenses"], correct: 2 },
  { q: "Compound interest earns interest on ___.", options: ["principal only", "interest too", "fees"], correct: 1 },
  { q: "An emergency fund covers ___ months of expenses.", options: ["1-2", "3-6", "12+"], correct: 1 },
];

export const HeartsDepleted = ({ onEarnHeart, onClose, canEarnMore, heartsEarnedToday, maxEarnPerDay }: HeartsDepletedProps) => {
  const [mode, setMode] = useState<'menu' | 'practice' | 'video'>('menu');
  const [currentQ, setCurrentQ] = useState(0);
  const [answered, setAnswered] = useState<number | null>(null);
  const [earning, setEarning] = useState(false);
  const [earned, setEarned] = useState(false);

  const question = REVIEW_QUESTIONS[currentQ % REVIEW_QUESTIONS.length];

  const handlePracticeAnswer = async (i: number) => {
    if (answered !== null) return;
    setAnswered(i);

    if (i === question.correct) {
      playCorrect();
      fireSmallConfetti();
      setEarning(true);
      const success = await onEarnHeart();
      setEarning(false);
      if (success) {
        setEarned(true);
        setTimeout(() => {
          setEarned(false);
          setAnswered(null);
          setCurrentQ(prev => prev + 1);
          setMode('menu');
        }, 1500);
      }
    } else {
      playIncorrect();
      setTimeout(() => {
        setAnswered(null);
        setCurrentQ(prev => prev + 1);
      }, 1500);
    }
  };

  const handleWatchVideo = async () => {
    setMode('video');
    // Simulate watching a review clip
    setTimeout(async () => {
      setEarning(true);
      const success = await onEarnHeart();
      setEarning(false);
      if (success) {
        setEarned(true);
        setTimeout(() => {
          setEarned(false);
          setMode('menu');
        }, 1500);
      }
    }, 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
    >
      <Card className="max-w-md w-full p-6 space-y-5">
        {mode === 'menu' && (
          <>
            <div className="text-center space-y-3">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="inline-block"
              >
                <Heart className="w-16 h-16 text-muted-foreground/30 mx-auto" />
              </motion.div>
              <h2 className="text-2xl font-black text-foreground">No Hearts Left!</h2>
              <p className="text-muted-foreground text-sm">
                You've used all your hearts for now. Earn them back or come back tomorrow for a fresh start.
              </p>
              <p className="text-xs text-muted-foreground">
                Earned today: {heartsEarnedToday}/{maxEarnPerDay}
              </p>
            </div>

            <div className="space-y-2">
              {canEarnMore && (
                <>
                  <Button
                    onClick={() => { playClick(); setMode('practice'); }}
                    className="w-full h-12 rounded-xl"
                    variant="default"
                  >
                    <BookOpen className="w-5 h-5 mr-2" />
                    Practice to Earn a Heart
                  </Button>
                  <Button
                    onClick={() => { playClick(); handleWatchVideo(); }}
                    className="w-full h-12 rounded-xl"
                    variant="outline"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Watch a Review (30s)
                  </Button>
                </>
              )}
              {!canEarnMore && (
                <p className="text-center text-sm text-muted-foreground p-3 rounded-xl bg-muted/30">
                  You've earned the maximum hearts for today. Come back tomorrow! 💪
                </p>
              )}
              <Button
                onClick={() => { playClick(); onClose(); }}
                variant="ghost"
                className="w-full h-10 rounded-xl text-muted-foreground"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Go Back to Lessons
              </Button>
            </div>
          </>
        )}

        {mode === 'practice' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-foreground">Quick Review</h3>
            <p className="text-foreground font-medium">{question.q}</p>
            <div className="space-y-2">
              {question.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handlePracticeAnswer(i)}
                  disabled={answered !== null || earning}
                  className={`w-full p-3 rounded-xl text-left border-2 font-medium transition-all ${
                    answered === null
                      ? "border-border bg-background hover:border-primary text-foreground"
                      : i === question.correct
                        ? "border-primary bg-primary/10 text-primary"
                        : i === answered
                          ? "border-destructive bg-destructive/10 text-destructive"
                          : "border-border opacity-40 text-muted-foreground"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
            {earned && (
              <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 text-primary font-bold">
                <CheckCircle2 className="w-5 h-5" />
                <Heart className="w-5 h-5 fill-destructive text-destructive" /> +1 Heart earned!
              </motion.div>
            )}
            {answered !== null && answered !== question.correct && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-muted-foreground">
                Not quite — try again on the next question!
              </motion.p>
            )}
          </div>
        )}

        {mode === 'video' && (
          <div className="space-y-4 text-center">
            <h3 className="text-lg font-bold text-foreground">Quick Review</h3>
            {!earned ? (
              <div className="space-y-3">
                <div className="aspect-video bg-muted/30 rounded-xl flex items-center justify-center border border-border">
                  <div className="text-center space-y-2">
                    <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
                    <p className="text-sm text-muted-foreground">Reviewing key concepts...</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">📖 Tip: Diversifying across asset classes reduces overall portfolio risk.</p>
              </div>
            ) : (
              <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="space-y-2">
                <CheckCircle2 className="w-12 h-12 text-primary mx-auto" />
                <p className="font-bold text-foreground">Review complete!</p>
                <div className="flex items-center justify-center gap-2 text-primary font-bold">
                  <Heart className="w-5 h-5 fill-destructive text-destructive" /> +1 Heart earned!
                </div>
              </motion.div>
            )}
          </div>
        )}
      </Card>
    </motion.div>
  );
};

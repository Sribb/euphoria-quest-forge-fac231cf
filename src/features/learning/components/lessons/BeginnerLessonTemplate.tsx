import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { playClick, playSlideForward, playSlideBack, playMilestone, playLessonComplete } from "@/lib/soundEffects";
import { fireConfetti } from "@/lib/confetti";

export interface LessonSlide {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface BeginnerLessonTemplateProps {
  slides: LessonSlide[];
  onComplete: () => void;
}

export const BeginnerLessonTemplate = ({ slides, onComplete }: BeginnerLessonTemplateProps) => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const isLast = current === slides.length - 1;
  const isFirst = current === 0;

  // Play milestone sound at halfway
  const halfwayIndex = Math.floor(slides.length / 2);

  const goNext = () => {
    if (isLast) {
      playLessonComplete();
      fireConfetti();
      setTimeout(() => onComplete(), 600);
      return;
    }
    setDirection(1);
    const next = current + 1;
    setCurrent(next);

    if (next === halfwayIndex) {
      playMilestone();
    } else {
      playSlideForward();
    }
  };

  const goBack = () => {
    if (isFirst) return;
    setDirection(-1);
    setCurrent((p) => p - 1);
    playSlideBack();
  };

  const slide = slides[current];

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 80 : -80,
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({
      x: dir > 0 ? -80 : 80,
      opacity: 0,
    }),
  };

  return (
    <div className="min-h-[600px] flex flex-col">
      {/* Progress bar */}
      <div className="flex items-center gap-2 mb-8">
        {slides.map((_, i) => (
          <div
            key={i}
            className={`h-2 rounded-full flex-1 transition-all duration-500 ${
              i <= current ? "bg-primary" : "bg-muted"
            }`}
          />
        ))}
      </div>

      {/* Slide content */}
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={slide.id}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="w-full"
          >
            <h2 className="text-2xl md:text-3xl font-black text-foreground mb-6">{slide.title}</h2>
            <div className="text-foreground">{slide.content}</div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-8 mt-auto">
        <Button
          variant="ghost"
          onClick={goBack}
          disabled={isFirst}
          className="rounded-xl"
        >
          <ChevronLeft className="w-5 h-5 mr-1" /> Back
        </Button>

        <span className="text-sm text-muted-foreground font-bold">
          {current + 1} / {slides.length}
        </span>

        <Button onClick={goNext} className="rounded-xl px-6">
          {isLast ? (
            <>Complete <CheckCircle2 className="w-5 h-5 ml-1" /></>
          ) : (
            <>Next <ChevronRight className="w-5 h-5 ml-1" /></>
          )}
        </Button>
      </div>
    </div>
  );
};

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, CheckCircle2, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { playClick, playSlideForward, playSlideBack, playMilestone, playLessonComplete, playCorrect, playIncorrect } from "@/lib/soundEffects";
import { fireConfetti, fireSmallConfetti } from "@/lib/confetti";
import { MicroScreen, MicroLessonDefinition } from "../../data/microLessonTypes";
import { TapToReveal } from "../interactive/TapToReveal";
import { TrueFalseChallenge } from "../interactive/TrueFalseChallenge";
import { FillInBlank } from "../interactive/FillInBlank";
import { MatchPairs } from "../interactive/MatchPairs";
import { DragSortChallenge } from "../interactive/DragSortChallenge";
import { SliderSimulator } from "../interactive/SliderSimulator";
import { HeartsDisplay } from "../HeartsDisplay";

interface MicroLessonTemplateProps {
  lesson: MicroLessonDefinition;
  onComplete: () => void;
  hearts?: number;
  maxHearts?: number;
  onWrongAnswer?: () => void;
  onCorrectAnswer?: () => void;
  onPerfectLesson?: () => void;
}

export const MicroLessonTemplate = ({ lesson, onComplete, hearts, maxHearts, onWrongAnswer, onCorrectAnswer, onPerfectLesson }: MicroLessonTemplateProps) => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [wrongCount, setWrongCount] = useState(0);

  const screens = lesson.screens;
  const isLast = current === screens.length - 1;
  const isFirst = current === 0;
  const halfwayIndex = Math.floor(screens.length / 2);

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
    if (next === halfwayIndex) playMilestone();
    else playSlideForward();
  };

  const goBack = () => {
    if (isFirst) return;
    setDirection(-1);
    setCurrent(p => p - 1);
    playSlideBack();
  };

  const screen = screens[current];

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
  };

  const handleQuizSelect = (screenId: string, optIdx: number, correctIdx: number) => {
    if (quizAnswers[screenId] !== undefined) return;
    setQuizAnswers(prev => ({ ...prev, [screenId]: optIdx }));
    if (optIdx === correctIdx) { playCorrect(); fireSmallConfetti(); }
    else { playIncorrect(); onWrongAnswer?.(); }
  };

  const handleInteractiveWrong = () => {
    onWrongAnswer?.();
  };

  return (
    <div className="min-h-[500px] flex flex-col max-w-2xl mx-auto">
      {/* Progress dots + Hearts */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-1.5 flex-1">
          {screens.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full flex-1 transition-all duration-500 ${
                i <= current ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>
        {hearts !== undefined && maxHearts !== undefined && (
          <HeartsDisplay hearts={hearts} maxHearts={maxHearts} compact />
        )}
      </div>

      {/* Screen content */}
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={screen.id}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="w-full"
          >
            {renderScreen(screen, quizAnswers, handleQuizSelect, handleInteractiveWrong)}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-6 mt-auto">
        <Button variant="ghost" onClick={goBack} disabled={isFirst} className="rounded-xl">
          <ChevronLeft className="w-5 h-5 mr-1" /> Back
        </Button>
        <span className="text-sm text-muted-foreground font-bold">
          {current + 1} / {screens.length}
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

function renderScreen(
  screen: MicroScreen,
  quizAnswers: Record<string, number>,
  onQuizSelect: (id: string, opt: number, correct: number) => void,
  onWrongAnswer: () => void
) {
  switch (screen.type) {
    case 'concept':
      return (
        <div className="space-y-5">
          {screen.emoji && <span className="text-5xl block">{screen.emoji}</span>}
          <h2 className="text-2xl md:text-3xl font-black text-foreground">{screen.title}</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">{screen.body}</p>

          {screen.visual?.type === 'comparison' && (
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 text-center">
                <p className="text-2xl font-black text-primary">{screen.visual.left.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{screen.visual.left.label}</p>
              </div>
              <div className="p-4 rounded-xl bg-accent/10 border border-accent/20 text-center">
                <p className="text-2xl font-black text-accent-foreground">{screen.visual.right.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{screen.visual.right.label}</p>
              </div>
            </div>
          )}

          {screen.visual?.type === 'highlight' && (
            <div className="space-y-2 mt-3">
              {screen.visual.items.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 * i }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-muted/40 border border-border"
                >
                  <span className="text-xl">{item.emoji}</span>
                  <span className="text-foreground font-medium">{item.text}</span>
                </motion.div>
              ))}
            </div>
          )}

          {screen.visual?.type === 'stat' && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="p-6 rounded-xl bg-primary/5 border border-primary/20 text-center mt-4"
            >
              <p className="text-4xl font-black text-primary">{screen.visual.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{screen.visual.label}</p>
            </motion.div>
          )}
        </div>
      );

    case 'tap-reveal':
      return (
        <div className="space-y-4">
          <h2 className="text-2xl font-black text-foreground">{screen.title}</h2>
          {screen.body && <p className="text-muted-foreground">{screen.body}</p>}
          <TapToReveal cards={screen.cards} />
        </div>
      );

    case 'true-false':
      return (
        <div className="space-y-4">
          {screen.title && <h2 className="text-2xl font-black text-foreground">{screen.title}</h2>}
          <TrueFalseChallenge
            statement={screen.statement}
            isTrue={screen.isTrue}
            explanation={screen.explanation}
            onWrongAnswer={onWrongAnswer}
          />
        </div>
      );

    case 'fill-blank':
      return (
        <div className="space-y-4">
          {screen.title && <h2 className="text-2xl font-black text-foreground">{screen.title}</h2>}
          <FillInBlank
            sentence={screen.sentence}
            options={screen.options}
            correctIndex={screen.correctIndex}
            explanation={screen.explanation}
            onWrongAnswer={onWrongAnswer}
          />
        </div>
      );

    case 'quiz': {
      const answered = quizAnswers[screen.id] !== undefined;
      const selected = quizAnswers[screen.id];
      return (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-foreground">{screen.question}</h2>
          <div className="space-y-2">
            {screen.options.map((opt, i) => {
              const isCorrect = i === screen.correctIndex;
              return (
                <button
                  key={i}
                  onClick={() => onQuizSelect(screen.id, i, screen.correctIndex)}
                  disabled={answered}
                  className={`w-full p-4 rounded-xl text-left border-2 font-medium transition-all ${
                    answered
                      ? isCorrect ? "border-primary bg-primary/10 text-primary" :
                        i === selected ? "border-destructive bg-destructive/10 text-destructive" :
                        "border-border opacity-40 text-muted-foreground"
                      : "border-border hover:border-primary bg-background text-foreground"
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
          {answered && (
            <motion.p
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-muted-foreground p-3 rounded-xl bg-muted/30"
            >
              💡 {screen.explanation}
            </motion.p>
          )}
        </div>
      );
    }

    case 'sort':
      return (
        <div className="space-y-3">
          <DragSortChallenge
            title={screen.title}
            description={screen.description || "Drag to reorder"}
            items={screen.items}
            correctOrder={screen.correctOrder}
          />
        </div>
      );

    case 'slider':
      return (
        <div className="space-y-3">
          {screen.body && <p className="text-muted-foreground text-sm">{screen.body}</p>}
          <SliderSimulator
            title={screen.title}
            description=""
            sliders={screen.sliders}
            calculateResult={screen.calculateResult}
          />
        </div>
      );

    case 'match':
      return (
        <div className="space-y-4">
          <h2 className="text-2xl font-black text-foreground">{screen.title}</h2>
          <p className="text-sm text-muted-foreground">Tap a term on the left, then its match on the right.</p>
          <MatchPairs pairs={screen.pairs} />
        </div>
      );

    case 'summary':
      return (
        <div className="space-y-4">
          <h2 className="text-2xl font-black text-foreground">{screen.title || "Key Takeaways"}</h2>
          <div className="space-y-2">
            {screen.takeaways.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.12 * i }}
                className="p-3 rounded-xl bg-primary/5 border border-primary/20"
              >
                ✅ {t}
              </motion.div>
            ))}
          </div>
          {screen.quote && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="p-5 rounded-xl bg-muted/30 border border-border mt-4"
            >
              <Quote className="w-6 h-6 text-muted-foreground/40 mb-2" />
              <p className="text-base italic text-foreground">"{screen.quote.text}"</p>
              <p className="text-sm text-muted-foreground mt-1">— {screen.quote.author}</p>
            </motion.div>
          )}
        </div>
      );
  }
}

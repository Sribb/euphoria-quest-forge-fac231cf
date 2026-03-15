import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ArrowRight, ArrowLeft, CheckCircle, BookOpen, Gamepad2, ClipboardCheck,
  GraduationCap, Sparkles, Quote, CheckCircle2, XCircle
} from "lucide-react";
import { SliderSimulator } from "../interactive/SliderSimulator";
import { DragSortChallenge } from "../interactive/DragSortChallenge";
import { AIFreeResponse } from "../interactive/AIFreeResponse";
import { LessonDefinition } from "../../data/lessonTypes";
import { playCorrect, playIncorrect, playNav } from "@/lib/soundEffects";
import { fireSmallConfetti } from "@/lib/confetti";

interface StandardLessonTemplateProps {
  lesson: LessonDefinition;
  lessonTitle: string;
  lessonId?: string;
  onComplete: () => void;
}

const SLIDE_LABELS = ["Intro", "Learn", "Practice", "Check", "Summary"];
const SLIDE_ICONS = [BookOpen, GraduationCap, Gamepad2, ClipboardCheck, Sparkles];

export const StandardLessonTemplate = ({ lesson, lessonTitle, lessonId, onComplete }: StandardLessonTemplateProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [interactiveComplete, setInteractiveComplete] = useState(false);
  const [checkComplete, setCheckComplete] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizRevealed, setQuizRevealed] = useState<Record<number, boolean>>({});

  const goNext = () => {
    playNav();
    if (currentSlide < 4) setCurrentSlide(currentSlide + 1);
    else onComplete();
  };

  const goBack = () => {
    if (currentSlide > 0) {
      playNav();
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleQuizAnswer = (qIdx: number, optIdx: number, correctIdx: number) => {
    if (quizRevealed[qIdx]) return;
    setQuizAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
    setQuizRevealed(prev => ({ ...prev, [qIdx]: true }));
    if (optIdx === correctIdx) {
      playCorrect();
      fireSmallConfetti();
    } else {
      playIncorrect();
    }
  };

  const slideVariants = {
    enter: { opacity: 0, x: 40 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
  };

  const canAdvance = () => {
    if (currentSlide === 2 && !interactiveComplete && lesson.interactive.type === 'drag-sort') return false;
    if (currentSlide === 3 && !checkComplete && lesson.check.type === 'quiz') {
      const qs = lesson.check.questions;
      return Object.keys(quizRevealed).length >= qs.length;
    }
    return true;
  };

  return (
    <div className="space-y-6">
      {/* Progress bar */}
      <div className="flex items-center gap-1">
        {SLIDE_LABELS.map((label, i) => {
          const Icon = SLIDE_ICONS[i];
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className={`h-1.5 w-full rounded-full transition-all duration-300 ${
                i === currentSlide ? "bg-primary" : i < currentSlide ? "bg-primary/40" : "bg-muted"
              }`} />
              <div className={`flex items-center gap-1 transition-colors ${
                i === currentSlide ? "text-primary" : "text-muted-foreground"
              }`}>
                <Icon className="w-3 h-3" />
                <span className="text-xs font-medium hidden sm:inline">{label}</span>
              </div>
            </div>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3 }}
        >
          {/* SLIDE 1: INTRO */}
          {currentSlide === 0 && (
            <Card className="p-8">
              <Badge className="mb-4 bg-primary/15 text-primary border-primary/30">
                <BookOpen className="w-3 h-3 mr-1" /> Introduction
              </Badge>
              <h2 className="text-3xl font-bold mb-3">{lessonTitle}</h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                {lesson.intro.description}
              </p>
              <div className="space-y-3 mb-6">
                <h3 className="font-semibold text-foreground">What you'll learn:</h3>
                {lesson.intro.points.map((point, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/40 border"
                  >
                    <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                    <span className="text-foreground">{point}</span>
                  </motion.div>
                ))}
              </div>
              <div className="flex justify-end">
                <Button onClick={goNext} size="lg" className="gap-2">
                  Let's Begin <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          )}

          {/* SLIDE 2: TEACH */}
          {currentSlide === 1 && (
            <Card className="p-8">
              <Badge className="mb-4 bg-blue-500/15 text-blue-500 border-blue-500/30">
                <GraduationCap className="w-3 h-3 mr-1" /> Core Concept
              </Badge>
              <h2 className="text-2xl font-bold mb-3">{lesson.teach.title}</h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                {lesson.teach.content}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {lesson.teach.cards.map((card, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.15 }}
                    className="p-5 rounded-xl bg-muted/40 border"
                  >
                    {/* icon intentionally hidden */}
                    <h3 className="font-bold text-foreground mb-1">{card.title}</h3>
                    <p className="text-sm text-muted-foreground">{card.description}</p>
                  </motion.div>
                ))}
              </div>
              <div className="flex justify-between">
                <Button variant="outline" onClick={goBack} className="gap-2">
                  <ArrowLeft className="w-4 h-4" /> Back
                </Button>
                <Button onClick={goNext} size="lg" className="gap-2">
                  Try It Out <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          )}

          {/* SLIDE 3: INTERACTIVE */}
          {currentSlide === 2 && (
            <Card className="p-8">
              <Badge className="mb-4 bg-amber-500/15 text-amber-500 border-amber-500/30">
                <Gamepad2 className="w-3 h-3 mr-1" /> Interactive Activity
              </Badge>

              {lesson.interactive.type === 'slider' && (
                <SliderSimulator
                  title={lesson.interactive.title}
                  description={lesson.interactive.description}
                  sliders={lesson.interactive.sliders}
                  calculateResult={lesson.interactive.calculateResult}
                />
              )}

              {lesson.interactive.type === 'drag-sort' && (
                <DragSortChallenge
                  title={lesson.interactive.title}
                  description={lesson.interactive.description}
                  items={lesson.interactive.items}
                  correctOrder={lesson.interactive.correctOrder}
                  onComplete={(correct) => {
                    setInteractiveComplete(true);
                  }}
                />
              )}

              {lesson.interactive.type === 'quiz' && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold">{lesson.interactive.title}</h3>
                  <p className="text-muted-foreground">{lesson.interactive.description}</p>
                  {lesson.interactive.questions.map((q, qIdx) => (
                    <Card key={qIdx} className="p-4 bg-muted/30">
                      <p className="font-medium mb-3">{q.question}</p>
                      <div className="space-y-2">
                        {q.options.map((opt, oIdx) => {
                          const answered = quizAnswers[100 + qIdx] !== undefined;
                          const selected = quizAnswers[100 + qIdx] === oIdx;
                          const isCorrect = oIdx === q.correctIndex;
                          return (
                            <button
                              key={oIdx}
                              onClick={() => {
                                if (!answered) {
                                  setQuizAnswers(p => ({ ...p, [100 + qIdx]: oIdx }));
                                  if (isCorrect) { playCorrect(); fireSmallConfetti(); }
                                  else playIncorrect();
                                }
                              }}
                              disabled={answered}
                              className={`w-full p-3 rounded-lg text-left border-2 transition-all ${
                                answered
                                  ? isCorrect ? "border-emerald-500 bg-emerald-500/10" : selected ? "border-destructive bg-destructive/10" : "border-border opacity-50"
                                  : "border-border hover:border-primary"
                              }`}
                            >
                              {opt}
                              {answered && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-500 inline ml-2" />}
                              {answered && selected && !isCorrect && <XCircle className="w-4 h-4 text-destructive inline ml-2" />}
                            </button>
                          );
                        })}
                        {quizAnswers[100 + qIdx] !== undefined && (
                          <p className="text-sm text-muted-foreground mt-2 pl-2">💡 {q.explanation}</p>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={goBack} className="gap-2">
                  <ArrowLeft className="w-4 h-4" /> Back
                </Button>
                <Button onClick={goNext} size="lg" className="gap-2">
                  Continue <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          )}

          {/* SLIDE 4: CHECK */}
          {currentSlide === 3 && (
            <Card className="p-8">
              <Badge className="mb-4 bg-purple-500/15 text-purple-500 border-purple-500/30">
                <ClipboardCheck className="w-3 h-3 mr-1" /> Knowledge Check
              </Badge>

              {lesson.check.type === 'quiz' && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold">Quick Check</h3>
                  {lesson.check.questions.map((q, qIdx) => (
                    <Card key={qIdx} className="p-4 bg-muted/30">
                      <p className="font-medium mb-3">{q.question}</p>
                      <div className="space-y-2">
                        {q.options.map((opt, oIdx) => {
                          const answered = quizRevealed[qIdx];
                          const selected = quizAnswers[qIdx] === oIdx;
                          const isCorrect = oIdx === q.correctIndex;
                          return (
                            <button
                              key={oIdx}
                              onClick={() => handleQuizAnswer(qIdx, oIdx, q.correctIndex)}
                              disabled={!!answered}
                              className={`w-full p-3 rounded-lg text-left border-2 transition-all ${
                                answered
                                  ? isCorrect ? "border-emerald-500 bg-emerald-500/10" : selected ? "border-destructive bg-destructive/10" : "border-border opacity-50"
                                  : "border-border hover:border-primary"
                              }`}
                            >
                              {opt}
                              {answered && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-500 inline ml-2" />}
                              {answered && selected && !isCorrect && <XCircle className="w-4 h-4 text-destructive inline ml-2" />}
                            </button>
                          );
                        })}
                        {quizRevealed[qIdx] && (
                          <p className="text-sm text-muted-foreground mt-2 pl-2">💡 {q.explanation}</p>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {lesson.check.type === 'frq' && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold">Free Response</h3>
                  <p className="text-muted-foreground">Answer in your own words. AI will grade your response.</p>
                  <AIFreeResponse
                    question={lesson.check.question}
                    context={lesson.check.context}
                    lessonId={lessonId}
                    rubricHints={lesson.check.rubricHints}
                    onGraded={(score) => setCheckComplete(true)}
                  />
                </div>
              )}

              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={goBack} className="gap-2">
                  <ArrowLeft className="w-4 h-4" /> Back
                </Button>
                <Button onClick={goNext} size="lg" className="gap-2">
                  View Summary <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          )}

          {/* SLIDE 5: SUMMARY */}
          {currentSlide === 4 && (
            <Card className="p-8">
              <Badge className="mb-4 bg-emerald-500/15 text-emerald-500 border-emerald-500/30">
                <Sparkles className="w-3 h-3 mr-1" /> Lesson Complete
              </Badge>
              <h2 className="text-2xl font-bold mb-6">Key Takeaways</h2>

              <div className="space-y-3 mb-8">
                {lesson.summary.points.map((point, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.15 }}
                    className="flex items-start gap-3 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20"
                  >
                    <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-foreground">{point}</span>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="p-6 rounded-xl bg-primary/5 border border-primary/20 mb-8"
              >
                <Quote className="w-8 h-8 text-primary/40 mb-2" />
                <p className="text-lg italic text-foreground leading-relaxed mb-2">
                  "{lesson.summary.quote.text}"
                </p>
                <p className="text-sm text-muted-foreground">— {lesson.summary.quote.author}</p>
              </motion.div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={goBack} className="gap-2">
                  <ArrowLeft className="w-4 h-4" /> Back
                </Button>
                <Button onClick={goNext} size="lg" className="gap-2 bg-emerald-600 hover:bg-emerald-700">
                  Complete Lesson <CheckCircle className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

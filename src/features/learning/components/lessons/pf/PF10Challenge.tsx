import { useState } from "react";
import { BeginnerLessonTemplate, LessonSlide } from "../BeginnerLessonTemplate";
import { playCorrect, playIncorrect } from "@/lib/soundEffects";
import { fireSmallConfetti } from "@/lib/confetti";

const QuizSlide = () => {
  const [selected, setSelected] = useState<Record<number, string>>({});
  const questions = [
    { q: "What is the 50/30/20 rule?", options: ["50% needs, 30% wants, 20% savings", "50% savings, 30% needs, 20% wants", "50% wants, 30% savings, 20% needs"], answer: "50% needs, 30% wants, 20% savings" },
    { q: "How many months should your emergency fund cover?", options: ["1 month", "3–6 months", "12+ months"], answer: "3–6 months" },
    { q: "What factor most affects your credit score?", options: ["Credit mix", "Payment history", "New credit inquiries"], answer: "Payment history" },
    { q: "Pre-tax 401(k) contributions...", options: ["Increase your taxable income", "Reduce your taxable income", "Have no tax effect"], answer: "Reduce your taxable income" },
  ];

  return (
    <div className="space-y-4">
      {questions.map((q, i) => (
        <div key={i} className="p-4 rounded-xl bg-muted/30 border border-border space-y-2">
          <p className="font-semibold text-sm">{q.q}</p>
          <div className="space-y-1">
            {q.options.map((opt) => {
              const isSelected = selected[i] === opt;
              const isCorrect = selected[i] && opt === q.answer;
              const isWrong = isSelected && opt !== q.answer;
              return (
                <button
                  key={opt}
                  onClick={() => {
                    if (selected[i]) return;
                    setSelected((p) => ({ ...p, [i]: opt }));
                    if (opt === q.answer) { playCorrect(); fireSmallConfetti(); } else { playIncorrect(); }
                  }}
                  className={`w-full text-left p-3 rounded-lg text-sm transition-colors ${
                    isCorrect ? "bg-primary/10 border border-primary/30" :
                    isWrong ? "bg-destructive/10 border border-destructive/30" :
                    "bg-background border border-border hover:bg-muted/50"
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export const PF10Challenge = ({ onComplete }: { onComplete: () => void }) => {
  const slides: LessonSlide[] = [
    {
      id: "intro",
      title: "Personal Finance Challenge",
      content: (
        <div className="space-y-4">
          <p>Let's test everything you've learned across all 9 personal finance lessons!</p>
          <p className="text-muted-foreground">Answer the questions on the next slide to complete the challenge.</p>
        </div>
      ),
    },
    { id: "quiz", title: "Test Your Knowledge", content: <QuizSlide /> },
    {
      id: "complete",
      title: "Challenge Complete! 🎉",
      content: (
        <div className="space-y-4">
          <p>You've completed the <strong>Personal Finance Foundations</strong> pathway!</p>
          <div className="space-y-2">
            <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">📊 Net worth & budgeting</div>
            <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">💰 Emergency funds & savings</div>
            <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">💳 Credit, debt & taxes</div>
            <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">🎯 Goal setting & lifestyle inflation</div>
          </div>
        </div>
      ),
    },
  ];

  return <BeginnerLessonTemplate slides={slides} onComplete={onComplete} />;
};

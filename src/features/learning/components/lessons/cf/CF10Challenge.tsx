import { useState } from "react";
import { BeginnerLessonTemplate, LessonSlide } from "../BeginnerLessonTemplate";
import { playCorrect, playIncorrect } from "@/lib/soundEffects";
import { fireSmallConfetti } from "@/lib/confetti";

const QuizSlide = () => {
  const [selected, setSelected] = useState<Record<number, string>>({});
  const questions = [
    { q: "What does the balance sheet equation state?", options: ["Assets = Liabilities + Equity", "Revenue = Expenses + Profit", "Cash = Income − Expenses"], answer: "Assets = Liabilities + Equity" },
    { q: "What does COGS stand for?", options: ["Cost of General Services", "Cost of Goods Sold", "Cash on Going Sales"], answer: "Cost of Goods Sold" },
    { q: "Which SEC filing is filed annually?", options: ["8-K", "10-Q", "10-K"], answer: "10-K" },
    { q: "Positive working capital means...", options: ["Company has more debt than assets", "Company can cover short-term obligations", "Company is unprofitable"], answer: "Company can cover short-term obligations" },
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
                <button key={opt} onClick={() => {
                  if (selected[i]) return;
                  setSelected((p) => ({ ...p, [i]: opt }));
                  if (opt === q.answer) { playCorrect(); fireSmallConfetti(); } else { playIncorrect(); }
                }} className={`w-full text-left p-3 rounded-lg text-sm transition-colors ${isCorrect ? "bg-primary/10 border border-primary/30" : isWrong ? "bg-destructive/10 border border-destructive/30" : "bg-background border border-border hover:bg-muted/50"}`}>
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

export const CF10Challenge = ({ onComplete }: { onComplete: () => void }) => {
  const slides: LessonSlide[] = [
    { id: "intro", title: "Corporate Finance Challenge", content: <p>Test your knowledge of corporate finance fundamentals!</p> },
    { id: "quiz", title: "Test Your Knowledge", content: <QuizSlide /> },
    {
      id: "complete", title: "Challenge Complete! 🎉", content: (
        <div className="space-y-3">
          <p>You've completed the <strong>Corporate Finance Foundations</strong>!</p>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">📊 Financial statements mastered</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">📈 Ratios & margins understood</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">📋 SEC filings decoded</div>
        </div>
      ),
    },
  ];

  return <BeginnerLessonTemplate slides={slides} onComplete={onComplete} />;
};

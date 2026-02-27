import { useState } from "react";
import { BeginnerLessonTemplate, LessonSlide } from "../BeginnerLessonTemplate";
import { playCorrect, playIncorrect } from "@/lib/soundEffects";
import { fireSmallConfetti } from "@/lib/confetti";

const QuizSlide = () => {
  const [selected, setSelected] = useState<Record<number, string>>({});
  const questions = [
    { q: "REITs must distribute what % of taxable income?", options: ["50%", "75%", "90%+"], answer: "90%+" },
    { q: "Gold is primarily used as a...", options: ["Growth investment", "Hedge / store of value", "Income generator"], answer: "Hedge / store of value" },
    { q: "What makes NFTs unique compared to Bitcoin?", options: ["They're cheaper", "Each one is one-of-a-kind", "They pay dividends"], answer: "Each one is one-of-a-kind" },
    { q: "What does ESG stand for?", options: ["Earnings, Sales, Growth", "Environmental, Social, Governance", "Equity, Stocks, Gold"], answer: "Environmental, Social, Governance" },
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

export const ALT10Challenge = ({ onComplete }: { onComplete: () => void }) => {
  const slides: LessonSlide[] = [
    { id: "intro", title: "Alternative Assets Challenge", content: <p>Test your knowledge of alternative investments!</p> },
    { id: "quiz", title: "Test Your Knowledge", content: <QuizSlide /> },
    { id: "complete", title: "Challenge Complete! 🎉", content: (
      <div className="space-y-3">
        <p>You've completed <strong>Alternative Assets Foundations</strong>!</p>
        <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">🏠 Real estate & REITs</div>
        <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">🥇 Gold, commodities & crypto</div>
        <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">🎨 Collectibles, NFTs & ESG</div>
      </div>
    )},
  ];
  return <BeginnerLessonTemplate slides={slides} onComplete={onComplete} />;
};

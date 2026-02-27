import { useState } from "react";
import { BeginnerLessonTemplate, LessonSlide } from "../BeginnerLessonTemplate";
import { playCorrect, playIncorrect } from "@/lib/soundEffects";
import { fireSmallConfetti } from "@/lib/confetti";

const QuizSlide = () => {
  const [selected, setSelected] = useState<Record<number, string>>({});
  const questions = [
    { q: "What does a long lower wick (hammer) suggest?", options: ["Continued selling", "Potential reversal up", "Market is closed"], answer: "Potential reversal up" },
    { q: "What is the 1-2% rule?", options: ["Invest 1-2% in crypto", "Risk 1-2% of account per trade", "Buy 1-2% below market price"], answer: "Risk 1-2% of account per trade" },
    { q: "A Golden Cross occurs when...", options: ["Short MA crosses above long MA", "Price hits all-time high", "Volume drops to zero"], answer: "Short MA crosses above long MA" },
    { q: "Why paper trade first?", options: ["To lose money safely", "To test strategies risk-free", "Because brokers require it"], answer: "To test strategies risk-free" },
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

export const TR10Challenge = ({ onComplete }: { onComplete: () => void }) => {
  const slides: LessonSlide[] = [
    { id: "intro", title: "Trading Challenge", content: <p>Test your trading knowledge from all 9 lessons!</p> },
    { id: "quiz", title: "Test Your Knowledge", content: <QuizSlide /> },
    { id: "complete", title: "Challenge Complete! 🎉", content: (
      <div className="space-y-3">
        <p>You've completed <strong>Trading & Technical Analysis Foundations</strong>!</p>
        <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">📊 Candlesticks & chart patterns</div>
        <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">📈 Indicators & volume analysis</div>
        <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">🛡️ Risk management & position sizing</div>
      </div>
    )},
  ];
  return <BeginnerLessonTemplate slides={slides} onComplete={onComplete} />;
};

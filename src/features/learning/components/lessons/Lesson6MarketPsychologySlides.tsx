import { useState } from "react";
import { motion } from "framer-motion";
import { Brain, TrendingUp, TrendingDown, AlertTriangle, Heart, CheckCircle2, XCircle, Sparkles } from "lucide-react";
import { BeginnerLessonTemplate, LessonSlide } from "./BeginnerLessonTemplate";
import { useXPSystem } from "@/hooks/useXPSystem";
import { playCorrect, playIncorrect } from "@/lib/soundEffects";
import { fireSmallConfetti } from "@/lib/confetti";
import { DragSortChallenge } from "../interactive/DragSortChallenge";

// Slide 1: Fear & Greed
const FearAndGreed = () => (
  <div className="space-y-6">
    <p className="text-lg text-muted-foreground leading-relaxed">
      Markets aren't driven by math alone — they're driven by <span className="text-primary font-bold">human emotions</span>. 
      Two emotions dominate: <span className="text-destructive font-semibold">fear</span> and <span className="text-primary font-semibold">greed</span>.
    </p>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
      <motion.div className="p-6 rounded-2xl bg-destructive/5 border border-destructive/20">
        <p className="text-3xl mb-2">😨</p>
        <h3 className="font-bold text-foreground mb-2">Fear</h3>
        <p className="text-sm text-muted-foreground">
          Market drops 20%. Headlines scream "CRASH!" Everyone sells in panic. 
          Prices fall even further. This is when smart investors <em>buy</em>.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-6 rounded-2xl bg-primary/5 border border-primary/20"
      >
        <p className="text-3xl mb-2">🤑</p>
        <h3 className="font-bold text-foreground mb-2">Greed</h3>
        <p className="text-sm text-muted-foreground">
          Market surges 50%. Your friend brags about doubling their money. 
          You pile in at the top. Then the bubble pops. This is when smart investors are <em>cautious</em>.
        </p>
      </motion.div>
    </div>

    <div className="p-4 rounded-xl bg-muted/50 border border-border mt-4">
      <p className="text-sm text-muted-foreground italic">
        "Be fearful when others are greedy, and greedy when others are fearful." — Warren Buffett
      </p>
    </div>
  </div>
);

// Slide 2: The Emotion Cycle
const EmotionCycle = () => (
  <div className="space-y-6">
    <p className="text-lg text-muted-foreground leading-relaxed">
      Markets go through predictable emotional cycles. Recognizing where you are helps you make better decisions.
    </p>

    <div className="space-y-3 mt-6">
      {[
        { phase: "😊 Optimism", desc: "Things look good. People start buying.", timing: "Early uptrend" },
        { phase: "🤩 Euphoria", desc: "'This time is different!' Everyone's a genius.", timing: "⚠️ Maximum risk" },
        { phase: "😟 Anxiety", desc: "First dip. 'It'll bounce back, right?'", timing: "Denial begins" },
        { phase: "😰 Panic", desc: "Selling everywhere. Headlines are terrifying.", timing: "Capitulation" },
        { phase: "😔 Depression", desc: "'I'm never investing again.'", timing: "🎯 Maximum opportunity" },
        { phase: "🌱 Hope", desc: "Quiet recovery. Smart money returns.", timing: "New cycle begins" },
      ].map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          className="flex items-center justify-between p-4 rounded-xl bg-muted/40 border border-border"
        >
          <div>
            <span className="font-bold text-foreground">{item.phase}</span>
            <p className="text-xs text-muted-foreground">{item.desc}</p>
          </div>
          <span className="text-xs font-medium text-muted-foreground">{item.timing}</span>
        </motion.div>
      ))}
    </div>
  </div>
);

// Slide 3: What Would You Do?
const WhatWouldYouDo = () => {
  const [scenario, setScenario] = useState(0);
  const [answered, setAnswered] = useState<boolean[]>([]);

  const scenarios = [
    {
      headline: "🚀 Stocks are up 40% this year! Everyone's buying!",
      options: [
        { text: "Buy more — don't miss out!", correct: false },
        { text: "Stay the course — don't chase hype", correct: true },
        { text: "Go all-in with savings", correct: false },
      ],
      feedback: "When everyone's euphoric, prices are likely overextended. Stay disciplined.",
    },
    {
      headline: "📉 Market crashes 30%. Your portfolio is deep in the red.",
      options: [
        { text: "Sell everything before it gets worse", correct: false },
        { text: "Hold and stick to your plan", correct: true },
        { text: "Panic and stop checking your account", correct: false },
      ],
      feedback: "Selling during a crash locks in losses. Markets have always recovered historically.",
    },
  ];

  const s = scenarios[scenario];

  const handleAnswer = (correct: boolean) => {
    if (answered[scenario] !== undefined) return;
    setAnswered(prev => { const n = [...prev]; n[scenario] = correct; return n; });
  };

  return (
    <div className="space-y-6">
      <p className="text-lg text-muted-foreground leading-relaxed">
        Let's test your emotional discipline:
      </p>

      <div className="p-5 rounded-2xl bg-muted/30 border border-border">
        <p className="font-bold text-foreground text-lg mb-4">{s.headline}</p>
        <div className="space-y-3">
          {s.options.map((opt, i) => (
            <motion.button
              key={i}
              onClick={() => handleAnswer(opt.correct)}
              disabled={answered[scenario] !== undefined}
              className={`w-full text-left p-4 rounded-xl border transition-all ${
                answered[scenario] !== undefined
                  ? opt.correct ? "border-primary bg-primary/10" : "border-border opacity-50"
                  : "border-border hover:border-primary/50 bg-background"
              }`}
            >
              <span className="text-sm font-medium">{opt.text}</span>
              {answered[scenario] !== undefined && opt.correct && (
                <CheckCircle2 className="w-4 h-4 text-primary inline ml-2" />
              )}
            </motion.button>
          ))}
        </div>

        {answered[scenario] !== undefined && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-muted-foreground mt-4 p-3 bg-primary/5 rounded-lg">
            💡 {s.feedback}
          </motion.p>
        )}
      </div>

      {scenario < scenarios.length - 1 && answered[scenario] !== undefined && (
        <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          onClick={() => setScenario(s => s + 1)}
          className="text-sm text-primary font-medium hover:underline">
          Next scenario →
        </motion.button>
      )}
    </div>
  );
};

// Slide 4: Drag Sort
const BiasRanking = () => (
  <div className="space-y-6">
    <p className="text-lg text-muted-foreground leading-relaxed">
      Rank these investor behaviors from most harmful to least harmful:
    </p>
    <DragSortChallenge
      title="🧠 Rank These Biases"
      description="Most harmful at TOP, least harmful at BOTTOM:"
      items={[
        { id: "panic", label: "😱 Panic selling during a crash" },
        { id: "fomo", label: "🤩 FOMO buying at all-time highs" },
        { id: "checking", label: "📱 Checking portfolio daily" },
        { id: "patience", label: "⏳ Being impatient after 1 month" },
      ]}
      correctOrder={["panic", "fomo", "checking", "patience"]}
    />
  </div>
);

// Slide 5: Key Takeaways
const KeyTakeaways = () => {
  const takeaways = [
    { icon: <Brain className="w-5 h-5" />, text: "Markets are driven by fear and greed — recognize these emotions" },
    { icon: <AlertTriangle className="w-5 h-5" />, text: "When everyone's euphoric, be cautious. When everyone's panicking, look for opportunities" },
    { icon: <Heart className="w-5 h-5" />, text: "Your biggest enemy in investing is your own emotions" },
    { icon: <Sparkles className="w-5 h-5" />, text: "Having a plan and sticking to it beats reacting to headlines" },
  ];

  return (
    <div className="space-y-6">
      <p className="text-lg text-muted-foreground leading-relaxed">Mastering your emotions is the real edge in investing:</p>
      <div className="space-y-3 mt-6">
        {takeaways.map((item, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15 }}
            className="flex items-start gap-4 p-4 rounded-xl bg-muted/40 border border-border">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">{item.icon}</div>
            <p className="text-foreground font-medium leading-relaxed pt-1.5">{item.text}</p>
          </motion.div>
        ))}
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
        className="p-5 rounded-2xl bg-primary/5 border border-primary/20 text-center mt-6">
        <p className="text-xl font-bold text-foreground mb-1">Emotional mastery unlocked! 🧠</p>
        <p className="text-sm text-muted-foreground">Next: learning to find undervalued companies.</p>
      </motion.div>
    </div>
  );
};

interface Lesson6Props {
  onComplete?: () => void;
}

export const Lesson6MarketPsychologySlides = ({ onComplete }: Lesson6Props) => {
  const slides: LessonSlide[] = [
    { id: "fear-greed", title: "Fear & Greed", content: <FearAndGreed /> },
    { id: "emotion-cycle", title: "The Emotion Cycle", content: <EmotionCycle /> },
    { id: "scenarios", title: "What Would You Do? 🤔", content: <WhatWouldYouDo /> },
    { id: "bias-ranking", title: "Rank the Biases 🧩", content: <BiasRanking /> },
    { id: "takeaways", title: "Key Takeaways", content: <KeyTakeaways /> },
  ];

  return <BeginnerLessonTemplate slides={slides} onComplete={onComplete || (() => {})} />;
};

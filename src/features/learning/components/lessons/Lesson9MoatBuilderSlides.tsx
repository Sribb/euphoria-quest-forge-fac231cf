import { useState } from "react";
import { motion } from "framer-motion";
import { Castle, Crown, Network, Lock, DollarSign, CheckCircle2, XCircle, Sparkles, Zap } from "lucide-react";
import { BeginnerLessonTemplate, LessonSlide } from "./BeginnerLessonTemplate";
import { useXPSystem } from "@/hooks/useXPSystem";
import { playCorrect, playIncorrect } from "@/lib/soundEffects";
import { fireSmallConfetti } from "@/lib/confetti";
import { DragSortChallenge } from "../interactive/DragSortChallenge";

// Slide 1: What is a Moat?
const WhatIsAMoat = () => (
  <div className="space-y-6">
    <p className="text-lg text-muted-foreground leading-relaxed">
      Medieval castles had <span className="text-primary font-bold">moats</span> — water-filled ditches that kept enemies out. 
      Great companies have moats too — advantages that protect their profits from competitors.
    </p>

    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-6 rounded-2xl bg-primary/5 border border-primary/20 text-center"
    >
      <p className="text-4xl mb-3">🏰</p>
      <p className="text-lg font-bold text-foreground mb-2">A company with a moat can:</p>
      <div className="space-y-2">
        {["Charge higher prices without losing customers", "Keep competitors from stealing market share", "Maintain high profits for years or decades"].map((text, i) => (
          <motion.p key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + i * 0.2 }}
            className="text-sm text-muted-foreground">✅ {text}</motion.p>
        ))}
      </div>
    </motion.div>

    <div className="p-4 rounded-xl bg-muted/50 border border-border">
      <p className="text-sm text-muted-foreground italic">
        "In business, I look for economic castles protected by unbreachable moats." — Warren Buffett
      </p>
    </div>
  </div>
);

// Slide 2: Types of Moats
const TypesOfMoats = () => (
  <div className="space-y-6">
    <p className="text-lg text-muted-foreground leading-relaxed">
      There are 5 main types of competitive moats:
    </p>

    <div className="space-y-3 mt-6">
      {[
        { emoji: "👑", name: "Brand Power", desc: "People pay more just for the name", examples: "Apple, Nike, Coca-Cola" },
        { emoji: "🌐", name: "Network Effects", desc: "More users = more value for everyone", examples: "Instagram, Visa, Uber" },
        { emoji: "🔒", name: "Switching Costs", desc: "Too expensive/painful to change", examples: "Microsoft, Salesforce" },
        { emoji: "💰", name: "Cost Advantage", desc: "Can produce cheaper than anyone", examples: "Walmart, Costco, Amazon" },
        { emoji: "⚡", name: "Patents & Licenses", desc: "Legal protection from copycats", examples: "Pfizer, Disney, Qualcomm" },
      ].map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          className="flex items-center gap-4 p-4 rounded-xl bg-muted/40 border border-border"
        >
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-bold text-foreground">{item.name}</h3>
            <p className="text-sm text-muted-foreground">{item.desc}</p>
          </div>
          <span className="text-xs text-muted-foreground hidden md:block">{item.examples}</span>
        </motion.div>
      ))}
    </div>
  </div>
);

// Slide 3: Match the Moat
const MatchTheMoat = () => {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);

  const challenges = [
    {
      company: "Instagram",
      desc: "A social app where value increases as more friends join",
      options: [
        { text: "Brand Power", correct: false },
        { text: "Network Effects", correct: true },
        { text: "Cost Advantage", correct: false },
      ],
      feedback: "More users → more content → more value. Classic network effect!",
    },
    {
      company: "Coca-Cola",
      desc: "People choose it over cheaper alternatives purely by name",
      options: [
        { text: "Brand Power", correct: true },
        { text: "Switching Costs", correct: false },
        { text: "Patents", correct: false },
      ],
      feedback: "Coca-Cola's brand is so strong people pay 3x the cost of generic cola!",
    },
    {
      company: "Microsoft Office",
      desc: "Businesses have spent years training employees on it",
      options: [
        { text: "Network Effects", correct: false },
        { text: "Cost Advantage", correct: false },
        { text: "Switching Costs", correct: true },
      ],
      feedback: "Retraining an entire company on new software? Too expensive. That's the moat.",
    },
  ];

  const c = challenges[current];

  return (
    <div className="space-y-6">
      <p className="text-lg text-muted-foreground leading-relaxed">
        Match each company to its strongest moat:
      </p>

      <div className="p-5 rounded-2xl bg-muted/30 border border-border">
        <div className="mb-4">
          <p className="text-xs text-muted-foreground mb-1">Company {current + 1} of {challenges.length}</p>
          <h3 className="font-bold text-foreground text-lg">{c.company}</h3>
          <p className="text-sm text-muted-foreground">{c.desc}</p>
        </div>

        <div className="space-y-3">
          {c.options.map((opt, i) => (
            <motion.button
              key={i}
              onClick={() => {
                if (answers[current] !== undefined) return;
                setAnswers(prev => { const n = [...prev]; n[current] = opt.correct; return n; });
                if (opt.correct) { playCorrect(); fireSmallConfetti(); }
                else { playIncorrect(); }
              }}
              disabled={answers[current] !== undefined}
              className={`w-full text-left p-4 rounded-xl border transition-all ${
                answers[current] !== undefined
                  ? opt.correct ? "border-primary bg-primary/10" : "border-border opacity-50"
                  : "border-border hover:border-primary/50 bg-background"
              }`}
            >
              {opt.text}
              {answers[current] !== undefined && opt.correct && <CheckCircle2 className="w-4 h-4 text-primary inline ml-2" />}
            </motion.button>
          ))}
        </div>

        {answers[current] !== undefined && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-muted-foreground mt-4 p-3 bg-primary/5 rounded-lg">
            💡 {c.feedback}
          </motion.p>
        )}
      </div>

      {current < challenges.length - 1 && answers[current] !== undefined && (
        <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          onClick={() => setCurrent(c => c + 1)}
          className="text-sm text-primary font-medium hover:underline">
          Next company →
        </motion.button>
      )}
    </div>
  );
};

// Slide 4: Drag Sort
const MoatStrength = () => (
  <div className="space-y-6">
    <p className="text-lg text-muted-foreground leading-relaxed">
      Rank these moats by how long they typically last:
    </p>
    <DragSortChallenge
      title="🏰 Rank Moat Durability"
      description="Shortest-lasting at TOP, longest-lasting at BOTTOM:"
      items={[
        { id: "cost", label: "💰 Cost Advantage" },
        { id: "patent", label: "⚡ Patents (they expire!)" },
        { id: "brand", label: "👑 Brand Power" },
        { id: "network", label: "🌐 Network Effects" },
      ]}
      correctOrder={["patent", "cost", "brand", "network"]}
    />
  </div>
);

// Slide 5: Takeaways
const KeyTakeaways = () => {
  const takeaways = [
    { icon: <Castle className="w-5 h-5" />, text: "A moat is a competitive advantage that protects profits" },
    { icon: <Crown className="w-5 h-5" />, text: "5 types: brand, network effects, switching costs, cost advantage, patents" },
    { icon: <Network className="w-5 h-5" />, text: "Companies with wide moats tend to be great long-term investments" },
    { icon: <Sparkles className="w-5 h-5" />, text: "Always ask: 'What stops a competitor from doing the same thing?'" },
  ];

  return (
    <div className="space-y-6">
      <p className="text-lg text-muted-foreground leading-relaxed">You can now spot competitive advantages:</p>
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
        <p className="text-xl font-bold text-foreground mb-1">Moat master! 🏰</p>
        <p className="text-sm text-muted-foreground">Next: stress-testing your portfolio.</p>
      </motion.div>
    </div>
  );
};

interface Lesson9Props {
  onComplete?: () => void;
}

export const Lesson9MoatBuilderSlides = ({ onComplete }: Lesson9Props) => {
  const slides: LessonSlide[] = [
    { id: "what-is-moat", title: "What is a Moat?", content: <WhatIsAMoat /> },
    { id: "types", title: "5 Types of Moats", content: <TypesOfMoats /> },
    { id: "match", title: "Match the Moat 🎯", content: <MatchTheMoat /> },
    { id: "rank", title: "Rank the Moats 🧩", content: <MoatStrength /> },
    { id: "takeaways", title: "Key Takeaways", content: <KeyTakeaways /> },
  ];

  return <BeginnerLessonTemplate slides={slides} onComplete={onComplete || (() => {})} />;
};

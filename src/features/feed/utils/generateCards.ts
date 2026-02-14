import type { FeedCardData, CardType } from "../components/FeedCard";

interface LessonData {
  id: string;
  title: string;
  description: string;
  pathway: string | null;
  difficulty: string;
  order_index: number;
}

const PATHWAY_LABELS: Record<string, string> = {
  investing: "Investing Fundamentals",
  "corporate-finance": "Corporate Finance",
  "personal-finance": "Personal Finance",
  trading: "Trading & Technical Analysis",
  "alternative-assets": "Alternative Assets",
};

// Rich visual factoids/hooks per card type
const factTemplates: {
  type: CardType;
  weight: number;
  generate: (lesson: LessonData) => Omit<FeedCardData, "id" | "type" | "lessonTitle" | "pathway" | "difficulty" | "xpReward">;
}[] = [
  {
    type: "fact",
    weight: 5,
    generate: (lesson) => {
      const facts = [
        { hook: "Most people don't know this…", body: `${lesson.title} is one of the most misunderstood concepts in finance. Here's the truth that Wall Street doesn't advertise.`, stat: lesson.title, statLabel: "Key Concept" },
        { hook: "This changes everything 🤯", body: `Understanding ${lesson.title.toLowerCase()} could be the difference between retiring at 50 vs 70. The math is wild.`, stat: "10x", statLabel: "Potential Impact" },
        { hook: "The 1% know this secret", body: `${lesson.title} isn't just theory — it's how the ultra-wealthy actually build and protect their money.`, stat: "$$$", statLabel: "Wealth Builder" },
        { hook: "Stop scrolling. Read this.", body: `If you don't understand ${lesson.title.toLowerCase()}, you're literally leaving money on the table every single day.`, stat: "24/7", statLabel: "Always Matters" },
        { hook: "Your future self will thank you", body: `${lesson.description} Master this and you're ahead of 90% of people your age.`, stat: "90%", statLabel: "Ahead of" },
      ];
      const f = facts[Math.floor(Math.random() * facts.length)];
      return { title: f.hook, content: f.body, stat: f.stat, statLabel: f.statLabel };
    },
  },
  {
    type: "stat",
    weight: 4,
    generate: (lesson) => {
      const stats = [
        { title: "Did you know? 📊", content: `Only 33% of adults can correctly explain ${lesson.title.toLowerCase()}. That's your edge.`, stat: "33%", statLabel: "Financial Literacy" },
        { title: "By the numbers 🔢", content: `People who understand ${lesson.title.toLowerCase()} earn 25% more over their lifetime. Knowledge literally pays.`, stat: "+25%", statLabel: "Lifetime Earnings" },
        { title: "The data is clear 📈", content: `${lesson.description} Studies show mastering this concept correlates with 3x better financial outcomes.`, stat: "3x", statLabel: "Better Outcomes" },
        { title: "Real talk 💰", content: `The average person loses $1,000+/year by not understanding ${lesson.title.toLowerCase()}. Don't be average.`, stat: "$1K+", statLabel: "Annual Loss" },
      ];
      const s = stats[Math.floor(Math.random() * stats.length)];
      return { title: s.title, content: s.content, stat: s.stat, statLabel: s.statLabel };
    },
  },
  {
    type: "story",
    weight: 3,
    generate: (lesson) => {
      const stories = [
        { title: "A $10K mistake 😬", content: `Sarah ignored ${lesson.title.toLowerCase()} and lost $10,000 in 6 months. Here's what she should have done differently — and what you can learn from it.`, stat: "-$10K", statLabel: "Her Loss" },
        { title: "From $500 to $50K 🚀", content: `Jake learned ${lesson.title.toLowerCase()} at 22. By 30, his $500 investment grew to $50,000. The strategy? Exactly what this lesson teaches.`, stat: "100x", statLabel: "His Return" },
        { title: "The Warren Buffett rule", content: `"${lesson.title} is the most important thing an investor can learn." Here's why the Oracle of Omaha swears by it.`, stat: "Rule #1", statLabel: "Buffett Says" },
      ];
      const s = stories[Math.floor(Math.random() * stories.length)];
      return { title: s.title, content: s.content, stat: s.stat, statLabel: s.statLabel };
    },
  },
  {
    type: "myth",
    weight: 3,
    generate: (lesson) => {
      const myths = [
        { title: "MYTH vs FACT ❌✅", content: `"You need to be rich to benefit from ${lesson.title.toLowerCase()}" — WRONG. This applies at every income level. Here's why…`, stat: "BUSTED", statLabel: "Myth Status" },
        { title: "Everyone gets this wrong", content: `The #1 misconception about ${lesson.title.toLowerCase()} costs beginners thousands. Let's debunk it right now.`, stat: "#1", statLabel: "Top Myth" },
        { title: "Your teacher lied 🎓", content: `School never taught you ${lesson.title.toLowerCase()} properly. Here's what they missed — and why it matters for your wallet.`, stat: "0%", statLabel: "Taught in School" },
      ];
      const m = myths[Math.floor(Math.random() * myths.length)];
      return { title: m.title, content: m.content, stat: m.stat, statLabel: m.statLabel };
    },
  },
  {
    type: "tip",
    weight: 4,
    generate: (lesson) => {
      const tips = [
        { title: "Pro tip you NEED 💎", content: `Apply ${lesson.title.toLowerCase()} like this: start small, stay consistent, and let time do the heavy lifting. That's literally it.`, stat: "💎", statLabel: "Golden Rule" },
        { title: "1-minute money hack", content: `Here's how to use ${lesson.title.toLowerCase()} starting TODAY with zero extra effort. Save this for later.`, stat: "1 min", statLabel: "Time Needed" },
        { title: "Save this 📌", content: `${lesson.description} The actionable takeaway? Start applying this concept with your very next financial decision.`, stat: "NOW", statLabel: "Start When" },
      ];
      const t = tips[Math.floor(Math.random() * tips.length)];
      return { title: t.title, content: t.content, stat: t.stat, statLabel: t.statLabel };
    },
  },
];

export function generateFeedCards(lessons: LessonData[], count: number = 20): FeedCardData[] {
  const cards: FeedCardData[] = [];
  const weightedTypes: typeof factTemplates = [];
  factTemplates.forEach((t) => {
    for (let i = 0; i < t.weight; i++) weightedTypes.push(t);
  });

  for (let i = 0; i < count; i++) {
    const lesson = lessons[i % lessons.length];
    const template = weightedTypes[Math.floor(Math.random() * weightedTypes.length)];
    const generated = template.generate(lesson);

    cards.push({
      id: `card-${i}-${lesson.id}`,
      type: template.type,
      lessonTitle: lesson.title,
      pathway: PATHWAY_LABELS[lesson.pathway || "investing"] || "Finance",
      difficulty: lesson.difficulty as FeedCardData["difficulty"],
      xpReward: 10,
      ...generated,
    });
  }

  return cards;
}

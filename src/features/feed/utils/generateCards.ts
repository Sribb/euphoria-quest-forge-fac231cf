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
  investing: "Investing",
  "corporate-finance": "Corp Finance",
  "personal-finance": "Personal Finance",
  trading: "Trading",
  "alternative-assets": "Alt Assets",
};

// Pattern-interrupt content pools
const MONEY_MYTHS = [
  { title: "💰 Money Myth", headline: "\"You need money to make money\"", reality: "The S&P 500 has returned ~10% annually. $50/month invested at 22 becomes $350K+ by 65. Starting small beats waiting to be rich.", stat: "$50/mo → $350K+" },
  { title: "💰 Money Myth", headline: "\"Renting is throwing money away\"", reality: "The average homeowner spends 30% of their home's value on maintenance over 30 years. Renting + investing the difference often wins.", stat: "30% hidden costs" },
  { title: "💰 Money Myth", headline: "\"Cash is safe\"", reality: "Inflation averages 3.2% annually. $10,000 in cash loses $320/year in purchasing power. 'Safe' is the most dangerous strategy.", stat: "-$320/yr lost" },
  { title: "💰 Money Myth", headline: "\"More risk = more reward\"", reality: "Diversified portfolios with moderate risk have beaten aggressive single-stock bets 73% of the time over 20-year periods.", stat: "73% win rate" },
  { title: "💰 Money Myth", headline: "\"You need a financial advisor\"", reality: "Index funds outperform 85% of actively managed funds over 15 years. The best advisor might be a $0 fee Vanguard account.", stat: "85% beaten" },
];

const REALITY_SHOCKS = [
  { title: "⚡ Reality Shock", headline: "The Latte Math is Wrong", reality: "Cutting $5 lattes saves $1,825/yr. But negotiating ONE salary raise of 5% on $60K = $3,000/yr. Focus on income, not pennies.", stat: "$3K > $1.8K" },
  { title: "⚡ Reality Shock", headline: "College Doesn't Pay Like It Used To", reality: "Average student debt is $37,338. Average starting salary hasn't kept pace with inflation since 2008. ROI is dropping fast.", stat: "$37K avg debt" },
  { title: "⚡ Reality Shock", headline: "Most Millionaires Are Boring", reality: "79% of millionaires never inherited a dime. The average millionaire drives a used car and lives below their means.", stat: "79% self-made" },
  { title: "⚡ Reality Shock", headline: "You're Already Behind", reality: "By 30, the median American has saved $20,000. The target should be 1x annual salary. The gap is growing every year.", stat: "1x salary by 30" },
  { title: "⚡ Reality Shock", headline: "Crypto Isn't What You Think", reality: "95% of day traders lose money. The median crypto investor has lost money since 2021. Long-term indexing still wins.", stat: "95% lose" },
];

const RARE_INSIGHTS = [
  { title: "🔮 Rare Insight", headline: "The 72 Rule is Magic", reality: "Divide 72 by your return rate to find doubling time. At 8% returns, your money doubles every 9 years. $10K → $80K in 27 years.", stat: "72 ÷ rate = years" },
  { title: "🔮 Rare Insight", headline: "Tax-Loss Harvesting is Free Money", reality: "Selling losers to offset winners can save $3,000+ in taxes annually. Most people leave this on the table.", stat: "$3K+ saved/yr" },
  { title: "🔮 Rare Insight", headline: "The First $100K is the Hardest", reality: "Charlie Munger's famous insight: the first $100K takes the longest. After that, compounding does the heavy lifting for you.", stat: "Exponential growth" },
  { title: "🔮 Rare Insight", headline: "Dollar-Cost Averaging Beats Timing", reality: "Lump-sum beats DCA 68% of the time, but DCA reduces regret risk by 90%. Psychology matters more than math.", stat: "90% less regret" },
  { title: "🔮 Rare Insight", headline: "Your Biggest Asset Isn't Money", reality: "Human capital (your earning potential) dwarfs financial capital until ~45. Invest in skills, not just stocks, in your 20s-30s.", stat: "Skills > Stocks" },
];

const SLIDER_CARDS = [
  { title: "How much should you save?", question: "What % of income should go to savings?", answer: 20, unit: "%", min: 0, max: 50, explanation: "The 50/30/20 rule suggests 20% minimum. Top wealth builders save 30-50%." },
  { title: "Emergency Fund Check", question: "How many months of expenses should you keep liquid?", answer: 6, unit: " months", min: 1, max: 12, explanation: "3-6 months is standard. Self-employed? Aim for 9-12 months." },
  { title: "Retirement Age Reality", question: "At what age can most Americans comfortably retire?", answer: 67, unit: "", min: 45, max: 80, explanation: "Social Security full benefits start at 67. But with aggressive saving, FIRE at 45-55 is possible." },
  { title: "Inflation Impact", question: "How much purchasing power does $100 lose in 10 years?", answer: 26, unit: "%", min: 0, max: 50, explanation: "At 3% inflation, $100 becomes worth $74 in a decade. Your money shrinks while sitting still." },
];

const POLL_CARDS = [
  { question: "Which would you choose?", options: ["$1M now", "$50K/year forever"], insight: "At a 5% return, $1M generates $50K/year AND you keep the principal. Math favors the lump sum." },
  { question: "What scares you most?", options: ["Market crash", "Inflation", "Missing out", "Not saving enough"], insight: "Statistically, not investing is riskier than any market crash. Time in market > timing the market." },
  { question: "Best first investment?", options: ["Index fund", "Individual stock", "Crypto", "Real estate"], insight: "Index funds have the highest risk-adjusted returns for beginners. Start simple, diversify later." },
  { question: "How do you feel about debt?", options: ["All bad", "Some is good", "Leverage it", "Avoid at all costs"], insight: "Strategic debt (mortgage, business loans) at low rates can accelerate wealth. Consumer debt destroys it." },
];

const COUNTER_FACTS = [
  { headline: "While you read this...", countFrom: 0, countTo: 847, suffix: " trades", duration: 3, subtext: "were executed on the NYSE", context: "The NYSE processes ~6 billion shares daily" },
  { headline: "Every second...", countFrom: 0, countTo: 31688, suffix: "$", prefix: "$", duration: 4, subtext: "in interest accrues on US national debt", context: "That's $2.7 billion per day in interest alone" },
  { headline: "Since you opened this app...", countFrom: 0, countTo: 190, suffix: " people", duration: 3, subtext: "became new millionaires worldwide", context: "~1,700 new millionaires are created daily" },
  { headline: "In the time it takes to scroll...", countFrom: 0, countTo: 42000, suffix: "", prefix: "$", duration: 3, subtext: "changes hands in crypto markets", context: "Crypto trades $100B+ daily across exchanges" },
];

type PatternInterruptType = "myth" | "shock" | "insight" | "slider" | "poll" | "counter";

const allCardTypes: CardType[] = ["concept", "quiz", "case-study", "simulation"];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateStandardCard(lesson: LessonData, idx: number): FeedCardData {
  const type = allCardTypes[Math.floor(Math.random() * allCardTypes.length)];
  const pathway = PATHWAY_LABELS[lesson.pathway || "investing"] || "Finance";
  const difficulty = lesson.difficulty as FeedCardData["difficulty"];

  if (type === "concept") {
    return {
      id: `card-${idx}-${lesson.id}`,
      type: "concept",
      lessonTitle: lesson.title,
      pathway,
      difficulty,
      xpReward: 10,
      title: lesson.title,
      content: lesson.description,
      insight: `Understanding ${lesson.title.toLowerCase()} is essential for ${pathway.toLowerCase()} mastery.`,
    };
  }

  if (type === "quiz") {
    return {
      id: `card-${idx}-${lesson.id}`,
      type: "quiz",
      lessonTitle: lesson.title,
      pathway,
      difficulty,
      xpReward: 15,
      title: `Quick Check: ${lesson.title}`,
      content: `Which statement best describes ${lesson.title.toLowerCase()}?`,
      options: [
        { text: `A core concept that builds wealth over time`, correct: true, explanation: "This captures the essence." },
        { text: "Something only professionals need", correct: false, explanation: "This applies to everyone." },
        { text: "An outdated financial concept", correct: false, explanation: "Still highly relevant today." },
        { text: "Only useful during bull markets", correct: false, explanation: "Applies in all market conditions." },
      ],
    };
  }

  if (type === "simulation") {
    return {
      id: `card-${idx}-${lesson.id}`,
      type: "simulation",
      lessonTitle: lesson.title,
      pathway,
      difficulty,
      xpReward: 20,
      title: `Scenario: ${lesson.title}`,
      content: `The market shifts. Your knowledge of ${lesson.title.toLowerCase()} is tested. Quick — what do you do?`,
      options: [
        { text: "Apply the core principle", correct: true },
        { text: "Panic and sell everything", correct: false },
        { text: "Wait and do nothing", correct: false, explanation: "Inaction can be costly." },
      ],
      scenarioOutcome: `Applying ${lesson.title.toLowerCase()} principles protects your portfolio.`,
    };
  }

  // case-study
  return {
    id: `card-${idx}-${lesson.id}`,
    type: "case-study",
    lessonTitle: lesson.title,
    pathway,
    difficulty,
    xpReward: 20,
    title: `Real-World: ${lesson.title}`,
    content: `A client needs advice on ${lesson.title.toLowerCase()}. What's your approach?`,
    options: [
      { text: "Start with fundamentals, build gradually", correct: true, explanation: "Strong foundation = lasting understanding." },
      { text: "Jump to advanced strategies", correct: false, explanation: "Without basics, advanced strategies backfire." },
      { text: "Ignore it", correct: false, explanation: `${lesson.title} is critical.` },
    ],
  };
}

function generatePatternInterrupt(idx: number, usedIndices: Set<string>): FeedCardData {
  const interruptTypes: PatternInterruptType[] = ["myth", "shock", "insight", "slider", "poll", "counter"];
  const type = pickRandom(interruptTypes);

  if (type === "myth") {
    const myth = pickRandom(MONEY_MYTHS);
    return {
      id: `interrupt-myth-${idx}`,
      type: "myth",
      lessonTitle: myth.title,
      pathway: "💰 Money Myth",
      difficulty: "intermediate",
      xpReward: 25,
      title: myth.headline,
      content: myth.reality,
      insight: myth.stat,
    };
  }

  if (type === "shock") {
    const shock = pickRandom(REALITY_SHOCKS);
    return {
      id: `interrupt-shock-${idx}`,
      type: "shock",
      lessonTitle: shock.title,
      pathway: "⚡ Reality Shock",
      difficulty: "intermediate",
      xpReward: 25,
      title: shock.headline,
      content: shock.reality,
      insight: shock.stat,
    };
  }

  if (type === "insight") {
    const ins = pickRandom(RARE_INSIGHTS);
    return {
      id: `interrupt-insight-${idx}`,
      type: "rare-insight",
      lessonTitle: ins.title,
      pathway: "🔮 Rare Insight",
      difficulty: "advanced",
      xpReward: 30,
      title: ins.headline,
      content: ins.reality,
      insight: ins.stat,
    };
  }

  if (type === "slider") {
    const slider = pickRandom(SLIDER_CARDS);
    return {
      id: `interrupt-slider-${idx}`,
      type: "slider",
      lessonTitle: "Interactive",
      pathway: "🎚️ Guess & Learn",
      difficulty: "beginner",
      xpReward: 20,
      title: slider.title,
      content: slider.question,
      sliderConfig: { answer: slider.answer, unit: slider.unit, min: slider.min, max: slider.max, explanation: slider.explanation },
    };
  }

  if (type === "poll") {
    const poll = pickRandom(POLL_CARDS);
    return {
      id: `interrupt-poll-${idx}`,
      type: "poll",
      lessonTitle: "Quick Poll",
      pathway: "📊 Community Poll",
      difficulty: "beginner",
      xpReward: 10,
      title: poll.question,
      content: poll.insight,
      options: poll.options.map((o, i) => ({ text: o, correct: i === 0 })),
    };
  }

  // counter
  const counter = pickRandom(COUNTER_FACTS);
  return {
    id: `interrupt-counter-${idx}`,
    type: "counter",
    lessonTitle: "Live Stat",
    pathway: "📈 Real-Time",
    difficulty: "beginner",
    xpReward: 15,
    title: counter.headline,
    content: counter.subtext,
    counterConfig: { from: counter.countFrom, to: counter.countTo, suffix: counter.suffix, prefix: counter.prefix || "", duration: counter.duration, context: counter.context },
  };
}

export function generateFeedCards(lessons: LessonData[], count: number = 30): FeedCardData[] {
  const cards: FeedCardData[] = [];
  const usedIndices = new Set<string>();
  let sinceLastInterrupt = 0;
  const interruptInterval = () => 4 + Math.floor(Math.random() * 3); // 4-6
  let nextInterrupt = interruptInterval();

  for (let i = 0; i < count; i++) {
    sinceLastInterrupt++;

    if (sinceLastInterrupt >= nextInterrupt) {
      cards.push(generatePatternInterrupt(i, usedIndices));
      sinceLastInterrupt = 0;
      nextInterrupt = interruptInterval();
      continue;
    }

    const lesson = lessons[i % lessons.length];
    cards.push(generateStandardCard(lesson, i));
  }

  return cards;
}

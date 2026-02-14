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

const cardTemplates: {
  type: CardType;
  weight: number;
  generate: (lesson: LessonData, idx: number) => Partial<FeedCardData>;
}[] = [
  {
    type: "concept",
    weight: 3,
    generate: (lesson) => ({
      title: lesson.title,
      content: lesson.description,
      insight: `Understanding ${lesson.title.toLowerCase()} is essential for building a strong foundation in ${PATHWAY_LABELS[lesson.pathway || "investing"]?.toLowerCase() || "finance"}.`,
    }),
  },
  {
    type: "quiz",
    weight: 4,
    generate: (lesson) => {
      const quizSets = getQuizForLesson(lesson);
      return quizSets;
    },
  },
  {
    type: "case-study",
    weight: 2,
    generate: (lesson) => ({
      title: `Real-World: ${lesson.title}`,
      content: `Imagine you're advising a client who needs to understand ${lesson.title.toLowerCase()}. They've asked you to explain why this matters for their financial future and what action steps they should take.`,
      options: [
        { text: "Start with the fundamentals and build up gradually", correct: true, explanation: "A strong foundation ensures lasting understanding." },
        { text: "Jump straight to advanced strategies", correct: false, explanation: "Without basics, advanced strategies often backfire." },
        { text: "Ignore it — it's not important", correct: false, explanation: `${lesson.title} is a critical concept in finance.` },
      ],
    }),
  },
  {
    type: "simulation",
    weight: 2,
    generate: (lesson) => ({
      title: `Scenario: ${lesson.title}`,
      content: `The market just shifted and your knowledge of ${lesson.title.toLowerCase()} is being tested. A sudden change requires you to make a decision quickly.`,
      options: [
        { text: "Apply the core principle you learned", correct: true },
        { text: "Panic and sell everything", correct: false },
        { text: "Wait and do nothing", correct: false, explanation: "Inaction can sometimes be costly." },
      ],
      scenarioOutcome: `Applying ${lesson.title.toLowerCase()} principles would have protected your portfolio and captured the opportunity.`,
    }),
  },
];

function getQuizForLesson(lesson: LessonData): Partial<FeedCardData> {
  const pathway = lesson.pathway || "investing";
  const quizzes = generateTopicQuiz(lesson.title, pathway);
  return quizzes[Math.floor(Math.random() * quizzes.length)] || quizzes[0];
}

function generateTopicQuiz(title: string, pathway: string): Partial<FeedCardData>[] {
  return [
    {
      title: `Test: ${title}`,
      content: `Which statement best describes ${title.toLowerCase()}?`,
      options: [
        { text: `A core concept in ${PATHWAY_LABELS[pathway]?.toLowerCase() || "finance"} that builds wealth over time`, correct: true, explanation: "This captures the essence of the topic." },
        { text: "Something only professionals need to know", correct: false, explanation: "This applies to everyone, not just professionals." },
        { text: "An outdated financial concept", correct: false, explanation: "This remains highly relevant today." },
        { text: "Only useful during bull markets", correct: false, explanation: "It applies in all market conditions." },
      ],
    },
    {
      title: `Quick Check: ${title}`,
      content: `Why is ${title.toLowerCase()} important for your financial journey?`,
      options: [
        { text: "It helps make informed decisions and manage risk", correct: true, explanation: "Knowledge is the foundation of good financial decisions." },
        { text: "It guarantees high returns", correct: false, explanation: "Nothing in finance guarantees returns." },
        { text: "It's only for advanced investors", correct: false, explanation: "Everyone benefits from understanding this concept." },
      ],
    },
  ];
}

export function generateFeedCards(lessons: LessonData[], count: number = 20): FeedCardData[] {
  const cards: FeedCardData[] = [];
  const weightedTypes: typeof cardTemplates = [];

  // Build weighted array
  cardTemplates.forEach((t) => {
    for (let i = 0; i < t.weight; i++) weightedTypes.push(t);
  });

  let challengeCounter = 0;

  for (let i = 0; i < count; i++) {
    const lesson = lessons[i % lessons.length];
    challengeCounter++;

    // Every 7 cards, insert a challenge
    if (challengeCounter >= 7) {
      challengeCounter = 0;
      cards.push({
        id: `challenge-${i}`,
        type: "challenge",
        lessonTitle: lesson.title,
        pathway: PATHWAY_LABELS[lesson.pathway || "investing"] || "Finance",
        difficulty: lesson.difficulty as FeedCardData["difficulty"],
        xpReward: 50,
        title: `Mastery: ${lesson.title}`,
        content: `Prove your understanding of ${lesson.title.toLowerCase()}. This challenge tests deeper comprehension.`,
        options: [
          { text: "Demonstrate applied understanding", correct: true, explanation: "Excellent — you've mastered this concept!" },
          { text: "Rely on memorized facts only", correct: false, explanation: "True mastery goes beyond memorization." },
          { text: "Skip and move on", correct: false, explanation: "Challenges are how you level up!" },
        ],
      });
      continue;
    }

    const template = weightedTypes[Math.floor(Math.random() * weightedTypes.length)];
    const generated = template.generate(lesson, i);

    cards.push({
      id: `card-${i}-${lesson.id}`,
      type: template.type,
      lessonTitle: lesson.title,
      pathway: PATHWAY_LABELS[lesson.pathway || "investing"] || "Finance",
      difficulty: lesson.difficulty as FeedCardData["difficulty"],
      xpReward: template.type === "quiz" ? 15 : template.type === "concept" ? 10 : 20,
      title: generated.title || lesson.title,
      content: generated.content || lesson.description,
      options: generated.options,
      insight: generated.insight,
      scenarioOutcome: generated.scenarioOutcome,
    });
  }

  return cards;
}

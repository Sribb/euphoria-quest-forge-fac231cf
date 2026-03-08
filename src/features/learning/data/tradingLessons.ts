import { LessonDefinition } from './lessonTypes';

const q = (question: string, options: string[], correctIndex: number, explanation: string) => ({ question, options, correctIndex, explanation });
const s = (id: string, label: string, min: number, max: number, step: number, defaultValue: number, unit: string) => ({ id, label, min, max, step, defaultValue, unit });

const TITLES = ["What Is Trading?", "Candlestick Chart Basics", "Support & Resistance", "Trend Lines & Channels", "Volume Analysis", "Moving Averages", "Order Types Explained", "Risk Management", "Paper Trading Practice", "Trading Basics Challenge",
  "Chart Patterns", "RSI & Oscillators", "MACD Strategies", "Fibonacci Retracements", "Bollinger Bands", "Options for Traders", "Day Trading Fundamentals", "Swing Trading Strategies", "Algorithmic Trading Concepts", "Trading Psychology",
  "Position Sizing", "Backtesting Strategies", "Market Microstructure", "Forex Trading Basics", "Trading Capstone"];

const QUOTES = [
  { text: "The trend is your friend until the end when it bends.", author: "Ed Seykota" },
  { text: "The market can stay irrational longer than you can stay solvent.", author: "John Maynard Keynes" },
  { text: "Cut your losses short, let your profits run.", author: "David Ricardo" },
  { text: "The secret to being successful from a trading perspective is to have an indefatigable thirst for information and knowledge.", author: "Paul Tudor Jones" },
  { text: "Volume precedes price.", author: "Joseph Granville" },
  { text: "The four most dangerous words in investing are: 'This time it's different.'", author: "Sir John Templeton" },
  { text: "Risk comes from not knowing what you're doing.", author: "Warren Buffett" },
  { text: "The goal of a successful trader is to make the best trades. Money is secondary.", author: "Alexander Elder" },
  { text: "In trading, the impossible happens about twice a year.", author: "Henri M. Simoes" },
  { text: "The stock market is filled with individuals who know the price of everything, but the value of nothing.", author: "Philip Fisher" },
  ...Array(15).fill({ text: "Plan your trade and trade your plan.", author: "Trading Wisdom" }),
];

export const TRADING_LESSONS: LessonDefinition[] = TITLES.map((title, i) => ({
  orderIndex: i + 1, title,
  intro: { description: `Master ${title.toLowerCase()} — a critical skill for active traders who want to improve their timing and execution.`, points: [`Core concepts of ${title.toLowerCase()}`, "Practical application techniques", "Common mistakes to avoid"] },
  teach: { title: `Mastering ${title}`, content: `${title} is an essential trading concept that helps you make better-informed decisions about when to enter and exit positions. Understanding this technique separates disciplined traders from gamblers.`, cards: [
    { title: "The Technique", description: `How ${title.toLowerCase()} works in practice and when to apply it.`, icon: "📈" },
    { title: "Risk Warning", description: "Trading is speculative. This technique improves odds but doesn't guarantee profits.", icon: "⚠️" },
  ]},
  interactive: i % 3 === 0 ? { type: 'slider' as const, title: `📊 ${title} Simulator`, description: "Experiment with different parameters:", sliders: [s("entry", "Entry Price", 50, 200, 5, 100, "$"), s("stop", "Stop Loss %", 1, 15, 1, 5, "%"), s("target", "Profit Target %", 5, 30, 5, 15, "%")], calculateResult: (v: Record<string, number>) => {
      const riskReward = v.target / v.stop;
      return { primary: `Risk/Reward Ratio: ${riskReward.toFixed(1)}:1`, secondary: `Risk $${(v.entry * v.stop/100).toFixed(2)} to make $${(v.entry * v.target/100).toFixed(2)} per share`, insight: riskReward >= 2 ? "Good risk/reward — aim for 2:1 or better!" : "Poor ratio — tighten your stop or widen your target." };
    }}
    : i % 3 === 1 ? { type: 'drag-sort' as const, title: `📋 ${title} Step Order`, description: "Put these trading steps in order:", items: [{ id: "analyze", label: "Analyze the chart/setup" }, { id: "plan", label: "Plan entry, stop, and target" }, { id: "size", label: "Calculate position size" }, { id: "execute", label: "Execute and manage the trade" }], correctOrder: ["analyze", "plan", "size", "execute"] }
    : { type: 'quiz' as const, title: `🎯 ${title} Quick Challenge`, description: "Test your trading knowledge:", questions: [
      q(`What's the most important aspect of ${title.toLowerCase()}?`, ["Making money quickly", "Managing risk first", "Following social media tips", "Using maximum leverage"], 1, "Risk management is always the top priority in trading."),
      q("What's a key sign of a disciplined trader?", ["They never have losing trades", "They follow their trading plan consistently", "They trade every day", "They use maximum leverage"], 1, "Discipline means following your plan regardless of emotions."),
    ]},
  check: i % 2 === 0 ? { type: 'frq' as const, question: `Describe how you would use ${title.toLowerCase()} in a real trading scenario. Include your entry criteria, stop loss placement, and profit target.`, context: `Trading, ${title.toLowerCase()}, risk management` } : { type: 'quiz' as const, questions: [q(`Why is risk management critical in ${title.toLowerCase()}?`, ["It isn't — profits matter more", "One bad trade can wipe out many winners", "Regulations require it", "It only matters for professionals"], 1, "Without risk management, a single bad trade can undo months of profits.")] },
  summary: { points: [`${title} is a valuable tool when used with proper risk management`, "Always define your risk before entering a trade", "Consistency and discipline matter more than any single technique", "Paper trade new strategies before risking real money"], quote: QUOTES[i] || QUOTES[0] },
}));

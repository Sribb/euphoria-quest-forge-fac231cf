import { LessonDefinition } from './lessonTypes';

const q = (question: string, options: string[], correctIndex: number, explanation: string) => ({ question, options, correctIndex, explanation });
const s = (id: string, label: string, min: number, max: number, step: number, defaultValue: number, unit: string) => ({ id, label, min, max, step, defaultValue, unit });

export const PERSONAL_FINANCE_LESSONS: LessonDefinition[] = [
  { orderIndex: 1, title: "Your Financial Starting Point",
    intro: { description: "Before you can build wealth, you need to know where you stand. Learn to calculate your net worth and understand your complete financial picture.", points: ["Calculate your net worth (assets minus liabilities)", "Identify your income streams and expenses", "Set a baseline for measuring progress"] },
    teach: { title: "Net Worth: Your Financial Score", content: "Your net worth is everything you own (assets) minus everything you owe (liabilities). It's the single most important number in personal finance. Tracking it monthly shows whether you're moving forward or backward.", cards: [
      { title: "Assets", description: "Cash, investments, property, vehicles, retirement accounts. Everything with monetary value you own.", icon: "📈" },
      { title: "Liabilities", description: "Credit cards, student loans, car loans, mortgage. Everything you owe to others.", icon: "📉" },
    ]},
    interactive: { type: 'slider', title: "💰 Net Worth Calculator", description: "Estimate your net worth:", sliders: [s("assets", "Total Assets", 0, 500000, 5000, 25000, "$"), s("debts", "Total Debts", 0, 200000, 5000, 15000, "$")], calculateResult: (v) => ({ primary: `Net Worth: $${(v.assets - v.debts).toLocaleString()}`, secondary: v.assets > v.debts ? "Positive net worth — you own more than you owe!" : "Negative net worth — focus on paying down debt.", insight: `Debt-to-asset ratio: ${v.assets > 0 ? (v.debts/v.assets*100).toFixed(0) : 100}%` }) },
    check: { type: 'quiz', questions: [q("What is net worth?", ["Your annual salary", "Assets minus liabilities", "Your credit score", "Your savings account balance"], 1, "Net worth = total assets - total liabilities.")] },
    summary: { points: ["Net worth = assets minus liabilities", "Track it monthly to measure progress", "A negative net worth isn't permanent — it's a starting point", "Small improvements compound over time"], quote: { text: "A budget is telling your money where to go instead of wondering where it went.", author: "Dave Ramsey" } },
  },
  { orderIndex: 2, title: "Budgeting That Works",
    intro: { description: "Master the 50/30/20 rule and other budgeting methods that actually stick.", points: ["The 50/30/20 budgeting framework", "Needs vs. wants vs. savings", "Finding the method that fits your lifestyle"] },
    teach: { title: "The 50/30/20 Rule", content: "Allocate 50% of after-tax income to needs (rent, food, insurance), 30% to wants (dining, entertainment, hobbies), and 20% to savings and debt repayment. This simple framework works for most income levels.", cards: [
      { title: "50% Needs", description: "Housing, utilities, groceries, insurance, minimum debt payments. Non-negotiable expenses.", icon: "🏠" },
      { title: "30% Wants", description: "Dining out, streaming, travel, hobbies. Important for quality of life but flexible.", icon: "🎮" },
      { title: "20% Savings", description: "Emergency fund, retirement, investments, extra debt payments. Your future self thanks you.", icon: "🏦" },
    ]},
    interactive: { type: 'slider', title: "📊 Budget Allocator", description: "Plan your monthly budget:", sliders: [s("income", "Monthly Income", 2000, 15000, 500, 5000, "$")], calculateResult: (v) => ({ primary: `Needs: $${(v.income*0.5).toLocaleString()} | Wants: $${(v.income*0.3).toLocaleString()} | Savings: $${(v.income*0.2).toLocaleString()}`, secondary: `Saving $${(v.income*0.2).toLocaleString()}/month = $${(v.income*0.2*12).toLocaleString()}/year`, insight: "Automate your savings — pay yourself first!" }) },
    check: { type: 'frq', question: "You earn $4,500/month after taxes. Create a sample 50/30/20 budget with specific dollar amounts for at least 3 categories in each section.", context: "50/30/20 budgeting, needs vs wants vs savings" },
    summary: { points: ["The 50/30/20 rule: needs, wants, savings", "Automate savings — pay yourself first", "Track spending for one month to find leaks", "Any budget you follow is better than no budget"], quote: { text: "Do not save what is left after spending, but spend what is left after saving.", author: "Warren Buffett" } },
  },
  { orderIndex: 3, title: "Emergency Fund Essentials",
    intro: { description: "Build a financial safety net that protects you from life's unexpected expenses.", points: ["Why 3-6 months of expenses is the target", "Where to keep your emergency fund", "How to build one from zero"] },
    teach: { title: "Your Financial Safety Net", content: "An emergency fund covers unexpected expenses — job loss, medical bills, car repairs. Without one, you're forced into high-interest debt. Keep it in a high-yield savings account: accessible but separate from spending money.", cards: [
      { title: "3 Months", description: "Minimum target. Covers short disruptions: car repairs, minor medical bills, brief job gap.", icon: "🛡️" },
      { title: "6 Months", description: "Ideal target. Handles major events: job loss, extended illness, home repairs.", icon: "🏰" },
    ]},
    interactive: { type: 'slider', title: "🎯 Emergency Fund Calculator", description: "How much do you need?", sliders: [s("expenses", "Monthly Expenses", 1500, 10000, 500, 3000, "$"), s("months", "Months of Coverage", 3, 12, 1, 6, " months")], calculateResult: (v) => ({ primary: `Target: $${(v.expenses * v.months).toLocaleString()}`, secondary: `Saving $500/month → ${Math.ceil(v.expenses * v.months / 500)} months to reach goal`, insight: v.months >= 6 ? "Solid coverage for most emergencies." : "Consider building toward 6 months when possible." }) },
    check: { type: 'quiz', questions: [q("Where should you keep your emergency fund?", ["In stocks for growth", "Under your mattress", "In a high-yield savings account", "In cryptocurrency"], 2, "High-yield savings: earns interest while staying liquid and FDIC-insured.")] },
    summary: { points: ["3-6 months of expenses is the standard target", "High-yield savings accounts offer safety and accessibility", "Start small — even $500 prevents most financial emergencies from becoming crises", "Never invest your emergency fund — it needs to be liquid"], quote: { text: "An emergency fund turns a crisis into an inconvenience.", author: "Dave Ramsey" } },
  },
  { orderIndex: 4, title: "Understanding Credit Scores",
    intro: { description: "Your credit score affects interest rates, housing, and even job opportunities. Learn what drives it and how to improve it.", points: ["The five factors that determine your score", "How to improve your credit quickly", "Common myths about credit scores"] },
    teach: { title: "Your Financial Reputation", content: "Credit scores (300-850) are calculated from five factors: payment history (35%), amounts owed (30%), length of history (15%), new credit (10%), and credit mix (10%). A higher score means lower interest rates on everything from mortgages to car loans.", cards: [
      { title: "Payment History (35%)", description: "The biggest factor. One late payment can drop your score 100+ points. Always pay on time.", icon: "📅" },
      { title: "Credit Utilization (30%)", description: "Use less than 30% of your available credit. $3,000 balance on a $10,000 limit = 30%.", icon: "📊" },
    ]},
    interactive: { type: 'drag-sort', title: "📋 Credit Score Factor Ranking", description: "Rank these from MOST to LEAST impact on your credit score:", items: [
      { id: "payment", label: "Payment history (on-time payments)" },
      { id: "util", label: "Credit utilization (% of limit used)" },
      { id: "length", label: "Length of credit history" },
      { id: "mix", label: "Credit mix (types of accounts)" },
    ], correctOrder: ["payment", "util", "length", "mix"] },
    check: { type: 'frq', question: "Your friend has a credit score of 580 and wants to buy a car. Explain 3 specific actions they could take to improve their score over the next 6-12 months.", context: "Credit scores, payment history, utilization, credit building strategies" },
    summary: { points: ["Payment history is the #1 factor — never miss a payment", "Keep credit utilization below 30% of your limit", "Don't close old accounts — length of history matters", "Check your credit report annually for errors at annualcreditreport.com"], quote: { text: "Your credit score is a reflection of your financial habits, not your worth as a person.", author: "Financial Wisdom" } },
  },
  { orderIndex: 5, title: "Good Debt vs. Bad Debt",
    intro: { description: "Not all debt is created equal. Learn to distinguish between debt that builds wealth and debt that destroys it.", points: ["Good debt: mortgages, education, business", "Bad debt: credit cards, payday loans", "Interest rate comparison and total cost"] },
    teach: { title: "Debt as a Tool", content: "Good debt finances assets that appreciate or increase earning power (education, real estate). Bad debt finances depreciating assets or consumption at high interest rates. A 4% mortgage on a growing asset is very different from a 24% credit card balance.", cards: [
      { title: "Good Debt", description: "Mortgage (4-7%), student loans (4-6%), business loans. Builds assets or earning power over time.", icon: "✅" },
      { title: "Bad Debt", description: "Credit cards (18-28%), payday loans (300%+), car loans on expensive vehicles. Drains wealth.", icon: "❌" },
    ]},
    interactive: { type: 'slider', title: "💳 Interest Rate Comparison", description: "See how different rates affect total cost:", sliders: [s("amount", "Loan Amount", 5000, 50000, 5000, 10000, "$"), s("rate", "Interest Rate", 3, 28, 1, 18, "%"), s("years", "Repayment Period", 1, 10, 1, 5, " years")], calculateResult: (v) => {
      const monthlyRate = v.rate / 100 / 12;
      const months = v.years * 12;
      const payment = v.amount * monthlyRate / (1 - Math.pow(1 + monthlyRate, -months));
      const totalPaid = Math.round(payment * months);
      const interest = totalPaid - v.amount;
      return { primary: `Monthly payment: $${Math.round(payment).toLocaleString()}`, secondary: `Total interest paid: $${interest.toLocaleString()} (${Math.round(interest/v.amount*100)}% of the loan)`, insight: v.rate > 15 ? "High interest debt — prioritize paying this off!" : v.rate < 7 ? "Low rate — manageable if the debt funds an appreciating asset." : "Moderate rate — consider refinancing options." };
    }},
    check: { type: 'quiz', questions: [q("Which is an example of 'good debt'?", ["Credit card balance for a vacation", "Payday loan for rent", "Mortgage on a home", "Car loan on a luxury vehicle"], 2, "A mortgage finances an appreciating asset at a relatively low interest rate.")] },
    summary: { points: ["Good debt builds assets or earning power; bad debt finances consumption", "Interest rates make a massive difference in total cost over time", "Always prioritize paying off high-interest debt first", "Not all debt is bad — strategic borrowing can build wealth"], quote: { text: "Rather go to bed without dinner than to rise in debt.", author: "Benjamin Franklin" } },
  },
  ...Array.from({ length: 20 }, (_, i) => {
    const idx = i + 6;
    const titles = ["Banking & Savings Accounts", "Understanding Your Paycheck", "Setting Financial Goals", "Lifestyle Inflation", "Personal Finance Challenge", "Debt Payoff Strategies", "Insurance Essentials", "Tax Basics & Filing", "Side Income & Freelancing", "Mortgage & Home Buying", "Retirement Account Types", "Social Security Planning", "College Savings Plans", "HSA Strategy & Benefits", "Estate Planning Basics", "Credit Card Rewards Strategy", "Charitable Giving & Taxes", "Financial Independence (FIRE)", "Major Purchase Decisions", "Personal Finance Capstone"];
    const title = titles[i] || `PF Lesson ${idx}`;
    const quotes = [
      { text: "The habit of saving is itself an education.", author: "T.T. Munger" },
      { text: "Money is a terrible master but an excellent servant.", author: "P.T. Barnum" },
      { text: "A goal without a plan is just a wish.", author: "Antoine de Saint-Exupéry" },
      { text: "Beware of little expenses. A small leak will sink a great ship.", author: "Benjamin Franklin" },
      { text: "Financial fitness is not a pipe dream or a state of mind. It's a reality if you are willing to pursue it.", author: "Will Robinson" },
      { text: "The safe way to double your money is to fold it over once and put it in your pocket.", author: "Kin Hubbard" },
      { text: "It's not your salary that makes you rich, it's your spending habits.", author: "Charles A. Jaffe" },
      { text: "Money looks better in the bank than on your feet.", author: "Sophia Amoruso" },
      { text: "Financial peace isn't the acquisition of stuff.", author: "Dave Ramsey" },
      { text: "Wealth consists not in having great possessions, but in having few wants.", author: "Epictetus" },
      { text: "The best thing money can buy is financial freedom.", author: "Rob Berger" },
      { text: "Never depend on a single income. Make investment to create a second source.", author: "Warren Buffett" },
      { text: "Formal education will make you a living; self-education will make you a fortune.", author: "Jim Rohn" },
      { text: "Time is more valuable than money.", author: "Jim Rohn" },
      { text: "Someone is sitting in the shade today because someone planted a tree a long time ago.", author: "Warren Buffett" },
      { text: "Money is only a tool. It will take you wherever you wish, but it will not replace you as the driver.", author: "Ayn Rand" },
      { text: "The greatest gift you can give is your time, your attention, your love, and your concern.", author: "Joel Osteen" },
      { text: "Financial independence is the ability to live from the income of your own personal resources.", author: "Jim Rohn" },
      { text: "Buy things, not stuff.", author: "Minimalist Wisdom" },
      { text: "The journey of a thousand miles begins with a single step.", author: "Lao Tzu" },
    ];
    return {
      orderIndex: idx, title,
      intro: { description: `Master the essentials of ${title.toLowerCase()} to strengthen your financial foundation and make smarter money decisions.`, points: [`Understand key concepts of ${title.toLowerCase()}`, "Apply practical strategies to your life", "Build habits that compound over time"] },
      teach: { title: `Understanding ${title}`, content: `This lesson covers the practical aspects of ${title.toLowerCase()} that affect your daily financial life. Understanding these concepts helps you make informed decisions and avoid common pitfalls that cost people thousands of dollars.`, cards: [
        { title: "Key Concept", description: `The fundamental principles of ${title.toLowerCase()} that everyone should understand.`, icon: "📚" },
        { title: "Common Mistakes", description: "The pitfalls most people fall into and how to avoid them.", icon: "⚠️" },
      ]},
      interactive: i % 3 === 0 ? { type: 'slider' as const, title: `📊 ${title} Calculator`, description: "Explore the numbers:", sliders: [s("amount", "Amount", 1000, 100000, 1000, 10000, "$"), s("rate", "Rate/Percentage", 1, 20, 1, 5, "%")], calculateResult: (v: Record<string, number>) => ({ primary: `Result: $${Math.round(v.amount * (1 + v.rate/100)).toLocaleString()}`, secondary: `Impact: $${Math.round(v.amount * v.rate/100).toLocaleString()}`, insight: "Understanding the numbers empowers better decisions." }) }
        : i % 3 === 1 ? { type: 'drag-sort' as const, title: `📋 ${title} Priority Order`, description: "Rank these from most to least important:", items: [{ id: "a", label: "Understanding the basics first" }, { id: "b", label: "Creating a written plan" }, { id: "c", label: "Taking consistent action" }, { id: "d", label: "Reviewing and adjusting" }], correctOrder: ["a", "b", "c", "d"] }
        : { type: 'quiz' as const, title: `🎯 ${title} Quick Game`, description: "Test your knowledge:", questions: [q(`What is the most important aspect of ${title.toLowerCase()}?`, ["Taking immediate action", "Understanding fundamentals first", "Following trends", "Ignoring it completely"], 1, "Building a strong foundation of understanding leads to better outcomes.")] },
      check: { type: (i % 2 === 0 ? 'frq' : 'quiz') as 'frq' | 'quiz', ...(i % 2 === 0 ? { question: `Explain how ${title.toLowerCase()} impacts your long-term financial health and describe one specific action you would take to improve in this area.`, context: `Personal finance, ${title.toLowerCase()}` } : { questions: [q(`Which strategy is most effective for ${title.toLowerCase()}?`, ["React to problems as they come", "Create a proactive plan", "Ignore it and hope for the best", "Only think about it once a year"], 1, "Proactive planning consistently outperforms reactive decision-making.")] }) } as any,
      summary: { points: [`${title} is a critical component of financial health`, "Small consistent actions compound into major results", "Knowledge removes fear and enables confident decisions", "Review and adjust your approach regularly"], quote: quotes[i] || { text: "The best investment you can make is in yourself.", author: "Warren Buffett" } },
    } as LessonDefinition;
  }),
];

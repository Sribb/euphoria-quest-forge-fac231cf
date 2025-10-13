import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { X, ChevronRight, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { TradingViewChart } from "./TradingViewChart";
import { ChartInsight } from "./ChartInsight";

interface LessonViewerProps {
  lessonId: string;
  onClose: () => void;
}

interface LessonContent {
  section: string;
  content: string;
  quiz?: {
    question: string;
    options: string[];
    correctAnswer: number;
  };
}

export const LessonViewer = ({ lessonId, onClose }: LessonViewerProps) => {
  const { user } = useAuth();
  const [lesson, setLesson] = useState<any>(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [progress, setProgress] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [showQuizFeedback, setShowQuizFeedback] = useState(false);
  const [chartData, setChartData] = useState({ price: 0, change: 0 });

  useEffect(() => {
    loadLesson();
  }, [lessonId]);

  const loadLesson = async () => {
    const { data, error } = await supabase
      .from("lessons")
      .select("*")
      .eq("id", lessonId)
      .single();

    if (error) {
      toast.error("Failed to load lesson");
      return;
    }

    setLesson(data);
    loadProgress();
  };

  const loadProgress = async () => {
    const { data } = await supabase
      .from("user_lesson_progress")
      .select("progress")
      .eq("lesson_id", lessonId)
      .eq("user_id", user?.id)
      .single();

    if (data) {
      setProgress(data.progress);
      setCurrentSection(Math.floor((data.progress / 100) * sections.length));
    }
  };

  const sections: LessonContent[] = [
    {
      section: "Introduction to Value Investing",
      content: "Welcome to the world of value investing! Warren Buffett, often called the 'Oracle of Omaha', has built his fortune using principles we'll explore today. Value investing is about finding companies trading below their intrinsic value - buying a dollar for fifty cents. Watch the live chart to see how prices fluctuate based on market sentiment, not always fundamental value. This disconnect creates opportunities for patient investors.",
    },
    {
      section: "Understanding Price vs. Value",
      content: "Price is what you pay, value is what you get - Warren Buffett's famous quote encapsulates value investing. A stock's price fluctuates daily based on market emotions (fear and greed), while its intrinsic value changes slowly based on business fundamentals. The chart shows real-time price movements - notice how volatile it is? That's market sentiment. Smart investors use this volatility to their advantage, buying quality companies when fear drives prices down.",
      quiz: {
        question: "What causes daily stock price fluctuations according to value investing principles?",
        options: [
          "Changes in company's intrinsic value",
          "Market sentiment and emotions",
          "Government regulations",
          "CEO decisions"
        ],
        correctAnswer: 1,
      },
    },
    {
      section: "The Margin of Safety",
      content: "Benjamin Graham, Warren Buffett's mentor, introduced the concept of 'Margin of Safety' - the difference between a stock's intrinsic value and its market price. Never pay full price for an asset! If you calculate a company is worth $100 per share, only buy it at $60 or $70. This cushion protects you from errors in judgment and market downturns. It's like buying insurance for your investment. The wider your margin of safety, the better protected you are.",
    },
    {
      section: "Analyzing Business Fundamentals",
      content: "Buffett focuses on five key metrics: 1) Return on Equity (ROE) - how efficiently a company uses shareholder money, aim for 15%+. 2) Debt-to-Equity ratio - low debt means financial stability. 3) Profit margins - consistent or growing margins show competitive advantage. 4) Free cash flow - the cash a business generates after expenses. 5) Management quality - honest, capable leaders who allocate capital wisely. These fundamentals determine a company's true value, while the chart shows market psychology.",
      quiz: {
        question: "According to Warren Buffett, what's the ideal Return on Equity (ROE) for a quality investment?",
        options: [
          "5% or higher",
          "10% or higher", 
          "15% or higher",
          "25% or higher"
        ],
        correctAnswer: 2,
      },
    },
    {
      section: "The Power of Compound Interest",
      content: "Einstein called compound interest 'the eighth wonder of the world.' Buffett's wealth comes not from finding the best stocks, but from holding great companies for decades. If you invest $10,000 at 10% annual returns: After 10 years: $25,937. After 20 years: $67,275. After 30 years: $174,494. That's the magic of compounding! Time in the market beats timing the market. The chart's daily swings don't matter when you're investing for 30 years.",
    },
    {
      section: "Long-Term Thinking",
      content: "Buffett's favorite holding period is 'forever.' When you buy a piece of a great business, you want to own it for decades as it compounds value. Ignore short-term noise - the chart's daily movements are meaningless to a 30-year investor. Focus on: Does the business have a competitive advantage? Will people need this product in 20 years? Is management excellent? These questions matter far more than next quarter's earnings.",
      quiz: {
        question: "What is Warren Buffett's favorite holding period for a stock?",
        options: [
          "1 year",
          "5 years",
          "10 years",
          "Forever"
        ],
        correctAnswer: 3,
      },
    },
    {
      section: "Moats and Competitive Advantages",
      content: "A 'moat' protects a company from competition, like a castle's moat protects from invaders. Types of moats: 1) Brand power (Coca-Cola, Apple) - customers pay premium prices. 2) Network effects (Facebook, Visa) - more users = more valuable. 3) Cost advantages (Walmart) - economies of scale. 4) Switching costs (Microsoft Office) - too expensive to change. 5) Intangible assets (patents, licenses). Companies with wide moats can maintain high returns on capital for decades. Always invest in moated businesses.",
    },
    {
      section: "Market Psychology & News Catalysts",
      content: "The market is driven by two emotions: fear and greed. News catalysts can trigger irrational price movements. Good news = greed = overvaluation. Bad news = fear = undervaluation. The 2008 financial crisis was pure fear - great companies traded at huge discounts. Buffett bought billions in quality stocks. When others are fearful, be greedy. When others are greedy, be fearful. The chart shows these emotional swings daily. Smart investors wait for fear, then pounce on opportunities.",
      quiz: {
        question: "According to Buffett's philosophy, what should you do when the market is fearful?",
        options: [
          "Sell everything and wait",
          "Be greedy and buy quality stocks",
          "Avoid the market completely",
          "Follow the crowd"
        ],
        correctAnswer: 1,
      },
    },
    {
      section: "Portfolio Diversification",
      content: "Buffett advises: 'Diversification is protection against ignorance. It makes little sense if you know what you're doing.' However, for most investors, diversification is crucial. The modern portfolio theory suggests: 60% stocks (growth), 30% bonds (stability), 10% cash (opportunities). Within stocks, spread across sectors: technology, healthcare, consumer goods, financials. This reduces risk - if one sector crashes, others may thrive. But don't over-diversify into mediocre companies. Better to own 10 great businesses than 100 average ones.",
    },
    {
      section: "Reading Financial Statements",
      content: "Three key financial statements tell a company's story: 1) Balance Sheet - what the company owns (assets) and owes (liabilities). Look for: low debt, high cash reserves, growing equity. 2) Income Statement - revenue, expenses, and profit. Look for: growing revenues, expanding margins, consistent profits. 3) Cash Flow Statement - actual cash generated. Look for: positive free cash flow, cash from operations > net income. These numbers reveal the truth behind the chart's price movements.",
      quiz: {
        question: "Which financial metric is most important according to value investors?",
        options: [
          "Stock price",
          "Free cash flow",
          "Trading volume",
          "Market capitalization"
        ],
        correctAnswer: 1,
      },
    },
    {
      section: "Avoiding Common Mistakes",
      content: "Common investing pitfalls: 1) Chasing hot stocks - by the time everyone knows about it, it's overvalued. 2) Panic selling - markets recover, paper losses only become real when you sell. 3) Timing the market - impossible to predict short-term moves. 4) Ignoring fees - a 1% fee costs you 30% of gains over 30 years. 5) Following tips - do your own research. 6) Overtrading - every trade has costs and taxes. 7) Emotional decisions - stick to your investment thesis. The chart's volatility tempts these mistakes daily. Resist!",
    },
    {
      section: "Building Your Investment Checklist",
      content: "Before buying any stock, Buffett uses a checklist. Create yours: ✓ Can I understand this business? ✓ Does it have a competitive moat? ✓ Is management trustworthy and capable? ✓ Are financials strong (low debt, high ROE, growing cash flow)? ✓ Is the stock price reasonable vs. intrinsic value? ✓ Will this company exist in 20 years? ✓ Would I be comfortable owning this if the market closed tomorrow? If you can't check all boxes, walk away. There's always another opportunity.",
    },
    {
      section: "Completion - Your Value Investing Foundation",
      content: "Congratulations! You've completed the comprehensive value investing course. You now understand: price vs. value, margin of safety, fundamental analysis, compound interest, long-term thinking, competitive moats, market psychology, portfolio diversification, financial statements, and common mistakes. Remember: 'The stock market is a device for transferring money from the impatient to the patient.' - Warren Buffett. Keep learning, stay disciplined, and invest for the long term. Watch real charts daily to see these principles in action!",
    },
  ];

  const handleNext = async () => {
    if (currentSection < sections.length - 1) {
      const newSection = currentSection + 1;
      setCurrentSection(newSection);
      const newProgress = Math.round(((newSection + 1) / sections.length) * 100);
      setProgress(newProgress);
      setQuizAnswer(null);
      setShowQuizFeedback(false);

      await updateProgress(newProgress);
    } else {
      await completeLesson();
    }
  };

  const updateProgress = async (newProgress: number) => {
    const { error } = await supabase.from("user_lesson_progress").upsert({
      user_id: user?.id,
      lesson_id: lessonId,
      progress: newProgress,
      completed: newProgress === 100,
      completed_at: newProgress === 100 ? new Date().toISOString() : null,
    });

    if (error) {
      console.error("Failed to update progress:", error);
    }
  };

  const completeLesson = async () => {
    await updateProgress(100);
    
    // Get current coins
    const { data: profile } = await supabase
      .from("profiles")
      .select("coins")
      .eq("id", user?.id)
      .single();

    if (profile) {
      const { error: coinsError } = await supabase
        .from("profiles")
        .update({ coins: profile.coins + 50 })
        .eq("id", user?.id);

      if (!coinsError) {
        toast.success("Lesson completed! +50 coins");
      }
    }

    onClose();
  };

  const handleQuizAnswer = (index: number) => {
    setQuizAnswer(index);
    setShowQuizFeedback(true);
  };

  const currentContent = sections[currentSection];

  if (!lesson) return null;

  return (
    <div className="fixed inset-0 bg-background/95 z-50 overflow-y-auto">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">{lesson.title}</h1>
            <p className="text-muted-foreground mt-1">{lesson.description}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-6 h-6" />
          </Button>
        </div>

        <Progress value={progress} className="mb-6 h-3" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">{currentContent.section}</h2>
            <p className="text-lg leading-relaxed mb-6">{currentContent.content}</p>

            {currentContent.quiz && (
              <div className="mt-6 space-y-4">
                <h3 className="font-semibold text-lg">{currentContent.quiz.question}</h3>
                <div className="space-y-2">
                  {currentContent.quiz.options.map((option, index) => (
                    <Button
                      key={index}
                      variant={
                        showQuizFeedback
                          ? index === currentContent.quiz!.correctAnswer
                            ? "default"
                            : quizAnswer === index
                            ? "destructive"
                            : "outline"
                          : quizAnswer === index
                          ? "secondary"
                          : "outline"
                      }
                      className="w-full justify-start"
                      onClick={() => handleQuizAnswer(index)}
                      disabled={showQuizFeedback}
                    >
                      {option}
                      {showQuizFeedback && index === currentContent.quiz!.correctAnswer && (
                        <CheckCircle2 className="w-4 h-4 ml-auto" />
                      )}
                    </Button>
                  ))}
                </div>
                {showQuizFeedback && (
                  <p className="text-sm mt-2">
                    {quizAnswer === currentContent.quiz.correctAnswer
                      ? "✓ Correct! Great job!"
                      : "✗ Not quite. The correct answer is highlighted."}
                  </p>
                )}
              </div>
            )}

            <div className="flex justify-between items-center mt-8">
              <span className="text-sm text-muted-foreground">
                Section {currentSection + 1} of {sections.length}
              </span>
              <Button
                onClick={handleNext}
                disabled={currentContent.quiz && !showQuizFeedback}
                className="bg-gradient-primary"
              >
                {currentSection === sections.length - 1 ? "Complete Lesson" : "Next"}
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </Card>

          <div className="space-y-4">
            <TradingViewChart onPriceUpdate={setChartData} />
            <ChartInsight chartData={chartData} lessonSection={currentContent.section} />
          </div>
        </div>
      </div>
    </div>
  );
};

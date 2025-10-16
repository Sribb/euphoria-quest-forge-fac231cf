import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { X, ChevronRight, CheckCircle2, Trophy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { TradingViewChart } from "./TradingViewChart";
import { ChartInsight } from "./ChartInsight";
import { getLessonContent } from "./InteractiveLessonContent";

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

  const sections: LessonContent[] = lesson ? getLessonContent(lesson.order_index) : [];
  
  // Remove old hardcoded sections - now using dynamic content
  /*
  const oldSections: LessonContent[] = [
    {
      section: "Introduction to Value Investing",
      content: "Value investing is a proven investment strategy focused on purchasing securities that appear underpriced based on fundamental analysis. This approach, popularized by legendary investor Warren Buffett, centers on identifying companies whose market price falls below their calculated intrinsic value—essentially acquiring quality assets at a significant discount. The live market chart demonstrates how stock prices fluctuate driven by investor sentiment and market psychology, often diverging from a company's true worth. These temporary mispricings create strategic opportunities for disciplined, patient investors who focus on long-term value creation rather than short-term price movements.",
    },
    {
      section: "Understanding Price vs. Value",
      content: "The fundamental principle of value investing distinguishes between market price and intrinsic value. Market prices fluctuate dramatically based on collective investor emotions—primarily fear during downturns and greed during rallies. In contrast, a company's intrinsic value evolves gradually, reflecting actual business performance, competitive positioning, and fundamental economics. The real-time chart illustrates this price volatility driven by market sentiment. Sophisticated investors capitalize on this volatility by purchasing high-quality businesses when temporary fear creates pricing dislocations, acquiring valuable assets at discount prices during periods of market pessimism.",
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
      content: "The margin of safety concept, established by Benjamin Graham, represents the critical buffer between an asset's calculated intrinsic value and its purchase price. This principle mandates never paying full estimated value for any investment. For instance, if fundamental analysis suggests a company's true worth is $100 per share, prudent investors only initiate positions at substantial discounts—perhaps $60-$70 per share. This protective cushion serves multiple purposes: it compensates for potential analytical errors, provides downside protection during market corrections, and enhances long-term returns. A wider margin of safety translates to greater investment security and reduced risk exposure, functioning as built-in portfolio insurance against uncertainty and miscalculation.",
    },
    {
      section: "Analyzing Business Fundamentals",
      content: "Successful value investing requires rigorous fundamental analysis across five critical metrics. First, Return on Equity (ROE) measures management's efficiency in deploying shareholder capital—target companies demonstrating consistent 15%+ ROE. Second, the Debt-to-Equity ratio reveals financial stability; lower leverage indicates stronger balance sheets and reduced bankruptcy risk. Third, profit margin trends expose competitive positioning; expanding margins signal durable competitive advantages. Fourth, free cash flow generation represents true economic profit—the actual cash available after necessary capital expenditures. Fifth, management quality assessment evaluates leadership integrity, strategic vision, and capital allocation discipline. These fundamental factors determine genuine business value, providing investment decision framework independent of market sentiment reflected in daily price fluctuations.",
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
      content: "Congratulations! You've completed the comprehensive value investing course.",
    },
  ];
  */

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
                     ? index === currentContent.quiz.correctAnswer
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
                      {showQuizFeedback && index === currentContent.quiz.correctAnswer && (
                        <CheckCircle2 className="w-4 h-4 ml-auto" />
                      )}
                    </Button>
                  ))}
                </div>
                {showQuizFeedback && currentContent.quiz && (
                  <div className="mt-3 p-3 bg-muted rounded-lg">
                    <p className="text-sm font-semibold mb-1">
                      {quizAnswer === currentContent.quiz.correctAnswer
                        ? "✓ Correct! Excellent work!"
                        : "✗ Not quite right."}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {currentContent.quiz.explanation}
                    </p>
                  </div>
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

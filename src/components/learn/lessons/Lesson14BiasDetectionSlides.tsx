import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowRight, 
  CheckCircle,
  Target,
  Brain,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Eye,
  Lightbulb
} from "lucide-react";

type Slide = 1 | 2 | 3 | 4;

interface Lesson14Props {
  onComplete?: () => void;
}

const biasScenarios = [
  {
    id: 1,
    scenario: "Your stock dropped 40%. You refuse to sell because 'it will come back.'",
    bias: "Loss Aversion",
    explanation: "We feel losses twice as strongly as gains, making us hold losers too long.",
    options: ["Loss Aversion", "Confirmation Bias", "Overconfidence"],
  },
  {
    id: 2,
    scenario: "You only read news that supports your bullish view on a stock.",
    bias: "Confirmation Bias",
    explanation: "We seek information that confirms what we already believe.",
    options: ["Anchoring", "Confirmation Bias", "Recency Bias"],
  },
  {
    id: 3,
    scenario: "After 5 winning trades, you bet everything on the next one.",
    bias: "Overconfidence",
    explanation: "Recent success makes us overestimate our abilities.",
    options: ["Overconfidence", "Herd Mentality", "Loss Aversion"],
  },
  {
    id: 4,
    scenario: "A stock was $100 last year, now it's $50. You think it's 'cheap.'",
    bias: "Anchoring",
    explanation: "We fixate on irrelevant reference points like past prices.",
    options: ["Anchoring", "Recency Bias", "Confirmation Bias"],
  },
  {
    id: 5,
    scenario: "Everyone on social media is buying a meme stock—you join in.",
    bias: "Herd Mentality",
    explanation: "We follow the crowd assuming they know something we don't.",
    options: ["Herd Mentality", "Overconfidence", "Loss Aversion"],
  },
];

const reflectionQuestions = [
  {
    question: "Why is loss aversion dangerous for investors?",
    options: [
      { text: "It makes us hold losing positions too long", correct: true },
      { text: "It makes us take too much risk", correct: false },
      { text: "It's not dangerous—it protects us", correct: false },
    ],
  },
  {
    question: "How can you combat confirmation bias?",
    options: [
      { text: "Only read positive news", correct: false },
      { text: "Actively seek opposing viewpoints", correct: true },
      { text: "Ignore all news entirely", correct: false },
    ],
  },
  {
    question: "What's the best defense against cognitive biases?",
    options: [
      { text: "Trust your gut feeling", correct: false },
      { text: "Use a systematic investment process with rules", correct: true },
      { text: "Follow what experts say on TV", correct: false },
    ],
  },
];

export const Lesson14BiasDetectionSlides = ({ onComplete }: Lesson14Props) => {
  const [currentSlide, setCurrentSlide] = useState<Slide>(1);
  const [currentScenario, setCurrentScenario] = useState(0);
  const [answers, setAnswers] = useState<{scenario: number; answer: string; correct: boolean}[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [reflectionIndex, setReflectionIndex] = useState(0);
  const [reflectionAnswers, setReflectionAnswers] = useState<boolean[]>([]);

  const handleAnswer = (answer: string) => {
    const scenario = biasScenarios[currentScenario];
    const correct = answer === scenario.bias;
    setAnswers([...answers, { scenario: currentScenario, answer, correct }]);
    setShowExplanation(true);
    
    setTimeout(() => {
      setShowExplanation(false);
      if (currentScenario < biasScenarios.length - 1) {
        setCurrentScenario(currentScenario + 1);
      }
    }, 2500);
  };

  const handleReflectionAnswer = (isCorrect: boolean) => {
    setReflectionAnswers([...reflectionAnswers, isCorrect]);
    if (reflectionIndex < reflectionQuestions.length - 1) {
      setTimeout(() => setReflectionIndex(reflectionIndex + 1), 1000);
    }
  };

  const nextSlide = () => {
    if (currentSlide < 4) {
      setCurrentSlide((currentSlide + 1) as Slide);
    } else {
      onComplete?.();
    }
  };

  const slideLabels = ["Experience", "Reflect", "Insight", "Apply"];
  const scenario = biasScenarios[currentScenario];
  const score = answers.filter(a => a.correct).length;

  return (
    <div className="space-y-6">
      {/* Progress indicator */}
      <div className="flex justify-center gap-2 mb-4">
        {[1, 2, 3, 4].map((slide) => (
          <div key={slide} className="flex flex-col items-center">
            <motion.div
              className={`h-2 rounded-full transition-all duration-300 ${
                slide === currentSlide ? "w-8 bg-primary" : slide < currentSlide ? "w-4 bg-primary/50" : "w-4 bg-muted"
              }`}
            />
            <span className={`text-xs mt-1 ${slide === currentSlide ? "text-primary font-medium" : "text-muted-foreground"}`}>
              {slideLabels[slide - 1]}
            </span>
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Slide 1: Experience - Bias Detection Challenge */}
        {currentSlide === 1 && (
          <motion.div
            key="slide1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-8">
              <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">Experience</Badge>
              
              <h2 className="text-2xl font-bold mb-2">Cognitive Bias Detector</h2>
              <p className="text-muted-foreground mb-6">
                Your brain is wired with shortcuts that can sabotage your investments. Identify the bias in each scenario.
              </p>

              {/* Progress */}
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-bold text-primary">{answers.length}/{biasScenarios.length} scenarios</span>
                </div>
                <Progress value={(answers.length / biasScenarios.length) * 100} className="h-2" />
              </div>

              {/* Scenario Card */}
              <Card className="p-6 bg-muted/50 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <Brain className="w-5 h-5 text-purple-500" />
                  <span className="font-bold">Scenario {currentScenario + 1}</span>
                </div>

                <div className="p-4 rounded-xl bg-primary/10 border border-primary/30 mb-6">
                  <p className="text-lg font-medium">{scenario.scenario}</p>
                </div>

                {!showExplanation && answers.length <= currentScenario && (
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground mb-3">Which cognitive bias is this?</p>
                    {scenario.options.map((option) => (
                      <motion.button
                        key={option}
                        onClick={() => handleAnswer(option)}
                        className="w-full p-4 rounded-xl text-left border-2 border-border hover:border-primary transition-all"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {option}
                      </motion.button>
                    ))}
                  </div>
                )}

                {showExplanation && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-xl ${
                      answers[currentScenario]?.correct 
                        ? "bg-emerald-500/20 border border-emerald-500/50" 
                        : "bg-amber-500/20 border border-amber-500/50"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {answers[currentScenario]?.correct ? (
                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-amber-500" />
                      )}
                      <span className="font-bold">
                        {answers[currentScenario]?.correct ? "Correct!" : `The answer is: ${scenario.bias}`}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{scenario.explanation}</p>
                  </motion.div>
                )}
              </Card>

              <div className="flex justify-center">
                <Button 
                  onClick={nextSlide} 
                  size="lg" 
                  className="gap-2"
                  disabled={answers.length < biasScenarios.length}
                >
                  {answers.length < biasScenarios.length ? `${biasScenarios.length - answers.length} scenarios remaining` : "Continue to Reflect"}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Slide 2: Reflect */}
        {currentSlide === 2 && (
          <motion.div
            key="slide2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-8">
              <Badge className="mb-4 bg-amber-500/20 text-amber-400 border-amber-500/30">Reflect</Badge>
              
              <h2 className="text-2xl font-bold text-center mb-2">Understanding Your Biases</h2>
              <p className="text-center text-muted-foreground mb-8">Test your understanding of behavioral finance</p>

              <Card className="p-6 bg-muted/50 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="w-5 h-5 text-amber-500" />
                  <span className="text-sm text-muted-foreground">Question {reflectionIndex + 1} of {reflectionQuestions.length}</span>
                </div>
                
                <h3 className="font-bold text-lg mb-6">{reflectionQuestions[reflectionIndex].question}</h3>
                
                <div className="space-y-3">
                  {reflectionQuestions[reflectionIndex].options.map((option, idx) => (
                    <motion.button
                      key={idx}
                      onClick={() => handleReflectionAnswer(option.correct)}
                      className={`w-full p-4 rounded-xl text-left border-2 transition-all ${
                        reflectionAnswers[reflectionIndex] !== undefined
                          ? option.correct ? "border-emerald-500 bg-emerald-500/10" : "border-border opacity-50"
                          : "border-border hover:border-primary"
                      }`}
                      disabled={reflectionAnswers[reflectionIndex] !== undefined}
                      whileHover={reflectionAnswers[reflectionIndex] === undefined ? { scale: 1.02 } : {}}
                    >
                      {option.text}
                      {reflectionAnswers[reflectionIndex] !== undefined && option.correct && (
                        <CheckCircle className="w-5 h-5 text-emerald-500 inline ml-2" />
                      )}
                    </motion.button>
                  ))}
                </div>
              </Card>

              <div className="flex justify-center gap-2 mb-8">
                {reflectionQuestions.map((_, idx) => (
                  <div key={idx} className={`w-3 h-3 rounded-full ${idx === reflectionIndex ? "bg-primary scale-125" : reflectionAnswers[idx] !== undefined ? "bg-emerald-500" : "bg-muted"}`} />
                ))}
              </div>

              <div className="flex justify-center">
                <Button onClick={nextSlide} size="lg" className="gap-2" disabled={reflectionAnswers.length < reflectionQuestions.length}>
                  Continue to Insight <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Slide 3: Insight */}
        {currentSlide === 3 && (
          <motion.div
            key="slide3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-8">
              <Badge className="mb-4 bg-blue-500/20 text-blue-400 border-blue-500/30">Insight</Badge>
              
              <h2 className="text-2xl font-bold text-center mb-8">Behavioral Finance Insights</h2>

              <div className="grid gap-6 mb-8">
                {[
                  {
                    title: "Your Brain Is Not Your Friend",
                    description: "Evolution optimized our brains for survival, not investing. The same instincts that kept us alive on the savanna now cause us to panic sell at market bottoms.",
                    icon: Brain,
                  },
                  {
                    title: "Awareness Is the First Step",
                    description: "Simply knowing about biases doesn't eliminate them—but it does help you pause and question your decisions before acting.",
                    icon: Eye,
                  },
                  {
                    title: "Systems Beat Willpower",
                    description: "The best investors don't rely on discipline. They create rules and systems that remove emotion from the process.",
                    icon: Lightbulb,
                  },
                ].map((insight, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.2 }}
                    className="p-6 rounded-xl bg-purple-500/10 border border-purple-500/30"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-purple-500/20">
                        <insight.icon className="w-6 h-6 text-purple-500" />
                      </div>
                      <div>
                        <h3 className="font-bold mb-2">{insight.title}</h3>
                        <p className="text-muted-foreground">{insight.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="flex justify-center">
                <Button onClick={nextSlide} size="lg" className="gap-2">
                  Continue to Apply <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Slide 4: Apply */}
        {currentSlide === 4 && (
          <motion.div
            key="slide4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-8">
              <Badge className="mb-4 bg-purple-500/20 text-purple-400 border-purple-500/30">Apply</Badge>
              
              <h2 className="text-2xl font-bold text-center mb-2">Your Bias Awareness Score</h2>
              <p className="text-center text-muted-foreground mb-8">Review your performance</p>

              <Card className="p-6 bg-muted/50 mb-6 text-center">
                <div className="text-6xl font-bold mb-4" style={{ color: score >= 4 ? "#22c55e" : score >= 3 ? "#f59e0b" : "#ef4444" }}>
                  {score}/{biasScenarios.length}
                </div>
                <p className="text-lg font-medium mb-2">
                  {score >= 4 ? "Bias Detective!" : score >= 3 ? "Good awareness!" : "Keep learning!"}
                </p>
              </Card>

              {/* Bias Summary */}
              <div className="grid gap-3 mb-6">
                {biasScenarios.map((s, idx) => (
                  <div key={s.id} className={`p-4 rounded-xl flex items-center gap-4 ${answers[idx]?.correct ? "bg-emerald-500/10 border border-emerald-500/30" : "bg-amber-500/10 border border-amber-500/30"}`}>
                    {answers[idx]?.correct ? <CheckCircle className="w-5 h-5 text-emerald-500" /> : <AlertTriangle className="w-5 h-5 text-amber-500" />}
                    <div className="flex-1">
                      <p className="font-medium">{s.bias}</p>
                      <p className="text-xs text-muted-foreground">{s.explanation}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-center">
                <Button onClick={nextSlide} size="lg" className="gap-2">
                  Complete Lesson <CheckCircle className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowRight, 
  Sparkles, 
  Shield,
  Castle,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  Crown,
  Network,
  Zap,
  DollarSign,
  Lock,
  Plus
} from "lucide-react";

type Slide = 1 | 2 | 3 | 4;

interface Lesson9Props {
  onComplete?: () => void;
}

const moatTypes = [
  { 
    id: "brand", 
    name: "Brand Power", 
    icon: Crown, 
    description: "Strong brand recognition and loyalty",
    durabilityBoost: 15,
    profitBoost: 12,
    example: "Apple, Nike, Coca-Cola"
  },
  { 
    id: "network", 
    name: "Network Effects", 
    icon: Network, 
    description: "Value increases as more people use it",
    durabilityBoost: 20,
    profitBoost: 18,
    example: "Facebook, Visa, Uber"
  },
  { 
    id: "switching", 
    name: "Switching Costs", 
    icon: Lock, 
    description: "High cost for customers to switch",
    durabilityBoost: 18,
    profitBoost: 15,
    example: "Microsoft, Salesforce, Oracle"
  },
  { 
    id: "cost", 
    name: "Cost Advantage", 
    icon: DollarSign, 
    description: "Produces goods/services at lower cost",
    durabilityBoost: 12,
    profitBoost: 20,
    example: "Walmart, Costco, Amazon"
  },
  { 
    id: "intangibles", 
    name: "Intangible Assets", 
    icon: Zap, 
    description: "Patents, licenses, regulatory protection",
    durabilityBoost: 16,
    profitBoost: 14,
    example: "Pharma companies, Disney, Qualcomm"
  },
];

const reflectionScenarios = [
  {
    company: "StreamFlix",
    description: "A new streaming service launches with exclusive content",
    question: "Which moat would best protect StreamFlix long-term?",
    options: [
      { moat: "Network Effects", correct: false, feedback: "Streaming doesn't have strong network effects—you don't need friends to watch." },
      { moat: "Switching Costs", correct: true, feedback: "Correct! If users build watchlists, profiles, and history, they're less likely to switch." },
      { moat: "Cost Advantage", correct: false, feedback: "Content is expensive—hard to have a cost advantage here." },
    ],
  },
  {
    company: "PayQuick",
    description: "A digital payment platform connecting merchants and consumers",
    question: "What moat matters most for PayQuick?",
    options: [
      { moat: "Network Effects", correct: true, feedback: "Correct! More merchants attract more consumers, and vice versa—classic two-sided network." },
      { moat: "Brand Power", correct: false, feedback: "Brand helps, but isn't the primary moat for payment networks." },
      { moat: "Cost Advantage", correct: false, feedback: "Processing costs are similar across competitors." },
    ],
  },
];

export const Lesson9MoatBuilderSlides = ({ onComplete }: Lesson9Props) => {
  const [currentSlide, setCurrentSlide] = useState<Slide>(1);
  const [selectedMoats, setSelectedMoats] = useState<string[]>([]);
  const [profitDurability, setProfitDurability] = useState(20);
  const [profitMargin, setProfitMargin] = useState(15);
  const [showResults, setShowResults] = useState(false);
  const [reflectionIndex, setReflectionIndex] = useState(0);
  const [reflectionAnswers, setReflectionAnswers] = useState<boolean[]>([]);
  const [challengeCompany, setChallengeCompany] = useState("");
  const [challengeMoats, setChallengeMoats] = useState<string[]>([]);

  // Update metrics when moats change
  useEffect(() => {
    let durability = 20;
    let profit = 15;
    
    selectedMoats.forEach(moatId => {
      const moat = moatTypes.find(m => m.id === moatId);
      if (moat) {
        durability += moat.durabilityBoost;
        profit += moat.profitBoost;
      }
    });
    
    setProfitDurability(Math.min(durability, 100));
    setProfitMargin(Math.min(profit, 100));
  }, [selectedMoats]);

  const toggleMoat = (moatId: string) => {
    if (selectedMoats.includes(moatId)) {
      setSelectedMoats(selectedMoats.filter(m => m !== moatId));
    } else if (selectedMoats.length < 3) {
      setSelectedMoats([...selectedMoats, moatId]);
    }
  };

  const handleReflectionAnswer = (isCorrect: boolean) => {
    setReflectionAnswers([...reflectionAnswers, isCorrect]);
    if (reflectionIndex < reflectionScenarios.length - 1) {
      setTimeout(() => setReflectionIndex(reflectionIndex + 1), 1500);
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

  return (
    <div className="space-y-6">
      {/* Progress indicator */}
      <div className="flex justify-center gap-2 mb-4">
        {[1, 2, 3, 4].map((slide) => (
          <div key={slide} className="flex flex-col items-center">
            <motion.div
              className={`h-2 rounded-full transition-all duration-300 ${
                slide === currentSlide 
                  ? "w-8 bg-primary" 
                  : slide < currentSlide 
                    ? "w-4 bg-primary/50" 
                    : "w-4 bg-muted"
              }`}
            />
            <span className={`text-xs mt-1 ${slide === currentSlide ? "text-primary font-medium" : "text-muted-foreground"}`}>
              {slideLabels[slide - 1]}
            </span>
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Slide 1: Experience - Moat Builder */}
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
              
              <motion.h2 
                className="text-2xl font-bold mb-2 flex items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Castle className="w-7 h-7 text-primary" />
                Build Your Company's Moat
              </motion.h2>
              <motion.p 
                className="text-muted-foreground mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Select up to 3 competitive advantages and watch how they protect profits over time.
              </motion.p>

              {/* Moat Selection */}
              <div className="grid md:grid-cols-5 gap-3 mb-8">
                {moatTypes.map((moat, idx) => {
                  const Icon = moat.icon;
                  const isSelected = selectedMoats.includes(moat.id);
                  
                  return (
                    <motion.div
                      key={moat.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * idx }}
                      onClick={() => toggleMoat(moat.id)}
                      className={`p-4 rounded-xl border-2 cursor-pointer text-center transition-all ${
                        isSelected 
                          ? "border-primary bg-primary/10" 
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <motion.div
                        animate={isSelected ? { scale: [1, 1.2, 1] } : {}}
                        transition={{ duration: 0.3 }}
                      >
                        <Icon className={`w-8 h-8 mx-auto mb-2 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                      </motion.div>
                      <p className="font-semibold text-sm mb-1">{moat.name}</p>
                      <p className="text-xs text-muted-foreground">{moat.description}</p>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="mt-2"
                        >
                          <CheckCircle className="w-5 h-5 text-primary mx-auto" />
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {/* Metrics Display */}
              <Card className="p-6 bg-muted/50 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" />
                    Company Metrics
                  </h3>
                  <Badge variant="secondary">{selectedMoats.length}/3 Moats Selected</Badge>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Profit Durability</span>
                      <span className="font-bold text-primary">{profitDurability}%</span>
                    </div>
                    <Progress value={profitDurability} className="h-4" />
                    <p className="text-xs text-muted-foreground mt-1">
                      How long profits can withstand competition
                    </p>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Profit Margin Potential</span>
                      <span className="font-bold text-emerald-500">{profitMargin}%</span>
                    </div>
                    <Progress value={profitMargin} className="h-4 [&>div]:bg-emerald-500" />
                    <p className="text-xs text-muted-foreground mt-1">
                      Sustainable profit margin with moats
                    </p>
                  </div>
                </div>

                {selectedMoats.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-6 pt-4 border-t border-border"
                  >
                    <p className="text-sm font-medium mb-2">Active Moats:</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedMoats.map(moatId => {
                        const moat = moatTypes.find(m => m.id === moatId);
                        return moat ? (
                          <Badge key={moatId} className="bg-primary/20 text-primary">
                            {moat.name} (+{moat.durabilityBoost}% dur, +{moat.profitBoost}% margin)
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  </motion.div>
                )}
              </Card>

              <motion.div 
                className="flex justify-center relative z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Button 
                  onClick={nextSlide} 
                  size="lg" 
                  className="gap-2"
                  disabled={selectedMoats.length < 1}
                >
                  Continue to Reflect <ArrowRight className="w-4 h-4" />
                </Button>
              </motion.div>
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
              
              <motion.h2 
                className="text-2xl font-bold text-center mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Which Moat Fits Best?
              </motion.h2>
              <motion.p 
                className="text-center text-muted-foreground mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Different businesses need different competitive advantages
              </motion.p>

              {/* Scenario Card */}
              <Card className="p-6 bg-muted/50 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <Castle className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold">{reflectionScenarios[reflectionIndex].company}</h3>
                    <p className="text-sm text-muted-foreground">{reflectionScenarios[reflectionIndex].description}</p>
                  </div>
                </div>

                <h4 className="font-semibold mb-4">{reflectionScenarios[reflectionIndex].question}</h4>

                <div className="space-y-3">
                  {reflectionScenarios[reflectionIndex].options.map((option, idx) => (
                    <motion.button
                      key={idx}
                      onClick={() => handleReflectionAnswer(option.correct)}
                      className={`w-full p-4 rounded-xl text-left border-2 transition-all ${
                        reflectionAnswers[reflectionIndex] !== undefined
                          ? option.correct
                            ? "border-emerald-500 bg-emerald-500/10"
                            : "border-border opacity-50"
                          : "border-border hover:border-primary"
                      }`}
                      disabled={reflectionAnswers[reflectionIndex] !== undefined}
                      whileHover={reflectionAnswers[reflectionIndex] === undefined ? { scale: 1.02 } : {}}
                    >
                      <span className="font-medium">{option.moat}</span>
                      {reflectionAnswers[reflectionIndex] !== undefined && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="text-sm text-muted-foreground mt-2"
                        >
                          {option.feedback}
                        </motion.p>
                      )}
                    </motion.button>
                  ))}
                </div>
              </Card>

              {/* Progress Dots */}
              <div className="flex justify-center gap-2 mb-8">
                {reflectionScenarios.map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-3 h-3 rounded-full transition-all ${
                      idx === reflectionIndex
                        ? "bg-primary scale-125"
                        : reflectionAnswers[idx] !== undefined
                          ? reflectionAnswers[idx]
                            ? "bg-emerald-500"
                            : "bg-destructive"
                          : "bg-muted"
                    }`}
                  />
                ))}
              </div>

              <motion.div 
                className="flex justify-center relative z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Button 
                  onClick={nextSlide} 
                  size="lg" 
                  className="gap-2"
                  disabled={reflectionAnswers.length < reflectionScenarios.length}
                >
                  Continue to Insight <ArrowRight className="w-4 h-4" />
                </Button>
              </motion.div>
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
              
              <motion.h2 
                className="text-2xl font-bold text-center mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Warren Buffett's Moat Framework
              </motion.h2>

              <div className="grid md:grid-cols-2 gap-4 mb-8">
                {moatTypes.map((moat, idx) => {
                  const Icon = moat.icon;
                  return (
                    <motion.div
                      key={moat.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * idx }}
                      className="p-4 rounded-xl border border-border bg-muted/30"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <Icon className="w-6 h-6 text-primary" />
                        <h3 className="font-bold">{moat.name}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{moat.description}</p>
                      <p className="text-xs text-primary">Examples: {moat.example}</p>
                    </motion.div>
                  );
                })}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="p-6 rounded-xl bg-primary/10 border border-primary/30 mb-8"
              >
                <div className="flex items-start gap-3">
                  <Sparkles className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold mb-2">"The key to investing is not assessing how much an industry will affect society, but rather determining the competitive advantage of any given company and, above all, the durability of that advantage."</h3>
                    <p className="text-sm text-muted-foreground">— Warren Buffett</p>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                className="flex justify-center relative z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <Button onClick={nextSlide} size="lg" className="gap-2">
                  Apply What You Learned <ArrowRight className="w-4 h-4" />
                </Button>
              </motion.div>
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
              
              <motion.h2 
                className="text-2xl font-bold text-center mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Design a Durable Business
              </motion.h2>
              <motion.p 
                className="text-center text-muted-foreground mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Create a company and select the moats that would make it successful
              </motion.p>

              <Card className="p-6 bg-muted/50 mb-6">
                <div className="mb-4">
                  <label className="text-sm font-medium mb-2 block">Company Name</label>
                  <input
                    type="text"
                    placeholder="e.g., CloudSecure Technologies"
                    value={challengeCompany}
                    onChange={(e) => setChallengeCompany(e.target.value)}
                    className="w-full p-3 rounded-lg bg-background border border-border focus:border-primary outline-none"
                  />
                </div>

                <div className="mb-4">
                  <label className="text-sm font-medium mb-2 block">Select 2-3 Moats</label>
                  <div className="flex flex-wrap gap-2">
                    {moatTypes.map(moat => {
                      const isSelected = challengeMoats.includes(moat.id);
                      return (
                        <Button
                          key={moat.id}
                          variant={isSelected ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            if (isSelected) {
                              setChallengeMoats(challengeMoats.filter(m => m !== moat.id));
                            } else if (challengeMoats.length < 3) {
                              setChallengeMoats([...challengeMoats, moat.id]);
                            }
                          }}
                          className="gap-1"
                        >
                          {isSelected ? <CheckCircle className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                          {moat.name}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              </Card>

              {challengeCompany && challengeMoats.length >= 2 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-6 rounded-xl bg-emerald-500/20 border border-emerald-500/50 mb-8"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Castle className="w-8 h-8 text-emerald-500" />
                    <h3 className="font-bold text-lg">{challengeCompany}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    With {challengeMoats.map(id => moatTypes.find(m => m.id === id)?.name).join(" and ")}, 
                    your company has strong competitive advantages that can protect profits for years.
                  </p>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-emerald-500" />
                    <span className="font-semibold text-emerald-500">Excellent moat combination!</span>
                  </div>
                </motion.div>
              )}

              <motion.div 
                className="flex justify-center relative z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Button 
                  onClick={nextSlide} 
                  size="lg" 
                  className="gap-2"
                  disabled={!challengeCompany || challengeMoats.length < 2}
                >
                  Complete Lesson <CheckCircle className="w-4 h-4" />
                </Button>
              </motion.div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

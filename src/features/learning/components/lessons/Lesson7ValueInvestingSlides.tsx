import { useState, useEffect } from "react";
import { SliderSimulator } from "../interactive/SliderSimulator";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, DollarSign, Search, TrendingUp, TrendingDown, Scale, Sparkles, Target, AlertTriangle, CheckCircle, XCircle, Building, BarChart3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, ReferenceLine, Cell } from "recharts";

type Slide = 1 | 2 | 3 | 4;

interface Lesson7Props {
  onComplete?: () => void;
}

const COMPANIES = [
  { 
    name: "TechGrowth Inc", 
    ticker: "TGI",
    price: 150, 
    intrinsicValue: 80, 
    pe: 45, 
    pbv: 8,
    description: "High-growth tech company with no profits yet",
    verdict: "overvalued"
  },
  { 
    name: "StableBank Corp", 
    ticker: "SBC",
    price: 45, 
    intrinsicValue: 70, 
    pe: 8, 
    pbv: 0.9,
    description: "Boring but profitable regional bank",
    verdict: "undervalued"
  },
  { 
    name: "FairValue Ltd", 
    ticker: "FVL",
    price: 100, 
    intrinsicValue: 105, 
    pe: 18, 
    pbv: 2.5,
    description: "Established consumer goods company",
    verdict: "fairvalue"
  },
  { 
    name: "DeepDiscount Co", 
    ticker: "DDC",
    price: 25, 
    intrinsicValue: 60, 
    pe: 5, 
    pbv: 0.4,
    description: "Struggling retailer with hidden assets",
    verdict: "undervalued"
  },
];

const VALUATION_METRICS = [
  { name: "P/E Ratio", description: "Price / Earnings. Lower = cheaper (usually <15 is good)", icon: BarChart3 },
  { name: "P/B Ratio", description: "Price / Book Value. <1 means trading below asset value", icon: Building },
  { name: "Intrinsic Value", description: "True worth based on future cash flows", icon: DollarSign },
  { name: "Margin of Safety", description: "Buy at discount to intrinsic value for protection", icon: Target },
];

export const Lesson7ValueInvestingSlides = ({ onComplete }: Lesson7Props) => {
  const [currentSlide, setCurrentSlide] = useState<Slide>(1);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [selectedCompany, setSelectedCompany] = useState(0);
  const [userGuesses, setUserGuesses] = useState<string[]>([]);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [priceEstimate, setPriceEstimate] = useState(50);
  const [companyIndex, setCompanyIndex] = useState(0);

  const learnTexts = [
    "Price is what you pay. Value is what you get.",
    "The stock market is filled with opportunities to buy $1 for $0.50.",
    "A margin of safety protects you from errors in judgment.",
    "Patience is the value investor's greatest virtue.",
  ];

  useEffect(() => {
    if (currentSlide === 1) {
      const interval = setInterval(() => {
        setCurrentTextIndex(prev => (prev + 1) % learnTexts.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [currentSlide]);

  const nextSlide = () => {
    if (currentSlide < 4) {
      setCurrentSlide((currentSlide + 1) as Slide);
    } else {
      onComplete?.();
    }
  };

  const prevSlide = () => {
    if (currentSlide > 1) {
      setCurrentSlide((currentSlide - 1) as Slide);
    }
  };

  const handleGuess = (verdict: string) => {
    setUserGuesses([...userGuesses, verdict]);
    setShowAnalysis(true);
  };

  const nextCompany = () => {
    if (companyIndex < COMPANIES.length - 1) {
      setCompanyIndex(companyIndex + 1);
      setShowAnalysis(false);
    }
  };

  const company = COMPANIES[selectedCompany];
  const currentCompany = COMPANIES[companyIndex];
  const marginOfSafety = ((company.intrinsicValue - company.price) / company.intrinsicValue * 100).toFixed(0);
  
  const score = userGuesses.filter((guess, i) => guess === COMPANIES[i]?.verdict).length;

  const slideLabels = ["Learn", "Explore", "Insight", "Apply"];

  const priceVsValueData = COMPANIES.map(c => ({
    name: c.ticker,
    price: c.price,
    value: c.intrinsicValue,
    gap: c.intrinsicValue - c.price
  }));

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
        {/* Slide 1: Learn - Price vs Value */}
        {currentSlide === 1 && (
          <motion.div
            key="slide1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-8">
              <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">Learn</Badge>
              
              <motion.h2 
                className="text-2xl font-bold mb-2 flex items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <DollarSign className="w-6 h-6" /> Price vs Intrinsic Value
              </motion.h2>

              {/* Interactive Price/Value Comparison */}
              <div className="my-8">
                <p className="text-center text-muted-foreground mb-6">Drag to estimate the true value of this asset</p>
                
                {/* Visual Price Tag */}
                <div className="flex justify-center items-center gap-8 mb-8">
                  <motion.div 
                    className="p-6 rounded-xl bg-muted/30 text-center"
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                  >
                    <p className="text-sm text-muted-foreground mb-1">Market Price</p>
                    <p className="text-4xl font-bold text-primary">$100</p>
                    <p className="text-xs text-muted-foreground mt-1">What the market says</p>
                  </motion.div>

                  <Scale className="w-10 h-10 text-muted-foreground" />

                  <motion.div 
                    className={`p-6 rounded-xl text-center ${
                      priceEstimate > 100 ? 'bg-emerald-500/20 border-emerald-500/30' : 
                      priceEstimate < 100 ? 'bg-red-500/20 border-red-500/30' : 
                      'bg-muted/30'
                    } border-2`}
                    key={priceEstimate}
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                  >
                    <p className="text-sm text-muted-foreground mb-1">Your Value Estimate</p>
                    <p className="text-4xl font-bold">${priceEstimate}</p>
                    <p className="text-xs text-muted-foreground mt-1">What you think it's worth</p>
                  </motion.div>
                </div>

                <div className="max-w-md mx-auto">
                  <Slider
                    value={[priceEstimate]}
                    onValueChange={(v) => setPriceEstimate(v[0])}
                    min={20}
                    max={180}
                    step={5}
                    className="mb-4"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Deeply Undervalued</span>
                    <span>Fair Value</span>
                    <span>Overvalued</span>
                  </div>
                </div>

                {/* Result Display */}
                <motion.div 
                  className="mt-6 p-4 rounded-lg text-center"
                  key={priceEstimate}
                  initial={{ opacity: 0.5 }}
                  animate={{ opacity: 1 }}
                  style={{
                    backgroundColor: priceEstimate > 100 ? 'rgba(34, 197, 94, 0.1)' : 
                                    priceEstimate < 100 ? 'rgba(239, 68, 68, 0.1)' : 
                                    'rgba(234, 179, 8, 0.1)'
                  }}
                >
                  {priceEstimate > 120 && (
                    <p className="text-emerald-400 font-semibold">Strong Buy Signal! You see 20%+ upside potential.</p>
                  )}
                  {priceEstimate > 100 && priceEstimate <= 120 && (
                    <p className="text-emerald-400 font-semibold">Potential opportunity. Small margin of safety.</p>
                  )}
                  {priceEstimate === 100 && (
                    <p className="text-amber-400 font-semibold">Fairly valued. No clear edge.</p>
                  )}
                  {priceEstimate < 100 && priceEstimate >= 80 && (
                    <p className="text-red-400 font-semibold">Slightly overvalued. Proceed with caution.</p>
                  )}
                  {priceEstimate < 80 && (
                    <p className="text-red-400 font-semibold">Overpriced! Avoid or consider selling.</p>
                  )}
                </motion.div>
              </div>

              {/* Animated Text */}
              <motion.div 
                className="p-4 bg-muted/30 rounded-lg min-h-[60px] flex items-center justify-center"
                key={currentTextIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <p className="text-center text-muted-foreground italic">"{learnTexts[currentTextIndex]}"</p>
              </motion.div>

              <motion.div 
                className="flex justify-center mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Button onClick={nextSlide} size="lg" className="gap-2">
                  Explore Valuation <ArrowRight className="w-4 h-4" />
                </Button>
              </motion.div>
            </Card>
          </motion.div>
        )}

        {/* Slide 2: Explore - Company Analysis */}
        {currentSlide === 2 && (
          <motion.div
            key="slide2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-8">
              <Badge className="mb-4 bg-amber-500/20 text-amber-400 border-amber-500/30">Explore</Badge>

              <motion.h2 
                className="text-2xl font-bold text-center mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                Analyze Real Companies
              </motion.h2>
              <motion.p 
                className="text-center text-muted-foreground mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Click on companies to see their valuation metrics
              </motion.p>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Company Selector */}
                <div className="space-y-3">
                  {COMPANIES.map((c, i) => (
                    <motion.div
                      key={c.ticker}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        selectedCompany === i ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => setSelectedCompany(i)}
                      whileHover={{ scale: 1.02 }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold">{c.name}</p>
                          <p className="text-xs text-muted-foreground">{c.ticker}</p>
                        </div>
                        <p className="text-xl font-bold">${c.price}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Company Details */}
                <motion.div 
                  key={selectedCompany}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h4 className="font-semibold mb-2">{company.name}</h4>
                    <p className="text-sm text-muted-foreground">{company.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-muted/30 rounded-lg text-center">
                      <p className="text-xs text-muted-foreground">Price</p>
                      <p className="text-xl font-bold">${company.price}</p>
                    </div>
                    <div className="p-3 bg-emerald-500/10 rounded-lg text-center">
                      <p className="text-xs text-muted-foreground">Intrinsic Value</p>
                      <p className="text-xl font-bold text-emerald-400">${company.intrinsicValue}</p>
                    </div>
                    <div className="p-3 bg-muted/30 rounded-lg text-center">
                      <p className="text-xs text-muted-foreground">P/E Ratio</p>
                      <p className={`text-xl font-bold ${company.pe > 25 ? 'text-red-400' : company.pe < 15 ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {company.pe}x
                      </p>
                    </div>
                    <div className="p-3 bg-muted/30 rounded-lg text-center">
                      <p className="text-xs text-muted-foreground">P/B Ratio</p>
                      <p className={`text-xl font-bold ${company.pbv > 3 ? 'text-red-400' : company.pbv < 1 ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {company.pbv}x
                      </p>
                    </div>
                  </div>

                  {/* Verdict */}
                  <div className={`p-4 rounded-lg border-2 ${
                    company.verdict === 'undervalued' ? 'border-emerald-500 bg-emerald-500/10' :
                    company.verdict === 'overvalued' ? 'border-red-500 bg-red-500/10' :
                    'border-amber-500 bg-amber-500/10'
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      {company.verdict === 'undervalued' && <CheckCircle className="w-5 h-5 text-emerald-400" />}
                      {company.verdict === 'overvalued' && <XCircle className="w-5 h-5 text-red-400" />}
                      {company.verdict === 'fairvalue' && <Scale className="w-5 h-5 text-amber-400" />}
                      <p className="font-semibold capitalize">{company.verdict.replace('fairvalue', 'Fairly Valued')}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Margin of Safety: <span className={Number(marginOfSafety) > 0 ? 'text-emerald-400' : 'text-red-400'}>{marginOfSafety}%</span>
                    </p>
                  </div>
                </motion.div>
              </div>

              <motion.div 
                className="flex justify-between mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <Button variant="outline" onClick={prevSlide}>Back</Button>
                <Button onClick={nextSlide} size="lg" className="gap-2">
                  Continue to Insight <ArrowRight className="w-4 h-4" />
                </Button>
              </motion.div>
            </Card>
          </motion.div>
        )}

        {/* Slide 3: Insight - Key Principles */}
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
                className="text-2xl font-bold text-center mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Value Investing Principles
              </motion.h2>
              <motion.p 
                className="text-center text-muted-foreground mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                The wisdom of Graham and Buffett
              </motion.p>

              {/* Valuation Metrics Grid */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {VALUATION_METRICS.map((metric, i) => (
                  <motion.div
                    key={metric.name}
                    className="p-4 bg-muted/30 rounded-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-lg bg-primary/20">
                        <metric.icon className="w-5 h-5 text-primary" />
                      </div>
                      <h4 className="font-semibold">{metric.name}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">{metric.description}</p>
                  </motion.div>
                ))}
              </div>

              {/* Price vs Value Chart */}
              <motion.div 
                className="p-4 bg-muted/30 rounded-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <h4 className="font-semibold mb-4 text-center">Price vs Intrinsic Value</h4>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={priceVsValueData} layout="vertical">
                      <XAxis type="number" domain={[0, 160]} stroke="hsl(var(--muted-foreground))" fontSize={10} />
                      <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" fontSize={10} width={40} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                      />
                      <Bar dataKey="price" name="Market Price" fill="#3b82f6" />
                      <Bar dataKey="value" name="Intrinsic Value" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-6 mt-2 text-sm">
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-blue-500" /> Market Price
                  </span>
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-emerald-500" /> Intrinsic Value
                  </span>
                </div>
              </motion.div>

              {/* Key Quote */}
              <motion.div 
                className="mt-6 p-4 bg-primary/10 border border-primary/30 rounded-lg text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <p className="italic">"It's far better to buy a wonderful company at a fair price than a fair company at a wonderful price."</p>
                <p className="text-sm text-muted-foreground mt-2">— Warren Buffett</p>
              </motion.div>

              <motion.div 
                className="flex justify-between mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <Button variant="outline" onClick={prevSlide}>Back</Button>
                <Button onClick={nextSlide} size="lg" className="gap-2">
                  Apply Your Knowledge <ArrowRight className="w-4 h-4" />
                </Button>
              </motion.div>
            </Card>
          </motion.div>
        )}

        {/* Slide 4: Apply - Valuation Quiz */}
        {currentSlide === 4 && (
          <motion.div
            key="slide4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-8">
              <Badge className="mb-4 bg-violet-500/20 text-violet-400 border-violet-500/30">Apply</Badge>

              <motion.h2 
                className="text-2xl font-bold text-center mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Spot the Value
              </motion.h2>
              <motion.p 
                className="text-center text-muted-foreground mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Is this company undervalued, overvalued, or fairly priced?
              </motion.p>

              {companyIndex < COMPANIES.length ? (
                <motion.div 
                  key={companyIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  {/* Company Card */}
                  <div className="p-6 bg-muted/30 rounded-xl">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Company {companyIndex + 1} of {COMPANIES.length}</p>
                        <h3 className="text-xl font-bold">{currentCompany.name}</h3>
                        <p className="text-sm text-muted-foreground">{currentCompany.description}</p>
                      </div>
                      <Badge variant="outline">{currentCompany.ticker}</Badge>
                    </div>

                    <div className="grid grid-cols-4 gap-3 mt-4">
                      <div className="text-center p-2 bg-background/50 rounded">
                        <p className="text-xs text-muted-foreground">Price</p>
                        <p className="font-bold">${currentCompany.price}</p>
                      </div>
                      <div className="text-center p-2 bg-background/50 rounded">
                        <p className="text-xs text-muted-foreground">Value</p>
                        <p className="font-bold text-emerald-400">${currentCompany.intrinsicValue}</p>
                      </div>
                      <div className="text-center p-2 bg-background/50 rounded">
                        <p className="text-xs text-muted-foreground">P/E</p>
                        <p className="font-bold">{currentCompany.pe}x</p>
                      </div>
                      <div className="text-center p-2 bg-background/50 rounded">
                        <p className="text-xs text-muted-foreground">P/B</p>
                        <p className="font-bold">{currentCompany.pbv}x</p>
                      </div>
                    </div>
                  </div>

                  {!showAnalysis ? (
                    <div className="grid grid-cols-3 gap-3">
                      <Button
                        variant="outline"
                        className="h-16 flex flex-col gap-1 border-emerald-500/30 hover:bg-emerald-500/10"
                        onClick={() => handleGuess("undervalued")}
                      >
                        <TrendingUp className="w-5 h-5 text-emerald-400" />
                        <span className="text-sm">Undervalued</span>
                      </Button>
                      <Button
                        variant="outline"
                        className="h-16 flex flex-col gap-1 border-amber-500/30 hover:bg-amber-500/10"
                        onClick={() => handleGuess("fairvalue")}
                      >
                        <Scale className="w-5 h-5 text-amber-400" />
                        <span className="text-sm">Fair Value</span>
                      </Button>
                      <Button
                        variant="outline"
                        className="h-16 flex flex-col gap-1 border-red-500/30 hover:bg-red-500/10"
                        onClick={() => handleGuess("overvalued")}
                      >
                        <TrendingDown className="w-5 h-5 text-red-400" />
                        <span className="text-sm">Overvalued</span>
                      </Button>
                    </div>
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      <div className={`p-4 rounded-lg border ${
                        userGuesses[companyIndex] === currentCompany.verdict
                          ? 'border-emerald-500 bg-emerald-500/10'
                          : 'border-red-500 bg-red-500/10'
                      }`}>
                        <div className="flex items-center gap-2 mb-2">
                          {userGuesses[companyIndex] === currentCompany.verdict ? (
                            <CheckCircle className="w-5 h-5 text-emerald-400" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-400" />
                          )}
                          <p className="font-semibold">
                            {userGuesses[companyIndex] === currentCompany.verdict
                              ? "Correct!" 
                              : `The answer was: ${currentCompany.verdict.replace('fairvalue', 'Fair Value')}`}
                          </p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Price ${currentCompany.price} vs Value ${currentCompany.intrinsicValue} = {
                            ((currentCompany.intrinsicValue - currentCompany.price) / currentCompany.intrinsicValue * 100).toFixed(0)
                          }% margin of safety
                        </p>
                      </div>
                      
                      {companyIndex < COMPANIES.length - 1 ? (
                        <Button onClick={nextCompany} className="w-full">
                          Next Company <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      ) : (
                        <div className="text-center space-y-4">
                          <div className="p-4 bg-primary/10 rounded-lg">
                            <p className="text-lg font-bold">Your Score: {score}/{COMPANIES.length}</p>
                            <p className="text-sm text-muted-foreground">
                              {score === COMPANIES.length ? "Perfect! You have a value investor's eye." :
                               score >= COMPANIES.length / 2 ? "Good valuation skills!" :
                               "Keep practicing - value investing takes time to master!"}
                            </p>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              ) : null}

              {/* Margin of Safety Calculator */}
              <SliderSimulator
                title="🔍 Margin of Safety Calculator"
                description="Adjust the stock price and intrinsic value to see the margin of safety:"
                sliders={[
                  { id: "price", label: "Stock Price", min: 10, max: 200, step: 5, defaultValue: 80, unit: "$" },
                  { id: "value", label: "Intrinsic Value", min: 10, max: 200, step: 5, defaultValue: 120, unit: "$" },
                ]}
                calculateResult={(vals) => {
                  const margin = ((vals.value - vals.price) / vals.value * 100);
                  const verdict = margin > 30 ? "Strong buy" : margin > 15 ? "Potential buy" : margin > 0 ? "Fair value" : "Overvalued";
                  return {
                    primary: `${margin.toFixed(1)}% margin`,
                    secondary: verdict,
                    insight: margin > 25 ? "Warren Buffett looks for at least 25% margin of safety!" : margin < 0 ? "Price exceeds intrinsic value — risk of overpaying." : "Consider waiting for a wider margin.",
                  };
                }}
              />

              <motion.div
                className="flex justify-between mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Button variant="outline" onClick={prevSlide}>Back</Button>
                <Button 
                  onClick={nextSlide} 
                  size="lg" 
                  className="gap-2 bg-gradient-to-r from-violet-500 to-blue-500"
                  disabled={userGuesses.length < COMPANIES.length}
                >
                  <Sparkles className="w-4 h-4" /> Complete Lesson
                </Button>
              </motion.div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

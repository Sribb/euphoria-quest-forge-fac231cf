import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { 
  Wallet, Lock, Sprout, Sun, Cloud, CloudRain, Snowflake, Zap,
  TrendingDown, TrendingUp, AlertTriangle, Trophy, Sparkles,
  MessageCircle, Timer, Leaf, TreeDeciduous, Trees, Mountain,
  ThermometerSun, Wind, CloudLightning, HelpCircle, X, Award
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type Phase = "intro" | "path-selection" | "safe-vault" | "garden" | "portfolio-review";
type PathChoice = "vault" | "garden" | null;
type RiskLevel = 1 | 2 | 3 | 4 | 5;
type TimeHorizon = "short" | "medium" | "long";

const weatherIcons: Record<RiskLevel, React.ElementType> = {
  1: Sun,
  2: Cloud,
  3: Wind,
  4: CloudRain,
  5: CloudLightning
};

const weatherLabels: Record<RiskLevel, string> = {
  1: "Calm & Sunny",
  2: "Partly Cloudy",
  3: "Windy",
  4: "Stormy",
  5: "Hurricane"
};

const weatherColors: Record<RiskLevel, string> = {
  1: "text-yellow-400",
  2: "text-gray-400",
  3: "text-blue-400",
  4: "text-purple-400",
  5: "text-red-500"
};

const seasonIcons: Record<TimeHorizon, React.ElementType> = {
  short: Leaf,
  medium: TreeDeciduous,
  long: Trees
};

const seasonLabels: Record<TimeHorizon, string> = {
  short: "Spring (1-3 years)",
  medium: "Summer (5-10 years)",
  long: "Forest (15-30 years)"
};

const getExpectedReturn = (risk: RiskLevel): number => {
  const returns: Record<RiskLevel, number> = { 1: 2, 2: 4, 3: 7, 4: 10, 5: 14 };
  return returns[risk];
};

const getVolatility = (risk: RiskLevel): number => {
  const volatility: Record<RiskLevel, number> = { 1: 2, 2: 5, 3: 12, 4: 20, 5: 35 };
  return volatility[risk];
};

const getTimeYears = (time: TimeHorizon): number => {
  const years: Record<TimeHorizon, number> = { short: 2, medium: 7, long: 20 };
  return years[time];
};

export const FinancialLifeSimulator = () => {
  const [phase, setPhase] = useState<Phase>("intro");
  const [selectedPath, setSelectedPath] = useState<PathChoice>(null);
  const [walletBalance] = useState(1000);
  
  // Vault state
  const [vaultTime, setVaultTime] = useState(0);
  const [purchasingPower, setPurchasingPower] = useState(100);
  const [vaultHistory, setVaultHistory] = useState<{ year: number; nominal: number; real: number }[]>([]);
  
  // Garden state
  const [riskLevel, setRiskLevel] = useState<RiskLevel>(3);
  const [timeHorizon, setTimeHorizon] = useState<TimeHorizon>("medium");
  const [monthlyContribution, setMonthlyContribution] = useState(100);
  const [gardenSimulated, setGardenSimulated] = useState(false);
  const [gardenHistory, setGardenHistory] = useState<{ year: number; value: number; contributions: number }[]>([]);
  const [marketDip, setMarketDip] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");
  
  // Help bot state
  const [showHelpBot, setShowHelpBot] = useState(false);
  const [helpBotMessage, setHelpBotMessage] = useState("");
  const [helpBotShown, setHelpBotShown] = useState<Set<string>>(new Set());
  
  // Portfolio review state
  const [stabilityScore, setStabilityScore] = useState(0);
  const [growthScore, setGrowthScore] = useState(0);
  const [overallGrade, setOverallGrade] = useState("");
  const [xpEarned, setXpEarned] = useState(0);

  // Vault inflation simulation
  useEffect(() => {
    if (phase !== "safe-vault") return;
    
    const interval = setInterval(() => {
      setVaultTime(prev => {
        const newTime = prev + 1;
        if (newTime <= 20) {
          // 3% annual inflation
          const inflationRate = 0.03;
          const newPurchasingPower = 100 * Math.pow(1 - inflationRate, newTime);
          setPurchasingPower(newPurchasingPower);
          
          // Savings rate 0.5%
          const nominalValue = walletBalance * Math.pow(1.005, newTime);
          const realValue = nominalValue / Math.pow(1 + inflationRate, newTime);
          
          setVaultHistory(prev => [...prev, { 
            year: newTime, 
            nominal: nominalValue, 
            real: realValue 
          }]);
        }
        return newTime;
      });
    }, 800);
    
    return () => clearInterval(interval);
  }, [phase, walletBalance]);

  // Check for risk/time mismatch warnings
  useEffect(() => {
    if (phase !== "garden") return;
    
    if (riskLevel >= 4 && timeHorizon === "short" && !helpBotShown.has("high-risk-short")) {
      setWarningMessage("Warning: Benjamin Graham notes that short-term volatility is high; without patience, you're gambling, not investing.");
      setShowWarning(true);
      setHelpBotShown(prev => new Set([...prev, "high-risk-short"]));
    } else if (riskLevel === 1 && timeHorizon === "long" && !helpBotShown.has("low-risk-long")) {
      setWarningMessage("Tip: Warren Buffett says 'Our favorite holding period is forever.' With a long horizon, you can afford more risk for potentially higher returns.");
      setShowWarning(true);
      setHelpBotShown(prev => new Set([...prev, "low-risk-long"]));
    }
  }, [riskLevel, timeHorizon, phase, helpBotShown]);

  const simulateGarden = useCallback(() => {
    const years = getTimeYears(timeHorizon);
    const expectedReturn = getExpectedReturn(riskLevel) / 100;
    const volatility = getVolatility(riskLevel) / 100;
    
    let portfolio = walletBalance;
    let totalContributions = walletBalance;
    const history: { year: number; value: number; contributions: number }[] = [
      { year: 0, value: walletBalance, contributions: walletBalance }
    ];
    
    let hadDip = false;
    
    for (let year = 1; year <= years; year++) {
      // Monthly contributions
      totalContributions += monthlyContribution * 12;
      portfolio += monthlyContribution * 12;
      
      // Market return with volatility
      const randomReturn = expectedReturn + (Math.random() - 0.5) * volatility * 2;
      
      // Simulate market dip in year 3 for high-risk portfolios
      if (year === 3 && riskLevel >= 4 && !hadDip) {
        portfolio *= 0.75; // 25% drop
        hadDip = true;
        setMarketDip(true);
        
        if (!helpBotShown.has("market-dip")) {
          setTimeout(() => {
            setHelpBotMessage("This is a market correction. Successful investors use discipline to stay the course instead of panic-selling. History shows markets recover – patience is key!");
            setShowHelpBot(true);
            setHelpBotShown(prev => new Set([...prev, "market-dip"]));
          }, 1500);
        }
      } else {
        portfolio *= (1 + randomReturn);
      }
      
      history.push({ year, value: portfolio, contributions: totalContributions });
    }
    
    setGardenHistory(history);
    setGardenSimulated(true);
  }, [riskLevel, timeHorizon, monthlyContribution, walletBalance, helpBotShown]);

  const generateCompoundChart = () => {
    const years = 30;
    const data: { year: number; early: number; late: number; contributions: number }[] = [];
    
    const earlyReturn = getExpectedReturn(riskLevel) / 100;
    let earlyValue = walletBalance;
    let lateValue = 0;
    let contributions = walletBalance;
    
    for (let year = 0; year <= years; year++) {
      if (year >= 10) {
        lateValue = lateValue === 0 ? walletBalance : lateValue;
        lateValue += monthlyContribution * 12;
        lateValue *= (1 + earlyReturn);
      }
      
      if (year > 0) {
        earlyValue += monthlyContribution * 12;
        earlyValue *= (1 + earlyReturn);
        contributions += monthlyContribution * 12;
      }
      
      data.push({ 
        year, 
        early: Math.round(earlyValue), 
        late: Math.round(lateValue),
        contributions: Math.round(contributions)
      });
    }
    
    return data;
  };

  const calculatePortfolioReview = () => {
    let stability = 0;
    let growth = 0;
    let xp = 50; // Base XP
    
    if (selectedPath === "vault") {
      stability = 90;
      growth = 10;
      xp += 20; // Understanding safety
    } else if (selectedPath === "garden") {
      stability = Math.max(20, 100 - riskLevel * 18);
      growth = Math.min(100, riskLevel * 20);
      
      // Time horizon bonus
      if (timeHorizon === "long") {
        xp += 50;
        stability += 10;
      } else if (timeHorizon === "medium") {
        xp += 30;
      } else {
        xp += 10;
      }
      
      // Balanced approach bonus
      if (riskLevel >= 2 && riskLevel <= 4) {
        xp += 30;
      }
      
      // Monthly contribution bonus
      if (monthlyContribution >= 100) {
        xp += 20;
      }
    }
    
    // Calculate grade
    const balance = Math.abs(stability - growth);
    let grade = "";
    if (balance < 20) {
      grade = "A+";
      xp += 50;
    } else if (balance < 35) {
      grade = "A";
      xp += 40;
    } else if (balance < 50) {
      grade = "B+";
      xp += 30;
    } else if (balance < 65) {
      grade = "B";
      xp += 20;
    } else {
      grade = "C";
      xp += 10;
    }
    
    setStabilityScore(stability);
    setGrowthScore(growth);
    setOverallGrade(grade);
    setXpEarned(xp);
  };

  const handlePathSelect = (path: PathChoice) => {
    setSelectedPath(path);
    if (path === "vault") {
      setPhase("safe-vault");
      setVaultHistory([{ year: 0, nominal: walletBalance, real: walletBalance }]);
    } else {
      setPhase("garden");
    }
  };

  const goToReview = () => {
    calculatePortfolioReview();
    setPhase("portfolio-review");
    toast.success("Portfolio Review Ready!");
  };

  const resetSimulator = () => {
    setPhase("intro");
    setSelectedPath(null);
    setVaultTime(0);
    setPurchasingPower(100);
    setVaultHistory([]);
    setRiskLevel(3);
    setTimeHorizon("medium");
    setMonthlyContribution(100);
    setGardenSimulated(false);
    setGardenHistory([]);
    setMarketDip(false);
    setShowWarning(false);
    setShowHelpBot(false);
    setHelpBotShown(new Set());
  };

  const renderIntro = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500/20 via-primary/20 to-purple-500/20 p-8 border border-primary/30">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl" />
        
        <div className="relative z-10 text-center">
          <Wallet className="h-20 w-20 mx-auto mb-4 text-primary animate-pulse" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent mb-2">
            Financial Life Simulator
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            Your journey to financial wisdom begins here
          </p>
          
          <div className="inline-flex items-center gap-3 px-6 py-4 bg-background/80 backdrop-blur-sm rounded-2xl border border-primary/30 shadow-lg">
            <Sparkles className="h-8 w-8 text-yellow-500" />
            <div className="text-left">
              <p className="text-sm text-muted-foreground">Your Digital Wallet</p>
              <p className="text-3xl font-bold text-primary">${walletBalance.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      <Card className="border-primary/30 bg-gradient-to-br from-background to-muted/30">
        <CardContent className="pt-6">
          <p className="text-lg text-center text-muted-foreground mb-6">
            You have ${walletBalance} to start your financial journey. But where will you put it?
            Your choice will shape your future wealth.
          </p>
          
          <Button 
            size="lg" 
            className="w-full bg-gradient-to-r from-primary to-emerald-500 hover:from-primary/90 hover:to-emerald-500/90"
            onClick={() => setPhase("path-selection")}
          >
            <Zap className="h-5 w-5 mr-2" />
            Begin Your Journey
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderPathSelection = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Choose Your Path</h2>
        <p className="text-muted-foreground">Two roads diverge... which will you take?</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* The Safe Vault */}
        <Card 
          className="group cursor-pointer border-2 border-transparent hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 bg-gradient-to-br from-blue-950/50 to-slate-900/50"
          onClick={() => handlePathSelect("vault")}
        >
          <CardContent className="pt-8 pb-8 text-center">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-2xl group-hover:bg-blue-500/30 transition-colors" />
              <Lock className="h-24 w-24 mx-auto text-blue-400 relative z-10 group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="text-2xl font-bold text-blue-400 mb-2">The Safe Vault</h3>
            <Badge variant="secondary" className="mb-4">Saving Path</Badge>
            <p className="text-muted-foreground mb-4">
              Keep your money safe and secure. Watch it grow slowly while
              understanding the true cost of "playing it safe."
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-blue-400">
              <Timer className="h-4 w-4" />
              <span>0.5% annual return</span>
            </div>
          </CardContent>
        </Card>

        {/* The Garden */}
        <Card 
          className="group cursor-pointer border-2 border-transparent hover:border-emerald-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10 bg-gradient-to-br from-emerald-950/50 to-slate-900/50"
          onClick={() => handlePathSelect("garden")}
        >
          <CardContent className="pt-8 pb-8 text-center">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-2xl group-hover:bg-emerald-500/30 transition-colors" />
              <Sprout className="h-24 w-24 mx-auto text-emerald-400 relative z-10 group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="text-2xl font-bold text-emerald-400 mb-2">The Garden</h3>
            <Badge variant="secondary" className="mb-4">Investing Path</Badge>
            <p className="text-muted-foreground mb-4">
              Plant your seeds and watch them grow. Navigate risk and time
              to cultivate your wealth through the market seasons.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-emerald-400">
              <TrendingUp className="h-4 w-4" />
              <span>2-14% potential return</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderSafeVault = () => {
    const currentNominal = vaultHistory[vaultHistory.length - 1]?.nominal || walletBalance;
    const currentReal = vaultHistory[vaultHistory.length - 1]?.real || walletBalance;
    
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Lock className="h-6 w-6 text-blue-400" />
            The Safe Vault
          </h2>
          <Badge variant="outline">Year {Math.min(vaultTime, 20)} of 20</Badge>
        </div>

        {/* Live Money Counter */}
        <Card className="border-blue-500/30 bg-gradient-to-br from-blue-950/30 to-background">
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="text-center p-6 bg-blue-500/10 rounded-xl">
                <p className="text-sm text-muted-foreground mb-2">Your Money (Nominal)</p>
                <p className="text-4xl font-bold text-blue-400 font-mono">
                  ${currentNominal.toFixed(2)}
                </p>
                <p className="text-sm text-green-500 mt-2">
                  +{((currentNominal - walletBalance) / walletBalance * 100).toFixed(2)}%
                </p>
              </div>
              
              <div className="text-center p-6 bg-red-500/10 rounded-xl">
                <p className="text-sm text-muted-foreground mb-2">Purchasing Power</p>
                <div className="relative">
                  <Progress 
                    value={purchasingPower} 
                    className="h-6 mb-2"
                  />
                  <span className="absolute inset-0 flex items-center justify-center text-sm font-bold">
                    {purchasingPower.toFixed(1)}%
                  </span>
                </div>
                <p className="text-2xl font-bold text-red-400 font-mono">
                  ${currentReal.toFixed(2)}
                </p>
                <p className="text-sm text-red-500">
                  Real value after inflation
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Inflation Visualization */}
        <Card className="border-muted">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-red-500" />
              The Hidden Tax: Inflation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={vaultHistory}>
                  <defs>
                    <linearGradient id="nominalGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(217 91% 60%)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(217 91% 60%)" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="realGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(0 84% 60%)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(0 84% 60%)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="year" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[600, 1200]} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                    formatter={(value: number) => [`$${value.toFixed(2)}`, '']}
                  />
                  <Area type="monotone" dataKey="nominal" stroke="hsl(217 91% 60%)" fill="url(#nominalGradient)" name="Nominal" />
                  <Area type="monotone" dataKey="real" stroke="hsl(0 84% 60%)" fill="url(#realGradient)" name="Real Value" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-4 text-sm">
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                Nominal Value
              </span>
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                Real Purchasing Power
              </span>
            </div>
          </CardContent>
        </Card>

        {vaultTime >= 20 && (
          <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <p className="text-yellow-500 font-medium">
              💡 After 20 years, your $1,000 grew to ${currentNominal.toFixed(2)} nominally, 
              but can only buy ${currentReal.toFixed(2)} worth of goods. 
              You "lost" ${(walletBalance - currentReal).toFixed(2)} in purchasing power!
            </p>
          </div>
        )}

        {vaultTime >= 20 && (
          <Button onClick={goToReview} className="w-full" size="lg">
            <Award className="h-5 w-5 mr-2" />
            View Portfolio Review
          </Button>
        )}
      </div>
    );
  };

  const renderGarden = () => {
    const WeatherIcon = weatherIcons[riskLevel];
    const SeasonIcon = seasonIcons[timeHorizon];
    const compoundData = generateCompoundChart();
    
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Sprout className="h-6 w-6 text-emerald-400" />
            The Garden
          </h2>
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400">
            Investing Mode
          </Badge>
        </div>

        {/* Risk Slider (Weather) */}
        <Card className="border-muted">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <WeatherIcon className={`h-5 w-5 ${weatherColors[riskLevel]}`} />
              Risk Level: {weatherLabels[riskLevel]}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <Sun className="h-5 w-5 text-yellow-400" />
              <CloudLightning className="h-5 w-5 text-red-500" />
            </div>
            <Slider
              value={[riskLevel]}
              min={1}
              max={5}
              step={1}
              onValueChange={(value) => setRiskLevel(value[0] as RiskLevel)}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Safe</span>
              <span>Moderate</span>
              <span>Aggressive</span>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg text-sm">
              <span className="text-muted-foreground">Expected Return: </span>
              <span className="font-bold text-emerald-400">{getExpectedReturn(riskLevel)}%</span>
              <span className="text-muted-foreground"> | Volatility: </span>
              <span className="font-bold text-orange-400">±{getVolatility(riskLevel)}%</span>
            </div>
          </CardContent>
        </Card>

        {/* Time Slider (Seasons) */}
        <Card className="border-muted">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <SeasonIcon className="h-5 w-5 text-emerald-400" />
              Time Horizon: {seasonLabels[timeHorizon]}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <Leaf className="h-5 w-5 text-green-400" />
              <TreeDeciduous className="h-5 w-5 text-emerald-500" />
              <Trees className="h-5 w-5 text-emerald-700" />
            </div>
            <Slider
              value={[timeHorizon === "short" ? 1 : timeHorizon === "medium" ? 2 : 3]}
              min={1}
              max={3}
              step={1}
              onValueChange={(value) => {
                const horizons: TimeHorizon[] = ["short", "medium", "long"];
                setTimeHorizon(horizons[value[0] - 1]);
              }}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1-3 Years</span>
              <span>5-10 Years</span>
              <span>15-30 Years</span>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Contribution */}
        <Card className="border-muted">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-yellow-400" />
              Monthly Contribution
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center text-3xl font-bold text-primary">
              ${monthlyContribution}/month
            </div>
            <Slider
              value={[monthlyContribution]}
              min={0}
              max={500}
              step={25}
              onValueChange={(value) => setMonthlyContribution(value[0])}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>$0</span>
              <span>$250</span>
              <span>$500</span>
            </div>
          </CardContent>
        </Card>

        {/* Compound Interest Visualization */}
        <Card className="border-primary/30">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Future Wealth: Starting Early vs Late
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={compoundData}>
                  <defs>
                    <linearGradient id="earlyGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(142 76% 36%)" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="hsl(142 76% 36%)" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="lateGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(38 92% 50%)" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="hsl(38 92% 50%)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="year" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                    formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
                  />
                  <Area type="monotone" dataKey="early" stroke="hsl(142 76% 36%)" fill="url(#earlyGradient)" name="Start Now" strokeWidth={2} />
                  <Area type="monotone" dataKey="late" stroke="hsl(38 92% 50%)" fill="url(#lateGradient)" name="Start in 10 Years" strokeWidth={2} />
                  <Line type="monotone" dataKey="contributions" stroke="hsl(var(--muted-foreground))" strokeDasharray="5 5" name="Contributions Only" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-4 text-sm">
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                Start Now
              </span>
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-400" />
                Wait 10 Years
              </span>
              <span className="flex items-center gap-2">
                <div className="w-3 h-0.5 bg-muted-foreground" style={{ borderStyle: 'dashed' }} />
                Just Contributions
              </span>
            </div>
            
            <div className="mt-4 p-4 bg-primary/10 rounded-lg text-center">
              <p className="text-sm text-muted-foreground mb-1">30-Year Difference</p>
              <p className="text-2xl font-bold text-primary">
                ${(compoundData[30].early - compoundData[30].late).toLocaleString()}
              </p>
              <p className="text-xs text-emerald-400">Starting early advantage</p>
            </div>
          </CardContent>
        </Card>

        {/* Simulate Button */}
        <Button 
          onClick={simulateGarden} 
          className="w-full bg-gradient-to-r from-emerald-500 to-primary" 
          size="lg"
        >
          <Mountain className="h-5 w-5 mr-2" />
          Run {getTimeYears(timeHorizon)}-Year Simulation
        </Button>

        {/* Simulation Results */}
        {gardenSimulated && gardenHistory.length > 0 && (
          <Card className="border-emerald-500/30 bg-gradient-to-br from-emerald-950/30 to-background">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                Simulation Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={gardenHistory}>
                    <defs>
                      <linearGradient id="valueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="year" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                      formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
                    />
                    <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" fill="url(#valueGradient)" name="Portfolio" strokeWidth={2} />
                    <Line type="monotone" dataKey="contributions" stroke="hsl(var(--muted-foreground))" strokeDasharray="5 5" name="Contributions" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Final Value</p>
                  <p className="text-2xl font-bold text-emerald-400">
                    ${gardenHistory[gardenHistory.length - 1].value.toLocaleString()}
                  </p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Total Contributed</p>
                  <p className="text-2xl font-bold text-primary">
                    ${gardenHistory[gardenHistory.length - 1].contributions.toLocaleString()}
                  </p>
                </div>
              </div>
              
              <div className="p-4 bg-emerald-500/10 rounded-lg text-center">
                <p className="text-lg font-bold text-emerald-400">
                  Investment Gains: ${(gardenHistory[gardenHistory.length - 1].value - gardenHistory[gardenHistory.length - 1].contributions).toLocaleString()}
                </p>
              </div>

              {marketDip && (
                <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <p className="text-yellow-500 text-sm">
                    ⚡ Your portfolio experienced a 25% market dip in year 3 but recovered! 
                    Patience and discipline paid off.
                  </p>
                </div>
              )}

              <Button onClick={goToReview} className="w-full" size="lg">
                <Award className="h-5 w-5 mr-2" />
                View Portfolio Review
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  const renderPortfolioReview = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center p-8 bg-gradient-to-br from-primary/20 via-purple-500/20 to-emerald-500/20 rounded-2xl border border-primary/30">
        <Trophy className="h-20 w-20 mx-auto mb-4 text-yellow-500" />
        <h2 className="text-3xl font-bold mb-2">Portfolio Review</h2>
        <div className="text-6xl font-bold bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">
          Grade: {overallGrade}
        </div>
        <div className="mt-4 text-2xl font-bold text-yellow-500">
          +{xpEarned} XP Earned!
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-blue-500/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-blue-400" />
                <span className="font-semibold">Stability</span>
              </div>
              <span className="text-2xl font-bold text-blue-400">{stabilityScore}%</span>
            </div>
            <Progress value={stabilityScore} className="h-3" />
            <p className="text-sm text-muted-foreground mt-2">
              How protected your wealth is from volatility
            </p>
          </CardContent>
        </Card>

        <Card className="border-emerald-500/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-emerald-400" />
                <span className="font-semibold">Growth</span>
              </div>
              <span className="text-2xl font-bold text-emerald-400">{growthScore}%</span>
            </div>
            <Progress value={growthScore} className="h-3" />
            <p className="text-sm text-muted-foreground mt-2">
              Your wealth's potential for long-term gains
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-muted">
        <CardHeader>
          <CardTitle>Your Financial Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="font-semibold mb-2">Path Chosen: {selectedPath === "vault" ? "The Safe Vault (Saving)" : "The Garden (Investing)"}</p>
            {selectedPath === "garden" && (
              <>
                <p className="text-sm text-muted-foreground">Risk Level: {weatherLabels[riskLevel]}</p>
                <p className="text-sm text-muted-foreground">Time Horizon: {seasonLabels[timeHorizon]}</p>
                <p className="text-sm text-muted-foreground">Monthly Contribution: ${monthlyContribution}</p>
              </>
            )}
          </div>

          <div className="p-4 bg-primary/10 rounded-lg">
            <h4 className="font-semibold mb-2">💡 Key Insight</h4>
            <p className="text-sm text-muted-foreground">
              {selectedPath === "vault" 
                ? "While keeping money 'safe' feels secure, inflation silently erodes your purchasing power. Consider balancing safety with growth to protect your future wealth."
                : overallGrade === "A+" || overallGrade === "A"
                  ? "Excellent balance! You understand that successful investing requires both patience (time horizon) and appropriate risk tolerance. Keep this mindset!"
                  : "Good start! Remember: the best investors balance risk with their time horizon. Short-term = lower risk, Long-term = can handle more volatility."
              }
            </p>
          </div>
        </CardContent>
      </Card>

      <Button onClick={resetSimulator} variant="outline" className="w-full" size="lg">
        Try Another Path
      </Button>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      {/* Warning Dialog */}
      <Dialog open={showWarning} onOpenChange={setShowWarning}>
        <DialogContent className="border-yellow-500/50 bg-gradient-to-br from-yellow-950/90 to-background">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-yellow-500">
              <AlertTriangle className="h-5 w-5" />
              Investment Insight
            </DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground">{warningMessage}</p>
          <Button onClick={() => setShowWarning(false)} className="mt-4">
            I Understand
          </Button>
        </DialogContent>
      </Dialog>

      {/* Help Bot Dialog */}
      <Dialog open={showHelpBot} onOpenChange={setShowHelpBot}>
        <DialogContent className="border-primary/50 bg-gradient-to-br from-primary/10 to-background">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-primary">
              <MessageCircle className="h-5 w-5" />
              Investment Coach
            </DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground">{helpBotMessage}</p>
          <Button onClick={() => setShowHelpBot(false)} className="mt-4">
            Got It!
          </Button>
        </DialogContent>
      </Dialog>

      {phase === "intro" && renderIntro()}
      {phase === "path-selection" && renderPathSelection()}
      {phase === "safe-vault" && renderSafeVault()}
      {phase === "garden" && renderGarden()}
      {phase === "portfolio-review" && renderPortfolioReview()}
    </div>
  );
};

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Clock, TrendingDown, TrendingUp, Coins, 
  Building, BarChart3, AlertTriangle, Trophy,
  Zap, Target, Timer
} from "lucide-react";
import { AIContextualHelp } from "../AIContextualHelp";

type Phase = "hook" | "selection" | "simulation" | "crisis" | "results";
type AssetChoice = "cash" | "gold" | "index";

const assetData = {
  cash: { name: "Cash Savings", icon: Coins, color: "text-green-500", avgReturn: 0.5, volatility: 0 },
  gold: { name: "Gold", icon: Building, color: "text-yellow-500", avgReturn: 3, volatility: 15 },
  index: { name: "S&P 500 Index", icon: BarChart3, color: "text-blue-500", avgReturn: 10, volatility: 20 }
};

const generateYearlyReturns = (asset: AssetChoice, years: number) => {
  const { avgReturn, volatility } = assetData[asset];
  const returns: number[] = [];
  
  for (let i = 0; i < years; i++) {
    // Add market crash in year 10 (2008 style)
    if (i === 10 && asset !== "cash") {
      returns.push(asset === "index" ? -38 : -25);
    } else {
      const randomReturn = avgReturn + (Math.random() - 0.5) * volatility;
      returns.push(randomReturn);
    }
  }
  return returns;
};

export const FoundationsImmersive = () => {
  const [phase, setPhase] = useState<Phase>("hook");
  const [selectedAsset, setSelectedAsset] = useState<AssetChoice | null>(null);
  const [currentYear, setCurrentYear] = useState(0);
  const [portfolioValue, setPortfolioValue] = useState(100000);
  const [portfolioHistory, setPortfolioHistory] = useState<number[]>([100000]);
  const [inflationAdjusted, setInflationAdjusted] = useState(100000);
  const [panicSold, setPanicSold] = useState(false);
  const [showCrisis, setShowCrisis] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  const [yearlyReturns, setYearlyReturns] = useState<number[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [hookTimer, setHookTimer] = useState(15);

  // Hook timer countdown
  useEffect(() => {
    if (phase === "hook" && hookTimer > 0) {
      const timer = setTimeout(() => setHookTimer(hookTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [phase, hookTimer]);

  const startSimulation = (asset: AssetChoice) => {
    setSelectedAsset(asset);
    const returns = generateYearlyReturns(asset, 20);
    setYearlyReturns(returns);
    setPhase("simulation");
    setIsSimulating(true);
  };

  // Simulation loop
  useEffect(() => {
    if (!isSimulating || currentYear >= 20) {
      if (currentYear >= 20) {
        calculateResults();
      }
      return;
    }

    const timer = setTimeout(() => {
      // Check for 2008 crisis
      if (currentYear === 10 && selectedAsset !== "cash" && !showCrisis) {
        setShowCrisis(true);
        setPhase("crisis");
        setIsSimulating(false);
        return;
      }

      const yearReturn = yearlyReturns[currentYear];
      const inflation = 3; // 3% annual inflation
      
      const newValue = portfolioValue * (1 + yearReturn / 100);
      const newInflationAdjusted = inflationAdjusted * (1 - inflation / 100);
      
      setPortfolioValue(newValue);
      setInflationAdjusted(newInflationAdjusted);
      setPortfolioHistory(prev => [...prev, newValue]);
      setCurrentYear(prev => prev + 1);
    }, 300);

    return () => clearTimeout(timer);
  }, [isSimulating, currentYear, yearlyReturns, portfolioValue, inflationAdjusted, selectedAsset, showCrisis]);

  const handleCrisisDecision = (sell: boolean) => {
    setPanicSold(sell);
    if (sell) {
      // Lock in losses - convert to cash equivalent for remaining years
      setYearlyReturns(prev => prev.map((r, i) => i > 10 ? 0.5 : r));
    }
    setPhase("simulation");
    setIsSimulating(true);
  };

  const calculateResults = () => {
    setIsSimulating(false);
    
    let xp = 0;
    const inflation20Years = Math.pow(1.03, 20);
    const realValue = portfolioValue / inflation20Years;
    
    // Base XP for completion
    xp += 100;
    
    // XP for beating inflation
    if (realValue > 100000) {
      xp += Math.min(200, Math.floor((realValue - 100000) / 1000));
    }
    
    // Penalty for 100% cash (opportunity cost)
    if (selectedAsset === "cash") {
      xp -= 50;
    }
    
    // Bonus for not panic selling
    if (!panicSold && selectedAsset !== "cash") {
      xp += 100;
    }
    
    // Streak bonus for index fund holders
    if (selectedAsset === "index" && !panicSold) {
      xp += 150;
    }

    setXpEarned(Math.max(0, xp));
    setPhase("results");
  };

  const renderHook = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center p-6 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-2xl border border-red-500/30">
        <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4 animate-pulse" />
        <h2 className="text-2xl font-bold text-foreground mb-2">THE HIDDEN TAX</h2>
        <p className="text-muted-foreground text-lg">
          Your money is losing value every second you read this.
        </p>
        <div className="mt-4 text-4xl font-mono font-bold text-red-500">
          -{((3 / 365 / 24 / 60 / 60) * (15 - hookTimer) * 100000).toFixed(2)} <AIContextualHelp term="purchasing power" lessonId="1" lessonTitle="Foundations">purchasing power</AIContextualHelp>
        </div>
      </div>

      <Card className="border-primary/30 bg-card/50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-semibold">Time to decide:</span>
            <Badge variant={hookTimer < 5 ? "destructive" : "secondary"} className="text-xl px-4 py-2">
              <Timer className="h-5 w-5 mr-2" />
              {hookTimer}s
            </Badge>
          </div>
          <p className="text-muted-foreground mb-6">
            You have $100,000. Where will you put it for the next 20 years?
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(Object.keys(assetData) as AssetChoice[]).map((asset) => {
              const data = assetData[asset];
              const Icon = data.icon;
              return (
                <Button
                  key={asset}
                  variant="outline"
                  className="h-auto p-6 flex flex-col items-center gap-3 hover:border-primary hover:bg-primary/10 transition-all"
                  onClick={() => {
                    setSelectedAsset(asset);
                    setPhase("selection");
                  }}
                >
                  <Icon className={`h-10 w-10 ${data.color}`} />
                  <span className="font-semibold">{data.name}</span>
                  <span className="text-xs text-muted-foreground">
                    ~{data.avgReturn}% avg return
                  </span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSelection = () => (
    <div className="space-y-6 animate-fade-in">
      <Card className="border-primary/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-6 w-6 text-primary" />
            Confirm Your Choice
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {selectedAsset && (
            <div className="p-6 bg-muted/50 rounded-xl text-center">
              {(() => {
                const data = assetData[selectedAsset];
                const Icon = data.icon;
                return (
                  <>
                    <Icon className={`h-16 w-16 ${data.color} mx-auto mb-4`} />
                    <h3 className="text-2xl font-bold">{data.name}</h3>
                    <p className="text-muted-foreground mt-2">
                      Historical Average: {data.avgReturn}% per year
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Volatility: {data.volatility === 0 ? "None" : `±${data.volatility}%`}
                    </p>
                  </>
                );
              })()}
            </div>
          )}

          <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <p className="text-sm text-yellow-600 dark:text-yellow-400">
              ⚠️ Remember: <AIContextualHelp term="Inflation" lessonId="1" lessonTitle="Foundations">Inflation</AIContextualHelp> averages 3% per year. Your money loses <AIContextualHelp term="purchasing power" lessonId="1" lessonTitle="Foundations">purchasing power</AIContextualHelp> even when "safe."
            </p>
          </div>

          <div className="flex gap-4">
            <Button variant="outline" onClick={() => setPhase("hook")} className="flex-1">
              Go Back
            </Button>
            <Button 
              onClick={() => startSimulation(selectedAsset!)}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              <Zap className="h-4 w-4 mr-2" />
              Start 20-Year Simulation
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSimulation = () => (
    <div className="space-y-6 animate-fade-in">
      <Card className="border-primary/30">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Year {currentYear} of 20
            </span>
            <Badge variant="outline">
              {selectedAsset && assetData[selectedAsset].name}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Progress value={(currentYear / 20) * 100} className="h-3" />
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-muted/50 rounded-lg text-center">
              <p className="text-sm text-muted-foreground">Portfolio Value</p>
              <p className={`text-2xl font-bold ${portfolioValue >= 100000 ? 'text-green-500' : 'text-red-500'}`}>
                ${portfolioValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
              {portfolioValue >= 100000 ? (
                <TrendingUp className="h-4 w-4 text-green-500 mx-auto mt-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500 mx-auto mt-1" />
              )}
            </div>
            <div className="p-4 bg-muted/50 rounded-lg text-center">
              <p className="text-sm text-muted-foreground">Real Purchasing Power</p>
              <p className="text-2xl font-bold text-orange-500">
                ${(portfolioValue / Math.pow(1.03, currentYear)).toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
              <TrendingDown className="h-4 w-4 text-orange-500 mx-auto mt-1" />
            </div>
          </div>

          {/* Mini chart */}
          <div className="h-32 bg-muted/30 rounded-lg p-4 flex items-end gap-1">
            {portfolioHistory.slice(-20).map((value, i) => (
              <div
                key={i}
                className="flex-1 bg-primary/60 rounded-t transition-all"
                style={{ 
                  height: `${Math.min(100, Math.max(10, (value / 200000) * 100))}%`,
                  backgroundColor: value >= 100000 ? 'hsl(var(--primary))' : 'hsl(0 84% 60%)'
                }}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderCrisis = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="p-6 bg-gradient-to-br from-red-500/30 to-red-900/30 rounded-2xl border-2 border-red-500 animate-pulse">
        <AlertTriangle className="h-20 w-20 text-red-500 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-center text-red-500 mb-2">
          MARKET CRASH - 2008
        </h2>
        <p className="text-center text-lg text-foreground mb-4">
          Your portfolio just dropped {selectedAsset === "index" ? "38%" : "25%"}!
        </p>
        <p className="text-center text-2xl font-bold text-red-400">
          Current Value: ${portfolioValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
        </p>
      </div>

      <Card className="border-yellow-500/50">
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-xl font-bold text-center">THE 2008 TEST</h3>
          <p className="text-muted-foreground text-center">
            Headlines are screaming "SELL EVERYTHING!" Your friends are panicking. What do you do?
          </p>
          
          <div className="grid grid-cols-2 gap-4 pt-4">
            <Button
              variant="destructive"
              className="h-auto py-6 flex flex-col gap-2"
              onClick={() => handleCrisisDecision(true)}
            >
              <span className="text-lg font-bold">PANIC SELL</span>
              <span className="text-xs opacity-80">Lock in losses, move to cash</span>
            </Button>
            <Button
              variant="default"
              className="h-auto py-6 flex flex-col gap-2 bg-green-600 hover:bg-green-700"
              onClick={() => handleCrisisDecision(false)}
            >
              <span className="text-lg font-bold">HOLD STRONG</span>
              <span className="text-xs opacity-80">Stay the course</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderResults = () => {
    const inflation20Years = Math.pow(1.03, 20);
    const realValue = portfolioValue / inflation20Years;
    const nominalGain = portfolioValue - 100000;
    const realGain = realValue - 100000;

    return (
      <div className="space-y-6 animate-fade-in">
        <div className="text-center p-6 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-2xl">
          <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-2">20 YEARS COMPLETE</h2>
          <div className="text-5xl font-bold text-primary">+{xpEarned} XP</div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Card className="border-green-500/30">
            <CardContent className="pt-4 text-center">
              <p className="text-sm text-muted-foreground">Final Portfolio</p>
              <p className="text-2xl font-bold text-green-500">
                ${portfolioValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
              <p className={`text-sm ${nominalGain >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {nominalGain >= 0 ? '+' : ''}{((nominalGain / 100000) * 100).toFixed(1)}%
              </p>
            </CardContent>
          </Card>
          <Card className="border-orange-500/30">
            <CardContent className="pt-4 text-center">
              <p className="text-sm text-muted-foreground">Real Value (Inflation-Adjusted)</p>
              <p className="text-2xl font-bold text-orange-500">
                ${realValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
              <p className={`text-sm ${realGain >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {realGain >= 0 ? '+' : ''}{((realGain / 100000) * 100).toFixed(1)}%
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="pt-4 space-y-3">
            <h4 className="font-semibold">XP Breakdown:</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Completion Bonus</span>
                <span className="text-green-500">+100 XP</span>
              </div>
              {realValue > 100000 && (
                <div className="flex justify-between">
                  <span>Beat Inflation</span>
                  <span className="text-green-500">+{Math.min(200, Math.floor((realValue - 100000) / 1000))} XP</span>
                </div>
              )}
              {selectedAsset === "cash" && (
                <div className="flex justify-between">
                  <span>Opportunity Cost Penalty</span>
                  <span className="text-red-500">-50 XP</span>
                </div>
              )}
              {!panicSold && selectedAsset !== "cash" && (
                <div className="flex justify-between">
                  <span>Diamond Hands Bonus</span>
                  <span className="text-green-500">+100 XP</span>
                </div>
              )}
              {selectedAsset === "index" && !panicSold && (
                <div className="flex justify-between">
                  <span>20-Year Streak Bonus</span>
                  <span className="text-green-500">+150 XP</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="p-4 bg-primary/10 rounded-lg">
          <p className="text-sm">
            <strong>💡 Key Insight:</strong> {selectedAsset === "cash" 
              ? <>Holding 100% cash felt 'safe,' but <AIContextualHelp term="inflation" lessonId="1" lessonTitle="Foundations">inflation</AIContextualHelp> silently eroded your <AIContextualHelp term="purchasing power" lessonId="1" lessonTitle="Foundations">purchasing power</AIContextualHelp>. The cost of inaction is real.</>
              : panicSold 
                ? <><AIContextualHelp term="Panic selling" lessonId="1" lessonTitle="Foundations">Panic selling</AIContextualHelp> locked in your losses. Markets recovered within 5 years, but you missed the rebound.</>
                : <>Staying invested through the crash paid off. The <AIContextualHelp term="market recovery" lessonId="1" lessonTitle="Foundations">market recovered</AIContextualHelp> and your patience was rewarded.</>
            }
          </p>
        </div>

        <Button onClick={() => {
          setPhase("hook");
          setCurrentYear(0);
          setPortfolioValue(100000);
          setPortfolioHistory([100000]);
          setInflationAdjusted(100000);
          setPanicSold(false);
          setShowCrisis(false);
          setSelectedAsset(null);
          setHookTimer(15);
        }} className="w-full">
          <Zap className="h-4 w-4 mr-2" />
          Try Different Strategy
        </Button>
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      {phase === "hook" && renderHook()}
      {phase === "selection" && renderSelection()}
      {phase === "simulation" && renderSimulation()}
      {phase === "crisis" && renderCrisis()}
      {phase === "results" && renderResults()}
    </div>
  );
};

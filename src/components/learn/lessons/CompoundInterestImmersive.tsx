import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { 
  TrendingUp, Zap, Trophy, Target, 
  DollarSign, Calendar, AlertTriangle, Rocket
} from "lucide-react";

type Phase = "hook" | "strategy" | "simulation" | "recession" | "raise" | "results";
type Strategy = "dca" | "lumpsum";

export const CompoundInterestImmersive = () => {
  const [phase, setPhase] = useState<Phase>("hook");
  const [strategy, setStrategy] = useState<Strategy | null>(null);
  const [monthlyContribution, setMonthlyContribution] = useState(500);
  const [currentYear, setCurrentYear] = useState(0);
  const [portfolioValue, setPortfolioValue] = useState(0);
  const [totalContributed, setTotalContributed] = useState(0);
  const [portfolioHistory, setPortfolioHistory] = useState<number[]>([0]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [pausedDuringRecession, setPausedDuringRecession] = useState(false);
  const [increasedAfterRaise, setIncreasedAfterRaise] = useState(false);
  const [showRecession, setShowRecession] = useState(false);
  const [showRaise, setShowRaise] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  const [contributionStreak, setContributionStreak] = useState(0);

  const startSimulation = () => {
    if (strategy === "lumpsum") {
      // Lump sum: invest everything upfront
      const lumpSum = monthlyContribution * 12 * 40;
      setPortfolioValue(lumpSum);
      setTotalContributed(lumpSum);
    }
    setPhase("simulation");
    setIsSimulating(true);
  };

  useEffect(() => {
    if (!isSimulating || currentYear >= 40) {
      if (currentYear >= 40) {
        calculateResults();
      }
      return;
    }

    const timer = setTimeout(() => {
      // Recession in years 15-17
      if (currentYear === 15 && !showRecession) {
        setShowRecession(true);
        setPhase("recession");
        setIsSimulating(false);
        return;
      }

      // Raise in year 25
      if (currentYear === 25 && !showRaise) {
        setShowRaise(true);
        setPhase("raise");
        setIsSimulating(false);
        return;
      }

      // Annual return (7% average with volatility)
      const baseReturn = 7;
      let yearReturn = baseReturn + (Math.random() - 0.5) * 10;
      
      // Recession years
      if (currentYear >= 15 && currentYear <= 17) {
        yearReturn = currentYear === 15 ? -20 : currentYear === 16 ? -10 : 5;
      }

      let newValue = portfolioValue;
      let yearlyContribution = 0;

      if (strategy === "dca") {
        // Check if paused during recession
        const isPaused = pausedDuringRecession && currentYear >= 15 && currentYear <= 17;
        const contribution = increasedAfterRaise && currentYear >= 25 
          ? monthlyContribution * 1.5 * 12 
          : monthlyContribution * 12;
        
        yearlyContribution = isPaused ? 0 : contribution;
        
        // Apply return then add contribution (simplified DCA)
        newValue = portfolioValue * (1 + yearReturn / 100) + yearlyContribution;
        
        if (!isPaused) {
          setContributionStreak(prev => prev + 1);
        } else {
          setContributionStreak(0);
        }
      } else {
        // Lump sum just compounds
        newValue = portfolioValue * (1 + yearReturn / 100);
      }

      setPortfolioValue(newValue);
      setTotalContributed(prev => prev + yearlyContribution);
      setPortfolioHistory(prev => [...prev, newValue]);
      setCurrentYear(prev => prev + 1);
    }, 200);

    return () => clearTimeout(timer);
  }, [isSimulating, currentYear, strategy, monthlyContribution, portfolioValue, pausedDuringRecession, increasedAfterRaise, showRecession, showRaise]);

  const handleRecessionDecision = (pause: boolean) => {
    setPausedDuringRecession(pause);
    setPhase("simulation");
    setIsSimulating(true);
  };

  const handleRaiseDecision = (increase: boolean) => {
    setIncreasedAfterRaise(increase);
    setPhase("simulation");
    setIsSimulating(true);
  };

  const calculateResults = () => {
    setIsSimulating(false);
    
    let xp = 100; // Base XP
    
    // Bonus for highest portfolio value
    xp += Math.min(300, Math.floor(portfolioValue / 100000) * 10);
    
    // Contribution streak bonus (didn't pause during recession)
    if (!pausedDuringRecession) {
      xp += 150;
    }
    
    // Increased after raise bonus
    if (increasedAfterRaise) {
      xp += 50;
    }
    
    // Strategy comparison bonus
    const optimalValue = calculateOptimalValue();
    if (portfolioValue >= optimalValue * 0.9) {
      xp += 100;
    }

    setXpEarned(xp);
    setPhase("results");
  };

  const calculateOptimalValue = () => {
    // Calculate what the optimal strategy would have achieved
    let value = 0;
    const contribution = monthlyContribution * 12;
    
    for (let year = 0; year < 40; year++) {
      let returnRate = 7;
      if (year >= 15 && year <= 17) {
        returnRate = year === 15 ? -20 : year === 16 ? -10 : 5;
      }
      const adjustedContribution = year >= 25 ? contribution * 1.5 : contribution;
      value = value * (1 + returnRate / 100) + adjustedContribution;
    }
    return value;
  };

  const renderHook = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center p-8 bg-gradient-to-br from-green-500/20 to-emerald-600/20 rounded-2xl border border-green-500/30">
        <Rocket className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-foreground mb-2">THE EXPONENTIAL ENGINE</h2>
        <p className="text-muted-foreground text-lg mb-4">
          Einstein called it the 8th wonder of the world.
        </p>
        <div className="text-5xl font-mono font-bold text-green-500">
          $1 → ${Math.round(Math.pow(1.07, 40)).toLocaleString()}
        </div>
        <p className="text-sm text-muted-foreground mt-2">$1 at 7% for 40 years</p>
      </div>

      <Card className="border-primary/30">
        <CardContent className="pt-6 space-y-6">
          <h3 className="text-xl font-semibold text-center">Choose Your Strategy</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className={`h-auto p-6 flex flex-col items-center gap-3 transition-all ${
                strategy === "dca" ? "border-primary bg-primary/10" : ""
              }`}
              onClick={() => setStrategy("dca")}
            >
              <Calendar className="h-10 w-10 text-blue-500" />
              <span className="font-semibold">Dollar-Cost Averaging</span>
              <span className="text-xs text-muted-foreground text-center">
                Invest monthly, ride out volatility
              </span>
            </Button>
            <Button
              variant="outline"
              className={`h-auto p-6 flex flex-col items-center gap-3 transition-all ${
                strategy === "lumpsum" ? "border-primary bg-primary/10" : ""
              }`}
              onClick={() => setStrategy("lumpsum")}
            >
              <DollarSign className="h-10 w-10 text-green-500" />
              <span className="font-semibold">Lump Sum</span>
              <span className="text-xs text-muted-foreground text-center">
                Invest everything upfront
              </span>
            </Button>
          </div>

          {strategy === "dca" && (
            <div className="space-y-4 p-4 bg-muted/50 rounded-lg animate-fade-in">
              <div className="flex justify-between items-center">
                <span className="font-medium">Monthly Contribution</span>
                <Badge variant="secondary" className="text-lg">
                  ${monthlyContribution}/mo
                </Badge>
              </div>
              <Slider
                value={[monthlyContribution]}
                onValueChange={(v) => setMonthlyContribution(v[0])}
                min={100}
                max={2000}
                step={100}
                className="w-full"
              />
              <p className="text-sm text-muted-foreground text-center">
                40-year total contribution: ${(monthlyContribution * 12 * 40).toLocaleString()}
              </p>
            </div>
          )}

          {strategy === "lumpsum" && (
            <div className="space-y-4 p-4 bg-muted/50 rounded-lg animate-fade-in">
              <p className="text-center">
                Initial Investment: <span className="font-bold text-xl">${(monthlyContribution * 12 * 40).toLocaleString()}</span>
              </p>
              <p className="text-sm text-muted-foreground text-center">
                (Equivalent to ${monthlyContribution}/mo for 40 years)
              </p>
            </div>
          )}

          <Button 
            onClick={startSimulation}
            disabled={!strategy}
            className="w-full"
          >
            <Zap className="h-4 w-4 mr-2" />
            Start 40-Year Simulation
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderSimulation = () => (
    <div className="space-y-6 animate-fade-in">
      <Card className="border-primary/30">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Year {currentYear} of 40</span>
            <Badge variant="outline">{strategy === "dca" ? "DCA" : "Lump Sum"}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Progress value={(currentYear / 40) * 100} className="h-3" />
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-muted/50 rounded-lg text-center">
              <p className="text-sm text-muted-foreground">Portfolio Value</p>
              <p className="text-2xl font-bold text-green-500">
                ${portfolioValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg text-center">
              <p className="text-sm text-muted-foreground">Total Contributed</p>
              <p className="text-2xl font-bold text-blue-500">
                ${totalContributed.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
            </div>
          </div>

          <div className="p-3 bg-green-500/10 rounded-lg text-center">
            <p className="text-sm text-muted-foreground">Compound Growth</p>
            <p className="text-xl font-bold text-green-500">
              +${(portfolioValue - totalContributed).toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
          </div>

          {/* Exponential curve visualization */}
          <div className="h-32 bg-muted/30 rounded-lg p-4 flex items-end gap-1">
            {portfolioHistory.slice(-40).map((value, i) => (
              <div
                key={i}
                className="flex-1 bg-green-500/60 rounded-t transition-all"
                style={{ 
                  height: `${Math.min(100, (value / (portfolioValue || 1)) * 100)}%`
                }}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderRecession = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="p-6 bg-gradient-to-br from-red-500/30 to-orange-500/30 rounded-2xl border-2 border-red-500 animate-pulse">
        <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-center text-red-500 mb-2">
          3-YEAR RECESSION
        </h2>
        <p className="text-center text-muted-foreground">
          Markets are down 20%. Job losses are rising. Your friends are cutting expenses.
        </p>
      </div>

      {strategy === "dca" && (
        <Card className="border-yellow-500/50">
          <CardContent className="pt-6 space-y-4">
            <h3 className="text-xl font-bold text-center">THE DISCIPLINE TEST</h3>
            <p className="text-muted-foreground text-center">
              Do you continue your ${monthlyContribution}/month contributions during the recession?
            </p>
            
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-center">
                Continuing to invest during downturns means buying more shares at lower prices...
                <br />
                <span className="text-muted-foreground">But it requires discipline when everyone is selling.</span>
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-4">
              <Button
                variant="outline"
                className="h-auto py-6 flex flex-col gap-2"
                onClick={() => handleRecessionDecision(true)}
              >
                <span className="text-lg font-bold">PAUSE</span>
                <span className="text-xs text-muted-foreground">Save cash, wait it out</span>
              </Button>
              <Button
                className="h-auto py-6 flex flex-col gap-2 bg-green-600 hover:bg-green-700"
                onClick={() => handleRecessionDecision(false)}
              >
                <span className="text-lg font-bold">KEEP INVESTING</span>
                <span className="text-xs opacity-80">Buy the dip</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {strategy === "lumpsum" && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              With lump sum investing, you're already fully invested. You can only hold and wait.
            </p>
            <Button 
              className="w-full mt-4" 
              onClick={() => handleRecessionDecision(false)}
            >
              Continue Simulation
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderRaise = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="p-6 bg-gradient-to-br from-green-500/30 to-emerald-500/30 rounded-2xl border-2 border-green-500">
        <TrendingUp className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-center text-green-500 mb-2">
          PROMOTION! 🎉
        </h2>
        <p className="text-center text-muted-foreground">
          You got a 50% raise! Your disposable income has increased significantly.
        </p>
      </div>

      {strategy === "dca" && (
        <Card className="border-green-500/50">
          <CardContent className="pt-6 space-y-4">
            <h3 className="text-xl font-bold text-center">LIFESTYLE CHOICE</h3>
            <p className="text-muted-foreground text-center">
              Do you increase your monthly contribution by 50%?
            </p>
            
            <div className="grid grid-cols-2 gap-4 pt-4">
              <Button
                variant="outline"
                className="h-auto py-6 flex flex-col gap-2"
                onClick={() => handleRaiseDecision(false)}
              >
                <span className="text-lg font-bold">KEEP SAME</span>
                <span className="text-xs text-muted-foreground">${monthlyContribution}/mo</span>
              </Button>
              <Button
                className="h-auto py-6 flex flex-col gap-2 bg-green-600 hover:bg-green-700"
                onClick={() => handleRaiseDecision(true)}
              >
                <span className="text-lg font-bold">INCREASE 50%</span>
                <span className="text-xs opacity-80">${Math.round(monthlyContribution * 1.5)}/mo</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {strategy === "lumpsum" && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              With lump sum, your investment is already made. The raise goes to lifestyle!
            </p>
            <Button 
              className="w-full mt-4" 
              onClick={() => handleRaiseDecision(false)}
            >
              Continue Simulation
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderResults = () => {
    const compoundGrowth = portfolioValue - totalContributed;
    const optimalValue = calculateOptimalValue();

    return (
      <div className="space-y-6 animate-fade-in">
        <div className="text-center p-6 bg-gradient-to-br from-green-500/20 to-emerald-600/20 rounded-2xl">
          <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-2">40 YEARS COMPLETE</h2>
          <div className="text-5xl font-bold text-primary">+{xpEarned} XP</div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Card className="border-blue-500/30">
            <CardContent className="pt-4 text-center">
              <p className="text-xs text-muted-foreground">Contributed</p>
              <p className="text-lg font-bold text-blue-500">
                ${totalContributed.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
            </CardContent>
          </Card>
          <Card className="border-green-500/30">
            <CardContent className="pt-4 text-center">
              <p className="text-xs text-muted-foreground">Final Value</p>
              <p className="text-lg font-bold text-green-500">
                ${portfolioValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
            </CardContent>
          </Card>
          <Card className="border-purple-500/30">
            <CardContent className="pt-4 text-center">
              <p className="text-xs text-muted-foreground">Compound Growth</p>
              <p className="text-lg font-bold text-purple-500">
                ${compoundGrowth.toLocaleString(undefined, { maximumFractionDigits: 0 })}
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
              <div className="flex justify-between">
                <span>Portfolio Growth</span>
                <span className="text-green-500">+{Math.min(300, Math.floor(portfolioValue / 100000) * 10)} XP</span>
              </div>
              {!pausedDuringRecession && strategy === "dca" && (
                <div className="flex justify-between">
                  <span>Recession Discipline Bonus</span>
                  <span className="text-green-500">+150 XP</span>
                </div>
              )}
              {increasedAfterRaise && (
                <div className="flex justify-between">
                  <span>Raise Reinvestment Bonus</span>
                  <span className="text-green-500">+50 XP</span>
                </div>
              )}
              {portfolioValue >= optimalValue * 0.9 && (
                <div className="flex justify-between">
                  <span>Near-Optimal Strategy</span>
                  <span className="text-green-500">+100 XP</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="p-4 bg-primary/10 rounded-lg">
          <p className="text-sm">
            <strong>💡 Key Insight:</strong> {pausedDuringRecession 
              ? "Pausing contributions during the recession meant missing the lowest prices. Investing through downturns is when compounding accelerates the most!"
              : "Continuing to invest during the recession allowed you to buy at the lowest prices. This is when compound growth really shines!"
            }
          </p>
        </div>

        <Button onClick={() => {
          setPhase("hook");
          setCurrentYear(0);
          setPortfolioValue(0);
          setTotalContributed(0);
          setPortfolioHistory([0]);
          setStrategy(null);
          setPausedDuringRecession(false);
          setIncreasedAfterRaise(false);
          setShowRecession(false);
          setShowRaise(false);
          setContributionStreak(0);
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
      {phase === "strategy" && renderHook()}
      {phase === "simulation" && renderSimulation()}
      {phase === "recession" && renderRecession()}
      {phase === "raise" && renderRaise()}
      {phase === "results" && renderResults()}
    </div>
  );
};

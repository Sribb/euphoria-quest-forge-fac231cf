import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, TrendingUp, TrendingDown, Zap, Brain, Target, Trophy, Clock, Activity } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from "recharts";
import { cn } from "@/lib/utils";
import { AIContextualHelp } from "@/components/learn/AIContextualHelp";

type Phase = "hook" | "volatility" | "simulation" | "results";
type HookDecision = "panic_sell" | "hold_buy" | "wait" | null;
type SimulationPhase = "slow_burn" | "black_swan" | "euphoria_spike";
type SimDecision = "reallocate" | "double_down" | "sell" | "buy_dip" | "take_profits" | "hold";

interface SimulationEvent {
  phase: SimulationPhase;
  title: string;
  description: string;
  duration: string;
  options: { id: SimDecision; label: string; description: string }[];
}

const SIMULATION_EVENTS: SimulationEvent[] = [
  {
    phase: "slow_burn",
    title: "The Slow Burn",
    description: "6 months of flat markets. Your high-risk assets are bleeding management fees while opportunity cost mounts.",
    duration: "6 months",
    options: [
      { id: "reallocate", label: "Reallocate to Bonds", description: "Stop the bleeding with lower-risk assets" },
      { id: "double_down", label: "Double Down", description: "Stay committed to your high-risk thesis" }
    ]
  },
  {
    phase: "black_swan",
    title: "The Black Swan",
    description: "BREAKING: Supply chain collapse triggers 35% sector crash. Emergency reserves available.",
    duration: "1 week",
    options: [
      { id: "sell", label: "Sell Affected Sector", description: "Cut losses and preserve capital" },
      { id: "buy_dip", label: "Buy the Dip", description: "Use reserves to capitalize on fear" }
    ]
  },
  {
    phase: "euphoria_spike",
    title: "The Euphoria Spike",
    description: "Markets surge 45% in an irrational rally. Your portfolio is up significantly. FOMO is everywhere.",
    duration: "3 months",
    options: [
      { id: "take_profits", label: "Take Profits", description: "Lock in gains and de-risk" },
      { id: "hold", label: "Hold for Maximum", description: "Ride the wave to the top" }
    ]
  }
];

export const RiskRewardImmersive = () => {
  const { toast } = useToast();
  
  // Phase management
  const [phase, setPhase] = useState<Phase>("hook");
  const [hookCountdown, setHookCountdown] = useState(10);
  const [hookDecision, setHookDecision] = useState<HookDecision>(null);
  const [showingAlert, setShowingAlert] = useState(true);
  
  // Volatility slider
  const [volatilityThreshold, setVolatilityThreshold] = useState(50);
  const [sliderLocked, setSliderLocked] = useState(false);
  
  // Simulation state
  const [currentSimIndex, setCurrentSimIndex] = useState(0);
  const [simDecisions, setSimDecisions] = useState<SimDecision[]>([]);
  const [portfolioValue, setPortfolioValue] = useState(100000);
  const [portfolioHistory, setPortfolioHistory] = useState<{ time: number; value: number; optimal: number; panic: number }[]>([]);
  const [stressLevel, setStressLevel] = useState(0);
  
  // Results
  const [rarsScore, setRarsScore] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [badges, setBadges] = useState<string[]>([]);

  // Hook countdown timer
  useEffect(() => {
    if (phase === "hook" && hookCountdown > 0 && !hookDecision) {
      const timer = setTimeout(() => setHookCountdown(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
    if (hookCountdown === 0 && !hookDecision) {
      setHookDecision("wait");
      setStressLevel(prev => Math.min(100, prev + 30));
    }
  }, [hookCountdown, phase, hookDecision]);

  // Flashing alert effect
  useEffect(() => {
    if (phase === "hook" && !hookDecision) {
      const interval = setInterval(() => setShowingAlert(prev => !prev), 300);
      return () => clearInterval(interval);
    }
  }, [phase, hookDecision]);

  const handleHookDecision = (decision: HookDecision) => {
    setHookDecision(decision);
    
    // Update stress based on decision
    if (decision === "panic_sell") {
      setStressLevel(80);
      setPortfolioValue(prev => prev * 0.85); // Sold at loss
    } else if (decision === "hold_buy") {
      setStressLevel(40);
      setPortfolioValue(prev => prev * 0.90); // Initial drop but bought more
    } else {
      setStressLevel(50);
      setPortfolioValue(prev => prev * 0.85); // Just took the hit
    }

    toast({
      title: decision === "panic_sell" ? "Panic Sell Executed" : decision === "hold_buy" ? "Buy Order Placed" : "Position Held",
      description: "Processing market response...",
    });

    setTimeout(() => setPhase("volatility"), 2000);
  };

  const getVolatilityAnalogy = () => {
    if (volatilityThreshold < 30) {
      return { text: "The river always reaches the sea, but it takes time.", icon: "🌊", label: "Conservative" };
    } else if (volatilityThreshold < 60) {
      return { text: "A balanced dance between safety and opportunity.", icon: "⚖️", label: "Balanced" };
    } else if (volatilityThreshold < 80) {
      return { text: "High G-forces, high potential altitude.", icon: "🚀", label: "Aggressive" };
    }
    return { text: "Maximum velocity. Maximum risk. No safety net.", icon: "⚡", label: "Extreme" };
  };

  const lockVolatility = () => {
    setSliderLocked(true);
    
    // Initialize portfolio history
    const initial = [{ time: 0, value: portfolioValue, optimal: portfolioValue, panic: portfolioValue * 0.7 }];
    setPortfolioHistory(initial);
    
    toast({
      title: "Risk Profile Locked",
      description: `Your acceptable volatility: ${volatilityThreshold}% (${getVolatilityAnalogy().label})`,
    });

    setTimeout(() => setPhase("simulation"), 1500);
  };

  const handleSimDecision = (decision: SimDecision) => {
    const newDecisions = [...simDecisions, decision];
    setSimDecisions(newDecisions);

    // Calculate portfolio impact based on decision and current event
    const event = SIMULATION_EVENTS[currentSimIndex];
    let valueChange = 0;
    let stressChange = 0;
    let optimalChange = 0;
    let panicChange = 0;

    if (event.phase === "slow_burn") {
      if (decision === "reallocate") {
        valueChange = -0.02; // Small loss from reallocation
        stressChange = -10;
        optimalChange = 0.05;
        panicChange = -0.15;
      } else {
        valueChange = volatilityThreshold > 50 ? 0.08 : -0.05; // Risk pays off if aggressive
        stressChange = 15;
        optimalChange = 0.05;
        panicChange = -0.15;
      }
    } else if (event.phase === "black_swan") {
      if (decision === "sell") {
        valueChange = -0.15; // Locked in losses
        stressChange = -20;
        optimalChange = 0.25;
        panicChange = -0.35;
      } else {
        valueChange = 0.30; // Bought the dip successfully
        stressChange = 25;
        optimalChange = 0.25;
        panicChange = -0.35;
      }
    } else if (event.phase === "euphoria_spike") {
      if (decision === "take_profits") {
        valueChange = 0.15; // Locked in some gains
        stressChange = -15;
        optimalChange = 0.10;
        panicChange = 0.05;
      } else {
        valueChange = volatilityThreshold > 60 ? 0.25 : -0.10; // Crash after euphoria
        stressChange = 20;
        optimalChange = 0.10;
        panicChange = 0.05;
      }
    }

    const newValue = portfolioValue * (1 + valueChange);
    setPortfolioValue(newValue);
    setStressLevel(prev => Math.max(0, Math.min(100, prev + stressChange)));

    // Update portfolio history
    const lastEntry = portfolioHistory[portfolioHistory.length - 1];
    const newHistory = [...portfolioHistory, {
      time: portfolioHistory.length,
      value: newValue,
      optimal: lastEntry.optimal * (1 + optimalChange),
      panic: lastEntry.panic * (1 + panicChange)
    }];
    setPortfolioHistory(newHistory);

    if (currentSimIndex < SIMULATION_EVENTS.length - 1) {
      setTimeout(() => setCurrentSimIndex(prev => prev + 1), 1500);
    } else {
      setTimeout(() => calculateResults(newDecisions, newValue), 1500);
    }
  };

  const calculateResults = (decisions: SimDecision[], finalValue: number) => {
    // Calculate RARS (Risk-Adjusted Return Score)
    const returnPercent = ((finalValue - 100000) / 100000) * 100;
    const volatilityPenalty = volatilityThreshold > 70 ? 0.8 : volatilityThreshold > 40 ? 1 : 1.2;
    const baseRars = Math.round((returnPercent + 50) * 3 * volatilityPenalty);

    // Discipline Score: Did decisions align with initial volatility threshold?
    const aggressiveDecisions = decisions.filter(d => ["double_down", "buy_dip", "hold"].includes(d)).length;
    const conservativeDecisions = decisions.filter(d => ["reallocate", "sell", "take_profits"].includes(d)).length;
    const alignedWithProfile = volatilityThreshold > 50 ? aggressiveDecisions >= 2 : conservativeDecisions >= 2;
    const disciplineBonus = alignedWithProfile ? 1.25 : 1;

    // Loss Aversion Penalty
    const panicPenalty = hookDecision === "panic_sell" ? 0.5 : 1;

    // Opportunity Cost Bonus (bought during black swan)
    const opportunityBonus = decisions[1] === "buy_dip" ? 1.1 : 1;

    const finalRars = Math.round(Math.max(0, Math.min(500, baseRars * disciplineBonus * panicPenalty * opportunityBonus)));
    setRarsScore(finalRars);

    // Calculate XP
    let xp = Math.round(finalRars * 0.8);
    if (alignedWithProfile) xp = Math.round(xp * 1.25);
    if (hookDecision === "panic_sell") xp = Math.round(xp * 0.5);
    setXpEarned(xp);

    // Award badges
    const earnedBadges: string[] = [];
    if (finalRars >= 400) earnedBadges.push("Risk Manager");
    if (alignedWithProfile) earnedBadges.push("Disciplined Investor");
    if (decisions[1] === "buy_dip") earnedBadges.push("Contrarian Thinker");
    if (stressLevel < 40) earnedBadges.push("Cool Under Pressure");
    setBadges(earnedBadges);

    setPhase("results");
  };

  const resetLesson = () => {
    setPhase("hook");
    setHookCountdown(10);
    setHookDecision(null);
    setShowingAlert(true);
    setVolatilityThreshold(50);
    setSliderLocked(false);
    setCurrentSimIndex(0);
    setSimDecisions([]);
    setPortfolioValue(100000);
    setPortfolioHistory([]);
    setStressLevel(0);
    setRarsScore(0);
    setXpEarned(0);
    setBadges([]);
  };

  // PHASE 1: HOOK
  if (phase === "hook") {
    return (
      <div className={cn(
        "min-h-[600px] rounded-xl p-6 transition-all duration-300",
        showingAlert && !hookDecision ? "bg-red-950/80 animate-pulse" : "bg-gradient-to-br from-red-950/60 to-background"
      )}>
        <div className="flex flex-col items-center justify-center h-full space-y-8">
          <div className="flex items-center gap-3 text-red-400">
            <AlertTriangle className="w-12 h-12 animate-bounce" />
            <span className="text-3xl font-bold uppercase tracking-wider">Critical Alert</span>
            <AlertTriangle className="w-12 h-12 animate-bounce" />
          </div>

          <Card className="p-8 bg-black/60 border-red-500/50 max-w-2xl">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold text-red-400">
                Your portfolio is down 15% in 30 seconds
              </h2>
              <p className="text-lg text-muted-foreground">
                A major market event is unfolding. You have limited time to act.
              </p>
              
              {!hookDecision && (
                <div className="flex items-center justify-center gap-2 text-4xl font-mono text-red-400">
                  <Clock className="w-8 h-8" />
                  <span>{hookCountdown}s</span>
                </div>
              )}
            </div>
          </Card>

          {!hookDecision ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
              <Button
                size="lg"
                variant="destructive"
                className="h-32 flex flex-col gap-2 bg-red-600 hover:bg-red-700"
                onClick={() => handleHookDecision("panic_sell")}
              >
                <TrendingDown className="w-8 h-8" />
                <span className="text-lg font-bold">Panic Sell</span>
                <span className="text-xs opacity-80">Liquidate 50% of risky assets</span>
              </Button>

              <Button
                size="lg"
                className="h-32 flex flex-col gap-2 bg-emerald-600 hover:bg-emerald-700"
                onClick={() => handleHookDecision("hold_buy")}
              >
                <TrendingUp className="w-8 h-8" />
                <span className="text-lg font-bold">Hold & Buy</span>
                <span className="text-xs opacity-80">Add $5,000 to undervalued assets</span>
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="h-32 flex flex-col gap-2"
                onClick={() => handleHookDecision("wait")}
              >
                <Activity className="w-8 h-8" />
                <span className="text-lg font-bold">Wait</span>
                <span className="text-xs opacity-80">Let the market decide</span>
              </Button>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <Badge variant="outline" className="text-lg px-4 py-2">
                Decision: {hookDecision === "panic_sell" ? "Panic Sell" : hookDecision === "hold_buy" ? "Hold & Buy" : "Wait"}
              </Badge>
              <p className="text-muted-foreground">Processing market response...</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // PHASE 2: VOLATILITY SLIDER
  if (phase === "volatility") {
    const analogy = getVolatilityAnalogy();
    
    return (
      <div className="min-h-[600px] rounded-xl p-6 bg-gradient-to-br from-primary/10 to-background">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold">Set Your <AIContextualHelp term="Risk Tolerance" lessonId="2" lessonTitle="Risk & Reward">Risk Tolerance</AIContextualHelp></h2>
            <p className="text-muted-foreground">
              Drag the slider to define your acceptable <AIContextualHelp term="volatility" lessonId="2" lessonTitle="Risk & Reward">volatility</AIContextualHelp> threshold
            </p>
          </div>

          <Card className="p-8 space-y-8">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Volatility Threshold</span>
                <Badge variant="secondary" className="text-lg">
                  {volatilityThreshold}%
                </Badge>
              </div>

              <Slider
                value={[volatilityThreshold]}
                onValueChange={([v]) => !sliderLocked && setVolatilityThreshold(v)}
                max={100}
                step={1}
                disabled={sliderLocked}
                className="py-4"
              />

              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Conservative</span>
                <span>Balanced</span>
                <span>Aggressive</span>
                <span>Extreme</span>
              </div>
            </div>

            <div className="p-6 rounded-lg bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30">
              <div className="flex items-center gap-4">
                <span className="text-4xl">{analogy.icon}</span>
                <div>
                  <Badge className="mb-2">{analogy.label}</Badge>
                  <p className="text-lg italic">"{analogy.text}"</p>
                </div>
              </div>
            </div>

            {!sliderLocked && (
              <Button
                size="lg"
                className="w-full"
                onClick={lockVolatility}
              >
                <Target className="w-5 h-5 mr-2" />
                Lock Risk Profile & Begin Simulation
              </Button>
            )}
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4 text-center">
              <div className="text-sm text-muted-foreground">Current Portfolio</div>
              <div className="text-2xl font-bold text-primary">
                ${portfolioValue.toLocaleString()}
              </div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-sm text-muted-foreground">Stress Level</div>
              <Progress value={stressLevel} className="mt-2" />
              <div className="text-sm mt-1">{stressLevel}%</div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // PHASE 3: SIMULATION
  if (phase === "simulation") {
    const event = SIMULATION_EVENTS[currentSimIndex];
    const hasDecided = simDecisions.length > currentSimIndex;

    return (
      <div className="min-h-[600px] rounded-xl p-6 bg-gradient-to-br from-background to-primary/5">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header Stats */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-4 text-center">
              <div className="text-sm text-muted-foreground">Portfolio Value</div>
              <div className={cn(
                "text-2xl font-bold",
                portfolioValue > 100000 ? "text-emerald-400" : "text-red-400"
              )}>
                ${portfolioValue.toLocaleString()}
              </div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-sm text-muted-foreground">Event</div>
              <div className="text-lg font-bold">{currentSimIndex + 1} / 3</div>
            </Card>
            <Card className="p-4">
              <div className="text-sm text-muted-foreground mb-1">Stress Meter</div>
              <Progress 
                value={stressLevel} 
                className={cn(
                  stressLevel > 70 ? "bg-red-200" : stressLevel > 40 ? "bg-yellow-200" : "bg-emerald-200"
                )}
              />
              <div className="text-xs text-right mt-1">{stressLevel}%</div>
            </Card>
          </div>

          {/* Event Card */}
          <Card className={cn(
            "p-6 border-2",
            event.phase === "black_swan" ? "border-red-500/50 bg-red-950/20" :
            event.phase === "euphoria_spike" ? "border-emerald-500/50 bg-emerald-950/20" :
            "border-yellow-500/50 bg-yellow-950/20"
          )}>
            <div className="flex items-center justify-between mb-4">
              <Badge variant="outline" className="text-sm">
                {event.duration}
              </Badge>
              <Badge variant={event.phase === "black_swan" ? "destructive" : event.phase === "euphoria_spike" ? "default" : "secondary"}>
                {event.phase.replace("_", " ").toUpperCase()}
              </Badge>
            </div>
            
            <h3 className="text-2xl font-bold mb-2">{event.title}</h3>
            <p className="text-muted-foreground mb-6">{event.description}</p>

            {!hasDecided ? (
              <div className="grid grid-cols-2 gap-4">
                {event.options.map((option) => (
                  <Button
                    key={option.id}
                    size="lg"
                    variant={option.id === "sell" || option.id === "reallocate" ? "outline" : "default"}
                    className="h-24 flex flex-col gap-1"
                    onClick={() => handleSimDecision(option.id)}
                  >
                    <span className="font-bold">{option.label}</span>
                    <span className="text-xs opacity-80">{option.description}</span>
                  </Button>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <Badge className="text-lg px-4 py-2">
                  Decision Made: {simDecisions[currentSimIndex]}
                </Badge>
                <p className="text-sm text-muted-foreground mt-2">Loading next event...</p>
              </div>
            )}
          </Card>

          {/* Portfolio Chart */}
          {portfolioHistory.length > 1 && (
            <Card className="p-4">
              <h4 className="font-semibold mb-4">Portfolio Performance</h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={portfolioHistory}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="time" hide />
                    <YAxis domain={['auto', 'auto']} />
                    <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} />
                    <Legend />
                    <ReferenceLine y={100000} stroke="#666" strokeDasharray="3 3" />
                    <Line type="monotone" dataKey="value" name="Your Portfolio" stroke="#3b82f6" strokeWidth={3} dot={false} />
                    <Line type="monotone" dataKey="optimal" name="Optimal" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                    <Line type="monotone" dataKey="panic" name="Panic Seller" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          )}
        </div>
      </div>
    );
  }

  // PHASE 4: RESULTS
  return (
    <div className="min-h-[600px] rounded-xl p-6 bg-gradient-to-br from-primary/20 to-background">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <Trophy className="w-16 h-16 mx-auto text-yellow-400" />
          <h2 className="text-3xl font-bold">Simulation Complete</h2>
          <p className="text-muted-foreground">Your Risk-Adjusted Return Score</p>
        </div>

        <Card className="p-8 text-center bg-gradient-to-br from-primary/10 to-secondary/10">
          <div className="text-6xl font-bold text-primary mb-2">{rarsScore}</div>
          <div className="text-sm text-muted-foreground">RARS Score (0-500)</div>
          <Progress value={(rarsScore / 500) * 100} className="mt-4 h-3" />
          <div className="mt-4 text-sm">
            {rarsScore >= 400 ? "🏆 Excellent! You've unlocked the advanced scenario." :
             rarsScore >= 300 ? "💪 Good performance! Keep practicing." :
             rarsScore >= 200 ? "📈 Room for improvement. Try again!" :
             "🎯 Learning experience. Emotions are powerful!"}
          </div>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          <Card className="p-6 text-center">
            <Zap className="w-8 h-8 mx-auto text-yellow-400 mb-2" />
            <div className="text-3xl font-bold text-yellow-400">+{xpEarned} XP</div>
            <div className="text-sm text-muted-foreground">Experience Earned</div>
          </Card>
          <Card className="p-6 text-center">
            <Brain className="w-8 h-8 mx-auto text-purple-400 mb-2" />
            <div className="text-3xl font-bold">{stressLevel}%</div>
            <div className="text-sm text-muted-foreground">Final Stress Level</div>
          </Card>
        </div>

        {/* Final Portfolio Comparison */}
        <Card className="p-6">
          <h4 className="font-semibold mb-4">Final Comparison</h4>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-emerald-400">
                ${portfolioHistory[portfolioHistory.length - 1]?.optimal.toLocaleString() || "—"}
              </div>
              <div className="text-xs text-muted-foreground">Optimal Outcome</div>
            </div>
            <div className="border-x border-border px-4">
              <div className={cn(
                "text-lg font-bold",
                portfolioValue > 100000 ? "text-primary" : "text-red-400"
              )}>
                ${portfolioValue.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">Your Outcome</div>
            </div>
            <div>
              <div className="text-lg font-bold text-red-400">
                ${portfolioHistory[portfolioHistory.length - 1]?.panic.toLocaleString() || "—"}
              </div>
              <div className="text-xs text-muted-foreground">Panic Seller</div>
            </div>
          </div>
        </Card>

        {/* Badges */}
        {badges.length > 0 && (
          <Card className="p-6">
            <h4 className="font-semibold mb-4">Badges Earned</h4>
            <div className="flex flex-wrap gap-2">
              {badges.map((badge) => (
                <Badge key={badge} variant="secondary" className="text-sm px-3 py-1">
                  🏅 {badge}
                </Badge>
              ))}
            </div>
          </Card>
        )}

        <div className="flex gap-4">
          <Button size="lg" onClick={resetLesson} className="flex-1">
            Replay Simulation
          </Button>
          {rarsScore >= 350 && (
            <Button size="lg" variant="outline" className="flex-1">
              Next Lesson: Compound Interest →
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

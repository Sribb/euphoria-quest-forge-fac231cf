import { useState, useEffect, useCallback, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Wallet, TrendingUp, TrendingDown, AlertTriangle, Trophy, Sparkles,
  Clock, Target, Lightbulb, MessageCircle, Zap, Award, CheckCircle,
  PiggyBank, LineChart, Shield, Flame, Timer, Brain, ArrowRight,
  Info, ChevronRight, DollarSign, Percent, Calendar
} from "lucide-react";
import { LineChart as RechartsLine, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart, CartesianGrid, Legend, ReferenceLine } from "recharts";
import { toast } from "sonner";

interface MentorInsight {
  id: string;
  type: "warning" | "success" | "tip" | "exploration";
  title: string;
  message: string;
  icon: React.ElementType;
  timestamp: number;
}

interface SimulationState {
  mode: "saving" | "investing";
  initialAmount: number;
  monthlyContribution: number;
  years: number;
  riskLevel: number; // 1-5
  inflationRate: number;
}

interface ScenarioTask {
  id: string;
  title: string;
  description: string;
  targetValue: number;
  maxRisk: number;
  completed: boolean;
  xpReward: number;
}

const calculateProjection = (state: SimulationState) => {
  const data: { year: number; saving: number; investing: number; inflation: number; contributions: number }[] = [];
  
  const savingsRate = 0.005; // 0.5% annual savings rate
  const investingReturns = [0.02, 0.04, 0.07, 0.10, 0.14]; // Returns by risk level
  const investingRate = investingReturns[state.riskLevel - 1];
  
  let savingValue = state.initialAmount;
  let investingValue = state.initialAmount;
  let inflationBaseline = state.initialAmount;
  let totalContributions = state.initialAmount;
  
  for (let year = 0; year <= state.years; year++) {
    data.push({
      year,
      saving: Math.round(savingValue),
      investing: Math.round(investingValue),
      inflation: Math.round(inflationBaseline),
      contributions: Math.round(totalContributions)
    });
    
    // Apply returns and contributions for next year
    if (year < state.years) {
      totalContributions += state.monthlyContribution * 12;
      
      // Savings: low return
      savingValue = savingValue * (1 + savingsRate) + state.monthlyContribution * 12;
      
      // Investing: variable return with volatility
      const volatilityFactor = state.riskLevel * 0.05;
      const yearlyReturn = investingRate + (Math.sin(year * 2.5) * volatilityFactor);
      investingValue = investingValue * (1 + yearlyReturn) + state.monthlyContribution * 12;
      
      // Inflation erosion of purchasing power
      inflationBaseline = inflationBaseline * (1 - state.inflationRate) + state.monthlyContribution * 12 * (1 - state.inflationRate * year / state.years);
    }
  }
  
  return data;
};

const riskLabels = ["Very Low", "Low", "Moderate", "High", "Very High"];
const riskColors = ["text-blue-400", "text-green-400", "text-yellow-400", "text-orange-400", "text-red-400"];

export const InvestingSimulationLab = () => {
  const [state, setState] = useState<SimulationState>({
    mode: "investing",
    initialAmount: 1000,
    monthlyContribution: 100,
    years: 10,
    riskLevel: 3,
    inflationRate: 0.03
  });
  
  const [insights, setInsights] = useState<MentorInsight[]>([]);
  const [shownInsights, setShownInsights] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState("projection");
  const [lastInteraction, setLastInteraction] = useState(Date.now());
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());
  const [totalXP, setTotalXP] = useState(0);
  const [showReview, setShowReview] = useState(false);
  
  const projectionData = useMemo(() => calculateProjection(state), [state]);
  
  const finalValues = useMemo(() => {
    const last = projectionData[projectionData.length - 1];
    return {
      saving: last?.saving || 0,
      investing: last?.investing || 0,
      difference: (last?.investing || 0) - (last?.saving || 0),
      contributions: last?.contributions || 0,
      inflationAdjusted: last?.inflation || 0
    };
  }, [projectionData]);

  const scenarios: ScenarioTask[] = [
    {
      id: "beat-inflation",
      title: "Beat Inflation",
      description: "Adjust your portfolio to grow faster than inflation (3%/year)",
      targetValue: state.initialAmount * Math.pow(1.03, state.years) + state.monthlyContribution * 12 * state.years,
      maxRisk: 5,
      completed: completedTasks.has("beat-inflation"),
      xpReward: 50
    },
    {
      id: "retirement-goal",
      title: "Reach $50,000",
      description: "Configure your investments to reach $50,000 in 20 years or less",
      targetValue: 50000,
      maxRisk: 3,
      completed: completedTasks.has("retirement-goal"),
      xpReward: 100
    },
    {
      id: "balanced-approach",
      title: "Balanced Growth",
      description: "Achieve 2x your investment with moderate risk (level 3 or below)",
      targetValue: (state.initialAmount + state.monthlyContribution * 12 * state.years) * 2,
      maxRisk: 3,
      completed: completedTasks.has("balanced-approach"),
      xpReward: 75
    }
  ];

  // Mentor insight system
  const addInsight = useCallback((insight: Omit<MentorInsight, "id" | "timestamp">) => {
    const id = `${insight.type}-${Date.now()}`;
    if (!shownInsights.has(id.split("-").slice(0, 2).join("-"))) {
      setInsights(prev => [{
        ...insight,
        id,
        timestamp: Date.now()
      }, ...prev].slice(0, 5));
      setShownInsights(prev => new Set([...prev, id.split("-").slice(0, 2).join("-")]));
    }
  }, [shownInsights]);

  // Track scenario completion
  useEffect(() => {
    const checkScenarios = () => {
      // Beat inflation check
      if (finalValues.investing > finalValues.inflationAdjusted && !completedTasks.has("beat-inflation")) {
        setCompletedTasks(prev => new Set([...prev, "beat-inflation"]));
        setTotalXP(prev => prev + 50);
        toast.success("🎉 Scenario Complete: Beat Inflation! +50 XP");
      }
      
      // Retirement goal check
      if (finalValues.investing >= 50000 && state.years <= 20 && !completedTasks.has("retirement-goal")) {
        setCompletedTasks(prev => new Set([...prev, "retirement-goal"]));
        setTotalXP(prev => prev + 100);
        toast.success("🎉 Scenario Complete: Reach $50,000! +100 XP");
      }
      
      // Balanced approach check
      const targetBalance = (state.initialAmount + state.monthlyContribution * 12 * state.years) * 2;
      if (finalValues.investing >= targetBalance && state.riskLevel <= 3 && !completedTasks.has("balanced-approach")) {
        setCompletedTasks(prev => new Set([...prev, "balanced-approach"]));
        setTotalXP(prev => prev + 75);
        toast.success("🎉 Scenario Complete: Balanced Growth! +75 XP");
      }
    };
    
    checkScenarios();
  }, [finalValues, state, completedTasks]);

  // Real-time mentor insights based on user behavior
  useEffect(() => {
    // High risk + short time warning
    if (state.riskLevel >= 4 && state.years <= 5 && !shownInsights.has("warning-highrisk")) {
      addInsight({
        type: "warning",
        title: "Risk Alert",
        message: "Benjamin Graham warns: 'Short-term volatility is high. Without patience, you're gambling, not investing.'",
        icon: AlertTriangle
      });
    }
    
    // Low risk + long time tip
    if (state.riskLevel <= 2 && state.years >= 15 && !shownInsights.has("tip-lowrisk")) {
      addInsight({
        type: "tip",
        title: "Opportunity",
        message: "With a 15+ year horizon, history shows you can afford more risk. Consider increasing exposure for potentially higher returns.",
        icon: Lightbulb
      });
    }
    
    // Beating inflation success
    if (finalValues.investing > finalValues.inflationAdjusted && !shownInsights.has("success-inflation")) {
      addInsight({
        type: "success",
        title: "Outpacing Inflation!",
        message: "Your investment is growing faster than inflation. Your purchasing power is increasing over time!",
        icon: Trophy
      });
    }
    
    // No contributions warning
    if (state.monthlyContribution === 0 && !shownInsights.has("warning-nocontrib")) {
      addInsight({
        type: "warning",
        title: "Missing Compound Power",
        message: "Regular contributions dramatically boost compound growth. Even $50/month makes a big difference over time!",
        icon: Info
      });
    }
  }, [state, finalValues, addInsight, shownInsights]);

  // Inactivity prompt
  useEffect(() => {
    const inactivityTimer = setInterval(() => {
      if (Date.now() - lastInteraction > 30000 && !shownInsights.has("exploration-inactive")) {
        addInsight({
          type: "exploration",
          title: "Keep Exploring!",
          message: "Try adjusting the years slider to see how time dramatically affects compound growth.",
          icon: Brain
        });
      }
    }, 30000);
    
    return () => clearInterval(inactivityTimer);
  }, [lastInteraction, addInsight, shownInsights]);

  const handleStateChange = (updates: Partial<SimulationState>) => {
    setState(prev => ({ ...prev, ...updates }));
    setLastInteraction(Date.now());
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/20 via-emerald-500/10 to-purple-500/20 border-b border-border p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <Badge variant="outline" className="mb-2">Interactive Simulation Lab</Badge>
              <h1 className="text-3xl font-bold">Saving vs. Investing</h1>
              <p className="text-muted-foreground mt-1">Experiment with variables to see how your money grows</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Experience Points</p>
                <p className="text-2xl font-bold text-primary">{totalXP} XP</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Trophy className="h-6 w-6 text-primary" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Left Panel - Lab Controls */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="border-primary/30 shadow-lg shadow-primary/5">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Control Lab
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Save vs Invest Toggle */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-muted/50 to-muted/30 border border-border">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <PiggyBank className={`h-5 w-5 ${state.mode === 'saving' ? 'text-blue-400' : 'text-muted-foreground'}`} />
                      <span className={state.mode === 'saving' ? 'font-medium' : 'text-muted-foreground'}>Saving</span>
                    </div>
                    <Switch
                      checked={state.mode === 'investing'}
                      onCheckedChange={(checked) => handleStateChange({ mode: checked ? 'investing' : 'saving' })}
                    />
                    <div className="flex items-center gap-2">
                      <span className={state.mode === 'investing' ? 'font-medium' : 'text-muted-foreground'}>Investing</span>
                      <TrendingUp className={`h-5 w-5 ${state.mode === 'investing' ? 'text-emerald-400' : 'text-muted-foreground'}`} />
                    </div>
                  </div>
                  <p className="text-xs text-center text-muted-foreground">
                    {state.mode === 'saving' 
                      ? 'Low risk, but barely keeps up with inflation' 
                      : 'Higher potential returns with market exposure'}
                  </p>
                </div>

                {/* Initial Amount */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm font-medium">
                      <Wallet className="h-4 w-4 text-primary" />
                      Starting Amount
                    </label>
                    <Badge variant="secondary">{formatCurrency(state.initialAmount)}</Badge>
                  </div>
                  <Slider
                    value={[state.initialAmount]}
                    onValueChange={([value]) => handleStateChange({ initialAmount: value })}
                    min={100}
                    max={10000}
                    step={100}
                    className="cursor-pointer"
                  />
                </div>

                {/* Monthly Contribution */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm font-medium">
                      <DollarSign className="h-4 w-4 text-emerald-400" />
                      Monthly Contribution
                    </label>
                    <Badge variant="secondary">{formatCurrency(state.monthlyContribution)}/mo</Badge>
                  </div>
                  <Slider
                    value={[state.monthlyContribution]}
                    onValueChange={([value]) => handleStateChange({ monthlyContribution: value })}
                    min={0}
                    max={1000}
                    step={25}
                    className="cursor-pointer"
                  />
                </div>

                {/* Time Horizon */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm font-medium">
                      <Calendar className="h-4 w-4 text-purple-400" />
                      Time Horizon
                    </label>
                    <Badge variant="secondary">{state.years} years</Badge>
                  </div>
                  <Slider
                    value={[state.years]}
                    onValueChange={([value]) => handleStateChange({ years: value })}
                    min={1}
                    max={40}
                    step={1}
                    className="cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Short-term</span>
                    <span>Long-term</span>
                  </div>
                </div>

                {/* Risk Level (only for investing mode) */}
                {state.mode === 'investing' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 text-sm font-medium">
                        <Flame className="h-4 w-4 text-orange-400" />
                        Risk Level
                      </label>
                      <Badge className={riskColors[state.riskLevel - 1]} variant="outline">
                        {riskLabels[state.riskLevel - 1]}
                      </Badge>
                    </div>
                    <Slider
                      value={[state.riskLevel]}
                      onValueChange={([value]) => handleStateChange({ riskLevel: value })}
                      min={1}
                      max={5}
                      step={1}
                      className="cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Conservative</span>
                      <span>Aggressive</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Mentor Insights Panel */}
            <Card className="border-amber-500/30 bg-gradient-to-br from-amber-500/5 to-background">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MessageCircle className="h-5 w-5 text-amber-400" />
                  Mentor Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 max-h-[300px] overflow-y-auto">
                {insights.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Adjust the controls above to receive real-time insights based on your decisions.
                  </p>
                ) : (
                  insights.map((insight) => (
                    <div 
                      key={insight.id}
                      className={`p-3 rounded-lg border animate-fade-in ${
                        insight.type === 'warning' ? 'bg-orange-500/10 border-orange-500/30' :
                        insight.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30' :
                        insight.type === 'tip' ? 'bg-blue-500/10 border-blue-500/30' :
                        'bg-purple-500/10 border-purple-500/30'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <insight.icon className={`h-4 w-4 mt-0.5 ${
                          insight.type === 'warning' ? 'text-orange-400' :
                          insight.type === 'success' ? 'text-emerald-400' :
                          insight.type === 'tip' ? 'text-blue-400' :
                          'text-purple-400'
                        }`} />
                        <div>
                          <p className="font-medium text-sm">{insight.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">{insight.message}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Projection Display */}
          <div className="lg:col-span-8 space-y-6">
            <Card className="shadow-xl">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <LineChart className="h-5 w-5 text-primary" />
                    Live Projection
                  </CardTitle>
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="h-8">
                      <TabsTrigger value="projection" className="text-xs">Growth Chart</TabsTrigger>
                      <TabsTrigger value="comparison" className="text-xs">Compare</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={projectionData}>
                      <defs>
                        <linearGradient id="investingGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="savingGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="inflationGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis 
                        dataKey="year" 
                        stroke="#666"
                        tickFormatter={(value) => `Y${value}`}
                      />
                      <YAxis 
                        stroke="#666"
                        tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                        formatter={(value: number, name: string) => [
                          formatCurrency(value),
                          name === 'investing' ? 'Investing' : 
                          name === 'saving' ? 'Saving' : 
                          name === 'inflation' ? 'Inflation-Adjusted' : 'Contributions'
                        ]}
                        labelFormatter={(label) => `Year ${label}`}
                      />
                      <Legend />
                      
                      {/* Contributions baseline */}
                      <Area
                        type="monotone"
                        dataKey="contributions"
                        stroke="#666"
                        strokeDasharray="5 5"
                        fill="none"
                        name="contributions"
                      />
                      
                      {/* Inflation-adjusted line */}
                      <Area
                        type="monotone"
                        dataKey="inflation"
                        stroke="#ef4444"
                        fill="url(#inflationGradient)"
                        strokeWidth={2}
                        name="inflation"
                      />
                      
                      {/* Saving line */}
                      <Area
                        type="monotone"
                        dataKey="saving"
                        stroke="#3b82f6"
                        fill="url(#savingGradient)"
                        strokeWidth={2}
                        name="saving"
                      />
                      
                      {/* Investing line */}
                      {state.mode === 'investing' && (
                        <Area
                          type="monotone"
                          dataKey="investing"
                          stroke="#10b981"
                          fill="url(#investingGradient)"
                          strokeWidth={3}
                          name="investing"
                        />
                      )}
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Results Summary */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  <div className="p-4 rounded-xl bg-muted/50 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Contributions</p>
                    <p className="text-xl font-bold">{formatCurrency(finalValues.contributions)}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-blue-500/10 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Savings Account</p>
                    <p className="text-xl font-bold text-blue-400">{formatCurrency(finalValues.saving)}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-emerald-500/10 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Investment Value</p>
                    <p className="text-xl font-bold text-emerald-400">{formatCurrency(finalValues.investing)}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-emerald-500/10 text-center border border-primary/30">
                    <p className="text-xs text-muted-foreground mb-1">Extra Earnings</p>
                    <p className="text-xl font-bold text-primary">+{formatCurrency(finalValues.difference)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Scenario Tasks */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Scenario Challenges
                </CardTitle>
                <p className="text-sm text-muted-foreground">Complete these tasks by adjusting the lab controls</p>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {scenarios.map((scenario) => (
                    <div 
                      key={scenario.id}
                      className={`p-4 rounded-xl border transition-all ${
                        scenario.completed 
                          ? 'bg-emerald-500/10 border-emerald-500/30' 
                          : 'bg-muted/30 border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-sm">{scenario.title}</h4>
                        {scenario.completed ? (
                          <CheckCircle className="h-5 w-5 text-emerald-400" />
                        ) : (
                          <Badge variant="outline" className="text-xs">+{scenario.xpReward} XP</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{scenario.description}</p>
                      {scenario.completed && (
                        <Badge className="mt-2 bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Completed
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Complete Lab Button */}
            {completedTasks.size >= 2 && (
              <div className="flex justify-center animate-fade-in">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-primary to-emerald-500 hover:from-primary/90 hover:to-emerald-500/90 gap-2"
                  onClick={() => setShowReview(true)}
                >
                  <Award className="h-5 w-5" />
                  Complete Lab & Earn Certificate
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lab Completion Review */}
      {showReview && (
        <div className="fixed inset-0 bg-background/95 z-50 flex items-center justify-center p-6 animate-fade-in">
          <Card className="max-w-lg w-full border-primary/30">
            <CardContent className="pt-8 text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-emerald-500 flex items-center justify-center mx-auto mb-6">
                <Trophy className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-2">Lab Complete!</h2>
              <p className="text-muted-foreground mb-6">You've mastered the fundamentals of saving vs. investing</p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 rounded-xl bg-muted/50">
                  <p className="text-sm text-muted-foreground">Scenarios Completed</p>
                  <p className="text-3xl font-bold text-primary">{completedTasks.size}/3</p>
                </div>
                <div className="p-4 rounded-xl bg-muted/50">
                  <p className="text-sm text-muted-foreground">XP Earned</p>
                  <p className="text-3xl font-bold text-emerald-400">{totalXP}</p>
                </div>
              </div>

              <div className="space-y-3 text-left mb-6">
                <h4 className="font-semibold">Key Takeaways:</h4>
                <div className="flex items-start gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5" />
                  <span>Time in the market beats timing the market</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5" />
                  <span>Compound interest accelerates exponentially over time</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5" />
                  <span>Risk tolerance should match your time horizon</span>
                </div>
              </div>

              <Button 
                className="w-full bg-gradient-to-r from-primary to-emerald-500"
                onClick={() => setShowReview(false)}
              >
                Continue Learning
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

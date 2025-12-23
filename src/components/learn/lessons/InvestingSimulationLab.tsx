import { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { 
  TrendingUp, TrendingDown, AlertTriangle, Trophy, Sparkles,
  Lightbulb, Zap, CheckCircle, PiggyBank, Shield, ArrowRight,
  Info, DollarSign, Calendar, Clock, Target, Flame, 
  HelpCircle, ChevronDown, Play
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, ReferenceLine, Tooltip as RechartsTooltip } from "recharts";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SimulationState {
  mode: "saving" | "investing";
  initialAmount: number;
  monthlyContribution: number;
  years: number;
  riskLevel: number;
}

interface WhatIfScenario {
  id: string;
  label: string;
  description: string;
  config: Partial<SimulationState>;
}

const calculateProjection = (state: SimulationState) => {
  const data: { year: number; saving: number; investing: number; inflation: number }[] = [];
  
  const savingsRate = 0.005;
  const investingReturns = [0.02, 0.04, 0.07, 0.10, 0.14];
  const investingRate = investingReturns[state.riskLevel - 1];
  const inflationRate = 0.03;
  
  let savingValue = state.initialAmount;
  let investingValue = state.initialAmount;
  let inflationBaseline = state.initialAmount;
  
  for (let year = 0; year <= state.years; year++) {
    data.push({
      year,
      saving: Math.round(savingValue),
      investing: Math.round(investingValue),
      inflation: Math.round(inflationBaseline)
    });
    
    if (year < state.years) {
      savingValue = savingValue * (1 + savingsRate) + state.monthlyContribution * 12;
      
      const volatilityFactor = state.riskLevel * 0.03;
      const yearlyReturn = investingRate + (Math.sin(year * 2.5) * volatilityFactor);
      investingValue = investingValue * (1 + yearlyReturn) + state.monthlyContribution * 12;
      
      inflationBaseline = inflationBaseline * (1 - inflationRate) + state.monthlyContribution * 12 * 0.97;
    }
  }
  
  return data;
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: 'USD', 
    maximumFractionDigits: 0 
  }).format(value);
};

const riskLabels = ["Conservative", "Cautious", "Balanced", "Growth", "Aggressive"];

export const InvestingSimulationLab = () => {
  const [state, setState] = useState<SimulationState>({
    mode: "investing",
    initialAmount: 1000,
    monthlyContribution: 100,
    years: 10,
    riskLevel: 3
  });
  
  const [activeWhatIf, setActiveWhatIf] = useState<string | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [mentorMessage, setMentorMessage] = useState<{ type: string; message: string } | null>(null);
  const [completedInsights, setCompletedInsights] = useState<Set<string>>(new Set());

  const projectionData = useMemo(() => calculateProjection(state), [state]);
  
  const finalValues = useMemo(() => {
    const last = projectionData[projectionData.length - 1];
    const totalContributions = state.initialAmount + state.monthlyContribution * 12 * state.years;
    return {
      saving: last?.saving || 0,
      investing: last?.investing || 0,
      inflation: last?.inflation || 0,
      contributions: totalContributions,
      investingGain: (last?.investing || 0) - totalContributions,
      savingGain: (last?.saving || 0) - totalContributions,
      difference: (last?.investing || 0) - (last?.saving || 0),
      beatsInflation: (last?.investing || 0) > (last?.inflation || 0)
    };
  }, [projectionData, state]);

  const whatIfScenarios: WhatIfScenario[] = [
    {
      id: "early-start",
      label: "Start 10 Years Earlier",
      description: "See how starting at 20 instead of 30 changes everything",
      config: { years: 40 }
    },
    {
      id: "double-contribution",
      label: "Double Your Monthly",
      description: "What if you could save $200/month instead?",
      config: { monthlyContribution: state.monthlyContribution * 2 }
    },
    {
      id: "market-crash",
      label: "Conservative After Crash",
      description: "Switch to low risk after a market scare",
      config: { riskLevel: 1 }
    },
    {
      id: "aggressive-youth",
      label: "Aggressive in Your 20s",
      description: "Max risk with 30+ years to recover",
      config: { riskLevel: 5, years: 30 }
    }
  ];

  // Mentor insight system - reacts to user behavior
  useEffect(() => {
    if (!hasInteracted) return;

    // High risk + short time warning
    if (state.riskLevel >= 4 && state.years <= 5 && !completedInsights.has("risk-warning")) {
      setMentorMessage({
        type: "warning",
        message: "⚠️ With only " + state.years + " years, high volatility could hurt you. Consider lowering risk or extending your timeline."
      });
      setCompletedInsights(prev => new Set([...prev, "risk-warning"]));
    }
    // Success: beating inflation
    else if (finalValues.beatsInflation && !completedInsights.has("beats-inflation")) {
      setMentorMessage({
        type: "success", 
        message: "🎯 Your investments are outpacing inflation! Your purchasing power is growing, not shrinking."
      });
      setCompletedInsights(prev => new Set([...prev, "beats-inflation"]));
    }
    // Tip: low risk + long horizon
    else if (state.riskLevel <= 2 && state.years >= 20 && !completedInsights.has("risk-tip")) {
      setMentorMessage({
        type: "tip",
        message: "💡 With 20+ years ahead, you can afford more volatility. History shows higher risk pays off over long periods."
      });
      setCompletedInsights(prev => new Set([...prev, "risk-tip"]));
    }
    // No contributions
    else if (state.monthlyContribution === 0 && !completedInsights.has("no-contrib")) {
      setMentorMessage({
        type: "tip",
        message: "💡 Even $50/month dramatically accelerates compound growth. Try sliding the contribution up."
      });
      setCompletedInsights(prev => new Set([...prev, "no-contrib"]));
    }
  }, [state, finalValues, hasInteracted, completedInsights]);

  const handleStateChange = (updates: Partial<SimulationState>) => {
    setState(prev => ({ ...prev, ...updates }));
    setHasInteracted(true);
    setActiveWhatIf(null);
  };

  const applyWhatIf = (scenario: WhatIfScenario) => {
    setState(prev => ({ ...prev, ...scenario.config }));
    setActiveWhatIf(scenario.id);
    setHasInteracted(true);
    toast.success(`Applied: ${scenario.label}`);
  };

  // Annotated milestones for the chart
  const milestones = useMemo(() => {
    const midpoint = Math.floor(state.years / 2);
    const midData = projectionData[midpoint];
    return {
      midpoint: {
        year: midpoint,
        value: midData?.investing || 0,
        label: `Halfway: ${formatCurrency(midData?.investing || 0)}`
      }
    };
  }, [projectionData, state.years]);

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-[#0a0a0f] text-slate-100">
        {/* Narrative Header */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-transparent to-blue-900/20" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent" />
          
          <div className="relative max-w-5xl mx-auto px-6 py-12">
            <Badge className="mb-4 bg-emerald-500/20 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/30">
              <Sparkles className="h-3 w-3 mr-1" />
              Interactive Simulation
            </Badge>
            
            {/* High-impact opening narrative */}
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Your money can work <span className="text-emerald-400">for you</span><br />
              or slowly lose its power.
            </h1>
            
            <p className="text-xl text-slate-300 max-w-2xl leading-relaxed">
              Every dollar you don't invest loses about 3% of its purchasing power each year. 
              Over 20 years, that's almost half its value, gone to inflation. 
              <span className="text-slate-100 font-medium"> See it happen below.</span>
            </p>
          </div>
        </div>

        {/* Main Interactive Section */}
        <div className="max-w-5xl mx-auto px-6 pb-16">
          {/* Primary Choice Toggle */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-6 p-2 rounded-2xl bg-slate-900/80 border border-slate-800">
              <button
                onClick={() => handleStateChange({ mode: "saving" })}
                className={`flex items-center gap-3 px-6 py-4 rounded-xl transition-all ${
                  state.mode === "saving" 
                    ? "bg-blue-500/20 text-blue-300 border border-blue-500/40" 
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <PiggyBank className="h-6 w-6" />
                <div className="text-left">
                  <p className="font-semibold">Saving</p>
                  <p className="text-xs opacity-70">0.5% APY, minimal risk</p>
                </div>
              </button>
              
              <div className="h-12 w-px bg-slate-700" />
              
              <button
                onClick={() => handleStateChange({ mode: "investing" })}
                className={`flex items-center gap-3 px-6 py-4 rounded-xl transition-all ${
                  state.mode === "investing" 
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40" 
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <TrendingUp className="h-6 w-6" />
                <div className="text-left">
                  <p className="font-semibold">Investing</p>
                  <p className="text-xs opacity-70">Variable returns, market exposure</p>
                </div>
              </button>
            </div>
          </div>

          {/* Live Chart with Integrated Annotations */}
          <div className="relative mb-8 p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
            {/* Chart Title with Live Value */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm text-slate-400 mb-1">Your projected wealth after {state.years} years</p>
                <p className="text-4xl font-bold text-emerald-400">
                  {formatCurrency(state.mode === "investing" ? finalValues.investing : finalValues.saving)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-400 mb-1">Total gain from growth</p>
                <p className={`text-2xl font-bold ${
                  (state.mode === "investing" ? finalValues.investingGain : finalValues.savingGain) > 0 
                    ? "text-emerald-400" 
                    : "text-red-400"
                }`}>
                  +{formatCurrency(state.mode === "investing" ? finalValues.investingGain : finalValues.savingGain)}
                </p>
              </div>
            </div>

            {/* The Chart */}
            <div className="h-[320px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={projectionData} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                  <defs>
                    <linearGradient id="investGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.05}/>
                    </linearGradient>
                    <linearGradient id="saveGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05}/>
                    </linearGradient>
                    <linearGradient id="inflationGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  
                  <XAxis 
                    dataKey="year" 
                    stroke="#475569"
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => v === 0 ? "Now" : `${v}y`}
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                  />
                  <YAxis 
                    stroke="#475569"
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                    width={50}
                  />
                  
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '12px',
                      padding: '12px'
                    }}
                    labelStyle={{ color: '#94a3b8', marginBottom: '8px' }}
                    formatter={(value: number, name: string) => [
                      formatCurrency(value),
                      name === 'investing' ? '📈 Investing' : 
                      name === 'saving' ? '🏦 Saving' : 
                      '📉 After Inflation'
                    ]}
                    labelFormatter={(label) => label === 0 ? "Today" : `Year ${label}`}
                  />
                  
                  {/* Inflation baseline - always show */}
                  <Area
                    type="monotone"
                    dataKey="inflation"
                    stroke="#ef4444"
                    strokeWidth={2}
                    strokeDasharray="6 4"
                    fill="url(#inflationGrad)"
                    name="inflation"
                  />
                  
                  {/* Saving line */}
                  <Area
                    type="monotone"
                    dataKey="saving"
                    stroke="#3b82f6"
                    strokeWidth={state.mode === "saving" ? 3 : 2}
                    fill={state.mode === "saving" ? "url(#saveGrad)" : "none"}
                    fillOpacity={state.mode === "saving" ? 1 : 0}
                    name="saving"
                  />
                  
                  {/* Investing line */}
                  {state.mode === "investing" && (
                    <Area
                      type="monotone"
                      dataKey="investing"
                      stroke="#10b981"
                      strokeWidth={3}
                      fill="url(#investGrad)"
                      name="investing"
                    />
                  )}
                  
                  {/* Milestone reference line */}
                  <ReferenceLine 
                    x={milestones.midpoint.year} 
                    stroke="#475569" 
                    strokeDasharray="3 3"
                    label={{ 
                      value: `Halfway`, 
                      position: 'top',
                      fill: '#94a3b8',
                      fontSize: 11
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
              
              {/* Chart Legend - Integrated */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-center gap-6 text-xs">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500" />
                  Investing
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-blue-500" />
                  Saving
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-3 h-0.5 bg-red-500" style={{ borderBottom: '2px dashed #ef4444' }} />
                  Inflation Loss
                </span>
              </div>
            </div>
          </div>

          {/* Mentor Insight - Contextual Notification */}
          {mentorMessage && (
            <div className={`mb-8 p-4 rounded-2xl border animate-fade-in ${
              mentorMessage.type === "warning" 
                ? "bg-amber-500/10 border-amber-500/30 text-amber-200"
                : mentorMessage.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-200"
                : "bg-blue-500/10 border-blue-500/30 text-blue-200"
            }`}>
              <p className="text-sm leading-relaxed">{mentorMessage.message}</p>
            </div>
          )}

          {/* Controls with Inline Tips */}
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            {/* Starting Amount */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-emerald-400" />
                  <span className="text-sm font-medium text-slate-200">Starting Amount</span>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3.5 w-3.5 text-slate-500" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>Your initial investment. Even a small amount benefits from compound growth over time.</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <span className="text-lg font-bold text-slate-100">{formatCurrency(state.initialAmount)}</span>
              </div>
              <Slider
                value={[state.initialAmount]}
                onValueChange={([v]) => handleStateChange({ initialAmount: v })}
                min={100}
                max={10000}
                step={100}
                className="cursor-pointer"
              />
              <p className="text-xs text-slate-500 mt-2">Start with what you have. Consistency matters more.</p>
            </div>

            {/* Monthly Contribution */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-400" />
                  <span className="text-sm font-medium text-slate-200">Monthly Contribution</span>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3.5 w-3.5 text-slate-500" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>Regular contributions create "dollar-cost averaging," meaning you buy more shares when prices are low.</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <span className="text-lg font-bold text-slate-100">{formatCurrency(state.monthlyContribution)}/mo</span>
              </div>
              <Slider
                value={[state.monthlyContribution]}
                onValueChange={([v]) => handleStateChange({ monthlyContribution: v })}
                min={0}
                max={1000}
                step={25}
                className="cursor-pointer"
              />
              <p className="text-xs text-slate-500 mt-2">Even small monthly amounts compound significantly.</p>
            </div>

            {/* Time Horizon */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-purple-400" />
                  <span className="text-sm font-medium text-slate-200">Time Horizon</span>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3.5 w-3.5 text-slate-500" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>Time is your greatest ally. Longer horizons smooth out volatility and maximize compound growth.</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <span className="text-lg font-bold text-slate-100">{state.years} years</span>
              </div>
              <Slider
                value={[state.years]}
                onValueChange={([v]) => handleStateChange({ years: v })}
                min={1}
                max={40}
                step={1}
                className="cursor-pointer"
              />
              <p className="text-xs text-slate-500 mt-2">Watch the curve steepen as years increase. That's compounding.</p>
            </div>

            {/* Risk Level */}
            {state.mode === "investing" && (
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Flame className="h-4 w-4 text-orange-400" />
                    <span className="text-sm font-medium text-slate-200">Risk Level</span>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-3.5 w-3.5 text-slate-500" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>Higher risk = higher potential returns, but more volatility. Match this to your timeline.</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Badge className={`${
                    state.riskLevel <= 2 ? "bg-blue-500/20 text-blue-300 border-blue-500/30" :
                    state.riskLevel === 3 ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/30" :
                    "bg-orange-500/20 text-orange-300 border-orange-500/30"
                  }`}>
                    {riskLabels[state.riskLevel - 1]}
                  </Badge>
                </div>
                <Slider
                  value={[state.riskLevel]}
                  onValueChange={([v]) => handleStateChange({ riskLevel: v })}
                  min={1}
                  max={5}
                  step={1}
                  className="cursor-pointer"
                />
                <p className="text-xs text-slate-500 mt-2">Young investors can typically afford more risk.</p>
              </div>
            )}
          </div>

          {/* Comparison Cards */}
          <div className="grid md:grid-cols-3 gap-4 mb-10">
            <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-800/40 border border-slate-700/50">
              <div className="flex items-center gap-2 mb-2">
                <PiggyBank className="h-5 w-5 text-blue-400" />
                <span className="text-sm font-medium text-slate-300">Savings Account</span>
              </div>
              <p className="text-3xl font-bold text-blue-400 mb-2">{formatCurrency(finalValues.saving)}</p>
              <p className="text-sm text-slate-400">
                You'd earn <span className="text-blue-300 font-medium">{formatCurrency(finalValues.savingGain)}</span> in interest, 
                barely keeping pace with inflation.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-900/30 to-emerald-800/10 border border-emerald-500/30">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-emerald-400" />
                <span className="text-sm font-medium text-slate-300">Investment Portfolio</span>
              </div>
              <p className="text-3xl font-bold text-emerald-400 mb-2">{formatCurrency(finalValues.investing)}</p>
              <p className="text-sm text-slate-400">
                Your money grew <span className="text-emerald-300 font-medium">{formatCurrency(finalValues.investingGain)}</span> through market returns.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900/80 to-red-900/10 border border-red-500/20">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="h-5 w-5 text-red-400" />
                <span className="text-sm font-medium text-slate-300">Inflation Impact</span>
              </div>
              <p className="text-3xl font-bold text-red-400 mb-2">{formatCurrency(finalValues.inflation)}</p>
              <p className="text-sm text-slate-400">
                Doing nothing means your {formatCurrency(state.initialAmount)} buys 
                <span className="text-red-300 font-medium"> {Math.round((1 - finalValues.inflation / finalValues.contributions) * 100)}% less</span> in {state.years} years.
              </p>
            </div>
          </div>

          {/* What-If Scenario Buttons */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="h-5 w-5 text-amber-400" />
              <h3 className="text-lg font-semibold text-slate-200">What If Scenarios</h3>
            </div>
            <p className="text-sm text-slate-400 mb-4">Click to instantly see how different choices change your outcome:</p>
            
            <div className="flex flex-wrap gap-3">
              {whatIfScenarios.map((scenario) => (
                <Tooltip key={scenario.id}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      onClick={() => applyWhatIf(scenario)}
                      className={`rounded-xl border-slate-700 hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-all ${
                        activeWhatIf === scenario.id 
                          ? "border-emerald-500 bg-emerald-500/20 text-emerald-300" 
                          : "text-slate-300"
                      }`}
                    >
                      <Play className="h-3.5 w-3.5 mr-2" />
                      {scenario.label}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{scenario.description}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </div>

          {/* Final Insight - Outcome Summary */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-900/20 via-slate-900/60 to-blue-900/20 border border-slate-700/50">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                <Target className="h-6 w-6 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-100 mb-2">Your Outcome</h3>
                <p className="text-slate-300 leading-relaxed mb-4">
                  {state.mode === "investing" ? (
                    <>
                      By investing {formatCurrency(state.monthlyContribution)}/month for {state.years} years at {riskLabels[state.riskLevel - 1].toLowerCase()} risk, 
                      you'd have <span className="text-emerald-400 font-semibold">{formatCurrency(finalValues.investing)}</span>. That's{" "}
                      <span className="text-emerald-400 font-semibold">{formatCurrency(finalValues.difference)} more</span> than just saving it.
                    </>
                  ) : (
                    <>
                      Saving {formatCurrency(state.monthlyContribution)}/month for {state.years} years would give you{" "}
                      <span className="text-blue-400 font-semibold">{formatCurrency(finalValues.saving)}</span>. 
                      But investing could have earned you{" "}
                      <span className="text-emerald-400 font-semibold">{formatCurrency(finalValues.difference)} more</span>.
                    </>
                  )}
                </p>
                
                <div className="flex items-center gap-2 text-sm">
                  {finalValues.beatsInflation ? (
                    <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                      <CheckCircle className="h-3.5 w-3.5 mr-1" />
                      Beating Inflation
                    </Badge>
                  ) : (
                    <Badge className="bg-red-500/20 text-red-300 border-red-500/30">
                      <AlertTriangle className="h-3.5 w-3.5 mr-1" />
                      Losing to Inflation
                    </Badge>
                  )}
                  
                  {finalValues.investing >= 50000 && (
                    <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30">
                      <Trophy className="h-3.5 w-3.5 mr-1" />
                      $50K+ Goal Reached
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

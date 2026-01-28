import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { 
  CloudRain, Sun, Thermometer, TrendingUp, 
  TrendingDown, Zap, Trophy, RefreshCw, AlertTriangle
} from "lucide-react";

type Phase = "hook" | "allocation" | "simulation" | "results";
type Weather = "growth" | "recession" | "inflation" | "stagflation";

const weatherData: Record<Weather, { 
  name: string; 
  icon: typeof Sun; 
  color: string;
  stockReturn: number;
  bondReturn: number;
  description: string;
}> = {
  growth: { 
    name: "Economic Growth", 
    icon: Sun, 
    color: "text-yellow-500",
    stockReturn: 12,
    bondReturn: 3,
    description: "GDP rising, low unemployment, corporate earnings up"
  },
  recession: { 
    name: "Recession", 
    icon: CloudRain, 
    color: "text-blue-500",
    stockReturn: -15,
    bondReturn: 8,
    description: "GDP falling, high unemployment, flight to safety"
  },
  inflation: { 
    name: "High Inflation", 
    icon: Thermometer, 
    color: "text-red-500",
    stockReturn: 5,
    bondReturn: -5,
    description: "Prices rising, Fed hiking rates, bonds suffer"
  },
  stagflation: { 
    name: "Stagflation", 
    icon: AlertTriangle, 
    color: "text-orange-500",
    stockReturn: -5,
    bondReturn: -3,
    description: "Worst of both: high inflation + low growth"
  }
};

export const StocksBondsImmersive = () => {
  const [phase, setPhase] = useState<Phase>("hook");
  const [stockAllocation, setStockAllocation] = useState(60);
  const [currentYear, setCurrentYear] = useState(0);
  const [portfolioValue, setPortfolioValue] = useState(100000);
  const [portfolioHistory, setPortfolioHistory] = useState<number[]>([100000]);
  const [currentWeather, setCurrentWeather] = useState<Weather>("growth");
  const [weatherSequence, setWeatherSequence] = useState<Weather[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [rebalanceCount, setRebalanceCount] = useState(0);
  const [showRebalance, setShowRebalance] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  const [volatilityScore, setVolatilityScore] = useState(0);

  const generateWeatherSequence = () => {
    const weathers: Weather[] = [];
    const options: Weather[] = ["growth", "recession", "inflation", "stagflation"];
    for (let i = 0; i < 10; i++) {
      // Weighted random - growth more common
      const weights = [0.4, 0.25, 0.25, 0.1];
      const random = Math.random();
      let cumulative = 0;
      for (let j = 0; j < options.length; j++) {
        cumulative += weights[j];
        if (random < cumulative) {
          weathers.push(options[j]);
          break;
        }
      }
    }
    return weathers;
  };

  const startSimulation = () => {
    const sequence = generateWeatherSequence();
    setWeatherSequence(sequence);
    setCurrentWeather(sequence[0]);
    setPhase("simulation");
    setIsSimulating(true);
  };

  useEffect(() => {
    if (!isSimulating || currentYear >= 10) {
      if (currentYear >= 10) {
        calculateResults();
      }
      return;
    }

    // Show rebalance option every 2 years
    if (currentYear > 0 && currentYear % 2 === 0 && !showRebalance) {
      setShowRebalance(true);
      setIsSimulating(false);
      return;
    }

    const timer = setTimeout(() => {
      const weather = weatherSequence[currentYear];
      setCurrentWeather(weather);
      
      const { stockReturn, bondReturn } = weatherData[weather];
      const bondAllocation = 100 - stockAllocation;
      
      const portfolioReturn = (stockAllocation / 100) * stockReturn + (bondAllocation / 100) * bondReturn;
      const newValue = portfolioValue * (1 + portfolioReturn / 100);
      
      // Track volatility
      const change = Math.abs(portfolioReturn);
      setVolatilityScore(prev => prev + change);
      
      setPortfolioValue(newValue);
      setPortfolioHistory(prev => [...prev, newValue]);
      setCurrentYear(prev => prev + 1);
    }, 800);

    return () => clearTimeout(timer);
  }, [isSimulating, currentYear, weatherSequence, stockAllocation, portfolioValue, showRebalance]);

  const handleRebalance = (newAllocation?: number) => {
    if (newAllocation !== undefined) {
      setStockAllocation(newAllocation);
      setRebalanceCount(prev => prev + 1);
    }
    setShowRebalance(false);
    setIsSimulating(true);
  };

  const calculateResults = () => {
    setIsSimulating(false);
    
    let xp = 100; // Base XP
    
    // Bonus for lower volatility
    const avgVolatility = volatilityScore / 10;
    if (avgVolatility < 8) {
      xp += 150;
    } else if (avgVolatility < 12) {
      xp += 100;
    } else {
      xp += 50;
    }
    
    // Bonus for positive return
    if (portfolioValue > 100000) {
      xp += Math.min(200, Math.floor((portfolioValue - 100000) / 1000));
    }
    
    // Penalty for too correlated allocation (100% stocks or 100% bonds)
    if (stockAllocation === 100 || stockAllocation === 0) {
      xp -= 50;
    }
    
    // Bonus for smart rebalancing
    if (rebalanceCount >= 2 && rebalanceCount <= 4) {
      xp += 50;
    }

    setXpEarned(Math.max(0, xp));
    setPhase("results");
  };

  const renderHook = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center p-6 bg-gradient-to-br from-blue-500/20 to-yellow-500/20 rounded-2xl border border-primary/30">
        <div className="flex justify-center gap-4 mb-4">
          <TrendingUp className="h-12 w-12 text-green-500" />
          <TrendingDown className="h-12 w-12 text-blue-500" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">THE ECONOMIC WEATHER VANE</h2>
        <p className="text-muted-foreground">
          Markets change like weather. Can you adjust your portfolio to thrive in any condition?
        </p>
      </div>

      <Card className="border-primary/30">
        <CardHeader>
          <CardTitle>Set Your Starting Allocation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <span>Stocks</span>
              </div>
              <Badge variant="secondary" className="text-lg">{stockAllocation}%</Badge>
            </div>
            
            <Slider
              value={[stockAllocation]}
              onValueChange={(v) => setStockAllocation(v[0])}
              min={0}
              max={100}
              step={10}
              className="w-full"
            />
            
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-blue-500" />
                <span>Bonds</span>
              </div>
              <Badge variant="secondary" className="text-lg">{100 - stockAllocation}%</Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Expected Return</p>
              <p className="text-xl font-bold text-green-500">
                ~{((stockAllocation / 100) * 10 + ((100 - stockAllocation) / 100) * 4).toFixed(1)}%
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Risk Level</p>
              <p className="text-xl font-bold text-orange-500">
                {stockAllocation > 70 ? "High" : stockAllocation > 40 ? "Medium" : "Low"}
              </p>
            </div>
          </div>

          <Button onClick={startSimulation} className="w-full">
            <Zap className="h-4 w-4 mr-2" />
            Start 10-Year Simulation
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderSimulation = () => {
    const WeatherIcon = weatherData[currentWeather].icon;
    
    return (
      <div className="space-y-6 animate-fade-in">
        <Card className={`border-2 ${
          currentWeather === "growth" ? "border-yellow-500/50 bg-yellow-500/5" :
          currentWeather === "recession" ? "border-blue-500/50 bg-blue-500/5" :
          currentWeather === "inflation" ? "border-red-500/50 bg-red-500/5" :
          "border-orange-500/50 bg-orange-500/5"
        }`}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <WeatherIcon className={`h-6 w-6 ${weatherData[currentWeather].color}`} />
                {weatherData[currentWeather].name}
              </span>
              <Badge>Year {currentYear + 1}/10</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              {weatherData[currentWeather].description}
            </p>
            <Progress value={(currentYear / 10) * 100} className="h-2" />
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          <Card className="border-green-500/30">
            <CardContent className="pt-4 text-center">
              <p className="text-sm text-muted-foreground">Portfolio Value</p>
              <p className={`text-2xl font-bold ${portfolioValue >= 100000 ? 'text-green-500' : 'text-red-500'}`}>
                ${portfolioValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
            </CardContent>
          </Card>
          <Card className="border-purple-500/30">
            <CardContent className="pt-4 text-center">
              <p className="text-sm text-muted-foreground">Allocation</p>
              <p className="text-2xl font-bold">
                <span className="text-green-500">{stockAllocation}%</span>
                {" / "}
                <span className="text-blue-500">{100 - stockAllocation}%</span>
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="h-32 bg-muted/30 rounded-lg p-4 flex items-end gap-1">
          {portfolioHistory.map((value, i) => (
            <div
              key={i}
              className="flex-1 rounded-t transition-all"
              style={{ 
                height: `${Math.min(100, Math.max(20, (value / 150000) * 100))}%`,
                backgroundColor: value >= 100000 ? 'hsl(var(--primary))' : 'hsl(0 84% 60%)'
              }}
            />
          ))}
        </div>
      </div>
    );
  };

  const renderRebalance = () => {
    const WeatherIcon = weatherData[currentWeather].icon;
    
    return (
      <div className="space-y-6 animate-fade-in">
        <Card className="border-primary/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-primary" />
              Rebalancing Opportunity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg flex items-center gap-4">
              <WeatherIcon className={`h-10 w-10 ${weatherData[currentWeather].color}`} />
              <div>
                <p className="font-semibold">{weatherData[currentWeather].name}</p>
                <p className="text-sm text-muted-foreground">
                  {weatherData[currentWeather].description}
                </p>
              </div>
            </div>

            <p className="text-center text-muted-foreground">
              Current: <span className="text-green-500 font-bold">{stockAllocation}% Stocks</span>
              {" / "}
              <span className="text-blue-500 font-bold">{100 - stockAllocation}% Bonds</span>
            </p>

            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                className="flex flex-col h-auto py-4"
                onClick={() => handleRebalance(Math.min(100, stockAllocation + 20))}
              >
                <TrendingUp className="h-5 w-5 text-green-500 mb-1" />
                <span className="text-xs">More Stocks</span>
                <span className="text-xs text-muted-foreground">+20%</span>
              </Button>
              <Button
                variant="outline"
                className="flex flex-col h-auto py-4"
                onClick={() => handleRebalance()}
              >
                <span className="text-lg mb-1">⚖️</span>
                <span className="text-xs">Keep Same</span>
              </Button>
              <Button
                variant="outline"
                className="flex flex-col h-auto py-4"
                onClick={() => handleRebalance(Math.max(0, stockAllocation - 20))}
              >
                <TrendingDown className="h-5 w-5 text-blue-500 mb-1" />
                <span className="text-xs">More Bonds</span>
                <span className="text-xs text-muted-foreground">+20%</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderResults = () => {
    const totalReturn = ((portfolioValue - 100000) / 100000) * 100;
    const avgVolatility = volatilityScore / 10;

    return (
      <div className="space-y-6 animate-fade-in">
        <div className="text-center p-6 bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-2xl">
          <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-2">10 YEARS COMPLETE</h2>
          <div className="text-5xl font-bold text-primary">+{xpEarned} XP</div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Card className="border-green-500/30">
            <CardContent className="pt-4 text-center">
              <p className="text-sm text-muted-foreground">Final Value</p>
              <p className={`text-2xl font-bold ${portfolioValue >= 100000 ? 'text-green-500' : 'text-red-500'}`}>
                ${portfolioValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
              <p className="text-sm text-muted-foreground">
                {totalReturn >= 0 ? '+' : ''}{totalReturn.toFixed(1)}%
              </p>
            </CardContent>
          </Card>
          <Card className="border-purple-500/30">
            <CardContent className="pt-4 text-center">
              <p className="text-sm text-muted-foreground">Avg Volatility</p>
              <p className={`text-2xl font-bold ${avgVolatility < 8 ? 'text-green-500' : avgVolatility < 12 ? 'text-yellow-500' : 'text-red-500'}`}>
                {avgVolatility.toFixed(1)}%
              </p>
              <p className="text-sm text-muted-foreground">
                {avgVolatility < 8 ? 'Low' : avgVolatility < 12 ? 'Medium' : 'High'}
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
                <span>Volatility Control</span>
                <span className="text-green-500">+{avgVolatility < 8 ? 150 : avgVolatility < 12 ? 100 : 50} XP</span>
              </div>
              {portfolioValue > 100000 && (
                <div className="flex justify-between">
                  <span>Portfolio Growth</span>
                  <span className="text-green-500">+{Math.min(200, Math.floor((portfolioValue - 100000) / 1000))} XP</span>
                </div>
              )}
              {(stockAllocation === 100 || stockAllocation === 0) && (
                <div className="flex justify-between">
                  <span>High Correlation Penalty</span>
                  <span className="text-red-500">-50 XP</span>
                </div>
              )}
              {rebalanceCount >= 2 && rebalanceCount <= 4 && (
                <div className="flex justify-between">
                  <span>Smart Rebalancing</span>
                  <span className="text-green-500">+50 XP</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="p-4 bg-primary/10 rounded-lg">
          <p className="text-sm">
            <strong>💡 Key Insight:</strong> Stocks and bonds often move in opposite directions during economic shifts. 
            A balanced allocation reduces volatility without sacrificing all returns. 
            Smart rebalancing during economic shifts can boost risk-adjusted returns.
          </p>
        </div>

        <Button onClick={() => {
          setPhase("hook");
          setCurrentYear(0);
          setPortfolioValue(100000);
          setPortfolioHistory([100000]);
          setStockAllocation(60);
          setRebalanceCount(0);
          setVolatilityScore(0);
          setShowRebalance(false);
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
      {phase === "allocation" && renderHook()}
      {phase === "simulation" && !showRebalance && renderSimulation()}
      {showRebalance && renderRebalance()}
      {phase === "results" && renderResults()}
    </div>
  );
};

import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { 
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  Target,
  Play,
  RotateCcw,
  Grip
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, ReferenceLine, Area, ComposedChart } from "recharts";

interface OptionContract {
  type: "call" | "put";
  strikePrice: number;
  premium: number;
  daysToExpiration: number;
}

export const OptionsPayoffSandbox = () => {
  const [optionType, setOptionType] = useState<"call" | "put">("call");
  const [strikePrice, setStrikePrice] = useState(100);
  const [premium, setPremium] = useState(5);
  const [currentPrice, setCurrentPrice] = useState(100);
  const [expirationPrice, setExpirationPrice] = useState(105);
  const [daysToExpiration, setDaysToExpiration] = useState(30);
  const [isAnimating, setIsAnimating] = useState(false);
  const [priceHistory, setPriceHistory] = useState<{ day: number; price: number }[]>([]);
  
  // Generate payoff diagram data
  const generatePayoffData = () => {
    const data = [];
    for (let price = 50; price <= 150; price += 2) {
      let profit;
      if (optionType === "call") {
        profit = price > strikePrice 
          ? (price - strikePrice - premium) * 100
          : -premium * 100;
      } else {
        profit = price < strikePrice
          ? (strikePrice - price - premium) * 100
          : -premium * 100;
      }
      data.push({ price, profit });
    }
    return data;
  };

  const payoffData = generatePayoffData();

  // Calculate current option value (simplified Black-Scholes approximation)
  const calculateOptionValue = (spotPrice: number, daysLeft: number) => {
    const intrinsicValue = optionType === "call"
      ? Math.max(0, spotPrice - strikePrice)
      : Math.max(0, strikePrice - spotPrice);
    
    // Simplified time value decay
    const timeValueRatio = Math.sqrt(daysLeft / 365);
    const volatilityFactor = 0.3; // Assumed volatility
    const timeValue = strikePrice * volatilityFactor * timeValueRatio * 0.4;
    
    return intrinsicValue + timeValue;
  };

  const currentValue = calculateOptionValue(currentPrice, daysToExpiration);
  const breakeven = optionType === "call" ? strikePrice + premium : strikePrice - premium;

  // Calculate final P/L at expiration
  const calculateFinalPL = () => {
    if (optionType === "call") {
      return expirationPrice > strikePrice 
        ? (expirationPrice - strikePrice - premium) * 100
        : -premium * 100;
    } else {
      return expirationPrice < strikePrice
        ? (strikePrice - expirationPrice - premium) * 100
        : -premium * 100;
    }
  };

  const finalPL = calculateFinalPL();

  // Animate price path to expiration
  const animatePricePath = () => {
    setIsAnimating(true);
    setPriceHistory([]);
    
    const startPrice = currentPrice;
    const endPrice = expirationPrice;
    const steps = 30;
    
    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep >= steps) {
        clearInterval(interval);
        setIsAnimating(false);
        
        if (finalPL > 0) {
          toast.success(`Option expired in-the-money! Profit: $${finalPL.toFixed(0)}`);
        } else {
          toast.error(`Option expired worthless. Loss: $${Math.abs(finalPL).toFixed(0)}`);
        }
        return;
      }
      
      const progress = currentStep / steps;
      // Add some randomness to make it realistic
      const randomWalk = (Math.random() - 0.5) * 10;
      const trendPrice = startPrice + (endPrice - startPrice) * progress;
      const price = Math.max(50, Math.min(150, trendPrice + randomWalk * (1 - progress)));
      
      setPriceHistory(prev => [...prev, { day: currentStep + 1, price }]);
      currentStep++;
    }, 100);
  };

  const getMoneyStatus = () => {
    if (optionType === "call") {
      if (currentPrice > strikePrice) return { status: "ITM", color: "text-success" };
      if (currentPrice < strikePrice) return { status: "OTM", color: "text-destructive" };
      return { status: "ATM", color: "text-warning" };
    } else {
      if (currentPrice < strikePrice) return { status: "ITM", color: "text-success" };
      if (currentPrice > strikePrice) return { status: "OTM", color: "text-destructive" };
      return { status: "ATM", color: "text-warning" };
    }
  };

  const moneyStatus = getMoneyStatus();

  return (
    <Card className="p-6 space-y-6 bg-gradient-to-br from-background to-primary/5">
      <div>
        <h3 className="text-xl font-bold mb-1 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-primary" />
          Options Payoff Sandbox
        </h3>
        <p className="text-sm text-muted-foreground">
          Drag price paths and expiration dates to visualize option payoffs
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Controls */}
        <Card className="p-4 bg-muted/30 space-y-4">
          {/* Option Type Toggle */}
          <div className="flex gap-2">
            <Button
              variant={optionType === "call" ? "default" : "outline"}
              onClick={() => setOptionType("call")}
              className="flex-1"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Call Option
            </Button>
            <Button
              variant={optionType === "put" ? "default" : "outline"}
              onClick={() => setOptionType("put")}
              className="flex-1"
            >
              <TrendingDown className="w-4 h-4 mr-2" />
              Put Option
            </Button>
          </div>

          {/* Strike Price */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Strike Price</span>
              <span className="font-bold">${strikePrice}</span>
            </div>
            <Slider
              value={[strikePrice]}
              onValueChange={([v]) => setStrikePrice(v)}
              min={70}
              max={130}
              step={5}
            />
          </div>

          {/* Premium */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Premium Paid</span>
              <span className="font-bold">${premium}/share</span>
            </div>
            <Slider
              value={[premium]}
              onValueChange={([v]) => setPremium(v)}
              min={1}
              max={20}
              step={0.5}
            />
          </div>

          {/* Current Price */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="flex items-center gap-1">
                <Grip className="w-3 h-3" />
                Current Stock Price
              </span>
              <span className="font-bold">${currentPrice}</span>
            </div>
            <Slider
              value={[currentPrice]}
              onValueChange={([v]) => setCurrentPrice(v)}
              min={50}
              max={150}
              step={1}
            />
          </div>

          {/* Expiration Price (Target) */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="flex items-center gap-1">
                <Target className="w-3 h-3" />
                Price at Expiration
              </span>
              <span className="font-bold">${expirationPrice}</span>
            </div>
            <Slider
              value={[expirationPrice]}
              onValueChange={([v]) => setExpirationPrice(v)}
              min={50}
              max={150}
              step={1}
            />
          </div>

          {/* Days to Expiration */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Days to Expiration
              </span>
              <span className="font-bold">{daysToExpiration} days</span>
            </div>
            <Slider
              value={[daysToExpiration]}
              onValueChange={([v]) => setDaysToExpiration(v)}
              min={1}
              max={90}
              step={1}
            />
          </div>

          <Button 
            onClick={animatePricePath} 
            disabled={isAnimating}
            className="w-full"
          >
            {isAnimating ? (
              <>Simulating...</>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Simulate to Expiration
              </>
            )}
          </Button>
        </Card>

        {/* Visualization */}
        <div className="space-y-4">
          {/* Key Metrics */}
          <div className="grid grid-cols-3 gap-2">
            <Card className="p-3 bg-muted/30 text-center">
              <div className="text-xs text-muted-foreground">Status</div>
              <Badge className={moneyStatus.color}>{moneyStatus.status}</Badge>
            </Card>
            <Card className="p-3 bg-muted/30 text-center">
              <div className="text-xs text-muted-foreground">Breakeven</div>
              <div className="font-bold">${breakeven.toFixed(2)}</div>
            </Card>
            <Card className="p-3 bg-muted/30 text-center">
              <div className="text-xs text-muted-foreground">Max Loss</div>
              <div className="font-bold text-destructive">-${(premium * 100).toFixed(0)}</div>
            </Card>
          </div>

          {/* Payoff Diagram */}
          <Card className="p-4 bg-muted/30">
            <h4 className="text-sm font-semibold mb-2">Payoff at Expiration</h4>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={payoffData}>
                  <XAxis 
                    dataKey="price" 
                    tick={{ fontSize: 10 }}
                    tickFormatter={(v) => `$${v}`}
                  />
                  <YAxis 
                    tick={{ fontSize: 10 }}
                    tickFormatter={(v) => `$${v}`}
                  />
                  <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" />
                  <ReferenceLine 
                    x={strikePrice} 
                    stroke="hsl(var(--warning))" 
                    strokeDasharray="3 3"
                    label={{ value: 'Strike', position: 'top', fontSize: 10 }}
                  />
                  <ReferenceLine 
                    x={breakeven} 
                    stroke="hsl(var(--primary))" 
                    strokeDasharray="3 3"
                    label={{ value: 'BE', position: 'top', fontSize: 10 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="profit"
                    fill="hsl(var(--primary) / 0.2)"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                  />
                  {/* Current price marker */}
                  <ReferenceLine 
                    x={expirationPrice} 
                    stroke={finalPL >= 0 ? 'hsl(var(--success))' : 'hsl(var(--destructive))'} 
                    strokeWidth={2}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Price Path Animation */}
          {priceHistory.length > 0 && (
            <Card className="p-4 bg-muted/30">
              <h4 className="text-sm font-semibold mb-2">Price Path to Expiration</h4>
              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={priceHistory}>
                    <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                    <YAxis domain={[50, 150]} tick={{ fontSize: 10 }} />
                    <ReferenceLine y={strikePrice} stroke="hsl(var(--warning))" strokeDasharray="3 3" />
                    <Line
                      type="monotone"
                      dataKey="price"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={false}
                      animationDuration={0}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          )}

          {/* Result Card */}
          {priceHistory.length > 0 && !isAnimating && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className={`p-4 ${finalPL >= 0 ? 'bg-success/10' : 'bg-destructive/10'}`}>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-semibold">
                      {finalPL >= 0 ? 'Profit' : 'Loss'} at Expiration
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Stock: ${expirationPrice} | Strike: ${strikePrice}
                    </p>
                  </div>
                  <span className={`text-2xl font-bold ${finalPL >= 0 ? 'text-success' : 'text-destructive'}`}>
                    {finalPL >= 0 ? '+' : ''}{finalPL.toFixed(0)} USD
                  </span>
                </div>
              </Card>
            </motion.div>
          )}
        </div>
      </div>

      {/* Educational Note */}
      <Card className="p-3 bg-primary/5">
        <p className="text-xs text-muted-foreground">
          <strong>💡 Key Concepts:</strong> Options have limited downside (premium paid) but can offer significant upside. 
          {optionType === "call" 
            ? " Call buyers profit when the stock rises above the breakeven price (strike + premium)."
            : " Put buyers profit when the stock falls below the breakeven price (strike - premium)."
          }
          Time decay (theta) erodes option value as expiration approaches.
        </p>
      </Card>
    </Card>
  );
};

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, DollarSign, AlertTriangle } from "lucide-react";
import { AIContextualHelp } from "@/components/learn/AIContextualHelp";

export const OptionsSimulator = () => {
  const [stockPrice, setStockPrice] = useState(100);
  const [strikePrice, setStrikePrice] = useState(105);
  const [premium, setPremium] = useState(3);
  const [optionType, setOptionType] = useState<'call' | 'put'>('call');
  const [expirationPrice, setExpirationPrice] = useState(110);
  const [showResult, setShowResult] = useState(false);

  const calculateProfit = () => {
    if (optionType === 'call') {
      // Call option: profit if stock > strike + premium
      if (expirationPrice > strikePrice) {
        return (expirationPrice - strikePrice - premium) * 100;
      }
      return -premium * 100; // Max loss is premium paid
    } else {
      // Put option: profit if stock < strike - premium
      if (expirationPrice < strikePrice) {
        return (strikePrice - expirationPrice - premium) * 100;
      }
      return -premium * 100;
    }
  };

  const profit = calculateProfit();
  const breakeven = optionType === 'call' 
    ? strikePrice + premium 
    : strikePrice - premium;

  return (
    <Card className="p-6 bg-card/50 border-primary/20">
      <div className="flex items-center gap-2 mb-4">
        <DollarSign className="w-5 h-5 text-primary" />
        <h3 className="font-bold text-lg">Options Profit/Loss Simulator</h3>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex gap-2">
            <Button
              variant={optionType === 'call' ? 'default' : 'outline'}
              onClick={() => { setOptionType('call'); setShowResult(false); }}
              className="flex-1"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Call Option
            </Button>
            <Button
              variant={optionType === 'put' ? 'default' : 'outline'}
              onClick={() => { setOptionType('put'); setShowResult(false); }}
              className="flex-1"
            >
              <TrendingDown className="w-4 h-4 mr-2" />
              Put Option
            </Button>
          </div>

          <div>
            <label className="text-sm font-medium">Current Stock Price: ${stockPrice}</label>
            <Slider
              value={[stockPrice]}
              onValueChange={([v]) => { setStockPrice(v); setShowResult(false); }}
              min={50}
              max={150}
              step={1}
              className="mt-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Strike Price: ${strikePrice}</label>
            <Slider
              value={[strikePrice]}
              onValueChange={([v]) => { setStrikePrice(v); setShowResult(false); }}
              min={50}
              max={150}
              step={1}
              className="mt-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Premium Paid: ${premium} per share</label>
            <Slider
              value={[premium]}
              onValueChange={([v]) => { setPremium(v); setShowResult(false); }}
              min={1}
              max={15}
              step={0.5}
              className="mt-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Stock Price at Expiration: ${expirationPrice}</label>
            <Slider
              value={[expirationPrice]}
              onValueChange={([v]) => { setExpirationPrice(v); setShowResult(false); }}
              min={50}
              max={150}
              step={1}
              className="mt-2"
            />
          </div>

          <Button onClick={() => setShowResult(true)} className="w-full bg-gradient-primary">
            Calculate Profit/Loss
          </Button>
        </div>

        <div className="space-y-4">
          <Card className="p-4 bg-muted/30">
            <h4 className="font-semibold mb-3">Option Details</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Option Type:</span>
                <Badge variant={optionType === 'call' ? 'default' : 'secondary'}>
                  {optionType.toUpperCase()}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Contract Size:</span>
                <span>100 shares</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Premium:</span>
                <span>${(premium * 100).toFixed(0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Breakeven Price:</span>
                <span className="font-semibold">${breakeven.toFixed(2)}</span>
              </div>
            </div>
          </Card>

          {showResult && (
            <Card className={`p-4 animate-fade-in ${profit >= 0 ? 'bg-success/10 border-success/30' : 'bg-destructive/10 border-destructive/30'}`}>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                {profit >= 0 ? (
                  <TrendingUp className="w-5 h-5 text-success" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                )}
                Result at Expiration
              </h4>
              <p className={`text-2xl font-bold ${profit >= 0 ? 'text-success' : 'text-destructive'}`}>
                {profit >= 0 ? '+' : ''}{profit.toFixed(0)} USD
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                {optionType === 'call' 
                  ? profit >= 0 
                    ? `Stock rose above breakeven (${breakeven}). You exercised and profited!`
                    : `Stock stayed below strike. Option expired worthless. You lost the premium.`
                  : profit >= 0
                    ? `Stock fell below breakeven (${breakeven}). You exercised and profited!`
                    : `Stock stayed above strike. Option expired worthless. You lost the premium.`
                }
              </p>
            </Card>
          )}

          <div className="text-xs text-muted-foreground p-3 bg-muted/20 rounded-lg">
            <strong>Key Insight:</strong> <AIContextualHelp term="Options" lessonId="15" lessonTitle="Options Basics">Options</AIContextualHelp> have limited downside (<AIContextualHelp term="premium" lessonId="15" lessonTitle="Options Basics">premium</AIContextualHelp> paid) but can offer significant upside. 
            {optionType === 'call' 
              ? <> <AIContextualHelp term="Call option" lessonId="15" lessonTitle="Options Basics">Call</AIContextualHelp> buyers profit when stocks rise above the <AIContextualHelp term="breakeven price" lessonId="15" lessonTitle="Options Basics">breakeven price</AIContextualHelp>.</>
              : <> <AIContextualHelp term="Put option" lessonId="15" lessonTitle="Options Basics">Put</AIContextualHelp> buyers profit when stocks fall below the <AIContextualHelp term="breakeven price" lessonId="15" lessonTitle="Options Basics">breakeven price</AIContextualHelp>.</>
            }
          </div>
        </div>
      </div>
    </Card>
  );
};
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, TrendingUp, TrendingDown, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface Company {
  name: string;
  revenue: number;
  netIncome: number;
  totalAssets: number;
  totalLiabilities: number;
  equity: number;
  freeCashFlow: number;
  description: string;
}

const companies: Company[] = [
  {
    name: "HealthTech Solutions",
    revenue: 500,
    netIncome: 75,
    totalAssets: 800,
    totalLiabilities: 200,
    equity: 600,
    freeCashFlow: 90,
    description: "A profitable healthcare technology company with strong fundamentals"
  },
  {
    name: "Retail Struggles Inc",
    revenue: 800,
    netIncome: -50,
    totalAssets: 600,
    totalLiabilities: 550,
    equity: 50,
    freeCashFlow: -30,
    description: "A struggling retailer with declining margins and high debt"
  },
  {
    name: "Growth Startup",
    revenue: 100,
    netIncome: -20,
    totalAssets: 300,
    totalLiabilities: 100,
    equity: 200,
    freeCashFlow: -15,
    description: "A fast-growing startup investing heavily in expansion"
  }
];

export const FinancialStatementAnalyzer = () => {
  const [currentCompany, setCurrentCompany] = useState(0);
  const [userRating, setUserRating] = useState<"strong" | "moderate" | "weak" | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);

  const company = companies[currentCompany];
  
  // Calculate key ratios
  const profitMargin = ((company.netIncome / company.revenue) * 100).toFixed(1);
  const roe = ((company.netIncome / company.equity) * 100).toFixed(1);
  const debtToEquity = (company.totalLiabilities / company.equity).toFixed(2);
  const currentRatio = (company.totalAssets / company.totalLiabilities).toFixed(2);
  
  // Determine actual rating
  const isProfitable = company.netIncome > 0;
  const hasHealthyDebt = parseFloat(debtToEquity) < 2.0;
  const hasPositiveCashFlow = company.freeCashFlow > 0;
  const hasGoodMargin = parseFloat(profitMargin) > 10;
  
  const actualRating: "strong" | "moderate" | "weak" = 
    (isProfitable && hasHealthyDebt && hasPositiveCashFlow && hasGoodMargin) ? "strong" :
    (isProfitable || hasPositiveCashFlow) ? "moderate" : "weak";

  const rateCompany = (rating: "strong" | "moderate" | "weak") => {
    setUserRating(rating);
    setShowAnalysis(true);
    
    if (rating === actualRating) {
      toast.success("Correct! Your analysis matches the fundamentals.");
    } else {
      toast.error("Not quite. Review the key ratios carefully.");
    }
  };

  const nextCompany = () => {
    setCurrentCompany((prev) => (prev + 1) % companies.length);
    setUserRating(null);
    setShowAnalysis(false);
  };

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case "strong": return "bg-success text-success-foreground";
      case "moderate": return "bg-warning text-warning-foreground";
      case "weak": return "bg-destructive text-destructive-foreground";
      default: return "bg-muted";
    }
  };

  return (
    <Card className="p-6 space-y-6 bg-gradient-to-br from-background to-muted/20">
      <div>
        <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          Financial Statement Analyzer
        </h3>
        <p className="text-sm text-muted-foreground">
          Analyze key financial ratios to assess company health
        </p>
      </div>

      <Card className="p-4 bg-muted/30">
        <h4 className="font-bold text-lg mb-2">{company.name}</h4>
        <p className="text-sm text-muted-foreground mb-4">{company.description}</p>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-xs text-muted-foreground">Revenue</div>
            <div className="text-xl font-bold">${company.revenue}M</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Net Income</div>
            <div className={`text-xl font-bold ${company.netIncome >= 0 ? 'text-success' : 'text-destructive'}`}>
              ${company.netIncome}M
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Total Assets</div>
            <div className="text-lg font-bold">${company.totalAssets}M</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Total Liabilities</div>
            <div className="text-lg font-bold">${company.totalLiabilities}M</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Equity</div>
            <div className="text-lg font-bold">${company.equity}M</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Free Cash Flow</div>
            <div className={`text-lg font-bold ${company.freeCashFlow >= 0 ? 'text-success' : 'text-destructive'}`}>
              ${company.freeCashFlow}M
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-primary/5 border-primary/20">
        <h4 className="font-semibold mb-3 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          Key Financial Ratios
        </h4>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <div className="text-xs text-muted-foreground">Profit Margin</div>
            <div className="font-bold">{profitMargin}%</div>
            <div className="text-xs text-muted-foreground">Target: &gt;10%</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Return on Equity (ROE)</div>
            <div className="font-bold">{roe}%</div>
            <div className="text-xs text-muted-foreground">Target: &gt;15%</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Debt-to-Equity</div>
            <div className="font-bold">{debtToEquity}</div>
            <div className="text-xs text-muted-foreground">Target: &lt;2.0</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Current Ratio</div>
            <div className="font-bold">{currentRatio}</div>
            <div className="text-xs text-muted-foreground">Target: &gt;1.0</div>
          </div>
        </div>
      </Card>

      {!userRating && (
        <div className="space-y-3">
          <p className="text-sm font-medium">Rate this company's financial health:</p>
          <div className="grid grid-cols-3 gap-3">
            <Button
              onClick={() => rateCompany("strong")}
              variant="outline"
              size="lg"
              className="flex-col h-24 hover:bg-success/10 hover:border-success"
            >
              <TrendingUp className="w-5 h-5 mb-1 text-success" />
              <span className="font-semibold">Strong Buy</span>
              <span className="text-xs text-muted-foreground">Excellent fundamentals</span>
            </Button>
            <Button
              onClick={() => rateCompany("moderate")}
              variant="outline"
              size="lg"
              className="flex-col h-24 hover:bg-warning/10 hover:border-warning"
            >
              <AlertCircle className="w-5 h-5 mb-1 text-warning" />
              <span className="font-semibold">Hold</span>
              <span className="text-xs text-muted-foreground">Mixed signals</span>
            </Button>
            <Button
              onClick={() => rateCompany("weak")}
              variant="outline"
              size="lg"
              className="flex-col h-24 hover:bg-destructive/10 hover:border-destructive"
            >
              <TrendingDown className="w-5 h-5 mb-1 text-destructive" />
              <span className="font-semibold">Avoid</span>
              <span className="text-xs text-muted-foreground">Poor fundamentals</span>
            </Button>
          </div>
        </div>
      )}

      {showAnalysis && (
        <Card className="p-4 bg-muted/50 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">Analysis Results</h4>
            <div className="flex gap-2">
              <Badge className={getRatingColor(userRating!)}>
                Your: {userRating}
              </Badge>
              <Badge className={getRatingColor(actualRating)}>
                Actual: {actualRating}
              </Badge>
            </div>
          </div>
          
          <div className="space-y-2 text-sm">
            <p>
              <strong>Profitability:</strong> {isProfitable ? "✓ Profitable" : "✗ Losses"} 
              ({profitMargin}% margin)
            </p>
            <p>
              <strong>Leverage:</strong> {hasHealthyDebt ? "✓ Low debt" : "✗ High debt"} 
              ({debtToEquity} D/E ratio)
            </p>
            <p>
              <strong>Cash Flow:</strong> {hasPositiveCashFlow ? "✓ Positive" : "✗ Negative"} 
              (${company.freeCashFlow}M FCF)
            </p>
            <p>
              <strong>ROE:</strong> {parseFloat(roe) > 15 ? "✓ Strong" : "⚠ Weak"} 
              ({roe}%)
            </p>
          </div>

          <div className="pt-3 border-t">
            <p className="text-sm font-semibold mb-1">Investment Thesis:</p>
            <p className="text-sm text-muted-foreground">
              {actualRating === "strong" && "Strong financials with profitability, manageable debt, and positive cash flow. Quality company worth owning."}
              {actualRating === "moderate" && "Some positives but also concerns. Requires deeper analysis before investing."}
              {actualRating === "weak" && "Poor fundamentals with losses, high debt, or negative cash flow. High risk investment."}
            </p>
          </div>

          <Button onClick={nextCompany} className="w-full mt-2">
            Next Company
          </Button>
        </Card>
      )}
    </Card>
  );
};

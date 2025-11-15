import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Receipt, DollarSign, TrendingUp, Info } from "lucide-react";
import { toast } from "sonner";

export const TaxOptimizer = () => {
  const [income, setIncome] = useState(75000);
  const [capitalGains, setCapitalGains] = useState(10000);
  const [holdingPeriod, setHoldingPeriod] = useState<"short" | "long">("short");
  const [accountType, setAccountType] = useState<"taxable" | "ira" | "roth">("taxable");
  const [showResults, setShowResults] = useState(false);

  const calculate = () => {
    setShowResults(true);
    toast.success("Tax calculation complete!");
  };

  // Simplified tax brackets (2024)
  const getIncomeTaxRate = (income: number) => {
    if (income <= 44725) return 0.12;
    if (income <= 95375) return 0.22;
    if (income <= 182100) return 0.24;
    return 0.32;
  };

  const getCapitalGainsTaxRate = (income: number, holdingPeriod: string) => {
    if (holdingPeriod === "long") {
      if (income <= 44625) return 0;
      if (income <= 492300) return 0.15;
      return 0.20;
    } else {
      return getIncomeTaxRate(income); // Short-term = ordinary income
    }
  };

  const incomeTaxRate = getIncomeTaxRate(income);
  const capitalGainsTaxRate = getCapitalGainsTaxRate(income, holdingPeriod);
  
  const taxableGainsTax = capitalGains * capitalGainsTaxRate;
  const iraGainsTax = 0; // Tax-deferred
  const rothGainsTax = 0; // Tax-free

  const taxableAfterTax = capitalGains - taxableGainsTax;
  const iraAfterTax = capitalGains; // Full amount (but taxed later at withdrawal)
  const rothAfterTax = capitalGains; // Full amount tax-free

  return (
    <Card className="p-6 space-y-6 bg-gradient-to-br from-background to-muted/20">
      <div>
        <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
          <Receipt className="w-5 h-5 text-primary" />
          Tax-Efficient Investing Calculator
        </h3>
        <p className="text-sm text-muted-foreground">
          Understand the tax impact of different investment accounts and holding periods
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">
            Annual Income: ${income.toLocaleString()}
          </label>
          <Input
            type="number"
            value={income}
            onChange={(e) => setIncome(parseInt(e.target.value) || 0)}
            className="mb-1"
          />
          <p className="text-xs text-muted-foreground">
            Your income tax bracket: {(incomeTaxRate * 100).toFixed(0)}%
          </p>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">
            Capital Gains: ${capitalGains.toLocaleString()}
          </label>
          <Input
            type="number"
            value={capitalGains}
            onChange={(e) => setCapitalGains(parseInt(e.target.value) || 0)}
            className="mb-1"
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">
            Holding Period
          </label>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={holdingPeriod === "short" ? "default" : "outline"}
              onClick={() => setHoldingPeriod("short")}
              className="w-full"
            >
              Short-term (&lt;1 year)
            </Button>
            <Button
              variant={holdingPeriod === "long" ? "default" : "outline"}
              onClick={() => setHoldingPeriod("long")}
              className="w-full"
            >
              Long-term (≥1 year)
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {holdingPeriod === "short"
              ? `Short-term gains taxed as ordinary income (${(incomeTaxRate * 100).toFixed(0)}%)`
              : `Long-term gains taxed at preferential rate (${(capitalGainsTaxRate * 100).toFixed(0)}%)`}
          </p>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">
            Account Type
          </label>
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant={accountType === "taxable" ? "default" : "outline"}
              onClick={() => setAccountType("taxable")}
              className="w-full text-xs"
            >
              Taxable
            </Button>
            <Button
              variant={accountType === "ira" ? "default" : "outline"}
              onClick={() => setAccountType("ira")}
              className="w-full text-xs"
            >
              Traditional IRA
            </Button>
            <Button
              variant={accountType === "roth" ? "default" : "outline"}
              onClick={() => setAccountType("roth")}
              className="w-full text-xs"
            >
              Roth IRA
            </Button>
          </div>
        </div>

        <Button onClick={calculate} className="w-full" size="lg">
          <DollarSign className="w-4 h-4 mr-2" />
          Calculate Tax Impact
        </Button>
      </div>

      {showResults && (
        <>
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="p-4 bg-muted/30">
              <h4 className="text-sm font-semibold mb-2">Taxable Account</h4>
              <div className="space-y-1 text-sm">
                <p>
                  <strong>Gains:</strong> ${capitalGains.toLocaleString()}
                </p>
                <p>
                  <strong>Tax Rate:</strong> {(capitalGainsTaxRate * 100).toFixed(0)}%
                </p>
                <p className="text-destructive">
                  <strong>Tax Owed:</strong> -${taxableGainsTax.toLocaleString()}
                </p>
                <p className="text-success font-bold pt-2 border-t">
                  After-Tax: ${taxableAfterTax.toLocaleString()}
                </p>
              </div>
            </Card>

            <Card className="p-4 bg-warning/10 border-warning/30">
              <h4 className="text-sm font-semibold mb-2">Traditional IRA</h4>
              <div className="space-y-1 text-sm">
                <p>
                  <strong>Gains:</strong> ${capitalGains.toLocaleString()}
                </p>
                <p>
                  <strong>Current Tax:</strong> $0
                </p>
                <p className="text-muted-foreground">
                  <strong>Future Tax:</strong> TBD*
                </p>
                <p className="text-success font-bold pt-2 border-t">
                  Growth: ${iraAfterTax.toLocaleString()}
                </p>
              </div>
            </Card>

            <Card className="p-4 bg-success/10 border-success/30">
              <h4 className="text-sm font-semibold mb-2">Roth IRA</h4>
              <div className="space-y-1 text-sm">
                <p>
                  <strong>Gains:</strong> ${capitalGains.toLocaleString()}
                </p>
                <p>
                  <strong>Tax Rate:</strong> 0%
                </p>
                <p className="text-success">
                  <strong>Tax Owed:</strong> $0
                </p>
                <p className="text-success font-bold pt-2 border-t">
                  After-Tax: ${rothAfterTax.toLocaleString()}
                </p>
              </div>
            </Card>
          </div>

          <Card className="p-4 bg-primary/5 border-primary/20">
            <h4 className="font-semibold mb-2 text-sm flex items-center gap-2">
              <Info className="w-4 h-4" />
              Tax Savings Comparison
            </h4>
            <div className="space-y-2 text-sm">
              <p>
                <strong>Short-term vs Long-term:</strong>{" "}
                {holdingPeriod === "short" ? (
                  <span className="text-destructive">
                    Save ${((capitalGains * incomeTaxRate) - (capitalGains * getCapitalGainsTaxRate(income, "long"))).toFixed(0)} 
                    {" "}by holding 1+ year!
                  </span>
                ) : (
                  <span className="text-success">
                    ✓ Saving ${((capitalGains * incomeTaxRate) - taxableGainsTax).toFixed(0)} with long-term rate
                  </span>
                )}
              </p>
              <p>
                <strong>Tax-Advantaged Accounts:</strong>{" "}
                <span className="text-success">
                  Save ${taxableGainsTax.toFixed(0)} immediately with IRA/Roth
                </span>
              </p>
            </div>
          </Card>

          <Card className="p-4 bg-muted/50">
            <h4 className="font-semibold mb-2 text-sm">Tax Strategy Tips</h4>
            <ul className="text-xs space-y-1 text-muted-foreground">
              <li>✓ <strong>Hold long-term</strong> to reduce capital gains tax significantly</li>
              <li>✓ <strong>Max out Roth IRA</strong> for tax-free growth (if eligible)</li>
              <li>✓ <strong>Use Traditional IRA</strong> to defer taxes and reduce current income</li>
              <li>✓ <strong>Tax-loss harvesting</strong> can offset gains in taxable accounts</li>
              <li>✓ <strong>Asset location</strong>: Hold bonds in IRA, stocks in taxable for dividends</li>
              <li>⚠ *Traditional IRA withdrawals taxed as ordinary income in retirement</li>
            </ul>
          </Card>
        </>
      )}
    </Card>
  );
};

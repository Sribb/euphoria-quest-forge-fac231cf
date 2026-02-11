import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Car } from "lucide-react";

export const CarBuyVsLease = () => {
  const [carPrice, setCarPrice] = useState(35000);
  const [downPayment, setDownPayment] = useState(5000);
  const [loanRate, setLoanRate] = useState(5.5);
  const [loanTerm, setLoanTerm] = useState(5);
  const [leasePayment, setLeasePayment] = useState(350);
  const [leaseTerm, setLeaseTerm] = useState(3);
  const [yearsOwned, setYearsOwned] = useState(7);
  const [depreciationRate, setDepreciationRate] = useState(15);

  const buyData = useMemo(() => {
    const principal = carPrice - downPayment;
    const r = loanRate / 100 / 12;
    const n = loanTerm * 12;
    const monthlyPayment = r > 0 ? principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : principal / n;
    const totalPayments = monthlyPayment * n + downPayment;
    const residualValue = carPrice * Math.pow(1 - depreciationRate / 100, yearsOwned);
    const totalCostBuy = totalPayments - residualValue + yearsOwned * 1200; // maintenance
    return { monthlyPayment: Math.round(monthlyPayment), totalCost: Math.round(totalCostBuy), residual: Math.round(residualValue) };
  }, [carPrice, downPayment, loanRate, loanTerm, yearsOwned, depreciationRate]);

  const leaseData = useMemo(() => {
    const numLeases = Math.ceil(yearsOwned / leaseTerm);
    const totalCost = leasePayment * leaseTerm * 12 * numLeases;
    return { totalCost: Math.round(totalCost), numLeases };
  }, [leasePayment, leaseTerm, yearsOwned]);

  const chartData = [
    { category: "Monthly Cost", buy: buyData.monthlyPayment, lease: leasePayment },
    { category: `${yearsOwned}-Year Total`, buy: buyData.totalCost, lease: leaseData.totalCost },
  ];

  return (
    <div className="space-y-6">
      <Card className="border-sky-500/30 bg-gradient-to-br from-sky-500/5 to-cyan-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="h-6 w-6 text-sky-500" />
            Car Buy vs Lease Calculator
          </CardTitle>
          <p className="text-sm text-muted-foreground">Compare the true cost of buying vs leasing over your ownership horizon.</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium">Car Price: ${carPrice.toLocaleString()}</label>
              <Slider value={[carPrice]} onValueChange={v => setCarPrice(v[0])} min={15000} max={80000} step={1000} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Down Payment: ${downPayment.toLocaleString()}</label>
              <Slider value={[downPayment]} onValueChange={v => setDownPayment(v[0])} min={0} max={20000} step={500} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Lease Payment: ${leasePayment}/mo</label>
              <Slider value={[leasePayment]} onValueChange={v => setLeasePayment(v[0])} min={150} max={800} step={25} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Years to Compare: {yearsOwned}</label>
              <Slider value={[yearsOwned]} onValueChange={v => setYearsOwned(v[0])} min={3} max={10} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-card border-primary/30"><CardContent className="p-4">
              <h4 className="font-semibold text-sm mb-2">Buy</h4>
              <p className="text-2xl font-bold">${buyData.monthlyPayment}/mo</p>
              <p className="text-xs text-muted-foreground">{yearsOwned}-year cost: ${buyData.totalCost.toLocaleString()}</p>
              <p className="text-xs text-emerald-500">Residual value: ${buyData.residual.toLocaleString()}</p>
            </CardContent></Card>
            <Card className="bg-card border-accent/30"><CardContent className="p-4">
              <h4 className="font-semibold text-sm mb-2">Lease</h4>
              <p className="text-2xl font-bold">${leasePayment}/mo</p>
              <p className="text-xs text-muted-foreground">{yearsOwned}-year cost: ${leaseData.totalCost.toLocaleString()}</p>
              <p className="text-xs text-destructive">{leaseData.numLeases} lease(s), no equity</p>
            </CardContent></Card>
          </div>

          <div className="text-center p-3 rounded-lg border bg-card">
            <Badge variant={buyData.totalCost < leaseData.totalCost ? "default" : "secondary"} className="text-base">
              {buyData.totalCost < leaseData.totalCost
                ? `Buying saves $${(leaseData.totalCost - buyData.totalCost).toLocaleString()} over ${yearsOwned} years`
                : `Leasing saves $${(buyData.totalCost - leaseData.totalCost).toLocaleString()} over ${yearsOwned} years`}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

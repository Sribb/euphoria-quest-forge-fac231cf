import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { Shield, AlertTriangle } from "lucide-react";

export const CorporateRiskLab = () => {
  const [marketRisk, setMarketRisk] = useState(50);
  const [creditRisk, setCreditRisk] = useState(30);
  const [operationalRisk, setOperationalRisk] = useState(40);
  const [hedgingPct, setHedgingPct] = useState(60);
  const [insurancePct, setInsurancePct] = useState(40);

  const totalExposure = marketRisk + creditRisk + operationalRisk;
  const mitigated = (marketRisk * hedgingPct / 100) + (operationalRisk * insurancePct / 100);
  const residualRisk = totalExposure - mitigated;
  const riskScore = Math.round((residualRisk / 300) * 100);

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">Set risk exposure levels and apply mitigation strategies. Minimize residual risk.</p>

      <div className="space-y-3">
        <p className="text-sm font-medium text-foreground">Risk Exposures</p>
        {[
          { label: "Market Risk", value: marketRisk, set: setMarketRisk },
          { label: "Credit Risk", value: creditRisk, set: setCreditRisk },
          { label: "Operational Risk", value: operationalRisk, set: setOperationalRisk },
        ].map((c) => (
          <div key={c.label} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{c.label}</span>
              <span className="font-medium text-foreground">{c.value}%</span>
            </div>
            <Slider value={[c.value]} onValueChange={([v]) => c.set(v)} max={100} />
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium text-foreground flex items-center gap-1"><Shield className="w-4 h-4 text-primary" /> Mitigation</p>
        {[
          { label: "Hedging Coverage (Market)", value: hedgingPct, set: setHedgingPct },
          { label: "Insurance Coverage (Operational)", value: insurancePct, set: setInsurancePct },
        ].map((c) => (
          <div key={c.label} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{c.label}</span>
              <span className="font-medium text-foreground">{c.value}%</span>
            </div>
            <Slider value={[c.value]} onValueChange={([v]) => c.set(v)} max={100} />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Card className="p-4 bg-card/60 border-border/50 text-center">
          <p className="text-xs text-muted-foreground">Total Exposure</p>
          <p className="text-xl font-bold text-foreground">{totalExposure}</p>
        </Card>
        <Card className="p-4 bg-card/60 border-border/50 text-center">
          <p className="text-xs text-muted-foreground">Mitigated</p>
          <p className="text-xl font-bold text-emerald-500">{Math.round(mitigated)}</p>
        </Card>
        <Card className={cn("p-4 border text-center", riskScore < 30 ? "bg-emerald-500/10 border-emerald-500/30" : riskScore < 60 ? "bg-amber-500/10 border-amber-500/30" : "bg-destructive/10 border-destructive/30")}>
          <p className="text-xs text-muted-foreground">Risk Score</p>
          <p className={cn("text-xl font-bold", riskScore < 30 ? "text-emerald-500" : riskScore < 60 ? "text-amber-500" : "text-destructive")}>{riskScore}%</p>
        </Card>
      </div>
    </div>
  );
};

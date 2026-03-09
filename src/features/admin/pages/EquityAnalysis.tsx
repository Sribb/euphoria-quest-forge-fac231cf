import { ArrowLeft, Eye, EyeOff, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { motion } from "framer-motion";

interface Props { onBack: () => void; }

const tiers = [
  {
    title: "Access", desc: "Are all students able to use the platform?", score: 82,
    groups: [
      { label: "White", value: 94 }, { label: "Black", value: 86 }, { label: "Hispanic", value: 81 },
      { label: "Asian", value: 96 }, { label: "ELL", value: 72, flag: true }, { label: "IEP", value: 78, flag: true },
    ],
  },
  {
    title: "Engagement", desc: "Are all students using it equally?", score: 71,
    groups: [
      { label: "White", value: 78 }, { label: "Black", value: 68 }, { label: "Hispanic", value: 65, flag: true },
      { label: "Asian", value: 82 }, { label: "ELL", value: 58, flag: true }, { label: "IEP", value: 61, flag: true },
    ],
  },
  {
    title: "Outcomes", desc: "Are all students learning equally?", score: 64,
    groups: [
      { label: "White", value: 74 }, { label: "Black", value: 61, flag: true }, { label: "Hispanic", value: 59, flag: true },
      { label: "Asian", value: 79 }, { label: "ELL", value: 52, flag: true }, { label: "IEP", value: 48, flag: true },
    ],
  },
];

export const EquityAnalysis = ({ onBack }: Props) => {
  const [privacyMode, setPrivacyMode] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack}><ArrowLeft className="h-5 w-5" /></Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Equity Analysis Dashboard</h1>
            <p className="text-sm text-muted-foreground">Access, engagement, and achievement gaps</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => setPrivacyMode(!privacyMode)} className="gap-2">
          {privacyMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          {privacyMode ? "Privacy On" : "Privacy Off"}
        </Button>
      </div>

      {tiers.map((tier, ti) => (
        <motion.div key={tier.title} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: ti * 0.1 }}>
          <Card className="p-4 border-border/50">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-foreground text-sm">{tier.title}</h3>
                <p className="text-xs text-muted-foreground">{tier.desc}</p>
              </div>
              <div className={`px-3 py-1.5 rounded-full text-sm font-black ${tier.score >= 80 ? 'bg-green-500/20 text-green-500' : tier.score >= 65 ? 'bg-amber-500/20 text-amber-500' : 'bg-red-500/20 text-red-400'}`}>
                {tier.score}
              </div>
            </div>
            <div className="space-y-2">
              {tier.groups.map(g => (
                <div key={g.label} className="flex items-center gap-3">
                  <span className={`text-xs font-medium w-16 shrink-0 ${privacyMode ? 'blur-sm' : ''} text-foreground`}>{g.label}</span>
                  <div className="flex-1 relative">
                    <Progress value={g.value} className="h-2.5" />
                    <div className="absolute top-0 h-full w-px bg-foreground/40" style={{ left: '70%' }} />
                  </div>
                  <span className={`text-xs font-bold w-8 ${g.flag ? 'text-amber-500' : 'text-foreground'}`}>{g.value}%</span>
                  {g.flag && <AlertTriangle className="h-3 w-3 text-amber-500 shrink-0" />}
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      ))}

      <Card className="p-4 border-amber-500/30 bg-amber-500/5">
        <h3 className="font-semibold text-foreground text-sm mb-2 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-500" /> Intervention Priorities
        </h3>
        <div className="space-y-1.5">
          <p className="text-xs text-foreground">1. <strong>ELL students</strong> — Access gap (-10pp) likely driven by device availability and language barriers</p>
          <p className="text-xs text-foreground">2. <strong>IEP students</strong> — Engagement and outcome gaps suggest need for differentiated content pacing</p>
          <p className="text-xs text-foreground">3. <strong>Hispanic students</strong> — Engagement gap (-7pp) may correlate with after-school access patterns</p>
        </div>
      </Card>
    </div>
  );
};

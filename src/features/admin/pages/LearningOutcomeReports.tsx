import { ArrowLeft, Download, TrendingUp, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

interface Props { onBack: () => void; }

const summary = { preTest: 42.3, postTest: 61.8, gain: 19.5, cohensD: 0.72, sampleSize: 1247, pValue: 0.001 };

const unitGains = [
  { name: "Budgeting Basics", pre: 38, post: 68 },
  { name: "Investing Fundamentals", pre: 41, post: 63 },
  { name: "Credit & Debt", pre: 35, post: 59 },
  { name: "Risk Management", pre: 44, post: 62 },
  { name: "Trading Concepts", pre: 48, post: 61 },
  { name: "Alternative Assets", pre: 39, post: 51 },
];

const subgroups = [
  { group: "All Students", gain: 19.5, n: 1247 },
  { group: "Female", gain: 21.2, n: 612 },
  { group: "Male", gain: 17.8, n: 601 },
  { group: "ELL", gain: 15.1, n: 189, flag: true },
  { group: "IEP", gain: 13.4, n: 156, flag: true },
  { group: "Free/Reduced Lunch", gain: 16.8, n: 487 },
];

function getEffectLabel(d: number) {
  if (d >= 0.8) return { label: "Large", color: "text-green-500", bg: "bg-green-500/20" };
  if (d >= 0.5) return { label: "Medium", color: "text-blue-500", bg: "bg-blue-500/20" };
  return { label: "Small", color: "text-muted-foreground", bg: "bg-muted/30" };
}

export const LearningOutcomeReports = ({ onBack }: Props) => {
  const effect = getEffectLabel(summary.cohensD);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack}><ArrowLeft className="h-5 w-5" /></Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Learning Outcome Reports</h1>
            <p className="text-sm text-muted-foreground">Pre/post gains, effect sizes, and equity breakdowns</p>
          </div>
        </div>
        <Button variant="outline" size="sm" className="gap-2"><Download className="h-4 w-4" />Export PDF</Button>
      </div>

      {/* Executive Summary */}
      <Card className="p-5 border-border/50">
        <h3 className="font-semibold text-foreground text-sm mb-4">Executive Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center"><p className="text-2xl font-black text-foreground">{summary.preTest}%</p><p className="text-xs text-muted-foreground">Pre-Test Mean</p></div>
          <div className="text-center"><p className="text-2xl font-black text-foreground">{summary.postTest}%</p><p className="text-xs text-muted-foreground">Post-Test Mean</p></div>
          <div className="text-center"><p className="text-2xl font-black text-green-500">+{summary.gain}pp</p><p className="text-xs text-muted-foreground">Learning Gain</p></div>
          <div className="text-center">
            <p className="text-2xl font-black text-foreground">{summary.cohensD}</p>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${effect.bg} ${effect.color}`}>{effect.label} Effect</span>
          </div>
          <div className="text-center"><p className="text-2xl font-black text-foreground">n={summary.sampleSize}</p><p className="text-xs text-muted-foreground">p&lt;{summary.pValue}</p></div>
        </div>
      </Card>

      {/* Unit Breakdown */}
      <Card className="p-4 border-border/50">
        <h3 className="font-semibold text-foreground text-sm mb-3">Unit-Level Pre/Post Comparison</h3>
        <div className="space-y-3">
          {unitGains.map((u, i) => (
            <motion.div key={u.name} className="flex items-center gap-3" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
              <span className="text-xs text-muted-foreground w-32 shrink-0">{u.name}</span>
              <div className="flex-1 flex items-center gap-1 h-5">
                <div className="h-full rounded bg-muted/50" style={{ width: `${u.pre}%` }} />
                <div className="h-full rounded bg-primary/70" style={{ width: `${u.post}%` }} />
              </div>
              <span className="text-xs font-bold text-green-500 w-12 text-right">+{u.post - u.pre}pp</span>
            </motion.div>
          ))}
        </div>
        <div className="flex items-center gap-4 mt-3">
          <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground"><div className="w-3 h-2 rounded bg-muted/50" />Pre-Test</span>
          <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground"><div className="w-3 h-2 rounded bg-primary/70" />Post-Test</span>
        </div>
      </Card>

      {/* Subgroup Analysis */}
      <Card className="p-4 border-border/50">
        <h3 className="font-semibold text-foreground text-sm mb-3">Subgroup Analysis</h3>
        <div className="space-y-2.5">
          {subgroups.map(s => (
            <div key={s.group} className="flex items-center gap-3">
              <span className="text-xs font-medium text-foreground w-28 shrink-0 flex items-center gap-1">
                {s.group}
                {s.flag && <AlertTriangle className="h-3 w-3 text-amber-500" />}
              </span>
              <div className="flex-1"><Progress value={(s.gain / 25) * 100} className="h-2" /></div>
              <span className={`text-xs font-bold w-12 text-right ${s.flag ? 'text-amber-500' : 'text-green-500'}`}>+{s.gain}pp</span>
              <span className="text-[10px] text-muted-foreground w-12 text-right">n={s.n}</span>
            </div>
          ))}
        </div>
        {subgroups.some(s => s.flag) && (
          <div className="mt-3 p-2.5 rounded-lg border border-amber-500/30 bg-amber-500/5">
            <p className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
              Equity gap detected: ELL and IEP subgroups show gains &gt;0.3 SD below district average. Consider targeted intervention.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};

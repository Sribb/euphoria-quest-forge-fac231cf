import { ArrowLeft, Building2, TrendingUp, DollarSign, Users, GraduationCap, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

interface Props { onBack: () => void; }

const kpis = [
  { label: "Students Served", value: "8,432", icon: Users },
  { label: "District Completion", value: "68%", icon: GraduationCap },
  { label: "Avg Learning Gain", value: "+14.2pp", icon: TrendingUp },
  { label: "License Utilization", value: "87%", icon: Building2 },
  { label: "Cost per Outcome", value: "$2.14", icon: DollarSign },
];

const schools = [
  { name: "Lincoln High", enrollment: 1200, usage: 82, outcomes: 78 },
  { name: "Roosevelt Middle", enrollment: 800, usage: 75, outcomes: 71 },
  { name: "Jefferson Academy", enrollment: 650, usage: 68, outcomes: 65 },
  { name: "Washington Prep", enrollment: 950, usage: 61, outcomes: 59 },
  { name: "Adams Elementary", enrollment: 500, usage: 45, outcomes: 52 },
  { name: "Madison Tech", enrollment: 700, usage: 38, outcomes: 41 },
];

const goals = [
  { label: "80% district completion by June", progress: 68, target: 80 },
  { label: "Close ELL achievement gap to <10pp", progress: 72, target: 90 },
  { label: "95% license utilization", progress: 87, target: 95 },
];

export const DistrictExecutiveDashboard = ({ onBack }: Props) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack}><ArrowLeft className="h-5 w-5" /></Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">District Executive Dashboard</h1>
            <p className="text-sm text-muted-foreground">Cross-school intelligence for leadership</p>
          </div>
        </div>
        <Button variant="outline" size="sm" className="gap-2"><Download className="h-4 w-4" />Board Report</Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {kpis.map((k, i) => (
          <motion.div key={k.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
            <Card className="p-3 text-center border-border/50">
              <k.icon className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
              <p className="text-xl font-black text-foreground">{k.value}</p>
              <p className="text-xs text-muted-foreground">{k.label}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* School Bubble Chart (simplified as table) */}
      <Card className="p-4 border-border/50">
        <h3 className="font-semibold text-foreground text-sm mb-4">School Comparison Matrix</h3>
        <div className="relative h-64 bg-muted/20 rounded-xl border border-border/30 p-4">
          <div className="absolute top-2 right-3 text-xs text-muted-foreground">High Outcomes →</div>
          <div className="absolute bottom-2 right-3 text-xs text-muted-foreground">High Usage →</div>
          {/* Quadrant lines */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border/50" />
          <div className="absolute top-1/2 left-0 right-0 h-px bg-border/50" />
          <div className="absolute top-1 left-1/2 ml-2 text-xs text-green-500/70">★ Target Zone</div>
          {schools.map((s, i) => {
            const x = (s.usage / 100) * 85 + 5;
            const y = 90 - (s.outcomes / 100) * 85;
            const size = Math.max(20, s.enrollment / 30);
            return (
              <motion.div
                key={s.name}
                className="absolute rounded-full bg-primary/20 border-2 border-primary/60 flex items-center justify-center cursor-pointer hover:bg-primary/40 transition-colors group"
                style={{ left: `${x}%`, top: `${y}%`, width: size, height: size, transform: 'translate(-50%, -50%)' }}
                initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.08 }}
                title={`${s.name}: ${s.usage}% usage, ${s.outcomes}% outcomes`}
              >
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-popover border border-border px-1.5 py-0.5 rounded text-[10px] text-foreground whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  {s.name}
                </div>
              </motion.div>
            );
          })}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* School Rankings */}
        <Card className="p-4 border-border/50">
          <h3 className="font-semibold text-foreground text-sm mb-3">School Rankings</h3>
          <div className="space-y-2.5">
            {schools.sort((a, b) => b.outcomes - a.outcomes).map((s, i) => (
              <div key={s.name} className="flex items-center gap-3">
                <span className="text-xs font-bold text-muted-foreground w-4">{i + 1}</span>
                <div className="flex-1">
                  <p className="text-xs font-medium text-foreground">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.enrollment} students</p>
                </div>
                <div className="w-20"><Progress value={s.outcomes} className="h-1.5" /></div>
                <span className="text-xs font-bold text-foreground w-8">{s.outcomes}%</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Goal Tracker */}
        <Card className="p-4 border-border/50">
          <h3 className="font-semibold text-foreground text-sm mb-3">District Goals</h3>
          <div className="space-y-4">
            {goals.map(g => (
              <div key={g.label}>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs text-foreground">{g.label}</p>
                  <span className="text-xs font-bold text-primary">{g.progress}%</span>
                </div>
                <div className="relative">
                  <Progress value={g.progress} className="h-2" />
                  <div className="absolute top-0 h-full w-px bg-foreground/50" style={{ left: `${g.target}%` }} title={`Target: ${g.target}%`} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

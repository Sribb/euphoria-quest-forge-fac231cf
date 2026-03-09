import { ArrowLeft, Award, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

interface Props { onBack: () => void; }

const metrics = [
  { name: "Completion Rate", school: 72, district: 65, state: 58, national: 52 },
  { name: "Learning Gain", school: 68, district: 61, state: 55, national: 50 },
  { name: "Engagement Score", school: 78, district: 70, state: 62, national: 56 },
  { name: "Session Duration", school: 55, district: 60, state: 58, national: 54 },
  { name: "Assignment Completion", school: 82, district: 74, state: 68, national: 61 },
];

const bestPractice = {
  school: "Lincoln High School",
  category: "Completion Rate",
  summary: "Lincoln integrates platform assignments into daily bell-ringer activities, ensuring every student touches the platform for 5-10 minutes at the start of each class. Teachers review completion data weekly in PLC meetings.",
};

export const SchoolBenchmarks = ({ onBack }: Props) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack}><ArrowLeft className="h-5 w-5" /></Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">School Comparison Benchmarks</h1>
            <p className="text-sm text-muted-foreground">Percentile rankings against peers</p>
          </div>
        </div>
        <Button variant="outline" size="sm" className="gap-2"><Download className="h-4 w-4" />Export</Button>
      </div>

      <Card className="p-5 border-border/50">
        <h3 className="font-semibold text-foreground text-sm mb-5">Percentile Rails</h3>
        <div className="space-y-6">
          {metrics.map((m, i) => {
            const percentile = Math.round((m.school / 100) * 100);
            return (
              <motion.div key={m.name} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-foreground">{m.name}</span>
                  <span className="text-xs font-bold text-primary">{percentile}th percentile</span>
                </div>
                <div className="relative h-6 rounded-full overflow-hidden">
                  {/* Background bands */}
                  <div className="absolute inset-0 flex">
                    <div className="h-full bg-muted/30" style={{ width: `${m.district}%` }} />
                    <div className="h-full bg-blue-500/10" style={{ width: `${m.state - m.district}%` }} />
                    <div className="h-full bg-primary/10" style={{ width: `${100 - m.state}%` }} />
                  </div>
                  {/* Reference markers */}
                  <div className="absolute top-0 h-full w-px bg-muted-foreground/30" style={{ left: `${m.district}%` }} title="District Avg" />
                  <div className="absolute top-0 h-full w-px bg-blue-500/50" style={{ left: `${m.state}%` }} title="State Avg" />
                  {/* School dot */}
                  <motion.div
                    className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-primary border-2 border-background shadow-lg"
                    style={{ left: `${m.school}%`, transform: 'translate(-50%, -50%)' }}
                    initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.06 + 0.2 }}
                  />
                </div>
                <div className="flex justify-between text-[9px] text-muted-foreground mt-0.5">
                  <span>0th</span>
                  <span>District: {m.district}%</span>
                  <span>State: {m.state}%</span>
                  <span>100th</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Card>

      <Card className="p-4 border-green-500/30 bg-green-500/5">
        <div className="flex items-center gap-2 mb-2">
          <Award className="h-4 w-4 text-green-500" />
          <h3 className="font-semibold text-foreground text-sm">Best Practice Spotlight</h3>
        </div>
        <p className="text-xs font-medium text-foreground mb-1">{bestPractice.school} — {bestPractice.category}</p>
        <p className="text-xs text-muted-foreground">{bestPractice.summary}</p>
      </Card>
    </div>
  );
};

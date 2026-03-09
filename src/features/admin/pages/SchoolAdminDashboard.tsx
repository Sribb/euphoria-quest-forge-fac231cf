import { ArrowLeft, Users, BarChart3, Activity, GraduationCap, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { motion } from "framer-motion";

interface Props { onBack: () => void; }

const mockKPIs = [
  { label: "Active Students", value: "1,247", delta: "+8.3%", up: true, icon: Users },
  { label: "Avg Completion", value: "72%", delta: "+3.1%", up: true, icon: BarChart3 },
  { label: "Sessions This Week", value: "4,891", delta: "-2.4%", up: false, icon: Activity },
  { label: "Teachers Active", value: "34 / 41", delta: "+2", up: true, icon: GraduationCap },
];

const mockClasses = [
  { teacher: "Ms. Rodriguez", class: "AP Economics - P3", students: 32, completion: 89, trend: "up" as const },
  { teacher: "Mr. Chen", class: "Personal Finance - P1", students: 28, completion: 82, trend: "up" as const },
  { teacher: "Dr. Patel", class: "Intro to Business - P5", students: 35, completion: 76, trend: "up" as const },
  { teacher: "Mrs. Johnson", class: "Financial Literacy - P2", students: 30, completion: 64, trend: "down" as const },
  { teacher: "Mr. Thompson", class: "Marketing - P4", students: 26, completion: 51, trend: "down" as const },
  { teacher: "Ms. Davis", class: "Investing 101 - P6", students: 29, completion: 38, trend: "down" as const },
];

const mockAttention = [
  { teacher: "Mr. Williams", issue: "2 logins in past 30 days", severity: "red" as const },
  { teacher: "Ms. Garcia", issue: "Class completion below 35%", severity: "red" as const },
  { teacher: "Mr. Lee", issue: "No assignments created this month", severity: "amber" as const },
  { teacher: "Mrs. Brown", issue: "Below avg progress views", severity: "amber" as const },
];

const heatmapData = Array.from({ length: 30 }, () => Math.random());

export const SchoolAdminDashboard = ({ onBack }: Props) => {
  const [selectedTeacher, setSelectedTeacher] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack}><ArrowLeft className="h-5 w-5" /></Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">School Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground">Aggregate visibility across all teachers, classes, and students</p>
        </div>
      </div>

      {/* KPI Tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {mockKPIs.map((kpi, i) => (
          <motion.div key={kpi.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="p-4 bg-card border-border/50">
              <div className="flex items-center justify-between mb-2">
                <kpi.icon className="h-4 w-4 text-muted-foreground" />
                <span className={`text-xs font-medium flex items-center gap-1 ${kpi.up ? 'text-green-500' : 'text-red-400'}`}>
                  {kpi.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {kpi.delta}
                </span>
              </div>
              <p className="text-2xl font-black text-foreground">{kpi.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{kpi.label}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Usage Heatmap */}
        <Card className="p-4 border-border/50">
          <h3 className="font-semibold text-foreground text-sm mb-3">30-Day Usage Heatmap</h3>
          <div className="grid grid-cols-6 gap-1">
            {heatmapData.map((val, i) => (
              <div
                key={i}
                className="aspect-square rounded-sm"
                style={{ backgroundColor: `hsl(var(--primary) / ${0.1 + val * 0.9})` }}
                title={`Day ${i + 1}: ${Math.round(val * 200)} sessions`}
              />
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2">Cell intensity = session volume</p>
        </Card>

        {/* Class Leaderboard */}
        <Card className="p-4 border-border/50">
          <h3 className="font-semibold text-foreground text-sm mb-3">Class Leaderboard</h3>
          <div className="space-y-3">
            {mockClasses.map((c, i) => (
              <div key={i} className="flex items-center gap-3 cursor-pointer hover:bg-muted/30 rounded-lg p-1.5 -mx-1.5 transition-colors"
                onClick={() => setSelectedTeacher(c.teacher)}>
                <span className="text-xs font-bold text-muted-foreground w-4">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">{c.class}</p>
                  <p className="text-xs text-muted-foreground">{c.teacher} · {c.students} students</p>
                </div>
                <div className="w-16">
                  <Progress value={c.completion} className="h-1.5" />
                </div>
                <span className={`text-xs font-bold ${c.completion >= 70 ? 'text-green-500' : c.completion >= 50 ? 'text-amber-500' : 'text-red-400'}`}>
                  {c.completion}%
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Attention Needed */}
        <Card className="p-4 border-border/50">
          <h3 className="font-semibold text-foreground text-sm mb-3 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            Attention Needed
          </h3>
          <div className="space-y-2">
            {mockAttention.map((a, i) => (
              <div key={i} className={`p-2.5 rounded-lg border ${a.severity === 'red' ? 'border-red-500/30 bg-red-500/5' : 'border-amber-500/30 bg-amber-500/5'}`}>
                <p className="text-xs font-semibold text-foreground">{a.teacher}</p>
                <p className="text-xs text-muted-foreground">{a.issue}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {selectedTeacher && (
        <Card className="p-4 border-primary/30 bg-primary/5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-foreground text-sm">Teacher Detail: {selectedTeacher}</h3>
            <Button variant="ghost" size="sm" onClick={() => setSelectedTeacher(null)}>Close</Button>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {["Weekly Logins: 4.2 avg", "Assignments: 6 this month", "Progress Views: 12/week", "Student Avg: 72%"].map(s => (
              <div key={s} className="p-2 rounded-lg bg-background border border-border/50 text-xs text-center text-foreground">{s}</div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

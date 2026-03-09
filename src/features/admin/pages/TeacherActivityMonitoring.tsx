import { ArrowLeft, Search, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";

interface Props { onBack: () => void; }

const teachers = [
  { name: "Rodriguez, Maria", lastLogin: "2h ago", weeklyLogins: 4.8, assignments: 8, progressViews: 18, studentAvg: 89, score: 92 },
  { name: "Chen, David", lastLogin: "1d ago", weeklyLogins: 4.2, assignments: 6, progressViews: 14, studentAvg: 82, score: 85 },
  { name: "Patel, Priya", lastLogin: "3h ago", weeklyLogins: 3.8, assignments: 5, progressViews: 12, studentAvg: 76, score: 78 },
  { name: "Johnson, Sarah", lastLogin: "2d ago", weeklyLogins: 3.1, assignments: 4, progressViews: 8, studentAvg: 64, score: 62 },
  { name: "Thompson, Mark", lastLogin: "3d ago", weeklyLogins: 2.4, assignments: 3, progressViews: 5, studentAvg: 51, score: 48 },
  { name: "Davis, Emily", lastLogin: "5d ago", weeklyLogins: 1.8, assignments: 2, progressViews: 3, studentAvg: 38, score: 35 },
  { name: "Williams, James", lastLogin: "12d ago", weeklyLogins: 0.5, assignments: 0, progressViews: 1, studentAvg: 29, score: 15 },
  { name: "Garcia, Ana", lastLogin: "8d ago", weeklyLogins: 1.2, assignments: 1, progressViews: 2, studentAvg: 34, score: 22 },
];

function getStatus(score: number) {
  if (score >= 75) return { label: "Active", color: "bg-green-500/20 text-green-500" };
  if (score >= 40) return { label: "Monitor", color: "bg-amber-500/20 text-amber-500" };
  return { label: "Support", color: "bg-red-500/20 text-red-400" };
}

export const TeacherActivityMonitoring = ({ onBack }: Props) => {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<string>("score");
  const [selectedTeacher, setSelectedTeacher] = useState<string | null>(null);

  const counts = useMemo(() => ({
    active: teachers.filter(t => t.score >= 75).length,
    monitor: teachers.filter(t => t.score >= 40 && t.score < 75).length,
    support: teachers.filter(t => t.score < 40).length,
  }), []);

  const filtered = useMemo(() => {
    let list = teachers.filter(t => t.name.toLowerCase().includes(search.toLowerCase()));
    list.sort((a, b) => (b as any)[sortKey] - (a as any)[sortKey]);
    return list;
  }, [search, sortKey]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack}><ArrowLeft className="h-5 w-5" /></Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Teacher Activity Monitoring</h1>
          <p className="text-sm text-muted-foreground">Identifying engagement patterns and support needs</p>
        </div>
      </div>

      <div className="p-3 rounded-xl bg-muted/30 border border-border/50 flex items-center gap-4 text-sm">
        <span className="text-green-500 font-semibold">{counts.active} Active</span>
        <span className="text-amber-500 font-semibold">{counts.monitor} Monitoring</span>
        <span className="text-red-400 font-semibold">{counts.support} Support Needed</span>
      </div>

      <div className="p-2 rounded-lg bg-blue-500/5 border border-blue-500/20 text-xs text-blue-500">
        ℹ️ This data is for coaching support, not performance evaluation.
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search teachers..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" /></div>
        <Button variant="outline" size="sm" className="gap-1" onClick={() => setSortKey(s => s === "score" ? "name" : "score")}><ArrowUpDown className="h-3 w-3" />Sort</Button>
      </div>

      <Card className="border-border/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead><tr className="border-b border-border/50 bg-muted/20">
              <th className="text-left p-3 font-medium text-muted-foreground">Teacher</th>
              <th className="text-center p-3 font-medium text-muted-foreground">Last Login</th>
              <th className="text-center p-3 font-medium text-muted-foreground">Wkly Logins</th>
              <th className="text-center p-3 font-medium text-muted-foreground">Assignments</th>
              <th className="text-center p-3 font-medium text-muted-foreground">Progress Views</th>
              <th className="text-center p-3 font-medium text-muted-foreground">Student Avg</th>
              <th className="text-center p-3 font-medium text-muted-foreground">Score</th>
              <th className="text-center p-3 font-medium text-muted-foreground">Status</th>
            </tr></thead>
            <tbody>
              {filtered.map((t, i) => {
                const status = getStatus(t.score);
                return (
                  <motion.tr key={t.name} className="border-b border-border/30 hover:bg-muted/10 cursor-pointer transition-colors" onClick={() => setSelectedTeacher(t.name)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}>
                    <td className="p-3 font-medium text-foreground">{t.name}</td>
                    <td className="p-3 text-center text-muted-foreground">{t.lastLogin}</td>
                    <td className="p-3 text-center text-foreground">{t.weeklyLogins}</td>
                    <td className="p-3 text-center text-foreground">{t.assignments}</td>
                    <td className="p-3 text-center text-foreground">{t.progressViews}</td>
                    <td className="p-3 text-center text-foreground">{t.studentAvg}%</td>
                    <td className="p-3 text-center font-bold text-foreground">{t.score}</td>
                    <td className="p-3 text-center"><span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${status.color}`}>{status.label}</span></td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {selectedTeacher && (
        <Card className="p-4 border-primary/30 bg-primary/5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-foreground text-sm">90-Day Activity: {selectedTeacher}</h3>
            <Button variant="ghost" size="sm" onClick={() => setSelectedTeacher(null)}>Close</Button>
          </div>
          <div className="flex items-end gap-1 h-20">
            {Array.from({ length: 12 }, (_, w) => {
              const val = Math.random() * 100;
              return <div key={w} className="flex-1 rounded-t bg-primary/60" style={{ height: `${val}%` }} title={`Week ${w + 1}`} />;
            })}
          </div>
          <p className="text-[10px] text-muted-foreground mt-1">Weekly login activity over 12 weeks</p>
        </Card>
      )}
    </div>
  );
};

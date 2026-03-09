import { ArrowLeft, Key, Building2, AlertTriangle, ArrowRightLeft, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { motion } from "framer-motion";

interface Props { onBack: () => void; }

const summary = { purchased: 10000, allocated: 8750, active: 7621 };

const schools = [
  { name: "Lincoln High", allocated: 1500, active: 1380, total: 1500 },
  { name: "Roosevelt Middle", allocated: 1200, active: 980, total: 1200 },
  { name: "Jefferson Academy", allocated: 1000, active: 870, total: 1000 },
  { name: "Washington Prep", allocated: 1400, active: 1290, total: 1400 },
  { name: "Adams Elementary", allocated: 800, active: 620, total: 800 },
  { name: "Madison Tech", allocated: 950, active: 710, total: 950 },
  { name: "Monroe Charter", allocated: 900, active: 771, total: 900 },
];

export const LicenseManagement = ({ onBack }: Props) => {
  const [selectedSchool, setSelectedSchool] = useState<string | null>(null);
  const unallocated = summary.purchased - summary.allocated;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack}><ArrowLeft className="h-5 w-5" /></Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">License Management</h1>
            <p className="text-sm text-muted-foreground">Allocate, track, and adjust seat licenses</p>
          </div>
        </div>
        <Button variant="outline" size="sm" className="gap-2"><Download className="h-4 w-4" />Export CSV</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <Card className="p-4 border-border/50 text-center bg-indigo-500/5">
          <Key className="h-4 w-4 mx-auto text-indigo-500 mb-1" />
          <p className="text-2xl font-black text-foreground">{summary.purchased.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">Total Purchased</p>
        </Card>
        <Card className="p-4 border-border/50 text-center bg-teal-500/5">
          <Building2 className="h-4 w-4 mx-auto text-teal-500 mb-1" />
          <p className="text-2xl font-black text-foreground">{summary.allocated.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">Allocated</p>
        </Card>
        <Card className="p-4 border-border/50 text-center bg-green-500/5">
          <p className="text-2xl font-black text-green-500">{summary.active.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">Active</p>
        </Card>
        <Card className="p-4 border-border/50 text-center bg-amber-500/5">
          <p className="text-2xl font-black text-amber-500">{unallocated.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">Unallocated Pool</p>
        </Card>
      </div>

      <Card className="p-4 border-border/50">
        <h3 className="font-semibold text-foreground text-sm mb-4">License Allocation by School</h3>
        <div className="space-y-3">
          {schools.map((s, i) => {
            const utilPct = Math.round((s.active / s.allocated) * 100);
            const overThreshold = utilPct >= 90;
            return (
              <motion.div key={s.name} className="flex items-center gap-3 cursor-pointer hover:bg-muted/10 rounded-lg p-1.5 -mx-1.5 transition-colors" onClick={() => setSelectedSchool(s.name)} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
                <span className="text-xs font-medium text-foreground w-28 shrink-0">{s.name}</span>
                <div className="flex-1 relative h-5 rounded-full overflow-hidden bg-muted/20">
                  <div className="h-full bg-primary/70 rounded-full" style={{ width: `${(s.active / s.allocated) * 100}%` }} />
                  <div className="absolute top-0 h-full w-px bg-amber-500" style={{ left: '90%' }} />
                </div>
                <span className={`text-xs font-bold w-10 text-right ${overThreshold ? 'text-amber-500' : 'text-foreground'}`}>
                  {utilPct}%
                </span>
                {overThreshold && <AlertTriangle className="h-3 w-3 text-amber-500 shrink-0" />}
                <span className="text-[10px] text-muted-foreground w-20 text-right">{s.active}/{s.allocated}</span>
              </motion.div>
            );
          })}
        </div>
      </Card>

      {selectedSchool && (
        <Card className="p-4 border-primary/30">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-foreground text-sm">{selectedSchool} — License Actions</h3>
            <Button variant="ghost" size="sm" onClick={() => setSelectedSchool(null)}>Close</Button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-1"><ArrowRightLeft className="h-3 w-3" />Reallocate Seats</Button>
            <Button variant="outline" size="sm">Request More</Button>
          </div>
        </Card>
      )}

      <Card className="p-3 border-amber-500/30 bg-amber-500/5">
        <p className="text-xs text-amber-600 dark:text-amber-400">⏰ License renewal in 87 days (June 4, 2026). Contact your account manager to discuss renewal terms.</p>
      </Card>
    </div>
  );
};

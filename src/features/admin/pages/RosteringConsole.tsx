import { ArrowLeft, RefreshCw, CheckCircle2, XCircle, AlertTriangle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useState } from "react";

interface Props { onBack: () => void; }

const connections = [
  { name: "Clever", lastSync: "Today, 2:14 AM", status: "success" as const, records: 8432, duration: "2m 14s" },
  { name: "ClassLink", lastSync: "Today, 2:15 AM", status: "warning" as const, records: 6210, duration: "3m 08s" },
  { name: "CSV Import", lastSync: "Mar 5, 2026", status: "failed" as const, records: 0, duration: "0m 42s" },
];

const syncHistory = Array.from({ length: 20 }, (_, i) => ({
  day: i + 1, status: Math.random() > 0.85 ? 'failed' : Math.random() > 0.75 ? 'warning' : 'success' as 'success' | 'warning' | 'failed',
}));

const conflicts = [
  { type: "Duplicate Student", detail: "John Smith (ID: 12345) exists in both Lincoln HS and Roosevelt MS", options: ["Merge", "Keep Both", "Ignore"] },
  { type: "Email Mismatch", detail: "Teacher maria.rodriguez@district.edu vs m.rodriguez@gmail.com", options: ["Use District", "Use Personal", "Flag for Review"] },
  { type: "Missing Teacher", detail: "Class 'AP Econ P3' has no assigned teacher in SIS data", options: ["Assign Manually", "Skip Class", "Contact SIS Admin"] },
];

const statusColors = { success: "bg-green-500", warning: "bg-amber-500", failed: "bg-red-500" };
const statusIcons = { success: CheckCircle2, warning: AlertTriangle, failed: XCircle };

export const RosteringConsole = ({ onBack }: Props) => {
  const [syncing, setSyncing] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack}><ArrowLeft className="h-5 w-5" /></Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Rostering Admin Console</h1>
          <p className="text-sm text-muted-foreground">Sync management, conflict resolution, and scheduling</p>
        </div>
      </div>

      {/* Connection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {connections.map((c, i) => {
          const Icon = statusIcons[c.status];
          return (
            <motion.div key={c.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="p-4 border-border/50">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-foreground text-sm">{c.name}</h3>
                  <Icon className={`h-4 w-4 ${c.status === 'success' ? 'text-green-500' : c.status === 'warning' ? 'text-amber-500' : 'text-red-400'}`} />
                </div>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <p>Last sync: {c.lastSync}</p>
                  <p>Records: {c.records.toLocaleString()}</p>
                  <p>Duration: {c.duration}</p>
                </div>
                <Button
                  variant="outline" size="sm" className="w-full mt-3 gap-1"
                  onClick={() => { setSyncing(c.name); setTimeout(() => setSyncing(null), 2000); }}
                  disabled={syncing === c.name}
                >
                  <RefreshCw className={`h-3 w-3 ${syncing === c.name ? 'animate-spin' : ''}`} />
                  {syncing === c.name ? 'Syncing...' : 'Sync Now'}
                </Button>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Sync Timeline */}
      <Card className="p-4 border-border/50">
        <h3 className="font-semibold text-foreground text-sm mb-3 flex items-center gap-2"><Clock className="h-4 w-4" />Sync Timeline (30 days)</h3>
        <div className="flex items-center gap-1">
          {syncHistory.map((s, i) => (
            <div key={i} className={`flex-1 h-6 rounded-sm ${statusColors[s.status]} cursor-pointer hover:opacity-80 transition-opacity`} title={`Day ${s.day}: ${s.status}`} />
          ))}
        </div>
        <div className="flex items-center gap-3 mt-2">
          {Object.entries(statusColors).map(([k, v]) => (
            <span key={k} className="flex items-center gap-1 text-[10px] text-muted-foreground"><div className={`w-2.5 h-2.5 rounded-sm ${v}`} />{k}</span>
          ))}
        </div>
      </Card>

      {/* Conflict Queue */}
      <Card className="p-4 border-border/50">
        <h3 className="font-semibold text-foreground text-sm mb-3 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          Conflict Resolution Queue ({conflicts.length})
        </h3>
        <div className="space-y-3">
          {conflicts.map((c, i) => (
            <motion.div key={i} className="p-3 rounded-lg border border-border/50 bg-muted/10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-foreground">{c.type}</span>
              </div>
              <p className="text-xs text-muted-foreground mb-2">{c.detail}</p>
              <div className="flex gap-1.5">
                {c.options.map(opt => (
                  <Button key={opt} variant="outline" size="sm" className="text-[10px] h-6 px-2">{opt}</Button>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
};

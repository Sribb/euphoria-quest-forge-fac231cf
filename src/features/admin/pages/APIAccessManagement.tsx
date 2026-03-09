import { ArrowLeft, Key, Plus, Copy, BarChart3, RefreshCw, Trash2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { motion } from "framer-motion";

interface Props { onBack: () => void; }

const apiKeys = [
  { name: "PowerBI Integration", createdBy: "J. Williams", created: "Jan 15, 2026", lastUsed: "2h ago", scopes: ["read-only", "analytics"], status: "active" as const },
  { name: "SIS Sync Key", createdBy: "A. Garcia", created: "Feb 3, 2026", lastUsed: "1d ago", scopes: ["rostering"], status: "active" as const },
  { name: "Old Test Key", createdBy: "M. Chen", created: "Nov 10, 2025", lastUsed: "45d ago", scopes: ["read-only"], status: "revoked" as const },
];

const endpoints = [
  { path: "/api/v1/students", calls: 12450, method: "GET" },
  { path: "/api/v1/progress", calls: 8920, method: "GET" },
  { path: "/api/v1/classes", calls: 6340, method: "GET" },
  { path: "/api/v1/assessments", calls: 4210, method: "GET" },
  { path: "/api/v1/roster/sync", calls: 890, method: "POST" },
];

const dailyCalls = Array.from({ length: 30 }, () => Math.round(Math.random() * 5000 + 500));

export const APIAccessManagement = ({ onBack }: Props) => {
  const [showCreate, setShowCreate] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack}><ArrowLeft className="h-5 w-5" /></Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">API Access Management</h1>
            <p className="text-sm text-muted-foreground">API keys, rate limits, usage logs, and BI integration</p>
          </div>
        </div>
        <Button size="sm" className="gap-1" onClick={() => setShowCreate(!showCreate)}><Plus className="h-3 w-3" />Generate Key</Button>
      </div>

      {showCreate && (
        <Card className="p-4 border-primary/30 bg-primary/5">
          <h3 className="font-semibold text-foreground text-sm mb-3">Generate New API Key</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div><Label className="text-xs">Key Name</Label><Input className="mt-1" placeholder="e.g., Tableau Dashboard" /></div>
            <div><Label className="text-xs">Rate Limit</Label><Input className="mt-1" placeholder="1000 calls/min" /></div>
          </div>
          <div className="mt-3">
            <Label className="text-xs">Permission Scopes</Label>
            <div className="flex gap-2 mt-1">
              {["Read-Only", "Analytics", "Rostering", "Full Access"].map(s => (
                <Button key={s} variant="outline" size="sm" className="text-[10px] h-6">{s}</Button>
              ))}
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <Button size="sm">Create Key</Button>
            <Button variant="ghost" size="sm" onClick={() => setShowCreate(false)}>Cancel</Button>
          </div>
        </Card>
      )}

      {/* Keys Table */}
      <Card className="border-border/50 overflow-hidden">
        <table className="w-full text-xs">
          <thead><tr className="border-b border-border/50 bg-muted/20">
            <th className="text-left p-3 font-medium text-muted-foreground">Name</th>
            <th className="text-center p-3 font-medium text-muted-foreground">Created By</th>
            <th className="text-center p-3 font-medium text-muted-foreground">Last Used</th>
            <th className="text-center p-3 font-medium text-muted-foreground">Scopes</th>
            <th className="text-center p-3 font-medium text-muted-foreground">Status</th>
            <th className="text-center p-3 font-medium text-muted-foreground">Actions</th>
          </tr></thead>
          <tbody>
            {apiKeys.map((k, i) => (
              <motion.tr key={k.name} className="border-b border-border/30" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}>
                <td className="p-3 font-medium text-foreground">{k.name}</td>
                <td className="p-3 text-center text-muted-foreground">{k.createdBy}</td>
                <td className="p-3 text-center text-muted-foreground">{k.lastUsed}</td>
                <td className="p-3 text-center"><div className="flex gap-1 justify-center flex-wrap">{k.scopes.map(s => <span key={s} className="px-1.5 py-0.5 rounded text-[9px] bg-muted/50 text-muted-foreground">{s}</span>)}</div></td>
                <td className="p-3 text-center"><span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${k.status === 'active' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-400'}`}>{k.status}</span></td>
                <td className="p-3 text-center flex gap-1 justify-center">
                  <Button variant="ghost" size="icon" className="h-6 w-6"><Copy className="h-3 w-3" /></Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6"><RefreshCw className="h-3 w-3" /></Button>
                  {k.status === 'active' && <Button variant="ghost" size="icon" className="h-6 w-6 text-red-400"><Trash2 className="h-3 w-3" /></Button>}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Usage Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-4 border-border/50">
          <h3 className="font-semibold text-foreground text-sm mb-3">API Calls (30 days)</h3>
          <div className="flex items-end gap-0.5 h-28">
            {dailyCalls.map((c, i) => (
              <div key={i} className="flex-1 rounded-t bg-primary/60 hover:bg-primary/80 transition-colors cursor-pointer" style={{ height: `${(c / 5500) * 100}%` }} title={`Day ${i + 1}: ${c} calls`} />
            ))}
          </div>
        </Card>
        <Card className="p-4 border-border/50">
          <h3 className="font-semibold text-foreground text-sm mb-3">Calls by Endpoint</h3>
          <div className="space-y-2">
            {endpoints.map(e => (
              <div key={e.path} className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-muted-foreground w-32 shrink-0 truncate">{e.path}</span>
                <div className="flex-1 h-3 rounded-full bg-muted/20 overflow-hidden">
                  <div className="h-full rounded-full bg-primary/60" style={{ width: `${(e.calls / endpoints[0].calls) * 100}%` }} />
                </div>
                <span className="text-xs font-bold text-foreground w-12 text-right">{(e.calls / 1000).toFixed(1)}k</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

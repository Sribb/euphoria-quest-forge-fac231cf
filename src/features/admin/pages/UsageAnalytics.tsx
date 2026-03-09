import { ArrowLeft, Clock, Monitor, Smartphone, Tablet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

interface Props { onBack: () => void; }

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const hours = Array.from({ length: 24 }, (_, i) => i);
const heatmapData = days.map(() => hours.map(() => Math.random()));

const features = [
  { name: "Lesson Viewer", time: 4820, users: 1180 },
  { name: "Trading Simulator", time: 2340, users: 890 },
  { name: "Games", time: 1560, users: 720 },
  { name: "Community Feed", time: 980, users: 540 },
  { name: "Daily Challenge", time: 760, users: 1050 },
  { name: "AI Assistant", time: 620, users: 380 },
];

const sessionDist = [
  { range: "<1 min", pct: 8 }, { range: "1-5 min", pct: 22 }, { range: "5-15 min", pct: 35 },
  { range: "15-30 min", pct: 24 }, { range: "30-60 min", pct: 8 }, { range: ">60 min", pct: 3 },
];

const devices = [
  { type: "Desktop", pct: 42, icon: Monitor }, { type: "Mobile", pct: 45, icon: Smartphone }, { type: "Tablet", pct: 13, icon: Tablet },
];

export const UsageAnalytics = ({ onBack }: Props) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack}><ArrowLeft className="h-5 w-5" /></Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Usage Analytics & Heatmaps</h1>
          <p className="text-sm text-muted-foreground">When, where, and how students engage</p>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList><TabsTrigger value="overview">Overview</TabsTrigger><TabsTrigger value="features">Feature Usage</TabsTrigger><TabsTrigger value="sessions">Sessions</TabsTrigger></TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4">
          <Card className="p-4 border-border/50">
            <h3 className="font-semibold text-foreground text-sm mb-3 flex items-center gap-2"><Clock className="h-4 w-4" />7×24 Activity Heatmap</h3>
            <div className="overflow-x-auto">
              <div className="min-w-[600px]">
                <div className="flex gap-1 mb-1 ml-10">
                  {[0,3,6,9,12,15,18,21].map(h => <span key={h} className="text-[9px] text-muted-foreground" style={{ width: `${100/8}%` }}>{h}:00</span>)}
                </div>
                {days.map((day, di) => (
                  <div key={day} className="flex items-center gap-1 mb-1">
                    <span className="text-[10px] text-muted-foreground w-8">{day}</span>
                    <div className="flex gap-0.5 flex-1">
                      {heatmapData[di].map((val, hi) => (
                        <div key={hi} className="flex-1 h-5 rounded-sm cursor-pointer hover:ring-1 hover:ring-primary/50" style={{ backgroundColor: `hsl(var(--primary) / ${0.05 + val * 0.95})` }} title={`${day} ${hi}:00 - ${Math.round(val * 150)} sessions`} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <span className="text-[10px] text-muted-foreground">Low</span>
              <div className="flex gap-0.5">{[0.1,0.3,0.5,0.7,0.9].map(v => <div key={v} className="w-4 h-2.5 rounded-sm" style={{ backgroundColor: `hsl(var(--primary) / ${v})` }} />)}</div>
              <span className="text-[10px] text-muted-foreground">High</span>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {devices.map(d => (
              <Card key={d.type} className="p-3 border-border/50 flex items-center gap-3">
                <d.icon className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-xs font-medium text-foreground">{d.type}</p>
                  <Progress value={d.pct} className="h-1.5 mt-1" />
                </div>
                <span className="text-sm font-bold text-foreground">{d.pct}%</span>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="features" className="space-y-4 mt-4">
          <Card className="p-4 border-border/50">
            <h3 className="font-semibold text-foreground text-sm mb-4">Feature Usage Ranking</h3>
            <div className="space-y-3">
              {features.map((f, i) => (
                <motion.div key={f.name} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-16 shrink-0">{f.name}</span>
                    <div className="flex-1 relative">
                      <div className="h-6 rounded bg-primary/20" style={{ width: `${(f.time / features[0].time) * 100}%` }}>
                        <div className="h-full rounded bg-primary/60" style={{ width: `${(f.users / features[0].users) * 100}%` }} />
                      </div>
                    </div>
                    <span className="text-xs text-foreground w-16 text-right">{(f.time / 60).toFixed(0)}h</span>
                    <span className="text-xs text-muted-foreground w-12 text-right">{f.users} users</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-4 mt-4">
          <Card className="p-4 border-border/50">
            <h3 className="font-semibold text-foreground text-sm mb-4">Session Duration Distribution</h3>
            <div className="flex items-end gap-2 h-40">
              {sessionDist.map((s, i) => (
                <motion.div key={s.range} className="flex-1 flex flex-col items-center gap-1" initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: i * 0.08 }} style={{ transformOrigin: 'bottom' }}>
                  <span className="text-xs font-bold text-foreground">{s.pct}%</span>
                  <div className="w-full rounded-t bg-primary/70" style={{ height: `${(s.pct / 35) * 100}%` }} />
                  <span className="text-[9px] text-muted-foreground text-center">{s.range}</span>
                </motion.div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

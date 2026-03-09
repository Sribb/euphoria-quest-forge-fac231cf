import { ArrowLeft, Megaphone, Send, Clock, Eye, Users, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { motion } from "framer-motion";

interface Props { onBack: () => void; }

const pastAnnouncements = [
  { title: "Spring Assessment Window Opens", urgency: "Featured", audience: "All District", date: "Mar 5", reads: 6420, readPct: 76 },
  { title: "New Trading Simulator Available", urgency: "Informational", audience: "Students Only", date: "Mar 1", reads: 4890, readPct: 62 },
  { title: "Professional Development Day - No Classes", urgency: "Urgent", audience: "Teachers Only", date: "Feb 28", reads: 41, readPct: 100 },
  { title: "Financial Literacy Month Activities", urgency: "Featured", audience: "All District", date: "Feb 15", reads: 5210, readPct: 68 },
];

const urgencyStyles = {
  Informational: "bg-muted/30 text-muted-foreground",
  Featured: "bg-primary/20 text-primary",
  Urgent: "bg-red-500/20 text-red-400",
};

export const DistrictAnnouncements = ({ onBack }: Props) => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [urgency, setUrgency] = useState("informational");
  const [audience, setAudience] = useState("all");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack}><ArrowLeft className="h-5 w-5" /></Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">District Announcements</h1>
          <p className="text-sm text-muted-foreground">Push targeted communications district-wide</p>
        </div>
      </div>

      <Tabs defaultValue="compose">
        <TabsList><TabsTrigger value="compose">Compose</TabsTrigger><TabsTrigger value="archive">Archive</TabsTrigger></TabsList>

        <TabsContent value="compose" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Composer */}
            <Card className="p-4 border-border/50 space-y-4">
              <div>
                <Label className="text-xs">Audience</Label>
                <Select value={audience} onValueChange={setAudience}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All District</SelectItem>
                    <SelectItem value="teachers">Teachers Only</SelectItem>
                    <SelectItem value="students">Students Only</SelectItem>
                    <SelectItem value="lincoln">Lincoln High School</SelectItem>
                    <SelectItem value="roosevelt">Roosevelt Middle</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Urgency</Label>
                <Select value={urgency} onValueChange={setUrgency}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="informational">Informational (subtle banner)</SelectItem>
                    <SelectItem value="featured">Featured (dashboard card)</SelectItem>
                    <SelectItem value="urgent">Urgent (modal on login)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Title</Label>
                <Input className="mt-1" value={title} onChange={e => setTitle(e.target.value)} placeholder="Announcement title..." />
              </div>
              <div>
                <Label className="text-xs">Body</Label>
                <Textarea className="mt-1 min-h-[120px]" value={body} onChange={e => setBody(e.target.value)} placeholder="Write your announcement..." />
              </div>
              <div className="flex gap-2">
                <Button className="gap-1"><Send className="h-3 w-3" />Send Now</Button>
                <Button variant="outline" className="gap-1"><Clock className="h-3 w-3" />Schedule</Button>
              </div>
            </Card>

            {/* Preview */}
            <Card className="p-4 border-border/50">
              <h3 className="font-semibold text-foreground text-sm mb-3 flex items-center gap-2"><Eye className="h-4 w-4" />Live Preview</h3>
              <div className={`p-4 rounded-xl border ${urgency === 'urgent' ? 'border-red-500/30 bg-red-500/5' : urgency === 'featured' ? 'border-primary/30 bg-primary/5' : 'border-border/50 bg-muted/20'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Megaphone className={`h-4 w-4 ${urgency === 'urgent' ? 'text-red-400' : 'text-primary'}`} />
                  <span className={`text-[10px] font-bold uppercase ${urgency === 'urgent' ? 'text-red-400' : 'text-primary'}`}>{urgency}</span>
                </div>
                <h4 className="font-semibold text-foreground text-sm">{title || "Announcement Title"}</h4>
                <p className="text-xs text-muted-foreground mt-1">{body || "Announcement body will appear here..."}</p>
                <div className="flex items-center gap-2 mt-3 text-[10px] text-muted-foreground">
                  <Users className="h-3 w-3" />{audience === 'all' ? 'All District' : audience}
                  <span>·</span>
                  <span>District Admin</span>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="archive" className="mt-4">
          <Card className="border-border/50 overflow-hidden">
            <table className="w-full text-xs">
              <thead><tr className="border-b border-border/50 bg-muted/20">
                <th className="text-left p-3 font-medium text-muted-foreground">Title</th>
                <th className="text-center p-3 font-medium text-muted-foreground">Urgency</th>
                <th className="text-center p-3 font-medium text-muted-foreground">Audience</th>
                <th className="text-center p-3 font-medium text-muted-foreground">Date</th>
                <th className="text-center p-3 font-medium text-muted-foreground">Reads</th>
                <th className="text-center p-3 font-medium text-muted-foreground">Read %</th>
              </tr></thead>
              <tbody>
                {pastAnnouncements.map((a, i) => (
                  <motion.tr key={i} className="border-b border-border/30" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}>
                    <td className="p-3 font-medium text-foreground">{a.title}</td>
                    <td className="p-3 text-center"><span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${urgencyStyles[a.urgency as keyof typeof urgencyStyles]}`}>{a.urgency}</span></td>
                    <td className="p-3 text-center text-muted-foreground">{a.audience}</td>
                    <td className="p-3 text-center text-muted-foreground">{a.date}</td>
                    <td className="p-3 text-center text-foreground">{a.reads.toLocaleString()}</td>
                    <td className="p-3 text-center font-bold text-foreground">{a.readPct}%</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

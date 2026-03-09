import { ArrowLeft, FileCheck, Clock, CheckCircle2, XCircle, RotateCcw, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { motion } from "framer-motion";

interface Props { onBack: () => void; }

interface ContentItem { id: number; title: string; submitter: string; type: string; date: string; tags: string[]; }

const pending: ContentItem[] = [
  { id: 1, title: "Cryptocurrency Safety Guide", submitter: "Mr. Thompson", type: "Lesson", date: "Mar 7", tags: ["Trading", "Grade 11"] },
  { id: 2, title: "Real Estate Investment Basics", submitter: "External: InvestEd", type: "Article", date: "Mar 6", tags: ["Alt Assets", "Grade 10"] },
  { id: 3, title: "Budget Challenge Simulation", submitter: "Ms. Garcia", type: "Simulation", date: "Mar 5", tags: ["Personal Finance", "Grade 9"] },
];

const inReview: ContentItem[] = [
  { id: 4, title: "Stock Market History Video", submitter: "External: FinVid", type: "Video", date: "Mar 4", tags: ["Investing", "Grade 10"] },
];

const approved: ContentItem[] = [
  { id: 5, title: "Compound Interest Calculator", submitter: "Dr. Patel", type: "Tool", date: "Mar 3", tags: ["Investing", "Grade 9"] },
  { id: 6, title: "Tax Filing Walkthrough", submitter: "Mrs. Johnson", type: "Lesson", date: "Mar 1", tags: ["Personal Finance", "Grade 12"] },
];

const rejected: ContentItem[] = [
  { id: 7, title: "Day Trading Strategies", submitter: "External: TradePro", type: "Article", date: "Feb 28", tags: ["Trading"] },
];

const columns = [
  { key: "pending", label: "Pending Review", items: pending, color: "border-amber-500/30" },
  { key: "review", label: "In Review", items: inReview, color: "border-blue-500/30" },
  { key: "approved", label: "Approved", items: approved, color: "border-green-500/30" },
  { key: "rejected", label: "Rejected", items: rejected, color: "border-red-500/30" },
];

export const ContentApproval = ({ onBack }: Props) => {
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack}><ArrowLeft className="h-5 w-5" /></Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Content Approval Workflow</h1>
          <p className="text-sm text-muted-foreground">Review, approve, and publish content</p>
        </div>
      </div>

      {/* Kanban */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {columns.map(col => (
          <div key={col.key}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase">{col.label}</h3>
              <span className="text-xs font-bold text-foreground">{col.items.length}</span>
            </div>
            <div className="space-y-2">
              {col.items.map((item, i) => {
                const isAging = col.key === 'pending' && i === 2;
                return (
                  <motion.div key={item.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                    <Card
                      className={`p-3 border ${col.color} cursor-pointer hover:shadow-md transition-all ${isAging ? 'ring-1 ring-amber-500/50' : ''}`}
                      onClick={() => setSelectedItem(item)}
                    >
                      {isAging && <span className="text-[9px] font-bold text-amber-500 mb-1 block">⏰ AGING — 5+ days</span>}
                      <p className="text-xs font-semibold text-foreground">{item.title}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{item.submitter} · {item.type}</p>
                      <p className="text-[10px] text-muted-foreground">{item.date}</p>
                      <div className="flex gap-1 mt-1.5 flex-wrap">
                        {item.tags.map(t => (
                          <span key={t} className="px-1.5 py-0.5 rounded text-[9px] bg-muted/50 text-muted-foreground">{t}</span>
                        ))}
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Review Panel */}
      {selectedItem && (
        <Card className="p-4 border-primary/30">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-semibold text-foreground">{selectedItem.title}</h3>
              <p className="text-xs text-muted-foreground">{selectedItem.submitter} · {selectedItem.type} · {selectedItem.date}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setSelectedItem(null)}>Close</Button>
          </div>
          <div className="p-6 rounded-lg bg-muted/20 border border-border/30 text-center text-sm text-muted-foreground mb-4">
            📄 Full content preview would render here exactly as students see it
          </div>
          <div className="flex gap-2">
            <Button size="sm" className="bg-green-600 hover:bg-green-700 gap-1"><CheckCircle2 className="h-3 w-3" />Approve</Button>
            <Button size="sm" variant="destructive" className="gap-1"><XCircle className="h-3 w-3" />Reject</Button>
            <Button size="sm" variant="outline" className="gap-1"><RotateCcw className="h-3 w-3" />Request Revision</Button>
            <Button size="sm" variant="outline" className="gap-1"><Eye className="h-3 w-3" />Full Preview</Button>
          </div>
        </Card>
      )}
    </div>
  );
};

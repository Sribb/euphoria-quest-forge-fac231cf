import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Users, UserPlus, Trash2, ArrowRightLeft, Search,
  Zap, Trophy, AlertTriangle, BookOpen, TrendingUp,
  Loader2, Mail, ChevronDown, ChevronUp
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { ClassWithMembers, ClassMember } from "../hooks/useClassManagement";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface RosterManagementPanelProps {
  activeClass: ClassWithMembers;
  allClasses: ClassWithMembers[];
  onRemoveStudent: (params: { memberId: string; studentId: string; studentName: string; classId: string; className: string }) => void;
  onRefresh: () => void;
}

type SortKey = "name" | "level" | "score" | "lessons" | "joined";

const getProgressStatus = (member: ClassMember) => {
  if (member.lessons_completed === 0 && member.avg_quiz_score === 0) return { label: "Not Started", color: "text-muted-foreground", bg: "bg-muted/40" };
  if (member.avg_quiz_score >= 80) return { label: "Excelling", color: "text-success", bg: "bg-success/10" };
  if (member.avg_quiz_score >= 50) return { label: "On Track", color: "text-primary", bg: "bg-primary/10" };
  if (member.avg_quiz_score > 0) return { label: "Needs Help", color: "text-warning", bg: "bg-warning/10" };
  return { label: "In Progress", color: "text-muted-foreground", bg: "bg-muted/40" };
};

export const RosterManagementPanel = ({ activeClass, allClasses, onRemoveStudent, onRefresh }: RosterManagementPanelProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortAsc, setSortAsc] = useState(true);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [addEmail, setAddEmail] = useState("");
  const [addLoading, setAddLoading] = useState(false);
  const [transferDialogOpen, setTransferDialogOpen] = useState(false);
  const [transferStudent, setTransferStudent] = useState<ClassMember | null>(null);
  const [transferTargetId, setTransferTargetId] = useState("");
  const [transferLoading, setTransferLoading] = useState(false);

  const otherClasses = allClasses.filter(c => c.id !== activeClass.id && !c.archived_at);

  // Filter & sort
  const filtered = activeClass.members.filter(m =>
    (m.display_name || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    let cmp = 0;
    switch (sortKey) {
      case "name": cmp = (a.display_name || "").localeCompare(b.display_name || ""); break;
      case "level": cmp = a.level - b.level; break;
      case "score": cmp = a.avg_quiz_score - b.avg_quiz_score; break;
      case "lessons": cmp = a.lessons_completed - b.lessons_completed; break;
      case "joined": cmp = new Date(a.joined_at).getTime() - new Date(b.joined_at).getTime(); break;
    }
    return sortAsc ? cmp : -cmp;
  });

  const handleAddByEmail = async () => {
    if (!addEmail.trim()) return;
    setAddLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("manage-roster", {
        body: { action: "add_by_email", email: addEmail.trim(), classId: activeClass.id },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      toast.success(`${data.studentName} added to ${activeClass.class_name}`);
      setAddEmail("");
      setAddDialogOpen(false);
      onRefresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to add student");
    } finally {
      setAddLoading(false);
    }
  };

  const handleTransfer = async () => {
    if (!transferStudent || !transferTargetId) return;
    setTransferLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("manage-roster", {
        body: {
          action: "transfer",
          classId: activeClass.id,
          studentId: transferStudent.student_id,
          memberId: transferStudent.id,
          targetClassId: transferTargetId,
        },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      const targetName = allClasses.find(c => c.id === transferTargetId)?.class_name || "class";
      toast.success(`${transferStudent.display_name} transferred to ${targetName}`);
      setTransferDialogOpen(false);
      setTransferStudent(null);
      setTransferTargetId("");
      onRefresh();
    } catch (err: any) {
      toast.error(err.message || "Transfer failed");
    } finally {
      setTransferLoading(false);
    }
  };

  const SortButton = ({ field, label }: { field: SortKey; label: string }) => (
    <button
      className={`flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider transition-colors ${sortKey === field ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
      onClick={() => { if (sortKey === field) setSortAsc(!sortAsc); else { setSortKey(field); setSortAsc(true); } }}
    >
      {label}
      {sortKey === field && (sortAsc ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
    </button>
  );

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 w-full sm:w-auto">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search students…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-muted/30 border-border/50 h-9"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5 h-9 border-border/50" onClick={() => setAddDialogOpen(true)}>
            <UserPlus className="w-4 h-4" />
            Add Student
          </Button>
        </div>
      </div>

      {/* Summary bar */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {activeClass.members.length} students</span>
        <span className="flex items-center gap-1 text-success">
          <Trophy className="w-3.5 h-3.5" /> {activeClass.members.filter(m => m.avg_quiz_score >= 80).length} excelling
        </span>
        <span className="flex items-center gap-1 text-warning">
          <AlertTriangle className="w-3.5 h-3.5" /> {activeClass.members.filter(m => m.avg_quiz_score > 0 && m.avg_quiz_score < 50).length} needs help
        </span>
      </div>

      {/* Table header */}
      {sorted.length > 0 && (
        <div className="hidden sm:grid grid-cols-12 gap-3 px-4 py-2">
          <div className="col-span-4"><SortButton field="name" label="Student" /></div>
          <div className="col-span-2 text-center"><SortButton field="level" label="Level" /></div>
          <div className="col-span-2 text-center"><SortButton field="lessons" label="Lessons" /></div>
          <div className="col-span-2 text-center"><SortButton field="score" label="Avg Score" /></div>
          <div className="col-span-2 text-right">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Actions</span>
          </div>
        </div>
      )}

      {/* Student rows */}
      <div className="space-y-1.5">
        <AnimatePresence>
          {sorted.map((member) => {
            const status = getProgressStatus(member);
            return (
              <motion.div
                key={member.id}
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="group grid grid-cols-1 sm:grid-cols-12 gap-3 items-center p-3 rounded-xl bg-muted/20 border border-border/50 hover:border-primary/30 hover:bg-muted/40 transition-all duration-200"
              >
                {/* Name + status */}
                <div className="col-span-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-primary flex items-center justify-center ring-2 ring-primary/20 shrink-0">
                    <span className="text-xs font-bold text-primary-foreground">
                      {(member.display_name || "S")[0].toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm truncate">{member.display_name || "Student"}</p>
                    <Badge variant="outline" className={`text-[9px] px-1.5 py-0 mt-0.5 ${status.color} border-current/20 ${status.bg}`}>
                      {status.label}
                    </Badge>
                  </div>
                </div>

                {/* Level */}
                <div className="col-span-2 text-center hidden sm:block">
                  <span className="flex items-center justify-center gap-1 text-sm font-medium">
                    <Zap className="w-3.5 h-3.5 text-primary" />
                    Lv.{member.level}
                  </span>
                  <p className="text-[10px] text-muted-foreground">{member.experience_points.toLocaleString()} XP</p>
                </div>

                {/* Lessons */}
                <div className="col-span-2 text-center hidden sm:block">
                  <span className="flex items-center justify-center gap-1 text-sm font-medium">
                    <BookOpen className="w-3.5 h-3.5 text-muted-foreground" />
                    {member.lessons_completed}
                  </span>
                </div>

                {/* Score */}
                <div className="col-span-2 text-center hidden sm:block">
                  <span className={`text-sm font-bold ${member.avg_quiz_score >= 80 ? "text-success" : member.avg_quiz_score > 0 && member.avg_quiz_score < 50 ? "text-warning" : "text-foreground"}`}>
                    {member.avg_quiz_score}%
                  </span>
                </div>

                {/* Actions */}
                <div className="col-span-2 flex items-center justify-end gap-1">
                  {otherClasses.length > 0 && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-7 h-7 text-muted-foreground hover:text-primary hover:bg-primary/10 opacity-0 group-hover:opacity-100 transition-all"
                            onClick={() => { setTransferStudent(member); setTransferDialogOpen(true); }}
                          >
                            <ArrowRightLeft className="w-3.5 h-3.5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent><p>Transfer to another class</p></TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-7 h-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-all"
                          onClick={() => onRemoveStudent({
                            memberId: member.id,
                            studentId: member.student_id,
                            studentName: member.display_name || "Student",
                            classId: activeClass.id,
                            className: activeClass.class_name,
                          })}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent><p>Remove from class</p></TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {sorted.length === 0 && activeClass.members.length > 0 && (
          <p className="text-sm text-muted-foreground text-center py-6">No students match "{searchQuery}"</p>
        )}

        {activeClass.members.length === 0 && (
          <div className="text-center py-12">
            <div className="w-14 h-14 rounded-2xl bg-muted/30 flex items-center justify-center mx-auto mb-4">
              <Users className="w-7 h-7 text-muted-foreground" />
            </div>
            <h4 className="font-semibold mb-1">No Students Yet</h4>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-4">
              Share class code <code className="font-mono text-primary font-bold">{activeClass.class_code}</code> or add students by email.
            </p>
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setAddDialogOpen(true)}>
              <UserPlus className="w-4 h-4" />
              Add Student
            </Button>
          </div>
        )}
      </div>

      {/* Add Student Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-primary" />
              Add Student to {activeClass.class_name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Add by Email</p>
              <p className="text-sm text-muted-foreground">Enter the student's registered email address to add them directly.</p>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="student@example.com"
                    type="email"
                    value={addEmail}
                    onChange={(e) => setAddEmail(e.target.value)}
                    className="pl-9 bg-muted/30 border-border/50"
                    onKeyDown={(e) => e.key === "Enter" && handleAddByEmail()}
                  />
                </div>
                <Button onClick={handleAddByEmail} disabled={addLoading || !addEmail.trim()} className="bg-gradient-primary">
                  {addLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add"}
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border/50" /></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">or</span></div>
            </div>
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Share Class Code</p>
              <p className="text-sm text-muted-foreground">
                Students can join by entering this code on their dashboard:
              </p>
              <div className="flex items-center justify-center gap-3 p-4 rounded-xl bg-muted/30 border border-border/50">
                <code className="text-2xl font-mono font-bold text-primary tracking-widest">{activeClass.class_code}</code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => { navigator.clipboard.writeText(activeClass.class_code); toast.success("Code copied!"); }}
                >
                  Copy
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Transfer Dialog */}
      <Dialog open={transferDialogOpen} onOpenChange={(open) => { setTransferDialogOpen(open); if (!open) { setTransferStudent(null); setTransferTargetId(""); } }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ArrowRightLeft className="w-5 h-5 text-primary" />
              Transfer Student
            </DialogTitle>
          </DialogHeader>
          {transferStudent && (
            <div className="space-y-4 pt-2">
              <div className="p-3 rounded-xl bg-muted/30 border border-border/50">
                <p className="text-sm font-semibold">{transferStudent.display_name}</p>
                <p className="text-xs text-muted-foreground">
                  From: <span className="font-medium text-foreground">{activeClass.class_name}</span>
                  {activeClass.period_block && <span> ({activeClass.period_block})</span>}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Transfer to</p>
                <Select value={transferTargetId} onValueChange={setTransferTargetId}>
                  <SelectTrigger className="bg-muted/30 border-border/50">
                    <SelectValue placeholder="Select destination class" />
                  </SelectTrigger>
                  <SelectContent>
                    {otherClasses.map(c => (
                      <SelectItem key={c.id} value={c.id}>
                        <span className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: c.display_color || "#6366f1" }} />
                          {c.class_name}
                          {c.period_block && <span className="text-muted-foreground text-xs">({c.period_block})</span>}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={handleTransfer}
                disabled={transferLoading || !transferTargetId}
                className="w-full bg-gradient-primary shadow-glow font-semibold h-11"
              >
                {transferLoading ? (
                  <div className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" />Transferring…</div>
                ) : "Transfer Student"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

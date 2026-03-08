import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  BookOpen, Calendar, Clock, Users, UserCheck,
  Trash2, Sparkles, Plus, CheckCircle2
} from "lucide-react";
import { useAssignments } from "../hooks/useAssignments";
import { AssignQuestDialog } from "./AssignQuestDialog";
import type { ClassWithMembers } from "../hooks/useClassManagement";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

interface AssignmentsPanelProps {
  classes: ClassWithMembers[];
}

export const AssignmentsPanel = ({ classes }: AssignmentsPanelProps) => {
  const { assignments, isLoading, createAssignment, deleteAssignment } = useAssignments();
  const [dialogOpen, setDialogOpen] = useState(false);

  const now = new Date();
  const active = assignments.filter(a => a.is_published && (!a.due_date || new Date(a.due_date) >= now));
  const scheduled = assignments.filter(a => !a.is_published && a.scheduled_at);
  const past = assignments.filter(a => a.due_date && new Date(a.due_date) < now && a.is_published);

  const getClassNames = (classIds: string[]) => {
    return classIds.map(id => classes.find(c => c.id === id)?.class_name).filter(Boolean).join(", ");
  };

  const AssignmentCard = ({ assignment }: { assignment: typeof assignments[0] }) => {
    const isOverdue = assignment.due_date && new Date(assignment.due_date) < now;
    const isScheduled = !assignment.is_published;

    return (
      <motion.div layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
        <div className="group flex items-start gap-3 p-3 rounded-xl bg-muted/20 border border-border/50 hover:border-primary/30 hover:bg-muted/40 transition-all duration-200">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
            <BookOpen className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-semibold text-sm truncate">{assignment.title}</p>
              {isScheduled && (
                <Badge variant="outline" className="text-[9px] px-1.5 py-0 border-muted-foreground/30">
                  <Clock className="w-2.5 h-2.5 mr-0.5" /> Scheduled
                </Badge>
              )}
              {isOverdue && (
                <Badge variant="outline" className="text-[9px] px-1.5 py-0 border-warning/40 text-warning">
                  Overdue
                </Badge>
              )}
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
              {assignment.lesson_title}
            </p>
            <div className="flex items-center gap-3 mt-1.5 text-[10px] text-muted-foreground">
              {assignment.target_type === "class" ? (
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {getClassNames(assignment.class_ids) || `${assignment.class_ids.length} classes`}
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <UserCheck className="w-3 h-3" />
                  {assignment.student_ids.length} students
                </span>
              )}
              {assignment.due_date && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Due {format(new Date(assignment.due_date), "MMM d")}
                </span>
              )}
              {isScheduled && assignment.scheduled_at && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Publishes {format(new Date(assignment.scheduled_at), "MMM d")}
                </span>
              )}
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                {assignment.completed_count}/{assignment.submission_count} done
              </span>
            </div>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-7 h-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-all shrink-0"
                  onClick={() => deleteAssignment.mutate(assignment.id)}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>Delete assignment</p></TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </motion.div>
    );
  };

  return (
    <Card className="border-border/50 bg-card/60 backdrop-blur-xl overflow-hidden">
      <div className="p-5 border-b border-border/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-bold text-sm">Quest Assignments</h3>
            <p className="text-[10px] text-muted-foreground">{active.length} active · {scheduled.length} scheduled</p>
          </div>
        </div>
        <Button size="sm" className="bg-gradient-primary gap-1.5 font-semibold" onClick={() => setDialogOpen(true)}>
          <Plus className="w-4 h-4" /> Assign Quest
        </Button>
      </div>

      <div className="p-5 space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : assignments.length === 0 ? (
          <div className="text-center py-10">
            <div className="w-14 h-14 rounded-2xl bg-muted/30 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-7 h-7 text-muted-foreground" />
            </div>
            <h4 className="font-semibold mb-1">No Assignments Yet</h4>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-4">
              Assign quests to your classes with just two clicks. Set due dates and schedule future assignments.
            </p>
            <Button size="sm" className="bg-gradient-primary gap-1.5" onClick={() => setDialogOpen(true)}>
              <Plus className="w-4 h-4" /> Create First Assignment
            </Button>
          </div>
        ) : (
          <>
            {active.length > 0 && (
              <div>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-2">Active</p>
                <div className="space-y-1.5">
                  <AnimatePresence>{active.map(a => <AssignmentCard key={a.id} assignment={a} />)}</AnimatePresence>
                </div>
              </div>
            )}
            {scheduled.length > 0 && (
              <div>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-2">Scheduled</p>
                <div className="space-y-1.5">
                  <AnimatePresence>{scheduled.map(a => <AssignmentCard key={a.id} assignment={a} />)}</AnimatePresence>
                </div>
              </div>
            )}
            {past.length > 0 && (
              <div>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-2">Past Due</p>
                <div className="space-y-1.5">
                  <AnimatePresence>{past.map(a => <AssignmentCard key={a.id} assignment={a} />)}</AnimatePresence>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <AssignQuestDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        classes={classes}
        onAssign={(input) => {
          createAssignment.mutate(input, { onSuccess: () => setDialogOpen(false) });
        }}
        isPending={createAssignment.isPending}
      />
    </Card>
  );
};

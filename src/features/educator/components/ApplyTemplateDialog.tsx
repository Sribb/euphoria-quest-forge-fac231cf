import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CalendarIcon, Loader2, Play, BookTemplate, Users, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, addDays } from "date-fns";
import type { AssignmentTemplate } from "../hooks/useAssignmentTemplates";
import type { ClassWithMembers } from "../hooks/useClassManagement";

interface ApplyTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: AssignmentTemplate;
  classes: ClassWithMembers[];
  onApply: (classIds: string[], startDate: Date) => void;
  isPending: boolean;
}

const DAY_LABELS: Record<string, string> = {
  monday: "Mon", tuesday: "Tue", wednesday: "Wed", thursday: "Thu", friday: "Fri",
};

export const ApplyTemplateDialog = ({
  open, onOpenChange, template, classes, onApply, isPending,
}: ApplyTemplateDialogProps) => {
  const [selectedClassIds, setSelectedClassIds] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);

  const toggleClass = (id: string) => {
    setSelectedClassIds(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
  };

  const totalWeeks = template.items.length > 0
    ? Math.max(...template.items.map(i => i.week_offset)) + 1
    : 0;

  const endDate = startDate ? addDays(startDate, totalWeeks * 7) : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Play className="w-5 h-5 text-primary" />
            Apply Template
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Template summary */}
          <div className="p-3 rounded-xl bg-muted/20 border border-border/50">
            <div className="flex items-center gap-2 mb-1">
              <BookTemplate className="w-4 h-4 text-primary" />
              <p className="font-semibold text-sm">{template.name}</p>
            </div>
            <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
              <span>{template.items.length} quests</span>
              <span>{totalWeeks} weeks</span>
              {template.meeting_days.length > 0 && (
                <span className="flex items-center gap-0.5">
                  <Clock className="w-3 h-3" /> {template.meeting_days.map(d => DAY_LABELS[d] || d).join(", ")}
                </span>
              )}
            </div>
          </div>

          {/* Start date */}
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              <CalendarIcon className="w-3 h-3" /> Start Date *
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn("w-full justify-start text-left font-normal h-10", !startDate && "text-muted-foreground")}>
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  {startDate ? format(startDate, "PPP") : "Pick a start date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
            {startDate && endDate && (
              <p className="text-[10px] text-muted-foreground">
                Assignments will span {format(startDate, "MMM d")} – {format(endDate, "MMM d, yyyy")}
              </p>
            )}
          </div>

          {/* Class selection */}
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              <Users className="w-3 h-3" /> Assign to Classes *
            </Label>
            <ScrollArea className="max-h-[200px]">
              <div className="space-y-1.5 pr-3">
                {classes.map(cls => {
                  const isChecked = selectedClassIds.includes(cls.id);
                  return (
                    <button
                      key={cls.id}
                      className={`w-full flex items-center gap-3 p-2.5 rounded-xl border transition-all ${
                        isChecked ? "border-primary/60 bg-primary/5" : "border-border/50 bg-muted/20 hover:bg-muted/40"
                      }`}
                      onClick={() => toggleClass(cls.id)}
                    >
                      <Checkbox checked={isChecked} className="pointer-events-none" />
                      <div className="w-2.5 h-6 rounded-full shrink-0" style={{ backgroundColor: cls.display_color || "#6366f1" }} />
                      <div className="text-left flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{cls.class_name}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {cls.period_block && `${cls.period_block} · `}{cls.member_count} students
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        </div>

        <div className="flex justify-end pt-3 border-t border-border/50">
          <Button
            onClick={() => startDate && onApply(selectedClassIds, startDate)}
            disabled={isPending || selectedClassIds.length === 0 || !startDate}
            className="bg-gradient-primary shadow-glow gap-1.5 font-semibold"
          >
            {isPending ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Applying…</>
            ) : (
              <><Play className="w-4 h-4" /> Apply to {selectedClassIds.length} Class{selectedClassIds.length !== 1 ? "es" : ""}</>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

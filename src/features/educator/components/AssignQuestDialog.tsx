import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen, CalendarIcon, Clock, Search, Users, UserCheck,
  Loader2, ChevronRight, Sparkles, CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import type { ClassWithMembers } from "../hooks/useClassManagement";
import type { CreateAssignmentInput } from "../hooks/useAssignments";
import { toast } from "sonner";

interface Lesson {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  pathway: string | null;
  duration_minutes: number;
}

interface AssignQuestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classes: ClassWithMembers[];
  onAssign: (input: CreateAssignmentInput) => void;
  isPending: boolean;
}

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: "text-success border-success/30 bg-success/10",
  intermediate: "text-primary border-primary/30 bg-primary/10",
  advanced: "text-warning border-warning/30 bg-warning/10",
};

const PATHWAY_LABELS: Record<string, string> = {
  investing: "Investing",
  trading: "Trading",
  "personal-finance": "Personal Finance",
  "corporate-finance": "Corporate Finance",
  economics: "Economics",
};

export const AssignQuestDialog = ({ open, onOpenChange, classes, onAssign, isPending }: AssignQuestDialogProps) => {
  // Step management
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1: quest selection
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [lessonsLoading, setLessonsLoading] = useState(false);
  const [questSearch, setQuestSearch] = useState("");
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  // Step 2: targeting
  const [targetType, setTargetType] = useState<"class" | "students">("class");
  const [selectedClassIds, setSelectedClassIds] = useState<string[]>([]);
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);

  // Step 3: details
  const [title, setTitle] = useState("");
  const [instructions, setInstructions] = useState("");
  const [dueDate, setDueDate] = useState<Date | undefined>();
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>();

  // Load lessons
  useEffect(() => {
    if (!open) return;
    setLessonsLoading(true);
    supabase
      .from("lessons")
      .select("id, title, description, difficulty, pathway, duration_minutes")
      .order("order_index", { ascending: true })
      .then(({ data }) => {
        setLessons((data as Lesson[]) || []);
        setLessonsLoading(false);
      });
  }, [open]);

  // Reset on close
  useEffect(() => {
    if (!open) {
      setStep(1);
      setSelectedLesson(null);
      setSelectedClassIds([]);
      setSelectedStudentIds([]);
      setTitle("");
      setInstructions("");
      setDueDate(undefined);
      setScheduledDate(undefined);
      setQuestSearch("");
      setTargetType("class");
    }
  }, [open]);

  // Auto-populate title when lesson selected
  useEffect(() => {
    if (selectedLesson && !title) {
      setTitle(selectedLesson.title);
    }
  }, [selectedLesson]);

  const filteredLessons = lessons.filter(l =>
    l.title.toLowerCase().includes(questSearch.toLowerCase()) ||
    l.description.toLowerCase().includes(questSearch.toLowerCase())
  );

  // Group by pathway
  const groupedLessons = filteredLessons.reduce<Record<string, Lesson[]>>((acc, l) => {
    const key = l.pathway || "other";
    if (!acc[key]) acc[key] = [];
    acc[key].push(l);
    return acc;
  }, {});

  const toggleClassId = (id: string) => {
    setSelectedClassIds(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
  };

  const toggleStudentId = (id: string) => {
    setSelectedStudentIds(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const selectAllClasses = () => {
    const activeIds = classes.filter(c => !c.archived_at).map(c => c.id);
    setSelectedClassIds(prev => prev.length === activeIds.length ? [] : activeIds);
  };

  const activeClasses = classes.filter(c => !c.archived_at);
  const allStudents = activeClasses
    .filter(c => selectedClassIds.length === 0 || selectedClassIds.includes(c.id))
    .flatMap(c => c.members.map(m => ({ ...m, className: c.class_name, classColor: c.display_color })));

  // Deduplicate students across classes
  const uniqueStudents = allStudents.filter((s, i, arr) => arr.findIndex(x => x.student_id === s.student_id) === i);

  const canProceedStep1 = !!selectedLesson;
  const canProceedStep2 = targetType === "class" ? selectedClassIds.length > 0 : selectedStudentIds.length > 0;
  const canSubmit = title.trim().length > 0;

  const handleSubmit = () => {
    if (!selectedLesson) return;
    onAssign({
      lessonId: selectedLesson.id,
      title: title.trim(),
      instructions: instructions.trim() || undefined,
      targetType,
      classIds: targetType === "class" ? selectedClassIds : [],
      studentIds: targetType === "students" ? selectedStudentIds : [],
      dueDate: dueDate?.toISOString() || null,
      scheduledAt: scheduledDate?.toISOString() || null,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            Assign Quest
          </DialogTitle>
        </DialogHeader>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-2">
          {[
            { num: 1, label: "Select Quest" },
            { num: 2, label: "Choose Target" },
            { num: 3, label: "Set Details" },
          ].map(({ num, label }, i) => (
            <div key={num} className="flex items-center gap-2">
              {i > 0 && <div className={`h-0.5 w-6 rounded ${step >= num ? "bg-primary" : "bg-border"}`} />}
              <Badge
                variant={step >= num ? "default" : "secondary"}
                className={`text-[10px] px-2 py-0.5 cursor-pointer ${step >= num ? "bg-primary text-primary-foreground" : ""}`}
                onClick={() => { if (num === 1 || (num === 2 && canProceedStep1) || (num === 3 && canProceedStep2)) setStep(num as 1 | 2 | 3); }}
              >
                {label}
              </Badge>
            </div>
          ))}
        </div>

        {/* STEP 1: Select Quest */}
        {step === 1 && (
          <div className="flex-1 overflow-hidden flex flex-col gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search quests…"
                value={questSearch}
                onChange={(e) => setQuestSearch(e.target.value)}
                className="pl-9 bg-muted/30 border-border/50"
              />
            </div>
            <ScrollArea className="flex-1 max-h-[400px]">
              {lessonsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : (
                <div className="space-y-4 pr-3">
                  {Object.entries(groupedLessons).map(([pathway, pLessons]) => (
                    <div key={pathway}>
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-2">
                        {PATHWAY_LABELS[pathway] || pathway}
                      </p>
                      <div className="space-y-1.5">
                        {pLessons.map(lesson => {
                          const isSelected = selectedLesson?.id === lesson.id;
                          return (
                            <button
                              key={lesson.id}
                              className={`w-full text-left p-3 rounded-xl border transition-all duration-200 ${
                                isSelected
                                  ? "border-primary/60 bg-primary/5 shadow-glow-soft"
                                  : "border-border/50 bg-muted/20 hover:border-primary/30 hover:bg-muted/40"
                              }`}
                              onClick={() => setSelectedLesson(lesson)}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 min-w-0">
                                  {isSelected && <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />}
                                  <p className="font-semibold text-sm truncate">{lesson.title}</p>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                  <Badge variant="outline" className={`text-[9px] ${DIFFICULTY_COLORS[lesson.difficulty] || ""}`}>
                                    {lesson.difficulty}
                                  </Badge>
                                  <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                                    <Clock className="w-3 h-3" /> {lesson.duration_minutes}m
                                  </span>
                                </div>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{lesson.description}</p>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                  {filteredLessons.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-8">No quests found</p>
                  )}
                </div>
              )}
            </ScrollArea>
            <div className="flex justify-end pt-2 border-t border-border/50">
              <Button onClick={() => setStep(2)} disabled={!canProceedStep1} className="bg-gradient-primary gap-1.5">
                Next <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2: Choose Target */}
        {step === 2 && (
          <div className="flex-1 overflow-hidden flex flex-col gap-3">
            <Tabs value={targetType} onValueChange={(v) => setTargetType(v as "class" | "students")}>
              <TabsList className="w-full">
                <TabsTrigger value="class" className="flex-1 gap-1.5">
                  <Users className="w-4 h-4" /> Assign to Classes
                </TabsTrigger>
                <TabsTrigger value="students" className="flex-1 gap-1.5">
                  <UserCheck className="w-4 h-4" /> Differentiate by Student
                </TabsTrigger>
              </TabsList>

              <TabsContent value="class" className="mt-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-muted-foreground">Select one or more classes</p>
                  <Button variant="ghost" size="sm" className="text-xs h-7" onClick={selectAllClasses}>
                    {selectedClassIds.length === activeClasses.length ? "Deselect All" : "Select All"}
                  </Button>
                </div>
                <ScrollArea className="max-h-[300px]">
                  <div className="space-y-1.5 pr-3">
                    {activeClasses.map(cls => {
                      const isChecked = selectedClassIds.includes(cls.id);
                      return (
                        <button
                          key={cls.id}
                          className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${
                            isChecked ? "border-primary/60 bg-primary/5" : "border-border/50 bg-muted/20 hover:bg-muted/40"
                          }`}
                          onClick={() => toggleClassId(cls.id)}
                        >
                          <Checkbox checked={isChecked} className="pointer-events-none" />
                          <div className="w-3 h-6 rounded-full shrink-0" style={{ backgroundColor: cls.display_color || "#6366f1" }} />
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
              </TabsContent>

              <TabsContent value="students" className="mt-3">
                <p className="text-xs text-muted-foreground mb-2">
                  Pick individual students for differentiated assignment
                </p>
                <ScrollArea className="max-h-[300px]">
                  <div className="space-y-1.5 pr-3">
                    {uniqueStudents.map(student => {
                      const isChecked = selectedStudentIds.includes(student.student_id);
                      return (
                        <button
                          key={student.student_id}
                          className={`w-full flex items-center gap-3 p-2.5 rounded-xl border transition-all ${
                            isChecked ? "border-primary/60 bg-primary/5" : "border-border/50 bg-muted/20 hover:bg-muted/40"
                          }`}
                          onClick={() => toggleStudentId(student.student_id)}
                        >
                          <Checkbox checked={isChecked} className="pointer-events-none" />
                          <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center shrink-0">
                            <span className="text-xs font-bold text-primary-foreground">
                              {(student.display_name || "S")[0].toUpperCase()}
                            </span>
                          </div>
                          <div className="text-left flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{student.display_name || "Student"}</p>
                            <p className="text-[10px] text-muted-foreground">
                              {student.className} · Lv.{student.level} · {student.avg_quiz_score}% avg
                            </p>
                          </div>
                        </button>
                      );
                    })}
                    {uniqueStudents.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-8">No students in your classes yet</p>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
            <div className="flex justify-between pt-2 border-t border-border/50">
              <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
              <Button onClick={() => setStep(3)} disabled={!canProceedStep2} className="bg-gradient-primary gap-1.5">
                Next <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: Details */}
        {step === 3 && (
          <div className="flex-1 flex flex-col gap-4">
            {/* Summary */}
            <div className="p-3 rounded-xl bg-muted/20 border border-border/50 flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-primary shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate">{selectedLesson?.title}</p>
                <p className="text-[10px] text-muted-foreground">
                  {targetType === "class"
                    ? `${selectedClassIds.length} class${selectedClassIds.length !== 1 ? "es" : ""}`
                    : `${selectedStudentIds.length} student${selectedStudentIds.length !== 1 ? "s" : ""}`
                  }
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Assignment Title *</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Complete Introduction to Investing"
                className="bg-muted/30 border-border/50"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Instructions (optional)</Label>
              <Textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="Any special instructions for students…"
                className="bg-muted/30 border-border/50 resize-none"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Due date */}
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  <CalendarIcon className="w-3 h-3" /> Due Date
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal h-10", !dueDate && "text-muted-foreground")}>
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      {dueDate ? format(dueDate, "PPP") : "No due date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dueDate}
                      onSelect={setDueDate}
                      disabled={(date) => date < new Date()}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
                {dueDate && (
                  <Button variant="ghost" size="sm" className="text-xs h-6 text-muted-foreground" onClick={() => setDueDate(undefined)}>
                    Clear
                  </Button>
                )}
              </div>

              {/* Schedule */}
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Schedule For
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal h-10", !scheduledDate && "text-muted-foreground")}>
                      <Clock className="w-4 h-4 mr-2" />
                      {scheduledDate ? format(scheduledDate, "PPP") : "Publish now"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={scheduledDate}
                      onSelect={setScheduledDate}
                      disabled={(date) => date < new Date()}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
                {scheduledDate && (
                  <Button variant="ghost" size="sm" className="text-xs h-6 text-muted-foreground" onClick={() => setScheduledDate(undefined)}>
                    Clear (publish now)
                  </Button>
                )}
              </div>
            </div>

            <div className="flex justify-between pt-2 border-t border-border/50 mt-auto">
              <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
              <Button
                onClick={handleSubmit}
                disabled={isPending || !canSubmit}
                className="bg-gradient-primary shadow-glow gap-1.5 font-semibold"
              >
                {isPending ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Assigning…</>
                ) : (
                  <><Sparkles className="w-4 h-4" /> Assign Quest</>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

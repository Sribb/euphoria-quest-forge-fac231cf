import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookTemplate, Plus, Trash2, Loader2, Search, Clock, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAssignmentTemplates, TemplateItem } from "../hooks/useAssignmentTemplates";

const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday"];
const DAY_LABELS: Record<string, string> = {
  monday: "Mon", tuesday: "Tue", wednesday: "Wed", thursday: "Thu", friday: "Fri",
};

interface Lesson {
  id: string;
  title: string;
  pathway: string | null;
  difficulty: string;
  duration_minutes: number;
}

interface SaveTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SaveTemplateDialog = ({ open, onOpenChange }: SaveTemplateDialogProps) => {
  const { createTemplate } = useAssignmentTemplates();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [templateType, setTemplateType] = useState<"custom" | "semester" | "year">("custom");
  const [meetingDays, setMeetingDays] = useState<string[]>(["monday", "wednesday", "friday"]);
  const [items, setItems] = useState<TemplateItem[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!open) return;
    supabase
      .from("lessons")
      .select("id, title, pathway, difficulty, duration_minutes")
      .order("order_index")
      .then(({ data }) => setLessons((data as Lesson[]) || []));
  }, [open]);

  useEffect(() => {
    if (!open) {
      setName(""); setDescription(""); setItems([]); setSearch("");
      setTemplateType("custom"); setMeetingDays(["monday", "wednesday", "friday"]);
    }
  }, [open]);

  const toggleDay = (day: string) => {
    setMeetingDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
  };

  const addItem = (lesson: Lesson) => {
    const nextWeek = items.length > 0 ? Math.max(...items.map(i => i.week_offset)) : 0;
    const dayIndex = items.length % meetingDays.length;
    setItems([...items, {
      lesson_id: lesson.id,
      title: lesson.title,
      week_offset: nextWeek + (dayIndex === 0 && items.length > 0 ? 1 : 0),
      day_of_week: meetingDays[dayIndex] || "monday",
    }]);
  };

  const removeItem = (idx: number) => {
    setItems(items.filter((_, i) => i !== idx));
  };

  const filteredLessons = lessons.filter(l =>
    l.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = () => {
    if (!name.trim() || items.length === 0) return;
    createTemplate.mutate({
      name: name.trim(),
      description: description.trim() || undefined,
      templateType,
      meetingDays,
      items,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookTemplate className="w-5 h-5 text-primary" />
            Create Assignment Template
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-auto space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Template Name *</Label>
              <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Semester 1 Investing" className="bg-muted/30 border-border/50" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Type</Label>
              <Select value={templateType} onValueChange={v => setTemplateType(v as any)}>
                <SelectTrigger className="bg-muted/30 border-border/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="custom">Custom Sequence</SelectItem>
                  <SelectItem value="semester">Semester Pacing Guide</SelectItem>
                  <SelectItem value="year">Year-Long Pacing Guide</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Description</Label>
            <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="What does this template cover?" className="bg-muted/30 border-border/50 resize-none" rows={2} />
          </div>

          {/* Meeting Days */}
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" /> Class Meeting Days
            </Label>
            <div className="flex gap-2">
              {DAYS.map(day => (
                <button
                  key={day}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    meetingDays.includes(day)
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/30 text-muted-foreground hover:bg-muted/50"
                  }`}
                  onClick={() => toggleDay(day)}
                >
                  {DAY_LABELS[day]}
                </button>
              ))}
            </div>
          </div>

          {/* Quest sequence builder */}
          <div className="grid grid-cols-2 gap-4">
            {/* Quest picker */}
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Add Quests</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search quests…" className="pl-8 h-8 text-xs bg-muted/30 border-border/50" />
              </div>
              <ScrollArea className="h-[200px] border border-border/30 rounded-lg">
                <div className="p-1.5 space-y-1">
                  {filteredLessons.map(l => (
                    <button
                      key={l.id}
                      className="w-full text-left p-2 rounded-lg hover:bg-muted/40 transition-colors text-xs"
                      onClick={() => addItem(l)}
                    >
                      <p className="font-medium truncate">{l.title}</p>
                      <p className="text-[10px] text-muted-foreground">{l.pathway} · {l.difficulty} · {l.duration_minutes}m</p>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Sequence */}
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                Sequence ({items.length} quests)
              </Label>
              <ScrollArea className="h-[250px] border border-border/30 rounded-lg">
                {items.length === 0 ? (
                  <div className="flex items-center justify-center h-full p-6">
                    <p className="text-xs text-muted-foreground text-center">Add quests from the left to build your sequence</p>
                  </div>
                ) : (
                  <div className="p-1.5 space-y-1">
                    {items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-muted/20 border border-border/30">
                        <Badge variant="secondary" className="text-[9px] shrink-0 w-6 h-5 flex items-center justify-center p-0">
                          {idx + 1}
                        </Badge>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate">{item.title}</p>
                          <p className="text-[10px] text-muted-foreground">
                            Wk {item.week_offset + 1} · {DAY_LABELS[item.day_of_week]}
                          </p>
                        </div>
                        <Button variant="ghost" size="icon" className="h-5 w-5 text-muted-foreground hover:text-destructive" onClick={() => removeItem(idx)}>
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-3 border-t border-border/50">
          <Button
            onClick={handleSave}
            disabled={!name.trim() || items.length === 0 || createTemplate.isPending}
            className="bg-gradient-primary gap-1.5 font-semibold"
          >
            {createTemplate.isPending ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
            ) : (
              <><Sparkles className="w-4 h-4" /> Save Template</>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

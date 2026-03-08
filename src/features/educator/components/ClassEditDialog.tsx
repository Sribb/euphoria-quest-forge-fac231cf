import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Palette, Settings } from "lucide-react";
import type { ClassWithMembers } from "../hooks/useClassManagement";

const CLASS_COLORS = [
  "#6366f1", "#8b5cf6", "#ec4899", "#f43f5e",
  "#f97316", "#eab308", "#22c55e", "#14b8a6",
  "#06b6d4", "#3b82f6", "#64748b", "#78716c",
];

const ALL_GRADES = ["K", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th", "11th", "12th"];

const PERIODS = ["1st Period", "2nd Period", "3rd Period", "4th Period", "5th Period", "6th Period", "7th Period", "8th Period", "Block A", "Block B", "Block C", "Block D", "Homeroom", "Advisory"];

interface ClassEditDialogProps {
  cls: ClassWithMembers;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (classId: string, updates: Record<string, any>) => void;
  isPending: boolean;
}

export const ClassEditDialog = ({ cls, open, onOpenChange, onSave, isPending }: ClassEditDialogProps) => {
  const [name, setName] = useState(cls.class_name);
  const [description, setDescription] = useState(cls.description || "");
  const [periodBlock, setPeriodBlock] = useState(cls.period_block || "");
  const [displayColor, setDisplayColor] = useState(cls.display_color || "#6366f1");
  const [gradeLevel, setGradeLevel] = useState(cls.grade_level || "");
  const [maxStudents, setMaxStudents] = useState(String(cls.max_students || 30));

  useEffect(() => {
    setName(cls.class_name);
    setDescription(cls.description || "");
    setPeriodBlock(cls.period_block || "");
    setDisplayColor(cls.display_color || "#6366f1");
    setGradeLevel(cls.grade_level || "");
    setMaxStudents(String(cls.max_students || 30));
  }, [cls]);

  const handleSave = () => {
    onSave(cls.id, {
      class_name: name,
      description: description || null,
      period_block: periodBlock || null,
      display_color: displayColor,
      grade_level: gradeLevel || null,
      max_students: parseInt(maxStudents) || null,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" />
            Edit Class
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Class Name *</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} className="bg-muted/30 border-border/50" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Description</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} className="bg-muted/30 border-border/50 resize-none" rows={2} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Period / Block</Label>
              <Select value={periodBlock} onValueChange={setPeriodBlock}>
                <SelectTrigger className="bg-muted/30 border-border/50">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {PERIODS.map((p) => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Grade Level</Label>
              <Select value={gradeLevel} onValueChange={setGradeLevel}>
                <SelectTrigger className="bg-muted/30 border-border/50">
                  <SelectValue placeholder="Select grade" />
                </SelectTrigger>
                <SelectContent>
                  {ALL_GRADES.map((g) => (
                    <SelectItem key={g} value={g}>{g} Grade</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Max Students</Label>
            <Input type="number" value={maxStudents} onChange={(e) => setMaxStudents(e.target.value)} className="bg-muted/30 border-border/50" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5" /> Class Color
            </Label>
            <div className="flex flex-wrap gap-2">
              {CLASS_COLORS.map((color) => (
                <button
                  key={color}
                  className={`w-8 h-8 rounded-lg transition-all duration-200 ${displayColor === color ? "ring-2 ring-offset-2 ring-offset-background ring-primary scale-110" : "hover:scale-105"}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setDisplayColor(color)}
                />
              ))}
            </div>
          </div>
          <Button onClick={handleSave} disabled={isPending || !name.trim()} className="w-full bg-gradient-primary shadow-glow font-semibold h-11">
            {isPending ? "Saving…" : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { School, Plus, Users } from "lucide-react";
import type { ClassWithMembers } from "../hooks/useClassManagement";

interface ClassAssignmentStepProps {
  classes: ClassWithMembers[];
  studentCount: number;
  onConfirm: (classId: string | null, newClassInfo?: { name: string; description: string; maxStudents: number }) => void;
  onBack: () => void;
}

export const ClassAssignmentStep = ({
  classes,
  studentCount,
  onConfirm,
  onBack,
}: ClassAssignmentStepProps) => {
  const [mode, setMode] = useState<"existing" | "new">(classes.length > 0 ? "existing" : "new");
  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || "");
  const [newClassName, setNewClassName] = useState("");
  const [newClassDescription, setNewClassDescription] = useState("");
  const [newMaxStudents, setNewMaxStudents] = useState("50");

  const handleConfirm = () => {
    if (mode === "existing") {
      onConfirm(selectedClassId);
    } else {
      if (!newClassName.trim()) return;
      onConfirm(null, {
        name: newClassName.trim(),
        description: newClassDescription.trim(),
        maxStudents: parseInt(newMaxStudents) || 50,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <School className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-bold">Assign to Class</h3>
          <p className="text-sm text-muted-foreground">
            Where should these {studentCount} students be added?
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          variant={mode === "existing" ? "default" : "outline"}
          className={mode === "existing" ? "bg-gradient-primary" : ""}
          onClick={() => setMode("existing")}
          disabled={classes.length === 0}
        >
          <Users className="w-4 h-4 mr-2" />
          Existing Class
        </Button>
        <Button
          variant={mode === "new" ? "default" : "outline"}
          className={mode === "new" ? "bg-gradient-primary" : ""}
          onClick={() => setMode("new")}
        >
          <Plus className="w-4 h-4 mr-2" />
          New Class
        </Button>
      </div>

      {mode === "existing" && classes.length > 0 && (
        <RadioGroup value={selectedClassId} onValueChange={setSelectedClassId}>
          <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
            {classes.map((cls) => (
              <label
                key={cls.id}
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  selectedClassId === cls.id
                    ? "border-primary/60 bg-primary/5"
                    : "border-border/50 hover:border-primary/30"
                }`}
              >
                <RadioGroupItem value={cls.id} />
                <div className="flex-1">
                  <p className="font-semibold text-sm">{cls.class_name}</p>
                  <p className="text-xs text-muted-foreground">
                    Code: {cls.class_code} · {cls.member_count} students
                  </p>
                </div>
              </label>
            ))}
          </div>
        </RadioGroup>
      )}

      {mode === "new" && (
        <Card className="p-4 space-y-4 border-border/50 bg-muted/10">
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">
              Class Name *
            </Label>
            <Input
              placeholder="e.g. Personal Finance — Period 3"
              value={newClassName}
              onChange={(e) => setNewClassName(e.target.value)}
              className="bg-background/50"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">
              Description
            </Label>
            <Textarea
              placeholder="Optional description…"
              value={newClassDescription}
              onChange={(e) => setNewClassDescription(e.target.value)}
              className="bg-background/50 resize-none"
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">
              Max Students
            </Label>
            <Input
              type="number"
              value={newMaxStudents}
              onChange={(e) => setNewMaxStudents(e.target.value)}
              className="bg-background/50 w-28"
            />
          </div>
        </Card>
      )}

      <div className="flex items-center justify-between pt-2">
        <Button variant="outline" onClick={onBack}>
          ← Back
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={mode === "new" && !newClassName.trim()}
          className="bg-gradient-primary shadow-glow"
        >
          Import {studentCount} Students
        </Button>
      </div>
    </div>
  );
};

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle, CheckCircle2, Edit2, Users, XCircle } from "lucide-react";
import type { RosterStudent } from "./types";

interface ValidationPreviewStepProps {
  students: RosterStudent[];
  fileName: string;
  onUpdate: (students: RosterStudent[]) => void;
  onConfirm: () => void;
  onBack: () => void;
}

export const ValidationPreviewStep = ({
  students,
  fileName,
  onUpdate,
  onConfirm,
  onBack,
}: ValidationPreviewStepProps) => {
  const [editingRow, setEditingRow] = useState<number | null>(null);

  const errorCount = students.filter((s) => s.errors.length > 0).length;
  const duplicateCount = students.filter((s) => s.isDuplicate).length;
  const validCount = students.filter((s) => s.errors.length === 0).length;

  const handleCellEdit = (
    rowIndex: number,
    field: keyof RosterStudent,
    value: string
  ) => {
    const updated = students.map((s) => {
      if (s.rowIndex !== rowIndex) return s;
      const newStudent = { ...s, [field]: value };
      // Re-validate
      const errors: string[] = [];
      if (!newStudent.firstName) errors.push("First Name is required");
      if (!newStudent.lastName) errors.push("Last Name is required");
      if (
        newStudent.email &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newStudent.email)
      ) {
        errors.push("Invalid email format");
      }
      newStudent.errors = errors;
      return newStudent;
    });
    onUpdate(updated);
  };

  const removeRow = (rowIndex: number) => {
    onUpdate(students.filter((s) => s.rowIndex !== rowIndex));
  };

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="flex flex-wrap items-center gap-3">
        <Badge variant="secondary" className="gap-1.5 px-3 py-1">
          <Users className="w-3.5 h-3.5" />
          {students.length} students from {fileName}
        </Badge>
        {validCount > 0 && (
          <Badge className="bg-success/10 text-success border-success/20 gap-1.5 px-3 py-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {validCount} valid
          </Badge>
        )}
        {errorCount > 0 && (
          <Badge variant="destructive" className="gap-1.5 px-3 py-1">
            <XCircle className="w-3.5 h-3.5" />
            {errorCount} with errors
          </Badge>
        )}
        {duplicateCount > 0 && (
          <Badge className="bg-warning/10 text-warning border-warning/20 gap-1.5 px-3 py-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            {duplicateCount} possible duplicates
          </Badge>
        )}
      </div>

      {/* Table */}
      <ScrollArea className="h-[400px] rounded-lg border border-border/50">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-muted/80 backdrop-blur-sm z-10">
            <tr>
              <th className="text-left px-3 py-2.5 font-semibold text-xs uppercase tracking-wider text-muted-foreground w-10">
                #
              </th>
              <th className="text-left px-3 py-2.5 font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                First Name *
              </th>
              <th className="text-left px-3 py-2.5 font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                Last Name *
              </th>
              <th className="text-left px-3 py-2.5 font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                Email
              </th>
              <th className="text-left px-3 py-2.5 font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                Student ID
              </th>
              <th className="text-left px-3 py-2.5 font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                Class/Period
              </th>
              <th className="text-left px-3 py-2.5 font-semibold text-xs uppercase tracking-wider text-muted-foreground w-10">
                Status
              </th>
              <th className="w-16" />
            </tr>
          </thead>
          <tbody>
            {students.map((student) => {
              const hasError = student.errors.length > 0;
              const isEditing = editingRow === student.rowIndex;

              return (
                <tr
                  key={student.rowIndex}
                  className={`border-b border-border/30 transition-colors ${
                    hasError
                      ? "bg-destructive/5 hover:bg-destructive/10"
                      : student.isDuplicate
                      ? "bg-warning/5 hover:bg-warning/10"
                      : "hover:bg-muted/30"
                  }`}
                >
                  <td className="px-3 py-2 text-muted-foreground text-xs">
                    {student.rowIndex}
                  </td>
                  {(["firstName", "lastName", "email", "studentId", "classPeriod"] as const).map(
                    (field) => (
                      <td key={field} className="px-3 py-2">
                        {isEditing ? (
                          <Input
                            value={student[field]}
                            onChange={(e) =>
                              handleCellEdit(student.rowIndex, field, e.target.value)
                            }
                            className="h-7 text-sm bg-background/50"
                          />
                        ) : (
                          <span
                            className={
                              !student[field] &&
                              (field === "firstName" || field === "lastName")
                                ? "text-destructive italic"
                                : ""
                            }
                          >
                            {student[field] || (
                              field === "firstName" || field === "lastName" ? (
                                <span className="text-destructive text-xs">
                                  Missing
                                </span>
                              ) : (
                                <span className="text-muted-foreground/40">—</span>
                              )
                            )}
                          </span>
                        )}
                      </td>
                    )
                  )}
                  <td className="px-3 py-2">
                    {hasError ? (
                      <XCircle className="w-4 h-4 text-destructive" />
                    ) : student.isDuplicate ? (
                      <AlertTriangle className="w-4 h-4 text-warning" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-success" />
                    )}
                  </td>
                  <td className="px-2 py-2">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() =>
                          setEditingRow(isEditing ? null : student.rowIndex)
                        }
                        className="p-1 rounded hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
                        title={isEditing ? "Done editing" : "Edit row"}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => removeRow(student.rowIndex)}
                        className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                        title="Remove row"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </ScrollArea>

      {/* Error details */}
      {errorCount > 0 && (
        <div className="rounded-lg bg-destructive/5 border border-destructive/20 p-3">
          <p className="text-sm font-medium text-destructive mb-1">
            {errorCount} row{errorCount > 1 ? "s" : ""} need attention
          </p>
          <p className="text-xs text-muted-foreground">
            Click the edit icon to fix errors, or remove invalid rows before
            continuing.
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-2">
        <Button variant="outline" onClick={onBack}>
          ← Back
        </Button>
        <Button
          onClick={onConfirm}
          disabled={validCount === 0}
          className="bg-gradient-primary shadow-glow gap-2"
        >
          Continue with {validCount} student{validCount !== 1 ? "s" : ""}
        </Button>
      </div>
    </div>
  );
};

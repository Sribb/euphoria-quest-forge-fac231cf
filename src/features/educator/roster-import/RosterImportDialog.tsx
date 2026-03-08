import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useClassManagement } from "../hooks/useClassManagement";
import { toast } from "sonner";
import { FileUploadStep } from "./FileUploadStep";
import { ValidationPreviewStep } from "./ValidationPreviewStep";
import { ClassAssignmentStep } from "./ClassAssignmentStep";
import { ImportResultsStep } from "./ImportResultsStep";
import type { RosterStudent, ImportResult, ImportStep } from "./types";

export const RosterImportDialog = () => {
  const { user } = useAuth();
  const { classes, createClass } = useClassManagement();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<ImportStep>("upload");
  const [students, setStudents] = useState<RosterStudent[]>([]);
  const [fileName, setFileName] = useState("");
  const [results, setResults] = useState<ImportResult[]>([]);
  const [classCode, setClassCode] = useState("");
  const [importProgress, setImportProgress] = useState(0);

  const validStudents = students.filter((s) => s.errors.length === 0);

  const reset = () => {
    setStep("upload");
    setStudents([]);
    setFileName("");
    setResults([]);
    setClassCode("");
    setImportProgress(0);
  };

  const handleParsed = (parsed: RosterStudent[], name: string) => {
    setStudents(parsed);
    setFileName(name);
    setStep("preview");
  };

  const handleConfirmPreview = () => {
    setStep("assign");
  };

  const handleImport = async (
    classId: string | null,
    newClassInfo?: { name: string; description: string; maxStudents: number }
  ) => {
    if (!user?.id) return;
    setStep("importing");

    try {
      let targetClassId = classId;
      let targetClassCode = "";

      // Create new class if needed
      if (!targetClassId && newClassInfo) {
        const result = await createClass.mutateAsync({
          className: newClassInfo.name,
          description: newClassInfo.description || undefined,
          maxStudents: newClassInfo.maxStudents,
        });
        // Refetch to get the new class
        const { data: newClass } = await supabase
          .from("classes")
          .select("id, class_code")
          .eq("educator_id", user.id)
          .eq("class_name", newClassInfo.name)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (newClass) {
          targetClassId = newClass.id;
          targetClassCode = newClass.class_code;
        }
      } else if (targetClassId) {
        const cls = classes.find((c) => c.id === targetClassId);
        targetClassCode = cls?.class_code || "";
      }

      setClassCode(targetClassCode);

      // Call edge function to bulk create students
      const { data, error } = await supabase.functions.invoke("bulk-create-students", {
        body: {
          students: validStudents.map((s) => ({
            firstName: s.firstName,
            lastName: s.lastName,
            email: s.email || null,
            studentId: s.studentId || null,
          })),
          classId: targetClassId,
          classCode: targetClassCode,
          educatorId: user.id,
        },
      });

      if (error) throw error;
      setResults(data.results || []);
      setStep("results");

      const successCount = (data.results || []).filter((r: ImportResult) => r.success).length;
      toast.success(`${successCount} student accounts created!`);
    } catch (err: any) {
      toast.error(`Import failed: ${err.message}`);
      setStep("assign");
    }
  };

  const stepLabels: Record<ImportStep, string> = {
    upload: "Upload File",
    preview: "Review Data",
    assign: "Assign Class",
    importing: "Creating Accounts…",
    results: "Complete",
  };

  const stepOrder: ImportStep[] = ["upload", "preview", "assign", "importing", "results"];
  const currentStepIndex = stepOrder.indexOf(step);

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        setOpen(val);
        if (!val) reset();
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 border-border/50">
          <Upload className="w-4 h-4" />
          Import Roster
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Upload className="w-5 h-5 text-primary" />
            Import Student Roster
          </DialogTitle>
        </DialogHeader>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-4">
          {stepOrder.slice(0, -1).map((s, i) => {
            if (s === "importing") return null;
            const isActive = currentStepIndex >= i;
            return (
              <div key={s} className="flex items-center gap-2">
                {i > 0 && (
                  <div
                    className={`h-0.5 w-6 rounded ${
                      isActive ? "bg-primary" : "bg-border"
                    }`}
                  />
                )}
                <Badge
                  variant={isActive ? "default" : "secondary"}
                  className={`text-[10px] px-2 py-0.5 ${
                    isActive ? "bg-primary text-primary-foreground" : ""
                  }`}
                >
                  {stepLabels[s]}
                </Badge>
              </div>
            );
          })}
        </div>

        {/* Steps */}
        {step === "upload" && <FileUploadStep onParsed={handleParsed} />}

        {step === "preview" && (
          <ValidationPreviewStep
            students={students}
            fileName={fileName}
            onUpdate={setStudents}
            onConfirm={handleConfirmPreview}
            onBack={() => setStep("upload")}
          />
        )}

        {step === "assign" && (
          <ClassAssignmentStep
            classes={classes}
            studentCount={validStudents.length}
            onConfirm={handleImport}
            onBack={() => setStep("preview")}
          />
        )}

        {step === "importing" && (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <p className="text-lg font-semibold">Creating student accounts…</p>
            <p className="text-sm text-muted-foreground">
              Setting up {validStudents.length} accounts and generating credentials
            </p>
          </div>
        )}

        {step === "results" && (
          <ImportResultsStep
            results={results}
            classCode={classCode}
            onDone={() => {
              setOpen(false);
              reset();
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

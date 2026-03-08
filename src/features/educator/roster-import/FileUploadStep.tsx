import { useCallback, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, FileSpreadsheet, Download, FileText, Loader2 } from "lucide-react";
import { generateCSVTemplate, generateXLSXTemplate, parseRosterFile } from "./parseRosterFile";
import type { RosterStudent } from "./types";

interface FileUploadStepProps {
  onParsed: (students: RosterStudent[], fileName: string) => void;
}

export const FileUploadStep = ({ onParsed }: FileUploadStepProps) => {
  const [dragOver, setDragOver] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);
      setParsing(true);
      try {
        const students = await parseRosterFile(file);
        onParsed(students, file.name);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setParsing(false);
      }
    },
    [onParsed]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const downloadCSV = () => {
    const csv = generateCSVTemplate();
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "euphoria_roster_template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadXLSX = () => {
    const blob = generateXLSXTemplate();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "euphoria_roster_template.xlsx";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Templates */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          1. Download a template
        </h3>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2" onClick={downloadCSV}>
            <FileText className="w-4 h-4" />
            CSV Template
            <Download className="w-3 h-3 text-muted-foreground" />
          </Button>
          <Button variant="outline" className="gap-2" onClick={downloadXLSX}>
            <FileSpreadsheet className="w-4 h-4" />
            Excel Template
            <Download className="w-3 h-3 text-muted-foreground" />
          </Button>
        </div>
      </div>

      {/* Drop zone */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          2. Upload your roster
        </h3>
        <Card
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className={`relative p-10 border-2 border-dashed cursor-pointer transition-all duration-300 text-center ${
            dragOver
              ? "border-primary bg-primary/5 scale-[1.01]"
              : "border-border/50 bg-muted/10 hover:border-primary/40 hover:bg-muted/20"
          }`}
        >
          {parsing ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
              <p className="text-sm text-muted-foreground">Parsing file…</p>
            </div>
          ) : (
            <>
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Upload className="w-7 h-7 text-primary" />
              </div>
              <p className="font-semibold mb-1">
                {dragOver ? "Drop file here" : "Drag & drop your roster file"}
              </p>
              <p className="text-sm text-muted-foreground">
                or click to browse · Accepts <strong>.csv</strong> and{" "}
                <strong>.xlsx</strong>
              </p>
            </>
          )}
          <input
            ref={inputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
              e.target.value = "";
            }}
          />
        </Card>
        {error && (
          <p className="text-sm text-destructive mt-2 flex items-center gap-1">
            ⚠ {error}
          </p>
        )}
      </div>
    </div>
  );
};

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle2, XCircle, Printer, Download, QrCode, Link2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import type { ImportResult } from "./types";

interface ImportResultsStepProps {
  results: ImportResult[];
  classCode: string;
  onDone: () => void;
}

export const ImportResultsStep = ({ results, classCode, onDone }: ImportResultsStepProps) => {
  const printRef = useRef<HTMLDivElement>(null);
  const successCount = results.filter((r) => r.success).length;
  const failCount = results.filter((r) => !r.success).length;

  const handlePrint = () => {
    const printContent = printRef.current;
    if (!printContent) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Student Login Credentials — Euphoria</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; padding: 20px; }
          .page-title { text-align: center; margin-bottom: 20px; font-size: 18px; }
          .subtitle { text-align: center; margin-bottom: 30px; color: #666; font-size: 13px; }
          .credentials-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
          .credential-card {
            border: 2px solid #e5e5e5; border-radius: 12px; padding: 16px;
            page-break-inside: avoid; break-inside: avoid;
          }
          .student-name { font-weight: 700; font-size: 16px; margin-bottom: 8px; }
          .info-row { display: flex; justify-content: space-between; font-size: 12px; margin: 4px 0; }
          .info-label { color: #888; }
          .info-value { font-weight: 600; font-family: monospace; }
          .qr-section { text-align: center; margin-top: 12px; padding-top: 12px; border-top: 1px dashed #ddd; }
          .qr-label { font-size: 10px; color: #888; margin-top: 6px; }
          .class-code { text-align: center; font-size: 24px; font-weight: 800; letter-spacing: 3px; margin: 8px 0; color: #7c3aed; }
          @media print { .no-print { display: none; } }
        </style>
      </head>
      <body>
        <h1 class="page-title">🎓 Euphoria — Student Login Credentials</h1>
        <p class="subtitle">Class Code: <span class="class-code">${classCode}</span></p>
        <div class="credentials-grid">
          ${results
            .filter((r) => r.success)
            .map(
              (r) => `
            <div class="credential-card">
              <div class="student-name">${r.displayName}</div>
              <div class="info-row"><span class="info-label">Username:</span><span class="info-value">${r.username}</span></div>
              <div class="info-row"><span class="info-label">Password:</span><span class="info-value">${r.password}</span></div>
              <div class="info-row"><span class="info-label">Class Code:</span><span class="info-value">${classCode}</span></div>
              <div class="qr-section">
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(r.joinLink)}" width="80" height="80" />
                <div class="qr-label">Scan to join</div>
              </div>
            </div>
          `
            )
            .join("")}
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const downloadCSV = () => {
    const headers = "Name,Username,Password,Join Link,Class Code";
    const rows = results
      .filter((r) => r.success)
      .map(
        (r) =>
          `"${r.displayName}","${r.username}","${r.password}","${r.joinLink}","${classCode}"`
      );
    const csv = [headers, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `euphoria_credentials_${classCode}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      {/* Summary */}
      <div className="flex flex-wrap items-center gap-3">
        {successCount > 0 && (
          <Badge className="bg-success/10 text-success border-success/20 gap-1.5 px-3 py-1.5 text-sm">
            <CheckCircle2 className="w-4 h-4" />
            {successCount} accounts created
          </Badge>
        )}
        {failCount > 0 && (
          <Badge variant="destructive" className="gap-1.5 px-3 py-1.5 text-sm">
            <XCircle className="w-4 h-4" />
            {failCount} failed
          </Badge>
        )}
        <Badge variant="secondary" className="gap-1.5 px-3 py-1.5">
          Class Code: <code className="font-mono font-bold ml-1">{classCode}</code>
        </Badge>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2">
        <Button onClick={handlePrint} className="gap-2">
          <Printer className="w-4 h-4" />
          Print Credentials
        </Button>
        <Button variant="outline" onClick={downloadCSV} className="gap-2">
          <Download className="w-4 h-4" />
          Download CSV
        </Button>
      </div>

      {/* Results table */}
      <ScrollArea className="h-[350px] rounded-lg border border-border/50" ref={printRef}>
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-muted/80 backdrop-blur-sm z-10">
            <tr>
              <th className="text-left px-3 py-2.5 font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                Student
              </th>
              <th className="text-left px-3 py-2.5 font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                Username
              </th>
              <th className="text-left px-3 py-2.5 font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                Password
              </th>
              <th className="text-left px-3 py-2.5 font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                Join Link / QR
              </th>
              <th className="text-left px-3 py-2.5 font-semibold text-xs uppercase tracking-wider text-muted-foreground w-16">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {results.map((r, i) => (
              <tr
                key={i}
                className={`border-b border-border/30 ${
                  r.success ? "hover:bg-muted/30" : "bg-destructive/5"
                }`}
              >
                <td className="px-3 py-2.5 font-medium">{r.displayName}</td>
                <td className="px-3 py-2.5 font-mono text-xs">{r.username}</td>
                <td className="px-3 py-2.5 font-mono text-xs">
                  {r.success ? r.password : "—"}
                </td>
                <td className="px-3 py-2">
                  {r.success ? (
                    <div className="flex items-center gap-2">
                      <QRCodeSVG value={r.joinLink} size={36} />
                      <button
                        className="text-xs text-primary hover:underline flex items-center gap-1"
                        onClick={() => navigator.clipboard.writeText(r.joinLink)}
                        title="Copy join link"
                      >
                        <Link2 className="w-3 h-3" />
                        Copy link
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-destructive">{r.error}</span>
                  )}
                </td>
                <td className="px-3 py-2">
                  {r.success ? (
                    <CheckCircle2 className="w-4 h-4 text-success" />
                  ) : (
                    <XCircle className="w-4 h-4 text-destructive" />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </ScrollArea>

      <div className="flex justify-end pt-2">
        <Button onClick={onDone} className="bg-gradient-primary shadow-glow">
          Done
        </Button>
      </div>
    </div>
  );
};

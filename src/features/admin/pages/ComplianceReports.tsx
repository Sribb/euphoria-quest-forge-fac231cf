import { ArrowLeft, FileText, Download, CheckCircle2, AlertTriangle, XCircle, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { motion } from "framer-motion";

interface Props { onBack: () => void; }

const ferpaChecklist = [
  { req: "Annual FERPA notification to parents", status: "compliant" as const },
  { req: "Directory information opt-out process", status: "compliant" as const },
  { req: "Legitimate educational interest documentation", status: "compliant" as const },
  { req: "Data access logging enabled", status: "compliant" as const },
  { req: "Records retention policy enforced", status: "attention" as const },
  { req: "Breach notification procedures documented", status: "compliant" as const },
];

const coppaChecklist = [
  { req: "Verifiable parental consent collected", status: "compliant" as const },
  { req: "No behavioral advertising to under-13", status: "compliant" as const },
  { req: "Data minimization practices in place", status: "compliant" as const },
  { req: "Parental access/deletion mechanism", status: "attention" as const },
];

const dpaStatus = [
  { vendor: "Euphoria Platform", status: "signed", expires: "Jun 2027" },
  { vendor: "Google Workspace", status: "signed", expires: "Dec 2026" },
  { vendor: "Clever SSO", status: "signed", expires: "Aug 2026" },
  { vendor: "ClassLink", status: "expired", expires: "Jan 2026" },
  { vendor: "Zoom", status: "unsigned", expires: "N/A" },
];

const statusIcon = { compliant: CheckCircle2, attention: AlertTriangle, "non-compliant": XCircle };
const statusColor = { compliant: "text-green-500", attention: "text-amber-500", "non-compliant": "text-red-400" };
const dpaColors = { signed: "bg-green-500/20 text-green-500", expired: "bg-red-500/20 text-red-400", unsigned: "bg-amber-500/20 text-amber-500" };

export const ComplianceReports = ({ onBack }: Props) => {
  const [reportType, setReportType] = useState("ferpa");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack}><ArrowLeft className="h-5 w-5" /></Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Compliance Report Generator</h1>
          <p className="text-sm text-muted-foreground">FERPA audit documentation, data access logs, and DPA status</p>
        </div>
      </div>

      <Tabs defaultValue="dashboard">
        <TabsList><TabsTrigger value="dashboard">Dashboard</TabsTrigger><TabsTrigger value="generate">Generate Report</TabsTrigger></TabsList>

        <TabsContent value="dashboard" className="mt-4 space-y-4">
          {/* FERPA */}
          <Card className="p-4 border-border/50">
            <h3 className="font-semibold text-foreground text-sm mb-3 flex items-center gap-2"><Shield className="h-4 w-4 text-primary" />FERPA Compliance</h3>
            <div className="space-y-2">
              {ferpaChecklist.map(item => {
                const Icon = statusIcon[item.status];
                return (
                  <div key={item.req} className="flex items-center gap-2">
                    <Icon className={`h-4 w-4 shrink-0 ${statusColor[item.status]}`} />
                    <span className="text-xs text-foreground">{item.req}</span>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* COPPA */}
          <Card className="p-4 border-border/50">
            <h3 className="font-semibold text-foreground text-sm mb-3 flex items-center gap-2"><Shield className="h-4 w-4 text-primary" />COPPA Compliance</h3>
            <div className="space-y-2">
              {coppaChecklist.map(item => {
                const Icon = statusIcon[item.status];
                return (
                  <div key={item.req} className="flex items-center gap-2">
                    <Icon className={`h-4 w-4 shrink-0 ${statusColor[item.status]}`} />
                    <span className="text-xs text-foreground">{item.req}</span>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* DPA Status */}
          <Card className="p-4 border-border/50">
            <h3 className="font-semibold text-foreground text-sm mb-3">DPA Status Tracker</h3>
            <div className="space-y-2">
              {dpaStatus.map(d => (
                <div key={d.vendor} className="flex items-center gap-3 p-2 rounded-lg border border-border/30">
                  <span className="text-xs font-medium text-foreground flex-1">{d.vendor}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${dpaColors[d.status as keyof typeof dpaColors]}`}>{d.status}</span>
                  <span className="text-[10px] text-muted-foreground w-16 text-right">{d.expires}</span>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="generate" className="mt-4">
          <Card className="p-5 border-border/50 space-y-4">
            <h3 className="font-semibold text-foreground text-sm">Generate Compliance Report</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs">Report Type</Label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ferpa">FERPA Audit Package</SelectItem>
                    <SelectItem value="dpa">DPA Status Report</SelectItem>
                    <SelectItem value="retention">Data Retention Report</SelectItem>
                    <SelectItem value="access">User Access Log</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Scope</Label>
                <Select defaultValue="district">
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="district">Entire District</SelectItem>
                    <SelectItem value="lincoln">Lincoln High</SelectItem>
                    <SelectItem value="roosevelt">Roosevelt Middle</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs">Date Range Start</Label>
                <input type="date" className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-xs" />
              </div>
              <div>
                <Label className="text-xs">Date Range End</Label>
                <input type="date" className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-xs" />
              </div>
            </div>
            <Button className="gap-1"><Download className="h-4 w-4" />Generate Report</Button>
            <p className="text-[10px] text-muted-foreground">Reports include a cover page with district name, report type, date range, generating admin, and timestamp.</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

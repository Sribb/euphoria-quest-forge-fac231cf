import { format } from "date-fns";
import { Download, Plus, FileText, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DpaRecord } from "../hooks/useDpaRecords";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Props {
  records: DpaRecord[];
  isLoading: boolean;
  onNewDpa: () => void;
}

const statusBadge = (status: string) => {
  const styles: Record<string, string> = {
    generated: "bg-primary/10 text-primary",
    sent: "bg-warning/10 text-warning-foreground",
    signed: "bg-success/10 text-success",
  };
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${styles[status] || styles.generated}`}>
      {status}
    </span>
  );
};

export const DpaDashboard = ({ records, isLoading, onNewDpa }: Props) => {
  const handleDownload = async (record: DpaRecord) => {
    if (!record.pdf_url) {
      toast.error("PDF not available for this record.");
      return;
    }
    const { data, error } = await supabase.storage
      .from("dpa-documents")
      .createSignedUrl(record.pdf_url, 300);
    if (error || !data?.signedUrl) {
      toast.error("Failed to generate download link.");
      return;
    }
    window.open(data.signedUrl, "_blank");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Your DPA Records</h2>
          <p className="text-sm text-muted-foreground mt-1">View and manage your Data Processing Agreements.</p>
        </div>
        <Button onClick={onNewDpa} className="gap-2">
          <Plus className="w-4 h-4" /> Generate New DPA
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center text-muted-foreground py-12">Loading…</div>
      ) : records.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border/60 rounded-xl">
          <FileText className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-muted-foreground font-medium">No DPAs generated yet</p>
          <p className="text-sm text-muted-foreground/70 mt-1 mb-4">
            Generate your first DPA in under 5 minutes.
          </p>
          <Button onClick={onNewDpa} variant="outline" className="gap-2">
            <Plus className="w-4 h-4" /> Get Started
          </Button>
        </div>
      ) : (
        <div className="border border-border/50 rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead>District Name</TableHead>
                <TableHead>State</TableHead>
                <TableHead>Generated</TableHead>
                <TableHead>Term</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.district_name}</TableCell>
                  <TableCell>{r.state}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {format(new Date(r.generated_at), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>{r.term_years} yr</TableCell>
                  <TableCell>{statusBadge(r.status)}</TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="ghost" className="gap-1.5" onClick={() => handleDownload(r)}>
                      <Download className="w-3.5 h-3.5" /> PDF
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

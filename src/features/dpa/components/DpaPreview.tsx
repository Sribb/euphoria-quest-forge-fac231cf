import { useState } from "react";
import { ArrowLeft, Download, FileCheck, Loader2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { format, addYears } from "date-fns";
import { toast } from "sonner";
import { DpaFormData, useCreateDpaRecord } from "../hooks/useDpaRecords";
import { generateDpaPdf } from "../utils/generateDpaPdf";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import {
  STATE_ADDENDA,
  EXHIBIT_A_DATA_ELEMENTS,
  EXHIBIT_B_SECURITY,
  EXHIBIT_C_SUBPROCESSORS,
} from "../data/dpaContent";

interface Props {
  formData: DpaFormData;
  onBack: () => void;
  onComplete: () => void;
}

export const DpaPreview = ({ formData, onBack, onComplete }: Props) => {
  const { user } = useAuth();
  const createRecord = useCreateDpaRecord();
  const [saving, setSaving] = useState(false);
  const addendum = STATE_ADDENDA[formData.state];
  const startDate = new Date(formData.contract_start_date);
  const endDate = addYears(startDate, formData.term_years);

  const handleDownload = async () => {
    setSaving(true);
    try {
      const blob = generateDpaPdf(formData);

      // Upload to storage
      const fileName = `${user!.id}/dpa-${formData.district_name.replace(/\s+/g, "-").toLowerCase()}-${Date.now()}.pdf`;
      const { error: uploadError } = await supabase.storage
        .from("dpa-documents")
        .upload(fileName, blob, { contentType: "application/pdf" });

      if (uploadError) throw uploadError;

      // Save record
      await createRecord.mutateAsync({
        ...formData,
        pdf_url: fileName,
      });

      // Trigger browser download
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `DPA-${formData.district_name.replace(/\s+/g, "-")}.pdf`;
      a.click();
      URL.revokeObjectURL(url);

      toast.success("DPA generated and saved successfully!");
      onComplete();
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to save DPA: " + (err.message || "Unknown error"));
    } finally {
      setSaving(false);
    }
  };

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-foreground mb-2 uppercase tracking-wider">{title}</h3>
      <div className="text-sm text-muted-foreground leading-relaxed">{children}</div>
    </div>
  );

  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6 text-sm">
        <ArrowLeft className="w-4 h-4" /> Back to form
      </button>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground">DPA Preview</h2>
          <p className="text-sm text-muted-foreground mt-1">Review your agreement, then download the PDF.</p>
        </div>
        <Button onClick={handleDownload} disabled={saving} className="gap-2">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          {saving ? "Generating…" : "Download PDF & Save"}
        </Button>
      </div>

      {/* State addendum indicator */}
      {addendum && (
        <div className="mb-6 p-3 rounded-lg bg-primary/5 border border-primary/20 flex items-start gap-3">
          <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-foreground">State-specific addendum included</p>
            <p className="text-muted-foreground">{addendum.title} — {addendum.summary}</p>
          </div>
        </div>
      )}

      {/* Preview Card */}
      <Card className="p-8 bg-card/80 backdrop-blur-sm border-border/50 space-y-0">
        <div className="text-center mb-8">
          <h2 className="text-lg font-bold text-foreground">DATA PROCESSING AGREEMENT</h2>
          <p className="text-xs text-muted-foreground mt-1">Generated {format(new Date(), "MMMM d, yyyy")}</p>
        </div>

        <Section title="Parties">
          <p className="mb-2"><strong className="text-foreground">District:</strong> {formData.district_name}<br />{formData.district_address}<br />Signatory: {formData.signatory_name}, {formData.signatory_title}</p>
          <p><strong className="text-foreground">Provider:</strong> Euphoria Education, Inc.<br />123 Learning Lane, Suite 400, San Francisco, CA 94105<br />Representative: Sarah Chen, Chief Privacy Officer</p>
        </Section>

        <Section title="1. Term">
          <p>{format(startDate, "MMMM d, yyyy")} — {format(endDate, "MMMM d, yyyy")} ({formData.term_years}-year term). Covers approximately {formData.student_count.toLocaleString()} students.</p>
        </Section>

        <Section title="2. Purpose & Scope">
          <p>Provider processes student data solely to deliver Euphoria's financial literacy platform. <em className="text-foreground/60">This means we only use student data for teaching, not advertising or anything else.</em></p>
        </Section>

        <Section title="3. Provider Obligations">
          <ul className="list-disc pl-5 space-y-1">
            <li>Process data only per District instructions</li>
            <li>Staff bound by confidentiality</li>
            <li>Security measures per Exhibit B</li>
            <li>No sub-processing without authorization (see Exhibit C)</li>
            <li>Delete all data on contract end within 30 days</li>
          </ul>
        </Section>

        <Section title="4. FERPA Compliance">
          <p>Provider designated as "school official" under FERPA with legitimate educational interest. <em className="text-foreground/60">This means we're treated like a school employee when it comes to student records.</em></p>
        </Section>

        <Section title="5. Breach Notification">
          <p>72-hour notification, full written report within 10 business days. <em className="text-foreground/60">If anything goes wrong, we tell you fast and work with you to fix it.</em></p>
        </Section>

        <Section title="Exhibit A — Data Elements">
          {EXHIBIT_A_DATA_ELEMENTS.map((g) => (
            <div key={g.category} className="mb-3">
              <p className="font-medium text-foreground text-xs">{g.category} <span className="font-normal text-muted-foreground">— {g.purpose}</span></p>
              <ul className="list-disc pl-5 text-xs">
                {g.elements.map((e) => <li key={e}>{e}</li>)}
              </ul>
            </div>
          ))}
        </Section>

        <Section title="Exhibit B — Security Practices">
          {EXHIBIT_B_SECURITY.map((s) => (
            <div key={s.title} className="mb-2">
              <p className="font-medium text-foreground text-xs">{s.title}</p>
              <p className="text-xs">{s.description}</p>
            </div>
          ))}
        </Section>

        <Section title="Exhibit C — Sub-Processors">
          <div className="grid gap-2">
            {EXHIBIT_C_SUBPROCESSORS.map((sp) => (
              <div key={sp.name} className="text-xs p-2 rounded bg-muted/30">
                <span className="font-medium text-foreground">{sp.name}</span> — {sp.service} ({sp.location})
              </div>
            ))}
          </div>
        </Section>

        {addendum && (
          <Section title={`State Addendum — ${formData.state}`}>
            <p className="mb-2 text-xs font-medium text-foreground">{addendum.title}</p>
            <ul className="list-disc pl-5 text-xs space-y-1">
              {addendum.clauses.map((c, i) => <li key={i}>{c}</li>)}
            </ul>
          </Section>
        )}

        <Section title="Signatures">
          <div className="grid md:grid-cols-2 gap-6 pt-2">
            <div>
              <p className="text-xs font-medium text-foreground mb-2">Euphoria Education, Inc.</p>
              <p className="italic text-base text-foreground">Sarah Chen</p>
              <p className="text-xs mt-1">Chief Privacy Officer</p>
              <p className="text-xs">Date: {format(new Date(), "MMMM d, yyyy")}</p>
              <div className="flex items-center gap-1.5 mt-2 text-xs text-success">
                <FileCheck className="w-3.5 h-3.5" /> Pre-signed
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-foreground mb-2">{formData.district_name}</p>
              <div className="border-b border-border w-48 h-8" />
              <p className="text-xs mt-1">{formData.signatory_name}, {formData.signatory_title}</p>
              <p className="text-xs text-muted-foreground/60">Date: ____________________</p>
            </div>
          </div>
        </Section>
      </Card>

      <div className="mt-6 flex justify-end">
        <Button onClick={handleDownload} disabled={saving} className="gap-2">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          {saving ? "Generating…" : "Download PDF & Save"}
        </Button>
      </div>
    </div>
  );
};

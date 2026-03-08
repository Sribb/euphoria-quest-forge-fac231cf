import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { US_STATES, STATE_ADDENDA } from "../data/dpaContent";
import { DpaFormData } from "../hooks/useDpaRecords";

interface Props {
  onSubmit: (data: DpaFormData) => void;
  onBack: () => void;
}

export const DpaForm = ({ onSubmit, onBack }: Props) => {
  const today = new Date().toISOString().split("T")[0];
  const [form, setForm] = useState<DpaFormData>({
    district_name: "",
    district_address: "",
    signatory_name: "",
    signatory_title: "",
    signatory_email: "",
    state: "",
    student_count: 100,
    term_years: 1,
    contract_start_date: today,
  });

  const update = (field: keyof DpaFormData, value: string | number) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const isValid =
    form.district_name &&
    form.district_address &&
    form.signatory_name &&
    form.signatory_title &&
    form.signatory_email &&
    form.state &&
    form.student_count > 0;

  const addendum = STATE_ADDENDA[form.state];

  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6 text-sm">
        <ArrowLeft className="w-4 h-4" /> Back to dashboard
      </button>

      <div className="flex items-center gap-3 mb-1">
        <h2 className="text-xl font-semibold text-foreground">Generate a New DPA</h2>
      </div>
      <p className="text-sm text-muted-foreground mb-8">
        Fill out your district information below. Most districts complete this in <strong className="text-foreground">under 5 minutes</strong>.
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        {/* District Name */}
        <div className="md:col-span-2 space-y-2">
          <Label htmlFor="district_name">District Legal Name</Label>
          <Input id="district_name" placeholder="e.g. Springfield Unified School District" value={form.district_name} onChange={(e) => update("district_name", e.target.value)} />
        </div>

        {/* District Address */}
        <div className="md:col-span-2 space-y-2">
          <Label htmlFor="district_address">District Address</Label>
          <Input id="district_address" placeholder="123 Main St, Springfield, IL 62701" value={form.district_address} onChange={(e) => update("district_address", e.target.value)} />
        </div>

        {/* Signatory Name */}
        <div className="space-y-2">
          <Label htmlFor="signatory_name">Authorized Signatory Name</Label>
          <Input id="signatory_name" placeholder="Dr. Jane Smith" value={form.signatory_name} onChange={(e) => update("signatory_name", e.target.value)} />
        </div>

        {/* Signatory Title */}
        <div className="space-y-2">
          <Label htmlFor="signatory_title">Signatory Title</Label>
          <Input id="signatory_title" placeholder="Superintendent" value={form.signatory_title} onChange={(e) => update("signatory_title", e.target.value)} />
        </div>

        {/* Signatory Email */}
        <div className="space-y-2">
          <Label htmlFor="signatory_email">Signatory Email</Label>
          <Input id="signatory_email" type="email" placeholder="jsmith@springfield.k12.us" value={form.signatory_email} onChange={(e) => update("signatory_email", e.target.value)} />
        </div>

        {/* State */}
        <div className="space-y-2">
          <Label>State</Label>
          <Select value={form.state} onValueChange={(v) => update("state", v)}>
            <SelectTrigger><SelectValue placeholder="Select state…" /></SelectTrigger>
            <SelectContent>
              {US_STATES.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            {addendum
              ? `✓ State-specific addendum will be included: ${addendum.title}`
              : form.state
              ? "No state-specific addendum required — base SDPC template applies."
              : "State determines which addenda are appended to the DPA."}
          </p>
        </div>

        {/* Student Count */}
        <div className="space-y-2">
          <Label htmlFor="student_count">Number of Students Covered</Label>
          <Input id="student_count" type="number" min={1} value={form.student_count} onChange={(e) => update("student_count", parseInt(e.target.value) || 0)} />
        </div>

        {/* Term */}
        <div className="space-y-2">
          <Label>Contract Term</Label>
          <Select value={String(form.term_years)} onValueChange={(v) => update("term_years", parseInt(v))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 Year</SelectItem>
              <SelectItem value="2">2 Years</SelectItem>
              <SelectItem value="3">3 Years</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Start Date */}
        <div className="space-y-2">
          <Label htmlFor="contract_start_date">Contract Start Date</Label>
          <Input id="contract_start_date" type="date" value={form.contract_start_date} onChange={(e) => update("contract_start_date", e.target.value)} />
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <Button disabled={!isValid} className="gap-2" onClick={() => onSubmit(form)}>
          Preview DPA <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

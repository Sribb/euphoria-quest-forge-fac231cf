import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FileText, AlertTriangle, CheckCircle } from "lucide-react";

const FILINGS = [
  {
    type: "10-K",
    description: "Annual report with complete financial statements, risk factors, and business overview.",
    frequency: "Annual",
    keyItems: ["Financial Statements", "MD&A", "Risk Factors", "Business Description"],
    redFlags: ["Late filing", "Auditor change", "Going concern opinion"],
  },
  {
    type: "10-Q",
    description: "Quarterly update with unaudited financials and management discussion.",
    frequency: "Quarterly",
    keyItems: ["Interim Financials", "MD&A Updates", "Legal Proceedings"],
    redFlags: ["Revenue recognition changes", "Restated figures", "Unusual accruals"],
  },
  {
    type: "8-K",
    description: "Current report for material events — M&A, executive changes, bankruptcy.",
    frequency: "Event-driven",
    keyItems: ["Material Events", "Financial Exhibits", "Press Releases"],
    redFlags: ["CEO/CFO departure", "Delisting notice", "Material weakness disclosure"],
  },
  {
    type: "DEF 14A",
    description: "Proxy statement with executive compensation, board nominations, and shareholder votes.",
    frequency: "Annual (before AGM)",
    keyItems: ["Exec Compensation", "Board Nominations", "Shareholder Proposals"],
    redFlags: ["Excessive CEO pay", "Related-party transactions", "Low director attendance"],
  },
];

export const SECFilingsExplorer = () => {
  const [selected, setSelected] = useState(0);
  const filing = FILINGS[selected];

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">Explore the most important SEC filings every investor should know how to read.</p>

      <div className="flex gap-2 flex-wrap">
        {FILINGS.map((f, i) => (
          <Button key={i} variant={selected === i ? "default" : "outline"} size="sm" onClick={() => setSelected(i)}>
            <FileText className="w-3 h-3 mr-1" /> {f.type}
          </Button>
        ))}
      </div>

      <Card className="p-5 bg-card/60 border-border/50 space-y-4">
        <div>
          <h4 className="text-lg font-bold text-foreground">{filing.type}</h4>
          <p className="text-sm text-muted-foreground">{filing.description}</p>
          <p className="text-xs text-primary mt-1">Filed: {filing.frequency}</p>
        </div>

        <div>
          <p className="text-sm font-medium text-foreground mb-2 flex items-center gap-1">
            <CheckCircle className="w-4 h-4 text-emerald-500" /> Key Sections
          </p>
          <div className="flex flex-wrap gap-2">
            {filing.keyItems.map((item) => (
              <span key={item} className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">{item}</span>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-foreground mb-2 flex items-center gap-1">
            <AlertTriangle className="w-4 h-4 text-amber-500" /> Red Flags to Watch
          </p>
          <div className="flex flex-wrap gap-2">
            {filing.redFlags.map((flag) => (
              <span key={flag} className="text-xs px-2 py-1 bg-destructive/10 text-destructive rounded-full">{flag}</span>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

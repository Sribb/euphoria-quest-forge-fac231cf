import { BeginnerLessonTemplate, LessonSlide } from "../BeginnerLessonTemplate";
import { DragSortChallenge } from "../../interactive/DragSortChallenge";

export const CF9SECFilings = ({ onComplete }: { onComplete: () => void }) => {
  const slides: LessonSlide[] = [
    {
      id: "intro",
      title: "SEC Filings & Disclosures",
      content: (
        <div className="space-y-4">
          <p>Public companies must file reports with the <strong>SEC</strong> (Securities and Exchange Commission) to keep investors informed.</p>
          <div className="space-y-2 mt-4">
            <div className="p-3 rounded-lg bg-muted/40"><strong>10-K</strong> — Annual report (comprehensive)</div>
            <div className="p-3 rounded-lg bg-muted/40"><strong>10-Q</strong> — Quarterly report</div>
            <div className="p-3 rounded-lg bg-muted/40"><strong>8-K</strong> — Material event (M&A, CEO change)</div>
            <div className="p-3 rounded-lg bg-muted/40"><strong>Proxy (DEF 14A)</strong> — Shareholder voting info</div>
          </div>
        </div>
      ),
    },
    {
      id: "sort",
      title: "Filing Frequency",
      content: (
        <DragSortChallenge
          title="SEC Filing Types"
          description="Rank from most frequent to least frequent filing"
          items={[
            { id: "8k", label: "8-K (as events occur)" },
            { id: "10q", label: "10-Q (quarterly)" },
            { id: "10k", label: "10-K (annual)" },
            { id: "proxy", label: "Proxy Statement (annual)" },
          ]}
          correctOrder={["8k", "10q", "10k", "proxy"]}
        />
      ),
    },
    {
      id: "takeaways",
      title: "Key Takeaways",
      content: (
        <div className="space-y-3">
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ 10-K is the most comprehensive annual report</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ 8-Ks signal breaking news — read them first</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ All filings are free on SEC EDGAR</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Read the risk factors section for red flags</div>
        </div>
      ),
    },
  ];

  return <BeginnerLessonTemplate slides={slides} onComplete={onComplete} />;
};

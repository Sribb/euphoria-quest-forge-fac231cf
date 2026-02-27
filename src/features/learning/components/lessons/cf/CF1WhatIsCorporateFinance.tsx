import { BeginnerLessonTemplate, LessonSlide } from "../BeginnerLessonTemplate";
import { DragSortChallenge } from "../../interactive/DragSortChallenge";

export const CF1WhatIsCorporateFinance = ({ onComplete }: { onComplete: () => void }) => {
  const slides: LessonSlide[] = [
    {
      id: "intro",
      title: "What Is Corporate Finance?",
      content: (
        <div className="space-y-4">
          <p>Corporate finance is about how companies <strong>raise money</strong>, <strong>allocate capital</strong>, and <strong>maximize value</strong> for shareholders.</p>
          <p>Every decision a company makes — from launching a product to buying another company — is a corporate finance decision.</p>
          <div className="p-4 rounded-xl bg-muted/40 border border-border mt-4">
            <p className="font-semibold text-sm">Three pillars: Investment decisions · Financing decisions · Dividend decisions</p>
          </div>
        </div>
      ),
    },
    {
      id: "stakeholders",
      title: "Who Are the Stakeholders?",
      content: (
        <DragSortChallenge
          title="Stakeholder Priority"
          description="Rank stakeholders by their typical influence on corporate decisions (most → least)"
          items={[
            { id: "shareholders", label: "Shareholders (owners)" },
            { id: "board", label: "Board of Directors" },
            { id: "management", label: "Executive Management" },
            { id: "employees", label: "Employees" },
            { id: "creditors", label: "Creditors / Bondholders" },
          ]}
          correctOrder={["shareholders", "board", "management", "creditors", "employees"]}
        />
      ),
    },
    {
      id: "takeaways",
      title: "Key Takeaways",
      content: (
        <div className="space-y-3">
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Corporate finance = maximizing shareholder value</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Three pillars: invest, finance, distribute</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ CFO is the key decision-maker for finance</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Balancing risk and return drives every choice</div>
        </div>
      ),
    },
  ];

  return <BeginnerLessonTemplate slides={slides} onComplete={onComplete} />;
};

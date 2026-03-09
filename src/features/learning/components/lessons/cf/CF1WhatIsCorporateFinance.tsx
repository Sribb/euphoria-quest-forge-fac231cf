import { BeginnerLessonTemplate, LessonSlide } from "../BeginnerLessonTemplate";
import { DragSortChallenge } from "../../interactive/DragSortChallenge";
import { RiskReturnExplorer } from "../../interactive/RiskReturnExplorer";
import { SliderSimulator } from "../../interactive/SliderSimulator";

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
      id: "sim",
      title: "Capital Allocation Explorer",
      content: (
        <SliderSimulator
          title="📊 Capital Allocation"
          description="A company has $1M to allocate. See how different choices affect shareholder value."
          sliders={[
            { id: "rd", label: "R&D / New Products", min: 0, max: 100, step: 5, defaultValue: 30, unit: "%" },
            { id: "buyback", label: "Share Buybacks", min: 0, max: 100, step: 5, defaultValue: 20, unit: "%" },
            { id: "dividends", label: "Dividends", min: 0, max: 100, step: 5, defaultValue: 20, unit: "%" },
            { id: "debt", label: "Debt Repayment", min: 0, max: 100, step: 5, defaultValue: 30, unit: "%" },
          ]}
          calculateResult={(v) => {
            const total = v.rd + v.buyback + v.dividends + v.debt;
            const growthScore = v.rd * 0.15 + v.buyback * 0.08 + v.dividends * 0.05 + v.debt * 0.03;
            return {
              primary: total === 100 ? `Growth Score: ${growthScore.toFixed(0)}/15` : `⚠️ Total: ${total}%`,
              secondary: total === 100 ? `R&D drives highest long-term value` : `Must equal 100%`,
              insight: v.rd >= 30 ? "Heavy R&D — this company is betting on growth!" : v.dividends >= 40 ? "High dividends — income investors love this." : "Balanced approach to capital allocation.",
            };
          }}
        />
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

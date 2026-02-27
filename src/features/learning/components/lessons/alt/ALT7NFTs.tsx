import { BeginnerLessonTemplate, LessonSlide } from "../BeginnerLessonTemplate";
import { DragSortChallenge } from "../../interactive/DragSortChallenge";

export const ALT7NFTs = ({ onComplete }: { onComplete: () => void }) => {
  const slides: LessonSlide[] = [
    {
      id: "intro", title: "NFTs & Digital Assets", content: (
        <div className="space-y-4">
          <p><strong>NFTs</strong> (Non-Fungible Tokens) are unique digital assets verified on a blockchain — art, music, collectibles.</p>
          <p>Unlike Bitcoin (fungible), each NFT is one-of-a-kind.</p>
          <div className="space-y-2 mt-4">
            <div className="p-3 rounded-lg bg-primary/10">✅ Proof of ownership & authenticity</div>
            <div className="p-3 rounded-lg bg-primary/10">✅ Creator royalties on resales</div>
            <div className="p-3 rounded-lg bg-destructive/10">❌ Highly speculative — most lose value</div>
            <div className="p-3 rounded-lg bg-destructive/10">❌ Illiquid — hard to sell quickly</div>
          </div>
        </div>
      ),
    },
    {
      id: "sort", title: "Risk Assessment", content: (
        <DragSortChallenge
          title="NFT Risk Factors"
          description="Rank from biggest risk (top) to smallest (bottom)"
          items={[
            { id: "liquidity", label: "No guaranteed buyers" },
            { id: "valuation", label: "No fundamental valuation" },
            { id: "fraud", label: "Scams & rug pulls" },
            { id: "tech", label: "Platform dependency" },
            { id: "regulation", label: "Unclear regulation" },
          ]}
          correctOrder={["fraud", "liquidity", "valuation", "regulation", "tech"]}
        />
      ),
    },
    {
      id: "takeaways", title: "Key Takeaways", content: (
        <div className="space-y-3">
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ NFTs are speculative — not traditional investments</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Only buy what you'd be happy to own at $0 value</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ The technology has real use cases beyond art</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Do extreme due diligence before purchasing</div>
        </div>
      ),
    },
  ];
  return <BeginnerLessonTemplate slides={slides} onComplete={onComplete} />;
};

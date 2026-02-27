import { BeginnerLessonTemplate, LessonSlide } from "../BeginnerLessonTemplate";
import { DragSortChallenge } from "../../interactive/DragSortChallenge";

export const ALT1BeyondStocks = ({ onComplete }: { onComplete: () => void }) => {
  const slides: LessonSlide[] = [
    {
      id: "intro", title: "Beyond Stocks & Bonds", content: (
        <div className="space-y-4">
          <p><strong>Alternative assets</strong> are investments outside traditional stocks and bonds. They can add diversification and unique return profiles.</p>
          <div className="space-y-2 mt-4">
            <div className="p-3 rounded-lg bg-muted/40">🏠 Real Estate</div>
            <div className="p-3 rounded-lg bg-muted/40">🥇 Gold & Precious Metals</div>
            <div className="p-3 rounded-lg bg-muted/40">🛢️ Commodities</div>
            <div className="p-3 rounded-lg bg-muted/40">₿ Cryptocurrency</div>
            <div className="p-3 rounded-lg bg-muted/40">🎨 Art & Collectibles</div>
          </div>
        </div>
      ),
    },
    {
      id: "sort", title: "Risk Ranking", content: (
        <DragSortChallenge
          title="Asset Class Risk"
          description="Rank from lowest risk (top) to highest risk (bottom)"
          items={[
            { id: "gold", label: "Gold" },
            { id: "realestate", label: "Real Estate (REITs)" },
            { id: "commodities", label: "Commodities" },
            { id: "crypto", label: "Cryptocurrency" },
            { id: "nfts", label: "NFTs & Digital Art" },
          ]}
          correctOrder={["gold", "realestate", "commodities", "crypto", "nfts"]}
        />
      ),
    },
    {
      id: "takeaways", title: "Key Takeaways", content: (
        <div className="space-y-3">
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Alternatives reduce correlation with stock market</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Higher potential returns often come with less liquidity</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Start small — 5–15% of your portfolio</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Understand what you own before you invest</div>
        </div>
      ),
    },
  ];
  return <BeginnerLessonTemplate slides={slides} onComplete={onComplete} />;
};

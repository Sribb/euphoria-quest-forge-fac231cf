import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { Shield, TrendingUp, BarChart3 } from "lucide-react";
import { playSnap } from "@/lib/soundEffects";

interface RiskReturnExplorerProps {
  title?: string;
  description?: string;
  onComplete?: (score: number) => void;
}

const ASSET_PROFILES = [
  { name: "Bonds", emoji: "🏦", avgReturn: 4, volatility: 5, color: "hsl(var(--muted-foreground))" },
  { name: "Stocks", emoji: "📈", avgReturn: 10, volatility: 20, color: "hsl(var(--primary))" },
  { name: "Crypto", emoji: "₿", avgReturn: 15, volatility: 50, color: "hsl(var(--destructive))" },
];

export const RiskReturnExplorer = ({
  title = "Risk vs Return Explorer",
  description = "Allocate your portfolio across asset classes and see how risk & return change.",
}: RiskReturnExplorerProps) => {
  const [bonds, setBonds] = useState(40);
  const [stocks, setStocks] = useState(50);
  const [crypto, setCrypto] = useState(10);

  const total = bonds + stocks + crypto;

  const portfolio = useMemo(() => {
    const norm = total > 0 ? total : 1;
    const wB = bonds / norm;
    const wS = stocks / norm;
    const wC = crypto / norm;

    const expectedReturn = wB * 4 + wS * 10 + wC * 15;
    const volatility = Math.sqrt(
      Math.pow(wB * 5, 2) + Math.pow(wS * 20, 2) + Math.pow(wC * 50, 2) +
      2 * wB * wS * 5 * 20 * 0.2 +
      2 * wS * wC * 20 * 50 * 0.4 +
      2 * wB * wC * 5 * 50 * 0.1
    );

    const bestCase = expectedReturn + volatility;
    const worstCase = expectedReturn - volatility;

    return { expectedReturn, volatility, bestCase, worstCase, wB, wS, wC };
  }, [bonds, stocks, crypto, total]);

  // Monte Carlo-ish 10yr projection (5 scenarios)
  const scenarios = useMemo(() => {
    const results: { year: number; [key: string]: number }[] = [];
    const seeds = [-1.5, -0.5, 0, 0.5, 1.5];
    for (let y = 0; y <= 10; y++) {
      const point: Record<string, number> = { year: y };
      seeds.forEach((seed, i) => {
        const annualReturn = (portfolio.expectedReturn + seed * portfolio.volatility) / 100;
        point[`s${i}`] = Math.round(10000 * Math.pow(1 + annualReturn, y));
      });
      results.push(point);
    }
    return results;
  }, [portfolio]);

  const maxScenarioVal = Math.max(...scenarios.map((s) => Math.max(s.s0 || 0, s.s1 || 0, s.s2 || 0, s.s3 || 0, s.s4 || 0)));

  const W = 600;
  const H = 180;
  const PAD = 40;
  const toX = (year: number) => PAD + (year / 10) * (W - PAD * 2);
  const toY = (val: number) => H - PAD - (val / maxScenarioVal) * (H - PAD * 2);

  const scenarioLines = [0, 1, 2, 3, 4].map((i) => {
    return scenarios.map((s, j) => `${j === 0 ? "M" : "L"} ${toX(s.year)} ${toY(s[`s${i}`] as number)}`).join(" ");
  });

  const scenarioColors = [
    "hsl(var(--destructive))",
    "hsl(var(--muted-foreground))",
    "hsl(var(--primary))",
    "hsl(var(--muted-foreground))",
    "hsl(var(--primary))",
  ];
  const scenarioOpacities = [0.4, 0.4, 1, 0.4, 0.4];
  const scenarioWidths = [1, 1, 2.5, 1, 1];

  // Donut chart
  const donutSize = 80;
  const donutR = 30;
  const donutStroke = 10;
  const segments = [
    { pct: portfolio.wB, color: ASSET_PROFILES[0].color },
    { pct: portfolio.wS, color: ASSET_PROFILES[1].color },
    { pct: portfolio.wC, color: ASSET_PROFILES[2].color },
  ];

  let donutOffset = 0;
  const circumference = 2 * Math.PI * donutR;

  return (
    <div className="p-5 rounded-2xl bg-muted/30 border border-border space-y-5">
      <div>
        <h3 className="font-bold text-foreground text-lg flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          {title}
        </h3>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>

      <div className="flex gap-6 items-start flex-wrap">
        {/* Donut */}
        <div className="flex-shrink-0">
          <svg width={donutSize} height={donutSize} viewBox={`0 0 ${donutSize} ${donutSize}`}>
            {segments.map((seg, i) => {
              const dash = seg.pct * circumference;
              const gap = circumference - dash;
              const offset = donutOffset;
              donutOffset += dash;
              return (
                <circle
                  key={i}
                  cx={donutSize / 2}
                  cy={donutSize / 2}
                  r={donutR}
                  fill="none"
                  stroke={seg.color}
                  strokeWidth={donutStroke}
                  strokeDasharray={`${dash} ${gap}`}
                  strokeDashoffset={-offset}
                  transform={`rotate(-90 ${donutSize / 2} ${donutSize / 2})`}
                />
              );
            })}
          </svg>
        </div>

        {/* Sliders */}
        <div className="flex-1 min-w-0 space-y-3">
          {[
            { asset: ASSET_PROFILES[0], val: bonds, set: setBonds },
            { asset: ASSET_PROFILES[1], val: stocks, set: setStocks },
            { asset: ASSET_PROFILES[2], val: crypto, set: setCrypto },
          ].map(({ asset, val, set }) => (
            <div key={asset.name} className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-xs font-medium text-foreground">
                  {asset.emoji} {asset.name}
                </label>
                <span className="text-sm font-bold text-primary">{val}%</span>
              </div>
              <Slider min={0} max={100} step={5} value={[val]} onValueChange={([v]) => set(v)} onValueCommit={() => playSnap()} />
            </div>
          ))}
          {total !== 100 && (
            <p className="text-xs text-destructive font-medium">
              ⚠️ Total: {total}% (should be 100%)
            </p>
          )}
        </div>
      </div>

      {/* Scenario fan chart */}
      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[600px] mx-auto" style={{ minHeight: 160 }}>
          {[0, 0.5, 1].map((f) => (
            <g key={f}>
              <line x1={PAD} y1={toY(f * maxScenarioVal)} x2={W - PAD} y2={toY(f * maxScenarioVal)} className="stroke-border" strokeWidth={0.5} strokeDasharray="4 4" />
              <text x={PAD - 4} y={toY(f * maxScenarioVal) + 4} textAnchor="end" className="fill-muted-foreground text-[8px]">
                ${(f * maxScenarioVal / 1000).toFixed(0)}k
              </text>
            </g>
          ))}

          {/* Fan area between worst & best */}
          <path
            d={`${scenarios.map((s, j) => `${j === 0 ? "M" : "L"} ${toX(s.year)} ${toY(s.s4 as number)}`).join(" ")} ${[...scenarios].reverse().map((s, j) => `${j === 0 ? "L" : "L"} ${toX(s.year)} ${toY(s.s0 as number)}`).join(" ")} Z`}
            fill="hsl(var(--primary))"
            fillOpacity={0.06}
          />

          {scenarioLines.map((d, i) => (
            <path
              key={i}
              d={d}
              fill="none"
              stroke={scenarioColors[i]}
              strokeWidth={scenarioWidths[i]}
              opacity={scenarioOpacities[i]}
              strokeDasharray={i === 2 ? undefined : "4 4"}
            />
          ))}

          <text x={W / 2} y={H - 4} textAnchor="middle" className="fill-muted-foreground text-[9px]">Years →</text>
        </svg>
      </div>

      {/* Results */}
      <motion.div
        key={`${bonds}-${stocks}-${crypto}`}
        initial={{ scale: 0.97, opacity: 0.5 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="grid grid-cols-2 gap-3"
      >
        <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <TrendingUp className="w-3 h-3 text-primary" />
            <span className="text-xs text-muted-foreground">Expected Return</span>
          </div>
          <p className="text-xl font-black text-primary">{portfolio.expectedReturn.toFixed(1)}%</p>
        </div>
        <div className="p-3 rounded-xl bg-muted/50 border border-border text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Shield className="w-3 h-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Volatility (Risk)</span>
          </div>
          <p className={`text-xl font-black ${portfolio.volatility > 25 ? "text-destructive" : "text-foreground"}`}>
            {portfolio.volatility.toFixed(1)}%
          </p>
        </div>
      </motion.div>

      <p className="text-xs text-muted-foreground italic text-center">
        {portfolio.volatility > 30
          ? "⚠️ Very high risk — you could lose 30%+ in a bad year. Consider reducing crypto exposure."
          : portfolio.expectedReturn < 5
          ? "💡 Low expected returns. Adding some stock exposure can boost growth with manageable risk."
          : portfolio.wC > 0.3
          ? "🎢 Heavy crypto allocation — high reward potential but extreme volatility."
          : "📊 The fan chart shows possible outcomes from worst to best case over 10 years."}
      </p>
    </div>
  );
};

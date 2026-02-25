import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Target, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { playCorrect, playIncorrect, playClick } from "@/lib/soundEffects";
import { fireSmallConfetti } from "@/lib/confetti";

interface DataPoint {
  x: number;
  y: number;
  label?: string;
}

interface AnnotationTarget {
  index: number; // which data point is the answer
  label: string; // e.g. "Support Level", "Peak"
}

interface InteractiveChartAnnotationProps {
  title: string;
  description: string;
  data: DataPoint[];
  targets: AnnotationTarget[];
  onComplete?: (score: number) => void;
}

export const InteractiveChartAnnotation = ({
  title,
  description,
  data,
  targets,
  onComplete,
}: InteractiveChartAnnotationProps) => {
  const [currentTarget, setCurrentTarget] = useState(0);
  const [selectedPoints, setSelectedPoints] = useState<number[]>([]);
  const [results, setResults] = useState<boolean[]>([]);
  const [done, setDone] = useState(false);

  const width = 600;
  const height = 200;
  const padding = 30;

  const { minY, maxY, points } = useMemo(() => {
    const ys = data.map((d) => d.y);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const range = maxY - minY || 1;
    const xStep = (width - padding * 2) / (data.length - 1);
    const points = data.map((d, i) => ({
      cx: padding + i * xStep,
      cy: padding + (1 - (d.y - minY) / range) * (height - padding * 2),
      ...d,
    }));
    return { minY, maxY, points };
  }, [data]);

  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.cx} ${p.cy}`)
    .join(" ");

  const target = targets[currentTarget];

  const handlePointClick = (index: number) => {
    if (done) return;
    playClick();

    const isCorrect = index === target.index;
    const newResults = [...results, isCorrect];
    const newSelected = [...selectedPoints, index];
    setResults(newResults);
    setSelectedPoints(newSelected);

    if (isCorrect) {
      playCorrect();
      fireSmallConfetti();
    } else {
      playIncorrect();
    }

    if (currentTarget < targets.length - 1) {
      setTimeout(() => setCurrentTarget((c) => c + 1), 800);
    } else {
      setDone(true);
      const score = Math.round(
        (newResults.filter(Boolean).length / targets.length) * 100
      );
      onComplete?.(score);
    }
  };

  const handleReset = () => {
    playClick();
    setCurrentTarget(0);
    setSelectedPoints([]);
    setResults([]);
    setDone(false);
  };

  return (
    <div className="p-5 rounded-2xl bg-muted/30 border border-border space-y-4">
      <div>
        <h3 className="font-bold text-foreground text-lg">{title}</h3>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>

      {!done && target && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-primary/5 border border-primary/20">
          <Target className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-foreground">
            Tap the point that represents: <strong>{target.label}</strong>
          </span>
        </div>
      )}

      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full max-w-[600px] mx-auto"
          style={{ minHeight: 200 }}
        >
          {/* Grid lines */}
          {[0.25, 0.5, 0.75].map((frac) => (
            <line
              key={frac}
              x1={padding}
              y1={padding + frac * (height - padding * 2)}
              x2={width - padding}
              y2={padding + frac * (height - padding * 2)}
              className="stroke-border"
              strokeWidth={0.5}
              strokeDasharray="4 4"
            />
          ))}

          {/* Line */}
          <path d={pathD} fill="none" className="stroke-primary" strokeWidth={2.5} />

          {/* Clickable points */}
          {points.map((p, i) => {
            const wasSelected = selectedPoints.includes(i);
            const selIdx = selectedPoints.indexOf(i);
            const wasCorrect = selIdx >= 0 ? results[selIdx] : null;

            return (
              <g key={i} onClick={() => handlePointClick(i)} className="cursor-pointer">
                {/* Larger hit area */}
                <circle cx={p.cx} cy={p.cy} r={14} fill="transparent" />
                {/* Visible dot */}
                <circle
                  cx={p.cx}
                  cy={p.cy}
                  r={6}
                  className={
                    wasCorrect === true
                      ? "fill-primary stroke-primary"
                      : wasCorrect === false
                      ? "fill-destructive stroke-destructive"
                      : "fill-background stroke-primary hover:fill-primary/20"
                  }
                  strokeWidth={2}
                />
                {wasSelected && (
                  <text
                    x={p.cx}
                    y={p.cy - 14}
                    textAnchor="middle"
                    className={`text-[10px] font-bold ${
                      wasCorrect ? "fill-primary" : "fill-destructive"
                    }`}
                  >
                    {wasCorrect ? "✓" : "✗"}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {done && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <div className="flex items-center gap-2 p-3 rounded-xl bg-primary/5 border border-primary/20">
            <CheckCircle2 className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-foreground">
              Score: {results.filter(Boolean).length}/{targets.length} correct
            </span>
          </div>
          <Button variant="outline" size="sm" onClick={handleReset} className="rounded-xl">
            <RotateCcw className="w-4 h-4 mr-2" /> Try Again
          </Button>
        </motion.div>
      )}
    </div>
  );
};

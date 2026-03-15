import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ActivityGraphProps {
  lessonDates: string[];
  tradeDates: string[];
  gameDates: string[];
}

export const ActivityGraph = ({ lessonDates, tradeDates, gameDates }: ActivityGraphProps) => {
  const weeks = 20;
  const days = 7;

  const grid = useMemo(() => {
    const today = new Date();
    const allDates = [...lessonDates, ...tradeDates, ...gameDates];
    const countMap = new Map<string, number>();

    allDates.forEach((d) => {
      const key = new Date(d).toISOString().slice(0, 10);
      countMap.set(key, (countMap.get(key) || 0) + 1);
    });

    const cells: { date: string; count: number; col: number; row: number }[] = [];
    for (let w = weeks - 1; w >= 0; w--) {
      for (let d = 0; d < days; d++) {
        const date = new Date(today);
        date.setDate(date.getDate() - (w * 7 + (6 - d)));
        const key = date.toISOString().slice(0, 10);
        cells.push({ date: key, count: countMap.get(key) || 0, col: weeks - 1 - w, row: d });
      }
    }
    return cells;
  }, [lessonDates, tradeDates, gameDates]);

  const maxCount = Math.max(1, ...grid.map((c) => c.count));

  const getLevel = (count: number): string => {
    if (count === 0) return "bg-muted/40";
    const ratio = count / maxCount;
    if (ratio <= 0.25) return "bg-primary/20";
    if (ratio <= 0.5) return "bg-primary/40";
    if (ratio <= 0.75) return "bg-primary/70";
    return "bg-primary";
  };

  const monthLabels = useMemo(() => {
    const labels: { label: string; col: number }[] = [];
    let lastMonth = -1;
    grid.filter((c) => c.row === 0).forEach((c) => {
      const month = new Date(c.date).getMonth();
      if (month !== lastMonth) {
        labels.push({
          label: new Date(c.date).toLocaleDateString("en", { month: "short" }),
          col: c.col,
        });
        lastMonth = month;
      }
    });
    return labels;
  }, [grid]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-xl bg-card border border-border"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold">Activity</h3>
        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <span>Less</span>
          {[0, 1, 2, 3, 4].map((l) => (
            <div
              key={l}
              className={cn(
                "w-2.5 h-2.5 rounded-[3px]",
                l === 0 ? "bg-muted/40" : l === 1 ? "bg-primary/20" : l === 2 ? "bg-primary/40" : l === 3 ? "bg-primary/70" : "bg-primary"
              )}
            />
          ))}
          <span>More</span>
        </div>
      </div>

      {/* Month labels */}
      <div className="ml-6 flex text-[9px] text-muted-foreground mb-1" style={{ gap: "0px" }}>
        {monthLabels.map((m, i) => (
          <span key={i} style={{ position: "relative", left: `${m.col * 14}px` }} className="absolute">
            {m.label}
          </span>
        ))}
      </div>

      <div className="flex gap-0.5 overflow-hidden">
        {/* Day labels */}
        <div className="flex flex-col gap-0.5 text-[9px] text-muted-foreground pr-1 shrink-0">
          {["", "Mon", "", "Wed", "", "Fri", ""].map((d, i) => (
            <div key={i} className="h-[12px] flex items-center">{d}</div>
          ))}
        </div>

        {/* Grid */}
        <div className="flex gap-[2px] flex-1 overflow-hidden">
          {Array.from({ length: weeks }).map((_, col) => (
            <div key={col} className="flex flex-col gap-[2px]">
              {Array.from({ length: days }).map((_, row) => {
                const cell = grid.find((c) => c.col === col && c.row === row);
                return (
                  <div
                    key={row}
                    className={cn("w-[12px] h-[12px] rounded-[3px] transition-colors", getLevel(cell?.count || 0))}
                    title={cell ? `${cell.date}: ${cell.count} activities` : ""}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

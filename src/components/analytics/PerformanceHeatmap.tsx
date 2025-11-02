import { Card } from "@/components/ui/card";
import { Activity } from "lucide-react";

interface HeatmapData {
  day: string;
  lessons: number;
  games: number;
  trades: number;
}

interface PerformanceHeatmapProps {
  data: HeatmapData[];
}

export const PerformanceHeatmap = ({ data }: PerformanceHeatmapProps) => {
  const getIntensityColor = (value: number, max: number) => {
    if (value === 0) return "bg-muted";
    const intensity = (value / max) * 100;
    if (intensity < 25) return "bg-primary/25";
    if (intensity < 50) return "bg-primary/50";
    if (intensity < 75) return "bg-primary/75";
    return "bg-primary";
  };

  const maxLessons = Math.max(...data.map(d => d.lessons), 1);
  const maxGames = Math.max(...data.map(d => d.games), 1);
  const maxTrades = Math.max(...data.map(d => d.trades), 1);

  return (
    <Card className="p-6 animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-bold">Activity Heatmap</h3>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium mb-2">Learning Activity</p>
          <div className="grid grid-cols-7 gap-2">
            {data.map((day, idx) => (
              <div
                key={`lessons-${idx}`}
                className={`h-12 rounded-lg ${getIntensityColor(day.lessons, maxLessons)} transition-all hover:scale-105 cursor-pointer flex items-center justify-center`}
                title={`${day.day}: ${day.lessons} lessons`}
              >
                {day.lessons > 0 && (
                  <span className="text-xs font-bold text-white">{day.lessons}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-medium mb-2">Gaming Activity</p>
          <div className="grid grid-cols-7 gap-2">
            {data.map((day, idx) => (
              <div
                key={`games-${idx}`}
                className={`h-12 rounded-lg ${getIntensityColor(day.games, maxGames)} transition-all hover:scale-105 cursor-pointer flex items-center justify-center`}
                title={`${day.day}: ${day.games} games`}
              >
                {day.games > 0 && (
                  <span className="text-xs font-bold text-white">{day.games}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-medium mb-2">Trading Activity</p>
          <div className="grid grid-cols-7 gap-2">
            {data.map((day, idx) => (
              <div
                key={`trades-${idx}`}
                className={`h-12 rounded-lg ${getIntensityColor(day.trades, maxTrades)} transition-all hover:scale-105 cursor-pointer flex items-center justify-center`}
                title={`${day.day}: ${day.trades} trades`}
              >
                {day.trades > 0 && (
                  <span className="text-xs font-bold text-white">{day.trades}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <span className="text-xs text-muted-foreground">Less</span>
          <div className="flex gap-1">
            <div className="w-4 h-4 rounded bg-muted" />
            <div className="w-4 h-4 rounded bg-primary/25" />
            <div className="w-4 h-4 rounded bg-primary/50" />
            <div className="w-4 h-4 rounded bg-primary/75" />
            <div className="w-4 h-4 rounded bg-primary" />
          </div>
          <span className="text-xs text-muted-foreground">More</span>
        </div>
      </div>
    </Card>
  );
};

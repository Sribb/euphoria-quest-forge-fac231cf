import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Clock } from "lucide-react";

const ticks = [5, 10, 15, 30, 45, 60];

interface Props {
  value: number | null;
  onChange: (value: number) => void;
}

export const TimeCommitmentStep = ({ value, onChange }: Props) => {
  const [local, setLocal] = useState(value ?? 15);

  useEffect(() => {
    if (value !== null) setLocal(value);
  }, [value]);

  const handleChange = (v: number[]) => {
    setLocal(v[0]);
    onChange(v[0]);
  };

  const getLabel = (mins: number) => {
    if (mins <= 5) return "Quick learner — 5 min bursts";
    if (mins <= 15) return "Steady pace — great for daily habits";
    if (mins <= 30) return "Solid commitment — deeper understanding";
    return "Power learner — accelerated growth";
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">How much time can you commit daily?</h2>
        <p className="text-muted-foreground mt-1">We'll pace your lessons accordingly</p>
      </div>

      <div className="space-y-6 px-2">
        <div className="flex items-center justify-center gap-3 p-4 rounded-xl bg-muted/50 border border-border">
          <Clock className="w-8 h-8 text-primary shrink-0" />
          <div>
            <p className="font-bold text-2xl text-primary">{local} min</p>
            <p className="text-sm text-muted-foreground">{getLabel(local)}</p>
          </div>
        </div>

        <Slider
          value={[local]}
          onValueChange={handleChange}
          min={0}
          max={60}
          step={5}
          className="w-full"
        />
        <div className="flex justify-between">
          {ticks.map((t) => (
            <button
              key={t}
              onClick={() => { setLocal(t); onChange(t); }}
              className={`text-xs px-2 py-1 rounded-full transition-colors ${
                local === t
                  ? "bg-primary text-primary-foreground font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t}m
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

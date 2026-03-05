import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Shield, TrendingUp, Flame } from "lucide-react";

const descriptors = [
  { label: "Conservative", description: "You prefer stable, lower-risk investments", icon: Shield, color: "text-emerald-500" },
  { label: "Moderate", description: "You balance growth with some protection", icon: TrendingUp, color: "text-primary" },
  { label: "Aggressive", description: "You chase high growth and accept volatility", icon: Flame, color: "text-amber-500" },
];

interface Props {
  value: number | null;
  onChange: (value: number) => void;
}

export const RiskComfortStep = ({ value, onChange }: Props) => {
  const [local, setLocal] = useState(value ?? 50);
  const descriptorIndex = local < 33 ? 0 : local < 67 ? 1 : 2;
  const descriptor = descriptors[descriptorIndex];
  const Icon = descriptor.icon;

  useEffect(() => {
    if (value !== null) setLocal(value);
  }, [value]);

  const handleChange = (v: number[]) => {
    setLocal(v[0]);
    onChange(v[0]);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">How comfortable are you with risk?</h2>
        <p className="text-muted-foreground mt-1">Slide to indicate your risk tolerance</p>
      </div>

      <div className="space-y-6 px-2">
        <div className="flex items-center justify-center gap-3 p-4 rounded-xl bg-muted/50 border border-border">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${descriptor.color} bg-current/10`}>
            <Icon className={`w-6 h-6 ${descriptor.color}`} />
          </div>
          <div>
            <p className={`font-bold text-lg ${descriptor.color}`}>{descriptor.label}</p>
            <p className="text-sm text-muted-foreground">{descriptor.description}</p>
          </div>
        </div>

        <Slider
          value={[local]}
          onValueChange={handleChange}
          max={100}
          step={1}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Low Risk</span>
          <span>Medium</span>
          <span>High Risk</span>
        </div>
      </div>
    </div>
  );
};

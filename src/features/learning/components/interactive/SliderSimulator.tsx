import { useState } from "react";
import { motion } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { playSnap } from "@/lib/soundEffects";
import { stripEmoji } from "@/lib/stripEmoji";

interface SliderConfig {
  id: string;
  label: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  unit?: string;
  color?: string;
}

interface SliderSimulatorProps {
  title: string;
  description: string;
  sliders: SliderConfig[];
  calculateResult: (values: Record<string, number>) => {
    primary: string;
    secondary?: string;
    insight?: string;
  };
  chartRender?: (values: Record<string, number>) => React.ReactNode;
}

export const SliderSimulator = ({
  title,
  description,
  sliders,
  calculateResult,
  chartRender,
}: SliderSimulatorProps) => {
  const [values, setValues] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    sliders.forEach((s) => (initial[s.id] = s.defaultValue));
    return initial;
  });

  const result = calculateResult(values);

  const handleChange = (id: string, val: number[]) => {
    setValues((prev) => ({ ...prev, [id]: val[0] }));
  };

  return (
    <div className="p-5 rounded-2xl bg-muted/30 border border-border space-y-5">
      <div>
        <h3 className="font-bold text-foreground text-lg">{title}</h3>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>

      {/* Sliders */}
      <div className="space-y-5">
        {sliders.map((slider) => (
          <div key={slider.id} className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-foreground">
                {slider.label}
              </label>
              <span className="text-sm font-bold text-primary">
                {values[slider.id]}
                {slider.unit || ""}
              </span>
            </div>
            <Slider
              min={slider.min}
              max={slider.max}
              step={slider.step}
              value={[values[slider.id]]}
              onValueChange={(val) => handleChange(slider.id, val)}
              onValueCommit={() => playSnap()}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>
                {slider.min}
                {slider.unit || ""}
              </span>
              <span>
                {slider.max}
                {slider.unit || ""}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Chart render area */}
      {chartRender && (
        <div className="rounded-xl bg-background border border-border p-4 overflow-hidden">
          {chartRender(values)}
        </div>
      )}

      {/* Result */}
      <motion.div
        key={JSON.stringify(values)}
        initial={{ scale: 0.98, opacity: 0.5 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="p-4 rounded-xl bg-primary/5 border border-primary/20 text-center"
      >
        <p className="text-2xl font-black text-primary">{result.primary}</p>
        {result.secondary && (
          <p className="text-sm text-muted-foreground mt-1">{result.secondary}</p>
        )}
        {result.insight && (
          <p className="text-xs text-muted-foreground mt-2 italic">
            💡 {result.insight}
          </p>
        )}
      </motion.div>
    </div>
  );
};

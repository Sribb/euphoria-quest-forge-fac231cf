import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SlotMachineCounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  duration?: number;
}

const SlotMachineCounter = ({
  value,
  prefix = "",
  suffix = "",
  className = "",
  duration = 1.5,
}: SlotMachineCounterProps) => {
  const [displayValue, setDisplayValue] = useState(value);
  const [isAnimating, setIsAnimating] = useState(false);
  const previousValue = useRef(value);

  useEffect(() => {
    if (value !== previousValue.current) {
      setIsAnimating(true);
      const startValue = previousValue.current;
      const endValue = value;
      const startTime = Date.now();
      const durationMs = duration * 1000;

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / durationMs, 1);
        
        // Easing function for slot machine effect
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(startValue + (endValue - startValue) * eased);
        
        setDisplayValue(current);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setIsAnimating(false);
          previousValue.current = value;
        }
      };

      requestAnimationFrame(animate);
    }
  }, [value, duration]);

  const digits = displayValue.toLocaleString().split("");

  return (
    <div className={`flex items-center font-mono ${className}`}>
      {prefix && <span className="mr-1">{prefix}</span>}
      <div className="flex overflow-hidden">
        <AnimatePresence mode="popLayout">
          {digits.map((digit, index) => (
            <motion.span
              key={`${index}-${digit}`}
              initial={{ y: isAnimating ? -20 : 0, opacity: isAnimating ? 0 : 1 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 30,
                delay: index * 0.02,
              }}
              className="inline-block"
            >
              {digit}
            </motion.span>
          ))}
        </AnimatePresence>
      </div>
      {suffix && <span className="ml-1">{suffix}</span>}
    </div>
  );
};

export default SlotMachineCounter;

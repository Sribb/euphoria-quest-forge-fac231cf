import { useState, useCallback } from "react";
import { motion, Reorder } from "framer-motion";
import { GripVertical, CheckCircle2, XCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { playCorrect, playIncorrect, playClick } from "@/lib/soundEffects";
import { fireSmallConfetti } from "@/lib/confetti";

interface DragSortItem {
  id: string;
  label: string;
}

interface DragSortChallengeProps {
  title: string;
  description: string;
  items: DragSortItem[];
  correctOrder: string[]; // Array of ids in correct order
  onComplete?: (isCorrect: boolean) => void;
}

export const DragSortChallenge = ({
  title,
  description,
  items: initialItems,
  correctOrder,
  onComplete,
}: DragSortChallengeProps) => {
  const [items, setItems] = useState(
    () => [...initialItems].sort(() => Math.random() - 0.5)
  );
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleCheck = useCallback(() => {
    const currentOrder = items.map((i) => i.id);
    const correct = JSON.stringify(currentOrder) === JSON.stringify(correctOrder);
    setChecked(true);
    setIsCorrect(correct);
    if (correct) {
      playCorrect();
      fireSmallConfetti();
    } else {
      playIncorrect();
    }
    onComplete?.(correct);
  }, [items, correctOrder, onComplete]);

  const handleReset = () => {
    playClick();
    setChecked(false);
    setIsCorrect(false);
    setItems([...initialItems].sort(() => Math.random() - 0.5));
  };

  return (
    <div className="p-5 rounded-2xl bg-muted/30 border border-border space-y-4">
      <div>
        <h3 className="font-bold text-foreground text-lg">{title}</h3>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>

      <Reorder.Group
        axis="y"
        values={items}
        onReorder={(newItems) => {
          if (!checked) {
            playClick();
            setItems(newItems);
          }
        }}
        className="space-y-2"
      >
        {items.map((item, index) => {
          let borderColor = "border-border";
          if (checked) {
            borderColor =
              correctOrder[index] === item.id
                ? "border-primary bg-primary/5"
                : "border-destructive bg-destructive/5";
          }

          return (
            <Reorder.Item
              key={item.id}
              value={item}
              dragListener={!checked}
              className={`flex items-center gap-3 p-4 rounded-xl border ${borderColor} bg-background cursor-grab active:cursor-grabbing transition-colors`}
            >
              <GripVertical className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              <span className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground flex-shrink-0">
                {index + 1}
              </span>
              <span className="text-sm font-medium text-foreground flex-1">
                {item.label}
              </span>
              {checked && correctOrder[index] === item.id && (
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
              )}
              {checked && correctOrder[index] !== item.id && (
                <XCircle className="w-5 h-5 text-destructive flex-shrink-0" />
              )}
            </Reorder.Item>
          );
        })}
      </Reorder.Group>

      <div className="flex gap-3 pt-2">
        {!checked ? (
          <Button onClick={handleCheck} className="rounded-xl">
            Check Order
          </Button>
        ) : (
          <Button variant="outline" onClick={handleReset} className="rounded-xl">
            <RotateCcw className="w-4 h-4 mr-2" /> Try Again
          </Button>
        )}
      </div>

      {checked && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-3 rounded-xl text-sm ${
            isCorrect
              ? "bg-primary/5 border border-primary/20 text-muted-foreground"
              : "bg-destructive/5 border border-destructive/20 text-muted-foreground"
          }`}
        >
          {isCorrect
            ? "🎯 Perfect order! You nailed it."
            : "Not quite — try dragging the items into the correct sequence."}
        </motion.div>
      )}
    </div>
  );
};

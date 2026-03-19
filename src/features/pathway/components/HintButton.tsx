import { Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useHintContext } from './HintContext';

interface Props {
  disabled?: boolean;
  correctIndex: number;
  totalOptions: number;
  onEliminated?: (index: number) => void;
}

export function HintButton({ disabled, correctIndex, totalOptions }: Props) {
  const ctx = useHintContext();
  if (!ctx) return null;

  const { hints, requestElimination, getResetTimeRemaining } = ctx;
  const resetTime = getResetTimeRemaining();
  const isDisabled = disabled || hints <= 0;

  const handleClick = async () => {
    if (isDisabled) return;
    await requestElimination(correctIndex, totalOptions);
  };

  return (
    <button
      onClick={handleClick}
      disabled={isDisabled}
      className={cn(
        "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all",
        !isDisabled
          ? "bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 cursor-pointer"
          : "bg-muted/20 text-muted-foreground/40 cursor-not-allowed"
      )}
      title={resetTime ? `Free hints reset in ${resetTime}` : 'Use a hint to eliminate a wrong answer'}
    >
      <Lightbulb className="w-4 h-4" />
      {hints}
    </button>
  );
}

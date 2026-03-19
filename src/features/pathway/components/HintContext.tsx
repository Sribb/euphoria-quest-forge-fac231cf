import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { useHints } from '@/hooks/useHints';

interface HintContextType {
  hints: number;
  eliminated: Set<number>;
  resetEliminated: () => void;
  requestElimination: (correctIndex: number, totalOptions: number) => Promise<boolean>;
  getResetTimeRemaining: () => string | null;
}

const HintContext = createContext<HintContextType | null>(null);

export function useHintContext() {
  return useContext(HintContext);
}

export function HintProvider({ children }: { children: ReactNode }) {
  const { hints, useHint, getResetTimeRemaining } = useHints();
  const [eliminated, setEliminated] = useState<Set<number>>(new Set());

  const resetEliminated = useCallback(() => {
    setEliminated(new Set());
  }, []);

  const requestElimination = useCallback(async (correctIndex: number, totalOptions: number): Promise<boolean> => {
    if (hints <= 0) return false;

    const wrongIndices = Array.from({ length: totalOptions }, (_, i) => i)
      .filter(i => i !== correctIndex && !eliminated.has(i));

    if (wrongIndices.length === 0) return false;

    const success = await useHint();
    if (!success) return false;

    const toRemove = wrongIndices[Math.floor(Math.random() * wrongIndices.length)];
    setEliminated(prev => new Set([...prev, toRemove]));
    return true;
  }, [hints, eliminated, useHint]);

  return (
    <HintContext.Provider value={{ hints, eliminated, resetEliminated, requestElimination, getResetTimeRemaining }}>
      {children}
    </HintContext.Provider>
  );
}

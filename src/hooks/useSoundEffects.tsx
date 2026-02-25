import { useCallback } from "react";
import {
  playClick,
  playCorrect,
  playIncorrect,
  playReward,
  playLevelUp,
  playLessonComplete,
  playGameWin,
  playStreak,
  playNav,
  playError,
  playTradeExecuted,
  isSoundEnabled,
  setSoundEnabled,
} from "@/lib/soundEffects";

export const useSoundEffects = () => {
  return {
    click: useCallback(playClick, []),
    correct: useCallback(playCorrect, []),
    incorrect: useCallback(playIncorrect, []),
    reward: useCallback(playReward, []),
    levelUp: useCallback(playLevelUp, []),
    lessonComplete: useCallback(playLessonComplete, []),
    gameWin: useCallback(playGameWin, []),
    streak: useCallback(playStreak, []),
    nav: useCallback(playNav, []),
    error: useCallback(playError, []),
    tradeExecuted: useCallback(playTradeExecuted, []),
    isEnabled: isSoundEnabled,
    setEnabled: setSoundEnabled,
  };
};

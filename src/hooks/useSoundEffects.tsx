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
  playSlideForward,
  playSlideBack,
  playMilestone,
  playSnap,
  playUnlock,
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
    slideForward: useCallback(playSlideForward, []),
    slideBack: useCallback(playSlideBack, []),
    milestone: useCallback(playMilestone, []),
    snap: useCallback(playSnap, []),
    unlock: useCallback(playUnlock, []),
    isEnabled: isSoundEnabled,
    setEnabled: setSoundEnabled,
  };
};

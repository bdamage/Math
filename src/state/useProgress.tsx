import { createContext, useContext, useState, type ReactNode } from "react";
import {
  MathProgress,
  addPoints,
  saveProgress,
  loadProgress,
  logPracticeSession,
  resetProgress,
  unlockItem,
  updateSkillProgress,
  spendCoins
} from "./progressManager";
import { evaluateAchievements } from "./achievements";

type ProgressContextValue = {
  progress: MathProgress;
  addPoints: (amount: number) => void;
  updateSkill: (skill: Parameters<typeof updateSkillProgress>[1], correct: number, total: number, table?: number) => void;
  logSession: (params: Parameters<typeof logPracticeSession>[1]) => void;
  unlockItem: (itemId: string) => void;
  spendCoins: (amount: number) => void;
  reset: () => void;
};

const ProgressContext = createContext<ProgressContextValue | undefined>(undefined);

export const ProgressProvider = ({ children }: { children: ReactNode }) => {
  const [progress, setProgress] = useState<MathProgress>(() => loadProgress());

  const withAchievements = (
    next: MathProgress,
    skill: Parameters<typeof updateSkillProgress>[1],
    table?: number
  ) => {
    const newlyUnlocked = evaluateAchievements(next, { skill, streak: next.streakDays, table });
    if (newlyUnlocked.length) {
      next = {
        ...next,
        achievements: Array.from(new Set([...next.achievements, ...newlyUnlocked]))
      };
      saveProgress(next);
    }
    return next;
  };

  const handleAddPoints = (amount: number) =>
    setProgress((prev) => withAchievements(addPoints(prev, amount), "addition"));

  const handleUpdateSkill = (
    skill: Parameters<typeof updateSkillProgress>[1],
    correct: number,
    total: number,
    table?: number
  ) =>
    setProgress((prev) => withAchievements(updateSkillProgress(prev, skill, correct, total, table), skill, table));

  const handleLogSession = (params: Parameters<typeof logPracticeSession>[1]) =>
    setProgress((prev) => withAchievements(logPracticeSession(prev, params), params.skill, params.table));

  const handleUnlockItem = (itemId: string) =>
    setProgress((prev) => withAchievements(unlockItem(prev, itemId), "addition"));

  const handleReset = () => setProgress(() => resetProgress());
  const handleSpendCoins = (amount: number) =>
    setProgress((prev) => withAchievements(spendCoins(prev, amount), "addition"));

  return (
    <ProgressContext.Provider
      value={{
        progress,
        addPoints: handleAddPoints,
        updateSkill: handleUpdateSkill,
        logSession: handleLogSession,
        unlockItem: handleUnlockItem,
        spendCoins: handleSpendCoins,
        reset: handleReset
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used within ProgressProvider");
  return ctx;
};

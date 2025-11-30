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
  spendCoins,
  getDailyChallenge,
  updateDailyChallenge
} from "./progressManager";
import { evaluateAchievements, checkPerfectRound } from "./achievements";

type ProgressContextValue = {
  progress: MathProgress;
  addPoints: (amount: number) => void;
  updateSkill: (skill: Parameters<typeof updateSkillProgress>[1], correct: number, total: number, table?: number) => void;
  logSession: (params: Parameters<typeof logPracticeSession>[1]) => void;
  unlockItem: (itemId: string) => void;
  spendCoins: (amount: number) => void;
  reset: () => void;
  getDailyChallenge: () => MathProgress["dailyChallenge"];
  updateDailyChallenge: (skill: Parameters<typeof updateDailyChallenge>[1], questionsCompleted: number) => void;
};

const ProgressContext = createContext<ProgressContextValue | undefined>(undefined);

export const ProgressProvider = ({ children }: { children: ReactNode }) => {
  const [progress, setProgress] = useState<MathProgress>(() => loadProgress());

  const withAchievements = (
    next: MathProgress,
    skill: Parameters<typeof updateSkillProgress>[1],
    table?: number
  ) => {
    const newlyUnlocked = evaluateAchievements(next, { skill, table });
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
    setProgress((prev) => {
      let next = logPracticeSession(prev, params);
      // Check for perfect round achievement
      const perfectUnlocked = checkPerfectRound(next, params.correct, params.total);
      if (perfectUnlocked.length) {
        next = {
          ...next,
          achievements: Array.from(new Set([...next.achievements, ...perfectUnlocked]))
        };
        saveProgress(next);
      }
      return withAchievements(next, params.skill, params.table);
    });

  const handleUnlockItem = (itemId: string) =>
    setProgress((prev) => withAchievements(unlockItem(prev, itemId), "addition"));

  const handleReset = () => setProgress(() => resetProgress());
  const handleSpendCoins = (amount: number) =>
    setProgress((prev) => withAchievements(spendCoins(prev, amount), "addition"));
  
  const handleGetDailyChallenge = () => getDailyChallenge(progress);
  const handleUpdateDailyChallenge = (skill: Parameters<typeof updateDailyChallenge>[1], questionsCompleted: number) =>
    setProgress((prev) => updateDailyChallenge(prev, skill, questionsCompleted));

  return (
    <ProgressContext.Provider
      value={{
        progress,
        addPoints: handleAddPoints,
        updateSkill: handleUpdateSkill,
        logSession: handleLogSession,
        unlockItem: handleUnlockItem,
        spendCoins: handleSpendCoins,
        reset: handleReset,
        getDailyChallenge: handleGetDailyChallenge,
        updateDailyChallenge: handleUpdateDailyChallenge
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

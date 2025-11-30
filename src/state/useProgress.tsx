import { createContext, useContext, useState, type ReactNode } from "react";
import {
  MathProgress,
  addPoints,
  loadProgress,
  logPracticeSession,
  resetProgress,
  unlockItem,
  updateSkillProgress
} from "./progressManager";

type ProgressContextValue = {
  progress: MathProgress;
  addPoints: (amount: number) => void;
  updateSkill: (skill: Parameters<typeof updateSkillProgress>[1], correct: number, total: number, table?: number) => void;
  logSession: (params: Parameters<typeof logPracticeSession>[1]) => void;
  unlockItem: (itemId: string) => void;
  reset: () => void;
};

const ProgressContext = createContext<ProgressContextValue | undefined>(undefined);

export const ProgressProvider = ({ children }: { children: ReactNode }) => {
  const [progress, setProgress] = useState<MathProgress>(() => loadProgress());

  const save = (next: MathProgress) => {
    setProgress(next);
  };

  const handleAddPoints = (amount: number) => save(addPoints(progress, amount));
  const handleUpdateSkill = (
    skill: Parameters<typeof updateSkillProgress>[1],
    correct: number,
    total: number,
    table?: number
  ) => save(updateSkillProgress(progress, skill, correct, total, table));
  const handleLogSession = (params: Parameters<typeof logPracticeSession>[1]) =>
    save(logPracticeSession(progress, params));
  const handleUnlockItem = (itemId: string) => save(unlockItem(progress, itemId));
  const handleReset = () => save(resetProgress());

  return (
    <ProgressContext.Provider
      value={{
        progress,
        addPoints: handleAddPoints,
        updateSkill: handleUpdateSkill,
        logSession: handleLogSession,
        unlockItem: handleUnlockItem,
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

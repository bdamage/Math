export type SkillKey = "addition" | "subtraction" | "multiplication" | "division";

export type SkillProgress = {
  level: number;
  correctAnswers: number;
  totalAnswers: number;
};

export type TableProgress = {
  correct: number;
  total: number;
  mastered: boolean;
};

export type MathProgress = {
  points: number;
  coins: number;
  streakDays: number;
  lastPracticeDate: string | null;
  skills: {
    addition: SkillProgress;
    subtraction: SkillProgress;
    multiplication: SkillProgress & {
      tables: { [table: number]: TableProgress };
    };
    division: SkillProgress;
  };
  room: {
    ownedItems: string[];
    placedItems: { id: string; x: number; y: number }[];
  };
  achievements: string[];
};

const STORAGE_KEY = "mathQuestProgress";

const defaultSkill = (): SkillProgress => ({
  level: 1,
  correctAnswers: 0,
  totalAnswers: 0
});

const defaultProgress = (): MathProgress => ({
  points: 0,
  coins: 0,
  streakDays: 0,
  lastPracticeDate: null,
  skills: {
    addition: defaultSkill(),
    subtraction: defaultSkill(),
    multiplication: { ...defaultSkill(), tables: {} },
    division: defaultSkill()
  },
  room: {
    ownedItems: [],
    placedItems: []
  },
  achievements: []
});

export const loadProgress = (): MathProgress => {
  if (typeof localStorage === "undefined") return defaultProgress();
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return defaultProgress();
    const parsed = JSON.parse(data) as MathProgress;
    return {
      ...defaultProgress(),
      ...parsed,
      skills: {
        ...defaultProgress().skills,
        ...parsed.skills,
        multiplication: {
          ...defaultSkill(),
          ...parsed.skills?.multiplication,
          tables: parsed.skills?.multiplication?.tables || {}
        }
      }
    };
  } catch (e) {
    console.warn("Failed to load progress", e);
    return defaultProgress();
  }
};

export const saveProgress = (progress: MathProgress) => {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
};

export const addPoints = (progress: MathProgress, amount: number): MathProgress => {
  const updated = { ...progress, points: progress.points + amount, coins: progress.coins + amount };
  saveProgress(updated);
  return updated;
};

export const spendCoins = (progress: MathProgress, amount: number): MathProgress => {
  const updated = { ...progress, coins: Math.max(0, progress.coins - amount) };
  saveProgress(updated);
  return updated;
};

export const updateSkillProgress = (
  progress: MathProgress,
  skill: SkillKey,
  correctDelta: number,
  totalDelta: number,
  table?: number
): MathProgress => {
  const next: MathProgress = JSON.parse(JSON.stringify(progress));
  const skillProgress = next.skills[skill];

  skillProgress.correctAnswers += correctDelta;
  skillProgress.totalAnswers += totalDelta;
  skillProgress.level = Math.max(1, 1 + Math.floor(skillProgress.correctAnswers / 20));

  if (skill === "multiplication" && table !== undefined) {
    const tables = next.skills.multiplication.tables;
    const existing = tables[table] || { correct: 0, total: 0, mastered: false };
    const updated: TableProgress = {
      correct: existing.correct + correctDelta,
      total: existing.total + totalDelta,
      mastered: existing.mastered || existing.correct + correctDelta >= 20
    };
    tables[table] = updated;
  }

  saveProgress(next);
  return next;
};

export const unlockItem = (progress: MathProgress, itemId: string): MathProgress => {
  if (progress.room.ownedItems.includes(itemId)) return progress;
  const updated = {
    ...progress,
    room: { ...progress.room, ownedItems: [...progress.room.ownedItems, itemId] }
  };
  saveProgress(updated);
  return updated;
};

export const logPracticeSession = (
  progress: MathProgress,
  { correct, total, skill, table }: { correct: number; total: number; skill: SkillKey; table?: number }
): MathProgress => {
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  let streakDays = progress.streakDays;
  if (progress.lastPracticeDate !== today) streakDays += 1;
  const updated = updateSkillProgress(
    { ...progress, lastPracticeDate: today, streakDays },
    skill,
    correct,
    total,
    table
  );
  return updated;
};

export const resetProgress = (): MathProgress => {
  const base = defaultProgress();
  saveProgress(base);
  return base;
};

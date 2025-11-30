export type SkillKey =
  | "addition"
  | "subtraction"
  | "multiplication"
  | "division";

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
      tables: {[table: number]: TableProgress};
    };
    division: SkillProgress;
  };
  room: {
    ownedItems: string[];
    placedItems: {id: string; x: number; y: number}[];
    background: string;
  };
  avatar: {
    skinColor: string;
    hairStyle: string;
    hairColor: string;
    outfit: string;
    accessory?: string;
  };
  achievements: string[];
  dailyChallenge: {
    date: string;
    completed: boolean;
    progress: number;
    target: number;
    skill: SkillKey;
    reward: number;
  } | null;
};

const STORAGE_KEY = "mathQuestProgress";

const defaultSkill = (): SkillProgress => ({
  level: 1,
  correctAnswers: 0,
  totalAnswers: 0,
});

const defaultProgress = (): MathProgress => ({
  points: 0,
  coins: 0,
  streakDays: 0,
  lastPracticeDate: null,
  skills: {
    addition: defaultSkill(),
    subtraction: defaultSkill(),
    multiplication: {...defaultSkill(), tables: {}},
    division: defaultSkill(),
  },
  room: {
    ownedItems: [],
    placedItems: [],
    background: "default",
  },
  avatar: {
    skinColor: "#FFDFC4",
    hairStyle: "bob",
    hairColor: "#8D5524",
    outfit: "tshirt",
  },
  achievements: [],
  dailyChallenge: null,
});

export const loadProgress = (): MathProgress => {
  if (typeof localStorage === "undefined") return defaultProgress();
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return defaultProgress();
    const parsed = JSON.parse(data) as MathProgress;
    const def = defaultProgress();
    return {
      ...def,
      ...parsed,
      skills: {
        ...def.skills,
        ...parsed.skills,
        multiplication: {
          ...defaultSkill(),
          ...parsed.skills?.multiplication,
          tables: parsed.skills?.multiplication?.tables || {},
        },
      },
      room: {
        ...def.room,
        ...parsed.room,
      },
      avatar: {
        ...def.avatar,
        ...parsed.avatar,
      },
      dailyChallenge: parsed.dailyChallenge || null,
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

export const addPoints = (
  progress: MathProgress,
  amount: number
): MathProgress => {
  const updated = {
    ...progress,
    points: progress.points + amount,
    coins: progress.coins + amount,
  };
  saveProgress(updated);
  return updated;
};

export const spendCoins = (
  progress: MathProgress,
  amount: number
): MathProgress => {
  const updated = {...progress, coins: Math.max(0, progress.coins - amount)};
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
  skillProgress.level = Math.max(
    1,
    1 + Math.floor(skillProgress.correctAnswers / 20)
  );

  if (skill === "multiplication" && table !== undefined) {
    const tables = next.skills.multiplication.tables;
    const existing = tables[table] || {correct: 0, total: 0, mastered: false};
    const updated: TableProgress = {
      correct: existing.correct + correctDelta,
      total: existing.total + totalDelta,
      mastered: existing.mastered || existing.correct + correctDelta >= 20,
    };
    tables[table] = updated;
  }

  saveProgress(next);
  return next;
};

export const unlockItem = (
  progress: MathProgress,
  itemId: string
): MathProgress => {
  if (progress.room.ownedItems.includes(itemId)) return progress;
  const updated = {
    ...progress,
    room: {...progress.room, ownedItems: [...progress.room.ownedItems, itemId]},
  };
  saveProgress(updated);
  return updated;
};

export const logPracticeSession = (
  progress: MathProgress,
  {
    correct,
    total,
    skill,
    table,
    perfect,
  }: {
    correct: number;
    total: number;
    skill: SkillKey;
    table?: number;
    perfect?: boolean;
  }
): MathProgress => {
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  let streakDays = progress.streakDays;

  if (progress.lastPracticeDate !== today) {
    // Check if it's a consecutive day
    if (progress.lastPracticeDate) {
      const lastDate = new Date(progress.lastPracticeDate);
      const todayDate = new Date(today);
      const diffTime = todayDate.getTime() - lastDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        // Consecutive day - increment streak
        streakDays += 1;
      } else if (diffDays > 1) {
        // Missed days - reset streak
        streakDays = 1;
      }
      // If diffDays === 0, same day - don't change streak
    } else {
      // First practice ever
      streakDays = 1;
    }
  }

  const updated = updateSkillProgress(
    {...progress, lastPracticeDate: today, streakDays},
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

// Daily challenge functions
export const generateDailyChallenge = (): MathProgress["dailyChallenge"] => {
  const skills: SkillKey[] = [
    "addition",
    "subtraction",
    "multiplication",
    "division",
  ];
  const skill = skills[Math.floor(Math.random() * skills.length)];
  const today = new Date().toISOString().slice(0, 10);

  return {
    date: today,
    completed: false,
    progress: 0,
    target: 10,
    skill,
    reward: 50,
  };
};

export const getDailyChallenge = (
  progress: MathProgress
): MathProgress["dailyChallenge"] => {
  const today = new Date().toISOString().slice(0, 10);

  // If no challenge or challenge is from a different day, generate new one
  if (!progress.dailyChallenge || progress.dailyChallenge.date !== today) {
    return generateDailyChallenge();
  }

  return progress.dailyChallenge;
};

export const updateDailyChallenge = (
  progress: MathProgress,
  skill: SkillKey,
  questionsCompleted: number
): MathProgress => {
  const challenge = getDailyChallenge(progress);

  if (!challenge || challenge.completed || challenge.skill !== skill) {
    return progress;
  }

  const newProgress = Math.min(
    challenge.progress + questionsCompleted,
    challenge.target
  );
  const completed = newProgress >= challenge.target;

  const updated: MathProgress = {
    ...progress,
    dailyChallenge: {
      ...challenge,
      progress: newProgress,
      completed,
    },
  };

  // Award coins if just completed
  if (completed && challenge.progress < challenge.target) {
    updated.coins += challenge.reward;
    updated.points += challenge.reward;
  }

  saveProgress(updated);
  return updated;
};

export const updateRoomLayout = (
  progress: MathProgress,
  placedItems: {id: string; x: number; y: number}[]
): MathProgress => {
  const next = {
    ...progress,
    room: {
      ...progress.room,
      placedItems,
    },
  };
  saveProgress(next);
  return next;
};

export const updateRoomBackground = (
  progress: MathProgress,
  background: string
): MathProgress => {
  const next = {
    ...progress,
    room: {
      ...progress.room,
      background,
    },
  };
  saveProgress(next);
  return next;
};

export const updateAvatar = (
  progress: MathProgress,
  avatar: Partial<MathProgress["avatar"]>
): MathProgress => {
  const next = {
    ...progress,
    avatar: {
      ...progress.avatar,
      ...avatar,
    },
  };
  saveProgress(next);
  return next;
};

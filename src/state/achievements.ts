import {MathProgress, SkillKey} from "./progressManager";

export type Achievement = {
  id: string;
  title: string;
  description: string;
  medalVariant:
    | "star"
    | "trophy"
    | "crown"
    | "target"
    | "lightning"
    | "book"
    | "palette";
  medalTier: "bronze" | "silver" | "gold" | "platinum";
};

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first-correct",
    title: "First Spark",
    description: "Answered your first question.",
    medalVariant: "star",
    medalTier: "bronze",
  },
  {
    id: "combo-10",
    title: "Combo Wizard",
    description: "10 days streak.",
    medalVariant: "lightning",
    medalTier: "silver",
  },
  {
    id: "mul-master-2",
    title: "Multiplication Master 2×",
    description: "20 correct in the 2 times table.",
    medalVariant: "trophy",
    medalTier: "bronze",
  },
  {
    id: "mul-master-5",
    title: "Multiplication Master 5×",
    description: "20 correct in the 5 times table.",
    medalVariant: "trophy",
    medalTier: "silver",
  },
  {
    id: "mul-master-10",
    title: "Multiplication Master 10×",
    description: "20 correct in the 10 times table.",
    medalVariant: "trophy",
    medalTier: "gold",
  },
  {
    id: "hundred-club",
    title: "Century Club",
    description: "Earn 100 points total.",
    medalVariant: "target",
    medalTier: "bronze",
  },
  {
    id: "rich-learner",
    title: "Rich Learner",
    description: "Collect 200 coins.",
    medalVariant: "crown",
    medalTier: "gold",
  },
  {
    id: "level-5",
    title: "Rising Star",
    description: "Reach level 5 in any skill.",
    medalVariant: "star",
    medalTier: "silver",
  },
  {
    id: "perfect-round",
    title: "Perfect Round",
    description: "Get 10/10 in a practice round.",
    medalVariant: "target",
    medalTier: "gold",
  },
  {
    id: "early-bird",
    title: "Early Bird",
    description: "Practice 3 days in a row.",
    medalVariant: "book",
    medalTier: "bronze",
  },
  {
    id: "dedicated",
    title: "Dedicated Student",
    description: "Practice 7 days in a row.",
    medalVariant: "book",
    medalTier: "silver",
  },
  {
    id: "room-decorator",
    title: "Room Decorator",
    description: "Buy 3 room items.",
    medalVariant: "palette",
    medalTier: "bronze",
  },
  {
    id: "all-tables",
    title: "Table Master",
    description: "Master all multiplication tables 2-10.",
    medalVariant: "crown",
    medalTier: "platinum",
  },
];

export const evaluateAchievements = (
  progress: MathProgress,
  {skill, table}: {skill: SkillKey; table?: number}
): string[] => {
  const unlocked: string[] = [];

  // First achievement
  if (!progress.achievements.includes("first-correct") && progress.points > 0) {
    unlocked.push("first-correct");
  }

  // Streak achievements
  if (
    !progress.achievements.includes("early-bird") &&
    progress.streakDays >= 3
  ) {
    unlocked.push("early-bird");
  }
  if (
    !progress.achievements.includes("dedicated") &&
    progress.streakDays >= 7
  ) {
    unlocked.push("dedicated");
  }
  if (
    !progress.achievements.includes("combo-10") &&
    progress.streakDays >= 10
  ) {
    unlocked.push("combo-10");
  }

  // Points and coins achievements
  if (
    !progress.achievements.includes("hundred-club") &&
    progress.points >= 100
  ) {
    unlocked.push("hundred-club");
  }
  if (
    !progress.achievements.includes("rich-learner") &&
    progress.coins >= 200
  ) {
    unlocked.push("rich-learner");
  }

  // Level achievements
  const skills = Object.values(progress.skills);
  if (
    !progress.achievements.includes("level-5") &&
    skills.some((s) => s.level >= 5)
  ) {
    unlocked.push("level-5");
  }

  // Room achievements
  if (
    !progress.achievements.includes("room-decorator") &&
    progress.room.ownedItems.length >= 3
  ) {
    unlocked.push("room-decorator");
  }

  // Multiplication table achievements
  if (skill === "multiplication" && table !== undefined) {
    const tableData = progress.skills.multiplication.tables[table];

    if (
      !progress.achievements.includes("mul-master-2") &&
      table === 2 &&
      tableData?.correct >= 20
    ) {
      unlocked.push("mul-master-2");
    }
    if (
      !progress.achievements.includes("mul-master-5") &&
      table === 5 &&
      tableData?.correct >= 20
    ) {
      unlocked.push("mul-master-5");
    }
    if (
      !progress.achievements.includes("mul-master-10") &&
      table === 10 &&
      tableData?.correct >= 20
    ) {
      unlocked.push("mul-master-10");
    }

    // Check if all tables 2-10 are mastered
    const allTablesMastered = [2, 3, 4, 5, 6, 7, 8, 9, 10].every(
      (t) => progress.skills.multiplication.tables[t]?.mastered
    );
    if (!progress.achievements.includes("all-tables") && allTablesMastered) {
      unlocked.push("all-tables");
    }
  }

  return unlocked;
};

// New function to check for perfect round achievement
export const checkPerfectRound = (
  progress: MathProgress,
  correct: number,
  total: number
): string[] => {
  const unlocked: string[] = [];
  if (
    !progress.achievements.includes("perfect-round") &&
    correct === total &&
    total >= 10
  ) {
    unlocked.push("perfect-round");
  }
  return unlocked;
};

import { MathProgress, SkillKey } from "./progressManager";

export type Achievement = {
  id: string;
  title: string;
  description: string;
};

export const ACHIEVEMENTS: Achievement[] = [
  { id: "first-correct", title: "First Spark", description: "Answered your first question." },
  { id: "combo-10", title: "Combo Wizard", description: "10 correct answers in a row." },
  { id: "mul-master-2", title: "Multiplication Master 2×", description: "20 correct in the 2 times table." }
];

export const evaluateAchievements = (
  progress: MathProgress,
  { skill, streak, table }: { skill: SkillKey; streak: number; table?: number }
): string[] => {
  const unlocked: string[] = [];
  if (!progress.achievements.includes("first-correct") && progress.points > 0) unlocked.push("first-correct");
  if (!progress.achievements.includes("combo-10") && streak >= 10) unlocked.push("combo-10");
  if (
    !progress.achievements.includes("mul-master-2") &&
    skill === "multiplication" &&
    table === 2 &&
    progress.skills.multiplication.tables[2]?.correct >= 20
  ) {
    unlocked.push("mul-master-2");
  }
  return unlocked;
};

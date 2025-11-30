export type Skill = "addition" | "subtraction" | "multiplication" | "division";
export type Difficulty = "easy" | "medium" | "hard";

export type Question = {
  prompt: string;
  answer: number;
  choices: number[];
};

const range = (n: number) => Array.from({length: n}, (_, i) => i);

export const generateQuestion = (
  skill: Skill,
  difficulty: Difficulty,
  table?: number
): Question => {
  const max = difficulty === "easy" ? 10 : difficulty === "medium" ? 20 : 50;
  let a = random(0, max);
  let b = random(1, max);

  if (skill === "multiplication" && table !== undefined) {
    a = table;
    b = random(0, 12);
  }

  // Special handling for subtraction to avoid negative results
  if (skill === "subtraction" && a < b) {
    [a, b] = [b, a]; // Swap so larger number comes first
  }

  // Special handling for division to ensure clean results
  if (skill === "division") {
    b = random(1, Math.max(1, Math.floor(max / 2))); // Ensure divisor isn't too large
    const quotient = random(1, Math.floor(max / b));
    a = quotient * b; // Make a evenly divisible by b
  }

  const answer = compute(skill, a, b);
  const prompt = formatPrompt(skill, a, b);
  const choices = shuffle([answer, ...uniqueGuesses(answer, max)]);

  return {prompt, answer, choices};
};

const compute = (skill: Skill, a: number, b: number): number => {
  switch (skill) {
    case "addition":
      return a + b;
    case "subtraction":
      return a - b;
    case "multiplication":
      return a * b;
    case "division":
      return Math.floor(a / b);
    default:
      return 0;
  }
};

const formatPrompt = (skill: Skill, a: number, b: number) => {
  const symbol =
    skill === "addition"
      ? "+"
      : skill === "subtraction"
      ? "−"
      : skill === "multiplication"
      ? "×"
      : "÷";
  return `${a} ${symbol} ${b} = ?`;
};

const uniqueGuesses = (answer: number, max: number): number[] => {
  const guesses = new Set<number>();
  while (guesses.size < 3) {
    const guess = answer + random(-5, 5);
    if (guess !== answer && guess >= 0 && guess <= max * 2) guesses.add(guess);
  }
  return Array.from(guesses);
};

const random = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const shuffle = <T>(arr: T[]): T[] => {
  return arr
    .map((item) => ({item, sort: Math.random()}))
    .sort((a, b) => a.sort - b.sort)
    .map(({item}) => item);
};

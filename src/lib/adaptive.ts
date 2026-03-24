import { Difficulty } from "./types";

const DIFFICULTY_ORDER: Difficulty[] = ["easy", "medium", "hard"];

export function getNextDifficulty(
  currentDifficulty: Difficulty,
  consecutiveCorrect: number,
  lastWasCorrect: boolean
): Difficulty {
  const currentIndex = DIFFICULTY_ORDER.indexOf(currentDifficulty);

  if (!lastWasCorrect) {
    return DIFFICULTY_ORDER[Math.max(0, currentIndex - 1)];
  }

  if (consecutiveCorrect >= 2) {
    return DIFFICULTY_ORDER[Math.min(DIFFICULTY_ORDER.length - 1, currentIndex + 1)];
  }

  return currentDifficulty;
}

export function isCorrect(score: number): boolean {
  return score >= 60;
}

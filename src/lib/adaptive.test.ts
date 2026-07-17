import { describe, expect, it } from "vitest";

import { advanceAdaptiveState } from "./adaptive";
import { evaluateAnswer } from "./evaluator";
import type { Question } from "./types";

const question: Question = {
  id: "adaptive-1",
  mode: "backend",
  difficulty: "medium",
  question: "How would you protect an API?",
  hints: [],
  expectedKeywords: ["authentication"],
  followUp: "What would you monitor?",
  topic: "API security",
};

describe("advanceAdaptiveState", () => {
  it("does not treat abstention as a wrong answer or reset the streak", () => {
    const abstained = evaluateAnswer(question, "too short");

    expect(advanceAdaptiveState("medium", 1, abstained)).toEqual({
      difficulty: "medium",
      consecutiveCorrect: 1,
    });
  });

  it("still adapts after a scored response", () => {
    const scored = evaluateAnswer(
      question,
      "Authentication protects every request at the service boundary.",
    );

    expect(advanceAdaptiveState("medium", 1, scored)).toEqual({
      difficulty: "hard",
      consecutiveCorrect: 2,
    });
  });
});

import { describe, expect, it } from "vitest";

import { evaluateAnswer } from "./evaluator";
import { calculateOverallScore } from "./session-metrics";
import type { Question } from "./types";

const question: Question = {
  id: "score-1",
  mode: "backend",
  difficulty: "medium",
  question: "How would you protect an API?",
  hints: [],
  expectedKeywords: ["authentication", "validation"],
  followUp: "What would you monitor?",
  topic: "API security",
};

describe("calculateOverallScore", () => {
  it("excludes abstained answers from the aggregate score", () => {
    const complete = evaluateAnswer(
      question,
      "Authentication and validation protect every request at the boundary.",
    );
    const partial = evaluateAnswer(
      question,
      "Authentication protects each request with enough supporting context.",
    );
    const abstained = evaluateAnswer(question, "too short");

    expect(calculateOverallScore([complete, abstained, partial])).toBe(75);
  });

  it("returns no score when every answer abstains", () => {
    expect(
      calculateOverallScore([
        evaluateAnswer(question, "too short"),
        evaluateAnswer(question, "still short"),
      ]),
    ).toBeNull();
  });
});

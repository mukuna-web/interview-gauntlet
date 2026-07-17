import { describe, expect, it } from "vitest";

import { applyHumanReview, evaluateAnswer } from "./evaluator";
import type { Question } from "./types";

const question: Question = {
  id: "q1",
  mode: "backend",
  difficulty: "medium",
  question: "How would you protect an API?",
  hints: [],
  expectedKeywords: ["rate limiting", "authentication", "validation"],
  followUp: "What would you monitor?",
  topic: "API security",
};

describe("evaluateAnswer", () => {
  it("abstains when the answer is too short to evaluate", () => {
    const result = evaluateAnswer(question, "rate limiting");

    expect(result.status).toBe("abstained");
    expect(result.reviewStatus).toBe("not_reviewable");
    expect(result.score).toBeNull();
    expect(result.explanation.minimumWords).toBeGreaterThan(2);
  });

  it("explains a deterministic score and requires review", () => {
    const result = evaluateAnswer(
      question,
      "I would use authentication, rate limiting, and strict validation at every boundary.",
    );

    expect(result.status).toBe("scored");
    expect(result.reviewStatus).toBe("needs_review");
    expect(result.score).toBe(100);
    expect(result.explanation.formula).toContain("matched concepts");
    expect(result.matchedKeywords).toEqual([
      "rate limiting",
      "authentication",
      "validation",
    ]);
  });

  it("does not change the score when identity-only text is added", () => {
    const answer = "Authentication and validation protect the service from unsafe requests.";
    const baseline = evaluateAnswer(question, answer);
    const counterfactual = evaluateAnswer(question, `My name is Priya. ${answer}`);

    expect(counterfactual.score).toBe(baseline.score);
    expect(counterfactual.matchedKeywords).toEqual(baseline.matchedKeywords);
  });

  it("does not let an identity-only prefix satisfy the evidence threshold", () => {
    const baseline = evaluateAnswer(question, "Authentication protects APIs.");
    const counterfactual = evaluateAnswer(
      question,
      "My name is Priya. Authentication protects APIs.",
    );

    expect(baseline.status).toBe("abstained");
    expect(counterfactual.status).toBe(baseline.status);
    expect(counterfactual.score).toBe(baseline.score);
    expect(counterfactual.explanation.observedWords).toBe(
      baseline.explanation.observedWords,
    );
  });

  it("abstains when a question has no scoring rubric", () => {
    const result = evaluateAnswer(
      { ...question, expectedKeywords: [] },
      "This answer has plenty of words but no usable rubric.",
    );

    expect(result.status).toBe("abstained");
    expect(result.score).toBeNull();
    expect(result.explanation.totalConcepts).toBe(0);
  });

  it.each([
    ["good", "Authentication and validation are important for every safe API request.", 67],
    ["partial", "Authentication is one useful control for every API request.", 33],
    ["needs depth", "Observability and encryption protect every production API request.", 0],
  ])("returns %s feedback for the relevant score band", (_label, answer, score) => {
    const result = evaluateAnswer(question, answer);

    expect(result.score).toBe(score);
    expect(result.feedback.length).toBeGreaterThan(10);
  });

  it("recognizes documented slash and hyphen variants", () => {
    const variantQuestion = {
      ...question,
      expectedKeywords: ["cache/caching", "rate limiting"],
    };
    const result = evaluateAnswer(
      variantQuestion,
      "Caching plus rate-limiting protects this API during large traffic spikes.",
    );

    expect(result.score).toBe(100);
  });

  it("adds the remaining concept to otherwise excellent feedback", () => {
    const expectedKeywords = ["one", "two", "three", "four", "five", "six", "seven"];
    const result = evaluateAnswer(
      { ...question, expectedKeywords },
      "one two three four five six are all discussed with enough supporting context",
    );

    expect(result.score).toBe(86);
    expect(result.feedback).toContain("seven");
  });

  it("names a matched concept even when the overall score needs depth", () => {
    const result = evaluateAnswer(
      { ...question, expectedKeywords: ["one", "two", "three", "four", "five", "six"] },
      "one is discussed with enough supporting technical context here",
    );

    expect(result.score).toBe(17);
    expect(result.feedback).toContain("You touched on one");
  });
});

describe("applyHumanReview", () => {
  it("records a named reviewer decision without mutating the score", () => {
    const evaluation = evaluateAnswer(
      question,
      "Authentication and validation protect the service from unsafe requests.",
    );
    const reviewed = applyHumanReview(evaluation, {
      reviewer: "Morgan",
      decision: "accepted",
      notes: "Reasonable coverage",
    });

    expect(reviewed.score).toBe(evaluation.score);
    expect(reviewed.reviewStatus).toBe("accepted");
    expect(reviewed.review?.reviewer).toBe("Morgan");
  });

  it("rejects review of an abstained answer", () => {
    const evaluation = evaluateAnswer(question, "too short");

    expect(() =>
      applyHumanReview(evaluation, { reviewer: "Morgan", decision: "accepted" }),
    ).toThrow(/not reviewable/);
  });

  it("requires a named reviewer and supports an omitted note", () => {
    const evaluation = evaluateAnswer(
      question,
      "Authentication and validation protect the service from unsafe requests.",
    );

    expect(() =>
      applyHumanReview(evaluation, { reviewer: "  ", decision: "accepted" }),
    ).toThrow(/identity is required/);

    const reviewed = applyHumanReview(evaluation, {
      reviewer: " Morgan ",
      decision: "changes_requested",
    });
    expect(reviewed.review?.reviewer).toBe("Morgan");
    expect(reviewed.review?.notes).toBe("");
  });
});

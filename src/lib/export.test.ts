import { afterEach, describe, expect, it, vi } from "vitest";

import { downloadSessionsCsv, sessionsToCsv } from "./export";
import type { AnswerEvaluation, InterviewSession, QuestionResult } from "./types";

function evaluation(
  status: AnswerEvaluation["status"],
  reviewStatus: AnswerEvaluation["reviewStatus"],
  score: number | null,
): AnswerEvaluation {
  return {
    status,
    reviewStatus,
    score,
    matchedKeywords: [],
    missedKeywords: [],
    feedback: "Synthetic feedback",
    explanation: {
      formula: status === "scored" ? "synthetic formula" : "abstained",
      matchedConcepts: 0,
      totalConcepts: 1,
      observedWords: status === "scored" ? 5 : 2,
      minimumWords: 5,
    },
  };
}

function result(answerEvaluation: AnswerEvaluation): QuestionResult {
  return {
    question: {
      id: "q1",
      mode: "backend",
      difficulty: "medium",
      question: "Synthetic question",
      hints: [],
      expectedKeywords: ["validation"],
      followUp: "Synthetic follow-up",
      topic: "API design",
    },
    userAnswer: "private answer text",
    evaluation: answerEvaluation,
    difficulty: "medium",
    timeSpent: 30,
    timedOut: false,
  };
}

const session: InterviewSession = {
  id: "session-1",
  mode: "backend",
  results: [
    result(evaluation("scored", "accepted", 75)),
    result(evaluation("scored", "changes_requested", 25)),
    result(evaluation("abstained", "not_reviewable", null)),
  ],
  overallScore: 50,
  startedAt: 1000,
  completedAt: 2000,
  difficultyProgression: ["medium"],
};

describe("sessionsToCsv", () => {
  it("exports an allowlisted aggregate schema", () => {
    const csv = sessionsToCsv([session]);

    expect(csv.split("\n")[0]).toBe(
      "session_id,mode,overall_score,questions,scored_questions,abstained_questions,reviewed_findings,accepted_findings,changes_requested_findings,pending_review_findings,finding_acceptance_rate_percent,started_at,completed_at",
    );
    expect(csv).toContain("session-1,backend,50,3,2,1,2,1,1,0,50");
    expect(csv).not.toContain("userAnswer");
    expect(csv).not.toContain("private answer text");
  });

  it("emits only the header for empty history", () => {
    expect(sessionsToCsv([]).split("\n")).toHaveLength(1);
  });

  it("escapes commas, quotes, and newlines in allowlisted values", () => {
    const csv = sessionsToCsv([
      { ...session, id: 'session,"one"\nnext' },
    ]);

    expect(csv).toContain('"session,""one""\nnext"');
  });
});

describe("downloadSessionsCsv", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("does nothing for empty history", () => {
    const createObjectURL = vi.fn();
    vi.stubGlobal("URL", { createObjectURL, revokeObjectURL: vi.fn() });

    downloadSessionsCsv([]);

    expect(createObjectURL).not.toHaveBeenCalled();
  });

  it("downloads and revokes a generated aggregate CSV", () => {
    const click = vi.fn();
    const anchor = { href: "", download: "", click };
    const createObjectURL = vi.fn(() => "blob:history");
    const revokeObjectURL = vi.fn();
    vi.stubGlobal("document", { createElement: vi.fn(() => anchor) });
    vi.stubGlobal("URL", { createObjectURL, revokeObjectURL });

    downloadSessionsCsv([session]);

    expect(anchor.href).toBe("blob:history");
    expect(anchor.download).toBe("interview-gauntlet-history.csv");
    expect(click).toHaveBeenCalledOnce();
    expect(revokeObjectURL).toHaveBeenCalledWith("blob:history");
  });
});

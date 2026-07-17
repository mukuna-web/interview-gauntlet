import type { AnswerEvaluation } from "./types";

export interface EvaluationSummary {
  scoredQuestions: number;
  abstainedQuestions: number;
  reviewedFindings: number;
  acceptedFindings: number;
  changesRequestedFindings: number;
  pendingReviewFindings: number;
  findingAcceptanceRatePercent: number | null;
}

export function calculateOverallScore(
  evaluations: AnswerEvaluation[],
): number | null {
  const scores = evaluations.flatMap((evaluation) =>
    evaluation.status === "scored" && evaluation.score !== null
      ? [evaluation.score]
      : [],
  );
  if (scores.length === 0) return null;
  return Math.round(scores.reduce((total, score) => total + score, 0) / scores.length);
}

export function summarizeEvaluations(
  evaluations: AnswerEvaluation[],
): EvaluationSummary {
  const scored = evaluations.filter(
    (evaluation) => evaluation.status === "scored" && evaluation.score !== null,
  );
  const accepted = scored.filter(
    (evaluation) => evaluation.reviewStatus === "accepted",
  ).length;
  const changesRequested = scored.filter(
    (evaluation) => evaluation.reviewStatus === "changes_requested",
  ).length;
  const reviewed = accepted + changesRequested;
  return {
    scoredQuestions: scored.length,
    abstainedQuestions: evaluations.length - scored.length,
    reviewedFindings: reviewed,
    acceptedFindings: accepted,
    changesRequestedFindings: changesRequested,
    pendingReviewFindings: scored.length - reviewed,
    findingAcceptanceRatePercent:
      reviewed > 0 ? Math.round((accepted / reviewed) * 10_000) / 100 : null,
  };
}

import type { InterviewSession } from "./types";
import { summarizeEvaluations } from "./session-metrics";

const FIELDS = [
  "session_id",
  "mode",
  "overall_score",
  "questions",
  "scored_questions",
  "abstained_questions",
  "reviewed_findings",
  "accepted_findings",
  "changes_requested_findings",
  "pending_review_findings",
  "finding_acceptance_rate_percent",
  "started_at",
  "completed_at",
] as const;

function escapeCell(value: string | number | null): string {
  if (value === null) return "";
  const text = String(value);
  return text.includes(",") || text.includes('"') || text.includes("\n")
    ? `"${text.replaceAll('"', '""')}"`
    : text;
}

export function sessionsToCsv(sessions: InterviewSession[]): string {
  const rows = sessions.map((session) => {
    const summary = summarizeEvaluations(
      session.results.map((result) => result.evaluation),
    );
    return [
      session.id,
      session.mode,
      session.overallScore,
      session.results.length,
      summary.scoredQuestions,
      summary.abstainedQuestions,
      summary.reviewedFindings,
      summary.acceptedFindings,
      summary.changesRequestedFindings,
      summary.pendingReviewFindings,
      summary.findingAcceptanceRatePercent,
      new Date(session.startedAt).toISOString(),
      new Date(session.completedAt).toISOString(),
    ]
      .map(escapeCell)
      .join(",");
  });
  return [FIELDS.join(","), ...rows].join("\n");
}

export function downloadSessionsCsv(sessions: InterviewSession[]): void {
  if (sessions.length === 0) return;
  const url = URL.createObjectURL(
    new Blob([sessionsToCsv(sessions)], { type: "text/csv;charset=utf-8" }),
  );
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "interview-gauntlet-history.csv";
  anchor.click();
  URL.revokeObjectURL(url);
}

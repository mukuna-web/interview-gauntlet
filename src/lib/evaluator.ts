import { Question, AnswerEvaluation } from "./types";

const MINIMUM_WORDS = 5;
const PUNCTUATED_IDENTITY_PREFIX =
  /^\s*my\s+name\s+is\s+[\p{L}\p{M}'-]+(?:\s+[\p{L}\p{M}'-]+){0,3}[.!,:;]\s*/iu;
const SINGLE_NAME_IDENTITY_PREFIX =
  /^\s*my\s+name\s+is\s+[\p{L}\p{M}'-]+\s+/iu;

export interface HumanReviewInput {
  reviewer: string;
  decision: "accepted" | "changes_requested";
  notes?: string;
}

export function stripIdentityOnlyPrefix(userAnswer: string): string {
  return userAnswer
    .replace(PUNCTUATED_IDENTITY_PREFIX, "")
    .replace(SINGLE_NAME_IDENTITY_PREFIX, "");
}

export function evaluateAnswer(question: Question, userAnswer: string): AnswerEvaluation {
  const answer = stripIdentityOnlyPrefix(userAnswer).toLowerCase();
  const observedWords = answer.trim() ? answer.trim().split(/\s+/).length : 0;
  const matched: string[] = [];
  const missed: string[] = [];

  for (const keyword of question.expectedKeywords) {
    const variants = keyword.toLowerCase().split("/");
    const found = variants.some(
      (v) => answer.includes(v) || answer.includes(v.replace(/ /g, "-")) || answer.includes(v.replace(/-/g, " "))
    );
    if (found) {
      matched.push(keyword);
    } else {
      missed.push(keyword);
    }
  }

  const totalKeywords = question.expectedKeywords.length;
  if (observedWords < MINIMUM_WORDS || totalKeywords === 0) {
    return {
      status: "abstained",
      reviewStatus: "not_reviewable",
      score: null,
      matchedKeywords: matched,
      missedKeywords: missed,
      feedback: `Not enough evidence to score this answer. Provide at least ${MINIMUM_WORDS} substantive words.`,
      explanation: {
        formula: "abstained: minimum evidence threshold not met",
        matchedConcepts: matched.length,
        totalConcepts: totalKeywords,
        observedWords,
        minimumWords: MINIMUM_WORDS,
      },
    };
  }

  const score = Math.round((matched.length / totalKeywords) * 100);

  let feedback: string;
  if (score >= 85) {
    feedback = `Excellent answer! You covered ${matched.length}/${totalKeywords} key concepts.`;
    if (missed.length > 0) {
      feedback += ` For a perfect score, also mention: ${missed.slice(0, 2).join(", ")}.`;
    }
  } else if (score >= 60) {
    feedback = `Good answer! You correctly identified: ${matched.slice(0, 3).join(", ")}.`;
    feedback += ` Consider also discussing: ${missed.slice(0, 3).join(", ")}.`;
  } else if (score >= 30) {
    feedback = `Partial answer. You mentioned: ${matched.length > 0 ? matched.join(", ") : "some relevant points"}.`;
    feedback += ` Key concepts missing: ${missed.slice(0, 4).join(", ")}.`;
  } else {
    feedback = `This answer needs more depth. Key concepts to cover: ${missed.slice(0, 5).join(", ")}.`;
    if (matched.length > 0) {
      feedback = `You touched on ${matched.join(", ")}, but ` + feedback.toLowerCase();
    }
  }

  return {
    status: "scored",
    reviewStatus: "needs_review",
    score,
    matchedKeywords: matched,
    missedKeywords: missed,
    feedback,
    explanation: {
      formula: "round(matched concepts / total expected concepts × 100)",
      matchedConcepts: matched.length,
      totalConcepts: totalKeywords,
      observedWords,
      minimumWords: MINIMUM_WORDS,
    },
  };
}

export function applyHumanReview(
  evaluation: AnswerEvaluation,
  input: HumanReviewInput,
): AnswerEvaluation {
  if (evaluation.reviewStatus === "not_reviewable") {
    throw new Error("abstained answers are not reviewable");
  }
  if (!input.reviewer.trim()) {
    throw new Error("reviewer identity is required");
  }
  return {
    ...evaluation,
    reviewStatus: input.decision,
    review: {
      reviewer: input.reviewer.trim(),
      decision: input.decision,
      notes: input.notes?.trim() ?? "",
      reviewedAt: new Date().toISOString(),
    },
  };
}

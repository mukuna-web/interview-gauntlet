import { Question, AnswerEvaluation } from "./types";

export function evaluateAnswer(question: Question, userAnswer: string): AnswerEvaluation {
  const answer = userAnswer.toLowerCase();
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
  const rawScore = totalKeywords > 0 ? (matched.length / totalKeywords) * 100 : 0;

  const lengthBonus = Math.min(10, Math.floor(answer.split(/\s+/).length / 10));
  const score = Math.min(100, Math.round(rawScore + lengthBonus));

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

  return { score, matchedKeywords: matched, missedKeywords: missed, feedback };
}

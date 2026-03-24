export type InterviewMode = "frontend" | "backend" | "system-design" | "dsa";
export type Difficulty = "easy" | "medium" | "hard";

export interface Question {
  id: string;
  mode: InterviewMode;
  difficulty: Difficulty;
  question: string;
  hints: string[];
  expectedKeywords: string[];
  followUp: string;
  topic: string;
}

export interface AnswerEvaluation {
  score: number;
  matchedKeywords: string[];
  missedKeywords: string[];
  feedback: string;
}

export interface QuestionResult {
  question: Question;
  userAnswer: string;
  evaluation: AnswerEvaluation;
  difficulty: Difficulty;
  timeSpent: number;
  timedOut: boolean;
}

export interface InterviewSession {
  id: string;
  mode: InterviewMode;
  results: QuestionResult[];
  overallScore: number;
  startedAt: number;
  completedAt: number;
  difficultyProgression: Difficulty[];
}

export const MODE_LABELS: Record<InterviewMode, string> = {
  frontend: "Frontend",
  backend: "Backend",
  "system-design": "System Design",
  dsa: "Data Structures & Algorithms",
};

export const MODE_EMOJIS: Record<InterviewMode, string> = {
  frontend: "🎨",
  backend: "⚙️",
  "system-design": "🏗️",
  dsa: "🧮",
};

export const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  easy: "#22c55e",
  medium: "#eab308",
  hard: "#ef4444",
};

export const DIFFICULTY_TIMES: Record<Difficulty, number> = {
  easy: 180,
  medium: 300,
  hard: 480,
};

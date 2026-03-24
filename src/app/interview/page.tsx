"use client";

import { useState, useCallback, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  InterviewMode, Difficulty, QuestionResult, InterviewSession,
  MODE_LABELS, MODE_EMOJIS, DIFFICULTY_COLORS, DIFFICULTY_TIMES,
} from "@/lib/types";
import { getRandomQuestion } from "@/lib/questions";
import { evaluateAnswer } from "@/lib/evaluator";
import { getNextDifficulty, isCorrect } from "@/lib/adaptive";
import { saveSession, generateSessionId } from "@/lib/session";
import Timer from "@/components/Timer";
import ProgressBar from "@/components/ProgressBar";

const TOTAL_QUESTIONS = 7;

function InterviewContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const mode = (searchParams.get("mode") || "frontend") as InterviewMode;

  const [phase, setPhase] = useState<"question" | "feedback" | "summary">("question");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
  const [results, setResults] = useState<QuestionResult[]>([]);
  const [usedIds, setUsedIds] = useState<string[]>([]);
  const [answer, setAnswer] = useState("");
  const [currentResult, setCurrentResult] = useState<QuestionResult | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [timerActive, setTimerActive] = useState(true);
  const [startTime, setStartTime] = useState(Date.now());
  const [sessionStart] = useState(Date.now());
  const [difficultyLog, setDifficultyLog] = useState<Difficulty[]>(["medium"]);
  const [currentQuestion, setCurrentQuestion] = useState<ReturnType<typeof getRandomQuestion>>(null);

  useEffect(() => {
    setCurrentQuestion(getRandomQuestion(mode, difficulty, usedIds));
    setStartTime(Date.now());
    setTimerActive(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionIndex, difficulty]);

  const submitAnswer = useCallback(
    (timedOut = false) => {
      if (!currentQuestion) return;
      setTimerActive(false);
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      const evaluation = evaluateAnswer(currentQuestion, timedOut ? "" : answer);

      const result: QuestionResult = {
        question: currentQuestion,
        userAnswer: timedOut ? "(timed out)" : answer,
        evaluation,
        difficulty,
        timeSpent,
        timedOut,
      };

      setCurrentResult(result);
      setUsedIds((prev) => [...prev, currentQuestion.id]);
      setPhase("feedback");
    },
    [currentQuestion, answer, difficulty, startTime]
  );

  const nextQuestion = () => {
    if (!currentResult) return;
    const newResults = [...results, currentResult];
    setResults(newResults);

    if (newResults.length >= TOTAL_QUESTIONS) {
      const overall = Math.round(newResults.reduce((s, r) => s + r.evaluation.score, 0) / newResults.length);
      const session: InterviewSession = {
        id: generateSessionId(),
        mode,
        results: newResults,
        overallScore: overall,
        startedAt: sessionStart,
        completedAt: Date.now(),
        difficultyProgression: difficultyLog,
      };
      saveSession(session);
      setPhase("summary");
      return;
    }

    const correct = isCorrect(currentResult.evaluation.score);
    const newConsec = correct ? consecutiveCorrect + 1 : 0;
    setConsecutiveCorrect(newConsec);
    const nextDiff = getNextDifficulty(difficulty, newConsec, correct);
    setDifficulty(nextDiff);
    setDifficultyLog((prev) => [...prev, nextDiff]);
    setQuestionIndex((i) => i + 1);
    setAnswer("");
    setCurrentResult(null);
    setShowHint(false);
    setPhase("question");
  };

  // Summary view
  if (phase === "summary") {
    const avgScore = Math.round(results.reduce((s, r) => s + r.evaluation.score, 0) / results.length);
    const topicScores: Record<string, { total: number; count: number }> = {};
    results.forEach((r) => {
      const t = r.question.topic;
      if (!topicScores[t]) topicScores[t] = { total: 0, count: 0 };
      topicScores[t].total += r.evaluation.score;
      topicScores[t].count++;
    });

    return (
      <div className="max-w-3xl mx-auto animate-fade-in">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">{avgScore >= 75 ? "🏆" : avgScore >= 50 ? "👍" : "📚"}</div>
          <h1 className="text-3xl font-bold text-white mb-2">Interview Complete</h1>
          <p className="text-gray-400">
            {MODE_EMOJIS[mode]} {MODE_LABELS[mode]} &middot; {results.length} questions
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-interview-card border border-interview-border rounded-xl p-4 text-center">
            <div className="text-3xl font-bold" style={{ color: avgScore >= 75 ? "#22c55e" : avgScore >= 50 ? "#eab308" : "#ef4444" }}>
              {avgScore}
            </div>
            <div className="text-xs text-gray-500 mt-1">Overall Score</div>
          </div>
          <div className="bg-interview-card border border-interview-border rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-interview-accent">
              {results.filter((r) => isCorrect(r.evaluation.score)).length}/{results.length}
            </div>
            <div className="text-xs text-gray-500 mt-1">Correct</div>
          </div>
          <div className="bg-interview-card border border-interview-border rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-purple-400">
              {difficultyLog[difficultyLog.length - 1]?.toUpperCase()}
            </div>
            <div className="text-xs text-gray-500 mt-1">Final Difficulty</div>
          </div>
        </div>

        {/* Difficulty progression */}
        <div className="bg-interview-card border border-interview-border rounded-xl p-4 mb-6">
          <h3 className="text-sm font-bold text-gray-400 mb-3">Difficulty Progression</h3>
          <div className="flex items-end gap-1 h-16">
            {difficultyLog.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full rounded-sm transition-all"
                  style={{
                    height: d === "easy" ? "20px" : d === "medium" ? "40px" : "60px",
                    backgroundColor: DIFFICULTY_COLORS[d],
                    opacity: 0.8,
                  }}
                />
                <span className="text-[9px] text-gray-600">Q{i + 1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Topic breakdown */}
        <div className="bg-interview-card border border-interview-border rounded-xl p-4 mb-6">
          <h3 className="text-sm font-bold text-gray-400 mb-3">Topic Breakdown</h3>
          <div className="space-y-2">
            {Object.entries(topicScores)
              .sort((a, b) => b[1].total / b[1].count - a[1].total / a[1].count)
              .map(([topic, data]) => {
                const avg = Math.round(data.total / data.count);
                return (
                  <div key={topic} className="flex items-center gap-3">
                    <span className="text-sm text-gray-300 w-40 truncate">{topic}</span>
                    <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${avg}%`,
                          backgroundColor: avg >= 75 ? "#22c55e" : avg >= 50 ? "#eab308" : "#ef4444",
                        }}
                      />
                    </div>
                    <span className="text-sm font-mono w-8 text-right" style={{ color: avg >= 75 ? "#22c55e" : avg >= 50 ? "#eab308" : "#ef4444" }}>
                      {avg}
                    </span>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Per-question results */}
        <div className="space-y-2 mb-8">
          <h3 className="text-sm font-bold text-gray-400 mb-3">Question Results</h3>
          {results.map((r, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-interview-card border border-interview-border rounded-lg">
              <span className="text-sm font-mono text-gray-500 w-6">Q{i + 1}</span>
              <span
                className="text-[10px] uppercase px-2 py-0.5 rounded-full font-bold"
                style={{ backgroundColor: `${DIFFICULTY_COLORS[r.difficulty]}20`, color: DIFFICULTY_COLORS[r.difficulty] }}
              >
                {r.difficulty}
              </span>
              <span className="text-sm text-gray-300 flex-1 truncate">{r.question.question}</span>
              <span
                className="font-mono font-bold text-sm"
                style={{ color: r.evaluation.score >= 60 ? "#22c55e" : "#ef4444" }}
              >
                {r.evaluation.score}
              </span>
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-4">
          <button onClick={() => router.push("/")} className="px-6 py-2.5 bg-interview-accent text-white font-bold rounded-xl hover:bg-blue-600 transition-all">
            New Interview
          </button>
          <button onClick={() => router.push("/history")} className="px-6 py-2.5 border border-interview-border text-gray-300 rounded-xl hover:bg-white/5 transition-all">
            View History
          </button>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="text-center py-20 text-gray-400">
        <p>No more questions available for this difficulty. Moving on...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="text-xl">{MODE_EMOJIS[mode]}</span>
          <span className="text-sm text-gray-400">{MODE_LABELS[mode]}</span>
          <span
            className="text-[10px] uppercase px-2 py-0.5 rounded-full font-bold"
            style={{ backgroundColor: `${DIFFICULTY_COLORS[difficulty]}20`, color: DIFFICULTY_COLORS[difficulty] }}
          >
            {difficulty}
          </span>
        </div>
        <Timer totalSeconds={DIFFICULTY_TIMES[difficulty]} onTimeUp={() => submitAnswer(true)} isActive={timerActive} />
      </div>

      <ProgressBar current={questionIndex} total={TOTAL_QUESTIONS} />

      {/* Question Phase */}
      {phase === "question" && (
        <div className="mt-6 animate-fade-in">
          <div className="bg-interview-card border border-interview-border rounded-xl p-6 mb-6">
            <div className="text-[10px] uppercase text-gray-500 mb-2 font-mono">{currentQuestion.topic}</div>
            <h2 className="text-xl text-white font-semibold leading-relaxed">{currentQuestion.question}</h2>
            {showHint && (
              <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-sm text-yellow-300 animate-fade-in">
                💡 {currentQuestion.hints[0]}
              </div>
            )}
          </div>

          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer here... Be thorough — mention key concepts, trade-offs, and examples."
            className="w-full h-40 bg-interview-card border border-interview-border rounded-xl p-4 text-gray-200 placeholder-gray-600 resize-none focus:outline-none focus:border-interview-accent transition-colors font-mono text-sm"
          />

          <div className="flex items-center justify-between mt-4">
            <button
              onClick={() => setShowHint(true)}
              disabled={showHint}
              className="text-sm text-gray-500 hover:text-yellow-400 transition-colors disabled:opacity-30"
            >
              💡 Show Hint
            </button>
            <button
              onClick={() => submitAnswer(false)}
              disabled={answer.trim().length < 10}
              className="px-6 py-2.5 bg-interview-accent text-white font-bold rounded-xl hover:bg-blue-600 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Submit Answer →
            </button>
          </div>
        </div>
      )}

      {/* Feedback Phase */}
      {phase === "feedback" && currentResult && (
        <div className="mt-6 animate-slide-up">
          <div className="bg-interview-card border border-interview-border rounded-xl p-6 mb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Your Score</h3>
              <div
                className="text-4xl font-bold"
                style={{
                  color: currentResult.evaluation.score >= 75 ? "#22c55e" : currentResult.evaluation.score >= 50 ? "#eab308" : "#ef4444",
                }}
              >
                {currentResult.evaluation.score}
              </div>
            </div>

            <p className="text-gray-300 mb-4">{currentResult.evaluation.feedback}</p>

            {currentResult.evaluation.matchedKeywords.length > 0 && (
              <div className="mb-3">
                <span className="text-xs text-gray-500">Concepts you covered:</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {currentResult.evaluation.matchedKeywords.map((k) => (
                    <span key={k} className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-400">{k}</span>
                  ))}
                </div>
              </div>
            )}

            {currentResult.evaluation.missedKeywords.length > 0 && (
              <div className="mb-3">
                <span className="text-xs text-gray-500">Concepts to improve:</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {currentResult.evaluation.missedKeywords.slice(0, 5).map((k) => (
                    <span key={k} className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-400">{k}</span>
                  ))}
                </div>
              </div>
            )}

            {currentResult.question.followUp && (
              <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <span className="text-xs text-blue-400 font-bold">Follow-up to consider:</span>
                <p className="text-sm text-blue-300 mt-1">{currentResult.question.followUp}</p>
              </div>
            )}
          </div>

          <div className="text-center">
            <button
              onClick={nextQuestion}
              className="px-8 py-3 bg-interview-accent text-white font-bold rounded-xl hover:bg-blue-600 transition-all"
            >
              {results.length + 1 >= TOTAL_QUESTIONS ? "See Results" : "Next Question →"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function InterviewPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-gray-500">Loading...</div>}>
      <InterviewContent />
    </Suspense>
  );
}

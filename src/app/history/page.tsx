"use client";

import { useEffect, useState } from "react";
import { InterviewSession, MODE_LABELS, MODE_EMOJIS, DIFFICULTY_COLORS } from "@/lib/types";
import { getSessions, clearSessions } from "@/lib/session";

export default function HistoryPage() {
  const [sessions, setSessions] = useState<InterviewSession[]>([]);

  useEffect(() => {
    setSessions(getSessions());
  }, []);

  const handleClear = () => {
    clearSessions();
    setSessions([]);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">📋 Interview History</h1>
        <p className="text-gray-400">Review your past interview sessions</p>
      </div>

      {sessions.length > 0 && (
        <div className="flex justify-end mb-4">
          <button onClick={handleClear} className="text-sm text-red-400 hover:text-red-300 transition-colors">
            Clear History
          </button>
        </div>
      )}

      {sessions.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <div className="text-4xl mb-4">🎯</div>
          <p>No interviews completed yet. Start your first one!</p>
          <a href="/" className="inline-block mt-4 px-6 py-2.5 bg-interview-accent text-white font-bold rounded-xl hover:bg-blue-600 transition-all">
            Start Interview
          </a>
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((session, i) => {
            const date = new Date(session.completedAt);
            const correct = session.results.filter((r) => r.evaluation.score >= 60).length;
            const finalDiff = session.difficultyProgression[session.difficultyProgression.length - 1];

            return (
              <div key={session.id} className="bg-interview-card border border-interview-border rounded-xl p-4 animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{MODE_EMOJIS[session.mode]}</span>
                    <div>
                      <div className="font-bold text-white">{MODE_LABELS[session.mode]}</div>
                      <div className="text-xs text-gray-500">
                        {date.toLocaleDateString()} at {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div
                        className="text-xl font-bold"
                        style={{ color: session.overallScore >= 75 ? "#22c55e" : session.overallScore >= 50 ? "#eab308" : "#ef4444" }}
                      >
                        {session.overallScore}
                      </div>
                      <div className="text-[10px] text-gray-500">Score</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-interview-accent">{correct}/{session.results.length}</div>
                      <div className="text-[10px] text-gray-500">Correct</div>
                    </div>
                    <span
                      className="text-[10px] uppercase px-2 py-0.5 rounded-full font-bold"
                      style={{ backgroundColor: `${DIFFICULTY_COLORS[finalDiff]}20`, color: DIFFICULTY_COLORS[finalDiff] }}
                    >
                      {finalDiff}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

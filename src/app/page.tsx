"use client";

import { useState } from "react";
import { InterviewMode, MODE_LABELS, MODE_EMOJIS } from "@/lib/types";
import { useRouter } from "next/navigation";

const MODES: { mode: InterviewMode; desc: string }[] = [
  { mode: "frontend", desc: "React, JavaScript, CSS, browser APIs, and web performance" },
  { mode: "backend", desc: "APIs, databases, security, distributed systems, and server architecture" },
  { mode: "system-design", desc: "Scalability, load balancing, caching, and designing large-scale systems" },
  { mode: "dsa", desc: "Arrays, trees, graphs, sorting, dynamic programming, and complexity analysis" },
];

export default function Home() {
  const [selected, setSelected] = useState<InterviewMode | null>(null);
  const router = useRouter();

  const startInterview = () => {
    if (selected) router.push(`/interview?mode=${selected}`);
  };

  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold mb-3 text-white">
          🎯 Interview Gauntlet
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Sharpen your technical interview skills with adaptive mock interviews.
          Questions get harder as you improve — just like the real thing.
        </p>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-bold text-white mb-4 text-center">Choose Your Domain</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MODES.map(({ mode, desc }) => (
            <button
              key={mode}
              onClick={() => setSelected(mode)}
              className={`p-5 rounded-xl border text-left transition-all duration-200 ${
                selected === mode
                  ? "border-interview-accent bg-interview-accent/10 shadow-lg shadow-interview-accent/10"
                  : "border-interview-border bg-interview-card hover:border-gray-600"
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{MODE_EMOJIS[mode]}</span>
                <div>
                  <h3 className={`font-bold text-lg ${selected === mode ? "text-interview-accent" : "text-white"}`}>
                    {MODE_LABELS[mode]}
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">{desc}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {selected && (
        <div className="text-center animate-fade-in">
          <div className="mb-4 p-4 rounded-xl bg-interview-card border border-interview-border inline-block">
            <div className="text-sm text-gray-400 mb-1">Interview Format</div>
            <div className="text-white">
              <span className="font-bold">7 questions</span> &middot; Adaptive difficulty &middot; Starts at <span className="text-yellow-400">Medium</span>
            </div>
          </div>
          <div>
            <button
              onClick={startInterview}
              className="px-8 py-3 bg-interview-accent text-white font-bold rounded-xl hover:bg-blue-600 transition-all text-lg"
            >
              Start Interview →
            </button>
          </div>
        </div>
      )}

      <div className="mt-16 grid grid-cols-3 gap-6 text-center">
        {[
          { icon: "📈", label: "Adaptive", desc: "Difficulty adjusts to your level in real-time" },
          { icon: "⏱️", label: "Timed", desc: "Practice under realistic time pressure" },
          { icon: "💡", label: "Feedback", desc: "Instant scoring with detailed improvement tips" },
        ].map((f) => (
          <div key={f.label} className="p-4">
            <div className="text-3xl mb-2">{f.icon}</div>
            <div className="font-bold text-white mb-1">{f.label}</div>
            <div className="text-sm text-gray-500">{f.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

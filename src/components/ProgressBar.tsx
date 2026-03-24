"use client";

interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex gap-1.5">
        {Array.from({ length: total }, (_, i) => (
          <div
            key={i}
            className={`w-8 h-1.5 rounded-full transition-all duration-300 ${
              i < current ? "bg-interview-accent" : i === current ? "bg-interview-accent animate-pulse-slow" : "bg-gray-700"
            }`}
          />
        ))}
      </div>
      <span className="text-xs text-interview-muted font-mono">
        {current + 1}/{total}
      </span>
    </div>
  );
}

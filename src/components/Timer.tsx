"use client";

import { useEffect, useState, useCallback } from "react";

interface TimerProps {
  totalSeconds: number;
  onTimeUp: () => void;
  isActive: boolean;
}

export default function Timer({ totalSeconds, onTimeUp, isActive }: TimerProps) {
  const [remaining, setRemaining] = useState(totalSeconds);

  useEffect(() => {
    setRemaining(totalSeconds);
  }, [totalSeconds]);

  const handleTimeUp = useCallback(() => {
    onTimeUp();
  }, [onTimeUp]);

  useEffect(() => {
    if (!isActive) return;
    if (remaining <= 0) {
      handleTimeUp();
      return;
    }
    const timer = setInterval(() => setRemaining((r) => r - 1), 1000);
    return () => clearInterval(timer);
  }, [isActive, remaining, handleTimeUp]);

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const pct = (remaining / totalSeconds) * 100;
  const color = pct > 50 ? "#3b82f6" : pct > 20 ? "#eab308" : "#ef4444";

  return (
    <div className="flex items-center gap-3">
      <div className="w-32 h-2 bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <span className="font-mono text-sm" style={{ color }}>
        {minutes}:{seconds.toString().padStart(2, "0")}
      </span>
    </div>
  );
}

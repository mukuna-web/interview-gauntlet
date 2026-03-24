import { InterviewSession } from "./types";

const STORAGE_KEY = "interview-gauntlet-history";

export function saveSession(session: InterviewSession): void {
  if (typeof window === "undefined") return;
  const existing = getSessions();
  existing.unshift(session);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing.slice(0, 50)));
}

export function getSessions(): InterviewSession[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function clearSessions(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

export function generateSessionId(): string {
  return `session-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

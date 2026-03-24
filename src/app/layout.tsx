import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Interview Gauntlet — AI Mock Technical Interview",
  description: "Practice technical interviews with adaptive difficulty and instant feedback",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-interview-bg">
        <nav className="border-b border-interview-border bg-interview-card/90 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2 group">
              <span className="text-xl">🎯</span>
              <span className="font-bold text-lg text-interview-accent group-hover:text-blue-400 transition-colors">
                Interview Gauntlet
              </span>
            </a>
            <div className="flex gap-1">
              <a href="/" className="px-3 py-1.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all">
                Practice
              </a>
              <a href="/history" className="px-3 py-1.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all">
                History
              </a>
            </div>
          </div>
        </nav>
        <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}

# Interview Gauntlet

AI-powered mock technical interview platform with adaptive difficulty and instant feedback.

## Features

- **4 Domains**: Frontend, Backend, System Design, Data Structures & Algorithms
- **Adaptive Difficulty**: Questions get harder as you answer correctly, easier if you struggle
- **Timed Questions**: Easy (3min), Medium (5min), Hard (8min)
- **Instant Feedback**: Keyword-based scoring with detailed improvement suggestions
- **Session Summary**: Overall score, difficulty progression chart, topic breakdown
- **Interview History**: Track your progress across sessions

## Tech Stack

- Next.js 14 (App Router)
- Tailwind CSS
- TypeScript
- localStorage for persistence

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How It Works

1. Choose a domain (Frontend, Backend, System Design, DSA)
2. Answer 7 questions under time pressure
3. Get scored on key concept coverage (0-100)
4. Difficulty adapts: 2 correct in a row → harder, 1 wrong → easier
5. Review your performance with detailed breakdowns

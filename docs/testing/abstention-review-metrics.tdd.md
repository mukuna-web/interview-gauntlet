# Abstention and review metrics TDD evidence

## User journeys

- As a practice user, insufficient evidence produces no score and cannot lower
  my session average or difficulty.
- As a reviewer, identity-only filler cannot move an answer across the evidence
  threshold.
- As an operator, aggregate CSV exposes abstention and review outcomes without
  exporting answers or reviewer identity.

## RED and GREEN evidence

The focused RED run executed 21 tests: 15 passed and six failed for the intended
missing behavior (null abstention score, identity-prefix invariance, adaptive
neutrality, missing session metrics, and the old CSV schema). After the minimal
implementation, the same focused target executed 23 tests and all passed.

| Guarantee | Test file | Result |
| --- | --- | --- |
| Abstention has a null score | `src/lib/evaluator.test.ts` | PASS |
| Identity-only prefix cannot satisfy minimum evidence | `src/lib/evaluator.test.ts` | PASS |
| Abstention preserves difficulty and correct-answer streak | `src/lib/adaptive.test.ts` | PASS |
| Overall score excludes abstentions and can be null | `src/lib/session-metrics.test.ts` | PASS |
| CSV includes aggregate scored/abstained/review metrics and excludes answer text | `src/lib/export.test.ts` | PASS |

## Full verification

- `npm run test:coverage`: 23 tests passed; 96.38% statements, 87.93% branches,
  100% functions, and 97.46% lines across all changed library modules.
- `npm run build`: Next.js production build and type checking passed.
- `npm audit --audit-level=high`: zero vulnerabilities.
- `node --check server.js`: portable launcher syntax passed.

# Interview Gauntlet

Interview Gauntlet is a local-first technical interview practice application. It uses a transparent, deterministic concept-coverage rubric—not a hosted AI model—to score practice answers, explain every calculation, adapt question difficulty, and let a human reviewer accept or flag each result.

## Why this project is useful

- Four practice domains: frontend, backend, system design, and data structures/algorithms.
- Explainable scores: `round(matched concepts / expected concepts × 100)` with matched and missed concepts shown.
- Insufficient-evidence abstention: answers below the minimum evidence threshold are not assigned a score and do not affect the session average or adaptive difficulty.
- Human review: named reviewers can accept a score or request a correction.
- Local analysis mode: answers and session history stay in the browser's `localStorage`; there is no analytics service or model API.
- Interactive history dashboard with CSV export and browser Print/PDF.
- Counterfactual tests verify that identity-like prefixes do not change the score.

This is an educational practice tool, not a hiring, admissions, or employment decision system. Keyword coverage is not a measurement of a person's ability. Do not use its output to rank or screen real candidates.

## Quick start

```bash
npm ci
npm run dev
```

Open <http://localhost:3000>. A production check is available with:

```bash
npm run verify
```

## Evaluation and review flow

1. The browser normalizes the answer and checks its word count.
2. A narrow leading `My name is …` identity phrase is removed before evidence and concept calculations. If the remaining answer contains fewer than five substantive words, the evaluator abstains.
3. Otherwise, each expected concept is matched using documented text variants.
4. The exact formula, evidence counts, matched concepts, and missed concepts are returned with the score.
5. A named human reviewer accepts the result or requests a correction. Abstained results are not reviewable as scored findings.

The adaptive interview moves upward after two strong responses and downward after a weak response. This affects practice sequencing only; it is not a validated assessment model.

## Exports and privacy

History can be exported as aggregate-only CSV or printed to PDF from the browser. CSV deliberately excludes answer text, reviewer notes, and identity data while including scored/abstained counts, review-decision counts, and a derivable finding-acceptance percentage. See [PRIVACY.md](PRIVACY.md) for the data boundary and deletion instructions.

## Documentation

- [Reviewer training guide](docs/REVIEWER_TRAINING.md)
- [Deployment runbook](docs/DEPLOYMENT_RUNBOOK.md)
- [Fairness and counterfactual tests](docs/FAIRNESS_AND_COUNTERFACTUALS.md)
- [Outcome metrics](docs/METRICS.md)
- [Security policy](SECURITY.md)

## Technology

Next.js 15, React 18, TypeScript, Tailwind CSS, and Vitest. There is no server-side database and no required API key.

## Limitations

- Concept matching can miss correct answers expressed with unexpected terminology.
- It can reward mentioning a concept without proving deep understanding.
- The five-word threshold is a product safeguard, not a psychometrically validated rule.
- Fairness tests cover selected counterfactuals and cannot establish fairness for every population or context.

## License

MIT. See [LICENSE](LICENSE).

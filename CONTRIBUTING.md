# Contributing

Use synthetic data only. Create a focused branch, add or update a test before changing evaluation behavior, and run:

```bash
npm ci
npm run verify
npm audit --audit-level=high
```

Evaluation changes must document their formula, evidence threshold, expected counterfactual behavior, and human-review implications. Do not add telemetry, remote persistence, or model calls without a threat model and privacy update.

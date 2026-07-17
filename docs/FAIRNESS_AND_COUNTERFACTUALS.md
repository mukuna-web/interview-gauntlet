# Fairness and counterfactual checks

The evaluator is deterministic and does not read a protected-attribute field. That does not make it automatically fair: spelling, phrasing, language fluency, and rubric coverage can still affect results.

Automated tests currently check that:

- an identity-like prefix added to otherwise identical technical evidence does not change evaluation status, evidence count, score, or matched concepts;
- insufficient evidence causes abstention rather than an invented score;
- every scored result exposes the exact numerator, denominator, and formula;
- abstained results cannot be approved as scored findings.

The current normalizer removes only a narrow leading `My name is …` phrase. It
does not attempt to infer demographic attributes or broadly rewrite a person's
language. Tests cover both scored answers and short answers near the abstention
boundary so identity-only filler cannot manufacture sufficient evidence.

Run the checks with `npm test`.

## Recommended expansion

Create paired synthetic answers that preserve technical content while varying names, pronouns, dialect-neutral phrasing, formatting, verbosity, and concept order. Compare status, score, matched concepts, and feedback. Any unexplained difference is a release blocker.

For a real study, predefine groups and success criteria, use consented data, report sample sizes and uncertainty, and involve qualified reviewers. These repository tests are engineering checks, not proof of legal or statistical fairness.

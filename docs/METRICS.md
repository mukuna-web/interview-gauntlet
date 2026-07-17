# Outcome metrics

Measure whether the tool improves a practice-review workflow without treating its score as ground truth.

| Metric | Definition | Collection method |
|---|---|---|
| Analysis time saved | Median manual rubric time minus median assisted review time | Time a synthetic/manual baseline and a separate assisted batch |
| Findings accepted by reviewers | Accepted scored findings divided by all reviewed scored findings | Aggregate CSV review counts; exclude abstentions |
| Abstention rate | Abstained answers divided by submitted answers | Aggregate status counts |
| Correction rate | Findings flagged for correction divided by reviewed findings | Aggregate review decisions |
| Reviewer agreement | Same decisions divided by double-reviewed synthetic findings | Periodic calibration set |
| Export success rate | Successful CSV/PDF checks divided by attempted checks | Release smoke-test log |

Do not collect raw answers merely to compute metrics. Prefer an offline, aggregate worksheet. Report the sample size and time window with every value. A high acceptance rate is not automatically good: it may indicate reviewer automation bias, so audit a random accepted sample.

The history CSV includes `reviewed_findings`, `accepted_findings`,
`changes_requested_findings`, `pending_review_findings`, and
`finding_acceptance_rate_percent`. It also separates scored and abstained
questions. Analysis-time-saved still requires a separately timed manual and
assisted run of the same synthetic task; the application does not fabricate or
silently collect that measurement.

Suggested initial targets for a demo are at least 90% reviewer agreement on a synthetic calibration set, 100% export smoke-test success, and zero unexplained counterfactual score differences. These are operating targets, not validated performance claims.

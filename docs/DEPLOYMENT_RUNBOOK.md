# Deployment runbook

## Supported modes

The recommended mode is local development or a static/private demo. No server-side persistence is required. A hosted deployment must use HTTPS and should remain telemetry-free unless the privacy notice is deliberately revised.

## Pre-deployment

```bash
npm ci
npm run verify
npm audit --audit-level=high
```

Confirm that no secrets, real candidate records, generated exports, or `.env` files are committed. Review dependency alerts and the privacy notice.

## Deploy

1. Build with `npm run build`.
2. Deploy the resulting Next.js application using a supported Node runtime.
3. Keep all evaluation in the browser; do not add a collection endpoint by accident.
4. Verify the home, interview, results, and history routes.
5. Verify CSV and Print/PDF from a non-production synthetic session. Confirm the
   CSV separates scored and abstained questions and exposes aggregate review
   counts without answer text or reviewer identity.

## Rollback

Retain the previous known-good artifact or commit. If a deployment fails its smoke test, route traffic back to the previous artifact, record the failed version, and preserve logs that contain no answer text.

## Incident response

If a deployment begins collecting or exposing user content, disable it, preserve minimal evidence, notify affected operators, delete unintended copies where possible, and document the scope and corrective action. Do not put answer text into incident tickets unless access is restricted and necessary.

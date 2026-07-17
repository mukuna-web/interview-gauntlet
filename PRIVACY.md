# Privacy

Interview Gauntlet is local-first. Questions, answer evaluations, review state, and history are processed in the browser. The application does not include telemetry, advertising trackers, a remote database, or a model API.

## Data boundaries

- Session history is stored in the browser's `localStorage` on the current device.
- CSV export contains only session ID, practice mode, nullable aggregate score, question/scored/abstained counts, aggregate review-decision counts, finding acceptance percentage, and timestamps.
- CSV excludes answer text, matched concepts, reviewer names, reviewer notes, and profile attributes.
- Print/PDF is performed by the browser. The destination and retention policy are controlled by the user.

Do not enter real candidate data, secrets, health information, or other sensitive personal data. This project is not designed for real hiring decisions.

## Deletion

Use the history screen's clear control, clear site data in the browser, or remove the site's `localStorage`. Delete any exported CSV/PDF files separately.

## Deployment checklist

Deploy without analytics by default. If a deployer adds monitoring, authentication, cloud storage, or third-party scripts, the deployer must document the new data flow, define retention and deletion, obtain appropriate consent, and update this notice before collecting data.

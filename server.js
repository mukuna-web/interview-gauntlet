const { spawnSync } = require("node:child_process");

const port = Number.parseInt(process.env.PORT || "4201", 10);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("PORT must be an integer between 1 and 65535");
}

const nextBinary = require.resolve("next/dist/bin/next");
const result = spawnSync(
  process.execPath,
  [nextBinary, "dev", "-p", String(port)],
  { cwd: __dirname, stdio: "inherit" },
);

if (result.error) throw result.error;
process.exitCode = result.status ?? 1;

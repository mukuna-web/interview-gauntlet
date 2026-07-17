export default {
  test: {
    include: ["src/**/*.test.ts"],
    coverage: {
      provider: "v8",
      include: [
        "src/lib/adaptive.ts",
        "src/lib/evaluator.ts",
        "src/lib/export.ts",
        "src/lib/session-metrics.ts",
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        statements: 80,
        branches: 80,
      },
    },
  },
};

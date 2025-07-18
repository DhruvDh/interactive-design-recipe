import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    // Exclude E2E test files from Vitest
    exclude: ['**/node_modules/**', '**/tests/e2e/**'],
  },
  worker: {
    format: "es",
  },
});

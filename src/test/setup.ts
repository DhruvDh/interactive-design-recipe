// Test setup file
import { beforeAll } from "vitest";
import "@testing-library/jest-dom";

// Mock crypto for test environment
if (!globalThis.crypto) {
  Object.defineProperty(globalThis, "crypto", {
    value: {
      randomUUID: () => Math.random().toString(36).substr(2, 9),
    },
    writable: true,
    configurable: true,
  });
}

beforeAll(() => {
  // Test environment setup
});
